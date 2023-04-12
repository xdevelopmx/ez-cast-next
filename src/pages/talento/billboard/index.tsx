import { Grid, Typography } from '@mui/material'
import { type NextPage } from 'next'
import Head from 'next/head'
import React from 'react'
import { Alertas, MainLayout, MenuLateral, ProjectsTable } from '~/components'

const BillboardPage: NextPage = () => {
    return (
        <>
            <Head>
                <title>Talento | Talent Corner</title>
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
                                <Grid xs={12} mt={4}>
                                    <Typography fontWeight={800} sx={{ fontSize: '2rem' }}>Casting Billboard</Typography>
                                </Grid>
                                <Grid xs={12}>
                                    <ProjectsTable />
                                </Grid>
                            </Grid>

                        </div>
                    </div>
                </div>
            </MainLayout>
        </>
    )
}

export default BillboardPage