import { Box, Grid, IconButton, Link, Typography } from "@mui/material";
import { api } from "~/utils/api";
import { PreviewConversation } from "./Mensajes/PreviewConversation";
import { useState } from "react";
import { Conversaciones, Proyecto } from "@prisma/client";
import { useSession } from "next-auth/react";
import { Close } from "@mui/icons-material";
import { useRouter } from "next/router";

export const ConversacionesPreview = (props: {width: string | number, onClose: () => void}) => {
    const conversaciones = api.mensajes.getConversaciones.useQuery();
    const router = useRouter();
    const session = useSession();
    const user_id = (session.data && session.data.user) ? parseInt(session.data.user.id) : 0;

    return (
        <Grid container width={props.width} sx={{backgroundColor: 'white'}}>
            <Grid item xs={12}>
                <Grid item xs={12} sx={{
                    border: '2px solid #069cb1',
                    padding: '20px'
                }}>
                    <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'}>
                        <Box>
                            <Typography fontWeight={600}>
                                Conversaciones
                            </Typography>
                            <Link href="/mensajes">
                                Ir a mensajes
                            </Link>
                        </Box>
                        <IconButton onClick={props.onClose}>
                            <Close/>
                        </IconButton>
                    </Box>
                </Grid>
                <Grid item xs={12} sx={{
                    height: '450px',
                    border: '2px solid #B4B5B6',
                    borderTop: 'none',
                    overflowY: 'scroll'
                }}>
                    {conversaciones.isInitialLoading && conversaciones.isFetching &&
                        Array.from({ length: 10 }).map((_, i) => (
                            <PreviewConversation 
                                loading
                                key={i} 
                            />
                        ))
                    }
                    {conversaciones.isFetched && conversaciones.data && conversaciones.data.length === 0 &&
                            <Typography>No tienes ninguna conversacion aun</Typography>  
                    }
                    {conversaciones.isFetched && conversaciones.data &&
                        conversaciones.data.map((c, i) => {
                            const mensaje = c.mensajes[0];
                            return <Box onClick={() => {
                                router.push(`/mensajes?id_conversacion=${c.id}`)
                            }}>
                                <PreviewConversation 
                                    loading={false}
                                    profile_url={(user_id === c.id_receptor) ? c.emisor?.profile_url : c.receptor?.profile_url}
                                    nombre={(user_id === c.id_receptor) ? c.emisor?.nombre : c.receptor?.nombre}
                                    hora={(mensaje) ? mensaje.hora_envio.toLocaleTimeString('es-mx', { day: 'numeric', month: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true}) : 'ND'}
                                    visto={(mensaje) ? mensaje.visto : true}
                                    mensaje={c.latest_message}
                                    nombre_proyecto={(c.proyecto) ? c.proyecto.nombre : ''}
                                    key={i} 
                                />
                            </Box>
                        })
                    }
                </Grid>
            </Grid>
        </Grid>
                            
    )
}