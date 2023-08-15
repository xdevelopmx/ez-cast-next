import Image from 'next/image';
import { Box, Button, Dialog, DialogActions, DialogContent, Divider, FormControlLabel, Grid, Slide, Switch, TextField, Typography } from '@mui/material';
import React, { useMemo, useState, useEffect, useRef, useContext } from 'react'
import { AddButton, AudioBar, SectionTitle } from '~/components/shared'
import { MContainer } from '~/components/layout/MContainer';
import { useRouter } from 'next/router';
import { api, parseErrorBody } from '~/utils/api';
import { Carroucel } from '~/components/shared/Carroucel';
import { getSession } from "next-auth/react";
import { GetServerSideProps, NextPage } from "next";
import Constants from "~/constants";
import { User } from "next-auth";
import { TipoUsuario } from '~/enums';
import { Alertas, MainLayout, MenuLateral } from '~/components';
import { AnimatePresence } from 'framer-motion';
import Head from 'next/head';
import ConfirmationDialog from '~/components/shared/ConfirmationDialog';
import { TransitionProps } from '@mui/material/transitions';
import { Archivo } from '~/server/api/root';
import { FileManager } from '~/utils/file-manager';
import useNotify from '~/hooks/useNotify';
import { Delete, Edit, Share } from '@mui/icons-material';
import { Media } from '@prisma/client';
import AppContext from '~/context/app';
import useLang from '~/hooks/useLang';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
      children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
  ) {
    return <Slide direction="down" ref={ref} {...props} />;
});

export const MediaBank = (props: { id_talento: number, read_only: boolean }) => {
	const ctx = useContext(AppContext);
    const textos = useLang(ctx.lang);
	const [dialogImage, setDialogImage] = useState<{open: boolean, image: string}>({open: false, image: ''});
	const [dialogSelftape, setDialogSeltape] = useState({open: false});
	const [selftape, setSelftape] = useState<{video: Archivo | null, nombre: string, public: boolean, id: null | number}>({video: null, nombre: '', public: true, id: null});
	const [confirmation_dialog, setConfirmationDialog] = useState<{ opened: boolean, title: string, content: JSX.Element, action: 'DELETE' | 'EDIT', data: Map<string, unknown> }>({ opened: false, title: '', content: <></>, action: 'DELETE', data: new Map });
	const router = useRouter();
	const { notify } = useNotify();
	const [current_video_url, setCurrentVideoUrl] = useState('');

	const [current_selftape_video_url, setCurrentSeltapeVideoUrl] = useState('');

	const media_por_talento = api.talentos.getMediaByIdTalento.useQuery({ id: props.id_talento }, {
		refetchOnWindowFocus: false
	});

	const video_player = useRef<HTMLVideoElement | null>(null);

	const selftape_video_player = useRef<HTMLVideoElement | null>(null);

	const media = useMemo(() => {
		if (media_por_talento.data) {
			const fotos = media_por_talento.data.filter(m => m.media.type.includes('image')).map(a => a.media);
			const audios = media_por_talento.data.filter(m => m.media.type.includes('audio')).map(a => a.media);
			const videos = media_por_talento.data.filter(m => m.media.type.includes('video') && m.media.referencia.startsWith('VIDEOS-TALENTO')).map(a => a.media);
			const selftapes = media_por_talento.data.filter(m => m.media.type.includes('video') && m.media.referencia.startsWith('VIDEOS-SELFTAPE')).map(a => a.media);
			return { fotos: fotos, audios: audios, videos: videos, selftapes: selftapes }
		}
		return null;
	}, [media_por_talento.data]);

	useEffect(() => {
		if (!dialogSelftape.open) {
			setSelftape({video: null, nombre: '', public: true, id: null});
		}
	}, [dialogSelftape.open])

	useEffect(() => {
		if (current_video_url !== '' && video_player.current) {
			video_player.current.setAttribute('src', current_video_url);
			video_player.current.load();
		}
	}, [current_video_url]);

	useEffect(() => {
		if (media && media.videos.length > 0 && current_video_url === '') {
			const video = media.videos[0];
			if (video) {
				setCurrentVideoUrl(video.url);
			}
		}
		if (media && media.selftapes.length > 0 && current_selftape_video_url === '') {
			const video = media.selftapes[0];
			if (video) {
				setCurrentSeltapeVideoUrl(video.url);
			}
		}
	}, [media]);

	useEffect(() => {
		if (current_selftape_video_url !== '' && selftape_video_player.current) {
			selftape_video_player.current.setAttribute('src', current_selftape_video_url);
			selftape_video_player.current.load();
		}
	}, [current_selftape_video_url]);

	const saveSelftapeMedia = api.talentos.saveSelftape.useMutation({
        onSuccess(input) {
           notify('success', `${textos['success_save_selftape_media']}`);
           media_por_talento.refetch();
		   setSelftape({video: null, nombre: '', public: true, id: null});
		   setDialogSeltape({open: false});
        },
        onError: (error) => {
            notify('error', parseErrorBody(error.message));
        }
    })

	const deleteSelftapeMedia = api.talentos.deleteSelftape.useMutation({
        onSuccess(input) {
           notify('success', `${textos['success_delete_selftape_media']}`);
           media_por_talento.refetch();
        },
        onError: (error) => {
            notify('error', parseErrorBody(error.message));
        }
    })


	const SelftapeElement = (props: {selftape: Media}) => {
		return (
			<Box marginRight={1} display={"flex"} flexDirection={'column'}> 
				<Button
					onClick={() => {
						setCurrentSeltapeVideoUrl(props.selftape.url);
					}}
					size='small'
					variant={props.selftape.url === current_selftape_video_url ? 'contained' : 'outlined'}
					endIcon={<Image style={{ marginLeft: 5, cursor: 'pointer', filter: (props.selftape.url === current_selftape_video_url) ? 'brightness(0) saturate(100%) invert(85%) sepia(21%) saturate(2191%) hue-rotate(331deg) brightness(99%) contrast(97%)' : '' }} src="/assets/img/iconos/play.svg" width={20} height={20} alt="" />}
				>
					{props.selftape.nombre}
				</Button>
				<Box my={0.5} gap={0.5} display={'flex'} flexDirection={'row'}  flexWrap={'wrap'} justifyContent={'space-between'}> 
					<Button
						onClick={() => {
							const map = new Map();
							map.set("id", props.selftape.id);
							setConfirmationDialog({ 
								action: 'DELETE', 
								data: map,
								opened: true, 
								title: 'Eliminar Self-Tape', 
								content: 
									<Box>
										<Typography>Seguro que deseas eliminar este selftape?</Typography>
									</Box>
								}
							);
						}}
						size='small'
						style={{flexGrow: 1, borderRadius: 0}}
						variant={props.selftape.url === current_selftape_video_url ? 'contained' : 'outlined'}
						endIcon={<Delete/>}
					>
					</Button>
					<Button
						onClick={async () => {
							const file = await FileManager.convertUrlToFile(props.selftape.url, props.selftape.nombre, props.selftape.type);
							if (file) {
								const base64 = await FileManager.convertFileToBase64(file);
								if (base64) {
									setSelftape({
										video: {file: file, base64: base64, name: file.name}, 
										nombre: file.name, 
										public: props.selftape.public, 
										id: props.selftape.id
									});
									setDialogSeltape({open: true});
								}

							}
						}}
						size='small'
						style={{flexGrow: 1, borderRadius: 0}}
						variant={props.selftape.url === current_selftape_video_url ? 'contained' : 'outlined'}
						endIcon={<Edit/>}
					>
					</Button>
					<Button
						onClick={async () => {
							navigator.clipboard.writeText(props.selftape.url);
                            notify('success', `${textos['link_copied']}`);
						}}
						size='small'
					
						style={{flexGrow: 1, borderRadius: 0}}
						variant={props.selftape.url === current_selftape_video_url ? 'contained' : 'outlined'}
						endIcon={<Share/>}
					>
					</Button>
				</Box>
			</Box>
		)
	}
	return (
		<>
			<Head>
				<title>Talentos | Talent Corner</title>
				<meta name="description" content="Talent Corner" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<MainLayout menuSiempreBlanco={true}>
				<AnimatePresence>
					<div className="d-flex wrapper_ezc">
						<MenuLateral />
						<div className="seccion_container col" style={{ paddingTop: 0 }}>
							<br /><br />
							<div className="container_box_header">
								<div className="d-flex justify-content-end align-items-start py-2">
									<Alertas />
								</div>
								<Box p={8}>
									<Box display={'flex'} flexDirection={'row'} gap={2}>
										<Image src='/assets/img/iconos/agenda.svg' width={32} height={32} alt="" />
										<Typography>Media Bank</Typography>
									</Box>
									<Grid id="media" container sx={{ mt: 10 }}>
										<Grid item xs={12}>
											<SectionTitle title='Media' textButton={`${textos['editar']}`} onClickButton={(!props.read_only) ? () => {
												// eslint-disable-next-line @typescript-eslint/no-floating-promises
												router.push(`/talento/editar-perfil?step=2&id_talento=${props.id_talento}`);
											} : undefined} />
										</Grid>
										<Grid item xs={12}>
											<MContainer direction='horizontal' styles={{ alignItems: 'center', padding: '15px 0px', justifyContent: 'space-between' }}>
												<MContainer direction='horizontal' styles={{ alignItems: 'center' }}>
													<Image src="/assets/img/iconos/cam_outline_blue.svg" width={30} height={30} alt="" />
													<Typography sx={{ color: '#069CB1', pl: 1 }} fontWeight={900}>{textos['galeria_imagenes']}</Typography>
												</MContainer>
												{!props.read_only &&
													<AddButton
														aStyles={{ margin: 0 }}
														onClick={() => {
															// eslint-disable-next-line @typescript-eslint/no-floating-promises
															router.push('/talento/editar-perfil?step=2')
														}}
														text={`${textos['agregar']} ${textos['imagenes']}`}
													/>
												}
											</MContainer>
											{!media || media.fotos.length === 0 &&
												<Typography fontSize={'1.5rem'} sx={{ color: '#F9B233' }} fontWeight={400}>{textos['usuario_no_ha_capturado'] ? textos['usuario_no_ha_capturado'].replace('[TYPE]', `${textos['imagen']}`) : 'Texto No definido'}</Typography>
											}
											{media && media.fotos.map((image, i) => {
												return <Image onClick={() => { setDialogImage({image: image.url, open: true}) }} key={i} width={191} height={217} src={image.url} alt="" />
											})}
											<Divider sx={{ mt: 3 }} />
										</Grid>

										<Grid item xs={12}>
											<MContainer direction='horizontal' justify='space-between' styles={{ alignItems: 'center' }}>
												<MContainer direction='vertical' styles={{ width: '28%', alignItems: 'center' }}>
													<Image src="/assets/img/iconos/web_cam_blue.png" width={50} height={30} alt="" />
													<Typography sx={{ color: '#069CB1', textAlign: 'center', marginTop: 1 }} fontWeight={900}>
														VIDEO <br /> REEL
													</Typography>
												</MContainer>
												<MContainer direction='vertical' styles={{ width: '70%', alignItems: 'flex-end' }}>
													{!props.read_only &&
														<AddButton text={`${textos['agregar']} ${textos['video']}s`} aStyles={{ margin: 10 }} onClick={() => {
															// eslint-disable-next-line @typescript-eslint/no-floating-promises
															router.push('/talento/editar-perfil?step=2')
														}} />
													}
													{media && media.videos.length > 0 &&
														<>
															<video ref={video_player} controls style={{ width: '100%' }}>
																<source src={current_video_url} type="video/mp4" />
																Lo sentimos tu navegador no soporta videos.
															</video>
															<MContainer styles={{ marginTop: 16 }} direction='horizontal'>
																<>
																	{media.videos.map((v, i) => {
																		return <Button
																			key={i}
																			onClick={() => {
																				setCurrentVideoUrl(v.url);
																			}}
																			size='small'
																			style={{ margin: 8 }}
																			variant={v.url === current_video_url ? 'contained' : 'outlined'}
																			endIcon={<Image style={{ marginLeft: 5, cursor: 'pointer', filter: (v.url === current_video_url) ? 'brightness(0) saturate(100%) invert(85%) sepia(21%) saturate(2191%) hue-rotate(331deg) brightness(99%) contrast(97%)' : '' }} src="/assets/img/iconos/play.svg" width={20} height={20} alt="" />}
																		>
																			{v.nombre}
																		</Button>
																	})}
																</>
															</MContainer>

														</>

													}
													{!media || media.videos.length === 0 &&
														<Typography fontSize={'1.5rem'} sx={{ color: '#F9B233' }} fontWeight={400}>{textos['usuario_no_ha_capturado'] ? textos['usuario_no_ha_capturado'].replace('[TYPE]', `${textos['video']}`) : 'Texto No definido'}</Typography>
													}
												</MContainer>
											</MContainer>
											<Divider sx={{ mt: 3 }} />
										</Grid>

										<Grid item xs={12}>
											<MContainer direction='horizontal' justify='space-between' styles={{ alignItems: 'center' }}>
												<MContainer direction='vertical' styles={{ width: '28%', alignItems: 'center' }}>
													<Image src="/assets/img/iconos/micro_web_blue.svg" width={60} height={40} alt="" />
													<Typography sx={{ color: '#069CB1', textAlign: 'center', marginTop: 1 }} fontWeight={900}>
														AUDIO <br /> CLIPS
													</Typography>
												</MContainer>
												<MContainer direction='vertical' styles={{ width: '70%', alignItems: 'flex-end' }}>
													{!props.read_only &&
														<AddButton text={`${textos['agregar']} ${textos['audio']}s`} aStyles={{ marginBottom: 10 }} onClick={() => {
															// eslint-disable-next-line @typescript-eslint/no-floating-promises
															router.push('/talento/editar-perfil?step=2')
														}}
														/>
													}
													{media && media.audios.length > 0 &&
														media.audios.map((audio, i) => {
															return <AudioBar key={i}
																name={audio.nombre}
																url={audio.url}
															/>
														})
													}
													{!media || media.audios.length === 0 &&
														<Typography fontSize={'1.5rem'} sx={{ color: '#F9B233' }} fontWeight={400}>{textos['usuario_no_ha_capturado'] ? textos['usuario_no_ha_capturado'].replace('[TYPE]', `${textos['audio']}`) : 'Texto No definido'}</Typography>
													}
												</MContainer>
											</MContainer>
											<Divider sx={{ mt: 3 }} />
										</Grid>
										<Grid item xs={12}>
											<MContainer direction='horizontal' justify='space-between' styles={{ alignItems: 'center' }}>
												<MContainer direction='vertical' styles={{ width: '28%', alignItems: 'center' }}>
													<Image src="/assets/img/iconos/web_cam_blue.png" width={50} height={30} alt="" />
													<Typography sx={{ color: '#069CB1', textAlign: 'center', marginTop: 1 }} fontWeight={900}>
														Selftapes
													</Typography>
												</MContainer>
												<MContainer direction='vertical' styles={{ width: '70%', alignItems: 'flex-end' }}>
													
													{!props.read_only &&
														<Box display={'flex'} flexDirection={'row'} gap={2}>
															<AddButton text={`${textos['subir']} Self-Tape`} aStyles={{ margin: 10, backgroundColor: (media && media.selftapes.length <= 5) ? '' : 'lightgrey' }} onClick={() => {
																if (media && media.selftapes.length <= 5) {
																	setDialogSeltape({open: true});
																}
															}} />
															<AddButton text={`${textos['grabar_selftape']}`} aStyles={{ margin: 10 }} onClick={() => {
																// eslint-disable-next-line @typescript-eslint/no-floating-promises
																router.push('/talento/self-tape')
															}} />
														</Box>
													}
													{media && media.selftapes.length > 0 &&
														<>
															<video ref={selftape_video_player} controls style={{ width: '100%' }}>
																<source src={current_selftape_video_url} type="video/mp4" />
																Lo sentimos tu navegador no soporta videos.
															</video>
															<MContainer styles={{ marginTop: 16, width: '100%' }} direction='horizontal'>
																<Box display="flex" flexDirection={'column'}>
																	{media.selftapes.filter(s => s.public).length > 0 &&
																		<>
																			<Typography variant='h6'>{textos['publico']}s</Typography>
																			<Box display="flex" flexDirection={'row'}>
																				{media.selftapes.filter(s => s.public).map((v, i) => {
																					return <SelftapeElement key={i} selftape={v}/>
																				})}
																			</Box>
																		</>
																	}
																	{media.selftapes.filter(s => !s.public).length > 0 &&
																		<>
																			<Typography variant='h6'>{textos['privado']}s</Typography>
																			<Box display="flex" flexDirection={'row'} >
																				{media.selftapes.filter(s => !s.public).map((v, i) => {
																					return <SelftapeElement key={i} selftape={v}/>
																				})}
																			</Box>
																		</>
																	}
																</Box>
															</MContainer>

														</>

													}
													 {!media || media.selftapes.length === 0 &&
														<Typography fontSize={'1.5rem'} sx={{ color: '#F9B233' }} fontWeight={400}>{textos['usuario_no_ha_capturado'] ? textos['usuario_no_ha_capturado'].replace('[TYPE]', `${textos['selftape']}`) : 'Texto No definido'}</Typography>
													}
												</MContainer>
											</MContainer>
										</Grid>
									</Grid>

								</Box>
							</div>
						</div>
					</div>
					<Dialog  
						maxWidth={'md'} style={{ padding: 0, margin: 0, overflow: 'hidden'}} 
						open={dialogImage.open} 
						onClose={() => setDialogImage({ ...dialogImage, open: false })}
						TransitionComponent={Transition}
					>
						<div style={{ position: 'relative', width: 500, aspectRatio: '500/720', maxWidth: '100%' }}>
							<Image fill  src={dialogImage.image} style={{ objectFit: 'cover' }} alt="" />
						</div>
					</Dialog>
					<Dialog
						fullWidth={true}
						maxWidth={'xs'}
						open={dialogSelftape.open}
						onClose={() => { setDialogSeltape({...dialogSelftape, open: false}) }}
					>
						<DialogContent>
							<Box>
								<Typography>{textos['dialog_selftape_titulo']}</Typography>
								<Box ml={'calc(50% - 125px)'} my={2}>


									<Button style={{ fontWeight: 800, color: '#069cb1', width: 250 }} className="btn  btn-social mr-1 ml-1" variant="outlined" component="label">
										<MContainer direction='vertical'>
												<MContainer direction='horizontal'>
													<Image width={16} height={16} className="mr-2" src="/assets/img/iconos/cruz_blue.svg" alt="Boton de agregar credito" />
													<Typography fontSize={'0.9rem'} fontWeight={700}>
													{textos['selecciona_un_video']}
													</Typography>

												</MContainer>
											
										</MContainer>
										<input onChange={async (ev) => {
											if (ev.target.files) {
												const file = ev.target.files[0];
												if (file) {
													const base_64 = await FileManager.convertFileToBase64(file);
													setSelftape((prev) => { return {...prev, video: {
														file: file,
														base64: base_64,
														name: file.name
													}}})
												}
											}
										}} hidden accept="video/mp4, video/mov, video/webm" type="file" />
									</Button>
								</Box>
								{selftape.video &&
									<>
										<video controls style={{ width: '100%' }} src={selftape.video.base64}>
											Lo sentimos tu navegador no soporta videos.
										</video>
										<Box my={2}>
											<label
												style={{fontWeight: 600, width: '100%'}}
												className={'form-input-label'}
												htmlFor={'nombre-input'}
											>
												{textos['nombre']}*
											</label>
											<TextField
												size="small"
												id="nombre-input"
												type='text'
												value={selftape.nombre}
												onChange={(e) => {
													setSelftape((prev) => { return {...prev, nombre: e.target.value }})
													//params.set('nombre', e.target.value);
												}}
											/>

										</Box>
										<FormControlLabel control={<Switch onChange={() => { 
											setSelftape((prev) => { return {...prev, public: !prev.public }})
										}} checked={selftape.public} />} label={textos['publico']} />
									</>
								}
							</Box>
						</DialogContent>
						<DialogActions>
							<Button onClick={() => { setDialogSeltape({...dialogSelftape, open: false}) }}>{textos['cerrar']}</Button>
							<Button onClick={async () => {
								if ((media && media.selftapes.length <= 5 && !selftape.id) || selftape.id) {
									if (selftape.video) {
										const date = new Date();
										const name = `selftape-${date.toLocaleDateString('es-mx').replaceAll('/', '-')}-${date.toLocaleTimeString('es-mx')}`;
										const urls_saved = await FileManager.saveFiles([{path: `talentos/${props.id_talento}/videos`, name: name, file: selftape.video.file, base64: selftape.video.base64}]);
										if (urls_saved.length > 0) {
											urls_saved.forEach((res, j) => {
												Object.entries(res).forEach((e, i) => {
													const url = e[1].url;  
													if (url) {
														saveSelftapeMedia.mutate({
															id_talento: props.id_talento,
															selftape: {
																id: selftape.id,
																nombre: (selftape.nombre.length > 0) ? selftape.nombre : name,
																type: (selftape.video) ? selftape.video.file.type : 'video/webm',
																url: (url) ? url : '',
																clave: `talentos/${props.id_talento}/videos/${name}`,
																referencia: `VIDEOS-SELFTAPE-TALENTO-${props.id_talento}`,
																identificador: `video-selftape-${name}`,
																public: selftape.public
															}
														})
													} else {
														notify('error', `${(name) ? `${textos['video_no_se_pudo_subir']?.replace('[N]', name)}` : textos['un_video_no_se_pudo_subir']}`);
													}
												})
											});
										}
									} else {
										notify('warning', `${textos['no_haz_seleccionado_ningun_video']}`);
									}
								} else {
									notify('warning', `${textos['limite_selftapes']}`);
								}
							}}
							>
								{textos['guardar']}
							</Button>
						</DialogActions>
					</Dialog>
					<ConfirmationDialog
						opened={confirmation_dialog.opened}
						onOptionSelected={async (confirmed: boolean) => {
							if (confirmed) {
								switch (confirmation_dialog.action) {
									case 'DELETE': {
										const id = confirmation_dialog.data.get('id');
										deleteSelftapeMedia.mutate(id as number);
										break;
									}
								}
							}
							setConfirmationDialog({ ...confirmation_dialog, opened: false });
						}}
						title={confirmation_dialog.title}
						content={confirmation_dialog.content}
					/>
				</AnimatePresence>
			</MainLayout>
		</>
	)
}

export const getServerSideProps: GetServerSideProps = async (context) => {
	const session = await getSession(context);
	if (session && session.user && session.user.tipo_usuario) {
		if ([TipoUsuario.TALENTO, TipoUsuario.REPRESENTANTE].includes(session.user.tipo_usuario)) {
			const { id_talento } = context.query;
			const talento_id = (session.user.tipo_usuario === TipoUsuario.TALENTO) ? session.user.id : id_talento as string;
			return {
				props: {
					user: session.user,
					id_talento: parseInt(talento_id)
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

export default MediaBank;