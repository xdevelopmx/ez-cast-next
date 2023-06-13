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
import { generateIntervalos } from "~/utils/dates";
import dayjs from "dayjs";

export const AgendaVirtualRouter = createTRPCRouter({
	getAllFechasAsignadas: protectedProcedure
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
						bloque_horario: {
							include: {
								intervalos: true
							}
						}
					}
				});

				let fechas_map = new Map<string, string>();
				horarios.forEach(h => {
					h.bloque_horario.forEach( b => {
						if (fechas_map.has(b.fecha.toLocaleDateString('es-mx'))) {
							const reg_fecha = fechas_map.get(b.fecha.toLocaleDateString('es-mx'));
							if (reg_fecha && reg_fecha !== 'AMBAS' && reg_fecha !== h.tipo_agenda) {
								fechas_map.set(b.fecha.toLocaleDateString('es-mx'), 'AMBAS');
							}
						} else {
							fechas_map.set(b.fecha.toLocaleDateString('es-mx'), h.tipo_agenda);
						}
					})
				})
				return Array.from(fechas_map).map(f => { 
					const d = f[0].split('/');
					if (d[0] && d[1] && d[2]) {
						return { fecha: dayjs(`${parseInt(d[0]) > 10 ? d[0] : `0${d[0]}`}/${parseInt(d[1]) > 10 ? d[1] : `0${d[1]}`}/${d[2]}`, 'DD/MM/YYYY').toDate(), tipo_agenda: f[1] }
					}
					return { fecha: new Date(f[0]), tipo_agenda: f[1] }
				});
			}
			throw new TRPCError({
				code: 'UNAUTHORIZED',
				message: 'Solo el rol de cazatalentos puede obtener las fechas asignadas',
				// optional: pass the original error to retain stack trace
				//cause: theError,
			});
		}
	),
    getAllProyectosByCazatalentosWithHorarioAgenda: protectedProcedure
		.query(async ({ ctx }) => {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
			if (ctx.session && ctx.session.user && ctx.session.user.tipo_usuario === TipoUsuario.CAZATALENTOS) {
				const proyectos = await ctx.prisma.proyecto.findMany({
					where: {
						id_cazatalentos: parseInt(ctx.session.user.id),
						estatus: {
							in: [Constants.ESTADOS_PROYECTO.APROBADO]
						}
					},
					include: {
						horario_agenda: true,
						rol: {
							where: {
								estatus: {
									notIn: [Constants.ESTADOS_ROLES.ARCHIVADO]
								}
							},
							include: {
								casting: true,
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
						fechas: true,
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
						localizaciones: {
							include: {
								estado_republica: true
							}
						},
						uso_horario: true,
						proyecto: {
							include: {
								rol: {
									where: {
										estatus: {
											notIn: [Constants.ESTADOS_ROLES.ARCHIVADO]
										}
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

				const deleted_bloques = await ctx.prisma.bloqueHorariosAgenda.deleteMany({
					where: {
						id_horario_agenda: input
					}
				})

				if (!deleted_bloques) {
					throw new TRPCError({
						code: 'INTERNAL_SERVER_ERROR',
						message: 'Ocurrio un problema al tratar de eliminar los bloques del horario',
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
						tipo_fechas: input.tipo_fechas,
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
				
				// limpiamos los intervalos por alguna razon no esta funcionando el onDelete Cascade
				const bloques = await ctx.prisma.bloqueHorariosAgenda.findMany({
					where: {
						id_horario_agenda: horario.id
					}
				})

				if (bloques.length > 0) {
					await ctx.prisma.intervaloBloqueHorario.deleteMany({
						where: {
							id_bloque_horario: {
								in: bloques.map(b => b.id)
							}
						}
					})
				}
				
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
	updateIntervaloHorario: protectedProcedure
		.input(z.object({
			id_intervalo: z.number(),
			id_rol: z.number().nullish(),
			id_talento: z.number().nullish(),
			estado: z.string()
		}))
		.mutation(async ({ input, ctx }) => {
			console.log('inoputasd', input);
			const saved_intervalos = await ctx.prisma.intervaloBloqueHorario.update({
				where: {
					id: input.id_intervalo
				},
				data: {
					id_rol: input.id_rol,
					id_talento: input.id_talento,
					estado: input.estado
				}
			})

			if (!saved_intervalos) {
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: 'Ocurrio un problema al tratar de guardar los intervalos',
				});
			}
			
			return saved_intervalos;
		}
	),
	updateBloqueHorario: protectedProcedure
		.input(z.object({
			id_bloque: z.number(),
			id_horario_agenda: z.number(),
			fecha: z.date(),
			tipo_administracion_intervalo: z.string(),
			hora_inicio: z.string(),
			hora_fin: z.string(),
			minutos_por_talento: z.number(),
			hora_descanso_inicio: z.string().nullish(),
			hora_descanso_fin: z.string().nullish(),
			id_locacion: z.number()		
		}))
		.mutation(async ({ input, ctx }) => {	
			const horario_agenda = await ctx.prisma.horarioAgenda.findFirst({
				where: {
					id: input.id_horario_agenda
				}
			})
			
			const bloque = await ctx.prisma.bloqueHorariosAgenda.upsert({
				where: {
					id: input.id_bloque
				},
				update: {
					hora_inicio: input.hora_inicio,
					hora_fin: input.hora_fin,
					minutos_por_talento: input.minutos_por_talento,
					hora_descanso_inicio: input.hora_descanso_inicio,
					tipo_administracion_intervalo: input.tipo_administracion_intervalo,
					hora_descanso_fin: input.hora_descanso_fin,
					id_locacion: input.id_locacion	
				},
				create: {
					id_horario_agenda: input.id_horario_agenda,
					fecha: input.fecha,
					hora_inicio: input.hora_inicio,
					hora_fin: input.hora_fin,
					tipo_administracion_intervalo: input.tipo_administracion_intervalo,
					minutos_por_talento: input.minutos_por_talento,
					hora_descanso_inicio: input.hora_descanso_inicio,
					hora_descanso_fin: input.hora_descanso_fin,
					id_locacion: input.id_locacion	
				}
			})

			// eliminamos los intervalos

			await ctx.prisma.intervaloBloqueHorario.deleteMany({
				where: {
					id_bloque_horario: bloque.id
				}
			})

			const intervalos_generados = generateIntervalos(bloque.minutos_por_talento, 
                bloque.hora_inicio, 
                bloque.hora_fin, 
                (bloque.hora_descanso_inicio && bloque.hora_descanso_inicio !== '00:00' && bloque.hora_descanso_fin && bloque.hora_descanso_fin !== '00:00') ? 
                {inicio_tiempo: bloque.hora_descanso_inicio, fin_tiempo: bloque.hora_descanso_fin} : undefined);

			const asignaciones_roles_por_talentos: {id_rol: number, id_talento: number}[] = []; 
			if (horario_agenda && input.tipo_administracion_intervalo.toLowerCase() === 'automaticamente') {
				const proyecto = await ctx.prisma.proyecto.findFirst({
					where: {
						id: horario_agenda.id_proyecto
					}
				})
				const aplicaciones_roles = await ctx.prisma.roles.findMany({
					where: {
						id_proyecto: horario_agenda.id_proyecto,
						estatus: {
							notIn: [Constants.ESTADOS_ROLES.ARCHIVADO]
						}
					},
					include: {
						aplicaciones_por_talento: {
							where: {
								id_estado_aplicacion: {
									in: [horario_agenda.tipo_agenda.toLowerCase() === 'callback' ? Constants.ESTADOS_APLICACION_ROL.CALLBACK : Constants.ESTADOS_APLICACION_ROL.AUDICION]
								}
							},
							include: {
								talento: {
									include: {
										destacados: {
											where: (proyecto) ? {
												id_cazatalentos: proyecto.id_cazatalentos
											} : {},
											orderBy: {
												calificacion: 'asc'
											}
										}
									}
								}
							},
						},
					}
				});


				const bloques = await ctx.prisma.bloqueHorariosAgenda.findMany({
					where: {
						id_horario_agenda: input.id_horario_agenda,
					},
					include: {
						intervalos: true
					}
				})
				
				const asignaciones_otros_bloques = (bloques) ? bloques.map(r => r.intervalos).flat() : [];
				aplicaciones_roles.forEach((asig) => {
					asig.aplicaciones_por_talento.forEach(a => {
						if (asignaciones_otros_bloques.filter(aob => aob.id_rol === a.id_rol && aob.id_talento === a.id_talento).length === 0) {
							asignaciones_roles_por_talentos.push({id_rol: a.id_rol, id_talento: a.id_talento});
						}
					})
				});
			}
			const saved_intervalos = await ctx.prisma.intervaloBloqueHorario.createMany({
				data: intervalos_generados.map((intervalo, i) => {
					const asig = (intervalo.tipo !== 'descanso') ? asignaciones_roles_por_talentos.splice(0, 1)[0] : undefined;
					const h_inicio_exploded = intervalo.inicio.split(":");
					let h_inicio_parsed = (h_inicio_exploded[0] != null && h_inicio_exploded[0].length < 2) ? `0${h_inicio_exploded[0]}:` : `${h_inicio_exploded[0]}:`;
					h_inicio_parsed += (h_inicio_exploded[1] != null && h_inicio_exploded[1].length < 2) ? `0${h_inicio_exploded[1]}` : `${h_inicio_exploded[1]}`;
					const h_fin_exploded = intervalo.fin.split(":");
					let h_fin_parsed = (h_fin_exploded[0] != null && h_fin_exploded[0].length < 2) ? `0${h_fin_exploded[0]}:` : `${h_fin_exploded[0]}:`;
					h_fin_parsed += (h_fin_exploded[1] != null && h_fin_exploded[1].length < 2) ? `0${h_fin_exploded[1]}` : `${h_fin_exploded[1]}`;
					return {
						id_bloque_horario: bloque.id,
						hora: `${h_inicio_parsed} - ${h_fin_parsed}`, 
						id_rol: (asig) ? asig.id_rol : undefined,
						id_talento: (asig) ? asig.id_talento : undefined,
						estado: 'Pendiente',
						tipo: intervalo.tipo
					}
				})
			})

			if (!saved_intervalos) {
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: 'Ocurrio un problema al tratar de guardar los intervalos',
				});
			}
			
			return bloque;
		}
	),
	getAllIdsTalentosAsignadosByHorario: protectedProcedure
		.input(z.object({
			id_horario_agenda: z.number()
		}))
		.query(async ({ input, ctx }) => {
			const bloque = await ctx.prisma.bloqueHorariosAgenda.findMany({
				where: {
					id_horario_agenda: input.id_horario_agenda,
				},
				include: {
					intervalos: true
				}
			})
			if (bloque) {
				return bloque.map(r => r.intervalos).flat();
			}
			return [];
		}
	),
	getBloqueHorarioByDateAndIdHorario: protectedProcedure
		.input(z.object({
			id_horario_agenda: z.number(),
			fecha: z.date()
		}))
		.query(async ({ input, ctx }) => {
			const bloque = await ctx.prisma.bloqueHorariosAgenda.findFirst({
				where: {
					id_horario_agenda: input.id_horario_agenda,
					fecha: input.fecha
				},
				include: {
					locacion: {
						include: {
							estado_republica: true
						}
					},
					intervalos: {
						include: {
							rol: true,
							talento: {
								include: {
									info_basica: {
										include: {
											estado_republica: true
										}
									},
									media: {
										include: {
											media: true
										}
									},
									destacados: true
								}
							}
						},
						orderBy: {
							id: 'asc'
						}
					}
				}
			})
			return bloque;
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
					return {id: input.id, result: 0};
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
					return {id: localizacion.id, result: 1};
				}
				return {id: input.id, result: -1};
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