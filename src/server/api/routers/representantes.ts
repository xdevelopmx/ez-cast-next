import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
	createTRPCRouter,
	protectedProcedure,
	publicProcedure,
} from "~/server/api/trpc";
import type { Cazatalentos, Proyecto, Talentos } from "@prisma/client";
import { FileManager } from "~/utils/file-manager";
import { TipoUsuario } from "~/enums";
import Constants from "~/constants";
import dayjs from "dayjs";

export const RepresentantesRouter = createTRPCRouter({
	getAll: protectedProcedure
		.query(async ({ ctx }) => {
			return await ctx.prisma.representante.findMany();
		}
	),
	getInfoBasica: protectedProcedure
		.query(async ({ctx}) => {
			const user = ctx.session.user; 
			if (user && user.tipo_usuario === TipoUsuario.REPRESENTANTE) {

				const representante = await ctx.prisma.representante.findFirst({
					where: {
						id: parseInt(user.id)
					},
					include: {
						info_basica: {
							include: {
								media: true,
								estado_republica: true,
								union: {
									include: {
										union: true
									}
								}
							}
						},
						redes_sociales: true
					}
				})

				return representante;
			}	
		}
	),
	saveMediaInfoBasica: protectedProcedure
		.input(z.object({
			cv_url: z.string().nullish(),
			cv: z.object({
				nombre: z.string(),
				type: z.string(),
				url: z.string(),
				clave: z.string(),
				referencia: z.string(),
				identificador: z.string()
			}).nullish()
		}))
		.mutation(async ({ input, ctx }) => {
			const user = ctx.session.user; 
			if (user && user.tipo_usuario === TipoUsuario.REPRESENTANTE) {

				const info_gral = await ctx.prisma.infoBasicaRepresentante.findFirst({
					where: {
						id_representante: parseInt(user.id)
					}
				});
	
				if (info_gral) {
					if (input.cv) {
						if (info_gral.id_media_cv) {
							const cv = await ctx.prisma.media.findFirst({
								where: {
									id: info_gral.id_media_cv
								}
							});
							if (cv) {
								await FileManager.deleteFiles([cv.clave])
							}
							await ctx.prisma.media.delete({
								where: {
									id: info_gral.id_media_cv
								}
							})
						}
						const media_cv_saved = await ctx.prisma.media.create({
							data: {
								nombre: input.cv.nombre,
								type: input.cv.type,
								url: input.cv.url,
								clave: input.cv.clave,
								referencia: input.cv.referencia,
								identificador: input.cv.identificador
							}
						});
	
						if (media_cv_saved) {
							return media_cv_saved.id;
						}
					} else {
						if (input.cv_url) {
							return info_gral.id_media_cv;
						} else {
							if (info_gral.id_media_cv) {
								const cv = await ctx.prisma.media.findFirst({
									where: {
										id: info_gral.id_media_cv
									}
								});
								if (cv) {
									await FileManager.deleteFiles([cv.clave])
								}
								await ctx.prisma.media.delete({
									where: {
										id: info_gral.id_media_cv
									}
								})
							}
						}
					}
				}
				return null;
			}
			throw new TRPCError({
				code: 'UNAUTHORIZED',
				message: 'Solo el rol de representante puede actualizar la info basica',
			});
		}
	),
	saveInfoBasica: protectedProcedure
		.input(z.object({
			nombre: z.string(),
			apellido: z.string(),
			sindicato: z.object({
				id: z.number(),
				descripcion: z.string().nullish()
			}),
			ubicacion: z.object({
				id_estado_republica: z.number(),
				direccion: z.string(),
				cp: z.number().min(10000).max(99999)
			}),
			biografia: z.string(),
			id_media_cv: z.number().nullish(),
			redes_sociales: z.array(z.object({
				nombre: z.string(),
				url: z.string()
			})).nullish()
		}))
		.mutation(async ({ input, ctx }) => {
			console.log(input);
			const user = ctx.session.user; 
			if (user && user.tipo_usuario === TipoUsuario.REPRESENTANTE) {
				const representante = await ctx.prisma.representante.update({
					where: {
						id: parseInt(user.id)
					},
					data: {
						nombre: input.nombre,
						apellido: input.apellido,
						biografia: input.biografia
					}
				})


				const info = await ctx.prisma.infoBasicaRepresentante.upsert({
					where: {
						id_representante: representante.id
					},
					update: {
						id_estado_republica: input.ubicacion.id_estado_republica,
						direccion: input.ubicacion.direccion,
						cp: input.ubicacion.cp,
						id_media_cv: input.id_media_cv,
					},
					create: {
						id_estado_republica: input.ubicacion.id_estado_republica,
						direccion: input.ubicacion.direccion,
						cp: input.ubicacion.cp,
						id_media_cv: input.id_media_cv,
						id_representante: representante.id,
					}
				})

				if (info) {
					const union = await ctx.prisma.unionPorInfoBasicaRepresentante.upsert({
						where: {
							id_info_basica_representante: info.id
						},
						update: {
							id_union: input.sindicato.id,
							descripcion: input.sindicato.descripcion
						},
						create: {
							id_union: input.sindicato.id,
							descripcion: input.sindicato.descripcion,
							id_info_basica_representante: info.id
						}
					})

					if (!union) {
						throw new TRPCError({
							code: 'INTERNAL_SERVER_ERROR',
							message: 'Ocurrio un error al tratar de guardar la union del representante',
							// optional: pass the original error to retain stack trace
							//cause: theError,
						});
					}

					const deleted_redes_sociales = await ctx.prisma.redesSocialesPorRepresentante.deleteMany({
						where: {
							id_representante: info.id_representante
						}
					});
		
					if (!deleted_redes_sociales) {
						throw new TRPCError({
							code: 'INTERNAL_SERVER_ERROR',
							message: 'Ocurrio un error al tratar de eliminar las redes sociales del representante',
							// optional: pass the original error to retain stack trace
							//cause: theError,
						});
					}
		
					if (input.redes_sociales) {
						if (Object.keys(input.redes_sociales).length > 0) {
							const saved_redes_sociales = await ctx.prisma.redesSocialesPorRepresentante.createMany({
								data: input.redes_sociales.map(red => {
									return { nombre: red.nombre, url: red.url, id_representante: info.id_representante }
								})
							})
							if (!saved_redes_sociales) {
								throw new TRPCError({
									code: 'INTERNAL_SERVER_ERROR',
									message: 'Ocurrio un error al tratar de guardar las redes sociales del representante',
									// optional: pass the original error to retain stack trace
									//cause: theError,
								});
							}
						}
					}
				}
				return info;
			}
			throw new TRPCError({
				code: 'UNAUTHORIZED',
				message: 'Solo el rol de representante puede actualizar la info basicax',
			});
		}
	),
	savePermisos: protectedProcedure
		.input(z.object({
			puede_aceptar_solicitudes: z.object({
				representante: z.boolean(),
				talentos: z.boolean(),
			}),
			puede_editar_perfil: z.object({
				representante: z.boolean(),
				talentos: z.boolean()
			})
		}))
		.mutation(async ({ input, ctx }) => {
			console.log(input);
			const user = ctx.session.user; 
			if (user && user.tipo_usuario === TipoUsuario.REPRESENTANTE) {
				const permisos = await ctx.prisma.permisosRepresentante.upsert({
					where: {
						id_representante: parseInt(user.id)
					},
					update: {
						puede_aceptar_solicitudes_representante: input.puede_aceptar_solicitudes.representante,
						puede_aceptar_solicitudes_talento: input.puede_aceptar_solicitudes.talentos,
						puede_editar_perfil_representante: input.puede_editar_perfil.representante,
						puede_editar_perfil_talento: input.puede_editar_perfil.talentos
					},
					create: {
						puede_aceptar_solicitudes_representante: input.puede_aceptar_solicitudes.representante,
						puede_aceptar_solicitudes_talento: input.puede_aceptar_solicitudes.talentos,
						puede_editar_perfil_representante: input.puede_editar_perfil.representante,
						puede_editar_perfil_talento: input.puede_editar_perfil.talentos,
						id_representante: parseInt(user.id)
					}
				})
				return permisos;
			}
			throw new TRPCError({
				code: 'UNAUTHORIZED',
				message: 'Solo el rol de representante puede actualizar la info basicax',
			});
		}
	),
	assignTalento: protectedProcedure
		.input(z.object({
			id_talento: z.number(),
		}))
		.mutation(async ({ input, ctx }) => {
			const user = ctx.session.user; 
			if (user && user.tipo_usuario === TipoUsuario.REPRESENTANTE) {
				return await ctx.prisma.talentosRepresentados.create({
					data: {
						id_representante: parseInt(user.id),
						id_talento: input.id_talento,
						hora_asignacion: dayjs().toDate()
					}
				})
			}
			throw new TRPCError({
				code: 'UNAUTHORIZED',
				message: 'Solo el rol de representante puede asignarse un talento',
				// optional: pass the original error to retain stack trace
				//cause: theError,
			});
		}
	),
	sendInvitation: protectedProcedure
		.input(z.object({
			to: z.string(),
			subject: z.string(),
			from: z.string(),
			data: z.any()
		}))
		.mutation(async ({ input, ctx }) => {
			
			let response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/email/send`, {
				method: "POST",
				body: JSON.stringify({
					"type": Constants.TIPOS_EMAILS.INVITACION_TALENTO,
					"to": input.to,
					"subject": input.subject,
					"from": input.from,
					"data": input.data as {[key: string]: string}
				})
			});

			return response.status === 200;
		}
	),

});