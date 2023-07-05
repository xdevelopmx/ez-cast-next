import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
	createTRPCRouter,
	protectedProcedure,
	publicProcedure,
} from "~/server/api/trpc";
import type { Cazatalentos, Proyecto, Talentos } from "@prisma/client";
import { FileManager } from "~/utils/file-manager";
import { TipoMensajes, TipoUsuario } from "~/enums";
import Constants from "~/constants";
import dayjs from "dayjs";

export const RepresentantesRouter = createTRPCRouter({
	getAll: protectedProcedure
		.query(async ({ ctx }) => {
			return await ctx.prisma.representante.findMany();
		}
	),
	getInfo: protectedProcedure
		.input(z.number().nullish())
		.query(async ({input, ctx}) => {
			const user = ctx.session.user; 
			const id = (input) ? input : parseInt(user.id);
			const representante = await ctx.prisma.representante.findFirst({
				where: {
					id: id
				},
				include: {
					foto_perfil: true,
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
					permisos: true,
					validacion: {
						include: {
							media: true,
							directores: true
						}
					},
					redes_sociales: true
				}
			})

			return representante;
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
				message: 'Solo el rol de representante puede actualizar los permisos',
			});
		}
	),
	saveMediaValidacion: protectedProcedure
		.input(z.object({
			licencia_url: z.string().nullish(),
			licencia: z.object({
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

				const validacion = await ctx.prisma.validacionRepresentante.findFirst({
					where: {
						id_representante: parseInt(user.id)
					}
				});
	
				if (validacion) {
					if (input.licencia) {
						if (validacion.id_media_copia_licencia) {
							const lic = await ctx.prisma.media.findFirst({
								where: {
									id: validacion.id_media_copia_licencia
								}
							});
							if (lic) {
								await FileManager.deleteFiles([lic.clave])
							}
							await ctx.prisma.media.delete({
								where: {
									id: validacion.id_media_copia_licencia
								}
							})
						}
						const media_lic_saved = await ctx.prisma.media.create({
							data: {
								nombre: input.licencia.nombre,
								type: input.licencia.type,
								url: input.licencia.url,
								clave: input.licencia.clave,
								referencia: input.licencia.referencia,
								identificador: input.licencia.identificador
							}
						});
	
						if (media_lic_saved) {
							return media_lic_saved.id;
						}
					} else {
						if (input.licencia_url) {
							return validacion.id_media_copia_licencia;
						} else {
							if (validacion.id_media_copia_licencia) {
								const lic = await ctx.prisma.media.findFirst({
									where: {
										id: validacion.id_media_copia_licencia
									}
								});
								if (lic) {
									await FileManager.deleteFiles([lic.clave])
								}
								await ctx.prisma.media.delete({
									where: {
										id: validacion.id_media_copia_licencia
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
				message: 'Solo el rol de representante puede actualizar la validacion',
			});
		}
	),
	saveValidacion: protectedProcedure
		.input(z.object({
			id_media_licencia: z.number().nullish(),
			numero_clientes: z.number(),
			IMDB_pro_link: z.string().nullish(),
			directores_casting: z.array(z.object({
				nombre: z.string(), 
				apellido: z.string(),
				correo_electronico: z.string(),
				telefono: z.string()
			})),
		}))
		.mutation(async ({ input, ctx }) => {
			console.log(input);
			const user = ctx.session.user; 
			if (user && user.tipo_usuario === TipoUsuario.REPRESENTANTE) {
				const validacion = await ctx.prisma.validacionRepresentante.upsert({
					where: {
						id_representante: parseInt(user.id)
					},
					update: {
						id_media_copia_licencia: input.id_media_licencia,
						numero_clientes: input.numero_clientes,
						imdb_pro_link: `${input.IMDB_pro_link}`
					},
					create: {
						id_media_copia_licencia: input.id_media_licencia,
						numero_clientes: input.numero_clientes,
						imdb_pro_link: `${input.IMDB_pro_link}`,
						id_representante: parseInt(user.id)
					}
				})
				await ctx.prisma.directoresCastingValidacionRepresentante.deleteMany({
					where: {
						id_validacion: validacion.id
					}
				});
				const directores = await ctx.prisma.directoresCastingValidacionRepresentante.createMany({
					data: input.directores_casting.map(d => {
						return {...d, id_validacion: validacion.id}
					})
				})

				return {validacion: validacion, directores: directores};
			}
			throw new TRPCError({
				code: 'UNAUTHORIZED',
				message: 'Solo el rol de representante puede actualizar la validacion',
			});
		}
	),
	updatePerfil: protectedProcedure
		.input(z.object({
			foto_perfil: z.object({
				nombre: z.string(),
				type: z.string(),
				url: z.string(),
				clave: z.string(),
				referencia: z.string(),
				identificador: z.string()
			}).nullish(),
			nombre: z.string().nullish(),
			biografia: z.string({
				errorMap: (issue, _ctx) => {
					switch (issue.code) {
						case 'too_big':
							return { message: 'El maximo de caracteres permitido es 500' };
						default:
							return { message: 'Formato de biografia invalido' };
					}
				},
			}).max(500).nullish(),
			redes_sociales: z.array(z.object({
				nombre: z.string(),
				url: z.string()
			})).nullish()
		}))
		.mutation(async ({ input, ctx }) => {
			const user = ctx.session.user; 
			if (user && user.tipo_usuario === TipoUsuario.REPRESENTANTE) {

				if (input.foto_perfil) {
					const foto_perfil = await ctx.prisma.media.findFirst({
						where: {
							identificador: `foto-perfil-representante-${user.id}`
						}
					})
					if (foto_perfil) {
						const result_delete = await FileManager.deleteFiles([foto_perfil.clave]);
						if (!result_delete.status) {
							throw new TRPCError({
								code: 'INTERNAL_SERVER_ERROR',
								message: `Ocurrio un error al tratar de actualizar la foto de perfil del representante [${result_delete.error}]`,
							});
						}
					}
					const saved_foto_perfil = await ctx.prisma.media.upsert({
						where: {
							id: (foto_perfil) ? foto_perfil.id : 0,
						},
						update: input.foto_perfil,
						create: input.foto_perfil
					})

					await ctx.prisma.representante.update({
						where: {
							id: parseInt(user.id)
						},
						data: {
							id_foto_perfil_media: saved_foto_perfil.id
						}
					})
				}
	
				if (input.nombre && input.biografia) {

					const representante = await ctx.prisma.representante.update({
						where: { id: parseInt(user.id) },
						data: {
							nombre: input.nombre,
							biografia: input.biografia,
						}
					})
		
					if (!representante) {
						throw new TRPCError({
							code: 'INTERNAL_SERVER_ERROR',
							message: 'Ocurrio un error al tratar de actualizar el nombre y biografia del representante'
						});
					}
				}

				if (input.redes_sociales) {

					const deleted_redes_sociales = await ctx.prisma.redesSocialesPorRepresentante.deleteMany({
						where: { id: parseInt(user.id) }
					});
		
					if (!deleted_redes_sociales) {
						throw new TRPCError({
							code: 'INTERNAL_SERVER_ERROR',
							message: 'Ocurrio un error al tratar de eliminar las redes sociales del representante',
						});
					}
		
					if (input.redes_sociales.length > 0) {
						if (Object.keys(input.redes_sociales).length > 0) {
							const saved_redes_sociales = await ctx.prisma.redesSocialesPorRepresentante.createMany({
								data: input.redes_sociales.map(red => {
									return { nombre: red.nombre, url: red.url, id_representante: parseInt(user.id) }
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
	
				return true;
			}
			throw new TRPCError({
				code: 'UNAUTHORIZED',
				message: 'Solo el rol de representante puede actualizar el perfil',
			});
	}),
	getTalentosAsignados: protectedProcedure
		.query(async ({ ctx }) => {
			const user = ctx.session.user; 
			if (user && user.tipo_usuario === TipoUsuario.REPRESENTANTE) {
				const talentos = await ctx.prisma.talentosRepresentados.findMany({
					where: {
						id_representante: parseInt(user.id)
					},
					include: {
						talento: {
							include: {
								media: {
									include: {
										media: true
									}
								},
								aplicaciones: true
							}
						}
					}
				})
				return talentos;
			}
			throw new TRPCError({
				code: 'UNAUTHORIZED',
				message: 'Solo el rol de representante puede obtener las asignaciones',
			});
	}),
	removeTalento: protectedProcedure
		.input(z.object({
			id_talento: z.number(),
		}))
		.mutation(async ({ input, ctx }) => {
			const user = ctx.session.user; 
			if (user && user.tipo_usuario === TipoUsuario.REPRESENTANTE) {
				return await ctx.prisma.talentosRepresentados.deleteMany({
					where: {
						id_representante: parseInt(user.id),
						id_talento: input.id_talento
					}
				})
			}
			throw new TRPCError({
				code: 'UNAUTHORIZED',
				message: 'Solo el rol de representante puede remover un talento',
				// optional: pass the original error to retain stack trace
				//cause: theError,
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
				const result =  await ctx.prisma.talentosRepresentados.create({
					data: {
						id_representante: parseInt(user.id),
						id_talento: input.id_talento,
						hora_asignacion: dayjs().toDate()
					}
				})
				if (result) {

					let conversacion = await ctx.prisma.conversaciones.findFirst({
						where: {
							id_emisor: parseInt(user.id),
							tipo_usuario_emisor: TipoUsuario.REPRESENTANTE,
							id_receptor: input.id_talento,
							tipo_usuario_receptor: TipoUsuario.TALENTO
						}
					});
					if (!conversacion) {
						conversacion = await ctx.prisma.conversaciones.findFirst({
							where: {
								id_emisor: input.id_talento,
								tipo_usuario_emisor: TipoUsuario.TALENTO,
								id_receptor: parseInt(user.id),
								tipo_usuario_receptor: TipoUsuario.REPRESENTANTE
							}
						});
					}
					if (!conversacion) {
						conversacion = await ctx.prisma.conversaciones.create({
							data: {
								emisor_perfil_url: `/representante/dashboard?id_representante=${user.id}`,
								receptor_perfil_url: `/talento/dashboard?id_talento=${input.id_talento}`,
								id_emisor: parseInt(user.id),
								tipo_usuario_emisor: TipoUsuario.REPRESENTANTE,
								id_receptor: input.id_talento,
								tipo_usuario_receptor: TipoUsuario.TALENTO,
							}
						})
					}
					if (conversacion) {
						await ctx.prisma.mensaje.create({
							data: {
								id_conversacion: conversacion.id,
								id_emisor: parseInt(user.id),
								tipo_usuario_emisor: TipoUsuario.REPRESENTANTE,
								id_receptor: input.id_talento,
								tipo_usuario_receptor: TipoUsuario.TALENTO,
								visto: false,
								hora_envio: dayjs().toDate(),
								mensaje: JSON.stringify({
									message: `El representante ${user.name}, te ha agregado como talento.`
								}),
								type: TipoMensajes.TEXT
							}
						})
					}
				}
				return result;
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