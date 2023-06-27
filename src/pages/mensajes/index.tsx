import React, { useEffect, useMemo, useRef, useState } from 'react'
import { type GetServerSideProps, type NextPage } from "next";
import { Alertas, Flotantes, MainLayout, Mensajes, MenuLateral, RolCompletoPreview } from '~/components';
import Head from 'next/head'
import { type User } from "next-auth";
import { getSession } from "next-auth/react";
import { TipoConversaciones, TipoMensajes, TipoUsuario } from '~/enums';
import Constants from '~/constants';
import { api, parseErrorBody } from '~/utils/api';
import { Box, Button, ButtonGroup, Dialog, DialogContent, DialogTitle, Grid, Link, Skeleton, TextField, Typography } from '@mui/material'
import Image from 'next/image'
import { ConfirmacionDialog } from '~/components/shared/Mensajes/ConfirmacionDialog';
import { PreviewConversation } from '~/components/shared/Mensajes/PreviewConversation';
import { Message, MessageNotificacionHorario } from '~/components/shared/Mensajes/Message';
import { Conversaciones, Proyecto } from '@prisma/client';
import { string } from 'zod';
import useNotify from '~/hooks/useNotify';
import { RolPreviewLoader } from '~/components/shared/RolPreviewLoader';
import { RolPreview } from '~/components/shared/RolPreview';
import { Close } from '@mui/icons-material';

type DashBoardCazaTalentosPageProps = {
    user: User,
}

const MensajesPage: NextPage<DashBoardCazaTalentosPageProps> = ({ user }) => {

    const { notify } = useNotify();

    const conversaciones = api.mensajes.getConversaciones.useQuery(parseInt(user.id));

    const [selected_conversacion, setSelectedConversacion] = useState<(Conversaciones & {proyecto: Proyecto | null, emisor: {nombre: string, profile_url: string} | null, receptor: {nombre: string, profile_url: string} | null}) | null>(null);

    const mensajes = api.mensajes.getMensajesByConversacion.useQuery(selected_conversacion ? selected_conversacion.id : 0);

    const [msg, setMsg] = useState('');

    const [project_dialog_opened, setProjectDialogOpened] = useState(false);

    const msgs_div_ref = useRef<HTMLDivElement>(null);

    const id_rol = useMemo(() => {
        if (selected_conversacion && user.tipo_usuario === TipoUsuario.TALENTO) {
            let urlParams = new URLSearchParams(selected_conversacion.emisor_perfil_url);
            let id_rol = urlParams.get('id_rol');
            if (!id_rol) {
                urlParams = new URLSearchParams(selected_conversacion.receptor_perfil_url);
                id_rol = urlParams.get('id_rol');
            }
            return (id_rol) ? parseInt(id_rol) : 0;
        }
        return 0;
    }, [selected_conversacion]);

    const rol = api.roles.getRolWithProyectoById.useQuery(id_rol, {
        refetchOnWindowFocus: false
    })

    const proyecto_prewiew = useMemo(() => {
		if (rol.isFetching) {
			return <RolPreviewLoader />;
		} 
        
        if (rol.data) {
            return (
                <Box>
                    <RolPreview 
                        no_border
                        no_poster
                        key={rol.data.id} 
                        rol={rol.data as unknown as RolCompletoPreview} 
                    />
                </Box>    
            )
        }
        return [];
	}, [rol.data]);

    useEffect(() => {
        if (msgs_div_ref.current && msgs_div_ref.current.parentElement) {
            msgs_div_ref.current.parentElement.scrollTop = msgs_div_ref.current.parentElement.scrollHeight;
        }
    }, [mensajes.data, msgs_div_ref.current]);

    const markConversacionAsSeen = api.mensajes.markConversacionAsSeen.useMutation({
        onSuccess: (data, input) => {
            if (data) {
                void conversaciones.refetch();
            }
		},
		onError: (error) => {
			notify('error', parseErrorBody(error.message));
		}
    })

    const saveMensaje = api.mensajes.saveMensaje.useMutation({
        onSuccess: (data, input) => {
            if (data) {
                void conversaciones.refetch();
                void mensajes.refetch();
                setMsg('');
            }
		},
		onError: (error) => {
			notify('error', parseErrorBody(error.message));
		}
    })

    useEffect(() => {
        if (selected_conversacion) {
            markConversacionAsSeen.mutate({
                id_user_interaction: parseInt(user.id),
                id_conversacion: selected_conversacion.id
            })
        }
    }, [selected_conversacion]);


    const es_emisor = selected_conversacion ? selected_conversacion.tipo_usuario_emisor === user.tipo_usuario && selected_conversacion.id_emisor === parseInt(user.id) : false;

    return (
        <>
            <Head>
                <title>Mensajes | Talent Corner</title>
                <meta name="description" content="Talent Corner" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <MainLayout menuSiempreBlanco={true} >
                <div className="d-flex wrapper_ezc">
                    <MenuLateral />
                    <div className="seccion_container col" style={{ paddingTop: 0 }}>
                        <br /><br />
                        <div className="container_box_header">
                            <div className="d-flex justify-content-end align-items-start py-2">
                                <Alertas />
                            </div>
                            <div className="row d-lg-flex">
                                <div className="mt-2 col-md-6" style={{ padding: 0 }}>
                                    <p className="h5 font-weight-bold" style={{ fontSize: '1.5rem' }}>
                                        <b>Mensajes</b>
                                    </p>
                                </div>
                                <Grid container>
                                    <Grid item xs={12} md={5.5}>
                                        <Grid item xs={12} sx={{
                                            border: '2px solid #069cb1',
                                            padding: '20px'
                                        }}>
                                            <Typography fontWeight={600}>
                                                Conversaciones
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} sx={{
                                            height: '600px',
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
                                                    return <Box style={{backgroundColor: (selected_conversacion && selected_conversacion.id === c.id) ? '#e2e2e2' : ''}} onClick={() => {setSelectedConversacion(c)}}>
                                                        <PreviewConversation 
                                                            loading={false}
                                                            profile_url={(parseInt(user.id) === c.id_receptor) ? c.emisor?.profile_url : c.receptor?.profile_url}
                                                            nombre={(parseInt(user.id) === c.id_receptor) ? c.emisor?.nombre : c.receptor?.nombre}
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
                                    <Grid item xs={12} md={6.5}>
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
                                                <Typography fontWeight={600} mr={4}>
                                                   {selected_conversacion ? es_emisor ? selected_conversacion.receptor?.nombre : selected_conversacion.emisor?.nombre : ''}
                                                </Typography>
                                                {selected_conversacion && user.tipo_usuario === TipoUsuario.CAZATALENTOS && selected_conversacion.tipo_usuario_receptor === TipoUsuario.TALENTO &&
                                                    <Link href={`${selected_conversacion.receptor_perfil_url}`} >
                                                        <u>Ver perfil.</u>
                                                    </Link>
                                                }
                                                {selected_conversacion && user.tipo_usuario === TipoUsuario.CAZATALENTOS && selected_conversacion.tipo_usuario_emisor === TipoUsuario.TALENTO &&
                                                    <Link href={`${selected_conversacion.emisor_perfil_url}`} >
                                                        <u>Ver perfil.</u>
                                                    </Link>
                                                }
                                                {selected_conversacion && user.tipo_usuario === TipoUsuario.TALENTO && selected_conversacion.tipo_usuario_emisor === TipoUsuario.CAZATALENTOS &&
                                                    <>
                                                        <Typography fontWeight={100} mr={4}>
                                                            De parte de {selected_conversacion ? `${selected_conversacion.proyecto?.nombre}` : 'ND'}
                                                        </Typography>
                                                        <Button variant='text' onClick={() => { setProjectDialogOpened(true) }}>
                                                            <u>Ver proyecto</u>
                                                        </Button>
                                                    </>
                                                }

                                                {/*
                                                    <Typography variant='body2' fontWeight={300}>
                                                    {selected_conversacion ? `${selected_conversacion.subtitle}` : ''}
                                                    </Typography>
                                                
                                                */}

                                            </Box>
                                        </Grid>
                                        <Grid item xs={12}
                                            sx={{
                                                height: '500px',
                                                border: '2px solid #B4B5B6',
                                                borderTop: 'none',
                                                borderLeft: 'none',
                                                borderBottom: '2px solid #069cb1',
                                                overflowY: 'scroll',
                                                padding: '20px 40px 0px 40px',
                                                backgroundColor: '#F2F2F2',
                                            }}
                                        >
                                            <Box id="xd" ref={msgs_div_ref}>
                                                {mensajes.isFetched && mensajes.data &&
                                                    mensajes.data.map((m, i) => {
                                                        switch (m.type) {
                                                            case TipoMensajes.TEXT: {
                                                                const params = JSON.parse(m.mensaje) as {message: string};
                                                                return (
                                                                    <Message
                                                                        key={i}
                                                                        nombre={`${m.emisor?.nombre}`}
                                                                        mensaje={params.message}
                                                                        imagen={`${m.emisor?.profile_url}`}
                                                                        esMensajePropio={m.id_emisor === parseInt(user.id)}
                                                                    />
                                                                )
                                                            }
                                                            case TipoMensajes.NOTIFICACION_HORARIO_AGENDA_VIRTUAL: {
                                                                const params = JSON.parse(m.mensaje) as {message: string, id_intervalo: number, id_rol: number, id_talento: number};
                                                                if (user.tipo_usuario !== TipoUsuario.TALENTO) return null;
                                                                return (
                                                                    <MessageNotificacionHorario
                                                                        key={i}
                                                                        onChange={(result) => {
                                                                            saveMensaje.mutate({
                                                                                id_conversacion: (selected_conversacion) ? selected_conversacion.id : 0,
                                                                                id_emisor: parseInt(user.id),
                                                                                tipo_usuario_emisor: (user.tipo_usuario) ? user.tipo_usuario : '',
                                                                                id_receptor: (selected_conversacion) ? selected_conversacion.id_emisor === parseInt(user.id) ? selected_conversacion.id_receptor : selected_conversacion.id_emisor : 0,
                                                                                tipo_usuario_receptor: (selected_conversacion) ? selected_conversacion.id_emisor === parseInt(user.id) ? selected_conversacion.tipo_usuario_receptor : selected_conversacion.tipo_usuario_emisor : '',
                                                                                mensaje: `El talento ${user.name} ha ${result} el horario al que se le asigno en la agenda virtual.`
                                                                            })
                                                                        }}
                                                                        id_intervalo={params.id_intervalo}
                                                                        id_rol={params.id_rol}
                                                                        id_talento={params.id_talento}
                                                                        nombre={`${m.emisor?.nombre}`}
                                                                        mensaje={params.message}
                                                                        imagen={`${m.emisor?.profile_url}`}
                                                                        esMensajePropio={params.id_talento === parseInt(user.id) && user.tipo_usuario === TipoUsuario.TALENTO}
                                                                    />
                                                                )
                                                            }
                                                        }
                                                        return null;
                                                    })
                                                }
                                            </Box>
                                            {mensajes.isInitialLoading && mensajes.isFetching &&
                                                Array.from({ length: 5 }).map((_, i) => (
                                                    <Grid container xs={12} sx={{
                                                        padding: '10px 20px',
                                                        borderBottom: '2px solid #B4B5B6',
                                                    }}>
                                                        <Grid item xs={2}>
                                                            <Box sx={{
                                                                position: 'relative',
                                                                width: '60px',
                                                                aspectRatio: '1/1'
                                                            }}>
                                                                <Skeleton width={64} height={64} variant='circular'/>
                                                            </Box>
                                                        </Grid>
                                                        <Grid item container xs={10}>
                                                            <Skeleton width={'100%'}/>
                                                        </Grid>
                                                        <Grid item container xs={10}>
                                                            <Skeleton width={'100%'}/>
                                                        </Grid>
                                                        <Grid item xs={2} pl={10}>
                                                            <Box sx={{
                                                                position: 'relative',
                                                                width: '60px',
                                                                aspectRatio: '1/1'
                                                            }}>
                                                                <Skeleton width={64} height={64} variant='circular'/>
                                                            </Box>
                                                        </Grid>
                                                        
                                                    </Grid >
                                                ))
                                            }
                                            {mensajes.isFetched && !mensajes.data &&
                                                <Typography>No se ha seleccionado ninguna conversacion</Typography>   
                                            }
                                            {/*
                                            <ConfirmacionDialog />
                                            
                                            */}
                                            
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
                                                        value={msg}
                                                        placeholder='Escribir mensaje'
                                                        onChange={(e) => {
                                                            setMsg(e.target.value);
                                                        }}
                                                    />

                                                    <Image style={{
                                                        position: 'absolute',
                                                        top: '50%',
                                                        right: '20px',
                                                        transform: 'translate(0,-50%)'
                                                    }} src={'/assets/img/iconos/icon_camara_blue.svg'}
                                                        width={30} height={30} alt="" />

                                                </Box>

                                                <Button
                                                    onClick={() => {
                                                        saveMensaje.mutate({
                                                            id_conversacion: (selected_conversacion) ? selected_conversacion.id : 0,
                                                            id_emisor: parseInt(user.id),
                                                            tipo_usuario_emisor: (user.tipo_usuario) ? user.tipo_usuario : '',
                                                            id_receptor: (selected_conversacion) ? selected_conversacion.id_emisor === parseInt(user.id) ? selected_conversacion.id_receptor : selected_conversacion.id_emisor : 0,
                                                            tipo_usuario_receptor: (selected_conversacion) ? selected_conversacion.id_emisor === parseInt(user.id) ? selected_conversacion.tipo_usuario_receptor : selected_conversacion.tipo_usuario_emisor : '',
                                                            mensaje: msg
                                                        })
                                                    }}
                                                    sx={{
                                                        backgroundColor: '#069cb1',
                                                        color: '#fff',
                                                        '&:hover': {
                                                            backgroundColor: '#069cb1',
                                                        }
                                                    }}
                                                >
                                                    Enviar
                                                </Button>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </div>
                        </div>


                    </div>
                </div>
            </MainLayout>
            <Dialog  maxWidth={'md'} style={{ padding: 0, margin: 0, overflow: 'hidden'}} open={project_dialog_opened} onClose={() => setProjectDialogOpened(false)}>
                    <DialogTitle align='left' style={{color: '#069cb1'}}>{'Detalles del proyecto'}</DialogTitle>
                    <DialogContent style={{padding: 0, width: 850, overflow: 'hidden'}}>
                        <Box px={4}>
                            {proyecto_prewiew}
                        </Box>
                    </DialogContent>
                    <Box style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                        <Button style={{marginLeft: 8, marginRight: 8}} startIcon={<Close />} onClick={() => setProjectDialogOpened(false)}>Cerrar</Button>
                    </Box>
                </Dialog>
            <Flotantes />
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);
    if (session && session.user) {
        return {
            props: {
                user: session.user,
            }
        }
    }
    return {
        redirect: {
            destination: '/',
            permanent: true,
        },
    }
}

export default MensajesPage