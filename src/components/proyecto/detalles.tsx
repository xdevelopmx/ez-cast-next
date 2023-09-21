import Image from 'next/image'
import { Box, Button, CircularProgress, Divider, Grid, Typography } from '@mui/material'
import React, { type ReactNode, type FC, type CSSProperties, useState, Fragment, useContext } from 'react'
import { MContainer } from '../layout/MContainer'
import { motion } from 'framer-motion';
import { conversorFecha } from '~/utils/conversor-fecha';
import { api } from '~/utils/api';
import AppContext from '~/context/app';
import useLang from '~/hooks/useLang';

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

interface PropsProyecto {
    id_proyecto: number,
    minHeight: number | string,
}

const GridMotion = motion(Grid)
const MotionImage = motion(Image)

const containerVariants = {
    closed: {
        height: 0,
        opacity: 0,
        padding: 0
    },
    open: {
        height: "auto",
        opacity: 1,
        padding: '20px'
    }
};

export const DetallesProyecto: FC<PropsProyecto> = (props) => {
    const ctx = useContext(AppContext);
    const textos = useLang(ctx.lang);
    const proyecto = api.proyectos.getById.useQuery(props.id_proyecto, {
        refetchOnWindowFocus: false
    });

    return (
        <Box minHeight={props.minHeight}>
            {proyecto.isFetching && <CircularProgress sx={{width: 100, height: 64, marginLeft: 'calc(50% - 8px)', marginTop: 'calc(50% - 150px)'}} />}
            {!proyecto.isFetching &&
            
                <Grid item container xs={12} sx={{ border: '2px solid #928F8F', paddingBottom: '0' }}>
                    <GridMotion container item xs={12} sx={{ alignItems: 'center', padding: '10px' }}>
                        <Grid item xs={4}>
                            <Box sx={{ position: 'relative', width: '100%', aspectRatio: '6/11' }}>
                                <Image src={(proyecto.data && proyecto.data.foto_portada) ? proyecto.data.foto_portada.url : '/assets/img/no-image.png'} style={{ objectFit: 'cover' }} fill alt="" />
                            </Box>
                        </Grid>
                        <Grid
                            container item xs={8} sx={{ padding: '15px 24px' }}
                        >
                            <Grid container item xs={12}>
                                <Grid item xs={9}>
                                    <Typography fontWeight={800} sx={{ fontSize: '1.4rem' }}>
                                        {proyecto.data?.nombre}
                                    </Typography>
                                </Grid>
                                <Grid container item xs={12}>
                                    <Grid item xs={6}>
                                        <Typography sx={{ color: '#069cb1', fontSize: '.9rem' }}>
                                            {`${textos['aceptando_aplicaciones_de']}`}:
                                            <Typography component={'span'} sx={{ marginLeft: '5px', color: '#069cb1', fontSize: '.9rem' }}>
                                            {proyecto.data?.estado_republica.es}
                                            </Typography>
                                        </Typography>
                                    </Grid>
                                </Grid>

                                <Grid item xs={12}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Image style={{ borderRadius: '50%', border: '2px solid #000' }} src={(proyecto.data && proyecto.data.cazatalentos && proyecto.data.cazatalentos.foto_perfil) ? proyecto.data.cazatalentos.foto_perfil.url : '/assets/img/no-image.png'} width={30} height={30} alt="" />

                                        <Typography sx={{ fontSize: '1rem' }}>{`${textos['proyecto_por']}`}: </Typography>

                                        <Box sx={{ display: 'flex', alignItems: 'center', paddingLeft: '10px', gap: 1 }}>
                                            <Typography sx={{ color: '#069cb1', fontSize: '1rem' }}>{proyecto.data?.cazatalentos.nombre} {proyecto.data?.cazatalentos.apellido}</Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} mt={1}>
                                    <Divider sx={{ borderWidth: 1 }} />
                                </Grid>
                                <Grid xs={12}>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                                        <Typography>
                                            {(proyecto.data && proyecto.data.sindicato) ? (proyecto.data.sindicato.id_sindicato === 99) ? proyecto.data.sindicato.descripcion : proyecto.data.sindicato.sindicato.es : 'N/D'}
                                        </Typography>
                                        <Divider style={{ borderWidth: 1, height: 12, borderColor: '#069cb1', margin: 8 }} orientation='vertical' />
                                        <Typography>
                                            {(proyecto.data && proyecto.data.tipo) ? (proyecto.data.tipo.id_tipo_proyecto === 99) ? proyecto.data.tipo.descripcion : proyecto.data.tipo.tipo_proyecto.es : 'N/D'}
                                        </Typography>
                                        <Divider style={{ borderWidth: 1, height: 12, borderColor: '#069cb1', margin: 8 }} orientation='vertical' />
                                    </Box>
                                    <Typography>
                                        <Typography fontWeight={600} component={'span'} sx={{ paddingRight: '10px' }}>Sinopsis:</Typography>
                                        {proyecto.data?.sinopsis}
                                    </Typography>
                                </Grid>
                                {proyecto.data && proyecto.data.detalles_adicionales && 
                                    <IndividualData title={`${textos['detalles_adicionales']}:`}>
                                        <Typography fontWeight={400} component={'span'} sx={{ paddingRight: '10px' }}>
                                            {proyecto.data.detalles_adicionales}
                                        </Typography>
                                    </IndividualData>
                                }

                                <IndividualData title={`${textos['casting_director']}:`}>
                                    <Typography component={'span'} sx={{ color: '#928F8F' }}>
                                        {proyecto.data?.director_casting}
                                    </Typography>
                                </IndividualData>
                                {proyecto.data && proyecto.data.productor &&
                                    <IndividualData title={`${textos['productor']}:`}>
                                    
                                    </IndividualData>
                                }

                                {proyecto.data && proyecto.data.casa_productora &&
                                    <IndividualData title={`${textos['casa_productora']}:`}>
                                        {proyecto.data.casa_productora}
                                    </IndividualData>
                                }

                                {proyecto.data && proyecto.data.director &&
                                    <IndividualData title={'Director:'}>
                                        {proyecto.data.director}
                                    </IndividualData>
                                }

                                {proyecto.data && proyecto.data.agencia_publicidad &&
                                    <IndividualData title={`${textos['agencia_publicidad']}:`}>
                                        {proyecto.data.agencia_publicidad}
                                    </IndividualData>
                                } 
                            </Grid>
                        </Grid>
                    </GridMotion>
                </Grid>
            }
        </Box>
    )
}
