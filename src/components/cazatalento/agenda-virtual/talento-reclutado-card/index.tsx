import Image from 'next/image'
import { Box, Grid, Typography } from '@mui/material'
import React from 'react'

export const TalentoReclutadoCard = () => {
    return (
        <Grid container xs={12}>
            <Grid xs={5}>
                <Box sx={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '9/16'
                }}>
                    <Image style={{ objectFit: 'cover' }} src={'/assets/img/slider_modelo_02.png'} fill alt="" />
                </Box>
            </Grid>
            <Grid xs={7} sx={{ backgroundColor: '#069cb1', padding: '10px' }}>
                <Box>
                    <Typography fontWeight={500} sx={{ color: '#fff', lineHeight: '20px' }}>
                        Nombre del actor
                    </Typography>

                </Box>
                <Typography fontWeight={500} sx={{ color: '#fff', lineHeight: '20px' }}>
                    Unión
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1, marginTop: '5px' }}>
                    <Image src="/assets/img/iconos/pendiente_table.png" width={8} height={12} alt="" />
                    <Image src="/assets/img/iconos/pendiente_table.png" width={8} height={12} alt="" />
                </Box>
                <Box sx={{ display: 'flex', gap: .3, marginTop: '5px' }}>
                    <Image src="/assets/img/iconos/icono_star_blue_active.svg" width={12} height={12} alt="" />
                    <Image src="/assets/img/iconos/icono_star_blue_active.svg" width={12} height={12} alt="" />
                    <Image src="/assets/img/iconos/icono_star_blue_active.svg" width={12} height={12} alt="" />
                    <Image src="/assets/img/iconos/icono_star_blue_active.svg" width={12} height={12} alt="" />
                    <Image src="/assets/img/iconos/icono_star_blue_active.svg" width={12} height={12} alt="" />
                </Box>
            </Grid>
        </Grid>
    )
}
