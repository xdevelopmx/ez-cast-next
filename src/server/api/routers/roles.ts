import { TRPCError } from "@trpc/server";
import { FileManager } from "~/utils/file-manager";
import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { TipoUsuario } from "~/enums";

export const RolesRouter = createTRPCRouter({
    getById: publicProcedure
		.input(z.object({ id: z.number() }))
		.query(async ({ input, ctx }) => {
			const rol = await ctx.prisma.roles.findUnique({
				where: {id: input.id}
			});
			return rol;
		}
	),
	getCompleteById: publicProcedure
		.input(z.number())
		.query(async ({ input, ctx }) => {
			if (input <= 0) return null;
			const rol = await ctx.prisma.roles.findUnique({
				where: {id: input},
				include: {
					compensaciones: {
						include: {
							sueldo: true,
							compensaciones_no_monetarias: {
								include: {
									compensacion: true
								}
							}
						}
					},
					filtros_demograficos: {
						include: {
							pais: true,
							generos: {
								include: {
									genero: true
								}
							},
							aparencias_etnicas: {
								include: {
									aparencia_etnica: true
								}
							},
							animal: {
								include: {
									animal: true
								}
							}
						}
					},
					habilidades: {
						include: {
							habilidades_seleccionadas: {
								include: {
									habilidad: true
								}
							}
						}
					},
					requisitos: {
						include: {
							estado_republica: true,
							idioma: true,
							uso_horario: true,
							medios_multimedia: {
								include: {
									medio_multimedia: true
								}
							}
						}
					},
					nsfw: {
						include: {
							nsfw_seleccionados: {
								include: {
									nsfw: true
								}
							}
						}
					},
					casting: {
						include: {
							estado_republica: true
						}
					},
					filmaciones: {
						include: {
							estado_republica: true
						}
					},
					selftape: true,
					tipo_rol: true,
				}
			});
			return rol;
		}
	),
  	getAll: publicProcedure.query(async ({ ctx }) => {
    	return await ctx.prisma.roles.findMany();
	}),
	getAllCompleteByProyecto: publicProcedure.input(z.number()).query(async ({ input, ctx }) => {
    	return await ctx.prisma.roles.findMany({
			where: {
				id_proyecto: input
			},
			include: {
				compensaciones: {
					include: {
						sueldo: true,
						compensaciones_no_monetarias: {
							include: {
								compensacion: true
							}
						}
					}
				},
				filtros_demograficos: {
					include: {
						pais: true,
						generos: {
							include: {
								genero: true
							}
						},
						aparencias_etnicas: {
							include: {
								aparencia_etnica: true
							}
						},
						animal: {
							include: {
								animal: true
							}
						}
					}
				},
				habilidades: {
					include: {
						habilidades_seleccionadas: {
							include: {
								habilidad: true
							}
						}
					}
				},
				requisitos: {
					include: {
						estado_republica: true,
						idioma: true,
						uso_horario: true,
						medios_multimedia: {
							include: {
								medio_multimedia: true
							}
						}
					}
				},
				nsfw: {
					include: {
						nsfw_seleccionados: {
							include: {
								nsfw: true
							}
						}
					}
				},
				casting: {
					include: {
						estado_republica: true
					}
				},
				filmaciones: {
					include: {
						estado_republica: true
					}
				},
				selftape: true,
				tipo_rol: true,
			}
		});
	}),
	getAllByProyecto: publicProcedure.input(z.number()).query(async ({ input, ctx }) => {
    	return await ctx.prisma.roles.findMany({
			where: {
				id_proyecto: input
			},
		});
	}),
	deleteRolById: protectedProcedure
		.input(z.number())
		.mutation(async ({ input, ctx }) => {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
			if (ctx.session && ctx.session.user && ctx.session.user.tipo_usuario === TipoUsuario.CAZATALENTOS) {
				const rol = await ctx.prisma.roles.delete({
					where: {
						id: input
					},
				});
				if (!rol) {
					throw new TRPCError({
						code: 'INTERNAL_SERVER_ERROR',
						message: 'Ocurrio un error al tratar de eliminar el rol',
						// optional: pass the original error to retain stack trace
						//cause: theError,
					});
				}
				return rol;
			}
			throw new TRPCError({
				code: 'UNAUTHORIZED',
				message: 'Solo el rol de cazatalentos puede modificar los roles',
				// optional: pass the original error to retain stack trace
				//cause: theError,
			});
		}
	),
	updateEstadoRolById: protectedProcedure
    	.input(z.object({ 
			id: z.number(),
			estatus: z.string(),
		}))
		.mutation(async ({ input, ctx }) => {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
			if (ctx.session && ctx.session.user && ctx.session.user.tipo_usuario === TipoUsuario.CAZATALENTOS) {
				const rol = await ctx.prisma.roles.update({
					where: {
						id: input.id
					},
					data: {
						estatus: input.estatus
					}
				});
				if (!rol) {
					throw new TRPCError({
						code: 'INTERNAL_SERVER_ERROR',
						message: 'Ocurrio un error al tratar de guardar el rol',
						// optional: pass the original error to retain stack trace
						//cause: theError,
					});
				}
				return rol;
			}
			throw new TRPCError({
				code: 'UNAUTHORIZED',
				message: 'Solo el rol de cazatalentos puede modificar los roles',
				// optional: pass the original error to retain stack trace
				//cause: theError,
			});
		}
	),
	saveInfoGral: publicProcedure
    	.input(z.object({ 
			id_rol: z.number(),
			nombre: z.string(), 
			id_tipo_rol: z.number(),
			id_proyecto: z.number(),
		}))
		.mutation(async ({ input, ctx }) => {
			console.log('el iinput', input)
			const rol = await ctx.prisma.roles.upsert({
				where: {
					id: input.id_rol
				},
				update: {
					nombre: input.nombre,
					id_tipo_rol: input.id_tipo_rol
				},
				create: {
					nombre: input.nombre,
					id_tipo_rol: input.id_tipo_rol,
					id_proyecto: input.id_proyecto,
				},
			})
			return rol;
		}
	),
	saveCompensacion: publicProcedure
    	.input(z.object({ 
			id_rol: z.number(),
			compensacion: z.object({
				datos_adicionales: z.string(),
				suma_total_compensaciones_no_monetarias: z.number().nullish()
			}),
			sueldo: z.object({
				cantidad_sueldo: z.number(),
				periodo_sueldo: z.string(),
			}).nullish(),
			compensaciones_no_monetarias: z.array(
				z.object({
					id_compensacion: z.number(), 
					descripcion_compensacion: z.string()
				})
			).nullish()
		}))
		.mutation(async ({ input, ctx }) => {
			console.log('input-save compensacion', input)
			const rol = await ctx.prisma.roles.findUnique({where: {id: input.id_rol}});
			if (!rol) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'No se encontro el rol en la base de datos',
					// optional: pass the original error to retain stack trace
					//cause: theError,
				});
			}

			const compensaciones = await ctx.prisma.compensacionesPorRoles.upsert({
				where: {
					id_rol: input.id_rol
				},
				update: {
					datos_adicionales: input.compensacion.datos_adicionales,
					suma_total_compensaciones_no_monetarias: input.compensacion.suma_total_compensaciones_no_monetarias
				},
				create: {
					id_rol: input.id_rol,
					datos_adicionales: input.compensacion.datos_adicionales,
					suma_total_compensaciones_no_monetarias: input.compensacion.suma_total_compensaciones_no_monetarias
				},
			})
		
			console.log('compensaciones', compensaciones);

			if (!compensaciones) {
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: 'No se pudo actualizar las compensaciones del rol en la base de datos',
					// optional: pass the original error to retain stack trace
					//cause: theError,
				});
			}

			if (input.sueldo) {
				const sueldo = await ctx.prisma.sueldosPorRoles.upsert({
					where: {
						id_comp_por_rol: compensaciones.id
					},
					update: {
						cantidad: input.sueldo.cantidad_sueldo, 
						periodo: input.sueldo.periodo_sueldo.toUpperCase(),
					},
					create: {
						id_comp_por_rol: compensaciones.id,
						cantidad: input.sueldo.cantidad_sueldo, 
						periodo: input.sueldo.periodo_sueldo.toUpperCase(),
					},
				})
				if (!sueldo) {
					throw new TRPCError({
						code: 'INTERNAL_SERVER_ERROR',
						message: 'No se pudo guardar el sueldo del rol en la base de datos',
						// optional: pass the original error to retain stack trace
						//cause: theError,
					});
				}
			} else {
				const deleted_sueldo = await ctx.prisma.sueldosPorRoles.delete({where: {id_comp_por_rol: compensaciones.id}});
				if (!deleted_sueldo) {
					throw new TRPCError({
						code: 'INTERNAL_SERVER_ERROR',
						message: 'No se pudo eliminar el sueldo del rol en la base de datos',
						// optional: pass the original error to retain stack trace
						//cause: theError,
					});
				}
			}

			const deleted_compensaciones = await ctx.prisma.compNoMonetariasPorRoles.deleteMany({ where: { id_comp_por_rol: compensaciones.id }});
			if (!deleted_compensaciones) {
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: 'No se pudieron eliminar las compensaciones no monetarias del rol en la base de datos',
					// optional: pass the original error to retain stack trace
					//cause: theError,
				});
			}

			if (input.compensaciones_no_monetarias) {
				const saved_compensaciones_no_monetarias = await ctx.prisma.compNoMonetariasPorRoles.createMany({
					data: input.compensaciones_no_monetarias.map(c => {
						const comp_no_mone: { id_compensacion: number, descripcion_compensacion: string, id_comp_por_rol: number} = {...c, id_comp_por_rol: compensaciones.id}
						return comp_no_mone;
					})
				})
				if (!saved_compensaciones_no_monetarias) {
					throw new TRPCError({
						code: 'INTERNAL_SERVER_ERROR',
						message: 'No se pudieron guardar las compensaciones no monetarias del rol en la base de datos',
						// optional: pass the original error to retain stack trace
						//cause: theError,
					});
				}
			} 
			return input;
		}
	),
	saveFiltrosDemograficos: publicProcedure
    	.input(z.object({ 
			id_rol: z.number(),
			generos: z.array(z.number()).nullish(),
			apariencias_etnias: z.array(z.number()).nullish(),
			animal: z.object({
				id: z.number(),
				descripcion: z.string(),
				tamanio: z.string()
			}).nullish(),
			rango_edad_inicio: z.number({
				errorMap: (issue, _ctx) => {
					switch (issue.code) {
					case 'too_small': 
						return { message: 'La edad no puede ser menor a 0' };
					case 'too_big':
						return { message: 'La edad no puede ser mayor a 110' };
					default:
						return { message: 'Formato de biografia invalido' };
					}
				},
			}).min(0).max(110),
			rango_edad_fin: z.number({
				errorMap: (issue, _ctx) => {
					switch (issue.code) {
					case 'too_small': 
						return { message: 'La edad no puede ser menor a 0' };
					case 'too_big':
						return { message: 'La edad no puede ser mayor a 110' };
					default:
						return { message: 'Formato de biografia invalido' };
					}
				},
			}).min(0).max(110),
			rango_edad_en_meses: z.boolean(),
			id_pais: z.number({
				errorMap: (issue, _ctx) => {
					switch (issue.code) {
					case 'too_small':
						return { message: 'Debes seleccionar una nacionalidad' };
					default:
						return { message: 'Formato de nacionalidad invalido' };
					}
				},
			}).min(1)
		}))
		.mutation(async ({ input, ctx }) => {
			const rol = await ctx.prisma.roles.findUnique({where: {id: input.id_rol}});
			if (!rol) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'No se encontro el rol en la base de datos',
					// optional: pass the original error to retain stack trace
					//cause: theError,
				});
			}

			const filtros_demograficos = await ctx.prisma.filtrosDemoPorRoles.upsert({
				where: {
					id_rol: input.id_rol
				},
				update: {
					rango_edad_inicio: input.rango_edad_inicio,
                    rango_edad_fin: input.rango_edad_fin,
                    rango_edad_en_meses: input.rango_edad_en_meses,
                    id_pais: input.id_pais
				},
				create: {
					id_rol: input.id_rol,
					rango_edad_inicio: input.rango_edad_inicio,
                    rango_edad_fin: input.rango_edad_fin,
                    rango_edad_en_meses: input.rango_edad_en_meses,
                    id_pais: input.id_pais
				}
			})

			if (!filtros_demograficos) {
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: 'No se pudo actualizar los filtros demograficos del rol en la base de datos',
					// optional: pass the original error to retain stack trace
					//cause: theError,
				});
			}

			const deleted_generos = await ctx.prisma.generosPorRoles.deleteMany({where: { id_filtro_demo_por_rol: filtros_demograficos.id }});
			if (!deleted_generos) {
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: 'No se pudieron eliminar los generos del rol en la base de datos',
					// optional: pass the original error to retain stack trace
					//cause: theError,
				});
			}

			if (input.generos) {
				const saved_generos = await ctx.prisma.generosPorRoles.createMany({
					data: input.generos.map(g => { return {id_genero: g, id_filtro_demo_por_rol: filtros_demograficos.id} })
				});
				if (!saved_generos) {
					throw new TRPCError({
						code: 'INTERNAL_SERVER_ERROR',
						message: 'No se pudieron guardar los generos del rol en la base de datos',
						// optional: pass the original error to retain stack trace
						//cause: theError,
					});
				}
			}

			const deleted_etnias = await ctx.prisma.aparenciasEtnicasPorRoles.deleteMany({where: { id_filtro_demo_por_rol: filtros_demograficos.id }});
			if (!deleted_etnias) {
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: 'No se pudieron eliminar las etnias del rol en la base de datos',
					// optional: pass the original error to retain stack trace
					//cause: theError,
				});
			}

			if (input.apariencias_etnias) {
				const saved_etnias = await ctx.prisma.aparenciasEtnicasPorRoles.createMany({
					data: input.apariencias_etnias.map(e => { return { id_aparencia_etnica: e, id_filtro_demo_por_rol: filtros_demograficos.id} })
				});
				if (!saved_etnias) {
					throw new TRPCError({
						code: 'INTERNAL_SERVER_ERROR',
						message: 'No se pudieron guardar las etnias del rol en la base de datos',
						// optional: pass the original error to retain stack trace
						//cause: theError,
					});
				}
			}

			const deleted_animal = await ctx.prisma.animalPorRoles.deleteMany({where: { id_filtro_demo_por_rol: filtros_demograficos.id }});
			if (!deleted_animal) {
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: 'No se pudo eliminar el animal del rol en la base de datos',
					// optional: pass the original error to retain stack trace
					//cause: theError,
				});
			}

			if (input.animal) {
				const saved_animal = await ctx.prisma.animalPorRoles.create({
					data: {
						id_filtro_demo_por_rol: filtros_demograficos.id,
						id_animal: input.animal.id,
						descripcion: input.animal.descripcion,
						tamanio: input.animal.tamanio
					}
				});
				if (!saved_animal) {
					throw new TRPCError({
						code: 'INTERNAL_SERVER_ERROR',
						message: 'No se pudo guardar el animal del rol en la base de datos',
						// optional: pass the original error to retain stack trace
						//cause: theError,
					});
				}
			}
			return input;
		}
	),
	saveDescripcionRol: publicProcedure
    	.input(z.object({ 
			id_rol: z.number(),
			descripcion: z.string({
				errorMap: (issue, _ctx) => {
					switch (issue.code) {
					case 'too_big':
						return { message: 'La descripcion del rol no puede ser mayor a 500 caracteres' };
					default:
						return { message: 'Formato de descripcion del rol invalido' };
					}
				},
			}).max(500),
			detalles_adicionales: z.string().nullish(),
			habilidades: z.array(z.number()),
			especificacion_habilidad: z.string(),
			nsfw: z.object({
				ids: z.array(z.number()),
				descripcion: z.string({
					errorMap: (issue, _ctx) => {
						switch (issue.code) {
						case 'too_big':
							return { message: 'La descripcion del contenido NSFW no puede ser mayor a 500 caracteres' };
						default:
							return { message: 'Formato de descripcion NSFW invalido' };
						}
					},
				}).max(500)
			}).nullish(),
			lineas: z.object({
				base64: z.string(),
				extension: z.string()
			}).nullish(),
			foto_referencia: z.object({
				base64: z.string(),
				extension: z.string()
			}).nullish()
		}))
		.mutation(async ({ input, ctx }) => {
			const updated_files: {lineas: null | string, foto_referencia: null | string} = {lineas: null, foto_referencia: null};
			if (input.lineas) {
				const save_result = await FileManager.saveFile(`lineas-descripcion-rol.${input.lineas.extension}`, input.lineas.base64, 'roles/descripcion/lineas/');
				if (!save_result.error) {
					updated_files.lineas = save_result.result;
				}
			}

			if (input.foto_referencia) {
				const save_result = await FileManager.saveFile(`foto-referencia-descripcion-rol.${input.foto_referencia.extension}`, input.foto_referencia.base64, 'roles/descripcion/fotos/');
				if (!save_result.error) {
					updated_files.foto_referencia = save_result.result;
				}
			}
			const rol = await ctx.prisma.roles.update({
				where: {
					id: input.id_rol
				},
				include: {
					habilidades: {
						include: {
							habilidades_seleccionadas: true
						}
					},
					nsfw: {
						include: {
							nsfw_seleccionados: true
						}
					}
				},
				data: {
					descripcion: input.descripcion,
					detalles_adicionales: input.detalles_adicionales,
					...updated_files
				}
			});
			if (!rol) {
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: 'No se encontro el rol en la base de datos',
					// optional: pass the original error to retain stack trace
					//cause: theError,
				});
			}

			if (rol.habilidades && rol.habilidades.habilidades_seleccionadas.length > 0) {
				const deleted_habilidades = await ctx.prisma.habilidadesPorRoles.delete({where: {id_rol: rol.id}});
				if (!deleted_habilidades) {
					throw new TRPCError({
						code: 'INTERNAL_SERVER_ERROR',
						message: 'No se pudieron eliminar las habilidades del rol',
						// optional: pass the original error to retain stack trace
						//cause: theError,
					});
				}
			}

			
			const habilidades_por_rol = await ctx.prisma.habilidadesPorRoles.create({
				data: {
					id_rol: rol.id,
					especificacion: input.especificacion_habilidad
				}
			});

			if (!habilidades_por_rol) {
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: 'No se pudieron crear las habilidades del rol',
					// optional: pass the original error to retain stack trace
					//cause: theError,
				});
			}

			const habilidades_seleccionadas_por_rol = await ctx.prisma.habilidadesSelecPorRoles.createMany({
				data: input.habilidades.map(h => { return {id_habilidad: h, id_habilidades_por_rol: habilidades_por_rol.id}})
			});
		
			if (!habilidades_seleccionadas_por_rol) {
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: 'No se pudieron crear las habilidades seleccionadas del rol',
					// optional: pass the original error to retain stack trace
					//cause: theError,
				});
			}

			if (rol.nsfw && rol.nsfw.nsfw_seleccionados.length > 0) {
				const deleted_nsfw = await ctx.prisma.nSFWPorRoles.delete({where: {id_rol: rol.id}});
	
				if (!deleted_nsfw) {
					throw new TRPCError({
						code: 'INTERNAL_SERVER_ERROR',
						message: 'No se pudieron eliminar los nsfw del rol',
						// optional: pass the original error to retain stack trace
						//cause: theError,
					});
				}
			}

			if (input.nsfw) {
				const nsfw_por_rol = await ctx.prisma.nSFWPorRoles.create({
					data: {
						id_rol: rol.id, 
						descripcion: input.nsfw.descripcion
					}
				});
				if (!nsfw_por_rol) {
					throw new TRPCError({
						code: 'INTERNAL_SERVER_ERROR',
						message: 'No se pudieron guardar los nsfw del rol',
						// optional: pass the original error to retain stack trace
						//cause: theError,
					});
				}
				const nsfw_seleccionados_por_rol = await ctx.prisma.nSFWSeleccionadosPorRoles.createMany({
					data: input.nsfw.ids.map(id => {return {id_nsfw: id, id_nsfw_por_rol: nsfw_por_rol.id}})
				});
				if (!nsfw_seleccionados_por_rol) {
					throw new TRPCError({
						code: 'INTERNAL_SERVER_ERROR',
						message: 'No se pudieron guardar los nsfw seleccionados del rol',
						// optional: pass the original error to retain stack trace
						//cause: theError,
					});
				}
			}		
			return input;
		}
	),
	saveInfoCastingYFilmacion: publicProcedure
    	.input(z.object({ 
			id_rol: z.number(),
			id_estado_republica: z.number(),
			fechas: z.array(z.object({
				inicio: z.date(),
				fin: z.date().nullish(),
			}), {
				errorMap: (issue, _ctx) => {
					switch (issue.code) {
					case 'too_small':
						return { message: 'Se debe definir al menos una fecha' };
					default:
						return { message: 'Formato de fechas invalido' };
					}
				}
			}).min(1),
			action: z.string()
		}))
		.mutation(async ({ input, ctx }) => {

			if (input.action === 'casting') {
				const deleted_fechas = await ctx.prisma.castingPorRoles.deleteMany({where: {id_rol: input.id_rol}});
				if (!deleted_fechas) {
					throw new TRPCError({
						code: 'INTERNAL_SERVER_ERROR',
						message: 'No se pudieron eliminar los datos de la fechas de castings',
						// optional: pass the original error to retain stack trace
						//cause: theError,
					});
				}
				const saved_fechas = await ctx.prisma.castingPorRoles.createMany({
					data: input.fechas.map((dates) => {
						return {
							id_rol: input.id_rol,
							id_estado_republica: input.id_estado_republica,
							fecha_inicio: dates.inicio,
							fecha_fin: dates.fin
						}
					})
				});
				if (!saved_fechas) {
					throw new TRPCError({
						code: 'INTERNAL_SERVER_ERROR',
						message: 'No se pudieron guardar los datos de la fechas de castings',
						// optional: pass the original error to retain stack trace
						//cause: theError,
					});
				}
				return saved_fechas;
			} else {
				const deleted_fechas = await ctx.prisma.filmacionPorRoles.deleteMany({where: {id_rol: input.id_rol}});
				if (!deleted_fechas) {
					throw new TRPCError({
						code: 'INTERNAL_SERVER_ERROR',
						message: 'No se pudieron eliminar los datos de la fechas de filmaciones',
						// optional: pass the original error to retain stack trace
						//cause: theError,
					});
				}
				const saved_fechas = await ctx.prisma.filmacionPorRoles.createMany({
					data: input.fechas.map((dates) => {
						return {
							id_rol: input.id_rol,
							id_estado_republica: input.id_estado_republica,
							fecha_inicio: dates.inicio,
							fecha_fin: dates.fin
						}
					})
				});
				if (!saved_fechas) {
					throw new TRPCError({
						code: 'INTERNAL_SERVER_ERROR',
						message: 'No se pudieron guardar los datos de la fechas de filmaciones',
						// optional: pass the original error to retain stack trace
						//cause: theError,
					});
				}
				return saved_fechas;
			}
		}
	),
	saveRequisitosRol: publicProcedure
    	.input(z.object({ 
			id_rol: z.number(),
			fecha_presentacion: z.string(),
			id_uso_horario: z.number(),
			info_trabajo: z.string({
				errorMap: (issue, _ctx) => {
					switch (issue.code) {
					case 'too_big':
						return { message: 'La informacion de trabajo del  rol no puede ser mayor a 500 caracteres' };
					default:
						return { message: 'Formato de informacion de trabajo del rol invalido' };
					}
				},
			}).max(500),
			id_idioma: z.number(),
			medios_multimedia_a_incluir: z.array(z.number()),
			id_estado_donde_aceptan_solicitudes: z.number()
		}))
		.mutation(async ({ input, ctx }) => {
			
			const requisitos = await ctx.prisma.requisitosPorRoles.upsert({
				where: {
					id_rol: input.id_rol
				},
				update: {
					presentacion_solicitud: new Date(input.fecha_presentacion),
					informacion: input.info_trabajo,
					id_uso_horario: input.id_uso_horario,
					id_idioma: input.id_idioma,
					id_estado_republica: input.id_estado_donde_aceptan_solicitudes
				},
				create: {
					presentacion_solicitud: new Date(input.fecha_presentacion),
					informacion: input.info_trabajo,
					id_uso_horario: input.id_uso_horario,
					id_rol: input.id_rol,
					id_idioma: input.id_idioma,
					id_estado_republica: input.id_estado_donde_aceptan_solicitudes
				}
			})

			if (!requisitos) {
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: 'No se pudieron guardar los requisitos del rol',
					// optional: pass the original error to retain stack trace
					//cause: theError,
				});
			}

			const medios_multimedia_por_rol = await ctx.prisma.mediosMultimediaPorRoles.findMany({
				where: {
					id_requisitos_por_roles: requisitos.id
				}
			})

			if (medios_multimedia_por_rol.length > 0) {
				const deleted_medios_multimedia_por_rol = await ctx.prisma.mediosMultimediaPorRoles.deleteMany({
					where: {
						id_requisitos_por_roles: requisitos.id
					}
				});

				if (!deleted_medios_multimedia_por_rol) {
					throw new TRPCError({
						code: 'INTERNAL_SERVER_ERROR',
						message: 'No se pudieron eliminar los medios del rol',
						// optional: pass the original error to retain stack trace
						//cause: theError,
					});
				}
			}

			const saved_medios_multimedia_por_rol = await ctx.prisma.mediosMultimediaPorRoles.createMany({
				data: input.medios_multimedia_a_incluir.map(m => { return {id_requisitos_por_roles: requisitos.id, id_medio_multimedia: m }})
			})

			if (!saved_medios_multimedia_por_rol) {
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: 'No se pudieron guardar los medios multimedia del rol',
					// optional: pass the original error to retain stack trace
					//cause: theError,
				});
			}

		
			return input;
		}
	),
	saveSelftapeRol: publicProcedure
    	.input(z.object({ 
			id_rol: z.number(),
			indicaciones: z.string({
				errorMap: (issue, _ctx) => {
					switch (issue.code) {
					case 'too_big':
						return { message: 'Las indicaciones del selftape no puede ser mayor a 500 caracteres' };
					default:
						return { message: 'Formato de las indicaciones del selftape invalido' };
					}
				},
			}).max(500),
			pedir_selftape: z.boolean(),
			lineas: z.object({
				base64: z.string(),
				extension: z.string()
			}).nullish(),
		}))
		.mutation(async ({ input, ctx }) => {
			let updated_lineas: string | null = null;
			if (input.lineas) {
				const save_result = await FileManager.saveFile(`lineas-selftape-rol.${input.lineas.extension}`, input.lineas.base64, 'roles/selftape/lineas/');
				if (!save_result.error) {
					updated_lineas = save_result.result;
				}
			}

			const selftape = await ctx.prisma.selftapePorRoles.upsert({
				where: {
					id_rol: input.id_rol
				},
				update: {
					pedir_selftape: input.pedir_selftape,
					indicaciones: input.indicaciones,
					lineas: updated_lineas
				},
				create: {
					id_rol: input.id_rol,
					pedir_selftape: input.pedir_selftape,
					indicaciones: input.indicaciones,
					lineas: updated_lineas
				}
			})

			if (!selftape) {
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: 'No se pudieron actualizar los datos del selftape del rol',
					// optional: pass the original error to retain stack trace
					//cause: theError,
				});
			}
			return selftape;
		}
	),

});
//getSecretMessage: protectedProcedure.query(() => {
//    return "you can now see this secret message!";
//}),