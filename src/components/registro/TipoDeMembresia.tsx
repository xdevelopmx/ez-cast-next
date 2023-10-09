import { useContext, type FC } from 'react'
import { motion } from 'framer-motion'
import { TipoUsuario, TipoMembresia, TipoCobro } from '~/enums';
import AppContext from '~/context/app';
import useLang from '~/hooks/useLang';

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

    const ctx = useContext(AppContext);
    const textos = useLang(ctx.lang);
    
    return (
    <>
        <div className="d-lg-flex ml-lg-5 mt-lg-4 jc-c" style={{ gap: '40px'}}>
            <div className="mr-2 ml-2 mt-2">
                <select value={state.tipo_usuario} onChange={(e) => {onFormChange({tipo_usuario: e.currentTarget.value})}} className="form-control form-control-sm select_custom" style={{fontSize:18}}>
                    <option value={TipoUsuario.TALENTO}>{`${textos['talento']}`}</option>
                    {!state.is_representante &&
                        <>
                            <option value={TipoUsuario.CAZATALENTOS}>{`${textos['cazatalentos']}`}</option>
                            {/**
                            <option value={TipoUsuario.REPRESENTANTE}>Representante</option>
                             */}
                        </>
                    }
                </select>
            </div>
            <div className="mr-2 ml-2 mt-2">
                <select value={state.tipo_membresia} onChange={(e) => {onFormChange({tipo_membresia: e.currentTarget.value})}} className="form-control form-control-sm select_custom" style={{fontSize:18}}>
                    <option value={TipoMembresia.GRATIS}>{ctx.lang === 'en' ? TipoMembresia.GRATIS_EN : TipoMembresia.GRATIS}</option>
                    <option value={TipoMembresia.STANDARD}>{TipoMembresia.STANDARD}</option>
                    <option value={TipoMembresia.PREMIUM}>{TipoMembresia.PREMIUM}</option>
                    <option value={TipoMembresia.STANDARD}>{TipoMembresia.EXECUTIVE}</option>
                </select>
            </div>
            {state.tipo_membresia !== TipoMembresia.GRATIS &&
                <div className="mr-2 ml-2 mt-2">
                    <select value={state.cobro_membresia} onChange={(e) => {onFormChange({cobro_membresia: e.currentTarget.value})}} className="form-control form-control-sm select_custom" style={{fontSize:18}}>
                        <option value={TipoCobro.ANUAL}>{ctx.lang === 'es' ? TipoCobro.ANUAL : TipoCobro.ANUAL_EN}</option>
                        <option value={TipoCobro.MENSUAL}>{ctx.lang === 'es' ? TipoCobro.MENSUAL : TipoCobro.MENSUAL_EN}</option>
                    </select>
                </div>
            }
        </div>
    </>
  )
}
