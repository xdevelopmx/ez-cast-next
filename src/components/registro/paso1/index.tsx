import React from 'react'

import { motion } from 'framer-motion'

export const Paso1 = () => {
  return (
    <>
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
    </>
  )
}
