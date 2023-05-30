import Image from 'next/image'
import { Box, Grid, Typography } from '@mui/material'
import React from 'react'
import { type TalentoInfo } from '../interfaces'
import { convertirMediaObjAString } from '~/utils/fotos'

type Props = {
    talento: TalentoInfo;
}

export const TalentoPreviewShort = ({ talento }: Props) => {
    return (
        <Grid item xs={3}>
            <Box sx={{ cursor: 'pointer' }} onClick={() => console.log('click')}>
                <Box sx={{ position: 'relative', width: '100%', aspectRatio: '1/1' }}>
                    <Image 
                        src={convertirMediaObjAString(talento.media)} 
                        fill 
                        alt="" 
                        style={{ 
                            objectFit: 'cover',
                            borderRadius: '100%' 
                        }} 
                        />
                </Box>
                <Typography sx={{ textAlign: 'center', marginTop: '20px' }}>
                    {`${talento.nombre ?? ''}${`${talento.apellido ? ` ${talento.apellido}` : ''}`}`}
                </Typography>
            </Box>
        </Grid >
    )
}
