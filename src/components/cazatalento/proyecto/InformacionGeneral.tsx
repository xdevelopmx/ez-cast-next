import React from 'react'
import { FormGroup } from '~/components'

export const InformacionGeneral = () => {
    return (
        <>
            <div>
                <div className="d-lg-flex mt-5">
                    <div>
                        <p className="font-weight-bold mr-3">Paso 1</p>
                    </div>
                    <div>
                        <p className="color_a">Información General </p>
                    </div>
                </div>
                <hr className="m-0" />
            </div>
            <div className="row mt-lg-4">
                <div className="col-md-3 mr-md-5">
                    <FormGroup label='Nombre de proyecto*' />
                </div>
                <div className="col-md-3 mr-md-5">
                    <label htmlFor="username">Sindicato*</label>
                    <select className="form-control form-control-sm select_custom sc_var_b">
                        <option value="">Selecciona una opción</option>
                        <option>Sin unión</option>
                        <option>Sin afiliación sindical</option>
                        <option>ANDA</option>
                        <option>SAG-AFTRA</option>
                        <option>Otro</option>
                    </select>
                    <div className="invalid-feedback">Este campo es obligatorio</div>
                </div>
                <div className="col-md-3 mr-md-5">
                    <div className="d-flex">
                        <label htmlFor="username">Tipo de proyecto*</label>
                        <div className="contToolTip" data-toggle="tooltip" data-html="true" data-placement="bottom" title="<b>Asegúrate de seleccionar el tipo de proyecto adecuado para ti.</b><br/>Ten en cuenta que una vez que selecciones un tipo de proyecto y lo hayas creado, no podrás cambiarlo.
                Para obtener más orientación, consulta nuestra documentación de ayuda y tutoriales.<br>">?</div>
                    </div>
                    <select className="form-control form-control-sm select_custom sc_var_b">
                        <option value="">Selecciona una opción</option>
                        <option>App Movil</option>
                        <option>Audio Libro</option>
                        <option>Comercial</option>
                        <option>Comercial para Internet</option>
                        <option>Cortometraje</option>
                        <option>Desfile de Modas (pasarela) </option>
                        <option>Documental</option>
                        <option>Drama diurno</option>
                        <option>Embajador de una marca</option>
                        <option>Evento en vivo</option>
                        <option>Evento promocional</option>
                        <option>Filmación estudiantil</option>
                        <option>Fotografía de stock</option>
                        <option>Industrial </option>
                        <option>Infomercial</option>
                        <option>Largometraje</option>
                        <option>Mini Serie</option>
                        <option>Música</option>
                        <option>Narración (Voz en off)</option>
                        <option>Piloto de Serie</option>
                        <option>Podcast</option>
                        <option>Programa de concursos</option>
                        <option>Programa de entrevistas</option>
                        <option>Proyecto estudiantil</option>
                        <option>Radio</option>
                        <option>Realidad Virtual</option>
                        <option>Reality Show</option>
                        <option>Recreación de concepto</option>
                        <option>Reel del Director</option>
                        <option>Serie de transmisión</option>
                        <option>Serie de TV</option>
                        <option>Serie Web</option>
                        <option>Show de comedia</option>
                        <option>Teatro</option>
                        <option>Video corto</option>
                        <option>Video Juego</option>
                        <option>Video Musical</option>
                    </select>
                    <div className="invalid-feedback">Este campo es obligatorio</div>
                </div>
            </div>
            <div className="row mt-lg-5">
                <div className="col-md-3 mr-md-5"></div>
                <div className="col-md-3 mr-md-5">
                    <FormGroup label='Nombre de sindicato' />
                </div>
                <div className="col-md-3 mr-md-5">
                    <FormGroup label='Otro' />
                </div>
            </div>
        </>
    )
}
