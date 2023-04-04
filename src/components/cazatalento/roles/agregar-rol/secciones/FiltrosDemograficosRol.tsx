import { type FC } from 'react';
import Image from 'next/image'
import { Box, Button, Grid, Typography } from "@mui/material"
import { MContainer } from "~/components/layout/MContainer"
import { FormGroup, MCheckboxGroup, MRadioGroup, SectionTitle } from "~/components/shared"
import { api } from '~/utils/api';
import { MTooltip } from '~/components/shared/MTooltip';
import { type RolForm } from '~/pages/cazatalentos/roles/agregar-rol';

interface Props {
    state: RolForm;
    onFormChange: (input: { [id: string]: unknown }) => void;
    onSaveChanges: (...args: unknown[]) => unknown;
}

export const FiltrosDemograficosRol: FC<Props> = ({ state, onFormChange, onSaveChanges }) => {

    const generos = api.catalogos.getGeneros.useQuery(undefined, {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    const apariencias = api.catalogos.getAparienciasEtnicas.useQuery(undefined, {
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
                    onClickButton={onSaveChanges}
                />
            </Grid>

            <Grid item xs={12} mt={4}>
                <Grid container item xs={12}>
                    <Grid item container xs={6}>
                        <Grid item xs={12}>
                            <Typography fontWeight={600}>Rango de edad (años)*</Typography>
                            <MContainer direction="horizontal" styles={{ alignItems: 'center', gap: 30, marginTop: 5 }}>
                                <FormGroup
                                    type="number"
                                    className={'form-input-md'}
                                    labelStyle={{ fontWeight: 600 }}
                                    labelClassName={'form-input-label'}
                                    rootStyle={{ margin: 0 }}
                                    style={{ width: 60 }}
                                    value={`${state.filtros_demograficos.rango_edad_inicio}`}
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
                                    value={`${state.filtros_demograficos.rango_edad_fin}`}
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
                                        rango_edad_en_meses: !state.filtros_demograficos.rango_edad_en_meses
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
                                    Cambiar a {state.filtros_demograficos.rango_edad_en_meses ? 'meses' : 'años'}
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
                                value={state.filtros_demograficos.genero_del_rol}
                                direction='vertical'
                                onChange={(e) => {
                                    onFormChange({
                                        genero_del_rol: e.target.value
                                    })
                                }}
                            />
                            <Box sx={{ padding: '0px 40px' }}>

                                <MCheckboxGroup
                                    onAllOptionChecked={() => {
                                        console.log('xd');
                                    }}
                                    direction='vertical'
                                    title=""
                                    onChange={(e, i) => {
                                        const genero = generos.data?.filter((_, index) => index === i)[0];
                                        if (genero) {
                                            /* onFormChange({
                                                generos_interesado_en_interpretar:
                                                    (state.generos_interesado_en_interpretar.includes(genero.id)) ?
                                                        state.generos_interesado_en_interpretar.filter(e => e !== genero.id) :
                                                        state.generos_interesado_en_interpretar.concat([genero.id])
                                            }) */
                                        }
                                    }}
                                    id="genero-interesado-interpretar-rol"
                                    labelStyle={{ marginBottom: 0 }}
                                    options={(generos.data) ? generos.data.map(g => g.es) : []}
                                    values={/* (generos.data) ? generos.data.map(g => {
                                    return state.generos_interesado_en_interpretar.includes(g.id);
                                }) : */ [false]}
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
                                value={'No especificado'}
                                direction='vertical'
                                onChange={(e) => {
                                    /* onFormChange({
                                        compartir_nombre: (e.target.value === 'Compartir nombre de proyecto')
                                    }) */
                                }}
                            />
                            <Box sx={{ padding: '0px 0px 0px 40px' }}>
                                <MCheckboxGroup
                                    onAllOptionChecked={() => {
                                        console.log('xd');
                                    }}
                                    direction='horizontal'
                                    title=""
                                    onChange={(e, i) => {
                                        const apariencia = apariencias.data?.filter((_, index) => index === i)[0];
                                        if (apariencia) {
                                            /* onFormChange({
                                                apariencias_interesado_en_interpretar:
                                                    (state.apariencias_interesado_en_interpretar.includes(apariencia.id)) ?
                                                        state.apariencias_interesado_en_interpretar.filter(e => e !== apariencia.id) :
                                                        state.apariencias_interesado_en_interpretar.concat([apariencia.id])
                                            }) */
                                        }
                                    }}
                                    id="tipos-apariencias-rol"
                                    labelStyle={{ marginBottom: 0, width: '45%' }}
                                    options={(apariencias.data) ? apariencias.data.map(g => g.nombre) : []}
                                    values={/* (apariencias.data) ? apariencias.data.map(g => {
                                    return state.apariencias_interesado_en_interpretar.includes(g.id);
                                }) : */ [false]}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <FormGroup
                                className={'form-input-md'}
                                labelStyle={{ fontWeight: 600 }}
                                labelClassName={'form-input-label'}
                                rootStyle={{ marginTop: 30 }}
                                value={''}
                                onChange={(e) => {
                                    /* onFormChange({
                                        director_casting: e.target.value
                                    }) */
                                }}
                                label='Etnia/Nacionalidad'
                            />
                        </Grid>
                    </Grid>
                    <Grid item xs={6}>
                        <Grid xs={12}>
                            <MCheckboxGroup
                                direction='horizontal'
                                title=""
                                onChange={(e, i) => {
                                    console.log('change');
                                }}
                                id="mascota-o-animal-checkbox"
                                labelStyle={{ marginBottom: 0, fontWeight: 600 }}
                                options={['¿Mascota o Animal?']}
                                values={/* (apariencias.data) ? apariencias.data.map(g => {
                                    return state.apariencias_interesado_en_interpretar.includes(g.id);
                                }) : */ [false]}
                            />
                            <FormGroup
                                className={'form-input-md'}
                                labelStyle={{ fontWeight: 600 }}
                                labelClassName={'form-input-label'}
                                rootStyle={{ marginTop: 0 }}
                                value={''}
                                onChange={(e) => {
                                    /* onFormChange({
                                        director_casting: e.target.value
                                    }) */
                                }}
                                label=''
                            />
                        </Grid>
                        <Grid xs={12}>
                            <FormGroup
                                className={'form-input-md'}
                                labelStyle={{ fontWeight: 600 }}
                                labelClassName={'form-input-label'}
                                rootStyle={{ marginTop: 30 }}
                                value={''}
                                onChange={(e) => {
                                    /* onFormChange({
                                        director_casting: e.target.value
                                    }) */
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
                                label='Tamaño'
                                labelStyle={{ fontSize: '1.1rem', color: '#000', fontWeight: 600 }}
                                style={{ gap: 0 }}
                                styleRoot={{ marginTop: 5 }}
                                id="tamano-mascota-rol"
                                options={['Chico', 'Mediano', 'Grande']}
                                value={'Chico'}
                                direction='vertical'
                                onChange={(e) => {
                                    /* onFormChange({
                                        compartir_nombre: (e.target.value === 'Compartir nombre de proyecto')
                                    }) */
                                }}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}
