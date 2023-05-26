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
    getAllProyectosByCazatalentosWithoutHorarioAgenda: protectedProcedure
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
				return proyectos.filter(p => !p.horario_agenda);
			}
			throw new TRPCError({
				code: 'UNAUTHORIZED',
				message: 'Solo el rol de cazatalentos puede obtener los proyectos',
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
						notas: input.notas,
						id_uso_horario: input.id_uso_horario,
						id_proyecto: input.id_proyecto
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
});