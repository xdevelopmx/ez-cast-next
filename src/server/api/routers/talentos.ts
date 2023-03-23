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

function exclude<Talentos, Key extends keyof Talentos>(
	talento: Talentos,
	keys: Key[]
  ): Omit<Talentos, Key> {
	for (const key of keys) {
	  delete talento[key]
	}
	return talento
  }

export const TalentosRouter = createTRPCRouter({
    getAll: publicProcedure
		.query(async ({ ctx }) => {
			return await ctx.prisma.talentos.findMany();
		}
	),
	getById: publicProcedure
		.input(z.object({ id: z.number() }))
		.query(async ({ input, ctx }) => {
			const talento = await ctx.prisma.talentos.findUnique({
				where: {id: input.id},
				include: {
					info_basica: {
						include: {
							union: true,
						}
					},
					creditos: {
						include: {
							creditos: true
						}
					},
					habilidades: true,
					representante: true,
					redes_sociales: true,
					activos: {
						include: {
							vehiculos: {
								include: {
									tipo_vehiculo: true,
								}
							},
							mascotas: {
								include: {
									tipo_mascota: true,
									raza_mascota: true
								}
							},
							vestuario: {
								include: {
									tipo_vestuario_especifico: {
										include: {
											tipo_vestuario: true
										}
									}
								}
							},
							props: {
								include: {
									tipo_props: true,
								}
							},
							equipo_deportivo: {
								include: {
									tipo_equipo_deportivo: true
								}
							}
						}
					}
				}
			});

			// hay que excluir la pass en 
			return talento;
			//return exclude(talento, ['contrasenia'])
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
					extension: z.string(),
				}).nullish(),
				cv: z.object({
					base64: z.string(),
					extension: z.string(),
				}).nullish(),
				urls: z.object({
					cv: z.string().nullish(),
					carta_responsiva: z.string().nullish()
				})
			}),
			representante: z.object({
				nombre: z.string().min(2),
				email: z.string().email(),
				agencia: z.string().min(2),
				telefono: z.string().min(10).max(10)
			}).nullish(),
			redes_sociales: z.array(z.object({
				nombre: z.string(),
				url: z.string()
			})).nullish()
		}))
		.mutation(async ({ input, ctx }) => {
			const user = ctx.session.user; 
			if (user && user.tipo_usuario === TipoUsuario.TALENTO) {

				if (input.edad < 18 && !input.representante) {
					throw new TRPCError({
						code: 'PRECONDITION_FAILED',
						message: 'Si se es menor de edad el representante es obligatorio',
						// optional: pass the original error to retain stack trace
						//cause: theError,
					});
				}

				if (input.edad < 18 && (!input.files.carta_responsiva && !input.files.urls.carta_responsiva)) {
					throw new TRPCError({
						code: 'PRECONDITION_FAILED',
						message: 'Si se es menor de edad la carta responsiva y el representante son obligatorios',
						// optional: pass the original error to retain stack trace
						//cause: theError,
					});
				}

				const talento = await ctx.prisma.talentos.update({
					where: {id: parseInt(user.id)},
					data: {
						nombre: input.nombre
					}
				})

				if (!talento) {
					throw new TRPCError({
						code: 'INTERNAL_SERVER_ERROR',
						message: 'Ocurrio un error al tratar de actualizar el nombre del talento',
						// optional: pass the original error to retain stack trace
						//cause: theError,
					});
				}

				let file_path_cv: string | null = null;
				if (input.files.cv) {
					const save_result = await FileManager.saveFile(`cv.${input.files.cv.extension}`, input.files.cv.base64, `talentos/${user.id}/info-gral/cv/`);
					if (!save_result.error) {
						file_path_cv = save_result.result;
					} 
					if (save_result.error) {
						console.log(save_result.error);
					}
				} else {
					if (input.files && input.files.urls && input.files.urls.cv) {
						file_path_cv = input.files.urls.cv;
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
						id_estado_republica: input.id_estado_republica,
						url_cv: file_path_cv
					},
					create: {
						edad: input.edad,
						peso: input.peso,
						altura: input.altura,
						biografia: input.biografia,
						id_estado_republica: input.id_estado_republica,
						url_cv: file_path_cv,
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
							data: input.redes_sociales.map(red => { 
								return { nombre: red.nombre, url: red.url, id_talento: parseInt(user.id)} 
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

				if (input.edad < 18) {
					if (input.representante) {
						let file_path_carta_responsiva: string | null = null;
						if (input.files.carta_responsiva) {
							const save_result = await FileManager.saveFile(`carta-responsiva.${input.files.carta_responsiva.extension}`, input.files.carta_responsiva.base64, `talentos/${user.id}/info-gral/carta-responsiva/`);
							if (!save_result.error) {
								file_path_carta_responsiva = save_result.result;
							}
						} else {
							if (input.files && input.files.urls && input.files.urls.carta_responsiva) {
								file_path_carta_responsiva = input.files.urls.carta_responsiva;
							}
						}
	
						const saved_representante = await ctx.prisma.representantesPorTalentos.upsert({
							where: {
								id_talento: parseInt(user.id)
							},
							update: {
								url_carta_responsiva: file_path_carta_responsiva,
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
								url_carta_responsiva: file_path_carta_responsiva,
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
				} else {
					// si es mayor de edad eliminamos al representante
					const deleted_representante = await ctx.prisma.representantesPorTalentos.delete({
						where: {id_talento: parseInt(user.id)}
					})
					if (!deleted_representante) {
						throw new TRPCError({
							code: 'INTERNAL_SERVER_ERROR',
							message: 'Ocurrio un problema al tratar de eliminar el representante',
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
	saveMedios: protectedProcedure
    	.input(z.object({ 
			fotos: z.array(
				z.object({
					base64: z.string(),
					extension: z.string(),
				}
			)),
			videos: z.array(
				z.object({
					base64: z.string(),
					extension: z.string(),
				}
			)),
			audios: z.array(
				z.object({
					base64: z.string(),
					extension: z.string(),
				}
			)),
		}))
		.mutation(async ({ input, ctx }) => {
			console.log('INPUT: ', input)
			const user = ctx.session.user; 
			if (user && user.tipo_usuario === TipoUsuario.TALENTO) {
				if (input.fotos.length === 0) {
					throw new TRPCError({
						code: 'PRECONDITION_FAILED',
						message: 'Se debe enviar al menos una foto',
						// optional: pass the original error to retain stack trace
						//cause: theError,
					});
				}
				
				const media_por_talentos_to_be_deleted = await ctx.prisma.mediaPorTalentos.findMany({
					where: {
						referencia: {
							in: ['FOTOS_PERFIL_TALENTO', 'AUDIOS_TALENTO', 'VIDEOS_TALENTO'],
						},
						id_talento: parseInt(user.id)
					},
					include: {
						media: true
					}
				})
				/*
				const ids_to_delete = await Promise.all(media_por_talentos_to_be_deleted.map(async (m) => {
					const media_por_talentos = JSON.parse(JSON.stringify(m));
					const deleted_file = await FileManager.deleteFile(media_por_talentos.Media.path);
					if (deleted_file.error) {
						console.log(deleted_file.error);
					}
					return m.id;
				}));
				/*
				
				
				
				saveMedia: async (req, res) => {
					const { body, files } = req;
			
					console.log(files);
				
					if (!body.media) {
						return res.status(400).json({status: 'error', msg: 'No se envio los medias en la peticion', detailed_msg: ''});
					}
			
					if (!files) {
						return res.status(400).json({status: 'error', msg: 'No se enviaron los archivos en la peticion', detailed_msg: ''});
					}
					
					const tx = await db.transaction();
			
					const update_result = await funcHandler(async() => {
						const media_arr = JSON.parse(body.media);
						const referencias_to_delete = JSON.parse(body.references_to_delete);
			
						if (referencias_to_delete.length > 0) {
							const media_por_talentos_to_be_deleted = await MediaPorTalentos.findAll({
								where: {
									referencia: {
										[Op.in]: referencias_to_delete 
									},
									id_talento: parseInt(body.id_talento)
								},
								include: {
									model: Media,
									as: 'Media'
								}
							});
							await Promise.all(media_por_talentos_to_be_deleted.map(async (m) => {
								const media_por_talentos = JSON.parse(JSON.stringify(m));
								const deleted_file = await fileManager.deleteFile(media_por_talentos.Media.path);
								if (deleted_file.error) {
									throw new Error(deleted_file.error.detailed_msg);
								}
								return await m.destroy();
							}));
						}
			
						const talento = await Talentos.findByPk(body.id_talento);
						if (!talento) throw new Error('No se encontro el talento con ese id'); 
						
						const saved_medias = await Promise.all(media_arr.map(async (m) => {
							/*
								referencia: 'VIDEOS_TALENTO',
								identificador: `VIDEO_${key}`,
								nombre: file.name,
								pathname: `talentos/${this.talento_profile?.id}/videos-perfil/`
							*/

							/*
							if (m.identificador === 'FOTO_PERFIL') {
								if (talento.dataValues.profile_img_url) {
									const deleted_file = await fileManager.deleteFile(talento.dataValues.profile_img_url);
									if (deleted_file.error) {
										throw new Error(deleted_file.error.detailed_msg);
									}
								}
							}
							let name_exploded = m.nombre.split('.');
							let extension = name_exploded[name_exploded.length - 1];
							name_exploded.splice(name_exploded.length - 1)
							let name = `${name_exploded.join('_')}.${extension}`;                    
							const saved_file = await fileManager.saveFile(m.identificador, files[m.identificador], `${m.pathname}`);
			
							if (saved_file.error) {
								throw new Error(saved_file.error.toString());
							}
							const file_path = `/uploads/${m.pathname}${saved_file.result}`;
			
							if (m.identificador === 'FOTO_PERFIL') {
								await talento.update({profile_img_url: file_path});
							}
			
							const n_media = Media.build({
								nombre: name,
								extension: extension,
								path: file_path
							});
							const result_save = await n_media.save();
							return {media: result_save, media_request: m};
						}));
			
						return await Promise.all(saved_medias.map(async (entry) => {
							const n_media = MediaPorTalentos.build({
								referencia: entry.media_request.referencia,
								identificador: entry.media_request.identificador,
								id_media: entry.media.dataValues.id,
								id_talento: body.id_talento
							});
							return await n_media.save();
						}));
					});
					if (update_result.error) {
						await tx.rollback();
						return res.status(500).json(update_result.error);
					}
					await tx.commit();
					res.json({status: 'success', msg: 'Se guardo los media con exito', detailed_msg: '', data: update_result.result});
				},
				*/
				return null;
			}
			throw new TRPCError({
				code: 'UNAUTHORIZED',
				message: 'Solo el rol de talento puede modificar la informacion general',
				// optional: pass the original error to retain stack trace
				//cause: theError,
			});
		}
	),
	saveCreditos: protectedProcedure
		.input(z.object({ 
			mostrar_anio_en_perfil: z.boolean(),
			creditos: z.array(z.object({
				id_catalogo_proyecto: z.number(),
				titulo: z.string(),
				rol: z.string(),
				director: z.string(),
				anio: z.number(),
				destacado: z.boolean(),
				clip_url: z.string()
			}))
		}))
		.mutation(async ({ input, ctx }) => {
			const user = ctx.session.user; 
			if (user && user.tipo_usuario === TipoUsuario.TALENTO) {
				const creditos_por_talentos = await ctx.prisma.creditosPorTalentos.upsert({
					where: {
						id_talento: parseInt(user.id)
					},
					update: {
						mostrar_anio_perfil: input.mostrar_anio_en_perfil,
					},
					create: {
						mostrar_anio_perfil: input.mostrar_anio_en_perfil,
						id_talento: parseInt(user.id)
					},
				});

				if (!creditos_por_talentos) {
					throw new TRPCError({
						code: 'INTERNAL_SERVER_ERROR',
						message: 'Ocurrio un error al tratar de actualizar los creditos por talentos',
						// optional: pass the original error to retain stack trace
						//cause: theError,
					});
				}

				const deleted_creditos = await ctx.prisma.creditoTalento.deleteMany({});
				if (!deleted_creditos) {
					throw new TRPCError({
						code: 'INTERNAL_SERVER_ERROR',
						message: 'Ocurrio un error al tratar de eliminar los creditos por talentos',
						// optional: pass the original error to retain stack trace
						//cause: theError,
					});
				}

				if (input.creditos.length > 0) {
					const created_creditos = await ctx.prisma.creditoTalento.createMany({
						data: input.creditos.map(credito => {
							return {...credito, id_creditos_por_talento: creditos_por_talentos.id};
						})
					});
		
					if (!created_creditos) {
						throw new TRPCError({
							code: 'INTERNAL_SERVER_ERROR',
							message: 'Ocurrio un error al tratar de guardar los creditos por talentos',
							// optional: pass the original error to retain stack trace
							//cause: theError,
						});
					}
				}

				return creditos_por_talentos;
			}
			throw new TRPCError({
				code: 'UNAUTHORIZED',
				message: 'Solo el rol de talento puede modificar los creditos',
				// optional: pass the original error to retain stack trace
				//cause: theError,
			});
		}
	),
	saveHabilidades: protectedProcedure
		.input(z.object({ 
			ids_habilidades: z.array(z.object({
				id_habilidad: z.number(),
				id_habilidad_especifica: z.number()
			})),
		}))
		.mutation(async ({ input, ctx }) => {
			const user = ctx.session.user; 
			if (user && user.tipo_usuario === TipoUsuario.TALENTO) {
				
				const deleted_habilidades = await ctx.prisma.habilidadesPorTalentos.deleteMany();
				if (!deleted_habilidades) {
					throw new TRPCError({
						code: 'INTERNAL_SERVER_ERROR',
						message: 'Ocurrio un error al tratar de eliminar las habilidades por talentos',
						// optional: pass the original error to retain stack trace
						//cause: theError,
					});
				}

				if (input.ids_habilidades.length > 0) {
					const saved_habilidades = await ctx.prisma.habilidadesPorTalentos.createMany({
						data: input.ids_habilidades.map(entry => { return { ...entry, id_talento: parseInt(user.id)}})
					});
					if (!saved_habilidades) {
						throw new TRPCError({
							code: 'INTERNAL_SERVER_ERROR',
							message: 'Ocurrio un error al tratar de guardar las habilidades por talentos',
							// optional: pass the original error to retain stack trace
							//cause: theError,
						});
					}
				}
				return true;
			}
			throw new TRPCError({
				code: 'UNAUTHORIZED',
				message: 'Solo el rol de talento puede modificar las habilidades',
				// optional: pass the original error to retain stack trace
				//cause: theError,
			});
		}
	),
	saveActivos: protectedProcedure
		.input(z.object({ 
			vehiculos: z.array(z.object({
				id_tipo_vehiculo: z.number(),
				marca: z.string(),
				modelo: z.string(),
				color: z.string(),
				anio: z.number()
			})),
			mascotas: z.array(z.object({
				id_tipo_mascota: z.number(),
				id_raza: z.number().nullish(),
				tamanio: z.string(),
			})),
			vestuarios: z.array(z.object({
				id_tipo_vestuario_especifico: z.number(),
				descripcion: z.string(),
			})),
			props: z.array(z.object({
				id_tipo_props: z.number(),
				descripcion: z.string(),
			})),
			equipos_deportivos: z.array(z.object({
				id_tipo_equipo_deportivo: z.number(),
				descripcion: z.string(),
			})),
		}))
		.mutation(async ({ input, ctx }) => {
			const user = ctx.session.user; 
			if (user && user.tipo_usuario === TipoUsuario.TALENTO) {
				
				const activos_por_talento = await ctx.prisma.activosPorTalentos.upsert({
					where: {id_talento: parseInt(user.id)},
					update: { },
					create: {
						id_talento: parseInt(user.id)
					}
				});
				
				if (!activos_por_talento) {
					throw new TRPCError({
						code: 'INTERNAL_SERVER_ERROR',
						message: 'Ocurrio un error al tratar de obtener los activos por talento',
						// optional: pass the original error to retain stack trace
						//cause: theError,
					});
				}
				
				const deleted_vehiculos = await ctx.prisma.vehiculoTalento.deleteMany();
				if (!deleted_vehiculos) {
					throw new TRPCError({
						code: 'INTERNAL_SERVER_ERROR',
						message: 'Ocurrio un error al tratar de eliminar los vehiculos por talentos',
						// optional: pass the original error to retain stack trace
						//cause: theError,
					});
				}

				if (input.vehiculos.length > 0) {
					const saved_vehiculos = await ctx.prisma.vehiculoTalento.createMany({
						data: input.vehiculos.map(entry => { return { ...entry, id_activos_talentos: activos_por_talento.id}})
					});
					if (!saved_vehiculos) {
						throw new TRPCError({
							code: 'INTERNAL_SERVER_ERROR',
							message: 'Ocurrio un error al tratar de guardar los vehiculos por talentos',
							// optional: pass the original error to retain stack trace
							//cause: theError,
						});
					}
				}

				const deleted_mascotas = await ctx.prisma.mascotaTalento.deleteMany();
				if (!deleted_mascotas) {
					throw new TRPCError({
						code: 'INTERNAL_SERVER_ERROR',
						message: 'Ocurrio un error al tratar de eliminar las mascotas por talentos',
						// optional: pass the original error to retain stack trace
						//cause: theError,
					});
				}

				if (input.mascotas.length > 0) {
					const saved_mascotas = await ctx.prisma.mascotaTalento.createMany({
						data: input.mascotas.map(entry => { return { ...entry, id_activos_talentos: activos_por_talento.id}})
					});
					if (!saved_mascotas) {
						throw new TRPCError({
							code: 'INTERNAL_SERVER_ERROR',
							message: 'Ocurrio un error al tratar de guardar las mascotas por talentos',
							// optional: pass the original error to retain stack trace
							//cause: theError,
						});
					}
				}

				const deleted_vestuarios = await ctx.prisma.vestuarioTalento.deleteMany();
				if (!deleted_vestuarios) {
					throw new TRPCError({
						code: 'INTERNAL_SERVER_ERROR',
						message: 'Ocurrio un error al tratar de eliminar los vestuarios por talentos',
						// optional: pass the original error to retain stack trace
						//cause: theError,
					});
				}

				if (input.vestuarios.length > 0) {
					const saved_vestuarios = await ctx.prisma.vestuarioTalento.createMany({
						data: input.vestuarios.map(entry => { return { ...entry, id_activos_talentos: activos_por_talento.id}})
					});
					if (!saved_vestuarios) {
						throw new TRPCError({
							code: 'INTERNAL_SERVER_ERROR',
							message: 'Ocurrio un error al tratar de guardar los vestuarios por talentos',
							// optional: pass the original error to retain stack trace
							//cause: theError,
						});
					}
				}

				const deleted_props = await ctx.prisma.propsTalento.deleteMany();
				if (!deleted_props) {
					throw new TRPCError({
						code: 'INTERNAL_SERVER_ERROR',
						message: 'Ocurrio un error al tratar de eliminar los props por talentos',
						// optional: pass the original error to retain stack trace
						//cause: theError,
					});
				}

				if (input.props.length > 0) {
					const saved_props = await ctx.prisma.propsTalento.createMany({
						data: input.props.map(entry => { return { ...entry, id_activos_talentos: activos_por_talento.id}})
					});
					if (!saved_props) {
						throw new TRPCError({
							code: 'INTERNAL_SERVER_ERROR',
							message: 'Ocurrio un error al tratar de guardar los props por talentos',
							// optional: pass the original error to retain stack trace
							//cause: theError,
						});
					}
				}

				const deleted_equipos_deportivos = await ctx.prisma.equipoDeportivoTalento.deleteMany();
				if (!deleted_equipos_deportivos) {
					throw new TRPCError({
						code: 'INTERNAL_SERVER_ERROR',
						message: 'Ocurrio un error al tratar de eliminar los equipos deportivos por talentos',
						// optional: pass the original error to retain stack trace
						//cause: theError,
					});
				}

				if (input.equipos_deportivos.length > 0) {
					const saved_equipos_deportivos = await ctx.prisma.equipoDeportivoTalento.createMany({
						data: input.equipos_deportivos.map(entry => { return { ...entry, id_activos_talentos: activos_por_talento.id}})
					});
					if (!saved_equipos_deportivos) {
						throw new TRPCError({
							code: 'INTERNAL_SERVER_ERROR',
							message: 'Ocurrio un error al tratar de guardar los equipos deportivos por talentos',
							// optional: pass the original error to retain stack trace
							//cause: theError,
						});
					}
				}
				return activos_por_talento;
			}
			throw new TRPCError({
				code: 'UNAUTHORIZED',
				message: 'Solo el rol de talento puede modificar las habilidades',
				// optional: pass the original error to retain stack trace
				//cause: theError,
			});
		}
	),
});