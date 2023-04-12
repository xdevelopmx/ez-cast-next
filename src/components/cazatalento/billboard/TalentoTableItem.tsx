import Image from 'next/image'
import { Box, Grid, Typography } from '@mui/material'
import { Carroucel } from '~/components/shared/Carroucel'
import { MTooltip } from '~/components/shared/MTooltip'

export const TalentoTableItem = () => {
    return (
        <Box sx={{ width: '24%', border: '4px solid #069cb1', marginTop: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', padding: '4px', gap: 0.5, borderBottom: '4px solid #069cb1' }}>
                <MTooltip
                    text='No vistos'
                    color='orange'
                    placement='top'
                    icon={<Image src={'/assets/img/iconos/icon_no_vistos.svg'} width={20} height={20} alt="no vistos" />}
                />
                <MTooltip
                    text='Vistos'
                    color='orange'
                    placement='top'
                    icon={<Image src={'/assets/img/iconos/icon_vistos.svg'} width={20} height={20} alt="no vistos" />}
                />
                <MTooltip
                    text='Destacado'
                    color='orange'
                    placement='top'
                    icon={<Image src={'/assets/img/iconos/icono_star_blue.svg'} width={20} height={20} alt="no vistos" />}
                />
                <MTooltip
                    text='Audición'
                    color='orange'
                    placement='top'
                    icon={<Image src={'/assets/img/iconos/icono_lampara_blue.svg'} width={20} height={20} alt="no vistos" />}
                />
                <MTooltip
                    text='Callback'
                    color='orange'
                    placement='top'
                    icon={<Image src={'/assets/img/iconos/icono_claqueta_blue.svg'} width={20} height={20} alt="no vistos" />}
                />
            </Box>
            <Carroucel slidesPerView={1} navigation>
                <Box sx={{ position: 'relative', width: '100%', aspectRatio: '9/13' }}>
                    <Image
                        style={{ objectFit: 'cover' }}
                        src="/assets/img/iconos/slider_modelo_01.png"
                        fill
                        alt=""
                    />
                </Box>
                <Box sx={{ position: 'relative', width: '100%', aspectRatio: '9/13' }}>
                    <Image
                        style={{ objectFit: 'cover' }}
                        src="/assets/img/iconos/slider_modelo_01.png"
                        fill
                        alt=""
                    />
                </Box>
            </Carroucel>
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
                        <Grid item xs={4} lg={12} xl={4}>
                            <Typography sx={{ textDecoration: 'underline', fontSize: '.8rem' }}>Unión</Typography>
                        </Grid>
                        <Grid item xs={4} lg={12} xl={4}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Image src="/assets/img/iconos/ubicacion.svg" width={10} height={10} alt="" />
                                <Typography sx={{ fontSize: '.8rem' }}>Ubicación</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={4} lg={12} xl={4}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Image style={{ marginRight: 3 }} src="/assets/img/iconos/medida.svg" width={10} height={10} alt="" />
                                <Typography sx={{ fontSize: '.8rem' }}>60kg 1.65m</Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
                <Box sx={{ display: 'flex', gap: 1.5, marginTop: 1 }}>
                    <Image src="/assets/img/iconos/play-video.svg" width={20} height={20} alt="" />
                    <Image src="/assets/img/iconos/documento.svg" width={20} height={20} alt="" />
                    <Image src="/assets/img/iconos/icono_camara_cart_blue.svg" width={20} height={20} alt="" />
                    <Image src="/assets/img/iconos/icono_web_site_blue.svg" width={20} height={20} alt="" />
                </Box>
            </Box>
        </Box>
    )
}
