import { Button, Grid, Typography } from '@mui/material'
import Image from 'next/image'
import React from 'react'
import { FormGroup } from '~/components/shared'

export const CuentaRepresentante = () => {
    return (
        <Grid container>
            <Grid xs={12}>
                <Typography>
                    Nombre de administrador de la cuenta principal, y/o información de empleados que utilizarán
                    la cuenta. Max 3 personas
                </Typography>
            </Grid>
            <Grid item container xs={12}>
                <Grid xs={3}>
                    <FormGroup
                        //error={(state.errors.director && state.director_casting != null) ? state.errors.director : undefined}
                        //show_error_message
                        className={'form-input-md'}
                        labelStyle={{ fontWeight: 600 }}
                        labelClassName={'form-input-label'}
                        value={/* (state.director_casting) ? state.director_casting : */ ''}
                        onChange={(e) => {
                            /* onFormChange({
                                director_casting: e.target.value
                            }) */
                        }}
                        label='Nombre'
                    />
                </Grid>
                <Grid xs={3}>
                    <FormGroup
                        //error={(state.errors.director && state.director_casting != null) ? state.errors.director : undefined}
                        //show_error_message
                        className={'form-input-md'}
                        labelStyle={{ fontWeight: 600 }}
                        labelClassName={'form-input-label'}
                        value={/* (state.director_casting) ? state.director_casting : */ ''}
                        onChange={(e) => {
                            /* onFormChange({
                                director_casting: e.target.value
                            }) */
                        }}
                        label='Apellido'
                    />
                </Grid>
            </Grid>

            <Grid item container xs={12}>
                <FormGroup
                    //error={(state.errors.director && state.director_casting != null) ? state.errors.director : undefined}
                    //show_error_message
                    type='email'
                    className={'form-input-md'}
                    labelStyle={{ fontWeight: 600 }}
                    labelClassName={'form-input-label'}
                    value={/* (state.director_casting) ? state.director_casting : */ ''}
                    onChange={(e) => {
                        /* onFormChange({
                            director_casting: e.target.value
                        }) */
                    }}
                    label='Correo electrónico'
                />
            </Grid>

            <Grid item container xs={12}>
                <FormGroup
                    //error={(state.errors.director && state.director_casting != null) ? state.errors.director : undefined}
                    //show_error_message
                    type='number'
                    className={'form-input-md'}
                    labelStyle={{ fontWeight: 600 }}
                    labelClassName={'form-input-label'}
                    value={/* (state.director_casting) ? state.director_casting : */ ''}
                    onChange={(e) => {
                        /* onFormChange({
                            director_casting: e.target.value
                        }) */
                    }}
                    label='Teléfono'
                />
            </Grid>

            <Grid xs={12}>
                <Button sx={{ textTransform: 'none' }}>
                    <Image src="/assets/img/iconos/mas_blue.png" width={20} height={20} alt=""/>
                    <Typography sx={{paddingLeft: '10px'}}>Añadir otra persona</Typography>
                </Button>
            </Grid>
        </Grid>
    )
}
