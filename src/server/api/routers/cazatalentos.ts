import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import type { Cazatalentos, Proyecto, Talentos } from "@prisma/client";
import { FileManager } from "~/utils/file-manager";
import { TipoConversaciones, TipoMensajes, TipoUsuario } from "~/enums";
import Constants from "~/constants";
import dayjs from "dayjs";
import ApiResponses from "~/utils/api-response";

export const CazatalentosRouter = createTRPCRouter({
    getAll: publicProcedure
		.query(async ({ ctx }) => {
			return await ctx.prisma.cazatalentos.findMany();
		}
	),
	getTalentosDestacadosByCazatalento: protectedProcedure
		.query(async ({ctx }) => {
			const lang = (ctx.session && ctx.session.user) ? ctx.session.user.lang : 'es';
			const getResponse = ApiResponses('CazatalentosRouter_getTalentosDestacadosByCazatalento', lang);

			const user = ctx.session.user; 
			if (user && user.tipo_usuario === TipoUsuario.CAZATALENTOS) {
				const talentos_destacados = await ctx.prisma.talentosDestacados.findMany({
					where: {
						id_cazatalentos: parseInt(user.id),
						calificacion: 5
					},
					include: {
						talento: {
							include: {
								info_basica: {
									include: {
										union: {
											include: {
												union: true
											}
										},
										estado_republica: true,
									}
								},
								media: {
									include: {
										media: true
									}
								}
							},
						},
					}
				});
				return talentos_destacados;
			}
			throw new TRPCError({
				code: 'UNAUTHORIZED',
				message: getResponse('error_rol_invalido')
			});
		}
	),
	getByIdProyecto: publicProcedure
		.input(z.number())
		.query(async ({ input, ctx }) => {
			if (input <= 0) return null;
			const proyecto = await ctx.prisma.proyecto.findFirst({
				where: { id: input },
				include: {
					cazatalentos: {
						include: {
							redes_sociales: true,
							foto_perfil: true
						}
					}
				}
			})
			if (proyecto) {
				return proyecto.cazatalentos;
			}
			return null;
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
			const lang = (ctx.session && ctx.session.user) ? ctx.session.user.lang : 'es';
			const getResponse = ApiResponses('CazatalentosRouter_getReporteTalentoByCazatalento', lang);

			const user = ctx.session.user; 
			if (user && user.tipo_usuario === TipoUsuario.CAZATALENTOS) {
				const reporte = await ctx.prisma.reporteTalentos.findFirst({
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
				message: getResponse('error_rol_invalido'),
			});
		}
	),
	getNotaTalentoByCazatalento: protectedProcedure
		.input(z.object({ 
			id_talento: z.number(),
		}))
		.query(async ({ input, ctx }) => {
			const lang = (ctx.session && ctx.session.user) ? ctx.session.user.lang : 'es';
			const getResponse = ApiResponses('CazatalentosRouter_getNotaTalentoByCazatalento', lang);

			const user = ctx.session.user; 
			if (user && user.tipo_usuario === TipoUsuario.CAZATALENTOS) {
				const nota = await ctx.prisma.notasTalentos.findFirst({
					where: {
						id_cazatalentos: parseInt(user.id),
						id_talento: input.id_talento
					}
				});
				return nota;
			}
			throw new TRPCError({
				code: 'UNAUTHORIZED',
				message: getResponse('error_rol_invalido'),
			});
		}
	),
	getTalentoRatingByCazatalento: protectedProcedure
		.input(z.object({ 
			id_talento: z.number(),
		}))
		.query(async ({ input, ctx }) => {
			const lang = (ctx.session && ctx.session.user) ? ctx.session.user.lang : 'es';
			const getResponse = ApiResponses('CazatalentosRouter_getTalentoRatingByCazatalento', lang);

			const user = ctx.session.user; 
			if (user && user.tipo_usuario === TipoUsuario.CAZATALENTOS) {
				const destacado = await ctx.prisma.talentosDestacados.findFirst({
					where: {
						id_cazatalentos: parseInt(user.id),
						id_talento: input.id_talento
					}
				});
				return (destacado) ? destacado.calificacion : 0;
			}
			throw new TRPCError({
				code: 'UNAUTHORIZED',
				message: getResponse('error_rol_invalido'),
			});
		}
	),
	getAudicionTalentoByRol: protectedProcedure
		.input(z.object({ 
			id_talento: z.number(),
			id_rol: z.number()
		}))
		.query(async ({ input, ctx }) => {
			const lang = (ctx.session && ctx.session.user) ? ctx.session.user.lang : 'es';
			const getResponse = ApiResponses('CazatalentosRouter_getAudicionTalentoByRol', lang);

			const user = ctx.session.user; 
			if (user && user.tipo_usuario === TipoUsuario.CAZATALENTOS) {
				const audicion = await ctx.prisma.audicionTalento.findFirst({
					where: {
						id_rol: input.id_rol,
						id_talento: input.id_talento
					}
				});
				return audicion;
			}
			throw new TRPCError({
				code: 'UNAUTHORIZED',
				message: getResponse('error_rol_invalido'),
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
			const lang = (ctx.session && ctx.session.user) ? ctx.session.user.lang : 'es';
			const getResponse = ApiResponses('CazatalentosRouter_updateReporteTalento', lang);

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
				message: getResponse('error_rol_invalido'),
			});
		}
    ),
	updateNotaTalento: protectedProcedure
		.input(z.object({ 
			id_talento: z.number(),
			nota: z.string()
		}))
		.mutation(async ({ input, ctx }) => {
			const lang = (ctx.session && ctx.session.user) ? ctx.session.user.lang : 'es';
			const getResponse = ApiResponses('CazatalentosRouter_updateNotaTalento', lang);

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
				message: getResponse('error_rol_invalido'),
			});
		}
	),
	deleteNotaTalento: protectedProcedure
		.input(z.object({ 
			id_talento: z.number()
		}))
		.mutation(async ({ input, ctx }) => {
			const lang = (ctx.session && ctx.session.user) ? ctx.session.user.lang : 'es';
			const getResponse = ApiResponses('CazatalentosRouter_deleteNotaTalento', lang);

			const user = ctx.session.user; 
			if (user && user.tipo_usuario === TipoUsuario.CAZATALENTOS) {
				const result = await ctx.prisma.notasTalentos.deleteMany({
					where: {
						id_cazatalentos: parseInt(user.id),
						id_talento: input.id_talento
					}
				});
				
				return result;
			}
			throw new TRPCError({
				code: 'UNAUTHORIZED',
				message: getResponse('error_rol_invalido')
			});
		}
	),
	marcarComoVistoAplicacionRolTalento: protectedProcedure
		.input(z.object({ 
			id_rol: z.number(),
			id_talento: z.number(),
		}))
		.mutation(async ({ input, ctx }) => {
			const lang = (ctx.session && ctx.session.user) ? ctx.session.user.lang : 'es';
			const getResponse = ApiResponses('CazatalentosRouter_marcarComoVistoAplicacionRolTalento', lang);

			if (input.id_talento <= 0 || input.id_rol <= 0) return null;
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
							message: getResponse('different_cazatalento')
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
					message: getResponse('id_role_not_found'),
				});
			}
			throw new TRPCError({
				code: 'UNAUTHORIZED',
				message: getResponse('error_rol_invalido')
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
			const lang = (ctx.session && ctx.session.user) ? ctx.session.user.lang : 'es';
			const getResponse = ApiResponses('CazatalentosRouter_updateTalentoDestacado', lang);

			if (input.id_rol <= 0 || input.id_talento <= 0) return null;
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
							message: getResponse('different_cazatalento'),
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
					message: getResponse('id_role_not_found'),
				});
			}
			throw new TRPCError({
				code: 'UNAUTHORIZED',
				message: getResponse('error_rol_invalido'),
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
			const lang = (ctx.session && ctx.session.user) ? ctx.session.user.lang : 'es';
			const getResponse = ApiResponses('CazatalentosRouter_updateSeleccionTalento', lang);

			if (input.id_rol <= 0 || input.id_talento <= 0) return null;
			const fecha_audicion = dayjs(input.fecha_audicion, 'DD/MM/YYYY').toDate();
			const user = ctx.session.user; 
			if (user && user.tipo_usuario === TipoUsuario.CAZATALENTOS) {
				const rol = await ctx.prisma.roles.findFirst({
					where: {
						id: input.id_rol
					},
					include: {
						proyecto: {
							include: {
								cazatalentos: true
							}
						}
					}
				})
				if (rol) {
					if (parseInt(user.id) !== rol.proyecto.id_cazatalentos) {
						throw new TRPCError({
							code: 'UNAUTHORIZED',
							message: getResponse('different_cazatalento'),
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

					// mandar mensaje al talento acerca del cambio
					// obtenemos el proyecto en base al rol para obtener el cazatalentos al que se le enviara un mensaje
					const talento = await ctx.prisma.talentos.findFirst({
						where: {
							id: input.id_talento
						}
					})
					
					if (talento && rol) {
						let conversacion = await ctx.prisma.conversaciones.findFirst({
							where: {
								id_emisor: rol.proyecto.id_cazatalentos,
								tipo_usuario_emisor: TipoUsuario.CAZATALENTOS,
								id_receptor: input.id_talento,
								tipo_usuario_receptor: TipoUsuario.TALENTO,
								id_proyecto: rol.id_proyecto,
							}
						});
						if (!conversacion) {
							conversacion = await ctx.prisma.conversaciones.findFirst({
								where: {
									id_emisor: input.id_talento,
									tipo_usuario_emisor: TipoUsuario.TALENTO,
									id_receptor: rol.proyecto.id_cazatalentos,
									tipo_usuario_receptor: TipoUsuario.CAZATALENTOS,
									id_proyecto: rol.id_proyecto,
								}
							});
						}
						if (!conversacion) {
							conversacion = await ctx.prisma.conversaciones.create({
								data: {
									emisor_perfil_url: `/cazatalentos/dashboard?id_cazatalentos=${rol.proyecto.id_cazatalentos}`,
									receptor_perfil_url: `/talento/dashboard?id_talento=${talento.id}&id_rol=${rol.id}`,
									id_proyecto: rol.id_proyecto,
									id_emisor: rol.proyecto.id_cazatalentos,
									tipo_usuario_emisor: TipoUsuario.CAZATALENTOS,
									id_receptor: input.id_talento,
									tipo_usuario_receptor: TipoUsuario.TALENTO,
								}
							})
						}
						if (conversacion) {
							await ctx.prisma.mensaje.create({
								data: {
									id_conversacion: conversacion.id,
									id_emisor: rol.proyecto.id_cazatalentos,
									tipo_usuario_emisor: TipoUsuario.CAZATALENTOS,
									id_receptor: input.id_talento,
									tipo_usuario_receptor: TipoUsuario.TALENTO,
									visto: false,
									hora_envio: dayjs().toDate(),
									mensaje: JSON.stringify({
										message: getResponse('cazatalento_message').replace('[N1]', `${rol.proyecto.cazatalentos.nombre}`).replace('[N2]', `${rol.proyecto.cazatalentos.apellido}`)
										.replace('[N3]', `${input.tipo_audicion}`).replace('[N4]', `${rol.nombre}`)
										.replace('[N5]', `${rol.proyecto.nombre}`).replace('[N6]', `${input.fecha_audicion}`)
									}),
									type: TipoMensajes.TEXT
								}
							})
							if (input.mensaje.length > 0) {
								await ctx.prisma.mensaje.create({
									data: {
										id_conversacion: conversacion.id,
										id_emisor: rol.proyecto.id_cazatalentos,
										tipo_usuario_emisor: TipoUsuario.CAZATALENTOS,
										id_receptor: input.id_talento,
										tipo_usuario_receptor: TipoUsuario.TALENTO,
										visto: false,
										hora_envio: dayjs().toDate(),
										mensaje: JSON.stringify({
											message: input.mensaje
										}),
										type: TipoMensajes.TEXT
									}
								})
							}
						}
						const cazatalentos = await ctx.prisma.cazatalentos.findFirst({
							where: {
								id: rol.proyecto.id_cazatalentos
							}
						})

						const _alerta_msg = input.tipo_audicion.toLowerCase() === 'callback' ? getResponse('cazatalento_alerta_callback') : getResponse('cazatalento_alerta_audicion');

						await ctx.prisma.alertas.create({
							data: {
								id_usuario: talento.id,
								tipo_usuario: TipoUsuario.TALENTO,
								visto: false,
								mensaje: _alerta_msg.replace('[N1]', `${input.tipo_audicion}`).replace('[N2]', `${rol.proyecto.nombre}`)
							}
						})
					}
					return audicion;
				}
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: getResponse('id_role_not_found')
				});
			}
			throw new TRPCError({
				code: 'UNAUTHORIZED',
				message: getResponse('error_rol_invalido')
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
			biografia: z.string(),
			redes_sociales: z.array(z.object({
				nombre: z.string(),
				url: z.string()
			})).nullish()
		}))
		.mutation(async ({ input, ctx }) => {
			const lang = (ctx.session && ctx.session.user) ? ctx.session.user.lang : 'es';
			const getResponse = ApiResponses('CazatalentosRouter_updatePerfil', lang);

			if (input.biografia.length > 500) {
				throw new TRPCError({
					code: 'PRECONDITION_FAILED',
					message: getResponse('error_max_biografia_length')
				});
			}

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
						message: getResponse('error_update_cazatalento')
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
						message: getResponse('error_delete_redes_sociales')
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
								message: getResponse('error_save_redes_sociales')
							});
						}
					}
				}
				return cazatalento;
			}
			throw new TRPCError({
				code: 'UNAUTHORIZED',
				message: getResponse('error_rol_invalido')
			});
		}
    )
});