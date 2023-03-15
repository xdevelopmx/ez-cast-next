import React from 'react'

export const Paso2 = () => {
  return (
    <>
      <div>
          <div className="d-lg-flex mt-5">
            <div>
              <p className="font-weight-bold mr-3">Paso 2</p>
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
    </>
  )
}
