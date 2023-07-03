import { type FC } from 'react'
import { motion } from 'framer-motion'
import { TipoUsuario, TipoMembresia, TipoCobro } from '~/enums';

interface Props {
    state: {
        tipo_usuario: TipoUsuario,
        tipo_membresia: TipoMembresia,
        cobro_membresia: TipoCobro,
        is_representante: boolean
    },
    onFormChange: (input: {[id: string]: unknown}) => void;
}

export const TipoDeMembresia: FC<Props> = ({  onFormChange, state  }) => {

    
  return (
    <>
        <div className="d-lg-flex ml-lg-5 mt-lg-4 jc-c">
            <div className="mr-2 ml-2 mt-2">
                <select value={state.tipo_usuario} onChange={(e) => {onFormChange({tipo_usuario: e.currentTarget.value})}} className="form-control form-control-sm select_custom">
                    <option value={TipoUsuario.TALENTO}>Talento</option>
                    {!state.is_representante &&
                        <>
                            <option value={TipoUsuario.CAZATALENTOS}>Cazatalento</option>
                            <option value={TipoUsuario.REPRESENTANTE}>Representante</option>
                        </>
                    }
                </select>
            </div>
            <div className="mr-2 ml-2 mt-2">
                <select value={state.tipo_membresia} onChange={(e) => {onFormChange({tipo_membresia: e.currentTarget.value})}} className="form-control form-control-sm select_custom">
                    <option value={TipoMembresia.GRATIS}>{TipoMembresia.GRATIS}</option>
                    <option value={TipoMembresia.STANDARD}>{TipoMembresia.STANDARD}</option>
                    <option value={TipoMembresia.PREMIUM}>{TipoMembresia.PREMIUM}</option>
                    <option value={TipoMembresia.STANDARD}>{TipoMembresia.EXECUTIVE}</option>
                </select>
            </div>
            {state.tipo_membresia !== TipoMembresia.GRATIS &&
                <div className="mr-2 ml-2 mt-2">
                    <select value={state.cobro_membresia} onChange={(e) => {onFormChange({cobro_membresia: e.currentTarget.value})}} className="form-control form-control-sm select_custom">
                        <option value={TipoCobro.ANUAL}>Anual</option>
                        <option value={TipoCobro.MENSUAL}>Mensual</option>
                    </select>
                </div>
            }
        </div>
    </>
  )
}
