import { Circle } from '@mui/icons-material'
import { Box, Grid, Skeleton, Typography } from '@mui/material'
import Image from 'next/image'
import React, { type CSSProperties } from 'react'

const estilos_ellipsis: CSSProperties = {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
}

export const PreviewConversation = (props: {
    loading: boolean,
    nombre?: string,
    profile_url?: string,
    hora?: string,
    visto?: boolean,
    mensaje?: string,
    nombre_proyecto?: string
}) => {
    return (
        <Grid container xs={12} sx={{
            padding: '10px 10px',
            borderBottom: '2px solid #B4B5B6',
            height: '100px',
        }}>
            <Grid item xs={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {props.loading &&
                        <Skeleton width={64} height={64} variant='circular'/>
                    }
                    {!props.loading && 
                        <Box  
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center', // Alinea verticalmente al centro
                            position: 'relative', // Añade esta línea para que el posicionamiento sea relativo al contenedor
                            width: '60px',
                            aspectRatio: '1/1',
                          }}
                        >
                            {/* {!props.visto && <Circle style={{ position: 'absolute', color: '#069cb1', width: 16, height: 16, top: '50%', right: '100%' }} />} */}
                            {!Boolean(props.visto) &&
                                <Circle 
                                style={{
                                    position: 'absolute',
                                    color: '#069cb1',
                                    width: 16,
                                    height: 16,
                                    top: 0,
                                    left: 0, // Ajusta la posición según tus necesidades
                                    transform: 'translateY(-50%)', // Centra verticalmente el círculo
                                }}
                                />
                            
                            }

                            <Image 

                            style={{
                                borderRadius: '100%',
                                padding: '4px',
                                objectFit: 'cover',
                                width: '100%', // Añade esta línea para que la imagen ocupe el 100% del contenedor
                              }}
                            src={`${props.profile_url}`} width={64} height={64} alt="" />
                        </Box>
                    }
             
            </Grid>
            <Grid item container xs={10} >
                <Grid item xs={12} >
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        
                    }}>
                        <Box sx={{
                            width: '57%',

                        }}>
                            {props.loading &&
                                <Skeleton width={150}/>
                            }
                            {!props.loading &&
                                <Typography fontWeight={600} sx={estilos_ellipsis}>
                                    {props.nombre}
                                </Typography>
                            }
                        </Box>
                        <Box sx={{
                            width: '43%',
                            ...estilos_ellipsis
                        }}>
                            {props.loading &&
                                <Skeleton width={150}/>
                            }
                            {!props.loading &&
                                <Typography sx={{ color: '#888585', fontSize: '14px', textAlign: 'end', ...estilos_ellipsis}}>
                                    {props.hora}
                                </Typography>
                            }
                        </Box>

                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <Box >
                        {props.loading &&
                            <Skeleton width={200}/>
                        }
                        {!props.loading && props.nombre_proyecto &&
                            <Typography sx={estilos_ellipsis}>
                                {props.nombre_proyecto}
                            </Typography>
                        }
                    </Box>
                </Grid>
                
                <Grid item xs={12}>
                    <Box>
                        {props.loading &&
                            <Skeleton/>
                        }
                        {!props.loading &&
                            <Typography sx={estilos_ellipsis}>
                                {props.mensaje}
                            </Typography>
                        }
                    </Box>
                </Grid>
            </Grid>
        </Grid >
    )
}
