import { useState } from 'react'
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { CreaTuPerfil, Pago, TipoDeMembresia } from './';

const steps = [
    '',
    '',
    '',
];


export const FormularioRegistro = () => {

    const [paso, setPaso] = useState(1)

    return (
        <Box sx={{ width: '100%' }}>
            <br />
            <div style={{width: '200px', margin: '0 auto'}}>
                <Stepper activeStep={paso} alternativeLabel>
                    {steps.map((_, i) => (
                        <Step key={`step${i}`}>
                            <StepLabel onClick={() => setPaso(i + 1)}></StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </div>
            <form autoComplete="off">
                {paso === 1 && <CreaTuPerfil setPaso={setPaso} />}
                {paso === 2 && <TipoDeMembresia setPaso={setPaso} />}
                {paso === 3 && <Pago setPaso={setPaso} />}
            </form>
        </Box>
    )
}
