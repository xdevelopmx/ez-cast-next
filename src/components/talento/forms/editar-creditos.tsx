import { type FC } from 'react';
import Image from 'next/image';
import { FormGroup } from '~/components';
import { MContainer } from '~/components/layout/MContainer';
import { Button, Grid, IconButton, Typography } from '@mui/material';
import classes from './talento-forms.module.css';
import { MSelect } from '~/components/shared/MSelect';
import { MCheckboxGroup } from '~/components/shared/MCheckboxGroup';
import { MTable } from '~/components/shared/MTable/MTable';
import { type TalentoFormCreditos } from '~/pages/talento/editar-perfil';
import { Delete, Star } from '@mui/icons-material';
import { api } from '~/utils/api';

interface Props {
    state: TalentoFormCreditos,
    onFormChange: (input: { [id: string]: unknown }) => void;
}

const CURRENT_YEAR = new Date().getFullYear();

const YEARS = Array.from({ length: 100 }).map((value: unknown, i: number) => { 
    return {value: (CURRENT_YEAR - i).toString(), label: (CURRENT_YEAR - i).toString()}
}).sort((a, b) => parseInt(b.value) - parseInt(a.value));

export const EditarCreditosTalento: FC<Props> = ({ onFormChange, state }) => {
    const tipo_proyecto = api.catalogos.getTipoProyectos.useQuery();
    return (
        <Grid container spacing={2}>
            <Grid item xs={12} my={2}>
                <Typography fontSize={'1.6rem'} fontWeight={600} component={'p'}>
                    Añadir Crédito
                </Typography>
            </Grid>
            <Grid item mr={4} xs={12} md={4} lg={2}>
                <MSelect 
                    id="tipo-proyecto-select"
                    loading={tipo_proyecto.isFetching}
                    options={(tipo_proyecto.data) ? tipo_proyecto.data.map(tipo => { return {value: tipo.id.toString(), label: tipo.es} }) : []}
                    style={{ width: '200px' }} 
                    value={state.tipo_proyecto.toString()}
                    onChange={(e) => { 
                        onFormChange({ tipo_proyecto: parseInt(e.target.value)}) 
                    }} 
                    label='Tipo Proyecto' 
                />
            </Grid>
            <Grid item mr={4} xs={12} md={4} lg={2}>
                <FormGroup className={classes['form-input-md']} labelClassName={classes['form-input-label']} value={(state) ? state.titulo : ''} onChange={(e) => { onFormChange({ titulo: e.currentTarget.value }) }} label='Título' />
            </Grid>
            <Grid item mr={4} xs={12} md={4} lg={2}>
                <MSelect 
                    id="tipo-rol-select"
                    options={[{value: 'PRINCIPAL', label: 'PRINCIPAL'}, {value: 'EXTRA', label: 'EXTRA'}]}
                    style={{ width: '200px' }} 
                    value={state.rol}
                    onChange={(e) => { 
                        onFormChange({ rol: e.target.value}) 
                    }} 
                    label='Rol' 
                />
            </Grid>
            <Grid item mr={4} xs={12} md={4} lg={2}>
                <FormGroup className={classes['form-input-md']} labelClassName={classes['form-input-label']} value={(state) ? state.director : ''} onChange={(e) => { onFormChange({ director: e.currentTarget.value }) }} label='Director' />
            </Grid>
            <Grid item mr={4} xs={12} md={4} lg={2}>
                <MContainer direction='vertical'>
                    <MSelect 
                        id="edad-select"
                        className={classes['form-input-md']} 
                        options={YEARS}
                        style={{ width: 164, marginBottom: 8 }} 
                        value={(state) ? state.anio.toString() : ''} 
                        onChange={(e) => { onFormChange({ anio: parseInt(e.target.value) }) }} 
                        label='Año' 
                    />
                    <a onClick={() => {
                        if (state) {
                            if (state.tipo_proyecto > 0 && state.titulo.length > 0 && state.rol.length > 0 && state.director.length > 0 && state.anio > 0 ) {
                                onFormChange({ creditos: state.creditos.concat([{
                                    id: state.creditos.length + 1,
                                    id_catalogo_proyecto: state.tipo_proyecto,
                                    titulo: state.titulo,
                                    rol: state.rol,
                                    director: state.director,
                                    anio: state.anio,
                                    destacado: false,
                                    clip_url: ''
                                }]) })
                            } else {
                                console.error('NO SE HAN LLENADO LOS CAMPOS');
                            }

                        }
                    }} style={{ padding: 4, fontWeight: 800, color: '#4ab7c6' }} className="btn  btn-social mr-1 ml-1"><Image width={16} height={16} className="mr-2" src="/assets/img/iconos/cruz_blue.svg" alt="Boton de agregar credito"/>Guardar crédito</a>
                </MContainer>
            </Grid>
            <Grid item xs={12} xl={4} my={2}>
                <MContainer direction='vertical'>
                    <Typography my={2} fontSize={'1.6rem'} fontWeight={600} component={'p'}>
                        Tus Créditos
                    </Typography>
                    <MCheckboxGroup 
                        onChange={(e) => {
                            onFormChange({ mostrar_anio_en_perfil: e })
                        }} 
                        id="mostrar-anio-perfil" 
                        labelClassName={classes['label-black-lg']} 
                        options={['Mostrar Año en Perfil']}
                        values={[(state) ? state.mostrar_anio_en_perfil : false]}
                    />
                </MContainer>
            </Grid>
            <Grid item xs={12} mb={8}>
                <MTable 
                    headerClassName='GrayHeader' 
                    columnsHeader={[
                        <Typography key={1} fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                            Título
                        </Typography>,
                        <Typography key={2} fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                            Rol
                        </Typography>,
                        <Typography key={3} fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                            Director
                        </Typography>,
                        <Typography key={4} fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                            Año
                        </Typography>,
                        <Typography key={5} fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                            Crédito destacado
                        </Typography>,
                        <Typography key={6} fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                            Clip
                        </Typography>,
                        <Typography key={7} fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                            Acciones
                        </Typography>
                    ]} 
                    data={(state) ? state.creditos.map((credito) => {
                        return {
                            titulo: credito.titulo, 
                            rol: credito.rol, 
                            director: credito.director, 
                            anio: credito.anio, 
                            credito: <IconButton 
                                style={{color: (credito.destacado) ? 'gold' : 'gray'}} 
                                aria-label="marcar como"
                                onClick={() => {
                                    onFormChange({ creditos: state.creditos.map(c => {
                                        if (c.id === credito.id) {
                                            c.destacado = !credito.destacado;
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
                    }) : []}
                />
            </Grid>    
        </Grid>
    )
}
