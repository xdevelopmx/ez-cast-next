import { type NextPage } from "next";
import Head from "next/head";
import { useReducer, useState } from "react";
import { signIn } from 'next-auth/react'

import { motion } from 'framer-motion'

import { CarrucelFondo, MainLayout } from "~/components";
import { Link } from "@mui/material";
import MotionDiv from "~/components/layout/MotionDiv";
import { TipoUsuario } from "~/enums";
import useLang from "~/hooks/useLang";
import useNotify from "~/hooks/useNotify";
import { useRouter } from 'next/navigation';

type LoginForm = {
  user: string,
  password: string,
  tipo_usuario: TipoUsuario | null,
} 

function reducer(state: LoginForm, action: {type: string, value: {[key: string]: string | TipoUsuario}}) {
  if (action.type === 'update-form') {
    console.log(state)
    return { ...state, ...action.value }
  }
  throw Error(`Accion no definida ${action.type}`)
}

const LoginPage: NextPage = () => {

    const texts = useLang('en');
    const {notify} = useNotify();
    const router = useRouter();
    const [state, dispatch] = useReducer(reducer, {user: '', password: '', tipo_usuario: TipoUsuario.NO_DEFINIDO});


  return (
    <MotionDiv show={true} animation='down-to-up'>
      <MainLayout>
        <CarrucelFondo>
            <div className="box_cart_login">
                <div className="login_container text-center">
                    <p className="h1 text-uppercase mb-3 text-center">EZ-CAST</p>
                    <p className="text-muted">No tienes cuenta? <Link href="/registro" className="color_a">Registrate aquí</Link></p>
                    <div className="d-lg-flex align-items-center justify-content-center p-2 box_input">
                        <div className="flex_half">
                            <label htmlFor="user">Usuario / Email</label>
                        </div>
                        <div className="flex_one">
                            <input 
                              value={state.user}
                              onChange={(e) => {dispatch({type: 'update-form', value: {user: e.currentTarget.value}})}}
                              type="text"
                              className="form-control form-control-sm text_custom login_custom m-0"
                              id="user"
                              />
                        </div>
                    </div>
                    <div className="d-lg-flex align-items-center justify-content-center p-2 box_input">
                        <div className="flex_half">
                            <label htmlFor="password">Contraseña</label>
                        </div>
                        <div className="flex_one">
                            <input 
                              value={state.password}
                              onChange={(e) => {dispatch({type: 'update-form', value: {password: e.currentTarget.value}})}}
                              type="password"
                              className="form-control form-control-sm text_custom login_custom m-0"
                              id="password" />
                        </div>
                    </div>
                    <p className="text-muted">Olvido contraseña? <Link href="/restablecer-contrasena" className="color_a">Restablecer</Link></p>
                    <p>Ingresar como</p>

                    <div className="d-flex align-items-center justify-content-center text-center flex-wrap">
                        <div>
                            <span
                                className={`switch_span switch_login ${state.tipo_usuario === TipoUsuario.CAZATALENTOS ? 'active' : ''}`}
                                onClick={() => {dispatch({type: 'update-form', value: {tipo_usuario: TipoUsuario.CAZATALENTOS}})} }
                            >
                                Cazatalentos
                            </span>
                            <div className="contToolTip" data-toggle="tooltip" data-placement="bottom" title="Perfil para la persona que busca “cazar” a una persona que cumpla con los requerimientos y el talento que esté necesita. ">?</div>
                        </div>
                        <div>
                            <span
                                className={`switch_span switch_login ${state.tipo_usuario === TipoUsuario.TALENTO ? 'active' : ''}`}
                                onClick={() => {dispatch({type: 'update-form', value: {tipo_usuario: TipoUsuario.TALENTO}})} }
                            >
                                Talento
                            </span>
                            <div className="contToolTip" data-toggle="tooltip" data-placement="bottom" title="Perfil para la persona que busca aparecer en pantalla y proyectos de filmación.">?</div>
                        </div>
                        <div>
                            <span
                                className={`switch_span switch_login ${state.tipo_usuario === TipoUsuario.NO_DEFINIDO ? 'active' : ''}`}
                                onClick={() => {dispatch({type: 'update-form', value: {tipo_usuario: TipoUsuario.NO_DEFINIDO}})} }
                            >
                                Representante
                            </span>
                            <div className="contToolTip" data-toggle="tooltip" data-placement="bottom" title="Perfil para la persona que busca facilitar la conexión con sus talentos y encontrar más oportunidades para los mismos.">?</div>
                        </div>
                    </div>

                    <div className="text-center mt-3 pl-2 pr-2">
                        <button className="btn btn-intro btn-confirm mt-0" onClick={()=>{
                            signIn('credentials', {
                                user: state.user,
                                password: state.password,
                                tipo_usuario: state.tipo_usuario,
                                correo_usuario: state.user,
                                redirect: false,
                            }).then(res => {
                                if (res?.ok) {
                                    notify('success', 'Autenticacion Exitosa');
                                    router.push('/talento/dashboard');
                                }
                                console.log(res);
                            }).catch((err: Error) => {
                                notify('error', err.message);
                            });
                        }}>Log In</button>
                    </div>


                    <div className="text-center mt-3">
                        <p>O accede con</p>
                    </div>
                    <div className="d-lg-flex justify-content-center">
                        <div className="flex_half">
                            <a href="#" className="btn btn-intro btn-social btn-social-login mr-3 ml-3"><motion.img height="16" className="mr-2"
                                src="assets/img/iconos/google-logo.svg" alt="Google" />Google</a>
                        </div>
                        <div className="flex_half">
                            <a href="#" className="btn btn-intro btn-social btn-social-login mr-3 ml-3"><motion.img height="16" className="mr-2"
                                src="assets/img/iconos/facebook-logo.svg" alt="Facebook" />Facebook</a>
                        </div>
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

export default LoginPage;
