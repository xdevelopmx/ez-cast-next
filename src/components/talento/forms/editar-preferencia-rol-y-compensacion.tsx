import { type FC } from 'react'
import { motion } from 'framer-motion'
import { FormGroup } from '~/components';
import { Alert, Divider, Grid, Typography } from '@mui/material';
import classes from './talento-forms.module.css';
import { MContainer } from '~/components/layout/MContainer';
import DragNDrop from '~/components/shared/DragNDrop/DragNDrop';
import { MRadioGroup } from '~/components/shared/MRadioGroup';
import { MSelect } from '~/components/shared/MSelect';
import Image from 'next/image';
import { MCheckboxGroup } from '~/components/shared/MCheckboxGroup';

interface Props {
    state: {
        nombre: string,
        apellido: string,
        usuario: string,
        email: string,
        contrasenia: string,
        confirmacion_contrasenia: string
    },
    onFormChange: (input: {[id: string]: (string | number)}) => void;
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
                    labelStyle={{marginBottom: 0}}
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
                    <Typography fontSize={'0.9rem'} fontWeight={700} style={{color: '#4ab7c6'}} component={'p'}>
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
                    labelStyle={{marginBottom: 0}}
                    labelClassName={classes['label-black-md']} 
                    options={['Pagados', 'No pagados']}
                    values={[false]}//[(state) ? state.mostrar_anio_en_perfil : false]}
                />
            </Grid>
            <Grid my={4} item xs={12}>
                <Divider />    
            </Grid>
        </Grid>
    )
}
