import Image from 'next/image'
import { Box, Grid, Typography } from '@mui/material'
import React from 'react'

export const TalentoPreviewShort = () => {
    return (
        <Grid item xs={3}>
            <Box sx={{ cursor: 'pointer' }} onClick={() => console.log('click')}>
                <Box sx={{ position: 'relative', width: '100%', aspectRatio: '1/1' }}>
                    <Image src="/assets/img/no-user-image.png" fill alt="" style={{objectFit: 'cover'}} />
                </Box>
                <Typography sx={{ textAlign: 'center', marginTop: '20px' }}>Nombre Talento</Typography>
            </Box>
        </Grid >
    )
}
