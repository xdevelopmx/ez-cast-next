import { Divider, Grid, Typography } from '@mui/material'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React from 'react'
import { Alertas, DatosAudicion, Flotantes, HorariosTable, MainLayout, MenuLateral, TalentosReclutadosGrid } from '~/components'
import { api } from '~/utils/api'
import { expandDates } from '~/utils/dates'

const AudicionPorId = () => {


    const router = useRouter();

    const {id} = router.query;

    console.log(id)

    const horario = api.agenda_virtual.getHorarioAgendaById.useQuery(parseInt(id as string), {
		refetchOnWindowFocus: false
	});

    const ordered_dates = Array.from(expandDates((horario.data) ? horario.data.fechas : [])).sort();

    const locacion = horario.data ? horario.data.localizaciones.filter(l => l.es_principal)[0] : undefined;

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
                                            locacion_principal={`${locacion?.direccion}, ${locacion?.estado_republica.es}`}
                                            uso_horario={`${horario.data?.uso_horario.es}`}
                                        />

                                        <Grid container xs={12} mt={4}>
                                            <Grid xs={5}>
                                                <TalentosReclutadosGrid 
													id_proyecto={(horario.data) ? horario.data.id_proyecto : 0}
												/>
                                            </Grid>
                                            <Grid xs={1}>

                                            </Grid>
                                            <Grid xs={6}>
                                                <HorariosTable
													dates={ordered_dates} 
												/>
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