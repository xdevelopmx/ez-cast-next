// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { useState, Children, useEffect, useRef, FC, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
    children: ReactNode;
    onCambiarPagina?: (pagina: number) => void;
}

const duration = .6

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

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const PagePilingComponent: FC<Props> = ({ children, onCambiarPagina }) => {
    const [pagina, setPagina] = useState(0)
    const [direccion, setDireccion] = useState('')
    const animando = useRef(false)
    const hijos = Children.map(children, (child) => child)

    const detectarRueda = (e: WheelEvent) => {
        const { deltaY } = e
        if (!animando.current) {
            animando.current = true
            setPagina(pagina => {
                let nuevaPagina = pagina;
                if (deltaY > 0) {
                    nuevaPagina = pagina + 1;
                } else {
                    nuevaPagina = pagina - 1;
                }
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                nuevaPagina = Math.max(0, Math.min(hijos!.length - 1, nuevaPagina));
                if (nuevaPagina === pagina) {
                    animando.current = false;
                    return pagina;
                } else {
                    setDireccion(deltaY > 0 ? 'incrementando' : 'decrementando');
                    return nuevaPagina;
                }
            })
        }
    }

    useEffect(() => {
        document.addEventListener('wheel', detectarRueda)

        return () => {
            document.removeEventListener('wheel', detectarRueda)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        onCambiarPagina && onCambiarPagina(pagina)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pagina])

    return (
        <AnimatePresence
            custom={{
                direccion,
                duration
            }}
        >
            <motion.div
                key={pagina}
                style={{ position: 'relative' }}
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
