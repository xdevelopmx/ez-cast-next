import { CalendarMonth, CheckBox } from "@mui/icons-material";
import { Box, Button, ButtonGroup, Card, CardContent, Checkbox, Chip, Divider, Grid, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Radio, Typography } from "@mui/material";
import { DatePicker, esES } from "@mui/x-date-pickers";
import { HorarioAgenda, LocalizacionesPorHorarioAgenda, Proyecto, Roles } from "@prisma/client";
import { Dayjs } from "dayjs";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Image from 'next/image';
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useMemo, useState } from "react";
import { Alertas, MainLayout, MenuLateral, FormGroup, MRadioGroup, Tag, AddButton, MSelect, ModalLocacion, SectionTitle, ModalLocacionState } from "~/components";
import { MContainer } from "~/components/layout/MContainer";
import MotionDiv from "~/components/layout/MotionDiv";
import ConfirmationDialog from "~/components/shared/ConfirmationDialog";
import { MTooltip } from "~/components/shared/MTooltip";
import { ResourceAlert } from "~/components/shared/ResourceAlert";
import AppContext from "~/context/app";
import { TipoUsuario } from "~/enums";
import useLang from "~/hooks/useLang";
import useNotify from "~/hooks/useNotify";
import { api, parseErrorBody } from "~/utils/api";

type tipos_locacion = 'PRESENCIAL' | 'VIRTUAL';
type tipos_audicion = 'AUDICION' | 'CALLBACK';

const NuevoHorarioAgendaVirtual = () => {
	const ctx = useContext(AppContext);
  	const textos = useLang(ctx.lang);

	const [showModal, setShowModal] = useState(false)

	const { notify } = useNotify();

	const [tipoAudicion, setTipoAudicion] = useState<{value: 'CALLBACK' | 'AUDICION', label: string}>({value: 'AUDICION', label: ``});
	const [tipoFechas, setTipoFechas] = useState<{value: 'NUEVAS' | 'ESTABLECIDAS', label: string}>({value: 'NUEVAS', label: ''});
	const [tipoLocacion, setTipoLocacion] = useState<{value: 'PRESENCIAL' | 'VIRTUAL', label: string}>({value: 'PRESENCIAL', label: ''});
	const [checkbox_tipo_fecha, setCheckboxTipoFecha] = useState<{value: 'INDIVIDUALES' | 'RANGO_FECHAS', label: string}>({value: 'INDIVIDUALES', label: ''});
	const [selected_proyecto, setSelectedProyecto] = useState<number>(0);
	const [fechas_audicion, setFechasAudicion] = useState<Map<string, { fecha_inicio: Date, fecha_fin: Date | null }>>(new Map());
	const [fechas_selected, setFechasSelected] = useState<{fecha_inicio: Date | null, fecha_fin: Date | null}>({fecha_inicio: null, fecha_fin: null});
	const [fechas_audicion_por_roles, setFechasAudicionPorRoles] = useState<Map<string, { fecha_inicio: Date, fecha_fin: Date | null }[]>>(new Map());
	const [locaciones, setLocaciones] = useState<(ModalLocacionState & {checked: boolean, state: 'GUARDADO' | 'HORARIO' | 'NUEVOS'})[]>([]);
	const [location_selected, setLocationSelected] = useState<(ModalLocacionState & {checked: boolean})>();
	const [notas, setNotas] = useState('');
	const [uso_horario_selected, setUsoHorarioSelected] = useState(1);
	const router = useRouter();
	const [confirmation_dialog, setConfirmationDialog] = useState<{ opened: boolean, title: string, content: JSX.Element, action: 'UPDATE', data: Map<string, unknown> }>({ opened: false, title: '', content: <></>, action: 'UPDATE', data: new Map });


	const proyectos = api.agenda_virtual.getAllProyectosByCazatalentosWithHorarioAgenda.useQuery(undefined, {
		refetchOnWindowFocus: false
	});

	const localizaciones_guardadas = api.agenda_virtual.getLocalizacionesGuardadas.useQuery(undefined, {
		refetchOnWindowFocus: false
	})

	const { id_horario } = useMemo(() => {
        const { id_horario } = router.query;
        if (id_horario) {
            return { id_horario: parseInt(id_horario as string) };
        }
        return { id_horario: 0 };
    }, [router.query]);

	const horario = api.agenda_virtual.getHorarioAgendaById.useQuery((id_horario) ? id_horario : 0, {
		refetchOnWindowFocus: false
	});

	useEffect(() => {
		if (localizaciones_guardadas.data) {
			const arr = locaciones.filter(l => l.state === 'NUEVOS');
			const saved_locaciones = new Set();
			localizaciones_guardadas.data.forEach(loc => {
				saved_locaciones.add(`${loc.id_estado_republica}-${loc.direccion}-${loc.direccion2}-${loc.codigo_postal}`);
				arr.push({
					...loc,
					direccion2: (loc.direccion2) ? loc.direccion2 : undefined,
					guardado_en_bd: true,
					state: 'GUARDADO',
					checked: false
				});
			})
			if (horario.data) {
				horario.data.localizaciones.forEach(loc => {
					if (!saved_locaciones.has(`${loc.id_estado_republica}-${loc.direccion}-${loc.direccion2}-${loc.codigo_postal}`)) {
						arr.push({
							...loc,
							direccion2: (loc.direccion2) ? loc.direccion2 : undefined,
							guardado_en_bd: false,
							state: 'HORARIO',
							checked: false
						});
					}
				})
			}
			setLocaciones(arr);
		}
	}, [localizaciones_guardadas.data, horario.data]);

	const estados_republica = api.catalogos.getEstadosRepublica.useQuery(undefined, {
        refetchOnWindowFocus: false
    });
	
	useEffect(() => {
		if (horario.data) {
			setSelectedProyecto(horario.data.id_proyecto);
			setTipoAudicion((horario.data.tipo_agenda === 'CALLBACK') ? {value: 'CALLBACK', label: `${textos['callback']}`} : {value: 'AUDICION', label: `${textos['audicion']}`});
			if (horario.data.tipo_agenda.toLowerCase() === 'callback') {
				setTipoFechas({value: 'NUEVAS', label: `${textos['nuevas']}`});
			} else {
				setTipoFechas((horario.data.tipo_fechas === 'NUEVAS') ? {value: 'NUEVAS', label: `${textos['nuevas']}`} : {value: 'ESTABLECIDAS', label: `${textos['establecidas']}`});
			}
			setTipoLocacion((horario.data.tipo_localizacion === 'PRESENCIAL') ? {value: 'PRESENCIAL', label: `${textos['presencial']}`} : {value: 'VIRTUAL', label: `${textos['virtual']}`});
			if (horario.data.tipo_fechas === `${textos['nuevas']}`) {
				horario.data.fechas.forEach((f) => {
					fechas_audicion.set(`${f.fecha_inicio}-${f.fecha_fin}`, {fecha_inicio: f.fecha_inicio, fecha_fin: f.fecha_fin});			
				})
				setFechasAudicion(new Map(fechas_audicion));
			}
			setNotas(horario.data.notas);
		}
	}, [horario.data]);

	useEffect(() => {
		if (proyectos.data && id_horario === 0) {
			const p = proyectos.data.filter(p => !p.horario_agenda)[0];
			if (p) {
				setSelectedProyecto(p.id);
			}
		}
	}, [proyectos.data, id_horario]);

	useEffect(() => {
		if (selected_proyecto > 0 && proyectos.data) {
			const proyecto = proyectos.data.filter(p => p.id === selected_proyecto)[0];
			if (proyecto) {
				const fechas_casting_por_roles = new Map<string, { fecha_inicio: Date, fecha_fin: Date | null }[]>();
				const fechas_repetidas = new Set();
				proyecto.rol.forEach(r => {
					if (r.casting) {
						r.casting.forEach(c => {
							if (fechas_casting_por_roles.has(r.nombre)) {
								const fechas_in_map = fechas_casting_por_roles.get(r.nombre);
								if (fechas_in_map) {
									if (!fechas_repetidas.has(`${c.fecha_inicio}-${c.fecha_fin}`)) {
										fechas_in_map.push({ fecha_inicio: c.fecha_inicio, fecha_fin: c.fecha_fin });
										fechas_casting_por_roles.set(r.nombre, fechas_in_map);
										fechas_repetidas.add(`${c.fecha_inicio}-${c.fecha_fin}`);
									}
								}
							} else {
								if (!fechas_repetidas.has(`${c.fecha_inicio}-${c.fecha_fin}`)) {
									fechas_casting_por_roles.set(r.nombre, [{ fecha_inicio: c.fecha_inicio, fecha_fin: c.fecha_fin }]);
									fechas_repetidas.add(`${c.fecha_inicio}-${c.fecha_fin}`);
								}
							}
						})
					}
				})
			
				setFechasAudicionPorRoles(new Map(fechas_casting_por_roles));
			}
		}
	}, [selected_proyecto, proyectos.data]);

	const usos_horarios = api.catalogos.getUsosDeHorario.useQuery(undefined, {
		refetchOnMount: false,
		refetchOnWindowFocus: false,
	});

	const save_horario = api.agenda_virtual.create.useMutation({
        onSuccess: (data) => {
            notify("success", `${textos['se_actualizo_con_exito']}`);
			//notify('success', 'Se actualizo el horario con exito');
			router.push(`/cazatalentos/agenda-virtual/horario/${data.id}`)
		},
		onError: (error) => {
			notify('error', parseErrorBody(error.message));
		}
    })

	const has_projects = proyectos.data ? proyectos.data.filter(p => !p.horario_agenda).length > 0 : false;

	const is_callback = horario.data ? horario.data.tipo_agenda.toLowerCase() ===  'callback' : false;

	const input_background_color = is_callback ? '#F9B233' : '#069cb1';

	const input_background_hover_color = is_callback ? '#ea9d2190' : '#069fff';

	useEffect(() => {
		setTipoAudicion({value: tipoAudicion.value, label: tipoAudicion.value === 'AUDICION' ? `${textos['audicion']}` : `${textos['callback']}`});
		setCheckboxTipoFecha({value: checkbox_tipo_fecha.value, label: `${textos['individuales']}`});
		setTipoFechas({value: tipoFechas.value, label: tipoFechas.value === 'NUEVAS' ? `${textos['nuevas']}` : `${textos['establecidas']}`});
		setTipoLocacion({value: tipoLocacion.value, label: tipoLocacion.value === 'PRESENCIAL' ? `${textos['presencial']}` : `${textos['virtual']}`});
	}, [textos]);

	const is_loading = proyectos.isFetching || localizaciones_guardadas.isFetching || horario.isFetching || estados_republica.isFetching || usos_horarios.isFetching;

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
							<Grid container className="container_list_proyects">
								<Grid item xs={12}>
									<Grid container item columns={12}>
										<Grid item md={1} textAlign={'center'}>
											<Image src="/assets/img/iconos/agenda.svg" width={50} height={50} style={{ margin: '15px 0 0 0', filter: 'invert(43%) sepia(92%) saturate(431%) hue-rotate(140deg) brightness(97%) contrast(101%)' }} alt="" />
										</Grid>
										<Grid item md={11}>
											<Typography fontWeight={800} sx={{ color: '#069cb1', fontSize: '2rem' }}>{textos['agenda_virtual']}</Typography>
											<Typography fontWeight={600} sx={{ color: '#000', fontSize: '`.7rem' }}>{textos['subtitle']}</Typography>
										</Grid>

									</Grid>
								</Grid>
								{!has_projects && id_horario === 0 &&
									<Box display="flex" flexDirection={'column'} justifyContent={'center'} alignItems={'center'}> 
										<div className="box_message_blue">
											<p className="h3" style={{ fontWeight: 600 }}>{textos['no_proyectos']}</p>
										</div>
										<Button onClick={() => { router.back()}} variant='contained' style={{width: '200px'}}>Regresar</Button>
									</Box>
								}
								{(has_projects || id_horario > 0)  &&
									<Grid container item xs={12} sx={{ padding: '5px 10px', margin: '45px 0 4px', border: '1px solid #069cb1', borderRadius: '10px' }}>
										<Grid container item xs={12} sx={{ padding: '5px 10px', margin: '4px 0', borderRadius: '10px' }} columns={18}>
											<Grid xs={12}>
												<ButtonGroup sx={{ mt: 2, mb: 0 }} variant="contained" aria-label="outlined primary button group">
													<Button
														style={{
															backgroundColor: (tipoAudicion.value === 'AUDICION') ? input_background_color : ''
														}}
														disabled={is_callback}
														onClick={() => { setTipoAudicion({value: 'AUDICION', label: `${textos['audicion']}`}) }}
														variant={tipoAudicion.value === 'AUDICION' ? 'contained' : 'outlined'}
													>
														{tipoAudicion.label}
													</Button>
													<Button
														style={{
															backgroundColor: (tipoAudicion.value === 'CALLBACK') ? input_background_color : ''
														}}
														disabled={!is_callback}
														onClick={() => { setTipoAudicion({value: 'CALLBACK', label: `${textos['callback']}`}) }}
														variant={tipoAudicion.value === 'CALLBACK' ? 'contained' : 'outlined'}
													>
														Callback
													</Button>
												</ButtonGroup>
											</Grid>
											<Grid xs={12} mt={4}>
												{id_horario === 0 &&
													<MSelect
														id="proyecto-select"
														loading={proyectos.isFetching}
														options={
															(proyectos.data)
																? proyectos.data.filter(p => !p.horario_agenda).map(s => { return { value: s.id.toString(), label: s.nombre } })
																: []
														}
														className={'form-input-md'}
														value={selected_proyecto.toString()}
														onChange={(e) => {
															setSelectedProyecto(parseInt(e.target.value))
														}}
														label={`${textos['proyecto_al_que_se_creara']} *`}
													/>
												}
												{id_horario > 0 &&
													<>
														<Typography>{`${textos['proyecto_al_que_se_creara']}`}</Typography>
														<Typography variant={'h5'}>{horario.data?.proyecto.nombre}</Typography>

													</>
												}
												<p style={{ color: '#069cb1' }}>
													{textos['label_control_interno']}
												</p>
											</Grid>
										</Grid>
										<Grid xs={12}>
											<Divider />
										</Grid>
										{/* <Grid xs={12}>
											<ButtonGroup sx={{ mt: 2, mb: 4 }} variant="contained" aria-label="outlined primary button group">
												<Button
													style={{
														backgroundColor: (tipoFechas.value === 'ESTABLECIDAS') ? input_background_color : ''
													}}
													disabled={is_callback}
													onClick={() => { setTipoFechas({value: 'ESTABLECIDAS', label: `${textos['establecidas']}`}) }}
													variant={tipoFechas.value === 'ESTABLECIDAS' ? 'contained' : 'outlined'}
												>
													{textos['usar_fechas_definidas_en_roles']}
												</Button>
												<Button
													style={{
														backgroundColor: (tipoFechas.value === 'NUEVAS') ? input_background_color : ''
													}}
													onClick={() => { setTipoFechas({value: 'NUEVAS', label: `${textos['nuevas']}`}) }}
													variant={tipoFechas.value === 'NUEVAS' ? 'contained' : 'outlined'}
												>
													{textos['definir_nuevas_fechas']}
												</Button>
											</ButtonGroup>
										</Grid> */}
										<Grid item xs={12} sx={{ padding: '5px 10px', margin: '4px 0' }}>
											<MotionDiv show={tipoFechas.value === 'NUEVAS'} animation="fade">

												<Grid container>
													<Grid xs={2}>
														<MRadioGroup
															label={`${textos['fecha_audicion']}`}
															labelStyle={{ fontSize: '1.1rem', color: '#000', fontWeight: 600 }}
															style={{ gap: 0 }}
															id="rango-de-fechas-radio"
															options={[`${textos['rango_fechas']}`, `${textos['individuales']}`]}
															value={checkbox_tipo_fecha.label}
															direction='vertical'
															onChange={(e) => {
																setCheckboxTipoFecha(e.target.value === `${textos['individuales']}` ? {value: 'INDIVIDUALES', label: `${textos['individuales']}`} : {value: 'RANGO_FECHAS', label: `${textos['rango_fechas']}`});
															}}
														/>

													</Grid>

													<Grid xs={12} md={8} mt={4}>
														<Grid container gap={4}>
															<Grid item xs={4} md={3}>
																<DatePicker
																	localeText={esES.components.MuiLocalizationProvider.defaultProps.localeText}
																	slotProps={{ textField: { size: 'small' } }}
																	sx={{
																		borderRadius: 12,
																	}} 
																	onAccept={(e) => {
																		if (e) {
																			setFechasSelected(prev => { return { fecha_inicio: new Date(e), fecha_fin: prev.fecha_fin }});
																			//setFormSelectTalento(prev => { return { ...prev, fecha_audicion: new Date(e.date()) }})
																		}
																	}}
																/>
															</Grid>
															<Grid item xs={4} md={3} style={{display: (checkbox_tipo_fecha.value === 'RANGO_FECHAS') ? 'flex' : 'none'}}>
																<MotionDiv show={checkbox_tipo_fecha.value === 'RANGO_FECHAS'} animation="fade">
																	<DatePicker
																		localeText={esES.components.MuiLocalizationProvider.defaultProps.localeText}
																		slotProps={{ textField: { size: 'small' } }}
																		sx={{
																			borderRadius: 12,
																		}} 
																		onAccept={(e) => {
																			if (e) {
																				setFechasSelected(prev => { return { fecha_inicio: prev.fecha_inicio, fecha_fin: new Date(e) }});
																				//setFormSelectTalento(prev => { return { ...prev, fecha_audicion: new Date(e.date()) }})
																			}
																		}}
																	/>
																</MotionDiv> 
															</Grid>
															<Grid item xs={2}>
																<Button
																	onClick={() => {
																		if (fechas_selected.fecha_inicio != null) {
																			if (fechas_selected.fecha_fin != null) {
																				if (fechas_selected.fecha_fin.getTime() < fechas_selected.fecha_inicio.getTime()) {
																					notify('warning', `${textos['fecha_final_menor_a_inicial']}`);
																					return;
																				}
																			}
																			fechas_audicion.set(`${fechas_selected.fecha_inicio}-${fechas_selected.fecha_fin}`, {fecha_inicio: fechas_selected.fecha_inicio, fecha_fin: fechas_selected.fecha_fin});
																			setFechasAudicion(new Map(fechas_audicion));
																		}
																	}}
																	sx={{
																		textTransform: 'none',
																		backgroundColor: tipoFechas.value === 'NUEVAS' ? input_background_color : '',
																		borderRadius: '16px',
																		color: '#fff',
																		width: 150,
																		marginLeft: 2,
																		'&:hover': {
																			backgroundColor: tipoFechas.value === 'NUEVAS' ? input_background_hover_color : '',
																			color: '#fff',
																		},
																		border: 'none',
																		outline: 'none'
																	}}
																>
																	{textos['agregar']} {textos['fecha']}
																</Button>
															</Grid>
															<Grid item xs={12}>
																{
																	Array.from(fechas_audicion).map((fecha, i) => (
																		<Tag styles={{ margin: 0.5, padding: 0.35 }} key={i}
																			text={(() => {
																				if (fecha[1].fecha_inicio) {
																					if (fecha[1].fecha_fin) {
																						return `${fecha[1].fecha_inicio.toLocaleDateString('es-mx', { day: '2-digit', month: '2-digit', year: '2-digit'})} - ${fecha[1].fecha_fin.toLocaleDateString('es-mx', {day: 'numeric', month: 'numeric', year: '2-digit'})}`
																					}
																					return new Date(fecha[1].fecha_inicio).toLocaleDateString('es-mx', {day: '2-digit', month: '2-digit', year: '2-digit'});
																				}
																				return 'ND';
																				})()
																			}
																			onRemove={() => {
																				fechas_audicion.delete(`${fecha[1].fecha_inicio}-${fecha[1].fecha_fin}`);
																				setFechasAudicion(new Map(fechas_audicion));
																			}}
																		/>
																	))
																}
															</Grid>
														</Grid>
													</Grid>

												</Grid>
											</MotionDiv>
											<MotionDiv show={tipoFechas.value === 'ESTABLECIDAS'} animation="fade">
												<Grid container sx={{ mt: 2 }}>
													
													{Array.from(fechas_audicion_por_roles).map((e, i) => {
														return (
															<Grid key={i} item xs={3} mx={2} my={2}>
																<Card sx={{padding: 2}}>
																	<SectionTitle dividerSx={{margin: 2}} title={e[0]} />
																	{
																		e[1].map((fecha, i) => (
																			<Tag styles={{ margin: 0.5, padding: 0.35 }} key={i}
																				text={(!fecha.fecha_fin) ? fecha.fecha_inicio.toLocaleDateString('es-mx', { day: '2-digit', month: '2-digit', year: '2-digit' }) : `${fecha.fecha_inicio.toLocaleDateString('es-mx', { day: '2-digit', month: '2-digit', year: '2-digit' })} - ${fecha.fecha_fin.toLocaleDateString('es-mx', { day: '2-digit', month: '2-digit', year: '2-digit'})}`}
																				onRemove={() => console.log('click')}
																			/>
																		))
																	}
																</Card>
															</Grid>
														)
													})}
												</Grid>
											</MotionDiv>

										</Grid>
										<Grid xs={12}>
											<Divider />
										</Grid>
										<Grid container xs={12}>
											<Grid xs={7}>
												<Grid xs={12}>
													<Typography fontWeight={600}>
														{textos['locacion']}
													</Typography>
												</Grid>
												<Grid xs={12}>
													<ButtonGroup sx={{ mt: 2, mb: 0 }} variant="contained" aria-label="outlined primary button group">
														<Button
															style={{
																backgroundColor: (tipoLocacion.value === 'PRESENCIAL') ? input_background_color : ''
															}}
															onClick={() => { setTipoLocacion({value: 'PRESENCIAL', label: `${textos['presencial']}`}) }}
															variant={tipoLocacion.value === 'PRESENCIAL' ? 'contained' : 'outlined'}
														>
															{`${textos['presencial']}`}
														</Button>
														<Button
															style={{
																backgroundColor: (tipoLocacion.value === 'VIRTUAL') ? input_background_color : ''
															}}
															onClick={() => { setTipoLocacion({value: 'VIRTUAL', label: `${textos['virtual']}`}) }}
															variant={tipoLocacion.value === 'VIRTUAL' ? 'contained' : 'outlined'}
														>
															{`${textos['virtual']}`}
														</Button>
													</ButtonGroup>
												</Grid>
												<Grid xs={12}>
													<MotionDiv show={tipoLocacion.value === 'PRESENCIAL'} animation='fade'>
														<Typography sx={{ color: '#069cb1' }}>
															{`${textos['locaciones_guardadas']}`}
														</Typography>
													</MotionDiv>
												</Grid>
												<Grid xs={12}>
													<MotionDiv show={tipoLocacion.value === 'PRESENCIAL'} animation='fade'>
														<>
															{
																locaciones.map((loc, i) => (
																	<Grid key={i} container xs={12} sx={{ alignItems: 'center' }}>
																		<Grid xs={1}>
																			<Checkbox 
																				onClick={() => {
																					setLocaciones(prev => {
																						return prev.map(l => {
																							if (l.id === loc.id) {
																								l.checked = !l.checked;
																							}
																							return l;
																						})
																					})
																				}}
																				checked={loc.checked}
																			/>
																		</Grid>
																		<Grid xs={7}>
																			<MContainer direction='horizontal'>
																				<Typography>
																					{loc.direccion}, {estados_republica.data?.filter(e => e.id === loc.id_estado_republica)[0]?.es} - {loc.id}
																				</Typography> 
																				{loc.guardado_en_bd && <Chip sx={{marginLeft: 4, padding: 2, backgroundColor: input_background_color, color: 'white'}} label={`${textos['guardado']}`} />}
																			</MContainer>
																		</Grid>
																		<Grid xs={2}>
																			<Button onClick={() => { 
																					setLocationSelected(loc);
																					setShowModal(true);
																				}} sx={{ textTransform: 'none' }}>
																				<Typography sx={{ color: '#069cb1', textDecoration: 'underline' }}>
																					{`${textos['editar']}`}
																				</Typography>
																			</Button>
																		</Grid>
																		<Grid xs={2}>
																			{!loc.guardado_en_bd &&
																				<Button onClick={() => { setLocaciones(prev => { return prev.filter(l => l.id !== loc.id)}) }} sx={{ textTransform: 'none' }}>
																					<Typography sx={{ color: '#069cb1', textDecoration: 'underline' }}>
																						{`${textos['eliminar']}`}
																					</Typography>
																				</Button>
																			}
																		</Grid>
																	</Grid>
																))
															}
														</>
													</MotionDiv>
												</Grid>
												<Grid xs={12}>
													<MotionDiv show={tipoLocacion.value === 'PRESENCIAL'} animation='fade'>
														<Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
															<AddButton
																aStyles={{ margin: 0, width: 200, borderRadius: '2rem' }}
																text={`${textos['agregar']} ${textos['locacion']}`}
																onClick={() => { 
																	setLocationSelected(undefined);
																	setShowModal(true) 
																}}
															/>

															<MTooltip
																color="blue"
																text="pendiente."
																placement="right"
															/>
														</Box>
													</MotionDiv>
												</Grid>
											</Grid>
											<Grid xs={1}></Grid>
											<Grid xs={3}>
												<Grid xs={12}>
													<FormGroup
														type={'text-area'}
														className={'form-input-md'}
														style={{ width: '100%' }}
														labelStyle={{ fontWeight: 600, width: '100%' }}
														labelClassName={'form-input-label'}
														value={notas}
														onChange={(e) => {
															setNotas(e.target.value)
														}}
														label={`${textos['notas_sobre_locacion']}`}
													/>
												</Grid>
												<Grid>
													<MSelect
														id="sindicato-select"
														loading={usos_horarios.isFetching}
														options={
															(usos_horarios.data)
																? usos_horarios.data.map(s => { return { value: s.id.toString(), label: ctx.lang === 'es' ? s.es : s.en } })
																: []
														}
														className={'form-input-md'}
														value={uso_horario_selected.toString()}
														onChange={(e) => {
															setUsoHorarioSelected(parseInt(e.target.value));
														}}
														label={`${textos['timezone']}*`}
													/>
												</Grid>
											</Grid>

											<Grid container xs={12} sx={{ flexDirection: 'column', alignItems: 'center' }} mt={4}>
												<Button
													onClick={() => {
														const params = new Map<string, unknown>();
														setConfirmationDialog({ action: 'UPDATE', data: params, opened: true, title: (id_horario === 0) ? `${textos['crear']} ${textos['horario']}` : `${textos['actualizar']} ${textos['horario']}`, content: <Typography variant="body2">{(id_horario > 0) ? `${textos['update_horario_confirmation_message']}` : `${textos['create_horario_confirmation_message']}`}</Typography> });
													}}
													sx={{
														textTransform: 'none',
														backgroundColor: input_background_color,
														color: '#fff',
														borderRadius: '2rem',
														'&:hover': {
															backgroundColor: input_background_hover_color,
														}
													}}>
													<Typography>
														{textos['guardar_y_personalizar']}
													</Typography>
												</Button>
												<Link href={'/cazatalentos/agenda-virtual'}>
													<Button
														sx={{
															textTransform: 'none',
														}}>
														<Typography sx={{ color: '#06adc3', textDecoration: 'underline' }}>
															{textos['cancelar']}
														</Typography>
													</Button>
												</Link>
											</Grid>
										</Grid>
									</Grid>
								}
							</Grid>
						</div>
					</div>
				</div>

				<ConfirmationDialog
                    opened={confirmation_dialog.opened}
                    onOptionSelected={(confirmed: boolean) => {
                        if (confirmed) {
                            switch (confirmation_dialog.action) {
                                case 'UPDATE': {
									if (locaciones.length === 0 || locaciones.filter(l => l.checked).length === 0 && tipoLocacion.value === 'PRESENCIAL') {
										notify('warning', `${textos['no_se_ha_seleccionado_una_locacion']}`);
										return;
									}
									if (selected_proyecto < 1) {
										notify('warning', `${textos['no_se_ha_seleccionado_un_proyecto']}`);
										return;
									}
									if (fechas_audicion.size < 1 && tipoFechas.value === 'NUEVAS') {
										notify('warning', `${textos['no_haz_seleccionado_ninguna_fecha']}`);
										return;
									}
									if (uso_horario_selected < 1) {
										notify('warning', `${textos['no_se_ha_seleccionado_el_uso_de_horario']}`);
										return;
									}

									let dates: {fecha_inicio: Date, fecha_fin: Date | null}[] = [];
									if (tipoFechas.value === 'ESTABLECIDAS') {
										Array.from(fechas_audicion_por_roles).forEach(f => {
											f[1].forEach(d => {
												dates.push({fecha_inicio: d.fecha_inicio, fecha_fin: d.fecha_fin});
											})
										})
									} else {
										dates = Array.from(fechas_audicion).map(f => { return { fecha_inicio: f[1].fecha_inicio, fecha_fin: f[1].fecha_fin }});
									}

									save_horario.mutate({
										locaciones: locaciones.filter(l => l.checked),
										fechas: dates,
										tipo_agenda: tipoAudicion.value,
										tipo_localizacion: tipoLocacion.value,
										tipo_fechas: tipoFechas.value,
										notas: notas,
										id_uso_horario: uso_horario_selected,
										id_proyecto: selected_proyecto
									})
                                    break;
                                }
                            }
                        }
                        setConfirmationDialog({ ...confirmation_dialog, opened: false });
                    }}
                    title={confirmation_dialog.title}
                    content={confirmation_dialog.content}
                />

				<ModalLocacion
					isOpen={showModal}
					setIsOpen={setShowModal}
					initialData={location_selected}
					onChange={(data, result) => {
						setLocationSelected(undefined);
						if (result > 0) {
							localizaciones_guardadas.refetch();
						}
						if (result === -1) {
							setLocaciones(prev => prev.concat([{...data, id: new Date().getTime(), checked: false, state: 'NUEVOS'}]));
						}
						if (result === 0) {
							setLocaciones(locaciones.map(loc => {
								if (loc.id === data.id) {
									loc.checked = false;
									loc.codigo_postal = data.codigo_postal;
									loc.direccion = data.direccion;
									loc.direccion2 = data.direccion2;
									loc.guardado_en_bd = data.guardado_en_bd;
									loc.id_estado_republica = data.id_estado_republica;
								} 
								return {...loc, state: 'HORARIO'};
							}));
						}
					}}
				/>
				<ResourceAlert
					busy={is_loading}
				/>
			</MainLayout>
		</>

	)
}

export default NuevoHorarioAgendaVirtual