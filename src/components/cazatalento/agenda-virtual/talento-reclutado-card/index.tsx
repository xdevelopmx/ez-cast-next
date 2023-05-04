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
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Typography
                        variant="body1"
                        component="p"
                        fontWeight={500}
                        sx={{
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 2,
                            color: '#fff',
                            lineHeight: '20px',
                            height: '40px',
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            //whiteSpace: 'nowrap'
                        }}
                    >
                        Nombre del actor
                    </Typography>
                    <Image src="/assets/img/iconos/control_rol_edit.svg" width={20} height={20} alt="" />
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
            <Grid xs={12}>
                <Typography sx={{ lineHeight: '20px', padding: '20px', border: '2px solid #069cb1' }}>
                    Notas sobre el actor,
                    detalles que comparte
                    O lo que sea.
                </Typography>
            </Grid>
        </Grid>
    )
}
