import { type FC } from 'react'
import { motion } from 'framer-motion'
import { AddButton, FormGroup, MCheckboxGroup, MRadioGroup, MSelect } from '~/components';
import { Alert, Chip, Divider, Grid, Typography } from '@mui/material';
import { MContainer } from '~/components/layout/MContainer';
import classes from './talento-forms.module.css';
import { type FiltrosAparienciaForm } from '~/pages/talento/editar-perfil';
import { api } from '~/utils/api';
import useNotify from '~/hooks/useNotify';
import MotionDiv from '~/components/layout/MotionDiv';

interface Props {
    state: FiltrosAparienciaForm,
    onFormChange: (input: { [id: string]: unknown }) => void;
}

export const EditarFiltrosAparenciasTalento: FC<Props> = ({ onFormChange, state }) => {

    const {notify} = useNotify();

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

    const is_loading = tipos_piercings.isFetching || tipos_tatuajes.isFetching || apariencias_etnicas.isFetching || colores_cabello.isFetching || estilos_cabello.isFetching || vellos_facial.isFetching || colores_ojos.isFetching;


    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Alert severity="info">
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
                            className={classes['form-input-md']}
                            labelClassName={classes['form-input-label']}
                            value={`${state.apariencia.rango_inicial_edad}`}
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
                            className={classes['form-input-md']}
                            labelClassName={classes['form-input-label']}
                            value={`${state.apariencia.rango_final_edad}`}
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
                        onChange={(e) => { onFormChange({ 
                            apariencia:{
                                ...state.apariencia,
                                id_genero: parseInt(e.target.value) 
                            }
                        }) }}
                    />

                    <MCheckboxGroup
                        onAllOptionChecked={() => {
                            console.log('xd');
                        }}
                        direction='horizontal'
                        title="Género interesado en interpretar"
                        onChange={(e, i) => {
                            const genero = generos.data?.filter((_, index) =>  index === i)[0];
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
                        labelClassName={classes['label-black-md']}
                        options={(generos.data) ? generos.data.map(g => g.es) : []}
                        values={(generos.data) ? generos.data.map(g => {
                            return state.generos_interesado_en_interpretar.includes(g.id);
                        }): [false]}
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
                    onChange={(e) => { onFormChange({ 
                        apariencia:{
                            ...state.apariencia,
                            id_apariencia_etnica: parseInt(e.target.value) 
                        }
                    }) }}
                />
            </Grid>

            <Grid my={4} item xs={12}>
                <Divider />
            </Grid>

            <Grid item xs={12}>
                <MContainer direction='horizontal' styles={{ gap: 40 }}>
                    <MContainer direction='vertical' styles={{ gap: 20 }}>

                        <MContainer direction='horizontal' styles={{ gap: 10, alignItems: 'center' }}>
                            <Typography>Color de Cabello</Typography>
                            <MSelect
                                loading={is_loading}
                                id='color-cabello'
                                options={(colores_cabello.isSuccess && colores_cabello.data) ? colores_cabello.data.map(u => { return { value: u.id.toString(), label: u.es } }) : []}
                                style={{ width: 250 }}
                                value={`${state.apariencia.id_color_cabello}`}
                                onChange={(e) => { onFormChange({ 
                                    apariencia:{
                                        ...state.apariencia,
                                        id_color_cabello: parseInt(e.target.value) 
                                    }
                                }) }}
                            />
                        </MContainer>

                        <MContainer direction='horizontal' styles={{ gap: 10, alignItems: 'center' }}>
                            <Typography>Estilo de Cabello</Typography>
                            <MSelect
                                id='estilo-cabello'
                                options={(estilos_cabello.isSuccess && estilos_cabello.data) ? estilos_cabello.data.map(u => { return { value: u.id.toString(), label: u.es } }) : []}
                                style={{ width: 250 }}
                                value={`${state.apariencia.id_estilo_cabello}`}
                                onChange={(e) => { onFormChange({ 
                                    apariencia:{
                                        ...state.apariencia,
                                        id_estilo_cabello: parseInt(e.target.value) 
                                    }
                                }) }}
                            />
                        </MContainer>

                        <MContainer direction='horizontal' styles={{ gap: 10, alignItems: 'center' }}>
                            <Typography>Vello Facial</Typography>
                            <MSelect
                                id='vello-facial'
                                options={(vellos_facial.isSuccess && vellos_facial.data) ? vellos_facial.data.map(u => { return { value: u.id.toString(), label: u.es } }) : []}
                                style={{ width: 250 }}
                                value={`${state.apariencia.id_vello_facial}`}
                                onChange={(e) => { onFormChange({ 
                                    apariencia:{
                                        ...state.apariencia,
                                        id_vello_facial: parseInt(e.target.value) 
                                    }
                                }) }}
                            />
                        </MContainer>

                        <MContainer direction='horizontal' styles={{ gap: 10, alignItems: 'center' }}>
                            <Typography>Color de ojos</Typography>
                            <MSelect
                                id='color-ojos'
                                options={(colores_ojos.isSuccess && colores_ojos.data) ? colores_ojos.data.map(u => { return { value: u.id.toString(), label: u.es } }) : []}
                                style={{ width: 250 }}
                                value={`${state.apariencia.id_color_ojos}`}
                                onChange={(e) => { onFormChange({ 
                                    apariencia:{
                                        ...state.apariencia,
                                        id_color_ojos: parseInt(e.target.value) 
                                    }
                                }) }}
                            />
                        </MContainer>


                    </MContainer>

                    <MContainer direction='vertical'>
                        <MContainer direction='horizontal' styles={{ alignItems: 'center' }}>
                            <Typography>¿Dispuesto a cambiar de color?</Typography>
                            <MRadioGroup
                                id="dispuesto-cambiar-color"
                                options={['si', 'no']}
                                labelStyle={{ marginLeft: 112, fontWeight: 800, fontSize: '0.8rem', color: '#4ab7c6' }}
                                value={state.apariencia.disposicion_cambio_color_cabello ? 'si' : 'no'}
                                onChange={(e) => { onFormChange({ 
                                    apariencia: {
                                        ...state.apariencia,
                                        disposicion_cambio_color_cabello: (e.target.value === 'si')
                                    }
                                }) }}
                                label=''
                            />
                        </MContainer>

                        <MContainer direction='horizontal' styles={{ alignItems: 'center' }}>
                            <Typography>¿Dispuesto a cambiar corte?</Typography>
                            <MRadioGroup
                                id="dispuesto-cambiar-corte"
                                options={['si', 'no']}
                                labelStyle={{ marginLeft: 112, fontWeight: 800, fontSize: '0.8rem', color: '#4ab7c6' }}
                                value={state.apariencia.disposicion_corte_cabello ? 'si' : 'no'}
                                onChange={(e) => { onFormChange({ 
                                    apariencia: {
                                        ...state.apariencia,
                                        disposicion_corte_cabello: (e.target.value === 'si')
                                    }
                                }) }}
                                label=''
                            />
                        </MContainer>

                        <MContainer direction='horizontal' styles={{ alignItems: 'center' }}>
                            <Typography>¿Dispuesto a crecer o afeitar?</Typography>
                            <MRadioGroup
                                id="dispuesto-cambiar-corte"
                                options={['si', 'no']}
                                labelStyle={{ marginLeft: 112, fontWeight: 800, fontSize: '0.8rem', color: '#4ab7c6' }}
                                value={state.apariencia.disposicion_afeitar_o_crecer_vello_facial ? 'si' : 'no'}
                                onChange={(e) => { onFormChange({ 
                                    apariencia: {
                                        ...state.apariencia,
                                        disposicion_afeitar_o_crecer_vello_facial: (e.target.value === 'si')
                                    }
                                }) }}
                                label=''
                            />
                        </MContainer>
                    </MContainer>
                </MContainer>
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
                        options={['si', 'no']}
                        labelStyle={{ marginLeft: 112, fontWeight: 800, fontSize: '0.8rem', color: '#4ab7c6' }}
                        value={state.has_tatoos ? 'si' : 'no'}
                        onChange={(e) => { onFormChange({ has_tatoos: (e.currentTarget.value === 'si') }) }}
                        label=''
                    />
                    <MotionDiv show={state.has_tatoos} animation='fade'>
                        <>
                            <MContainer direction='horizontal' styles={{ marginBottom: 16, alignItems: 'center', gap: 20 }}>
                                <Typography>Visibilidad:</Typography>
                                <MSelect
                                    id='visibilidad-tatuaje'
                                    options={(tipos_tatuajes.data) ? tipos_tatuajes.data.map(t => { return {value: t.id.toString(), label: t.es} }) : []}
                                    style={{ width: 200 }}
                                    onChange={(e) => { onFormChange({ id_tipo_tatuaje: parseInt(e.target.value) }) }}
                                    value={state.id_tipo_tatuaje.toString()} 
                                />
                            </MContainer>

                            <MContainer direction='horizontal' styles={{ alignItems: 'center', gap: 20 }}>
                                <Typography>Descripción:</Typography>
                                <FormGroup
                                    rootStyle={{ margin: 0 }}
                                    className={classes['form-input-md']}
                                    labelClassName={classes['form-input-label']}
                                    value={state.descripcion_tatoo}
                                    onChange={(e) => { onFormChange({ descripcion_tatoo: e.currentTarget.value }) }}
                                />
                            </MContainer>
                            <AddButton aStyles={{marginBottom: 16}} text='Agregar otro' onClick={() => { 
                                if (state.id_tipo_tatuaje > 0 && state.descripcion_tatoo.length > 0) {
                                    onFormChange({
                                        tatuajes: state.tatuajes.concat([{id_tipo_tatuaje: state.id_tipo_tatuaje, descripcion: state.descripcion_tatoo}])
                                    })
                                } else {
                                    notify('warning', 'El campo de visibilidad y descripcion no pueden estar vacios')
                                }
                            }} />
                            <MContainer direction='horizontal'>
                                {state.tatuajes.map((t, i) => {
                                    let tipo_tatoo = '';
                                    const filtered_tatoo_type = tipos_tatuajes.data?.filter(tatoo => tatoo.id === t.id_tipo_tatuaje)[0];
                                    if (filtered_tatoo_type) {
                                        tipo_tatoo = filtered_tatoo_type.es;
                                    }
                                    return <Chip 
                                        onDelete={(e) => {
                                            onFormChange({
                                                tatuajes: state.tatuajes.filter((_, j) => i !== j)
                                            })
                                            console.log(e);
                                        }}
                                        key={i} 
                                        label={`${tipo_tatoo} - ${t.descripcion}`} 
                                        style={{
                                            margin: 4, 
                                            fontWeight: 800, 
                                            color: 'white',
                                            borderColor: 'black',
                                            backgroundColor: '#4ab7c6'
                                        }}
                                        variant="outlined" 
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
                        options={['si', 'no']}
                        labelStyle={{ marginLeft: 112, fontWeight: 800, fontSize: '0.8rem', color: '#4ab7c6' }}
                        value={(state.has_piercings) ? 'si' : 'no'}
                        onChange={(e) => { onFormChange({ has_piercings: (e.currentTarget.value === 'si') }) }}
                        label=''
                    />
                    <MotionDiv show={state.has_piercings} animation='fade'>
                        <>
                        
                            <MContainer direction='horizontal' styles={{ gap: 40, alignItems: 'center' }}>
                                <Typography>Lugar:</Typography>
                                <MSelect
                                    id='tipo-piercing'
                                    options={(tipos_piercings.data) ? tipos_piercings.data.map(t => { return {value: t.id.toString(), label: t.es} }) : []}
                                    style={{ width: 200 }}
                                    onChange={(e) => { onFormChange({ id_tipo_piercing: parseInt(e.target.value) }) }}
                                    value={state.id_tipo_piercing.toString()} 
                                />
                            </MContainer>

                            <MContainer direction='horizontal' styles={{ marginTop: 16, marginBottom: 16, gap: 40, alignItems: 'center' }}>
                                <Typography>Descripción:</Typography>
                                <FormGroup
                                    className={classes['form-input-md']}
                                    labelClassName={classes['form-input-label']}
                                    value={state.descripcion_piercing}
                                    rootStyle={{ margin: 0 }}
                                    onChange={(e) => { onFormChange({ descripcion_piercing: e.currentTarget.value }) }}
                                />
                            </MContainer>

                             <AddButton text='Agregar otro' onClick={() => { 
                                if (state.id_tipo_piercing > 0 && state.descripcion_piercing.length > 0) {
                                    onFormChange({
                                        piercings: state.piercings.concat([{id_tipo_piercing: state.id_tipo_piercing, descripcion: state.descripcion_piercing}])
                                    })
                                } else {
                                    notify('warning', 'El campo de lugar y descripcion no pueden estar vacios')
                                }

                             }} />
                              <MContainer styles={{marginTop: 16, marginBottom: 16,}} direction='horizontal'>
                                {state.piercings.map((_p, i) => {
                                    let tipo_piercing = '';
                                    const filtered_piercing_type = tipos_piercings.data?.filter(p => p.id === _p.id_tipo_piercing)[0];
                                    if (filtered_piercing_type) {
                                        tipo_piercing = filtered_piercing_type.es;
                                    }
                                    return <Chip 
                                        onDelete={(e) => {
                                            onFormChange({
                                                piercings: state.piercings.filter((_, j) => i !== j)
                                            })
                                        }}
                                        key={i} 
                                        label={`${tipo_piercing} - ${_p.descripcion}`} 
                                        style={{
                                            margin: 4, 
                                            fontWeight: 800, 
                                            color: 'white',
                                            borderColor: 'black',
                                            backgroundColor: '#4ab7c6'
                                        }}
                                        variant="outlined" 
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
                            options={['si', 'no']}
                            labelStyle={{ marginLeft: 112, fontWeight: 800, fontSize: '0.8rem', color: '#4ab7c6' }}
                            value={(state.has_hermanos) ? 'si' : 'no'}
                            onChange={(e) => { onFormChange({ has_hermanos: (e.currentTarget.value === 'si') }) }}
                            label=''
                        />
                    </MContainer>
                    <MotionDiv show={state.has_hermanos} animation='fade'>
                        <>
                            <MContainer direction='horizontal' styles={{ alignItems: 'center' }}>
                                <MCheckboxGroup
                                    onAllOptionChecked={() => {
                                        console.log('xd');
                                    }}
                                    direction='horizontal'
                                    onChange={(e, i) => {
                                        const genero = generos.data?.filter((_, index) =>  index === i)[0];
                                        if (genero) {
                                            onFormChange({
                                                generos_interesado_en_interpretar: 
                                                    (state.generos_interesado_en_interpretar.includes(genero.id)) ?
                                                    state.generos_interesado_en_interpretar.filter(e => e !== genero.id) :
                                                    state.generos_interesado_en_interpretar.concat([genero.id])   
                                            })
                                        }
                                    }}
                                    id="especificacion-gemelo-trillizo"
                                    options={(tipos_hermanos.data) ? tipos_hermanos.data.map(h => { return h.es}) : []}
                                    values={(tipos_hermanos.data) ? tipos_hermanos.data.map(h => {
                                        return (state.hermanos && state.hermanos.id_tipo_hermanos === h.id);
                                    }): [false]}
                                />
                                <MRadioGroup
                                    id="especificacion-gemelo-trillizo"
                                    labelStyle={{ marginLeft: 112, fontWeight: 800, fontSize: '0.8rem', color: '#4ab7c6' }}
                                    value={''}
                                    onChange={(e) => { onFormChange({ nombre: e.currentTarget.value }) }}
                                    label=''
                                />
                                <MotionDiv show={state.id_tipo_hermanos === 99} animation={'fade'}>
                                    <FormGroup
                                        label=''
                                        className={classes['form-input-md']}
                                        labelClassName={classes['form-input-label']}
                                        value={`${state.apariencia.rango_final_edad}`}
                                        onChange={(e) => {
                                            onFormChange({
                                                apariencia: {
                                                    ...state.apariencia,
                                                    rango_final_edad: parseInt(e.currentTarget.value)
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
                    <MCheckboxGroup
                        direction='horizontal'

                        onChange={(e) => {
                            //onFormChange({ mostrar_anio_en_perfil: e.currentTarget.checked })
                        }}
                        id="particularidades-checkboxgroup"
                        labelStyle={{ marginBottom: 0, width: '32%' }}
                        labelClassName={classes['label-black-md']}
                        options={[
                            'Amputación', 'Dentadura Postiza', 'Paraplégico', 'Sordo/a', 'Brackets', 'Discapacidad auditiva',
                            'Parálisis cerebral', 'Síndrome de down', 'Brazo Protésico', 'Mano Protésica', 'Pie Protésico',
                            'Tetrapléjia', 'Cicatriz en el rostro', 'Mudo', 'Pierna Protésica', 'Masectomía Bilateral',
                            'Ciego/a', 'Ojo de vidrio', 'Silla de ruedas', 'Masectomía única', 'Otro'
                        ]}
                        values={[false]}//[(state) ? state.mostrar_anio_en_perfil : false]}
                    />
                    <FormGroup
                        className={classes['form-input-md']}
                        labelClassName={classes['form-input-label']}
                        value={''}
                        rootStyle={{ margin: 0 }}
                        onChange={(e) => { onFormChange({ nombre: e.currentTarget.value }) }}
                    />
                </MContainer>
            </Grid>
        </Grid>
    )
}
