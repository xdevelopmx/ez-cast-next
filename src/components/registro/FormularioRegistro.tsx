import { useState } from 'react'
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { CreaTuPerfil } from './';

const steps = [
    '',
    '',
    '',
];


export const FormularioRegistro = () => {

    const [paso, setPaso] = useState(1)

    return (
        <Box sx={{ width: '100%' }}>
            <Stepper activeStep={paso} alternativeLabel>
                {steps.map((_, i) => (
                    <Step key={`step${i}`}>
                        <StepLabel onClick={() => setPaso(i + 1)}></StepLabel>
                    </Step>
                ))}
            </Stepper>
            <form autoComplete="off">
                {paso === 1 && <CreaTuPerfil setPaso={setPaso} />}
            </form>
        </Box>
    )
}
