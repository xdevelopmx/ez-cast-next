import { type FC, useReducer } from 'react';
import Image from 'next/image'
import { Box, Button, Grid, Typography } from "@mui/material"
import { MContainer } from "~/components/layout/MContainer"
import { FormGroup, MCheckboxGroup, MRadioGroup, MSelect, SectionTitle } from "~/components/shared"
import { api } from '~/utils/api';
import { MTooltip } from '~/components/shared/MTooltip';
import { type FiltrosDemograficosRolForm } from '~/pages/cazatalentos/roles/agregar-rol';

interface Props {
    fetching: boolean,
    state: FiltrosDemograficosRolForm,
    onFormChange: (input: { [id: string]: unknown }) => void;
}

export const FiltrosDemograficosRol: FC<Props> = ({ state, onFormChange }) => {

    const generos = api.catalogos.getGeneros.useQuery(undefined, {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    const mascotas = api.catalogos.getTipoMascotas.useQuery(undefined, {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    const apariencias = api.catalogos.getAparienciasEtnicas.useQuery(undefined, {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    })

    const nacionalidades = api.catalogos.getNacionalidades.useQuery(undefined, {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    })

    return (
        <Grid container item xs={12} mt={8}>
            <Grid item xs={12}>
                <SectionTitle
                    title='Paso 3'
                    subtitle='Filtros demográficos'
                    subtitleSx={{ ml: 4, color: '#069cb1', fontWeight: 600 }}
                    dividerSx={{ backgroundColor: '#9B9B9B' }}
                />
            </Grid>

            <Grid item xs={12} mt={4}>
                <Grid container item xs={12}>
                    <Grid item container xs={6}>
                        <Grid item xs={12}>
                            <Typography fontWeight={600}>Rango de edad ({state.rango_edad_en_meses ? 'meses' : 'años'})*</Typography>
                            <MContainer direction="horizontal" styles={{ alignItems: 'center', gap: 30, marginTop: 5 }}>
                                <FormGroup
                                    type="number"
                                    className={'form-input-md'}
                                    labelStyle={{ fontWeight: 600 }}
                                    labelClassName={'form-input-label'}
                                    rootStyle={{ margin: 0 }}
                                    style={{ width: 60 }}
                                    value={`${state.rango_edad_inicio}`}
                                    onChange={(e) => {
                                        onFormChange({
                                            rango_edad_inicio: parseInt(e.target.value || '0')
                                        })
                                    }}
                                    label=''
                                />
                                <Typography>a</Typography>
                                <FormGroup
                                    type="number"
                                    className={'form-input-md'}
                                    labelStyle={{ fontWeight: 600 }}
                                    labelClassName={'form-input-label'}
                                    rootStyle={{ margin: 0 }}
                                    style={{ width: 60 }}
                                    value={`${state.rango_edad_fin}`}
                                    onChange={(e) => {
                                        onFormChange({
                                            rango_edad_fin: parseInt(e.target.value || '0')
                                        })
                                    }}
                                    label=''
                                />
                            </MContainer>
                            <Button 
                                sx={{ textTransform: 'none' }}
                                onClick={()=> {
                                    onFormChange({
                                        rango_edad_en_meses: !state.rango_edad_en_meses
                                    })
                                }}
                                >
                                <Image
                                    src="/assets/img/iconos/change_blue_icon.svg"
                                    width={25}
                                    height={25}
                                    style={{ marginRight: 3 }}
                                    alt="icon-change"
                                />
                                <Typography>
                                    Cambiar a {state.rango_edad_en_meses ? 'años' : 'meses'}
                                </Typography>
                            </Button>
                        </Grid>
                        <Grid item xs={12}>
                            <MRadioGroup
                                label='Género del rol*'
                                labelStyle={{ fontSize: '1.1rem', color: '#000', fontWeight: 600 }}
                                style={{ gap: 0 }}
                                styleRoot={{ marginTop: 5 }}
                                id="genero-del-rol"
                                options={['No especificado', 'Género especificado']}
                                value={state.genero_del_rol}
                                direction='vertical'
                                onChange={(e) => {
                                    onFormChange({
                                        genero_del_rol: e.target.value
                                    })
                                }}
                            />
                            <Box sx={{ padding: '0px 40px' }}>
                                <MCheckboxGroup
                                    disabled={state.genero_del_rol === 'No especificado'}
                                    onAllOptionChecked={(checked) => {
                                        onFormChange({
                                            generos: (checked && generos.data) ? generos.data.map(g => g.id) : [] 
                                        })
                                    }}
                                    direction='vertical'
                                    title="Género interesado en interpretar"
                                    onChange={(e, i) => {
                                        const genero = generos.data?.filter((_, index) => index === i)[0];
                                        if (genero) {
                                            onFormChange({
                                                generos:
                                                    (state.generos.includes(genero.id)) ?
                                                        state.generos.filter(e => e !== genero.id) :
                                                        state.generos.concat([genero.id])
                                            })
                                        }
                                    }}
                                    id="genero-interesado-interpretar"
                                    labelStyle={{ marginBottom: 0, width: '32%' }}
                                    options={(generos.data) ? generos.data.map(g => g.es) : []}
                                    values={(generos.data) ? generos.data.map(g => {
                                        return state.generos.includes(g.id);
                                    }) : [false]}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <MRadioGroup
                                label='Apariencia étnica de rol*'
                                labelStyle={{ fontSize: '1.1rem', color: '#000', fontWeight: 600 }}
                                style={{ gap: 0 }}
                                styleRoot={{ marginTop: 5 }}
                                id="apariencia-etnica-del-rol"
                                options={['No especificado', 'Especificado']}
                                value={state.apariencia_etnica_del_rol}
                                direction='vertical'
                                onChange={(e) => {
                                    onFormChange({
                                        apariencia_etnica_del_rol: e.target.value
                                    })
                                }}
                            />
                            <Box sx={{ padding: '0px 0px 0px 40px' }}>
                                <MCheckboxGroup
                                    disabled={state.apariencia_etnica_del_rol === 'No especificado'}
                                    onAllOptionChecked={(checked) => {
                                        onFormChange({
                                            apariencias_etnias: (checked && apariencias.data) ? apariencias.data.map(g => g.id) : [] 
                                        })
                                    }}
                                    direction='horizontal'
                                    title=""
                                    onChange={(e, i) => {
                                        const apariencia = apariencias.data?.filter((_, index) => index === i)[0];
                                        if (apariencia) {
                                            onFormChange({
                                                apariencias_etnias:  (state.apariencias_etnias.includes(apariencia.id)) ?
                                                    state.apariencias_etnias.filter(e => e !== apariencia.id) :
                                                    state.apariencias_etnias.concat([apariencia.id])
                                            })
                                        }
                                    }}
                                    id="tipos-apariencias-rol"
                                    labelStyle={{ marginBottom: 0, width: '45%' }}
                                    options={(apariencias.data) ? apariencias.data.map(g => g.nombre) : []}
                                    values={(apariencias.data) ? apariencias.data.map(g => {
                                        return state.apariencias_etnias.includes(g.id);
                                    }) :  [false]}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <MSelect
                                id="tipo-nacionalidades-select"
                                loading={nacionalidades.isFetching}
                                labelStyle={{ marginTop: 32, fontWeight: 600 }}
                                labelClassName={'form-input-label'}
                                label='Etnia/Nacionalidad*'
                                options={
                                    (nacionalidades.data)
                                        ? nacionalidades.data.map(s => { return { value: s.id.toString(), label: s.es } })
                                        : []
                                }
                                value={state.id_pais.toString()}
                                className={'form-input-md'}
                                onChange={(e) => {
                                    onFormChange({
                                        id_pais: parseInt(e.target.value)
                                    })
                                }}
                            />
                        </Grid>
                    </Grid>
                    <Grid item xs={6}>
                        <Grid xs={12}>
                            <MCheckboxGroup
                                direction='horizontal'
                                title=""
                                onChange={(e, i) => {
                                    onFormChange({
                                        es_mascota: e
                                    })
                                    console.log('change');
                                }}
                                id="mascota-o-animal-checkbox"
                                labelStyle={{ marginBottom: 0, fontWeight: 600 }}
                                options={['¿Mascota o Animal?']}
                                values={/* (apariencias.data) ? apariencias.data.map(g => {
                                    return state.apariencias_interesado_en_interpretar.includes(g.id);
                                }) : */ [state.es_mascota]}
                            />
                            <MSelect
                                disabled={!state.es_mascota}
                                id="tipo-mascotas-select"
                                loading={mascotas.isFetching}
                                options={
                                    (mascotas.data)
                                        ? mascotas.data.map(s => { return { value: s.id.toString(), label: s.es } })
                                        : []
                                }
                                value={(state.animal) ? state.animal.id.toString() : '0'}
                                className={'form-input-md'}
                                onChange={(e) => {
                                    onFormChange({
                                        animal: { ...state.animal, id: parseInt(e.target.value) }
                                    })
                                }}
                            />
                        </Grid>
                        <Grid xs={12}>
                            <FormGroup
                                disabled={!state.es_mascota}
                                className={'form-input-md'}
                                labelStyle={{ fontWeight: 600 }}
                                labelClassName={'form-input-label'}
                                rootStyle={{ marginTop: 30 }}
                                value={(state.animal) ? state.animal.descripcion : ''}
                                onChange={(e) => {
                                    onFormChange({
                                        animal: { ...state.animal, descripcion: e.target.value }
                                    })
                                }}
                                label='Descripción'
                                tooltip={
                                    <MTooltip
                                        color='blue'
                                        placement='right'
                                        text='¡Sé especifico en cuanto a Especie o Raza o describe la puesta en escena!'
                                    />
                                }
                            />
                            <MRadioGroup
                                disabled={!state.es_mascota}
                                label='Tamaño'
                                labelStyle={{ fontSize: '1.1rem', color: '#000', fontWeight: 600 }}
                                style={{ gap: 0 }}
                                styleRoot={{ marginTop: 5 }}
                                id="tamano-mascota-rol"
                                options={['Chico', 'Mediano', 'Grande']}
                                value={(state.animal) ? state.animal.tamanio : 'Chico'}
                                direction='vertical'
                                onChange={(e) => {
                                    onFormChange({
                                        animal: { ...state.animal, tamanio: e.target.value }
                                    }) 
                                }}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}
