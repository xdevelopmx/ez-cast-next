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
    </>
  )
}
