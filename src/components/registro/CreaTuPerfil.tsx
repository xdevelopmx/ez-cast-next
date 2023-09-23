import { useEffect, type FC } from 'react'
import { motion } from 'framer-motion'
import { FormGroup } from '../shared'
import { type PerfilForm } from '~/pages/registro';
import Constants from '~/constants';
import useLang from "~/hooks/useLang";
import AppContext from "~/context/app";
import { useContext } from "react";
import { Button } from '@mui/material';
import { signIn, useSession } from 'next-auth/react';

interface Props {
    state: PerfilForm,
    onFormChange: (input: {[id: string]: unknown}) => void;
}

export const CreaTuPerfil: FC<Props> = ({ onFormChange, state }) => {
    console.log('state', state);
    const ctx = useContext(AppContext);
    const textos = useLang(ctx.lang);
    const sess = useSession();
    console.log(sess.data);
    useEffect(() => {
        if (sess.status === 'authenticated') {
            if (sess.data.user?.email) {
                onFormChange({
                    nombre: sess.data.user.name,
                    usuario: sess.data.user.name,
                    email: sess.data.user.email,
                }) 
            } 
        }
    }, [sess.status]);
    return (
        <>
            <div className="row ml-lg-5 mt-lg-4 jc-c">
                <div className="col-md-3">
                    <FormGroup 
                        error={state.errors.nombre}
                        show_error_message
                        value={state.nombre} 
                        onChange={(e) => { 
                            onFormChange({
                                nombre: e.currentTarget.value,
                                errors: {...state.errors, nombre: (!e.target.value || e.target.value.length < 2) ? 'El nombre es demasiado corto' : undefined}
                            }) 
                        }} 
                        label={textos["nombref"]?? ""} 
                    />
                </div>
                <div className="col-md-3 offset-md-2">
                    <FormGroup 
                        error={state.errors.apellido}
                        show_error_message
                        value={state.apellido} 
                        onChange={(e) => { 
                            onFormChange({
                                apellido: e.currentTarget.value,
                                errors: {...state.errors, apellido: (!e.target.value || e.target.value.length < 2) ? 'El apellido es demasiado corto' : undefined}
                            }) 
                        }} 
                        label={textos["apellidosf"]?? ""} 
                    />
                </div>
            </div>
            <div className="row ml-lg-5 mt-lg-4 jc-c">
                <div className="col-md-3">
                    <FormGroup 
                        error={state.errors.usuario}
                        show_error_message
                        value={state.usuario} 
                        onChange={(e) => { 
                            onFormChange({
                                usuario: e.currentTarget.value,
                                errors: {...state.errors, usuario: (!e.target.value || e.target.value.length < 2) ? 'El usuario es demasiado corto' : undefined}
                            })
                        }} 
                        label={textos["usuario"]?? ""} 
                    />
                </div>
                <div className="col-md-3 offset-md-2">
                    <FormGroup 
                        error={state.errors.email}
                        show_error_message
                        value={state.email} 
                        onChange={(e) => { 
                            onFormChange({
                                email: e.currentTarget.value,
                                errors: {...state.errors, email: (!Constants.PATTERNS.EMAIL.test(e.target.value)) ? 'El email es invalido' : undefined}
                            }) 
                        }} 
                        label={textos["mail"]?? ""} 
                        type="email" 
                    />
                </div>

            </div>
            <div className="row ml-lg-5 mt-lg-4 jc-c">
                <div className="col-md-3">
                    <FormGroup 
                        error={state.errors.contrasenia}
                        show_error_message
                        value={state.contrasenia} 
                        onChange={(e) => { 
                            onFormChange({
                                contrasenia: e.currentTarget.value,
                                errors: {...state.errors, contrasenia: (!e.target.value || e.target.value.length < 8) ? 'La contraseña es demasiado corto' : undefined}
                            })
                        }} 
                        label={textos["contra"]?? ""} 
                        type="password" 
                    />
                </div>
                <div className="col-md-3 offset-md-2">
                    <FormGroup 
                        error={state.errors.confirmacion_contrasenia}
                        show_error_message
                        value={state.confirmacion_contrasenia} 
                        onChange={(e) => { 
                            onFormChange({
                                confirmacion_contrasenia: e.currentTarget.value,
                                errors: {...state.errors, confirmacion_contrasenia: (!e.target.value || !state.contrasenia || state.contrasenia !== e.target.value) ? 'Las contraseñas no son la misma' : undefined}
                            })
                        }} 
                        label={textos["confirma_contra"]?? ""} 
                        type="password" 
                    />
                </div>
            </div>
            {!state.is_representante &&
                <div className="row ml-lg-5 jc-c">
                    <div className="col-md-4 text-center">
                        <div className="text-center">
                            <p>{textos["registrar_con"]?? ""}</p>
                        </div>
                        <div className="d-lg-flex">
                            <div className="flex_one">
                                <Button 
                                    onClick={async () => {
                                        await signIn('google');
                                    }}
                                    className="btn btn-intro btn-social mr-1 ml-1"
                                >
                                    <motion.img height="16" className="mr-2" src="assets/img/iconos/google-logo.svg" alt="" />Google
                                </Button>
                            </div>
                            <div className="flex_one">
                                <Button 
                                    onClick={async () => {
                                        await signIn('facebook');
                                    }}
                                    className="btn btn-intro btn-social mr-1 ml-1"
                                >
                                    <motion.img height="16" className="mr-2" src="assets/img/iconos/facebook-logo.svg" alt="" />Facebook
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}
