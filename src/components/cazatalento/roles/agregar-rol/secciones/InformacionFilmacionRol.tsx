import { Grid } from '@mui/material'
import React, { FC, useReducer } from 'react'
import { SectionTitle, StateNDates } from '~/components/shared'
import { FilmacionesRolForm } from '~/pages/cazatalentos/roles/agregar-rol';
import { api } from '~/utils/api';

interface Props {
    state: FilmacionesRolForm,
    onFormChange: (input: { [id: string]: unknown }) => void;
}


export const InformacionFilmacionRol: FC<Props> = ({ state, onFormChange }) => {

    const estados_republica = api.catalogos.getEstadosRepublica.useQuery(undefined, {
        refetchOnWindowFocus: false
    })

    return (
        <Grid container item xs={12} mt={8}>
            <Grid item xs={12}>
                <SectionTitle title='Paso 6' subtitle='Información de Filmación'
                    subtitleSx={{ ml: 4, color: '#069cb1', fontWeight: 600 }}
                    dividerSx={{ backgroundColor: '#9B9B9B' }}
                />
            </Grid>
            <Grid item xs={12} mt={4}>
                <StateNDates
                    title='Locación de Filmación y fecha*:'

                    valueSelect={state.id_estado_republica.toString()}
                    nameSelect='filmacion_select'
                    loadingSelect={estados_republica.isFetching}
                    optionsSelect={
                        (estados_republica.data)
                            ? estados_republica.data.map(s => { return { value: s.id.toString(), label: s.es } })
                            : []
                    }
                    onSelectChange={(value) => { 
                        onFormChange({
                            id_estado_republica: parseInt(value)
                        })
                    }}

                    nameRadio='filmacion_radio'

                    valueFechas={state.fechas}
                    onAgregarFecha={(date: {inicio: Date, fin?: Date}) => { 
                        onFormChange({
                            fechas: state.fechas.concat([date])
                        })
                    }}
                    onEliminarFecha={(index: number) => { 
                        state.fechas.splice(index, 1);
                        onFormChange({
                            fechas: state.fechas
                        })
                    }}
                />
            </Grid>
        </Grid>
    )
}