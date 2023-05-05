import { Button, Divider, Grid, Typography } from '@mui/material'
import React from 'react'

export const DatosAudicion = () => {
    return (
        <Grid container xs={12} mt={2}>

            <Grid xs={2}>
                <Typography fontWeight={600} sx={{ color: '#069cb1', }}>
                    Fecha de audición
                </Typography>
                <Typography fontWeight={500}>
                    25/09/2021
                </Typography>
            </Grid>
            <Grid xs={4}>
                <Typography fontWeight={600} sx={{ color: '#069cb1', }}>
                    Locación
                </Typography>
                <Typography fontWeight={500}>
                    Direction 457 Col. Centro, CDMX
                </Typography>
            </Grid>
            <Grid xs={3}>
                <Typography fontWeight={600} sx={{ color: '#069cb1', }}>
                    Nota adicional
                </Typography>
                <Typography fontWeight={500}>
                    Notas de locación sobre
                    Como llegar tal vez o así
                </Typography>
            </Grid>
            <Grid xs={2}>
                <Typography fontWeight={600} sx={{ color: '#069cb1', }}>
                    Huso horario
                </Typography>
                <Typography fontWeight={500}>
                    Tiempo del Pacífico
                    UTC(CNM) – (N+1)
                </Typography>
                <Button sx={{ textTransform: 'none', textDecoration: 'underline', color: '#069cb1' }}>
                    <Typography>
                        Ver más
                    </Typography>
                </Button>
            </Grid>
            <Grid xs={1}>
                <Button sx={{ textTransform: 'none', textDecoration: 'underline', color: '#069cb1' }}>
                    <Typography>
                        Editar
                    </Typography>
                </Button>
            </Grid>

            <Grid xs={12}>
                <Divider />
            </Grid>

        </Grid>
    )
}
