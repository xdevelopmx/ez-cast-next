import { type GetServerSideProps } from "next";
import { Box, Button, Divider, Grid, Skeleton, Typography } from "@mui/material";
import { type NextPage } from "next";
import Head from "next/head";
import { Alertas, MSelect, MainLayout, MenuLateral } from "~/components";
import { PerfilTable } from "~/components/cazatalento/billboard/PerfilTable";
import { MContainer } from "~/components/layout/MContainer";
import { api } from "~/utils/api";
import { getSession } from "next-auth/react";
import Image from 'next/image';
import { type User } from "next-auth";
import { Fragment, useEffect, useState, useMemo } from "react";
import type {
	Roles, CatalogoTiposRoles, FiltrosDemoPorRoles, GenerosPorRoles, CatalogoGeneros,
	AparenciasEtnicasPorRoles, CatalogoAparenciasEtnicas
} from '@prisma/client'
import { TipoUsuario } from "~/enums";
import Constants from "~/constants";
import { TalentoTableItem } from "~/components/cazatalento/billboard/TalentoTableItem";

type BillboardCazaTalentosPageProps = {
	user: User,
	id_proyecto: number
}

export interface RolCompleto extends Roles {
	tipo_rol?: CatalogoTiposRoles;
	filtros_demograficos?: FiltrosDemoPorRoles
	& {
		generos?: (GenerosPorRoles
			& { genero?: CatalogoGeneros })[]
	}
	& { aparencias_etnicas?: (AparenciasEtnicasPorRoles & { aparencia_etnica: CatalogoAparenciasEtnicas })[] };

}

const BillboardPage: NextPage<BillboardCazaTalentosPageProps> = ({ user, id_proyecto }) => {

	const [selected_proyecto, setSelectedProyecto] = useState<number>(id_proyecto);
	const [pagination, setPagination] = useState<{page: number, page_size: number}>({page: 0, page_size: 2 });
	const [selected_rol, setSelectedRol] = useState<number>(0);
	const [estado_aplicacion_rol, setEstadoAplicacionRol] = useState<number>(0);

	const estados_aplicaciones_roles = api.catalogos.getEstadosAplicacionesRoles.useQuery(undefined, {
		refetchOnWindowFocus: false
	});

	const proyectos = api.proyectos.getAllByIdCazatalentos.useQuery({ id: parseInt(user.id) }, {
		refetchOnWindowFocus: false
	});

	const roles_by_proyecto = api.roles.getAllByProyecto.useQuery(selected_proyecto, {
		refetchOnWindowFocus: false
	});

	useEffect(() => {
		if (roles_by_proyecto.data && roles_by_proyecto.data.length > 0) {
			const first_rol = roles_by_proyecto.data[0];
			setSelectedRol((first_rol) ? first_rol.id : 0);
		} else {
			setSelectedRol(0);
		}
	}, [roles_by_proyecto.data]);

	const rol_applications = api.roles.getRolWithApplicationsById.useQuery({
		start: pagination.page * pagination.page_size, 
		end: pagination.page_size,
		id_rol: selected_rol,
		id_estado_aplicacion: estado_aplicacion_rol
	}, {
		refetchOnWindowFocus: false
	});

	const detalles_rol = useMemo(() => {
		const detalles: {
			tipo: string,
			generos: (GenerosPorRoles & { genero: CatalogoGeneros; })[],
			rango_edad_inicio: number,
			rango_edad_fin: number,
			apariencias_etnicas: (AparenciasEtnicasPorRoles & { aparencia_etnica: CatalogoAparenciasEtnicas; })[],
			descripcion: string,
		} = {
			tipo: 'No especificado',
			generos: [],
			rango_edad_inicio: 0,
			rango_edad_fin: 0,
			apariencias_etnicas: [],
			descripcion: 'No especificado'
		}
		
		if (rol_applications.data) {
			if (rol_applications.data.rol.filtros_demograficos) {
				detalles.generos = rol_applications.data.rol.filtros_demograficos.generos;
				detalles.rango_edad_inicio = rol_applications.data.rol.filtros_demograficos.rango_edad_inicio;
				detalles.rango_edad_fin = rol_applications.data.rol.filtros_demograficos.rango_edad_fin;
				detalles.apariencias_etnicas = rol_applications.data.rol.filtros_demograficos.aparencias_etnicas;
			}
			if (rol_applications.data && rol_applications.data.rol.descripcion) {
				detalles.descripcion = rol_applications.data.rol.descripcion;
			}
		}
		return detalles;
	}, [rol_applications.data]);



	//const [proyectoSeleccionado, setProyectoSeleccionado] = useState('0')
	//const [idProyectoSeleccionado, setIdProyectoSeleccionado] = useState(id_proyecto)
	//const [rolSeleccionado, setRolSeleccionado] = useState('0');



	//const roles = api.roles.getAllCompleteByProyecto.useQuery(idProyectoSeleccionado, {
	//    refetchOnWindowFocus: false
	//});

	/*
	useEffect(() => {
		if (!proyectos.data) return;
		if (proyectos.data.length === 0) return;
		setProyectoSeleccionado(`${proyectos.data[0]?.id || '0'}` || '0')
		setIdProyectoSeleccionado(proyectos.data[0]?.id || 0)
	}, [proyectos.data])

	useEffect(() => {
		if (proyectoSeleccionado === '0') return;
		if (!proyectos.data) return;
		const idProyecto = proyectos.data.find(p => p.id === parseInt(proyectoSeleccionado))?.id || 0
		if (!idProyecto) return;
		setIdProyectoSeleccionado(idProyecto)
	}, [proyectoSeleccionado, proyectos.data])
	*/
	return (
		<>
			<Head>
				<title>Cazatalentos | Talent Corner</title>
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
								<Grid item xs={12}>
									<Typography fontWeight={800} sx={{ color: '#069cb1', fontSize: '2rem' }}>Billboard</Typography>
									<MContainer direction="horizontal">
										<MSelect
											id="nombre-proyecto-select"
											disabled={id_proyecto > 0}
											loading={proyectos.isFetching}
											options={proyectos.data?.map(p => ({
												value: `${p.id}`,
												label: p.nombre,
											})) || []}
											className={'form-input-md'}
											value={selected_proyecto.toString()}
											onChange={(e) => {
												setSelectedProyecto(parseInt(e.target.value))
											}}
											label=''
										/>
										<Divider style={{ borderWidth: 1, height: 12, borderColor: '#069cb1', margin: 8 }} orientation='vertical' />
										<MSelect
											id="nombre-personaje-select"
											loading={roles_by_proyecto.isFetching}
											options={(roles_by_proyecto.data) ? roles_by_proyecto.data.map(r => ({
												label: r.nombre,
												value: r.id.toString(),
											})) : []}
											className={'form-input-md'}
											value={selected_rol.toString()}
											onChange={(e) => {
												setSelectedRol(parseInt(e.target.value))
											}}
											label=''
										/>
									</MContainer>
									<Divider style={{ borderWidth: 1, marginTop: '10px' }} />
								</Grid>
								<Grid item xs={12}>
									<Grid container item xs={12} mt={1}>
										<Grid container item xs={20} sx={{ backgroundColor: '#069cb1', padding: '20px 10px' }} columns={20}>
											<Grid item xs={4}>
												<MContainer direction='horizontal' styles={{ gap: 10 }}>
													<Typography sx={{ paddingRight: 1 }}>Ver</Typography>
													<MSelect
														id="estado-aplicacion-rol-select"
														loading={estados_aplicaciones_roles.isFetching}
														options={(estados_aplicaciones_roles.data) ? estados_aplicaciones_roles.data.map(e => { return { value: e.id.toString(), label: e.es}}) : []}
														styleRoot={{ width: '70%' }}
														value={estado_aplicacion_rol.toString()}
														onChange={(e) => {
															setEstadoAplicacionRol(parseInt(e.target.value));
														}}
														label=''
													/>
												</MContainer>
											</Grid>
											<Grid item xs={4}>
												<MContainer direction='horizontal' styles={{ gap: 10 }}>
													<Typography>Rol</Typography>
													<MSelect
														id="nombre-rol-select"
														loading={roles_by_proyecto.isFetching}
														options={(roles_by_proyecto.data) ? roles_by_proyecto.data.map(r => ({
															label: r.nombre,
															value: r.id.toString(),
														})) : []}
														className={'form-input-md'}
														value={selected_rol.toString()}
														onChange={(e) => {
															setSelectedRol(parseInt(e.target.value))
														}}
														label=''
													/>
												</MContainer>
											</Grid>

											<Grid xs={3}>
												<Typography sx={{ color: '#fff', textAlign: 'center' }}>{(rol_applications.data) ? rol_applications.data.count_applications : 0} resultados totales</Typography>
											</Grid>

											<Grid xs={9}>
												<MContainer direction='horizontal' styles={{ alignItems: 'center', justifyContent: 'flex-end' }}>
													<Typography>Ver <Typography component={'span'} sx={{ backgroundColor: '#fff', borderRadius: '1rem', padding: '0px 8px' }}>{pagination.page_size}</Typography> resultados</Typography>
													<Button
														onClick={() => {
															setPagination(prev => {return {...prev, page: prev.page - 1}})
														}} 
														sx={{ width: '20px', padding: 0 }}>
														<Image src="/assets/img/iconos/arrow_l_white.svg" width={20} height={20} alt="" />
													</Button>
													<Typography>Página <Typography component={'span'} sx={{ backgroundColor: '#fff', borderRadius: '1rem', padding: '0px 8px' }}>{pagination.page + 1}</Typography> de {(rol_applications.data) ? Math.ceil(rol_applications.data.count_applications / pagination.page_size) : 0}</Typography>
													<Button
														onClick={() => {
															setPagination(prev => {return {...prev, page: prev.page + 1}})
														}} 
														sx={{ width: '20px', padding: 0 }}>
														<Image src="/assets/img/iconos/arrow_r_white.svg" width={20} height={20} alt="" />
													</Button>
												</MContainer>
											</Grid>
										</Grid>
										<Grid xs={12} sx={{ backgroundColor: '#EBEBEB', padding: '10px' }}>
											{rol_applications.isFetching && <Skeleton/>}
											{!rol_applications.isFetching &&
												<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
													<Box sx={{ display: 'flex', gap: 1 }}>
														<Typography>{detalles_rol.tipo}</Typography>
														<Divider style={{ borderWidth: 1, height: 12, borderColor: '#069cb1', margin: 8 }} orientation='vertical' />
													</Box>
													<Box sx={{ display: 'flex', gap: 1 }}>
														{detalles_rol.generos.length === 0 &&
															<>
																<Typography>No especificado</Typography>
																<Divider style={{ borderWidth: 1, height: 12, borderColor: '#069cb1', margin: 8 }} orientation='vertical' />
															</>
														}
														{detalles_rol.generos.length > 0 &&
															detalles_rol.generos.map(g => {
																return <>
																	<Typography>{g.genero?.es}</Typography>
																	<Divider style={{ borderWidth: 1, height: 12, borderColor: '#069cb1', margin: 8 }} orientation='vertical' />
																</>
															})
														}
													</Box>
													<Box sx={{ display: 'flex', gap: 1 }}>
														<Typography>{detalles_rol.tipo}</Typography>
														<Divider style={{ borderWidth: 1, height: 12, borderColor: '#069cb1', margin: 8 }} orientation='vertical' />
													</Box>
													<Box sx={{ display: 'flex', gap: 1 }}>
														<Typography>{`${detalles_rol.rango_edad_inicio}-${detalles_rol.rango_edad_fin}`}</Typography>
														<Divider style={{ borderWidth: 1, height: 12, borderColor: '#069cb1', margin: 8 }} orientation='vertical' />
													</Box>
													<Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
														{detalles_rol.apariencias_etnicas.length === 0 &&
															<>
																<Typography>No especificado</Typography>
																<Divider style={{ borderWidth: 1, height: 12, borderColor: '#069cb1', margin: 8 }} orientation='vertical' />
															</>
														}
														{detalles_rol.apariencias_etnicas.length > 0 &&
															detalles_rol.apariencias_etnicas.map(ae => {
																return <>
																	<Typography>{ae.aparencia_etnica.nombre}</Typography>
																	<Divider style={{ borderWidth: 1, height: 12, borderColor: '#069cb1', margin: 8 }} orientation='vertical' />
																</>
															})
														}
													</Box>
													<Box sx={{ display: 'flex' }}>
														<Typography fontWeight={100} fontStyle={'italic'}>
															{detalles_rol.descripcion}
														</Typography>
													</Box>
												</Box>
											}
										</Grid>
										<Grid container item xs={12} gap={1} sx={{ justifyContent: 'space-between' }} mt={1}>
											{rol_applications.data && rol_applications.data.rol.aplicaciones_por_talento.length > 0 &&
												rol_applications.data.rol.aplicaciones_por_talento.map((a, i) => {
													return <TalentoTableItem 
														key={i}
														id_estado_aplicacion_rol={a.id_estado_aplicacion}
														nombre={`${a.talento.nombre} ${a.talento.apellido}`}
														rating={4}
														union={(a.talento.info_basica && a.talento.info_basica.union) ? (a.talento.info_basica.union.id_union === 99) ? `${(a.talento.info_basica.union.descripcion) ? a.talento.info_basica.union.descripcion : 'N/D'}` : a.talento.info_basica.union.union.es : 'N/D'}
														ubicacion={(a.talento.info_basica) ? a.talento.info_basica.estado_republica.es : 'N/D'}
														peso={(a.talento.info_basica) ? a.talento.info_basica.peso : 0}
														altura={(a.talento.info_basica) ? a.talento.info_basica.altura : 0}
														images_urls={a.talento.media.filter(m =>  m.media.referencia.includes('FOTOS-PERFIL-TALENTO')).map(m => m.media.url)}
													/>
												})
											}
											{rol_applications.data && rol_applications.data.rol.aplicaciones_por_talento.length === 0 &&
												<>
													<Typography>Aun no hay aplicaciones para este rol</Typography>
													<Divider style={{ borderWidth: 1, height: 12, borderColor: '#069cb1', margin: 8 }} orientation='vertical' />
												</>
											}
										</Grid>
										<Grid xs={12} mt={4}>
											<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
												<Button sx={{ textTransform: 'none' }}>
													<Box sx={{ display: 'flex', alignItems: 'center' }}>
														<Image src="/assets/img/iconos/arow_l_blue.svg" width={15} height={15} alt="" />
														<Typography fontWeight={600}>Página previa</Typography>
													</Box>
												</Button>

												<Typography sx={{ color: '#069cb1' }} fontWeight={600} >1 de 1</Typography>

												<Button sx={{ textTransform: 'none' }}>
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
	if (context.query['id-proyecto']) {
		id_proyecto = parseInt(context.query['id-proyecto'] as string);
	}
	if (session && session.user) {
		if (session.user.tipo_usuario === TipoUsuario.CAZATALENTOS) {
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