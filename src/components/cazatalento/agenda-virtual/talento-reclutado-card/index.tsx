import Image from 'next/image'
import { Box, Grid, Typography } from '@mui/material'
import React from 'react'

export const TalentoReclutadoCard = () => {
    return (
        <Grid container xs={12} sx={{ marginBottom: '10px' }}>
            <Grid xs={5}>
                <Box sx={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '9/16'
                }}>
                    <Image style={{ objectFit: 'cover' }} src={'/assets/img/slider_modelo_02.png'} fill alt="" />
                </Box>
            </Grid>
            <Grid xs={7} sx={{ backgroundColor: '#069cb1' }}>
                <Typography fontWeight={600} sx={{ color: '#fff' }}>
                    Nombre del actor
                </Typography>
                <Typography fontWeight={600} sx={{ color: '#fff' }}>
                    Unión
                </Typography>
            </Grid>
        </Grid>
    )
}
