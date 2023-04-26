import { Box, Button, ButtonGroup, Dialog, DialogContent, Divider, Grid, Typography } from '@mui/material'
import Image from 'next/image'
import React, { type Dispatch, type SetStateAction, type FC } from 'react'
import MotionDiv from '~/components/layout/MotionDiv'

interface Props {
    showModal: boolean;
    setShowModal: Dispatch<SetStateAction<boolean>>;

    option_selected: 'APLICACIONES' | 'AUDICIONES' | 'CALLBACK';
    setOptionSelected: Dispatch<SetStateAction<"APLICACIONES" | "AUDICIONES" | "CALLBACK">>;

    requisitoSelected: 'PROYECTO' | 'ROL' | 'SELF-TAPE';
    setRequisitoSelected: Dispatch<SetStateAction<"PROYECTO" | "ROL" | "SELF-TAPE">>;
}

export const ModalTalento: FC<Props> = ({ showModal, setShowModal, option_selected, setOptionSelected, requisitoSelected, setRequisitoSelected }) => {
    return (
        <Dialog fullWidth maxWidth={'lg'} onClose={() => setShowModal(false)} open={showModal}>
            <DialogContent sx={{ padding: 0, paddingLeft: '50px', height: 700 }} >
                <Grid container sx={{}}>
                    <Grid item xs={12}>
                        <Typography fontWeight={600}
                            sx={{ color: '#069cb1', textAlign: 'center', padding: '30px' }}
                        >
                            Tabla de Aplicaciones
                        </Typography>
                    </Grid>
                    <Grid container item xs={12}>
                        <Grid xs={12}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Image src="/assets/img/no-user-image.png" width={50} height={50} alt="" />
                                <Typography sx={{ paddingLeft: '20px' }}>Nombre Talento</Typography>
                            </Box>

                        </Grid>
                        <Grid xs={8}>
                            <Grid xs={12}>
                                <ButtonGroup sx={{ mt: 2, mb: 0 }} variant="contained" aria-label="outlined primary button group">
                                    <Button
                                        onClick={() => { setOptionSelected('APLICACIONES') }}
                                        variant={option_selected === 'APLICACIONES' ? 'contained' : 'outlined'}
                                    >
                                        Aplicaciones
                                    </Button>
                                    <Button
                                        onClick={() => { setOptionSelected('AUDICIONES') }}
                                        variant={option_selected === 'AUDICIONES' ? 'contained' : 'outlined'}
                                    >
                                        Audiciones
                                    </Button>
                                    <Button
                                        onClick={() => { setOptionSelected('CALLBACK') }}
                                        variant={option_selected === 'CALLBACK' ? 'contained' : 'outlined'}
                                    >
                                        Callback
                                    </Button>
                                </ButtonGroup>
                            </Grid>
                            <MotionDiv show={option_selected === 'APLICACIONES'} animation="fade">
                                <>
                                    <Grid item xs={8}>
                                        <Grid xs={12}>
                                            <Grid container sx={{ backgroundColor: '#CED6D9', padding: '15px' }} xs={15} columns={15}>
                                                <Grid xs={3}>
                                                    <Typography sx={{ textAlign: 'center' }}>
                                                        Proyecto
                                                    </Typography>
                                                </Grid>
                                                <Grid xs={3}>
                                                    <Typography sx={{ textAlign: 'center' }}>
                                                        Tipo
                                                    </Typography>
                                                </Grid>
                                                <Grid xs={3}>
                                                    <Typography sx={{ textAlign: 'center' }}>
                                                        Estado
                                                    </Typography>
                                                </Grid>
                                                <Grid xs={3}>
                                                    <Typography sx={{ textAlign: 'center' }}>
                                                        Cazatalento
                                                    </Typography>
                                                </Grid>
                                                <Grid xs={3}>
                                                    <Typography sx={{ textAlign: 'center' }}>
                                                        Fecha
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid xs={12} container>
                                        <Grid xs={8}>
                                            <Grid container xs={15} columns={15} sx={{ padding: '10px 0px', borderBottom: '1px solid #CED6D9', borderRight: '1px solid #CED6D9' }}>
                                                <Grid xs={3}>
                                                    <Typography sx={{ textAlign: 'center', color: '#069cb1', textDecoration: 'underline' }}>
                                                        Nombre
                                                        del
                                                        Proyecto
                                                    </Typography>
                                                </Grid>
                                                <Grid xs={3}>
                                                    <Typography sx={{ textAlign: 'center' }}>
                                                        Corto
                                                    </Typography>
                                                </Grid>
                                                <Grid xs={3}>
                                                    <Typography sx={{ textAlign: 'center' }}>
                                                        Activo
                                                    </Typography>
                                                </Grid>
                                                <Grid xs={3}>
                                                    <Typography sx={{ textAlign: 'center', color: '#069cb1', textDecoration: 'underline' }}>
                                                        Nombre
                                                        Cazatalentos
                                                    </Typography>
                                                </Grid>
                                                <Grid xs={3}>
                                                    <Typography sx={{ textAlign: 'center' }}>
                                                        12/04/22
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid xs={4} container sx={{ borderBottom: '1px solid #CED6D9' }}>
                                            <Grid xs={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Image style={{ cursor: 'pointer' }} src="/assets/img/iconos/check_blue.svg" width={30} height={30} alt="" />
                                            </Grid>
                                            <Grid xs={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Image style={{ cursor: 'pointer' }} src="/assets/img/iconos/equiz_blue.svg" width={30} height={30} alt="" />
                                            </Grid>
                                            <Grid xs={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Image style={{ cursor: 'pointer' }} src="/assets/img/iconos/ico_chat_blue.svg" width={30} height={30} alt="" />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </>
                            </MotionDiv>
                        </Grid>

                        <Grid xs={4}>
                            <Grid xs={12}>
                                <Typography fontWeight={600}>Requisitos</Typography>
                            </Grid>
                            <Grid xs={12}>
                                <ButtonGroup sx={{ mt: 2, mb: 0, width: '100%' }} variant="contained" aria-label="outlined primary button group">
                                    <Button
                                        onClick={() => { setRequisitoSelected('PROYECTO') }}
                                        variant={requisitoSelected === 'PROYECTO' ? 'contained' : 'outlined'}
                                        sx={{ borderRadius: 0, width: '33.33%' }}
                                    >
                                        Proyecto
                                    </Button>
                                    <Button
                                        onClick={() => { setRequisitoSelected('ROL') }}
                                        variant={requisitoSelected === 'ROL' ? 'contained' : 'outlined'}
                                        sx={{ borderRadius: 0, width: '33.33%' }}
                                    >
                                        Rol
                                    </Button>
                                    <Button
                                        onClick={() => { setRequisitoSelected('SELF-TAPE') }}
                                        variant={requisitoSelected === 'SELF-TAPE' ? 'contained' : 'outlined'}
                                        sx={{ borderRadius: 0, width: '33.33%' }}
                                    >
                                        Self-Tape
                                    </Button>
                                </ButtonGroup>
                            </Grid>
                            <MotionDiv show={requisitoSelected === 'PROYECTO'} animation="fade">
                                <Grid xs={12} sx={{ border: '2px solid #CED6D9' }}>
                                    <Grid xs={12} sx={{ padding: '10px 20px' }}>
                                        <Typography fontWeight={600} sx={{ fontSize: '1.4rem' }}>Nombre de Proyecto</Typography>
                                        <Typography fontWeight={600} sx={{ lineHeight: '15px', marginTop: '10px' }}>
                                            Casa productora: <br />
                                            <Typography component={'span'} fontWeight={400}>
                                                Nombre de Casa Productora
                                            </Typography>
                                        </Typography>
                                    </Grid>
                                    <Grid xs={12}>
                                        <Box sx={{ position: 'relative', width: '100%', aspectRatio: '16/9' }}>
                                            <Image style={{ objectFit: 'cover' }} src="/assets/img/granja.jpg" fill alt="" />
                                        </Box>
                                    </Grid>
                                    <Grid xs={12} sx={{ padding: '10px 20px' }}>
                                        <Grid xs={12}>
                                            <Typography sx={{ lineHeight: '20px' }}>
                                                <Typography component={'span'} fontWeight={600} sx={{ lineHeight: '20px' }}>
                                                    Sinopsis:
                                                </Typography> Características del
                                                personaje y el rol que interpretará
                                                Características del personaje y el rol
                                                que interpretar dkshdk qo...
                                            </Typography>
                                        </Grid>
                                        <Grid xs={12}>
                                            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                                <Image style={{ marginTop: '7px' }} src="/assets/img/iconos/icono_relog_blue.png" width={20} height={20} alt="" />
                                                <Typography sx={{ paddingLeft: '10px', color: '#069cb1', lineHeight: '20px' }}>
                                                    Fecha límite entrega de aplicaciones:
                                                    25/09/2021 12:00 a.m. MST
                                                </Typography>
                                            </Box>
                                            <Typography sx={{ paddingLeft: '10px', color: '#069cb1', lineHeight: '20px', marginTop: '10px' }}>
                                                Inicio de proyecto: 10/10/2021
                                                en Ciudad de México
                                            </Typography>
                                        </Grid>
                                        <Grid xs={12}>
                                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                                <Image style={{ marginTop: '7px' }} src="/assets/img/no-user-image.png" width={30} height={30} alt="" />
                                                <Box>
                                                    <Typography>
                                                        Proyecto por: Iván Águila Orea
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <Image src="/assets/img/iconos/eye_blue.svg" width={20} height={20} alt="" />
                                                        <Typography sx={{ paddingLeft: '10px', color: '#069cb1', lineHeight: '20px' }}>
                                                            Ver perfil
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </MotionDiv>

                            <MotionDiv show={requisitoSelected === 'ROL'} animation="fade">
                                <Grid xs={12} sx={{ border: '2px solid #CED6D9' }}>
                                    <Grid xs={12} sx={{ padding: '20px 30px' }}>
                                        <Typography fontWeight={600} sx={{ fontSize: '1.4rem' }}>Nombre del Rol</Typography>

                                        <Typography sx={{ color: '#838080', fontStyle: 'italic', marginTop: '20px' }}>Sexo:</Typography>
                                        <Typography>Femenino</Typography>

                                        <Typography sx={{ color: '#838080', fontStyle: 'italic', marginTop: '20px' }}>Edad:</Typography>
                                        <Typography>20-25 años</Typography>

                                        <Typography sx={{ color: '#838080', fontStyle: 'italic', marginTop: '20px' }}>Filtros demográficos:</Typography>
                                        <Typography>Latino/Hispano</Typography>

                                        <Typography sx={{ color: '#838080', fontStyle: 'italic', marginTop: '20px' }}>Habilidades:</Typography>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                                                <Typography>Danza</Typography>
                                                <Divider style={{ borderWidth: 1, height: 12, borderColor: '#069cb1', margin: 8 }} orientation='vertical' />
                                            </Box>
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                                                <Typography>Canto</Typography>
                                            </Box>
                                        </Box>

                                        <Typography sx={{ color: '#838080', fontStyle: 'italic', marginTop: '20px' }}>Descripción:</Typography>
                                        <Typography>
                                            Características del personaje y el
                                            rol que interpretar Características
                                            del personaje y el rol que
                                            interpretar dkshdk qo...
                                        </Typography>

                                    </Grid>
                                </Grid>
                            </MotionDiv>

                            <MotionDiv show={requisitoSelected === 'SELF-TAPE'} animation="fade">
                                <Grid xs={12} sx={{ border: '2px solid #CED6D9' }}>
                                    <Grid xs={12} sx={{ padding: '20px 30px' }}>
                                        <Typography fontWeight={600} sx={{ fontSize: '1.4rem' }}>Requisito Self-Tape</Typography>

                                        <Typography sx={{ color: '#069cb1', marginTop: '20px' }}>
                                            “Fondo Blanco”,“Casting en
                                            Horizontal”, Distancia del Talento
                                            a la cámara o cuadro específico,
                                        </Typography>

                                        <Typography sx={{ marginTop: '30px' }}>
                                            Requisitos escritos por el
                                            Cazatalentos previamente
                                            Sobre indicaciones para
                                            Hacer el self-tape
                                        </Typography>

                                        <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', gap: 2, marginTop: '50px' }}>
                                            <Button
                                                sx={{
                                                    textTransform: 'none',
                                                    backgroundColor: '#069cb1',
                                                    color: '#fff',
                                                    borderRadius: '2rem',
                                                    width: '250px',
                                                    '&:hover': {
                                                        backgroundColor: '#07a9be',
                                                    }
                                                }}>
                                                <Typography sx={{ lineHeight: '15px' }}>
                                                    Invitar a Talento a <br />
                                                    Grabar Self-Tape
                                                </Typography>
                                            </Button>

                                            <Button
                                                sx={{
                                                    textTransform: 'none',
                                                    color: '#07a9be',
                                                    borderRadius: '2rem',
                                                    width: '250px',
                                                    border: '2px solid #07a9be'
                                                }}>
                                                <Typography>
                                                    Subir Self-Tape
                                                </Typography>
                                            </Button>

                                            <Typography sx={{ color: '#07a9be', textDecoration: 'underline', textAlign: 'center' }}>
                                                Descargar Líneas
                                            </Typography>
                                        </Box>


                                    </Grid>
                                </Grid>
                            </MotionDiv>
                        </Grid>

                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    )
}
