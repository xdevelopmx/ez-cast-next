import { Alert, AlertTitle } from '@mui/material'
import { motion } from 'framer-motion'
import { useEffect, useRef, type FC } from 'react'
import useAlerts from '~/hooks/useAlerts'
import MotionDiv from './MotionDiv'

export const Alerts: FC = () => {
    const {alerts} = useAlerts();

    return (
        <div style={{
            position: 'absolute',
            top: 76,
            width: '100%',
            margin: 0,
            zIndex: 1000,
            left: 0
        }}>
            {Array.from(alerts).map((v, i) => {
                const color = (v[1].severity === 'success') ? 'forestgreen' : (v[1].severity === 'error') ? 'tomato' : 'orange';
                return <MotionDiv show={true} key={i} animation={'down-to-up'} 
                    style={{ 
                        display: 'flex',
                        width: '100%', 
                        justifyContent: 'center',
                        backgroundColor: color,
                        border: 'solid',
                        borderColor: 'rgba(0, 0, 0, 0.3)'
                    }}
                >
                    <Alert 
                        severity="success" 
                        sx={{
                            backgroundColor: color,
                            color: 'whitesmoke',
                            textAlign: 'center'
                        }}
                        icon={null}
                    >
                        <AlertTitle>{(v[1].severity === 'success') ? 'Exito' : 'Ocurrio un problema'}</AlertTitle>
                        {v[1].message}
                    </Alert>

                </MotionDiv>
            })}
        </div>
    )
}
