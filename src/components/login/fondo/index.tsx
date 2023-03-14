import React from 'react'

import { LoginForm } from '../form'
import { motion } from 'framer-motion'

export const FondoLogin = () => {
  return (
    <>
        <div className='login_ezcast'>
            <div className="slideshow slider_login">
                <motion.img src="assets/img/login/ezcast-imagen1-slideshow.jpg" className="active" alt='' />
                <motion.img src="assets/img/login/ezcast-imagen2-slideshow.jpg" alt='' />
                <motion.img src="assets/img/login/ezcast-imagen3-slideshow.jpg" alt='' />
            </div>
            <LoginForm />
        </div>
    </>
  )
}
