import React from 'react'

export const Paso3 = () => {
  return (
    <>
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
    </>
  )
}
