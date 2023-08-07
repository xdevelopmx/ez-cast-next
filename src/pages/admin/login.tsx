import { type NextPage } from "next";
import Head from "next/head";
import { useContext, useMemo, useReducer, useState } from "react";
import { signIn } from 'next-auth/react'

import { motion } from 'framer-motion'

import { CarrucelFondo, FormGroup, MainLayout } from "~/components";
import { Link } from "@mui/material";
import MotionDiv from "~/components/layout/MotionDiv";
import { TipoUsuario } from "~/enums";
import useLang from "~/hooks/useLang";
import useNotify from "~/hooks/useNotify";
import { useRouter } from 'next/navigation';
import { MContainer } from "~/components/layout/MContainer";
import AppContext from "~/context/app";

type LoginForm = {
	user: string,
	password: string,
	tipo_usuario: TipoUsuario | null,
	errors: {
		user?: string,
		password?: string
	}
}

function reducer(state: LoginForm, action: { type: string, value: { [key: string]: unknown } }) {
	if (action.type === 'update-form') {
		return { ...state, ...action.value }
	}
	throw Error(`Accion no definida ${action.type}`)
}

const LoginAdminPage: NextPage = () => {

	const ctx = useContext(AppContext);
    const textos = useLang(ctx.lang);

	const { notify } = useNotify();
	const router = useRouter();
	const [state, dispatch] = useReducer(reducer, { user: '', password: '', errors: {}, tipo_usuario: TipoUsuario.NO_DEFINIDO });

	const validationLogin = useMemo(() => {
		const result = {
			errors: {
				user: (!state.user || state.user.length < 2) ? 'El usuario es demasiado corto' : undefined,
				password: (!state.password || state.password.length < 8) ? 'La contraseña es demasiado corta' : undefined,
			},
			hasErrors: false
		}
		result.hasErrors = Object.entries(result.errors).filter(e => (e[1] != null)).length > 0;
		return result;
	}, [state.password, state.user]);

	return (
		<MotionDiv show={true} animation='down-to-up'>
			<MainLayout style={{ margin: 0 }}>
				<CarrucelFondo>
					<div className="box_cart_login">
						<div className="login_container text-center">
							<p className="h1 text-uppercase mb-3 text-center">ADMIN EZ-CAST</p>
							<div className="d-lg-flex align-items-center justify-content-center p-2 box_input">
								<MContainer direction="horizontal">
									<label style={{ marginRight: 16 }} htmlFor="user">Usuario / Email</label>
									<FormGroup
										error={state.errors.user}
										show_error_message
										className={`form-control form-control-sm text_custom ${(state.user.length < 2) ? '' : 'login_custom'} m-0`}
										labelStyle={{ fontWeight: 400 }}
										style={{ width: 250 }}
										value={state.user}
										onChange={(e) => {
											dispatch({
												type: 'update-form', value: {
													user: e.currentTarget.value,
													errors: { ...state.errors, user: (!e.target.value || e.target.value.length < 2) ? 'El usuario es demasiado corto' : undefined }
												}
											})
										}}
									/>
								</MContainer>
							</div>
							<div className="d-lg-flex align-items-center justify-content-center p-2 box_input">
								<MContainer direction="horizontal">
									<label style={{ marginRight: 40 }} htmlFor="user">Contraseña</label>
									<FormGroup
										type="password"
										show_error_message
										error={state.errors.password}
										className={`form-control form-control-sm text_custom ${(state.user.length < 2) ? '' : 'login_custom'} m-0`}
										labelStyle={{ fontWeight: 400 }}
										value={state.password}
										style={{ width: 250 }}
										onChange={(e) => {
											dispatch({
												type: 'update-form', value: {
													password: e.currentTarget.value,
													errors: { ...state.errors, password: (!e.target.value || e.target.value.length < 8) ? 'La contraseña es demasiado corta' : undefined }
												}
											})
										}}
										label=""
									/>
								</MContainer>

							</div>
							
							<div className="text-center mt-3 pl-2 pr-2">
								<button className="btn btn-intro btn-confirm mt-0" onClick={() => {
									if (!validationLogin.hasErrors) {
										signIn('credentials', {
											user: state.user,
											password: state.password,
											tipo_usuario: TipoUsuario.ADMIN,
											correo_usuario: state.user,
											redirect: false,
										}).then(res => {
											if (res?.ok) {
												notify('success', 'Autenticacion Exitosa');
												router.push('/admin');
											} else {
												notify('error', 'Usuario u contraseña incorrectos');
											}
											console.log(res);
										}).catch((err: Error) => {
											notify('error', err.message);
										});
									} else {
										dispatch({ type: 'update-form', value: { errors: validationLogin.errors } })
										notify('warning', 'Por favor corrige el formulario antes de continuar con el inicio de sesion')
									}
								}}>Log In</button>
							</div>							
						</div>
						<p className="text-white mt-2">Necesitas ayuda? Accede a nuestros &nbsp;
							<a href="ayuda_ezcast.html" className="text-white">
								<u>tutoriales y preguntas frecuentes.</u>
							</a>
						</p>
					</div>
				</CarrucelFondo>
			</MainLayout>
		</MotionDiv>
	);
};

export default LoginAdminPage;
