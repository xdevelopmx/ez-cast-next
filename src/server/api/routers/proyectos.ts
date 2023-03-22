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
    getAllByIdCazatalentos: publicProcedure
		.input(z.object({ id: z.number() }))
		.query(async ({ input, ctx }) => {
			const proyectos = await ctx.prisma.proyecto.findMany({
				where: {id_cazatalentos: input.id}
			});
			return proyectos;
		}
	),
	getById: publicProcedure
		.input(z.object({ id: z.number() }))
		.query(async ({ input, ctx }) => {
			const proyecto = await ctx.prisma.proyecto.findUnique({
				where: {id: input.id}
			});
			return proyecto;
		}
	),
  	updateProyecto: protectedProcedure
    	.input(z.object({ 
			id: z.number().nullish(),
			proyecto: z.object({
				nombre: z.string(),
				sindicato: z.string(),
				tipo: z.string(),
				director_casting: z.string(),
				telefono_contacto: z.string(),
				email_contacto: z.string(),
				productor: z.string(),
				casa_productora: z.string(),
				director: z.string(),
				agencia_publicidad: z.string(),
				sinopsis: z.string(),
				detalles_adicionales: z.string(),
				locacion: z.string(),
				compartir_nombre: z.boolean(),
				estatus: z.string(),
			}),
			files: z.object({
				archivo: z.object({
					base64: z.string(),
					extension: z.string()
				}).nullish(),
				foto_portada: z.object({
					base64: z.string(),
					extension: z.string()
				}).nullish()
			}).nullish()
		}))
		.mutation(async ({ input, ctx }) => {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
			if (ctx.session && ctx.session.user && ctx.session.user.tipo_usuario === TipoUsuario.CAZATALENTOS) {
				const proyecto: Proyecto = await ctx.prisma.proyecto.upsert({
					where: {
						id: (input.id) ? input.id : 0
					},
					update: input.proyecto,
					create: {...input.proyecto, id_cazatalentos: parseInt(ctx.session.user.id)},
				});
				if (!proyecto) {
					throw new TRPCError({
						code: 'INTERNAL_SERVER_ERROR',
						message: 'Ocurrio un error al tratar de guardar el proyecto',
						// optional: pass the original error to retain stack trace
						//cause: theError,
					});
				}

				if (input.files) {
					const updated_files: {url_archivo: string | null, url_foto_portada: string | null} = { url_archivo: null, url_foto_portada: null};
					if (input.files.archivo) {
						const save_result = await FileManager.saveFile(`archivo.${input.files.archivo.extension}`, input.files.archivo.base64, `cazatalentos/${ctx.session.user.id}/proyectos/${proyecto.id}/archivo/`);
						if (!save_result.error) {
							updated_files.url_archivo = save_result.result;
						}
					}
					if (input.files.foto_portada) {
						const save_result = await FileManager.saveFile(`foto-portada.${input.files.foto_portada.extension}`, input.files.foto_portada.base64, `cazatalentos/${ctx.session.user.id}/proyectos/${proyecto.id}/foto-portada/`);
						if (!save_result.error) {
							updated_files.url_foto_portada = save_result.result;
						} 
					}
					const updated_proyecto = await ctx.prisma.proyecto.update({
						where: {id : proyecto.id},
						data: updated_files
					});
					if (!updated_proyecto) {
						throw new TRPCError({
							code: 'INTERNAL_SERVER_ERROR',
							message: 'Ocurrio un error al tratar de guardar los archivos del proyecto',
							// optional: pass the original error to retain stack trace
							//cause: theError,
						});
					}
					return updated_proyecto;
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
				const proyecto: Proyecto | null = await ctx.prisma.proyecto.findUnique({where: {id: input.id}});
				if (proyecto) {

					if (proyecto.url_archivo) {
						const delete_result = await FileManager.deleteFile(proyecto.url_archivo);
						if (delete_result.error) {
							throw new TRPCError({
								code: 'INTERNAL_SERVER_ERROR',
								message: 'No se pudo eliminar el archivo del proyecto',
								// optional: pass the original error to retain stack trace
								//cause: theError,
							});
						}
					}

					if (proyecto.url_foto_portada) {
						const delete_result = await FileManager.deleteFile(proyecto.url_foto_portada);
						if (delete_result.error) {
							throw new TRPCError({
								code: 'INTERNAL_SERVER_ERROR',
								message: 'No se pudo eliminar la foto del proyecto',
								// optional: pass the original error to retain stack trace
								//cause: theError,
							});
						}
					}

					const deleted_proyecto = await ctx.prisma.proyecto.delete({where: {id: proyecto.id}});
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
});