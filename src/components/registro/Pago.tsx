import { type FC } from 'react'
import { motion } from 'framer-motion'
import { FormGroup } from '../shared';

interface Props {
    setPaso: (paso: number | ((paso: number) => number)) => void;
}

export const Pago: FC<Props> = ({ setPaso }) => {

    const anteriorPaso = () => setPaso(paso => paso - 1)

  return (
    <>
        <h3 className="paso-stepper">
            Paso 3 <span> - pago</span>
        </h3>
        <div className=" ml-lg-5">
            <p className="color_a mt-3 font-weight-bold">Total: $3000 MXP</p>
            <p>Forma de pago</p>
            <div className="d-lg-flex">
                <div>
                    <a href="#" className="btn btn-intro btn-social btn-paywith">Crédito/Débito</a>
                </div>
                <div>
                    <a href="#" className="btn btn-intro btn-social btn-paywith">PayPal</a>
                </div>
            </div>
        </div>
        <div className="row ml-lg-5 mt-lg-4">
            <div className="col-md-3">
                <FormGroup label='Nombre en la tarjeta' id='tarjeta' />
            </div>
            <div className="col-md-4 offset-md-2">
                <label>Fecha de caducidad</label>
                <div className="d-lg-flex justify-content-around">
                <div className="pl-2 pr-2">
                    <select className="form-control form-control-sm select_custom">
                        <option>Enero</option>
                        <option>Febrero</option>
                        <option>Marzo</option>
                        <option>To-Be-Filled-By-Backend</option>
                    </select>
                </div>
                <div className="pl-2 pr-2">
                    <select className="form-control form-control-sm select_custom">
                        <option>2022</option>
                        <option>2021</option>
                        <option>2020</option>
                        <option>To-Be-Filled-By-Backend</option>
                    </select>
                </div>
                </div>
            </div>
        </div>
        <div className="row ml-lg-5 mt-lg-4">
            <div className="col-md-3">
                <FormGroup label='Número de tarjeta' id='numero_tarjeta' />
            </div>
            <div className="col-md-6 offset-md-2">
                <div className="d-lg-flex justify-content-around align-items-center">
                    <FormGroup label='CVV' id='cvv' />
                    <div className="pl-2 pr-2">
                        <p className="color_a small m-0">Código de 3 o 4 números al reverso de la tarjeta</p>
                    </div>
                </div>
            </div>
        </div>
        <div className="row ml-lg-5 mt-lg-4">
            <div className="col-md-7">
                <FormGroup label='Dirección' id='direccion_tarjeta' />
            </div>
            <div className="col-md-3">
                <FormGroup label='Ciudad' id='ciudad_tarjeta' />
            </div>
            <div className="col-md-2">
                <FormGroup label='C.P.' id='cp' />
            </div>
        </div>
        <div className="botones btn-l">
            <button className="boton-prev-step margen" type='button' onClick={anteriorPaso}>
                <motion.img src="assets/img/iconos/arow_l_blue.svg" /> Anterior Paso
            </button>
        </div>
    </>
  )
}
