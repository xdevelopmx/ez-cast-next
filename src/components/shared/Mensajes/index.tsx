import { Box, Button, Grid, TextField, Typography } from '@mui/material'
import React from 'react'
import Image from 'next/image'
import { PreviewConversation } from './PreviewConversation'
import { Message } from './Message'
import { ConfirmacionDialog } from './ConfirmacionDialog'

export const Mensajes = () => {
    return (
        <Grid container>
            <Grid item xs={12} md={4.5}>
                <Grid item xs={12} sx={{
                    border: '2px solid #069cb1',
                    padding: '20px'
                }}>
                    <Typography fontWeight={600}>
                        Conversaciones
                    </Typography>
                </Grid>
                <Grid item xs={12} sx={{
                    height: '450px',
                    border: '2px solid #B4B5B6',
                    borderTop: 'none',
                    overflowY: 'scroll'
                }}>
                    {
                        Array.from({ length: 10 }).map((_, i) => (
                            <PreviewConversation loading={false} key={i} />
                        ))
                    }
                </Grid>
            </Grid>
            <Grid item xs={12} md={7.5}>
                <Grid item xs={12} sx={{
                    border: '2px solid #069cb1',
                    padding: '20px',
                    borderLeft: 'none'
                }}>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        <Image style={{ marginRight: '10px' }}
                            src="/assets/img/iconos/icono_head_chat.png" width={20} height={20} alt="icono" />
                        <Typography fontWeight={600}>
                            Nombre talento
                        </Typography>
                    </Box>
                </Grid>
                <Grid item xs={12} sx={{
                    height: '400px',
                    border: '2px solid #B4B5B6',
                    borderTop: 'none',
                    borderLeft: 'none',
                    borderBottom: '2px solid #069cb1',
                    overflowY: 'scroll',
                    padding: '20px 40px 0px 40px',
                    backgroundColor: '#F2F2F2',
                }}>
                    <ConfirmacionDialog />
                    {
                        Array.from({ length: 10 }).map((_, i) => (
                            <Message
                                key={i}
                                nombre={i % 2 === 0 ? 'Natalia Reyes' : 'Carlos Flores'}
                                mensaje={'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas vel luctus enim. Nullam varius tellus ut eleifend consectetur. Vivamus ut augue vel eros viverra lobortis. '}
                                imagen={`/assets/img/slider_modelo_0${i % 2 === 0 ? '2' : '1'}.png`}
                                esMensajePropio={i % 2 === 0}
                            />
                        ))
                    }
                </Grid>
                <Grid item xs={12} sx={{
                    height: '100px',
                    borderRight: '2px solid #B4B5B6',
                    borderBottom: '2px solid #B4B5B6'
                }}>
                    <Box
                        sx={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '20px 40px',
                            justifyContent: 'space-between'
                        }}
                    >

                        <Box sx={{
                            position: 'relative',
                            width: 'calc( 100% - 100px )'
                        }}>
                            <TextField
                                sx={{
                                    width: '100%',

                                }}
                                InputProps={{
                                    style: { paddingRight: '50px' }
                                }}
                                placeholder='Escribir mensaje'
                            />

                            <Image style={{
                                position: 'absolute',
                                top: '50%',
                                right: '20px',
                                transform: 'translate(0,-50%)'
                            }} src={'/assets/img/iconos/icon_camara_blue.svg'}
                                width={30} height={30} alt="" />

                        </Box>

                        <Button sx={{
                            backgroundColor: '#069cb1',
                            color: '#fff',
                            '&:hover': {
                                backgroundColor: '#069cb1',
                            }
                        }}>
                            Enviar
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Grid>
    )
}
