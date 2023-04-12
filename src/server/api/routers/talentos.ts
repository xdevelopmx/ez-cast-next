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
  // /uploads/talentos/5/fotos-perfil/FOTO_PERFIL/002.png

export const TalentosRouter = createTRPCRouter({
    getAll: publicProcedure
		.query(async ({ ctx }) => {
			return await ctx.prisma.talentos.findMany();
		}
	),
	getInfoBasicaByIdTalento: publicProcedure
		.input(z.object({ id: z.number() }))
		.query(async ({ input, ctx }) => {
			if (input.id <= 0) return null;
			const info_basica = await ctx.prisma.infoBasicaPorTalentos.findFirst({
				where: {
					id_talento: input.id,
				},
				include: {
					union: {
						include: {
							union: true
						}
					},
					estado_republica: true,
				}
			})

			const redes_sociales = await ctx.prisma.redesSocialesPorTalentos.findMany({
				where: {id_talento: input.id},
			});

			return {info_basica: info_basica, redes_sociales: redes_sociales};
		}
	),
	getMediaByIdTalento: publicProcedure
		.input(z.object({ id: z.number() }))
		.query(async ({ input, ctx }) => {
			if (input.id <= 0) return null;
			const media = await ctx.prisma.mediaPorTalentos.findMany({
				where: {id_talento: input.id},
				include: {
					media: true
				}
			});

			return media;
		}
	),
	getCreditosByIdTalento: publicProcedure
		.input(z.object({ id: z.number() }))
		.query(async ({ input, ctx }) => {
			if (input.id <= 0) return null;
			const creditos_por_talento = await ctx.prisma.creditosPorTalentos.findFirst({
				where: {id_talento: input.id},
				include: {
					creditos: true
				}
			});
			return creditos_por_talento;
		}
	),
	getHabilidadesByIdTalento: publicProcedure
		.input(z.object({ id: z.number() }))
		.query(async ({ input, ctx }) => {
			if (input.id <= 0) return null;
			const habilidades = await ctx.prisma.habilidadesPorTalentos.findMany({
				where: {id_talento: input.id},
				include: {
					habilidad_especifica: true,
					habilidad: true
				},
				orderBy: [
					{
						id_habilidad: 'asc',
					},
					{
						id_habilidad_especifica: 'asc',
					}
				],
			});

			return habilidades;
		}
	),
	getActivosByIdTalento: publicProcedure
		.input(z.object({ id: z.number() }))
		.query(async ({ input, ctx }) => {
			if (input.id <= 0) return null;
			const activos = await ctx.prisma.activosPorTalentos.findFirst({
				where: {id_talento: input.id},
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
					},
				}
			});
			return activos;
		}
	),
	getPreferenciasRolByIdTalento: publicProcedure
		.input(z.object({ id: z.number() }))
		.query(async ({ input, ctx }) => {
			if (input.id <= 0) return null;
			const preferencias = await ctx.prisma.preferenciasPorTalentos.findFirst({
				where: {id_talento: input.id},
				include: {
					tipos_de_trabajo: {
						include: {
							tipos_de_trabajo: true
						}
					},
					interes_en_proyectos: {
						include: {
							intereses_en_proyectos: true
						}
					},
					locaciones: {
						include: {
							estado_republica: true
						}
					},
					documentos: {
						include: {
							documento: true
						}
					},
					disponibilidades: {
						include: {
							disponibilidad: true
						}
					},
					otras_profesiones: true,
				}
			});
			return preferencias;
		}
	),
	getFiltrosAparienciaByIdTalento: publicProcedure
		.input(z.object({ id: z.number() }))
		.query(async ({ input, ctx }) => {
			if (input.id <= 0) return null;
			const filtros = await ctx.prisma.filtrosAparenciasPorTalentos.findFirst({
				where: {id_talento: input.id},
				include: {
					genero: true,
					generos_interesados_en_interpretar: {
						include: {
							genero: true
						}
					},
					apariencia_etnica: true,
					color_cabello: true,
					estilo_cabello: true,
					vello_facial: true,
					color_ojos: true,
					tatuajes: {
						include: {
							tipo_tatuaje: true,
						}
					},
					piercings: {
						include: {
							piercing: true
						}
					},
					hermanos: true,
					particularidades: {
						include: {
							particularidad: true
						}
					}
				}
			});

			return filtros;
		}
	),
	getMedidasByIdTalento: publicProcedure
		.input(z.number())
		.query(async ({ input, ctx }) => {
			console.log(input, 'getMedidasByIdTalento input')
			if (input <= 0) return null;
			const medidas = await ctx.prisma.medidasPorTalentos.findFirst({
				where: {
					id_talento: input
				}
			})
			return medidas;
		}
	),
	getById: publicProcedure
		.input(z.object({ id: z.number() }))
		.query(async ({ input, ctx }) => {
			if (input.id <= 0) return null;
			const talento = await ctx.prisma.talentos.findUnique({
				where: {id: input.id},
			});
			// hay que excluir la pass en 
			return talento;
			//return exclude(talento, ['contrasenia'])
		}
	),
	getCompleteById: publicProcedure
		.input(z.object({ id: z.number() }))
		.query(async ({ input, ctx }) => {
			if (input.id <= 0) return null;
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
					media: {
						include: {
							media: true
						}
					},
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
							},
							
						}
					},
					preferencias:{
						include: {
							tipos_de_trabajo: true,
							interes_en_proyectos: true,
							locaciones: {
								include: {
									estado_republica: true
								}
							},
							documentos: true,
							disponibilidades: true,
							otras_profesiones: true,
						}
					},
					filtros_aparencias: {
						include: {
							genero: true,
							generos_interesados_en_interpretar: {
								include: {
									genero: true
								}
							},
							apariencia_etnica: true,
							color_cabello: true,
							estilo_cabello: true,
							vello_facial: true,
							color_ojos: true,
							tatuajes: {
								include: {
									tipo_tatuaje: true,
								}
							},
							piercings: true,
							hermanos: true,
							particularidades: true
						}
					}
				}
			});

			// hay que excluir la pass en 
			return talento;
			//return exclude(talento, ['contrasenia'])
		}
	),
	saveMedidas: protectedProcedure
		.input(z.object({ 
			general_cadera: z.number().min(1).nullish(),
			general_entrepiernas: z.number().min(1).nullish(),
			general_guantes: z.number().min(1).nullish(),
			general_sombrero: z.number().min(1).nullish(),
			hombre_pecho: z.number().min(1).nullish(),
			hombre_cuello: z.number().min(1).nullish(),
			hombre_mangas: z.number().min(1).nullish(),
			hombre_saco: z.string().min(1).nullish(),
			hombre_playera: z.string().min(1).nullish(),
			hombre_calzado: z.number().min(1).nullish(),
			mujer_vestido: z.number().min(1).nullish(),
			mujer_busto: z.number().min(1).nullish(),
			mujer_copa: z.string().min(1).nullish(),
			mujer_cadera: z.number().min(1).nullish(),
			mujer_playera: z.string().min(1).nullish(),
			mujer_pants: z.number().min(1).nullish(),
			mujer_calzado: z.number().min(1).nullish(),
			nino_4_18_anios: z.string().min(1).nullish(),
			nina_4_18_anios: z.string().min(1).nullish(),
			toddler: z.string().min(1).nullish(),
			bebe_meses: z.string().min(1).nullish(),
			calzado_ninos: z.string().min(1).nullish()
		}))
		.mutation(async ({ input, ctx }) => {
			const user = ctx.session.user; 
			if (user && user.tipo_usuario === TipoUsuario.TALENTO) {
				const saved_medidas = await ctx.prisma.medidasPorTalentos.upsert({
					where: {
						id_talento: parseInt(user.id)
					},
					update: input,
					create: {
						...input,
						id_talento: parseInt(user.id)
					}
				})
				
				return saved_medidas;
			}
			throw new TRPCError({
				code: 'UNAUTHORIZED',
				message: 'Solo el rol de talento puede modificar la informacion general',
				// optional: pass the original error to retain stack trace
				//cause: theError,
			});
		}
	),
	getInfoGralById: publicProcedure
		.input(z.object({ id: z.number() }))
		.query(async ({ input, ctx }) => {
			if (input.id <= 0) return null;
			const info_gral = await ctx.prisma.infoBasicaPorTalentos.findFirst({
				where: {
					id_talento: input.id
				}
			})
			// hay que excluir la pass en 
			return info_gral;
			//return exclude(talento, ['contrasenia'])
		}
	),
	saveInfoGralMedia: protectedProcedure
    	.input(z.object({ 
			cv: z.object({
				nombre: z.string(),
				type: z.string(),
				url: z.string(),
				clave: z.string(),
				referencia: z.string(),
				identificador: z.string()
			}).nullish(),
			carta_responsiva: z.object({
				nombre: z.string(),
				type: z.string(),
				url: z.string(),
				clave: z.string(),
				referencia: z.string(),
				identificador: z.string()
			}).nullish()
		}))
		.mutation(async ({ input, ctx }) => {
			console.log('INPUT saveInfoGralMedia', input)
			const user = ctx.session.user; 
			const saved_files: {id_cv: number | null, id_carta_responsiva: number | null} = {id_cv: null, id_carta_responsiva: null};
			if (user && user.tipo_usuario === TipoUsuario.TALENTO) {

				const info_gral = await ctx.prisma.infoBasicaPorTalentos.findFirst({
					where: {
						id_talento: parseInt(user.id)
					}
				});

				if (info_gral && info_gral.id_media_cv) {
					// eliminamos el archivo que ya existe en s3
					const media_cv = await ctx.prisma.media.findFirst({
						where: {
							id: info_gral.id_media_cv
						}
					})

					if (media_cv) {
						await ctx.prisma.media.delete({
							where: {
								id: media_cv.id
							}
						})
					}
				}

				if (input.cv) {
					const media_cv_saved = await ctx.prisma.media.create({
						data: input.cv
					});
	
					if (media_cv_saved) {
						saved_files.id_cv = media_cv_saved.id;
					}
				}

				const representante = await ctx.prisma.representantesPorTalentos.findFirst({
					where: {
						id_talento: parseInt(user.id)
					}
				})

				if (representante && representante.id_media_carta_responsiva) {
					// eliminamos la carta responsiva que ya existia
					const media_carta_representativa = await ctx.prisma.media.findFirst({
						where: {
							id: representante.id_media_carta_responsiva
						}
					})

					if (media_carta_representativa) {
						await ctx.prisma.media.delete({
							where: {
								id: media_carta_representativa.id
							}
						})
					}
				}

				if (input.carta_responsiva) {
					const media_carta_saved = await ctx.prisma.media.create({
						data: input.carta_responsiva
					})
	
					if (media_carta_saved) {
						saved_files.id_carta_responsiva = media_carta_saved.id;
					}
				}

				return saved_files;
			}
			throw new TRPCError({
				code: 'UNAUTHORIZED',
				message: 'Solo el rol de talento puede modificar la informacion general',
				// optional: pass the original error to retain stack trace
				//cause: theError,
			});
		}
	),
	updatePerfil: protectedProcedure
    	.input(z.object({ 
			nombre: z.string(),
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
			if (user && user.tipo_usuario === TipoUsuario.TALENTO) {

				
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

				
				const info_gral = await ctx.prisma.infoBasicaPorTalentos.upsert({
					where: {
						id_talento: parseInt(user.id)
					},
					update: {
						biografia: input.biografia,
					},
					create: {
						edad: 18,
						peso: 75,
						altura: 176,
						biografia: input.biografia,
						id_estado_republica: 1,
						id_media_cv: null,
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
			media: z.object({
				id_cv: z.number().nullish(),
				id_carta_representante: z.number().nullish()
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
			console.log('INPUT saveInfoGral', input)
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

				if (input.edad < 18 && !input.media.id_carta_representante) {
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
						id_media_cv: input.media.id_cv
					},
					create: {
						edad: input.edad,
						peso: input.peso,
						altura: input.altura,
						biografia: input.biografia,
						id_estado_republica: input.id_estado_republica,
						id_media_cv: input.media.id_cv,
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
						const saved_representante = await ctx.prisma.representantesPorTalentos.upsert({
							where: {
								id_talento: parseInt(user.id)
							},
							update: {
								id_media_carta_responsiva: input.media.id_carta_representante,
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
								id_media_carta_responsiva: input.media.id_carta_representante,
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
					const representante_exist = await ctx.prisma.representantesPorTalentos.findFirst({
						where: {id_talento: parseInt(user.id)}
					});
					if (representante_exist) {
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
					nombre: z.string(),
					identificador: z.string(),
				}
			)),
			videos: z.array(
				z.object({
					base64: z.string(),
					nombre: z.string(),
					identificador: z.string(),
				}
			)),
			audios: z.array(
				z.object({
					base64: z.string(),
					nombre: z.string(),
					identificador: z.string(),
				}
			)),
		}))
		.mutation( ({ input, ctx }) => {
			console.log('INPUT SAVE MEDIOS: ', input)
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
				
			
				return true;
			}
			throw new TRPCError({
				code: 'UNAUTHORIZED',
				message: 'Solo el rol de talento puede modificar la informacion general',
				// optional: pass the original error to retain stack trace
				//cause: theError,
			});
		}
	),
	updateCreditoDestacado: protectedProcedure
		.input(z.object({ 
			id_credito: z.number(),
			destacado: z.boolean()
		}))
		.mutation(async ({ input, ctx }) => {
			const user = ctx.session.user; 
			if (user && user.tipo_usuario === TipoUsuario.TALENTO) {
				const credito_saved = await ctx.prisma.creditoTalento.update({
					where: {
						id: input.id_credito
					},
					data: {
						destacado: input.destacado
					}
				});

				if (!credito_saved) {
					throw new TRPCError({
						code: 'INTERNAL_SERVER_ERROR',
						message: 'Ocurrio un error al tratar de actualizar el credito',
						// optional: pass the original error to retain stack trace
						//cause: theError,
					});
				}

				return credito_saved;
			}
			throw new TRPCError({
				code: 'UNAUTHORIZED',
				message: 'Solo el rol de talento puede modificar los creditos',
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

				const deleted_creditos = await ctx.prisma.creditoTalento.deleteMany({
					where: {
						id_creditos_por_talento: creditos_por_talentos.id
					}
				});
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
				
				const deleted_habilidades = await ctx.prisma.habilidadesPorTalentos.deleteMany({
					where: {
						id_talento: parseInt(user.id)
					}
				});
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
				
				const deleted_vehiculos = await ctx.prisma.vehiculoTalento.deleteMany({
					where: {
						id_activos_talentos: activos_por_talento.id
					}
				});
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

				const deleted_mascotas = await ctx.prisma.mascotaTalento.deleteMany({
					where: {
						id_activos_talentos: activos_por_talento.id
					}
				});
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
						data: input.mascotas.map(entry => { return { ...entry, id_activos_talentos: activos_por_talento.id, id_raza: (entry.id_raza && entry.id_raza > 0) ? entry.id_raza : null }})
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

				const deleted_vestuarios = await ctx.prisma.vestuarioTalento.deleteMany({
					where: {
						id_activos_talentos: activos_por_talento.id
					}
				});
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

				const deleted_props = await ctx.prisma.propsTalento.deleteMany({
					where: {
						id_activos_talentos: activos_por_talento.id
					}
				});
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

				const deleted_equipos_deportivos = await ctx.prisma.equipoDeportivoTalento.deleteMany({
					where: {
						id_activos_talentos: activos_por_talento.id
					}
				});
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
	savePreferencias: protectedProcedure
		.input(z.object({ 
			preferencias: z.object({
				interesado_en_trabajos_de_extra: z.boolean(),
				nombre_agente: z.string().nullish(),
				contacto_agente: z.string().nullish(),
				meses_embarazo: z.number().nullish()
			}),
			tipos_trabajo: z.array(z.number()),
			interes_en_proyectos: z.array(z.number()),
			locaciones: z.array(z.object({
				es_principal: z.boolean(),
  				id_estado_republica: z.number()
			}), {
				errorMap: (issue, _ctx) => {
					switch (issue.code) {
					case 'too_small':
						return { message: 'Se debe enviar al menos una locacion en la peticion' };
					default:
						return { message: 'Formato de locacion invalido' };
					}
				},
			}).min(1),
			documentos: z.array(z.object({
				id_documento: z.number(),
				descripcion: z.string()
			})),
			disponibilidad: z.array(z.number()), 
			otras_profesiones: z.array(z.string().min(3)),
		}))
		.mutation(async ({ input, ctx }) => {
			const user = ctx.session.user; 
			if (user && user.tipo_usuario === TipoUsuario.TALENTO) {

				if (input.locaciones.length === 0 || !input.locaciones.some(l => l.es_principal)) {
					throw new TRPCError({
						code: 'PRECONDITION_FAILED',
						message: 'Se debe enviar al menos una locacion principal',
						// optional: pass the original error to retain stack trace
						//cause: theError,
					});
				}


				const preferencias = await ctx.prisma.preferenciasPorTalentos.upsert({
					where: {id_talento: parseInt(user.id)},
					update: {
						interesado_en_trabajos_de_extra: input.preferencias.interesado_en_trabajos_de_extra,
						nombre_agente: input.preferencias.nombre_agente,
						contacto_agente: input.preferencias.contacto_agente,
						meses_embarazo: input.preferencias.meses_embarazo,
					},
					create: {
						interesado_en_trabajos_de_extra: input.preferencias.interesado_en_trabajos_de_extra,
						nombre_agente: input.preferencias.nombre_agente,
						contacto_agente: input.preferencias.contacto_agente,
						meses_embarazo: input.preferencias.meses_embarazo,
						id_talento: parseInt(user.id)
					}
				})

				const deleted_tipos_de_trabajos = await ctx.prisma.tiposDeTrabajoPorTalentos.deleteMany({
					where: {
						id_preferencias_por_talentos: preferencias.id
					}
				});

				if (!deleted_tipos_de_trabajos) {
					throw new TRPCError({
						code: 'INTERNAL_SERVER_ERROR',
						message: 'Ocurrio un error al tratar de eliminar los tipos de trabajos por talentos',
						// optional: pass the original error to retain stack trace
						//cause: theError,
					});
				} 

				if (input.tipos_trabajo.length > 0) {
					const saved_tipos_de_trabajo = await ctx.prisma.tiposDeTrabajoPorTalentos.createMany({
						data: input.tipos_trabajo.map(tdt => { return {id_tipo_de_trabajo: tdt, id_preferencias_por_talentos: preferencias.id }})
					})

					if (!saved_tipos_de_trabajo) {
						throw new TRPCError({
							code: 'INTERNAL_SERVER_ERROR',
							message: 'Ocurrio un error al tratar de guardar los tipos de trabajos por talentos',
							// optional: pass the original error to retain stack trace
							//cause: theError,
						});
					} 
				}

				const deleted_intereses_en_proyectos = await ctx.prisma.interesEnProyectosPorTalentos.deleteMany({
					where: {
						id_preferencias_por_talentos: preferencias.id
					}
				})

				if (!deleted_intereses_en_proyectos) {
					throw new TRPCError({
						code: 'INTERNAL_SERVER_ERROR',
						message: 'Ocurrio un error al tratar de eliminar los intereses por proyecto por talentos',
						// optional: pass the original error to retain stack trace
						//cause: theError,
					});
				}
				
				if (input.interes_en_proyectos.length > 0) {
					const saved_intereses_en_proyectos = await ctx.prisma.interesEnProyectosPorTalentos.createMany({
						data: input.interes_en_proyectos.map(e => { return {id_interes_en_proyecto: e, id_preferencias_por_talentos: preferencias.id }})
					})
	
					if (!saved_intereses_en_proyectos) {
						throw new TRPCError({
							code: 'INTERNAL_SERVER_ERROR',
							message: 'Ocurrio un error al tratar de guardar los intereses en proyectos por talentos',
							// optional: pass the original error to retain stack trace
							//cause: theError,
						});
					}
				}

				const deleted_locaciones = await ctx.prisma.locacionesPrerenciasPorTalentos.deleteMany({
					where: {
						id_preferencias_por_talentos: preferencias.id
					}
				})

				if (!deleted_locaciones) {
					throw new TRPCError({
						code: 'INTERNAL_SERVER_ERROR',
						message: 'Ocurrio un error al tratar de eliminar las locaciones por talentos',
						// optional: pass the original error to retain stack trace
						//cause: theError,
					});
				}

				if (input.locaciones.length > 0) {
					const saved_locaciones = await ctx.prisma.locacionesPrerenciasPorTalentos.createMany({
						data: input.locaciones.map(e => { return { id_estado_republica: e.id_estado_republica, es_principal: e.es_principal, id_preferencias_por_talentos: preferencias.id } })
					})

					if (!saved_locaciones) {
						throw new TRPCError({
							code: 'INTERNAL_SERVER_ERROR',
							message: 'Ocurrio un error al tratar de guardar las locaciones por talentos',
							// optional: pass the original error to retain stack trace
							//cause: theError,
						});
					}
				}
				
				const deleted_documentos = await ctx.prisma.documentosPorTalentos.deleteMany({
					where: {
						id_preferencias_por_talentos: preferencias.id
					}
				})

				if (!deleted_documentos) {
					throw new TRPCError({
						code: 'INTERNAL_SERVER_ERROR',
						message: 'Ocurrio un error al tratar de eliminar los documentos solicitados por talentos',
						// optional: pass the original error to retain stack trace
						//cause: theError,
					});
				}

				if (input.documentos.length > 0) {
					const saved_documentos = await ctx.prisma.documentosPorTalentos.createMany({
						data: input.documentos.map(e => { return { id_documento: e.id_documento, descripcion: e.descripcion, id_preferencias_por_talentos: preferencias.id } })
					})

					if (!saved_documentos) {
						throw new TRPCError({
							code: 'INTERNAL_SERVER_ERROR',
							message: 'Ocurrio un error al tratar de guardar los documentos solicitados por talentos',
							// optional: pass the original error to retain stack trace
							//cause: theError,
						});
					}
				}

				const deleted_disponibilidad = await ctx.prisma.disponibilidadesPorTalentos.deleteMany({
					where: {
						id_preferencias_por_talentos: preferencias.id
					}
				})

				if (!deleted_disponibilidad) {
					throw new TRPCError({
						code: 'INTERNAL_SERVER_ERROR',
						message: 'Ocurrio un error al tratar de eliminar las disponibilidades por talentos',
						// optional: pass the original error to retain stack trace
						//cause: theError,
					});
				}

				if (input.disponibilidad.length > 0) {
					const saved_disponibilidad = await ctx.prisma.disponibilidadesPorTalentos.createMany({
						data: input.disponibilidad.map(e => { return { id_disponibilidad: e, id_preferencias_por_talentos: preferencias.id } })
					})

					if (!saved_disponibilidad) {
						throw new TRPCError({
							code: 'INTERNAL_SERVER_ERROR',
							message: 'Ocurrio un error al tratar de guardar las disponibilidades por talentos',
							// optional: pass the original error to retain stack trace
							//cause: theError,
						});
					}
				}

				const deleted_otras_profesiones = await ctx.prisma.otrasProfesionesPorTalentos.deleteMany({
					where: {
						id_preferencias_por_talentos: preferencias.id
					}
				})

				if (!deleted_otras_profesiones) {
					throw new TRPCError({
						code: 'INTERNAL_SERVER_ERROR',
						message: 'Ocurrio un error al tratar de eliminar las otras profesiones por talentos',
						// optional: pass the original error to retain stack trace
						//cause: theError,
					});
				}

				if (input.otras_profesiones.length > 0) {
					const saved_otras_profesiones = await ctx.prisma.otrasProfesionesPorTalentos.createMany({
						data: input.otras_profesiones.map(e => { return { descripcion: e, id_preferencias_por_talentos: preferencias.id } })
					})

					if (!saved_otras_profesiones) {
						throw new TRPCError({
							code: 'INTERNAL_SERVER_ERROR',
							message: 'Ocurrio un error al tratar de guardar las otras profesiones por talentos',
							// optional: pass the original error to retain stack trace
							//cause: theError,
						});
					}
				}
				return preferencias;
			}
			throw new TRPCError({
				code: 'UNAUTHORIZED',
				message: 'Solo el rol de talento puede modificar las habilidades',
				// optional: pass the original error to retain stack trace
				//cause: theError,
			});
		}
	),
	saveFiltrosApariencias: protectedProcedure
		.input(z.object({ 
			apariencia: z.object({
				rango_inicial_edad: z.number(),
				rango_final_edad: z.number(),
				id_genero: z.number(),
				id_apariencia_etnica: z.number(),
				id_color_cabello: z.number(),
				disposicion_cambio_color_cabello: z.boolean(),
				id_estilo_cabello: z.number(),
				disposicion_corte_cabello: z.boolean(),
				id_vello_facial: z.number(),
				disposicion_afeitar_o_crecer_vello_facial: z.boolean(),
				id_color_ojos: z.number()
			}),
			generos_interesado_en_interpretar: z.array(z.number()),
			tatuajes: z.array(z.object({
				id_tipo_tatuaje: z.number(),
				descripcion: z.string()
			})),
			piercings: z.array(z.object({
				id_tipo_piercing: z.number(),
  				descripcion: z.string()
			})),
			hermanos: z.object({
				id_tipo_hermanos: z.number(),
  				descripcion: z.string()
			}).nullish(),
			particularidades: z.array(z.object({
				id_particularidad: z.number(),
  				descripcion: z.string()
			}))
		}))
		.mutation(async ({ input, ctx }) => {
			const user = ctx.session.user; 
			if (user && user.tipo_usuario === TipoUsuario.TALENTO) {
				const filtros = await ctx.prisma.filtrosAparenciasPorTalentos.upsert({
					where: {id_talento: parseInt(user.id)},
					update: {...input.apariencia},
					create: {
						...input.apariencia,
						id_talento: parseInt(user.id)
					}
				})

				const deleted_intereses_en_interpretar = await ctx.prisma.generosInteresadosEnInterpretarPorTalentos.deleteMany({
					where: {
						id_filtros_apariencias_por_talentos: filtros.id
					}
				});

				if (!deleted_intereses_en_interpretar) {
					throw new TRPCError({
						code: 'INTERNAL_SERVER_ERROR',
						message: 'Ocurrio un error al tratar de eliminar los intereses en generos por interpretar por talentos',
						// optional: pass the original error to retain stack trace
						//cause: theError,
					});
				} 

				if (input.generos_interesado_en_interpretar.length > 0) {
					const saved_intereses_en_interpretar = await ctx.prisma.generosInteresadosEnInterpretarPorTalentos.createMany({
						data: input.generos_interesado_en_interpretar.map(g => { return {id_genero: g, id_filtros_apariencias_por_talentos: filtros.id }})
					})

					if (!saved_intereses_en_interpretar) {
						throw new TRPCError({
							code: 'INTERNAL_SERVER_ERROR',
							message: 'Ocurrio un error al tratar de guardar los intereses en generos por interpretar por talentos',
							// optional: pass the original error to retain stack trace
							//cause: theError,
						});
					} 
				}

				const deleted_tatuajes = await ctx.prisma.tatuajesPorTalentos.deleteMany({
					where: {
						id_filtros_apariencias_por_talentos: filtros.id
					}
				})

				if (!deleted_tatuajes) {
					throw new TRPCError({
						code: 'INTERNAL_SERVER_ERROR',
						message: 'Ocurrio un error al tratar de eliminar los tatuajes por talentos',
						// optional: pass the original error to retain stack trace
						//cause: theError,
					});
				}

				if (input.tatuajes.length > 0) {
					const saved_tatuajes = await ctx.prisma.tatuajesPorTalentos.createMany({
						data: input.tatuajes.map(e => { return {descripcion: e.descripcion, id_tipo_tatuaje: e.id_tipo_tatuaje, id_filtros_apariencias_por_talentos: filtros.id }})
					})
	
					if (!saved_tatuajes) {
						throw new TRPCError({
							code: 'INTERNAL_SERVER_ERROR',
							message: 'Ocurrio un error al tratar de guardar los tatuajes por talentos',
							// optional: pass the original error to retain stack trace
							//cause: theError,
						});
					}
				}

				const deleted_piercings = await ctx.prisma.piercingsPorTalentos.deleteMany({
					where: {
						id_filtros_apariencias_por_talentos: filtros.id
					}
				})

				if (!deleted_piercings) {
					throw new TRPCError({
						code: 'INTERNAL_SERVER_ERROR',
						message: 'Ocurrio un error al tratar de eliminar los piercings por talentos',
						// optional: pass the original error to retain stack trace
						//cause: theError,
					});
				}

				if (input.piercings.length > 0) {
					const saved_piercings = await ctx.prisma.piercingsPorTalentos.createMany({
						data: input.piercings.map(e => { return {id_tipo_piercing: e.id_tipo_piercing, descripcion: e.descripcion, id_filtros_apariencias_por_talentos: filtros.id }})
					})
	
					if (!saved_piercings) {
						throw new TRPCError({
							code: 'INTERNAL_SERVER_ERROR',
							message: 'Ocurrio un error al tratar de guardar los piercings por talentos',
							// optional: pass the original error to retain stack trace
							//cause: theError,
						});
					}
				}

				if (input.hermanos) {
					const saved_hermanos = await ctx.prisma.tipoHermanosPorTalento.upsert({
						where: {id_filtros_apariencias_por_talentos: filtros.id},
						update: input.hermanos,
						create: {
							...input.hermanos,
							id_filtros_apariencias_por_talentos: filtros.id
						}
					});

					if (!saved_hermanos) {
						throw new TRPCError({
							code: 'INTERNAL_SERVER_ERROR',
							message: 'Ocurrio un error al tratar de guardar el tipo de hermanos por talentos',
							// optional: pass the original error to retain stack trace
							//cause: theError,
						});
					}
				} else {
					const deleted_hermanos = await ctx.prisma.tipoHermanosPorTalento.delete({
						where: {
							id_filtros_apariencias_por_talentos: filtros.id
						}
					})
	
					if (!deleted_hermanos) {
						throw new TRPCError({
							code: 'INTERNAL_SERVER_ERROR',
							message: 'Ocurrio un error al tratar de eliminar el tipo de hermano por talentos',
							// optional: pass the original error to retain stack trace
							//cause: theError,
						});
					}
				}


				const deleted_particularidades = await ctx.prisma.particularidadesPorTalentos.deleteMany({
					where: {
						id_filtros_apariencias_por_talentos: filtros.id
					}
				})

				if (!deleted_particularidades) {
					throw new TRPCError({
						code: 'INTERNAL_SERVER_ERROR',
						message: 'Ocurrio un error al tratar de eliminar las particularidades por talentos',
						// optional: pass the original error to retain stack trace
						//cause: theError,
					});
				}

				if (input.particularidades.length > 0) {
					const saved_particularidades = await ctx.prisma.particularidadesPorTalentos.createMany({
						data: input.particularidades.map(e => { return {descripcion: e.descripcion, id_particularidad: e.id_particularidad, id_filtros_apariencias_por_talentos: filtros.id }})
					})
	
					if (!saved_particularidades) {
						throw new TRPCError({
							code: 'INTERNAL_SERVER_ERROR',
							message: 'Ocurrio un error al tratar de guardar las particularidades por talentos',
							// optional: pass the original error to retain stack trace
							//cause: theError,
						});
					}
				}
				
				return filtros;
			}
			throw new TRPCError({
				code: 'UNAUTHORIZED',
				message: 'Solo el rol de talento puede modificar las habilidades',
				// optional: pass the original error to retain stack trace
				//cause: theError,
			});
		})
	},
);