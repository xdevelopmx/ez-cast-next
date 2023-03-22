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

export const TalentosRouter = createTRPCRouter({
    getAll: publicProcedure
		.query(async ({ ctx }) => {
			return await ctx.prisma.talentos.findMany();
		}
	),
	getById: publicProcedure
		.input(z.object({ id: z.number() }))
		.query(async ({ input, ctx }) => {
			return await ctx.prisma.talentos.findUnique({
				where: {id: input.id}
			});
		}
	),
  	saveInfoGral: protectedProcedure
    	.input(z.object({ 
			nombre: z.string(),
			union: z.object({
				id: z.number(),
				descripcion: z.string().nullish()
			}),
			id_estado_republica: z.number(),
			edad: z.number(),
			peso: z.number(),
			altura: z.number(),
			biografia: z.string(),
			files: z.object({
				carta_responsiva: z.object({
					base64: z.string(),
					extension: z.string()
				}).nullish(),
				cv: z.object({
					base64: z.string(),
					extension: z.string()
				}).nullish()
			}),
			representante: z.object({
				nombre: z.string().min(2),
				email: z.string().email(),
				agencia: z.string().min(2),
				telefono: z.string().min(10).max(10)
			}).nullish(),
			redes_sociales: z.object({
				nombre: z.string(),
				url: z.string()
			}).nullish()
		}))
		.mutation(async ({ input, ctx }) => {
			const user = ctx.session.user; 
			if (user && user.tipo_usuario === TipoUsuario.TALENTO) {

				if (input.edad > 17 && input.representante) {
					throw new TRPCError({
						code: 'PRECONDITION_FAILED',
						message: 'El representante solo se debe agregar cuando se es menor de edad',
						// optional: pass the original error to retain stack trace
						//cause: theError,
					});
				}

				if (input.edad < 18 && (!input.files.carta_responsiva || !input.representante)) {
					throw new TRPCError({
						code: 'PRECONDITION_FAILED',
						message: 'Si se es menor de edad la carta responsiva y el representante son obligatorios',
						// optional: pass the original error to retain stack trace
						//cause: theError,
					});
				}

				let file_path: string | null = null;
				if (input.files.carta_responsiva) {
					const save_result = await FileManager.saveFile(`cv.${input.files.carta_responsiva.extension}`, input.files.carta_responsiva.base64, `talentos/${user.id}/info-gral/cv/`);
					if (!save_result.error) {
						file_path = save_result.result;
					}
				}

				const info_gral = await ctx.prisma.infoBasicaPorTalentos.upsert({
					where: {
						id_talento: parseInt(user.id)
					},
					update: {
						edad: input.edad,
						peso: input.peso,
						altura: input.altura,
						biografia: input.biografia,
						id_union_por_talento: input.union.id,
						id_estado_republica: input.id_estado_republica,
						url_cv: file_path
					},
					create: {
						edad: input.edad,
						peso: input.peso,
						altura: input.altura,
						biografia: input.biografia,
						id_union_por_talento: input.union.id,
						id_estado_republica: input.id_estado_republica,
						url_cv: file_path,
						id_talento: parseInt(user.id)
					},
				});

				if (!info_gral) {
					throw new TRPCError({
						code: 'INTERNAL_SERVER_ERROR',
						message: 'Ocurrio un error al tratar de guardar la info general del talento',
						// optional: pass the original error to retain stack trace
						//cause: theError,
					});
				}

				const union_por_talento = await ctx.prisma.unionPorInfoBasicaTalento.upsert({
					where: {
						id_info_basica_por_talentos: info_gral.id
					},
					update: {
						id_union: input.union.id,
						descripcion: (input.union.id === 99) ? input.union.descripcion : null
					},
					create: {
						id_union: input.union.id,
						descripcion: (input.union.id === 99) ? input.union.descripcion : null,
						id_info_basica_por_talentos: info_gral.id
					},
				});

				if (!union_por_talento) {
					throw new TRPCError({
						code: 'INTERNAL_SERVER_ERROR',
						message: 'Ocurrio un error al tratar de guardar la union del talento',
						// optional: pass the original error to retain stack trace
						//cause: theError,
					});
				}

				const deleted_redes_sociales = await ctx.prisma.redesSocialesPorTalentos.deleteMany({
					where: { 
						id_talento: parseInt(user.id)
					}
				});

				if (!deleted_redes_sociales) {
					throw new TRPCError({
						code: 'INTERNAL_SERVER_ERROR',
						message: 'Ocurrio un error al tratar de eliminar las redes sociales del talento',
						// optional: pass the original error to retain stack trace
						//cause: theError,
					});
				}

				if (input.redes_sociales) {
					if (Object.keys(input.redes_sociales).length > 0) {
						const saved_redes_sociales = await ctx.prisma.redesSocialesPorTalentos.createMany({
							data: Object.entries(input.redes_sociales).map((v, i) => { 
								return { nombre: v[0], url: v[1], id_talento: parseInt(user.id)} 
							})
						})
						if (!saved_redes_sociales) {
							throw new TRPCError({
								code: 'INTERNAL_SERVER_ERROR',
								message: 'Ocurrio un error al tratar de guardar las redes sociales del talento',
								// optional: pass the original error to retain stack trace
								//cause: theError,
							});
						}
					}
				}

				if (input.representante) {
					let file_path: string | null = null;
					if (input.files.carta_responsiva) {
						const save_result = await FileManager.saveFile(`carta-responsiva.${input.files.carta_responsiva.extension}`, input.files.carta_responsiva.base64, `talentos/${user.id}/info-gral/carta-responsiva/`);
						if (!save_result.error) {
							file_path = save_result.result;
						}
					}

					const saved_representante = await ctx.prisma.representantesPorTalentos.upsert({
						where: {
							id_talento: parseInt(user.id)
						},
						update: {
							url_carta_responsiva: file_path,
							nombre: input.representante.nombre,
							agencia: input.representante.agencia,
							email: input.representante.email,
							telefono: input.representante.telefono
						},
						create: {
							nombre: input.representante.nombre,
							agencia: input.representante.agencia,
							email: input.representante.email,
							telefono: input.representante.telefono,
							url_carta_responsiva: file_path,
							id_talento: parseInt(user.id)
						},
					});
	
					if (!saved_representante) {
						throw new TRPCError({
							code: 'INTERNAL_SERVER_ERROR',
							message: 'Ocurrio un error al tratar de guardar el representante del talento',
							// optional: pass the original error to retain stack trace
							//cause: theError,
						});
					}
				}
				return info_gral;
			}
			throw new TRPCError({
				code: 'UNAUTHORIZED',
				message: 'Solo el rol de talento puede modificar la informacion general',
				// optional: pass the original error to retain stack trace
				//cause: theError,
			});
		}
	),
});