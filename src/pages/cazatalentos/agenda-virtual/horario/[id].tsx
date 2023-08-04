import { Close, MonochromePhotos, ThumbDownAlt, ThumbUpAlt } from '@mui/icons-material'
import { Box, Button, ButtonGroup, Divider, FormControlLabel, Grid, IconButton, Switch, Tooltip, Typography, styled, tooltipClasses } from '@mui/material'
import { Media, MediaPorTalentos, NotasTalentos, Talentos, TalentosDestacados } from '@prisma/client'
import dayjs from 'dayjs'
import { GetServerSideProps } from 'next'
import { User } from 'next-auth/core/types'
import { getSession } from 'next-auth/react'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useState, useEffect, useMemo, useRef } from 'react'
import { Alertas, DatosAudicion, Flotantes, HorariosTable, MSelect, MainLayout, MenuLateral, ModalBloquesTiempos, TalentoReclutadoCard } from '~/components'
import { DraggableHorarioContainer } from '~/components/cazatalento/agenda-virtual/horarios-tabla/DraggableHorarioContainer'
import { TalentoReclutadoListCard } from '~/components/cazatalento/agenda-virtual/talento-reclutado-card/list-card'
import ConfirmationDialog from '~/components/shared/ConfirmationDialog'
import Constants from '~/constants'
import { TipoUsuario } from '~/enums'
import useNotify from '~/hooks/useNotify'
import { prisma } from '~/server/db'
import { api, parseErrorBody } from '~/utils/api'
import { expandDates, generateIntervalos } from '~/utils/dates'

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
    width: 72,
    height: 34,
    padding: 8,
    '& .MuiSwitch-switchBase': {
      margin: 1,
      padding: 0,
      transform: 'translateX(6px)',
      '&.Mui-checked': {
        color: '#fff',
        transform: 'translateX(32px)',
        '& .MuiSwitch-thumb:before': {
          backgroundImage: `url(/assets/img/iconos/icono_claqueta_white.svg)`,
        },
        '& .MuiSwitch-thumb': {
            backgroundColor: '#F9B233'
        },
        '& + .MuiSwitch-track': {
          opacity: 1,
          backgroundColor: 'lightgrey',
        },
      },
    },
    '& .MuiSwitch-thumb': {
      backgroundColor: 'gray',
      width: 32,
      height: 32,
      '&:before': {
        content: "''",
        position: 'absolute',
        width: '100%',
        height: '100%',
        left: 0,
        top: 0,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundImage: `url(/assets/img/iconos/icono_claqueta_white.svg)`,
        backgroundSize: 16,
      },
    },
    '& .MuiSwitch-track': {
      opacity: 1,
      backgroundColor: 'lightgrey',
      borderRadius: 20 / 2,
    },
  }));

const AudicionPorId = (props: {user: User, disable_actions: boolean, can_start_callback: boolean}) => {

    const {notify} = useNotify();

    const router = useRouter();

    const btn_callback_ref = useRef<HTMLAnchorElement | null>(null);

    const {id, ask_for_callback} = router.query;

    const [confirmation_dialog, setConfirmationDialog] = useState<{ opened: boolean, title: string, content: JSX.Element, action: 'CALLBACK' | 'SEND_HORARIOS', data: Map<string, unknown> }>({ opened: false, title: '', content: <></>, action: 'CALLBACK', data: new Map });

    const horario = api.agenda_virtual.getHorarioAgendaById.useQuery(parseInt(id as string), {
		refetchOnWindowFocus: false
	});

    const proyecto = api.proyectos.getById.useQuery((horario.data) ? horario.data.id_proyecto : 0, {
        refetchOnWindowFocus: false
    });

    const ordered_dates = Array.from(expandDates((horario.data) ? horario.data.fechas : [])).sort((a, b) => {
        const d_1 = dayjs(a, 'DD/MM/YYYY');
        const d_2 = dayjs(b, 'DD/MM/YYYY');
        return d_1.toDate().getTime() - d_2.toDate().getTime();
    });

    // para las aplicaciones de talentos a roles
    const roles = api.roles.getAllAplicacionesTalentoByProyecto.useQuery({id_proyecto: (horario.data) ? horario.data.id_proyecto : 0, estados_aplicaciones: (horario.data) ? [horario.data.tipo_agenda.toLowerCase() === 'callback' ? Constants.ESTADOS_APLICACION_ROL.CALLBACK : Constants.ESTADOS_APLICACION_ROL.AUDICION] : []}, {
		refetchOnWindowFocus: false
	})

    const [talentos, setTalentos] = useState<(Talentos & { destacado: TalentosDestacados[], notas?: NotasTalentos[], media: (MediaPorTalentos & { media: Media; })[] })[]>([]);

    const [selected_rol, setSelectedRol] = useState(0);

    const [tipo_vista_selected, setTipoVistaSelected] = useState<'list' | 'grid'>('grid');

    const [tipo_nota_selected, setTipoNotaSelected] = useState<string>('ninguna');

    // para la lista de intervalos

    const [opcionSelected, setOpcionSelected] = useState<string>('');

    const [isOpendModal, setIsOpendModal] = useState(false);

    const bloque = api.agenda_virtual.getBloqueHorarioByDateAndIdHorario.useQuery({
        id_horario_agenda: (horario.data) ? horario.data.id : 0, fecha: dayjs(opcionSelected, "DD/MM/YYYY").toDate()
    }, {
        refetchOnWindowFocus: false
    })

    const talentos_asignados_por_horario = api.agenda_virtual.getAllIdsTalentosAsignadosByHorario.useQuery({ id_horario_agenda: (horario.data) ? horario.data.id : 0}, {
        refetchOnWindowFocus: false
    });

    const talentos_aprobados = useMemo(() => {
        const ids_talentos_not_null: {id_talento: number, id_rol: number}[] = [];
        if (talentos_asignados_por_horario.data) {
            const ids_talentos = talentos_asignados_por_horario.data.filter(t => t.estado.toLowerCase() === 'aprobado' && t.id_talento != null);
            ids_talentos.forEach(i => {
                if (i.id_talento && i.id_rol) {
                    ids_talentos_not_null.push({id_talento: i.id_talento, id_rol: i.id_rol});
                }
            })
        }
        return ids_talentos_not_null;
    }, [talentos_asignados_por_horario.data]);

    useEffect(() => {
        if (roles.data && talentos_asignados_por_horario.data && horario.data && btn_callback_ref.current && ask_for_callback && props.can_start_callback) {
            btn_callback_ref.current.click();
        }
    }, [ask_for_callback, roles.data, horario.data, talentos_asignados_por_horario.data, btn_callback_ref.current, props.can_start_callback]);

    const updateIntervaloHorario = api.agenda_virtual.updateIntervaloHorario.useMutation({
        onSuccess: (data) => {
            talentos_asignados_por_horario.refetch();
            bloque.refetch();
            notify('success', 'Se asigno el intervalo con exito');
		},
		onError: (error) => {
			notify('error', parseErrorBody(error.message));
		}
    })

    const updateAplicacionesTalentoByIdRolAndIdTalento = api.roles.updateAplicacionesTalentoByIdRolAndIdTalento.useMutation({
        onSuccess: (data) => {
            notify('success', 'Se actualizo el horario con exito');
            void router.push(`/cazatalentos/agenda-virtual/crear?id_horario=${horario.data?.id}`);
        }, 
        onError: (err) => {
            notify('error', parseErrorBody(err.message));
        }
    })

    const updateHorario = api.agenda_virtual.create.useMutation({
        onSuccess: (data) => {
            if (data.tipo_agenda.toLowerCase() === 'callback') {
                updateAplicacionesTalentoByIdRolAndIdTalento.mutate({
                    talentos: talentos_aprobados,
                    estado_aplicacion: Constants.ESTADOS_APLICACION_ROL.CALLBACK
                })
            }
        }, 
        onError: (err) => {
            notify('error', parseErrorBody(err.message));
        }
    })

    const sendHorarios = api.agenda_virtual.sendHorarios.useMutation({
        onSuccess: (data) => {
            if (data) {
                notify('success', 'Se enviaron los horarios con exito');
            }
        }, 
        onError: (err) => {
            notify('error', parseErrorBody(err.message));
        }
    })

    useEffect(() => {
        if (roles.data && selected_rol === 0) {
            const rol = roles.data[0];
            if (rol) {
                setSelectedRol(rol.id);
            }
        }
    }, [roles.data]);

    useEffect(() => {
        if (roles.data && talentos_asignados_por_horario.data) {
            roles.data.map((rol, i) => {
                if (rol.id === selected_rol) {
                    setTalentos(rol.aplicaciones_por_talento.filter(aplicacion => {
                        return talentos_asignados_por_horario.data.filter((ta) => ta.id_rol === aplicacion.id_rol && ta.id_talento === aplicacion.id_talento).length === 0;
                    }).map((aplicacion, j) => {
                        return {...aplicacion.talento, notas: aplicacion.talento.notas, destacado: aplicacion.talento.destacados};
                    }))
                }
            })
        }
    }, [roles.data, selected_rol, talentos_asignados_por_horario.data]);
    // end

    const info_horario = (bloque.data) ? 
        <div style={{ backgroundColor: '#cccccc', width: '90%', margin: 8, paddingLeft: 16, position: 'relative'}}>
            <Box display="flex" flexDirection={'row'} justifyContent={'space-between'}>
                <Typography>Horario {bloque.data.fecha.toLocaleString('es-mx', { weekday: "long", year: "numeric", month: "long", day: "numeric", })}</Typography>
                <Typography>Bloques de {(() => {
                    const horas = bloque.data.intervalos[0]?.hora.split('-').map(s => s.trim());
                    if (horas) {
                        const hora_inicio = horas[0]?.split(':').map(h => parseInt(h));
                        const hora_fin = horas[1]?.split(':').map(h => parseInt(h));
                        if (hora_inicio && hora_fin) {
                            const hora_i = hora_inicio[0];
                            const minutos_i = hora_inicio[1]; 
                            const hora_f = hora_fin[0];
                            const minutos_f = hora_fin[1]; 
                            let diff = 0;
                            if (hora_f) diff += hora_f * 60;
                            if (minutos_f) diff += minutos_f;
                            if (hora_i) diff -= hora_i * 60;
                            if (minutos_i) diff -= minutos_i;
                            return diff;
                        }
                    }
                    return 0;
                })()} Minutos</Typography>
                
            </Box>
            <Typography>de {bloque.data.hora_inicio} a {bloque.data.hora_fin}</Typography>
            <Typography>{bloque.data.locacion.direccion}, {bloque.data.locacion.estado_republica.es}</Typography>
        </div>
        :
        null;

    const input_background_color = (horario.data && horario.data.tipo_agenda.toLowerCase() === 'callback') ? '#F9B233' : '#069cb1';

    const input_background_hover_color = (horario.data && horario.data.tipo_agenda.toLowerCase() === 'callback') ? '#ea9d2190' : '#069fff';

    return (
        <>
            <Head>
                <title>Cazatalentos | Talent Corner</title>
                <meta name="description" content="Talent Corner" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <MainLayout menuSiempreBlanco={true}>
                <div className="d-flex wrapper_ezc">
                    <MenuLateral />
                    <div className="seccion_container col" style={{ paddingTop: 0 }}>
                        <br /><br />
                        <div className="container_box_header">
                            <div className="d-flex justify-content-end align-items-start py-2">
                                <Alertas />
                            </div>
                            <Grid container>
                                <Grid item xs={12}>
                                    <Grid container item columns={12}>
                                        <Grid item md={1} textAlign={'center'}>
                                            <Image src="/assets/img/iconos/agenda.svg" width={70} height={70} style={{ margin: '15px 0 0 0', filter: 'invert(43%) sepia(92%) saturate(431%) hue-rotate(140deg) brightness(97%) contrast(101%)' }} alt="" />
                                        </Grid>
                                        <Grid item md={11}>
                                            <Typography fontWeight={800} sx={{ color: '#069cb1', fontSize: '2rem' }}>
                                                Agenda Virtual
                                            </Typography>
                                            <Typography fontWeight={600} sx={{ color: '#000', fontSize: '1.4rem' }}>
                                                Horario para el proyecto {`${horario.data?.proyecto.nombre}`}
                                            </Typography>
                                            <Typography sx={{ fontSize: '1.4rem' }}>
                                                
                                                Del {ordered_dates[0]} al {ordered_dates[ordered_dates.length - 1]}
                                            </Typography>
                                        </Grid>
                                        <Grid xs={12} mt={2}>
                                            <Divider />
                                        </Grid>
                                        <DatosAudicion 
                                            id_horario={parseInt(id as string)}
                                            uso_horario={`${horario.data?.uso_horario.es}`}
                                            nota={horario.data && horario.data.notas.length > 0 ? horario.data.notas : 'No hay nota'}
                                        />
                                        <Grid container  xs={12} mt={4}>
                                            {!props.disable_actions &&
                                            
                                                <Grid xs={3} mr={'16px'}>
                                                    <Grid xs={12}>
                                                        <Grid container xs={12} sx={{
                                                            backgroundColor: input_background_color,
                                                            padding: '20px',
                                                            alignItems: 'center',
                                                        }}>
                                                            <Grid xs={8}>
                                                                <Typography fontWeight={600} sx={{ color: '#fff', fontSize: '1.4rem' }}>
                                                                    Talentos reclutados
                                                                </Typography>
                                                            </Grid>
                                                            <Grid container xs={4}>
                                                                <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
                                                                    <Typography sx={{ color: '#fff', fontSize: '1.1rem' }}>
                                                                        Vista:
                                                                    </Typography>

                                                                    <IconButton onClick={() => { setTipoVistaSelected('grid') }}>
                                                                        <Image style={{filter: (tipo_vista_selected === 'list') ? '' : 'opacity(0.5)'}} src="/assets/img/iconos/vista_cuadros.png" width={20} height={20} alt="" />
                                                                    </IconButton>

                                                                    <IconButton onClick={() => { setTipoVistaSelected('list') }}>
                                                                        <Image style={{filter: (tipo_vista_selected === 'grid') ? '' : 'opacity(0.5)'}} src="/assets/img/iconos/vista_columnas.png" width={20} height={20} alt="" />
                                                                    </IconButton>
                                                                </Box>

                                                            </Grid>
                                                        </Grid>
                                                        <Grid xs={12}>
                                                            <Grid xs={12} sx={{
                                                                padding: '10px 30px 5px 30px',
                                                                borderLeft: '3px solid #EBEBEB',
                                                                borderRight: '3px solid #EBEBEB',
                                                            }}>
                                                                <Grid xs={12}>
                                                                    <MSelect
                                                                        id="posicion-contenido-select"
                                                                        labelStyle={{ fontWeight: 600 }}
                                                                        labelClassName={'form-input-label'}
                                                                        label='Rol'
                                                                        options={(roles.data) ? roles.data.filter(r => r.estatus.toUpperCase() !== Constants.ESTADOS_ROLES.ARCHIVADO).map(r => { return { label: r.nombre, value: r.id.toString()}}) : []}
                                                                        value={selected_rol.toString()}
                                                                        className={'form-input-md'}
                                                                        disable_default_option
                                                                        onChange={(e) => {
                                                                            setSelectedRol(parseInt(e.target.value));
                                                                        }}
                                                                    />
                                                                </Grid>
                                                                <Grid xs={12}>
                                                                    <Box>
                                                                        <Typography>
                                                                            Ver:
                                                                        </Typography>
                                                                        <MSelect
                                                                            id="posicion-contenido-select"
                                                                            labelStyle={{ fontWeight: 600 }}
                                                                            labelClassName={'form-input-label'}
                                                                            options={[{ value: 'ninguna', label: 'Ninguna' }, { value: 'cazatalento', label: 'Notas del Cazatalento' }, { value: 'talento', label: 'Notas del Aplicante' }, { value: 'ambas', label: 'Ambas' }]}
                                                                            value={tipo_nota_selected}
                                                                            className={'form-input-md'}
                                                                            disable_default_option
                                                                            onChange={(e) => {
                                                                                setTipoNotaSelected(e.target.value)
                                                                            }}
                                                                        />
                                                                    </Box>
                                                                </Grid>
                                                            </Grid>
                                                            <Grid item xs={12}>
                                                                <Divider style={{width: '75%', marginLeft: 'auto', marginRight: 'auto', marginTop: 16}}/>
                                                            </Grid>
                                                            <Grid container xs={12} gap={1} maxHeight={700} overflow={'auto'} sx={{
                                                                borderLeft: '3px solid #EBEBEB',
                                                                borderRight: '3px solid #EBEBEB',
                                                                borderBottom: '3px solid #EBEBEB',
                                                                padding: 2,
                                                                justifyContent: 'space-between'
                                                            }}>
                                                                {talentos.map((t, i) => {
                                                                    const profile = t.media.filter(m => m.media.identificador.match('foto-perfil-talento'))[0];
                                                                    const calificacion = t.destacado.filter(d => d.id_cazatalentos === proyecto.data?.id_cazatalentos)[0];
                                                                    return (tipo_vista_selected === 'grid') ? 
                                                                    <Grid key={i} xs={5.8}>
                                                                        <TalentoReclutadoCard 
                                                                            tipo_agenda={(horario.data) ? horario.data.tipo_agenda.toLowerCase() : undefined}
                                                                            profile_url={(profile) ? profile.media.url : '/assets/img/no-image.png'}
                                                                            nombre={`${t.nombre} ${t.apellido}`}
                                                                            union={'ND'}
                                                                            estado=''
                                                                            calificacion={(calificacion) ? calificacion.calificacion : 0}
                                                                            id_talento={t.id}
                                                                            notas={(() => {
                                                                                switch (tipo_nota_selected) {
                                                                                    case 'cazatalento': {
                                                                                        if (t.notas) {
                                                                                            const nota = t.notas.filter(n => n.id_cazatalentos === proyecto.data?.id_cazatalentos)[0];
                                                                                            if (nota) {
                                                                                                return {cazatalentos: nota.nota};
                                                                                            }
                                                                                        }
                                                                                        break;
                                                                                    }
                                                                                    case 'ambas': {
                                                                                        if (t.notas) {
                                                                                            const nota = t.notas.filter(n => n.id_cazatalentos === proyecto.data?.id_cazatalentos)[0];
                                                                                            if (nota) {
                                                                                                return {cazatalentos: nota.nota, talento: 'esto es una prueba'};
                                                                                            }
                                                                                        }
                                                                                        break;
                                                                                    }
                                                                                }
                                                                                return undefined;
                                                                            })()}
                                                                            onDrop={(id_talento) => {
                                                                                //alert('SE DROPEO ESTE WEON' + id_talento);
                                                                            }}
                                                                        />
                                                                    </Grid>
                                                                    :
                                                                    <Grid key={i} xs={12} >
                                                                        <TalentoReclutadoListCard 
                                                                            tipo_agenda={(horario.data) ? horario.data.tipo_agenda.toLowerCase() : undefined}
                                                                            profile_url={(profile) ? profile.media.url : '/assets/img/no-image.png'}
                                                                            nombre={`${t.nombre} ${t.apellido}`}
                                                                            union={'ND'}
                                                                            estado=''
                                                                            calificacion={(calificacion) ? calificacion.calificacion : 0}
                                                                            id_talento={t.id}
                                                                            onDrop={(id_talento) => {
                                                                                //alert('SE DROPEO ESTE WEON' + id_talento);
                                                                            } } 
                                                                            action={<></>} 
                                                                            ubicacion={'ND'} 
                                                                            notas={(() => {
                                                                                switch (tipo_nota_selected) {
                                                                                    case 'cazatalento': {
                                                                                        if (t.notas) {
                                                                                            const nota = t.notas.filter(n => n.id_cazatalentos === proyecto.data?.id_cazatalentos)[0];
                                                                                            if (nota) {
                                                                                                return {cazatalentos: nota.nota};
                                                                                            }
                                                                                        }
                                                                                        break;
                                                                                    }
                                                                                    case 'ambas': {
                                                                                        if (t.notas) {
                                                                                            const nota = t.notas.filter(n => n.id_cazatalentos === proyecto.data?.id_cazatalentos)[0];
                                                                                            if (nota) {
                                                                                                return {cazatalentos: nota.nota, talento: 'esto es una prueba'};
                                                                                            }
                                                                                        }
                                                                                        break;
                                                                                    }
                                                                                }
                                                                                return undefined;
                                                                            })()}
                                                                        />
                                                                    </Grid>
                                                                })}
                                                            </Grid>

                                                            
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            }
                                            <Grid xs={(props.disable_actions) ? 12 : 8.5} overflow={'auto'}>
                                                <Grid xs={12}>
                                                    <Grid xs={12} sx={{
                                                        backgroundColor: input_background_color,
                                                        padding: '20px',
                                                        alignItems: 'center',
                                                    }}>
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <Typography fontWeight={600} sx={{ color: '#fff', fontSize: '1.4rem' }}>
                                                                Horario
                                                            </Typography>
                                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
                                                                
                                                                {!props.disable_actions && 
                                                                
                                                                
                                                                    <Button 
                                                                        onClick={() => {
                                                                            if (opcionSelected !== '') {
                                                                                setIsOpendModal(true);
                                                                            } else {
                                                                                notify('warning', 'No haz seleccionado ninguna fecha aun');
                                                                            }
                                                                        }}
                                                                        sx={{
                                                                            display: 'flex',
                                                                            textTransform: 'none',
                                                                            color: '#fff',
                                                                            border: '1px solid #fff',
                                                                            borderRadius: '2rem',
                                                                            padding: '5px 20px',
                                                                            backgroundColor: input_background_color,
                                                                            '&:hover': {
                                                                                backgroundColor: input_background_hover_color
                                                                            },
                                                                            lineHeight: '20px',
                                                                            overflow: 'hidden',
                                                                            whiteSpace: 'nowrap',
                                                                            textOverflow: 'ellipsis'
                                                                        }}
                                                                    >
                                                                        <Image src="/assets/img/iconos/cruz_white.svg" width={15} height={15} alt="" />
                                                                        <Typography sx={{ paddingLeft: '10px' }}>
                                                                            {(!bloque.data && bloque.isFetched) ? 'Añadir bloque de tiempo' : 'Editar bloque de tiempo'}
                                                                        </Typography>
                                                                    </Button>
                                                                }
                                                            </Box>
                                                        </Box>
                                                    </Grid>
                                                    <Grid xs={12} sx={{
                                                        borderLeft: '3px solid #EBEBEB',
                                                        borderBottom: '3px solid #EBEBEB',
                                                        borderRight: '3px solid #EBEBEB'
                                                    }}>
                                                        <Grid xs={12}>
                                                            <ButtonGroup sx={{ mt: 2, mb: 0, gap: 1, display: 'flex', flexWrap: 'wrap', boxShadow: 'none' }} variant="contained" aria-label="outlined primary button group">
                                                                {ordered_dates.map(date => {
                                                                    return (
                                                                        <Button
                                                                            onClick={() => { setOpcionSelected(date) }}
                                                                            sx={{backgroundColor: (horario.data && horario.data.tipo_agenda.toLowerCase() === 'callback') ? input_background_color : ''}}
                                                                            variant={opcionSelected === date ? 'contained' : 'outlined'}
                                                                        >
                                                                            {date}
                                                                        </Button>
                                                                    )
                                                                })}
                                                                
                                                            </ButtonGroup>
                                                        </Grid>
                                                        <Grid xs={12} maxHeight={420} overflow={'auto'}>
                                                            <Box 
                                                                sx={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    flexDirection: 'column',
                                                                    minHeight: '400px',
                                                                    justifyContent: 'center'
                                                                }}
                                                            >
                                                                {proyecto.data && proyecto.isFetched && bloque.data && bloque.isFetched &&
                                                                    <>
                                                                        {info_horario}
                                                                        {bloque.data.intervalos.map(i => {
                                                                            //const talento_asignado = talentos_asignados_a_horario.filter(t => t.intervalo === intervalo)[0];
                                                                            if (i.talento) {
                                                                                const foto_perfil_talento = i.talento.media.filter(m => m.media.identificador.toUpperCase().includes('FOTO-PERFIL'))[0]?.media.url;
                                                                                const calificacion_talento = (i.talento.destacados) ? i.talento.destacados.filter( d => d.id_cazatalentos === proyecto.data?.id_cazatalentos)[0] : undefined;
                                                                                return (
                                                                                    <div style={{ backgroundColor: (i.tipo === 'intervalo') ? input_background_hover_color : '#94f0d1', width: '90%', height: 164, margin: 8, paddingLeft: 16, position: 'relative'}}>
                                                                                        <p style={{margin: 4}}>{i.hora}</p>
                                                                                        <p style={{margin: 4}}>Rol - {i.rol?.nombre}</p>
                                                                                        {['confirmado', 'aprobado', 'rechazado'].includes(i.estado.toLowerCase()) && horario.data?.tipo_agenda.toLowerCase() !== 'callback' &&
                                                                                            <FormControlLabel
                                                                                                sx={{
                                                                                                    width: '25%',
                                                                                                    margin: 1,
                                                                                                    position: 'absolute',
                                                                                                    top: 0,
                                                                                                    right: 0,
                                                                                                    color: 'white',
                                                                                                    fontSize: '12px'
                                                                                                }}
                                                                                                control={
                                                                                                    <MaterialUISwitch 
                                                                                                    sx={{ m: 1 }} 
                                                                                                    onChange={() => {
                                                                                                        updateIntervaloHorario.mutate({
                                                                                                            id_intervalo: i.id,
                                                                                                            id_rol: i.id_rol,
                                                                                                            id_talento: i.id_talento,
                                                                                                            estado: ['rechazado', 'confirmado'].includes(i.estado.toLowerCase()) ? 'Aprobado' : 'Rechazado'
                                                                                                        })
                                                                                                    }}
                                                                                                    checked={i.estado.toLowerCase() === 'aprobado'}
                                                                                                />}
                                                                                                label="Callback"
                                                                                            />
                                                                                            
                                                                                            
                                                                                            
                                                                                        }
                                                                                        <div style={{paddingRight: 24}}>

                                                                                            <TalentoReclutadoListCard 
                                                                                                tipo_agenda={(horario.data) ? horario.data.tipo_agenda.toLowerCase() : undefined}
                                                                                                profile_url={(foto_perfil_talento) ? foto_perfil_talento : '/assets/img/no-image.png'}
                                                                                                nombre={`${i.talento.nombre} ${i.talento.apellido}`}
                                                                                                union={'ND'}
                                                                                                estado={i.estado}
                                                                                                calificacion={calificacion_talento ? calificacion_talento.calificacion : 0}
                                                                                                id_talento={i.talento.id}
                                                                                                ubicacion={(i.talento.info_basica) ? i.talento.info_basica.estado_republica.es : 'Sin Ubicacion'}
                                                                                                onDrop={(id_talento) => {
                                                                                                    //alert('SE DROPEO ESTE WEON' + id_talento);
                                                                                                } } 
                                                                                                action={<IconButton
                                                                                                    onClick={() => {
                                                                                                        updateIntervaloHorario.mutate({
                                                                                                            id_intervalo: i.id,
                                                                                                            id_rol: null,
                                                                                                            id_talento: null,
                                                                                                            estado: 'Pendiente'
                                                                                                        })
                                                                                                    }}
                                                                                                    style={{
                                                                                                        color: 'white',
                                                                                                    }}
                                                                                                    aria-label="Eliminar Asignacion"
                                                                                                    component="label">
                                                                                                    <Close style={{ width: 32 }} />
                                                                                                </IconButton>}   
                                                                                            />                                                                                     
                                                                                        </div>
                                                                                    </div>
                                                                                )
                                                                            }
                                                                            return (
                                                                                <div style={{ backgroundColor: (i.tipo === 'intervalo') ? input_background_hover_color : '#94f0d1', width: '90%', height: 88, margin: 8, position: 'relative'}}>
                                                                                    <p style={{position: 'absolute', top: 8, left: 8}}>{i.hora}</p>
                                                                                    {i.tipo !== 'descanso' &&
                                                                                        <DraggableHorarioContainer
                                                                                            onDrop={(item) => {
                                                                                                const {id_talento} = item as {id_talento: number};
                                                                                                
                                                                                                updateIntervaloHorario.mutate({
                                                                                                    id_intervalo: i.id,
                                                                                                    id_rol: selected_rol,
                                                                                                    id_talento: id_talento,
                                                                                                    estado: i.estado
                                                                                                })
                                                                                            }}
                                                                                            id_rol={selected_rol}
                                                                                            fecha={opcionSelected}
                                                                                            allowedDropEffect="any" 
                                                                                        />
                                                                                    }
                                                                                    {i.tipo === 'descanso' &&
                                                                                        <div style={{
                                                                                            position: 'absolute',
                                                                                            width: '100%',
                                                                                            top: 56,
                                                                                        }}>
                                                                                            <Typography fontWeight={800} textAlign={'center'}>{'Descanso'}</Typography>
                                                                                        </div>
                                                                                    }
                                                                                </div>
                                                                            )
                                                                        })}
                                                                        {info_horario}
                                                                    </>
                                                                }
                                                                {!props.disable_actions && !bloque.data && bloque.isFetched &&
                                                                    <>
                                                                        <Typography fontWeight={600} sx={{ color: '#827F7F', marginBottom: '20px' }}>
                                                                            ¡Comienza a crear tu horario y castea organizadamente!
                                                                        </Typography>

                                                                        <Tooltip
                                                                            title='Comienza a crear tu horario, ¡y castea organizadamente!'
                                                                            arrow
                                                                            sx={{
                                                                                [`& .${tooltipClasses.tooltip}`]: {
                                                                                    backgroundColor: 'orange',
                                                                                    color: 'white',
                                                                                },
                                                                            }}
                                                                        >
                                                                            <Button sx={{
                                                                                textTransform: 'none',
                                                                                border: '1px solid #069cb1',
                                                                                borderRadius: '2rem',
                                                                                padding: '5px 20px',
                                                                                color: '#000'
                                                                            }}
                                                                                onClick={() => {
                                                                                    if (opcionSelected !== '') {
                                                                                        setIsOpendModal(true);
                                                                                    } else {
                                                                                        notify('warning', 'No haz seleccionado ninguna fecha aun');
                                                                                    }
                                                                                }}
                                                                            >
                                                                                <Image src="/assets/img/iconos/cruz_blue.svg" width={15} height={15} alt="" />
                                                                                <Typography fontWeight={600} sx={{ paddingLeft: '10px' }}>
                                                                                    Añadir bloque de tiempo
                                                                                </Typography>
                                                                            </Button>
                                                                        </Tooltip>
                                                                    </>
                                                                }
                                                            </Box>
                                                        </Grid>
                                                    </Grid>

                                                    <ModalBloquesTiempos
                                                        id_horario_agenda={(horario.data) ? horario.data.id : 0}
                                                        locaciones={(horario.data) ? horario.data.localizaciones : []}
                                                        roles={(horario.data) ? horario.data.proyecto.rol : []}
                                                        date={opcionSelected}
                                                        isOpen={isOpendModal}
                                                        setIsOpen={setIsOpendModal}
                                                        onChange={() => {
                                                            talentos_asignados_por_horario.refetch();
                                                        }}
                                                    />
                                                </Grid>
                                            </Grid>
                                            <Grid item xs={(props.can_start_callback) ? 6 : 12} my={4} alignItems={'center'} justifyContent={'center'} textAlign={'center'}>
                                                <Divider/>
                                                
                                                <Button 
                                                    variant='contained' 
                                                    onClick={() => {
                                                        setConfirmationDialog({ 
                                                            action: 'SEND_HORARIOS', 
                                                            data: new Map(),
                                                            opened: true, 
                                                            title: 'Mandar Horarios', 
                                                            content: 
                                                                <Typography>Seguro que quieres mandar la confirmacion de horarios a los talentos asignados en los intervalos?</Typography>
                                                        });
                                                    }}
                                                    sx={{m: 2, borderRadius: 8, backgroundColor: '#F9B233'}}
                                                >
                                                    Mandar Horarios 
                                                </Button>
                                            </Grid>
                                            {props.can_start_callback &&
                                            
                                                <Grid item xs={6} my={4} alignItems={'center'} justifyContent={'center'} textAlign={'center'}>
                                                    <Divider/>
                                                    
                                                    <Button 
                                                        ref={btn_callback_ref}
                                                        href=''
                                                        onClick={() => {
                                                            const params = new Map<string, unknown>();
                                                            params.set('tipo_localizacion', horario.data?.tipo_localizacion);
                                                            params.set('notas', horario.data?.notas);
                                                            params.set('id_uso_horario', horario.data?.id_uso_horario);
                                                            params.set('id_proyecto', horario.data?.id_proyecto);
                                                            const talentos_elements: JSX.Element[] = (!roles.data) ? [] : roles.data.map((rol, i) => {
                                                                return rol.aplicaciones_por_talento.filter(aplicacion => {
                                                                    return talentos_aprobados.filter((ta) => ta.id_talento === aplicacion.id_talento && aplicacion.id_estado_aplicacion === Constants.ESTADOS_APLICACION_ROL.AUDICION).length > 0;
                                                                }).map((aplicacion, i) => {
                                                                    console.log(aplicacion, i)
                                                                    const foto_perfil_talento = aplicacion.talento.media.filter(m => m.media.identificador.toUpperCase().includes('FOTO-PERFIL'))[0]?.media.url;
                                                                    const calificacion_talento = (aplicacion.talento.destacados) ? aplicacion.talento.destacados.filter( d => d.id_cazatalentos === proyecto.data?.id_cazatalentos)[0] : undefined;
                                                                        
                                                                    return <TalentoReclutadoListCard 
                                                                        key={i}
                                                                        tipo_agenda={(horario.data) ? horario.data.tipo_agenda.toLowerCase() : undefined}
                                                                        profile_url={(foto_perfil_talento) ? foto_perfil_talento : '/assets/img/no-image.png'}
                                                                        nombre={`${aplicacion.talento.nombre} ${aplicacion.talento.apellido}`}
                                                                        union={'ND'}
                                                                        estado={'Aprobado'}
                                                                        calificacion={calificacion_talento ? calificacion_talento.calificacion : 0}
                                                                        id_talento={aplicacion.talento.id}
                                                                        ubicacion={''}
                                                                        onDrop={(id_talento) => {
                                                                            //alert('SE DROPEO ESTE WEON' + id_talento);
                                                                        } } 
                                                                        action={<></>}   
                                                                    />          
                                                                })
                                                            }).flat();
                                                            
                                                            setConfirmationDialog({ 
                                                                action: 'CALLBACK', 
                                                                data: params,
                                                                opened: true, 
                                                                title: 'Iniciar Callback', 
                                                                content: 
                                                                    <Box>
                                                                        {talentos_elements.length === 0 &&
                                                                            <Typography variant="body2">No haz aprobado ningun talento para callback, seguro que deseas iniciar con el proceso de callback con este horario?</Typography> 
                                                                        }
                                                                        {talentos_elements.length > 0 &&
                                                                            <Typography variant="body2">Los siguientes talentos han sido aprobados para continuar al callback, seguro que deseas iniciar con el proceso de callback con este horario?</Typography> 
                                                                        }
                                                                        {talentos_elements.map(t => {
                                                                            return t;
                                                                        })}
                                                                    </Box>
                                                            });
                                                        }}
                                                        variant='contained' 
                                                        sx={{m: 2, borderRadius: 8, backgroundColor: '#F9B233'}}
                                                    >
                                                        Iniciar Callback 
                                                    </Button>
                                                </Grid>
                                            }
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </div>
                    </div>
                </div>
            </MainLayout>
            <ConfirmationDialog
                opened={confirmation_dialog.opened}
                onOptionSelected={(confirmed: boolean) => {
                    if (confirmed) {
                        switch (confirmation_dialog.action) {
                            case 'SEND_HORARIOS': {
                                sendHorarios.mutate({
                                    id_horario: parseInt(id as string)
                                })
                                break;
                            }
                            case 'CALLBACK': {
                                const tipo_localizacion = confirmation_dialog.data.get('tipo_localizacion');
                                const notas = confirmation_dialog.data.get('notas');
                                const id_uso_horario = confirmation_dialog.data.get('id_uso_horario');
                                const id_proyecto = confirmation_dialog.data.get('id_proyecto');
                                updateHorario.mutate({
                                    locaciones: [],
                                    fechas: [],
                                    tipo_fechas: 'NUEVAS',
                                    tipo_localizacion: tipo_localizacion as string,
                                    notas: notas as string,
                                    id_uso_horario: id_uso_horario as number,
                                    id_proyecto: id_proyecto as number,
                                    tipo_agenda: 'CALLBACK'
                                })
                                break;
                            }
                        }
                    } else {
                        if (ask_for_callback) {
                            router.replace(`/cazatalentos/agenda-virtual/horario/${id}`);
                        }
                    }
                    setConfirmationDialog({ ...confirmation_dialog, opened: false });
                    
                }}
                title={confirmation_dialog.title}
                content={confirmation_dialog.content}
            />
            <Flotantes />
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
	const session = await getSession(context);
	if (session && session.user) {
		if (session.user.tipo_usuario === TipoUsuario.CAZATALENTOS) {
            let id_horario = 0;
            if (context.params) {
                id_horario = parseInt(context.params.id as string);
            }
            let disable_actions = false;
            let can_start_callback = false;
            const horario = await prisma.horarioAgenda.findFirst({
                where: {
                    id: id_horario
                },
                include: {
                    fechas: true
                }
            })
            if (horario) {
                const ordered_dates = Array.from(expandDates(horario.fechas)).sort((a, b) => {
                    const d_1 = dayjs(a, 'DD/MM/YYYY');
                    const d_2 = dayjs(b, 'DD/MM/YYYY');
                    return d_1.toDate().getTime() - d_2.toDate().getTime();
                });
                const last_date = ordered_dates[ordered_dates.length - 1];
                if (last_date) {
                    const date = dayjs(last_date, 'DD/MM/YYYY').locale('es-mx');
                    const today = dayjs(new Date()).locale('es-mx');
                    if (horario.tipo_agenda.toLowerCase() === 'audicion' && today.isAfter(date)) {
                        can_start_callback = true;
                    }
                    let last_day_plus_7_days = date.clone();
                    last_day_plus_7_days = last_day_plus_7_days.add(7, 'days');
                    if (today.isAfter(last_day_plus_7_days)) {
                        disable_actions = true;
                    }
                }
            }
			return {
				props: {
					user: session.user,
                    disable_actions: disable_actions,
                    can_start_callback: can_start_callback
				}
			}
		}
		return {
			redirect: {
				destination: `/error?cause=${Constants.PAGE_ERRORS.UNAUTHORIZED_USER_ROLE}`,
				permanent: true
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


export default AudicionPorId