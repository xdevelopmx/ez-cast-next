import React from 'react'

import { motion } from 'framer-motion'

export const Destacados = () => {
  return (
    <>
        <div className="mt-2 col-md-6">
            <p className="h4 font-weight-bold">Destacados</p>
            <div className="container_slider_destacados">
              <div className="container_slider" data-slider="slider-destacados">
                <div className="flecha-izquierda flechaImgIzq owl-prev">
                  <motion.img src="/assets/img/iconos/arow_l_blue.svg" alt="icon" />
                </div>
                <div className="owl-carousel slider-destacados owl-theme d-flex jc-sb">
                  <div className="item">
                    <motion.img src="/assets/img/iconos/slider_modelo_01.png" alt="talento" />
                    <div className="cart_slider">
                      <p className="color_a">NOMBRE ACTOR</p>
                      <div className="d-lg-flex align-items-center cart_slider_datos">
                        <p>Union</p>
                        <motion.img src="/assets/img/iconos/cart_location_blue.svg" alt="icon" />
                        <p>Ubicación</p>
                      </div>
                    </div>
                  </div>
                  <div className="item">
                    <motion.img src="/assets/img/iconos/slider_modelo_02.png" alt="talento" />
                    <div className="cart_slider">
                      <p className="color_a">NOMBRE ACTOR</p>
                      <div className="d-lg-flex align-items-center cart_slider_datos">
                        <p>Union</p>
                        <motion.img src="/assets/img/iconos/cart_location_blue.svg" alt="icon" />
                        <p>Ubicación</p>
                      </div>
                    </div>
                  </div>
                  {/* <div className="item">
                    <motion.img src="/assets/img/iconos/slider_modelo_03.png" alt="talento" />
                    <div className="cart_slider">
                      <p className="color_a">NOMBRE ACTOR</p>
                      <div className="d-lg-flex align-items-center cart_slider_datos">
                        <p>Union</p>
                        <motion.img src="/assets/img/iconos/cart_location_blue.svg" alt="icon" />
                        <p>Ubicación</p>
                      </div>
                    </div>
                  </div> */}
                </div>
                <div className="flecha-derecha flechaImgDer owl-next">
                  <motion.img src="/assets/img/iconos/arow_r_blue.svg" alt="icon" />
                </div>
              </div>
            </div>
          </div>
    </>
  )
}
