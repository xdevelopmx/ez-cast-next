import { type FC } from 'react'
import { motion } from 'framer-motion'
import { FormGroup } from '../shared'

interface Props {
    state: {
        nombre: string,
        apellido: string,
        usuario: string,
        email: string,
        contrasenia: string,
        confirmacion_contrasenia: string
    },
    onFormChange: (input: {[id: string]: (string | number)}) => void;
}

export const CreaTuPerfil: FC<Props> = ({ onFormChange, state }) => {

    return (
        <>
            <div className="row ml-lg-5 mt-lg-4 jc-c">
                <div className="col-md-3">
                    <FormGroup value={state.nombre} onChange={(e) => { onFormChange({nombre: e.currentTarget.value}) }} label='Nombre' />
                </div>
                <div className="col-md-3 offset-md-2">
                    <FormGroup value={state.apellido} onChange={(e) => { onFormChange({apellido: e.currentTarget.value}) }} label='Apellidos' />
                </div>
            </div>
            <div className="row ml-lg-5 mt-lg-4 jc-c">
                <div className="col-md-3">
                    <FormGroup value={state.usuario} onChange={(e) => { onFormChange({usuario: e.currentTarget.value}) }} label='Usuario' />
                </div>
                <div className="col-md-3 offset-md-2">
                    <FormGroup value={state.email} onChange={(e) => { onFormChange({email: e.currentTarget.value}) }} label='Correo electrónico' type="email" />
                </div>

            </div>
            <div className="row ml-lg-5 mt-lg-4 jc-c">
                <div className="col-md-3">
                    <FormGroup value={state.contrasenia} onChange={(e) => { onFormChange({contrasenia: e.currentTarget.value}) }} label='Contraseña' type="password" />
                </div>
                <div className="col-md-3 offset-md-2">
                    <FormGroup value={state.confirmacion_contrasenia} onChange={(e) => { onFormChange({confirmacion_contrasenia: e.currentTarget.value}) }} label='Repetir Contraseña' type="password" />
                </div>
            </div>
            <div className="row ml-lg-5 jc-c">
                <div className="col-md-4 text-center">
                    <div className="text-center">
                        <p>O registrate con</p>
                    </div>
                    <div className="d-lg-flex">
                        <div className="flex_one">
                            <a href="#" className="btn btn-intro btn-social mr-1 ml-1">
                                <motion.img height="16" className="mr-2" src="assets/img/iconos/google-logo.svg" alt="" />Google
                            </a>
                        </div>
                        <div className="flex_one">
                            <a href="#" className="btn btn-intro btn-social mr-1 ml-1">
                                <motion.img height="16" className="mr-2" src="assets/img/iconos/facebook-logo.svg" alt="" />Facebook
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
