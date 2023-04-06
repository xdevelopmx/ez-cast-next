import { useRouter } from 'next/router'
import { useEffect, useMemo, useReducer } from 'react'
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
    nombre: string,
    id_tipo_rol: number,
    id_proyecto: number,
    rol_principal_secundario: string
}

export type RolCompensacionForm = {
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
    descripcion_otra_compensacion: string,
}

export type FiltrosDemograficosRolForm = {
    generos: number[],
    apariencias_etnias: number[],
    animal?: {
        id: number,
        descripcion: string,
        tamanio: string
    },
    rango_edad_inicio: number,
    rango_edad_fin: number,
    rango_edad_en_meses: boolean,
    id_pais: number,

    //extras
    genero_del_rol: 'No especificado' | 'Género especificado',
    apariencia_etnica_del_rol: 'No especificado' | 'Especificado',
    es_mascota: boolean,
}

export type DescripcionDelRolForm = {
    tiene_nsfw: 'Desnudos/Situaciones Sexuales' | 'No hay desnudos y/o situaciones sexuales',
    descripcion: string,
    detalles_adicionales: string,
    habilidades: number[],
    especificacion_habilidad: string,
    nsfw: {
        ids: number[],
        descripcion: string
    },
    lineas?: {
        base64: string,
        extension: string
    },
    foto_referencia?: {
        base64: string,
        extension: string
    }
}

export type CastingsRolForm = {
    id_estado_republica: number,
    tipo_fecha_selected: 'Rango de fechas' | 'Individuales',
    fechas: { inicio: Date, fin?: Date }[]
}

export type FilmacionesRolForm = {
    id_estado_republica: number,
    tipo_fecha_selected: 'Rango de fechas' | 'Individuales',
    fechas: { inicio: Date, fin?: Date }[]
}

export type RequisitosRolForm = {
    fecha_presentacion: string,
    id_uso_horario: number,
    info_trabajo: string,
    id_idioma: number,
    medios_multimedia_a_incluir: number[],
    id_estado_donde_aceptan_solicitudes: number,
}

export type SelftapeRolForm = {
    pedir_selftape: boolean,
    indicaciones: string,
    lineas?: {
        base64: string,
        extension: string
    }
}

export type RolForm = {
    id_rol: number,
    id_proyecto: number,
    informacion_general: RolInformacionGeneralForm,
    compensacion: RolCompensacionForm,
    filtros_demograficos: FiltrosDemograficosRolForm,
    descripcion_rol: DescripcionDelRolForm,
    castings: CastingsRolForm,
    filmaciones: FilmacionesRolForm,
    requisitos: RequisitosRolForm,
    selftape: SelftapeRolForm
}

const initialState: RolForm = {
    id_rol: 0,
    id_proyecto: 0,
    informacion_general: {
        nombre: '',
        id_tipo_rol: 0,
        id_proyecto: 0,
        rol_principal_secundario: 'Principal'
    },
    compensacion: {
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
        descripcion_otra_compensacion: ''
    },
    filtros_demograficos: {
        generos: [],
        apariencias_etnias: [],
        rango_edad_inicio: 1,
        rango_edad_fin: 18,
        rango_edad_en_meses: false,
        id_pais: 0,

        //extras
        genero_del_rol: 'No especificado',
        apariencia_etnica_del_rol: 'No especificado',
        es_mascota: false
    },
    descripcion_rol: {
        tiene_nsfw: 'No hay desnudos y/o situaciones sexuales',
        descripcion: '',
        detalles_adicionales: '',
        habilidades: [],
        especificacion_habilidad: '',
        nsfw: {
            ids: [],
            descripcion: ''
        }
    },
    castings: {
        id_estado_republica: 0,
        tipo_fecha_selected: 'Rango de fechas',
        fechas: []
    },
    filmaciones: {
        id_estado_republica: 0,
        tipo_fecha_selected: 'Rango de fechas',
        fechas: []
    },
    requisitos: {
        fecha_presentacion: '',
        id_uso_horario: 0,
        info_trabajo: '',
        id_idioma: 0,
        medios_multimedia_a_incluir: [],
        id_estado_donde_aceptan_solicitudes: 0
    },
    selftape: {
        pedir_selftape: false,
        indicaciones: '',
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
        case 'update-filtros-demograficos': {
            return { ...state, filtros_demograficos: { ...state.filtros_demograficos, ...action.value } } as RolForm;
        }
        case 'update-descripcion-rol': {
            return { ...state, descripcion_rol: { ...state.descripcion_rol, ...action.value } } as RolForm;
        }
        case 'update-castings-rol': {
            return { ...state, castings: { ...state.castings, ...action.value } } as RolForm;
        }
        case 'update-filmaciones-rol': {
            return { ...state, filmaciones: { ...state.filmaciones, ...action.value } } as RolForm;
        }
        case 'update-requisitos-rol': {
            return { ...state, requisitos: { ...state.requisitos, ...action.value } } as RolForm;
        }
        case 'update-selftape-rol': {
            return { ...state, selftape: { ...state.selftape, ...action.value } } as RolForm;
        }
        default:
            return { ...state }
    }
}

const AgregarRolPage: NextPage = () => {

    const router = useRouter()
    
    
    const [state, dispatch] = useReducer(reducerRol, initialState)
    
    const { notify } = useNotify();
    
    useEffect(() => {
        const id_proyecto = router.query['id-proyecto'];
        const id_rol = router.query['id-rol'];
        dispatch({ type: 'update-form', value: {id_proyecto: (id_proyecto) ? parseInt(id_proyecto as string) : 0, id_rol: (id_rol) ? parseInt(id_rol as string) : 0}})
    }, [router.query]);

    /* console.log({ query: router.query }); */

    //const updatesIDs = (id: number) => {
    //    dispatch({ type: 'update-info-gral', value: { id_rol: id } })
    //    dispatch({ type: 'update-compensacion', value: { id_rol: id } })
    //}

    const saveInfoGral = api.roles.saveInfoGral.useMutation({
        onSuccess(input) {
            notify('success', 'Se guardo la informacion general con exito');
            dispatch({ type: 'update-form', value: { id_rol: input.id }})
        },
        onError: (error) => {
            notify('error', parseErrorBody(error.message));
        }
    });

    const saveCompensacion = api.roles.saveCompensacion.useMutation({
        onSuccess(input) {
            notify('success', 'Se guardo la compensación con exito');
        },
        onError: (error) => {
            notify('error', parseErrorBody(error.message));
        }
    });

    const saveFiltroDemografico = api.roles.saveFiltrosDemograficos.useMutation({
        onSuccess(input) {
            notify('success', 'Se guardaron los filtros demografios con exito');
        },
        onError: (error) => {
            notify('error', parseErrorBody(error.message));
        }
    });

    const saveDescripcionRol = api.roles.saveDescripcionRol.useMutation({
        onSuccess(input) {
            notify('success', 'Se guardo la descripcion del rol con exito');
        },
        onError: (error) => {
            notify('error', parseErrorBody(error.message));
        }
    });

    const saveCastingsYFilmacionesRol = api.roles.saveInfoCastingYFilmacion.useMutation({
        onSuccess(input, data) {
            if (data.action === 'casting') {
                notify('success', 'Se actualizaron las fechas de castings del rol con exito');
            } else {
                notify('success', 'Se actualizaron las fechas de filmaciones del rol con exito');
            }
        },
        onError: (error) => {
            notify('error', parseErrorBody(error.message));
        }
    });

    const saveSeltapeRol = api.roles.saveSelftapeRol.useMutation({
        onSuccess(input) {
            notify('success', 'Se guardo el selftape del rol con exito');
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
                                state={state.informacion_general}
                                onFormChange={(input) => {
                                    dispatch({ type: 'update-info-gral', value: input });
                                }}
                                onSaveChanges={() => {
                                    saveInfoGral.mutate({
                                        id_rol: state.id_rol,
                                        nombre: state.informacion_general.nombre,
                                        id_tipo_rol: state.informacion_general.id_tipo_rol,
                                        id_proyecto: state.id_proyecto
                                    })
                                }}
                            />
                            <CompensacionRol
                                state={state.compensacion}
                                onFormChange={(input) => {
                                    dispatch({ type: 'update-compensacion', value: input });
                                }}
                                onSaveChanges={() => {
                                    saveCompensacion.mutate({
                                        id_rol: state.id_rol,
                                        compensacion: state.compensacion.compensacion,
                                        compensaciones_no_monetarias: state.compensacion.compensaciones_no_monetarias,
                                        sueldo: state.compensacion.sueldo
                                    })
                                }}
                            />
                            <FiltrosDemograficosRol
                                state={state.filtros_demograficos}
                                onFormChange={(input) => {
                                    dispatch({ type: 'update-filtros-demograficos', value: input });
                                }}
                                onSaveChanges={() => {
                                    if (state.filtros_demograficos.rango_edad_inicio > 0 && state.filtros_demograficos.rango_edad_fin < 110 && state.filtros_demograficos.id_pais > 0) {
                                        saveFiltroDemografico.mutate({
                                            id_rol: state.id_rol,
                                            generos: (state.filtros_demograficos.generos.length > 0) ? state.filtros_demograficos.generos : null,
                                            apariencias_etnias: (state.filtros_demograficos.apariencias_etnias.length > 0) ? state.filtros_demograficos.apariencias_etnias : null,
                                            animal: state.filtros_demograficos.animal,
                                            rango_edad_inicio: state.filtros_demograficos.rango_edad_inicio,
                                            rango_edad_fin: state.filtros_demograficos.rango_edad_fin,
                                            rango_edad_en_meses: state.filtros_demograficos.rango_edad_en_meses,
                                            id_pais: state.filtros_demograficos.id_pais
                                        })
                                    } else {
                                        notify('warning', 'Por favor ingresa datos validos');
                                    }
                                }}
                            />
                            <DescripcionDelRol 
                                state={state.descripcion_rol}
                                onFormChange={(input) => {
                                    dispatch({ type: 'update-descripcion-rol', value: input });
                                }}
                                onSaveChanges={() => {
                                    if (state.descripcion_rol.habilidades.length > 0) {
                                        saveDescripcionRol.mutate({
                                            id_rol: state.id_rol,
                                            descripcion: state.descripcion_rol.descripcion,
                                            detalles_adicionales: (state.descripcion_rol.detalles_adicionales.length > 0) ? state.descripcion_rol.detalles_adicionales : null,
                                            habilidades: state.descripcion_rol.habilidades,
                                            especificacion_habilidad: state.descripcion_rol.especificacion_habilidad,
                                            nsfw: (state.descripcion_rol.nsfw.ids.length > 0) ? state.descripcion_rol.nsfw : null,
                                        })
                                    } else {
                                        notify('warning', 'Por favor ingresa al menos una habilidad');
                                    }
                                }}
                            />
                            <InformacionCastingRol 
                                state={state.castings}
                                onFormChange={(input) => {
                                    dispatch({ type: 'update-castings-rol', value: input });
                                }}
                                onSaveChanges={() => {
                                    if (state.castings.fechas.length > 0) {
                                        saveCastingsYFilmacionesRol.mutate({
                                            id_rol: state.id_rol,
                                            id_estado_republica: state.castings.id_estado_republica,
                                            fechas: state.castings.fechas,
                                            action: 'casting'
                                        })
                                    } else {
                                        notify('warning', 'Por favor ingresa al menos una fecha para castings');
                                    }
                                }}
                            />
                            <InformacionFilmacionRol 
                                state={state.filmaciones}
                                onFormChange={(input) => {
                                    dispatch({ type: 'update-filmaciones-rol', value: input });
                                }}
                                onSaveChanges={() => {
                                    if (state.filmaciones.fechas.length > 0) {
                                        saveCastingsYFilmacionesRol.mutate({
                                            id_rol: state.id_rol,
                                            id_estado_republica: state.filmaciones.id_estado_republica,
                                            fechas: state.filmaciones.fechas,
                                            action: 'filmaciones'
                                        })
                                    } else {
                                        notify('warning', 'Por favor ingresa al menos una fecha para filmaciones');
                                    }
                                }}
                            />
                            <RequisitosRol 
                                state={state.requisitos}
                                onFormChange={(input) => {
                                    console.log(input);
                                    dispatch({ type: 'update-requisitos-rol', value: input });
                                }}
                                onSaveChanges={() => {
                                    if (state.descripcion_rol.habilidades.length > 0) {
                                        saveDescripcionRol.mutate({
                                            id_rol: state.id_rol,
                                            descripcion: state.descripcion_rol.descripcion,
                                            detalles_adicionales: (state.descripcion_rol.detalles_adicionales.length > 0) ? state.descripcion_rol.detalles_adicionales : null,
                                            habilidades: state.descripcion_rol.habilidades,
                                            especificacion_habilidad: state.descripcion_rol.especificacion_habilidad,
                                            nsfw: (state.descripcion_rol.nsfw.ids.length > 0) ? state.descripcion_rol.nsfw : null,
                                        })
                                    } else {
                                        notify('warning', 'Por favor ingresa al menos una habilidad');
                                    }
                                }}
                            />
                            <SelfTapeRol 
                                state={state.selftape}
                                onFormChange={(input) => {
                                    dispatch({ type: 'update-selftape-rol', value: input });
                                }}
                                onSaveChanges={() => {
                                    saveSeltapeRol.mutate({
                                        id_rol: state.id_rol,
                                        indicaciones: state.selftape.indicaciones,
                                        pedir_selftape: state.selftape.pedir_selftape,
                                        lineas: null
                                    })
                                    
                                }}
                            />

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