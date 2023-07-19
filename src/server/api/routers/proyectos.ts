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

export const ProyectosRouter = createTRPCRouter({
	getProyectosRandom: publicProcedure
		.input(z.number())
		.query(async ({input, ctx}) => {
			return await ctx.prisma.$queryRaw<{id: number, nombre: string, url: null | string}[]>`select p.id, p.nombre, m.url  from Proyecto p left join Media m on m.identificador = concat("foto-portada-proyecto-", p.id) order by rand() limit ${input}`
		}
	),
	getProyectosDestacados: publicProcedure
		.input(z.number())
		.query(async ({input, ctx}) => {
			const proyectos = await ctx.prisma.proyecto.findMany({
				where: { destacado: true },
				take: input,
				include: {
					tipo: {
						include: {
							tipo_proyecto: true
						}
					},
					sindicato: {
						include: {
							sindicato: true
						}
					},
					foto_portada: true,
					archivo: true
				}
			});
			return proyectos;
		}
	),
	getAllByIdCazatalentos: publicProcedure
		.input(z.object({ id: z.number() }))
		.query(async ({ input, ctx }) => {
			const proyectos = await ctx.prisma.proyecto.findMany({
				where: { id_cazatalentos: input.id },
				include: {
					tipo: {
						include: {
							tipo_proyecto: true
						}
					},
					sindicato: {
						include: {
							sindicato: true
						}
					},
					foto_portada: true,
					archivo: true
				}
			});
			return proyectos;
		}
	),
	getById: publicProcedure
		.input(z.number())
		.query(async ({ input, ctx }) => {
			if (input <= 0) return null;
			const proyecto = await ctx.prisma.proyecto.findUnique({
				where: { id: input },
				include: {
					sindicato: {
						include: {
							sindicato: true,
						}
					},
					tipo: {
						include: {
							tipo_proyecto: true
						}
					},
					cazatalentos: {
						include: {
							foto_perfil: true
						}
					},
					estado_republica: true,
					foto_portada: true,
					archivo: true,
				}
			});
			return proyecto;
		}
		),
	deleteProyecto: protectedProcedure
		.input(z.number())
		.mutation(async ({ input, ctx }) => {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
			if (ctx.session && ctx.session.user && ctx.session.user.tipo_usuario === TipoUsuario.CAZATALENTOS) {
				const proyecto: Proyecto = await ctx.prisma.proyecto.delete({
					where: {
						id: input
					},
				});
				if (!proyecto) {
					throw new TRPCError({
						code: 'INTERNAL_SERVER_ERROR',
						message: 'Ocurrio un error al tratar de eliminar el proyecto',
						// optional: pass the original error to retain stack trace
						//cause: theError,
					});
				}
				return proyecto;
			}
			throw new TRPCError({
				code: 'UNAUTHORIZED',
				message: 'Solo el rol de cazatalentos puede modificar los proyectos',
				// optional: pass the original error to retain stack trace
				//cause: theError,
			});
		}
		),
	updateEstadoProyecto: protectedProcedure
		.input(z.object({
			id: z.number(),
			estatus: z.string(),
			observaciones: z.string().nullish()
		}))
		.mutation(async ({ input, ctx }) => {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
			if (ctx.session && ctx.session.user && ctx.session.user.tipo_usuario && [TipoUsuario.CAZATALENTOS, TipoUsuario.ADMIN].includes(ctx.session.user.tipo_usuario)) {
				const proyecto: Proyecto = await ctx.prisma.proyecto.update({
					where: {
						id: input.id
					},
					data: {
						estatus: input.estatus
					}
				});

				if (!proyecto) {
					throw new TRPCError({
						code: 'INTERNAL_SERVER_ERROR',
						message: 'Ocurrio un error al tratar de guardar el proyecto',
						// optional: pass the original error to retain stack trace
						//cause: theError,
					});
				}
				let alert_message = ``;
				switch (proyecto.estatus) {
					case Constants.ESTADOS_PROYECTO.APROBADO: {
						alert_message = `¡Tu proyecto <span style="color: white; font-weight: 800;">“${proyecto.nombre}”</span> ha sido aprobado con éxito!
						Te recomendamos estar atento a las aplicaciones que recibas para así encontrar y reclutar a tu
						talento lo más pronto posible.`;
						break;
					}
					case Constants.ESTADOS_PROYECTO.RECHAZADO: {
						alert_message = `¡Tu proyecto <span style="color: white; font-weight: 800;">“${proyecto.nombre}”</span> ha sido rechazado!
						Te recomendamos revisar las siguientes observaciones para que sean corregidos: </br> <span style="color: white; font-weight: 800;"> ${(input.observaciones) ? input.observaciones : 'No se hicieron observaciones'}.</span>`;
						break;
					}
				}
				if (alert_message.length > 0) {
					await ctx.prisma.alertas.create({
						data: {
							id_usuario: proyecto.id_cazatalentos,
							tipo_usuario: TipoUsuario.CAZATALENTOS,
							visto: false,
							mensaje: alert_message
						}
					})
				}
				return proyecto;
			}
			throw new TRPCError({
				code: 'UNAUTHORIZED',
				message: 'Solo el rol de cazatalentos y admin puede modificar los proyectos',
				// optional: pass the original error to retain stack trace
				//cause: theError,
			});
		}
	),
	updateDestacado: protectedProcedure
		.input(z.object({
			id: z.number(),
			destacado: z.boolean(),
		}))
		.mutation(async ({ input, ctx }) => {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
			if (ctx.session && ctx.session.user && ctx.session.user.tipo_usuario === TipoUsuario.ADMIN) {
				const proyecto: Proyecto = await ctx.prisma.proyecto.update({
					where: {
						id: input.id
					},
					data: {
						destacado: input.destacado
					}
				});
				if (!proyecto) {
					throw new TRPCError({
						code: 'INTERNAL_SERVER_ERROR',
						message: 'Ocurrio un error al tratar de guardar el proyecto',
						// optional: pass the original error to retain stack trace
						//cause: theError,
					});
				}
				return proyecto;
			}
			throw new TRPCError({
				code: 'UNAUTHORIZED',
				message: 'Solo el rol de admin puede marcar un proyecto como destacado',
				// optional: pass the original error to retain stack trace
				//cause: theError,
			});
		}
	),
	saveProyectoFiles: protectedProcedure
    	.input(z.object({ 
			id_proyecto: z.number(),
			foto_portada: z.object({
				id: z.number().nullish(),
				nombre: z.string(),
				type: z.string(),
				url: z.string(),
				clave: z.string(),
				referencia: z.string(),
				identificador: z.string()
			}).nullish(),
			archivo: z.object({
				id: z.number().nullish(),
				nombre: z.string(),
				type: z.string(),
				url: z.string(),
				clave: z.string(),
				referencia: z.string(),
				identificador: z.string()
			}).nullish()
		}))
		.mutation(async ({ input, ctx }) => {
			console.log('INPUT saveProyectoFiles', input)
			const user = ctx.session.user; 
			if (user && user.tipo_usuario === TipoUsuario.CAZATALENTOS) {
				let proyecto = await ctx.prisma.proyecto.findFirst({
					where: {
						id: input.id_proyecto
					}
				});

				if (proyecto) {
					if (proyecto.id_archivo_media) {
						const archivo_proyecto = await ctx.prisma.media.findFirst({
							where: {
								id: proyecto.id_archivo_media
							},
						});
						if (archivo_proyecto) {
							const result = await FileManager.deleteFiles([archivo_proyecto.clave]);
							console.log('result delete', result);
						}
						await ctx.prisma.media.delete({
							where: {
								id: proyecto.id_archivo_media
							},
						});
					}

					if (input.archivo) {
						const updated_archivo = await ctx.prisma.media.upsert({
							where: {
								id: (input.archivo.id) ? input.archivo.id : 0
							},
							update: {
								nombre: input.archivo.nombre,
								type: input.archivo.type,
								url: input.archivo.url,
								clave: input.archivo.clave,
								referencia: input.archivo.referencia,
								identificador: input.archivo.identificador,
							},
							create: {
								nombre: input.archivo.nombre,
								type: input.archivo.type,
								url: input.archivo.url,
								clave: input.archivo.clave,
								referencia: input.archivo.referencia,
								identificador: input.archivo.identificador,
							},
						})
						proyecto = await ctx.prisma.proyecto.update({
							where: {
								id: proyecto.id
							},
							data: {
								id_archivo_media: updated_archivo.id,
							}
						})
					} else {
						proyecto = await ctx.prisma.proyecto.update({
							where: {
								id: proyecto.id
							},
							data: {
								id_archivo_media: undefined,
							}
						})
					}

					if (proyecto.id_foto_portada_media) {
						const foto_portada_proyecto = await ctx.prisma.media.findFirst({
							where: {
								id: proyecto.id_foto_portada_media
							},
						});
						if (foto_portada_proyecto) {
							const result_delete = await FileManager.deleteFiles([foto_portada_proyecto.clave]);
							console.log('result delete foto portada', result_delete);
						}
						await ctx.prisma.media.delete({
							where: {
								id: proyecto.id_foto_portada_media
							},
						});
					}
	
					if (input.foto_portada) {
						const updated_foto_portada = await ctx.prisma.media.upsert({
							where: {
								id: (input.foto_portada.id) ? input.foto_portada.id : 0
							},
							update: {
								nombre: input.foto_portada.nombre,
								type: input.foto_portada.type,
								url: input.foto_portada.url,
								clave: input.foto_portada.clave,
								referencia: input.foto_portada.referencia,
								identificador: input.foto_portada.identificador,
							},
							create: {
								nombre: input.foto_portada.nombre,
								type: input.foto_portada.type,
								url: input.foto_portada.url,
								clave: input.foto_portada.clave,
								referencia: input.foto_portada.referencia,
								identificador: input.foto_portada.identificador,
							},
						})
						proyecto = await ctx.prisma.proyecto.update({
							where: {
								id: proyecto.id
							},
							data: {
								id_foto_portada_media: updated_foto_portada.id
							}
						})
					} else {
						proyecto = await ctx.prisma.proyecto.update({
							where: {
								id: proyecto.id
							},
							data: {
								id_foto_portada_media: undefined
							}
						})
					}
				}
		
				return proyecto;
			}
			throw new TRPCError({
				code: 'UNAUTHORIZED',
				message: 'Solo el rol de cazatalento puede modificar la informacion general',
				// optional: pass the original error to retain stack trace
				//cause: theError,
			});
		}
	),
  	updateProyecto: protectedProcedure
    	.input(z.object({
			id: z.number().nullish(),
			sindicato: z.object({
				id_sindicato: z.number({
					errorMap: (issue, _ctx) => {
						switch (issue.code) {
							case 'too_small':
								return { message: 'Debes elegir un tipo de sindicato' };
							default:
								return { message: 'Sindicado invalido' };
						}
					},
				}).min(1),
				descripcion: z.string()
			}),
			tipo_proyecto: z.object({
				id_tipo_proyecto: z.number({
					errorMap: (issue, _ctx) => {
						switch (issue.code) {
							case 'too_small':
								return { message: 'Debes elegir un tipo de proyecto' };
							default:
								return { message: 'Tipo proyecto invalido' };
						}
					},
				}).min(1),
				descripcion: z.string()
			}),
			proyecto: z.object({
				nombre: z.string().min(2),
				director_casting: z.string(),
				telefono_contacto: z.string(),
				email_contacto: z.string().email(),
				productor: z.string(),
				casa_productora: z.string(),
				director: z.string(),
				agencia_publicidad: z.string(),
				sinopsis: z.string().max(500),
				detalles_adicionales: z.string().max(500),
				id_estado_republica: z.number({
					errorMap: (issue, _ctx) => {
						switch (issue.code) {
							case 'too_small':
								return { message: 'Debes elegir una locacion valida' };
							default:
								return { message: 'Locacion invalida' };
						}
					},
				}).min(1),
				compartir_nombre: z.boolean(),
				estatus: z.string(),
			})
		}))
		.mutation(async ({ input, ctx }) => {
			console.log(input);
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
			if (ctx.session && ctx.session.user && ctx.session.user.tipo_usuario === TipoUsuario.CAZATALENTOS) {
				const proyecto: Proyecto = await ctx.prisma.proyecto.upsert({
					where: {
						id: (input.id) ? input.id : 0
					},
					update: input.proyecto,
					create: { ...input.proyecto, id_cazatalentos: parseInt(ctx.session.user.id), estatus: 'POR_VALIDAR' },
				});
				if (!proyecto) {
					throw new TRPCError({
						code: 'INTERNAL_SERVER_ERROR',
						message: 'Ocurrio un error al tratar de guardar el proyecto',
						// optional: pass the original error to retain stack trace
						//cause: theError,
					});
				}

				const tipo_por_proyecto = await ctx.prisma.tipoProyectoPorProyecto.upsert({
					where: {
						id_proyecto: proyecto.id
					},
					update: { ...input.tipo_proyecto },
					create: { ...input.tipo_proyecto, id_proyecto: proyecto.id },
				});
				if (!tipo_por_proyecto) {
					throw new TRPCError({
						code: 'INTERNAL_SERVER_ERROR',
						message: 'Ocurrio un error al tratar de guardar el tipo de proyecto',
						// optional: pass the original error to retain stack trace
						//cause: theError,
					});
				}

				const sindicato_por_proyecto = await ctx.prisma.sindicatoPorProyecto.upsert({
					where: {
						id_proyecto: proyecto.id
					},
					update: { ...input.sindicato },
					create: { ...input.sindicato, id_proyecto: proyecto.id },
				});
				if (!sindicato_por_proyecto) {
					throw new TRPCError({
						code: 'INTERNAL_SERVER_ERROR',
						message: 'Ocurrio un error al tratar de guardar el sindicato del proyecto',
						// optional: pass the original error to retain stack trace
						//cause: theError,
					});
				}
				return proyecto;
			}
			throw new TRPCError({
				code: 'UNAUTHORIZED',
				message: 'Solo el rol de cazatalentos puede modificar los proyectos',
				// optional: pass the original error to retain stack trace
				//cause: theError,
			});
		}
		),
	deleteById: protectedProcedure
		.input(z.object({
			id: z.number(),
		}))
		.mutation(async ({ input, ctx }) => {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
			if (ctx.session && ctx.session.user && ctx.session.user.tipo_usuario === TipoUsuario.CAZATALENTOS) {
				const proyecto: Proyecto | null = await ctx.prisma.proyecto.findUnique({ where: { id: input.id } });
				if (proyecto) {

					const deleted_proyecto = await ctx.prisma.proyecto.delete({ where: { id: proyecto.id } });
					if (!deleted_proyecto) {
						throw new TRPCError({
							code: 'INTERNAL_SERVER_ERROR',
							message: 'No se pudo eliminar el proyecto',
							// optional: pass the original error to retain stack trace
							//cause: theError,
						});
					}
					return deleted_proyecto;
				}

				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'No se encontro el proyecto con ese id',
					// optional: pass the original error to retain stack trace
					//cause: theError,
				});
			}
		}
	),
	getAllComplete: publicProcedure
		.input(z.object({
			limit: z.number().min(1).max(100).nullish(),
			cursor: z.number().nullish(),
			take: z.number(),
		}))
		.query(async ({ input, ctx }) => {

			const limit = input.limit ?? 50;
			const { cursor, take } = input;

			const proyectos = await ctx.prisma.proyecto.findMany({
				take: take * (limit + 1),
				include: {
					tipo: {
						include: {
							tipo_proyecto: true
						}
					},
					sindicato: {
						include: {
							sindicato: true
						}
					},
					rol: {
						include: {
							tipo_rol: true
						}
					}
				},
				cursor: cursor ? { id: cursor } : undefined,
				orderBy: {
					id: 'asc',
				},
			});
			return proyectos;
		}
	),
	getAll: publicProcedure
		.input(z.object({
			order_by: z.any().nullish(),
			where: z.any().nullish(),
		}))
		.query(async ({ input, ctx }) => {
			const proyectos = await ctx.prisma.proyecto.findMany({
				include: {
					tipo: {
						include: {
							tipo_proyecto: true
						}
					},
					sindicato: {
						include: {
							sindicato: true
						}
					},
					foto_portada: true,
					archivo: true
				},
				where: (input.where) ? input.where : {},
				orderBy: (input.order_by) ? input.order_by : {
					id: 'asc',
				},
			});
			return proyectos;
		}
	),
});