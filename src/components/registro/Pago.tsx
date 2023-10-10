import { useContext, type FC } from 'react'
import { motion } from 'framer-motion'
import { FormGroup } from '../shared';
import AppContext from '~/context/app';
import useLang from '~/hooks/useLang';

interface Props {
    onFormChange: (input: {[id: string]: (string | number)}) => void;
}

export const Pago: FC<Props> = ({ onFormChange }) => {

    const ctx = useContext(AppContext);
  	const textos = useLang(ctx.lang);

  return (
    <>
        <div className=" ml-lg-5">
            <p className="color_a mt-3 font-weight-bold">Total: $3000 MXP</p>
            <p>{`${textos['forma_pago']}`}</p>
            <div className="d-lg-flex">
                <div>
                    <a href="#" className="btn btn-intro btn-social btn-paywith">{`${textos['credito_o_debito']}`}</a>
                </div>
                <div>
                    <a href="#" className="btn btn-intro btn-social btn-paywith">PayPal</a>
                </div>
            </div>
        </div>
        <div className="row ml-lg-5 mt-lg-4">
            <div className="col-md-3">
                <FormGroup label={`${textos['nombre_en_tarjeta']}`} id='tarjeta' />
            </div>
            <div className="col-md-4 offset-md-2">
                <label>{`${textos['fecha_de_caducidad']}`}</label>
                <div className="d-lg-flex justify-content-around">
                <div className="pl-2 pr-2">
                    <select className="form-control form-control-sm select_custom">
                        {`${textos['months_list']}`.split(',').map(m => {
                            return <option value={m}>{m}</option>
                        })}
                    </select>
                </div>
                <div className="pl-2 pr-2">
                    <select className="form-control form-control-sm select_custom">
                        {Array.from({length: 10}).map((_, i) => {
                            const curr_year = new Date().getFullYear();
                            return <option value={curr_year + (i + 1)}>{curr_year + (i + 1)}</option>
                        })}
                    </select>
                </div>
                </div>
            </div>
        </div>
        <div className="row ml-lg-5 mt-lg-4">
            <div className="col-md-3">
                <FormGroup label={`${textos['numero_de_tarjeta']}`} id='numero_tarjeta' />
            </div>
            <div className="col-md-6 offset-md-2">
                <div className="d-lg-flex justify-content-around align-items-center">
                    <FormGroup label='CVV' id='cvv' />
                    <div className="pl-2 pr-2">
                        <p className="color_a small m-0">{`${textos['cvv_message']}`}</p>
                    </div>
                </div>
            </div>
        </div>
        <div className="row ml-lg-5 mt-lg-4">
            <div className="col-md-7">
                <FormGroup label={`${textos['direccion']}`} id='direccion_tarjeta' />
            </div>
            <div className="col-md-3">
                <FormGroup label={`${textos['ciudad']}`} id='ciudad_tarjeta' />
            </div>
            <div className="col-md-2">
                <FormGroup label={`${textos['cp']}`} id='cp' />
            </div>
        </div>
    </>
  )
}
