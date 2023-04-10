import Image from 'next/image'
import { Box, Typography } from '@mui/material'
import React from 'react'

export const TalentoTableItem = () => {
    return (
        <Box sx={{ width: '24%', border: '4px solid #069cb1' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', padding: '10px', gap: 2 }}>
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
            </Box>
        </Box>
    )
}
