import { Grid } from '@mui/material'
import React from 'react'
import { SectionTitle, StateNDates } from '~/components/shared'
import { api } from '~/utils/api';

export const InformacionCastingRol = () => {

    const estados_republica = api.catalogos.getEstadosRepublica.useQuery(undefined, {
        refetchOnWindowFocus: false
    })

    return (
        <Grid container item xs={12} mt={8}>
            <Grid item xs={12}>
                <SectionTitle title='Paso 5' subtitle='Información de Casting'
                    subtitleSx={{ ml: 4, color: '#069cb1', fontWeight: 600 }}
                    dividerSx={{ backgroundColor: '#9B9B9B' }}
                />
            </Grid>
            <Grid item xs={12} mt={4}>
                <StateNDates
                    title='Locación de Casting y fecha:'

                    valueSelect={'0'}
                    nameSelect='casting_select'
                    loadingSelect={estados_republica.isFetching}
                    optionsSelect={
                        (estados_republica.data)
                            ? estados_republica.data.map(s => { return { value: s.id.toString(), label: s.es } })
                            : []
                    }
                    onSelectChange={() => { console.log('select change'); }}

                    nameRadio='casting_radio'

                    valueFechas={[1, 2, 3]}
                    onAgregarFecha={() => { console.log('click'); }}
                    onEliminarFecha={() => { console.log('eliminar'); }}

                    onFormChange={(input: { [key: string]: unknown }) => {
                        //dispatch({ type: 'update-proyecto-form', value: input })
                        console.log(input);
                    }}
                />
            </Grid>
        </Grid>
    )
}
