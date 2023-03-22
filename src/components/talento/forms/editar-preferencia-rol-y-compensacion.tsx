import { type FC } from 'react'
import { motion } from 'framer-motion'
import { FormGroup } from '~/components';
import { Alert, Divider, Grid, Typography } from '@mui/material';
import classes from './talento-forms.module.css';
import { MContainer } from '~/components/layout/MContainer';
import DragNDrop from '~/components/shared/DragNDrop/DragNDrop';
import Image from 'next/image';
import { MCheckboxGroup, MSelect, MRadioGroup, AddButton } from '~/components/shared';

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

export const EditarPreferenciaRolYCompensacionTalento: FC<Props> = ({ onFormChange, state }) => {

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Alert severity="info">Te recomendamos no cerrarte a un solo tipo de rol para tener más oportunidades de ser seleccionado.</Alert>
            </Grid>
            <Grid item xs={12}>
                <MCheckboxGroup
                    onAllOptionChecked={() => {
                        console.log('xd');
                    }}
                    direction='vertical'
                    title="Tipo de trabajo"
                    onChange={(e) => {
                        //onFormChange({ mostrar_anio_en_perfil: e.currentTarget.checked })
                    }}
                    id="mostrar-anio-perfil"
                    labelStyle={{ marginBottom: 0 }}
                    labelClassName={classes['label-black-md']}
                    options={['Actuación', 'Danza', 'Modelaje', 'Narración', 'Trabajo de doble/alto riesgo']}
                    values={[false]}//[(state) ? state.mostrar_anio_en_perfil : false]}
                />
            </Grid>
            <Grid my={4} item xs={12}>
                <Divider />
            </Grid>
            <Grid item xs={12}>
                <MContainer direction='vertical'>
                    <MContainer direction='horizontal'>
                        <Typography fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                            ¿Estás interesado en trabajo de extra?
                        </Typography>
                    </MContainer>
                    <Typography fontSize={'0.9rem'} fontWeight={700} style={{ color: '#4ab7c6' }} component={'p'}>
                        Si indicas interés en trabajar como extra, aparecerás en la búsqueda de extras del Director
                    </Typography>
                    <MRadioGroup
                        id="interesado-trabajo-extra"
                        options={['si', 'no']}
                        labelStyle={{ marginLeft: 112, fontWeight: 800, fontSize: '0.8rem', color: '#4ab7c6' }}
                        value={state.nombre}
                        onChange={(e) => { onFormChange({ nombre: e.currentTarget.value }) }}
                        label='' />
                </MContainer>
            </Grid>
            <Grid my={4} item xs={12}>
                <Divider />
            </Grid>
            <Grid item xs={12}>
                <MCheckboxGroup
                    direction='vertical'
                    title="Interés en proyectos"
                    onChange={(e) => {
                        //onFormChange({ mostrar_anio_en_perfil: e.currentTarget.checked })
                    }}
                    id="mostrar-anio-perfil"
                    labelStyle={{ marginBottom: 0 }}
                    labelClassName={classes['label-black-md']}
                    options={['Pagados', 'No pagados']}
                    values={[false]}//[(state) ? state.mostrar_anio_en_perfil : false]}
                />
            </Grid>
            <Grid my={4} item xs={12}>
                <Divider />
            </Grid>

            <Grid item xs={12}>
                <MContainer direction='vertical'>

                    <MContainer direction='horizontal'>
                        <Typography fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                            Locación de Trabajo Principal + Adicionales
                        </Typography>
                    </MContainer>

                    <MContainer direction='horizontal' styles={{ gap: 40 }}>
                        <MContainer direction='vertical'>
                            <MSelect
                                id='locacion-principal-select'
                                options={[]}
                                style={{ width: 250 }}
                                value={state.nombre} onChange={(e) => { onFormChange({ nombre: e.target.value }) }}
                                label='Principal'
                            />
                        </MContainer>

                        <MContainer direction='vertical'>
                            <MSelect
                                id='locacion-principal-select'
                                options={[]}
                                style={{ width: 250 }}
                                value={state.nombre} onChange={(e) => { onFormChange({ nombre: e.target.value }) }}
                                label='Adicional'
                            />
                            <AddButton text='Agregar otra localizacion' onClick={() => { console.log('hola') }} />
                        </MContainer>
                    </MContainer>


                </MContainer>
            </Grid>

            <Grid my={4} item xs={12}>
                <Divider />
            </Grid>

            <Grid item xs={12}>
                <MContainer direction='vertical'>

                    <Typography fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                        Agencia/Representante
                    </Typography>

                    <MRadioGroup
                        id="agencia-representante"
                        options={['si', 'no']}
                        labelStyle={{ marginLeft: 112, fontWeight: 800, fontSize: '0.8rem', color: '#4ab7c6' }}
                        value={state.nombre}
                        onChange={(e) => { onFormChange({ nombre: e.currentTarget.value }) }}
                        label=''
                    />

                    <MContainer direction='horizontal' styles={{ gap: 40 }}>
                        <FormGroup
                            className={classes['form-input-md']}
                            labelClassName={classes['form-input-label']}
                            value={''}
                            onChange={(e) => { onFormChange({ nombre: e.currentTarget.value }) }}
                            label='Nombre'
                        />

                        <FormGroup
                            className={classes['form-input-md']}
                            labelClassName={classes['form-input-label']}
                            value={''}
                            onChange={(e) => { onFormChange({ nombre: e.currentTarget.value }) }}
                            label='Contacto'
                        />
                    </MContainer>

                </MContainer>
            </Grid>

            <Grid my={4} item xs={12}>
                <Divider />
            </Grid>

            <Grid item xs={12}>
                <MContainer direction='vertical'>
                    <Typography fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                        Documentos
                    </Typography>

                    <MCheckboxGroup
                        direction='vertical'
                        title="¿Qué documentos oficiales y licencias tienes?"
                        onChange={(e) => {
                            //onFormChange({ mostrar_anio_en_perfil: e.currentTarget.checked })
                        }}
                        id="mostrar-anio-perfil"
                        labelStyle={{ marginBottom: 0 }}
                        labelClassName={classes['label-black-md']}
                        options={[
                            'Pasaporte Vigente', 'Licencia de conducir vigente', 'Identificacion vigente',
                            'Primeros Auxilios', 'CPR (resucitación cardiopulmonar)', 'Otro'
                        ]}
                        values={[false]}//[(state) ? state.mostrar_anio_en_perfil : false]}
                    />

                </MContainer>
            </Grid>

            <Grid my={4} item xs={12}>
                <Divider />
            </Grid>

            <Grid item xs={12}>
                <MContainer direction='vertical'>
                    <Typography fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                        Disponibilidad para
                    </Typography>

                    <MCheckboxGroup
                        direction='horizontal'
                        title="¿Qué documentos oficiales y licencias tienes?"
                        onChange={(e) => {
                            //onFormChange({ mostrar_anio_en_perfil: e.currentTarget.checked })
                        }}
                        id="disponibilidad-para-checkboxgroup"
                        labelStyle={{ marginBottom: 0, width: '32%' }}
                        labelClassName={classes['label-black-md']}
                        options={[
                            'Aparecer en Ropa Interior/Traje de Baño', 'Comer Carne', 'Cortarse el cabello',
                            'Dejarse crecer o afeitar vello facial', 'Aparecer desnudo', 'Escena de Beso',
                            'Fumar', 'Pintar Cabello', 'Aparecer semi-desnudo', 'Situación Sexual (Escena)',
                            'Trabajar con Gatos', 'Trabajar con Perros'
                        ]}
                        values={[false]}//[(state) ? state.mostrar_anio_en_perfil : false]}
                    />
                </MContainer>
            </Grid>

            <Grid my={4} item xs={12}>
                <Divider />
            </Grid>

            <Grid item xs={12}>
                <Typography fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                    Otras profesiones
                </Typography>
                <FormGroup
                    className={classes['form-input-md']}
                    labelClassName={classes['form-input-label']}
                    value={''}
                    onChange={(e) => { onFormChange({ nombre: e.currentTarget.value }) }}
                />
                <AddButton text='Agregar otra' onClick={() => { console.log('hola'); }} />
            </Grid>

            <Grid my={4} item xs={12}>
                <Divider />
            </Grid>

            <Grid item xs={12}>
                <MContainer direction='horizontal'>
                    <MContainer direction='horizontal' styles={{ alignItems: 'center', gap: 40 }}>
                        <Typography fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                            Embarazo
                        </Typography>
                        <MRadioGroup
                            id="embarazo-radio"
                            options={['si', 'no']}
                            labelStyle={{ marginLeft: 112, fontWeight: 800, fontSize: '0.8rem', color: '#4ab7c6' }}
                            value={state.nombre}
                            onChange={(e) => { onFormChange({ nombre: e.currentTarget.value }) }}
                            label=''
                        />

                        <MContainer direction='horizontal'>
                            <Typography>Meses</Typography>
                            <FormGroup
                                rootStyle={{ margin: 0 }}
                                style={{ margin: '0px 0px 0px 10px' }}
                                className={classes['form-input-md']}
                                labelClassName={classes['form-input-label']}
                                value={''}
                                onChange={(e) => { onFormChange({ nombre: e.currentTarget.value }) }}
                            />
                        </MContainer>

                    </MContainer>

                </MContainer>
            </Grid>

        </Grid>
    )
}
