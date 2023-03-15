import { type FC } from 'react'
import { motion } from 'framer-motion'

interface Props {
    setPaso: (paso: number | ((paso: number) => number)) => void;
}

export const TipoDeMembresia: FC<Props> = ({ setPaso }) => {

    const siguientePaso = () => setPaso(paso => paso + 1)
    const anteriorPaso = () => setPaso(paso => paso - 1)

  return (
    <>
        <h3 className="paso-stepper">
            Paso 2 <span> - tipo de membresía</span>
        </h3>
        <div className="d-lg-flex ml-lg-5 mt-lg-4 jc-c">
            <div className="mr-2 ml-2 mt-2">
                <select className="form-control form-control-sm select_custom">
                    <option>Talento</option>
                    <option>Cazatalento</option>
                    <option>Representante</option>
                </select>
            </div>
            <div className="mr-2 ml-2 mt-2">
                <select className="form-control form-control-sm select_custom">
                    <option>Gratis</option>
                    <option>Standard</option>
                    <option>Premium</option>
                    <option>Executive</option>
                </select>
            </div>
            <div className="mr-2 ml-2 mt-2">
                <select className="form-control form-control-sm select_custom">
                    <option>Anual</option>
                    <option>Mensual</option>
                </select>
            </div>
        </div>
        <div className="botones">
            <button className="boton-prev-step margen" type='button' onClick={anteriorPaso}>
                <motion.img src="assets/img/iconos/arow_l_blue.svg" /> Anterior Paso
            </button>
            <button className="boton-next-step margen" type='button' onClick={siguientePaso}>
                Siguiente Paso <motion.img src="assets/img/iconos/arow_r_blue.svg" />
            </button>
        </div>
    </>
  )
}
