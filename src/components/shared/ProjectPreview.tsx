import Image from 'next/image'
import { Box, Button, Grid, Typography } from '@mui/material'
import React from 'react'

export const ProjectPreview = () => {
    return (
        <Grid item container xs={12} sx={{ border: '2px solid #928F8F' }}>
            <Grid container item xs={12} sx={{ alignItems: 'flex-start' }}>
                <Grid item xs={4}>
                    <Box sx={{ position: 'relative', width: '100%', aspectRatio: '16/9' }}>
                        <Image src="/assets/img/granja.jpg" style={{ objectFit: 'cover' }} fill alt="" />
                    </Box>
                </Grid>
                <Grid container item xs={8} sx={{ padding: '20px' }}>
                    <Grid container item xs={12}>
                        <Grid item xs={9}>
                            <Typography fontWeight={900} sx={{ fontSize: '1.4rem' }}>Título proyecto</Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <Button
                                sx={{
                                    backgroundColor: '#069cb1',
                                    borderRadius: '2rem',
                                    color: '#fff',
                                    textTransform: 'none',
                                    padding: '0px 35px',

                                    '&:hover': {
                                        backgroundColor: '#069cb1'
                                    }
                                }}>
                                Aplicar
                            </Button>
                        </Grid>
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Image src="/assets/img/iconos/icono_relog_blue.png" width={20} height={20} alt="" />
                                <Typography sx={{ color: '#069cb1' }}>Fecha límite entrega de aplicaciones: 25/09/2021 12:00 a.m. MST</Typography>
                            </Box>
                        </Grid>
                        <Grid container item xs={12}>
                            <Grid xs={6} item>
                                <Typography sx={{ color: '#069cb1', fontSize: '.9rem' }}>Inicio de proyecto: 10/10/2021 en Ciudad de México</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography sx={{ color: '#069cb1', fontSize: '.9rem' }}>Aceptando aplicaciones de: Todos los estados</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}
