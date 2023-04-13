import Image from 'next/image'
import { Box, Button, Divider, Grid, Typography } from '@mui/material'
import React, { type ReactNode, type FC, type CSSProperties } from 'react'
import { MContainer } from '../layout/MContainer'

interface PropsIndividualData {
    title: ReactNode;
    children: ReactNode;
    stylesContainerData?: CSSProperties;
}

const IndividualData: FC<PropsIndividualData> = ({ title, children, stylesContainerData = {} }) => {
    return (
        <>
            <Grid item xs={12} mt={1}>
                <Divider />
            </Grid>
            <Grid item container xs={12}>
                <MContainer direction='horizontal'>
                    <Typography fontWeight={600} sx={{ color: '#928F8F', paddingRight: 1 }}>{title}</Typography>
                    <MContainer direction='horizontal' styles={stylesContainerData}>
                        {children}
                    </MContainer>
                </MContainer>
            </Grid>
        </>
    )
}

export const ProjectPreview = () => {
    return (
        <Grid item container xs={12} sx={{ border: '2px solid #928F8F' }}>
            <Grid container item xs={12} sx={{ alignItems: 'flex-start' }}>
                <Grid item xs={4}>
                    <Box sx={{ position: 'relative', width: '100%', aspectRatio: '16/12' }}>
                        <Image src="/assets/img/granja.jpg" style={{ objectFit: 'cover' }} fill alt="" />
                    </Box>
                </Grid>
                <Grid container item xs={8} sx={{ padding: '20px' }}>
                    <Grid container item xs={12}>
                        <Grid item xs={9}>
                            <Typography fontWeight={900} sx={{ fontSize: '1.4rem' }}>Título proyecto</Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <Button
                                sx={{
                                    backgroundColor: '#069cb1',
                                    borderRadius: '2rem',
                                    color: '#fff',
                                    textTransform: 'none',
                                    padding: '0px 35px',

                                    '&:hover': {
                                        backgroundColor: '#069cb1'
                                    }
                                }}>
                                Aplicar
                            </Button>
                        </Grid>
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Image src="/assets/img/iconos/icono_relog_blue.png" width={20} height={20} alt="" />
                                <Typography sx={{ color: '#069cb1' }}>Fecha límite entrega de aplicaciones: 25/09/2021 12:00 a.m. MST</Typography>
                            </Box>
                        </Grid>
                        <Grid container item xs={12}>
                            <Grid xs={6} item>
                                <Typography sx={{ color: '#069cb1', fontSize: '.9rem' }}>Inicio de proyecto: 10/10/2021 en Ciudad de México</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography sx={{ color: '#069cb1', fontSize: '.9rem' }}>Aceptando aplicaciones de: Todos los estados</Typography>
                            </Grid>
                        </Grid>

                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Image style={{ borderRadius: '50%', border: '2px solid #000' }} src="/assets/img/slider_modelo_01.png" width={30} height={30} alt="" />

                                <Typography sx={{ fontSize: '1rem' }}>Proyecto por: Iván Águila Orea</Typography>

                                <Box sx={{ display: 'flex', alignItems: 'center', paddingLeft: '10px', gap: 1 }}>
                                    <Image src="/assets/img/iconos/eye_blue.svg" width={20} height={20} alt="" />
                                    <Typography sx={{ color: '#069cb1', fontSize: '1rem' }}>Ver perfil</Typography>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={12} mt={1}>
                            <Divider sx={{ borderWidth: 1 }} />
                        </Grid>
                        <Grid xs={12}>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                                <Typography>
                                    Comercial web
                                </Typography>
                                <Divider style={{ borderWidth: 1, height: 12, borderColor: '#069cb1', margin: 8 }} orientation='vertical' />

                                <Typography>
                                    Crédito en pantalla
                                </Typography>
                                <Divider style={{ borderWidth: 1, height: 12, borderColor: '#069cb1', margin: 8 }} orientation='vertical' />

                                <Typography>
                                    Sin unión
                                </Typography>
                                <Divider style={{ borderWidth: 1, height: 12, borderColor: '#069cb1', margin: 8 }} orientation='vertical' />
                            </Box>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                                <Typography>
                                    Principal- En cuadro
                                </Typography>
                                <Divider style={{ borderWidth: 1, height: 12, borderColor: '#069cb1', margin: 8 }} orientation='vertical' />
                                <Typography>
                                    Mujer
                                </Typography>
                                <Divider style={{ borderWidth: 1, height: 12, borderColor: '#069cb1', margin: 8 }} orientation='vertical' />
                                <Typography>
                                    18-25
                                </Typography>
                                <Divider style={{ borderWidth: 1, height: 12, borderColor: '#069cb1', margin: 8 }} orientation='vertical' />
                                <Typography>
                                    Latino/Hispano
                                </Typography>
                                <Divider style={{ borderWidth: 1, height: 12, borderColor: '#069cb1', margin: 8 }} orientation='vertical' />
                                <Typography>
                                    Nacionalidad
                                </Typography>
                            </Box>
                            <Typography>
                                <Typography fontWeight={600} component={'span'}>Descripción:</Typography> Características del personaje y el rol que interpretará
                                Características del personaje y el rol que interpretar dkshdk qo...
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent pell
                                entesque ut purus at malesuada. Pellentesque at metus at felis egestas
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent pell
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item container xs={12} sx={{ padding: '20px' }}>

                <IndividualData title={'Habilidades:'}>
                    <Typography component={'span'} sx={{ color: '#928F8F' }}>Danza</Typography>
                    <Divider style={{ borderWidth: 1, height: 12, borderColor: '#069cb1', margin: 8 }} orientation='vertical' />
                    <Typography component={'span'} sx={{ color: '#928F8F' }}>Canto</Typography>
                </IndividualData>

                <IndividualData title={'Desnudos o situaciones sexuales:'}>
                    <Typography component={'span'} sx={{ color: '#928F8F' }}>Si desnudos</Typography>
                    <Divider style={{ borderWidth: 1, height: 12, borderColor: '#069cb1', margin: 8 }} orientation='vertical' />
                    <Typography component={'span'} sx={{ color: '#928F8F' }}>No situación sexual</Typography>
                    <Divider style={{ borderWidth: 1, height: 12, borderColor: '#069cb1', margin: 8 }} orientation='vertical' />
                    <Typography component={'span'} sx={{ color: '#928F8F' }}>Descripción del tipo de situación</Typography>
                </IndividualData>

                <IndividualData title={'Locación de casting y fechas:'}>
                    <Typography component={'span'} sx={{ color: '#928F8F' }}>Lugar</Typography>
                    <Divider style={{ borderWidth: 1, height: 12, borderColor: '#069cb1', margin: 8 }} orientation='vertical' />
                    <Typography component={'span'} sx={{ color: '#928F8F' }}>25/09/2021</Typography>
                </IndividualData>


                <IndividualData title={'Locación de filmación y fechas:'}>
                    <Typography component={'span'} sx={{ color: '#928F8F' }}>Lugar</Typography>
                    <Divider style={{ borderWidth: 1, height: 12, borderColor: '#069cb1', margin: 8 }} orientation='vertical' />
                    <Typography component={'span'} sx={{ color: '#928F8F' }}>25/09/2021</Typography>
                </IndividualData>

                <IndividualData title={'Presentación de solicitud:'}>
                    <Typography component={'span'} sx={{ color: '#928F8F' }}>Lugar</Typography>
                    <Divider style={{ borderWidth: 1, height: 12, borderColor: '#069cb1', margin: 8 }} orientation='vertical' />
                    <Typography component={'span'} sx={{ color: '#928F8F' }}>25/09/2021</Typography>
                    <Divider style={{ borderWidth: 1, height: 12, borderColor: '#069cb1', margin: 8 }} orientation='vertical' />
                    <Typography component={'span'} sx={{ color: '#928F8F' }}>14:00 UTC(CNM) – 5</Typography>
                </IndividualData>

                <IndividualData title={'Información del trabajo/notas:'}>
                    <Typography component={'span'} sx={{ color: '#928F8F' }}>Disponibilidad de viajar</Typography>
                </IndividualData>

                <IndividualData title={'Requisitos:'}>
                    <Typography component={'span'} sx={{ color: '#928F8F' }}>Foto</Typography>
                    <Divider style={{ borderWidth: 1, height: 12, borderColor: '#069cb1', margin: 8 }} orientation='vertical' />
                    <Typography component={'span'} sx={{ color: '#928F8F' }}>Video</Typography>
                    <Divider style={{ borderWidth: 1, height: 12, borderColor: '#069cb1', margin: 8 }} orientation='vertical' />
                    <Typography component={'span'} sx={{ color: '#928F8F' }}>Audio</Typography>
                    <Divider style={{ borderWidth: 1, height: 12, borderColor: '#069cb1', margin: 8 }} orientation='vertical' />
                    <Typography component={'span'} sx={{ color: '#928F8F' }}>Texto requisitos o notas</Typography>
                </IndividualData>

                <IndividualData title={'Archivos adicionales:'} stylesContainerData={{ gap: 10 }}>
                    <Typography component={'span'} sx={{ color: '#069cb1', textDecoration: 'underline' }}>lineas.pdf</Typography>
                    <Typography component={'span'} sx={{ color: '#069cb1', textDecoration: 'underline' }}>headshot.jpg</Typography>
                    <Typography component={'span'} sx={{ color: '#069cb1', textDecoration: 'underline' }}>referencia1.jpg</Typography>
                    <Typography component={'span'} sx={{ color: '#069cb1', textDecoration: 'underline' }}>referencia2.jpg</Typography>
                </IndividualData>
            </Grid>
        </Grid>
    )
}
