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

export const MensajesRouter = createTRPCRouter({
    markConversacionAsSeen: publicProcedure.input(z.object({
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
            },
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
    saveMensaje: publicProcedure.input(z.object({
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
    getMensajesByConversacion: publicProcedure.input(z.number()).query(async ({ input, ctx }) => {
        if (input <= 0) return null;
        const mensajes = await ctx.prisma.mensaje.findMany({
            where: {
                id_conversacion: input
            },
            orderBy: {id: 'asc'}
        })
        return Promise.all(await mensajes.map(async (m) => {
            let emisor: {nombre: string, profile_url: string} | null = {nombre: 'ND', profile_url: '/assets/img/no-image.png'};
            let receptor: {nombre: string, profile_url: string} | null = {nombre: 'ND', profile_url: '/assets/img/no-image.png'};
            switch (m.tipo_usuario_emisor) {
                case TipoUsuario.TALENTO: {
                    const talento = await ctx.prisma.talentos.findFirst({
                        where: {
                            id: m.id_emisor
                        },
                        include: {
                            media: {
                                include: {
                                    media: true
                                }
                            }
                        }
                    })
                    if (talento) {
                        const foto_perfil = talento.media.filter(m => m.media.identificador.includes('foto-perfil'))[0];
                        if (foto_perfil) {
                            emisor = {nombre: `${talento.nombre} ${talento.apellido}`, profile_url: foto_perfil.media.url};
                        } else {
                            emisor = {nombre: `${talento.nombre} ${talento.apellido}`, profile_url: '/assets/img/no-image.png'};
                        }
                    }
                    break;
                }
                case TipoUsuario.REPRESENTANTE: {
                    const representante = await ctx.prisma.representante.findFirst({
                        where: {
                            id: m.id_emisor
                        },
                        include: {
                            foto_perfil: true
                        }
                    })
                    if (representante) {
                        emisor = {nombre: `${representante.nombre} ${representante.apellido}`, profile_url: (representante.foto_perfil) ? representante.foto_perfil.url : '/assets/img/no-image.png'};
                    }
                    break;
                }
                case TipoUsuario.CAZATALENTOS: {
                    const cazatalentos = await ctx.prisma.cazatalentos.findFirst({
                        where: {
                            id: m.id_emisor
                        },
                        include: {
                            foto_perfil: true
                        }
                    })
                    if (cazatalentos) {
                        emisor = {nombre: `${cazatalentos.nombre} ${cazatalentos.apellido}`, profile_url: (cazatalentos.foto_perfil) ? cazatalentos.foto_perfil.url : '/assets/img/no-image.png'};
                    }
                    break;
                }
            }
                
            switch (m.tipo_usuario_receptor) {
                case TipoUsuario.TALENTO: {
                    const talento = await ctx.prisma.talentos.findFirst({
                        where: {
                            id: m.id_receptor
                        },
                        include: {
                            media: {
                                include: {
                                    media: true
                                }
                            }
                        }
                    })
                    if (talento) {
                        const foto_perfil = talento.media.filter(m => m.media.identificador.includes('foto-perfil'))[0];
                        if (foto_perfil) {
                            receptor = {nombre: `${talento.nombre} ${talento.apellido}`, profile_url: foto_perfil.media.url};
                        } else {
                            receptor = {nombre: `${talento.nombre} ${talento.apellido}`, profile_url: '/assets/img/no-image.png'};
                        }
                    }
                    break;
                }
                case TipoUsuario.REPRESENTANTE: {
                    const representante = await ctx.prisma.representante.findFirst({
                        where: {
                            id: m.id_receptor
                        },
                        include: {
                            foto_perfil: true
                        }
                    })
                    if (representante) {
                        emisor = {nombre: `${representante.nombre} ${representante.apellido}`, profile_url: (representante.foto_perfil) ? representante.foto_perfil.url : '/assets/img/no-image.png'};
                    }
                    break;
                }
                case TipoUsuario.CAZATALENTOS: {
                    const cazatalentos = await ctx.prisma.cazatalentos.findFirst({
                        where: {
                            id: m.id_receptor
                        },
                        include: {
                            foto_perfil: true
                        }
                    })
                    if (cazatalentos) {
                        receptor = {nombre: `${cazatalentos.nombre} ${cazatalentos.apellido}`, profile_url: (cazatalentos.foto_perfil) ? cazatalentos.foto_perfil.url : '/assets/img/no-image.png'};
                    }
                    break;
                }
            }
            return {...m, emisor: emisor, receptor: receptor}; 
        }))
    }),
    getConversaciones: publicProcedure.query(async ({ ctx }) => {
        const user = ctx.session?.user; 
        if (user) {
            const conversaciones = await ctx.prisma.conversaciones.findMany({
                where: {
                    OR: [
                        {
                            id_emisor: parseInt(user.id),
                            tipo_usuario_emisor: user.tipo_usuario
                        },
                        { 
                            id_receptor: parseInt(user.id),
                            tipo_usuario_receptor: user.tipo_usuario
                        },
                    ],
                },
                include: {
                    proyecto: true,
                    mensajes: {
                        take: 1,
                        orderBy: { hora_envio: 'desc' }
                    }
                }
            });

            return Promise.all(await conversaciones.sort((a, b) => { 
                const m1 = a.mensajes[0]?.hora_envio;
                const m2 = b.mensajes[0]?.hora_envio;
                if (m1 && m2) {
                    return m2.getTime() - m1.getTime();
                }
                return 0;
            }).map(async (c) => {
                let latest_message = '';
                let emisor: {nombre: string, profile_url: string} | null = null;
                let receptor: {nombre: string, profile_url: string} | null = null;
                switch (c.tipo_usuario_emisor) {
                    case TipoUsuario.TALENTO: {
                        const talento = await ctx.prisma.talentos.findFirst({
                            where: {
                                id: c.id_emisor
                            },
                            include: {
                                media: {
                                    include: {
                                        media: true
                                    }
                                }
                            }
                        })
                        if (talento) {
                            const foto_perfil = talento.media.filter(m => m.media.identificador.includes('foto-perfil'))[0];
                            if (foto_perfil) {
                                emisor = {nombre: `${talento.nombre} ${talento.apellido}`, profile_url: foto_perfil.media.url};
                            } else {
                                emisor = {nombre: `${talento.nombre} ${talento.apellido}`, profile_url: '/assets/img/no-image.png'};
                            }
                        }
                        break;
                    }
                    case TipoUsuario.REPRESENTANTE: {
                        const representante = await ctx.prisma.representante.findFirst({
                            where: {
                                id: c.id_emisor
                            },    
                            include: {
                                foto_perfil: true
                            }
                        })
                        if (representante) {
                            emisor = {nombre: `${representante.nombre} ${representante.apellido}`, profile_url: (representante.foto_perfil) ? representante.foto_perfil.url : '/assets/img/no-image.png'};
                        }
                        break;
                    }
                    case TipoUsuario.CAZATALENTOS: {
                        const cazatalentos = await ctx.prisma.cazatalentos.findFirst({
                            where: {
                                id: c.id_emisor
                            },
                            include: {
                                foto_perfil: true
                            }
                        })
                        if (cazatalentos) {
                            emisor = {nombre: `${cazatalentos.nombre} ${cazatalentos.apellido}`, profile_url: (cazatalentos.foto_perfil) ? cazatalentos.foto_perfil.url : '/assets/img/no-image.png'};
                        }
                    }
                }
                switch (c.tipo_usuario_receptor) {
                    case TipoUsuario.TALENTO: {
                        const talento = await ctx.prisma.talentos.findFirst({
                            where: {
                                id: c.id_receptor
                            },
                            include: {
                                media: {
                                    include: {
                                        media: true
                                    }
                                }
                            }
                        })
                        if (talento) {
                            const foto_perfil = talento.media.filter(m => m.media.identificador.includes('foto-perfil'))[0];
                            if (foto_perfil) {
                                receptor = {nombre: `${talento.nombre} ${talento.apellido}`, profile_url: foto_perfil.media.url};
                            } else {
                                receptor = {nombre: `${talento.nombre} ${talento.apellido}`, profile_url: '/assets/img/no-image.png'};
                            }
                        }
                        break;
                    }
                    case TipoUsuario.REPRESENTANTE: {
                        const representante = await ctx.prisma.representante.findFirst({
                            where: {
                                id: c.id_receptor
                            },
                            include: {
                                foto_perfil: true
                            }
                        })
                        if (representante) {
                            emisor = {nombre: `${representante.nombre} ${representante.apellido}`, profile_url: (representante.foto_perfil) ? representante.foto_perfil.url : '/assets/img/no-image.png'};
                        }
                        break;
                    }
                    case TipoUsuario.CAZATALENTOS: {
                        const cazatalentos = await ctx.prisma.cazatalentos.findFirst({
                            where: {
                                id: c.id_receptor
                            },
                            include: {
                                foto_perfil: true
                            }
                        })
                        if (cazatalentos) {
                            receptor = {nombre: `${cazatalentos.nombre} ${cazatalentos.apellido}`, profile_url: (cazatalentos.foto_perfil) ? cazatalentos.foto_perfil.url : '/assets/img/no-image.png'};
                        }
                    }
                }
                const msg = c.mensajes[0];

                if (msg) {
                    const params = JSON.parse(msg.mensaje) as {message: string};
                    latest_message = params.message;
                }
                return {...c, latest_message: latest_message, emisor: emisor, receptor: receptor}; 
            }))
        }
        return [];
    }
),
});