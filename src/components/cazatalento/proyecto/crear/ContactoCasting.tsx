import { Grid, Typography } from '@mui/material';
import { type FC } from 'react'
import { FormGroup, SectionTitle } from '~/components'
import { MTooltip } from '~/components/shared/MTooltip';
import Constants from '~/constants';
import { type ProyectoForm } from '~/pages/cazatalentos/proyecto';

interface Props {
    state: ProyectoForm;
    onFormChange: (input: { [id: string]: unknown }) => void;
}

export const ContactoCasting: FC<Props> = ({ state, onFormChange }) => {
    return (
        <Grid mb={5} container>
            <Grid item xs={12}>
                <SectionTitle title='Paso 2'
                    subtitle='Contacto de Casting'
                    subtitleSx={{ ml: 4, color: '#069cb1', fontWeight: 600 }}
                />
            </Grid>
            <Grid item xs={12}>
                <div className="info_bg_a">
                    <Typography>
                        Esta información no se compartirá con el público
                    </Typography>
                </div>
            </Grid>
            <Grid item xs={4} mt={8}>
                <FormGroup
                    error={state.director_casting.length < 2 ? 'El nombre es muy corto' : undefined}
                    show_error_message
                    className={'form-input-md'}
                    labelStyle={{ fontWeight: 600 }}
                    labelClassName={'form-input-label'}
                    value={state.director_casting}
                    onChange={(e) => {
                        onFormChange({
                            director_casting: e.target.value
                        })
                    }}
                    label='Director de casting*'
                />
            </Grid>
            <Grid item xs={8} mt={8}>
                <FormGroup
                    error={state.telefono_contacto.length < 10 || state.telefono_contacto.length > 12 ? 'El numero no es valido' : undefined}
                    show_error_message
                    type='number'
                    className={'form-input-md'}
                    labelStyle={{ fontWeight: 600 }}
                    labelClassName={'form-input-label'}
                    value={state.telefono_contacto}
                    onChange={(e) => {
                        onFormChange({
                            telefono_contacto: e.target.value
                        })
                    }}
                    label='Número de teléfono*'
                />
            </Grid>
            <Grid item xs={4} mt={8}>
                <FormGroup
                    error={!Constants.PATTERNS.EMAIL.test(state.email_contacto) ? 'El email no es valido' : undefined}
                    show_error_message
                    className={'form-input-md'}
                    labelStyle={{ fontWeight: 600 }}
                    labelClassName={'form-input-label'}
                    value={state.email_contacto}
                    onChange={(e) => {
                        onFormChange({
                            email_contacto: e.target.value
                        })
                    }}
                    label='Correo electrónico*'
                />
            </Grid>
            <Grid item xs={4} mt={8} >
                <FormGroup
                    error={state.email_contacto !== state.email_contacto_confirmacion ? 'El email no es el mismo' : undefined}
                    show_error_message
                    className={'form-input-md'}
                    labelStyle={{ fontWeight: 600 }}
                    labelClassName={'form-input-label'}
                    value={state.email_contacto_confirmacion}
                    tooltip={
                        <MTooltip
                            color='orange'
                            text='Prueba'
                            placement='right'
                        />
                    }
                    onChange={(e) => {
                        onFormChange({
                            email_contacto_confirmacion: e.target.value
                        })
                    }}
                    label='Confirmar correo electrónico'
                />
            </Grid>
        </Grid>
    )
}
