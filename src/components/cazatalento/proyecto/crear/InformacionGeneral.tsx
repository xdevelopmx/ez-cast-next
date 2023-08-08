import { Grid, Typography } from '@mui/material';
import { type FC } from 'react'
import { FormGroup, MSelect, SectionTitle } from '~/components'
import MotionDiv from '~/components/layout/MotionDiv';
import { MTooltip } from '~/components/shared/MTooltip';
import { type ProyectoForm } from '~/pages/cazatalentos/proyecto';
import { api } from '~/utils/api';

interface Props {
    state: ProyectoForm;
    onFormChange: (input: { [id: string]: unknown }) => void;
}

export const InformacionGeneral: FC<Props> = ({ state, onFormChange }) => {

    const tipos_sindicatos = api.catalogos.getUniones.useQuery(undefined, {
        refetchOnWindowFocus: false
    })

    const tipos_proyectos = api.catalogos.getTipoProyectos.useQuery(undefined, {
        refetchOnWindowFocus: false
    })


    return (
        <Grid container>
            <Grid item xs={12}>
                <SectionTitle title='Paso 1' subtitle='Información General'
                    subtitleSx={{ ml: 4, color: '#069cb1', fontWeight: 600 }}
                    dividerSx={{ backgroundColor: '#9B9B9B' }}
                />
            </Grid>
            <Grid item xs={12} md={4} mt={8}>
                <FormGroup
                    error={(state.errors.nombre && state.nombre != null) ? state.errors.nombre : undefined}
                    show_error_message
                    className={'form-input-md'}
                    labelStyle={{ fontWeight: 600 }}
                    labelClassName={'form-input-label'}
                    value={(state.nombre) ? state.nombre : ''}
                    onChange={(e) => {
                        onFormChange({
                            nombre: e.target.value,
                        })
                    }}
                    label='Nombre de proyecto*'
                />
            </Grid>
            <Grid item xs={12} md={4} mt={8}>
                <MSelect
                    id="sindicato-select"
                    loading={tipos_sindicatos.isFetching}
                    options={(tipos_sindicatos.data) ? tipos_sindicatos.data.map(s => { return { value: s.id.toString(), label: s.es } }) : []}
                    className={'form-input-md'}
                    value={state.id_sindicato.toString()}
                    onChange={(e) => {
                        onFormChange({
                            id_sindicato: parseInt(e.target.value)
                        })
                    }}
                    label='Sindicato*'
                />
            </Grid>
            <Grid item xs={12} md={4} mt={8}>
                <MSelect
                    id="tipo-proyectos-select"
                    loading={tipos_proyectos.isFetching}
                    options={(tipos_proyectos.data) ? tipos_proyectos.data.map(s => { return { value: s.id.toString(), label: s.es } }) : []}
                    value={state.id_tipo.toString()}
                    className={'form-input-md'}
                    onChange={(e) => {
                        onFormChange({
                            id_tipo: parseInt(e.target.value)
                        })
                    }}
                    tooltip={
                        <MTooltip
                            color='blue'
                            placement='right-start'
                            text={
                                <>
                                    <Typography fontWeight={600}>
                                        Asegúrate de seleccionar el tipo de proyecto adecuado para ti.
                                    </Typography>
                                    <br/>
                                    <Typography>
                                        Ten en cuenta que una vez que selecciones un tipo de proyecto y crees tu proyecto, no podrás cambiarlo.Para obtener más orientación, consulte nuestra documentación de ayuda y tutoriales.
                                    </Typography>
                                </>
                            }
                        />
                    }
                    label='Tipo Proyecto*'
                />
            </Grid>
            <Grid item xs={12} md={4} mt={8}></Grid>
            <Grid item xs={12} md={4} mt={8} justifyContent='end'>
                <MotionDiv show={state.id_sindicato === 99} animation='fade'>
                    <FormGroup
                        className={'form-input-md'}
                        labelStyle={{ fontWeight: 600 }}
                        labelClassName={'form-input-label'}
                        value={state.sindicato}
                        onChange={(e) => {
                            onFormChange({
                                sindicato: e.target.value
                            })
                        }}
                        label='Nombre Sindicato *'
                    />
                </MotionDiv>
            </Grid>
            <Grid item xs={12} md={4} mt={8} justifyContent='end'>
                <MotionDiv show={state.id_tipo === 99} animation='fade'>
                    <FormGroup
                        className={'form-input-md'}
                        labelStyle={{ fontWeight: 600 }}
                        labelClassName={'form-input-label'}
                        value={state.tipo}
                        onChange={(e) => {
                            onFormChange({
                                tipo: e.target.value
                            })
                        }}
                        label='Otro'
                    />
                </MotionDiv>
            </Grid>

        </Grid>
    )
}
