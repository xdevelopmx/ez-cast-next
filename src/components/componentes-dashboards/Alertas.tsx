import React from 'react'

import { motion } from 'framer-motion'

export const Alertas = () => {
  return (
    <>
        <div className="pt-4 container_alerts_header">
            <div className="d-flex justify-content-end btn_alerts_header">
              <div className="box_alert_header mr-4">
                <motion.img src="/assets/img/iconos/bell_blue.svg" alt="" />
                <span className="count_msn active">2</span>
              </div>
              <p className="font-weight-bold h4 mr-5 mb-0 color_a">Tus alertas</p>
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
    </>
  )
}
