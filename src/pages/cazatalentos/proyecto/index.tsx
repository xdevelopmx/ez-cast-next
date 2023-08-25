import { type GetServerSideProps, type NextPage } from 'next'
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
import { FileManager } from '~/utils/file-manager'
import { type Archivo } from '~/server/api/root';
import { type Media } from '@prisma/client';
import { getSession } from 'next-auth/react'
import { TipoUsuario } from '~/enums'
import useLang from "~/hooks/useLang";
import AppContext from "~/context/app";
import { useContext } from "react";

export type ProyectoForm = {
    id: number,
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
        archivo?: Archivo,
        foto_portada?: Archivo,
        media: {
            archivo?: Media,
            foto_portada?: Media,
        },
        touched: {
            archivo: boolean,
            foto_portada: boolean,
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
    id: 0,
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
    errors: {},
    hasErrors: null,
    files: {
        media: {},
        touched: {
            archivo: false,
            foto_portada: false,
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
    const ctx = useContext(AppContext);
    const textos = useLang(ctx.lang);
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

    const initFiles = async () => {
        const files: {
            archivo?: Archivo,
            foto_portada?: Archivo
        } = {};
        if (state.files.media.archivo) {
            const file = await FileManager.convertUrlToFile(state.files.media.archivo.url, state.files.media.archivo.nombre, state.files.media.archivo.type);
            const base_64 = await FileManager.convertFileToBase64(file);
            files.archivo = {
                id: state.files.media.archivo.id,
                base64: base_64,
                name: state.files.media.archivo.nombre,
                file: file,
                url: state.files.media.archivo.url
            }
        }
        if (state.files.media.foto_portada) {
            const file = await FileManager.convertUrlToFile(state.files.media.foto_portada.url, state.files.media.foto_portada.nombre, state.files.media.foto_portada.type);
            const base_64 = await FileManager.convertFileToBase64(file);
            files.foto_portada = {
                id: state.files.media.foto_portada.id,
                base64: base_64,
                name: state.files.media.foto_portada.nombre,
                file: file,
                url: state.files.media.foto_portada.url
            }
        }
        dispatch({
            type: 'update-proyecto-form',
            value: {
                files: {
                    media: {
                        archivo: undefined,
                        foto_portada: undefined,
                    },
                    archivo: files.archivo,
                    foto_portada: files.foto_portada,
                    touched: {
                        archivo: false,
                        foto_portada: false,
                    }
                }
            }
        })
    }

    useEffect(() => {
        if (proyecto.data) {
            dispatch({
                type: 'update-proyecto-form',
                value: {
                    id: proyecto.data.id,
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
                    files: {
                        media: {
                            archivo: proyecto.data.archivo,
                            foto_portada: proyecto.data.foto_portada
                        },
                        touched: {
                            archivo: false,
                            foto_portada: false
                        }
                    }
                }
            })
        }
    }, [proyecto.data]);

    useEffect(() => {
        if (state.files.media.archivo || state.files.media.foto_portada) {
            void initFiles();
        }
    }, [state.files.media]);

    const updateProyectoFiles = api.proyectos.saveProyectoFiles.useMutation({
        onSuccess: (data) => {
            if (data) {
                notify('success', 'Se guardo el proyecto con exito');
                if (redirect === 'back') {
                    router.back();
                } else {
                    void router.push(`/cazatalentos/roles/agregar-rol?id-proyecto=${data.id}`);
                }
            } else {
                notify('error', 'Ocurrio un problema al actualizar el proyecto, por favor contacta a soporte');
            }
        },
        onError: (error) => {
            notify('error', parseErrorBody(error.message));
        }
    });

    const updateProyecto = api.proyectos.updateProyecto.useMutation({
        onSuccess: async (data) => {
            const files: { foto_portada: Media | null, archivo: Media | null } = { foto_portada: null, archivo: null };
            const files_to_be_saved: { path: string, name: string, file: File, base64: string }[] = [];
            const time = new Date().getTime();
            if (state.files.archivo) {
                if (state.files.touched.archivo) {
                    files_to_be_saved.push({ path: `cazatalentos/${data.id_cazatalentos}/proyectos/${data.id}/archivo`, name: `${state.files.archivo.file.name}-${time}`, file: state.files.archivo.file, base64: state.files.archivo.base64 });
                } else {
                    files.archivo = {
                        id: (state.files.archivo?.id) ? state.files.archivo.id : 0,
                        nombre: state.files.archivo?.name,
                        type: (state.files.archivo?.file.type) ? state.files.archivo.file.type : '',
                        url: (state.files.archivo.url) ? state.files.archivo.url : '',
                        clave: `cazatalentos/${data.id_cazatalentos}/proyectos/${data.id}/archivo/${state.files.archivo.name}-${time}`,
                        referencia: `ARCHIVO-PROYECTO-${data.id}`,
                        identificador: `archivo-proyecto-${data.id}`,
                        public: true
                    }
                }
            }
            if (state.files.foto_portada) {
                if (state.files.touched.foto_portada) {
                    files_to_be_saved.push({ path: `cazatalentos/${data.id_cazatalentos}/proyectos/${data.id}/foto-portada`, name: `${state.files.foto_portada.file.name}-${time}`, file: state.files.foto_portada.file, base64: state.files.foto_portada.base64 });
                } else {
                    files.foto_portada = {
                        id: (state.files.foto_portada?.id) ? state.files.foto_portada.id : 0,
                        nombre: state.files.foto_portada.name,
                        type: (state.files.foto_portada?.file.type) ? state.files.foto_portada.file.type : '',
                        url: (state.files.foto_portada.url) ? state.files.foto_portada.url : '',
                        clave: `cazatalentos/${data.id_cazatalentos}/proyectos/${data.id}/foto-portada/${state.files.foto_portada.name}-${time}`,
                        referencia: `FOTO-PORTADA-PROYECTO-${data.id}`,
                        identificador: `foto-portada-proyecto-${data.id}`,
                        public: true
                    }
                }
            }
            const urls_saved = await FileManager.saveFiles(files_to_be_saved);
            if (urls_saved.length > 0) {
                urls_saved.forEach((res, j) => {
                    Object.entries(res).forEach((e) => {
                        const url = e[1].url;
                        if (url) {
                            if (e[0] === `${state.files.archivo?.file.name}-${time}`) {
                                const arch = state.files.archivo;
                                files.archivo = {
                                    id: (arch?.id) ? arch.id : 0,
                                    nombre: (arch) ? arch.file.name : '',
                                    type: (arch?.file.type) ? arch.file.type : '',
                                    url: url,
                                    clave: `cazatalentos/${data.id_cazatalentos}/proyectos/${data.id}/archivo/${e[0]}`,
                                    referencia: `ARCHIVO-PROYECTO-${data.id}`,
                                    identificador: `archivo-proyecto-${data.id}`,
                                    public: true
                                }
                            }
                            if (e[0] === `${state.files.foto_portada?.file.name}-${time}`) {
                                const foto = state.files.foto_portada;
                                files.foto_portada = {
                                    id: (foto?.id) ? foto.id : 0,
                                    nombre: (foto) ? foto.file.name : '',
                                    type: (foto?.file.type) ? foto.file.type : '',
                                    url: url,
                                    clave: `cazatalentos/${data.id_cazatalentos}/proyectos/${data.id}/foto-portada/${e[0]}`,
                                    referencia: `FOTO-PORTADA-PROYECTO-${data.id}`,
                                    identificador: `foto-portada-proyecto-${data.id}`,
                                    public: true
                                }
                            }
                        }
                    })
                });
            }
            updateProyectoFiles.mutate({
                id_proyecto: data.id,
                ...files
            })
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
    }, [state.nombre, state.id_sindicato, state.id_tipo, state.sindicato, state.tipo, state.errors.nombre])

    const contacto_casting = useMemo(() => {
        return <ContactoCasting
            state={state}
            onFormChange={(input: { [key: string]: unknown }) => {
                dispatch({ type: 'update-proyecto-form', value: input })
            }}
        />
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.director_casting, state.telefono_contacto, state.email_contacto, state.email_contacto_confirmacion, state.errors.email_contacto, state.errors.email_contacto_confirmacion, state.errors.director, state.errors.telefono_contacto])

    const equipo_creativo = useMemo(() => {
        return <EquipoCreativo
            state={state}
            onFormChange={(input: { [key: string]: unknown }) => {
                dispatch({ type: 'update-proyecto-form', value: input })
            }}
        />
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.productor, state.casa_productora, state.director, state.agencia_publicidad])

    const detalles_adicionales = useMemo(() => {
        return <DetallesAdicionales
            state={state}
            onFormChange={(input: { [key: string]: unknown }) => {
                dispatch({ type: 'update-proyecto-form', value: input })
            }}
        />
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.sinopsis, state.detalles_adicionales, state.files])

    const locacion_proyecto = useMemo(() => {
        return <LocacionProyecto
            state={state}
            onFormChange={(input: { [key: string]: unknown }) => {
                dispatch({ type: 'update-proyecto-form', value: input })
            }}
        />
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.id_estado_republica])

    const publicar_proyecto = useMemo(() => {
        return <PublicarProyecto
            state={state}
            onFormChange={(input: { [key: string]: unknown }) => {
                dispatch({ type: 'update-proyecto-form', value: input })
            }}
        />
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.compartir_nombre, state.files])
   
    return (
        <>

            <Head>
                <title>DashBoard ~ {textos['talento']} | Talent Corner</title>
                <meta name="description" content="Talent Corner" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <MainLayout menuSiempreBlanco={true} >
                <div className="d-flex wrapper_ezc">
                    <MenuLateral stylesRoot={{
                        paddingTop: '0px'
                    }} />
                    <div className="seccion_container col" style={{ paddingTop: '0px !important' }}>
                        <br /><br />
                        <div className="container_box_header">
                            <div className="d-flex justify-content-end align-items-start py-2">
                                <Alertas />
                            </div>
                            <div className="d-flex" style={{ marginBottom: 64 }}>
                                <motion.img style={{ width: 35 }} src="/assets/img/silla-ezcast.svg" alt="icono" />
                                <div>
                                    <p style={{ marginLeft: 20, fontSize: '1.7rem' }} className="color_a h4 font-weight-bold mb-0"><b>{(proyecto.data?.nombre ?? (textos['n_p']))}</b></p>
                                    <p style={{ marginLeft: 20, fontSize: '1.3rem' }} className="mb-0"><b>{textos['comencemos']}</b></p>
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
                                            // eslint-disable-next-line @typescript-eslint/no-misused-promises
                                            onClick={() => {
                                                handleSave('back')
                                            }}
                                            className="btn btn-intro btn-price btn_out_line mb-2"
                                            type="button"
                                        >
                                            <Typography>{textos['guardar_y_terminar_mas_tarde']}</Typography>
                                        </button>
                                    </div>
                                    <div>
                                        <button
                                            onClick={() => { handleSave('roles') }}
                                            className="btn btn-intro btn-price mb-2"
                                            type="submit"
                                        >
                                            <Typography>
                                            {textos['save_y_add']}
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

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);
    if (session && session.user) {
        if (session.user.tipo_usuario === TipoUsuario.CAZATALENTOS) {
            return {
                props: {
                    user: session.user,
                }
            }
        }
        return {
            redirect: {
                destination: `/error?cause=${Constants.PAGE_ERRORS.UNAUTHORIZED_USER_ROLE}`,
                permanent: true
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

export default Proyecto