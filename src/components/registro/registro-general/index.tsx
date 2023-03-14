import React from 'react'

import { motion } from 'framer-motion'

export const RegistroGeneral = () => {
  return (
    <>
        <div className="intro_container text-center ezcast_container pb-3">
        <motion.img src="assets/img/iconos/EZ_Claqueta_N_S.svg" className="logo_head_registro" />
        <p className="h1 text-uppercase text-white m-0">Registro EZ-CAST</p>
      </div>
      <div className="intro_container">
        <a href="intro_ezcast.html" className="text-dark">
          <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
            x="0px" y="0px" width="18px" viewBox="0 0 18.5 15.8" style={{background: 'new 0 0 18.5 15.8'}}>
            <path id="Path_1_2_" className="st0" d="M24.2,4.7" />
            <path className="st0"
              d="M12.9,3.8H4l1.7-1.7c0.4-0.4,0.4-1,0-1.4c-0.4-0.4-1-0.4-1.4,0L0.9,4.1c-0.4,0.4-0.4,1,0,1.4l3.4,3.4 c0.4,0.4,1,0.4,1.4,0c0.4-0.4,0.4-1,0-1.4L4,5.8h8.9c1.5,0,3.2,0.4,3.2,3.8c0,3.8-2.6,3.8-3.4,3.8H3c-0.6,0-1,0.4-1,1s0.4,1,1,1h9.7 c3.5,0,5.4-2.1,5.4-5.8C18.1,5.9,16.3,3.8,12.9,3.8z" />
          </svg>
          &nbsp;REGRESAR A INFORMACIÓN EZ-CAST
        </a>
        <div>
          <div className="d-lg-flex mt-5">
            <div>
              <p className="font-weight-bold mr-3">Paso 1</p>
            </div>
            <div>
              <p className="color_a">Tipo de membresía</p>
            </div>
          </div>
          <hr className="m-0" />
        </div>
        <div className="d-lg-flex ml-lg-5 mt-lg-4">
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
        <div>
          <div className="d-lg-flex mt-5">
            <div>
              <p className="font-weight-bold mr-3">Paso 2</p>
            </div>
            <div>
              <p className="color_a">Crea tu perfil </p>
            </div>
          </div>
          <hr className="m-0" />
        </div>
        <div className="row ml-lg-5 mt-lg-4">
          <div className="col-md-3">
            <div className="form-group">
              <label htmlFor="username">Nombre de usuario</label>
              <input type="text" className="form-control form-control-sm text_custom" id="username" />
            </div>
          </div>
          <div className="col-md-3 offset-md-2">
            <div className="form-group">
              <label htmlFor="Email">Email</label>
              <input type="Email" className="form-control form-control-sm text_custom" id="Email" />
            </div>
          </div>
        </div>
        <div className="row ml-lg-5">
          <div className="col-md-3">
            <div className="form-group">
              <label htmlFor="Contrasenia">Contraseña</label>
              <input type="password" className="form-control form-control-sm text_custom" id="Contrasenia" />
            </div>
          </div>
          <div className="col-md-3 offset-md-2">
            <div className="form-group">
              <label htmlFor="contrasenia_confirm">Confirma contraseña</label>
              <input type="password" className="form-control form-control-sm text_custom" id="contrasenia_confirm" />
            </div>
          </div>
        </div>
        <div className="row ml-lg-5">
          <div className=" offset-md-2 col-md-4 text-center">
            <div className="text-center">
              <p>O registrate con</p>
            </div>
            <div className="d-lg-flex">
              <div className="flex_one">
                <a href="#" className="btn btn-intro btn-social mr-1 ml-1"><motion.img height="16" className="mr-2"
                    src="assets/img/iconos/google-logo.svg" />Google</a>
              </div>
              <div className="flex_one">
                <a href="#" className="btn btn-intro btn-social mr-1 ml-1"><motion.img height="16" className="mr-2"
                    src="assets/img/iconos/facebook-logo.svg" />Facebook</a>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="d-lg-flex mt-5">
            <div>
              <p className="font-weight-bold mr-3">Paso 3</p>
            </div>
            <div>
              <p className="color_a">Pago</p>
            </div>
          </div>
          <hr className="m-0" />
        </div>
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
            <div className="form-group">
              <label htmlFor="card_name">Nombre en la tarjeta</label>
              <input type="text" className="form-control form-control-sm text_custom" id="card_name" />
            </div>
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
            <div className="form-group">
              <label htmlFor="card_number">Número de tarjeta</label>
              <input type="number" className="form-control form-control-sm text_custom" id="card_number" />
            </div>
          </div>
          <div className="col-md-6 offset-md-2">
            <label>CVV</label>
            <div className="d-lg-flex justify-content-around align-items-center">
              <div>
                <input type="number" className="form-control form-control-sm text_custom" id="cvv" />
              </div>
              <div className="pl-2 pr-2">
                <p className="color_a small m-0">Código de 3 o 4 números al reverso de la tarjeta</p>
              </div>
            </div>
          </div>
        </div>
        <div className="row ml-lg-5 mt-lg-4">
          <div className="col-md-7">
            <div className="form-group">
              <label htmlFor="card_number">Dirección</label>
              <input type="number" className="form-control form-control-sm text_custom" id="card_number" />
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <label htmlFor="card_number">Ciudad</label>
              <input type="number" className="form-control form-control-sm text_custom" id="card_number" />
            </div>
          </div>
          <div className="col-md-2">
            <div className="form-group">
              <label htmlFor="card_number">C.P.</label>
              <input type="number" className="form-control form-control-sm text_custom" id="card_number" />
            </div>
          </div>
        </div>
        <div>
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
        {/* <div>
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
