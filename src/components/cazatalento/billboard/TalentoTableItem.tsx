import Image from 'next/image'
import { Box, Grid, Typography } from '@mui/material'

export const TalentoTableItem = () => {
    return (
        <Box sx={{ width: '24%', border: '4px solid #069cb1', marginTop: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', padding: '4px', gap: 2, borderBottom: '4px solid #069cb1' }}>
                <Image src={'/assets/img/iconos/icon_no_vistos.svg'} width={20} height={20} alt="no vistos" />
                <Image src={'/assets/img/iconos/icon_vistos.svg'} width={20} height={20} alt="no vistos" />
                <Image src={'/assets/img/iconos/icono_star_blue.svg'} width={20} height={20} alt="no vistos" />
                <Image src={'/assets/img/iconos/icono_lampara_blue.svg'} width={20} height={20} alt="no vistos" />
                <Image src={'/assets/img/iconos/icono_claqueta_blue.svg'} width={20} height={20} alt="no vistos" />
            </Box>
            <Box sx={{ position: 'relative', width: '100%', aspectRatio: '9/13' }}>
                <Image
                    style={{ objectFit: 'cover' }}
                    src="/assets/img/iconos/slider_modelo_01.png"
                    fill
                    alt=""
                />
            </Box>
            <Box sx={{ padding: '10px' }}>
                <Typography fontWeight={800} sx={{ color: '#069cb1' }}>NOMBRE DEL ACTOR</Typography>
                <Box sx={{ display: 'flex', gap: .5 }}>
                    <Image src="/assets/img/iconos/estrella-fill.svg" width={10} height={10} alt="" />
                    <Image src="/assets/img/iconos/estrella-fill.svg" width={10} height={10} alt="" />
                    <Image src="/assets/img/iconos/estrella-fill.svg" width={10} height={10} alt="" />
                    <Image src="/assets/img/iconos/estrella-fill.svg" width={10} height={10} alt="" />
                    <Image src="/assets/img/iconos/estrella-fill.svg" width={10} height={10} alt="" />
                </Box>
                <Box sx={{ display: 'flex' }}>
                    <Grid container xs={12}>
                        <Grid item xs={4} lg={6} xl={4}>
                            <Typography sx={{ textDecoration: 'underline', fontSize: '.8rem' }}>Unión</Typography>
                        </Grid>
                        <Grid item xs={4} lg={6} xl={4}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Image src="/assets/img/iconos/ubicacion.svg" width={10} height={10} alt="" />
                                <Typography sx={{ fontSize: '.8rem' }}>Ubicación</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={4} lg={6} xl={4}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Image style={{ marginRight: 3 }} src="/assets/img/iconos/medida.svg" width={10} height={10} alt="" />
                                <Typography sx={{ fontSize: '.8rem' }}>60kg 1.65m</Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Box>
    )
}
