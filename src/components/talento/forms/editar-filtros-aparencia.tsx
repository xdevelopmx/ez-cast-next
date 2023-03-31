import { type FC } from 'react'
import { AddButton, FormGroup, MCheckboxGroup, MRadioGroup, MSelect, Tag } from '~/components';
import { Alert, Chip, Divider, Grid, Typography } from '@mui/material';
import { MContainer } from '~/components/layout/MContainer';
import { type FiltrosAparienciaForm } from '~/pages/talento/editar-perfil';
import { api } from '~/utils/api';
import useNotify from '~/hooks/useNotify';
import MotionDiv from '~/components/layout/MotionDiv';

interface Props {
    state: FiltrosAparienciaForm,
    onFormChange: (input: { [id: string]: unknown }) => void;
}

export const EditarFiltrosAparenciasTalento: FC<Props> = ({ onFormChange, state }) => {

    const { notify } = useNotify();

    const colores_cabello = api.catalogos.getColorCabello.useQuery(undefined, {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    const estilos_cabello = api.catalogos.getEstiloCabello.useQuery(undefined, {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    const vellos_facial = api.catalogos.getVelloFacial.useQuery(undefined, {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    const colores_ojos = api.catalogos.getColorOjos.useQuery(undefined, {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    const generos = api.catalogos.getGeneros.useQuery(undefined, {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    const apariencias_etnicas = api.catalogos.getAparienciasEtnicas.useQuery(undefined, {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    const tipos_tatuajes = api.catalogos.getTiposTatuajes.useQuery(undefined, {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    const tipos_piercings = api.catalogos.getTiposPiercings.useQuery(undefined, {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    const tipos_hermanos = api.catalogos.getTipoHermanos.useQuery(undefined, {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    const tipos_particularidades = api.catalogos.getParticularidades.useQuery(undefined, {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    const is_loading = tipos_piercings.isFetching || tipos_tatuajes.isFetching || apariencias_etnicas.isFetching || colores_cabello.isFetching || estilos_cabello.isFetching || vellos_facial.isFetching || colores_ojos.isFetching;

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Alert severity="info" icon={false} sx={{ textAlign: 'center', justifyContent: 'center' }}>
                    Esto no será visible en tu perfil, pero aparecerá en las búsquedas basadas en lo que selecciones.
                </Alert>
            </Grid>
            <Grid item xs={12}>
                <MContainer direction='vertical'>
                    <Typography fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                        Rango de Edad a interpretar
                    </Typography>
                    <MContainer direction='horizontal' styles={{ gap: 40 }}>
                        <FormGroup
                            className={'form-input-md'}
                            labelClassName={'form-input-label'}
                            value={`${state.apariencia.rango_inicial_edad}`}
                            style={{ width: 60 }}
                            type='number'
                            onChange={(e) => {
                                onFormChange({
                                    apariencia: {
                                        ...state.apariencia,
                                        rango_inicial_edad: parseInt(e.currentTarget.value)
                                    }
                                })
                            }}
                        />
                        <Typography>a</Typography>
                        <FormGroup
                            className={'form-input-md'}
                            labelClassName={'form-input-label'}
                            value={`${state.apariencia.rango_final_edad}`}
                            style={{ width: 60 }}
                            type='number'
                            onChange={(e) => {
                                onFormChange({
                                    apariencia: {
                                        ...state.apariencia,
                                        rango_final_edad: parseInt(e.currentTarget.value)
                                    }
                                })
                            }}
                        />
                    </MContainer>
                </MContainer>
            </Grid>

            <Grid my={4} item xs={12}>
                <Divider />
            </Grid>

            <Grid item xs={12}>
                <MContainer direction='horizontal' styles={{ gap: 40 }}>
                    <MSelect
                        label='Género con el que se identifica'
                        loading={is_loading}
                        id='genero-identifica'
                        options={(generos.isSuccess && generos.data) ? generos.data.map(u => { return { value: u.id.toString(), label: u.es } }) : []}
                        style={{ width: 250 }}
                        value={`${state.apariencia.id_genero}`}
                        onChange={(e) => {
                            onFormChange({
                                apariencia: {
                                    ...state.apariencia,
                                    id_genero: parseInt(e.target.value)
                                }
                            })
                        }}
                    />

                    <MCheckboxGroup
                        onAllOptionChecked={() => {
                            console.log('xd');
                        }}
                        direction='horizontal'
                        title="Género interesado en interpretar"
                        onChange={(e, i) => {
                            const genero = generos.data?.filter((_, index) => index === i)[0];
                            if (genero) {
                                onFormChange({
                                    generos_interesado_en_interpretar:
                                        (state.generos_interesado_en_interpretar.includes(genero.id)) ?
                                            state.generos_interesado_en_interpretar.filter(e => e !== genero.id) :
                                            state.generos_interesado_en_interpretar.concat([genero.id])
                                })
                            }
                        }}
                        id="genero-interesado-interpretar"
                        labelStyle={{ marginBottom: 0, width: '32%' }}
                        options={(generos.data) ? generos.data.map(g => g.es) : []}
                        values={(generos.data) ? generos.data.map(g => {
                            return state.generos_interesado_en_interpretar.includes(g.id);
                        }) : [false]}
                    />
                </MContainer>
            </Grid>

            <Grid my={4} item xs={12}>
                <Divider />
            </Grid>

            <Grid item xs={12}>
                <MSelect
                    label='Apariencia Étnica'
                    loading={is_loading}
                    id='etinia-select'
                    options={(apariencias_etnicas.isSuccess && apariencias_etnicas.data) ? apariencias_etnicas.data.map(u => { return { value: u.id.toString(), label: u.nombre } }) : []}
                    style={{ width: 250 }}
                    value={`${state.apariencia.id_apariencia_etnica}`}
                    onChange={(e) => {
                        onFormChange({
                            apariencia: {
                                ...state.apariencia,
                                id_apariencia_etnica: parseInt(e.target.value)
                            }
                        })
                    }}
                />
            </Grid>

            <Grid my={4} item xs={12}>
                <Divider />
            </Grid>

            <Grid container item xs={12}>
                <Grid container item xs={5} gap={3}>
                    <Grid container item xs={12} alignItems={'center'} >
                        <Grid item xs={6}>
                            <Typography>Color de Cabello</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <MSelect
                                loading={is_loading}
                                id='color-cabello'
                                options={(colores_cabello.isSuccess && colores_cabello.data) ? colores_cabello.data.map(u => { return { value: u.id.toString(), label: u.es } }) : []}
                                style={{ width: '140px' }}
                                value={`${state.apariencia.id_color_cabello}`}
                                onChange={(e) => {
                                    onFormChange({
                                        apariencia: {
                                            ...state.apariencia,
                                            id_color_cabello: parseInt(e.target.value)
                                        }
                                    })
                                }}
                            />
                        </Grid>
                    </Grid>

                    <Grid container item xs={12} alignItems={'center'} >
                        <Grid item xs={6}>
                            <Typography>Estilo de Cabello</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <MSelect
                                id='estilo-cabello'
                                options={(estilos_cabello.isSuccess && estilos_cabello.data) ? estilos_cabello.data.map(u => { return { value: u.id.toString(), label: u.es } }) : []}
                                style={{ width: '140px' }}
                                value={`${state.apariencia.id_estilo_cabello}`}
                                onChange={(e) => {
                                    onFormChange({
                                        apariencia: {
                                            ...state.apariencia,
                                            id_estilo_cabello: parseInt(e.target.value)
                                        }
                                    })
                                }}
                            />
                        </Grid>
                    </Grid>

                    <Grid container item xs={12} alignItems={'center'} >
                        <Grid item xs={6}>
                            <Typography>Vello Facial</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <MSelect
                                id='vello-facial'
                                options={(vellos_facial.isSuccess && vellos_facial.data) ? vellos_facial.data.map(u => { return { value: u.id.toString(), label: u.es } }) : []}
                                style={{ width: '140px' }}
                                value={`${state.apariencia.id_vello_facial}`}
                                onChange={(e) => {
                                    onFormChange({
                                        apariencia: {
                                            ...state.apariencia,
                                            id_vello_facial: parseInt(e.target.value)
                                        }
                                    })
                                }}
                            />
                        </Grid>
                    </Grid>

                    <Grid container item xs={12} alignItems={'center'} >
                        <Grid item xs={6}>
                            <Typography>Color de ojos</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <MSelect
                                id='color-ojos'
                                options={(colores_ojos.isSuccess && colores_ojos.data) ? colores_ojos.data.map(u => { return { value: u.id.toString(), label: u.es } }) : []}
                                style={{ width: '140px' }}
                                value={`${state.apariencia.id_color_ojos}`}
                                onChange={(e) => {
                                    onFormChange({
                                        apariencia: {
                                            ...state.apariencia,
                                            id_color_ojos: parseInt(e.target.value)
                                        }
                                    })
                                }}
                            />
                        </Grid>
                    </Grid>

                </Grid>

                <Grid container item xs={7} gap={3}>
                    <Grid container item xs={12} alignItems={'center'}>
                        <Grid item xs={7}>
                            <Typography>¿Dispuesto a cambiar de color?</Typography>
                        </Grid>
                        <Grid item xs={5}>
                            <MRadioGroup
                                id="dispuesto-cambiar-color"
                                options={['Sí', 'No']}
                                styleRoot={{ height: 37 }}
                                labelStyle={{ margin: 0, fontWeight: 800, fontSize: '0.8rem', color: '#069cb1' }}
                                value={state.apariencia.disposicion_cambio_color_cabello ? 'Sí' : 'No'}
                                onChange={(e) => {
                                    onFormChange({
                                        apariencia: {
                                            ...state.apariencia,
                                            disposicion_cambio_color_cabello: (e.target.value === 'Sí')
                                        }
                                    })
                                }}
                                label=''
                            />
                        </Grid>

                    </Grid>

                    <Grid container item xs={12} alignItems={'center'}>
                        <Grid item xs={7}>
                            <Typography>¿Dispuesto a cambiar corte?</Typography>
                        </Grid>
                        <Grid item xs={5}>
                            <MRadioGroup
                                id="dispuesto-cambiar-corte"
                                options={['Sí', 'No']}
                                styleRoot={{ height: 37 }}
                                labelStyle={{ margin: 0, fontWeight: 800, fontSize: '0.8rem', color: '#069cb1' }}
                                value={state.apariencia.disposicion_corte_cabello ? 'Sí' : 'No'}
                                onChange={(e) => {
                                    onFormChange({
                                        apariencia: {
                                            ...state.apariencia,
                                            disposicion_corte_cabello: (e.target.value === 'Sí')
                                        }
                                    })
                                }}
                                label=''
                            />
                        </Grid>
                    </Grid>

                    <Grid container item xs={12} alignItems={'center'}>
                        <Grid item xs={7}>
                            <Typography>¿Dispuesto a crecer o afeitar?</Typography>
                        </Grid>
                        <Grid item xs={5}>
                            <MRadioGroup
                                id="dispuesto-cambiar-corte"
                                options={['Sí', 'No']}
                                styleRoot={{ height: 37 }}
                                labelStyle={{ margin: 0, fontWeight: 800, fontSize: '0.8rem', color: '#069cb1' }}
                                value={state.apariencia.disposicion_afeitar_o_crecer_vello_facial ? 'Sí' : 'No'}
                                onChange={(e) => {
                                    onFormChange({
                                        apariencia: {
                                            ...state.apariencia,
                                            disposicion_afeitar_o_crecer_vello_facial: (e.target.value === 'Sí')
                                        }
                                    })
                                }}
                                label=''
                            />
                        </Grid>
                    </Grid>
                    <Grid container item xs={12} alignItems={'center'}>
                        <Grid item xs={7}>
                        <div style={{height: 37.42, width: 10}}></div>
                        </Grid>
                        <Grid item xs={5}>
                            <div style={{height: 37.42, width: 10}}></div>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>


            <Grid my={4} item xs={12}>
                <Divider />
            </Grid>

            <Grid item xs={12}>
                <MContainer direction='vertical' styles={{ gap: 10 }}>
                    <Typography fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                        Tatuajes
                    </Typography>
                    <Typography>
                        ¿Tienes tatuajes distintivos? Es tu oportunidad de informar a los directores de casting.
                    </Typography>
                    <MRadioGroup
                        id="tiene-tatuajes-distintivos"
                        options={['Sí', 'No']}
                        labelStyle={{ marginLeft: 112, fontWeight: 800, fontSize: '0.8rem', color: '#069cb1' }}
                        value={state.has_tatoos ? 'Sí' : 'No'}
                        onChange={(e) => { onFormChange({ has_tatoos: (e.currentTarget.value === 'Sí') }) }}
                        label=''
                    />
                    <MotionDiv show={state.has_tatoos} animation='fade'>
                        <>
                            <MContainer direction='horizontal' styles={{ marginBottom: 16, alignItems: 'center', gap: 20 }}>
                                <Typography>Visibilidad:</Typography>
                                <MSelect
                                    id='visibilidad-tatuaje'
                                    options={(tipos_tatuajes.data) ? tipos_tatuajes.data.map(t => { return { value: t.id.toString(), label: t.es } }) : []}
                                    style={{ width: 200 }}
                                    onChange={(e) => { onFormChange({ id_tipo_tatuaje: parseInt(e.target.value) }) }}
                                    value={state.id_tipo_tatuaje.toString()}
                                />
                            </MContainer>

                            <MContainer direction='horizontal' styles={{ alignItems: 'center', gap: 20 }}>
                                <Typography>Descripción:</Typography>
                                <FormGroup
                                    rootStyle={{ margin: 0 }}
                                    className={'form-input-md'}
                                    labelClassName={'form-input-label'}
                                    value={state.descripcion_tatoo}
                                    onChange={(e) => { onFormChange({ descripcion_tatoo: e.currentTarget.value }) }}
                                />
                            </MContainer>
                            <AddButton aStyles={{ marginBottom: 16 }} text='Agregar otro' onClick={() => {
                                if (state.id_tipo_tatuaje > 0 && state.descripcion_tatoo.length > 0) {
                                    onFormChange({
                                        tatuajes: state.tatuajes.concat([{ id_tipo_tatuaje: state.id_tipo_tatuaje, descripcion: state.descripcion_tatoo }])
                                    })
                                } else {
                                    notify('warning', 'El campo de visibilidad y descripcion no pueden estar vacios')
                                }
                            }} />
                            <MContainer direction='horizontal' styles={{ gap: 10 }}>
                                {state.tatuajes.map((t, i) => {
                                    let tipo_tatoo = '';
                                    const filtered_tatoo_type = tipos_tatuajes.data?.filter(tatoo => tatoo.id === t.id_tipo_tatuaje)[0];
                                    if (filtered_tatoo_type) {
                                        tipo_tatoo = filtered_tatoo_type.es;
                                    }
                                    return <Tag
                                        key={i}
                                        text={`${tipo_tatoo} - ${t.descripcion}`}
                                        onRemove={(e) => {
                                            onFormChange({
                                                tatuajes: state.tatuajes.filter((_, j) => i !== j)
                                            })
                                            console.log(e);
                                        }}
                                    />
                                })}
                            </MContainer>
                        </>
                    </MotionDiv>
                </MContainer>
            </Grid>

            <Grid my={4} item xs={12}>
                <Divider />
            </Grid>

            <Grid item xs={12}>
                <MContainer direction='vertical' styles={{ gap: 20 }}>
                    <Typography fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                        Piercings
                    </Typography>
                    <Typography>
                        ¿Tienes algún piercing? Es tu oportunidad, hazle saber al director de casting.
                    </Typography>
                    <MRadioGroup
                        id="tiene-piercing"
                        options={['Sí', 'No']}
                        labelStyle={{ marginLeft: 112, fontWeight: 800, fontSize: '0.8rem', color: '#069cb1' }}
                        value={(state.has_piercings) ? 'Sí' : 'No'}
                        onChange={(e) => { onFormChange({ has_piercings: (e.currentTarget.value === 'Sí') }) }}
                        label=''
                    />
                    <MotionDiv show={state.has_piercings} animation='fade'>
                        <>

                            <MContainer direction='horizontal' styles={{ gap: 40, alignItems: 'center' }}>
                                <Typography>Lugar:</Typography>
                                <MSelect
                                    id='tipo-piercing'
                                    options={(tipos_piercings.data) ? tipos_piercings.data.map(t => { return { value: t.id.toString(), label: t.es } }) : []}
                                    style={{ width: 200 }}
                                    onChange={(e) => { onFormChange({ id_tipo_piercing: parseInt(e.target.value) }) }}
                                    value={state.id_tipo_piercing.toString()}
                                />
                            </MContainer>

                            <MContainer direction='horizontal' styles={{ marginTop: 16, marginBottom: 16, gap: 40, alignItems: 'center' }}>
                                <Typography>Descripción:</Typography>
                                <FormGroup
                                    className={'form-input-md'}
                                    labelClassName={'form-input-label'}
                                    value={state.descripcion_piercing}
                                    rootStyle={{ margin: 0 }}
                                    onChange={(e) => { onFormChange({ descripcion_piercing: e.currentTarget.value }) }}
                                />
                            </MContainer>

                            <AddButton text='Agregar otro' onClick={() => {
                                if (state.id_tipo_piercing > 0 && state.descripcion_piercing.length > 0) {
                                    onFormChange({
                                        piercings: state.piercings.concat([{ id_tipo_piercing: state.id_tipo_piercing, descripcion: state.descripcion_piercing }])
                                    })
                                } else {
                                    notify('warning', 'El campo de lugar y descripcion no pueden estar vacios')
                                }

                            }} />
                            <MContainer styles={{ marginTop: 16, marginBottom: 16, gap: 10 }} direction='horizontal'>
                                {state.piercings.map((_p, i) => {
                                    let tipo_piercing = '';
                                    const filtered_piercing_type = tipos_piercings.data?.filter(p => p.id === _p.id_tipo_piercing)[0];
                                    if (filtered_piercing_type) {
                                        tipo_piercing = filtered_piercing_type.es;
                                    }
                                    return <Tag
                                        key={i}
                                        text={`${tipo_piercing} - ${_p.descripcion}`}
                                        onRemove={(e) => {
                                            onFormChange({
                                                piercings: state.piercings.filter((_, j) => i !== j)
                                            })
                                        }}
                                    />
                                })}
                            </MContainer>
                        </>
                    </MotionDiv>
                </MContainer>
            </Grid>

            <Grid my={4} item xs={12}>
                <Divider />
            </Grid>

            <Grid item xs={12}>
                <MContainer direction='vertical' styles={{ gap: 20 }}>
                    <Typography fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                        Gemelo Idéntico o Trillizos
                    </Typography>
                    <MContainer direction='horizontal' styles={{ alignItems: 'center', gap: 40 }}>
                        <Typography>¿Eres gemelo o trillizo idéntico?</Typography>
                        <MRadioGroup
                            id="eres-gemelo-trillizo"
                            options={['Sí', 'No']}
                            labelStyle={{ marginLeft: 112, fontWeight: 800, fontSize: '0.8rem', color: '#069cb1' }}
                            value={(state.has_hermanos) ? 'Sí' : 'No'}
                            onChange={(e) => { onFormChange({ has_hermanos: (e.currentTarget.value === 'Sí') }) }}
                            label=''
                        />
                    </MContainer>
                    <MotionDiv show={state.has_hermanos} animation='fade'>
                        <>
                            <MContainer direction='horizontal' styles={{ alignItems: 'center' }}>
                                <MRadioGroup
                                    style={{}}
                                    id="tienes-hermanos"
                                    options={(tipos_hermanos.data) ? tipos_hermanos.data.map(h => { return h.es }) : []}
                                    value={state.tipo_hermano_selected}
                                    onChange={(e) => {
                                        const _tipo_hermanos = tipos_hermanos.data?.filter((h) => {
                                            return e.target.value === h.es
                                        })[0];
                                        if (_tipo_hermanos) {
                                            onFormChange({
                                                hermanos: {
                                                    ...state.hermanos,
                                                    id_tipo_hermanos: _tipo_hermanos.id,
                                                    descripcion: (_tipo_hermanos.id === 99) ? '' : (state.hermanos) ? state.hermanos.descripcion : ''
                                                },
                                                tipo_hermano_selected: e.target.value,
                                            })
                                        }
                                    }}
                                />
                                <MotionDiv show={state.hermanos?.id_tipo_hermanos === 99} animation={'fade'}>
                                    <FormGroup
                                        label=''
                                        className={'form-input-md'}
                                        labelClassName={'form-input-label'}
                                        value={state.hermanos?.descripcion}
                                        onChange={(e) => {
                                            onFormChange({
                                                hermanos: {
                                                    ...state.hermanos,
                                                    descripcion: e.currentTarget.value
                                                }
                                            })
                                        }}
                                    />
                                </MotionDiv>
                            </MContainer>
                        </>
                    </MotionDiv>
                </MContainer>
            </Grid>

            <Grid my={4} item xs={12}>
                <Divider />
            </Grid>

            <Grid item xs={12}>
                <MContainer direction='vertical' styles={{ gap: 20 }}>
                    <Typography fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                        Particularidades
                    </Typography>
                    <Typography>
                        Algunas veces los directores buscan atributos específicos, déjales saber si tienes alguno de los siguientes
                    </Typography>
                    <MContainer direction='vertical'>
                        <MCheckboxGroup
                            direction='horizontal'

                            onChange={(e, i) => {
                                const particularidad = tipos_particularidades.data?.filter((_, index) => index === i)[0];
                                if (particularidad) {
                                    onFormChange({
                                        particularidades:
                                            (state.particularidades.map(e => e.id_particularidad).includes(particularidad.id)) ?
                                                state.particularidades.filter(e => e.id_particularidad !== particularidad.id) :
                                                state.particularidades.concat([{ id_particularidad: particularidad.id, descripcion: (particularidad.id === 99) ? `${(state.descripcion_otra_particularidad) ? state.descripcion_otra_particularidad : ''}` : '' }])
                                    })
                                }
                            }}
                            values={(tipos_particularidades.data) ? tipos_particularidades.data.map(g => {
                                return state.particularidades.map(e => e.id_particularidad).includes(g.id);
                            }) : [false]}
                            id="particularidades-checkboxgroup"
                            labelStyle={{ marginBottom: 0, width: '32%' }}
                            options={(tipos_particularidades.data) ? tipos_particularidades.data.map(tp => tp.es) : []}
                        />
                        <MotionDiv show={state.particularidades.some(e => e.id_particularidad === 99)} animation={'fade'}>
                            <FormGroup
                                label='Descripcion otro tipo de particularidad'
                                className={'form-input-md'}
                                labelClassName={'form-input-label'}
                                value={state.descripcion_otra_particularidad}
                                rootStyle={{ margin: 0 }}
                                onChange={(e) => {

                                    onFormChange({
                                        descripcion_otra_particularidad: e.currentTarget.value,
                                        particularidades: state.particularidades.map((p) => {
                                            if (p.id_particularidad === 99) {
                                                p.descripcion = e.target.value;
                                            }
                                            return p;
                                        })
                                    })
                                }}
                            />
                        </MotionDiv>
                    </MContainer>
                </MContainer>
            </Grid>
        </Grid>
    )
}
