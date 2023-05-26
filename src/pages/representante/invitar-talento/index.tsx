import { Box, Divider, Grid, Typography } from '@mui/material'
import Head from 'next/head'
import { FormGroup, MRadioGroup, MainLayout } from '~/components'
import { MTooltip } from '~/components/shared/MTooltip'

const InvitarTalentoPage = () => {
    return (
        <>
            <Head>
                <title>Representante | Talent Corner</title>
                <meta name="description" content="Talent Corner" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <MainLayout menuSiempreBlanco={true}>
                <Box sx={{ backgroundColor: '#F2F2F2', padding: '40px 70px' }}>
                    <Box
                        sx={{
                            backgroundColor: '#fff',
                            border: '3px solid #069cb1',
                            borderRadius: '8px',
                            padding: '50px 70px'
                        }}>
                        <Grid item container xs={12}>
                            <Grid item xs={12}>
                                <Typography sx={{ fontWeight: 600, color: '#069cb1', fontSize: '1.6rem' }}>
                                    Invitar a Talento
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Divider style={{ borderWidth: 1, borderColor: '#069cb1' }} />
                            </Grid>
                            <Grid item xs={12} mt={2}>
                                <Typography sx={{ fontWeight: 600, color: '#069cb1', fontSize: '1.1rem' }}>Información de Talento</Typography>
                            </Grid>
                            <Grid item xs={12} mt={2}>
                                <Box sx={{
                                    display: 'flex', gap: 2
                                }}>
                                    <FormGroup
                                        show_error_message
                                        className={'form-input-md'}
                                        labelStyle={{ fontWeight: 600 }}
                                        labelClassName={'form-input-label'}
                                        value={/* (state.director_casting) ? state.director_casting :  */''}
                                        onChange={(e) => {
                                            /* onFormChange({
                                                director_casting: e.target.value
                                            }) */
                                        }}
                                        label='Nombre'
                                    />
                                    <FormGroup
                                        show_error_message
                                        className={'form-input-md'}
                                        labelStyle={{ fontWeight: 600 }}
                                        labelClassName={'form-input-label'}
                                        value={/* (state.director_casting) ? state.director_casting :  */''}
                                        onChange={(e) => {
                                            /* onFormChange({
                                                director_casting: e.target.value
                                            }) */
                                        }}
                                        label='Apellido'
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={12} mt={2}>
                                <FormGroup
                                    type='email'
                                    className={'form-input-md'}
                                    labelStyle={{ fontWeight: 600 }}
                                    labelClassName={'form-input-label'}
                                    value={/* (state.director_casting) ? state.director_casting :  */''}
                                    onChange={(e) => {
                                        /* onFormChange({
                                            director_casting: e.target.value
                                        }) */
                                    }}
                                    label='Correo electrónico'
                                />
                            </Grid>
                            <Grid item xs={12} mt={2}>
                                <FormGroup
                                    type={'text-area'}
                                    className={'form-input-md'}
                                    style={{ width: 300 }}
                                    labelStyle={{ fontWeight: 600, width: '100%' }}
                                    labelClassName={'form-input-label'}
                                    value={/* state.compensacion.datos_adicionales || */ ''}
                                    onChange={(e) => {
                                        /* onFormChange({
                                            compensacion: {
                                                ...state.compensacion,
                                                datos_adicionales: e.target.value
                                            }
                                        }) */
                                    }}
                                    tooltip={
                                        <MTooltip
                                            text='Para ser vista por Talento'
                                            color='orange'
                                            placement='right'
                                        />
                                    }
                                    label='Agregar nota'
                                />
                            </Grid>

                            <Grid item xs={12} mt={2}>
                                <Grid item xs={12}>
                                    <Typography sx={{ fontWeight: 600, color: '#069cb1', fontSize: '1.1rem' }}>Invitación con tu correo o Correo Talent Corner</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <MRadioGroup
                                        label='¿Deseas compartir el proyecto en formato poster mantenerlo oculto y solo poner la casa productora?'
                                        labelStyle={{ fontSize: '1.1rem', color: '#000', fontWeight: 600 }}
                                        style={{ gap: 0 }}
                                        id="invitacion-correo-radio"
                                        options={['Tu correo', 'Correo Talent Corner']}
                                        value={''}
                                        direction='horizontal'
                                        onChange={(e) => {
                                            /* onFormChange({
                                                compartir_nombre: (e.target.value === 'Compartir nombre de proyecto')
                                            }) */
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Box sx={{
                                        display: 'flex', gap: 2
                                    }}>
                                        <FormGroup
                                            style={{ width: 300 }}
                                            labelStyle={{ fontWeight: 600, width: '100%' }}
                                            labelClassName={'form-input-label'}
                                            value={/* state.compensacion.datos_adicionales || */ ''}
                                            onChange={(e) => {
                                                /* onFormChange({
                                                    compensacion: {
                                                        ...state.compensacion,
                                                        datos_adicionales: e.target.value
                                                    }
                                                }) */
                                            }}
                                        />
                                        <Typography>sandra.rodriguez@talentcorner.com</Typography>
                                    </Box>
                                </Grid>

                                <Grid item xs={12}>
                                    <div className="col d-flex justify-content-center" >
                                        <div className="mr-3">

                                            <button
                                                className="btn btn-intro btn-price btn_out_line mb-2"
                                                type="button"
                                            >
                                                <Typography>Cancelar</Typography>
                                            </button>

                                        </div>

                                        <div>
                                            <button
                                                className="btn btn-intro btn-price btn_out_line mb-2"
                                                type="button"
                                                style={{
                                                    backgroundColor: '#f9b233'
                                                }}
                                            >
                                                <Typography>Enviar invitación</Typography>
                                            </button>
                                        </div>

                                    </div>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </MainLayout>
        </>
    )
}

export default InvitarTalentoPage