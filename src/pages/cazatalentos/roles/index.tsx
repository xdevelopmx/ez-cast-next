import { GetServerSideProps, type NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image';
import React, { useEffect, useMemo, useReducer, useState } from 'react'
import { Flotantes, MainLayout, MenuLateral, InformacionGeneral, Alertas, Destacados } from '~/components'
import { motion } from 'framer-motion'
import { ContactoCasting } from '~/components/cazatalento/proyecto/crear/ContactoCasting'
import { EquipoCreativo } from '~/components/cazatalento/proyecto/crear/EquipoCreativo'
import { DetallesAdicionales } from '~/components/cazatalento/proyecto/crear/DetallesAdicionales'
import { LocacionProyecto } from '~/components/cazatalento/proyecto/crear/LocacionProyecto'
import { PublicarProyecto } from '~/components/cazatalento/proyecto/crear/PublicarProyecto'
import { api, parseErrorBody } from '~/utils/api'
import useNotify from '~/hooks/useNotify'
import CircleIcon from '@mui/icons-material/Circle';
import { Button, Divider, Grid, IconButton, Typography } from '@mui/material'
import Constants from '~/constants'
import { useRouter } from 'next/router'
import { User } from 'next-auth'
import { getSession } from 'next-auth/react'
import ConfirmationDialog from '~/components/shared/ConfirmationDialog'
import Link from 'next/link'
import { MTable } from '~/components/shared/MTable/MTable'
import { MContainer } from '~/components/layout/MContainer'
import MotionDiv from '~/components/layout/MotionDiv';

type RolesIndexPageProps = {
    user: User,
}

const RolesIndexPage: NextPage<RolesIndexPageProps> = ({ user }) => {
    const [tabSelected, setTabSelected] = useState<'ACTIVOS' | 'ARCHIVADOS'>('ACTIVOS');
    const [confirmation_dialog, setConfirmationDialog] = useState<{ opened: boolean, title: string, content: JSX.Element, action: 'STATE_CHANGE' | 'DELETE', data: Map<string, unknown> }>({ opened: false, title: '', content: <></>, action: 'DELETE', data: new Map });
    const [proyecto_details_expanded, setProyectoDetailsExpanded] = useState(false);
    const { notify } = useNotify();
    const router = useRouter();

    const id_proyecto = useMemo(() => {
        const { id_proyecto } = router.query;
        if (id_proyecto) {
            return parseInt(id_proyecto as string);
        }
        return 0;
    }, [router.query]);

    const proyecto = api.proyectos.getById.useQuery(id_proyecto, {
        refetchOnWindowFocus: false
    });

    const roles = api.roles.getAllByProyecto.useQuery(id_proyecto, {
        refetchOnWindowFocus: false
    });

    const filtered_roles = useMemo(() => {
        if (roles.data) {
            if (tabSelected === 'ARCHIVADOS') {
                return roles.data.filter(p => p.estatus.toUpperCase() === 'ARCHIVADO');
            }
            return roles.data.filter(p => p.estatus.toUpperCase() !== 'ARCHIVADO');
        }
        return [];
    }, [tabSelected, roles.data]);

    const no_data_message = useMemo(() => {
        if (tabSelected === 'ACTIVOS') {
            return <div className="box_message_blue">
                <p className="h3">No has creado ningún rol</p>
                <p>Al crear un rol, aquí tendrás una vista general de tus roles activos e inactivos.<br />
                    Recuerda crear todos tus roles y leer los requisitos de aprobación antes de terminar y
                    mandarlos.<br />
                    ¡Comienza ahora mismo!</p>
            </div>
        }
        if (tabSelected === 'ARCHIVADOS') {
            return <div className="box_message_blue">
                <p className="h3">No tienes ningún rol archivado</p>
                <p>Aqui apareceran todos los roles que hayas colocado como archivados<br /></p>
            </div>
        }
    }, [tabSelected]);

    const deleteRol = api.roles.deleteRolById.useMutation({
        onSuccess() {
            notify('success', 'Se elimino el rol con exito');
            void roles.refetch();
        },
        onError(error) {
            notify('error', parseErrorBody(error.message));
        }
    });

    const updateEstadoRol = api.roles.updateEstadoRolById.useMutation({
        onSuccess() {
            notify('success', 'Se cambio el estado del rol con exito');
            void roles.refetch();
        },
        onError(error) {
            notify('error', parseErrorBody(error.message));
        }
    });

    console.log({ roles: roles.data });

    return (
        <>
            <Head>
                <title>DashBoard ~ Cazatalentos | Talent Corner</title>
                <meta name="description" content="Talent Corner" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <MainLayout menuSiempreBlanco={true} >
                <div className="d-flex wrapper_ezc">
                    <MenuLateral />
                    <div className="seccion_container col" style={{ paddingTop: 0 }}>
                        <br /><br />
                        <div className="container_box_header">
                            <div className="d-flex justify-content-end align-items-start py-2">
                                <Alertas />
                            </div>
                            <div className="d-flex">
                                <Button onClick={() => { void router.replace(`/cazatalentos/dashboard`) }} variant='text' startIcon={<motion.img src="/assets/img/iconos/return_blue.svg" alt="icono" />}>
                                    <p className="color_a mb-0 ml-2"><b>Regresar a vista general</b></p>
                                </Button>

                            </div>
                            <br />
                            <MContainer direction='horizontal' justify='space-between'>
                                <MContainer direction='horizontal'>
                                    <p className="h5 font-weight-bold"><b>Proyecto Talent Corner</b></p>
                                    <motion.div layout>
                                        <div className="ctrl_box_top" style={{
                                            height: 24,
                                            padding: 0,
                                            paddingRight: 8,
                                            paddingLeft: 8
                                        }}>
                                            {!proyecto_details_expanded &&
                                                <IconButton onClick={() => setProyectoDetailsExpanded(true)}>
                                                    <Image src={`/assets/img/iconos/arrow_d_white.svg`} height={12} width={12} alt={'agregar-rol'} />
                                                </IconButton>
                                            }
                                            {proyecto_details_expanded &&
                                                <IconButton onClick={() => setProyectoDetailsExpanded(false)}>
                                                    <Image src={`/assets/img/iconos/arrow_u_white.svg`} height={12} width={12} alt={'agregar-rol'} />
                                                </IconButton>
                                            }
                                        </div>

                                    </motion.div>
                                </MContainer>

                                <MContainer direction='horizontal' styles={{ alignItems: 'center' }}>
                                    <Link href={`/cazatalentos/roles/agregar-rol?id-proyecto=${id_proyecto}`} >
                                        <Button
                                            className="btn btn-intro btn-price btn_out_line mb-2"
                                            startIcon={
                                                <Image
                                                    src={`/assets/img/iconos/cruz_ye.svg`}
                                                    height={16}
                                                    width={16}
                                                    alt={'agregar-rol'}
                                                />
                                            }
                                            style={{
                                                padding: '8px 40px',
                                                marginTop: 0,
                                                marginRight: 10,
                                                fontWeight: 500
                                            }}
                                        >
                                            Nuevo rol
                                        </Button>

                                    </Link>

                                    <Link href="/cazatalentos/proyecto" >
                                        <Button
                                            className="btn btn-sm btn-intro btn-price mb-2"
                                            style={{
                                                padding: '8px 40px',
                                                marginTop: 0,
                                                display: 'block',
                                                height: 40,
                                                fontWeight: 500
                                            }}
                                        >
                                            Enviar proyecto para aprobación
                                        </Button>

                                    </Link>
                                </MContainer>


                            </MContainer>
                            <MContainer direction='vertical'>
                                <MContainer direction='horizontal'>
                                    <MContainer direction="horizontal">
                                        <CircleIcon style={{ color: (proyecto.data && proyecto.data.estatus.toUpperCase() === 'ACTIVO') ? 'green' : 'grey', width: 12, height: 12, marginTop: 6, marginRight: 4 }} />
                                        <Typography variant="subtitle2">
                                            {(proyecto.data) ? proyecto.data.nombre : 'ND'}
                                        </Typography>
                                    </MContainer>
                                    <Divider style={{ borderWidth: 1, height: 12, borderColor: '#069cb1', margin: 8 }} orientation='vertical' />
                                    <Typography variant="subtitle2">
                                        {(proyecto.data && proyecto.data.tipo) ? (proyecto.data.tipo.id_tipo_proyecto === 99) ? proyecto.data.tipo.descripcion : proyecto.data.tipo.tipo_proyecto.es : 'ND'}
                                    </Typography>
                                    <Divider style={{ borderWidth: 1, height: 12, borderColor: '#069cb1', margin: 8 }} orientation='vertical' />
                                    <Typography variant="subtitle2">
                                        {(proyecto.data && proyecto.data.sindicato) ? (proyecto.data.sindicato.id_sindicato === 99) ? proyecto.data.sindicato.descripcion : proyecto.data.sindicato.sindicato.es : 'ND'}
                                    </Typography>
                                </MContainer>
                                <Divider style={{ borderWidth: 1 }} />
                            </MContainer>

                            <MotionDiv show={proyecto_details_expanded} animation='fade'>
                                <Grid container>
                                    <Grid mt={2} item xs={12}>
                                        <Typography style={{ color: '#069cb1' }}>
                                            Contacto de casting
                                        </Typography>
                                        <Divider style={{ borderWidth: 1 }} />
                                    </Grid>
                                    <Grid mt={2} item xs={6} md={3}>
                                        <Typography fontWeight={500}>
                                            {(proyecto.data) ? proyecto.data.director_casting : 'ND'}
                                        </Typography>
                                    </Grid>
                                    <Grid mt={2} item xs={6} md={3}>
                                        <Typography fontWeight={500}>
                                            {(proyecto.data) ? proyecto.data.email_contacto : 'ND'}
                                        </Typography>
                                    </Grid>
                                    <Grid mt={2} item xs={6} md={3}>
                                        <Typography fontWeight={500}>
                                            {(proyecto.data) ? proyecto.data.telefono_contacto : 'ND'}
                                        </Typography>
                                    </Grid>

                                    <Grid mt={2} item xs={12}>
                                        <Typography style={{ color: '#069cb1' }}>
                                            Equipo creativo
                                        </Typography>
                                        <Divider style={{ borderWidth: 1 }} />
                                    </Grid>
                                    <Grid mt={2} item md={6}>
                                        <MContainer direction="horizontal">
                                            <Typography sx={{ paddingRight: 2, fontWeight: 600 }}>
                                                Productor
                                            </Typography>
                                            <Typography sx={{ color: '#928F8F' }}>
                                                {(proyecto.data) ? proyecto.data.productor : 'ND'}
                                            </Typography>
                                        </MContainer>
                                    </Grid>
                                    <Grid mt={2} item md={6}>
                                        <MContainer direction="horizontal">
                                            <Typography sx={{ paddingRight: 2, fontWeight: 600 }}>
                                                Director
                                            </Typography>
                                            <Typography sx={{ color: '#928F8F' }}>
                                                {(proyecto.data) ? proyecto.data.director : 'ND'}
                                            </Typography>
                                        </MContainer>
                                    </Grid>
                                    <Grid mt={2} item md={6}>
                                        <MContainer direction="horizontal">
                                            <Typography sx={{ paddingRight: 2, fontWeight: 600 }}>
                                                Casa productora
                                            </Typography>
                                            <Typography sx={{ color: '#928F8F' }}>
                                                {(proyecto.data) ? proyecto.data.casa_productora : 'ND'}
                                            </Typography>
                                        </MContainer>
                                    </Grid>
                                    <Grid mt={2} item md={6}>
                                        <MContainer direction="horizontal">
                                            <Typography sx={{ paddingRight: 2, fontWeight: 600 }}>
                                                Agencia de Publicidad
                                            </Typography>
                                            <Typography sx={{ color: '#928F8F' }}>
                                                {(proyecto.data) ? proyecto.data.agencia_publicidad : 'ND'}
                                            </Typography>
                                        </MContainer>
                                    </Grid>
                                    <Grid mt={2} item xs={12}>
                                        <Typography style={{ color: '#069cb1' }}>
                                            Detalles adicionales
                                        </Typography>
                                        <Divider style={{ borderWidth: 1 }} />
                                    </Grid>
                                    <Grid mt={2} item xs={12}>
                                        <MContainer direction="horizontal">
                                            <Typography sx={{ paddingRight: 2, fontWeight: 600 }}>
                                                Sinopsis
                                            </Typography>
                                            <Typography sx={{ color: '#928F8F' }}>
                                                {(proyecto.data) ? proyecto.data.sinopsis : 'ND'}
                                            </Typography>
                                        </MContainer>
                                    </Grid>
                                    <Grid mt={2} item xs={12}>
                                        <MContainer direction="horizontal">
                                            <Typography sx={{ paddingRight: 2, fontWeight: 100 }}>
                                                Archivos
                                            </Typography>
                                            <Typography>
                                                {'ND'}
                                            </Typography>
                                        </MContainer>
                                    </Grid>
                                    <Grid mt={2} item xs={12}>
                                        <Typography style={{ color: '#069cb1' }}>
                                            Locación proyecto
                                        </Typography>
                                        <Divider style={{ borderWidth: 1 }} />
                                    </Grid>

                                    <Grid mt={2} item xs={12}>
                                        <MContainer direction="horizontal">

                                            <Typography sx={{ paddingRight: 2, fontWeight: 600 }}>
                                                Estado
                                            </Typography>
                                            <Typography sx={{ color: '#928F8F' }}>
                                                {(proyecto.data) ? proyecto.data.estado_republica.es : 'ND'}
                                            </Typography>
                                        </MContainer>
                                    </Grid>


                                </Grid>
                            </MotionDiv>
                        </div>

                        <div className="row mt-5">
                            <div className="col container_list_proyects">
                                <div className="row">
                                    <ul className="nav nav-tabs col ml-3" id="myTab" role="tablist">
                                        <li className="nav-item">
                                            <a onClick={() => { setTabSelected('ACTIVOS') }} className={`nav-link ${tabSelected === 'ACTIVOS' ? 'active' : ''}`} id="activos-tab" data-toggle="tab" href="#activos" role="tab"
                                                aria-controls="activos" aria-selected="true">Activos</a>
                                        </li>
                                        <li className="nav-item">
                                            <a onClick={() => { setTabSelected('ARCHIVADOS') }} className={`nav-link ${tabSelected === 'ARCHIVADOS' ? 'active' : ''}`} id="archivados-tab" data-toggle="tab" href="#archivados" role="tab"
                                                aria-controls="archivados" aria-selected="false">Archivados</a>
                                        </li>
                                    </ul>
                                </div>
                                <MTable
                                    alternate_colors={false}
                                    columnsHeader={[
                                        <Typography key={1} sx={{ color: '#fff' }} fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                                            Nombre
                                        </Typography>,
                                        <Typography key={2} sx={{ color: '#fff' }} fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                                            Estado
                                        </Typography>,
                                        <Typography key={3} sx={{ color: '#fff' }} fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                                            No Vistos
                                        </Typography>,
                                        <Typography key={4} sx={{ color: '#fff' }} fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                                            Vistos
                                        </Typography>,
                                        <Typography key={5} sx={{ color: '#fff' }} fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                                            Destacados
                                        </Typography>,
                                        <Typography key={6} sx={{ color: '#fff' }} fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                                            Audición
                                        </Typography>,
                                        <Typography key={7} sx={{ color: '#fff' }} fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                                            Callback
                                        </Typography>,
                                        <Typography key={8} sx={{ color: '#fff' }} fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                                            Acciones
                                        </Typography>,
                                    ]}
                                    backgroundColorHeader='#069cb1'
                                    styleHeaderTableCell={{ padding: '5px !important' }}
                                    loading={roles.isFetching}
                                    data={(filtered_roles) ? filtered_roles.map(r => {
                                        return {
                                            nombre: <MContainer direction="horizontal">
                                                <CircleIcon style={{ color: (r.estatus.toUpperCase() === 'ACTIVO') ? 'green' : 'grey', width: 12, height: 12, marginTop: 6, marginRight: 4 }} />
                                                <Typography variant="subtitle2">
                                                    {r.nombre}
                                                </Typography>
                                            </MContainer>,
                                            estado: r.estatus === 'SIN_FINALIZAR' ? 'Sin finalizar' : 'Archivado',
                                            no_vistos: <MContainer direction='horizontal' justify='center'>
                                                <Image src={'/assets/img/iconos/icon_no_vistos.svg'} width={16} height={16} alt="no vistos" />
                                                <Typography style={{ marginLeft: 8 }} variant={'body2'}>1</Typography>
                                            </MContainer>,
                                            vistos: <MContainer direction='horizontal' justify='center'>
                                                <Image src={'/assets/img/iconos/icon_vistos.svg'} width={16} height={16} alt="no vistos" />
                                                <Typography style={{ marginLeft: 8 }} variant={'body2'}>1</Typography>
                                            </MContainer>,
                                            destacados: <MContainer direction='horizontal' justify='center'>
                                                <Image src={'/assets/img/iconos/icono_claqueta_blue.svg'} width={16} height={16} alt="no vistos" />
                                                <Typography style={{ marginLeft: 8 }} variant={'body2'}>1</Typography>
                                            </MContainer>,
                                            audicion: <MContainer direction='horizontal' justify='center'>
                                                <Image src={'/assets/img/iconos/icono_lampara_blue.svg'} width={16} height={16} alt="no vistos" />
                                                <Typography style={{ marginLeft: 8 }} variant={'body2'}>1</Typography>
                                            </MContainer>,
                                            callback: <MContainer direction='horizontal' justify='center'>
                                                <Image src={'/assets/img/iconos/icono_claqueta_blue.svg'} width={16} height={16} alt="no vistos" />
                                                <Typography style={{ marginLeft: 8 }} variant={'body2'}>1</Typography>
                                            </MContainer>,
                                            acciones: <MContainer direction="horizontal" justify='space-between'>
                                                <>
                                                    {['ARCHIVADO', 'SIN_FINALIZAR'].includes(r.estatus.toUpperCase()) &&
                                                        <IconButton
                                                            onClick={(e) => {
                                                                const params = new Map<string, unknown>();
                                                                params.set('id', r.id);
                                                                params.set('state', (r.estatus.toUpperCase() === 'ARCHIVADO') ? 'SIN_FINALIZAR' : 'Archivado');
                                                                setConfirmationDialog({ action: 'STATE_CHANGE', data: params, opened: true, title: (r.estatus.toUpperCase() === 'ARCHIVADO') ? 'Desarchivar Rol' : 'Archivar Rol', content: <Typography variant="body2">{`Seguro que deseas ${(r.estatus.toUpperCase() === 'ARCHIVADO') ? 'desarchivar' : 'archivar'} este rol?`}</Typography> });
                                                                e.stopPropagation();
                                                            }}
                                                            color="primary"
                                                            aria-label="archivar"
                                                            component="label"
                                                        >
                                                            <Image src={'/assets/img/iconos/archivar_blue.svg'} width={16} height={16} alt="archivar" />
                                                        </IconButton>
                                                    }

                                                </>
                                                <IconButton
                                                    onClick={(e) => {
                                                        void router.push(`/cazatalentos/agregar-rol?id_rol=${r.id}`);
                                                        e.stopPropagation();
                                                    }}
                                                    color="primary"
                                                    aria-label="editar"
                                                    component="label"
                                                >
                                                    <Image src={'/assets/img/iconos/edit_icon_blue.png'} width={16} height={16} alt="archivar" />
                                                </IconButton>
                                                <IconButton
                                                    onClick={(e) => {
                                                        void router.push(`/cazatalentos/roles?id_rol=${r.id}`);
                                                        e.stopPropagation();
                                                    }}
                                                    color="primary"
                                                    aria-label="consultar"
                                                    component="label"
                                                >
                                                    <Image src={'/assets/img/iconos/search_blue.png'} width={16} height={16} alt="archivar" />
                                                </IconButton>
                                                <>
                                                    {['ACTIVO'].includes(r.estatus.toUpperCase()) &&
                                                        <IconButton
                                                            onClick={(e) => {
                                                                const params = new Map<string, unknown>();
                                                                params.set('id', r.id);
                                                                setConfirmationDialog({ action: 'DELETE', data: params, opened: true, title: 'Eliminar Rol', content: <Typography variant="body2">Seguro que deseas eliminar este rol?</Typography> });
                                                                e.stopPropagation();
                                                            }}
                                                            color="primary"
                                                            aria-label="eliminar"
                                                            component="label"
                                                        >
                                                            <Image src={'/assets/img/iconos/trash_blue.png'} width={16} height={16} alt="archivar" />
                                                        </IconButton>
                                                    }
                                                </>
                                            </MContainer>
                                        }
                                    }) : []}
                                    accordionContent={(element_index: number, container_width: number) => {
                                        const element = filtered_roles[element_index];
                                        if (element) {
                                            return (
                                                <Grid container p={2} style={{ width: container_width }}>
                                                    <Grid item container xs={12}>
                                                        <Grid item xs={7}>
                                                            <MContainer direction='horizontal' styles={{ gap: 10 }}>
                                                                <Typography component={'span'} sx={{ color: '#928F8F' }}>Principal- En cuadro</Typography>
                                                                <Divider style={{ borderWidth: 1, height: 12, borderColor: '#069cb1', margin: 8 }} orientation='vertical' />
                                                                <Typography component={'span'} sx={{ color: '#928F8F' }}>Crédito en pantalla</Typography>
                                                                <Divider style={{ borderWidth: 1, height: 12, borderColor: '#069cb1', margin: 8 }} orientation='vertical' />
                                                                <Typography component={'span'} sx={{ color: '#928F8F' }}>Sin unión</Typography>
                                                            </MContainer>
                                                            <MContainer direction='horizontal' styles={{ gap: 10 }}>
                                                                <Typography component={'span'} sx={{ color: '#928F8F' }}>Mujer</Typography>
                                                                <Divider style={{ borderWidth: 1, height: 12, borderColor: '#069cb1', margin: 8 }} orientation='vertical' />
                                                                <Typography component={'span'} sx={{ color: '#928F8F' }}>18-25</Typography>
                                                                <Divider style={{ borderWidth: 1, height: 12, borderColor: '#069cb1', margin: 8 }} orientation='vertical' />
                                                                <Typography component={'span'} sx={{ color: '#928F8F' }}>Latino/Hispano</Typography>
                                                                <Divider style={{ borderWidth: 1, height: 12, borderColor: '#069cb1', margin: 8 }} orientation='vertical' />
                                                                <Typography component={'span'} sx={{ color: '#928F8F' }}>Nacionalidad</Typography>
                                                            </MContainer>

                                                        </Grid>
                                                        <Grid item xs={5}>
                                                            <Typography component={'p'} sx={{ color: '#928F8F' }}>
                                                                <Typography component={'span'} fontWeight={600} sx={{ paddingRight: 1 }}>Descripción:</Typography>
                                                                Características del personaje
                                                                y el rol que interpretará Características del
                                                                personaje y el rol que interpretará Caracterí
                                                                sticas del personaje y el rol que interpretará
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid item xs={12} mt={1}>
                                                        <Divider />
                                                    </Grid>
                                                    <Grid item container xs={12}>
                                                        <MContainer direction='horizontal'>
                                                            <Typography fontWeight={600} sx={{ color: '#928F8F', paddingRight: 1 }}>Habilidades:</Typography>
                                                            <MContainer direction='horizontal'>
                                                                <Typography component={'span'} sx={{ color: '#928F8F' }}>Danza</Typography>
                                                                <Divider style={{ borderWidth: 1, height: 12, borderColor: '#069cb1', margin: 8 }} orientation='vertical' />
                                                                <Typography component={'span'} sx={{ color: '#928F8F' }}>Canto</Typography>
                                                            </MContainer>
                                                        </MContainer>
                                                    </Grid>
                                                    <Grid item xs={12} mt={1}>
                                                        <Divider />
                                                    </Grid>
                                                    <Grid item container xs={12}>
                                                        <MContainer direction='horizontal'>
                                                            <Typography fontWeight={600} sx={{ color: '#928F8F', paddingRight: 1 }}>Desnudos situaciones sexuales:</Typography>
                                                            <MContainer direction='horizontal'>
                                                                <Typography component={'span'} sx={{ color: '#928F8F' }}>Si desnudos</Typography>
                                                                <Divider style={{ borderWidth: 1, height: 12, borderColor: '#069cb1', margin: 8 }} orientation='vertical' />
                                                                <Typography component={'span'} sx={{ color: '#928F8F' }}>No situación sexual</Typography>
                                                                <Divider style={{ borderWidth: 1, height: 12, borderColor: '#069cb1', margin: 8 }} orientation='vertical' />
                                                                <Typography component={'span'} sx={{ color: '#928F8F' }}>Descripción del tipo de situación</Typography>
                                                            </MContainer>
                                                        </MContainer>
                                                    </Grid>
                                                    <Grid item xs={12} mt={1}>
                                                        <Divider />
                                                    </Grid>
                                                    <Grid item container xs={12}>
                                                        <MContainer direction='horizontal'>
                                                            <Typography fontWeight={600} sx={{ color: '#928F8F', paddingRight: 1 }}>Locación de casting y fechas:</Typography>
                                                            <MContainer direction='horizontal'>
                                                                <Typography component={'span'} sx={{ color: '#928F8F' }}>Lugar</Typography>
                                                                <Divider style={{ borderWidth: 1, height: 12, borderColor: '#069cb1', margin: 8 }} orientation='vertical' />
                                                                <Typography component={'span'} sx={{ color: '#928F8F' }}>25/09/2021</Typography>
                                                            </MContainer>
                                                        </MContainer>
                                                    </Grid>
                                                    <Grid item xs={12} mt={1}>
                                                        <Divider />
                                                    </Grid>
                                                    <Grid item container xs={12}>
                                                        <MContainer direction='horizontal'>
                                                            <Typography fontWeight={600} sx={{ color: '#928F8F', paddingRight: 1 }}>Locación de filmación y fechas:</Typography>
                                                            <MContainer direction='horizontal'>
                                                                <Typography component={'span'} sx={{ color: '#928F8F' }}>Lugar</Typography>
                                                                <Divider style={{ borderWidth: 1, height: 12, borderColor: '#069cb1', margin: 8 }} orientation='vertical' />
                                                                <Typography component={'span'} sx={{ color: '#928F8F' }}>25/09/2021</Typography>
                                                            </MContainer>
                                                        </MContainer>
                                                    </Grid>
                                                    <Grid item xs={12} mt={1}>
                                                        <Divider />
                                                    </Grid>
                                                    <Grid item container xs={12}>
                                                        <MContainer direction='horizontal'>
                                                            <Typography fontWeight={600} sx={{ color: '#928F8F', paddingRight: 1 }}>Presentación de solicitud:</Typography>
                                                            <MContainer direction='horizontal'>
                                                                <Typography component={'span'} sx={{ color: '#928F8F' }}>Lugar</Typography>
                                                                <Divider style={{ borderWidth: 1, height: 12, borderColor: '#069cb1', margin: 8 }} orientation='vertical' />
                                                                <Typography component={'span'} sx={{ color: '#928F8F' }}>25/09/2021</Typography>
                                                                <Divider style={{ borderWidth: 1, height: 12, borderColor: '#069cb1', margin: 8 }} orientation='vertical' />
                                                                <Typography component={'span'} sx={{ color: '#928F8F' }}>14:00 UTC(CNM) – 5</Typography>
                                                            </MContainer>
                                                        </MContainer>
                                                    </Grid>
                                                    <Grid item xs={12} mt={1}>
                                                        <Divider />
                                                    </Grid>
                                                    <Grid item container xs={12}>
                                                        <MContainer direction='horizontal'>
                                                            <Typography fontWeight={600} sx={{ color: '#928F8F', paddingRight: 1 }}>Requisitos:</Typography>
                                                            <MContainer direction='horizontal'>
                                                                <Typography component={'span'} sx={{ color: '#928F8F' }}>Foto</Typography>
                                                                <Divider style={{ borderWidth: 1, height: 12, borderColor: '#069cb1', margin: 8 }} orientation='vertical' />
                                                                <Typography component={'span'} sx={{ color: '#928F8F' }}>Video</Typography>
                                                                <Divider style={{ borderWidth: 1, height: 12, borderColor: '#069cb1', margin: 8 }} orientation='vertical' />
                                                                <Typography component={'span'} sx={{ color: '#928F8F' }}>Audio</Typography>
                                                                <Divider style={{ borderWidth: 1, height: 12, borderColor: '#069cb1', margin: 8 }} orientation='vertical' />
                                                                <Typography component={'span'} sx={{ color: '#928F8F' }}>Texto requisitos o notas</Typography>
                                                            </MContainer>
                                                        </MContainer>
                                                    </Grid>
                                                    <Grid item xs={12} mt={1}>
                                                        <Divider />
                                                    </Grid>
                                                    <Grid item container xs={12}>
                                                        <MContainer direction='horizontal'>
                                                            <Typography fontWeight={600} sx={{ color: '#928F8F', paddingRight: 1 }}>Archivos adicionales:</Typography>
                                                            <MContainer direction='horizontal' styles={{ gap: 10 }}>
                                                                <Typography component={'span'} sx={{ color: '#069cb1', textDecoration: 'underline' }}>lineas.pdf</Typography>
                                                                <Typography component={'span'} sx={{ color: '#069cb1', textDecoration: 'underline' }}>headshot.jpg</Typography>
                                                                <Typography component={'span'} sx={{ color: '#069cb1', textDecoration: 'underline' }}>referencia1.jpg</Typography>
                                                                <Typography component={'span'} sx={{ color: '#069cb1', textDecoration: 'underline' }}>referencia2.jpg</Typography>
                                                            </MContainer>
                                                        </MContainer>
                                                    </Grid>
                                                </Grid>
                                            )
                                        }
                                        return null;
                                    }}
                                    noDataContent={
                                        (filtered_roles.length > 0) ? undefined :
                                            (roles.isFetching) ? undefined :
                                                no_data_message
                                    }
                                />
                            </div>
                        </div>

                    </div>
                </div>
            </MainLayout>
            <Flotantes />
            <ConfirmationDialog
                opened={confirmation_dialog.opened}
                onOptionSelected={(confirmed: boolean) => {
                    if (confirmed) {
                        switch (confirmation_dialog.action) {
                            case 'DELETE': {
                                const id = confirmation_dialog.data.get('id');
                                if (id) {
                                    deleteRol.mutate(id as number);
                                }
                                break;
                            }
                            case 'STATE_CHANGE': {
                                const id = confirmation_dialog.data.get('id');
                                const new_state = confirmation_dialog.data.get('state');
                                if (id) {
                                    updateEstadoRol.mutate({ id: id as number, estatus: new_state as string });
                                }
                                break;
                            }
                        }
                    }
                    setConfirmationDialog({ ...confirmation_dialog, opened: false });
                    console.log(confirmed);
                }}
                title={confirmation_dialog.title}
                content={confirmation_dialog.content}
            />
        </>
    )
}


export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);
    if (session && session.user) {
        return {
            props: {
                user: session.user,
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


export default RolesIndexPage