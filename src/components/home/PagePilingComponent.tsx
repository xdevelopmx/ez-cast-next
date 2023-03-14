import { useState, Children, useEffect, useRef, FC, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
    children: ReactNode;
}

const duration = 1

const variants = {
    inicial: ({ direccion, duration }: { direccion: 'incrementando' | 'decrementando', duration: number }) => ({
        y: direccion === 'incrementando' ? 0 : -1024,
        transition: {
            duration
        }
    }),
    entrada: ({ duration }: { duration: number }) => ({
        y: 0,
        transition: {
            duration
        }
    }),
    salida: ({ direccion, duration }: { direccion: 'incrementando' | 'decrementando', duration: number }) => ({
        y: direccion === 'incrementando' ? -1024 : 0,
        zIndex: direccion === 'incrementando' ? 100 : 0,
        transition: {
            duration
        }
    }),
}

export const PagePilingComponent: FC<Props> = ({ children }) => {
    const [pagina, setPagina] = useState(0)
    const [direccion, setDireccion] = useState('')
    const animando = useRef(false)
    const hijos = Children.map(children, (child) => child)

    const detectarRueda = (e: WheelEvent) => {
        const { deltaY } = e
        if (!animando.current) {
            animando.current = true
            if (deltaY > 0) {
                setPagina(pagina => pagina + 1)
                setDireccion('incrementando')
            } else {
                setPagina(pagina => pagina - 1)
                setDireccion('decrementando')
            }
        }
    }

    useEffect(() => {
        document.addEventListener('wheel', detectarRueda)

        return () => {
            document.removeEventListener('wheel', detectarRueda)
        }
    }, [])

    return (
        <AnimatePresence
            custom={{
                direccion,
                duration
            }}
        >
            <motion.div
                key={pagina}
                style={{position: 'relative'}}
                variants={variants}
                custom={{
                    direccion,
                    duration
                }}
                onAnimationComplete={(definition) => {
                    if (definition === 'salida') {
                        animando.current = false
                    }
                }}
                initial="inicial"
                animate="entrada"
                exit="salida"
            >
                {hijos && hijos[Math.abs(pagina) % hijos.length]}
            </motion.div>
        </AnimatePresence>
    )
}
