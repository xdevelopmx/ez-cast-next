import { TRPCError } from "@trpc/server";
import { FileManager } from "~/utils/file-manager";
import { z } from "zod";

import {
	createTRPCRouter,
	publicProcedure,
	protectedProcedure,
} from "~/server/api/trpc";
import { TipoConversaciones, TipoMensajes, TipoUsuario } from "~/enums";
import { Troubleshoot } from "@mui/icons-material";
import Constants from "~/constants";
import { Mensaje } from "@prisma/client";
import dayjs from "dayjs";
import ApiResponses from "~/utils/api-response";

export type NewRol = {
	id_rol: number,
	info_gral: {
		nombre: string,
		id_tipo_rol: number,
		id_proyecto: number,
		tipo_trabajo: number[]
	},
	compensaciones: {
		compensacion: {
			datos_adicionales: string,
			suma_total_compensaciones_no_monetarias?: number
		},
		sueldo?: {
			cantidad_sueldo: number,
			periodo_sueldo: string,
		},
		compensaciones_no_monetarias?: { id_compensacion: number, descripcion_compensacion: string }[]
	},
	filtros_demograficos: {
		generos?: number[],
		apariencias_etnias?: number[],
		animal?: {
			id: number,
			descripcion: string,
			tamanio: string
		},
		rango_edad_inicio: number,
		rango_edad_fin: number,
		rango_edad_en_meses: boolean,
		id_pais: number
	},
	descripcion_rol: {
		descripcion: string,
		detalles_adicionales?: string,
		habilidades: number[],
		especificacion_habilidad: string,
		id_color_cabello: number,
		id_color_ojos: number,
		nsfw?: {
			ids: number[],
			descripcion: string
		},
		lineas?: {
			base64: string,
			extension: string
		},
		foto_referencia?: {
			base64: string,
			extension: string
		}
	},
	casting: {
		id_estado_republica: number,
		fechas: {
			inicio: Date,
			fin?: Date,
		}[]
	},
	filmaciones: {
		id_estado_republica: number,
		fechas: {
			inicio: Date,
			fin?: Date,
		}[]
	},
	requisitos: {
		fecha_presentacion: string,
		id_uso_horario: number,
		info_trabajo: string,
		id_idioma: number,
		medios_multimedia_a_incluir: number[],
		id_estado_donde_aceptan_solicitudes: number
	},
	selftape: {
		indicaciones: string,
		pedir_selftape: boolean,
		lineas?: {
			base64: string,
			extension: string
		}
	}
}

export const RolesRouter = createTRPCRouter({
	getById: publicProcedure
		.input(z.object({ id: z.number() }))
		.query(async ({ input, ctx }) => {
			const rol = await ctx.prisma.roles.findUnique({
				where: { id: input.id }
			});
			return rol;
		}
		),
	getFechasCasting: protectedProcedure
		.input(z.number())
		.query(async ({ input, ctx }) => {
			if (input <= 0) return null;
			const rol = await ctx.prisma.roles.findUnique({
				where: { id: input },
				include: {
					casting: true
				}
			});
			const dates = new Set<string>();
			if (rol) {
				rol.casting.forEach((date) => {
					const start_day = date.fecha_inicio.getDate() + 1;
					const end_day = ((date.fecha_fin) ? date.fecha_fin.getDate() : date.fecha_inicio.getDate()) + 1;
					const start_month = date.fecha_inicio.getMonth();
					const end_month = (date.fecha_fin) ? date.fecha_fin.getMonth() : date.fecha_inicio.getMonth();
					const start_year = date.fecha_inicio.getFullYear();
					const end_year = (date.fecha_fin) ? date.fecha_fin.getFullYear() : date.fecha_inicio.getFullYear();
					for (let y = start_year; y <= end_year; y++) {
						let final_month = end_month;
						let initial_month = start_month;
						if (y !== end_year) {
							final_month = 11;
						}
						if (start_year !== end_year && y === end_year) {
							initial_month = 0;
						}
						for (let m = initial_month; m <= final_month; m++) {
							const final_day = (m !== end_month) ? 31 : end_day;
							const initial_day = (m !== start_month) ? 1 : start_day;
							for (let d = initial_day; d <= final_day; d++) {
								dates.add(`${d < 10 ? `0${d}` : d}/${m < 9 ? `0${m + 1}` : m + 1}/${y}`)
							}
						}
					}
				});
			}
			return dates;
		}
	),
	getRolWithApplicationsById: publicProcedure
		.input(z.object({
			start: z.number(),
			end: z.number(),
			id_rol: z.number(),
			id_estado_aplicacion: z.number(),
		}))
		.query(async ({ input, ctx }) => {
			if (input.id_rol <= 0) return null;
			const applications_where: { id_rol: number, id_estado_aplicacion?: number } = {
				id_rol: input.id_rol
			}
			if (input.id_estado_aplicacion > 0) {
				applications_where.id_estado_aplicacion = input.id_estado_aplicacion;
			}
			const count_applications = await ctx.prisma.aplicacionRolPorTalento.count({
				where: applications_where
			});
			const rol_con_cazatalento = await ctx.prisma.roles.findUnique({
				where: { id: input.id_rol },
				include: {
					proyecto: true
				}
			});
			let id_cazatalento = 0;
			if (rol_con_cazatalento) {
				id_cazatalento = rol_con_cazatalento.proyecto.id_cazatalentos;
			}
			const rol = await ctx.prisma.roles.findUnique({
				where: { id: input.id_rol },
				include: {
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
					tipo_rol: true,
					aplicaciones_por_talento: {
						skip: input.start,
						take: input.end,
						where: applications_where,
						include: {
							talento: {
								include: {
									media: {
										include: {
											media: true
										}
									},
									destacados: {
										where: {
											id_cazatalentos: id_cazatalento
										}
									},
									info_basica: {
										include: {
											estado_republica: true,
											union: {
												include: {
													union: true
												}
											}
										}
									}

								},
							}
						}
					}
				}
			});
			if (count_applications && rol) {
				return { count_applications: count_applications, rol: rol };
			}
			return null;
		}
	),
	getCompleteById: publicProcedure
		.input(z.number())
		.query(async ({ input, ctx }) => {
			if (input <= 0) return null;
			const rol = await ctx.prisma.roles.findUnique({
				where: { id: input },
				include: {
					lineas: true,
					foto_referencia: true,
					tipo_trabajos: true,
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
					selftape: {
						include: {
							lineas: true
						}
					},
					tipo_rol: true,
				}
			});
			return rol;
		}
	),
	getRolWithProyectoById: publicProcedure
		.input(z.number())
		.query(async ({ input, ctx }) => {
			if (input <= 0) return null;
			const rol = await ctx.prisma.roles.findUnique({
				where: { id: input },
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
					tipo_trabajos: true,
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
					color_cabello: true,
					color_ojos: true,
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
			
					proyecto: {
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
							cazatalentos: {
								include: {
									foto_perfil: true,
									redes_sociales: true
								}
							}
						}
					}
				}
			});
			return rol;
		}
	),
	getAll: publicProcedure.query(async ({ ctx }) => {
		return await ctx.prisma.roles.findMany();
	}),
	createAplicacionTalento: publicProcedure.input(z.object({
		id_rol: z.number(),
		id_talento: z.number(),
		id_ubicacion: z.number(),
		nota: z.string()
	})).mutation(async ({ input, ctx }) => {
		const lang = (ctx.session && ctx.session.user) ? ctx.session.user.lang : 'es';
		const getResponse = ApiResponses('RolesRouter_createAplicacionTalento', lang);

		if (input.id_rol <= 0 || input.id_talento <= 0 || input.id_ubicacion <= 0) return null;
		const result = await ctx.prisma.aplicacionRolPorTalento.create({
			data: {
				id_rol: input.id_rol,
				id_talento: input.id_talento,
				id_ubicacion: input.id_ubicacion,
				id_estado_aplicacion: Constants.ESTADOS_APLICACION_ROL.NO_VISTO,
				nota: input.nota
			}
		})

		if (result) {
			// obtenemos el proyecto en base al rol para obtener el cazatalentos al que se le enviara un mensaje
			const talento = await ctx.prisma.talentos.findFirst({
				where: {
					id: input.id_talento
				}
			})
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
			if (talento && rol) {
				let conversacion = await ctx.prisma.conversaciones.findFirst({
					where: {
						id_emisor: input.id_talento,
						tipo_usuario_emisor: TipoUsuario.TALENTO,
						id_receptor: rol.proyecto.id_cazatalentos,
						tipo_usuario_receptor: TipoUsuario.CAZATALENTOS,
						id_proyecto: rol.id_proyecto
					}
				});
				if (!conversacion) {
					conversacion = await ctx.prisma.conversaciones.findFirst({
						where: {
							id_emisor: rol.proyecto.id_cazatalentos,
							tipo_usuario_emisor: TipoUsuario.CAZATALENTOS,
							id_receptor: input.id_talento,
							tipo_usuario_receptor: TipoUsuario.TALENTO,
							id_proyecto: rol.id_proyecto
						}
					});
				}
				if (!conversacion) {
					conversacion = await ctx.prisma.conversaciones.create({
						data: {
							receptor_perfil_url: `/cazatalentos/dashboard?id_cazatalentos=${rol.proyecto.id_cazatalentos}`,
							emisor_perfil_url: `/talento/dashboard?id_talento=${talento.id}&id_rol=${rol.id}`,
							id_proyecto: rol.id_proyecto,
							id_emisor: input.id_talento,
							tipo_usuario_emisor: TipoUsuario.TALENTO,
							id_receptor: rol.proyecto.id_cazatalentos,
							tipo_usuario_receptor: TipoUsuario.CAZATALENTOS,
						}
					})
				}
				if (conversacion) {
					await ctx.prisma.mensaje.create({
						data: {
							id_conversacion: conversacion.id,
							id_emisor: input.id_talento,
							tipo_usuario_emisor: TipoUsuario.TALENTO,
							id_receptor: rol.proyecto.id_cazatalentos,
							tipo_usuario_receptor: TipoUsuario.CAZATALENTOS,
							visto: false,
							hora_envio: dayjs().toDate(),
							mensaje: JSON.stringify({
								message: `El talento ${talento.nombre} ${talento.apellido}, se ha postulado al rol de ${rol.nombre} del proyecto ${rol.proyecto.nombre}, puedes ver los detalles en el casting billboard.`
							}),
							type: TipoMensajes.TEXT
						}
					})
				}
				const cazatalentos = await ctx.prisma.cazatalentos.findFirst({
					where: {
						id: rol.proyecto.id_cazatalentos
					}
				})
				if (cazatalentos) {
					await ctx.prisma.alertas.create({
						data: {
							id_usuario: rol.proyecto.id_cazatalentos,
							tipo_usuario: TipoUsuario.CAZATALENTOS,
							visto: false,
							mensaje: `<p>¡Hola <b>${cazatalentos.nombre} ${cazatalentos.apellido}</b>! Has recibido
							<span style="color: white;">nuevas aplicaciones</span> para tu proyecto <b>${rol.proyecto.nombre}</b>, accede a tu <a style="text-decoration: underline; color: white;" href="/cazatalentos/billboard"> billboard personalizado</a> y selecciona
							a tus favoritos utilizando la herramienta <span style="color: white">destacado</span>.</p>`
						}
					})
				}
			}
		}

		return result;
	}),
	updateAplicacionesTalentoByIdRolAndIdTalento: publicProcedure.input(z.object({
		talentos: z.array(z.object({
			id_rol: z.number(),
			id_talento: z.number()
		})),
		estado_aplicacion: z.number(),
	})).mutation(async ({ input, ctx }) => {
		console.log('el input', input);
		if (input.estado_aplicacion <= 0 || input.talentos.length === 0) return null;
		return Promise.all(await input.talentos.map(async (talento) => {
			return await ctx.prisma.aplicacionRolPorTalento.updateMany({
				where: {
					id_rol: talento.id_rol,
					id_talento: talento.id_talento
				},
				data: {
					id_estado_aplicacion: input.estado_aplicacion
				}
			})
        }))
	}),
	getAllAplicacionesTalentoByProyecto: publicProcedure.input(z.object({
		id_proyecto: z.number(),
		estados_aplicaciones: z.array(z.number()).nullish()
	})).query(async ({ input, ctx }) => {
		if (input.id_proyecto <= 0) return null;
		return await ctx.prisma.roles.findMany({
			where: {
				id_proyecto: input.id_proyecto,
			},
			include: {
				aplicaciones_por_talento: {
					where: (input.estados_aplicaciones && input.estados_aplicaciones.length > 0) ? {
						id_estado_aplicacion: {
							in: input.estados_aplicaciones
						}
					} : undefined,
					include: {
						talento: {
							include: {
								destacados: true,
								notas: true,
								media: {
									include: {
										media: true
									}
								}
							}
						}
					}
				},
			}
		});
	}),
	getAllCompleteByProyecto: publicProcedure.input(z.number()).query(async ({ input, ctx }) => {
		if (input <= 0) return null;
		return await ctx.prisma.roles.findMany({
			where: {
				id_proyecto: input,
			},
			include: {
				lineas: true,
				foto_referencia: true,
				aplicaciones_por_talento: {
					include: {
						talento: {
							include: {
								media: {
									include: {
										media: true
									}
								}
							}
						}
					}
				},
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
				selftape: {
					include: {
						lineas: true
					}
				},
				tipo_rol: true,
			}
		});
	}),
	getAllByProyecto: publicProcedure.input(z.number()).query(async ({ input, ctx }) => {
		if (input <= 0) return null;
		return await ctx.prisma.roles.findMany({
			where: {
				id_proyecto: input
			},
			orderBy: {
				id: 'asc',
			},
		});
	}),
	deleteRolById: protectedProcedure
		.input(z.number())
		.mutation(async ({ input, ctx }) => {
			const lang = (ctx.session && ctx.session.user) ? ctx.session.user.lang : 'es';
			const getResponse = ApiResponses('RolesRouter_deleteRolById', lang);

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
			const lang = (ctx.session && ctx.session.user) ? ctx.session.user.lang : 'es';
			const getResponse = ApiResponses('RolesRouter_updateEstadoRolById', lang);

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
	saveRolFiles: protectedProcedure
		.input(z.object({
			id_rol: z.number(),
			foto_referencia: z.object({
				id: z.number().nullish(),
				nombre: z.string(),
				type: z.string(),
				url: z.string(),
				clave: z.string(),
				referencia: z.string(),
				identificador: z.string()
			}).nullish(),
			lineas: z.object({
				id: z.number().nullish(),
				nombre: z.string(),
				type: z.string(),
				url: z.string(),
				clave: z.string(),
				referencia: z.string(),
				identificador: z.string()
			}).nullish(),
			lineas_selftape: z.object({
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
			const lang = (ctx.session && ctx.session.user) ? ctx.session.user.lang : 'es';
			const getResponse = ApiResponses('RolesRouter_saveRolFiles', lang);

			console.log('INPUT saveRolFiles', input)
			const user = ctx.session.user;
			if (user && user.tipo_usuario === TipoUsuario.CAZATALENTOS) {
				let rol = await ctx.prisma.roles.findFirst({
					where: {
						id: input.id_rol
					},
					include: {
						selftape: true
					}
				});

				if (rol) {
					if (rol.id_media_lineas && (!input.lineas || (input.lineas && input.lineas.id && input.lineas.id === 0))) {
						const lineas = await ctx.prisma.media.findFirst({
							where: {
								id: rol.id_media_lineas
							},
						});
						if (lineas) {
							await FileManager.deleteFiles([lineas.clave]);
						}
						await ctx.prisma.media.delete({
							where: {
								id: rol.id_media_lineas
							},
						});
					}
					if (input.lineas) {
						const updated_lineas = await ctx.prisma.media.upsert({
							where: {
								id: (input.lineas.id) ? input.lineas.id : 0
							},
							update: {
								nombre: input.lineas.nombre,
								type: input.lineas.type,
								url: input.lineas.url,
								clave: input.lineas.clave,
								referencia: input.lineas.referencia,
								identificador: input.lineas.identificador,
							},
							create: {
								nombre: input.lineas.nombre,
								type: input.lineas.type,
								url: input.lineas.url,
								clave: input.lineas.clave,
								referencia: input.lineas.referencia,
								identificador: input.lineas.identificador,
							},
						})
						rol = await ctx.prisma.roles.update({
							where: {
								id: rol.id
							},
							include: {
								selftape: true,
							},
							data: {
								id_media_lineas: updated_lineas.id,
							}
						})
					} else {
						rol = await ctx.prisma.roles.update({
							where: {
								id: rol.id
							},
							include: {
								selftape: true,
							},
							data: {
								id_media_lineas: null,
							}
						})
					}

					if (rol.id_media_foto_referencia && (!input.foto_referencia || (input.foto_referencia && input.foto_referencia.id && input.foto_referencia.id === 0))) {
						const foto = await ctx.prisma.media.findFirst({
							where: {
								id: rol.id_media_foto_referencia
							}
						})
						if (foto) {
							await FileManager.deleteFiles([foto.clave]);
						}
						await ctx.prisma.media.delete({
							where: {
								id: rol.id_media_foto_referencia
							},
						});
					}

					if (input.foto_referencia) {
						const updated_foto_referencia = await ctx.prisma.media.upsert({
							where: {
								id: (input.foto_referencia.id) ? input.foto_referencia.id : 0
							},
							update: {
								nombre: input.foto_referencia.nombre,
								type: input.foto_referencia.type,
								url: input.foto_referencia.url,
								clave: input.foto_referencia.clave,
								referencia: input.foto_referencia.referencia,
								identificador: input.foto_referencia.identificador,
							},
							create: {
								nombre: input.foto_referencia.nombre,
								type: input.foto_referencia.type,
								url: input.foto_referencia.url,
								clave: input.foto_referencia.clave,
								referencia: input.foto_referencia.referencia,
								identificador: input.foto_referencia.identificador,
							},
						})
						rol = await ctx.prisma.roles.update({
							where: {
								id: rol.id
							},
							include: {
								selftape: true,
							},
							data: {
								id_media_foto_referencia: updated_foto_referencia.id
							}
						})

					} else {
						rol = await ctx.prisma.roles.update({
							where: {
								id: rol.id
							},
							include: {
								selftape: true,
							},
							data: {
								id_media_foto_referencia: null
							}
						})
					}

					if (rol.selftape) {
						if (rol.selftape.id_media_lineas && (!input.lineas_selftape || (input.lineas_selftape && input.lineas_selftape.id && input.lineas_selftape.id === 0))) {
							const self_lines = await ctx.prisma.media.findFirst({
								where: {
									id: rol.selftape.id_media_lineas
								}
							})
							if (self_lines) {
								await FileManager.deleteFiles([self_lines.clave]);
							}
							await ctx.prisma.media.delete({
								where: {
									id: rol.selftape.id_media_lineas
								},
							});
						}
						if (input.lineas_selftape) {
							const updated_lineas = await ctx.prisma.media.upsert({
								where: {
									id: (input.lineas_selftape.id) ? input.lineas_selftape.id : 0
								},
								update: {
									nombre: input.lineas_selftape.nombre,
									type: input.lineas_selftape.type,
									url: input.lineas_selftape.url,
									clave: input.lineas_selftape.clave,
									referencia: input.lineas_selftape.referencia,
									identificador: input.lineas_selftape.identificador,
								},
								create: {
									nombre: input.lineas_selftape.nombre,
									type: input.lineas_selftape.type,
									url: input.lineas_selftape.url,
									clave: input.lineas_selftape.clave,
									referencia: input.lineas_selftape.referencia,
									identificador: input.lineas_selftape.identificador,
								},
							})

							rol.selftape = await ctx.prisma.selftapePorRoles.update({
								where: {
									id_rol: rol.id
								},
								data: {
									id_media_lineas: updated_lineas.id,
								}
							})
						} else {
							rol.selftape = await ctx.prisma.selftapePorRoles.update({
								where: {
									id_rol: rol.id
								},
								data: {
									id_media_lineas: null,
								}
							})
						}
					}
				}

				return rol;
			}
			throw new TRPCError({
				code: 'UNAUTHORIZED',
				message: 'Solo el rol de cazatalento puede modificar la informacion del rol',
				// optional: pass the original error to retain stack trace
				//cause: theError,
			});
		}
		),
	saveRol: publicProcedure
		.input(z.object({
			id_rol: z.number(),
			info_gral: z.object({
				nombre: z.string(),
				id_tipo_rol: z.number(),
				id_proyecto: z.number(),
				tipo_trabajo: z.array(z.number())
			}),
			compensaciones: z.object({
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
				).nullish(),
			}),
			filtros_demograficos: z.object({
				generos: z.array(z.number()).nullish(),
				apariencias_etnias: z.array(z.number()).nullish(),
				animal: z.object({
					id: z.number(),
					descripcion: z.string(),
					tamanio: z.string()
				}).nullish(),
				rango_edad_inicio: z.number(),
				rango_edad_fin: z.number(),
				rango_edad_en_meses: z.boolean(),
				id_pais: z.number(),
			}).nullish(),
			descripcion_rol: z.object({
				descripcion: z.string(),
				detalles_adicionales: z.string().nullish(),
				habilidades: z.array(z.number()),
				especificacion_habilidad: z.string(),
				id_color_cabello: z.number(),
				id_color_ojos: z.number(),
				nsfw: z.object({
					ids: z.array(z.number()),
					descripcion: z.string()
				}).nullish(),
			}),
			casting: z.object({
				id_estado_republica: z.number(),
				fechas: z.array(z.object({
					inicio: z.date(),
					fin: z.date().nullish(),
				}))
			}),
			filmaciones: z.object({
				id_estado_republica: z.number(),
				fechas: z.array(z.object({
					inicio: z.date(),
					fin: z.date().nullish(),
				})),
			}),
			requisitos: z.object({
				fecha_presentacion: z.string(),
				id_uso_horario: z.number(),
				info_trabajo: z.string(),
				id_idioma: z.number(),
				medios_multimedia_a_incluir: z.array(z.number()),
				id_estado_donde_aceptan_solicitudes: z.number()
			}),
			selftape: z.object({
				indicaciones: z.string(),
				pedir_selftape: z.boolean(),
			})
		}))
		.mutation(async ({ input, ctx }) => {
			const lang = (ctx.session && ctx.session.user) ? ctx.session.user.lang : 'es';
			const getResponse = ApiResponses('RolesRouter_saveRol', lang);
			if (input.filtros_demograficos) {
				if (input.filtros_demograficos.rango_edad_inicio > 110 || input.filtros_demograficos.rango_edad_inicio <= 0 || input.filtros_demograficos.rango_edad_fin > 110 || input.filtros_demograficos.rango_edad_fin <= 0) {
					throw new TRPCError({
						code: 'PRECONDITION_FAILED',
						message: getResponse('invalid_age')
					});
				}
				if (input.filtros_demograficos.id_pais <= 0) {
					throw new TRPCError({
						code: 'PRECONDITION_FAILED',
						message: getResponse('invalid_pais')
					});
				}
			}
			if (input.descripcion_rol) {
				if (input.descripcion_rol.descripcion.length > 500) {
					throw new TRPCError({
						code: 'PRECONDITION_FAILED',
						message: getResponse('invalid_descripcion')
					});
				}
				if (input.descripcion_rol.nsfw && input.descripcion_rol.nsfw.descripcion.length > 500) {
					throw new TRPCError({
						code: 'PRECONDITION_FAILED',
						message: getResponse('invalid_descripcion_nsfw')
					});
				}
			}
			if (input.casting && input.casting.fechas.length === 0) {
				throw new TRPCError({
					code: 'PRECONDITION_FAILED',
					message: getResponse('invalid_castings')
				});
			} 
			if (input.filmaciones && input.filmaciones.fechas.length === 0) {
				throw new TRPCError({
					code: 'PRECONDITION_FAILED',
					message: getResponse('invalid_filmaciones')
				});
			}
			if (input.requisitos && input.requisitos.info_trabajo.length > 500) {
				throw new TRPCError({
					code: 'PRECONDITION_FAILED',
					message: getResponse('invalid_requisitos')
				});
			}
			if (input.selftape && input.selftape.indicaciones.length > 500) {
				throw new TRPCError({
					code: 'PRECONDITION_FAILED',
					message: getResponse('invalid_selftape')
				});
			}
			const rol = await ctx.prisma.roles.upsert({
				where: {
					id: input.id_rol
				},
				update: {
					nombre: input.info_gral.nombre,
					id_tipo_rol: input.info_gral.id_tipo_rol,
					id_color_ojos: input.descripcion_rol.id_color_cabello,
					id_color_cabello: input.descripcion_rol.id_color_cabello
				},
				create: {
					nombre: input.info_gral.nombre,
					id_tipo_rol: input.info_gral.id_tipo_rol,
					id_proyecto: input.info_gral.id_proyecto,
					id_color_ojos: input.descripcion_rol.id_color_cabello,
					id_color_cabello: input.descripcion_rol.id_color_cabello
				},
			})

			// TIPO DE TRABAJO

			await ctx.prisma.tipoTrabajoPorRoles.deleteMany({
				where: {
					id_rol: rol.id
				}
			})

			await ctx.prisma.tipoTrabajoPorRoles.createMany({
				data: input.info_gral.tipo_trabajo.map(t => {
					return {
						id_rol: rol.id,
						id_tipo_trabajo: t
					}
				})
			})

			// COMPENSACIONES

			const compensaciones = await ctx.prisma.compensacionesPorRoles.upsert({
				where: {
					id_rol: rol.id
				},
				update: {
					datos_adicionales: input.compensaciones.compensacion.datos_adicionales,
					suma_total_compensaciones_no_monetarias: input.compensaciones.compensacion.suma_total_compensaciones_no_monetarias
				},
				create: {
					id_rol: rol.id,
					datos_adicionales: input.compensaciones.compensacion.datos_adicionales,
					suma_total_compensaciones_no_monetarias: input.compensaciones.compensacion.suma_total_compensaciones_no_monetarias
				},
			})

			if (!compensaciones) {
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: getResponse('error_save_comp')
				});
			}

			if (input.compensaciones.sueldo) {
				const sueldo = await ctx.prisma.sueldosPorRoles.upsert({
					where: {
						id_comp_por_rol: compensaciones.id
					},
					update: {
						cantidad: input.compensaciones.sueldo.cantidad_sueldo,
						periodo: input.compensaciones.sueldo.periodo_sueldo.toUpperCase(),
					},
					create: {
						id_comp_por_rol: compensaciones.id,
						cantidad: input.compensaciones.sueldo.cantidad_sueldo,
						periodo: input.compensaciones.sueldo.periodo_sueldo.toUpperCase(),
					},
				})
				if (!sueldo) {
					throw new TRPCError({
						code: 'INTERNAL_SERVER_ERROR',
						message: getResponse('error_save_sueldo')
					});
				}
			} else {
				try {
					await ctx.prisma.sueldosPorRoles.delete({ where: { id_comp_por_rol: compensaciones.id } });
				} catch (e) { }
			}
			try {
				await ctx.prisma.compNoMonetariasPorRoles.deleteMany({ where: { id_comp_por_rol: compensaciones.id } });
			} catch (e) { }

			if (input.compensaciones.compensaciones_no_monetarias) {
				const saved_compensaciones_no_monetarias = await ctx.prisma.compNoMonetariasPorRoles.createMany({
					data: input.compensaciones.compensaciones_no_monetarias.map(c => {
						const comp_no_mone: { id_compensacion: number, descripcion_compensacion: string, id_comp_por_rol: number } = { ...c, id_comp_por_rol: compensaciones.id }
						return comp_no_mone;
					})
				})
				if (!saved_compensaciones_no_monetarias) {
					throw new TRPCError({
						code: 'INTERNAL_SERVER_ERROR',
						message: getResponse('error_save_comp_mone')
					});
				}
			}

			// FILTROS DEMOGRAFICOS
			if (input.filtros_demograficos) {

				const filtros_demograficos = await ctx.prisma.filtrosDemoPorRoles.upsert({
					where: {
						id_rol: rol.id
					},
					update: {
						rango_edad_inicio: input.filtros_demograficos.rango_edad_inicio,
						rango_edad_fin: input.filtros_demograficos.rango_edad_fin,
						rango_edad_en_meses: input.filtros_demograficos.rango_edad_en_meses,
						id_pais: input.filtros_demograficos.id_pais
					},
					create: {
						id_rol: rol.id,
						rango_edad_inicio: input.filtros_demograficos.rango_edad_inicio,
						rango_edad_fin: input.filtros_demograficos.rango_edad_fin,
						rango_edad_en_meses: input.filtros_demograficos.rango_edad_en_meses,
						id_pais: input.filtros_demograficos.id_pais
					}
				})

				if (!filtros_demograficos) {
					throw new TRPCError({
						code: 'INTERNAL_SERVER_ERROR',
						message: getResponse('error_save_filtros')
					});
				}

				try {
					await ctx.prisma.generosPorRoles.deleteMany({ where: { id_filtro_demo_por_rol: filtros_demograficos.id } });
				} catch (e) { }

				if (input.filtros_demograficos.generos) {
					const saved_generos = await ctx.prisma.generosPorRoles.createMany({
						data: input.filtros_demograficos.generos.map(g => { return { id_genero: g, id_filtro_demo_por_rol: filtros_demograficos.id } })
					});
					if (!saved_generos) {
						throw new TRPCError({
							code: 'INTERNAL_SERVER_ERROR',
							message: getResponse('error_save_generos')
						});
					}
				}

				try {
					await ctx.prisma.aparenciasEtnicasPorRoles.deleteMany({ where: { id_filtro_demo_por_rol: filtros_demograficos.id } });
				} catch (e) { }

				if (input.filtros_demograficos.apariencias_etnias) {
					const saved_etnias = await ctx.prisma.aparenciasEtnicasPorRoles.createMany({
						data: input.filtros_demograficos.apariencias_etnias.map(e => { return { id_aparencia_etnica: e, id_filtro_demo_por_rol: filtros_demograficos.id } })
					});
					if (!saved_etnias) {
						throw new TRPCError({
							code: 'INTERNAL_SERVER_ERROR',
							message: getResponse('error_save_etnias')
						});
					}
				}

				try {
					await ctx.prisma.animalPorRoles.deleteMany({ where: { id_filtro_demo_por_rol: filtros_demograficos.id } });
				} catch (e) { }

				if (input.filtros_demograficos.animal) {
					const saved_animal = await ctx.prisma.animalPorRoles.create({
						data: {
							id_filtro_demo_por_rol: filtros_demograficos.id,
							id_animal: input.filtros_demograficos.animal.id,
							descripcion: input.filtros_demograficos.animal.descripcion,
							tamanio: input.filtros_demograficos.animal.tamanio
						}
					});
					if (!saved_animal) {
						throw new TRPCError({
							code: 'INTERNAL_SERVER_ERROR',
							message: getResponse('error_save_animal')
						});
					}
				}
			}

			// DESCRIPCION

			const rol_updated = await ctx.prisma.roles.update({
				where: {
					id: rol.id
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
					descripcion: input.descripcion_rol.descripcion,
					detalles_adicionales: input.descripcion_rol.detalles_adicionales,
				}
			});
			if (!rol_updated) {
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: getResponse('error_save_rol')
				});
			}
			
			await ctx.prisma.habilidadesPorRoles.deleteMany({ where: { id_rol: rol.id } });

			const habilidades_por_rol = await ctx.prisma.habilidadesPorRoles.create({
				data: {
					id_rol: rol.id,
					especificacion: input.descripcion_rol.especificacion_habilidad
				}
			});

			if (!habilidades_por_rol) {
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: getResponse('error_save_habilidades')
				});
			}

			const habilidades_seleccionadas_por_rol = await ctx.prisma.habilidadesSelecPorRoles.createMany({
				data: input.descripcion_rol.habilidades.map(h => { return { id_habilidad: h, id_habilidades_por_rol: habilidades_por_rol.id } })
			});

			if (!habilidades_seleccionadas_por_rol) {
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: getResponse('error_save_habilidades_seleccionadas')
				});
			}

			if (rol_updated.nsfw && rol_updated.nsfw.nsfw_seleccionados.length > 0) {
				try {
					await ctx.prisma.nSFWPorRoles.delete({ where: { id_rol: rol.id } });
				} catch (e) { }
			}

			if (input.descripcion_rol.nsfw) {
				const nsfw_por_rol = await ctx.prisma.nSFWPorRoles.create({
					data: {
						id_rol: rol.id,
						descripcion: input.descripcion_rol.nsfw.descripcion
					}
				});
				if (!nsfw_por_rol) {
					throw new TRPCError({
						code: 'INTERNAL_SERVER_ERROR',
						message: getResponse('error_save_nsfw')
					});
				}
				const nsfw_seleccionados_por_rol = await ctx.prisma.nSFWSeleccionadosPorRoles.createMany({
					data: input.descripcion_rol.nsfw.ids.map(id => { return { id_nsfw: id, id_nsfw_por_rol: nsfw_por_rol.id } })
				});
				if (!nsfw_seleccionados_por_rol) {
					throw new TRPCError({
						code: 'INTERNAL_SERVER_ERROR',
						message: getResponse('error_save_nsfw_seleccionados')
					});
				}
			}

			// CASTING
			try {
				await ctx.prisma.castingPorRoles.deleteMany({ where: { id_rol: rol.id } });
			} catch (e) { }

			const saved_fechas_casting = await ctx.prisma.castingPorRoles.createMany({
				data: input.casting.fechas.map((dates) => {
					return {
						id_rol: rol.id,
						id_estado_republica: input.casting.id_estado_republica,
						fecha_inicio: dates.inicio,
						fecha_fin: dates.fin
					}
				})
			});
			if (!saved_fechas_casting) {
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: getResponse('error_save_fechas_casting')
				});
			}

			// FILMACIONES
			try {
				await ctx.prisma.filmacionPorRoles.deleteMany({ where: { id_rol: rol.id } });
			} catch (e) { }

			const saved_fechas_filmaciones = await ctx.prisma.filmacionPorRoles.createMany({
				data: input.filmaciones.fechas.map((dates) => {
					return {
						id_rol: rol.id,
						id_estado_republica: input.filmaciones.id_estado_republica,
						fecha_inicio: dates.inicio,
						fecha_fin: dates.fin
					}
				})
			});
			if (!saved_fechas_filmaciones) {
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: getResponse('error_save_fechas_filmaciones')
				});
			}

			// REQUISITOS
			const requisitos = await ctx.prisma.requisitosPorRoles.upsert({
				where: {
					id_rol: rol.id
				},
				update: {
					presentacion_solicitud: new Date(input.requisitos.fecha_presentacion),
					informacion: input.requisitos.info_trabajo,
					id_uso_horario: input.requisitos.id_uso_horario,
					id_idioma: input.requisitos.id_idioma,
					id_estado_republica: input.requisitos.id_estado_donde_aceptan_solicitudes
				},
				create: {
					presentacion_solicitud: new Date(input.requisitos.fecha_presentacion),
					informacion: input.requisitos.info_trabajo,
					id_uso_horario: input.requisitos.id_uso_horario,
					id_rol: rol.id,
					id_idioma: input.requisitos.id_idioma,
					id_estado_republica: input.requisitos.id_estado_donde_aceptan_solicitudes
				}
			})

			if (!requisitos) {
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: getResponse('error_save_requisitos')
				});
			}

			const medios_multimedia_por_rol = await ctx.prisma.mediosMultimediaPorRoles.findMany({
				where: {
					id_requisitos_por_roles: requisitos.id
				}
			})

			if (medios_multimedia_por_rol.length > 0) {
				await ctx.prisma.mediosMultimediaPorRoles.deleteMany({
					where: {
						id_requisitos_por_roles: requisitos.id
					}
				});
			}

			const saved_medios_multimedia_por_rol = await ctx.prisma.mediosMultimediaPorRoles.createMany({
				data: input.requisitos.medios_multimedia_a_incluir.map(m => { return { id_requisitos_por_roles: requisitos.id, id_medio_multimedia: m } })
			})

			if (!saved_medios_multimedia_por_rol) {
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: getResponse('error_save_medios_multimedia')
					// optional: pass the original error to retain stack trace
					//cause: theError,
				});
			}

			// SELFTAPE

			const selftape = await ctx.prisma.selftapePorRoles.upsert({
				where: {
					id_rol: rol.id
				},
				update: {
					pedir_selftape: input.selftape.pedir_selftape,
					indicaciones: input.selftape.indicaciones,
				},
				create: {
					id_rol: rol.id,
					pedir_selftape: input.selftape.pedir_selftape,
					indicaciones: input.selftape.indicaciones,
				}
			})

			if (!selftape) {
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: getResponse('failed')
				});
			}

			return rol;
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
					id_color_cabello: 0,
					id_color_ojos: 0
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
			const lang = (ctx.session && ctx.session.user) ? ctx.session.user.lang : 'es';
			const getResponse = ApiResponses('RolesRouter_saveCompensacion', lang);
			console.log('input-save compensacion', input)
			const rol = await ctx.prisma.roles.findUnique({ where: { id: input.id_rol } });
			if (!rol) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: getResponse('role_not_found')
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
					message: getResponse('error_save_compensaciones')
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
						message: getResponse('error_save_sueldo')
					});
				}
			} else {
				try {
					await ctx.prisma.sueldosPorRoles.delete({ where: { id_comp_por_rol: compensaciones.id } });
				} catch (e) { }
			}

			try {
				await ctx.prisma.compNoMonetariasPorRoles.deleteMany({ where: { id_comp_por_rol: compensaciones.id } });
			} catch (e) { }

			if (input.compensaciones_no_monetarias) {
				const saved_compensaciones_no_monetarias = await ctx.prisma.compNoMonetariasPorRoles.createMany({
					data: input.compensaciones_no_monetarias.map(c => {
						const comp_no_mone: { id_compensacion: number, descripcion_compensacion: string, id_comp_por_rol: number } = { ...c, id_comp_por_rol: compensaciones.id }
						return comp_no_mone;
					})
				})
				if (!saved_compensaciones_no_monetarias) {
					throw new TRPCError({
						code: 'INTERNAL_SERVER_ERROR',
						message: getResponse('error_save_compensaciones_no_monetarias')
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
			rango_edad_inicio: z.number(),
			rango_edad_fin: z.number(),
			rango_edad_en_meses: z.boolean(),
			id_pais: z.number()
		}))
		.mutation(async ({ input, ctx }) => {
			const lang = (ctx.session && ctx.session.user) ? ctx.session.user.lang : 'es';
			const getResponse = ApiResponses('RolesRouter_saveFiltrosDemograficos', lang);
			if (input.id_pais <= 0) {
				throw new TRPCError({
					code: 'PRECONDITION_FAILED',
					message: getResponse('invalid_pais')
				});
			}
			if (input.rango_edad_inicio > 110 || input.rango_edad_inicio <= 0 || input.rango_edad_fin > 110 || input.rango_edad_fin <= 0) {
				throw new TRPCError({
					code: 'PRECONDITION_FAILED',
					message: getResponse('invalid_age')
				});
			}
			const rol = await ctx.prisma.roles.findUnique({ where: { id: input.id_rol } });
			if (!rol) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: getResponse('role_not_found')
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
					message: getResponse('error_save_filtros')
				});
			}

			try {
				await ctx.prisma.generosPorRoles.deleteMany({ where: { id_filtro_demo_por_rol: filtros_demograficos.id } });
			} catch (e) { }

			if (input.generos) {
				const saved_generos = await ctx.prisma.generosPorRoles.createMany({
					data: input.generos.map(g => { return { id_genero: g, id_filtro_demo_por_rol: filtros_demograficos.id } })
				});
				if (!saved_generos) {
					throw new TRPCError({
						code: 'INTERNAL_SERVER_ERROR',
						message: getResponse('error_save_generos')
					});
				}
			}

			try {
				await ctx.prisma.aparenciasEtnicasPorRoles.deleteMany({ where: { id_filtro_demo_por_rol: filtros_demograficos.id } });
			} catch (e) { }

			if (input.apariencias_etnias) {
				const saved_etnias = await ctx.prisma.aparenciasEtnicasPorRoles.createMany({
					data: input.apariencias_etnias.map(e => { return { id_aparencia_etnica: e, id_filtro_demo_por_rol: filtros_demograficos.id } })
				});
				if (!saved_etnias) {
					throw new TRPCError({
						code: 'INTERNAL_SERVER_ERROR',
						message: getResponse('error_save_etnias')
					});
				}
			}

			const deleted_animal = await ctx.prisma.animalPorRoles.deleteMany({ where: { id_filtro_demo_por_rol: filtros_demograficos.id } });
			if (!deleted_animal) {
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: getResponse('error_delete_animal')
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
						message: getResponse('error_save_animal')
					});
				}
			}
			return input;
		}
		),
	saveDescripcionRol: publicProcedure
		.input(z.object({
			id_rol: z.number(),
			descripcion: z.string(),
			detalles_adicionales: z.string().nullish(),
			habilidades: z.array(z.number()),
			especificacion_habilidad: z.string(),
			nsfw: z.object({
				ids: z.array(z.number()),
				descripcion: z.string()
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
			const lang = (ctx.session && ctx.session.user) ? ctx.session.user.lang : 'es';
			const getResponse = ApiResponses('RolesRouter_saveDescripcionRol', lang);
			if (input.descripcion.length > 500) {
				throw new TRPCError({
					code: 'PRECONDITION_FAILED',
					message: getResponse('max_descripcion_reached')
				});
			}
			if (input.nsfw && input.nsfw.descripcion.length > 500) {
				throw new TRPCError({
					code: 'PRECONDITION_FAILED',
					message: getResponse('max_nsfw_descripcion_reached')
				});
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
				}
			});
			if (!rol) {
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: getResponse('role_not_found')
				});
			}

			if (rol.habilidades && rol.habilidades.habilidades_seleccionadas.length > 0) {
				const deleted_habilidades = await ctx.prisma.habilidadesPorRoles.delete({ where: { id_rol: rol.id } });
				if (!deleted_habilidades) {
					throw new TRPCError({
						code: 'INTERNAL_SERVER_ERROR',
						message: getResponse('error_delete_habilidades')
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
					message: getResponse('error_save_habilidades')
				});
			}

			const habilidades_seleccionadas_por_rol = await ctx.prisma.habilidadesSelecPorRoles.createMany({
				data: input.habilidades.map(h => { return { id_habilidad: h, id_habilidades_por_rol: habilidades_por_rol.id } })
			});

			if (!habilidades_seleccionadas_por_rol) {
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: getResponse('error_save_habilidades_seleccionadas')
				});
			}

			if (rol.nsfw && rol.nsfw.nsfw_seleccionados.length > 0) {
				const deleted_nsfw = await ctx.prisma.nSFWPorRoles.delete({ where: { id_rol: rol.id } });

				if (!deleted_nsfw) {
					throw new TRPCError({
						code: 'INTERNAL_SERVER_ERROR',
						message: getResponse('error_delete_nsfw')
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
						message: getResponse('error_save_nsfw')
					});
				}
				const nsfw_seleccionados_por_rol = await ctx.prisma.nSFWSeleccionadosPorRoles.createMany({
					data: input.nsfw.ids.map(id => { return { id_nsfw: id, id_nsfw_por_rol: nsfw_por_rol.id } })
				});
				if (!nsfw_seleccionados_por_rol) {
					throw new TRPCError({
						code: 'INTERNAL_SERVER_ERROR',
						message: getResponse('error_save_nsfw_seleccionados')
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
			})),
			action: z.string()
		}))
		.mutation(async ({ input, ctx }) => {
			const lang = (ctx.session && ctx.session.user) ? ctx.session.user.lang : 'es';
			const getResponse = ApiResponses('RolesRouter_saveInfoCastingYFilmacion', lang);

			if (input.fechas.length === 0) {
				throw new TRPCError({
					code: 'PRECONDITION_FAILED',
					message: getResponse('no_fechas')
				});
			}

			if (input.action === 'casting') {
				const deleted_fechas = await ctx.prisma.castingPorRoles.deleteMany({ where: { id_rol: input.id_rol } });
				if (!deleted_fechas) {
					throw new TRPCError({
						code: 'INTERNAL_SERVER_ERROR',
						message: getResponse('error_delete_fechas_casting')
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
						message: getResponse('error_saved_fechas_casting')
					});
				}
				return saved_fechas;
			} else {
				const deleted_fechas = await ctx.prisma.filmacionPorRoles.deleteMany({ where: { id_rol: input.id_rol } });
				if (!deleted_fechas) {
					throw new TRPCError({
						code: 'INTERNAL_SERVER_ERROR',
						message: getResponse('error_delete_fechas')
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
						message: getResponse('error_saved_fechas')
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
			info_trabajo: z.string(),
			id_idioma: z.number(),
			medios_multimedia_a_incluir: z.array(z.number()),
			id_estado_donde_aceptan_solicitudes: z.number()
		}))
		.mutation(async ({ input, ctx }) => {
			const lang = (ctx.session && ctx.session.user) ? ctx.session.user.lang : 'es';
			const getResponse = ApiResponses('RolesRouter_saveRequisitosRol', lang);

			if (input.info_trabajo.length > 500) {
				throw new TRPCError({
					code: 'PRECONDITION_FAILED',
					message: getResponse('limit_info_trabajo_reached')
				});
			}

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
					message: getResponse('error_save_requisitos')
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
						message: getResponse('error_delete_medios_multimedia')
					});
				}
			}

			const saved_medios_multimedia_por_rol = await ctx.prisma.mediosMultimediaPorRoles.createMany({
				data: input.medios_multimedia_a_incluir.map(m => { return { id_requisitos_por_roles: requisitos.id, id_medio_multimedia: m } })
			})

			if (!saved_medios_multimedia_por_rol) {
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: getResponse('error_save_medios_multimedia')
				});
			}


			return input;
		}
		),
	saveSelftapeRol: publicProcedure
		.input(z.object({
			id_rol: z.number(),
			indicaciones: z.string(),
			pedir_selftape: z.boolean(),
			lineas: z.object({
				base64: z.string(),
				extension: z.string()
			}).nullish(),
		}))
		.mutation(async ({ input, ctx }) => {

			const lang = (ctx.session && ctx.session.user) ? ctx.session.user.lang : 'es';
			const getResponse = ApiResponses('RolesRouter_saveSelftapeRol', lang);
			if (input.indicaciones.length > 500) {
				throw new TRPCError({
					code: 'PRECONDITION_FAILED',
					message: getResponse('limit_indicaciones_reached')
				});
			}
			const selftape = await ctx.prisma.selftapePorRoles.upsert({
				where: {
					id_rol: input.id_rol
				},
				update: {
					pedir_selftape: input.pedir_selftape,
					indicaciones: input.indicaciones,
				},
				create: {
					id_rol: input.id_rol,
					pedir_selftape: input.pedir_selftape,
					indicaciones: input.indicaciones,
				}
			})

			if (!selftape) {
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: getResponse('failed')
				});
			}
			return selftape;
		}
		),



	getAllComplete: publicProcedure
		.input(z.object({
			limit: z.number().min(1).max(100).nullish(),
			siguienteCursor: z.number().nullish(),
			anteriorCursor: z.number().nullish(),

			//filtros
			tipo_rol: z.number().nullish(),
		}))
		.query(async ({ input, ctx }) => {
			const limit = input.limit ?? 50;
			const { anteriorCursor, siguienteCursor } = input;
			await ctx.prisma.roles.count();
			const roles = await ctx.prisma.roles.findMany({
				where: {
					id_tipo_rol: input.tipo_rol || undefined
				},
				take: (siguienteCursor ? 1 : anteriorCursor ? -1 : 1) * (limit + 1),
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

					proyecto: {
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

						}
					}
				},
				cursor: siguienteCursor
					? { id: siguienteCursor }
					: anteriorCursor
						? { id: anteriorCursor }
						: undefined,
				orderBy: {
					id: 'asc',
				},

			});

			let nextCursor: typeof siguienteCursor | undefined = undefined;
			let backCursor: typeof siguienteCursor | undefined = undefined;

			if (roles.length > limit) {
				const nextItem = roles.pop()
				const firstItem = roles[0]
				nextCursor = nextItem?.id;
				backCursor = firstItem?.id
			}

			return {
				roles,
				nextCursor,
				backCursor
			};
		}
		),
	getRolesBillboardTalentos: protectedProcedure
		.input(z.object({
			tipo_busqueda: z.string(),
			id_estados_republica: z.array(z.number()),
			id_uniones: z.array(z.number()),
			tipos_roles: z.array(z.string()),
			edad_inicio: z.number(),
			edad_fin: z.number(),
			id_tipos_proyectos: z.array(z.number()),
			id_generos_rol: z.array(z.number()),
			id_apariencias_etnicas: z.array(z.number()),
			id_nacionalidades: z.array(z.number()),
			id_preferencias_de_pago: z.array(z.number()),
			id_talento: z.number().optional()
		}))
		.query(async ({ input, ctx }) => {
			if (ctx.session) {
				const user = ctx.session.user;

				const id = input.id_talento ? input.id_talento : parseInt(user.id)

				const talento = await ctx.prisma.talentos.findFirst({
					where: {
						id
					},
					include: {
						filtros_aparencias: true,
						info_basica: true,
						preferencias: {
							include: {
								tipos_de_trabajo: true,
								locaciones: true
							}
						},
						habilidades: true,
						
					}
				})
				if (talento) {

					const roles = await ctx.prisma.roles.findMany({
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
							tipo_trabajos: true,
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
							color_cabello: true,
							color_ojos: true,
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

							proyecto: {
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
									cazatalentos: {
										include: {
											foto_perfil: true,
											redes_sociales: true
										}
									}
								}
							}
						},
						orderBy: {
							id: 'asc',
						},

					});

					if (roles) {
						const result = roles.map(r => {
							let porcentaje_filter = 0;
							/*
							-Genero 20% [x]
							-Edad 15% [x]
							-Ethía 10% [x]
							-Nacionalidad 10% [x]
							-Tipo de Trabajo 5% [x]
							-Tipo de Proyecto 5% [x]
							-Ubicación Casting 15% [x]
							-Color Cabello 5% [x]
							-Color Ojos 5% [x]
							-Tipo de Rol 5% [x]
							-Pref. Pago 5% [x]
							-Habilidades 10% [x]
							*/
							if (r.filtros_demograficos) {
								let genero_found = false;
								r.filtros_demograficos.generos.map(g => g.id_genero).forEach(id_genero => {
									if (!genero_found && input.id_generos_rol.includes(id_genero)) {
										porcentaje_filter += 20;
										genero_found = true;
									}
								});
								if (!r.filtros_demograficos.rango_edad_en_meses) {
									if (r.filtros_demograficos.rango_edad_inicio >= input.edad_inicio && r.filtros_demograficos.rango_edad_fin <= input.edad_fin) {
										porcentaje_filter += 13;
									}
								}
								let apariencias_etnias_found = false;
								r.filtros_demograficos.aparencias_etnicas.map(a => a.id_aparencia_etnica).forEach(id_etnia => {
									if (!apariencias_etnias_found && input.id_apariencias_etnicas.includes(id_etnia)) {
										porcentaje_filter += 10;
										apariencias_etnias_found = true;
									}
								});
								if (r.filtros_demograficos.id_pais === talento.filtros_aparencias?.id_pais) {
									porcentaje_filter += 10;
								}
							}
							if (talento.preferencias) {
								if (r.tipo_trabajos.filter(t => talento.preferencias?.tipos_de_trabajo.map(tp => tp.id_tipo_de_trabajo).includes(t.id_tipo_trabajo)).length > 0) {
									porcentaje_filter += 5;
								}
							}
							if (r.proyecto.tipo) {
								if (input.id_tipos_proyectos.includes(r.proyecto.tipo.id_tipo_proyecto)) {
									porcentaje_filter += 5;
								}
							}
							const locacion_casting = r.casting[0]?.id_estado_republica;
							if (locacion_casting && talento.preferencias?.locaciones.map(l => l.id_estado_republica).includes(locacion_casting)) {
								porcentaje_filter += 12;
							}
							if (r.color_cabello.id === talento.filtros_aparencias?.id_color_cabello) {
								porcentaje_filter += 5;
							}
							if (r.color_ojos.id === talento.filtros_aparencias?.id_color_ojos) {
								porcentaje_filter += 5;
							}
							if (input.tipos_roles.includes(r.tipo_rol.tipo)) {
								porcentaje_filter += 5;
							}
							if (r.compensaciones) {
								if (input.id_preferencias_de_pago.includes((r.compensaciones.sueldo) ? 1 : 2)) {
									porcentaje_filter += 5;
								}
							}
							if (r.habilidades) {
								let found_habilidades = 0;
								r.habilidades.habilidades_seleccionadas.forEach(h => {
									if (talento.habilidades.map(th => th.id_habilidad).includes(h.id_habilidad)) {
										found_habilidades += 1;
									}
								});
								if (found_habilidades > 1) {
									porcentaje_filter += 10;
								}
							}

							return { ...r, porcentaje_filter: porcentaje_filter };
							//if (talento.filtros_aparencias.)
							//if (input.)


							//• Sexo / Genero : 15 % (REQUISITO)
							//(Selección del Sexo o genero con el que se identifica o dispuesto a interpretar)

							//• Rango de Edad: 15 % (REQUISITO)
							//(Dentro del rango de Edad a interpretar)
							//• Preferencias de Rol y Compensación: 15 % (REQUISITO)
							//-Tipo de Trabajo (requisito) agregar filtroooo

							//-Selección Proyecto pagado/no pagado (requisito)
							//-Locación de Trabajo, dentro de la selección principal o adicionales (requisito) %COMPARAR CON LA LOCACION DEL CASTING

							//-Disponibilidad para... (No requisito) ignorar

							//• Apariencia o Rasgos: 15% (REQUISITO)
							//-Color de Cabello (Requisito)
							//-Estilo de Cabello (No requisito)
							//-Vello Facial (No requisito)
							//-Color de Ojos (Requisito)

							//• Apariencia Étnica: 10 %
							//(Afroamericano, Asiático Oriental, Blanco, Europeo, Indio Oriental, Latino/Hispano, etc...)
							//• Nacionalidad: + 5 %
							//(Extra)
							//• Habilidades: + 10 %
							//(A partir de 2 habilidades compatibles, Extra)

						}).filter(r => {
							console.log(`el porcentaje del rol ${r.nombre} es : ${r.porcentaje_filter}`)
							return r.porcentaje_filter >= 60
						})
						return result;
					}
				}

			}
			return [];
		}
	),
	getAplicacionesRolesByIdAplicacion: protectedProcedure
		.input(z.object({
			id: z.number()
		}))
		.query(async ({ input, ctx }) => {
			if (input.id <= 0) return null;
			if (ctx.session) {
				const user = ctx.session.user;

				return await ctx.prisma.aplicacionRolPorTalento.findFirst({
					where: {
						id: input.id
					},
					include: {
						estado_republica: true,
						rol: {
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
								tipo_trabajos: true,
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
								color_cabello: true,
								color_ojos: true,
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
		
								proyecto: {
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
										cazatalentos: {
											include: {
												foto_perfil: true,
												redes_sociales: true
											}
										}
									}
								}
							}
						}
					},
					orderBy: {
						id: 'asc',
					}
				});
			}
			return null;
		}
	),
	getAplicacionesRolesPorTalento: protectedProcedure
		.input(z.object({
			id_talento: z.number(),
			pagination: z.object({
				take: z.number(),
				skip: z.number()
			}).nullish()
		}))
		.query(async ({ input, ctx }) => {
			if (ctx.session) {
				const user = ctx.session.user;
				return await ctx.prisma.aplicacionRolPorTalento.findMany({
					where: {
						id_talento: input.id_talento
					},
					skip: (input.pagination) ? input.pagination.skip : 0,
					take: (input.pagination) ? input.pagination.take : 999999,
					include: {
						rol: {
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
								tipo_trabajos: true,
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
								color_cabello: true,
								color_ojos: true,
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
		
								proyecto: {
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
										cazatalentos: {
											include: {
												foto_perfil: true,
												redes_sociales: true
											}
										}
									}
								}
							}
						}
					},
					orderBy: {
						id: 'asc',
					}
				});
			}
			return [];
		}
	),
});
//getSecretMessage: protectedProcedure.query(() => {
//    return "you can now see this secret message!";
//}),