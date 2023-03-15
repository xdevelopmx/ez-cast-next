import { useState } from 'react'
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

const steps = [
    'Select master blaster campaign settings',
    'Create an ad group',
    'Create an ad',
];


export const FormularioRegistro = () => {

    const [paso, setPaso] = useState(1)

    return (
        <Box sx={{ width: '100%' }}>
            <Stepper activeStep={paso} alternativeLabel>
                {steps.map((label, i) => (
                    <Step key={label}>
                        <StepLabel onClick={() => setPaso(i + 1)}>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
        </Box>
    )
}
