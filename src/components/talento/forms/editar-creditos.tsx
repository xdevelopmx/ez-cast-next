import { useContext, type FC } from 'react';
import Image from 'next/image';
import { FormGroup } from '~/components';
import { MContainer } from '~/components/layout/MContainer';
import { Button, Grid, IconButton, Typography } from '@mui/material';
import { MSelect } from '~/components/shared/MSelect/MSelect';
import { MCheckboxGroup } from '~/components/shared/MCheckboxGroup';
import { MTable } from '~/components/shared/MTable/MTable';
import { type TalentoFormCreditos } from '~/pages/talento/editar-perfil';
import { Close, Delete, Star } from '@mui/icons-material';
import { api } from '~/utils/api';
import useNotify from '~/hooks/useNotify';
import { MTooltip } from '~/components/shared/MTooltip';
import { FileManager } from '~/utils/file-manager';
import AppContext from '~/context/app';
import useLang from '~/hooks/useLang';

interface Props {
    state: TalentoFormCreditos,
    onFormChange: (input: { [id: string]: unknown }) => void;
}

const CURRENT_YEAR = new Date().getFullYear();

const YEARS = Array.from({ length: 100 }).map((value: unknown, i: number) => {
    return { value: (CURRENT_YEAR - i).toString(), label: (CURRENT_YEAR - i).toString() }
}).sort((a, b) => parseInt(b.value) - parseInt(a.value));

export const EditarCreditosTalento: FC<Props> = ({ onFormChange, state }) => {
    const ctx = useContext(AppContext);
    const textos = useLang(ctx.lang);
    const tipo_proyecto = api.catalogos.getTipoProyectos.useQuery();
    const { notify } = useNotify();
    return (
        <Grid container spacing={2}>
            <Grid item xs={12} my={0}>
                <Typography fontSize={'1.6rem'} fontWeight={600} component={'p'}>
                {textos['aniadir'] ? textos['aniadir'] : 'Texto No Definido'} {textos['credito'] ? textos['credito'] : 'Texto No Definido'}
                </Typography>
            </Grid>

            <Grid item container xs={21} columns={22} gap={2} justifyContent={'space-between'}>
                <Grid item xs={20} md={4} lg={4}>
                    <MSelect
                        styleRoot={{ width: '100%' }}
                        id="tipo-proyecto-select"
                        loading={tipo_proyecto.isFetching}
                        options={(tipo_proyecto.data) ? tipo_proyecto.data.map(tipo => { return { value: tipo.id.toString(), label: (ctx.lang === 'es') ? tipo.es : tipo.en } }) : []}
                        value={state.tipo_proyecto.toString()}
                        onChange={(e) => {
                            onFormChange({ tipo_proyecto: parseInt(e.target.value) })
                        }}
                        label={textos['tipo_proyecto'] ? textos['tipo_proyecto'] : 'Texto No Definido'}
                    />
                </Grid>
                <Grid item xs={20} md={4} lg={4}>
                    <FormGroup style={{ width: '100%' }} className={'form-input-md'} labelClassName={'form-input-label'} value={(state) ? state.titulo : ''} onChange={(e) => { onFormChange({ titulo: e.currentTarget.value }) }} label={textos['titulo'] ? textos['titulo'] : 'Texto No Definido'} />
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
                        label={textos['rol'] ? textos['rol'] : 'Texto No Definido'}
                    />
                </Grid>
                <Grid item xs={20} md={4} lg={4}>
                    <FormGroup style={{ width: '100%' }} className={'form-input-md'} labelClassName={'form-input-label'} value={(state) ? state.director : ''} onChange={(e) => { onFormChange({ director: e.currentTarget.value }) }} label={textos['director'] ? textos['director'] : 'Texto No Definido'} />
                </Grid>
                <Grid item xs={20} md={4} lg={4}>
                    <MContainer direction='vertical'>
                        <MSelect
                            styleRoot={{ width: '100%' }}
                            id="edad-select"
                            options={YEARS}
                            style={{ marginBottom: 0 }}
                            value={(state) ? state.anio.toString() : ''}
                            onChange={(e) => { onFormChange({ anio: parseInt(e.target.value) }) }}
                            label={textos['anio'] ? textos['anio'] : 'Texto No Definido'}
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
                                    }])
                                })
                            } else {
                                notify('warning', textos['llenar_todos_los_campos'] ? textos['llenar_todos_los_campos'].replace('[TYPE]', `${textos['credito']}`) : 'Texto No Definido');
                            }

                        }
                    }}
                        style={{ padding: '4px 16px', fontWeight: 800, color: '#069cb1' }}
                        className="btn  btn-social">
                        <Image width={13} height={13} style={{ marginRight: 7 }} src="/assets/img/iconos/cruz_blue.svg"
                            alt="Boton de agregar credito" />
                        {textos['guardar'] ? textos['guardar'] : 'Texto No Definido'} {textos['credito'] ? textos['credito'] : 'Texto No Definido'}
                    </a>
                </Grid>
            </Grid>




            <Grid item xs={12} xl={12} my={0}>
                <MContainer direction='vertical'>
                    <Typography my={0} fontSize={'1.6rem'} fontWeight={600} component={'p'}>
                        {textos['tus'] ? textos['tus'] : 'Texto No Definido'} {textos['credito'] ? textos['credito'] : 'Texto No Definido'}s
                    </Typography>
                    <MCheckboxGroup
                        onChange={(e) => {
                            onFormChange({ mostrar_anio_en_perfil: e })
                        }}
                        id="mostrar-anio-perfil"
                        labelStyle={{ fontWeight: '400', fontSize: '1.1rem' }}
                        options={[textos['mostrar_anio_en_perfil'] ? textos['mostrar_anio_en_perfil'] : 'Texto No Definido']}
                        values={[(state) ? state.mostrar_anio_en_perfil : false]}
                    />
                </MContainer>
            </Grid>
            <Grid item xs={12} mb={6}>
                <MTable
                    headerClassName='GrayHeader'
                    columnsHeader={[
                        <Typography key={1} fontSize={'1rem'} fontWeight={600} component={'p'} sx={{textAlign: 'left', padding: '0px 6px'}}>
                            {textos['titulo'] ? textos['titulo'] : 'Texto No Definido'}
                        </Typography>,
                        <Typography key={2} fontSize={'1rem'} fontWeight={600} component={'p'} sx={{textAlign: 'left', padding: '0px 6px'}}>
                            {textos['rol'] ? textos['rol'] : 'Texto No Definido'}
                        </Typography>,
                        <Typography key={3} fontSize={'1rem'} fontWeight={600} component={'p'} sx={{textAlign: 'left', padding: '0px 6px'}}>
                            {textos['director'] ? textos['director'] : 'Texto No Definido'}
                        </Typography>,
                        <Typography key={4} fontSize={'1rem'} fontWeight={600} component={'p'} sx={{textAlign: 'left', padding: '0px 6px'}}>
                            {textos['anio'] ? textos['anio'] : 'Texto No Definido'}
                        </Typography>,
                        <Typography key={5} fontSize={'1rem'} fontWeight={600} component={'p'} sx={{textAlign: 'left', padding: '0px 6px'}}>
                            {textos['credito_destacado'] ? textos['credito_destacado'] : 'Texto No Definido'} 
                            <MTooltip 
                                text={textos['creditos_credito_destacado_tooltip']} 
                                color='orange' 
                                placement='top' />
                        </Typography>,
                        <Typography key={6} fontSize={'1rem'} fontWeight={600} component={'p'} sx={{textAlign: 'left', padding: '0px 6px'}}>
                            Clip
                        </Typography>,
                        <Typography key={7} fontSize={'1rem'} fontWeight={600} component={'p'} sx={{textAlign: 'left', padding: '0px 6px'}}>
                            {textos['acciones'] ? textos['acciones'] : 'Texto No Definido'}
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
                                    if (state.creditos.filter(c => c.destacado).length < 3) {
                                        onFormChange({
                                            creditos: state.creditos.map(c => {
                                                if (c.id === credito.id) {
                                                    c.destacado = !credito.destacado;
                                                }
                                                return c;
                                            })
                                        })
                                    } else {
                                        notify('warning', textos['creditos_credito_destacado_max_validacion'] ? textos['creditos_credito_destacado_max_validacion'] : 'Texto No Definido')
                                    }
                                }}
                            >
                                <Star />
                            </IconButton>,
                            clip:
                                <Button style={{ minWidth: 10, padding: 6, fontWeight: 800, color: '#069cb1' }} className="btn  btn-social mr-1 ml-1" variant="outlined" component="label">
                                    <MContainer direction='vertical'>
                                        <>
                                            <MContainer direction='horizontal'>
                                                <Image width={14} height={14} className="mr-2" style={{marginTop: 3}} src="/assets/img/iconos/cruz_blue.svg" alt="Boton de añadir credito" />
                                                <Typography fontSize={'0.9rem'} fontWeight={700}>
                                                    {credito.clip ? textos['cambiar'] ? textos['cambiar'] : 'Texto No Definido' : textos['aniadir'] ? textos['aniadir'] : 'Texto No Definido'}
                                                </Typography>

                                            </MContainer>
                                            {credito.clip &&
                                                <Typography fontSize={'0.7rem'} fontWeight={400}>
                                                    {credito.clip.name.includes('clip') ? credito.clip.name : `clip-${credito.clip.name}`}
                                                </Typography>
                                            }
                                        </>

                                    </MContainer>
                                    <input onChange={(ev) => {
                                        if (ev.target.files) {
                                            const file = ev.target.files[0];
                                            onFormChange({
                                                creditos: state.creditos.map(c => {
                                                    if (c.id === credito.id) {
                                                        c.clip = file;
                                                        c.touched = true;
                                                    }
                                                    return c;
                                                })
                                            })
                                        }
                                    }} hidden accept="video/mp4, video/mov" type="file" />
                                </Button>,
                            acciones:
                                <Button style={{ textTransform: 'capitalize', fontWeight: 800, color: '#069CB1' }} onClick={() => {
                                    onFormChange({ creditos: state.creditos.filter(c => c.id !== credito.id) })
                                }} variant="outlined" startIcon={<Close />}> {textos['eliminar'] ? textos['eliminar'] : 'Texto No Definido'} </Button>
                        }
                    }) : []}
                />
            </Grid>
        </Grid>
    )
}
