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
		}))
		.mutation(async ({ input, ctx }) => {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
			if (ctx.session && ctx.session.user && ctx.session.user.tipo_usuario === TipoUsuario.CAZATALENTOS) {
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

					if (input.archivo) {
						if (proyecto.id_archivo_media && input.archivo.id === 0) {
							await ctx.prisma.media.delete({
								where: {
									id: proyecto.id_archivo_media
								},
							});
						}
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
						if (proyecto.id_archivo_media) {
							await ctx.prisma.media.delete({
								where: {
									id: proyecto.id_archivo_media
								},
							});
						}
					}
	
					if (input.foto_portada) {
						if (proyecto.id_foto_portada_media && input.foto_portada.id === 0) {
							await ctx.prisma.media.delete({
								where: {
									id: proyecto.id_foto_portada_media
								},
							});
						}
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
						if (proyecto.id_foto_portada_media) {
							await ctx.prisma.media.delete({
								where: {
									id: proyecto.id_foto_portada_media
								},
							});
						}
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
				id_sindicato: z.number().min(1),
				descripcion: z.string()
			}),
			tipo_proyecto: z.object({
				id_tipo_proyecto: z.number().min(1),
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
				id_estado_republica: z.number().min(1),
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
					create: { ...input.proyecto, id_cazatalentos: parseInt(ctx.session.user.id), estatus: 'Por Validar' },
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
	getAll: publicProcedure
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
});