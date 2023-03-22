import { type FC } from 'react'
import { motion } from 'framer-motion'
import { AddButton, FormGroup, MCheckboxGroup, MRadioGroup, MSelect } from '~/components';
import { Alert, Divider, Grid, Typography } from '@mui/material';
import { MContainer } from '~/components/layout/MContainer';
import classes from './talento-forms.module.css';


interface Props {
    state: {
        nombre: string,
        apellido: string,
        usuario: string,
        email: string,
        contrasenia: string,
        confirmacion_contrasenia: string
    },
    onFormChange: (input: { [id: string]: (string | number) }) => void;
}

export const EditarFiltrosAparenciasTalento: FC<Props> = ({ onFormChange, state }) => {

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
                            value={''}
                            onChange={(e) => { onFormChange({ nombre: e.currentTarget.value }) }}
                        />
                        <Typography>a</Typography>
                        <FormGroup
                            className={classes['form-input-md']}
                            labelClassName={classes['form-input-label']}
                            value={''}
                            onChange={(e) => { onFormChange({ nombre: e.currentTarget.value }) }}
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
                        value={''}
                        onChange={(e) => { onFormChange({ nombre: e.currentTarget.value }) }}
                    />

                    <MCheckboxGroup
                        onAllOptionChecked={() => {
                            console.log('xd');
                        }}
                        direction='horizontal'
                        title="Tipo de trabajo"
                        onChange={(e) => {
                            //onFormChange({ mostrar_anio_en_perfil: e.currentTarget.checked })
                        }}
                        id="mostrar-anio-perfil"
                        labelStyle={{ marginBottom: 0, width: '32%' }}
                        labelClassName={classes['label-black-md']}
                        options={['Hombre', 'Persona no-binaria', 'Mujer trans', 'Mujer', 'Hombre trans']}
                        values={[false]}//[(state) ? state.mostrar_anio_en_perfil : false]}
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
                    value={''}
                    onChange={(e) => { onFormChange({ nombre: e.currentTarget.value }) }}
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
                                id='color-cabello'
                                options={[]}
                                style={{ width: 250 }}
                                value={state.nombre} onChange={(e) => { onFormChange({ nombre: e.target.value }) }}
                            />
                        </MContainer>

                        <MContainer direction='horizontal' styles={{ gap: 10, alignItems: 'center' }}>
                            <Typography>Estilo de Cabello</Typography>
                            <MSelect
                                id='estilo-cabello-hombre'
                                options={[]}
                                style={{ width: 250 }}
                                value={state.nombre} onChange={(e) => { onFormChange({ nombre: e.target.value }) }}
                            />
                            {/**Posible condicional */}
                            {/* <MSelect
                                id='estilo-cabello-mujer'
                                options={[]}
                                style={{ width: 250 }}
                                value={state.nombre} onChange={(e) => { onFormChange({ nombre: e.target.value }) }}
                            /> */}
                        </MContainer>

                        <MContainer direction='horizontal' styles={{ gap: 10, alignItems: 'center' }}>
                            <Typography>Vello Facial</Typography>
                            <MSelect
                                id='vello-facial'
                                options={[]}
                                style={{ width: 250 }}
                                value={state.nombre} onChange={(e) => { onFormChange({ nombre: e.target.value }) }}
                            />
                        </MContainer>

                        <MContainer direction='horizontal' styles={{ gap: 10, alignItems: 'center' }}>
                            <Typography>Color de ojos</Typography>
                            <MSelect
                                id='vello-facial'
                                options={[]}
                                style={{ width: 250 }}
                                value={state.nombre} onChange={(e) => { onFormChange({ nombre: e.target.value }) }}
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
                                value={state.nombre}
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
                                value={state.nombre}
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
                                value={state.nombre}
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
                        value={state.nombre}
                        onChange={(e) => { onFormChange({ nombre: e.currentTarget.value }) }}
                        label=''
                    />

                    <MContainer direction='horizontal' styles={{ alignItems: 'center', gap: 20 }}>
                        <Typography>Visibilidad:</Typography>
                        <MSelect
                            id='visibilidad-tatuaje'
                            options={[]}
                            style={{ width: 250 }}
                            value={state.nombre} onChange={(e) => { onFormChange({ nombre: e.target.value }) }}
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
                        value={state.nombre}
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
                            value={state.nombre}
                            onChange={(e) => { onFormChange({ nombre: e.currentTarget.value }) }}
                            label=''
                        />
                    </MContainer>
                    <MContainer direction='horizontal' styles={{ alignItems: 'center' }}>
                        <MRadioGroup
                            id="especificacion-gemelo-trillizo"
                            options={['Ninguno', 'Gemelo Idéntico', 'Trillizos Idénticos', 'Otro']}
                            labelStyle={{ marginLeft: 112, fontWeight: 800, fontSize: '0.8rem', color: '#4ab7c6' }}
                            value={state.nombre}
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
