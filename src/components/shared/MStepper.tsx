import { type CSSProperties, useEffect, useRef, useState, type FC } from 'react'
import { motion } from 'framer-motion'
import MotionDiv from '../layout/MotionDiv';
import { Step, StepLabel, Stepper } from '@mui/material';

interface Props {
    onStepChange: (step: number) => void;
    current_step: number;
    step_titles: {[step: number]: string};
    children: JSX.Element[];
    style?: CSSProperties,
    onFinish?: () => void
}

export const MStepper: FC<Props> = ({ onStepChange, current_step, step_titles, children, onFinish }) => {
    const animation_time_ref = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [showContent, setShowContent] = useState(false);
    useEffect(() => {
        if (animation_time_ref.current) {
            clearTimeout(animation_time_ref.current);
        }
        animation_time_ref.current = setTimeout(() => {
            setShowContent(true);
        }, 150);
        setShowContent(false);
	}, [current_step]);
    return (
        <>
            <Stepper activeStep={current_step - 1} alternativeLabel>
                {children.map((_, i) => (
                    <Step key={`step${i}`}>
                        <StepLabel onClick={() => onStepChange(i + 1)}></StepLabel>
                    </Step>
                ))}
            </Stepper>
            <h3 className="paso-stepper">
                Paso {current_step} <span>- {step_titles[current_step]}</span>
            </h3>
            
            <MotionDiv show={showContent} animation={'left-to-right'}>
                <>
                    {children[current_step - 1]}
                </>
            </MotionDiv>
            <div className="botones btn-r">
                {children.length > 0 && current_step > 1 &&
                    <button className="boton-next-step margen" type='button' onClick={() => {
                        onStepChange(current_step - 1)
                    }}>
                        Regresar Paso <motion.img src="assets/img/iconos/arow_l_blue.svg" />
                    </button>
                }
                {children.length > 0 && current_step < children.length &&
                    <button className="boton-next-step margen" type='button' onClick={() => {
                        onStepChange(current_step + 1)
                    }}>
                        Siguiente Paso <motion.img src="assets/img/iconos/arow_r_blue.svg" />
                    </button>
                }
                {onFinish && children.length > 0 && current_step === children.length &&
                    <button className="boton-next-step margen" type='button' onClick={() => {
                        onFinish()
                    }}>
                        Finalizar <motion.img src="assets/img/iconos/arow_r_blue.svg" />
                    </button>
                }
            </div>
        </>
    )
}
