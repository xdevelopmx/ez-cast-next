import { type NextPage } from "next";
import Image from 'next/image';
import Head from "next/head";
import { motion } from 'framer-motion'
import classes from './editar-perfil.module.css';

import { Alertas, Destacados, Flotantes, ListadoProductos, MainLayout, MenuLateral } from "~/components";
import { MStepper } from "~/components/shared/MStepper";
import { useReducer } from "react";
import { EditarActivosTalento, EditarCreditosTalento, EditarFiltrosAparenciasTalento, EditarInfoBasicaTalento, EditarMediaTalento, EditarPreferenciaRolYCompensacionTalento } from "~/components/talento";
import { Archivo } from "~/server/api/root";
import EditarHabilidadesTalento from "~/components/talento/forms/editar-habilidades";
import { getSession } from "next-auth/react";
import { GetServerSideProps } from "next/types";
import { api } from "~/utils/api";

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
        cv?: Archivo
    },
    redes_sociales: {[nombre: string]: string}
}

type TalentoFormMedios = {
    fotos: Archivo[],
    videos: Archivo[],
    audios: Archivo[]
}

export type TalentoFormCreditos = {
    mostrar_anio_en_perfil: boolean,
    tipo_proyecto: string,
    titulo: string, 
    rol: string, 
    director: string, 
    anio: number, 
    creditos: {
        id: number,
        titulo: string, 
        rol: string, 
        director: string, 
        anio: number, 
        credito_destacado: boolean, 
        clip: string
    }[]
}

export type TalentoFormHabilidades = {
    habilidades_seleccionadas: Map<number, number[]> 
}

type TalentoForm = {
    info_gral: TalentoFormInfoGral,
    medios?: TalentoFormMedios,
    creditos?: TalentoFormCreditos,
    habilidades?: TalentoFormHabilidades,
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
        files: {}
    },
    creditos: {
        mostrar_anio_en_perfil: false,
        tipo_proyecto: '',
        titulo: '',
        rol: '',
        director: '',
        anio: new Date().getFullYear(),
        creditos: []
    },
    habilidades: {
        habilidades_seleccionadas: new Map()
    }
}

function reducer(state: TalentoForm, action: {type: string, value: {[key: string]: unknown}}) {
	switch (action.type) {
		case 'update-form': {
			return { ...state, ...action.value }
		}
        case 'update-info-gral': {
            return {...state, info_gral: {...state.info_gral, ...action.value}} as TalentoForm;
		}
        case 'update-medios': {
            return {...state, medios: {...state.medios, ...action.value}} as TalentoForm;
        }
        case 'update-creditos': {
            return {...state, creditos: {...state.creditos, ...action.value}} as TalentoForm;
        }
        case 'update-habilidades': {
            return {...state, habilidades: {...state.habilidades, ...action.value}} as TalentoForm;
        }
	}
	return {...state};
}

const EditarTalentoPage: NextPage = () => {
	
    const [state, dispatch] = useReducer(reducer, initialState);

    const saveInfoGral = api.talentos.saveInfoGral.useMutation({
		onSuccess(input) {
			alert(`Se guardo con exito: ${JSON.stringify(input)}`);
		},
		onError: (error) => {
			alert(JSON.stringify(error));
		}
	});

	return (
		<>
			<Head>
				<title>DashBoard ~ Talentos | Talent Corner</title>
				<meta name="description" content="Talent Corner" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<MainLayout style={{padding: 32, backgroundColor: '#f2f2f2', marginTop: 48}} menuSiempreBlanco={true} >

				    <div className={classes['RootContainer']}>
                        <MStepper
                            onStepChange={(step: number) => {
                                dispatch({type: 'update-form', value: {step_active: step}});
                            }}
                            onFinish={() => {
                                //create_user.mutate({...state});
                            }}
                            current_step={state.step_active}
                            onStepSave={(step: number) => {
                                switch (step) {
                                    case 1: {
                                        console.log(state)
                                        saveInfoGral.mutate({
                                            ...state.info_gral, 
                                            redes_sociales: null,
                                            files: {
                                                cv: (!state.info_gral.files.cv) ? null : {base64: state.info_gral.files.cv.base64, extension: state.info_gral.files.cv.file.type},
                                                carta_responsiva: (!state.info_gral.files.carta_responsiva) ? null : {base64: state.info_gral.files.carta_responsiva.base64, extension: state.info_gral.files.carta_responsiva.file.type}
                                            }
                                        });
                                        break;
                                    }
                                }
                                console.log(step, 'save')
                            }}
                            step_titles={{
                                1: 'Información básica',
                                2: 'Media',
                                3: 'Créditos',
                                4: 'Habilidades',
                                5: 'Activos',
                                6: 'Preferencia de rol y compensación',
                                7: 'Filtros de Apariencia',
                                8: 'Finalizo'
                            }}
                        >
                           <EditarInfoBasicaTalento 
                                state={state.info_gral} 
                                onFormChange={(input) => {
                                    dispatch({type: 'update-info-gral', value: input});
                                }} 
                            />
                            <EditarMediaTalento state={{
                                nombre: '',
                                apellido: '',
                                usuario: 'string',
                                email: 'string',
                                contrasenia: 'string',
                                confirmacion_contrasenia: 'string',
                                fotos: (state.medios) ? state.medios?.fotos : []
                            }} 
                            onFormChange={(input) => {
                                dispatch({type: 'update-medios', value: input});
                            }} />
                            <EditarCreditosTalento state={state.creditos} 
                            onFormChange={(input) => {
                                console.log(input);
                                dispatch({type: 'update-creditos', value: input});
                            }} />
                            <EditarHabilidadesTalento state={state.habilidades} 
                            onFormChange={(input) => {
                                console.log(input)
                                dispatch({type: 'update-habilidades', value: input});
                            }} />
                            <EditarActivosTalento state={{
                                nombre: '',
                                apellido: '',
                                usuario: 'string',
                                email: 'string',
                                contrasenia: 'string',
                                confirmacion_contrasenia: 'string'
                            }} onFormChange={() => {console.log('xd')}} />
                            <EditarPreferenciaRolYCompensacionTalento state={{
                                nombre: '',
                                apellido: '',
                                usuario: 'string',
                                email: 'string',
                                contrasenia: 'string',
                                confirmacion_contrasenia: 'string'
                            }} onFormChange={() => {console.log('xd')}} />
                            <EditarFiltrosAparenciasTalento state={{
                                nombre: '',
                                apellido: '',
                                usuario: 'string',
                                email: 'string',
                                contrasenia: 'string',
                                confirmacion_contrasenia: 'string'
                            }} onFormChange={() => {console.log('xd')}} />
                            <p>FINALIZO</p>
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