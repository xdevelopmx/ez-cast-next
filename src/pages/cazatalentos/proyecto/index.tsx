import { type NextPage } from 'next'
import Head from 'next/head'
import React, { useEffect, useMemo, useReducer, useState } from 'react'
import { Flotantes, MainLayout, MenuLateral, InformacionGeneral, Alertas } from '~/components'
import { motion } from 'framer-motion'
import { ContactoCasting } from '~/components/cazatalento/proyecto/crear/ContactoCasting'
import { EquipoCreativo } from '~/components/cazatalento/proyecto/crear/EquipoCreativo'
import { DetallesAdicionales } from '~/components/cazatalento/proyecto/crear/DetallesAdicionales'
import { LocacionProyecto } from '~/components/cazatalento/proyecto/crear/LocacionProyecto'
import { PublicarProyecto } from '~/components/cazatalento/proyecto/crear/PublicarProyecto'
import { api, parseErrorBody } from '~/utils/api'
import useNotify from '~/hooks/useNotify'
import { Typography } from '@mui/material'
import Constants from '~/constants'
import { useRouter } from 'next/router'

export type ProyectoForm = {
    id?: number,
    nombre: string | null,
    id_sindicato: number,
    sindicato: string,
    id_tipo: number,
    tipo: string,
    director_casting: string | null,
    telefono_contacto: string | null,
    email_contacto: string | null,
    email_contacto_confirmacion: string | null,
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
    },
    errors: {
        nombre?: string,
        director?: string,
        telefono_contacto?: string,
        email_contacto?: string,
        email_contacto_confirmacion?: string,
    },
    hasErrors: boolean | null,
}

const initialState: ProyectoForm = {
    nombre: null,
    id_sindicato: 0,
    sindicato: '',
    id_tipo: 0,
    tipo: '',
    director_casting: null,
    telefono_contacto: null,
    email_contacto: null,
    email_contacto_confirmacion: null,
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
    },
    errors: {},
    hasErrors: null,
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

    const [state, dispatch] = useReducer(reducer, initialState);
    const [redirect, setRedirect] = useState<'' | 'back' | 'roles'>('');
    const { notify } = useNotify();
    const router = useRouter();

    const { mode, id } = useMemo(() => {
        const { id_proyecto } = router.query;
        if (id_proyecto) {
            return { mode: 'EDIT', id: parseInt(id_proyecto as string) };
        }
        return { mode: 'CREATE', id: 0 };
    }, [router.query]);

    const proyecto = api.proyectos.getById.useQuery(id, {
        refetchOnWindowFocus: false
    });

    useEffect(() => {
        if (proyecto.data) {
            dispatch({
                type: 'update-proyecto-form',
                value: {
                    id: (id > 0) ? id : null,
                    nombre: proyecto.data.nombre,
                    id_sindicato: proyecto.data.sindicato?.id_sindicato,
                    sindicato: (proyecto.data.sindicato?.id_sindicato === 99) ? proyecto.data.sindicato?.descripcion : '',
                    id_tipo: proyecto.data.tipo?.id_tipo_proyecto,
                    tipo: (proyecto.data.tipo?.id_tipo_proyecto === 99) ? proyecto.data.tipo?.descripcion : '',
                    director_casting: proyecto.data.director_casting,
                    telefono_contacto: proyecto.data.telefono_contacto,
                    email_contacto: proyecto.data.email_contacto,
                    email_contacto_confirmacion: proyecto.data.email_contacto,
                    productor: proyecto.data.productor,
                    casa_productora: proyecto.data.casa_productora,
                    director: proyecto.data.director,
                    agencia_publicidad: proyecto.data.agencia_publicidad,
                    sinopsis: proyecto.data.sinopsis,
                    detalles_adicionales: proyecto.data.detalles_adicionales,
                    id_estado_republica: proyecto.data.id_estado_republica,
                    compartir_nombre: proyecto.data.compartir_nombre,
                    estatus: proyecto.data.estatus,
                }
            })
        }
    }, [proyecto.data, id]);

    const updateProyecto = api.proyectos.updateProyecto.useMutation({
        onSuccess: (data) => {
            notify('success', 'Se guardo el proyecto con exito');
            if (redirect === 'back') {
                router.back();
            } else {
                void router.push(`/cazatalentos/roles/agregar-rol?id-proyecto=${data.id}`);
            }
        },
        onError: (error) => {
            notify('error', parseErrorBody(error.message));
        }
    })

    const handleSave = (action_redirect: 'back' | 'roles') => {
        setRedirect(action_redirect);
        if (!state.hasErrors) {
            updateProyecto.mutate({
                id: (state.id && state.id > 0) ? state.id : null,
                sindicato: {
                    id_sindicato: state.id_sindicato,
                    descripcion: state.sindicato,
                },
                tipo_proyecto: {
                    id_tipo_proyecto: state.id_tipo,
                    descripcion: state.tipo
                },
                proyecto: {
                    ...state,
                    nombre: (state.nombre) ? state.nombre : '',
                    director_casting: (state.director_casting) ? state.director_casting : '',
                    telefono_contacto: (state.telefono_contacto) ? state.telefono_contacto : '',
                    email_contacto: (state.email_contacto) ? state.email_contacto : ''
                },
            })
        } else {
            dispatch({
                type: 'update-proyecto-form', value: {
                    nombre: (state.nombre) ? state.nombre : '',
                    director_casting: (state.director_casting) ? state.director_casting : '',
                    telefono_contacto: (state.telefono_contacto) ? state.telefono_contacto : '',
                    email_contacto: (state.email_contacto) ? state.email_contacto : '',
                    email_contacto_confirmacion: (state.email_contacto_confirmacion) ? state.email_contacto_confirmacion : '',
                }
            });
            notify('warning', 'Por favor corrige los errores del formulario antes de guardar');
        }
    }
    useEffect(() => {
        if (state.hasErrors != null) {
            const result = {
                errors: {
                    nombre: (!state.nombre || state.nombre.length < 2) ? 'El nombre es demasiado corto' : undefined,
                    director: (!state.director_casting || state.director_casting.length < 2) ? 'El nombre es demasiado corto' : undefined,
                    telefono_contacto: (!state.telefono_contacto || (state.telefono_contacto.length < 10 || state.telefono_contacto.length > 12)) ? 'El telefono es invalido' : undefined,
                    email_contacto: !state.email_contacto || !Constants.PATTERNS.EMAIL.test(state.email_contacto) ? 'El email es invalido' : undefined,
                    email_contacto_confirmacion: state.email_contacto !== state.email_contacto_confirmacion ? 'El email no es el mismo' : undefined,
                },
                hasErrors: false
            }
            result.hasErrors = Object.entries(result.errors).filter(e => (e[1] != null)).length > 0;
            dispatch({ type: 'update-proyecto-form', value: { errors: result.errors, hasErrors: result.hasErrors } })
        } else {
            dispatch({ type: 'update-proyecto-form', value: { hasErrors: true } })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.nombre, state.director_casting, state.telefono_contacto, state.email_contacto, state.email_contacto_confirmacion]);

    const informacion_general = useMemo(() => {
        return <InformacionGeneral
            state={state}
            onFormChange={(input: { [key: string]: unknown }) => {
                dispatch({ type: 'update-proyecto-form', value: input });
            }}
        />
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.nombre, state.id_sindicato, state.id_tipo, state.sindicato, state.tipo])

    const contacto_casting = useMemo(() => {
        return <ContactoCasting
            state={state}
            onFormChange={(input: { [key: string]: unknown }) => {
                dispatch({ type: 'update-proyecto-form', value: input })
                console.log(input);
            }}
        />
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.director_casting, state.telefono_contacto, state.email_contacto, state.email_contacto_confirmacion])

    const equipo_creativo = useMemo(() => {
        return <EquipoCreativo
            state={state}
            onFormChange={(input: { [key: string]: unknown }) => {
                dispatch({ type: 'update-proyecto-form', value: input })
                console.log(input);
            }}
        />
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.productor, state.casa_productora, state.director, state.agencia_publicidad])

    const detalles_adicionales = useMemo(() => {
        return <DetallesAdicionales
            state={state}
            onFormChange={(input: { [key: string]: unknown }) => {
                dispatch({ type: 'update-proyecto-form', value: input })
                console.log(input);
            }}
        />
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.sinopsis, state.detalles_adicionales])

    const locacion_proyecto = useMemo(() => {
        return <LocacionProyecto
            state={state}
            onFormChange={(input: { [key: string]: unknown }) => {
                dispatch({ type: 'update-proyecto-form', value: input })
                console.log(input);
            }}
        />
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.id_estado_republica])

    const publicar_proyecto = useMemo(() => {
        return <PublicarProyecto
            state={state}
            onFormChange={(input: { [key: string]: unknown }) => {
                dispatch({ type: 'update-proyecto-form', value: input })
                console.log(input);
            }}
        />
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.compartir_nombre])

    console.log({ state });

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

                            {informacion_general}
                            <br />

                            {contacto_casting}
                            <br />

                            {equipo_creativo}
                            <br />

                            {detalles_adicionales}
                            <br />

                            {locacion_proyecto}
                            <br />

                            {publicar_proyecto}

                            <div className="row mt-lg-4">
                                <div className="col d-flex justify-content-center" >
                                    <div className="mr-3">
                                        <button
                                            onClick={() => { handleSave('back') }}
                                            className="btn btn-intro btn-price btn_out_line mb-2"
                                            type="button"
                                        >
                                            <Typography>Guardar y terminar después</Typography>
                                        </button>
                                    </div>
                                    <div>
                                        <button
                                            onClick={() => { handleSave('roles') }}
                                            className="btn btn-intro btn-price mb-2"
                                            type="submit"
                                        >
                                            <Typography>
                                                Guardar proyecto y agregar rol
                                            </Typography>
                                        </button>
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