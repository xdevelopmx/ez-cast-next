import React from 'react'

import { LoginForm } from '../form'
import { motion } from 'framer-motion'

export const FondoLogin = () => {
  return (
    <>
        <div>
            <div className="slideshow slider_login">
                <motion.img src="img/ezcast_login/ezcast-imagen1-slideshow.jpg" className="active" alt='' />
                <motion.img src="img/ezcast_login/ezcast-imagen2-slideshow.jpg" alt='' />
                <motion.img src="img/ezcast_login/ezcast-imagen3-slideshow.jpg" alt='' />
            </div>
            <LoginForm />
        </div>
    </>
  )
}
