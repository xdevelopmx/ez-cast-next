import { type NextPage } from "next";
import Image from 'next/image';
import Head from "next/head";
import { motion } from 'framer-motion'
import classes from './editar-perfil.module.css';

import { Alertas, Destacados, Flotantes, ListadoProductos, MainLayout, MenuLateral } from "~/components";
import { MStepper } from "~/components/shared/MStepper";
import { useEffect, useReducer } from "react";
import { EditarActivosTalento, EditarCreditosTalento, EditarFiltrosAparenciasTalento, EditarInfoBasicaTalento, EditarMediaTalento, EditarPreferenciaRolYCompensacionTalento } from "~/components/talento";
import { Archivo } from "~/server/api/root";
import EditarHabilidadesTalento from "~/components/talento/forms/editar-habilidades";
import { getSession } from "next-auth/react";
import { GetServerSideProps } from "next/types";
import { api } from "~/utils/api";
import { Button } from "@mui/material";
import { User } from 'next-auth';
import useNotify from "~/hooks/useNotify";

export type TalentoFormInfoGral = {
    nombre: string,
    union: {
        id: number,
        descripcion: string
    },
    id_estado_republica: number,
    edad: number,
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
    }[],
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
    }[],
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
    }[],
    prop: {
        tipo: string,
        id_tipo_props: number,
        descripcion: string
    },
    props: {
        tipo: string,
        id_tipo_props: number,
        descripcion: string
    }[],
    equipo_deportivo: {
        tipo: string,
        id_tipo_equipo_deportivo: number,
        descripcion: string
    },
    equipos_deportivos: {
        tipo: string,
        id_tipo_equipo_deportivo: number,
        descripcion: string
    }[]
}

export type TalentoFormPreferencias = {
    tipo_trabajo: boolean[],
    locaciones: {
        principal: number;
        adicionales: number[];
    },
    interesado_trabajo_extra: string,
    interes_proyectos: boolean[],
    agencia_representante: {
        tiene_agencia_representante: string,
        nombre: string,
        contacto: string
    },
    documentos: boolean[],
    disponibilidad: boolean[],
    otras_profesiones: string,
    embarazo: {
        tiene_embarazo: string,
        meses: number
    }
}

type TalentoForm = {
    info_gral: TalentoFormInfoGral,
    medios: TalentoFormMedios,
    creditos: TalentoFormCreditos,
    habilidades: TalentoFormHabilidades,
    activos: TalentoFormActivos,
    preferencias: TalentoFormPreferencias,
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
        vehiculos: [],
        mascota: {
            tipo: '',
            id_raza: 0,
            id_tipo_mascota: 0,
            tipo_raza: '',
            tamanio: 'Chico'
        },
        mascotas: [],
        vestuario: {
            id_tipo: 0,
            id_tipo_vestuario_especifico: 0,
            tipo: '',
            tipo_especifico: '',
            descripcion: ''
        },
        vestuarios: [],
        prop: {
            id_tipo_props: 0,
            tipo: '',
            descripcion: ''
        },
        props: [],
        equipo_deportivo: {
            id_tipo_equipo_deportivo: 0,
            tipo: '',
            descripcion: ''
        },
        equipos_deportivos: []
    },
    preferencias: {
        tipo_trabajo: [false, false, false, false, false],
        locaciones: {
            principal: 0,
            adicionales: []
        },
        interesado_trabajo_extra: 'no',
        interes_proyectos: [false,false],
        agencia_representante: {
            tiene_agencia_representante: 'no',
            nombre: '',
            contacto: ''
        },
        documentos: [false,false,false,false,false,false],
        disponibilidad: [false,false,false,false,false,false,false,false,false,false,false,false],
        otras_profesiones: '',
        embarazo: {
            tiene_embarazo: 'no',
            meses: 0
        }
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
    }
    return { ...state };
}

type EditarTalentoPageProps = {
    user: User
}

const EditarTalentoPage: NextPage<EditarTalentoPageProps> = ({ user }) => {

    const [state, dispatch] = useReducer(reducer, initialState);

    const { notify } = useNotify();

    const talento = api.talentos.getById.useQuery({ id: parseInt(user.id) }, {
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
            notify('error', error.message);
        }
    });

    const saveMedios = api.talentos.saveMedios.useMutation({
		onSuccess(input) {
            notify('success', 'Se guardaron los archivos con exito');
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            talento.refetch();
		},
		onError: (error) => {
            console.log(error);
            notify('error', error.message);
		}
	});

    const saveCreditos = api.talentos.saveCreditos.useMutation({
        onSuccess(input) {
            notify('success', 'Se guardo los creditos con exito');
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            talento.refetch();
        },
        onError: (error) => {
            notify('error', error.message);
        }
    });

    const saveHabilidades = api.talentos.saveHabilidades.useMutation({
        onSuccess(input) {
            notify('success', 'Se guardaron las habilidades con exito');
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            talento.refetch();
        },
        onError: (error) => {
            notify('error', error.message);
        }
    });

    const saveActivos = api.talentos.saveActivos.useMutation({
        onSuccess(input) {
            notify('success', 'Se guardaron los activos con exito');
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            talento.refetch();
        },
        onError: (error) => {
            notify('error', error.message);
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
            }
        }
    }, [talento.data]);

    console.log('state', state)
    console.log('talento', talento)

    return (
        <>
            <Head>
                <title>DashBoard ~ Talentos | Talent Corner</title>
                <meta name="description" content="Talent Corner" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <MainLayout style={{ padding: 32, backgroundColor: '#f2f2f2', marginTop: 48, minHeight: '100vh' }} menuSiempreBlanco={true} >
                <div className={classes['RootContainer']} style={{ minHeight: ([1].includes(state.step_active)) ? 'calc(100vh - 76px)' : '100%' }}>
                    <MStepper
                        onStepChange={(step: number) => {
                            dispatch({ type: 'update-form', value: { step_active: step } });
                        }}
                        onFinish={() => {
                            //create_user.mutate({...state});
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
                                    console.log(state.medios);
                                    saveMedios.mutate({
                                        fotos: state.medios.fotos.map((a, i) => { return {nombre: a.file.name, base64: a.base64, identificador: (i === 0) ? 'FOTO_PERFIL' : `FOTO_${i}`}}),
                                        audios: state.medios.audios.map((a, i) => { return {nombre: a.file.name, base64: a.base64, identificador: `AUDIO_${i}`}}),
                                        videos: state.medios.videos.map((a, i) => { return {nombre: a.file.name, base64: a.base64, identificador: `VIDEO_${i}`}})
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
                                        vehiculos: state.activos.vehiculos,
                                        mascotas: state.activos.mascotas,
                                        vestuarios: state.activos.vestuarios,
                                        props: state.activos.props,
                                        equipos_deportivos: state.activos.equipos_deportivos
                                    });
                                    break;
                                }
                                case 6: {

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
                    >
                        
                       <EditarInfoBasicaTalento 
                            state={state.info_gral} 
                            onFormChange={(input) => {
                                dispatch({type: 'update-info-gral', value: input});
                            }} 
                        />
                        <EditarMediaTalento state={state.medios}
                            onFormChange={(input) => {
                                dispatch({ type: 'update-medios', value: input });
                            }} />
                        <EditarCreditosTalento state={state.creditos}
                            onFormChange={(input) => {
                                console.log(input);
                                dispatch({ type: 'update-creditos', value: input });
                            }} />
                        <EditarHabilidadesTalento state={state.habilidades}
                            onFormChange={(input) => {
                                console.log(input)
                                dispatch({ type: 'update-habilidades', value: input });
                            }} />
                        <EditarActivosTalento state={state.activos}
                            onFormChange={(input) => {
                                console.log(input);
                                dispatch({ type: 'update-activos', value: input });
                            }} />
                        <EditarPreferenciaRolYCompensacionTalento
                            state={state.preferencias}
                            onFormChange={(input) => {
                                console.log(input);
                                dispatch({ type: 'update-preferencia-rol', value: input });
                            }}
                        />
                        <EditarFiltrosAparenciasTalento state={{
                            nombre: '',
                            apellido: '',
                            usuario: 'string',
                            email: 'string',
                            contrasenia: 'string',
                            confirmacion_contrasenia: 'string'
                        }} onFormChange={() => { console.log('xd') }} />
                    </MStepper>
                </div>
            </MainLayout>
        </>
    );
};


export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);
    if (session && session.user) {
        return {
            props: {
                user: session.user
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