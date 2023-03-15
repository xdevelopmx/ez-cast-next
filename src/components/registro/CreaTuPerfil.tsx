import { type FC } from 'react'
import { motion } from 'framer-motion'
import { FormGroup } from '../shared'

interface Props {
    setPaso: (paso: number | ((paso: number) => number)) => void;
}

export const CreaTuPerfil: FC<Props> = ({ setPaso }) => {

    const siguientePaso = () => setPaso(paso => paso + 1)

    return (
        <>
            <h3 className="paso-stepper">
                Paso 1 <span>Crea tu perfil</span>
            </h3>
            <div className="row ml-lg-5 mt-lg-4">
                <div className="col-md-3">
                    <FormGroup label='Nombre' />
                </div>
                <div className="col-md-3 offset-md-2">
                    <FormGroup label='Apellidos' />
                </div>
            </div>
            <div className="row ml-lg-5 mt-lg-4">
                <div className="col-md-3">
                    <FormGroup label='Usuario' />
                </div>
                <div className="col-md-3 offset-md-2">
                    <FormGroup label='Correo electrónico' type="email" />
                </div>

            </div>
            <div className="row ml-lg-5 mt-lg-4">
                <div className="col-md-3">
                    <FormGroup label='Contraseña' type="password" />
                </div>
                <div className="col-md-3 offset-md-2">
                    <FormGroup label='Repetir Contraseña' type="password" />
                </div>
            </div>
            <div className="row ml-lg-5">
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
            <div className="text-ar">
                <button className="boton-next-step margen" type='button' onClick={siguientePaso}>
                    Siguiente Paso <motion.img src="assets/img/iconos/arow_r_blue.svg" />
                </button>
            </div>

        </>
    )
}
