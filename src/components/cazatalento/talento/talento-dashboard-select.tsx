import { Close, MessageOutlined } from '@mui/icons-material';
import { Box, Button, Checkbox, Dialog, DialogContent, DialogContentText, DialogTitle, Divider, FormControlLabel, Grid, Typography } from '@mui/material'
import { type FC, useReducer, useState, useEffect, useRef, useContext, useMemo } from 'react';
import { MContainer } from '~/components/layout/MContainer'
import MotionDiv from '~/components/layout/MotionDiv';
import { FormGroup, MCheckboxGroup, MRadioGroup, SectionTitle } from '~/components/shared'
import { MTooltip } from '~/components/shared/MTooltip'
import { type RolCompensacionForm } from '~/pages/cazatalentos/roles/agregar-rol';
import { api, parseErrorBody } from '~/utils/api';
import Image from 'next/image';
import useNotify from '~/hooks/useNotify';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { conversorFecha } from '~/utils/conversor-fecha';
import {DatePicker, DesktopDatePicker, esES, jaJP } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import AppContext from '~/context/app';
import useLang from '~/hooks/useLang';
import React from 'react';
import Constants from '~/constants';

interface Props {
    id_talento: number,
	id_rol: number
}

export const TalentoDashBoardSelect: FC<Props> = ({ id_talento, id_rol }) => {
	const ctx = useContext(AppContext);
    const textos = useLang(ctx.lang);

    const [dialog, setDialog] = useState<{open: boolean, title: string, id: 'agregar_nota_talento' | 'reportar_talento' | 'elegir_talento' | '0' }>({ open: false, title: '', id: '0' });
	
    const { notify } = useNotify();

    const router = useRouter();
	const [form_select_talento, setFormSelectTalento] = useState<{tipo_audicion: 'audicion' | 'callback', fecha_audicion: null | Date, mensaje: string}>({
		tipo_audicion: 'audicion',
		fecha_audicion: null,
		mensaje: ''
	});
	const [form_nota_talento, setFormNotaTalento] = useState({nota: ''});
	const [form_reporte_talento, setFormReporteTalento] = useState({tipo_reporte: '', comentario: ''});
	
    const handleTalentoStars = (stars: number) => {
		let _stars = stars;
		if (talento_stars.data) {
			if (_stars === talento_stars.data) {
				_stars = (stars - 1);
			}
		}
		updateTalentoDestacado.mutate({
			id_talento: id_talento,
			id_rol: id_rol,
			calificacion: _stars
		})
	}

    const tipo_reportes_talento = api.catalogos.getTipoReportesTalento.useQuery(undefined, {
		refetchOnWindowFocus: false
	});

    const talento_stars = api.cazatalentos.getTalentoRatingByCazatalento.useQuery({id_talento: id_talento}, {
		refetchOnWindowFocus: false
	});

    const reporte_talento = api.cazatalentos.getReporteTalentoByCazatalento.useQuery({id_talento: id_talento}, {
        refetchOnWindowFocus: false
    });

	const audicion_talento = api.cazatalentos.getAudicionTalentoByRol.useQuery({id_talento: id_talento, id_rol: id_rol}, {
		refetchOnWindowFocus: false
	});

	console.log(audicion_talento.data);

	const talento_nota = api.cazatalentos.getNotaTalentoByCazatalento.useQuery({id_talento: id_talento}, {
		refetchOnWindowFocus: false
	});

	const fechas_casting_rol = api.roles.getFechasCasting.useQuery(id_rol, {
		refetchOnWindowFocus: false
	});

    const updateTalentoDestacado = api.cazatalentos.updateTalentoDestacado.useMutation({
		onSuccess: (data) => {
			void talento_stars.refetch();
			//notify('success', 'Se actualizo la calificacion con exito');
			notify("success", `${textos['se_actualizo_calificacion_con_exito']}`);
			// se_actualizo_calificacion_con_exito: 'se_actualizo_calificacion_con_exito'
			// se_actualizo_nota_con_exito: 'se_actualizo_calificacion_con_exito'
			// se_elimino_nota_con_exito: 'se_actualizo_calificacion_con_exito'
			// se_actualizo_talento_con_exito: 'se_actualizo_calificacion_con_exito'
		},
		onError: (error) => {
			notify('error', parseErrorBody(error.message));
		}
	})

	const updateNotaTalento = api.cazatalentos.updateNotaTalento.useMutation({
		onSuccess: (data) => {
			void talento_nota.refetch();
			notify("success", `${textos['se_actualizo_nota_con_exito']}`);
			//notify('success', 'Se actualizo la nota con exito');
			setDialog({ ...dialog, open: false });
		},
		onError: (error) => {
			notify('error', parseErrorBody(error.message));
		}
	})

	const deleteNotaTalento = api.cazatalentos.deleteNotaTalento.useMutation({
		onSuccess: (data) => {
			void talento_nota.refetch();
			notify("success", `${textos['se_elimino_nota_con_exito']}`);
			//notify('success', 'Se elimino la nota con exito');
			setDialog({ ...dialog, open: false });
		},
		onError: (error) => {
			notify('error', parseErrorBody(error.message));
		}
	})

	const marcar_aplicacion_como_visto = api.cazatalentos.marcarComoVistoAplicacionRolTalento.useMutation({
		onError: (error) => {
			notify('error', parseErrorBody(error.message));
		}
	})

	useEffect(() => {
		marcar_aplicacion_como_visto.mutate({
			id_talento: id_talento,
			id_rol: id_rol
		})
	}, []);


	const updateSeleccionTalento = api.cazatalentos.updateSeleccionTalento.useMutation({
		onSuccess: (data) => {
			void audicion_talento.refetch();
			//notify('success', 'Se actualizo la audicion con exito');
			notify("success", `${textos['se_actualizo_talento_destacado_con_exito']}`);
			setDialog({ ...dialog, open: false });
		},
		onError: (error) => {
			notify('error', parseErrorBody(error.message));
		}
	})


    const updateReporteTalento = api.cazatalentos.updateReporteTalento.useMutation({
		onSuccess: (data) => {
			void reporte_talento.refetch();
			//notify('success', 'Se actualizo el reporte con exito');
			notify("success", `${textos['se_actualizo_reporte_talento_con_exito']}`);
			setDialog({ ...dialog, open: false });
		},
		onError: (error) => {
			notify('error', parseErrorBody(error.message));
		}
	})

    useEffect(() => {
        if (talento_nota.data) {
            setFormNotaTalento({nota: talento_nota.data.nota});
        }
    }, [talento_nota.data]);

    useEffect(() => {
        if (reporte_talento.data) {
            setFormReporteTalento({tipo_reporte: reporte_talento.data.reporte.es, comentario: reporte_talento.data.comentario});
        }
    }, [reporte_talento.data]);

	const auditions_expired = useMemo(() => {
		let expired = true;
		if (fechas_casting_rol.data) {
			const today = new Date();
			today.setHours(0, 0, 0, 0);
			fechas_casting_rol.data.forEach((date: string) => {
				const d1 = new Date(date);
				d1.setHours(0, 0, 0, 0);
				if (d1 >= today) {
					expired = false;
				}
			});
		}
		return expired;
	}, [fechas_casting_rol.data]);

	const disable_button_select_talent = useMemo(() => {
		if (audicion_talento.data) {
			if (audicion_talento.data.tipo_audicion.toLocaleLowerCase() === 'callback') {
				return ![Constants.ESTADOS_ASIGNACION_AUDICION.AUDICION_CONFIRMADO, Constants.ESTADOS_ASIGNACION_AUDICION.CALLBACK_RECHAZADO].includes(audicion_talento.data.estado);
			} else {
				// audicion
				return ![Constants.ESTADOS_ASIGNACION_AUDICION.AUDICION_RECHAZADO].includes(audicion_talento.data.estado);
			}
		}
		return false;
	}, [audicion_talento.data]);

	console.log('disable_button_select_talent', disable_button_select_talent);

	useEffect(() => {
		setFormSelectTalento(prev => {
			return {
				...prev,
				tipo_audicion: (auditions_expired) ? 'callback' : 'audicion'
			}
		})
	}, [auditions_expired]);

	const getAuditionLabel = () => {
		if (audicion_talento.data) {
			switch (audicion_talento.data.estado) {
				case Constants.ESTADOS_ASIGNACION_AUDICION.AUDICION_CONFIRMADO: return `${textos['audicion_confirmada']}`;
				case Constants.ESTADOS_ASIGNACION_AUDICION.AUDICION_RECHAZADO: return `${textos['audicion_rechazada']}`;
				case Constants.ESTADOS_ASIGNACION_AUDICION.AUDICION_PENDIENTE: return `${textos['audicion_programada']}`;
				case Constants.ESTADOS_ASIGNACION_AUDICION.CALLBACK_CONFIRMADO: return `${textos['callback_confirmado']}`;
				case Constants.ESTADOS_ASIGNACION_AUDICION.CALLBACK_RECHAZADO: return `${textos['callback_rechazado']}`;
				case Constants.ESTADOS_ASIGNACION_AUDICION.CALLBACK_PENDIENTE: return `${textos['callback_programado']}`;
			}
		}
		return '';
	}

	console.log(audicion_talento.data);

    return (
        <>
            <MContainer direction='horizontal' justify='space-between'>
                <Button onClick={() => { void router.replace('/cazatalentos/billboard') }} variant='text' startIcon={<motion.img src="/assets/img/iconos/return_blue.svg" alt="icono" />}>
                    <p className="color_a mb-0 ml-2"><b>{textos['regresar_billboard']}</b></p>
                </Button>
                <Box width={'60%'} textAlign={'end'}>
                    <MotionDiv show={!talento_nota.isFetching && talento_nota.data == null} animation="fade">
                        <Button onClick={() => { setDialog({ open: true, title: `${textos['escribir_un_comentario_sobre_talento']}`, id: 'agregar_nota_talento' }) }} endIcon={<MessageOutlined />}>
                            {textos['agregar']} {textos['una']} {textos['nota']}
                        </Button>
                    </MotionDiv>
                    <MContainer direction="horizontal" justify='space-between'>
                        
                        <MotionDiv show={talento_nota.data != null} animation="fade">
                            <MContainer direction="horizontal">
                                <Typography mr={2}>{textos['nota']}</Typography>
                                <MessageOutlined style={{marginRight: 64}}/>
                                <Button size='small' style={{textDecoration: 'underline'}} variant="text" onClick={() => {
                                    updateNotaTalento.mutate({
                                        id_talento: id_talento,
                                        nota: form_nota_talento.nota
                                    });
                                }}>{textos['actualizar']}</Button>
                            </MContainer>
                        </MotionDiv>
                        {(talento_nota.isFetching || !talento_nota.data) && <Box></Box>}
                        <MContainer direction='horizontal' styles={{ marginTop: 8 }}>
                            <Typography style={{ marginRight: 16 }}>{textos['destacar']} </Typography>
                            <Box sx={{ display: 'flex', gap: .5 }}>
                                {Array.from({length: 5}).map((v, i) => {
                                    return <Image key={i} style={{cursor: 'pointer'}} onClick={() => { handleTalentoStars(i + 1) }} src={(talento_stars.data && talento_stars.data  >= (i + 1)) ? '/assets/img/iconos/estrella-fill.svg' : '/assets/img/iconos/estrella_empty.svg'} width={20} height={20} alt="" />
                                })}
                            </Box>
                        </MContainer>
                    </MContainer>
                    <Divider style={{marginBottom: 8}}/>
                    <MContainer direction="horizontal" justify='space-between'>
                        <Box>
                            <MotionDiv show={talento_nota.data != null} animation="fade">
                                <>
									<FormGroup
										type={'text-area'}
										className={'form-input-md'}
										style={{ width: '100%' }}
										value={form_nota_talento.nota}
										onChange={(e) => {
											setFormNotaTalento({nota: e.target.value})
										}}
									/>
									<Button startIcon={<Image src={'/assets/img/iconos/trash_blue.png'} width={16} height={16} alt="archivar" />} size='small' variant='outlined' onClick={() => {
										deleteNotaTalento.mutate({
											id_talento: id_talento
										});
									}}>{`${textos['eliminar']}`}</Button>
								</>
								
                            </MotionDiv>
                        </Box>
                        <Box>
							<Button disabled={disable_button_select_talent} variant='contained' onClick={() => { setDialog({ open: true, title: `${textos['elegir_talento']}`, id: 'elegir_talento' }) }} style={{ borderRadius: 16, width: '100%', maxWidth: 280 }}>
                                {audicion_talento.isFetching && <Typography>Cargando...</Typography>}
								{!audicion_talento.isFetching && audicion_talento.data != null && <Typography>{getAuditionLabel()}</Typography>}
								{!audicion_talento.isFetching && !audicion_talento.data && <Typography>{textos['elegir_talento']}</Typography>}
                            </Button>
                            <Button disabled={!reporte_talento.isFetching && reporte_talento.data != null} variant={(!reporte_talento.isFetching && reporte_talento.data != null) ? 'contained' : 'text'} color="error" onClick={() => { setDialog({ open: true, title: 'Reportar', id: 'reportar_talento' }) }} style={{ borderRadius: 16, width: '100%', marginTop: 8, textDecoration: 'underline', maxWidth: 280 }}>
								{reporte_talento.isFetching && <Typography>{textos['cargando']}...</Typography>}
								{!reporte_talento.isFetching && reporte_talento.data != null && <Typography>{textos['reporte_enviado']}</Typography>}
								{!reporte_talento.isFetching && !reporte_talento.data && <Typography>{textos['reportar']}</Typography>}
							</Button>
                        </Box>
                    </MContainer>
                </Box>
            </MContainer>
            <Dialog maxWidth={'xs'} style={{ padding: 0, margin: 0 }} open={dialog.id === 'elegir_talento' && dialog.open} onClose={() => setDialog({ ...dialog, open: false })}>
				<DialogTitle align="center" style={{color: '#069cb1'}}>{dialog.title}</DialogTitle>
				<DialogContent style={{padding: 0}}>
					<DialogContentText fontSize={14} px={4} textAlign={'justify'}>
						{textos['modal_elegir_talento_body']}
					</DialogContentText>
					<Typography variant="body2" px={4} py={2}>
						{textos['elige_tipo_audicion_talento']}
					</Typography>
					<MContainer styles={{paddingLeft: 24, paddingRight: 24, marginBottom: 8}} direction='horizontal'>
						<Button 
							onClick={() => {setFormSelectTalento(prev => { return {...prev, tipo_audicion: 'audicion'} })}} 
							variant='outlined' 
							disabled={auditions_expired}
							style={{color: (form_select_talento.tipo_audicion === 'audicion') ? '#069cb1' : 'gray', borderColor: (form_select_talento.tipo_audicion === 'audicion') ? '#069cb1' : 'gray'}}
							startIcon={<Image style={{filter: (form_select_talento.tipo_audicion === 'callback') ? 'brightness(0) saturate(100%) invert(51%) sepia(0%) saturate(0%) hue-rotate(142deg) brightness(98%) contrast(83%)' : ''}} width={32} height={32} alt="" src={"/assets/img/iconos/icono_lampara_blue.svg"}/>}>
							{textos['audicion']}
						</Button>
						<Button 
							onClick={() => {setFormSelectTalento(prev => { return {...prev, tipo_audicion: 'callback'} })}} 
							variant="outlined" 
							style={{color: (form_select_talento.tipo_audicion === 'callback') ? '#069cb1' : 'gray', borderColor: (form_select_talento.tipo_audicion === 'callback') ? '#069cb1' : 'gray'}}
							startIcon={<Image style={{filter: (form_select_talento.tipo_audicion === 'audicion') ? 'brightness(0) saturate(100%) invert(51%) sepia(0%) saturate(0%) hue-rotate(142deg) brightness(98%) contrast(83%)' : ''}} width={32} height={32} alt="" src={'/assets/img/iconos/icono_claqueta_blue.svg'}/>}>
							Callback
						</Button>
					</MContainer>
					<Box px={4}>

						<label
							style={{ fontWeight: 600, width: '100%', marginTop: 10 }}
							className={'form-input-label'}
						>
							{textos['elige_fecha_audición']}
						</label>
						<DatePicker
							localeText={esES.components.MuiLocalizationProvider.defaultProps.localeText}
							slotProps={{ textField: { size: 'small' } }}
							shouldDisableDate={(date: Dayjs) => {
								if (auditions_expired) {
									const d1 = date.toDate();
									d1.setHours(0, 0, 0, 0);
									const today = new Date();
									today.setHours(0, 0, 0, 0);
									return d1 < today;
								}
								const day = date.date() + 1; //por alguna razon se tiene que poner + 1 :o : querayos
								const month = date.month();
								const year = date.year();
								return (!fechas_casting_rol.data || !fechas_casting_rol.data.has(`${day < 10 ? `0${day}` : day}/${month < 9 ? `0${month + 1}` : month + 1}/${year}`));
							  }}
							sx={{
								borderRadius: 12,
								width: 200
							}} 
							onAccept={(e) => {
								if (e) {
									setFormSelectTalento(prev => { return { ...prev, fecha_audicion: e.toDate() }})
								}
							}}
						/>
						<FormGroup
							type={'text-area'}
							className={'form-input-md'}
							style={{ width: '80%' }}
							labelStyle={{ fontWeight: 600, width: '100%', marginTop: 10 }}
							labelClassName={'form-input-label'}
							value={form_select_talento.mensaje}
							onChange={(e) => {
								setFormSelectTalento(prev => { return { ...prev, mensaje: e.target.value } })
							}}
							label={`${textos['agrega_un_mensaje']}`}
						/>
					</Box>
					<Box p={4} style={{display: 'flex', flexDirection: 'row'}} sx={{backgroundColor: 'gray'}}>
						<Image style={{marginTop: 8}} width={32} height={32} alt="" src={"/assets/img/iconos/agenda_white.svg"}/>
						<Box>
							<Typography variant="subtitle1" color={'white'}>{textos['agregar_a_agenda_virtual']}</Typography>
							<Typography variant="body2" color='white'>{textos['disponible_para_membresias_premium']}</Typography>
						</Box>
					</Box>
				</DialogContent>
				<Box style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
					<Button style={{marginLeft: 8, marginRight: 8}} startIcon={<Close />} onClick={() => setDialog({ ...dialog, open: false })}>Cancelar</Button>
					<Button style={{marginLeft: 8, marginRight: 8}} startIcon={<Image src={'/assets/img/iconos/check_blue.svg'} height={16} width={16} alt=""/>} onClick={() => {
						if (form_select_talento.fecha_audicion) {
							const d = form_select_talento.fecha_audicion.toLocaleDateString('es-mx').split('/');
							let parsed_date = '';
							if (d[0] && d[1] && d[2]) {
								parsed_date = `${parseInt(d[0]) > 10 ? d[0] : `0${d[0]}`}/${parseInt(d[1]) > 10 ? d[1] : `0${d[1]}`}/${d[2]}`;
							}
							updateSeleccionTalento.mutate({
								id_rol: id_rol,
								id_talento: id_talento,
								fecha_audicion: parsed_date,
								tipo_audicion: form_select_talento.tipo_audicion,
								mensaje: form_select_talento.mensaje,
							})
						} else {
							notify('warning', `${textos['no_haz_seleccionado_ninguna_fecha']}`);
						}
					}}>{textos['enviar']}</Button>
				</Box>
			</Dialog>
			<Dialog maxWidth={'md'} style={{ padding: 0, margin: 0 }} open={dialog.id === 'reportar_talento' && dialog.open} onClose={() => setDialog({ ...dialog, open: false })}>
				<DialogTitle align="center" style={{color: 'red'}}>{dialog.title}</DialogTitle>
				<DialogContent style={{paddingLeft: 64, paddingRight: 32}}>
					<MRadioGroup
						style={{gap: 4}}
						elementStyle={{width: 300}}
                        direction='vertical'
                        id="tipos-reportes"
                        options={
                            (tipo_reportes_talento.data)
                                ? tipo_reportes_talento.data.slice(0, tipo_reportes_talento.data.length / 2).map(g => g.es)
                                : []
                        }
                        value={form_reporte_talento.tipo_reporte}
                        onChange={(ev) => {
                            setFormReporteTalento(prev => {return {...prev, 'tipo_reporte': ev.target.value}})
                        }}
                    />
					<MRadioGroup
						style={{gap: 4}}
						elementStyle={{width: 300}}
                        direction='vertical'
                        id="tipos-reportes"
                        options={
                            (tipo_reportes_talento.data)
                                ? tipo_reportes_talento.data.slice(tipo_reportes_talento.data.length / 2).map(g => g.es)
                                : []
                        }
                        value={form_reporte_talento.tipo_reporte}
                        onChange={(ev) => {
                            setFormReporteTalento(prev => {return {...prev, 'tipo_reporte': ev.target.value}})
                        }}
                    />
					<FormGroup
						type={'text-area'}
						className={'form-input-md'}
						style={{ width: '80%' }}
						labelStyle={{ fontWeight: 600, width: '100%', marginTop: 10 }}
						labelClassName={'form-input-label'}
                        value={form_reporte_talento.comentario}
						onChange={(e) => {
							setFormReporteTalento(prev => {return {...prev, comentario: e.target.value}})
						}}
						label='Escribe un comentario'
					/>
				</DialogContent>
				<Box style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
					<Button style={{marginLeft: 8, marginRight: 8}} startIcon={<Close />} onClick={() => setDialog({ ...dialog, open: false })}>{textos['cancelar']}</Button>
					<Button 
                        style={{marginLeft: 8, marginRight: 8}} 
                        startIcon={<Image src={'/assets/img/iconos/check_blue.svg'} height={16} width={16} alt=""/>} 
                        onClick={() => {

                            const id_tipo_reporte = (tipo_reportes_talento.data) ? tipo_reportes_talento.data.filter(t => t.es === form_reporte_talento.tipo_reporte)[0] : undefined;
                            if (id_tipo_reporte) {
                                updateReporteTalento.mutate({
                                    id_talento: id_talento,
                                    id_tipo_reporte: id_tipo_reporte.id,
                                    comentario: form_reporte_talento.comentario
                                })
                            } else {
                                notify('warning', `${textos['no_se_ha_seleccionado_un_tipo_de_reporte']}`);
                            }
                        }
                    }>
                        {textos['enviar']}
                    </Button>
				</Box>
			</Dialog>
			<Dialog 
			maxWidth={'xs'} style={{ padding: 0, margin: 0 }} 
			open={dialog.id === 'agregar_nota_talento' && dialog.open} 
			keepMounted
			onClose={() => setDialog({ ...dialog, open: false })}
			>
				<DialogTitle align="center" style={{color: '#069cb1'}}>{dialog.title}</DialogTitle>
				<DialogContent style={{padding: 0}}>
					<DialogContentText fontSize={14} px={4} textAlign={'justify'}>
						{textos['modal_comentario_talento']}
					</DialogContentText>
					<Box px={4}>
						<FormGroup
							type={'text-area'}
							className={'form-input-md'}
							style={{ width: '100%' }}
							value={form_nota_talento.nota}
							onChange={(e) => {
								setFormNotaTalento({nota: e.target.value})
							}}
						/>
					</Box>
				</DialogContent>
				<Box style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
					<Button style={{marginLeft: 8, marginRight: 8}} startIcon={<Close />} onClick={() => setDialog({ ...dialog, open: false })}>{`${textos['cancelar']}`}</Button>
					<Button style={{marginLeft: 8, marginRight: 8}} startIcon={<Image src={'/assets/img/iconos/check_blue.svg'} height={16} width={16} alt=""/>} onClick={() => {
						updateNotaTalento.mutate({
							id_talento: id_talento,
							nota: form_nota_talento.nota
						});
						
					}}>{`${textos['guardar']}`}</Button>
				</Box>
			</Dialog>

        </>
    )
}
