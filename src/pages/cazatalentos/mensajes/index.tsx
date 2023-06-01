import React from 'react'
import { type GetServerSideProps, type NextPage } from "next";
import { MainLayout, Mensajes } from '../../../components';
import { Alertas, Flotantes, MenuLateral } from '~/components';
import Head from 'next/head'
import { type User } from "next-auth";
import { getSession } from "next-auth/react";
import { TipoUsuario } from '~/enums';
import Constants from '~/constants';

type DashBoardCazaTalentosPageProps = {
    user: User,
}

const MensajesPage: NextPage<DashBoardCazaTalentosPageProps> = ({ user }) => {
    return (
        <>
            <Head>
                <title>DashBoard ~ Cazatalentos | Talent Corner</title>
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
                                <Mensajes />
                            </div>
                        </div>


                    </div>
                </div>
            </MainLayout>
            <Flotantes />
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);
    if (session && session.user) {
        if (session.user.tipo_usuario === TipoUsuario.CAZATALENTOS) {
            return {
                props: {
                    user: session.user,
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

export default MensajesPage