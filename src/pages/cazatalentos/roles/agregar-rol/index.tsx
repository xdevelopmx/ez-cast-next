import { Grid, Typography } from '@mui/material'
import { type NextPage } from 'next'
import Head from 'next/head'
import { Alertas, Flotantes, MainLayout, MenuLateral } from '~/components'
import { motion } from 'framer-motion'
import { DescripcionDelRol, InformacionGeneralRol } from '~/components/cazatalento/roles'
import { CompensacionRol } from '~/components/cazatalento/roles/agregar-rol/secciones/CompensacionRol'
import { FiltrosDemograficosRol } from '~/components/cazatalento/roles/agregar-rol/secciones/FiltrosDemograficosRol'
import { InformacionCastingRol } from '~/components/cazatalento/roles/agregar-rol/secciones/InformacionCastingRol'
import { InformacionFilmacionRol } from '~/components/cazatalento/roles/agregar-rol/secciones/InformacionFilmacionRol'
import { RequisitosRol } from '~/components/cazatalento/roles/agregar-rol/secciones/RequisitosRol'
import { SelfTapeRol } from '~/components/cazatalento/roles/agregar-rol/secciones/SelfTapeRol'

const AgregarRolPage: NextPage = () => {
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
                    <Grid container xs={12} sx={{ padding: '0rem 5rem 5rem 5rem' }}>
                        <Grid item xs={12}>
                            <div className="container_box_header">
                                <div className="d-flex justify-content-end align-items-start py-2">
                                    <Alertas />
                                </div>
                            </div>
                            <div className="d-flex" style={{ marginBottom: 64, alignItems: 'center' }}>
                                <motion.img style={{ width: 35 }} src="/assets/img/iconos/EZ_Rol_N.svg" alt="icono" />
                                <div>
                                    <p style={{ marginLeft: 20 }} className="color_a h4 font-weight-bold mb-0"><b>Agregar rol</b></p>
                                </div>
                            </div>
                            <InformacionGeneralRol />
                            <CompensacionRol />
                            <FiltrosDemograficosRol />
                            <DescripcionDelRol />
                            <InformacionCastingRol />
                            <InformacionFilmacionRol />
                            <RequisitosRol />
                            <SelfTapeRol />

                            <div className="row mt-lg-4">
                                <div className="col d-flex justify-content-center" >
                                    <div className="mr-3">
                                        <button
                                            onClick={() => {
                                                /* updateProyecto.mutate({
                                                    sindicato: {
                                                        id_sindicato: state.id_sindicato,
                                                        descripcion: state.sindicato,
                                                    },
                                                    tipo_proyecto: {
                                                        id_tipo_proyecto: state.id_tipo,
                                                        descripcion: state.tipo
                                                    },
                                                    proyecto: { ...state },
                                                }) */
                                            }}
                                            className="btn btn-intro btn-price btn_out_line mb-2"
                                            type="button"
                                        >
                                            <Typography>Guardar e ir a proyectos</Typography>
                                        </button>
                                    </div>
                                    <div>
                                        <button className="btn btn-intro btn-price mb-2" type="submit">
                                            <Typography>
                                                Guardar y crear otro rol
                                            </Typography>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Grid>
                    </Grid>
                </div>
            </MainLayout>
            <Flotantes />
        </>
    )
}

export default AgregarRolPage