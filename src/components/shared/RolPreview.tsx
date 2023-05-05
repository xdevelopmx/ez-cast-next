import Image from 'next/image'
import { Avatar, Box, Button, Dialog, DialogContent, Divider, Grid, IconButton, Slide, Typography } from '@mui/material'
import React, { type ReactNode, type FC, type CSSProperties, useState, Fragment } from 'react'
import { MContainer } from '../layout/MContainer'
import { motion } from 'framer-motion';
import { type RolCompletoPreview } from './RolesTable';
import { conversorFecha } from '~/utils/conversor-fecha';
import { TransitionProps } from '@mui/material/transitions'
import { User } from 'next-auth';
import { Cazatalentos } from '@prisma/client';
import { Close } from '@mui/icons-material';


interface PropsIndividualData {
    title: ReactNode;
    children: ReactNode;
    stylesContainerData?: CSSProperties;
}

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
      children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
  ) {
    return <Slide direction="down" ref={ref} {...props} />;
});

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

interface PropsRol {
    rol: RolCompletoPreview;
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

export const RolPreview: FC<PropsRol> = ({ rol }) => {
    const [dialogImage, setDialogImage] = useState<{open: boolean, image: string}>({open: false, image: ''});
    const [dialogInfoProductor, setDialogInfoProductor] = useState<{open: boolean}>({open: false});
    
    const [showPreview, setShowPreview] = useState(false)
    return (
        <Grid item container xs={12} sx={{ border: '2px solid #928F8F' }}>
            <GridMotion container item xs={12} sx={{ alignItems: 'flex-start' }}>
                <Grid item xs={4}>
                    <Box sx={{ position: 'relative', width: '100%', aspectRatio: '16/12' }}>
                        <Image onClick={() => { setDialogImage({open: true, image: (rol.proyecto.foto_portada) ? rol.proyecto.foto_portada.url : '/assets/img/no-image.png' }) }}  src={(rol.proyecto.foto_portada) ? rol.proyecto.foto_portada.url : '/assets/img/no-image.png'} style={{ objectFit: 'cover', cursor: 'pointer' }} fill alt="" />
                    </Box>
                </Grid>
                <Grid
                    container item xs={8} sx={{ padding: '20px' }}
                >
                    <Grid container item xs={12}>
                        <Grid item xs={9}>
                            <Typography fontWeight={900} sx={{ fontSize: '1.4rem' }}>
                                {rol.proyecto.nombre} id: {rol.id}
                            </Typography>
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
                                <Typography sx={{ color: '#069cb1' }}>
                                    Fecha límite entrega de aplicaciones:
                                    <Typography component={'span'} sx={{ color: '#069cb1', marginLeft: '5px' }}>
                                        {rol.casting && rol.casting.length > 0 && conversorFecha(new Date(Math.max(
                                            ...rol.casting.map(c => (c.fecha_fin?.getTime() || c.fecha_inicio?.getTime() || 0))
                                        ))) || 'No especificado'}
                                    </Typography>
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid container item xs={12}>
                            <Grid xs={6} item>
                                <Typography sx={{ color: '#069cb1', fontSize: '.9rem' }}>
                                    Inicio de proyecto:
                                    <Typography component={'span'} sx={{ paddingLeft: '5px', paddingRight: '5px', color: '#069cb1', fontSize: '.9rem' }}>
                                        {rol.filmaciones && rol.filmaciones.length > 0 && rol.filmaciones[0]?.fecha_inicio && conversorFecha(rol.filmaciones[0]?.fecha_inicio) || 'No especificado'}
                                    </Typography>
                                    en {rol.casting && rol.casting.length > 0 && rol.casting[0]?.estado_republica.es || 'No especificado'}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography sx={{ color: '#069cb1', fontSize: '.9rem' }}>
                                    Aceptando aplicaciones de:
                                    <Typography component={'span'} sx={{ marginLeft: '5px', color: '#069cb1', fontSize: '.9rem' }}>
                                        {rol.casting && rol.casting.length > 0 && rol.casting.reduce((acumulador, current) => (
                                            acumulador += current.estado_republica.es + ', '
                                        ), '').slice(0, -2) || 'No especificado'}
                                    </Typography>
                                </Typography>
                            </Grid>
                        </Grid>

                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Image style={{ borderRadius: '50%', border: '2px solid #000' }} src={(rol.proyecto.cazatalentos.foto_perfil) ? rol.proyecto.cazatalentos.foto_perfil.url : '/assets/img/no-image.png'} width={30} height={30} alt="" />

                                <Typography sx={{ fontSize: '1rem' }}>Proyecto por: {rol.proyecto.productor}</Typography>

                                <Box sx={{ display: 'flex', alignItems: 'center', paddingLeft: '10px', gap: 1, cursor: 'pointer' }}>
                                    <Image src="/assets/img/iconos/eye_blue.svg" width={20} height={20} alt="" />
                                    <Button onClick={() => { setDialogInfoProductor({ open: true })}} style={{textTransform: 'capitalize'}}>Ver perfil</Button>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={12} mt={1}>
                            <Divider sx={{ borderWidth: 1 }} />
                        </Grid>
                        <Grid xs={12}>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                                <Typography>
                                    {rol.proyecto.tipo.tipo_proyecto.es}
                                </Typography>
                                <Divider style={{ borderWidth: 1, height: 12, borderColor: '#069cb1', margin: 8 }} orientation='vertical' />

                                {
                                    rol?.compensaciones &&
                                        rol.compensaciones?.compensaciones_no_monetarias &&
                                        rol.compensaciones.compensaciones_no_monetarias.length > 0
                                        ? rol.compensaciones.compensaciones_no_monetarias.map(c => (
                                            <Fragment key={c.id}>
                                                <Typography>
                                                    {c.compensacion.es}
                                                </Typography>
                                                <Divider style={{ borderWidth: 1, height: 12, borderColor: '#069cb1', margin: 8 }} orientation='vertical' />
                                            </Fragment>
                                        ))
                                        : <>
                                            <Typography>
                                                No especificado
                                            </Typography>
                                            <Divider style={{ borderWidth: 1, height: 12, borderColor: '#069cb1', margin: 8 }} orientation='vertical' />
                                        </>
                                }

                                <Typography>
                                    {rol.proyecto.sindicato.sindicato.es}
                                </Typography>
                                <Divider style={{ borderWidth: 1, height: 12, borderColor: '#069cb1', margin: 8 }} orientation='vertical' />

                                <Button onClick={() => setShowPreview(v => !v)}>
                                    <MotionImage
                                        src="/assets/img/iconos/arrow_d_blue.svg"
                                        width={20}
                                        height={20}
                                        alt=""
                                        animate={{
                                            rotate: showPreview ? '180deg' : '0'
                                        }}
                                    />
                                </Button>
                            </Box>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                                <Typography>
                                    {rol?.tipo_rol?.tipo || 'No especificado'}
                                </Typography>
                                <Divider style={{ borderWidth: 1, height: 12, borderColor: '#069cb1', margin: 8 }} orientation='vertical' />

                                {
                                    rol.filtros_demograficos && rol.filtros_demograficos.generos && rol.filtros_demograficos.generos.length > 0
                                        ?
                                        rol.filtros_demograficos.generos.map((g) => (
                                            <Fragment key={g.id}>
                                                <Typography>
                                                    {g.genero.es}
                                                </Typography>
                                                <Divider style={{ borderWidth: 1, height: 12, borderColor: '#069cb1', margin: 8 }} orientation='vertical' />
                                            </Fragment>
                                        ))
                                        : <>
                                            <Typography>
                                                No especificado
                                            </Typography>
                                            <Divider style={{ borderWidth: 1, height: 12, borderColor: '#069cb1', margin: 8 }} orientation='vertical' />
                                        </>
                                }



                                <Typography>
                                    {
                                        rol.filtros_demograficos && rol.filtros_demograficos.rango_edad_inicio && rol.filtros_demograficos.rango_edad_fin
                                            ? `${rol.filtros_demograficos.rango_edad_inicio}-${rol.filtros_demograficos.rango_edad_fin}`
                                            : 'No especificado'
                                    }
                                </Typography>
                                <Divider style={{ borderWidth: 1, height: 12, borderColor: '#069cb1', margin: 8 }} orientation='vertical' />

                                {
                                    rol.filtros_demograficos && rol.filtros_demograficos.aparencias_etnicas && rol.filtros_demograficos.aparencias_etnicas.length > 0
                                        ? rol.filtros_demograficos.aparencias_etnicas.map(ae => (
                                            <Fragment key={ae.id}>
                                                <Typography>
                                                    {ae.aparencia_etnica.nombre}
                                                </Typography>
                                                <Divider style={{ borderWidth: 1, height: 12, borderColor: '#069cb1', margin: 8 }} orientation='vertical' />
                                            </Fragment>
                                        ))
                                        : <>
                                            <Typography>
                                                No especificado
                                            </Typography>
                                            <Divider style={{ borderWidth: 1, height: 12, borderColor: '#069cb1', margin: 8 }} orientation='vertical' />
                                        </>
                                }


                                <Typography>
                                    {rol.filtros_demograficos && rol.filtros_demograficos.pais.es || 'No especificado'}
                                </Typography>
                            </Box>
                            <Typography>
                                <Typography fontWeight={600} component={'span'} sx={{ paddingRight: '10px' }}>Descripción:</Typography>
                                {rol?.descripcion ?? 'No especificado'}
                            </Typography>

                        </Grid>
                    </Grid>
                </Grid>
            </GridMotion>
            <GridMotion
                item container xs={12}
                variants={containerVariants}
                initial="closed"
                animate={showPreview ? "open" : "closed"}
                transition={{ duration: 0.3 }}
            >

                <IndividualData title={'Habilidades:'}>
                    {
                        rol.habilidades && rol.habilidades.habilidades_seleccionadas && rol.habilidades.habilidades_seleccionadas.length > 0
                            ? rol.habilidades.habilidades_seleccionadas.map((h, i) => (
                                <Fragment key={h.id}>
                                    <Typography component={'span'} sx={{ color: '#928F8F' }}>{h.habilidad.es}</Typography>
                                    {i !== rol.habilidades.habilidades_seleccionadas.length - 1 && <Divider style={{ borderWidth: 1, height: 12, borderColor: '#069cb1', margin: 8 }} orientation='vertical' />}
                                </Fragment>
                            ))
                            : <>
                                <Typography component={'span'} sx={{ color: '#928F8F' }}>
                                    No especificado
                                </Typography>
                            </>
                    }
                </IndividualData>

                <IndividualData title={'Desnudos o situaciones sexuales:'}>
                    {
                        rol.nsfw && rol.nsfw.nsfw_seleccionados && rol.nsfw.nsfw_seleccionados.length > 0
                            ? rol.nsfw.nsfw_seleccionados.map((n, i) => (
                                <Fragment key={n.id}>
                                    <Typography component={'span'} sx={{ color: '#928F8F' }}>{n.nsfw.es}</Typography>
                                    {i !== rol.nsfw.nsfw_seleccionados.length - 1 && <Divider style={{ borderWidth: 1, height: 12, borderColor: '#069cb1', margin: 8 }} orientation='vertical' />}
                                </Fragment>
                            ))
                            : <>
                                <Typography component={'span'} sx={{ color: '#928F8F' }}>
                                    No especificado
                                </Typography>
                            </>
                    }
                </IndividualData>

                <IndividualData title={'Locación de casting y fechas:'}>
                    {
                        rol.casting && rol.casting.length > 0
                            ? rol.casting.map((c, i) => (
                                <Fragment key={c.id}>
                                    <Typography component={'span'} sx={{ color: '#928F8F' }}>{c.estado_republica.es}</Typography>
                                    <Divider style={{ borderWidth: 1, height: 12, borderColor: '#069cb1', margin: 8 }} orientation='vertical' />
                                    <Typography component={'span'} sx={{ color: '#928F8F' }}>{conversorFecha(c.fecha_inicio)}</Typography>
                                    {c.fecha_fin && <Typography component={'span'} sx={{ color: '#928F8F', paddingLeft: '5px' }}> a {conversorFecha(c.fecha_fin)}</Typography>}
                                    {i !== rol.casting.length - 1 && <Divider style={{ borderWidth: 1, height: 12, borderColor: '#069cb1', margin: 8 }} orientation='vertical' />}
                                </Fragment>
                            ))
                            : <>
                                <Typography component={'span'} sx={{ color: '#928F8F' }}>
                                    No especificado
                                </Typography>
                            </>
                    }
                </IndividualData>


                <IndividualData title={'Locación de filmación y fechas:'}>
                    {
                        rol.filmaciones && rol.filmaciones.length > 0
                            ? rol.filmaciones.map((c, i) => (
                                <Fragment key={c.id}>
                                    <Typography component={'span'} sx={{ color: '#928F8F' }}>{c.estado_republica.es}</Typography>
                                    <Divider style={{ borderWidth: 1, height: 12, borderColor: '#069cb1', margin: 8 }} orientation='vertical' />
                                    <Typography component={'span'} sx={{ color: '#928F8F' }}>{conversorFecha(c.fecha_inicio)}</Typography>
                                    {c.fecha_fin && <Typography component={'span'} sx={{ color: '#928F8F', paddingLeft: '5px' }}> a {conversorFecha(c.fecha_fin)}</Typography>}
                                    {i !== rol.filmaciones.length - 1 && <Divider style={{ borderWidth: 1, height: 12, borderColor: '#069cb1', margin: 8 }} orientation='vertical' />}
                                </Fragment>
                            ))
                            : <>
                                <Typography component={'span'} sx={{ color: '#928F8F' }}>
                                    No especificado
                                </Typography>
                            </>
                    }
                </IndividualData>

                <IndividualData title={'Presentación de solicitud:'}>
                    <Typography component={'span'} sx={{ color: '#928F8F' }}>
                        {rol?.requisitos?.estado_republica?.es || 'No especificado'}
                    </Typography>
                    <Divider style={{ borderWidth: 1, height: 12, borderColor: '#069cb1', margin: 8 }} orientation='vertical' />
                    <Typography component={'span'} sx={{ color: '#928F8F' }}>
                        {rol.requisitos && rol.requisitos.presentacion_solicitud && conversorFecha(rol.requisitos.presentacion_solicitud) || 'No especificado'}
                    </Typography>
                    <Divider style={{ borderWidth: 1, height: 12, borderColor: '#069cb1', margin: 8 }} orientation='vertical' />
                    <Typography component={'span'} sx={{ color: '#928F8F' }}>
                        {rol.requisitos && rol.requisitos.uso_horario.es || 'No especificado'}
                    </Typography>
                </IndividualData>

                <IndividualData title={'Información del trabajo/notas:'}>
                    <Typography component={'span'} sx={{ color: '#928F8F' }}>
                        {rol.detalles_adicionales || 'No especificado'}
                    </Typography>
                </IndividualData>

                <IndividualData title={'Requisitos:'}>
                    {
                        rol.requisitos && rol.requisitos.medios_multimedia && rol.requisitos.medios_multimedia.length > 0
                            ? rol.requisitos.medios_multimedia.map((m, i) => (
                                <Fragment key={m.id}>
                                    <Typography component={'span'} sx={{ color: '#928F8F' }}>{m.medio_multimedia.es}</Typography>
                                    {i !== rol.requisitos.medios_multimedia.length - 1 && <Divider style={{ borderWidth: 1, height: 12, borderColor: '#069cb1', margin: 8 }} orientation='vertical' />}
                                </Fragment>
                            ))
                            : <>
                                <Typography component={'span'} sx={{ color: '#928F8F' }}>
                                    No especificado
                                </Typography>
                            </>
                    }
                </IndividualData>

                <IndividualData title={'Archivos adicionales:'} stylesContainerData={{ gap: 10 }}>
                    <Typography component={'span'} sx={{ color: '#069cb1', textDecoration: 'underline' }}>lineas.pdf</Typography>
                    <Typography component={'span'} sx={{ color: '#069cb1', textDecoration: 'underline' }}>headshot.jpg</Typography>
                    <Typography component={'span'} sx={{ color: '#069cb1', textDecoration: 'underline' }}>referencia1.jpg</Typography>
                    <Typography component={'span'} sx={{ color: '#069cb1', textDecoration: 'underline' }}>referencia2.jpg</Typography>
                </IndividualData>
            </GridMotion>
            <Dialog  
                maxWidth={'md'} style={{ padding: 0, margin: 0, overflow: 'hidden'}} 
                open={dialogInfoProductor.open} 
                onClose={() => setDialogInfoProductor({ ...dialogInfoProductor, open: false })}
                TransitionComponent={Transition}
            >
                <IconButton
                    style={{
                        position: 'absolute',
                        right: 0,
                        color: '#069cb1'
                    }}
                    aria-label="Cancelar edicion usuario"
                    onClick={() => {
                        setDialogInfoProductor({ ...dialogInfoProductor, open: false })
                    }}
                >
                    <Close />
                </IconButton>
                <DialogContent style={{padding: 0, width: 400, overflow: 'hidden'}}>
                    <MContainer direction='vertical' styles={{padding: 40, alignItems: 'center'}} justify='center'>
                        <Avatar sx={{ width: 156, height: 156 }} alt="Foto productor" src={rol.proyecto.cazatalentos.foto_perfil ? rol.proyecto.cazatalentos.foto_perfil.url : '/assets/img/no-image.png'} />
                        <MContainer direction='horizontal'>
                            <motion.img style={{marginRight: 16}}  src="/assets/img/iconos/chair_dir_blue.svg" alt="icono" />
                            <Typography fontSize={'2rem'}>{rol.proyecto.cazatalentos.nombre} {rol.proyecto.cazatalentos.apellido}</Typography>
                        </MContainer>
                        <Divider style={{borderColor: '#069cb1', width: '70%', borderWidth: '1px'}}/>
                        <Typography style={{color: '#069cb1', marginTop: 16}}>
                            {rol.proyecto.cazatalentos.posicion}
                        </Typography>
                        <Typography variant='body2' paddingLeft={2} paddingRight={2}>
                            {rol.proyecto.cazatalentos.biografia}
                        </Typography>
                        <Box my={3} display={'flex'} flexDirection={'row'} justifyContent={'space-between'} width={'80%'}>
                            {rol.proyecto.cazatalentos.redes_sociales && rol.proyecto.cazatalentos.redes_sociales.map(red => {
                                switch (red.nombre) {
                                    case 'vimeo': return <motion.img width={24} height={24} src="/assets/img/iconos/icon_vimeo_blue.svg" alt="icono" />;
                                    case 'linkedin': return <motion.img width={24} height={24} src="/assets/img/iconos/icon_linkedin_blue.svg" alt="icono" />;
                                    case 'youtube': return <motion.img width={24} height={24} src="/assets/img/iconos/icon_youtube_blue.svg" alt="icono" />;
                                    case 'imdb': return <motion.img width={24} height={24} src="/assets/img/iconos/icon_imbd_blue.svg" alt="icono" />;
                                    case 'twitter': return <motion.img width={24} height={24} src="/assets/img/iconos/icon_Twitwe_blue.svg" alt="icono" />;
                                    case 'instagram': return <motion.img width={24} height={24} src="/assets/img/iconos/icon_insta_blue.svg" alt="icono" />;
                                    
                                }
                                return null;
                            })}
                        </Box>
                        {rol.proyecto.cazatalentos.redes_sociales.filter(r => r.nombre === 'pagina_web').length > 0 &&
                            rol.proyecto.cazatalentos.redes_sociales.filter(r => r.nombre === 'pagina_web').map(r => {
                                return <MContainer direction='horizontal' justify='start' styles={{width: '80%', alignItems: 'end'}}>
                                    <motion.img width={24} height={24} src="/assets/img/iconos/icono_web_site_blue.svg" alt="icono" />
                                    <Typography ml={2}>{r.url}</Typography>
                                </MContainer>
                            })
                        }
                    </MContainer>
                </DialogContent>
            </Dialog>
            <Dialog  
                maxWidth={'md'} style={{ padding: 0, margin: 0, overflow: 'hidden'}} 
                open={dialogImage.open} 
                onClose={() => setDialogImage({ ...dialogImage, open: false })}
                TransitionComponent={Transition}
            >
                <div style={{ position: 'relative', width: 500, aspectRatio: '500/720', maxWidth: '100%' }}>
                    <Image fill src={dialogImage.image} style={{ objectFit: 'cover' }} alt="" />
                </div>
            </Dialog>
        </Grid>
    )
}
