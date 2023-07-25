import { Box, Button, ButtonGroup, Link, Typography } from '@mui/material'
import React, { type CSSProperties } from 'react'
import Image from 'next/image'
import { api, parseErrorBody } from '~/utils/api'
import Constants from '~/constants'
import useNotify from '~/hooks/useNotify'
import { useQuery } from '@tanstack/react-query'
import { AudioBar } from '../../AudioBar'

const estilos_ellipsis: CSSProperties = {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
}

const estilos_mensaje_propio: CSSProperties = {
    backgroundColor: '#069cb1',
    color: '#fff'
}

const estilos_mensaje_no_propio: CSSProperties = {
    backgroundColor: '#fff',
    color: '#000'
}

type Props = {
    esMensajePropio: boolean;
    nombre: string;
    mensaje: string;
    imagen: string;
}

export const Message = ({ imagen, mensaje, esMensajePropio, nombre }: Props) => {
    return (
        <Box 
            sx={{
                display: 'flex',
                alignItems: 'flex-start',
                margin: '25px 0px',
                flexDirection: esMensajePropio ? 'row-reverse' : 'row'
            }}
        >
            <Box sx={{
                position: 'relative',
                width: '60px',
                aspectRatio: '1/1',
                marginRight: esMensajePropio ? '0px' : '20px',
                marginLeft: esMensajePropio ? '20px' : '0px',
            }}>
                <Image src={imagen} style={{
                    borderRadius: '100%'
                }} fill alt="" />
            </Box>

            <Box sx={{
                width: 'calc( 100% - 80px )',
                minWidth: '50%',
                padding: '10px 20px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
                borderRadius: '10px',
                ...esMensajePropio ? estilos_mensaje_propio : estilos_mensaje_no_propio
            }}>
                <Typography sx={{
                    color: esMensajePropio ? '#fff' : '#069cb1',
                    //fontWeight: 600,
                    ...estilos_ellipsis
                }}>
                    {nombre}
                </Typography>
                <Typography>
                    {mensaje}
                </Typography>
            </Box>
        </Box>
    )
}

export const MediaMessage = ({ imagen, mensaje, esMensajePropio, nombre }: Props) => {

    const blob = api.mensajes.getBlobMensaje.useQuery(mensaje, {
        refetchOnWindowFocus: false
    });

    if (blob.data && blob.data.type === 'application/xml') {
        return null;
    }
    return (
        <Box 
            sx={{
                display: 'flex',
                alignItems: 'flex-start',
                margin: '25px 0px',
                flexDirection: esMensajePropio ? 'row-reverse' : 'row'
            }}
        >
            <Box sx={{
                position: 'relative',
                width: '60px',
                aspectRatio: '1/1',
                marginRight: esMensajePropio ? '0px' : '20px',
                marginLeft: esMensajePropio ? '20px' : '0px',
            }}>
                <Image src={imagen} style={{
                    borderRadius: '100%'
                }} fill alt="" />
            </Box>

            <Box sx={{
                width: 'calc( 100% - 80px )',
                minWidth: '50%',
                padding: '10px 20px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
                borderRadius: '10px',
                ...esMensajePropio ? estilos_mensaje_propio : estilos_mensaje_no_propio
            }}>
                <Typography sx={{
                    color: esMensajePropio ? '#fff' : '#069cb1',
                    //fontWeight: 600,
                    ...estilos_ellipsis
                }}>
                    {nombre}
                </Typography>
                {blob.data && blob.data.type.includes('video') &&
                    <video controls style={{ width: '100%' }}>
                        <source src={mensaje} type={blob.data.type} />
                    </video>
                }
                {blob.data && blob.data.type.includes('image') &&
                    <a target="_blank" href={mensaje} rel="noopener noreferrer">
                        <Image src={mensaje} width={200} height={200} alt='' />
                    </a>
                }
                {blob.data && blob.data.type.includes('audio') &&
                    <AudioBar
                        name={'audio'}
                        url={mensaje}
                    />
                }
                {blob.data && (!blob.data.type.includes('audio') && !blob.data.type.includes('video') && !blob.data.type.includes('image')) &&
                    <a target="_blank" href={mensaje} rel="noopener noreferrer">
                        <Typography color={'#F9B233'}>{mensaje}</Typography>
                    </a>
                }
            </Box>
        </Box>
    )
}

export const MessageNotificacionHorario = ({ imagen, mensaje, esMensajePropio, nombre, id_intervalo, id_rol, id_talento, onChange }: (Props & {  onChange: (result: 'confirmado' | 'rechazado') => void, id_intervalo: number, id_rol: number, id_talento: number } )) => {
    const intervalo = api.agenda_virtual.getIntervaloById.useQuery({id_intervalo: id_intervalo});
    const {notify} = useNotify();

    const updateIntervaloHorario = api.agenda_virtual.updateIntervaloHorario.useMutation({
        onSuccess: (data) => {
            intervalo.refetch();
            onChange(data.estado.toLowerCase() === 'rechazado' ? 'rechazado' : 'confirmado');
            notify('success', 'Se asigno el intervalo con exito');
		},
		onError: (error) => {
			notify('error', parseErrorBody(error.message));
		}
    })
    return (
        <Box 
            sx={{
                display: 'flex',
                alignItems: 'flex-start',
                margin: '25px 0px',
                flexDirection: esMensajePropio ? 'row-reverse' : 'row'
            }}
        >
            <Box sx={{
                position: 'relative',
                width: '60px',
                aspectRatio: '1/1',
                marginRight: esMensajePropio ? '0px' : '20px',
                marginLeft: esMensajePropio ? '20px' : '0px',
            }}>
                <Image src={imagen} style={{
                    borderRadius: '100%'
                }} fill alt="" />
            </Box>

            <Box sx={{
                width: 'calc( 100% - 80px )',
                minWidth: '50%',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
                borderRadius: '10px',
            }}>
                <Box sx={{
                    backgroundColor: 'white',
                    border: 'solid',
                    borderColor: '#069cb1',
                }}>
                    <p color='red'>{esMensajePropio}</p>
                    <Typography fontWeight={800} p={2}>
                        {mensaje}
                    </Typography>
                    <ButtonGroup fullWidth>
                        <Button 
                            variant={(intervalo.data && intervalo.data.estado.toUpperCase() === Constants.ESTADOS_ASIGNACION_HORARIO.CONFIRMADO.toUpperCase()) ? 'contained' : 'outlined' }
                            disabled={!esMensajePropio || ((intervalo.data) ? intervalo.data.estado.toUpperCase() !== Constants.ESTADOS_ASIGNACION_HORARIO.PENDIENTE.toUpperCase() : true)}
                            onClick={() => {
                                updateIntervaloHorario.mutate({
                                    id_intervalo: id_intervalo,
                                    id_rol: id_rol,
                                    id_talento: id_talento,
                                    estado: Constants.ESTADOS_ASIGNACION_HORARIO.CONFIRMADO
                                })
                            }}
                        >
                            Confirmar
                        </Button>
                        <Button
                            variant={(intervalo.data && intervalo.data.estado.toUpperCase() === Constants.ESTADOS_ASIGNACION_HORARIO.RECHAZADO.toUpperCase()) ? 'contained' : 'outlined' }
                            disabled={!esMensajePropio || ((intervalo.data) ? intervalo.data.estado.toUpperCase() !== Constants.ESTADOS_ASIGNACION_HORARIO.PENDIENTE.toUpperCase() : true)}
                            onClick={() => {
                                updateIntervaloHorario.mutate({
                                    id_intervalo: id_intervalo,
                                    id_rol: id_rol,
                                    id_talento: id_talento,
                                    estado: Constants.ESTADOS_ASIGNACION_HORARIO.RECHAZADO
                                })
                            }}
                        >
                            Rechazar
                        </Button> 
                    </ButtonGroup>
                </Box>
            </Box>
        </Box>
    )
}
