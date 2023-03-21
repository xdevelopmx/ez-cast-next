import { type FC } from 'react'
import { motion } from 'framer-motion'
import { FormGroup } from '~/components';
import { Divider, Grid, Typography } from '@mui/material';
import { MContainer } from '~/components/layout/MContainer';
import DragNDrop from '~/components/shared/DragNDrop/DragNDrop';
import { MRadioGroup } from '~/components/shared/MRadioGroup';
import { MSelect } from '~/components/shared/MSelect';
import Image from 'next/image';
import classes from './talento-forms.module.css';
import { MCheckboxGroup } from '~/components/shared/MCheckboxGroup';
import { MTable } from '~/components/shared/MTable/MTable';

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

/*
    (state) ? state.creditos.map((credito) => {
                            return {
                                titulo: credito.titulo, 
                                rol: credito.rol, 
                                director: credito.director, 
                                anio: credito.anio, 
                                credito: <IconButton 
                                    style={{color: (credito.credito_destacado) ? 'gold' : 'gray'}} 
                                    aria-label="marcar como"
                                    onClick={() => {
                                        onFormChange({ creditos: state.creditos.map(c => {
                                            if (c.id === credito.id) {
                                                c.credito_destacado = !credito.credito_destacado;
                                            }
                                            return c;
                                        })})
                                    }}
                                    > 
                                    <Star /> 
                                </IconButton>, 
                                clip: <a onClick={() => {console.log('xdxdxddxddx 1')}} style={{ padding: 4, fontWeight: 800, color: '#4ab7c6' }} className="btn  btn-social mr-1 ml-1"><Image width={16} height={16} className="mr-2" src="/assets/img/iconos/cruz_blue.svg" alt="Boton de agregar credito"/>Añadir clip</a>,
                                acciones: <Button onClick={() => {
                                    onFormChange({ creditos: state.creditos.filter(c => c.id !== credito.id) })
                                }} variant="outlined" startIcon={<Delete />}> Quitar </Button>
                            }
                        }) : 

*/

export const EditarActivosTalento: FC<Props> = ({ onFormChange, state }) => {

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} md={3} lg={4}>
                <MContainer direction='vertical'>
                    <MCheckboxGroup 
                        onChange={(e) => {
                            //onFormChange({ mostrar_anio_en_perfil: e.currentTarget.checked })
                        }} 
                        id="mostrar-anio-perfil" 
                        labelClassName={classes['label-black-lg']} 
                        options={['Vehículos']}
                        values={[false]}//[(state) ? state.mostrar_anio_en_perfil : false]}
                    />
                    <MSelect 
                        id="tipo-vehiculo-select"
                        className={classes['form-input-md']} 
                        options={Array.from({ length: 100 }).map((value: unknown, i: number) => { return {value: (i + 1).toString(), label: (i + 1).toString()}})}
                        style={{ width: 250 }} 
                        value={state.nombre} onChange={(e) => { onFormChange({ nombre: e.target.value}) }} 
                        label='Tipo Vehiculo' 
                    />
                    <MSelect 
                        id="marca-vehiculo-select"
                        className={classes['form-input-md']} 
                        options={Array.from({ length: 100 }).map((value: unknown, i: number) => { return {value: (i + 1).toString(), label: (i + 1).toString()}})}
                        style={{ width: 250 }} 
                        value={state.nombre} onChange={(e) => { onFormChange({ nombre: e.target.value}) }} 
                        label='Marca' 
                    />
                    <MSelect 
                        id="modelo-vehiculo-select"
                        className={classes['form-input-md']} 
                        options={Array.from({ length: 100 }).map((value: unknown, i: number) => { return {value: (i + 1).toString(), label: (i + 1).toString()}})}
                        style={{ width: 250 }} 
                        value={state.nombre} onChange={(e) => { onFormChange({ nombre: e.target.value}) }} 
                        label='Modelo' 
                    />
                    <MSelect 
                        id="color-vehiculo-select"
                        className={classes['form-input-md']} 
                        options={Array.from({ length: 100 }).map((value: unknown, i: number) => { return {value: (i + 1).toString(), label: (i + 1).toString()}})}
                        style={{ width: 250 }} 
                        value={state.nombre} onChange={(e) => { onFormChange({ nombre: e.target.value}) }} 
                        label='Color' 
                    />
                    <MSelect 
                        id="anio-vehiculo-select"
                        className={classes['form-input-md']} 
                        options={Array.from({ length: 100 }).map((value: unknown, i: number) => { return {value: (i + 1).toString(), label: (i + 1).toString()}})}
                        style={{ width: 100 }} 
                        value={state.nombre} onChange={(e) => { onFormChange({ nombre: e.target.value}) }} 
                        label='Año' 
                    />
                    <a onClick={() => {
                        console.log('hola')
                    }} style={{ marginTop: 16, padding: 4, fontWeight: 800, color: '#4ab7c6' }} className="btn  btn-social mr-1 ml-1"><Image width={16} height={16} className="mr-2" src="/assets/img/iconos/cruz_blue.svg" alt="Boton de agregar credito"/>Agregar Vehículo</a>
                </MContainer>
            </Grid>
            <Grid item xs={12} md={9} lg={8}>
                <MContainer direction='vertical'>
                    <Divider style={{marginTop: 32}} />
                    <MTable 
                        columnsHeader={[
                            <Typography key={1} fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                                Vehiculo
                            </Typography>,
                            <Typography key={2} fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                                Marca
                            </Typography>,
                            <Typography key={3} fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                                Modelo
                            </Typography>,
                            <Typography key={5} fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                                Color
                            </Typography>,
                            <Typography key={4} fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                                Año
                            </Typography>,
                        ]} 
                        data={[]}
                    />
                </MContainer>
            </Grid>
            <Grid my={4} item xs={12}>
                <Divider />    
            </Grid>
            <Grid item xs={12} md={3} lg={4}>
                <MContainer direction='vertical'>
                    <MCheckboxGroup 
                        onChange={(e) => {
                            //onFormChange({ mostrar_anio_en_perfil: e.currentTarget.checked })
                        }} 
                        id="mostrar-anio-perfil" 
                        labelClassName={classes['label-black-lg']} 
                        options={['Mascotas']}
                        values={[false]}//[(state) ? state.mostrar_anio_en_perfil : false]}
                    />
                    <MSelect 
                        id="tipo-mascota-select"
                        className={classes['form-input-md']} 
                        options={Array.from({ length: 100 }).map((value: unknown, i: number) => { return {value: (i + 1).toString(), label: (i + 1).toString()}})}
                        style={{ width: 250 }} 
                        value={state.nombre} onChange={(e) => { onFormChange({ nombre: e.target.value}) }} 
                        label='Tipo Mascota' 
                    />
                    <MSelect 
                        id="raza-mascota-select"
                        className={classes['form-input-md']} 
                        options={Array.from({ length: 100 }).map((value: unknown, i: number) => { return {value: (i + 1).toString(), label: (i + 1).toString()}})}
                        style={{ width: 250 }} 
                        value={state.nombre} onChange={(e) => { onFormChange({ nombre: e.target.value}) }} 
                        label='Raza' 
                    />
                    <MSelect 
                        id="tamanio-mascota-select"
                        className={classes['form-input-md']} 
                        options={Array.from({ length: 100 }).map((value: unknown, i: number) => { return {value: (i + 1).toString(), label: (i + 1).toString()}})}
                        style={{ width: 100 }} 
                        value={state.nombre} onChange={(e) => { onFormChange({ nombre: e.target.value}) }} 
                        label='Tamaño' 
                    />
                    <a onClick={() => {
                        console.log('hola')
                    }} style={{ marginTop: 16, padding: 4, fontWeight: 800, color: '#4ab7c6' }} className="btn  btn-social mr-1 ml-1"><Image width={16} height={16} className="mr-2" src="/assets/img/iconos/cruz_blue.svg" alt="Boton de agregar credito"/>Agregar Mascota</a>
                </MContainer>
            </Grid>
            <Grid item xs={12} md={9} lg={8}>
                <MContainer direction='vertical'>
                    <Divider style={{marginTop: 32}} />
                    <MTable 
                        columnsHeader={[
                            <Typography key={1} fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                                Mascota
                            </Typography>,
                            <Typography key={2} fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                                Raza
                            </Typography>,
                            <Typography key={3} fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                                Tamaño
                            </Typography>,
                        ]} 
                        data={[]}
                    />
                </MContainer>
            </Grid>
            <Grid my={4} item xs={12}>
                <Divider />    
            </Grid>
            <Grid item xs={12} md={3} lg={4}>
                <MContainer direction='vertical'>
                    <MCheckboxGroup 
                        onChange={(e) => {
                            //onFormChange({ mostrar_anio_en_perfil: e.currentTarget.checked })
                        }} 
                        id="mostrar-anio-perfil" 
                        labelClassName={classes['label-black-lg']} 
                        options={['Vestuario']}
                        values={[false]}//[(state) ? state.mostrar_anio_en_perfil : false]}
                    />
                    <MSelect 
                        id="tipo-vestuario-select"
                        className={classes['form-input-md']} 
                        options={Array.from({ length: 100 }).map((value: unknown, i: number) => { return {value: (i + 1).toString(), label: (i + 1).toString()}})}
                        style={{ width: 250 }} 
                        value={state.nombre} onChange={(e) => { onFormChange({ nombre: e.target.value}) }} 
                        label='Tipo Vestuario' 
                    />
                    <FormGroup className={classes['form-input-md']} labelClassName={classes['form-input-label']} value={''} onChange={(e) => { onFormChange({ director: e.currentTarget.value }) }} label='Descripcion' />
                    <a onClick={() => {
                        console.log('hola')
                    }} style={{ marginTop: 16, padding: 4, fontWeight: 800, color: '#4ab7c6' }} className="btn  btn-social mr-1 ml-1"><Image width={16} height={16} className="mr-2" src="/assets/img/iconos/cruz_blue.svg" alt="Boton de agregar credito"/>Agregar Vestuario</a>
                </MContainer>
            </Grid>
            <Grid item xs={12} md={9} lg={8}>
                <MContainer direction='vertical'>
                    <Divider style={{marginTop: 32}} />
                    <MTable 
                        columnsHeader={[
                            <Typography key={1} fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                                Tipo Vestuario
                            </Typography>,
                            <Typography key={2} fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                                Descripcion
                            </Typography>,
                        ]} 
                        data={[]}
                    />
                </MContainer>
            </Grid>
            <Grid my={4} item xs={12}>
                <Divider />    
            </Grid>
            <Grid item xs={12} md={3} lg={4}>
                <MContainer direction='vertical'>
                    <MCheckboxGroup 
                        onChange={(e) => {
                            //onFormChange({ mostrar_anio_en_perfil: e.currentTarget.checked })
                        }} 
                        id="mostrar-anio-perfil" 
                        labelClassName={classes['label-black-lg']} 
                        options={['Props']}
                        values={[false]}//[(state) ? state.mostrar_anio_en_perfil : false]}
                    />
                    <MSelect 
                        id="tipo-prop-select"
                        className={classes['form-input-md']} 
                        options={Array.from({ length: 100 }).map((value: unknown, i: number) => { return {value: (i + 1).toString(), label: (i + 1).toString()}})}
                        style={{ width: 250 }} 
                        value={state.nombre} onChange={(e) => { onFormChange({ nombre: e.target.value}) }} 
                        label='Tipo Prop' 
                    />
                    <FormGroup className={classes['form-input-md']} labelClassName={classes['form-input-label']} value={''} onChange={(e) => { onFormChange({ director: e.currentTarget.value }) }} label='Descripcion' />
                    <a onClick={() => {
                        console.log('hola')
                    }} style={{ marginTop: 16, padding: 4, fontWeight: 800, color: '#4ab7c6' }} className="btn  btn-social mr-1 ml-1"><Image width={16} height={16} className="mr-2" src="/assets/img/iconos/cruz_blue.svg" alt="Boton de agregar credito"/>Agregar Vehículo</a>
                </MContainer>
            </Grid>
            <Grid item xs={12} md={9} lg={8}>
                <MContainer direction='vertical'>
                    <Divider style={{marginTop: 32}} />
                    <MTable 
                        columnsHeader={[
                            <Typography key={1} fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                                Tipo Prop
                            </Typography>,
                            <Typography key={2} fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                                Descripcion
                            </Typography>,
                        ]} 
                        data={[]}
                    />
                </MContainer>
            </Grid>
            <Grid my={4} item xs={12}>
                <Divider />    
            </Grid>
            <Grid item xs={12} md={3} lg={4}>
                <MContainer direction='vertical'>
                    <MCheckboxGroup 
                        onChange={(e) => {
                            //onFormChange({ mostrar_anio_en_perfil: e.currentTarget.checked })
                        }} 
                        id="mostrar-anio-perfil" 
                        labelClassName={classes['label-black-lg']} 
                        options={['Equipo Deportivo']}
                        values={[false]}//[(state) ? state.mostrar_anio_en_perfil : false]}
                    />
                    <MSelect 
                        id="tipo-equipo-deportivo-select"
                        className={classes['form-input-md']} 
                        options={Array.from({ length: 100 }).map((value: unknown, i: number) => { return {value: (i + 1).toString(), label: (i + 1).toString()}})}
                        style={{ width: 250 }} 
                        value={state.nombre} onChange={(e) => { onFormChange({ nombre: e.target.value}) }} 
                        label='Tipo Equipo' 
                    />
                    <FormGroup className={classes['form-input-md']} labelClassName={classes['form-input-label']} value={''} onChange={(e) => { onFormChange({ director: e.currentTarget.value }) }} label='Descripcion' />
                    <a onClick={() => {
                        console.log('hola')
                    }} style={{ marginTop: 16, padding: 4, fontWeight: 800, color: '#4ab7c6' }} className="btn  btn-social mr-1 ml-1"><Image width={16} height={16} className="mr-2" src="/assets/img/iconos/cruz_blue.svg" alt="Boton de agregar credito"/>Agregar Vehículo</a>
                </MContainer>
            </Grid>
            <Grid item xs={12} md={9} lg={8}>
                <MContainer direction='vertical'>
                    <Divider style={{marginTop: 32}} />
                    <MTable 
                        columnsHeader={[
                            <Typography key={1} fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                                Tipo Equipo 
                            </Typography>,
                            <Typography key={2} fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                                Descripcion
                            </Typography>,
                        ]} 
                        data={[]}
                    />
                </MContainer>
            </Grid>
        </Grid>
    )
}
