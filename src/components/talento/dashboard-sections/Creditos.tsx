import { Grid, Typography } from '@mui/material'
import Image from 'next/image';
import React from 'react'
import { MContainer } from '~/components/layout/MContainer';
import { SectionTitle } from '~/components/shared';
import { MTable } from '~/components/shared/MTable/MTable';

export const Creditos = () => {
    return (
        <Grid container sx={{ mt: 10 }}>
            <Grid item xs={12}>
                <SectionTitle title='Créditos' onClickButton={() => { console.log('click'); }} />
            </Grid>
            <Grid item xs={12}>
                <Typography fontSize={30} sx={{ color: '#4ab7c6' }} fontWeight={900}>8</Typography>
                <MTable
                    backgroundColorHeader='#4ab7c6'
                    columnsHeader={[
                        <Typography key={1} sx={{ color: '#fff' }} fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                            Título
                        </Typography>,
                        <Typography key={1} sx={{ color: '#fff' }} fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                            Rol
                        </Typography>,
                        <Typography key={1} sx={{ color: '#fff' }} fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                            Director
                        </Typography>,
                        <Typography key={1} sx={{ color: '#fff' }} fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                            Año
                        </Typography>,
                        <Typography key={1} sx={{ color: '#fff' }} fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                            Clip
                        </Typography>,
                    ]}
                    data={[
                        {
                            titulo: 'Corto Talent Corner',
                            rol: 'Protagonista',
                            director: 'Bernardo Gómez',
                            anio: '2020',
                            clip: <MContainer direction='horizontal' styles={{ alignItems: 'center' }}>
                                <Typography>Reproducir</Typography>
                                <Image src="/assets/img/iconos/icon_estrella_dorada.svg" width={30} height={30} alt="" />
                            </MContainer>
                        },
                        {
                            titulo: 'Corto Talent Corner',
                            rol: 'Protagonista',
                            director: 'Bernardo Gómez',
                            anio: '2020',
                            clip: <MContainer direction='horizontal' styles={{ alignItems: 'center' }}>
                                <Typography>Reproducir</Typography>
                                <Image src="/assets/img/iconos/icon_estrella_dorada.svg" width={30} height={30} alt="" />
                            </MContainer>
                        },
                        {
                            titulo: 'Corto Talent Corner',
                            rol: 'Protagonista',
                            director: 'Bernardo Gómez',
                            anio: '2020',
                            clip: <MContainer direction='horizontal' styles={{ alignItems: 'center' }}>
                                <Typography>Reproducir</Typography>
                                <Image src="/assets/img/iconos/icon_estrella_dorada.svg" width={30} height={30} alt="" />
                            </MContainer>
                        },
                        {
                            titulo: 'Corto Talent Corner',
                            rol: 'Protagonista',
                            director: 'Bernardo Gómez',
                            anio: '2020',
                            clip: <MContainer direction='horizontal' styles={{ alignItems: 'center' }}>
                                <Typography>Reproducir</Typography>
                                <Image src="/assets/img/iconos/icon_estrella_dorada.svg" width={30} height={30} alt="" />
                            </MContainer>
                        },
                        {
                            titulo: 'Corto Talent Corner',
                            rol: 'Protagonista',
                            director: 'Bernardo Gómez',
                            anio: '2020',
                            clip: <MContainer direction='horizontal' styles={{ alignItems: 'center' }}>
                                <Typography>Reproducir</Typography>
                                <Image src="/assets/img/iconos/icon_estrella_dorada.svg" width={30} height={30} alt="" />
                            </MContainer>
                        },
                        {
                            titulo: 'Corto Talent Corner',
                            rol: 'Protagonista',
                            director: 'Bernardo Gómez',
                            anio: '2020',
                            clip: <MContainer direction='horizontal' styles={{ alignItems: 'center' }}>
                                <Typography>Reproducir</Typography>
                                <Image src="/assets/img/iconos/icon_estrella_dorada.svg" width={30} height={30} alt="" />
                            </MContainer>
                        },
                        {
                            titulo: 'Corto Talent Corner',
                            rol: 'Protagonista',
                            director: 'Bernardo Gómez',
                            anio: '2020',
                            clip: <MContainer direction='horizontal' styles={{ alignItems: 'center' }}>
                                <Typography>Reproducir</Typography>
                                <Image src="/assets/img/iconos/icon_estrella_dorada.svg" width={30} height={30} alt="" />
                            </MContainer>
                        },
                    ]}
                />
            </Grid>
        </Grid>
    )
}
