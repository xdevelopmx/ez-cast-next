import { type FC } from 'react'
import { motion } from 'framer-motion'
import { AddButton, FormGroup, MCheckboxGroup, MRadioGroup, MSelect } from '~/components';
import { Alert, Divider, Grid, Typography } from '@mui/material';
import { MContainer } from '~/components/layout/MContainer';
import classes from './talento-forms.module.css';
import { type FiltrosAparienciaForm } from '~/pages/talento/editar-perfil';
import { api } from '~/utils/api';

interface Props {
    state: FiltrosAparienciaForm,
    onFormChange: (input: { [id: string]: unknown }) => void;
}

export const EditarFiltrosAparenciasTalento: FC<Props> = ({ onFormChange, state }) => {

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

    const tatuajes = api.catalogos.getTatuajes.useQuery(undefined, {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    const is_loading = colores_cabello.isFetching || estilos_cabello.isFetching || vellos_facial.isFetching || colores_ojos.isFetching || tatuajes.isFetching;


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
                            value={`${state.rango_edad.rango_1}`}
                            onChange={(e) => {
                                onFormChange({
                                    rango_edad: {
                                        ...state.rango_edad,
                                        rango_1: parseInt(e.currentTarget.value)
                                    }
                                })
                            }}
                        />
                        <Typography>a</Typography>
                        <FormGroup
                            className={classes['form-input-md']}
                            labelClassName={classes['form-input-label']}
                            value={`${state.rango_edad.rango_2}`}
                            onChange={(e) => {
                                onFormChange({
                                    rango_edad: {
                                        ...state.rango_edad,
                                        rango_2: parseInt(e.currentTarget.value)
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
                    <FormGroup
                        label='Género con el que se identifica'
                        className={classes['form-input-md']}
                        labelClassName={classes['form-input-label']}
                        value={state.genero}
                        onChange={(e) => { onFormChange({ genero: e.currentTarget.value }) }}
                    />

                    <MCheckboxGroup
                        onAllOptionChecked={() => {
                            console.log('xd');
                        }}
                        direction='horizontal'
                        title="Género interesado en interpretar"
                        onChange={(e, i) => {
                            onFormChange({
                                genero_interesado_interpretar:
                                    state.genero_interesado_interpretar
                                        .map((value, index) => {
                                            if (i === index) {
                                                return e
                                            }
                                            return value
                                        })
                            })
                        }}
                        id="genero-interesado-interpretar"
                        labelStyle={{ marginBottom: 0, width: '32%' }}
                        labelClassName={classes['label-black-md']}
                        options={['Hombre', 'Persona no-binaria', 'Mujer trans', 'Mujer', 'Hombre trans']}
                        values={state.genero_interesado_interpretar}//[(state) ? state.mostrar_anio_en_perfil : false]}
                    />
                </MContainer>
            </Grid>

            <Grid my={4} item xs={12}>
                <Divider />
            </Grid>

            <Grid item xs={12}>
                <FormGroup
                    label='Apariencia Étnica'
                    className={classes['form-input-md']}
                    labelClassName={classes['form-input-label']}
                    value={state.apariencia_etnica}
                    onChange={(e) => { onFormChange({ apariencia_etnica: e.currentTarget.value }) }}
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
                                value={`${state.caracteristicas_cabello_ojos.id_color_cabello}`}
                                onChange={(e) => { onFormChange({ 
                                    caracteristicas_cabello_ojos:{
                                        ...state.caracteristicas_cabello_ojos,
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
                                value={`${state.caracteristicas_cabello_ojos.id_estilo_cabello}`}
                                onChange={(e) => { onFormChange({ 
                                    caracteristicas_cabello_ojos: {
                                        ...state.caracteristicas_cabello_ojos,
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
                                value={`${state.caracteristicas_cabello_ojos.id_vello_facial}`}
                                onChange={(e) => { onFormChange({ 
                                    caracteristicas_cabello_ojos: {
                                        ...state.caracteristicas_cabello_ojos,
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
                                value={`${state.caracteristicas_cabello_ojos.id_color_ojos}`}
                                onChange={(e) => { onFormChange({ 
                                    caracteristicas_cabello_ojos: {
                                        ...state.caracteristicas_cabello_ojos,
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
                                value={''}
                                onChange={(e) => { onFormChange({ nombre: e.currentTarget.value }) }}
                                label=''
                            />
                        </MContainer>

                        <MContainer direction='horizontal' styles={{ alignItems: 'center' }}>
                            <Typography>¿Dispuesto a cambiar corte?</Typography>
                            <MRadioGroup
                                id="dispuesto-cambiar-corte"
                                options={['si', 'no']}
                                labelStyle={{ marginLeft: 112, fontWeight: 800, fontSize: '0.8rem', color: '#4ab7c6' }}
                                value={''}
                                onChange={(e) => { onFormChange({ nombre: e.currentTarget.value }) }}
                                label=''
                            />
                        </MContainer>

                        <MContainer direction='horizontal' styles={{ alignItems: 'center' }}>
                            <Typography>¿Dispuesto a crecer o afeitar?</Typography>
                            <MRadioGroup
                                id="dispuesto-cambiar-corte"
                                options={['si', 'no']}
                                labelStyle={{ marginLeft: 112, fontWeight: 800, fontSize: '0.8rem', color: '#4ab7c6' }}
                                value={''}
                                onChange={(e) => { onFormChange({ nombre: e.currentTarget.value }) }}
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
                        value={''}
                        onChange={(e) => { onFormChange({ nombre: e.currentTarget.value }) }}
                        label=''
                    />

                    <MContainer direction='horizontal' styles={{ alignItems: 'center', gap: 20 }}>
                        <Typography>Visibilidad:</Typography>
                        <MSelect
                            id='visibilidad-tatuaje'
                            options={[]}
                            style={{ width: 250 }}
                            value={''} onChange={(e) => { onFormChange({ nombre: e.target.value }) }}
                        />
                    </MContainer>

                    <MContainer direction='horizontal' styles={{ alignItems: 'center', gap: 20 }}>
                        <Typography>Descripción:</Typography>
                        <FormGroup
                            rootStyle={{ margin: 0 }}
                            className={classes['form-input-md']}
                            labelClassName={classes['form-input-label']}
                            value={''}
                            onChange={(e) => { onFormChange({ nombre: e.currentTarget.value }) }}
                        />
                    </MContainer>
                    <AddButton text='Agregar otro' onClick={() => { console.log('click'); }} />
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
                        value={''}
                        onChange={(e) => { onFormChange({ nombre: e.currentTarget.value }) }}
                        label=''
                    />
                    <MContainer direction='horizontal' styles={{ gap: 40, alignItems: 'center' }}>
                        <Typography>Lugar:</Typography>
                        <MCheckboxGroup
                            direction='horizontal'

                            onChange={(e) => {
                                //onFormChange({ mostrar_anio_en_perfil: e.currentTarget.checked })
                            }}
                            id="disponibilidad-para-checkboxgroup"
                            labelStyle={{ marginBottom: 0, width: '32%' }}
                            labelClassName={classes['label-black-md']}
                            options={[
                                'Piercing Facial', 'Piercing en Cuerpo', 'Medidores de Oreja'
                            ]}
                            values={[false]}//[(state) ? state.mostrar_anio_en_perfil : false]}
                        />
                    </MContainer>

                    <MContainer direction='horizontal' styles={{ gap: 40, alignItems: 'center' }}>
                        <Typography>Descripción:</Typography>
                        <FormGroup
                            className={classes['form-input-md']}
                            labelClassName={classes['form-input-label']}
                            value={''}
                            rootStyle={{ margin: 0 }}
                            onChange={(e) => { onFormChange({ nombre: e.currentTarget.value }) }}
                        />
                    </MContainer>

                    <AddButton text='Agregar otro' onClick={() => { console.log('click'); }} />
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
                            value={''}
                            onChange={(e) => { onFormChange({ nombre: e.currentTarget.value }) }}
                            label=''
                        />
                    </MContainer>
                    <MContainer direction='horizontal' styles={{ alignItems: 'center' }}>
                        <MRadioGroup
                            id="especificacion-gemelo-trillizo"
                            options={['Ninguno', 'Gemelo Idéntico', 'Trillizos Idénticos', 'Otro']}
                            labelStyle={{ marginLeft: 112, fontWeight: 800, fontSize: '0.8rem', color: '#4ab7c6' }}
                            value={''}
                            onChange={(e) => { onFormChange({ nombre: e.currentTarget.value }) }}
                            label=''
                        />
                        <FormGroup
                            className={classes['form-input-md']}
                            labelClassName={classes['form-input-label']}
                            value={''}
                            rootStyle={{ margin: 0 }}
                            onChange={(e) => { onFormChange({ nombre: e.currentTarget.value }) }}
                        />
                    </MContainer>
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
