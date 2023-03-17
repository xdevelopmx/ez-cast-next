import React from 'react'

export const ListadoProductos = () => {
  return (
    <>
        <div className="row title_list_proyects">
        <div className="col d-lg-flex mt-5">
          <div>
            <p className="font-weight-bold h2 mr-3 mb-2">Proyectos</p>
          </div>
          <div>
            <a href="#" className="btn btn-intro btn-price mb-2">Nuevo proyecto</a>
          </div>
        </div>
      </div>
      <div className="row mt-2">
        <div className="col container_list_proyects">
          <div className="row">
            <ul className="nav nav-tabs col" id="myTab" role="tablist">
              <li className="nav-item">
                <a className="nav-link active" id="activos-tab" data-toggle="tab" href="#activos" role="tab"
                  aria-controls="activos" aria-selected="true">Activos</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" id="archivados-tab" data-toggle="tab" href="#archivados" role="tab"
                  aria-controls="archivados" aria-selected="false">Archivados</a>
              </li>
            </ul>
          </div>
          <div className="row d-lg-flex head_list_proyects">
            <div className="col-4">
              <p>Nombre</p>
            </div>
            <div className="col-2">
              <p>Estado</p>
            </div>
            <div className="col-2">
              <p>Tipo</p>
            </div>
            <div className="col-2">
              <p>Fecha</p>
            </div>
          </div>
          <div className="row">
            <div className="tab-content box_list_proyects col" id="myTabContent">
              <div className="tab-pane fade show active" id="activos" role="tabpanel" aria-labelledby="activos-tab">
                <div className="box_message_blue">
                  <p className="h3">No has creado ningún proyecto</p>
                  <p>Al crear un proyecto, aquí tendrás una vista general de tus proyectos activos e inactivos.<br />
                    Recuerda crear todos tus roles y leer los requisitos de aprobación antes de terminar y
                    mandarlos.<br />
                    ¡Comienza ahora mismo!</p>
                </div>
              </div>
              <div className="tab-pane fade" id="archivados" role="tabpanel" aria-labelledby="archivados-tab">
                <div className="box_message_blue">
                  <p className="h3">No has archivado ningún proyecto</p>
                  <p>Al crear un proyecto, aquí tendrás una vista general de tus proyectos activos e inactivos.<br />
                    Recuerda crear todos tus roles y leer los requisitos de aprobación antes de terminar y
                    mandarlos.<br />
                    ¡Comienza ahora mismo!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
