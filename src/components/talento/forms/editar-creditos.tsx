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
import { Close, Delete, Star } from '@mui/icons-material';
import { api } from '~/utils/api';
import useNotify from '~/hooks/useNotify';
import { MTooltip } from '~/components/shared/MTooltip';

interface Props {
    state: TalentoFormCreditos,
    onFormChange: (input: { [id: string]: unknown }) => void;
}

const CURRENT_YEAR = new Date().getFullYear();

const YEARS = Array.from({ length: 100 }).map((value: unknown, i: number) => {
    return { value: (CURRENT_YEAR - i).toString(), label: (CURRENT_YEAR - i).toString() }
}).sort((a, b) => parseInt(b.value) - parseInt(a.value));

export const EditarCreditosTalento: FC<Props> = ({ onFormChange, state }) => {
    const tipo_proyecto = api.catalogos.getTipoProyectos.useQuery();
    const { notify } = useNotify();
    return (
        <Grid container spacing={2}>
            <Grid item xs={12} my={2}>
                <Typography fontSize={'1.6rem'} fontWeight={600} component={'p'}>
                    Añadir Crédito
                </Typography>
            </Grid>

            <Grid item container xs={21} columns={22} gap={2} justifyContent={'space-between'}>
                <Grid item xs={20} md={4} lg={4}>
                    <MSelect
                        styleRoot={{ width: '100%' }}
                        id="tipo-proyecto-select"
                        loading={tipo_proyecto.isFetching}
                        options={(tipo_proyecto.data) ? tipo_proyecto.data.map(tipo => { return { value: tipo.id.toString(), label: tipo.es } }) : []}
                        value={state.tipo_proyecto.toString()}
                        onChange={(e) => {
                            onFormChange({ tipo_proyecto: parseInt(e.target.value) })
                        }}
                        label='Tipo Proyecto'
                    />
                </Grid>
                <Grid item xs={20} md={4} lg={4}>
                    <FormGroup style={{ width: '100%' }} className={classes['form-input-md']} labelClassName={classes['form-input-label']} value={(state) ? state.titulo : ''} onChange={(e) => { onFormChange({ titulo: e.currentTarget.value }) }} label='Título' />
                </Grid>
                <Grid item xs={20} md={4} lg={4}>
                    <MSelect
                        styleRoot={{ width: '100%' }}
                        id="tipo-rol-select"
                        options={[{ value: 'PRINCIPAL', label: 'PRINCIPAL' }, { value: 'EXTRA', label: 'EXTRA' }]}
                        value={state.rol}
                        onChange={(e) => {
                            onFormChange({ rol: e.target.value })
                        }}
                        label='Rol'
                    />
                </Grid>
                <Grid item xs={20} md={4} lg={4}>
                    <FormGroup style={{ width: '100%' }} className={classes['form-input-md']} labelClassName={classes['form-input-label']} value={(state) ? state.director : ''} onChange={(e) => { onFormChange({ director: e.currentTarget.value }) }} label='Director' />
                </Grid>
                <Grid item xs={20} md={4} lg={4}>
                    <MContainer direction='vertical'>
                        <MSelect
                            styleRoot={{ width: '100%' }}
                            id="edad-select"
                            //className={classes['form-input-md']}
                            options={YEARS}
                            style={{ marginBottom: 8 }}
                            value={(state) ? state.anio.toString() : ''}
                            onChange={(e) => { onFormChange({ anio: parseInt(e.target.value) }) }}
                            label='Año'
                        />
                    </MContainer>
                </Grid>
                <Grid item xs={22} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <a onClick={() => {
                        if (state) {
                            if (state.tipo_proyecto > 0 && state.titulo.length > 0 && state.rol.length > 0 && state.director.length > 0 && state.anio > 0) {
                                onFormChange({
                                    creditos: state.creditos.concat([{
                                        id: state.creditos.length + 1,
                                        id_catalogo_proyecto: state.tipo_proyecto,
                                        titulo: state.titulo,
                                        rol: state.rol,
                                        director: state.director,
                                        anio: state.anio,
                                        destacado: false,
                                        clip_url: ''
                                    }])
                                })
                            } else {
                                notify('warning', 'Por favor llena todos los campos antes de intentar agregar el credito');
                            }

                        }
                    }}
                        style={{ padding: '4px 6px', fontWeight: 800, color: '#069cb1' }}
                        className="btn  btn-social">
                        <Image width={16} height={16} style={{ marginRight: 7 }} src="/assets/img/iconos/cruz_blue.svg"
                            alt="Boton de agregar credito" />
                        Guardar crédito
                    </a>
                </Grid>
            </Grid>




            <Grid item xs={12} xl={12} my={2}>
                <MContainer direction='vertical'>
                    <Typography my={2} fontSize={'1.6rem'} fontWeight={600} component={'p'}>
                        Tus Créditos
                    </Typography>
                    <MCheckboxGroup
                        onChange={(e) => {
                            onFormChange({ mostrar_anio_en_perfil: e })
                        }}
                        id="mostrar-anio-perfil"
                        labelStyle={{ fontWeight: '400', fontSize: '1.1rem' }}
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
                            <MTooltip 
                                text='Puedes destacar hasta 3 créditos, estos estarán a la vista del Cazatalento.' 
                                color='orange' 
                                placement='top' />
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
                                style={{ color: (credito.destacado) ? 'gold' : 'gray' }}
                                aria-label="marcar como"
                                onClick={() => {
                                    onFormChange({
                                        creditos: state.creditos.map(c => {
                                            if (c.id === credito.id) {
                                                c.destacado = !credito.destacado;
                                            }
                                            return c;
                                        })
                                    })
                                }}
                            >
                                <Star />
                            </IconButton>,
                            clip:
                                <a onClick={() => { console.log('xdxdxddxddx 1') }} style={{ padding: 6, fontWeight: 800, color: '#069cb1' }} className="btn  btn-social mr-1 ml-1"><Image width={16} height={16} className="mr-2" src="/assets/img/iconos/cruz_blue.svg" alt="Boton de agregar credito" />Añadir</a>,
                            acciones:
                                <Button style={{ textTransform: 'capitalize', fontWeight: 800, color: '#069CB1' }} onClick={() => {
                                    onFormChange({ creditos: state.creditos.filter(c => c.id !== credito.id) })
                                }} variant="outlined" startIcon={<Close />}> Eliminar </Button>
                        }
                    }) : []}
                />
            </Grid>
        </Grid>
    )
}
