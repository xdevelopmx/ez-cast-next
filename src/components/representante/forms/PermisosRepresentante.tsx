import { Grid } from '@mui/material'
import React from 'react'
import { MCheckboxGroup } from '~/components/shared';
import { PermisosRepresentante } from '~/pages/representante/editar-perfil';

export const PermisosRepresentanteView = (props: {
    state: PermisosRepresentante,
    representante_fetching: boolean,
    onFormChange: (input: { [id: string]: unknown }) => void;
}) => {
    return (
        <Grid container>
            <Grid xs={12}>
                <MCheckboxGroup
                    direction='vertical'
                    title="¿Quién puede aceptar solicitudes?"
                    onChange={(e, i) => {
                        props.onFormChange({
                            puede_aceptar_solicitudes: (i === 0) ? { ...props.state.puede_aceptar_solicitudes,  talentos: e} : { ...props.state.puede_aceptar_solicitudes,  representante: e}
                        })
                    }}
                    id="quien-puede-aceptar-solicitudes-select"
                    labelStyle={{ marginBottom: 0, width: '45%' }}
                    options={ ['Talentos', 'Representante']}
                    values={[props.state.puede_aceptar_solicitudes.talentos, props.state.puede_aceptar_solicitudes.representante]}
                />
            </Grid>
            <Grid xs={12} mt={4}>
                <MCheckboxGroup
                    direction='vertical'
                    title="¿Quién puede editar perfil de talento?"
                    onChange={(e, i) => {
                        props.onFormChange({
                            puede_editar_perfil: (i === 0) ? { ...props.state.puede_editar_perfil,  talentos: e} : { ...props.state.puede_editar_perfil,  representante: e}
                        })
                    }}
                    id="quien-puede-aceptar-solicitudes-select"
                    labelStyle={{ marginBottom: 0, width: '45%' }}
                    options={['Talentos', 'Representante']}
                    values={[props.state.puede_editar_perfil.talentos, props.state.puede_editar_perfil.representante]}
                />
            </Grid>
        </Grid>
    )
}
