import React from 'react'

import { motion } from 'framer-motion'

export const MenuLateral = () => {
  return (
    <>
        <div className="menu_container text-center ezcast_container">
            <motion.img src="/assets/img/iconos/EZ_Claqueta.svg" className="mt-5 mb-3 claqueta_black" />
            <p className="h2 text-uppercase text-white mb-3"><b>EZ-CAST</b></p>
            <div className="mt-3 mb-3 avatar">
                <motion.img src="https://randomuser.me/api/portraits/men/34.jpg" alt="avatar" />
            </div>
            <p className="h2 text-white mb-0">Iván</p>
            <p className="h2 text-white mb-3 user_lastName">Águila Orea</p>
            <motion.img src="/assets/img/iconos/icon_estrella_dorada.svg" className="ml-1 gold_star" alt="icono estrella dorada" />
            <p className="text-white"><em>Productor en Un Lugar</em></p>
            <p className="text-white menu_bio">Biografía breve, 100 caracteres dos renglones</p>
            <div className="d-lg-flex justify-content-center box_social">
                <a target="_blank" href="#">
                <motion.img className=" m-2" src="/assets/img/iconos/icon_vimeo.svg" alt="" />
                </a>
                <a target="_blank" href="#">
                <motion.img className=" m-2" src="/assets/img/iconos/icon_linkedin.svg"  alt="" />
                </a>
                <a target="_blank" href="#">
                <motion.img className=" m-2" src="/assets/img/iconos/icon_youtube.svg"  alt="" />
                </a>
                <a target="_blank" href="#">
                <motion.img className=" m-2" src="/assets/img/iconos/icon_imbd.svg"  alt="" />
                </a>
                <a target="_blank" href="#">
                <motion.img className=" m-2" src="/assets/img/iconos/icon_Twitwe.svg"  alt="" />
                </a>
                <a target="_blank" href="#">
                <motion.img className=" m-2" src="/assets/img/iconos/icon_insta.svg"  alt="" />
                </a>
            </div>
            <div className="d-lg-flex justify-content-center mt-2 mb-2">
                <motion.img className="mr-2" src="/assets/img/iconos/icon_website.svg"  alt="" />
                <a target="_blank" href="#" className="text-white">www.ivanaguilao.com</a>
            </div>
            <hr />
            <p className="mt-2 mb-5 text-white open_popup" data-popup="box_editprofile">Editar perfil</p>
            <div className="sub_menu">
                <a href="#" className="active">Mis proyectos</a>
                <a href="#">Billboard</a>
                <a href="#">Agenda Virtual</a>
                <a className="msn_container" href="#"><span className="count_msn active">3</span>Mensajes</a>
                <a href="#">Ayuda</a>
            </div>
            <p className="mt-5 mb-2"><a className="text-white" href="#">Cerrar sesión</a></p>

            <div className="popup_conteiner box_editprofile">
                <div className="close_popup close_popup_editprofile">
                <motion.img src="/assets/img/iconos/equiz_blue.svg" alt="icono" />
                </div>
                <div className="mt-3 mb-1 avatar">
                <motion.img src="https://randomuser.me/api/portraits/men/34.jpg" alt="avatar" />
                <motion.img src="/assets/img/iconos/cam_white.svg"  alt="" />
                </div>
                <p className="mt-1 mb-2"><a className="text-grey" href="#">Cambiar foto</a></p>
                <div className="row">
                <div className="col-12">
                    <div className="form-group">
                    <label>Nombre de usuario</label>
                    <input type="text" className="form-control form-control-sm text_custom" value="Iván Águila Orea" />
                    </div>
                    <div className="form-group">
                    <label>Posición</label>
                    <input type="text" className="form-control form-control-sm text_custom" value="Productor" />
                    </div>
                    <div className="form-group">
                    <p className="text-left">Idioma</p>
                    <div className="form-check">
                        <input className="form-check-input" type="radio" name="exampleRadios" id="exampleRadios1" value="option1" checked={false} />
                        <label className="form-check-label" htmlFor="exampleRadios1">
                        Español
                        </label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="radio" name="exampleRadios" id="exampleRadios2" value="option2" />
                        <label className="form-check-label" htmlFor="exampleRadios2">
                        English
                        </label>
                    </div>
                    </div>
                    <div className="form-group">
                    <label>Link a página web</label>
                    <input type="text" className="form-control form-control-sm text_custom" value="www.ivanaguilao.com" />
                    </div>
                    <p className="mt-2 mb-1 text-left">Link a redes sociales:</p>
                    <div className="form-group">
                    <label>Vimeo <motion.img src="/assets/img/iconos/icon_vimeo_blue.svg" alt="icono" /></label>
                    <input type="text" className="form-control form-control-sm text_custom" value=" " />
                    </div>
                    <div className="form-group">
                    <label>Youtube <motion.img src="/assets/img/iconos/icon_youtube_blue.svg" alt="icono" /></label>
                    <input type="text" className="form-control form-control-sm text_custom" value=" " />
                    </div>
                    <div className="form-group">
                    <label>LinkedIn <motion.img src="/assets/img/iconos/icon_linkedin_blue.svg" alt="icono" /></label>
                    <input type="text" className="form-control form-control-sm text_custom" value=" " />
                    </div>
                    <div className="form-group">
                    <label>Instagram <motion.img src="/assets/img/iconos/icon_insta_blue.svg" alt="icono" /></label>
                    <input type="text" className="form-control form-control-sm text_custom" value=" " />
                    </div>
                    <div className="form-group">
                    <label>Twitter <motion.img src="/assets/img/iconos/icon_Twitwe_blue.svg" alt="icono" /></label>
                    <input type="text" className="form-control form-control-sm text_custom" value=" " />
                    </div>
                    <div className="form-group">
                    <label>IMDb <motion.img src="/assets/img/iconos/icon_imbd_blue.svg" alt="icono" /></label>
                    <input type="text" className="form-control form-control-sm text_custom" value=" " />
                    </div>
                    <button className="text-center btn btn-intro btn-confirm close_popup_link">
                    Guardar cambios
                    </button>
                </div>
                </div>
            </div>
            </div>
    </>
  )
}
