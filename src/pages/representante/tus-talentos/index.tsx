import Head from 'next/head'
import Image from 'next/image'
import { Box, Button, ButtonGroup, Dialog, DialogContent, Divider, Grid, Typography } from '@mui/material'
import { Alertas, MainLayout, MenuLateral } from '~/components'
import { TalentoPreviewLong } from '~/components/representante/talento-preview-long'
import { MTooltip } from '~/components/shared/MTooltip'
import { useState } from 'react'
import MotionDiv from '~/components/layout/MotionDiv'

const RepresentanteTusTalentosPage = () => {

    const [showModal, setShowModal] = useState(false)

    const [option_selected, setOptionSelected] = useState<'APLICACIONES' | 'AUDICIONES' | 'CALLBACK'>('APLICACIONES');

    const [requisitoSelected, setRequisitoSelected] = useState<'PROYECTO' | 'ROL' | 'SELF-TAPE'>('PROYECTO');

    return (
        <>
            <Head>
                <title>Representante | Talent Corner</title>
                <meta name="description" content="Talent Corner" />
                <link rel="icon" href="/favicon.ico" />
            </Head>


            <MainLayout menuSiempreBlanco={true}>
                <div className="d-flex wrapper_ezc">
                    <MenuLateral />
                    <div className="seccion_container col" style={{ paddingTop: 0 }}>
                        <br /><br />
                        <div className="container_box_header">
                            <div className="d-flex justify-content-end align-items-start py-2">
                                <Alertas />
                            </div>

                            <Grid container xs={12} mt={6}>
                                <Grid item xs={12}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Typography
                                            sx={{
                                                fontWeight: 900,
                                                fontSize: '2rem'
                                            }}>
                                            Tus talentos
                                        </Typography>

                                        <Box>
                                            <Button
                                                className="btn btn-intro btn-price btn_out_line mb-2"
                                                startIcon={
                                                    <Image
                                                        src={`/assets/img/iconos/cruz_ye.svg`}
                                                        height={16}
                                                        width={16}
                                                        alt={'agregar-rol'}
                                                        className='filtro-blanco '
                                                    />
                                                }
                                                sx={{
                                                    padding: '8px 40px',
                                                    marginTop: 0,
                                                    fontWeight: 900,
                                                    textTransform: 'none',
                                                    color: '#000',
                                                    backgroundColor: '#f9b233 !important',
                                                    margin: '0px !important',
                                                    marginRight: '20px !important',
                                                }}
                                            >
                                                Nuevo talento
                                            </Button>

                                            <Button
                                                className="btn btn-intro btn-price btn_out_line mb-2"
                                                sx={{
                                                    padding: '8px 40px',
                                                    marginTop: 0,
                                                    marginRight: 10,
                                                    fontWeight: '900 !important',
                                                    textTransform: 'none',
                                                    color: '#000',
                                                    border: '2px solid #f9b233',
                                                    backgroundColor: '#fff',
                                                    borderRadius: '80px',
                                                    margin: '0px !important',
                                                }}
                                            >
                                                Administrar talentos
                                            </Button>
                                        </Box>
                                    </Box>
                                </Grid>

                                <Grid xs={12} mt={4}>
                                    <Typography fontWeight={900}>
                                        Representas
                                        <Typography
                                            fontWeight={900}
                                            component={'span'}
                                            sx={{ padding: '0px 5px', color: '#069cb1' }}>
                                            0
                                        </Typography>
                                        talentos
                                    </Typography>
                                    <Typography>Da click en el botón de Nuevo talento para comenzar a agregar talentos.</Typography>
                                </Grid>

                                <Grid xs={12} mt={4}>
                                    <Divider />
                                </Grid>

                                <Grid xs={12}>
                                    {
                                        Array.from({ length: 4 }).map((_, i) => (
                                            <TalentoPreviewLong setShowModal={setShowModal} key={i} />
                                        ))
                                    }
                                </Grid>
                            </Grid>

                        </div>
                    </div>
                </div>



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
                                </Grid>

                            </Grid>
                        </Grid>
                    </DialogContent>
                </Dialog>



            </MainLayout>

        </>
    )
}

export default RepresentanteTusTalentosPage