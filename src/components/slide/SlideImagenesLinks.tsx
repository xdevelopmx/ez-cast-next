import React from 'react'

import { motion } from 'framer-motion'
import { Link } from '@mui/material'

export const SlideImagenesLinks = () => {

  return (
    <>
        <div className="slide-contenedor">
            <div className="flecha-izquierda">
                <motion.img src="/assets/img/iconos/arow_l_gold.svg" alt="icon" />
            </div>
            <div className="slide">
                {Array(5).fill(0).map((slide, index )=>(
                    <Link className="item-slide" href='' key={index}>
                        <motion.img src="/assets/img/iconos/movie01.jpg" alt="talento" />
                        <div className="text-slide">
                            <p>Titulo proyecto</p>
                        </div>
                    </Link>
                ))}
            </div>
            <div className="flecha-derecha">
                <motion.img src="/assets/img/iconos/arow_r_gold.svg" alt="icon" />
            </div>
        </div>
    </>
  )
}
