import React from 'react'

import { motion } from 'framer-motion'
import { Paso1 } from '../paso1'
import { Paso2 } from '../paso2'
import { Paso3 } from '../paso3'

export const RegistroGeneral = () => {
  return (
    <>
        <div className="intro_container text-center ezcast_container pb-3">
        <motion.img src="assets/img/iconos/EZ_Claqueta_N_S.svg" className="logo_head_registro" />
        <p className="h1 text-uppercase text-white m-0">Registro EZ-CAST</p>
      </div>
      <div className="intro_container">
        <a href="./" className="text-dark">
          <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
            x="0px" y="0px" width="18px" viewBox="0 0 18.5 15.8" style={{background: 'new 0 0 18.5 15.8'}}>
            <path id="Path_1_2_" className="st0" d="M24.2,4.7" />
            <path className="st0"
              d="M12.9,3.8H4l1.7-1.7c0.4-0.4,0.4-1,0-1.4c-0.4-0.4-1-0.4-1.4,0L0.9,4.1c-0.4,0.4-0.4,1,0,1.4l3.4,3.4 c0.4,0.4,1,0.4,1.4,0c0.4-0.4,0.4-1,0-1.4L4,5.8h8.9c1.5,0,3.2,0.4,3.2,3.8c0,3.8-2.6,3.8-3.4,3.8H3c-0.6,0-1,0.4-1,1s0.4,1,1,1h9.7 c3.5,0,5.4-2.1,5.4-5.8C18.1,5.9,16.3,3.8,12.9,3.8z" />
          </svg>
          &nbsp;REGRESAR A INFORMACIÓN EZ-CAST
        </a>
        <Paso1 />
        <Paso2 />
        <Paso3 />
        {/* <div>
          <div className="d-lg-flex mt-5">
            <div>
              <p className="font-weight-bold mr-3">Paso 4</p>
            </div>
            <div>
              <p className="color_a">Aceptar términos y condiciones</p>
            </div>
          </div>
          <hr className="m-0" />
        </div>
        <div className=" ml-lg-5 mt-lg-4">
          <a href="#" className="text-dark"><u>Leer término y condiciones</u></a>
          <div className="form-check">
            <input className="form-check-input" type="checkbox" value="" id="defaultCheck1" />
            <label className="form-check-label" htmlFor="defaultCheck1">
              Acepto términos y condiciones
            </label>
          </div>
          <a href="#" className="text-dark"><u>Leer aviso de privacidad</u></a>
          <div className="form-check">
            <input className="form-check-input" type="checkbox" value="" id="privacity" />
            <label className="form-check-label" htmlFor="privacity">
              Acepto aviso de privacidad
            </label>
          </div>
        </div>
        <div>
          <div className="d-lg-flex mt-5">
            <div>
              <p className="font-weight-bold mr-3">Paso 5</p>
            </div>
            <div>
              <p className="color_a">Verificación de identidad</p>
            </div>
          </div>
          <hr className="m-0">
        </div>
        <div className=" ml-lg-5 mt-lg-4">
          <button className="btn btn-intro">Reconocimiento facial</button>
        </div> */}
        <div className="text-center">
          <a href="#" className="btn btn-intro btn-confirm">
            Confirmar
          </a>
        </div>
      </div>
    </>
  )
}
