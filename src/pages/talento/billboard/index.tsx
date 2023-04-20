import { Grid, Typography } from '@mui/material'
import { GetServerSideProps, type NextPage } from 'next'
import { User } from 'next-auth'
import { getSession } from 'next-auth/react'
import Head from 'next/head'
import React from 'react'
import { Alertas, MainLayout, MenuLateral, RolesTable } from '~/components'
import Constants from '~/constants'
import { TipoUsuario } from '~/enums'

type BillboardTalentosPageProps = {
    user: User,
    id_proyecto: number
}


const BillboardPage: NextPage<BillboardTalentosPageProps> = ({ user, id_proyecto }) => {
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
                                    <RolesTable />
                                </Grid>
                            </Grid>

                        </div>
                    </div>
                </div>
            </MainLayout>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);
    let id_proyecto = 0;
    if (context.query) {
        id_proyecto = parseInt(context.query['id-proyecto'] as string);
    }
    if (session && session.user) {
        if (session.user.tipo_usuario === TipoUsuario.TALENTO) {
            return {
                props: {
                    user: session.user,
                    id_proyecto: id_proyecto
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

export default BillboardPage