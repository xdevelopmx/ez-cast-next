import { Grid } from '@mui/material'
import { FormGroup, SectionTitle } from '~/components/shared'

export const RequisitosRol = () => {
    return (
        <Grid container item xs={12} mt={8}>
            <Grid item xs={12}>
                <SectionTitle title='Paso 7' subtitle='Requisitos'
                    subtitleSx={{ ml: 4, color: '#069cb1', fontWeight: 600 }}
                    dividerSx={{ backgroundColor: '#9B9B9B' }}
                />
            </Grid>
            <Grid item xs={12} mt={4}>
                <FormGroup
                    className={'form-input-md'}
                    labelStyle={{ fontWeight: 600 }}
                    labelClassName={'form-input-label'}
                    value={''}
                    onChange={(e) => {
                        console.log('change');
                    }}
                    label='Presentación de solicitud'
                />
            </Grid>
        </Grid>
    )
}
