import Head from 'next/head'
import React from 'react'
import { Flotantes, MainLayout, MenuLateral } from '~/components'
import { motion } from 'framer-motion'

const index = () => {
    return (
        <>
            <Head>
                <title>DashBoard ~ Cazatalentos | Talent Corner</title>
                <meta name="description" content="Talent Corner" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <MainLayout menuSiempreBlanco={true}>
                <div className="d-flex wrapper_ezc">
                    <MenuLateral />
                    <div className="seccion_container col">
                        <div className="container_box_header">
                            <div className="d-flex justify-content-end align-items-start py-2">
                                <div className="pt-4 container_alerts_header">
                                    <div className="d-flex justify-content-end btn_alerts_header">
                                        <div className="box_alert_header mr-4">
                                            <motion.img src="/assets/img/iconos/bell_blue.svg" alt="" />
                                            <span className="count_msn active">2</span>
                                        </div>
                                        <p className="font-weight-bold h4 mr-5 mb-0 color_a">Tus alertas</p>
                                    </div>
                                    <div className="box_alerts_list">
                                        <div className="d-flex justify-content-end pt-3 p-b5 control_alerts">
                                            <motion.img src="/assets/img/iconos/eye_blue.svg" alt="icono" />
                                            <a href="#">Ver todas</a>
                                            <motion.img src="/assets/img/iconos/check_blue.svg" alt="icono" />
                                            <p>Marcar todas como leídas</p>
                                        </div>
                                        <div className="scroll_alerts_list">
                                            <div className="d-flex align-items-center item_alerts_list active">
                                                <div className="mr-1 mark_status_alerts">
                                                    <motion.img src="/assets/img/iconos/dot_red.svg" alt="marker" />
                                                </div>
                                                <div>
                                                    <p>
                                                        ¡Tu proyecto <b>“Nombre de proyecto”</b> ha sido <span>aprobado</span> con éxito! Te recomendamos
                                                        estar atento a las aplicaciones que recibas para así encontrar y reclutar a <a href="#">tu talento
                                                            lo más pronto</a> posible
                                                    </p>
                                                </div>
                                                <div className="ctrl_not_edit ml-auto">
                                                    <motion.img src="/assets/img/iconos/control_rol_edit.svg" alt="icono" />
                                                    <div className="box_ctrl_not_edit">
                                                        <p>Marcar como leído</p>
                                                        <p>Eliminar</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="d-flex align-items-center item_alerts_list active">
                                                <div className="mr-1 mark_status_alerts">
                                                    <motion.img src="/assets/img/iconos/dot_red.svg" alt="marker" />
                                                </div>
                                                <div>
                                                    <p>
                                                        ¡Tu proyecto <b>“Nombre de proyecto”</b> ha sido <span>aprobado</span> con éxito! Te recomendamos
                                                        estar atento a las aplicaciones que recibas para así encontrar y reclutar a tu talento lo más
                                                        pronto posible
                                                    </p>
                                                </div>
                                                <div className="ctrl_not_edit ml-auto">
                                                    <motion.img src="/assets/img/iconos/control_rol_edit.svg" alt="icono" />
                                                    <div className="box_ctrl_not_edit">
                                                        <p>Marcar como leído</p>
                                                        <p>Eliminar</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="d-flex align-items-center item_alerts_list acvive">
                                                <div className="mr-1 mark_status_alerts">
                                                    <motion.img src="/assets/img/iconos/dot_red.svg" alt="marker" />
                                                </div>
                                                <div>
                                                    <p>
                                                        ¡Tu proyecto <b>“Nombre de proyecto”</b> ha sido <span>aprobado</span> con éxito! Te recomendamos
                                                        estar atento a las aplicaciones que recibas para así encontrar y reclutar a tu talento lo más
                                                        pronto posible
                                                    </p>
                                                </div>
                                                <div className="ctrl_not_edit ml-auto">
                                                    <motion.img src="/assets/img/iconos/control_rol_edit.svg" alt="icono" />
                                                    <div className="box_ctrl_not_edit">
                                                        <p>Marcar como leído</p>
                                                        <p>Eliminar</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="d-flex align-items-center item_alerts_list">
                                                <div className="mr-1 mark_status_alerts">
                                                    <motion.img src="/assets/img/iconos/dot_red.svg" alt="marker" />
                                                </div>
                                                <div>
                                                    <p>
                                                        ¡Tu proyecto <b>“Nombre de proyecto”</b> ha sido <span>aprobado</span> con éxito! Te recomendamos
                                                        estar atento a las aplicaciones que recibas para así encontrar y reclutar a tu talento lo más
                                                        pronto posible
                                                    </p>
                                                </div>
                                                <div className="ctrl_not_edit ml-auto">
                                                    <motion.img src="/assets/img/iconos/control_rol_edit.svg" alt="icono" />
                                                    <div className="box_ctrl_not_edit">
                                                        <p>Marcar como leído</p>
                                                        <p>Eliminar</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="d-flex align-items-center item_alerts_list">
                                                <div className="mr-1 mark_status_alerts">
                                                    <motion.img src="/assets/img/iconos/dot_red.svg" alt="marker" />
                                                </div>
                                                <div>
                                                    <p>
                                                        ¡Tu proyecto <b>“Nombre de proyecto”</b> ha sido <span>aprobado</span> con éxito! Te recomendamos
                                                        estar atento a las aplicaciones que recibas para así <a href="#">encontrar y reclutar</a> a tu
                                                        talento lo más pronto posible
                                                    </p>
                                                </div>
                                                <div className="ctrl_not_edit ml-auto">
                                                    <motion.img src="/assets/img/iconos/control_rol_edit.svg" alt="icono" />
                                                    <div className="box_ctrl_not_edit">
                                                        <p>Marcar como leído</p>
                                                        <p>Eliminar</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="box_submenu_avatar">
                                    <div className="avatar">
                                        <motion.img src="https://randomuser.me/api/portraits/men/34.jpg" alt="avatar" />
                                    </div>
                                    <div className="txt_avatar">
                                        <p className="color_a mb-0 open_popup" data-popup="box_editprofile">Editar perfil</p>
                                        <a href="#" className="color_a">Cerrar sesión</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <form className="needs-validation" noValidate>
                            <div>
                                <div className="d-flex">
                                    <motion.img style={{ width: 35 }} src="/assets/img/silla-ezcast.svg" alt="icono" />
                                    <div>
                                        <p className="color_a h4 font-weight-bold mb-0 ml-2"><b>Nuevo proyecto</b></p>
                                        <p className="ml-2 mb-0"><b>¡Comencemos!</b></p>
                                    </div>
                                </div>
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
                                        <div className="form-group">
                                            <label htmlFor="username01"><b>Nombre de proyecto*</b></label>
                                            <input type="text" className="form-control form-control-sm text_custom" id="username01" required />
                                            <div className="invalid-feedback">Este campo es obligatorio</div>
                                        </div>
                                    </div>
                                    <div className="col-md-3 mr-md-5">
                                        <label htmlFor="username">Sindicato*</label>
                                        <select className="form-control form-control-sm select_custom sc_var_b" required>
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
                                        <select className="form-control form-control-sm select_custom sc_var_b" required>
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
                                        <div className="form-group">
                                            <label htmlFor="username">Nombre de sindicato</label>
                                            <input type="text" className="form-control form-control-sm text_custom" id="username" />
                                        </div>
                                    </div>
                                    <div className="col-md-3 mr-md-5">
                                        <div className="form-group">
                                            <label htmlFor="username">Otro</label>
                                            <input type="text" className="form-control form-control-sm text_custom" id="username" />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="d-lg-flex mt-5 pt-5">
                                        <div>
                                            <p className="font-weight-bold mr-3">Paso 2</p>
                                        </div>
                                        <div>
                                            <p className="color_a">Contacto de Casting</p>
                                        </div>
                                    </div>
                                    <hr className="m-0" />
                                </div>
                                <div className="info_bg_a">
                                    Esta información no se compartirá con el público
                                </div>
                                <div className="row mt-lg-4">
                                    <div className="col-md-3 mr-md-5">
                                        <div className="form-group">
                                            <label htmlFor="username">Director de casting*</label>
                                            <input type="text" className="form-control form-control-sm text_custom" id="username" required />
                                            <div className="invalid-feedback">Este campo es obligatorio</div>
                                        </div>
                                    </div>
                                    <div className="col-md-3 mr-md-5">
                                        <div className="form-group">
                                            <label htmlFor="username">Número de teléfono*</label>
                                            <input type="text" className="form-control form-control-sm text_custom" id="username" required />
                                            <div className="invalid-feedback">Este campo es obligatorio</div>
                                        </div>
                                    </div>
                                    <div className="col-md-3 mr-md-5"></div>
                                </div>
                                <div className="row mt-lg-4">
                                    <div className="col-md-3 mr-md-5">
                                        <div className="form-group">
                                            <label htmlFor="username">Correo electrónico*</label>
                                            <input type="text" className="form-control form-control-sm text_custom" id="username" required />
                                            <div className="invalid-feedback">Este campo es obligatorio</div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <div className="d-flex">
                                                <label htmlFor="username">Confirmar correo electrónico</label>
                                                <div className="contToolTip" data-toggle="tooltip" data-html="true" data-placement="bottom" title="<b>Información de Contacto</b><br>Asegúrate de revisar esta dirección de correo electrónico con frecuencia durante el proceso de aprobación en caso de que tengamos alguna pregunta sobre tu proyecto.
                  <br>">?</div>
                                            </div>
                                            <input type="text" className="form-control form-control-sm text_custom" id="username" />
                                        </div>
                                    </div>
                                    <div className="col-md-3 mr-md-5"></div>
                                </div>
                                <div>
                                    <div className="d-lg-flex mt-5 pt-5">
                                        <div>
                                            <p className="font-weight-bold mr-3">Paso 3</p>
                                        </div>
                                        <div>
                                            <p className="color_a">Equipo creativo</p>
                                        </div>
                                    </div>
                                    <hr className="m-0" />
                                </div>
                                <div className="row mt-lg-4">
                                    <div className="col-md-3 mr-md-5">
                                        <div className="form-group">
                                            <label htmlFor="username">Productor</label>
                                            <input type="text" className="form-control form-control-sm text_custom" id="username" />
                                        </div>
                                    </div>
                                    <div className="col-md-3 mr-md-5">
                                        <div className="form-group">
                                            <label htmlFor="username">Casa Productora</label>
                                            <input type="text" className="form-control form-control-sm text_custom" id="username" />
                                        </div>
                                    </div>
                                    <div className="col-md-3 mr-md-5"></div>
                                </div>
                                <div className="row mt-lg-4">
                                    <div className="col-md-3 mr-md-5">
                                        <div className="form-group">
                                            <label htmlFor="username">Director</label>
                                            <input type="text" className="form-control form-control-sm text_custom" id="username" />
                                        </div>
                                    </div>
                                    <div className="col-md-3 mr-md-5">
                                        <div className="form-group">
                                            <label htmlFor="username">Agencia de publicidad</label>
                                            <input type="text" className="form-control form-control-sm text_custom" id="username" />
                                        </div>
                                    </div>
                                    <div className="col-md-3 mr-md-5"></div>
                                </div>
                                <div>
                                    <div className="d-lg-flex mt-5 pt-5">
                                        <div>
                                            <p className="font-weight-bold mr-3">Paso 4</p>
                                        </div>
                                        <div>
                                            <p className="color_a">Detalles adicionales</p>
                                        </div>
                                    </div>
                                    <hr className="m-0" />
                                </div>
                                <div className="row mt-lg-4">
                                    <div className="col-md-5 mr-md-5">
                                        <div className="form-group">
                                            <div className="d-flex">
                                                <label htmlFor="username">Sinopsis*</label>
                                                <div className="contToolTip blue_tootip" data-toggle="tooltip" data-html="true" data-placement="bottom" title="<b>¿De qué trata tu proyecto?</b><br>Sé lo mas descriptivo posible para que el talento se entusiasme con la posibilidad de trabajar y unirse a tu 
                  proyecto.<br>">?</div>
                                            </div>
                                            <textarea className="form-control" id="exampleFormControlTextarea1" rows={5} required></textarea>
                                            <div className="invalid-feedback">Este campo es obligatorio</div>
                                        </div>
                                    </div>
                                    <div className="col-md-4 cont_btn_upload">
                                        <div className="form-group">
                                            <p className="mb-1">Agregar Archivo<br /><span>(Guión, Storyboard o Contrato)</span></p>
                                            <div className="box_btn_upload">
                                                <motion.img src="/assets/img/iconos/ico_pdf_blue.svg" alt="icono" />
                                                <div className="btn btn-intro btn-confirm">Subir archivo</div>
                                                <p className="mb-1">PDF</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mt-lg-4">
                                    <div className="col-md-5 mr-md-5">
                                        <div className="form-group">
                                            <label htmlFor="username">Detalles adicionales del proyecto</label>
                                            <textarea className="form-control" id="exampleFormControlTextarea1" rows={3}></textarea>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="d-lg-flex mt-5 pt-5">
                                        <div>
                                            <p className="font-weight-bold mr-3">Paso 5</p>
                                        </div>
                                        <div>
                                            <p className="color_a">Locación del proyecto</p>
                                        </div>
                                    </div>
                                    <hr className="m-0" />
                                </div>
                                <div className="row mt-lg-4">
                                    <div className="col-md-3 mr-md-5">
                                        <div className="d-flex">
                                            <label htmlFor="username">Locación de proyecto:*</label>
                                            <div className="contToolTip" data-toggle="tooltip" data-html="true" data-placement="bottom" title="<b>¿Dónde está tu proyecto?</b><br>A menos que estés pagando viáticos, debes elegir solo ubicaciones dentro de una distancia de conducción razonable para que el talento se reporte al trabajo.<br>">?</div>
                                        </div>
                                        <select className="form-control form-control-sm select_custom sc_var_b" required>
                                            <option value="">Selecciona una opción</option>
                                            <option>Aguascalientes</option>
                                            <option>Baja California</option>
                                            <option>Baja California Sur</option>
                                            <option>Campeche</option>
                                            <option>Coahuila</option>
                                            <option>Colima</option>
                                            <option>Chiapas</option>
                                            <option>Chihuahua</option>
                                            <option>Durango</option>
                                            <option>Distrito Federal</option>
                                            <option>Guanajuato</option>
                                            <option>Guerrero</option>
                                            <option>Hidalgo</option>
                                            <option>Jalisco</option>
                                            <option>México</option>
                                            <option>Michoacán</option>
                                            <option>Morelos</option>
                                            <option>Nayarit</option>
                                            <option>Nuevo León</option>
                                            <option>Oaxaca</option>
                                            <option>Puebla</option>
                                            <option>Querétaro</option>
                                            <option>Quintana Roo</option>
                                            <option>San Luis Potosí</option>
                                            <option>Sinaloa</option>
                                            <option>Sonora</option>
                                            <option>Tabasco</option>
                                            <option>Tamaulipas</option>
                                            <option>Tlaxcala</option>
                                            <option>Veracruz</option>
                                            <option>Yucatán</option>
                                            <option>Zacatecas</option>
                                        </select>
                                        <div className="invalid-feedback">Este campo es obligatorio</div>
                                        <p className="color_a mt-1 ml-1">Elegir estado</p>
                                    </div>
                                </div>
                                <div>
                                    <div className="d-lg-flex mt-5 pt-5">
                                        <div>
                                            <p className="font-weight-bold mr-3">Paso 6</p>
                                        </div>
                                        <div>
                                            <p className="color_a">Publicar en Bilboard de Talentos</p>
                                        </div>
                                    </div>
                                    <hr className="m-0" />
                                </div>
                                <div className="row mt-lg-4">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <div className="d-flex">
                                                <label htmlFor="username">Agregar una foto de portada para tu proyecto</label>
                                                <div className="contToolTip" data-toggle="tooltip" data-html="true" data-placement="bottom" title=" Te recomendamos agregues una fotografía para personalizar tu proyecto. Esta será visible en el casting billboard de talentos.">?</div>
                                            </div>
                                            <div className="box_btn_upload">
                                                <motion.img src="/assets/img/iconos/cam_outline_blue.svg" alt="icono" />
                                                <div className="btn btn-intro btn-confirm">Subir archivo</div>
                                                <p className="mb-1">O arrastrar al recuadro</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mt-lg-4">
                                    <div className="col" >
                                        <p>¿Deseas compartir el proyecto en formato poster mantenerlo oculto y solo poner la casa productora?</p>
                                        <div className="form-check">
                                            <input className="form-check-input" type="radio" name="exampleRadios" id="exampleRadios1" value="option1" checked />
                                            <label className="form-check-label" htmlFor="exampleRadios1">
                                                Compartir nombre de proyecto
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input className="form-check-input" type="radio" name="exampleRadios" id="exampleRadios2" value="option2" />
                                            <label className="form-check-label" htmlFor="exampleRadios2">
                                                Solo compartir casa productora
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mt-lg-4">
                                    <div className="col d-flex justify-content-center" >
                                        <div className="mr-3">
                                            <button className="btn btn-intro btn-price btn_out_line mb-2" type="submit">Guardar y terminar después</button>
                                        </div>
                                        <div>
                                            <button className="btn btn-intro btn-price mb-2" type="submit">Guardar proyecto y agregar rol</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </MainLayout>
            <Flotantes />
        </>
    )
}

export default index