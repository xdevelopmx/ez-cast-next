import { type NextPage } from 'next'
import Head from 'next/head'
import React, { useReducer } from 'react'
import { Flotantes, MainLayout, MenuLateral, InformacionGeneral, Alertas } from '~/components'
import { motion } from 'framer-motion'
import { ContactoCasting } from '~/components/cazatalento/proyecto/crear/ContactoCasting'
import { EquipoCreativo } from '~/components/cazatalento/proyecto/crear/EquipoCreativo'
import { DetallesAdicionales } from '~/components/cazatalento/proyecto/crear/DetallesAdicionales'
import { LocacionProyecto } from '~/components/cazatalento/proyecto/crear/LocacionProyecto'
import { PublicarProyecto } from '~/components/cazatalento/proyecto/crear/PublicarProyecto'
import { api, parseErrorBody } from '~/utils/api'
import useNotify from '~/hooks/useNotify'

export type ProyectoForm = {
    id?: number,
    nombre: string,
    id_sindicato: number,
    sindicato: string,
    id_tipo: number,
    tipo: string,
    director_casting: string,
    telefono_contacto: string,
    email_contacto: string,
    email_contacto_confirmacion: string,
    productor: string,
    casa_productora: string,
    director: string,
    agencia_publicidad: string,
    sinopsis: string,
    detalles_adicionales: string,
    id_estado_republica: number,
    compartir_nombre: boolean,
    estatus: string,
    files: {
        archivo: {
            base64: string,
            extension: string
        },
        foto_portada: {
            base64: string,
            extension: string
        }
    }
}

const initialState: ProyectoForm = {
    nombre: '',
    id_sindicato: 0,
    sindicato: '',
    id_tipo: 0,
    tipo: '',
    director_casting: '',
    telefono_contacto: '',
    email_contacto: '',
    email_contacto_confirmacion: '',
    productor: '',
    casa_productora: '',
    director: '',
    agencia_publicidad: '',
    sinopsis: '',
    detalles_adicionales: '',
    id_estado_republica: 0,
    compartir_nombre: true,
    estatus: '',
    files: {
        archivo: {
            base64: '',
            extension: ''
        },
        foto_portada: {
            base64: '',
            extension: ''
        }
    }
}

function reducer(state: ProyectoForm, action: { type: string, value: { [key: string]: unknown } }) {
    switch (action.type) {
        case 'update-proyecto-form':
            return { ...state, ...action.value }
        default:
            return state;
    }
}


const Proyecto: NextPage = () => {

    const [state, dispatch] = useReducer(reducer, initialState)

    const { notify } = useNotify();

    const updateProyecto = api.proyectos.updateProyecto.useMutation({
        onSuccess: (data) => {
            notify('success', 'Se guardo el proyecto con exito');
        },
        onError: (error) => {
            notify('error', parseErrorBody(error.message));
        }
    })

    return (
        <>

            <Head>
                <title>DashBoard ~ Talentos | Talent Corner</title>
                <meta name="description" content="Talent Corner" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <MainLayout menuSiempreBlanco={true} >
                <div className="d-flex wrapper_ezc">
                    <MenuLateral />
                    <div className="seccion_container col" style={{ paddingTop: '0px !important' }}>
                        <br /><br />
                        <div className="container_box_header">
                            <div className="d-flex justify-content-end align-items-start py-2">
                                <Alertas />
                            </div>
                            <div className="d-flex" style={{ marginBottom: 64 }}>
                                <motion.img style={{ width: 35 }} src="/assets/img/silla-ezcast.svg" alt="icono" />
                                <div>
                                    <p style={{ marginLeft: 20 }} className="color_a h4 font-weight-bold mb-0"><b>Nuevo proyecto</b></p>
                                    <p style={{ marginLeft: 20 }} className="mb-0"><b>¡Comencemos!</b></p>
                                </div>
                            </div>

                            <InformacionGeneral
                                state={state}
                                onFormChange={(input: { [key: string]: unknown }) => {
                                    dispatch({ type: 'update-proyecto-form', value: input });
                                }}
                            />
                            <br />
                            <ContactoCasting
                                state={state}
                                onFormChange={(input: { [key: string]: unknown }) => {
                                    dispatch({ type: 'update-proyecto-form', value: input })
                                    console.log(input);
                                }}
                            />
                            <br />
                            <EquipoCreativo
                                state={state}
                                onFormChange={(input: { [key: string]: unknown }) => {
                                    dispatch({ type: 'update-proyecto-form', value: input })
                                    console.log(input);
                                }}
                            />
                            <br />
                            <DetallesAdicionales
                                state={state}
                                onFormChange={(input: { [key: string]: unknown }) => {
                                    dispatch({ type: 'update-proyecto-form', value: input })
                                    console.log(input);
                                }}
                            />
                            <br />
                            <LocacionProyecto
                                state={state}
                                onFormChange={(input: { [key: string]: unknown }) => {
                                    dispatch({ type: 'update-proyecto-form', value: input })
                                    console.log(input);
                                }}
                            />
                            <br />
                            <PublicarProyecto
                                state={state}
                                onFormChange={(input: { [key: string]: unknown }) => {
                                    dispatch({ type: 'update-proyecto-form', value: input })
                                    console.log(input);
                                }}
                            />
                            <div className="row mt-lg-4">
                                <div className="col d-flex justify-content-center" >
                                    <div className="mr-3">
                                        <button
                                            onClick={() => {
                                                updateProyecto.mutate({
                                                    sindicato: {
                                                        id_sindicato: state.id_sindicato,
                                                        descripcion: state.sindicato,
                                                    },
                                                    tipo_proyecto: {
                                                        id_tipo_proyecto: state.id_tipo,
                                                        descripcion: state.tipo
                                                    },
                                                    proyecto: { ...state },
                                                })
                                            }}
                                            className="btn btn-intro btn-price btn_out_line mb-2"
                                            type="button"
                                        >
                                            Guardar y terminar después
                                        </button>
                                    </div>
                                    <div>
                                        <button className="btn btn-intro btn-price mb-2" type="submit">Guardar proyecto y agregar rol</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </MainLayout>
            <Flotantes />
        </>
    )
}

export default Proyecto