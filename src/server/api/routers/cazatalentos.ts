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

export const CazatalentosRouter = createTRPCRouter({
    getAll: publicProcedure
		.query(async ({ ctx }) => {
			return await ctx.prisma.cazatalentos.findMany();
		}
	),
	getById: publicProcedure
		.input(z.number())
		.query(async ({ input, ctx }) => {
			if (input <= 0) return null;
			const cazatalentos = await ctx.prisma.cazatalentos.findUnique({
				where: {id: input},
			});
			// hay que excluir la pass en 
			return cazatalentos;
			//return exclude(talento, ['contrasenia'])
		}
	),
    getPerfilById: publicProcedure
        .input(z.number())
        .query(async ({ input, ctx }) => {
            if (input <= 0) return null;
            const cazatalento = await ctx.prisma.cazatalentos.findUnique({
                where: {id: input},
                include: {
                    redes_sociales: true,
					foto_perfil: true
                }
            });
            // hay que excluir la pass en 
            return cazatalento;
            //return exclude(talento, ['contrasenia'])
        }
    ),
	getReporteTalentoByCazatalento: protectedProcedure
		.input(z.object({ 
			id_talento: z.number(),
		}))
		.query(async ({ input, ctx }) => {
			const user = ctx.session.user; 
			if (user && user.tipo_usuario === TipoUsuario.CAZATALENTOS) {
				let reporte = await ctx.prisma.reporteTalentos.findFirst({
					where: {
						id_cazatalentos: parseInt(user.id),
						id_talento: input.id_talento
					},
					include: {
						reporte: true
					}
				});
				return reporte;
			}
			throw new TRPCError({
				code: 'UNAUTHORIZED',
				message: 'Solo el rol de cazatalento puede consultar los reportes',
				// optional: pass the original error to retain stack trace
				//cause: theError,
			});
		}
	),
	getNotaTalentoByCazatalento: protectedProcedure
		.input(z.object({ 
			id_talento: z.number(),
		}))
		.query(async ({ input, ctx }) => {
			const user = ctx.session.user; 
			if (user && user.tipo_usuario === TipoUsuario.CAZATALENTOS) {
				let nota = await ctx.prisma.notasTalentos.findFirst({
					where: {
						id_cazatalentos: parseInt(user.id),
						id_talento: input.id_talento
					}
				});
				return nota;
			}
			throw new TRPCError({
				code: 'UNAUTHORIZED',
				message: 'Solo el rol de cazatalento puede consultar las notas',
				// optional: pass the original error to retain stack trace
				//cause: theError,
			});
		}
	),
	getTalentoRatingByCazatalento: protectedProcedure
		.input(z.object({ 
			id_talento: z.number(),
		}))
		.query(async ({ input, ctx }) => {
			const user = ctx.session.user; 
			if (user && user.tipo_usuario === TipoUsuario.CAZATALENTOS) {
				let destacado = await ctx.prisma.talentosDestacados.findFirst({
					where: {
						id_cazatalentos: parseInt(user.id),
						id_talento: input.id_talento
					}
				});
				return (destacado) ? destacado.calificacion : 0;
			}
			throw new TRPCError({
				code: 'UNAUTHORIZED',
				message: 'Solo el rol de cazatalento puede modificar la informacion general',
				// optional: pass the original error to retain stack trace
				//cause: theError,
			});
		}
	),
	getAudicionTalentoByRol: protectedProcedure
		.input(z.object({ 
			id_talento: z.number(),
			id_rol: z.number()
		}))
		.query(async ({ input, ctx }) => {
			const user = ctx.session.user; 
			if (user && user.tipo_usuario === TipoUsuario.CAZATALENTOS) {
				let audicion = await ctx.prisma.audicionTalento.findFirst({
					where: {
						id_rol: input.id_rol,
						id_talento: input.id_talento
					}
				});
				return audicion;
			}
			throw new TRPCError({
				code: 'UNAUTHORIZED',
				message: 'Solo el rol de cazatalento puede consultar las audiciones de los talentos',
				// optional: pass the original error to retain stack trace
				//cause: theError,
			});
		}
	),
	updateReporteTalento: protectedProcedure
    	.input(z.object({ 
			id_talento: z.number(),
  			id_tipo_reporte: z.number(),
			comentario: z.string()
		}))
		.mutation(async ({ input, ctx }) => {
			const user = ctx.session.user; 
			if (user && user.tipo_usuario === TipoUsuario.CAZATALENTOS) {
				let reporte = await ctx.prisma.reporteTalentos.findFirst({
					where: {
						id_cazatalentos: parseInt(user.id),
						id_talento: input.id_talento
					}
				});
				if (reporte) {
					reporte = await ctx.prisma.reporteTalentos.update({
						where: {
							id: reporte.id
						},
						data: {
							id_tipo_reporte: input.id_tipo_reporte,
							comentario: input.comentario
						}
					})
				} else {
					reporte = await ctx.prisma.reporteTalentos.create({
						data: {
							id_tipo_reporte: input.id_tipo_reporte,
							comentario: input.comentario,
							id_cazatalentos: parseInt(user.id),
							id_talento: input.id_talento
						}
					})
				}
				return reporte;
			}
			throw new TRPCError({
				code: 'UNAUTHORIZED',
				message: 'Solo el rol de cazatalento puede modificar el reporte del talento',
				// optional: pass the original error to retain stack trace
				//cause: theError,
			});
		}
    ),
	updateNotaTalento: protectedProcedure
		.input(z.object({ 
			id_talento: z.number(),
			nota: z.string()
		}))
		.mutation(async ({ input, ctx }) => {
			const user = ctx.session.user; 
			if (user && user.tipo_usuario === TipoUsuario.CAZATALENTOS) {
				let nota = await ctx.prisma.notasTalentos.findFirst({
					where: {
						id_cazatalentos: parseInt(user.id),
						id_talento: input.id_talento
					}
				});
				if (nota) {
					nota = await ctx.prisma.notasTalentos.update({
						where: {
							id: nota.id
						},
						data: {
							nota: input.nota
						}
					})
				} else {
					nota = await ctx.prisma.notasTalentos.create({
						data: {
							nota: input.nota,
							id_cazatalentos: parseInt(user.id),
							id_talento: input.id_talento
						}
					})
				}
				return nota;
			}
			throw new TRPCError({
				code: 'UNAUTHORIZED',
				message: 'Solo el rol de cazatalento puede modificar las notas del talento',
				// optional: pass the original error to retain stack trace
				//cause: theError,
			});
		}
	),
	marcarComoVistoAplicacionRolTalento: protectedProcedure
		.input(z.object({ 
			id_rol: z.number(),
			id_talento: z.number(),
		}))
		.mutation(async ({ input, ctx }) => {
			const user = ctx.session.user; 
			if (user && user.tipo_usuario === TipoUsuario.CAZATALENTOS) {
				const rol = await ctx.prisma.roles.findFirst({
					where: {
						id: input.id_rol
					},
					include: {
						proyecto: true
					}
				})
				if (rol) {
					if (parseInt(user.id) !== rol.proyecto.id_cazatalentos) {
						throw new TRPCError({
							code: 'UNAUTHORIZED',
							message: 'Solo elcazatalento que creo el rol puede modificar el talento',
							// optional: pass the original error to retain stack trace
							//cause: theError,
						});
					}
					const aplicacion_rol_por_talento = await ctx.prisma.aplicacionRolPorTalento.findFirst({
						where: {
							id_rol: input.id_rol,
							id_talento: input.id_talento
						}
					})
					if (aplicacion_rol_por_talento && aplicacion_rol_por_talento.id_estado_aplicacion === Constants.ESTADOS_APLICACION_ROL.NO_VISTO) {
						await ctx.prisma.aplicacionRolPorTalento.update({
							where: {
								id: aplicacion_rol_por_talento.id
							},
							data: {
								id_estado_aplicacion: Constants.ESTADOS_APLICACION_ROL.VISTO
							}
						})
					}
					return true;
				}
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'No se encontro el rol con ese id',
				});
			}
			throw new TRPCError({
				code: 'UNAUTHORIZED',
				message: 'Solo el rol de cazatalento puede modificar la calificacion del talento',
				// optional: pass the original error to retain stack trace
				//cause: theError,
			});
		}
	),
	updateTalentoDestacado: protectedProcedure
    	.input(z.object({ 
			id_rol: z.number(),
			id_talento: z.number(),
  			calificacion: z.number()
		}))
		.mutation(async ({ input, ctx }) => {
			const user = ctx.session.user; 
			if (user && user.tipo_usuario === TipoUsuario.CAZATALENTOS) {
				const rol = await ctx.prisma.roles.findFirst({
					where: {
						id: input.id_rol
					},
					include: {
						proyecto: true
					}
				})
				if (rol) {
					if (parseInt(user.id) !== rol.proyecto.id_cazatalentos) {
						throw new TRPCError({
							code: 'UNAUTHORIZED',
							message: 'Solo elcazatalento que creo el rol puede modificar el talento',
						});
					}
					let destacado = await ctx.prisma.talentosDestacados.findFirst({
						where: {
							id_cazatalentos: parseInt(user.id),
							id_talento: input.id_talento
						}
					});
					if (destacado) {
						destacado = await ctx.prisma.talentosDestacados.update({
							where: {
								id: destacado.id
							},
							data: {
								calificacion: input.calificacion
							}
						})
					} else {
						destacado = await ctx.prisma.talentosDestacados.create({
							data: {
								calificacion: input.calificacion,
								id_cazatalentos: parseInt(user.id),
								id_talento: input.id_talento
							}
						})
					}
					const aplicacion_rol_por_talento = await ctx.prisma.aplicacionRolPorTalento.findFirst({
						where: {
							id_rol: input.id_rol,
							id_talento: input.id_talento
						}
					})
					if (input.calificacion === 5) {
						if (aplicacion_rol_por_talento && ![Constants.ESTADOS_APLICACION_ROL.CALLBACK, Constants.ESTADOS_APLICACION_ROL.AUDICION, Constants.ESTADOS_APLICACION_ROL.DESTACADO].includes(aplicacion_rol_por_talento.id_estado_aplicacion)) {
							await ctx.prisma.aplicacionRolPorTalento.update({
								where: {
									id: aplicacion_rol_por_talento.id
								},
								data: {
									id_estado_aplicacion: Constants.ESTADOS_APLICACION_ROL.DESTACADO
								}
							})
						}
					} else {
						if (aplicacion_rol_por_talento && [Constants.ESTADOS_APLICACION_ROL.DESTACADO].includes(aplicacion_rol_por_talento.id_estado_aplicacion)) {
							await ctx.prisma.aplicacionRolPorTalento.update({
								where: {
									id: aplicacion_rol_por_talento.id
								},
								data: {
									id_estado_aplicacion: Constants.ESTADOS_APLICACION_ROL.VISTO
								}
							})
						}
					}
					return destacado;
				}
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'No se encontro el rol con ese id',
				});
			}
			throw new TRPCError({
				code: 'UNAUTHORIZED',
				message: 'Solo el rol de cazatalento puede modificar la calificacion del talento',
				// optional: pass the original error to retain stack trace
				//cause: theError,
			});
		}
    ),
	updateSeleccionTalento: protectedProcedure
    	.input(z.object({ 
			id_rol: z.number(),
			id_talento: z.number(),
  			fecha_audicion: z.string(),
			tipo_audicion: z.string(),
			mensaje: z.string(),
		}))
		.mutation(async ({ input, ctx }) => {
			const fecha_audicion = new Date(input.fecha_audicion);
			const user = ctx.session.user; 
			if (user && user.tipo_usuario === TipoUsuario.CAZATALENTOS) {
				const rol = await ctx.prisma.roles.findFirst({
					where: {
						id: input.id_rol
					},
					include: {
						proyecto: true
					}
				})
				if (rol) {
					if (parseInt(user.id) !== rol.proyecto.id_cazatalentos) {
						throw new TRPCError({
							code: 'UNAUTHORIZED',
							message: 'Solo elcazatalento que creo el rol puede modificar el talento',
						});
					}
					let audicion = await ctx.prisma.audicionTalento.findFirst({
						where: {
							id_rol: input.id_rol,
							id_talento: input.id_talento
						}
					});
					if (audicion) {
						audicion = await ctx.prisma.audicionTalento.update({
							where: {
								id: audicion.id
							},
							data: {
								fecha_audicion: fecha_audicion,
								tipo_audicion: input.tipo_audicion,
								mensaje: input.mensaje
							}
						})
					} else {
						audicion = await ctx.prisma.audicionTalento.create({
							data: {
								fecha_audicion: fecha_audicion,
								tipo_audicion: input.tipo_audicion,
								mensaje: input.mensaje,
								id_rol: input.id_rol,
								id_talento: input.id_talento
							}
						})
					}
					const aplicacion_rol_por_talento = await ctx.prisma.aplicacionRolPorTalento.findFirst({
						where: {
							id_rol: input.id_rol,
							id_talento: input.id_talento
						}
					})
					if (aplicacion_rol_por_talento) {
						await ctx.prisma.aplicacionRolPorTalento.update({
							where: {
								id: aplicacion_rol_por_talento.id
							},
							data: {
								id_estado_aplicacion: (input.tipo_audicion === 'audicion') ? Constants.ESTADOS_APLICACION_ROL.AUDICION : Constants.ESTADOS_APLICACION_ROL.CALLBACK
							}
						})
					}
					return audicion;
				}
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'No se encontro el rol con ese id',
				});
			}
			throw new TRPCError({
				code: 'UNAUTHORIZED',
				message: 'Solo el rol de cazatalento puede modificar la audicion del talento',
				// optional: pass the original error to retain stack trace
				//cause: theError,
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
			nombre: z.string(),
            posicion: z.string(),
			compania: z.string(),
			biografia: z.string({
				errorMap: (issue, _ctx) => {
					switch (issue.code) {
					case 'too_big':
						return { message: 'El maximo de caracteres permitido es 500' };
					default:
						return { message: 'Formato de biografia invalido' };
					}
				},
			}).max(500),
			redes_sociales: z.array(z.object({
				nombre: z.string(),
				url: z.string()
			})).nullish()
		}))
		.mutation(async ({ input, ctx }) => {
			const user = ctx.session.user; 
			if (user && user.tipo_usuario === TipoUsuario.CAZATALENTOS) {
				let id_foto_perfil_media: number | undefined = undefined;
				if (input.foto_perfil) {
					const foto_perfil = await ctx.prisma.media.findFirst({
						where: {
							identificador: `foto-perfil-cazatalentos-${user.id}`
						}
					})
					if (foto_perfil) {
						await FileManager.deleteFiles([foto_perfil.clave]);
					}
					const saved_foto = await ctx.prisma.media.upsert({
						where: {
							id: (foto_perfil) ? foto_perfil.id : 0
						},
						update: input.foto_perfil,
						create: input.foto_perfil
					})
					if (saved_foto) {
						id_foto_perfil_media = saved_foto.id;
					}
				}
				const cazatalento = await ctx.prisma.cazatalentos.update({
					where: {id: parseInt(user.id)},
					data: {
                        posicion: input.posicion,
						nombre: input.nombre,
                        biografia: input.biografia,
						compania: input.compania,
						id_foto_perfil_media: id_foto_perfil_media
					}
				})

				if (!cazatalento) {
					throw new TRPCError({
						code: 'INTERNAL_SERVER_ERROR',
						message: 'Ocurrio un error al tratar de actualizar el nombre del cazatalento',
						// optional: pass the original error to retain stack trace
						//cause: theError,
					});
				}
				
				const deleted_redes_sociales = await ctx.prisma.redesSocialesPorCazatalentos.deleteMany({
					where: { 
						id_cazatalentos: parseInt(user.id)
					}
				});

				if (!deleted_redes_sociales) {
					throw new TRPCError({
						code: 'INTERNAL_SERVER_ERROR',
						message: 'Ocurrio un error al tratar de eliminar las redes sociales del cazatalento',
						// optional: pass the original error to retain stack trace
						//cause: theError,
					});
				}

				if (input.redes_sociales) {
					if (Object.keys(input.redes_sociales).length > 0) {
						const saved_redes_sociales = await ctx.prisma.redesSocialesPorCazatalentos.createMany({
							data: input.redes_sociales.map(red => { 
								return { nombre: red.nombre, url: red.url, id_cazatalentos: parseInt(user.id)} 
							})
						})
						if (!saved_redes_sociales) {
							throw new TRPCError({
								code: 'INTERNAL_SERVER_ERROR',
								message: 'Ocurrio un error al tratar de guardar las redes sociales del cazatalento',
								// optional: pass the original error to retain stack trace
								//cause: theError,
							});
						}
					}
				}
				return cazatalento;
			}
			throw new TRPCError({
				code: 'UNAUTHORIZED',
				message: 'Solo el rol de cazatalento puede modificar la informacion general',
				// optional: pass the original error to retain stack trace
				//cause: theError,
			});
		}
    )
});