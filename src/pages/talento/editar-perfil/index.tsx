import { type NextPage } from "next";
import Head from "next/head";

import { MainLayout } from "~/components";
import { MStepper } from "~/components/shared/MStepper";
import { useEffect, useMemo, useReducer } from "react";
import { EditarActivosTalento, EditarCreditosTalento, EditarFiltrosAparenciasTalento, EditarInfoBasicaTalento, EditarMediaTalento, EditarPreferenciaRolYCompensacionTalento } from "~/components/talento";
import { NewMedia, type Archivo } from "~/server/api/root";
import EditarHabilidadesTalento from "~/components/talento/forms/editar-habilidades";
import { getSession } from "next-auth/react";
import { type GetServerSideProps } from "next/types";
import { api, parseErrorBody } from "~/utils/api";
import { Typography } from "@mui/material";
import { type User } from 'next-auth';
import useNotify from "~/hooks/useNotify";
import { MTooltip } from "~/components/shared/MTooltip";
import { useRouter } from "next/router";
import { FileManagerFront } from "~/utils/file-manager-front";
import { TalentosRouter } from "~/server/api/routers/talentos";
import { CreditoTalento, Media } from "@prisma/client";

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
            carta_responsiva?: string,
            cv?: string,
        }
    },
    redes_sociales: { [nombre: string]: string }
}

export type TalentoFormMedios = {
    fotos: Archivo[],
    fotos_order: string,
    videos: Archivo[],
    audios: Archivo[],
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
        id_clip_media?: number,
        clip?: File,
        touched?: boolean,
        media?: Media
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
            urls: {}
        }
    },
    medios: {
        fotos: [],
        videos: [],
        audios: [],
        fotos_order: '',
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

    console.log('TALENTO DATA', talento.data);

    const saveInfoGralMedia = api.talentos.saveInfoGralMedia.useMutation({
        onSuccess(input) {
            saveInfoGral.mutate({
                ...state.info_gral,
                redes_sociales: Array.from(Object.entries(state.info_gral.redes_sociales)).map((e) => { return { nombre: e[0], url: e[1] } }),
                media: input
            });
        },
        onError: (error) => {
            notify('error', parseErrorBody(error.message));
        }
    })

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

    const handleInfoGral = async () => {
        const urls: {cv: string | null, carta: string | null} = { cv: null, carta: null };
        const to_be_saved: {path: string, name: string, file: File, base64: string}[] = [];
        if (state.info_gral.files.cv) {
            to_be_saved.push({path: `talentos/${user.id}/cv`, name: `cv`, file: state.info_gral.files.cv.file, base64: state.info_gral.files.cv.base64});
        }
        if (state.info_gral.files.carta_responsiva) {
            to_be_saved.push({path: `talentos/${user.id}/carta-responsiva`, name: 'carta', file: state.info_gral.files.carta_responsiva.file, base64: state.info_gral.files.carta_responsiva.base64});
        }
        if (to_be_saved.length > 0) {
            const urls_saved = await FileManagerFront.saveFiles(to_be_saved);
            if (urls_saved) {
                urls_saved.forEach((u) => {
                    console.log('jiji', u);
                    if (u['cv']) {
                        console.log('jeje', u);
                        urls.cv = u['cv'].url;
                    }
                    if (u['carta']) {
                        console.log('juju', u);
                        urls.carta = u['carta'].url;
                    }
                })
            }
        }
        saveInfoGralMedia.mutate({
            cv_url: state.info_gral.files.urls.cv,
            cv: (!state.info_gral.files.cv || !urls.cv) ? null : {
                nombre: 'cv',
                type: state.info_gral.files.cv.file.type,
                url: urls.cv,
                clave: `talentos/${user.id}/cv/cv`,
                referencia: `talento-info-gral`,
                identificador: `talento-cv`
            },
            carta_responsiva_url: state.info_gral.files.urls.carta_responsiva,
            carta_responsiva: (!state.info_gral.files.carta_responsiva || !urls.carta) ? null : {
                nombre: 'carta',
                type: state.info_gral.files.carta_responsiva.file.type,
                url: urls.carta,
                clave: `talentos/${user.id}/carta-responsiva/carta`,
                referencia: `talento-info-gral`,
                identificador: `talento-carta-responsiva`
            },
        })
    }

    const initMediaFiles = async (foto_perfil: Media | undefined, fotos: Media[], audios: Media[], videos: Media[]) => {
        const fotos_talento: Archivo[] = [];
        if (foto_perfil) {
            const foto_file = await FileManagerFront.convertUrlToFile(foto_perfil.url, foto_perfil.nombre, foto_perfil.type);
            const foto_file_base_64 = await FileManagerFront.convertFileToBase64(foto_file);
            fotos_talento.push({
                id: foto_perfil.id,
                base64: foto_file_base_64,
                name: foto_perfil.nombre,
                file: foto_file,
                url: foto_perfil.url
            })
        }
        const fotos_perfil = await Promise.all(fotos.map(async (f) => {
            const f_file = await FileManagerFront.convertUrlToFile(f.url, f.nombre, f.type);
            const f_file_base_64 = await FileManagerFront.convertFileToBase64(f_file);
            return {
                id: f.id,
                base64: f_file_base_64,
                name: f.nombre,
                file: f_file,
                url: f.url
            }
        }));
        const audios_perfil = await Promise.all(audios.map(async (f) => {
            const f_file = await FileManagerFront.convertUrlToFile(f.url, f.nombre, f.type);
            const f_file_base_64 = await FileManagerFront.convertFileToBase64(f_file);
            return {
                id: f.id,
                base64: f_file_base_64,
                name: f.nombre,
                file: f_file,
                url: f.url
            }
        }));
        const videos_perfil = await Promise.all(videos.map(async (f) => {
            const f_file = await FileManagerFront.convertUrlToFile(f.url, f.nombre, f.type);
            const f_file_base_64 = await FileManagerFront.convertFileToBase64(f_file);
            return {
                id: f.id,
                base64: f_file_base_64,
                name: f.nombre,
                file: f_file,
                url: f.url
            }
        }));
        dispatch({ type: 'update-medios', value: {
            ...state.medios,
            fotos: fotos_talento.concat(fotos_perfil),
            fotos_order: fotos_talento.concat(fotos_perfil).map(f => f.id).join('-'),
            audios: audios_perfil,
            videos: videos_perfil
        }})
    }
    const initCreditosFiles = async (mostrar_anio_perfil: boolean, creditos: (CreditoTalento & {media: Media | null})[]) => {
        const creditos_with_file = await Promise.all(creditos.map(async (credito) => {
            if (credito.media) {
                const file = await FileManagerFront.convertUrlToFile(credito.media.url, credito.media.nombre, credito.media.type);
                return {
                    ...credito,
                    clip: file,
                    touched: false
                }
            }
            return {...credito, touched: false};
        }));
        
        dispatch({ type: 'update-creditos', value: {mostrar_anio_en_perfil: mostrar_anio_perfil, creditos: creditos_with_file}})
        
    }
    const handleMedia = async () => {
        const media: {fotos: NewMedia[] | null, videos: NewMedia[] | null, audios: NewMedia[] | null } = { fotos: [], videos: [], audios: [] };
        const fotos_changed_order = state.medios.fotos.map(f => f.id).join('-') !== state.medios.fotos_order;
        const no_fotos_added = state.medios.fotos.filter(v => v.url != null).length === state.medios.fotos.length;
        if ((fotos_changed_order || !no_fotos_added) && state.medios.fotos.length > 0) {
            const urls_saved = await FileManagerFront.saveFiles(state.medios.fotos.map((f) => {
                return {path: `talentos/${user.id}/fotos-perfil`, name: `${f.name}`, file: f.file, base64: f.base64}
            }));
            if (urls_saved.length > 0) {
                urls_saved.forEach((res, j) => {
                    Object.entries(res).forEach((e) => {
                        const url = e[1].url;  
                        const type = state.medios.fotos[j]?.file.type;
                        const id = state.medios.fotos[j]?.id;
                        const original_name = state.medios.fotos[j]?.file.name;
                        if (url) {
                            if (media.fotos) {
                                media.fotos.push({
                                    id: (id) ? id : 0,
                                    nombre: e[0],
                                    type: (type) ? type : '',
                                    url: (url) ? url : '',
                                    clave: `talentos/${user.id}/fotos-perfil/${e[0]}`,
                                    referencia: `FOTOS-PERFIL-TALENTO-${user.id}`,
                                    identificador: `foto-${(j === 0) ? 'perfil' : j.toString()}-talento-${user.id}`
                                })
                            }
                        } else {
                            notify('error', `${(original_name) ? `La imagen ${original_name} no se pudo subir` : 'Una imagen no se pudo subir'}`);
                        }
                    })
                });
            }
        }
        if (state.medios.fotos.length === 0) {
            media.fotos = null;
        }
        
        if (state.medios.videos.filter(v => v.url != null).length !== state.medios.videos.length && state.medios.videos.length > 0) {
            const urls_saved = await FileManagerFront.saveFiles(state.medios.videos.filter(f => (f.id == null)).map((f, i) => {
                return {path: `talentos/${user.id}/videos`, name: `${f.name}`, file: f.file, base64: f.base64}
            }));
            if (urls_saved.length > 0) {
                urls_saved.forEach((res, j) => {
                    Object.entries(res).forEach((e, i) => {
                        const url = e[1].url;  
                        const type = state.medios.videos[j]?.file.type;
                        const id = state.medios.videos[j]?.id;
                        const original_name = state.medios.videos[j]?.file.name;
                        if (url) {
                            if (media.videos) {
                                media.videos.push({
                                    id: (id) ? id : 0,
                                    nombre: e[0],
                                    type: (type) ? type : '',
                                    url: (url) ? url : '',
                                    clave: `talentos/${user.id}/videos/${e[0]}`,
                                    referencia: `VIDEOS-TALENTO-${user.id}`,
                                    identificador: `video-${j + 1}`
                                })  
                            }
                        } else {
                            notify('error', `${(original_name) ? `El video ${original_name} no se pudo subir` : 'Un video no se pudo subir'}`);
                        }
                    })
                });
            }
        }

        if (state.medios.videos.length === 0) {
            media.videos = null;
        }

        if (state.medios.audios.filter(v => v.url != null).length !== state.medios.audios.length && state.medios.audios.length > 0) {
            const urls_saved = await FileManagerFront.saveFiles(state.medios.audios.filter(f => (f.id == null)).map((f, i) => {
                return {path: `talentos/${user.id}/audios`, name: `${f.name}`, file: f.file, base64: f.base64}
            }));
            if (urls_saved.length > 0) {
                urls_saved.forEach((res, j) => {
                    Object.entries(res).forEach((e) => {
                        const url = e[1].url;  
                        const type = state.medios.audios[j]?.file.type;
                        const id = state.medios.audios[j]?.id;
                        const original_name = state.medios.audios[j]?.file.name;
                        if (url) {
                            if (media.audios) {
                                media.audios.push({
                                    id: (id) ? id : 0,
                                    nombre: e[0],
                                    type: (type) ? type : '',
                                    url: (url) ? url : '',
                                    clave: `talentos/${user.id}/audios/${e[0]}`,
                                    referencia: `AUDIOS-TALENTO-${user.id}`,
                                    identificador: `audio-${j + 1}`
                                })  
                            }
                        } else {
                            notify('error', `${(original_name) ? `El audio ${original_name} no se pudo subir` : 'Un audio no se pudo subir'}`);
                        }
                    })
                });
            }
        }

        if (state.medios.audios.length === 0) {
            media.audios = null;
        }

        saveMedios.mutate({
            fotos: media.fotos,
            videos: media.videos,
            audios: media.audios
        })
    }

    const handleCreditos = async () => {
        
        const creditos = await Promise.all(state.creditos.creditos.map(async (credito, i) => {
            if (credito.clip && credito.touched) {
                const base_64 = await FileManagerFront.convertFileToBase64(credito.clip);
                const urls_saved = await FileManagerFront.saveFiles([{path: `talentos/${user.id}/creditos`, name: `${(credito.clip.name.includes('clip') ? '' : 'clip-')}${credito.clip.name}`, file: credito.clip, base64: base_64}]);
                const type = credito.clip.type;
                const id = credito.id_clip_media;
                const original_name = credito.clip.name;
                
                if (urls_saved.length > 0) {
                    urls_saved.forEach((res, j) => {
                        Object.entries(res).forEach((e) => {
                            const url = e[1].url;  
                            if (url) {
                                credito.media = {
                                    id: (id) ? id : 0,
                                    nombre: e[0],
                                    type: (type) ? type : '',
                                    url: (url) ? url : '',
                                    clave: `talentos/${user.id}/creditos/${e[0]}`,
                                    referencia: `CREDITOS-TALENTO-${user.id}`,
                                    identificador: `${(original_name.includes('clip') ? '' : 'clip-')}${original_name}`
                                }
                            } else {
                                notify('error', `${(original_name) ? `El credito ${original_name} no se pudo subir` : 'Un credito no se pudo subir'}`);
                            }
                        })
                    });
                }
            }
            return {...credito};
        }))
        saveCreditos.mutate({
            mostrar_anio_en_perfil: state.creditos.mostrar_anio_en_perfil,
            creditos: creditos
        });
    }

    useEffect(() => {
        if (talento.data) {
            const redes_sociales: { [nombre: string]: string } = {};
            if (talento.data && talento.data.redes_sociales) {
                talento.data.redes_sociales.forEach(red => {
                    redes_sociales[red.nombre] = red.url;
                })
            }
            console.log(talento.data, 'talento data');
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
                                carta_responsiva: talento.data.representante?.media?.url,
                                cv: talento.data.info_basica.media?.url,
                            }
                        },
                    }
                });
            }

            if (talento.data.media) {
                const foto_perfil = talento.data.media.filter(m => m.media.nombre === 'foto-perfil')[0];
                const fotos = talento.data.media.filter(m => m.media.type.includes('image') && m.media.nombre !== 'foto-perfil').map(a => a.media);
                const audios = talento.data.media.filter(m => m.media.type.includes('audio')).map(a => a.media);
                const videos = talento.data.media.filter(m => m.media.type.includes('video')).map(a => a.media);
                void initMediaFiles((foto_perfil) ? foto_perfil.media : undefined, fotos, audios, videos);
            }

            if (talento.data.creditos) {
                void initCreditosFiles(talento.data.creditos.mostrar_anio_perfil, talento.data.creditos.creditos);
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
    }, [state.info_gral, talento.isFetching])

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
                                    void handleInfoGral();
                                    break;
                                }

                                case 2: {
                                    void handleMedia();
                                    break;
                                }

                                case 3: {
                                    void handleCreditos();
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