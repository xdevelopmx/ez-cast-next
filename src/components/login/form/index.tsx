import React, { useReducer, useState } from 'react'

import { motion } from 'framer-motion'
import { type tipo_usuario } from '~/interfaces'
import { useLogin } from '../hooks/useLogin'
import Link from 'next/link'
import { CarrucelFondo } from '~/components/shared'
import { signIn } from 'next-auth/react'
import { TipoUsuario } from '~/server/auth'

type LoginForm = {
    user: string,
    password: string,
    tipo_usuario: TipoUsuario,
    correo_usuario: string,
} 

function reducer(state: LoginForm, action: {type: string, value: {[key: string]: string | TipoUsuario}}) {
    if (action.type === 'update-form') {
      return { ...state, ...action.value }
    }
    throw Error(`Accion no definida ${action.type}`)
  }

export const LoginForm = () => {

    const [state, dispatch] = useReducer(reducer, null);

    const [tipoUsuario, setTipoUsuario] = useState<tipo_usuario>('cazatalentos')
    const { estaSeleccionado } = useLogin()

    return (
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
                            <input type="text" className="form-control form-control-sm text_custom login_custom m-0" id="user" />
                        </div>
                    </div>
                    <div className="d-lg-flex align-items-center justify-content-center p-2 box_input">
                        <div className="flex_half">
                            <label htmlFor="password">Contraseña</label>
                        </div>
                        <div className="flex_one">
                            <input type="password" className="form-control form-control-sm text_custom login_custom m-0" id="password" />
                        </div>
                    </div>
                    <p className="text-muted">Olvido contraseña? <Link href="/restablecer-contrasena" className="color_a">Restablecer</Link></p>
                    <p>Ingresar como</p>

                    <div className="d-flex align-items-center justify-content-center text-center flex-wrap">
                        <div>
                            <span
                                className={`switch_span switch_login ${estaSeleccionado('cazatalentos', tipoUsuario) ? 'active' : ''}`}
                                onClick={() => setTipoUsuario('cazatalentos')}
                            >
                                Cazatalentos
                            </span>
                            <div className="contToolTip" data-toggle="tooltip" data-placement="bottom" title="Perfil para la persona que busca “cazar” a una persona que cumpla con los requerimientos y el talento que esté necesita. ">?</div>
                        </div>
                        <div>
                            <span
                                className={`switch_span switch_login ${estaSeleccionado('talento', tipoUsuario) ? 'active' : ''}`}
                                onClick={() => setTipoUsuario('talento')}
                            >
                                Talento
                            </span>
                            <div className="contToolTip" data-toggle="tooltip" data-placement="bottom" title="Perfil para la persona que busca aparecer en pantalla y proyectos de filmación.">?</div>
                        </div>
                        <div>
                            <span
                                className={`switch_span switch_login ${estaSeleccionado('administrador', tipoUsuario) ? 'active' : ''}`}
                                onClick={() => setTipoUsuario('administrador')}
                            >
                                Representante
                            </span>
                            <div className="contToolTip" data-toggle="tooltip" data-placement="bottom" title="Perfil para la persona que busca facilitar la conexión con sus talentos y encontrar más oportunidades para los mismos.">?</div>
                        </div>
                    </div>

                    <div className="text-center mt-3 pl-2 pr-2">
                        <button className="btn btn-intro btn-confirm mt-0" onClick={()=>{
                            signIn('credentials', {
                                user: 'tester',
                                password: 'lolxd',
                                tipo_usuario: 'talento',
                                correo_usuario: '',
                                redirect: false,
                            }).then(res => {
                                console.log(res);
                            }).catch(console.log);
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
    )
}
