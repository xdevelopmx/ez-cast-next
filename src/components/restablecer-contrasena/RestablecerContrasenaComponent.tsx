import Link from 'next/link'
import React from 'react'
import { CarrucelFondo } from '../shared'
import { motion } from 'framer-motion'

export const RestablecerContrasenaComponent = () => {
    return (
        <CarrucelFondo>
            <div className="box_cart_login">
                <div className="login_container text-center">
                    <motion.img className="logo_head_cart" src="/assets/img/iconos/EZ_Claqueta_N_S.svg" alt="icono" />
                    <p className="h1 text-uppercase mb-3 text-center">EZ-CAST</p>

                    <p className="text-muted">¿Olvidaste tu <span className="color_a">contraseña?</span></p>

                    <div className="d-lg-flex align-items-center justify-content-center p-2 box_input">
                        <div className="flex_half">
                            <label htmlFor="user">Email</label>
                        </div>
                        <div className="flex_one">
                            <input type="text" className="form-control form-control-sm text_custom login_custom m-0" />
                        </div>
                    </div>


                    <div className="text-center mt-3 pl-2 pr-2">
                        <a href="restablecer_pass02.html" className="btn btn-intro btn-confirm mt-0">Continuar</a>
                    </div>

                </div>
                <p className="text-white mt-2">Necesitas ayuda? Accede a nuestros
                    <Link href="/ayuda-ezcast" className="text-white">
                        <u>tutoriales y preguntas frecuentes.</u>
                    </Link>
                </p>
            </div>
        </CarrucelFondo>
    )
}
