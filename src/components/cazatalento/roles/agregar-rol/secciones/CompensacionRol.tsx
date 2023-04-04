import { Grid } from '@mui/material'
import { type FC } from 'react';
import { MContainer } from '~/components/layout/MContainer'
import { FormGroup, MCheckboxGroup, MRadioGroup, SectionTitle } from '~/components/shared'
import { MTooltip } from '~/components/shared/MTooltip'
import { type RolForm } from '~/pages/cazatalentos/roles/agregar-rol';
import { api } from '~/utils/api';

interface Props {
    state: RolForm;
    onFormChange: (input: { [id: string]: unknown }) => void;
    onSaveChanges: (...args: unknown[]) => unknown;
}

export const CompensacionRol: FC<Props> = ({ state, onFormChange, onSaveChanges }) => {

    const tipos_compensaciones_no_monetarias = api.catalogos.getTiposCompensacionesNoMonetarias.useQuery(undefined, {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    return (
        <Grid container item xs={12} mt={8}>
            <Grid item xs={12}>
                <SectionTitle
                    title='Paso 2'
                    subtitle='Compensación'
                    subtitleSx={{ ml: 4, color: '#069cb1', fontWeight: 600 }}
                    dividerSx={{ backgroundColor: '#9B9B9B' }}
                    textButton="Guardar y terminar más tarde"
                    onClickButton={onSaveChanges}
                />
            </Grid>
            <Grid container item xs={12} mt={4}>
                <Grid item xs={4}>
                    <MRadioGroup
                        label='¿Se pagará un sueldo?'
                        labelStyle={{ fontSize: '1.1rem', color: '#000', fontWeight: 600 }}
                        style={{ gap: 0 }}
                        id="se-pagara-sueldo"
                        options={['Sí', 'No']}
                        value={state.compensacion.se_pagara_sueldo}
                        direction='vertical'
                        onChange={(e) => {
                            onFormChange({
                                se_pagara_sueldo: e.target.value
                            })
                        }}
                    />
                </Grid>
                <Grid item xs={8}>
                    <MContainer direction='horizontal' styles={{ gap: 30 }}>
                        <FormGroup
                            //error={state.nombre.length < 2 ? 'El nombre es demasiado corto' : undefined}
                            type='number'
                            show_error_message
                            className={'form-input-md'}
                            labelStyle={{ fontWeight: 600 }}
                            labelClassName={'form-input-label'}
                            value={
                                state.compensacion.sueldo
                                    ? `${state.compensacion.sueldo.cantidad_sueldo}`
                                    : ''
                            }
                            onChange={(e) => {
                                onFormChange({
                                    sueldo: {
                                        ...state.compensacion.sueldo,
                                        cantidad_sueldo: parseInt(e.target.value || '0')
                                    }
                                })
                            }}
                            label='¿Cuánto?'
                        />

                        <MRadioGroup
                            label='Selecciona una'
                            labelStyle={{ fontSize: '1.1rem', color: '#000', fontWeight: 600 }}
                            style={{ gap: 0 }}
                            id="cada-cuanto-sueldo"
                            options={['Diario', 'Mensual', 'Semanal', 'Por Proyecto']}
                            value={state.compensacion.sueldo?.periodo_sueldo || 'Diario'}
                            direction='horizontal'
                            onChange={(e) => {
                                onFormChange({
                                    sueldo: {
                                        ...state.compensacion.sueldo,
                                        periodo_sueldo: e.target.value
                                    }
                                })
                            }}
                        />
                    </MContainer>
                </Grid>
            </Grid>
            <Grid container item xs={12} mt={2}>
                <Grid item xs={4}>
                    <MRadioGroup
                        label='¿Se otorgarán compensaciones?'
                        labelStyle={{ fontSize: '1.1rem', color: '#000', fontWeight: 600 }}
                        style={{ gap: 0 }}
                        id="se-pagara-sueldo"
                        options={['Sí', 'No']}
                        value={state.compensacion.se_otorgaran_compensaciones}
                        direction='vertical'
                        onChange={(e) => {
                            onFormChange({
                                se_otorgaran_compensaciones: e.target.value
                            })
                        }}
                    />
                </Grid>
                <Grid item xs={8}>
                    <MCheckboxGroup
                        title='¿Qué compensación no monetaria recibirá el talento?'
                        onChange={(e, i) => {
                            const tipo_compensacion = tipos_compensaciones_no_monetarias
                                .data?.filter((_, index) => index === i)[0];
                            if (tipo_compensacion) {
                                onFormChange({
                                    compensaciones_no_monetarias:
                                        (state.compensacion.compensaciones_no_monetarias
                                            .some(cm => cm.id_compensacion === tipo_compensacion.id))
                                            ? state.compensacion.compensaciones_no_monetarias
                                                .filter(e => e.id_compensacion !== tipo_compensacion.id)
                                            : [
                                                ...state.compensacion.compensaciones_no_monetarias, {
                                                    id_compensacion: tipo_compensacion.id,
                                                    descripcion_compensacion: ''
                                                }]

                                })
                            }
                        }}
                        direction='horizontal'
                        id="tipos-compensaciones-no-monetarias"
                        labelClassName={'label-black-lg'}
                        options={
                            (tipos_compensaciones_no_monetarias.data)
                                ? tipos_compensaciones_no_monetarias.data.map(g => g.es)
                                : []
                        }
                        label='¿Qué compensación no monetaria recibirá el talento?'
                        labelStyle={{ fontWeight: '400', fontSize: '1.1rem', width: '45%' }}
                        values={
                            (tipos_compensaciones_no_monetarias.data)
                                ? tipos_compensaciones_no_monetarias.data.map(g => (
                                    state.compensacion.compensaciones_no_monetarias
                                        ? state.compensacion.compensaciones_no_monetarias
                                            .some(cm => cm.id_compensacion == g.id)
                                        : false
                                ))
                                : [false]
                        }
                    />
                </Grid>
            </Grid>

            <Grid item xs={12} mt={2}>
                <FormGroup
                    //error={state.nombre.length < 2 ? 'El nombre es demasiado corto' : undefined}
                    type='number'
                    show_error_message
                    className={'form-input-md'}
                    labelStyle={{ fontWeight: 600 }}
                    labelClassName={'form-input-label'}
                    value={`${state.compensacion.compensacion.suma_total_compensaciones_no_monetarias || '0'}`}
                    onChange={(e) => {
                        onFormChange({
                            compensacion: {
                                ...state.compensacion.compensacion,
                                suma_total_compensaciones_no_monetarias: parseInt(e.target.value || '0')
                            }
                        })
                    }}
                    label='Suma de las compensaciones'
                    tooltip={
                        <MTooltip
                            color='orange'
                            text="Prueba"
                            placement='right'
                        />
                    }
                />
            </Grid>

            <Grid item xs={12} mt={2}>
                <FormGroup
                    type={'text-area'}
                    className={'form-input-md'}
                    style={{ width: 300 }}
                    labelStyle={{ fontWeight: 600, width: '100%' }}
                    labelClassName={'form-input-label'}
                    value={state.compensacion.compensacion.datos_adicionales || ''}
                    onChange={(e) => {
                        onFormChange({
                            compensacion: {
                                ...state.compensacion.compensacion,
                                datos_adicionales: e.target.value
                            }
                        })
                    }}
                    label='Datos adicionales'
                />
            </Grid>
        </Grid>
    )
}
