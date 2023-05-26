import { Grid } from '@mui/material';
import { type FC } from 'react'
import { FormGroup, SectionTitle } from '~/components'
import { type ProyectoForm } from '~/pages/cazatalentos/proyecto';

interface Props {
    state: ProyectoForm;
    onFormChange: (input: { [id: string]: unknown }) => void;
}

export const EquipoCreativo: FC<Props> = ({ state, onFormChange }) => {
    return (
        <Grid mb={5} container>
            <Grid item xs={12}>
                <SectionTitle
                    title='Paso 3'
                    subtitle='Equipo creativo'
                    subtitleSx={{ ml: 4, color: '#069cb1', fontWeight: 600 }}
                />
            </Grid>
            <Grid item xs={12} md={3} mt={8}>
                <FormGroup
                    className={'form-input-md'}
                    labelStyle={{ fontWeight: 600 }}
                    labelClassName={'form-input-label'}
                    value={state.productor}
                    onChange={(e) => {
                        onFormChange({
                            productor: e.target.value
                        })
                    }}
                    label='Productor'
                />
            </Grid>
            <Grid item xs={8} mt={8}>
                <FormGroup
                    className={'form-input-md'}
                    labelStyle={{ fontWeight: 600 }}
                    labelClassName={'form-input-label'}
                    value={state.casa_productora}
                    onChange={(e) => {
                        onFormChange({
                            casa_productora: e.target.value
                        })
                    }}
                    label='Casa Productora'
                />
            </Grid>
            <Grid item xs={12} md={3} mt={8}>
                <FormGroup
                    className={'form-input-md'}
                    labelStyle={{ fontWeight: 600 }}
                    labelClassName={'form-input-label'}
                    value={state.director}
                    onChange={(e) => {
                        onFormChange({
                            director: e.target.value
                        })
                    }}
                    label='Director'
                />
            </Grid>
            <Grid item xs={12} md={3} mt={8} >
                <FormGroup
                    className={'form-input-md'}
                    labelStyle={{ fontWeight: 600 }}
                    labelClassName={'form-input-label'}
                    value={state.agencia_publicidad}
                    onChange={(e) => {
                        onFormChange({
                            agencia_publicidad: e.target.value
                        })
                    }}
                    label='Agencia de publicidad'
                />
            </Grid>
        </Grid>
    )
}
