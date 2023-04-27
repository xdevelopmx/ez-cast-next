import { Box, Button, Divider, Grid, Typography } from '@mui/material'
import { GetServerSideProps, type NextPage } from 'next'
import { User } from 'next-auth'
import { getSession } from 'next-auth/react'
import Head from 'next/head'
import React, { useState } from 'react'
import { Alertas, FormGroup, MCheckboxGroup, MSelect, MainLayout, MenuLateral, RolesTable } from '~/components'
import Constants from '~/constants'
import { TipoUsuario } from '~/enums'
import Image from 'next/image';
import { api } from '~/utils/api'
import MotionDiv from '~/components/layout/MotionDiv'

type BillboardTalentosPageProps = {
    user: User,
    id_proyecto: number
}


const BillboardPage: NextPage<BillboardTalentosPageProps> = ({ user, id_proyecto }) => {
    const [form_filtros, setFormFiltros] = useState<{
        tipo_busqueda: string,
        id_estado_republica: number,
        id_union: number,
        id_tipo_rol: number,
        tipo_rango_edad: string,
        edad_inicio: number,
        edad_fin: number,
        id_tipo_proyecto: number,
        id_genero_rol: number,
        id_apariencia_etnica: number,
        id_preferencias_de_pago: number,
        autorellenar: boolean
    }>({
        tipo_busqueda: 'todos',
        id_estado_republica: 0,
        id_union: 0,
        id_tipo_rol: 0,
        tipo_rango_edad: '',
        edad_inicio: 0,
        edad_fin: 0,
        id_tipo_proyecto: 0,
        id_genero_rol: 0,
        id_apariencia_etnica: 0,
        id_preferencias_de_pago: 0,
        autorellenar: false
    });

    const estados_republica = api.catalogos.getEstadosRepublica.useQuery(undefined, {
        refetchOnWindowFocus: false,
        refetchOnMount: false
    });

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

    const preferencias_pago = api.catalogos.getTiposCompensacionesNoMonetarias.useQuery(undefined, {
        refetchOnWindowFocus: false,
        refetchOnMount: false
    })

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
                                                <Typography fontWeight={600} sx={{ color: '#069cb1', fontSize: '1.1rem', textAlign: 'center' }}>
                                                    12 de 25 resultados totales
                                                </Typography>
                                            </Grid>
                                            <Grid xs={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                <Typography fontWeight={600} sx={{ color: '#069cb1', fontSize: '1.1rem' }}>
                                                    Ver 25 resultados por página
                                                    <Typography fontWeight={600} component={'span'} sx={{ paddingLeft: '40px' }}>
                                                        Pagina 1 de 1
                                                    </Typography>
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
                                                            style={{ width: '100%' }}
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
                                                            style={{ border: 'none', width: '100%' }}
                                                            onChange={(e) => {
                                                                
                                                            }}
                                                        />
                                                        <MCheckboxGroup
                                                            onChange={(e, i) => {
                                                            } }
                                                            direction='vertical'
                                                            id="talento-debera-incluir-rol"
                                                            options={['Auto-rellenar basado en perfil']}
                                                            labelStyle={{ fontWeight: '400', fontSize: '1.1rem', margin: 0 }} values={[]}                                                            
                                                        />
                                                    </Box>
                                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                        <Typography sx={{ color: '#069cb1' }}>Eliminar filtros</Typography>
                                                        <Button
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
                                                    value={form_filtros.id_estado_republica.toString()}
                                                    styleRoot={{ width: '200px' }}
                                                    style={{ width: '100%' }}
                                                    onChange={(e) => {
                                                        setFormFiltros(prev => { return { ...prev, id_estado_republica: parseInt(e.target.value) } })
                                                    } } 
                                                    default_value_label="Ubicación"
                                                    options={(estados_republica.data) ? estados_republica.data.map(er => { return { label: er.es, value: er.id.toString() } }) : []}                                                
                                                />
                                                <MSelect
                                                    id="union-select"

                                                    styleRoot={{ width: '200px' }}
                                                    style={{ width: '100%' }}
                                                    value={form_filtros.id_union.toString()}
                                                    onChange={(e) => {
                                                        setFormFiltros(prev => { return { ...prev, id_union: parseInt(e.target.value) } })
                                                    } }
                                                    default_value_label="Selecciona una union"
                                                    options={(uniones.data) ? uniones.data.map(er => { return { label: er.es, value: er.id.toString() } }) : []}   
                                                />

                                                <MSelect
                                                    id="tipos-roles-select"

                                                    styleRoot={{ width: '200px' }}
                                                    style={{ width: '100%' }}
                                                    value={form_filtros.id_tipo_rol.toString()}
                                                    onChange={(e) => {
                                                        setFormFiltros(prev => { return { ...prev, id_tipo_rol: parseInt(e.target.value) } })
                                                    } } 
                                                    default_value_label="Selecciona un tipo de rol"
                                                    options={(tipos_roles.data) ? tipos_roles.data.map(er => { return { label: er.es, value: er.id.toString() } }) : []}                                               
                                                />

                                                <MSelect
                                                    id="rango-de-edad-select"
                                                    styleRoot={{ width: '200px' }}
                                                    style={{ width: '100%' }}
                                                    value={form_filtros.tipo_rango_edad}
                                                    onChange={(e) => {
                                                        setFormFiltros(prev => { return { ...prev, tipo_rango_edad: e.target.value } })
                                                    } } 
                                                    default_value_label="Selecciona un tipo de rango"
                                                    options={[
                                                        { label: 'Rango', value: 'rango' },
                                                        { label: 'Mayor que', value: 'mayor_que' },
                                                        { label: 'Menor que', value: 'menor_que' },
                                                        { label: 'Igual que', value: 'igual_que' }  
                                                    ]}                                                
                                                />
                                                <MotionDiv show={form_filtros.tipo_rango_edad.trim().length === 0}>

                                                </MotionDiv>

                                                <MSelect
                                                    id="tipos-proyectos-select"

                                                    styleRoot={{ width: '200px' }}
                                                    style={{ width: '100%' }}
                                                    value={form_filtros.id_tipo_proyecto.toString()}
                                                    onChange={(e) => {
                                                        setFormFiltros(prev => { return { ...prev, id_tipo_proyecto: parseInt(e.target.value) } })
                                                    } } 
                                                    default_value_label="Selecciona un tipo de proyecto"
                                                    options={(tipos_proyectos.data) ? tipos_proyectos.data.map(er => { return { label: er.es, value: er.id.toString() } }) : []}                                                 
                                                />

                                                <MSelect
                                                    id="generos-select"

                                                    styleRoot={{ width: '200px' }}
                                                    style={{ width: '100%' }}
                                                    value={form_filtros.id_genero_rol.toString()}
                                                    onChange={(e) => {
                                                        setFormFiltros(prev => { return { ...prev, id_genero_rol: parseInt(e.target.value) } })
                                                    } } 
                                                    default_value_label="Selecciona un genero"
                                                    options={(generos_rol.data) ? generos_rol.data.map(er => { return { label: er.es, value: er.id.toString() } }) : []}                                                 
                                                />

                                                <MSelect
                                                    id="apariencias-etnicas-select"

                                                    styleRoot={{ width: '200px' }}
                                                    style={{ width: '100%' }}
                                                    value={form_filtros.id_apariencia_etnica.toString()}
                                                    onChange={(e) => {
                                                        setFormFiltros(prev => { return { ...prev, id_apariencia_etnica: parseInt(e.target.value) } })
                                                    } } 
                                                    default_value_label="Selecciona un tipo de etnia"
                                                    options={(apariencias_etnicas.data) ? apariencias_etnicas.data.map(er => { return { label: er.nombre, value: er.id.toString() } }) : []}                                                                                     
                                                />
                                                <MSelect
                                                    id="preferencias-pago-select"

                                                    styleRoot={{ width: '200px' }}
                                                    style={{ width: '100%' }}
                                                    value={form_filtros.id_preferencias_de_pago.toString()}
                                                    onChange={(e) => {
                                                        setFormFiltros(prev => { return { ...prev, id_preferencias_de_pago: parseInt(e.target.value) } })
                                                    } } 
                                                    default_value_label="Selecciona un tipo de pago"
                                                    options={(preferencias_pago.data) ? preferencias_pago.data.map(er => { return { label: er.es, value: er.id.toString() } }) : []}                                                                                     
                                                />
                                            </Grid>

                                            <Grid xs={12}>

                                            </Grid>
                                        </Grid>

                                        <Grid xs={12} container gap={2} mt={4}>
                                         
                                        </Grid>

                                        <Grid xs={12} mt={4}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Button
                                                    sx={{ textTransform: 'none' }}
                                                    onClick={() => {
                                                      
                                                    }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <Image src="/assets/img/iconos/arow_l_blue.svg" width={15} height={15} alt="" />
                                                        <Typography fontWeight={600}>Página previa</Typography>
                                                    </Box>
                                                </Button>

                                                <Typography sx={{ color: '#069cb1' }} fontWeight={600} >1 de 1</Typography>

                                                <Button
                                                    sx={{ textTransform: 'none' }}
                                                    onClick={() => {
                                                       
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
        if (session.user.tipo_usuario === TipoUsuario.TALENTO) {
            return {
                props: {
                    user: session.user,
                    id_proyecto: id_proyecto
                }
            }
        } 
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

export default BillboardPage