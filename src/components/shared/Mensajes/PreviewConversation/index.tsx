import { Box, Grid, Typography } from '@mui/material'
import Image from 'next/image'
import React, { type CSSProperties } from 'react'

const estilos_ellipsis: CSSProperties = {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
}

export const PreviewConversation = () => {
    return (
        <Grid item container xs={12} sx={{
            padding: '10px 20px',
            borderBottom: '2px solid #B4B5B6',
            height: '100px'
        }}>
            <Grid item xs={4}>
                <Box sx={{
                    position: 'relative',
                    width: '60px',
                    aspectRatio: '1/1'
                }}>
                    <Image style={{
                        borderRadius: '100%'
                    }} src={'/assets/img/slider_modelo_02.png'} fill alt="" />
                </Box>
            </Grid>
            <Grid item container xs={8}>
                <Grid item xs={12}>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        <Box sx={{
                            width: '60%',

                        }}>
                            <Typography fontWeight={600} sx={estilos_ellipsis}>
                                Nombre
                            </Typography>
                        </Box>
                        <Box sx={{
                            width: '40%',
                            ...estilos_ellipsis
                        }}>
                            <Typography sx={{ color: '#888585', ...estilos_ellipsis }}>
                                10/12/21 3:01 pm
                            </Typography>
                        </Box>

                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <Box>
                        <Typography sx={estilos_ellipsis}>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque dicta fugit ducimus at incidunt accusamus, magni eligendi dolor mollitia reiciendis nulla esse assumenda nam voluptatum? Dicta illum quidem architecto sequi.
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
        </Grid >
    )
}
