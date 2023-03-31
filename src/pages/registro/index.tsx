import { type NextPage } from "next";
import { motion } from 'framer-motion'


import { CreaTuPerfil, MainLayout, Pago, TipoDeMembresia } from "~/components";
import MotionDiv from "~/components/layout/MotionDiv";
import Link from "next/link";
import { Box } from "@mui/material";
import { useMemo, useReducer } from "react";
import { MStepper } from "~/components/shared/MStepper";
import { TipoCobro, TipoMembresia, TipoUsuario } from "~/enums";
import { api, parseErrorBody } from "~/utils/api";
import useLang from "~/hooks/useLang";
import { useRouter } from 'next/navigation';
import useNotify from "~/hooks/useNotify";
import Constants from "~/constants";


export type PerfilForm = {
	tipo_usuario: TipoUsuario,
	nombre: string,
	apellido: string,
	usuario: string,
	email: string,
	contrasenia: string,
	confirmacion_contrasenia: string,
	profile_img_url?: string, 
	tipo_membresia: TipoMembresia,
	cobro_membresia: TipoCobro,
	id_openpay?: string,
	posicion_o_puesto?: string,
	compania?: string,
	biografia?: string,
	errors: {
		nombre?: string,
        apellido?: string,
        usuario?: string,
        email?: string,
        contrasenia?: string,
        confirmacion_contrasenia?: string,
	}
}


type CreateUserForm = {
	perfil: PerfilForm,
	step_active: number,
}

const initialState = {
	perfil: {
		tipo_usuario: TipoUsuario.TALENTO,
		nombre: '', 
		apellido: '', 
		contrasenia: '', 
		confirmacion_contrasenia: '', 
		usuario: '', 
		email: '', 
		errors: {},
		tipo_membresia: TipoMembresia.GRATIS,
		cobro_membresia: TipoCobro.ANUAL,
	},
	step_active: 1,
}

function reducer(state: CreateUserForm, action: {type: string, value: {[key: string]: unknown }}) {
	switch (action.type) {
		case 'update-form': {
			return { ...state, ...action.value }
		}
		case 'update-perfil': {
			return {...state, perfil: {...state.perfil, ...action.value}} as CreateUserForm;
		}
	}
	return {...state};
  }

const RegistroPage: NextPage = () => {

	const texts = useLang('es');

	const [state, dispatch] = useReducer(reducer, initialState);

	const {notify} = useNotify();

	const router = useRouter();

	const create_user = api.auth.createUser.useMutation({
		onSuccess(input) {
			switch (state.perfil.tipo_usuario) {
				case 'talento': {
					router.push('/talento/dashboard');
					break;
				}
				case 'cazatalentos': {
					router.push('/cazatalentos/dashboard');
					break;
				}
			}
			notify('success', 'Autenticacion Exitosa');
			console.log('Se guardo con exito', input);
		},
		onError: (error) => {
			notify('error', parseErrorBody(error.message))
			console.error(error);
		}
	});

	const validationStepPerfil = useMemo(() => {
		const result = { 
			errors: {
				nombre: (!state.perfil.nombre || state.perfil.nombre.length < 2) ? 'El nombre es demasiado corto' : undefined,
				apellido: (!state.perfil.apellido || state.perfil.apellido.length < 2) ? 'El apellido es demasiado corto' : undefined,
				usuario: (!state.perfil.usuario || state.perfil.usuario.length < 2) ? 'El usuario es demasiado corto' : undefined,
				email: (!Constants.PATTERNS.EMAIL.test(state.perfil.email)) ? 'El email es invalido' : undefined,
				contrasenia: (!state.perfil.contrasenia || state.perfil.contrasenia.length < 8) ? 'La contraseña es demasiado corta' : undefined,
				confirmacion_contrasenia: (!state.perfil.confirmacion_contrasenia || !state.perfil.contrasenia || state.perfil.contrasenia !== state.perfil.confirmacion_contrasenia) ? 'Las contraseñas no son la misma' : undefined
			}, 
			hasErrors: false
		}
		result.hasErrors = Object.entries(result.errors).filter(e => (e[1] != null)).length > 0;
		return result;
	}, [state.perfil]);

	const steps = useMemo(() => {
		const steps_arr: JSX.Element[] = [];
		if (state.perfil) {
			steps_arr.push(
				<CreaTuPerfil state={{...state.perfil}} key={1} onFormChange={(input: {[key: string]: unknown}) => {
					dispatch({type: 'update-perfil', value: input})
					console.log(input);
				}}/>,
				<TipoDeMembresia state={{...state.perfil}} key={2} onFormChange={(input: {[key: string]: unknown}) => {
					dispatch({type: 'update-perfil', value: input})
					console.log(input);
				}}/>
			)
			
			if (state.perfil.tipo_membresia !== TipoMembresia.GRATIS) {
				steps_arr.push(
					<Pago key={3} onFormChange={(input: {[key: string]: string | number}) => {
						dispatch({type: 'update-perfil', value: input})
						console.log(input);
					}}/>
				)
			}
		} 
		return steps_arr;
	}, [state.perfil]);

	return (
		<MotionDiv show={true} animation='down-to-up'>
			<MainLayout>
				<>
					<div className="intro_container text-center ezcast_container pb-3">
						<motion.img src="assets/img/iconos/EZ_Claqueta_N_S.svg" className="logo_head_registro" alt="" />
						<p className="h1 text-uppercase text-white m-0">Registro EZ-CAST</p>
					</div>
					<div className="intro_container">
						<Link href="/login" className="text-dark">
							<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
								x="0px" y="0px" width="18px" viewBox="0 0 18.5 15.8"
								xmlSpace="preserve">
								<style type="text/css">
									{`.st0 {
                                fill: var(--color_a);
                            }`}
								</style>
								<path id="Path_1_2_" className="st0" d="M24.2,4.7" />
								<path className="st0"
									d="M12.9,3.8H4l1.7-1.7c0.4-0.4,0.4-1,0-1.4c-0.4-0.4-1-0.4-1.4,0L0.9,4.1c-0.4,0.4-0.4,1,0,1.4l3.4,3.4 c0.4,0.4,1,0.4,1.4,0c0.4-0.4,0.4-1,0-1.4L4,5.8h8.9c1.5,0,3.2,0.4,3.2,3.8c0,3.8-2.6,3.8-3.4,3.8H3c-0.6,0-1,0.4-1,1s0.4,1,1,1h9.7 c3.5,0,5.4-2.1,5.4-5.8C18.1,5.9,16.3,3.8,12.9,3.8z" />
							</svg>
							&nbsp;&nbsp;REGRESAR A INFORMACIÓN EZ-CAST
						</Link>
						<Box sx={{ width: '100%' }}>
							<br />
							<div style={{width: '200px', margin: '0 auto'}}>
								
							</div>
							<form autoComplete="off" style={{minHeight: 531}}>
								<MStepper
									onStepChange={(step: number) => {
										switch (step) {
											case 2: {
												console.log(validationStepPerfil)
												if (validationStepPerfil.hasErrors) {
													notify('warning', 'Por favor primero corrige los errores del formulario');
													dispatch({type: 'update-perfil', value: {errors: validationStepPerfil.errors}});
												} else {
													dispatch({type: 'update-form', value: {step_active: step}});
												}
												break;
											}	
											default: dispatch({type: 'update-form', value: {step_active: step}});
										}
									}}
									onFinish={() => {
										console.log(validationStepPerfil)
										if (!validationStepPerfil.hasErrors) {
											create_user.mutate({
												tipo_usuario: state.perfil.tipo_usuario,
												user: {
													...state.perfil,
												}
											});
										} else {
											notify('warning', 'Hay errores en el formulario, por favor corrigelos y intenta de nuevo');
										}
									}}
    								current_step={state.step_active}
    								step_titles={{
										1: 'Crea tu perfil',
										2: 'Tipo de membresía',
										3: 'Pago'
									}}
								>
								{steps.map(e => e)}	
								</MStepper>
							</form>
						</Box>
					</div>
				</>
			</MainLayout>
		</MotionDiv>
	);
};

export default RegistroPage;