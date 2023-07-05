import Image from 'next/image'
import { Box, Grid, Typography } from '@mui/material'
import React from 'react'
import { type TalentoInfo } from '../interfaces'
import { convertirMediaObjAString } from '~/utils/fotos'
import { Media, MediaPorTalentos, Talentos } from '@prisma/client'
import { useRouter } from 'next/router'

type Props = {
    talento: Talentos & { media: (MediaPorTalentos & { media: Media; })[]; }
}

export const TalentoPreviewShort = ({ talento }: Props) => {
    const router = useRouter();
    const profile = talento.media.filter(m => m.media.identificador.match('foto-perfil-talento'))[0];
                                                                    
    return (
        <Grid item xs={3}>
            <Box 
                sx={{ cursor: 'pointer' }} 
                onClick={() => {
                    router.push(`/talento/dashboard?id_talento=${talento.id}`,)
                }}
            >
                <Box sx={{ position: 'relative', width: '100%', aspectRatio: '1/1' }}>
                    <Image 
                        src={(profile) ? profile.media.url : '/assets/img/no-user-image.png'} 
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
