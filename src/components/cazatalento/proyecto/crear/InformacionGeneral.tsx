import { Grid, Typography } from '@mui/material';
import { type FC } from 'react'
import { FormGroup, MSelect, SectionTitle } from '~/components'
import MotionDiv from '~/components/layout/MotionDiv';
import { MTooltip } from '~/components/shared/MTooltip';
import { type ProyectoForm } from '~/pages/cazatalentos/proyecto';
import { api } from '~/utils/api';
import useLang from "~/hooks/useLang";
import AppContext from "~/context/app";
import { useContext } from "react";

interface Props {
    state: ProyectoForm;
    onFormChange: (input: { [id: string]: unknown }) => void;
}

export const InformacionGeneral: FC<Props> = ({ state, onFormChange }) => {
    const ctx = useContext(AppContext);
    const textos = useLang(ctx.lang);
    var paso = textos['paso'] + '1';
    const tipos_sindicatos = api.catalogos.getUniones.useQuery(undefined, {
        refetchOnWindowFocus: false
    })

    const tipos_proyectos = api.catalogos.getTipoProyectos.useQuery(undefined, {
        refetchOnWindowFocus: false
    })


    return (
        <Grid container>
            <Grid item xs={12}>
                <SectionTitle title={paso} subtitle={textos['info_gral']}
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
                    label={textos['nombre_proyecto']}
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
                    label={textos['sindicato']}
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
                                    {textos['ayuda_tipo']}
                                    </Typography>
                                    <br/>
                                    <Typography>
                                    {textos['ayuda_tipo1']}
                                    </Typography>
                                </>
                            }
                        />
                    }
                    label={textos['tipo_proyecto'] + '*'}
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
