import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
	createTRPCRouter,
	protectedProcedure,
	publicProcedure,
} from "~/server/api/trpc";
import { FileManager } from "~/utils/file-manager";
import { TipoUsuario } from "~/enums";

export const BannersRouter = createTRPCRouter({
	deleteBanner: protectedProcedure
		.input(z.number())
		.mutation(async ({ input, ctx }) => {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
			if (ctx.session && ctx.session.user && ctx.session.user.tipo_usuario === TipoUsuario.ADMIN) {
				
                const banner = await ctx.prisma.banners.findFirst({
                    where: {
                        id: input
                    },
                    include: {
                        content: true
                    }
                })
                if (banner) {
                    
                    await FileManager.deleteFiles([banner.content.clave])

                    await ctx.prisma.banners.delete({
                        where: {
                            id: input
                        },
                    });
                }
				
				return true;
			}
			throw new TRPCError({
				code: 'UNAUTHORIZED',
				message: 'Solo el rol de cazatalentos puede modificar los proyectos',
				// optional: pass the original error to retain stack trace
				//cause: theError,
			});
		}
	),
  	updateBanner: protectedProcedure
    	.input(z.object({
			id: z.number().nullish(),
			position: z.string(),
            isButton: z.boolean(),
            text: z.string(),
            redirect_url: z.string(),
            type: z.string(),
            content: z.object({
				id: z.number().nullish(),
				nombre: z.string(),
				type: z.string(),
				url: z.string(),
				clave: z.string(),
				referencia: z.string(),
				identificador: z.string()
			}),
            identificador: z.string(),
            ref: z.string()
		}))
		.mutation(async ({ input, ctx }) => {
			console.log('INPUT updateBanner', input);
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
			if (ctx.session && ctx.session.user && ctx.session.user.tipo_usuario === TipoUsuario.ADMIN) {
				
                let media = await ctx.prisma.media.findFirst({
                    where: {
                        identificador: input.identificador
                    }
                });
                if (media) {
                    await FileManager.deleteFiles([media.clave]);
                }
                media = await ctx.prisma.media.upsert({
                    where: {
                        id: (media) ? media.id : 0
                    },
                    update: {
                        nombre: input.content.nombre,
                        type: input.content.type,
                        url: input.content.url,
                        clave: input.content.clave,
                        referencia: input.content.referencia,
                        identificador: input.content.identificador
                    },
                    create: {
                        nombre: input.content.nombre,
                        type: input.content.type,
                        url: input.content.url,
                        clave: input.content.clave,
                        referencia: input.content.referencia,
                        identificador: input.content.identificador
                    }
                })
                
                
                const banner = await ctx.prisma.banners.upsert({
					where: {
						id: (input.id) ? input.id : 0
					},
					update: {
                        position: input.position,
                        isButton: input.isButton,
                        text: input.text,
                        redirect_url: input.redirect_url,
                        type: input.type,
                        id_media_content: media.id,
                        identificador: input.identificador,
                        ref: input.ref
                    },
					create: {
                        position: input.position,
                        isButton: input.isButton,
                        text: input.text,
                        redirect_url: input.redirect_url,
                        type: input.type,
                        id_media_content: media.id,
                        identificador: input.identificador,
                        ref: input.ref
                    }
				});
				if (!banner) {
					throw new TRPCError({
						code: 'INTERNAL_SERVER_ERROR',
						message: 'Ocurrio un error al tratar de guardar el banner',
						// optional: pass the original error to retain stack trace
						//cause: theError,
					});
				}
				return banner;
			}
			throw new TRPCError({
				code: 'UNAUTHORIZED',
				message: 'Solo el rol de admin puede modificar los banners',
				// optional: pass the original error to retain stack trace
				//cause: theError,
			});
		}
	),
    getBannersByRef: publicProcedure
        .input(z.string())
        .query(async ({ input, ctx }) => {
            return await ctx.prisma.banners.findMany({
                where: {
                    ref: input
                },
                include: {
                    content: true
                }
            });
        }
    ),
    getBannerByIdentificador: publicProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
        return await ctx.prisma.banners.findFirst({
            where: {
                identificador: input
            },
            include: {
                content: true
            }
        });
    }
),
getAll: publicProcedure
    .query(async ({ ctx }) => {
        return await ctx.prisma.banners.findMany({
            include: {
                content: true
            }
        });
    }
),
});