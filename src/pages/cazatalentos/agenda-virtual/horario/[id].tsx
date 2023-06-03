import { Box, Button, ButtonGroup, Divider, Grid, Tooltip, Typography, tooltipClasses } from '@mui/material'
import { Media, MediaPorTalentos, Talentos } from '@prisma/client'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useState, useEffect, useMemo } from 'react'
import { Alertas, DatosAudicion, Flotantes, HorariosTable, MSelect, MainLayout, MenuLateral, ModalBloquesTiempos, TalentoReclutadoCard, TalentosReclutadosGrid } from '~/components'
import { DraggableHorarioContainer } from '~/components/cazatalento/agenda-virtual/horarios-tabla/DraggableHorarioContainer'
import Constants from '~/constants'
import useNotify from '~/hooks/useNotify'
import { api } from '~/utils/api'
import { expandDates, generateIntervalos } from '~/utils/dates'

const AudicionPorId = () => {

    const {notify} = useNotify();

    const router = useRouter();

    const {id} = router.query;

    console.log(id)

    const horario = api.agenda_virtual.getHorarioAgendaById.useQuery(parseInt(id as string), {
		refetchOnWindowFocus: false
	});

    const ordered_dates = Array.from(expandDates((horario.data) ? horario.data.fechas : [])).sort();

    // para las aplicaciones de talentos a roles
    const roles = api.roles.getAllCompleteByProyecto.useQuery((horario.data) ? horario.data.id_proyecto : 0, {
		refetchOnWindowFocus: false
	})

    const [talentos, setTalentos] = useState<(Talentos & { media: (MediaPorTalentos & { media: Media; })[] })[]>([]);

    const [talentos_asignados_a_horario, setTalentosAsignadosAHorario] = useState<(Talentos & { intervalo: string, media: (MediaPorTalentos & { media: Media; })[] })[]>([]);

    const [estado_aplicacion_rol, setEstadoAplicacionRol] = useState(Constants.ESTADOS_APLICACION_ROL.AUDICION.toString());

    const [selected_rol, setSelectedRol] = useState(0);

    // para la lista de intervalos

    const [opcionSelected, setOpcionSelected] = useState<string>(new Date().toString());

    const [isOpendModal, setIsOpendModal] = useState(false);

    const bloque = api.agenda_virtual.getBloqueHorarioByDateAndIdHorario.useQuery({
        id_horario_agenda: (horario.data) ? horario.data.id : 0, fecha: new Date(opcionSelected)
    }, {
        refetchOnWindowFocus: false
    })

    const intervalos = useMemo(() => {
        if (bloque.data) {
            return generateIntervalos(bloque.data.minutos_por_talento, 
                bloque.data.hora_inicio, 
                bloque.data.hora_fin, 
                (bloque.data.hora_descanso_inicio && bloque.data.hora_descanso_inicio !== '00:00' && bloque.data.hora_descanso_fin && bloque.data.hora_descanso_fin !== '00:00') ? 
                {inicio_tiempo: bloque.data.hora_descanso_inicio, fin_tiempo: bloque.data.hora_descanso_fin} : undefined);
        }
        return [];
    }, [bloque.data]);

    useEffect(() => {
        if (roles.data) {
            const rol = roles.data[0];
            if (rol) {
                setSelectedRol(rol.id);
            }
            roles.data.map((rol, i) => {
                if (rol.id === selected_rol) {
                    setTalentos(rol.aplicaciones_por_talento.filter(ap => ap.id_estado_aplicacion === parseInt(estado_aplicacion_rol)).map((aplicacion, j) => {
                        return aplicacion.talento;
                    }))
                }
            })
        }
    }, [roles.data, selected_rol, estado_aplicacion_rol]);
    // end

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
                                        <p>{JSON.stringify(talentos.map(t => t.id))}</p>
                                        <Grid xs={12} mt={2}>
                                            <Divider />
                                        </Grid>
                                        <p>{JSON.stringify(talentos_asignados_a_horario.map(t => t.id))}</p>
                                        
                                        <DatosAudicion 
                                            uso_horario={`${horario.data?.uso_horario.es}`}
                                        />

                                        <Grid container xs={12} mt={4}>
                                            <Grid xs={5}>
                                                <Grid xs={12}>
                                                    <Grid container xs={12} sx={{
                                                        backgroundColor: '#069cb1',
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

                                                                <Image src="/assets/img/iconos/vista_cuadros.png" width={20} height={20} alt="" />

                                                                <Image src="/assets/img/iconos/vista_columnas.png" width={20} height={20} alt="" />
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
                                                                        options={[{ value: Constants.ESTADOS_APLICACION_ROL.AUDICION.toString(), label: 'Audicion' }, { value: Constants.ESTADOS_APLICACION_ROL.CALLBACK.toString(), label: 'Callback' }]}
                                                                        value={estado_aplicacion_rol}
                                                                        className={'form-input-md'}
                                                                        onChange={(e) => {
                                                                            setEstadoAplicacionRol(e.target.value)
                                                                        }}
                                                                        disable_default_option
                                                                    />
                                                                </Box>
                                                            </Grid>
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <Divider style={{width: '75%', marginLeft: 'auto', marginRight: 'auto', marginTop: 16}}/>
                                                        </Grid>
                                                        <Grid container xs={12} gap={2} maxHeight={700} overflow={'auto'} sx={{
                                                            justifyContent: 'center',
                                                            borderLeft: '3px solid #EBEBEB',
                                                            borderRight: '3px solid #EBEBEB',
                                                            borderBottom: '3px solid #EBEBEB',
                                                            padding: '30px 0'
                                                        }}>
                                                            {talentos.map((t, i) => {
                                                                const profile = t.media.filter(m => m.media.identificador.match('foto-perfil-talento'))[0];
                                                                return <Grid key={i} xs={5}>
                                                                    <TalentoReclutadoCard 
                                                                        profile_url={(profile) ? profile.media.url : '/assets/img/no-image.png'}
                                                                        nombre={`${t.nombre} ${t.apellido}`}
                                                                        union={'ND'}
                                                                        id_talento={t.id}
                                                                        onDrop={(id_talento) => {
                                                                            //alert('SE DROPEO ESTE WEON' + id_talento);
                                                                        }}
                                                                    />
                                                                </Grid>
                                                            })}
                                                        </Grid>

                                                        
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid xs={1}>

                                            </Grid>
                                            <Grid xs={6}>
                                                <Grid xs={12}>
                                                    <Grid xs={12} sx={{
                                                        backgroundColor: '#069cb1',
                                                        padding: '20px',
                                                        alignItems: 'center',
                                                    }}>
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <Typography fontWeight={600} sx={{ color: '#fff', fontSize: '1.4rem' }}>
                                                                Horario
                                                            </Typography>
                                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
                                                                

                                                                <Button sx={{
                                                                    display: 'flex',
                                                                    textTransform: 'none',
                                                                    color: '#fff',
                                                                    border: '1px solid #fff',
                                                                    borderRadius: '2rem',
                                                                    padding: '5px 20px',
                                                                    backgroundColor: '#069cb1',
                                                                    '&:hover': {
                                                                        backgroundColor: '#07a6bb'
                                                                    },
                                                                    lineHeight: '20px',
                                                                    overflow: 'hidden',
                                                                    whiteSpace: 'nowrap',
                                                                    textOverflow: 'ellipsis'
                                                                }}>
                                                                    <Image src="/assets/img/iconos/cruz_white.svg" width={15} height={15} alt="" />
                                                                    <Typography sx={{ paddingLeft: '10px' }}>
                                                                        Añadir bloque de tiempo
                                                                    </Typography>
                                                                </Button>
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
                                                                            variant={opcionSelected === date ? 'contained' : 'outlined'}
                                                                        >
                                                                            {date}
                                                                        </Button>
                                                                    )
                                                                })}
                                                                
                                                            </ButtonGroup>
                                                        </Grid>
                                                        <Grid xs={12}>
                                                            <Box sx={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                flexDirection: 'column',
                                                                minHeight: '400px',
                                                                justifyContent: 'center'
                                                            }}>
                                                                {bloque.data && bloque.isFetched &&
                                                                    <>
                                                                        {intervalos.map(i => {
                                                                            const intervalo = `${(i.inicio.length < 5) ? `${i.inicio}0` : i.inicio} - ${(i.fin. length < 5) ? `${i.fin}0` : i.fin }`;
                                                                            const talento_asignado = talentos_asignados_a_horario.filter(t => t.intervalo === intervalo)[0];
                                                                            if (talento_asignado) {
                                                                                return <p>Asignado a {`${talento_asignado.nombre} ${talento_asignado.apellido}`}</p>
                                                                            }
                                                                            return (
                                                                                <div style={{ backgroundColor: (i.tipo === 'intervalo') ? '#a8e2ea' : '#94f0d1', width: '90%', height: 88, margin: 8, position: 'relative'}}>
                                                                                    <p style={{position: 'absolute', top: 8, left: 8}}>{intervalo}</p>
                                                                                    <DraggableHorarioContainer
                                                                                        onDrop={(item) => {
                                                                                            const {id_talento} = item as {id_talento: number};
                                                                                            alert(id_talento);

                                                                                            const talento = talentos.filter(t => t.id === id_talento)[0];
                                                                                            if (talento) {
                                                                                                talentos_asignados_a_horario.push({...talento, intervalo: intervalo});
                                                                                            }
                                                                                            setTalentosAsignadosAHorario(talentos_asignados_a_horario.map(t => t));
                                                                                            setTalentos(prev => {
                                                                                                return prev.filter(t => t.id !== id_talento);
                                                                                            })       
                                                                                                                     
                                                                                        }}
                                                                                        allowedDropEffect="any" 
                                                                                    />
                                                                                </div>
                                                                            )
                                                                        })}
                                                                    </>
                                                                }
                                                                {!bloque.data && bloque.isFetched &&
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
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </div>
                    </div>
                </div>
            </MainLayout>
            <Flotantes />
        </>
    )
}

export default AudicionPorId