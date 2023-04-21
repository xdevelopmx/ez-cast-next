import { type NextPage } from 'next'
import Head from 'next/head'
import { Alertas, MainLayout, MenuLateral } from '~/components'
import { motion } from 'framer-motion'

const DashboardPage: NextPage = () => {
    return (
        <>
            <Head>
                <title>Representante | Talent Corner</title>
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
                            <div className="d-flex">
                                <motion.img src="/assets/img/iconos/chair_dir_blue.svg" alt="icono" />
                                <p className="color_a h4 font-weight-bold mb-0 ml-2"><b>Bienvenido, Iván</b></p>
                            </div>
                        </div>
                    </div>
                </div>
            </MainLayout>
        </>
    )
}

export default DashboardPage