import { motion } from 'framer-motion'
import Link from 'next/link'
import { FormularioRegistro } from './'

export const RegistroComponent = () => {
    return (
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
                    REGRESAR A INFORMACIÓN EZ-CAST
                </Link>
            </div>
            <FormularioRegistro />
        </>
    )
}
