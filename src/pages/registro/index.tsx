import { type NextPage } from "next";
import { motion } from 'framer-motion'
import { signIn } from 'next-auth/react'

import { AceptarTerminos, CreaTuPerfil, MainLayout, Pago, TipoDeMembresia } from "~/components";
import MotionDiv from "~/components/layout/MotionDiv";
import Link from "next/link";
import { Box } from "@mui/material";
import { useContext, useEffect, useMemo, useReducer } from "react";
import { MStepper } from "~/components/shared/MStepper";
import { TipoCobro, TipoMembresia, TipoUsuario } from "~/enums";
import { api, parseErrorBody } from "~/utils/api";
import useLang from "~/hooks/useLang";
import { useRouter } from 'next/navigation';
import useNotify from "~/hooks/useNotify";
import Constants from "~/constants";
import { ResourceAlert } from "~/components/shared/ResourceAlert";
import AppContext from "~/context/app";

type RegistroProps = {
	is_representante: boolean,
	onSave?: (id_user: number, tipo_user: TipoUsuario) => void 
}

export type PerfilForm = {
	is_representante: boolean,
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


export type CreateUserForm = {
	perfil: PerfilForm,
	step_active: number,
	terms_and_conditions_accepted: boolean
}

const initialState = {
	perfil: {
		is_representante: false,
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
	terms_and_conditions_accepted: false
}

function reducer(state: CreateUserForm, action: { type: string, value: { [key: string]: unknown } }) {
	switch (action.type) {
		case 'update-form': {
			return { ...state, ...action.value }
		}
		case 'update-perfil': {
			return { ...state, perfil: { ...state.perfil, ...action.value } } as CreateUserForm;
		}
	}
	return { ...state };
}

const RegistroPage: NextPage<RegistroProps> = ({is_representante = false, onSave}) => {

	const ctx = useContext(AppContext);
  	const textos = useLang(ctx.lang);
    
	const [state, dispatch] = useReducer(reducer, initialState);

	useEffect(() => {
		dispatch({ type: 'update-perfil', value: {is_representante: is_representante} })
	}, [is_representante]);

	const { notify } = useNotify();

	const router = useRouter();

	const create_user = api.auth.createUser.useMutation({
		onSuccess(input) {
			if (!is_representante) {
				signIn('credentials', {
					user: state.perfil.usuario,
					password: state.perfil.contrasenia,
					tipo_usuario: state.perfil.tipo_usuario,
					correo_usuario: state.perfil.email,
					redirect: false,
				}).then(res => {
					if (res?.ok) {
						notify('success', `${textos['success_login']}`);
						router.push('/inicio');
					}
					console.log(res);
				}).catch((err: Error) => {
					notify('error', err.message);
				});
			} 
			if (onSave) {
				onSave(input.id, state.perfil.tipo_usuario);
			}
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
				<CreaTuPerfil state={{ ...state.perfil }} key={1} onFormChange={(input: { [key: string]: unknown }) => {
					dispatch({ type: 'update-perfil', value: input })
					console.log(input);
				}} />,
				<TipoDeMembresia state={{ ...state.perfil }} key={2} onFormChange={(input: { [key: string]: unknown }) => {
					dispatch({ type: 'update-perfil', value: input })
					console.log(input);
				}} />
			)

			if (state.perfil.tipo_membresia !== TipoMembresia.GRATIS) {
				steps_arr.push(
					<Pago key={3} onFormChange={(input: { [key: string]: string | number }) => {
						dispatch({ type: 'update-perfil', value: input })
						console.log(input);
					}} />
				)
			}

			steps_arr.push(
				<AceptarTerminos state={state} onFormChange={(input: { [key: string]: unknown }) => {
					dispatch({ type: 'update-form', value: input })
					console.log(input);
				}} key={4} />
			)
		}
		return steps_arr;
	}, [state.perfil, state.terms_and_conditions_accepted]);



	return (
		<MotionDiv show={true} animation='down-to-up'>
			<MainLayout menuAzul>
				<>
					<div className="intro_container text-center ezcast_container pb-3">
						<motion.img src="assets/img/iconos/EZ_Claqueta_N_S.svg" className="logo_head_registro" alt="" />
						<p className="h1 text-uppercase text-white m-0" style={{fontSize:45, fontWeight:700}}>{textos["Titulo"]?? ""}</p>
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
							&nbsp;&nbsp;{is_representante ? (textos["rt"]?? "") : (textos["return"]?? "")}
						</Link>
						<Box sx={{ width: '100%' }}>
							<br />
							<div style={{ width: '200px', margin: '0 auto' }}>

							</div>
							<form autoComplete="off" style={{ minHeight: 531 }}>
								<MStepper
									stylesStepper={{
										width: '600px',
										margin: 'auto',
										maxWidth: '100%'
									}}
									styleH3Paso={{
										fontSize: '1.5rem',
										color: '#000',
									}}
									styleSpanH3PasoTitulo={{
										paddingLeft: '30px',
										color: '#069cb1'
									}}
									onStepChange={(step: number) => {
										switch (step) {
											case 2: {
												console.log(validationStepPerfil)
												if (validationStepPerfil.hasErrors) {
													notify('warning', `${textos['validar_campos_form']}`);
													dispatch({ type: 'update-perfil', value: { errors: validationStepPerfil.errors } });
												} else {
													dispatch({ type: 'update-form', value: { step_active: step } });
												}
												break;
											}
											default: dispatch({ type: 'update-form', value: { step_active: step } });
										}
									}}
									onFinish={() => {
										if (!state.terms_and_conditions_accepted) {
											notify('warning', `${textos['no_ha_aceptado_terminos']}`);
											return;
										}
										console.log(validationStepPerfil)
										if (!validationStepPerfil.hasErrors) {
											create_user.mutate({
												tipo_usuario: state.perfil.tipo_usuario,
												user: {
													...state.perfil,
												}
											});
										} else {
											notify('warning', `${textos['errores_en_formulario']}`);
										}
									}}
									current_step={state.step_active}
									step_titles={{
										1: (is_representante) ? 'Crea el perfil de tu talento' : (textos["crea_perfil"]?? ""),
										2: (textos["tipo_membresia"]?? ""),
										...(() => {
											return (steps.length === 4
												? ({
													3: 'Pago',
													4: (textos["terminos"]?? "")
												})
												: ({
													3: (textos["terminos"]?? ""),
												}))
										})()
									}}
								>
									{steps.map(e => e)}
								</MStepper>
							</form>
						</Box>
					</div>
				</>
				<ResourceAlert busy={create_user.isLoading}/>
			</MainLayout>
		</MotionDiv>
	);
};

export default RegistroPage;