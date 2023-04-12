import { useRouter } from 'next/router'
import { useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { type NextPage } from 'next'
import Head from 'next/head'
import { motion } from 'framer-motion'
import { Alert, Grid, Typography } from '@mui/material'
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
import { NewRol } from '~/server/api/routers/roles';
import { conversorFecha } from '~/utils/conversor-fecha';
import { MContainer } from '~/components/layout/MContainer'

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
        se_pagara_sueldo: 'No',
        se_otorgaran_compensaciones: 'No',
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
        case 'reset': {
            return initialState;
        }
        default:
            return { ...state }
    }
}

const AgregarRolPage: NextPage = () => {

    const router = useRouter()

    const [on_save_action, setOnSaveAction] = useState<'redirect-to-proyectos' | 'reset-form' | null>(null);
    const [state, dispatch] = useReducer(reducerRol, initialState);
    const { notify } = useNotify();

    useEffect(() => {
        const id_proyecto = router.query['id-proyecto'];
        const id_rol = router.query['id-rol'];
        dispatch({ type: 'update-form', value: { id_proyecto: (id_proyecto) ? parseInt(id_proyecto as string) : 0, id_rol: (id_rol) ? parseInt(id_rol as string) : 0 } })
    }, [router.query]);

    const rol = api.roles.getCompleteById.useQuery(state.id_rol, {
        refetchOnWindowFocus: false
    })

    useEffect(() => {
        if (rol.data) {
            const compensaciones = rol.data.compensaciones;
            const sueldo = (compensaciones) ? compensaciones.sueldo : null;
            const compensaciones_no_monetarias = (compensaciones) ? compensaciones.compensaciones_no_monetarias : [];
            const otra_compensacion = compensaciones_no_monetarias.filter(c => c.id_compensacion === 99)[0];
            const filtros_demo = rol.data.filtros_demograficos;
            const animal = (filtros_demo) ? filtros_demo.animal : null;

            const fecha_requisitos = (rol.data.requisitos) ? conversorFecha(rol.data.requisitos.presentacion_solicitud) : '';

            dispatch({
                type: 'update-form', value: {
                    informacion_general: {
                        nombre: rol.data.nombre,
                        id_tipo_rol: rol.data.id_tipo_rol,
                        id_proyecto: rol.data.id_proyecto,
                        rol_principal_secundario: (rol.data.tipo_rol.tipo.toUpperCase() === 'PRINCIPAL') ? 'Principal' : 'Extra'
                    },
                    compensacion: {
                        compensacion: {
                            datos_adicionales: (compensaciones) ? compensaciones.datos_adicionales : '',
                            suma_total_compensaciones_no_monetarias: (compensaciones) ? compensaciones.suma_total_compensaciones_no_monetarias : 0
                        },
                        sueldo: {
                            cantidad_sueldo: (sueldo) ? sueldo.cantidad : 0,
                            periodo_sueldo: (sueldo) ? `${sueldo.periodo.substring(0, 1)}${sueldo.periodo.substring(1, sueldo.periodo.length).toLowerCase()}` : 'Diario'
                        },
                        compensaciones_no_monetarias: compensaciones_no_monetarias.map(c => {
                            return {
                                id_compensacion: c.id_compensacion,
                                descripcion_compensacion: c.descripcion_compensacion
                            }
                        }),

                        //extras para el formulario
                        se_pagara_sueldo: (rol.data.compensaciones?.sueldo) ? 'Sí' : 'No',
                        se_otorgaran_compensaciones: (compensaciones_no_monetarias.length > 0) ? 'Sí' : 'No',
                        descripcion_otra_compensacion: (otra_compensacion) ? otra_compensacion.descripcion_compensacion : ''
                    },
                    filtros_demograficos: {
                        generos: (filtros_demo) ? filtros_demo.generos.map(g => g.id_genero) : [],
                        apariencias_etnias: (filtros_demo) ? filtros_demo.aparencias_etnicas.map(a => a.id_aparencia_etnica) : [],
                        animal: {
                            id: (animal) ? animal.id_animal : 0,
                            descripcion: (animal) ? animal.descripcion : '',
                            tamanio: (animal) ? animal.tamanio : ''
                        },
                        rango_edad_inicio: (filtros_demo) ? filtros_demo.rango_edad_inicio : 1,
                        rango_edad_fin: (filtros_demo) ? filtros_demo.rango_edad_fin : 18,
                        rango_edad_en_meses: (filtros_demo) ? filtros_demo.rango_edad_en_meses : false,
                        id_pais: (filtros_demo) ? filtros_demo.id_pais : 0,

                        //extras
                        genero_del_rol: (filtros_demo && filtros_demo.generos.length > 0) ? 'Género especificado' : 'No especificado',
                        apariencia_etnica_del_rol: (filtros_demo && filtros_demo.aparencias_etnicas.length > 0) ? 'Especificado' : 'No especificado',
                        es_mascota: animal != null,
                    },
                    descripcion_rol: {
                        tiene_nsfw: (rol.data && rol.data.nsfw) ? 'Desnudos/Situaciones Sexuales' : 'No hay desnudos y/o situaciones sexuales',
                        descripcion: (rol.data) ? rol.data.descripcion : '',
                        detalles_adicionales: (rol.data) ? rol.data.detalles_adicionales : '',
                        habilidades: (rol.data && rol.data.habilidades) ? rol.data.habilidades.habilidades_seleccionadas.map(h => h.id_habilidad) : [],
                        especificacion_habilidad: (rol.data && rol.data.habilidades) ? rol.data.habilidades.especificacion : '',
                        nsfw: {
                            ids: (rol.data && rol.data.nsfw) ? rol.data.nsfw.nsfw_seleccionados.map(n => n.id_nsfw) : [],
                            descripcion: (rol.data && rol.data.nsfw) ? rol.data.nsfw.descripcion : ''
                        }
                    },
                    castings: {
                        id_estado_republica: (rol.data.casting && rol.data.casting.length > 0) ? rol.data.casting[0]?.id_estado_republica : 0,
                        tipo_fecha_selected: 'Rango de fechas',
                        fechas: (rol.data.casting) ? rol.data.casting.map(c => {
                            return {
                                inicio: c.fecha_inicio,
                                fin: c.fecha_fin
                            };
                        }) : []
                    },
                    filmaciones: {
                        id_estado_republica: (rol.data.filmaciones && rol.data.filmaciones.length > 0) ? rol.data.filmaciones[0]?.id_estado_republica : 0,
                        tipo_fecha_selected: 'Rango de fechas',
                        fechas: (rol.data.filmaciones) ? rol.data.filmaciones.map(c => {
                            return {
                                inicio: c.fecha_inicio,
                                fin: c.fecha_fin
                            };
                        }) : []
                    },
                    requisitos: {
                        fecha_presentacion: (rol.data.requisitos) ? fecha_requisitos : '',
                        id_uso_horario: (rol.data.requisitos) ? rol.data.requisitos.id_uso_horario : 0,
                        info_trabajo: (rol.data.requisitos) ? rol.data.requisitos.informacion : '',
                        id_idioma: (rol.data.requisitos) ? rol.data.requisitos.id_idioma : 0,
                        medios_multimedia_a_incluir: (rol.data.requisitos) ? rol.data.requisitos.medios_multimedia.map(m => m.id_medio_multimedia) : [],
                        id_estado_donde_aceptan_solicitudes: (rol.data.requisitos) ? rol.data.requisitos.id_estado_republica : 0
                    },
                }
            })
        }
    }, [rol.data]);

    const form_validate = useMemo(() => {
        const form: {data: NewRol, complete: boolean, error: null | string} = {
            data: {
                id_rol: state.id_rol,
                info_gral: {
                    nombre: '', 
                    id_tipo_rol: 0,
                    id_proyecto: 0,
                },
                compensaciones: {
                    compensacion: {
                        datos_adicionales: '',
                    }
                },
                filtros_demograficos: {
                    rango_edad_inicio: 0,
                    rango_edad_fin: 0,
                    rango_edad_en_meses: false,
                    id_pais: 0
                },
                descripcion_rol: {
                    descripcion: '',
                    habilidades: [],
                    especificacion_habilidad: '',
                },
                casting: {
                    id_estado_republica: 0,
                    fechas: []
                },
                filmaciones: {
                    id_estado_republica: 0,
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
                    indicaciones: '',
                    pedir_selftape: false,
                }
            },
            complete: false,
            error: null
        }
        if (!state.informacion_general.nombre || state.informacion_general.nombre.length < 2) {
            return { ...form, error: 'El nombre del rol es invalido' };
        }
        if (state.informacion_general.id_tipo_rol < 1) {
            return { ...form, error: 'El tipo del rol es invalido' };
        }
        form.data.info_gral = {
            nombre: state.informacion_general.nombre,
            id_tipo_rol: state.informacion_general.id_tipo_rol,
            id_proyecto: state.id_proyecto
        }

        if (state.compensacion.se_pagara_sueldo === 'Sí') {
            if (state.compensacion.sueldo && state.compensacion.sueldo.cantidad_sueldo <= 0) {
                return { ...form, error: 'El sueldo no puede ser menor o igual a 0' };
            }

            form.data.compensaciones = {
                ...form.data.compensaciones,
                sueldo: {
                    cantidad_sueldo: (state.compensacion.sueldo) ? parseFloat(`${state.compensacion.sueldo.cantidad_sueldo}`) : 0,
                    periodo_sueldo: (state.compensacion.sueldo) ? state.compensacion.sueldo.periodo_sueldo : ''
                }
            }
        }

        if (state.compensacion.se_otorgaran_compensaciones === 'Sí') {
            if (state.compensacion.compensaciones_no_monetarias && state.compensacion.compensaciones_no_monetarias.length === 0) {
                return { ...form, error: 'Debes seleccionar al menos una compensacion' };
            }

            form.data.compensaciones = {
                ...form.data.compensaciones, 
                compensaciones_no_monetarias: state.compensacion.compensaciones_no_monetarias
            }
        }
        form.data.compensaciones = {
            ...form.data.compensaciones,
            compensacion: {
                datos_adicionales: state.compensacion.compensacion.datos_adicionales,
                suma_total_compensaciones_no_monetarias: (state.compensacion.compensacion.suma_total_compensaciones_no_monetarias) ? parseFloat(state.compensacion.compensacion.suma_total_compensaciones_no_monetarias.toString()) : 0
            },
        }

        if (state.filtros_demograficos.genero_del_rol === 'Género especificado') {
            if (state.filtros_demograficos.generos.length === 0) {
                return {...form, filtros_demograficos: undefined, error: 'Debes seleccionar al menos un genero'};
            }
            form.data.filtros_demograficos = {
                ...form.data.filtros_demograficos,
                generos: state.filtros_demograficos.generos
            }
        }

        if (state.filtros_demograficos.apariencia_etnica_del_rol === 'Especificado') {
            if (state.filtros_demograficos.generos.length === 0) {
                return { ...form, error: 'Debes seleccionar al menos una etnia' };
            }

            form.data.filtros_demograficos = {
                ...form.data.filtros_demograficos,
                apariencias_etnias: state.filtros_demograficos.apariencias_etnias
            }
        }

        if (state.filtros_demograficos.es_mascota) {
            if (state.filtros_demograficos.animal) {
                if (state.filtros_demograficos.animal.id <= 0 || (state.filtros_demograficos.animal && state.filtros_demograficos.animal.tamanio.length === 0)) {
                    return {...form, error: 'No se especifico un animal valido'};
                }
            } else {
                return { ...form, error: 'No se especifico un animal valido' };
            }
            
            form.data.filtros_demograficos = {
                ...form.data.filtros_demograficos,
                animal: state.filtros_demograficos.animal
            }
        }

        if (state.filtros_demograficos.id_pais <= 0) {
            return { ...form, error: 'No se especifico la nacionalidad del rol' };
        }

        form.data.filtros_demograficos = {
            ...form.data.filtros_demograficos,
            rango_edad_inicio: state.filtros_demograficos.rango_edad_inicio,
            rango_edad_fin: state.filtros_demograficos.rango_edad_fin,
            rango_edad_en_meses: state.filtros_demograficos.rango_edad_en_meses,
            id_pais: state.filtros_demograficos.id_pais
        }

        if (state.descripcion_rol.descripcion.length <= 0) {
            return { ...form, error: 'No se especifico la descripcion del rol' };
        }

        form.data.descripcion_rol = {
            ...form.data.descripcion_rol,
            descripcion: state.descripcion_rol.descripcion,
            detalles_adicionales: (state.descripcion_rol.detalles_adicionales.length > 0) ? state.descripcion_rol.detalles_adicionales : '',
            habilidades: state.descripcion_rol.habilidades,
            especificacion_habilidad: state.descripcion_rol.especificacion_habilidad,
        }

        if (state.descripcion_rol.tiene_nsfw === 'Desnudos/Situaciones Sexuales') {
            if (state.descripcion_rol.nsfw.ids.length === 0) {
                return { ...form, error: 'No se especifico ningun tipo de escena NSFW' };
            }
            if (state.descripcion_rol.nsfw.descripcion.length === 0) {
                return { ...form, error: 'No especificaste los detalles de las escenas NSFW' };
            }

            form.data.descripcion_rol = {
                ...form.data.descripcion_rol,
                nsfw: state.descripcion_rol.nsfw
            }
        }

        if (state.castings.fechas.length === 0) {
            return { ...form, error: 'No se especifico ninguna fecha para los castings del rol' };
        }

        if (state.castings.id_estado_republica <= 0) {
            return { ...form, error: 'No se especifico estado para los castings del rol' };
        }

        form.data.casting = {
            ...form.data.casting,
            id_estado_republica: state.castings.id_estado_republica,
            fechas: state.castings.fechas,
        }

        if (state.filmaciones.fechas.length === 0) {
            return { ...form, error: 'No se especifico ninguna fecha para las filmaciones del rol' };
        }

        if (state.filmaciones.id_estado_republica <= 0) {
            return { ...form, error: 'No se especifico estado para las filmaciones del rol' };
        }

        form.data.filmaciones = {
            ...form.data.filmaciones,
            id_estado_republica: state.filmaciones.id_estado_republica,
            fechas: state.filmaciones.fechas,
        }

        if (state.requisitos.fecha_presentacion === '') {
            return { ...form, error: 'No se especifico la fecha de presentacion de solicitudes del rol' };
        }

        if (state.requisitos.info_trabajo.length === 0) {
            return { ...form, error: 'No se especifico la informacion del trabajo del rol' };
        }

        if (state.requisitos.medios_multimedia_a_incluir.length === 0) {
            return { ...form, error: 'No se especifico ningun medio multimedia del rol' };
        }

        if (state.requisitos.id_uso_horario <= 0) {
            return { ...form, error: 'No se especifico el uso de horario del rol' };
        }

        if (state.requisitos.id_idioma <= 0) {
            return { ...form, error: 'No se especifico el idioma del rol' };
        }

        if (state.requisitos.id_estado_donde_aceptan_solicitudes <= 0) {
            return { ...form, error: 'No se especifico estado donde aceptar las solicitudes' };
        }

        form.data.requisitos = {
            fecha_presentacion: state.requisitos.fecha_presentacion,
            id_uso_horario: state.requisitos.id_uso_horario,
            info_trabajo: state.requisitos.info_trabajo,
            id_idioma: state.requisitos.id_idioma,
            medios_multimedia_a_incluir: state.requisitos.medios_multimedia_a_incluir,
            id_estado_donde_aceptan_solicitudes: state.requisitos.id_estado_donde_aceptan_solicitudes
        }

        form.data.selftape = {
            ...form.data.selftape,
            indicaciones: state.selftape.indicaciones,
            pedir_selftape: state.selftape.pedir_selftape,
        }
        form.complete = (state.informacion_general.nombre.length > 1 && state.informacion_general.id_tipo_rol > 0 &&
            state.filtros_demograficos.rango_edad_inicio > 0 && state.filtros_demograficos.rango_edad_fin > 0 && state.filtros_demograficos.id_pais > 0 &&
            state.descripcion_rol.descripcion.length > 0 && state.castings.id_estado_republica > 0 && state.castings.fechas.length > 0 &&
            state.filmaciones.id_estado_republica > 0 && state.filmaciones.fechas.length > 0 && state.requisitos.fecha_presentacion !== '' &&
            state.requisitos.id_uso_horario > 0 && state.requisitos.id_idioma > 0 && state.requisitos.medios_multimedia_a_incluir.length > 0 &&
            state.requisitos.id_estado_donde_aceptan_solicitudes > 0 && state.requisitos.info_trabajo.length > 0);
        return form;
    }, [state]);

    const saveRol = api.roles.saveRol.useMutation({
        onSuccess(input) {
            if (on_save_action) {
                switch (on_save_action) {
                    case 'redirect-to-proyectos': {
                        void router.push('/cazatalentos/dashboard')
                        break;
                    }
                    case 'reset-form': {
                        dispatch({type: 'reset', value: {}});
                        window.scroll({
                            top: 0, 
                            left: 0, 
                            behavior: 'smooth'
                        });
                        break;
                    }
                }
            }
            notify('success', 'Se guardo el rol con exito');
        },
        onError: (error) => {
            notify('error', parseErrorBody(error.message));
        }
    });


    const info_gral = useMemo(() => {
        return <InformacionGeneralRol
            state={state.informacion_general}
            onFormChange={(input) => {
                dispatch({ type: 'update-info-gral', value: input });
            }}
        />
    }, [state.informacion_general]);

    const compensacion = useMemo(() => {
        return <CompensacionRol
            state={state.compensacion}
            onFormChange={(input) => {
                dispatch({ type: 'update-compensacion', value: input });
            }}
        />
    }, [state.compensacion]);

    const filtros_demograficos = useMemo(() => {
        return <FiltrosDemograficosRol
            state={state.filtros_demograficos}
            onFormChange={(input) => {
                dispatch({ type: 'update-filtros-demograficos', value: input });
            }}
        />
    }, [state.filtros_demograficos]);

    const descripcion_rol = useMemo(() => {
        return <DescripcionDelRol
            state={state.descripcion_rol}
            onFormChange={(input) => {
                dispatch({ type: 'update-descripcion-rol', value: input });
            }}
        />
    }, [state.descripcion_rol]);

    const info_casting = useMemo(() => {
        return <InformacionCastingRol
            state={state.castings}
            onFormChange={(input) => {
                dispatch({ type: 'update-castings-rol', value: input });
            }}
        />
    }, [state.castings]);

    const info_filmaciones = useMemo(() => {
        return <InformacionFilmacionRol
            state={state.filmaciones}
            onFormChange={(input) => {
                dispatch({ type: 'update-filmaciones-rol', value: input });
            }}
        />
    }, [state.filmaciones]);

    const requisitos = useMemo(() => {
        return <RequisitosRol
            state={state.requisitos}
            onFormChange={(input) => {
                console.log(input);
                dispatch({ type: 'update-requisitos-rol', value: input });
            }}
        />
    }, [state.requisitos]);

    const selftape = useMemo(() => {
        return <SelfTapeRol
            state={state.selftape}
            onFormChange={(input) => {
                dispatch({ type: 'update-selftape-rol', value: input });
            }}
        />
    }, [state.selftape]);

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
                            {info_gral}
                            {compensacion}
                            {filtros_demograficos}
                            {descripcion_rol}
                            {info_casting}
                            {info_filmaciones}
                            {requisitos}
                            {selftape}
                            <div className="row mt-lg-4">
                                {!form_validate.complete &&
                                    <MContainer direction='vertical' styles={{width: '100%', alignContent: 'center'}}>
                                        <Alert  icon={false} severity='warning'>
                                    
                                            <Typography style={{textAlign: 'center', width: 'inherit'}}>Por favor llena los campos obligatorios * </Typography>
                                        </Alert>
                                    </MContainer>
                                }
                                
                                <div className="col d-flex justify-content-center" >
                                    <div className="mr-3">
                                        {form_validate.complete &&
                                            <button
                                                onClick={() => {
                                                    console.log(form_validate.data);
                                                    if (state.informacion_general.nombre.length > 1 && state.informacion_general.id_tipo_rol > 0) {
                                                        if (!form_validate.error) {
                                                            setOnSaveAction('redirect-to-proyectos');
                                                            saveRol.mutate(form_validate.data);
                                                        } else {
                                                            notify('warning', form_validate.error);
                                                        }
                                                    } else {
                                                        notify('warning', 'Por favor ingresa el nombre y tipo de rol antes de intentar guardar los cambios');
                                                    }
                                                }}
                                                className="btn btn-intro btn-price btn_out_line mb-2"
                                                type="button"
                                            >
                                                <Typography>{`${form_validate.complete ? 'Guardar e ir a proyectos' : 'Por favor llena los campos'}`} </Typography>
                                            </button>
                                        }
                                    </div>
                                    {form_validate.complete &&
                                        <div>
                                            <button
                                                onClick={() => {
                                                    if (state.informacion_general.nombre.length > 1 && state.informacion_general.id_tipo_rol > 0) {
                                                        setOnSaveAction('reset-form');
                                                        saveRol.mutate(form_validate.data);
                                                    } else {
                                                        notify('warning', 'Por favor ingresa el nombre y tipo de rol antes de intentar guardar los cambios');
                                                    }
                                                }}
                                                className="btn btn-intro btn-price btn_out_line mb-2"
                                                type="button"
                                            >
                                                <Typography>Guardar {`${form_validate.complete ? '' : 'borrador'}`} y crear otro rol</Typography>
                                            </button>
                                        </div>
                                    }
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