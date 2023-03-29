import { useEffect, useState, type FC } from 'react'
import { motion } from 'framer-motion'
import { FormGroup } from '~/components';
import { Alert, Divider, Grid, IconButton, Typography } from '@mui/material';
import classes from './talento-forms.module.css';
import { MContainer } from '~/components/layout/MContainer';
import DragNDrop from '~/components/shared/DragNDrop/DragNDrop';
import Image from 'next/image';
import { MCheckboxGroup, MSelect, MRadioGroup, AddButton } from '~/components/shared';
import { type TalentoFormPreferencias } from '~/pages/talento/editar-perfil';
import { api } from '~/utils/api';
import MotionDiv from '~/components/layout/MotionDiv';
import useNotify from '~/hooks/useNotify';
import CloseIcon from '@mui/icons-material/Close';
import { MTooltip } from '~/components/shared/MTooltip';

interface Props {
    state: TalentoFormPreferencias,
    onFormChange: (input: { [id: string]: unknown }) => void;
}

export const EditarPreferenciaRolYCompensacionTalento: FC<Props> = ({ onFormChange, state }) => {

    const { notify } = useNotify();

    const [otrasProfesionesInput, setOtrasProfesionesInput] = useState<string>('')
    const [locacionesAdicionalesSelect, setLocacionesAdicionalesSelect] = useState<string>('0')
    const [locacionPrincipalSelect, setLocacionPrincipalSelect] = useState<string>('0')

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

    const is_loading = estados_republica.isFetching || tipos_trabajo.isFetching || tipos_documentos.isFetching || tipos_interes_proyectos.isFetching || tipos_disponibilidad.isFetching;

    useEffect(() => {
        if (state.preferencias.meses_embarazo > 0) {
            setEstaEmbarazada(true)
        } else {
            setEstaEmbarazada(false)
        }
    }, [state.preferencias.meses_embarazo])

    useEffect(() => {
        if (state.preferencias.nombre_agente !== '' || state.preferencias.contacto_agente !== '') {
            setTieneAgenciaRepresentante(true)
        } else {
            setTieneAgenciaRepresentante(false)
        }
    }, [state.preferencias.nombre_agente, state.preferencias.contacto_agente])

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Alert severity="info" icon={false} sx={{ textAlign: 'center', justifyContent: 'center' }}>
                    Te recomendamos no cerrarte a un solo tipo de rol para tener más oportunidades de ser seleccionado.
                </Alert>
            </Grid>
            <Grid item xs={6}>
                <MCheckboxGroup
                    onAllOptionChecked={(checked) => {
                        onFormChange({
                            tipo_trabajo: (!checked) ? [] : tipos_trabajo.data ? tipos_trabajo.data.map((v) => v.id) : []
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
                    //labelClassName={classes['label-black-md']}
                    options={(tipos_trabajo.data) ? tipos_trabajo.data.map(t => t.es) : []}
                    values={(tipos_trabajo.data) ? tipos_trabajo.data.map(v => state.tipo_trabajo.includes(v.id)) : [false]}
                />
            </Grid>
            <Grid item xs={6}>
                <MTooltip
                    sx={{ mt: 7 }}
                    text='Selecciona aquellas opciones que vayan de acuerdo a tus habilidades'
                    color='orange'
                    placement='right'
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
                            <MTooltip
                                text='Prueba'
                                color='orange'
                                placement='right'
                            />
                        </Typography>
                    </MContainer>
                    <Typography fontSize={'.9rem'} fontWeight={700} style={{ color: '#4ab7c6' }} component={'p'}>
                        Si indicas interés en trabajar como extra, aparecerás en la búsqueda de extras del Director
                    </Typography>
                    <MRadioGroup
                        id="interesado-trabajo-extra-group"
                        options={['Sí', 'No']}
                        disabled={false}
                        labelStyle={{ marginLeft: 112, fontWeight: 800, fontSize: '0.8rem', color: '#4ab7c6' }}
                        value={state.preferencias.interesado_en_trabajos_de_extra ? 'Sí' : 'No'}
                        onChange={(e) => {
                            onFormChange({
                                preferencias: {
                                    interesado_en_trabajos_de_extra: e.currentTarget.value === 'Sí'
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
                    textTooltip='Te recomendamos seleccionar ambas opciones, para aumentar tus posibilidades de ser reclutado. No te limites y genera contactos, experiencia, y nuevos créditos profesionales.'
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
                    //labelClassName={classes['label-black-md']}
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
                            <MTooltip
                                text='Agrega el Estado que habites o frecuentes más como Locación Principal, también incluye una locación adicional y amplía tus posibilidades de trabajo.'
                                color='orange'
                                placement='right'
                            />
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
                                labelStyle={{fontWeight: 400}}
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
                                labelStyle={{fontWeight: 400}}
                                options={(estados_republica.isSuccess && estados_republica.data) ? estados_republica.data.map(u => { return { value: u.id.toString(), label: u.es } }) : []}
                                style={{ width: 250 }}
                                value={locacionesAdicionalesSelect}
                                onChange={(e) => { setLocacionesAdicionalesSelect(e.target.value) }}
                                label='Adicional'
                            />
                            <AddButton
                                text='Agregar otra localizacion'
                                onClick={() => {
                                    if (parseInt(locacionesAdicionalesSelect) > 0) {
                                        if (state.locaciones.some(locacion => locacion.id_estado_republica === parseInt(locacionesAdicionalesSelect))) return;
                                        onFormChange({
                                            locaciones: [...state.locaciones, { es_principal: false, id_estado_republica: parseInt(locacionesAdicionalesSelect) }]
                                        })
                                    } else {
                                        notify('warning', 'Por favor selecciona otra localizacion antes de intentar agregarla');
                                    }
                                }}
                            />

                            <MContainer direction='horizontal' styles={{ gap: 10, marginTop: 20 }}>
                                {
                                    state.locaciones.map(locacion => (
                                        <span
                                            key={locacion.id_estado_republica}
                                            style={{
                                                position: 'relative',
                                                borderRadius: 8,
                                                width: 200,
                                                textAlign: 'center',
                                                backgroundColor: locacion.es_principal ? '#0ab2c8' : '#AAE2E9',
                                                padding: '5px 10px',
                                                color: 'white'
                                            }}
                                        >
                                            {estados_republica.data?.filter(estado => estado.id === locacion.id_estado_republica).map(estado => estado.es)}
                                            <IconButton
                                                onClick={() => {
                                                    console.log('xd')
                                                }}
                                                style={{
                                                    position: 'absolute',
                                                    color: 'white',
                                                    padding: 0,
                                                    left: 0,
                                                    marginLeft: 8
                                                }}
                                                aria-label="Eliminar Equipo Deportivo"
                                                component="label">
                                                <CloseIcon style={{ width: 16 }} />
                                            </IconButton>
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
                        options={['Sí', 'No']}
                        labelStyle={{ marginLeft: 112, fontWeight: 800, fontSize: '0.8rem', color: '#4ab7c6' }}
                        value={tieneAgenciaRepresentante ? 'Sí' : 'No'}
                        onChange={(e) => {
                            setTieneAgenciaRepresentante(e.currentTarget.value === 'Sí')
                        }}
                        label=''
                    />
                    <MotionDiv show={tieneAgenciaRepresentante} animation="fade">

                        <MContainer direction='horizontal' styles={{ gap: 40 }}>
                            <FormGroup
                                className={classes['form-input-md']}
                                //labelClassName={classes['form-input-label']}
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
                                //labelClassName={classes['form-input-label']}
                                type='email'
                                textBlueLabel={'Correo electrónico'}
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
                    </MotionDiv>

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
                        fontWeight={400}
                        //labelClassName={classes['label-black-md']}
                        options={(tipos_documentos.data) ? tipos_documentos.data.map(t => t.es) : []}
                        values={(tipos_documentos.data) ? tipos_documentos.data.map(v => state.documentos.map(documento => documento.id_documento).includes(v.id)) : [false]}//[(state) ? state.mostrar_anio_en_perfil : false]}
                    />

                    {
                        <MotionDiv show={state.documentos.some(documento => documento?.id_documento === 99)} animation='fade'>
                            <FormGroup
                                className={classes['form-input-md']}
                                labelClassName={classes['form-input-label']}
                                value={state.documentos.filter(documento => documento?.id_documento === 99)[0]?.descripcion}
                                onChange={(e) => {
                                    onFormChange({
                                        documentos: state.documentos.map(documento => {
                                            if (documento?.id_documento === 99) {
                                                return {
                                                    id_documento: 99,
                                                    descripcion: e.target.value || ''
                                                }
                                            }
                                            return documento
                                        })
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
                        //labelClassName={classes['label-black-md']}
                        options={(tipos_disponibilidad.data) ? tipos_disponibilidad.data.map(t => t.es) : []}
                        values={(tipos_disponibilidad.data) ? tipos_disponibilidad.data.map(v => state.disponibilidad.includes(v.id)) : [false]}//[(state) ? state.mostrar_anio_en_perfil : false]}
                    />
                </MContainer>
            </Grid>

            <Grid my={4} item xs={12}>
                <Divider />
            </Grid>

            <Grid item xs={12}>
                <Typography fontSize={'1.2rem'} fontWeight={600} component={'p'} sx={{marginBottom: 1}}>
                    Otras profesiones
                    <MTooltip 
                        text='Añade algún trabajo que hayas tenido o tengas fuera del medio ¡Tu habilidad podría estar siendo buscada ahora mismo para el rol de un proyecto!' 
                        color='orange' 
                        placement='right' 
                    />
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
                            options={['Sí', 'No']}
                            labelStyle={{ marginLeft: 112, fontWeight: 800, fontSize: '0.8rem', color: '#4ab7c6' }}
                            value={estaEmbarazada ? 'Sí' : 'No'}
                            onChange={(e) => {
                                setEstaEmbarazada(e.currentTarget.value === 'Sí')
                            }}
                            label=''
                        />

                        <MotionDiv show={estaEmbarazada} animation="fade">
                            <MContainer direction='horizontal'>
                                <Typography>Meses</Typography>
                                <FormGroup
                                    rootStyle={{ margin: 0 }}
                                    type={'number'}
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
                        </MotionDiv>

                    </MContainer>

                </MContainer>
            </Grid>

        </Grid>
    )
}
