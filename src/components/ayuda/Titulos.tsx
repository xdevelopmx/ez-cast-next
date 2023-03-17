import React from 'react'
import { motion } from 'framer-motion'

export const Titulos = () => {
  return (
    <>
        <div className="h-50-vh">
            <motion.img src="/assets/img/ezcasthelp.jpg" className="w-100 h-100 intro_img" />
        </div>
        <section className="ezcast_container">
            <div className="intro_container">
            <div className="row justify-content-center">
                <div className="col-md-4">
                <h2 className="m-0 text-white">AYUDA</h2>
                <h1>EZ-CAST</h1>
                </div>
            </div>
            </div>
        </section>
    </>
  )
}
