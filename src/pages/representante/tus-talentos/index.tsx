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

    const [option_selected, setOptionSelected] = useState<{ current: 'APLICACIONES' | 'AUDICIONES' | 'CALLBACK' | '', updated: 'APLICACIONES' | 'AUDICIONES' | 'CALLBACK' }>({ current: 'APLICACIONES', updated: 'APLICACIONES' });

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
                    <DialogContent sx={{ overflow: 'hidden', padding: 0, paddingLeft: '50px' }} >
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
                                                onClick={() => { setOptionSelected({ current: '', updated: 'APLICACIONES' }) }}
                                                variant={option_selected.current === 'APLICACIONES' ? 'contained' : 'outlined'}
                                            >
                                                Aplicaciones
                                            </Button>
                                            <Button
                                                onClick={() => { setOptionSelected({ current: '', updated: 'AUDICIONES' }) }}
                                                variant={option_selected.current === 'AUDICIONES' ? 'contained' : 'outlined'}
                                            >
                                                Audiciones
                                            </Button>
                                            <Button
                                                onClick={() => { setOptionSelected({ current: '', updated: 'CALLBACK' }) }}
                                                variant={option_selected.current === 'CALLBACK' ? 'contained' : 'outlined'}
                                            >
                                                Callback
                                            </Button>
                                        </ButtonGroup>
                                    </Grid>
                                    <Grid item xs={8}>
                                        <MotionDiv show={option_selected.current === 'APLICACIONES'} animation="fade">
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

                                        </MotionDiv>
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