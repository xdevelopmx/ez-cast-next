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