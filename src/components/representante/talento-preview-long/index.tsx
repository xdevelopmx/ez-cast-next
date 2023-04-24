import { Box, Button, Divider, Grid, Typography } from '@mui/material'
import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

export const TalentoPreviewLong = () => {
    return (
        <Grid container item xs={12} mt={4}>
            <Grid xs={3}>
                <Box sx={{ position: 'relative', width: '100%', aspectRatio: '1/1' }}>
                    <Image src="/assets/img/no-user-image.png" fill alt="" style={{ objectFit: 'cover' }} />
                </Box>
            </Grid>
            <Grid xs={1}></Grid>
            <Grid xs={8}>
                <Grid xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <div className="box_alert_header mr-4">
                            <motion.img src="/assets/img/iconos/bell_blue.svg" alt="" />
                            <span className="count_msn active">2</span>
                        </div>
                    </Box>
                </Grid>
                <Grid xs={12}>
                    <Typography fontWeight={600} sx={{}}>Nombre Talento</Typography>
                </Grid>
                <Grid container xs={12}>
                    <Grid xs={4}>
                        <Button sx={{ textTransform: 'none' }}>
                            <Typography fontWeight={600} sx={{ color: '#069cb1' }}>Ir a Perfil</Typography>
                        </Button>
                    </Grid>
                    <Grid xs={8}>
                        <Button sx={{ textTransform: 'none' }}>
                            <Typography fontWeight={600} sx={{ color: '#069cb1' }}>Ir a Casting Billboard</Typography>
                        </Button>
                    </Grid>
                </Grid>
                <Grid xs={12}>

                </Grid>
            </Grid>
            <Grid xs={12} mt={4}>
                <Divider />
            </Grid>
        </Grid>
    )
}
