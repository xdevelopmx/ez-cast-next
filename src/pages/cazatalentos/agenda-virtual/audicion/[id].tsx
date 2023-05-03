import { Divider, Grid, Typography } from '@mui/material'
import Head from 'next/head'
import Image from 'next/image'
import React from 'react'
import { Alertas, DatosAudicion, Flotantes, MainLayout, MenuLateral } from '~/components'

const AudicionPorId = () => {
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
                                                Nombre de Horario (Audición o Callback)
                                            </Typography>
                                            <Typography sx={{ fontSize: '1.4rem' }}>
                                                25 de septiembre, 2021-25 de septiembre, 2021
                                            </Typography>
                                        </Grid>
                                        <Grid xs={12} mt={2}>
                                            <Divider />
                                        </Grid>
                                        
                                        <DatosAudicion />
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