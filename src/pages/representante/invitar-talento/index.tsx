import { Box, Divider, Grid, Typography } from '@mui/material'
import Head from 'next/head'
import { FormGroup, MRadioGroup, MainLayout } from '~/components'
import { MTooltip } from '~/components/shared/MTooltip'
import useNotify from '~/hooks/useNotify'
import { InvalidEmailError, InvalidFieldError } from '~/utils/errores'
import { type FormEvent } from 'react'
import useInvitarTalentoReducer from '../../../hooks/useInvitarTalentoReducer'


const InvitarTalentoPage = () => {

    const { state, dispatch, TiposAcciones, validarFormulario } = useInvitarTalentoReducer()

    const { notify } = useNotify();

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        try {
            validarFormulario(state);
        } catch (error) {
            if (error instanceof InvalidEmailError || error instanceof InvalidFieldError) {
                notify('error', error.name);
            }
        }
    }

    return (
        <>
            <Head>
                <title>Representante | Talent Corner</title>
                <meta name="description" content="Talent Corner" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <MainLayout menuSiempreBlanco={true}>
                <form onSubmit={onSubmit}>
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
                                            value={state.nombre}
                                            onChange={(e) => {
                                                dispatch({
                                                    type: TiposAcciones.UPDATE_NOMBRE,
                                                    payload: e.target.value
                                                })
                                            }}
                                            label='Nombre'
                                        />
                                        <FormGroup
                                            show_error_message
                                            className={'form-input-md'}
                                            labelStyle={{ fontWeight: 600 }}
                                            labelClassName={'form-input-label'}
                                            value={state.apellido}
                                            onChange={(e) => {
                                                dispatch({
                                                    type: TiposAcciones.UPDATE_APELLIDO,
                                                    payload: e.target.value
                                                })
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
                                        value={state.correo_electronico}
                                        onChange={(e) => {
                                            dispatch({
                                                type: TiposAcciones.UPDATE_CORREO_ELECTRONICO,
                                                payload: e.target.value
                                            })
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
                                        value={state.nota}
                                        onChange={(e) => {
                                            dispatch({
                                                type: TiposAcciones.UPDATE_NOTA,
                                                payload: e.target.value
                                            })
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
                                            labelStyle={{ fontSize: '1.1rem', color: '#000', fontWeight: 600 }}
                                            style={{ gap: 0 }}
                                            id="invitacion-correo-radio"
                                            options={['Tu correo', 'Correo Talent Corner']}
                                            value={state.tipo_correo}
                                            direction='horizontal'
                                            onChange={(e) => {
                                                dispatch({
                                                    type: TiposAcciones.UPDATE_TIPO_CORREO,
                                                    payload: e.target.value
                                                })
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
                                                value={state.correo_invitacion}
                                                onChange={(e) => {
                                                    dispatch({
                                                        type: TiposAcciones.UPDATE_CORREO_INVITACION,
                                                        payload: e.target.value
                                                    })
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
                                                    type="submit"
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
                </form>
            </MainLayout>
        </>
    )
}

export default InvitarTalentoPage