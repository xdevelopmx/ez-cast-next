import { useRouter } from 'next/router'
import { useEffect, useReducer } from 'react'
import { type NextPage } from 'next'
import Head from 'next/head'
import { motion } from 'framer-motion'
import { Grid, Typography } from '@mui/material'
import { Alertas, Flotantes, MainLayout, MenuLateral } from '~/components'
import { DescripcionDelRol, InformacionGeneralRol } from '~/components/cazatalento/roles'
import { CompensacionRol } from '~/components/cazatalento/roles/agregar-rol/secciones/CompensacionRol'
import { FiltrosDemograficosRol } from '~/components/cazatalento/roles/agregar-rol/secciones/FiltrosDemograficosRol'
import { InformacionCastingRol } from '~/components/cazatalento/roles/agregar-rol/secciones/InformacionCastingRol'
import { InformacionFilmacionRol } from '~/components/cazatalento/roles/agregar-rol/secciones/InformacionFilmacionRol'
import { RequisitosRol } from '~/components/cazatalento/roles/agregar-rol/secciones/RequisitosRol'
import { SelfTapeRol } from '~/components/cazatalento/roles/agregar-rol/secciones/SelfTapeRol'
import { api, parseErrorBody } from "~/utils/api";
import useNotify from "~/hooks/useNotify";

export type RolInformacionGeneralForm = {
    id_rol: number,
    nombre: string,
    id_tipo_rol: number,
    id_proyecto: number,
    rol_principal_secundario: string
}

export type RolCompensacionForm = {
    id_rol: number,
    compensacion: {
        datos_adicionales: string,
        suma_total_compensaciones_no_monetarias?: number,
    },
    sueldo?: {
        cantidad_sueldo: number,
        periodo_sueldo: string,
    },
    compensaciones_no_monetarias: {
        id_compensacion: number,
        descripcion_compensacion: string
    }[],

    //extras para el formulario
    se_pagara_sueldo: 'Sí' | 'No',
    se_otorgaran_compensaciones: 'Sí' | 'No',
}

export type RolForm = {
    informacion_general: RolInformacionGeneralForm,
    compensacion: RolCompensacionForm,
}

const initialState: RolForm = {
    informacion_general: {
        id_rol: 0,
        nombre: '',
        id_tipo_rol: 0,
        id_proyecto: 0,
        rol_principal_secundario: 'Principal'
    },
    compensacion: {
        id_rol: 0,
        compensacion: {
            datos_adicionales: '',
            suma_total_compensaciones_no_monetarias: 0
        },
        sueldo: {
            cantidad_sueldo: 0,
            periodo_sueldo: 'Diario'
        },
        compensaciones_no_monetarias: [],

        //extras para el formulario
        se_pagara_sueldo: 'Sí',
        se_otorgaran_compensaciones: 'Sí',
    }
}

const reducerRol = (state: RolForm, action: { type: string, value: { [key: string]: unknown } }) => {
    switch (action.type) {
        case 'update-form':
            return { ...state, ...action.value }
        case 'update-info-gral': {
            return { ...state, informacion_general: { ...state.informacion_general, ...action.value } } as RolForm;
        }
        case 'update-compensacion': {
            return { ...state, compensacion: { ...state.compensacion, ...action.value } } as RolForm;
        }
        default:
            return { ...state }
    }
}

const AgregarRolPage: NextPage = () => {

    const router = useRouter()

    const [state, dispatch] = useReducer(reducerRol, initialState)

    const { notify } = useNotify();

    /* console.log({ query: router.query }); */

    const updatesIDs = (id: any) => {
        dispatch({ type: 'update-info-gral', value: { id_rol: id } })
        dispatch({ type: 'update-compensacion', value: { id_rol: id } })
    }

    const saveInfoGral = api.roles.saveInfoGral.useMutation({
        onSuccess(input) {
            notify('success', 'Se guardo la informacion general con exito');
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            updatesIDs(input.id)
            console.log({ input });
        },
        onError: (error) => {
            notify('error', parseErrorBody(error.message));
        }
    });

    const saveCompensacion = api.roles.saveCompensacion.useMutation({
        onSuccess(input) {
            notify('success', 'Se guardo la compensación con exito');
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            updatesIDs(input.id_rol)
            console.log({ input });
        },
        onError: (error) => {
            notify('error', parseErrorBody(error.message));
        }
    });

    console.log({ state });

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
                            <InformacionGeneralRol
                                state={state}
                                onFormChange={(input) => {
                                    dispatch({ type: 'update-info-gral', value: input });
                                }}
                                onSaveChanges={() => {
                                    saveInfoGral.mutate({
                                        id_rol: state.informacion_general.id_rol,
                                        nombre: state.informacion_general.nombre,
                                        id_tipo_rol: state.informacion_general.id_tipo_rol,
                                        id_proyecto: router.query['id-proyecto']
                                            ? parseInt(
                                                typeof router.query['id-proyecto'] === 'string'
                                                    ? router.query['id-proyecto']
                                                    : '0'
                                            )
                                            : 0
                                    })
                                }}
                            />
                            <CompensacionRol
                                state={state}
                                onFormChange={(input) => {
                                    dispatch({ type: 'update-compensacion', value: input });
                                }}
                                onSaveChanges={() => {
                                    console.log({
                                        id_rol: state.compensacion.id_rol,
                                        compensacion: state.compensacion.compensacion,
                                        compensaciones_no_monetarias: state.compensacion.compensaciones_no_monetarias,
                                        sueldo: state.compensacion.sueldo
                                    });
                                    saveCompensacion.mutate({
                                        id_rol: state.compensacion.id_rol,
                                        compensacion: state.compensacion.compensacion,
                                        compensaciones_no_monetarias: state.compensacion.compensaciones_no_monetarias,
                                        sueldo: state.compensacion.sueldo
                                    })
                                }}
                            />
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