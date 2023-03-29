import { useMemo, type FC } from 'react'
import { AddButton, FormGroup } from '~/components';
import { Button, Divider, Grid, IconButton, Typography } from '@mui/material';
import { MContainer } from '~/components/layout/MContainer';
import { MSelect } from '~/components/shared/MSelect';
import classes from './talento-forms.module.css';
import { MCheckboxGroup } from '~/components/shared/MCheckboxGroup';
import { MTable } from '~/components/shared/MTable/MTable';
import { type TalentoFormActivos } from '~/pages/talento/editar-perfil';
import { api } from '~/utils/api';
import MotionDiv from '~/components/layout/MotionDiv';
import CloseIcon from '@mui/icons-material/Close';
import useNotify from '~/hooks/useNotify';
import { Close } from '@mui/icons-material';

interface Props {
    state: TalentoFormActivos,
    onFormChange: (input: { [id: string]: unknown }) => void;
}
const CURRENT_YEAR = new Date().getFullYear();
const VEHICULO_YEARS = Array.from({ length: 100 }).map((v, i) => CURRENT_YEAR - i);

export const EditarActivosTalento: FC<Props> = ({ onFormChange, state }) => {
    const tipos_vehiculos = api.catalogos.getTipoVehiculos.useQuery();
    const tipos_mascotas = api.catalogos.getTipoMascotas.useQuery();
    const tipos_razas = api.catalogos.getTipoRazasMascotas.useQuery();
    const tipos_vestuarios = api.catalogos.getTipoVestuarios.useQuery();
    const tipos_vestuarios_especificos = api.catalogos.getTipoVestuarioEspecifico.useQuery();
    const tipos_props = api.catalogos.getTipoProps.useQuery();
    const tipo_equipo_deportivo = api.catalogos.getTipoEquipoDeportivo.useQuery();
    const { notify } = useNotify();
    const raza_select: JSX.Element | null = useMemo(() => {
        if (state.mascota) {
            if (state.mascota.id_tipo_mascota === 5) {
                return <MSelect
                    id="tipo-raza-select"
                    className={classes['form-input-md']}
                    options={(tipos_razas.data) ? tipos_razas.data.map(m => { return { value: m.id.toString(), label: m.es } }) : []}
                    style={{ width: 200 }}
                    value={state.mascota.id_raza.toString()}
                    onChange={(e) => {
                        const tipo = (tipos_razas.data) ? tipos_razas.data.filter(d => d.id === parseInt(e.target.value)) : [];
                        onFormChange({ mascota: { ...state.mascota, tipo_raza: (tipo.length > 0 && tipo[0] != null) ? tipo[0].es : 'ND', id_raza: parseInt(e.target.value) } })
                    }}
                    label='Raza'
                />
            }
        }
        return null;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.mascota]);

    const vestuario_especifico_select: JSX.Element | null = useMemo(() => {
        if (state.vestuario) {
            if (state.vestuario.id_tipo > 0 && state.vestuario.id_tipo !== 3) {
                return <MSelect
                    id="tipo-vestuario-especifico-select"
                    className={classes['form-input-md']}
                    options={(tipos_vestuarios_especificos.data) ? tipos_vestuarios_especificos.data.filter(v => v.id_tipo_vestuario === state.vestuario?.id_tipo).map(m => { return { value: m.id.toString(), label: m.es } }) : []}
                    style={{ width: 200 }}
                    value={state.vestuario.id_tipo_vestuario_especifico.toString()}
                    onChange={(e) => {
                        const tipo = (tipos_vestuarios_especificos.data) ? tipos_vestuarios_especificos.data.filter(d => d.id === parseInt(e.target.value)) : [];
                        onFormChange({ vestuario: { ...state.vestuario, tipo_especifico: (tipo.length > 0 && tipo[0] != null) ? tipo[0].es : 'ND', id_tipo_vestuario_especifico: parseInt(e.target.value) } })
                    }}
                    label='Tipo Vestuario Especifico'
                />
            }
        }
        return null;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.vestuario]);

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} md={3} lg={4}>
                <MContainer direction='vertical'>
                    <MCheckboxGroup
                        onChange={(e) => {
                            onFormChange({ has_vehiculos: e })
                        }}
                        id="mostrar-vehiculos"
                        labelClassName={classes['label-black-lg']}
                        options={['Vehículos']}
                        values={[state.has_vehiculos]}//[(state) ? state.mostrar_anio_en_perfil : false]}
                    />
                    <MotionDiv show={state.has_vehiculos} animation='fade'>
                        <>

                            <MSelect
                                id="tipo-vehiculo-select"
                                className={classes['form-input-md']}
                                options={(tipos_vehiculos.data) ? tipos_vehiculos.data.map(v => { return { value: v.id.toString(), label: v.es } }) : []}
                                value={state.vehiculo.id_tipo_vehiculo.toString()}
                                onChange={(e) => {
                                    const tipo = (tipos_vehiculos.data) ? tipos_vehiculos.data.filter(d => d.id === parseInt(e.target.value)) : [];
                                    onFormChange({ vehiculo: { ...state.vehiculo, tipo: (tipo.length > 0 && tipo[0] != null) ? tipo[0].es : 'ND', id_tipo_vehiculo: parseInt(e.target.value) } })
                                }}
                                label='Tipo Vehiculo'
                            />
                            <FormGroup
                                className={classes['form-input-md']}
                                labelClassName={classes['form-input-label']}
                                value={state.vehiculo?.marca}
                                onChange={(e) => {
                                    onFormChange({ vehiculo: { ...state.vehiculo, marca: e.target.value } })
                                }}
                                label='Marca'
                            />
                            <FormGroup
                                className={classes['form-input-md']}
                                labelClassName={classes['form-input-label']}
                                value={state.vehiculo?.modelo}
                                onChange={(e) => {
                                    onFormChange({ vehiculo: { ...state.vehiculo, modelo: e.target.value } })
                                }}
                                label='Modelo'
                            />
                            <FormGroup
                                className={classes['form-input-md']}
                                labelClassName={classes['form-input-label']}
                                value={state.vehiculo?.color}
                                onChange={(e) => {
                                    onFormChange({ vehiculo: { ...state.vehiculo, color: e.target.value } })
                                }}
                                label='Color'
                            />
                            <MSelect
                                id="anio-vehiculo-select"
                                className={classes['form-input-md']}
                                options={VEHICULO_YEARS.map(i => { return { value: (i).toString(), label: (i).toString() } })}
                                style={{ width: 200 }}
                                value={state.vehiculo?.anio?.toString()}
                                onChange={(e) => {
                                    onFormChange({ vehiculo: { ...state.vehiculo, anio: parseInt(e.target.value) } })
                                }}
                                label='Año'
                            />
                            <AddButton
                                aStyles={{ marginLeft: 0, width: 100 }}
                                onClick={() => {
                                    if (state.vehiculos) {
                                        if (state.vehiculo &&
                                            state.vehiculo.anio > 0 &&
                                            state.vehiculo.marca.length > 0 &&
                                            state.vehiculo.modelo.length > 0 &&
                                            state.vehiculo.color.length > 0 &&
                                            state.vehiculo.id_tipo_vehiculo > 0) {
                                            onFormChange({ vehiculos: state.vehiculos.concat([state.vehiculo]) });
                                        } else {
                                            notify('warning', 'Por favor llena todos los campos antes de intentar guardar el activo');
                                        }
                                    } else {
                                        onFormChange({ vehiculos: [state.vehiculo] })
                                    }
                                }}
                            />
                        </>
                    </MotionDiv>
                </MContainer>
            </Grid>
            <Grid item xs={12} md={9} lg={8}>
                <MotionDiv show={state.has_vehiculos} animation='fade'>

                    <MContainer direction='vertical'>
                        <Divider style={{ marginTop: 32 }} />
                        <MTable
                            columnsHeader={[
                                <Typography key={1} fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                                    Tipo
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
                                <Typography key={6} fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                                    Acciones
                                </Typography>,
                            ]}
                            loading={!state.vehiculos}
                            data={(state.vehiculos) ? state.vehiculos.map((e, j) => {
                                return {
                                    tipo: e.tipo,
                                    marca: e.marca,
                                    modelo: e.modelo,
                                    color: e.color,
                                    anio: e.anio,
                                    delete: <Button
                                        style={{ textTransform: 'capitalize', fontWeight: 800, color: '#069CB1' }}
                                        onClick={() => {
                                            if (state.vehiculos) {
                                                onFormChange({ vehiculos: state.vehiculos.filter((v, i) => i !== j) });
                                            }
                                        }}
                                        variant="outlined"
                                        startIcon={<Close />}>
                                        Eliminar
                                    </Button>
                                };
                            }) : []}
                        />
                    </MContainer>
                </MotionDiv>
            </Grid>
            <Grid my={4} item xs={12}>
                <Divider />
            </Grid>
            <Grid item xs={12} md={3} lg={4}>
                <MContainer direction='vertical'>
                    <MCheckboxGroup
                        onChange={(e) => {
                            onFormChange({ has_mascotas: e })
                        }}
                        id="mostrar-mascotas"
                        labelClassName={classes['label-black-lg']}
                        options={['Mascotas']}
                        values={[state.has_mascotas]}//[(state) ? state.mostrar_anio_en_perfil : false]}
                    />
                    <MotionDiv show={state.has_mascotas} animation='fade'>
                        <MContainer direction='vertical'>

                            <MSelect
                                id="tipo-mascota-select"
                                className={classes['form-input-md']}
                                options={(tipos_mascotas.data) ? tipos_mascotas.data.map(m => { return { value: m.id.toString(), label: m.es } }) : []}
                                style={{ width: 200 }}
                                value={state.mascota.id_tipo_mascota.toString()}
                                onChange={(e) => {
                                    const tipo = (tipos_mascotas.data) ? tipos_mascotas.data.filter(d => d.id === parseInt(e.target.value)) : [];
                                    onFormChange({ mascota: { ...state.mascota, id_tipo_raza: 0, tipo: (tipo.length > 0 && tipo[0] != null) ? tipo[0].es : 'ND', id_tipo_mascota: parseInt(e.target.value) } })
                                }}
                                label='Tipo Mascota'
                            />
                            <>
                                {raza_select}
                            </>
                            <MSelect
                                id="tamanio-mascota-select"
                                className={classes['form-input-md']}
                                options={[{ value: 'Chico', label: 'Chico' }, { value: 'Mediano', label: 'Mediano' }, { value: 'Grande', label: 'Grande' }]}
                                style={{ width: 200 }}
                                value={state.mascota.tamanio}
                                onChange={(e) => {
                                    onFormChange({ mascota: { ...state.mascota, tamanio: e.target.value } })
                                }}
                                label='Tamaño'
                            />
                            <AddButton
                                aStyles={{ marginLeft: 0, width: 100 }}
                                onClick={() => {
                                    if (state.mascotas) {
                                        if (state.mascota &&
                                            state.mascota.id_tipo_mascota > 0 &&
                                            state.mascota.tamanio.length > 0) {
                                            if (state.mascota.id_tipo_mascota === 5 && state.mascota.id_raza > 0 || state.mascota.id_tipo_mascota !== 5) {
                                                onFormChange({ mascotas: state.mascotas.concat([state.mascota]) });
                                            } else {
                                                notify('warning', 'Por favor llena todos los campos antes de intentar agregar el activo');
                                            }
                                        } else {
                                            notify('warning', 'Por favor llena todos los campos antes de intentar agregar el activo');
                                        }
                                    } else {
                                        onFormChange({ mascotas: [state.mascota] })
                                    }
                                }}
                            />
                        </MContainer>
                    </MotionDiv>
                </MContainer>
            </Grid>
            <Grid item xs={12} md={9} lg={8}>
                <MotionDiv show={state.has_mascotas} animation='fade'>
                    <MContainer direction='vertical'>
                        <Divider style={{ marginTop: 32 }} />
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
                                <Typography key={4} fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                                    Acciones
                                </Typography>,
                            ]}
                            loading={!state.mascotas}
                            data={(state.mascotas) ? state.mascotas?.map((mascota, j) => {
                                return {
                                    tipo: mascota.tipo,
                                    tipo_raza: (mascota.id_tipo_mascota === 5) ? mascota.tipo_raza : 'No Aplica',
                                    tamanio: mascota.tamanio,
                                    delete: <Button
                                        style={{ textTransform: 'capitalize', fontWeight: 800, color: '#069CB1' }}
                                        onClick={() => {
                                            if (state.mascotas) {
                                                onFormChange({ mascotas: state.mascotas.filter((v, i) => i !== j) });
                                            }
                                        }}
                                        variant="outlined"
                                        startIcon={<Close />}>
                                        Eliminar
                                    </Button>

                                }
                            }) : []}
                        />
                    </MContainer>
                </MotionDiv>
            </Grid>
            <Grid my={4} item xs={12}>
                <Divider />
            </Grid>
            <Grid item xs={12} md={3} lg={4}>
                <MContainer direction='vertical'>
                    <MCheckboxGroup
                        onChange={(e) => {
                            onFormChange({ has_vestuario: e })
                        }}
                        id="mostrar-vestuario"
                        labelClassName={classes['label-black-lg']}
                        options={['Vestuario']}
                        values={[state.has_vestuario]}//[(state) ? state.mostrar_anio_en_perfil : false]}
                    />
                    <MotionDiv show={state.has_vestuario} animation='fade'>
                        <>

                            <MSelect
                                id="tipo-vestuario-select"
                                className={classes['form-input-md']}
                                options={(tipos_vestuarios.data) ? tipos_vestuarios.data.map(m => { return { value: m.id.toString(), label: m.es } }) : []}
                                style={{ width: 200 }}
                                value={state.vestuario.id_tipo.toString()}
                                onChange={(e) => {
                                    const tipo = (tipos_vestuarios.data) ? tipos_vestuarios.data.filter(d => d.id === parseInt(e.target.value)) : [];
                                    onFormChange({ vestuario: { ...state.vestuario, tipo: (tipo.length > 0 && tipo[0] != null) ? tipo[0].es : 'ND', id_tipo: parseInt(e.target.value), id_tipo_especifico: 0 } })
                                }}
                                label='Tipo Vestuario'
                            />
                            <>
                                {vestuario_especifico_select}
                            </>
                            <FormGroup
                                className={classes['form-input-md']}
                                labelClassName={classes['form-input-label']}
                                value={state.vestuario?.descripcion}
                                onChange={(e) => {
                                    onFormChange({ vestuario: { ...state.vestuario, descripcion: e.target.value } })
                                }}
                                label='Descripcion'
                            />
                            <AddButton
                                aStyles={{ marginLeft: 0, width: 100 }}
                                onClick={() => {
                                    if (state.vestuarios) {
                                        if (state.vestuario && state.vestuario.id_tipo > 0 && state.vestuario.id_tipo_vestuario_especifico > 0 && state.vestuario.descripcion.length > 0) {
                                            onFormChange({ vestuarios: state.vestuarios.concat([state.vestuario]) });
                                        } else {
                                            notify('warning', 'Por favor llena todos los campos antes de intentar agregar el activo');
                                        }
                                    } else {
                                        onFormChange({ vestuarios: [state.vestuario] })
                                    }
                                }}
                            />
                        </>
                    </MotionDiv>
                </MContainer>
            </Grid>
            <Grid item xs={12} md={9} lg={8}>
                <MotionDiv show={state.has_vestuario} animation='fade'>
                    <MContainer direction='vertical'>
                        <Divider style={{ marginTop: 32 }} />
                        <MTable
                            columnsHeader={[
                                <Typography key={1} fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                                    Tipo Vestuario
                                </Typography>,
                                <Typography key={2} fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                                    Tipo Vestuario Especifico
                                </Typography>,
                                <Typography key={3} fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                                    Descripcion
                                </Typography>,
                                <Typography key={4} fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                                    Acciones
                                </Typography>,
                            ]}
                            loading={!state.vestuarios}
                            data={(state.vestuarios) ? state.vestuarios?.map((vestuario, j) => {
                                return {
                                    tipo: vestuario.tipo,
                                    tipo_especifico: (vestuario.id_tipo !== 3) ? vestuario.tipo_especifico : 'No Aplica',
                                    descripcion: vestuario.descripcion,
                                    delete: <Button
                                        style={{ textTransform: 'capitalize', fontWeight: 800, color: '#069CB1' }}
                                        onClick={() => {
                                            if (state.vestuarios) {
                                                onFormChange({ vestuarios: state.vestuarios.filter((v, i) => i !== j) });
                                            }
                                        }}
                                        variant="outlined"
                                        startIcon={<Close />}>
                                        Eliminar
                                    </Button>
                                }
                            }) : []}
                        />
                    </MContainer>
                </MotionDiv>
            </Grid>
            <Grid my={4} item xs={12}>
                <Divider />
            </Grid>
            <Grid item xs={12} md={3} lg={4}>
                <MContainer direction='vertical'>
                    <MCheckboxGroup
                        onChange={(e) => {
                            onFormChange({ has_props: e })
                        }}
                        id="mostrar-props"
                        labelClassName={classes['label-black-lg']}
                        options={['Props']}
                        values={[state.has_props]}//[(state) ? state.mostrar_anio_en_perfil : false]}
                    />
                    <MotionDiv show={state.has_props} animation='fade'>
                        <>

                            <MSelect
                                id="tipo-prop-select"
                                className={classes['form-input-md']}
                                options={(tipos_props.data) ? tipos_props.data.map(m => { return { value: m.id.toString(), label: m.es } }) : []}
                                style={{ width: 200 }}
                                value={state.prop.id_tipo_props.toString()}
                                onChange={(e) => {
                                    const tipo = (tipos_props.data) ? tipos_props.data.filter(d => d.id === parseInt(e.target.value)) : [];
                                    onFormChange({ prop: { ...state.prop, tipo: (tipo.length > 0 && tipo[0] != null) ? tipo[0].es : 'ND', id_tipo_props: parseInt(e.target.value) } })
                                }}
                                label='Tipo Prop'
                            />
                            <FormGroup
                                className={classes['form-input-md']}
                                labelClassName={classes['form-input-label']}
                                value={state.prop?.descripcion}
                                onChange={(e) => {
                                    onFormChange({ prop: { ...state.prop, descripcion: e.target.value } })
                                }}
                                label='Descripcion'
                            />
                            <AddButton
                                aStyles={{ marginLeft: 0, width: 100 }}
                                onClick={() => {
                                    if (state.props) {
                                        if (state.prop && state.prop.id_tipo_props > 0 && state.prop.descripcion.length > 0) {
                                            onFormChange({ props: state.props.concat([state.prop]) });
                                        } else {
                                            notify('warning', 'Por favor llena todos los campos antes de intentar agregar el activo');
                                        }
                                    } else {
                                        onFormChange({ props: [state.prop] })
                                    }
                                }}
                            />

                        </>
                    </MotionDiv>
                </MContainer>
            </Grid>
            <Grid item xs={12} md={9} lg={8}>
                <MotionDiv show={state.has_props} animation='fade'>
                    <MContainer direction='vertical'>
                        <Divider style={{ marginTop: 32 }} />
                        <MTable
                            columnsHeader={[
                                <Typography key={1} fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                                    Tipo Prop
                                </Typography>,
                                <Typography key={2} fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                                    Descripcion
                                </Typography>,
                                <Typography key={3} fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                                    Acciones
                                </Typography>,
                            ]}
                            loading={!state.props}
                            data={(state.props) ? state.props?.map((prop, j) => {
                                return {
                                    tipo: prop.tipo,
                                    descripcion: prop.descripcion,
                                    delete: <Button
                                        style={{ textTransform: 'capitalize', fontWeight: 800, color: '#069CB1' }}
                                        onClick={() => {
                                            if (state.props) {
                                                onFormChange({ props: state.props.filter((v, i) => i !== j) });
                                            }
                                        }}
                                        variant="outlined"
                                        startIcon={<Close />}>
                                        Eliminar
                                    </Button>
                                }
                            }) : []}
                        />
                    </MContainer>
                </MotionDiv>
            </Grid>
            <Grid my={4} item xs={12}>
                <Divider />
            </Grid>
            <Grid item xs={12} md={3} lg={4}>
                <MContainer direction='vertical'>
                    <MCheckboxGroup
                        onChange={(e) => {
                            onFormChange({ has_equipo_deportivo: e })
                        }}
                        id="mostrar-equipo-deportivo"
                        labelClassName={classes['label-black-lg']}
                        options={['Equipo Deportivo']}
                        values={[state.has_equipo_deportivo]}//[(state) ? state.mostrar_anio_en_perfil : false]}
                    />
                    <MotionDiv show={state.has_equipo_deportivo} animation='fade'>
                        <>

                            <MSelect
                                id="tipo-equipo-deportivo-select"
                                className={classes['form-input-md']}
                                options={(tipo_equipo_deportivo.data) ? tipo_equipo_deportivo.data.map(m => { return { value: m.id.toString(), label: m.es } }) : []}
                                style={{ width: 200 }}
                                value={state.equipo_deportivo.id_tipo_equipo_deportivo.toString()}
                                onChange={(e) => {
                                    const tipo = (tipo_equipo_deportivo.data) ? tipo_equipo_deportivo.data.filter(d => d.id === parseInt(e.target.value)) : [];
                                    onFormChange({ equipo_deportivo: { ...state.equipo_deportivo, tipo: (tipo.length > 0 && tipo[0] != null) ? tipo[0].es : 'ND', id_tipo_equipo_deportivo: parseInt(e.target.value) } })
                                }}
                                label='Tipo Equipo'
                            />
                            <FormGroup
                                className={classes['form-input-md']}
                                labelClassName={classes['form-input-label']}
                                value={state.equipo_deportivo?.descripcion}
                                onChange={(e) => {
                                    onFormChange({ equipo_deportivo: { ...state.equipo_deportivo, descripcion: e.target.value } })
                                }}
                                label='Descripcion'
                            />
                            <AddButton
                                aStyles={{ marginLeft: 0, width: 100 }}
                                onClick={() => {
                                    if (state.equipos_deportivos) {
                                        if (state.equipo_deportivo && state.equipo_deportivo.id_tipo_equipo_deportivo > 0 && state.equipo_deportivo.descripcion.length > 0) {
                                            onFormChange({ equipos_deportivos: state.equipos_deportivos.concat([state.equipo_deportivo]) });
                                        } else {
                                            notify('warning', 'Por favor llena todos los campos antes de intentar agregar el activo');
                                        }
                                    } else {
                                        onFormChange({ equipos_deportivos: [state.equipo_deportivo] })
                                    }
                                }}
                            />
                        </>
                    </MotionDiv>
                </MContainer>
            </Grid>
            <Grid item xs={12} md={9} lg={8}>
                <MotionDiv show={state.has_equipo_deportivo} animation='fade'>
                    <MContainer direction='vertical'>
                        <Divider style={{ marginTop: 32 }} />
                        <MTable
                            columnsHeader={[
                                <Typography key={1} fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                                    Tipo Equipo
                                </Typography>,
                                <Typography key={2} fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                                    Descripcion
                                </Typography>,
                                <Typography key={3} fontSize={'1.2rem'} fontWeight={600} component={'p'}>

                                </Typography>,
                            ]}
                            loading={!state.equipos_deportivos}
                            data={(state.equipos_deportivos) ? state.equipos_deportivos?.map((ed, j) => {
                                return {
                                    tipo: ed.tipo,
                                    descripcion: ed.descripcion,
                                    delete: <Button
                                        style={{ textTransform: 'capitalize', fontWeight: 800, color: '#069CB1' }}
                                        onClick={() => {
                                            if (state.equipos_deportivos) {
                                                onFormChange({ equipos_deportivos: state.equipos_deportivos.filter((v, i) => i !== j) });
                                            }
                                        }}
                                        variant="outlined"
                                        startIcon={<Close />}>
                                        Eliminar
                                    </Button>
                                }
                            }) : []}
                        />
                    </MContainer>
                </MotionDiv>
            </Grid>
        </Grid>
    )
}
