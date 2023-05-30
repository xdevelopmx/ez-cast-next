import Head from 'next/head'
import Image from 'next/image'
import { Box, Button, Divider, Grid, Typography } from '@mui/material'
import { Alertas, MainLayout, MenuLateral, ModalTalento } from '~/components'
import { TalentoPreviewLong } from '~/components/representante/talento-preview-long'
import { useState } from 'react'
import { api } from '~/utils/api'

const RepresentanteTusTalentosPage = () => {

    const [showModal, setShowModal] = useState(false)

    const [option_selected, setOptionSelected] = useState<'APLICACIONES' | 'AUDICIONES' | 'CALLBACK'>('APLICACIONES');

    const [requisitoSelected, setRequisitoSelected] = useState<'PROYECTO' | 'ROL' | 'SELF-TAPE'>('PROYECTO');

    const talentos = api.talentos.getTusTalentos.useQuery()

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
                                            {talentos.data?.length ?? 0}
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
                                        talentos.isSuccess && talentos.data.map((talento, i) => (
                                            <TalentoPreviewLong talento={talento} setShowModal={setShowModal} key={i} />
                                        ))
                                    }
                                </Grid>
                            </Grid>

                        </div>
                    </div>
                </div>


                <ModalTalento
                    option_selected={option_selected}
                    setOptionSelected={setOptionSelected}
                    requisitoSelected={requisitoSelected}
                    setRequisitoSelected={setRequisitoSelected}
                    showModal={showModal}
                    setShowModal={setShowModal}
                />




            </MainLayout>

        </>
    )
}

export default RepresentanteTusTalentosPage