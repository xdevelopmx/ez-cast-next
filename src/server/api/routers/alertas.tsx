import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
	createTRPCRouter,
	protectedProcedure,
	publicProcedure,
} from "~/server/api/trpc";
import { FileManager } from "~/utils/file-manager";
import { TipoConversaciones, TipoMensajes, TipoUsuario } from "~/enums";
import { Proyecto } from "@prisma/client";
import dayjs from "dayjs";

export const AlertasRouter = createTRPCRouter({
    markAsSeen: publicProcedure.input(z.object({
        id_user_interaction: z.number(),
        id_conversacion: z.number()
    })).mutation(async ({ input, ctx }) => {
        if (input.id_user_interaction <= 0 || input.id_conversacion <= 0) return false;
        const conversacion = await ctx.prisma.conversaciones.findFirst({
            where: {
                id: input.id_conversacion,
            },
            include: {
                mensajes: {
                    take: 1,
                    orderBy: { hora_envio: 'desc' }
                }
            }
        })
        console.log(conversacion);
        if (conversacion) {
            const mensaje = conversacion.mensajes[0];
            if (mensaje && !mensaje.visto && mensaje.id_receptor === input.id_user_interaction) {
                // si es el usuario el que entra entonces marcamos como visto
                const saved_mensaje = await ctx.prisma.mensaje.update({
                    where: {
                        id: mensaje.id
                    },
                    data: {
                        visto: true
                    }
                })
                if (saved_mensaje) {
                    return true;
                }
            }
        }
        return false;
    }),
    save: publicProcedure.input(z.object({
        id_conversacion: z.number(),
        id_emisor: z.number(),
        tipo_usuario_emisor: z.string(),
        id_receptor: z.number(),
        tipo_usuario_receptor: z.string(),
        mensaje: z.string()
    })).mutation(async ({ input, ctx }) => {
        if (input.id_conversacion <= 0 || input.id_emisor <= 0 || input.id_receptor <= 0 || input.mensaje.length === 0) return null;
        const mensaje = await ctx.prisma.mensaje.create({
            data: {
                id_conversacion: input.id_conversacion,
                id_emisor: input.id_emisor,
                tipo_usuario_emisor: input.tipo_usuario_emisor,
                id_receptor: input.id_receptor,
                tipo_usuario_receptor: input.tipo_usuario_receptor,
                visto: false,
                hora_envio: dayjs().toDate(),
                mensaje: JSON.stringify({
                    message: input.mensaje
                }),
                type: TipoMensajes.TEXT
            }
        })
        return mensaje;
    }),
    getByUser: publicProcedure.input(z.object({
        id_user: z.number(),
        tipo_user: z.string()
    })).query(async ({ input, ctx }) => {
        return await ctx.prisma.alertas.findMany({
            where: {
               id_usuario: input.id_user,
               tipo_usuario: input.tipo_user, 
            },
            orderBy: {id: 'desc'}
        });
    }
),
});