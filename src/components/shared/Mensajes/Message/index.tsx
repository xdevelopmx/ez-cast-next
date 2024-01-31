import { Box, Button, ButtonGroup, Link, Typography } from '@mui/material'
import React, { useContext, type CSSProperties, useMemo } from 'react'
import Image from 'next/image'
import { api, parseErrorBody } from '~/utils/api'
import Constants from '~/constants'
import useNotify from '~/hooks/useNotify'
import { useQuery } from '@tanstack/react-query'
import { AudioBar } from '../../AudioBar'
import AppContext from '~/context/app'
import useLang from '~/hooks/useLang'

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
    fecha?: string;
}

export const Message = ({ imagen, mensaje, esMensajePropio, nombre, fecha }: Props) => {
    return (
        <Box 
            sx={{
                display: 'flex',
                alignItems: 'flex-start',
                margin: '35px 0px',
                position: 'relative',
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
                <div 
                    style={{
                        position: 'absolute',
                        width: 'calc(100% - 120px)',
                        textAlign: 'center',
                        top: '-20px',
                        color: '#000',
                        fontSize: '12px'
                    }}
                >
                    {fecha}
                </div>
                <Typography sx={{
                    color: esMensajePropio ? '#fff' : '#069cb1',
                    //fontWeight: 600,
                    ...estilos_ellipsis
                }}>
                    {nombre}
                </Typography>
                <Typography style={{fontSize: '13px'}}>
                    {mensaje}
                </Typography>
            </Box>
        </Box>
    )
}

export const MediaMessage = ({ imagen, mensaje, esMensajePropio, nombre, fecha }: Props) => {

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
            
            <div>
                {fecha}
            </div>

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

export const MessageNotificacionHorario = ({ imagen, mensaje, esMensajePropio, nombre, id_intervalo, id_rol, id_talento, onChange }: (Props & {  onChange: (result: string) => void, id_intervalo: number, id_rol: number, id_talento: number } )) => {
    const intervalo = api.agenda_virtual.getIntervaloById.useQuery({id_intervalo: id_intervalo});
    const ctx = useContext(AppContext);
    const textos = useLang(ctx.lang);
    const {notify} = useNotify();

    const updateIntervaloHorario = api.agenda_virtual.updateIntervaloHorario.useMutation({
        onSuccess: (data) => {
            intervalo.refetch();
            onChange(data.estado.toLowerCase() === Constants.ESTADOS_ASIGNACION_HORARIO.RECHAZADO ? Constants.ESTADOS_ASIGNACION_HORARIO.RECHAZADO : Constants.ESTADOS_ASIGNACION_HORARIO.CONFIRMADO);
            //notify('success', 'Se asigno el intervalo con exito');
            notify("success", `${textos['se_actualizo_con_exito']}`);
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
                            {textos['confirmar']}
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
                            {textos['rechazar']}
                        </Button> 
                    </ButtonGroup>
                </Box>
            </Box>
        </Box>
    )
}

export const MessageAgendaAudicion = ({ imagen, mensaje, esMensajePropio, id_talento, id_audicion, id_aplicacion_rol, id_conversacion, id_cazatalentos, onChange }: (Props & { id_audicion: number, id_aplicacion_rol: number, id_talento: number, id_conversacion: number, id_cazatalentos: number, onChange: () => void  })) => {
    //const intervalo = api.agenda_virtual.getIntervaloById.useQuery({ id_intervalo: id_intervalo });
    const ctx = useContext(AppContext);
    const textos = useLang(ctx.lang);
    const { notify } = useNotify();
    const audicion_talento = api.cazatalentos.getAudicionTalentoById.useQuery(id_audicion, {
        refetchOnWindowFocus: false
    });

    const audicion_state = useMemo(() => {
        if (audicion_talento.data) {
            if (audicion_talento.data.tipo_audicion.toLocaleLowerCase() === 'callback') {
                return {
                    rechazado: audicion_talento.data.estado === Constants.ESTADOS_ASIGNACION_AUDICION.CALLBACK_RECHAZADO,
                    confirmado: audicion_talento.data.estado === Constants.ESTADOS_ASIGNACION_AUDICION.CALLBACK_CONFIRMADO,
                }
            } else {
                return {
                    rechazado: audicion_talento.data.estado === Constants.ESTADOS_ASIGNACION_AUDICION.AUDICION_RECHAZADO,
                    confirmado: audicion_talento.data.estado === Constants.ESTADOS_ASIGNACION_AUDICION.AUDICION_CONFIRMADO,
                }
            }
        }
        return {
            rechazado: null,
            confirmado: null,
        }
    }, [audicion_talento.data]);

    console.log('audicion_state', audicion_state);

    const updateSeleccionTalentoResponse = api.cazatalentos.updateSeleccionTalentoResponse.useMutation({
        onSuccess: (data) => {
            audicion_talento.refetch();
            //onChange();
            //notify('success', 'Se asigno el intervalo con exito');
            notify("success", `${textos['se_actualizo_con_exito']}`);
            onChange();
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
                            variant={Boolean(audicion_state.confirmado) ? 'contained' : 'outlined'}
                            disabled={!esMensajePropio || Boolean(audicion_state.confirmado) || Boolean(audicion_state.rechazado)}
                            onClick={() => {
                                updateSeleccionTalentoResponse.mutate({
                                    id_audicion_talento: id_audicion,
                                    estado: audicion_talento.data?.tipo_audicion.toLocaleLowerCase() === 'callback' ? Constants.ESTADOS_ASIGNACION_AUDICION.CALLBACK_CONFIRMADO : Constants.ESTADOS_ASIGNACION_AUDICION.AUDICION_CONFIRMADO,
                                    id_cazatalentos: id_cazatalentos,
                                    id_conversacion: id_conversacion,
                                    id_talento: id_talento
                                })
                            }}
                        >
                            {textos['confirmar']}
                        </Button>
                        <Button
                            variant={Boolean(audicion_state.rechazado) ? 'contained' : 'outlined'}
                            disabled={!esMensajePropio || Boolean(audicion_state.confirmado) || Boolean(audicion_state.rechazado)}
                            onClick={() => {
                                updateSeleccionTalentoResponse.mutate({
                                    id_audicion_talento: id_audicion,
                                    estado: audicion_talento.data?.tipo_audicion.toLocaleLowerCase() === 'callback' ? Constants.ESTADOS_ASIGNACION_AUDICION.CALLBACK_RECHAZADO : Constants.ESTADOS_ASIGNACION_AUDICION.AUDICION_RECHAZADO,
                                    id_cazatalentos: id_cazatalentos,
                                    id_conversacion: id_conversacion,
                                    id_talento: id_talento
                                })
                            }}
                        >
                            {textos['rechazar']}
                        </Button>
                        
                    </ButtonGroup>
                </Box>
            </Box>
        </Box>
    )
}
