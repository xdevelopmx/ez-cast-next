import { type NextPage } from "next";
import Head from "next/head";

import { MainLayout } from "~/components";
import { MStepper } from "~/components/shared/MStepper";
import { useEffect, useMemo, useReducer } from "react";
import { EditarActivosTalento, EditarCreditosTalento, EditarFiltrosAparenciasTalento, EditarInfoBasicaTalento, EditarMediaTalento, EditarPreferenciaRolYCompensacionTalento } from "~/components/talento";
import { type Archivo } from "~/server/api/root";
import EditarHabilidadesTalento from "~/components/talento/forms/editar-habilidades";
import { getSession } from "next-auth/react";
import { type GetServerSideProps } from "next/types";
import { api, parseErrorBody } from "~/utils/api";
import { Typography } from "@mui/material";
import { type User } from 'next-auth';
import useNotify from "~/hooks/useNotify";
import { MTooltip } from "~/components/shared/MTooltip";
import { useRouter } from "next/router";

export type TalentoFormInfoGral = {
    nombre: string,
    union: {
        id: number,
        descripcion: string
    },
    id_estado_republica: number,
    edad: number,
    es_menor_de_edad: string,
    peso: number,
    altura: number,
    biografia: string,
    representante?: {
        nombre: string,
        email: string,
        agencia: string,
        telefono: string
    },
    files: {
        carta_responsiva?: Archivo,
        cv?: Archivo,
        urls: {
            carta_responsiva: string | null,
            cv: string | null,
        }
    },
    redes_sociales: { [nombre: string]: string }
}

export type TalentoFormMedios = {
    fotos: Archivo[],
    videos: Archivo[],
    audios: Archivo[]
}

export type TalentoFormCreditos = {
    mostrar_anio_en_perfil: boolean,
    tipo_proyecto: number,
    titulo: string,
    rol: string,
    director: string,
    anio: number,
    creditos: {
        id: number,
        id_catalogo_proyecto: number,
        titulo: string,
        rol: string,
        director: string,
        anio: number,
        destacado: boolean,
        clip_url: string
    }[]
}

export type TalentoFormHabilidades = {
    habilidades_seleccionadas: Map<number, number[]>
}

export type TalentoFormActivos = {
    has_vehiculos: boolean,
    has_mascotas: boolean,
    has_vestuario: boolean,
    has_props: boolean,
    has_equipo_deportivo: boolean,
    vehiculo: {
        tipo: string,
        id_tipo_vehiculo: number,
        marca: string,
        modelo: string,
        color: string,
        anio: number
    },
    vehiculos: {
        tipo: string,
        id_tipo_vehiculo: number,
        marca: string,
        modelo: string,
        color: string,
        anio: number
    }[] | null,
    mascota: {
        tipo: string,
        id_tipo_mascota: number,
        tipo_raza: string,
        id_raza: number,
        tamanio: string
    },
    mascotas: {
        tipo: string,
        id_tipo_mascota: number,
        tipo_raza: string,
        id_raza: number,
        tamanio: string
    }[] | null,
    vestuario: {
        tipo: string,
        id_tipo: number,
        tipo_especifico: string,
        id_tipo_vestuario_especifico: number,
        descripcion: string
    },
    vestuarios: {
        tipo: string,
        id_tipo: number,
        tipo_especifico: string,
        id_tipo_vestuario_especifico: number,
        descripcion: string
    }[] | null,
    prop: {
        tipo: string,
        id_tipo_props: number,
        descripcion: string
    },
    props: {
        tipo: string,
        id_tipo_props: number,
        descripcion: string
    }[] | null,
    equipo_deportivo: {
        tipo: string,
        id_tipo_equipo_deportivo: number,
        descripcion: string
    },
    equipos_deportivos: {
        tipo: string,
        id_tipo_equipo_deportivo: number,
        descripcion: string
    }[] | null
}

type documento = {
    id_documento: number;
    descripcion: string;
}

type locacion = {
    es_principal: boolean,
    id_estado_republica: number,
}

export type TalentoFormPreferencias = {

    preferencias: {
        interesado_en_trabajos_de_extra: boolean,
        nombre_agente: string,
        contacto_agente: string,
        meses_embarazo: number,
    },

    tipo_trabajo: number[],
    interes_en_proyectos: number[],
    id_estado_principal: number,
    locaciones: locacion[],

    documentos: documento[],

    disponibilidad: number[],
    otras_profesiones: string[],
}

export type FiltrosAparienciaForm = {
    has_tatoos: boolean,
    id_tipo_tatuaje: number,
    descripcion_tatoo: string,
    has_piercings: boolean,
    id_tipo_piercing: number,
    descripcion_piercing: string,
    has_hermanos: boolean,
    tipo_hermano_selected: string,
    descripcion_otra_particularidad?: string,
    apariencia: {
        rango_inicial_edad: number,
        rango_final_edad: number,
        id_genero: number,
        id_apariencia_etnica: number,
        id_color_cabello: number,
        disposicion_cambio_color_cabello: boolean,
        id_estilo_cabello: number,
        disposicion_corte_cabello: boolean,
        id_vello_facial: number,
        disposicion_afeitar_o_crecer_vello_facial: boolean,
        id_color_ojos: number
    },
    generos_interesado_en_interpretar: number[],
    tatuajes: {
        id_tipo_tatuaje: number,
        descripcion: string
    }[],
    piercings: {
        id_tipo_piercing: number,
        descripcion: string
    }[],
    hermanos?: {
        id_tipo_hermanos: number,
        descripcion: string
    },
    particularidades: {
        id_particularidad: number,
        descripcion: string
    }[]
}

type TalentoForm = {
    info_gral: TalentoFormInfoGral,
    medios: TalentoFormMedios,
    creditos: TalentoFormCreditos,
    habilidades: TalentoFormHabilidades,
    activos: TalentoFormActivos,
    preferencias: TalentoFormPreferencias,
    filtros_apariencia: FiltrosAparienciaForm,
    step_active: number,
}


const initialState: TalentoForm = {
    step_active: 1,
    info_gral: {
        nombre: '',
        union: {
            id: 0,
            descripcion: '',
        },
        id_estado_republica: 0,
        es_menor_de_edad: 'No',
        edad: 18,
        peso: 75,
        altura: 170,
        biografia: '',
        redes_sociales: {},
        files: {
            urls: {
                cv: null,
                carta_responsiva: null
            }
        }
    },
    medios: {
        fotos: [],
        videos: [],
        audios: []
    },
    creditos: {
        mostrar_anio_en_perfil: false,
        tipo_proyecto: 0,
        titulo: '',
        rol: 'PRINCIPAL',
        director: '',
        anio: new Date().getFullYear(),
        creditos: []
    },
    habilidades: {
        habilidades_seleccionadas: new Map()
    },
    activos: {
        has_vehiculos: false,
        has_mascotas: false,
        has_vestuario: false,
        has_props: false,
        has_equipo_deportivo: false,
        vehiculo: {
            tipo: '',
            id_tipo_vehiculo: 0,
            marca: '',
            modelo: '',
            color: '',
            anio: new Date().getFullYear()
        },
        vehiculos: null,
        mascota: {
            tipo: '',
            id_raza: 0,
            id_tipo_mascota: 0,
            tipo_raza: '',
            tamanio: 'Chico'
        },
        mascotas: null,
        vestuario: {
            id_tipo: 0,
            id_tipo_vestuario_especifico: 0,
            tipo: '',
            tipo_especifico: '',
            descripcion: ''
        },
        vestuarios: null,
        prop: {
            id_tipo_props: 0,
            tipo: '',
            descripcion: ''
        },
        props: null,
        equipo_deportivo: {
            id_tipo_equipo_deportivo: 0,
            tipo: '',
            descripcion: ''
        },
        equipos_deportivos: null
    },
    preferencias: {
        preferencias: {
            interesado_en_trabajos_de_extra: false,
            nombre_agente: '',
            contacto_agente: '',
            meses_embarazo: 0
        },
        tipo_trabajo: [],
        interes_en_proyectos: [],
        documentos: [],
        locaciones: [],
        id_estado_principal: 0,
        disponibilidad: [],
        otras_profesiones: [],
    },
    filtros_apariencia: {
        has_tatoos: false,
        id_tipo_tatuaje: 0,
        descripcion_tatoo: '',
        has_piercings: false,
        id_tipo_piercing: 0,
        descripcion_piercing: '',
        has_hermanos: false,
        tipo_hermano_selected: '',
        apariencia: {
            rango_inicial_edad: 18,
            rango_final_edad: 50,
            id_genero: 0,
            id_apariencia_etnica: 0,
            id_color_cabello: 0,
            disposicion_cambio_color_cabello: false,
            id_estilo_cabello: 0,
            disposicion_corte_cabello: false,
            id_vello_facial: 0,
            disposicion_afeitar_o_crecer_vello_facial: false,
            id_color_ojos: 0
        },
        generos_interesado_en_interpretar: [],
        tatuajes: [],
        piercings: [],
        particularidades: []
    }
}

function reducer(state: TalentoForm, action: { type: string, value: { [key: string]: unknown } }) {
    switch (action.type) {
        case 'update-form': {
            return { ...state, ...action.value }
        }
        case 'update-info-gral': {
            return { ...state, info_gral: { ...state.info_gral, ...action.value } } as TalentoForm;
        }
        case 'update-medios': {
            return { ...state, medios: { ...state.medios, ...action.value } } as TalentoForm;
        }
        case 'update-creditos': {
            return { ...state, creditos: { ...state.creditos, ...action.value } } as TalentoForm;
        }
        case 'update-habilidades': {
            return { ...state, habilidades: { ...state.habilidades, ...action.value } } as TalentoForm;
        }
        case 'update-activos': {
            return { ...state, activos: { ...state.activos, ...action.value } } as TalentoForm;
        }
        case 'update-preferencia-rol': {
            return { ...state, preferencias: { ...state.preferencias, ...action.value } } as TalentoForm;
        }
        case 'update-filtros-apariencia': {
            return { ...state, filtros_apariencia: { ...state.filtros_apariencia, ...action.value } } as TalentoForm;
        }
    }
    return { ...state };
}

type EditarTalentoPageProps = {
    user: User,
    step: number
}

const EditarTalentoPage: NextPage<EditarTalentoPageProps> = ({ user, step }) => {
    const router = useRouter();
    const [state, dispatch] = useReducer(reducer, { ...initialState, step_active: (router.query['step']) ? parseInt(router.query['step'] as string) : 1 });
    const { notify } = useNotify();

    const talento = api.talentos.getCompleteById.useQuery({ id: parseInt(user.id) }, {
        refetchOnMount: false,
        refetchOnWindowFocus: false
    });

    const saveInfoGral = api.talentos.saveInfoGral.useMutation({
        onSuccess(input) {
            notify('success', 'Se guardo la informacion general con exito');
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            talento.refetch();
        },
        onError: (error) => {
            notify('error', parseErrorBody(error.message));
        }
    });

    const saveMedios = api.talentos.saveMedios.useMutation({
        onSuccess(input) {
            notify('success', 'Se guardaron los archivos con exito');
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            talento.refetch();
        },
        onError: (error) => {
            notify('error', parseErrorBody(error.message));
        }
    });

    const saveCreditos = api.talentos.saveCreditos.useMutation({
        onSuccess(input) {
            notify('success', 'Se guardo los creditos con exito');
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            talento.refetch();
        },
        onError: (error) => {
            notify('error', parseErrorBody(error.message));
        }
    });

    const saveHabilidades = api.talentos.saveHabilidades.useMutation({
        onSuccess(input) {
            notify('success', 'Se guardaron las habilidades con exito');
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            talento.refetch();
        },
        onError: (error) => {
            notify('error', parseErrorBody(error.message));
        }
    });

    const saveActivos = api.talentos.saveActivos.useMutation({
        onSuccess(input) {
            notify('success', 'Se guardaron los activos con exito');
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            talento.refetch();
        },
        onError: (error) => {
            notify('error', parseErrorBody(error.message));
        }
    });

    const savePreferencias = api.talentos.savePreferencias.useMutation({
        onSuccess(input) {
            notify('success', 'Se guardaron las preferencias con exito');
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            talento.refetch();
        },
        onError: (error) => {
            notify('error', parseErrorBody(error.message));
        }
    });

    const saveFiltrosApariencias = api.talentos.saveFiltrosApariencias.useMutation({
        onSuccess(input) {
            notify('success', 'Se guardaron los filtros de apariencias con exito');
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            talento.refetch();
        },
        onError: (error) => {
            notify('error', parseErrorBody(error.message));
        }
    });

    useEffect(() => {
        if (talento.data) {
            const redes_sociales: { [nombre: string]: string } = {};
            if (talento.data && talento.data.redes_sociales) {
                talento.data.redes_sociales.forEach(red => {
                    redes_sociales[red.nombre] = red.url;
                })
            }
            if (talento.data.info_basica) {

                dispatch({
                    type: 'update-info-gral', value: {
                        nombre: talento.data.nombre,
                        union: {
                            id: talento.data.info_basica.union?.id_union,
                            descripcion: talento.data.info_basica.union?.descripcion
                        },
                        id_estado_republica: talento.data.info_basica.id_estado_republica,
                        edad: talento.data.info_basica.edad,
                        es_menor_de_edad: (talento.data.info_basica.edad >= 18) ? 'No' : 'Sí',
                        peso: talento.data.info_basica.peso,
                        altura: talento.data.info_basica.altura,
                        biografia: talento.data.info_basica.biografia,
                        representante: (!talento.data.representante) ? null : {
                            nombre: talento.data.representante.nombre,
                            email: talento.data.representante.email,
                            agencia: talento.data.representante.agencia,
                            telefono: talento.data.representante.telefono
                        },
                        redes_sociales: redes_sociales,
                        files: {
                            carta_responsiva: null,
                            cv: null,
                            urls: {
                                carta_responsiva: (!talento.data.representante?.url_carta_responsiva) ? null : talento.data.representante.url_carta_responsiva,
                                cv: (!talento.data.info_basica.url_cv) ? null : talento.data.info_basica.url_cv,
                            }
                        },
                    }
                });
            }

            if (talento.data.creditos) {
                dispatch({
                    type: 'update-creditos', value: {
                        mostrar_anio_en_perfil: talento.data.creditos.mostrar_anio_perfil,
                        creditos: (talento.data.creditos.creditos) ? talento.data.creditos.creditos : []
                    }
                })
            }

            const habilidades = new Map<number, number[]>();

            if (talento.data && talento.data.habilidades) {
                talento.data.habilidades.forEach(habilidad => {
                    if (habilidades.has(habilidad.id_habilidad)) {
                        const habilidades_especificas = habilidades.get(habilidad.id_habilidad);
                        if (habilidades_especificas) {
                            habilidades_especificas.push(habilidad.id_habilidad_especifica);
                            habilidades.set(habilidad.id_habilidad, habilidades_especificas);
                        }
                    } else {
                        habilidades.set(habilidad.id_habilidad, [habilidad.id_habilidad_especifica]);
                    }
                })
            }

            dispatch({
                type: 'update-habilidades', value: {
                    habilidades_seleccionadas: habilidades
                }
            })

            if (talento.data && talento.data.activos) {

                dispatch({
                    type: 'update-activos', value: {
                        vehiculos: (talento.data.activos.vehiculos) ? talento.data.activos.vehiculos.map(vehiculo => {
                            return {
                                tipo: vehiculo.tipo_vehiculo?.es, id_tipo_vehiculo: vehiculo.id_tipo_vehiculo,
                                marca: vehiculo.marca, modelo: vehiculo.modelo, color: vehiculo.color, anio: vehiculo.anio
                            }
                        }) : [],
                        mascotas: (talento.data.activos.mascotas) ? talento.data.activos.mascotas.map(mascota => {
                            return {
                                tipo: mascota.tipo_mascota?.es, id_tipo_mascota: mascota.tipo_mascota?.id, tipo_raza: mascota.raza_mascota?.es,
                                id_raza: mascota.id_raza, tamanio: mascota.tamanio
                            }
                        }) : [],
                        vestuarios: (talento.data.activos.vestuario) ? talento.data.activos.vestuario.map(vestuario => {
                            return {
                                tipo: vestuario.tipo_vestuario_especifico?.tipo_vestuario.es, id_tipo: vestuario.tipo_vestuario_especifico?.id_tipo_vestuario,
                                tipo_especifico: vestuario.tipo_vestuario_especifico?.es, id_tipo_vestuario_especifico: vestuario.id_tipo_vestuario_especifico,
                                descripcion: vestuario.descripcion
                            }
                        }) : [],
                        props: (talento.data.activos.props) ? talento.data.activos.props.map(prop => {
                            return { tipo: prop.tipo_props?.es, id_tipo_props: prop.id_tipo_props, descripcion: prop.descripcion }
                        }) : [],
                        equipos_deportivos: (talento.data.activos.equipo_deportivo) ? talento.data.activos.equipo_deportivo.map(ed => {
                            return { tipo: ed.tipo_equipo_deportivo?.es, id_tipo_equipo_deportivo: ed.id_tipo_equipo_deportivo, descripcion: ed.descripcion }
                        }) : [],
                    }
                })
            } else {
                dispatch({
                    type: 'update-activos', value: {
                        vehiculos: [],
                        mascotas: [],
                        vestuarios: [],
                        props: [],
                        equipos_deportivos: [],
                    }
                })
            }

            if (talento.data && talento.data.preferencias) {
                const preferencias = talento.data.preferencias;
                const id_estado_principal = preferencias.locaciones.filter(l => l.es_principal)[0];
                dispatch({
                    type: 'update-preferencia-rol',
                    value: {
                        preferencias: {
                            interesado_en_trabajos_de_extra: preferencias.interesado_en_trabajos_de_extra || false,
                            nombre_agente: preferencias.nombre_agente || '',
                            contacto_agente: preferencias.contacto_agente || '',
                            meses_embarazo: preferencias.meses_embarazo || 0
                        },
                        tipo_trabajo: preferencias.tipos_de_trabajo.map(tipo => tipo.id_tipo_de_trabajo),
                        interes_en_proyectos: preferencias.interes_en_proyectos.map(interes => interes.id_interes_en_proyecto),
                        documentos: preferencias.documentos.map(documento => ({
                            id_documento: documento.id_documento,
                            descripcion: documento.descripcion
                        })),
                        id_estado_principal: (id_estado_principal) ? id_estado_principal.id_estado_republica : 0,
                        locaciones: preferencias.locaciones.map(locacion => ({
                            es_principal: locacion.es_principal,
                            id_estado_republica: locacion.id_estado_republica,
                        })),
                        disponibilidad: preferencias.disponibilidades.map(disponibilidad => disponibilidad.id_disponibilidad),
                        otras_profesiones: preferencias.otras_profesiones.map(profesion => profesion.descripcion),
                    }
                })
            }

            if (talento.data && talento.data.filtros_aparencias) {
                const hermanos_option_default = (talento.data.filtros_aparencias.hermanos) ? (talento.data.filtros_aparencias.hermanos.id_tipo_hermanos === 99) ? 'Otro' : talento.data.filtros_aparencias.hermanos.descripcion : '';
                let field_other_particularidad = '';
                if (talento.data.filtros_aparencias.particularidades.some(e => e.id_particularidad === 99)) {
                    const particularidad_filtered = talento.data.filtros_aparencias.particularidades.filter(e => e.id_particularidad === 99)[0];
                    if (particularidad_filtered) {
                        field_other_particularidad = particularidad_filtered.descripcion;
                    }
                }
                dispatch({
                    type: 'update-filtros-apariencia', value: {
                        has_tatoos: talento.data.filtros_aparencias.tatuajes.length > 0,
                        id_tipo_tatuaje: 0,
                        descripcion_tatoo: '',
                        has_piercings: talento.data.filtros_aparencias.piercings.length > 0,
                        id_tipo_piercing: 0,
                        descripcion_piercing: '',
                        has_hermanos: (talento.data.filtros_aparencias.hermanos !== null),
                        descripcion_otra_particularidad: field_other_particularidad,
                        tipo_hermano_selected: hermanos_option_default,
                        apariencia: {
                            rango_inicial_edad: talento.data.filtros_aparencias.rango_inicial_edad,
                            rango_final_edad: talento.data.filtros_aparencias.rango_final_edad,
                            id_genero: talento.data.filtros_aparencias.id_genero,
                            id_apariencia_etnica: talento.data.filtros_aparencias.id_apariencia_etnica,
                            id_color_cabello: talento.data.filtros_aparencias.id_color_cabello,
                            disposicion_cambio_color_cabello: talento.data.filtros_aparencias.disposicion_cambio_color_cabello,
                            id_estilo_cabello: talento.data.filtros_aparencias.id_estilo_cabello,
                            disposicion_corte_cabello: talento.data.filtros_aparencias.disposicion_corte_cabello,
                            id_vello_facial: talento.data.filtros_aparencias.id_vello_facial,
                            disposicion_afeitar_o_crecer_vello_facial: talento.data.filtros_aparencias.disposicion_afeitar_o_crecer_vello_facial,
                            id_color_ojos: talento.data.filtros_aparencias.id_color_ojos
                        },
                        generos_interesado_en_interpretar: talento.data.filtros_aparencias.generos_interesados_en_interpretar.map(e => e.id_genero),
                        tatuajes: talento.data.filtros_aparencias.tatuajes,
                        piercings: talento.data.filtros_aparencias.piercings,
                        hermanos: (talento.data.filtros_aparencias.hermanos) ? { ...talento.data.filtros_aparencias.hermanos } : undefined,
                        particularidades: talento.data.filtros_aparencias.particularidades
                    }
                })
            }
        }
    }, [talento.data]);

    const editar_info_basica_talento = useMemo(() => {
        return <EditarInfoBasicaTalento
            state={state.info_gral}
            talento_fetching={talento.isFetching}
            onFormChange={(input) => {
                dispatch({ type: 'update-info-gral', value: input });
            }}
        />
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.info_gral])

    const editar_media_talento = useMemo(() => {
        return <EditarMediaTalento
            state={state.medios}
            onFormChange={(input) => {
                dispatch({ type: 'update-medios', value: input });
            }}
        />
    }, [state.medios])

    const editar_creditos_talento = useMemo(() => {
        return <EditarCreditosTalento
            state={state.creditos}
            onFormChange={(input) => {
                dispatch({ type: 'update-creditos', value: input });
            }}
        />
    }, [state.creditos])

    const editar_habilidades_talento = useMemo(() => {
        return <EditarHabilidadesTalento
            state={state.habilidades}
            onFormChange={(input) => {
                dispatch({ type: 'update-habilidades', value: input });
            }}
        />
    }, [state.habilidades])

    const editar_activos_talento = useMemo(() => {
        return <EditarActivosTalento
            state={state.activos}
            onFormChange={(input) => {
                dispatch({ type: 'update-activos', value: input });
            }}
        />
    }, [state.activos])

    const editar_preferencias_rol_y_compensacion_talento = useMemo(() => {
        return <EditarPreferenciaRolYCompensacionTalento
            state={state.preferencias}
            onFormChange={(input) => {
                dispatch({ type: 'update-preferencia-rol', value: input });
            }}
        />
    }, [state.preferencias])

    const editar_filtros_apariencias_talento = useMemo(() => {
        return <EditarFiltrosAparenciasTalento
            state={state.filtros_apariencia}
            onFormChange={(input) => {
                dispatch({ type: 'update-filtros-apariencia', value: input });
            }}
        />
    }, [state.filtros_apariencia])

    return (
        <>
            <Head>
                <title>DashBoard ~ Talentos | Talent Corner</title>
                <meta name="description" content="Talent Corner" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <MainLayout style={{ padding: 32, backgroundColor: '#f2f2f2', marginTop: 48, minHeight: '100vh' }} menuSiempreBlanco={true} >
                <div className={'RootContainer'} style={{ minHeight: ([1].includes(state.step_active)) ? 'calc(100vh - 76px)' : '100%' }}>
                    <MStepper
                        onStepChange={(step: number) => {
                            dispatch({ type: 'update-form', value: { step_active: step } });
                        }}
                        onFinish={() => {
                            saveFiltrosApariencias.mutate({
                                ...state.filtros_apariencia,
                                hermanos: {
                                    id_tipo_hermanos: (state.filtros_apariencia.hermanos) ? state.filtros_apariencia.hermanos.id_tipo_hermanos : 0,
                                    descripcion: (state.filtros_apariencia.hermanos && state.filtros_apariencia.hermanos.id_tipo_hermanos === 99) ? state.filtros_apariencia.hermanos.descripcion : state.filtros_apariencia.tipo_hermano_selected
                                }
                            });
                        }}
                        current_step={state.step_active}
                        onStepSave={(step: number) => {
                            switch (step) {
                                case 1: {
                                    const files: { urls: { cv: string | null, carta_responsiva: string | null }, cv: { base64: string, extension: string } | null, carta_responsiva: { base64: string, extension: string } | null } = {
                                        cv: null,
                                        carta_responsiva: null,
                                        urls: {
                                            cv: state.info_gral.files.urls.cv,
                                            carta_responsiva: state.info_gral.files.urls.carta_responsiva
                                        }
                                    }

                                    if (state.info_gral.files.cv) {
                                        const file_name_exploded = state.info_gral.files.cv.file.type.split('/');
                                        if (file_name_exploded[1]) {
                                            files.cv = {
                                                base64: state.info_gral.files.cv.base64,
                                                extension: file_name_exploded[1]
                                            }
                                        }
                                    }

                                    if (state.info_gral.files.carta_responsiva) {
                                        const file_name_exploded = state.info_gral.files.carta_responsiva.file.type.split('/');
                                        if (file_name_exploded[1]) {
                                            files.carta_responsiva = {
                                                base64: state.info_gral.files.carta_responsiva.base64,
                                                extension: file_name_exploded[1]
                                            }
                                        }
                                    }
                                    saveInfoGral.mutate({
                                        ...state.info_gral,
                                        redes_sociales: Array.from(Object.entries(state.info_gral.redes_sociales)).map((e) => { return { nombre: e[0], url: e[1] } }),
                                        files: { ...files }
                                    });
                                    break;
                                }

                                case 2: {
                                    saveMedios.mutate({
                                        fotos: state.medios.fotos.map((a, i) => { return { nombre: a.file.name, base64: a.base64, identificador: (i === 0) ? 'FOTO_PERFIL' : `FOTO_${i}` } }),
                                        audios: state.medios.audios.map((a, i) => { return { nombre: a.file.name, base64: a.base64, identificador: `AUDIO_${i}` } }),
                                        videos: state.medios.videos.map((a, i) => { return { nombre: a.file.name, base64: a.base64, identificador: `VIDEO_${i}` } })
                                    })

                                    break;
                                }

                                case 3: {
                                    saveCreditos.mutate({
                                        mostrar_anio_en_perfil: state.creditos.mostrar_anio_en_perfil,
                                        creditos: state.creditos.creditos
                                    });
                                    break;
                                }

                                case 4: {
                                    const ids: { id_habilidad_especifica: number, id_habilidad: number }[] = [];
                                    state.habilidades.habilidades_seleccionadas.forEach((value, key) => {
                                        value.forEach(id => {
                                            ids.push({ id_habilidad_especifica: id, id_habilidad: key });
                                        })
                                    });
                                    saveHabilidades.mutate({ ids_habilidades: ids });
                                    break;
                                }

                                case 5: {
                                    saveActivos.mutate({
                                        vehiculos: (state.activos.vehiculos) ? state.activos.vehiculos : [],
                                        mascotas: (state.activos.mascotas) ? state.activos.mascotas : [],
                                        vestuarios: (state.activos.vestuarios) ? state.activos.vestuarios : [],
                                        props: (state.activos.props) ? state.activos.props : [],
                                        equipos_deportivos: (state.activos.equipos_deportivos) ? state.activos.equipos_deportivos : []
                                    });
                                    break;
                                }
                                case 6: {
                                    savePreferencias.mutate({
                                        preferencias: state.preferencias.preferencias,
                                        tipos_trabajo: state.preferencias.tipo_trabajo,
                                        interes_en_proyectos: state.preferencias.interes_en_proyectos,
                                        locaciones: state.preferencias.locaciones,
                                        documentos: state.preferencias.documentos,
                                        disponibilidad: state.preferencias.disponibilidad,
                                        otras_profesiones: state.preferencias.otras_profesiones,
                                    })
                                    break;
                                }
                            }
                        }}
                        step_titles={{
                            1: 'Información básica',
                            2: 'Media',
                            3: 'Créditos',
                            4: 'Habilidades',
                            5: 'Activos',
                            6: 'Preferencia de rol y compensación',
                            7: 'Filtros de Apariencia'
                        }}
                        tooltips={{
                            4: <MTooltip
                                text='Incluye todas las habilidades que te diferencien de los demás. ¡Un Cazatalentos puede estar buscando un rol con tus habilidades!'
                                color='blue'
                                placement='right'
                            />,
                            5: <MTooltip
                                text={
                                    <>
                                        <Typography fontSize={14} fontWeight={600}>De tu casa al set</Typography>
                                        <Typography fontSize={14} fontWeight={400}>
                                            Suma al equipo de producción con los activos que cuentes,
                                            estos pueden ser muy beneficiosos y dar un giro a la producción
                                            como plus valía a tu talento, estos pueden ser vestuario, props,
                                            vehículos, etc...
                                        </Typography>
                                    </>
                                }
                                color='blue'
                                placement='right'
                            />,
                            6: <MTooltip
                                text='Un rol es un papel que una persona representa dentro de una historia, este personaje puede ser ficticio o real.'
                                color='blue'
                                placement='top'
                            />
                        }}
                    >

                        {editar_info_basica_talento}

                        {editar_media_talento}

                        {editar_creditos_talento}

                        {editar_habilidades_talento}

                        {editar_activos_talento}

                        {editar_preferencias_rol_y_compensacion_talento}

                        {editar_filtros_apariencias_talento}
                    </MStepper>
                </div>
            </MainLayout>
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);
    if (session && session.user) {
        const { step } = context.query;
        return {
            props: {
                user: session.user,
                step: (step) ? step : 1
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

export default EditarTalentoPage;