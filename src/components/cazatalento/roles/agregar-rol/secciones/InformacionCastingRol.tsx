import { Grid } from '@mui/material'
import React from 'react'
import { SectionTitle } from '~/components/shared'

export const InformacionCastingRol = () => {
    return (
        <Grid container item xs={12} mt={8}>
            <Grid item xs={12}>
                <SectionTitle title='Paso 5' subtitle='Información de Casting'
                    subtitleSx={{ ml: 4, color: '#069cb1', fontWeight: 600 }}
                    dividerSx={{ backgroundColor: '#9B9B9B' }}
                />
            </Grid>
        </Grid>
    )
}
