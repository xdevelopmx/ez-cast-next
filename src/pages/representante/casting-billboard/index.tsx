import { Box, Button, Dialog, DialogContent, DialogTitle, Divider, Grid, Typography } from '@mui/material'
import { type GetServerSideProps, type NextPage } from 'next'
import { type User } from 'next-auth'
import { getSession } from 'next-auth/react'
import Head from 'next/head'
import React, { useState, useEffect, useMemo } from 'react'
import { Alertas, FormGroup, MCheckboxGroup, MSelect, MainLayout, MenuLateral, type RolCompletoPreview, Tag } from '~/components'
import Constants from '~/constants'
import Image from 'next/image';
import { api } from '~/utils/api'
import { MContainer } from '~/components/layout/MContainer'
import useNotify from '~/hooks/useNotify'
import { Close } from '@mui/icons-material'
import { RolPreview } from '~/components/shared/RolPreview'
import { RolPreviewLoader } from '~/components/shared/RolPreviewLoader'
import { useRouter } from 'next/router'

const filtros_initial_state = {
    tipo_busqueda: 'todos',
    id_estado_republica: [],
    id_union: [],
    id_tipo_rol: [],
    tipo_rango_edad: ' ',
    edad_inicio: 0,
    edad_fin: 0,
    id_tipo_proyecto: [],
    id_genero_rol: [],
    id_apariencia_etnica: [],
    id_nacionalidades: [],
    id_preferencias_de_pago: [],
    autorellenar: true
}

type BillboardTalentosPageProps = {
    user: User,
    id_proyecto: number
}

const RepresentanteBillboardPage: NextPage<BillboardTalentosPageProps> = ({ user, id_proyecto }) => {

    const { query } = useRouter()
    const { talentoId = '-1' } = query

    const { notify } = useNotify();
    const [dialog, setDialog] = useState({ id: '', open: false, title: '' });
    const [pagination, setPagination] = useState({ page: 0, page_size: 5 });
    const [form_filtros, setFormFiltros] = useState<{
        tipo_busqueda: string,
        id_estado_republica: number[],
        id_union: number[],
        id_tipo_rol: string[],
        edad_inicio: number,
        edad_fin: number,
        id_tipo_proyecto: number[],
        id_genero_rol: number[],
        id_apariencia_etnica: number[],
        id_nacionalidades: number[],
        id_preferencias_de_pago: number[],
        autorellenar: boolean
    }>(filtros_initial_state);

    const talento = api.talentos.getCompleteById.useQuery({ id: parseInt(talentoId as string) }, {
        refetchOnWindowFocus: false
    });

    const roles_billboard = api.roles.getRolesBillboardTalentos.useQuery({
        tipo_busqueda: form_filtros.tipo_busqueda,
        id_estados_republica: form_filtros.id_estado_republica,
        id_uniones: form_filtros.id_union,
        tipos_roles: form_filtros.id_tipo_rol,
        edad_inicio: form_filtros.edad_inicio,
        edad_fin: form_filtros.edad_fin,
        id_tipos_proyectos: form_filtros.id_tipo_proyecto,
        id_generos_rol: form_filtros.id_genero_rol,
        id_apariencias_etnicas: form_filtros.id_apariencia_etnica,
        id_nacionalidades: form_filtros.id_nacionalidades,
        id_preferencias_de_pago: form_filtros.id_preferencias_de_pago,

        id_talento: parseInt(talentoId as string)
    }, {
        refetchOnWindowFocus: false
    })

    useEffect(() => {
        if (roles_billboard.data) {
            setPagination({ page: 0, page_size: pagination.page_size });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roles_billboard.data]);

    useEffect(() => {
        if (talento.data && form_filtros.autorellenar) {
            setFormFiltros(prev => {
                const id_union = talento.data?.info_basica?.union?.id_union;
                const edad = talento.data?.info_basica?.edad;
                const genero = talento.data?.filtros_aparencias?.genero.id;
                const apariencia_etnica = talento.data?.filtros_aparencias?.apariencia_etnica.id;
                const preferencia_de_pago = talento.data?.preferencias?.interes_en_proyectos.map(i => i.id_interes_en_proyecto);
                return {
                    ...prev,
                    id_union: (id_union) ? [id_union] : [],
                    edad_inicio: (edad) ? edad : 0,
                    edad_fin: (edad) ? edad : 0,
                    id_genero_rol: (genero) ? [genero] : [],
                    id_apariencia_etnica: (apariencia_etnica) ? [apariencia_etnica] : [],
                    id_preferencias_de_pago: (preferencia_de_pago) ? preferencia_de_pago : []
                }
            })
        }
    }, [talento.data, form_filtros.autorellenar]);

    const estados_republica = api.catalogos.getEstadosRepublica.useQuery(undefined, {
        refetchOnWindowFocus: false,
        refetchOnMount: false
    });

    const nacionalidades = api.catalogos.getNacionalidades.useQuery(undefined, {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    })

    const uniones = api.catalogos.getUniones.useQuery(undefined, {
        refetchOnWindowFocus: false,
        refetchOnMount: false
    });

    const tipos_roles = api.catalogos.getTiposRoles.useQuery(undefined, {
        refetchOnWindowFocus: false,
        refetchOnMount: false
    });

    const tipos_proyectos = api.catalogos.getTipoProyectos.useQuery(undefined, {
        refetchOnWindowFocus: false,
        refetchOnMount: false
    });

    const generos_rol = api.catalogos.getGeneros.useQuery(undefined, {
        refetchOnWindowFocus: false,
        refetchOnMount: false
    })

    const apariencias_etnicas = api.catalogos.getAparienciasEtnicas.useQuery(undefined, {
        refetchOnWindowFocus: false,
        refetchOnMount: false
    })

    const _data = useMemo(() => {
        if (roles_billboard.isFetching) {
            return Array.from({ length: 5 }).map((n, i) => {
                return <RolPreviewLoader key={i} />
            })
        } else {
            if (roles_billboard.data) {
                return roles_billboard.data.map((rol, i) => (
                    <RolPreview key={rol.id} rol={rol as unknown as RolCompletoPreview} />
                ))
            }
        }
        return [];
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roles_billboard.isFetching, roles_billboard.data]);

    const paginated_data = useMemo(() => {
        const start = (pagination.page * pagination.page_size);
        const end = (pagination.page * pagination.page_size) + pagination.page_size;
        const sliced_data = _data.slice(start, end);
        if (sliced_data.length === 0 && pagination.page > 0) {
            setPagination(v => { return { ...v, page: v.page - 1 } });
        }
        return sliced_data;
    }, [pagination, _data]);

    return (
        <>
            <Head>
                <title>Talento | Talent Corner</title>
                <meta name="description" content="Talent Corner" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <MainLayout menuSiempreBlanco={true}>
                <div className="d-flex wrapper_ezc">
                    <MenuLateral />
                    <div className="seccion_container col" style={{ paddingTop: 0 }}>
                        <br /><br />
                        <div className="container_box_header">
                            <div className="d-flex justify-content-end align-items-start py-2">
                                <Alertas />
                            </div>

                            <Grid container>
                                <Grid xs={12} mt={4}>
                                    <Typography fontWeight={800} sx={{ fontSize: '2rem' }}>Casting Billboard</Typography>
                                </Grid>
                                <Grid xs={12}>
                                    <Grid container mt={4}>
                                        <Grid item container xs={12}>
                                            <Grid xs={2}>
                                                <Typography fontWeight={600} sx={{ color: '#069cb1', fontSize: '1.1rem' }}>Filtros</Typography>
                                            </Grid>
                                            <Grid xs={4}>
                                                {roles_billboard.data && roles_billboard.data.length > 0 &&
                                                    <Typography fontWeight={600} sx={{ color: '#069cb1', fontSize: '0.8rem', textAlign: 'center' }}>
                                                        {((pagination.page + 1) * pagination.page_size) > roles_billboard.data?.length ? roles_billboard.data?.length : (pagination.page + 1) * pagination.page_size} de {roles_billboard.data?.length} resultados totales
                                                    </Typography>
                                                }

                                            </Grid>
                                            <Grid xs={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                <Typography fontWeight={600} sx={{ color: '#069cb1', fontSize: '1.1rem' }}>
                                                    Ver {pagination.page_size} resultados por página
                                                    {roles_billboard.data && roles_billboard.data.length > 0 &&
                                                        <Typography fontWeight={600} component={'span'} sx={{ paddingLeft: '40px' }}>
                                                            Pagina {(pagination.page + 1)} de {Math.ceil(roles_billboard.data.length / pagination.page_size)}
                                                        </Typography>
                                                    }
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Divider sx={{ borderColor: '#069cb1', borderWidth: 1 }} />
                                        </Grid>

                                        <Grid item container xs={12} sx={{ backgroundColor: '#EBEBEB', padding: '10px 20px' }} mt={4}>
                                            <Grid item container xs={12}>
                                                <Grid container xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        <Typography>Buscar:</Typography>
                                                        <MSelect
                                                            id="filtro-rol-proyecto-todos"
                                                            options={[
                                                                { value: 'todos', label: 'Todos' },
                                                                { value: 'por_rol', label: 'Por Rol' },
                                                                { value: 'por_proyecto', label: 'Por proyecto' },
                                                            ]}
                                                            styleRoot={{ width: 128 }}
                                                            style={{ width: '100%', fontSize: '0.8rem' }}
                                                            value={form_filtros.tipo_busqueda}
                                                            onChange={(e) => {
                                                                setFormFiltros(prev => { return { ...prev, tipo_busqueda: e.target.value } })
                                                            }}
                                                            label=''
                                                            disable_default_option
                                                        />
                                                        <FormGroup
                                                            className={'form-input-md'}
                                                            type="search"
                                                            rootStyle={{ margin: 0, width: '130px' }}
                                                            style={{ border: 'none', width: '100%', fontSize: '0.8rem' }}
                                                            onChange={(e) => {
                                                                console.log(e);
                                                            }}
                                                        />
                                                        <MCheckboxGroup
                                                            onChange={(e, i) => {
                                                                setFormFiltros(prev => { return { ...prev, autorellenar: e } })
                                                            }}
                                                            direction='vertical'
                                                            id="talento-autorellenar"
                                                            options={['Auto-rellenar basado en perfil']}
                                                            labelStyle={{ fontWeight: '400', fontSize: '1.1rem', margin: 0 }}
                                                            values={[form_filtros.autorellenar]}
                                                        />
                                                    </Box>
                                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                        <Button variant='text' onClick={() => {
                                                            setFormFiltros(prev => { return { ...prev, ...filtros_initial_state, autorellenar: false } })
                                                        }}
                                                        >
                                                            Eliminar filtros
                                                        </Button>
                                                        <Button
                                                            onClick={() => { setDialog({ id: 'filtros', title: 'Filtros Aplicados', open: true }) }}
                                                            sx={{
                                                                backgroundColor: '#069cb1',
                                                                borderRadius: '2rem',
                                                                color: '#fff',
                                                                textTransform: 'none',
                                                                padding: '0px 35px',

                                                                '&:hover': {
                                                                    backgroundColor: '#069cb1'
                                                                }
                                                            }}>
                                                            Filtros
                                                        </Button>
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                            <Grid container xs={12} mt={2} gap={1}>
                                                <MSelect
                                                    id="ubicacion-select"
                                                    renderValue={(selected) => {
                                                        return '';
                                                    }}
                                                    placeholder={'Ubicacion'}
                                                    value={form_filtros.id_estado_republica.map(r => r.toString())}
                                                    styleRoot={{ width: '100px', padding: 0 }}
                                                    style={{ width: '100%', fontSize: '0.8rem' }}
                                                    onChange={(e) => {
                                                        setFormFiltros(prev => { return { ...prev, id_estado_republica: `${e.target.value}`.split(',').map(id => parseInt(id)).filter(id => !isNaN(id)) } })
                                                    }}
                                                    multiple
                                                    options={(estados_republica.data) ? estados_republica.data.map(er => { return { label: er.es, value: er.id.toString() } }) : []}
                                                />
                                                <MSelect
                                                    id="union-select"
                                                    renderValue={(selected) => {
                                                        return '';
                                                    }}
                                                    placeholder={'Union'}
                                                    disabled={form_filtros.autorellenar}
                                                    styleRoot={{ width: '76px' }}
                                                    style={{ width: '100%', fontSize: '0.8rem' }}
                                                    value={form_filtros.id_union.map(r => r.toString())}
                                                    onChange={(e) => {
                                                        setFormFiltros(prev => { return { ...prev, id_union: `${e.target.value}`.split(',').map(id => parseInt(id)).filter(id => !isNaN(id)) } })
                                                    }}
                                                    multiple
                                                    options={(uniones.data) ? uniones.data.map(er => { return { label: er.es, value: er.id.toString() } }) : []}
                                                />

                                                <MSelect
                                                    id="tipos-roles-select"

                                                    styleRoot={{ width: '90px' }}
                                                    style={{ width: '100%', fontSize: '0.8rem' }}
                                                    value={form_filtros.id_tipo_rol.map(r => r)}
                                                    onChange={(e) => {
                                                        setFormFiltros(prev => { return { ...prev, id_tipo_rol: `${e.target.value}`.split(',').map(id => id).filter(id => id !== '') } })
                                                    }}
                                                    renderValue={(selected) => {
                                                        return '';
                                                    }}
                                                    placeholder={'Tipo Rol'}
                                                    multiple
                                                    options={[{ label: 'Principal', value: 'PRINCIPAL' }, { label: 'Extra', value: 'EXTRA' }]}
                                                />


                                                <Box display={'flex'} position={'relative'} flexDirection={'row'} gap={1}>
                                                    <Typography textAlign={'center'} fontSize={'1rem'} style={{
                                                        position: 'absolute',
                                                        top: -24,
                                                        left: 4
                                                    }}>
                                                        Rango de edad
                                                    </Typography>
                                                    <FormGroup
                                                        placeholder='Desde Edad'
                                                        className={'form-input-md'}
                                                        type='number'
                                                        value={form_filtros.edad_inicio.toString()}
                                                        rootStyle={{ margin: 0, width: '48px' }}
                                                        style={{ border: 'none', width: '100%', fontSize: '0.8rem' }}
                                                        onChange={(e) => {
                                                            setFormFiltros(prev => { return { ...prev, edad_inicio: parseInt(e.target.value) } })
                                                        }}
                                                    />
                                                    <FormGroup
                                                        placeholder='Hasta Edad'
                                                        className={'form-input-md'}
                                                        type="number"
                                                        value={form_filtros.edad_fin.toString()}
                                                        rootStyle={{ margin: 0, width: '48px' }}
                                                        style={{ border: 'none', width: '100%', fontSize: '0.8rem' }}
                                                        onChange={(e) => {
                                                            setFormFiltros(prev => { return { ...prev, edad_fin: parseInt(e.target.value) } })
                                                        }}
                                                    />

                                                </Box>
                                                <MSelect
                                                    id="tipos-proyectos-select"

                                                    styleRoot={{ width: '120px' }}
                                                    style={{ width: '100%', fontSize: '0.8rem' }}
                                                    value={form_filtros.id_tipo_proyecto.map(r => r.toString())}
                                                    onChange={(e) => {
                                                        setFormFiltros(prev => { return { ...prev, id_tipo_proyecto: `${e.target.value}`.split(',').map(id => parseInt(id)).filter(id => !isNaN(id)) } })
                                                    }}
                                                    renderValue={(selected) => {
                                                        return '';
                                                    }}
                                                    placeholder='Tipo Proyecto'
                                                    multiple
                                                    options={(tipos_proyectos.data) ? tipos_proyectos.data.map(er => { return { label: er.es, value: er.id.toString() } }) : []}
                                                />

                                                <MSelect
                                                    id="generos-select"
                                                    disabled={form_filtros.autorellenar}
                                                    styleRoot={{ width: '110px' }}
                                                    style={{ width: '100%', fontSize: '0.8rem' }}
                                                    value={form_filtros.id_genero_rol.map(r => r.toString())}
                                                    onChange={(e) => {
                                                        const v_exploded = `${e.target.value}`.split(',');
                                                        const v = v_exploded[v_exploded.length - 1];
                                                        const value: number = parseInt((v) ? v : '');
                                                        setFormFiltros(prev => { return { ...prev, id_genero_rol: !isNaN(value) ? [value] : [] } })
                                                    }}
                                                    renderValue={(selected) => {
                                                        return '';
                                                    }}
                                                    placeholder={'Genero Rol'}
                                                    multiple
                                                    options={(generos_rol.data) ? generos_rol.data.map(er => { return { label: er.es, value: er.id.toString() } }) : []}
                                                />
                                                <MSelect
                                                    id="apariencias-etnicas-select"
                                                    styleRoot={{ width: '150px' }}
                                                    style={{ fontSize: '0.8rem' }}
                                                    value={form_filtros.id_apariencia_etnica.map(r => r.toString())}
                                                    onChange={(e) => {
                                                        const v_exploded = `${e.target.value}`.split(',');
                                                        const v = v_exploded[v_exploded.length - 1];
                                                        const value: number = parseInt((v) ? v : '');
                                                        setFormFiltros(prev => { return { ...prev, id_apariencia_etnica: !isNaN(value) ? [value] : [] } })
                                                    }}
                                                    button_props={{
                                                        fontSize: '2rem',
                                                        position: 'absolute',
                                                        height: '100%',
                                                        top: 0,
                                                        right: '16px'
                                                    }}
                                                    renderValue={(selected) => {
                                                        return '';
                                                    }}
                                                    placeholder={'Apariencia Etnica'}
                                                    multiple
                                                    options={(apariencias_etnicas.data) ? apariencias_etnicas.data.map(er => { return { label: er.nombre, value: er.id.toString() } }) : []}
                                                />
                                                <MSelect
                                                    id="nacionalidades-etnicas-select"
                                                    styleRoot={{ width: '170px' }}
                                                    style={{ fontSize: '0.8rem' }}
                                                    value={form_filtros.id_nacionalidades.map(r => r.toString())}
                                                    onChange={(e) => {
                                                        const v_exploded = `${e.target.value}`.split(',');
                                                        const v = v_exploded[v_exploded.length - 1];
                                                        const value: number = parseInt((v) ? v : '');
                                                        setFormFiltros(prev => { return { ...prev, id_nacionalidades: !isNaN(value) ? [value] : [] } })
                                                    }}
                                                    button_props={{
                                                        fontSize: '2rem',
                                                        position: 'absolute',
                                                        height: '100%',
                                                        top: 0,
                                                        right: '16px'
                                                    }}
                                                    renderValue={(selected) => {
                                                        return '';
                                                    }}
                                                    placeholder={'Nacionalidad / Etnia'}
                                                    multiple
                                                    options={(nacionalidades.data) ? nacionalidades.data.map(er => { return { label: er.es, value: er.id.toString() } }) : []}
                                                />
                                                <MSelect
                                                    id="preferencias-pago-select"

                                                    styleRoot={{ width: '138px' }}
                                                    style={{ width: '100%', fontSize: '0.8rem' }}
                                                    value={form_filtros.id_preferencias_de_pago.map(r => r.toString())}
                                                    onChange={(e) => {
                                                        setFormFiltros(prev => { return { ...prev, id_preferencias_de_pago: `${e.target.value}`.split(',').map(id => parseInt(id)).filter(id => !isNaN(id)) } })
                                                    }}
                                                    renderValue={(selected) => {
                                                        return '';
                                                    }}
                                                    placeholder='Preferencia pago'
                                                    multiple
                                                    options={[{ label: 'Pagado', value: '1' }, { label: 'No Pagado', value: '2' }]}
                                                />
                                            </Grid>
                                        </Grid>

                                        <Grid xs={12} container gap={2} mt={4}>
                                            <MContainer direction='horizontal'>
                                                <Typography mr={1}>Filtros Aplicados: </Typography>
                                                <MContainer direction='horizontal' justify='space-between' styles={{ gap: 8 }}>
                                                    {form_filtros.id_estado_republica.length === 0 && form_filtros.id_union.length === 0 &&
                                                        form_filtros.id_tipo_rol.length === 0 && (form_filtros.edad_inicio <= 0 || form_filtros.edad_fin <= 0 || (form_filtros.edad_fin < form_filtros.edad_inicio)) &&
                                                        form_filtros.id_tipo_proyecto.length === 0 && form_filtros.id_genero_rol.length === 0 &&
                                                        form_filtros.id_apariencia_etnica.length === 0 && form_filtros.id_preferencias_de_pago.length === 0 &&
                                                        <Typography mt={0.5} variant='body2'>No se ha agregado ningun filtro</Typography>
                                                    }
                                                    {form_filtros.id_estado_republica.length > 0 && <Tag text={`Ubicacion`}
                                                        onRemove={(e) => {
                                                            setFormFiltros(prev => { return { ...prev, id_estado_republica: [] } })
                                                        }}
                                                    />}
                                                    {form_filtros.id_union.length > 0 && <Tag text={`Union`}
                                                        onRemove={(e) => {
                                                            if (form_filtros.autorellenar) {
                                                                notify('warning', 'No se puede quitar este filtro cuando esta activada la opcion de autorellenado');
                                                            } else {
                                                                setFormFiltros(prev => { return { ...prev, id_union: [] } })
                                                            }
                                                        }}
                                                    />}
                                                    {form_filtros.id_tipo_rol.length > 0 && <Tag text={`Tipo Rol`}
                                                        onRemove={(e) => {
                                                            setFormFiltros(prev => { return { ...prev, id_tipo_rol: [] } })
                                                        }}
                                                    />}
                                                    {form_filtros.edad_inicio > 0 && form_filtros.edad_fin > 0 && (form_filtros.edad_fin >= form_filtros.edad_inicio) && <Tag text={`Rango Edad`}
                                                        onRemove={(e) => {
                                                            setFormFiltros(prev => { return { ...prev, tipo_rango_edad: ' ' } })
                                                        }}
                                                    />}
                                                    {form_filtros.id_tipo_proyecto.length > 0 && <Tag text={`Tipo Proyecto`}
                                                        onRemove={(e) => {
                                                            setFormFiltros(prev => { return { ...prev, id_tipo_proyecto: [] } })
                                                        }}
                                                    />}
                                                    {form_filtros.id_genero_rol.length > 0 && <Tag text={`Genero Rol`}
                                                        onRemove={(e) => {
                                                            if (form_filtros.autorellenar) {
                                                                notify('warning', 'No se puede quitar este filtro cuando esta activada la opcion de autorellenado');
                                                            } else {
                                                                setFormFiltros(prev => { return { ...prev, id_genero_rol: [] } })
                                                            }
                                                        }}
                                                    />}
                                                    {form_filtros.id_apariencia_etnica.length > 0 && <Tag text={`Apariencia Etnica`}
                                                        onRemove={(e) => {
                                                            setFormFiltros(prev => { return { ...prev, id_apariencia_etnica: [] } })
                                                        }}
                                                    />}
                                                    {form_filtros.id_nacionalidades.length > 0 && <Tag text={`Nacionalidad / Etnia`}
                                                        onRemove={(e) => {
                                                            setFormFiltros(prev => { return { ...prev, id_nacionalidades: [] } })
                                                        }}
                                                    />}
                                                    {form_filtros.id_preferencias_de_pago.length > 0 && <Tag text={`Preferencias Pago`}
                                                        onRemove={(e) => {
                                                            setFormFiltros(prev => { return { ...prev, id_preferencias_de_pago: [] } })
                                                        }}
                                                    />}
                                                </MContainer>
                                            </MContainer>
                                        </Grid>
                                        <Grid xs={12} container gap={2} mt={4}>
                                            {paginated_data}
                                        </Grid>
                                        <Grid xs={12} mt={4}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Button
                                                    disabled={!roles_billboard.data || ((pagination.page + 1) * pagination.page_size - pagination.page_size) <= 0}
                                                    sx={{ textTransform: 'none' }}
                                                    onClick={() => {
                                                        setPagination(prev => { return { ...prev, page: prev.page - 1 } });
                                                    }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <Image src="/assets/img/iconos/arow_l_blue.svg" width={15} height={15} alt="" />
                                                        <Typography fontWeight={600}>Página previa</Typography>
                                                    </Box>
                                                </Button>

                                                {roles_billboard.data && roles_billboard.data.length > 0 &&
                                                    <Typography sx={{ color: '#069cb1' }} fontWeight={600}>
                                                        Pagina {(pagination.page + 1)} de {Math.ceil(roles_billboard.data.length / pagination.page_size)}
                                                    </Typography>
                                                }
                                                <Button
                                                    disabled={!roles_billboard.data || (pagination.page + 1) * pagination.page_size > roles_billboard.data.length}
                                                    sx={{ textTransform: 'none' }}
                                                    onClick={() => {
                                                        setPagination(prev => { return { ...prev, page: prev.page + 1 } });
                                                    }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <Typography fontWeight={600}>Siguiente página</Typography>
                                                        <Image src="/assets/img/iconos/arow_r_blue.svg" width={15} height={15} alt="" />
                                                    </Box>
                                                </Button>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>

                        </div>
                    </div>
                </div>
                <Dialog maxWidth={'md'} style={{ padding: 0, margin: 0, overflow: 'hidden' }} open={dialog.id === 'filtros' && dialog.open} onClose={() => setDialog({ ...dialog, open: false })}>
                    <DialogTitle align='left' style={{ color: '#069cb1' }}>{dialog.title}</DialogTitle>
                    <DialogContent style={{ padding: 0, width: 650, overflow: 'hidden' }}>
                        <Box px={4} width={700}>
                            <MContainer direction='horizontal'>
                                <Typography fontSize={'1.2rem'} mr={2}>Tipos de Rol</Typography>
                                <Button onClick={() => { setFormFiltros(prev => { return { ...prev, id_tipo_rol: [] } }) }} style={{ textDecoration: 'underline' }} size="small" variant='text'>Eliminar Todos</Button>
                            </MContainer>
                            {form_filtros.id_tipo_rol.length === 0 &&
                                <Typography variant='body2'>No se han seleccionado opciones</Typography>
                            }
                            {form_filtros.id_tipo_rol.map((tipo, i) => {
                                return (
                                    <Tag key={i} styles={{ marginRight: 1 }} text={tipo === 'PRINCIPAL' ? 'Principal' : 'Extra'}
                                        onRemove={(e) => {
                                            setFormFiltros(prev => { return { ...prev, id_tipo_rol: form_filtros.id_tipo_rol.filter(i => i !== tipo) } })
                                        }}
                                    />
                                )
                            })}

                            <MContainer styles={{ marginTop: 16 }} direction='horizontal'>
                                <Typography fontSize={'1.2rem'} mr={2}>Tipos de Proyecto</Typography>
                                <Button onClick={() => { setFormFiltros(prev => { return { ...prev, id_tipo_proyecto: [] } }) }} style={{ textDecoration: 'underline' }} size="small" variant='text'>Eliminar Todos</Button>
                            </MContainer>
                            {form_filtros.id_tipo_proyecto.length === 0 &&
                                <Typography variant='body2'>No se han seleccionado opciones</Typography>
                            }
                            {form_filtros.id_tipo_proyecto.map((tipo, i) => {
                                const tipo_proyecto = tipos_proyectos.data?.filter(tp => tp.id === tipo)[0];
                                if (tipo_proyecto) {
                                    return (
                                        <Tag key={i} styles={{ marginRight: 1 }} text={tipo_proyecto.es}
                                            onRemove={(e) => {
                                                setFormFiltros(prev => { return { ...prev, id_tipo_proyecto: form_filtros.id_tipo_proyecto.filter(i => i !== tipo) } })
                                            }}
                                        />
                                    )
                                }
                            })}

                            <MContainer styles={{ marginTop: 16 }} direction='horizontal'>
                                <Typography fontSize={'1.2rem'} mr={2}>Preferencias de Pago</Typography>
                                <Button onClick={() => { setFormFiltros(prev => { return { ...prev, id_preferencias_de_pago: [] } }) }} style={{ textDecoration: 'underline' }} size="small" variant='text'>Eliminar Todos</Button>
                            </MContainer>
                            {form_filtros.id_preferencias_de_pago.length === 0 &&
                                <Typography variant='body2'>No se han seleccionado opciones</Typography>
                            }
                            {form_filtros.id_preferencias_de_pago.map((tipo, i) => {
                                return (
                                    <Tag key={i} styles={{ marginRight: 1 }} text={tipo === 1 ? 'Pagado' : 'No Pagado'}
                                        onRemove={(e) => {
                                            setFormFiltros(prev => { return { ...prev, id_preferencias_de_pago: form_filtros.id_preferencias_de_pago.filter(i => i !== tipo) } })
                                        }}
                                    />
                                )
                            })}

                            <MContainer styles={{ marginTop: 16 }} direction='horizontal'>
                                <Typography fontSize={'1.2rem'} mr={2}>Unión</Typography>
                                <Button onClick={() => {
                                    if (form_filtros.autorellenar) {
                                        notify('warning', 'No se puede quitar este filtro cuando esta activada la opcion de autorellenado');
                                    } else {
                                        setFormFiltros(prev => { return { ...prev, id_union: [] } })
                                    }
                                }} style={{ textDecoration: 'underline' }} size="small" variant='text'>Eliminar Todos</Button>
                            </MContainer>
                            {form_filtros.id_union.length === 0 &&
                                <Typography variant='body2'>No se han seleccionado opciones</Typography>
                            }
                            {form_filtros.id_union.map((tipo, i) => {
                                const union = uniones.data?.filter(tp => tp.id === tipo)[0];
                                if (union) {
                                    return (
                                        <Tag key={i} styles={{ marginRight: 1 }} text={union.es}
                                            onRemove={(e) => {
                                                if (form_filtros.autorellenar) {
                                                    notify('warning', 'No se puede quitar este filtro cuando esta activada la opcion de autorellenado');
                                                } else {
                                                    setFormFiltros(prev => { return { ...prev, id_union: form_filtros.id_union.filter(i => i !== tipo) } })
                                                }
                                            }}
                                        />
                                    )
                                }
                            })}

                            <MContainer styles={{ marginTop: 16 }} direction='horizontal'>
                                <Typography fontSize={'1.2rem'} mr={2}>Género de rol</Typography>
                                <Button onClick={() => {
                                    if (form_filtros.autorellenar) {
                                        notify('warning', 'No se puede quitar este filtro cuando esta activada la opcion de autorellenado');
                                    } else {
                                        setFormFiltros(prev => { return { ...prev, id_genero_rol: [] } })
                                    }
                                }} style={{ textDecoration: 'underline' }} size="small" variant='text'>Eliminar Todos</Button>
                            </MContainer>
                            {form_filtros.id_genero_rol.length === 0 &&
                                <Typography variant='body2'>No se han seleccionado opciones</Typography>
                            }
                            {form_filtros.id_genero_rol.map((tipo, i) => {
                                const genero = generos_rol.data?.filter(tp => tp.id === tipo)[0];
                                if (genero) {
                                    return (
                                        <Tag key={i} styles={{ marginRight: 1 }} text={genero.es}
                                            onRemove={(e) => {
                                                if (form_filtros.autorellenar) {
                                                    notify('warning', 'No se puede quitar este filtro cuando esta activada la opcion de autorellenado');
                                                } else {
                                                    setFormFiltros(prev => { return { ...prev, id_genero_rol: form_filtros.id_genero_rol.filter(i => i !== tipo) } })
                                                }
                                            }}
                                        />
                                    )
                                }
                            })}

                            <MContainer styles={{ marginTop: 16 }} direction='horizontal'>
                                <Typography fontSize={'1.2rem'} mr={2}>Apariencia Étnica</Typography>
                                <Button onClick={() => { setFormFiltros(prev => { return { ...prev, id_apariencia_etnica: [] } }) }} style={{ textDecoration: 'underline' }} size="small" variant='text'>Eliminar Todos</Button>
                            </MContainer>
                            {form_filtros.id_apariencia_etnica.length === 0 &&
                                <Typography variant='body2'>No se han seleccionado opciones</Typography>
                            }
                            {form_filtros.id_apariencia_etnica.map((tipo, i) => {
                                const etnia = apariencias_etnicas.data?.filter(tp => tp.id === tipo)[0];
                                if (etnia) {
                                    return (
                                        <Tag key={i} styles={{ marginRight: 1 }} text={etnia.nombre}
                                            onRemove={(e) => {
                                                setFormFiltros(prev => { return { ...prev, id_apariencia_etnica: form_filtros.id_apariencia_etnica.filter(i => i !== tipo) } })
                                            }}
                                        />
                                    )
                                }
                            })}

                            <MContainer styles={{ marginTop: 16 }} direction='horizontal'>
                                <Typography fontSize={'1.2rem'} mr={2}>Nacionalidad / Étna</Typography>
                                <Button onClick={() => { setFormFiltros(prev => { return { ...prev, id_nacionalidades: [] } }) }} style={{ textDecoration: 'underline' }} size="small" variant='text'>Eliminar Todos</Button>
                            </MContainer>
                            {form_filtros.id_nacionalidades.length === 0 &&
                                <Typography variant='body2'>No se han seleccionado opciones</Typography>
                            }
                            {form_filtros.id_nacionalidades.map((tipo, i) => {
                                const nacionalidad = nacionalidades.data?.filter(tp => tp.id === tipo)[0];
                                if (nacionalidad) {
                                    return (
                                        <Tag key={i} styles={{ marginRight: 1 }} text={nacionalidad.es}
                                            onRemove={(e) => {
                                                setFormFiltros(prev => { return { ...prev, id_nacionalidades: form_filtros.id_nacionalidades.filter(i => i !== tipo) } })
                                            }}
                                        />
                                    )
                                }
                            })}

                            <MContainer styles={{ marginTop: 16 }} direction='horizontal'>
                                <Typography fontSize={'1.2rem'} mr={2}>Ubicación</Typography>
                                <Button onClick={() => { setFormFiltros(prev => { return { ...prev, id_estado_republica: [] } }) }} style={{ textDecoration: 'underline' }} size="small" variant='text'>Eliminar Todos</Button>
                            </MContainer>
                            {form_filtros.id_estado_republica.length === 0 &&
                                <Typography variant='body2'>No se han seleccionado opciones</Typography>
                            }
                            {form_filtros.id_estado_republica.map((tipo, i) => {
                                const ubicacion = estados_republica.data?.filter(tp => tp.id === tipo)[0];
                                if (ubicacion) {
                                    return (
                                        <Tag key={i} styles={{ marginRight: 1 }} text={ubicacion.es}
                                            onRemove={(e) => {
                                                setFormFiltros(prev => { return { ...prev, id_estado_republica: form_filtros.id_estado_republica.filter(i => i !== tipo) } })
                                            }}
                                        />
                                    )
                                }
                            })}

                            <MContainer styles={{ marginTop: 16 }} direction='horizontal'>
                                <Typography fontSize={'1.2rem'} mr={2}>Rango de edad</Typography>
                                <Button onClick={() => { setFormFiltros(prev => { return { ...prev, edad_inicio: 0, edad_fin: 0 } }) }} style={{ textDecoration: 'underline' }} size="small" variant='text'>Eliminar Todos</Button>
                            </MContainer>
                            {(form_filtros.edad_inicio <= 0 || form_filtros.edad_fin <= 0 || (form_filtros.edad_fin < form_filtros.edad_inicio)) &&
                                <Typography variant='body2'>No se han seleccionado opciones</Typography>
                            }
                            {form_filtros.edad_inicio > 0 && form_filtros.edad_fin > 0 && (form_filtros.edad_fin >= form_filtros.edad_inicio) &&
                                <Tag styles={{ marginRight: 1 }} text={`De ${form_filtros.edad_inicio} a ${form_filtros.edad_fin}`}
                                    onRemove={(e) => {
                                        setFormFiltros(prev => { return { ...prev, edad_inicio: 0, edad_fin: 0 } })
                                    }}
                                />
                            }
                        </Box>
                    </DialogContent>
                    <Box style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                        <Button style={{ marginLeft: 8, marginRight: 8 }} startIcon={<Close />} onClick={() => setDialog({ ...dialog, open: false })}>Cerrar</Button>
                    </Box>
                </Dialog>
            </MainLayout>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);
    let id_proyecto = 0;
    if (context.query) {
        id_proyecto = parseInt(context.query['id-proyecto'] as string);
    }
    if (session && session.user) {
        //if (session.user.tipo_usuario === TipoUsuario.TALENTO) {
        return {
            props: {
                user: session.user,
                id_proyecto: id_proyecto
            }
        }
        //}
        return {
            redirect: {
                destination: `/error?cause=${Constants.PAGE_ERRORS.UNAUTHORIZED_USER_ROLE}`,
                permanent: true
            }
        }
    }
    return {
        redirect: {
            destination: '/',
            permanent: true,
        },
    }
}

export default RepresentanteBillboardPage