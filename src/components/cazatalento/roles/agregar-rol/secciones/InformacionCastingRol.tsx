import { Grid } from '@mui/material'
import React, { FC, useContext, useReducer } from 'react'
import { SectionTitle, StateNDates } from '~/components/shared'
import AppContext from '~/context/app';
import useLang from '~/hooks/useLang';
import { CastingsRolForm } from '~/pages/cazatalentos/roles/agregar-rol';
import { api } from '~/utils/api';

interface Props {
    fetching: boolean,
    state: CastingsRolForm,
    onFormChange: (input: { [id: string]: unknown }) => void;
}


export const InformacionCastingRol: FC<Props> = ({ state, onFormChange }) => {

    const ctx = useContext(AppContext);
    const textos = useLang(ctx.lang);

    const estados_republica = api.catalogos.getEstadosRepublica.useQuery(undefined, {
        refetchOnWindowFocus: false
    })

    return (
        <Grid container item xs={12} mt={8}>
            <Grid item xs={12}>
                <SectionTitle title={`${textos['paso']} 5`} subtitle={`${textos['informacion_casting']}`}
                    subtitleSx={{ ml: 4, color: '#069cb1', fontWeight: 600 }}
                    dividerSx={{ backgroundColor: '#9B9B9B' }}
                />
            </Grid>
            <Grid item xs={12} mt={4}>
                <StateNDates
                    title={`${textos['locacion_de_casting_y_fechas']}*:`}

                    valueSelect={state.id_estado_republica.toString()}
                    nameSelect='casting_select'
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

                    nameRadio='casting_radio'

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
