import { useEffect, useState, type FC } from 'react'
import { motion } from 'framer-motion'
import { FormGroup } from '~/components';
import { Alert, Divider, Grid, Typography } from '@mui/material';
import classes from './talento-forms.module.css';
import { MContainer } from '~/components/layout/MContainer';
import DragNDrop from '~/components/shared/DragNDrop/DragNDrop';
import Image from 'next/image';
import { MCheckboxGroup, MSelect, MRadioGroup, AddButton } from '~/components/shared';
import { type TalentoFormPreferencias } from '~/pages/talento/editar-perfil';
import { api } from '~/utils/api';
import MotionDiv from '~/components/layout/MotionDiv';


interface Props {
    state: TalentoFormPreferencias,
    onFormChange: (input: { [id: string]: unknown }) => void;
}

export const EditarPreferenciaRolYCompensacionTalento: FC<Props> = ({ onFormChange, state }) => {

    const [otrasProfesionesInput, setOtrasProfesionesInput] = useState<string>('')
    const [locacionesAdicionalesSelect, setLocacionesAdicionalesSelect] = useState<string>('0')
    const [locacionPrincipalSelect, setLocacionPrincipalSelect] = useState<string>('0')

    const [tipos_documentos_selected, setTipoDocumentosSelected] = useState<boolean[]>([]);

    const [tieneAgenciaRepresentante, setTieneAgenciaRepresentante] = useState<boolean>(false)
    const [estaEmbarazada, setEstaEmbarazada] = useState<boolean>(false)

    const estados_republica = api.catalogos.getEstadosRepublica.useQuery(undefined, {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    const tipos_trabajo = api.catalogos.getTipoDeTrabajos.useQuery(undefined, {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    const tipos_interes_proyectos = api.catalogos.getTiposInteresesEnProyectos.useQuery(undefined, {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    const tipos_documentos = api.catalogos.getTipoDeDocumentos.useQuery(undefined, {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    const tipos_disponibilidad = api.catalogos.getTipoDeDisponibilidad.useQuery(undefined, {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        if (tipos_documentos.data) {
            setTipoDocumentosSelected(tipos_documentos.data.map(_ => false))
        }
    }, [tipos_documentos.data]);

    const is_loading = estados_republica.isFetching || tipos_trabajo.isFetching || tipos_documentos.isFetching || tipos_interes_proyectos.isFetching || tipos_disponibilidad.isFetching;

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Alert severity="info">Te recomendamos no cerrarte a un solo tipo de rol para tener más oportunidades de ser seleccionado.</Alert>
            </Grid>
            <Grid item xs={12}>
                <MCheckboxGroup
                    onAllOptionChecked={() => {
                        onFormChange({
                            tipo_trabajo: tipos_trabajo.data ? tipos_trabajo.data.map((v) => v.id) : []
                        })
                    }}
                    direction='vertical'
                    title="Tipo de trabajo"
                    onChange={(e, i) => {
                        if (tipos_trabajo.data) {
                            const tipo_trabajo = tipos_trabajo.data[i]
                            if (tipo_trabajo) {
                                let nuevosTipos = []
                                if (state.tipo_trabajo.includes(tipo_trabajo?.id)) {
                                    nuevosTipos = state.tipo_trabajo.filter((id) => id !== tipo_trabajo.id)
                                } else {
                                    nuevosTipos = [...state.tipo_trabajo, tipo_trabajo.id]
                                }
                                onFormChange({
                                    tipo_trabajo: nuevosTipos
                                })
                            }
                        }
                    }}
                    id="tipo-trabajo"
                    labelStyle={{ marginBottom: 0 }}
                    labelClassName={classes['label-black-md']}
                    options={(tipos_trabajo.data) ? tipos_trabajo.data.map(t => t.es) : []}
                    values={(tipos_trabajo.data) ? tipos_trabajo.data.map(v => state.tipo_trabajo.includes(v.id)) : [false]}
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
                        id="interesado-trabajo-extra-group"
                        options={['si', 'no']}
                        disabled={false}
                        labelStyle={{ marginLeft: 112, fontWeight: 800, fontSize: '0.8rem', color: '#4ab7c6' }}
                        value={state.preferencias.interesado_en_trabajos_de_extra ? 'si' : 'no'}
                        onChange={(e) => {
                            onFormChange({
                                preferencias: {
                                    interesado_en_trabajos_de_extra: e.currentTarget.value === 'si'
                                }
                            })
                        }}
                        label=''
                    />
                </MContainer>
            </Grid>
            <Grid my={4} item xs={12}>
                <Divider />
            </Grid>
            <Grid item xs={12}>
                <MCheckboxGroup
                    direction='vertical'
                    title="Interés en proyectos"
                    onChange={(e, i) => {
                        if (tipos_interes_proyectos.data) {
                            const tipo_interes_proyecto = tipos_interes_proyectos.data[i]
                            if (tipo_interes_proyecto) {
                                let nuevosTipos = []
                                if (state.interes_en_proyectos.includes(tipo_interes_proyecto?.id)) {
                                    nuevosTipos = state.interes_en_proyectos.filter((id) => id !== tipo_interes_proyecto.id)
                                } else {
                                    nuevosTipos = [...state.interes_en_proyectos, tipo_interes_proyecto.id]
                                }
                                onFormChange({
                                    interes_en_proyectos: nuevosTipos
                                })
                            }
                        }
                    }}
                    id="interes-proyectos-checkbox"
                    labelStyle={{ marginBottom: 0 }}
                    labelClassName={classes['label-black-md']}
                    options={(tipos_interes_proyectos.data) ? tipos_interes_proyectos.data.map(t => t.es) : []}
                    values={(tipos_interes_proyectos.data) ? tipos_interes_proyectos.data.map(v => state.interes_en_proyectos.includes(v.id)) : [false]}//[(state) ? state.mostrar_anio_en_perfil : false]}
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
                                loading={is_loading}
                                id='locacion-principal-select'
                                options={(estados_republica.isSuccess && estados_republica.data) ? estados_republica.data.map(u => { return { value: u.id.toString(), label: u.es } }) : []}
                                style={{ width: 250 }}
                                value={locacionPrincipalSelect}
                                onChange={(e) => {
                                    setLocacionPrincipalSelect(e.target.value)
                                    if (state.locaciones.some(locacion => locacion.es_principal)) {
                                        onFormChange({
                                            locaciones: state.locaciones.map(locacion => {
                                                if (locacion.es_principal) return { es_principal: true, id_estado_republica: parseInt(e.target.value) };
                                                return locacion;
                                            })
                                        })
                                    } else {
                                        onFormChange({
                                            locaciones: [{ es_principal: true, id_estado_republica: parseInt(e.target.value) }, ...state.locaciones]
                                        })
                                    }
                                }}
                                label='Principal'
                            />
                        </MContainer>

                        <MContainer direction='vertical'>
                            <MSelect
                                loading={is_loading}
                                id='locacion-principal-select'
                                options={(estados_republica.isSuccess && estados_republica.data) ? estados_republica.data.map(u => { return { value: u.id.toString(), label: u.es } }) : []}
                                style={{ width: 250 }}
                                value={locacionesAdicionalesSelect}
                                onChange={(e) => { setLocacionesAdicionalesSelect(e.target.value) }}
                                label='Adicional'
                            />
                            <AddButton
                                text='Agregar otra localizacion'
                                onClick={() => {
                                    if (state.locaciones.some(locacion => locacion.id_estado_republica === parseInt(locacionesAdicionalesSelect))) return;
                                    onFormChange({
                                        locaciones: [...state.locaciones, { es_principal: false, id_estado_republica: parseInt(locacionesAdicionalesSelect) }]
                                    })
                                }}
                            />

                            <MContainer direction='horizontal' styles={{ gap: 10, marginTop: 20 }}>
                                {
                                    state.locaciones.map(locacion => (
                                        <span
                                            key={locacion.id_estado_republica}
                                            style={{ backgroundColor: locacion.es_principal ? '#0ab2c8' : '#AAE2E9', padding: '5px 10px' }}
                                        >
                                            {estados_republica.data?.filter(estado => estado.id === locacion.id_estado_republica).map(estado => estado.es)}
                                        </span>
                                    ))
                                }
                            </MContainer>
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
                        id="agencia-representante-radio"
                        options={['si', 'no']}
                        labelStyle={{ marginLeft: 112, fontWeight: 800, fontSize: '0.8rem', color: '#4ab7c6' }}
                        value={tieneAgenciaRepresentante ? 'si' : 'no'}
                        onChange={(e) => {
                            setTieneAgenciaRepresentante(e.currentTarget.value === 'si')
                        }}
                        label=''
                    />

                    <MContainer direction='horizontal' styles={{ gap: 40 }}>
                        <FormGroup
                            className={classes['form-input-md']}
                            labelClassName={classes['form-input-label']}
                            value={state.preferencias.nombre_agente}
                            onChange={(e) => {
                                onFormChange({
                                    preferencias: {
                                        ...state.preferencias,
                                        nombre_agente: e.currentTarget.value
                                    }
                                })
                            }}
                            label='Nombre'
                        />

                        <FormGroup
                            className={classes['form-input-md']}
                            labelClassName={classes['form-input-label']}
                            value={state.preferencias.contacto_agente}
                            onChange={(e) => {
                                onFormChange({
                                    preferencias: {
                                        ...state.preferencias,
                                        contacto_agente: e.currentTarget.value
                                    }
                                })
                            }}
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
                        onChange={(e, i) => {
                            setTipoDocumentosSelected(v => v.map((activo, index) => i === index ? e : activo))
                            if (tipos_documentos.data) {
                                const tipo_documento = tipos_documentos.data[i]
                                if (tipo_documento) {
                                    let nuevosTipos = []
                                    if (state.documentos.map(obj => obj.id_documento).includes(tipo_documento?.id)) {
                                        nuevosTipos = state.documentos.filter((obj) => obj.id_documento !== tipo_documento.id)
                                    } else {
                                        nuevosTipos = [...state.documentos, { id_documento: tipo_documento.id, descripcion: '' }]
                                    }
                                    onFormChange({
                                        documentos: nuevosTipos
                                    })
                                }
                            }
                        }}
                        id="documentos-checkbox"
                        labelStyle={{ marginBottom: 0 }}
                        labelClassName={classes['label-black-md']}
                        options={(tipos_documentos.data) ? tipos_documentos.data.map(t => t.es) : []}
                        values={tipos_documentos_selected}//[(state) ? state.mostrar_anio_en_perfil : false]}
                    />

                    {
                        <MotionDiv show={state.documentos.some(documento => documento?.id_documento === 99)} animation='fade'>
                            <FormGroup
                                className={classes['form-input-md']}
                                labelClassName={classes['form-input-label']}
                                value={state.documentos.filter(documento => documento?.id_documento === 99)[0]?.descripcion}
                                onChange={(e) => {
                                    onFormChange({
                                        documentos: state.documentos.map( documento => {
                                            if(documento?.id_documento === 99){
                                                return {
                                                    id_documento: 99,
                                                    descripcion: e.target.value || ''
                                                }
                                            }
                                        } )
                                    })
                                }}
                            />
                        </MotionDiv>
                    }

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
                        title="Algunos directores solicitan actividades específicas, déjales saber si estás dispuesto a realizarlas"
                        onChange={(e, i) => {
                            if (tipos_disponibilidad.data) {
                                const tipo_disponibilidad = tipos_disponibilidad.data[i]
                                if (tipo_disponibilidad) {
                                    let nuevosTipos = []
                                    if (state.disponibilidad.includes(tipo_disponibilidad?.id)) {
                                        nuevosTipos = state.disponibilidad.filter((id) => id !== tipo_disponibilidad.id)
                                    } else {
                                        nuevosTipos = [...state.disponibilidad, tipo_disponibilidad.id]
                                    }
                                    onFormChange({
                                        disponibilidad: nuevosTipos
                                    })
                                }
                            }
                        }}
                        id="disponibilidad-para-checkboxgroup"
                        labelStyle={{ marginBottom: 0, width: '32%' }}
                        labelClassName={classes['label-black-md']}
                        options={(tipos_disponibilidad.data) ? tipos_disponibilidad.data.map(t => t.es) : []}
                        values={(tipos_disponibilidad.data) ? tipos_disponibilidad.data.map(v => state.disponibilidad.includes(v.id)) : [false]}//[(state) ? state.mostrar_anio_en_perfil : false]}
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
                    value={otrasProfesionesInput}
                    onChange={(e) => {
                        setOtrasProfesionesInput(e.currentTarget.value)
                    }}
                />
                <AddButton text='Agregar otra' onClick={() => {
                    if (!otrasProfesionesInput) return;
                    onFormChange({
                        otras_profesiones: [...state.otras_profesiones, otrasProfesionesInput]
                    })
                    setOtrasProfesionesInput('')
                }} />

                <MContainer direction='horizontal' styles={{ gap: 10, marginTop: 20 }}>
                    {
                        state.otras_profesiones.map(profesion => (
                            <span key={profesion} style={{ backgroundColor: '#AAE2E9', padding: '5px 10px' }}>{profesion}</span>
                        ))
                    }
                </MContainer>
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
                            value={estaEmbarazada ? 'si' : 'no'}
                            onChange={(e) => {
                                setEstaEmbarazada(e.currentTarget.value === 'si')
                            }}
                            label=''
                        />

                        <MContainer direction='horizontal'>
                            <Typography>Meses</Typography>
                            <FormGroup
                                rootStyle={{ margin: 0 }}
                                style={{ margin: '0px 0px 0px 10px' }}
                                className={classes['form-input-md']}
                                labelClassName={classes['form-input-label']}
                                value={`${state.preferencias.meses_embarazo}`}
                                onChange={(e) => {
                                    onFormChange({
                                        preferencias: {
                                            ...state.preferencias,
                                            meses_embarazo: e.currentTarget.value === '' ? 0 : parseInt(e.currentTarget.value)
                                        }
                                    })
                                }}
                            />
                        </MContainer>

                    </MContainer>

                </MContainer>
            </Grid>

        </Grid>
    )
}
