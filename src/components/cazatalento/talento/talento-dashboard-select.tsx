import { Close, MessageOutlined } from '@mui/icons-material';
import { Box, Button, Checkbox, Dialog, DialogContent, DialogContentText, DialogTitle, Divider, FormControlLabel, Grid, Typography } from '@mui/material'
import { type FC, useReducer, useState, useEffect, useRef } from 'react';
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
import { DatePicker, esES, jaJP } from '@mui/x-date-pickers';
import { Dayjs } from 'dayjs';

interface Props {
    id_talento: number,
	id_rol: number
}

export const TalentoDashBoardSelect: FC<Props> = ({ id_talento, id_rol }) => {

    const [dialog, setDialog] = useState<{open: boolean, title: string, id: 'agregar_nota_talento' | 'reportar_talento' | 'elegir_talento' }>({ open: false, title: '', id: 'elegir_talento' });
	
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

	const talento_nota = api.cazatalentos.getNotaTalentoByCazatalento.useQuery({id_talento: id_talento}, {
		refetchOnWindowFocus: false
	});

	const fechas_casting_rol = api.roles.getFechasCasting.useQuery(id_rol, {
		refetchOnWindowFocus: false
	});

    const updateTalentoDestacado = api.cazatalentos.updateTalentoDestacado.useMutation({
		onSuccess: (data) => {
			void talento_stars.refetch();
			notify('success', 'Se actualizo la calificacion con exito');
		},
		onError: (error) => {
			notify('error', parseErrorBody(error.message));
		}
	})

	const updateNotaTalento = api.cazatalentos.updateNotaTalento.useMutation({
		onSuccess: (data) => {
			void talento_nota.refetch();
			notify('success', 'Se actualizo la nota con exito');
			setDialog({ ...dialog, open: false });
		},
		onError: (error) => {
			notify('error', parseErrorBody(error.message));
		}
	})

	const deleteNotaTalento = api.cazatalentos.deleteNotaTalento.useMutation({
		onSuccess: (data) => {
			void talento_nota.refetch();
			notify('success', 'Se elimino la nota con exito');
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
			notify('success', 'Se actualizo la audicion con exito');
			setDialog({ ...dialog, open: false });
		},
		onError: (error) => {
			notify('error', parseErrorBody(error.message));
		}
	})


    const updateReporteTalento = api.cazatalentos.updateReporteTalento.useMutation({
		onSuccess: (data) => {
			void reporte_talento.refetch();
			notify('success', 'Se actualizo el reporte con exito');
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

    return (
        <>
            <MContainer direction='horizontal' justify='space-between'>
                <Button onClick={() => { void router.replace('/cazatalentos/billboard') }} variant='text' startIcon={<motion.img src="/assets/img/iconos/return_blue.svg" alt="icono" />}>
                    <p className="color_a mb-0 ml-2"><b>Regresar a Billboard</b></p>
                </Button>
                <Box width={'60%'} textAlign={'end'}>
                    <MotionDiv show={!talento_nota.isFetching && talento_nota.data == null} animation="fade">
                        <Button onClick={() => { setDialog({ open: true, title: 'Escribir un comentario sobre el Talento', id: 'agregar_nota_talento' }) }} endIcon={<MessageOutlined />}>
                            Agrega una nota
                        </Button>
                    </MotionDiv>
                    <MContainer direction="horizontal" justify='space-between'>
                        
                        <MotionDiv show={talento_nota.data != null} animation="fade">
                            <MContainer direction="horizontal">
                                <Typography mr={2}>Nota</Typography>
                                <MessageOutlined style={{marginRight: 64}}/>
                                <Button size='small' style={{textDecoration: 'underline'}} variant="text" onClick={() => {
                                    updateNotaTalento.mutate({
                                        id_talento: id_talento,
                                        nota: form_nota_talento.nota
                                    });
                                }}>Guardar</Button>
                            </MContainer>
                        </MotionDiv>
                        {(talento_nota.isFetching || !talento_nota.data) && <Box></Box>}
                        <MContainer direction='horizontal' styles={{ marginTop: 8 }}>
                            <Typography style={{ marginRight: 16 }}>Destacar </Typography>
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
									}}>Eliminar</Button>
								</>
								
                            </MotionDiv>
                        </Box>
                        <Box>
                            <Button disabled={!audicion_talento.isFetching && audicion_talento.data != null} variant='contained' onClick={() => { setDialog({ open: true, title: 'Elegir Talento', id: 'elegir_talento' }) }} style={{ borderRadius: 16, width: '100%', maxWidth: 280 }}>
                                {audicion_talento.isFetching && <Typography>Cargando...</Typography>}
								{!audicion_talento.isFetching && audicion_talento.data != null && <Typography>Audicion Programada</Typography>}
								{!audicion_talento.isFetching && !audicion_talento.data && <Typography>Elegir Talento</Typography>}
                            </Button>
                            <Button disabled={!reporte_talento.isFetching && reporte_talento.data != null} variant={(!reporte_talento.isFetching && reporte_talento.data != null) ? 'contained' : 'text'} color="error" onClick={() => { setDialog({ open: true, title: 'Reportar', id: 'reportar_talento' }) }} style={{ borderRadius: 16, width: '100%', marginTop: 8, textDecoration: 'underline', maxWidth: 280 }}>
								{reporte_talento.isFetching && <Typography>Cargando...</Typography>}
								{!reporte_talento.isFetching && reporte_talento.data != null && <Typography>Reporte Enviado</Typography>}
								{!reporte_talento.isFetching && !reporte_talento.data && <Typography>Reportar</Typography>}
							</Button>
                        </Box>
                    </MContainer>
                </Box>
            </MContainer>
            <Dialog maxWidth={'xs'} style={{ padding: 0, margin: 0 }} open={dialog.id === 'elegir_talento' && dialog.open} onClose={() => setDialog({ ...dialog, open: false })}>
				<DialogTitle align="center" style={{color: '#069cb1'}}>{dialog.title}</DialogTitle>
				<DialogContent style={{padding: 0}}>
					<DialogContentText fontSize={14} px={4} textAlign={'justify'}>
						La solicitud le llegará al Talento en mensajes.
						Mantente al pendiente de tu entrada de mensajes
						para saber la respuesta.
					</DialogContentText>
					<Typography variant="body2" px={4} py={2}>
						Elige el tipo de audición del Talento
					</Typography>
					<MContainer styles={{paddingLeft: 24, paddingRight: 24, marginBottom: 8}} direction='horizontal'>
						<Button 
							onClick={() => {setFormSelectTalento(prev => { return {...prev, tipo_audicion: 'audicion'} })}} 
							variant='outlined' 
							style={{color: (form_select_talento.tipo_audicion === 'audicion') ? '#069cb1' : 'gray', borderColor: (form_select_talento.tipo_audicion === 'audicion') ? '#069cb1' : 'gray'}}
							startIcon={<Image style={{filter: (form_select_talento.tipo_audicion === 'callback') ? 'brightness(0) saturate(100%) invert(51%) sepia(0%) saturate(0%) hue-rotate(142deg) brightness(98%) contrast(83%)' : ''}} width={32} height={32} alt="" src={"/assets/img/iconos/icono_lampara_blue.svg"}/>}>
							Audición
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
							Elige la fecha de la audición
						</label>
						<DatePicker
							localeText={esES.components.MuiLocalizationProvider.defaultProps.localeText}
							slotProps={{ textField: { size: 'small' } }}
							shouldDisableDate={(date: Dayjs) => {
								const day = date.date();
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
									setFormSelectTalento(prev => { return { ...prev, fecha_audicion: new Date(e.date()) }})
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
							label='Agrega un mensaje'
						/>
					</Box>
					<Box p={4} style={{display: 'flex', flexDirection: 'row'}} sx={{backgroundColor: 'gray'}}>
						<Image style={{marginTop: 8}} width={32} height={32} alt="" src={"/assets/img/iconos/agenda_white.svg"}/>
						<Box>
							<Typography variant="subtitle1" color={'white'}>Agregar a Agenda Virtual</Typography>
							<Typography variant="body2" color='white'>Disponible en membresías Premium y Ejecutiva</Typography>
						</Box>
					</Box>
				</DialogContent>
				<Box style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
					<Button style={{marginLeft: 8, marginRight: 8}} startIcon={<Close />} onClick={() => setDialog({ ...dialog, open: false })}>Cancelar</Button>
					<Button style={{marginLeft: 8, marginRight: 8}} startIcon={<Image src={'/assets/img/iconos/check_blue.svg'} height={16} width={16} alt=""/>} onClick={() => {
						if (form_select_talento.fecha_audicion) {
							updateSeleccionTalento.mutate({
								id_rol: id_rol,
								id_talento: id_talento,
								fecha_audicion: form_select_talento.fecha_audicion.toDateString(),
								tipo_audicion: form_select_talento.tipo_audicion,
								mensaje: form_select_talento.mensaje,
							})
						} else {
							notify('warning', 'No haz seleccionado una fecha para la audicion');
						}
					}}>Enviar</Button>
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
					<Button style={{marginLeft: 8, marginRight: 8}} startIcon={<Close />} onClick={() => setDialog({ ...dialog, open: false })}>Cancelar</Button>
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
                                notify('warning', 'No seleccionaste ningun tipo de reporte');
                            }
                        }
                    }>
                        Enviar
                    </Button>
				</Box>
			</Dialog>
			<Dialog maxWidth={'xs'} style={{ padding: 0, margin: 0 }} open={dialog.id === 'agregar_nota_talento'  && dialog.open} onClose={() => setDialog({ ...dialog, open: false })}>
				<DialogTitle align="center" style={{color: '#069cb1'}}>{dialog.title}</DialogTitle>
				<DialogContent style={{padding: 0}}>
					<DialogContentText fontSize={14} px={4} textAlign={'justify'}>
						Deja un comentario para recordar en tu
						proceso de selección
						Estos no serán vistos por el Talento.
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
					<Button style={{marginLeft: 8, marginRight: 8}} startIcon={<Close />} onClick={() => setDialog({ ...dialog, open: false })}>Cancelar</Button>
					<Button style={{marginLeft: 8, marginRight: 8}} startIcon={<Image src={'/assets/img/iconos/check_blue.svg'} height={16} width={16} alt=""/>} onClick={() => {
						updateNotaTalento.mutate({
							id_talento: id_talento,
							nota: form_nota_talento.nota
						});
						
					}}>Enviar</Button>
				</Box>
			</Dialog>
        </>
    )
}
