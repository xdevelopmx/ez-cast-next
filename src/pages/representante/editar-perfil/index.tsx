import { Typography } from '@mui/material';
import { GetServerSideProps, NextPage } from 'next';
import { User } from 'next-auth';
import { getSession } from 'next-auth/react';
import Head from 'next/head'
import { useEffect, useMemo, useReducer } from 'react';
import { CuentaRepresentante, MStepper, MainLayout, ValidacionRepresentanteView } from '~/components';
import { InformacionBasicaRepresentante } from '~/components';
import { PermisosRepresentanteView } from '~/components/representante/forms/PermisosRepresentante';
import { MTooltip } from '~/components/shared/MTooltip';
import useNotify from '~/hooks/useNotify';
import { Archivo } from '~/server/api/root';
import { api, parseErrorBody } from '~/utils/api';
import { FileManager } from '~/utils/file-manager';

export type InfoBasicaRepresentante = {
    nombre: string, 
    apellido: string,
    sindicato: {
        id: number,
        descripcion?: string
    },
    ubicacion: {
        id_estado_republica: number,
        direccion: string,
        cp: number
    },
    biografia: string,
    redes_sociales?: { [nombre: string]: string },
    files: {
        cv?: Archivo,
        urls: {
            cv?: string,
        }
    },
}

export type PermisosRepresentante = {
    puede_aceptar_solicitudes: {
        talentos: boolean,
        representante: boolean
    },
    puede_editar_perfil: {
        talentos: boolean,
        representante: boolean
    }
}

export type ValidacionRepresentante = {
    numero_clientes: number,
    IMDB_pro_link: string,
    directores_casting: {
        nombre: string, 
        apellido: string,
        correo_electronico: string,
        telefono: string
    }[],
    files: {
        licencia?: Archivo,
        urls: {
            licencia?: string,
        }
    },
}

type RepresentanteForm = {
    step_active: number,
    info_basica: InfoBasicaRepresentante,
    permisos: PermisosRepresentante,
    validacion: ValidacionRepresentante
}

const initialState: RepresentanteForm = {
    info_basica: {
        nombre: '',
        apellido: '',
        sindicato: {
            id: 0,
        },
        ubicacion: {
            id_estado_republica: 0,
            direccion: '',
            cp: 0
        },
        biografia: '',
        files: {
            urls: {}
        }
    },
    permisos: {
        puede_aceptar_solicitudes: {
            representante: false,
            talentos: false,
        },
        puede_editar_perfil: {
            representante: false,
            talentos: false
        }
    },
    step_active: 1,
    validacion: {
        numero_clientes: 0,
        IMDB_pro_link: '',
        directores_casting: [
            {
                nombre: '', 
                apellido: '',
                correo_electronico: '',
                telefono: ''
            },
            {
                nombre: '', 
                apellido: '',
                correo_electronico: '',
                telefono: ''
            }
        ],
        files: {
            licencia: undefined,
            urls: {
                licencia: undefined
            }
        }
    }
}

const editarPerfilRepresentanteReducer = (state: RepresentanteForm, action: { type: string, value: { [key: string]: unknown } }) => {
    switch (action.type) {
        case 'update-info-basica': {
            return { ...state, info_basica: {...state.info_basica, ...action.value} };
        }
        case 'update-permisos': {
            return { ...state, permisos: {...state.permisos, ...action.value} };
        }
        case 'update-validacion': {
            return { ...state, validacion: {...state.validacion, ...action.value} };
        }
        case 'update-form': {
            return {...state, ...action.value};
        }
        default:
            return state;
    }
}

type EditarPerfilRepresentantePageProps = {
    user: User;
}

const EditarPerfilRepresentantePage: NextPage<EditarPerfilRepresentantePageProps> = ({ user }) => {

    const [state, dispatch] = useReducer(editarPerfilRepresentanteReducer, initialState)

    const { notify } = useNotify();

    const info_basica = api.representantes.getInfoBasica.useQuery(undefined, {
        refetchOnWindowFocus: false
    })

    useEffect(() => {
        if (info_basica.data && info_basica.data.info_basica) {
            const union = info_basica.data.info_basica.union;
            const redes_sociales: { [nombre: string]: string } = {};
            if (info_basica.data && info_basica.data.redes_sociales) {
                info_basica.data.redes_sociales.forEach(red => {
                    redes_sociales[red.nombre] = red.url;
                })
            }
            dispatch({ type: 'update-info-basica', value: {
                nombre: info_basica.data.nombre,
                apellido: info_basica.data.apellido,
                sindicato: {
                    id: (union) ? union.id_union : 0,
                    descripcion: (union && union.id_union === 99) ? union.descripcion : undefined
                },
                ubicacion: {
                    id_estado_republica: info_basica.data.info_basica.id_estado_republica,
                    direccion: info_basica.data.info_basica.direccion,
                    cp: info_basica.data.info_basica.cp
                },
                biografia: info_basica.data.biografia,
                redes_sociales: redes_sociales,
                files: {
                    urls: {
                        cv: info_basica.data.info_basica.media?.url
                    }
                },
            } });
        }
    }, [info_basica.data]);

    const saveInfoBasica = api.representantes.saveInfoBasica.useMutation({
        onSuccess(input) {
            notify('success', 'Se guardo la información básica con exito.');
            info_basica.refetch();
        },
        onError: (error) => {
            notify('error', parseErrorBody(error.message));
        }
    })

    const saveMediaInfoBasica = api.representantes.saveMediaInfoBasica.useMutation({
        onSuccess(input) {
            saveInfoBasica.mutate({
                nombre: state.info_basica.nombre,
                apellido: state.info_basica.apellido,
                sindicato: state.info_basica.sindicato,
                ubicacion: state.info_basica.ubicacion,
                biografia: state.info_basica.biografia,
                id_media_cv: input,
                redes_sociales: state.info_basica.redes_sociales ? Array.from(Object.entries(state.info_basica.redes_sociales)).map((e) => { return { nombre: e[0], url: e[1] } }) : null,
            });
        },
        onError: (error) => {
            notify('error', parseErrorBody(error.message));
        }
    })

    const saveStep = async (step: number) => {
        switch (step) {
            case 1: {
                let url: null | string = null;
                const to_be_saved: {path: string, name: string, file: File, base64: string}[] = [];
                const time = new Date().getTime();
                if (state.info_basica.files.cv) {
                    to_be_saved.push({path: `representantes/${user.id}/cv`, name: `cv-${time}`, file: state.info_basica.files.cv.file, base64: state.info_basica.files.cv.base64});
                }
                if (to_be_saved.length > 0) {
                    const urls_saved = await FileManager.saveFiles(to_be_saved);
                    if (urls_saved) {
                        urls_saved.forEach((u) => {
                            const cv = u[`cv-${time}`];
                            if (cv) {
                                url = cv.url;
                            }
                        })
                    }
                }

                saveMediaInfoBasica.mutate({
                    cv_url: state.info_basica.files.urls.cv,
                    cv: (!state.info_basica.files.cv || !url) ? null : {
                        nombre: 'cv',
                        type: state.info_basica.files.cv.file.type,
                        url: url,
                        clave: `representantes/${user.id}/cv/cv-${time}`,
                        referencia: `representante-info-gral`,
                        identificador: `representante-cv`
                    },
                })
                break;
            }
        }
    }

    const info_basica_view = useMemo(() => {
        return <InformacionBasicaRepresentante
            state={state.info_basica}
            representante_fetching={false}
            onFormChange={(input) => {
                dispatch({ type: 'update-info-basica', value: input });
            }}
        />
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.info_basica])

    const permisos_view = useMemo(() => {
        return <PermisosRepresentanteView
            state={state.permisos}
            representante_fetching={false}
            onFormChange={(input) => {
                dispatch({ type: 'update-permisos', value: input });
            }}
        />
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.permisos]);

    const validacion_view = useMemo(() => {
        return <ValidacionRepresentanteView
            state={state.validacion}
            representante_fetching={false}
            onFormChange={(input) => {
                dispatch({ type: 'update-validacion', value: input });
            }}
        />
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.validacion]);

    return (
        <>
            <Head>
                <title>DashBoard ~ Talentos | Talent Corner</title>
                <meta name="description" content="Talent Corner" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <MainLayout style={{ padding: 32, backgroundColor: '#f2f2f2', marginTop: 48, minHeight: '100vh' }} menuSiempreBlanco={true} >
                <div className={'RootContainer'} style={{ minHeight: /* ([1].includes(state.step_active)) ?  'calc(100vh - 76px)'  : */ '100%' }}>
                    <MStepper
                        onStepChange={(step: number) => {
                            saveStep(state.step_active);
                            dispatch({ type: 'update-form', value: { step_active: step } });
                        }}
                        onFinish={() => {
                            saveStep(state.step_active);
                        }}
                        current_step={state.step_active}
                        onStepSave={(step: number) => {
                            saveStep(step);
                        }}
                        step_titles={{
                            1: 'Información básica',
                            2: 'Permisos',
                            //3: 'Cuenta',
                            3: 'Validación',
                        }}
                        tooltips={{
                            3: <MTooltip
                                text='Incluye todas las habilidades que te diferencien de los demás. ¡Un Cazatalentos puede estar buscando un rol con tus habilidades!'
                                color='blue'
                                placement='right'
                            />,
                        }}
                    >
                        {info_basica_view}
                        {permisos_view}
                        {/*
                        <CuentaRepresentante />
                        */}
                        {validacion_view}
                    </MStepper>
                </div>
            </MainLayout>
        </>
    )
}


export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);
 
    return {
        props: {
            user: session?.user,
        }
    }
}


export default EditarPerfilRepresentantePage