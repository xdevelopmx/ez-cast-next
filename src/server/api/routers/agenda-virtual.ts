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

export const AgendaVirtualRouter = createTRPCRouter({
    getAllProyectosByCazatalentosWithHorarioAgenda: protectedProcedure
		.query(async ({ ctx }) => {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
			if (ctx.session && ctx.session.user && ctx.session.user.tipo_usuario === TipoUsuario.CAZATALENTOS) {
				const proyectos = await ctx.prisma.proyecto.findMany({
					where: {
						id_cazatalentos: parseInt(ctx.session.user.id)
					},
					include: {
						horario_agenda: true,
						rol: {
							include: {
								casting: true
							}
						}
					}
				});
				return proyectos;
			}
			throw new TRPCError({
				code: 'UNAUTHORIZED',
				message: 'Solo el rol de cazatalentos puede obtener los proyectos',
				// optional: pass the original error to retain stack trace
				//cause: theError,
			});
		}
	),
	getAllHorarioAgendaByCazatalento: protectedProcedure
		.query(async ({ ctx }) => {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
			if (ctx.session && ctx.session.user && ctx.session.user.tipo_usuario === TipoUsuario.CAZATALENTOS) {
				const horarios = await ctx.prisma.horarioAgenda.findMany({
					where: {
						proyecto: {
							id_cazatalentos: parseInt(ctx.session.user.id)
						}
					},
					include: {
						proyecto: {
							include: {
								rol: {
									select: {
										id: true
									}
								}
							}
						}
					}
				});
				return horarios;
			}
			throw new TRPCError({
				code: 'UNAUTHORIZED',
				message: 'Solo el rol de cazatalentos puede obtener los proyectos',
				// optional: pass the original error to retain stack trace
				//cause: theError,
			});
		}
	),
	getHorarioAgendaById: protectedProcedure
		.input(z.number())
		.query(async ({ input, ctx }) => {
			if (input <= 0) return null;
 			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
			if (ctx.session && ctx.session.user && ctx.session.user.tipo_usuario === TipoUsuario.CAZATALENTOS) {
				const horarios = await ctx.prisma.horarioAgenda.findFirst({
					where: {
						id: input
					},
					include: {
						fechas: true,
						localizaciones: true,
						proyecto: {
							include: {
								rol: {
									select: {
										id: true
									}
								}
							}
						}
					}
				});
				return horarios;
			}
			throw new TRPCError({
				code: 'UNAUTHORIZED',
				message: 'Solo el rol de cazatalentos puede obtener los proyectos',
				// optional: pass the original error to retain stack trace
				//cause: theError,
			});
		}
	),
	deleteById: protectedProcedure
		.input(z.number())
		.mutation(async ({ input, ctx }) => {
			const user = ctx.session.user; 
			if (user && user.tipo_usuario === TipoUsuario.CAZATALENTOS) {
				const horario = await ctx.prisma.horarioAgenda.delete({
					where: {
						id: input
					}
				})
				
				if (!horario) {
					throw new TRPCError({
						code: 'INTERNAL_SERVER_ERROR',
						message: 'Ocurrio un problema al tratar de eliminar el horario',
						// optional: pass the original error to retain stack trace
						//cause: theError,
					});
				}

				const deleted_locaciones = await ctx.prisma.localizacionesPorHorarioAgenda.deleteMany({
					where: {
						id_horario_agenda: input
					}
				})

				if (!deleted_locaciones) {
					throw new TRPCError({
						code: 'INTERNAL_SERVER_ERROR',
						message: 'Ocurrio un problema al tratar de eliminar las locaciones del horario',
						// optional: pass the original error to retain stack trace
						//cause: theError,
					});
				}

				const deleted_fechas_horarios = await ctx.prisma.fechasPorHorarioAgenda.deleteMany({
					where: {
						id_horario_agenda: input
					}
				})

				if (!deleted_fechas_horarios) {
					throw new TRPCError({
						code: 'INTERNAL_SERVER_ERROR',
						message: 'Ocurrio un problema al tratar de eliminar las fechas del horario',
						// optional: pass the original error to retain stack trace
						//cause: theError,
					});
				}
				return horario;
			}
			throw new TRPCError({
				code: 'UNAUTHORIZED',
				message: 'Solo el rol de cazatalento puede eliminar horarios',
				// optional: pass the original error to retain stack trace
				//cause: theError,
			});
		}
	),
	create: protectedProcedure
		.input(z.object({
			locaciones: z.array(z.object({
				direccion: z.string(),
				direccion2: z.string().nullish(),
				id_estado_republica: z.number(),
				codigo_postal: z.number()
			})),
			fechas: z.array(z.object({
				fecha_inicio: z.date(),
				fecha_fin: z.date().nullish()
			})),
			tipo_agenda: z.string(),
			tipo_localizacion: z.string(),
			tipo_fechas: z.string(),
			notas: z.string(),
			id_uso_horario: z.number(),
			id_proyecto: z.number()		
		}))
		.mutation(async ({ input, ctx }) => {
			const user = ctx.session.user; 
			if (user && user.tipo_usuario === TipoUsuario.CAZATALENTOS) {
				const horario = await ctx.prisma.horarioAgenda.upsert({
					where: {
						id_proyecto: input.id_proyecto
					},
					update: {
						tipo_agenda: input.tipo_agenda,
						tipo_localizacion: input.tipo_localizacion,
						notas: input.notas,
						id_uso_horario: input.id_uso_horario,
					},
					create: {
						tipo_agenda: input.tipo_agenda,
						tipo_localizacion: input.tipo_localizacion,
						tipo_fechas: input.tipo_fechas,
						notas: input.notas,
						id_uso_horario: input.id_uso_horario,
						id_proyecto: input.id_proyecto,
						fecha_creacion: new Date()
					}
				})
				// limpiamos las locaciones
				await ctx.prisma.localizacionesPorHorarioAgenda.deleteMany({
					where: {
						id_horario_agenda: horario.id
					}
				})
				//limpiamos las fechas
				await ctx.prisma.fechasPorHorarioAgenda.deleteMany({
					where: {
						id_horario_agenda: horario.id
					}
				})
				if (input.fechas.length > 0) {
					const saved_fechas = await ctx.prisma.fechasPorHorarioAgenda.createMany({
						data: input.fechas.map(f => { return {...f, id_horario_agenda: horario.id}})
					})
					if (!saved_fechas) {
						throw new TRPCError({
							code: 'INTERNAL_SERVER_ERROR',
							message: 'Ocurrio un problema al tratar de guardar las fechas',
							// optional: pass the original error to retain stack trace
							//cause: theError,
						});
					}
				}
				if (input.locaciones.length > 0) {
					const saved_locaciones = await ctx.prisma.localizacionesPorHorarioAgenda.createMany({
						data: input.locaciones.map(f => { return {...f, id_horario_agenda: horario.id}})
					})
					if (!saved_locaciones) {
						throw new TRPCError({
							code: 'INTERNAL_SERVER_ERROR',
							message: 'Ocurrio un problema al tratar de guardar las locaciones',
							// optional: pass the original error to retain stack trace
							//cause: theError,
						});
					}
				}
				return horario;
			}
			throw new TRPCError({
				code: 'UNAUTHORIZED',
				message: 'Solo el rol de cazatalento puede crear horarios',
				// optional: pass the original error to retain stack trace
				//cause: theError,
			});
		}
	),
	getLocalizacionesGuardadas: protectedProcedure
		.query(async ({ input, ctx }) => {
			const user = ctx.session.user; 
			if (user && user.tipo_usuario === TipoUsuario.CAZATALENTOS) {
				const localizaciones = await ctx.prisma.localizacionesGuardadas.findMany({
					where: {
						id_usuario: parseInt(user.id),
						tipo_usuario: user.tipo_usuario 
					}
				})
				return localizaciones;
			}
			throw new TRPCError({
				code: 'UNAUTHORIZED',
				message: 'Solo el rol de cazatalento puede consultar las localizaciones',
				// optional: pass the original error to retain stack trace
				//cause: theError,
			});
		}
	),
	updateLocalizacion: protectedProcedure
		.input(z.object({
			id: z.number(),
			direccion: z.string(),
			direccion2: z.string().nullish(),
			id_estado_republica: z.number(),
			codigo_postal: z.number().max(99999),
			guardado_en_bd: z.boolean()
		}))
		.mutation(async ({ input, ctx }) => {
			console.log(input);
			const user = ctx.session.user; 
			if (user && user.tipo_usuario === TipoUsuario.CAZATALENTOS) {
				if (input.id > 0 && !input.guardado_en_bd) {
					const found_location = await ctx.prisma.localizacionesGuardadas.findFirst({
						where: {
							id: input.id
						}
					});
					if (found_location) {
						await ctx.prisma.localizacionesGuardadas.delete({
							where: {
								id: input.id
							}
						})
					}
					return {id: input.id, refetch: false};
				}
				if (input.guardado_en_bd) {
					const localizacion = await ctx.prisma.localizacionesGuardadas.upsert({
						where: {
							id: input.id,
						},
						update: {
							direccion: input.direccion,
							direccion2: input.direccion2,
							id_estado_republica: input.id_estado_republica,
							codigo_postal: input.codigo_postal,
						},
						create: {
							direccion: input.direccion,
							direccion2: input.direccion2,
							id_estado_republica: input.id_estado_republica,
							codigo_postal: input.codigo_postal,
							id_usuario: parseInt(user.id),
							tipo_usuario: user.tipo_usuario
						}
					})
					if (!localizacion) {
						throw new TRPCError({
							code: 'INTERNAL_SERVER_ERROR',
							message: 'Ocurrio un problema al tratar de guardar la localizacion',
							// optional: pass the original error to retain stack trace
							//cause: theError,
						});
					}	
					return {id: localizacion.id, refetch: false};
				}
				return {id: -1, refetch: false};
			}
			throw new TRPCError({
				code: 'UNAUTHORIZED',
				message: 'Solo el rol de cazatalento puede guardar localizaciones',
				// optional: pass the original error to retain stack trace
				//cause: theError,
			});
		}
	),
});