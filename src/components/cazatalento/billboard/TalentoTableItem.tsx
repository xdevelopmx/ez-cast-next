import Image from 'next/image'
import { Box, Grid, Typography } from '@mui/material'
import { Carroucel } from '~/components/shared/Carroucel'
import { MTooltip } from '~/components/shared/MTooltip'
import { useMemo } from 'react'

export const TalentoTableItem = (props: {
    id_estado_aplicacion_rol: number,
    nombre: string,
    rating: number,
    union: string,
    ubicacion: string,
    peso: number,
    altura: number,
    images_urls: string[]
}) => {
    const images = useMemo(() => {
        if (props.images_urls.length === 0) {
            return [<Image key={1} style={{ objectFit: 'cover' }} src={'/assets/img/no-image.png'} fill alt="" />];
        }
        return props.images_urls.map((url, i) => {
            return <Image key={i} style={{ objectFit: 'cover' }} src={url} fill alt="" />;
        });
    }, [props.images_urls]);
    return (
        <Box sx={{ width: '24%', border: '4px solid #069cb1', marginTop: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', padding: '4px', gap: 0.5, borderBottom: '4px solid #069cb1' }}>
                <MTooltip
                    text='No vistos'
                    color='orange'
                    placement='top'
                    icon={<Image
                        style={{filter: (props.id_estado_aplicacion_rol === 2) ? 'brightness(0) saturate(100%) invert(85%) sepia(21%) saturate(2191%) hue-rotate(331deg) brightness(99%) contrast(97%)' : ''}}
                        src={'/assets/img/iconos/icon_no_vistos.svg'} 
                        width={20} 
                        height={20} 
                        alt="no vistos" 
                    />}
                />
                <MTooltip
                    text='Vistos'
                    color='orange'
                    placement='top'
                    icon={<Image 
                        style={{filter: (props.id_estado_aplicacion_rol === 3) ? 'brightness(0) saturate(100%) invert(85%) sepia(21%) saturate(2191%) hue-rotate(331deg) brightness(99%) contrast(97%)' : ''}}
                        src={'/assets/img/iconos/icon_vistos.svg'} 
                        width={20} 
                        height={20} 
                        alt="Vistos" 
                    />}
                />
                <MTooltip
                    text='Destacado'
                    color='orange'
                    placement='top'
                    icon={<Image 
                        style={{filter: (props.id_estado_aplicacion_rol === 4) ? 'brightness(0) saturate(100%) invert(85%) sepia(21%) saturate(2191%) hue-rotate(331deg) brightness(99%) contrast(97%)' : ''}}
                        src={'/assets/img/iconos/icono_star_blue.svg'} 
                        width={20} 
                        height={20} 
                        alt="Destacado" 
                    />}
                />
                <MTooltip
                    text='Audición'
                    color='orange'
                    placement='top'
                    icon={<Image 
                        style={{filter: (props.id_estado_aplicacion_rol === 5) ? 'brightness(0) saturate(100%) invert(85%) sepia(21%) saturate(2191%) hue-rotate(331deg) brightness(99%) contrast(97%)' : ''}}
                        src={'/assets/img/iconos/icono_lampara_blue.svg'} 
                        width={20} 
                        height={20} 
                        alt="Audicion" 
                    />}
                />
                <MTooltip
                    text='Callback'
                    color='orange'
                    placement='top'
                    icon={<Image 
                        style={{filter: (props.id_estado_aplicacion_rol === 1) ? 'brightness(0) saturate(100%) invert(85%) sepia(21%) saturate(2191%) hue-rotate(331deg) brightness(99%) contrast(97%)' : ''}}
                        src={'/assets/img/iconos/icono_claqueta_blue.svg'} 
                        width={20} 
                        height={20} 
                        alt="callback" 
                    />}
                />
            </Box>
            <Carroucel slidesPerView={1} navigation>
                {images.map((img, i) => {
                    return <Box key={i} sx={{ position: 'relative', width: '100%', aspectRatio: '9/13' }}>
                            {img}
                        </Box>
                    })
                }                
            </Carroucel>
            <Box sx={{ padding: '10px' }}>
                <Typography fontWeight={800} sx={{ color: '#069cb1' }}>{props.nombre}</Typography>
                <Box sx={{ display: 'flex', gap: .5 }}>
                    <Image src="/assets/img/iconos/estrella-fill.svg" width={10} height={10} alt="" />
                    <Image src="/assets/img/iconos/estrella-fill.svg" width={10} height={10} alt="" />
                    <Image src="/assets/img/iconos/estrella-fill.svg" width={10} height={10} alt="" />
                    <Image src="/assets/img/iconos/estrella-fill.svg" width={10} height={10} alt="" />
                </Box>
                <Box sx={{ display: 'flex' }}>
                    <Grid container xs={12}>
                        <Grid item xs={4} lg={12} xl={4}>
                            <Typography sx={{ textDecoration: 'underline', fontSize: '.8rem' }}>{props.union}</Typography>
                        </Grid>
                        <Grid item xs={4} lg={12} xl={4}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Image src="/assets/img/iconos/ubicacion.svg" width={10} height={10} alt="" />
                                <Typography sx={{ fontSize: '.8rem' }}>{props.ubicacion}</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={4} lg={12} xl={4}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Image style={{ marginRight: 3 }} src="/assets/img/iconos/medida.svg" width={10} height={10} alt="" />
                                <Typography sx={{ fontSize: '.8rem' }}>{props.peso}kg {props.altura}m</Typography>
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
