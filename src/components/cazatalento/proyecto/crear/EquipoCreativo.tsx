import { Grid } from '@mui/material';
import { type FC } from 'react'
import { FormGroup, MSelect, SectionTitle } from '~/components'
import { ProyectoForm } from '~/pages/cazatalentos/proyecto';

interface Props {
    state: ProyectoForm;
    onFormChange: (input: { [id: string]: unknown }) => void;
}

export const EquipoCreativo: FC<Props> = ({ state, onFormChange }) => {
    return (
        <Grid mb={5} container>
            <Grid item xs={12}>
                <SectionTitle title='Paso 3' subtitle='Equipo creativo' subtitleSx={{ml: 4, color: '#4ab7c6'}} onClickButton={() => { 
                    // eslint-disable-next-line @typescript-eslint/no-floating-promises
                    //router.push('/talento/editar-perfil?step=3')  
                }} />
            </Grid>
            <Grid item xs={4} mt={8}>
                <FormGroup
                    className={'form-input-md'}
                    labelStyle={{ fontWeight: 400 }}
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
                    labelStyle={{ fontWeight: 400 }}
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
            <Grid item xs={4} mt={8}>
                <FormGroup
                    className={'form-input-md'}
                    labelStyle={{ fontWeight: 400 }}
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
            <Grid item xs={4} mt={8} >
                <FormGroup
                    className={'form-input-md'}
                    labelStyle={{ fontWeight: 400 }}
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
