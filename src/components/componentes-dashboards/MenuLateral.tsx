import React, { useEffect, useMemo, useState } from 'react'
import { Grid, IconButton, Button, Typography, Skeleton, Box } from '@mui/material'
import { motion } from 'framer-motion'
import { CameraAlt, Close } from '@mui/icons-material';
import { FormGroup } from '../shared/FormGroup';
import { MContainer } from '../layout/MContainer';
import { signOut } from 'next-auth/react'
import Image from 'next/image';
import { api, parseErrorBody } from '~/utils/api';
import { useSession } from "next-auth/react"
import { TipoUsuario } from '~/enums';
import useNotify from '~/hooks/useNotify';

/*

	<p className="text-white"><em>Productor en Un Lugar</em></p>
				<p className="text-white menu_bio">Biografía breve, 100 caracteres dos renglones</p>
				<div className="d-lg-flex justify-content-center box_social">
					<a target="_blank" href="#">
						<motion.img className=" m-2" src="/assets/img/iconos/icon_vimeo.svg" alt="" />
					</a>
					<a target="_blank" href="#">
						<motion.img className=" m-2" src="/assets/img/iconos/icon_linkedin.svg" alt="" />
					</a>
					<a target="_blank" href="#">
						<motion.img className=" m-2" src="/assets/img/iconos/icon_youtube.svg" alt="" />
					</a>
					<a target="_blank" href="#">
						<motion.img className=" m-2" src="/assets/img/iconos/icon_imbd.svg" alt="" />
					</a>
					<a target="_blank" href="#">
						<motion.img className=" m-2" src="/assets/img/iconos/icon_Twitwe.svg" alt="" />
					</a>
					<a target="_blank" href="#">
						<motion.img className=" m-2" src="/assets/img/iconos/icon_insta.svg" alt="" />
					</a>
				</div>
				<div className="d-lg-flex justify-content-center mt-2 mb-2">
					<motion.img className="mr-2" src="/assets/img/iconos/icon_website.svg" alt="" />
					<a target="_blank" href="#" className="text-white">www.ivanaguilao.com</a>
				</div>

*/


/*

<Grid item xs={12}  textAlign={'start'}>
							<MContainer direction='vertical' styles={{alignContent: 'space-around'}}>
								<FormGroup
									show_error_message={false}
									error={(() => {
										const pagina_web = form.redes_sociales['pagina_web'];
										if (pagina_web && pagina_web.length > 0 && !URL_PATTERN.test(pagina_web)) {
											return 'La url es invalida';
										}
										return undefined;
									})()}
									style={{width: 200}}
									labelStyle={{ fontWeight: 800, fontSize: '1.1rem', textAlign: 'start' }}
									value={form.redes_sociales['pagina_web']}
									onChange={(e) => { 
										setForm({...form, redes_sociales: {...form.redes_sociales, pagina_web: e.target.value}}) 
									}}
									label='Link a pagina web'
								/>
							</MContainer>
						</Grid>
						<Grid item xs={12}  textAlign={'center'}>
							<Typography fontSize={'1rem'} fontWeight={400} variant="body1">{'Link a redes sociales'}</Typography>
						</Grid>
						<Grid item xs={12}  textAlign={'start'}>
							<MContainer direction='vertical' styles={{alignContent: 'space-around'}}>
								<FormGroup
									show_error_message={false}
									error={(() => {
										const vimeo = form.redes_sociales['vimeo'];
										if (vimeo && vimeo.length > 0 && !URL_PATTERN.test(vimeo)) {
											return 'La url es invalida';
										}
										return undefined;
									})()}
									style={{width: 200}}
									labelStyle={{ fontWeight: 800, fontSize: '1.1rem', textAlign: 'start' }}
									value={form.redes_sociales['vimeo']}
									onChange={(e) => { 
										setForm({...form, redes_sociales: {...form.redes_sociales, vimeo: e.target.value}}) 
									}}
									icon={{
										element: <Image className='mx-2' width={20} height={20} src="/assets/img/iconos/icon_vimeo_blue.svg" alt="" />,
										position: 'end'
									}}
									label='Vimeo'
								/>
							</MContainer>
						</Grid>
						<Grid item xs={12} sx={{mt: 1}}  textAlign={'start'}>
							<MContainer direction='vertical' styles={{alignContent: 'space-around'}}>
								<FormGroup
									show_error_message={false}
									error={(() => {
										const youtube = form.redes_sociales['youtube'];
										if (youtube && youtube.length > 0 && !URL_PATTERN.test(youtube)) {
											return 'La url es invalida';
										}
									})()}
									style={{width: 200}}
									labelStyle={{ fontWeight: 800, fontSize: '1.1rem', textAlign: 'start' }}
									value={form.redes_sociales['youtube']}
									onChange={(e) => { 
										setForm({...form, redes_sociales: {...form.redes_sociales, youtube: e.target.value}}) 
									}}
									icon={{
										element: <Image className='mx-2' width={20} height={20} src="/assets/img/iconos/icon_youtube_blue.svg" alt="" />,
										position: 'end'
									}}
									label='Youtube'
								/>
							</MContainer>
						</Grid>
						<Grid item xs={12}  textAlign={'start'}>
							<MContainer direction='vertical' styles={{alignContent: 'space-around'}}>
								<FormGroup
									show_error_message={false}
									error={(() => {
										const linkedin = form.redes_sociales['linkedin'];
										if (linkedin && linkedin.length > 0 && !URL_PATTERN.test(linkedin)) {
											return 'La url es invalida';
										}
										return undefined;
									})()}
									style={{width: 200}}
									labelStyle={{ fontWeight: 800, fontSize: '1.1rem', textAlign: 'start' }}
									value={form.redes_sociales['linkedin']}
									onChange={(e) => { 
										setForm({...form, redes_sociales: {...form.redes_sociales, linkedin: e.target.value}}) 
									}}
									icon={{
										element: <Image className='mx-2' width={20} height={20} src="/assets/img/iconos/icon_linkedin_blue.svg" alt="" />,
										position: 'end'
									}}
									label='Linkedin' 
								/>
							</MContainer>
						</Grid>
						<Grid item xs={12}  textAlign={'start'}>
							<MContainer direction='vertical' styles={{alignContent: 'space-around'}}>
								<FormGroup
									show_error_message={false}
									error={(() => {
										const instagram = form.redes_sociales['instagram'];
										if (instagram && instagram.length > 0 && !URL_PATTERN.test(instagram)) {
											return 'La url es invalida';
										}
										return undefined;
									})()}
									style={{width: 200}}
									labelStyle={{ fontWeight: 800, fontSize: '1.1rem', textAlign: 'start' }}
									value={form.redes_sociales['instagram']}
									onChange={(e) => { 
										setForm({...form, redes_sociales: {...form.redes_sociales, instagram: e.target.value}}) 
									}}
									icon={{
										element: <Image className='mx-2' width={20} height={20} src="/assets/img/iconos/icon_insta_blue.svg" alt="" />,
										position: 'end'
									}}
									label='Instagram' 
								/>
							</MContainer>
						</Grid>
						<Grid item xs={12} textAlign={'start'}>
							<MContainer direction='vertical' styles={{alignContent: 'space-around'}}>
								<FormGroup
									show_error_message={false}
									error={(() => {
										const twitter = form.redes_sociales['twitter'];
										if (twitter && twitter.length > 0 && !URL_PATTERN.test(twitter)) {
											return 'La url es invalida';
										}
										return undefined;
									})()}
									style={{width: 200}}
									labelStyle={{ fontWeight: 800, fontSize: '1.1rem', textAlign: 'start' }}
									value={form.redes_sociales['twitter']}
									onChange={(e) => { 
										setForm({...form, redes_sociales: {...form.redes_sociales, twitter: e.target.value}}) 
									}}
									icon={{
										element: <Image className='mx-2' width={20} height={20} src="/assets/img/iconos/icon_Twitwe_blue.svg" alt="" />,
										position: 'end'
									}}
									label='Twitter' 
								/>
							</MContainer>
						</Grid>
						<Grid item xs={12} textAlign={'start'}>
							<MContainer direction='vertical' styles={{alignContent: 'space-around'}}>
								<FormGroup
									show_error_message={false}
									error={(() => {
										const imdb = form.redes_sociales['imdb'];
										if (imdb && imdb.length > 0 && !URL_PATTERN.test(imdb)) {
											return 'La url es invalida';
										}
										return undefined;
									})()}
									style={{width: 200}}
									labelStyle={{ fontWeight: 800, fontSize: '1.1rem', textAlign: 'start' }}
									value={form.redes_sociales['imdb']}
									onChange={(e) => { 
										setForm({...form, redes_sociales: {...form.redes_sociales, imdb: e.target.value}}) 
									}}
									icon={{
										element: <Image className='mx-2' width={20} height={20} src="/assets/img/iconos/icon_imbd_blue.svg" alt="" />,
										position: 'end'
									}}
									label='IMDB' 
								/>
							</MContainer>
						</Grid>

*/

const URL_PATTERN = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;

export const MenuLateral = () => {
	const [form, setForm] = useState<{
		tipo_usuario: string,
		nombre: string,
		biografia?: string,
		redes_sociales: { [nombre: string]: string },

		posicion: string,
		compania: string,
	}>({
		tipo_usuario: TipoUsuario.NO_DEFINIDO,
		nombre: '',
		biografia: '',
		redes_sociales: {
			'pagina_web': '',
			'vimeo': '',
			'youtube': '',
			'linkedin': '',
			'instagram': '',
			'twitter': '',
			'imdb': ''
		},

		posicion: '',
		compania: ''
	});
	const [edit_mode, setEditMode] = useState(false);
	const session = useSession();
	const cazatalentos = api.cazatalentos.getPerfilById.useQuery((session && session.data?.user?.tipo_usuario === TipoUsuario.CAZATALENTOS) ? parseInt(session.data.user.id) : 0, {
		refetchOnWindowFocus: false
	});
	const talento = api.talentos.getById.useQuery({ id: (session && session.data?.user?.tipo_usuario === TipoUsuario.TALENTO) ? parseInt(session.data.user.id) : 0 }, {
		refetchOnWindowFocus: false
	});
	const info_gral_talento = api.talentos.getInfoBasicaByIdTalento.useQuery({ id: (session && session.data?.user?.tipo_usuario === TipoUsuario.TALENTO) ? parseInt(session.data.user.id) : 0 }, {
		refetchOnWindowFocus: false
	});

	const { notify } = useNotify();

	const update_perfil_talento = api.talentos.updatePerfil.useMutation({
		onSuccess: (data, input) => {
			notify('success', 'Se actualizo el talento con exito');
			setEditMode(false)
			void talento.refetch();
		},
		onError: (error) => {
			notify('error', parseErrorBody(error.message));
		}
	})

	const update_perfil_cazatalento = api.cazatalentos.updatePerfil.useMutation({
		onSuccess: (data, input) => {
			notify('success', 'Se actualizo el cazatalento con exito');
			setEditMode(false)
			void cazatalentos.refetch();
		},
		onError: (error) => {
			notify('error', parseErrorBody(error.message));
		}
	})

	const is_fetching = talento.isFetching || info_gral_talento.isFetching;

	const user_info = useMemo(() => {
		if (session.data && session.data.user) {
			switch (session.data.user.tipo_usuario) {
				case TipoUsuario.TALENTO: {
					if (talento.data && info_gral_talento.data) {
						//const redes_sociales: {[red_social: string]: string} = {};
						//info_gral_talento.data.redes_sociales.forEach(red => {
						//	redes_sociales[red.nombre] = red.url;
						//});
						return {
							tipo_usuario: TipoUsuario.TALENTO,
							nombre: talento.data.nombre,
							apellido: talento.data.apellido,
							biografia: info_gral_talento.data.info_basica?.biografia,
							redes_sociales: {}
						}
					}
				}
				case TipoUsuario.CAZATALENTOS: {
					if (cazatalentos.data) {
						const redes_sociales: { [red_social: string]: string } = {};
						cazatalentos.data.redes_sociales.forEach(red => {
							redes_sociales[red.nombre] = red.url;
						});
						return {
							tipo_usuario: TipoUsuario.CAZATALENTOS,
							nombre: cazatalentos.data.nombre,
							apellido: cazatalentos.data.apellido,
							biografia: cazatalentos.data.biografia,
							redes_sociales: redes_sociales,

							posicion: cazatalentos.data.posicion,
							compania: cazatalentos.data.compania,
						}
					}
				}
			}
		}
		return null;
	}, [session, cazatalentos.data, talento.data, info_gral_talento.data]);

	useEffect(() => {
		if (user_info) {
			setForm({
				tipo_usuario: user_info.tipo_usuario,
				nombre: user_info.nombre,
				biografia: user_info.biografia,
				redes_sociales: user_info.redes_sociales,

				posicion: user_info.posicion || '',
				compania: user_info.compania || '',
			});
		}
	}, [user_info]);

	useEffect(() => {
		console.log(form);
	}, [form])

	return (
		<>
			<div className="menu_container text-center ezcast_container" style={{ position: 'relative' }}>
				<motion.div
					style={{
						position: 'absolute',
						width: '80%',
						left: '10%',
						height: (user_info && user_info.tipo_usuario === TipoUsuario.TALENTO)
							? '550px'
							: (user_info && user_info.tipo_usuario === TipoUsuario.CAZATALENTOS)
								? 'calc(75vh)'
								: 'calc(70vh)',
						overflowY: (user_info && user_info.tipo_usuario === TipoUsuario.CAZATALENTOS)
							? 'scroll'
							: 'visible'
						,
						boxShadow: 'rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
						top: 32,
						borderRadius: 4,
						zIndex: 99,
						backgroundColor: 'white',

					}}
					initial={{ opacity: 0, scale: 0 }}
					animate={(edit_mode) ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
					exit={{ opacity: 0, scale: 0 }}
					transition={{
						ease: "linear",
						duration: 0.4,
						opacity: { duration: 0.4 },
						scale: { duration: 0.4 }
					}}
				>
					<IconButton
						style={{
							position: 'absolute',
							right: 0,
							color: '#069cb1'
						}}
						aria-label="Cancelar edicion usuario"
						onClick={() => {
							setEditMode(edit => !edit)
						}}
					>
						<Close />
					</IconButton>
					<Grid container justifyContent="center">
						<Grid item xs={12}>
							<div className="mt-3 mb-3 avatar" style={{ position: 'relative' }}>
								<motion.img src="https://randomuser.me/api/portraits/men/34.jpg" alt="avatar" />
								<IconButton
									style={{
										position: 'absolute',
										top: '35%',
										left: '35%',
										color: 'white',
									}}
									aria-label="Cancelar edicion usuario"
									onClick={() => {
										setEditMode(edit => !edit)
									}}
								>
									<CameraAlt />
								</IconButton>
							</div>
							<Button color={'inherit'} style={{ textDecoration: 'underline', fontWeight: 800 }} onClick={() => {
								console.log('xd')
							}} variant='text'>
								Cambiar foto
							</Button>
						</Grid>
						<Grid item xs={12} sx={{ mt: 4 }} textAlign={'start'} maxHeight={'95vh'}>
							<MContainer direction='vertical' styles={{ alignContent: 'space-around' }}>
								<FormGroup
									show_error_message={false}
									error={(() => {
										if (form.nombre.length === 0) {
											return 'El nombre no debe estar vacio';
										}
										return undefined;
									})()}
									style={{ width: 200 }}
									labelStyle={{ fontWeight: 800, fontSize: '1.1rem', textAlign: 'start', color: '#069cb1' }}
									value={form.nombre}
									onChange={(e) => {
										setForm({ ...form, nombre: e.target.value })
									}}
									label='Nombre*'
								/>
							</MContainer>
						</Grid>

						{
							user_info && user_info.tipo_usuario === TipoUsuario.CAZATALENTOS &&
							<>
								<Grid item xs={12} textAlign={'start'}>
									<MContainer direction='vertical' styles={{ alignContent: 'space-around' }}>
										<FormGroup
											show_error_message={false}
											error={(() => {
												/* if (form.nombre.length === 0) {
													return 'El nombre no debe estar vacio';
												} */
												return undefined;
											})()}
											style={{ width: 200 }}
											labelStyle={{ fontWeight: 800, fontSize: '1.1rem', textAlign: 'start', color: '#069cb1' }}
											value={form.posicion}
											onChange={(e) => {
												setForm({ ...form, posicion: e.target.value })
											}}
											label='Posición'
										/>
									</MContainer>
								</Grid>

								<Grid item xs={12} textAlign={'start'}>
									<MContainer direction='vertical' styles={{ alignContent: 'space-around' }}>
										<FormGroup
											show_error_message={false}
											error={(() => {
												/* if (form.nombre.length === 0) {
													return 'El nombre no debe estar vacio';
												} */
												return undefined;
											})()}
											style={{ width: 200 }}
											labelStyle={{ fontWeight: 800, fontSize: '1.1rem', textAlign: 'start', color: '#069cb1' }}
											value={form.compania}
											onChange={(e) => {
												setForm({ ...form, compania: e.target.value })
											}}
											label='Compañia'
										/>
									</MContainer>
								</Grid>
							</>
						}



						<Grid item xs={12} textAlign={'start'}>
							<MContainer direction='vertical' styles={{ alignContent: 'space-around', textAlign: 'center' }}>
								<FormGroup
									type={'text-area'}
									style={{ width: 200 }}
									labelStyle={{ width: 200, fontWeight: 800, fontSize: '1.1rem', textAlign: 'start', color: '#069cb1' }}
									value={form.biografia}
									rows={2}
									onChange={(e) => {
										setForm({ ...form, biografia: e.target.value })
									}}
									label='Biografia'
								/>
							</MContainer>
						</Grid>


						{
							user_info && user_info.tipo_usuario === TipoUsuario.CAZATALENTOS &&
							<>
								<Grid item xs={12} textAlign={'start'}>
									<MContainer direction='vertical' styles={{ alignContent: 'space-around' }}>
										<FormGroup
											show_error_message={false}
											error={(() => {
												/* if (form.nombre.length === 0) {
													return 'El nombre no debe estar vacio';
												} */
												return undefined;
											})()}
											style={{ width: 200 }}
											labelStyle={{ fontWeight: 800, fontSize: '1.1rem', textAlign: 'start', color: '#069cb1' }}
											value={form.redes_sociales.pagina_web}
											onChange={(e) => {
												setForm({
													...form, redes_sociales: {
														...form.redes_sociales,
														pagina_web: e.target.value
													}
												})
											}}
											label='Link a página web'
										/>
									</MContainer>
								</Grid>


								<Grid item xs={12} textAlign={'start'}>
									<MContainer direction='vertical' styles={{ alignContent: 'space-around' }}>
										<Typography>Link a redes sociales:</Typography>
										<FormGroup
											icon={{
												element: <Image
													src="/assets/img/iconos/icon_vimeo_blue.svg"
													style={{ marginLeft: 10 }}
													width="20"
													height="30"
													alt=""
												/>,
												position: 'end'
											}}
											show_error_message={false}
											error={(() => {
												/* if (form.nombre.length === 0) {
													return 'El nombre no debe estar vacio';
												} */
												return undefined;
											})()}
											style={{ width: 200 }}
											labelStyle={{ fontWeight: 800, fontSize: '1.1rem', textAlign: 'start', color: '#069cb1' }}
											value={form.redes_sociales.vimeo}
											onChange={(e) => {
												setForm({
													...form, redes_sociales: {
														...form.redes_sociales,
														vimeo: e.target.value
													}
												})
											}}
											label='Vimeo'
										/>
									</MContainer>
								</Grid>

								<Grid item xs={12} textAlign={'start'}>
									<MContainer direction='vertical' styles={{ alignContent: 'space-around' }}>
										<FormGroup
											icon={{
												element: <Image
													src="/assets/img/iconos/icon_youtube_blue.svg"
													style={{ marginLeft: 10 }}
													width="30"
													height="30"
													alt=""
												/>,
												position: 'end'
											}}
											show_error_message={false}
											error={(() => {
												/* if (form.nombre.length === 0) {
													return 'El nombre no debe estar vacio';
												} */
												return undefined;
											})()}
											style={{ width: 200 }}
											labelStyle={{ fontWeight: 800, fontSize: '1.1rem', textAlign: 'start', color: '#069cb1' }}
											value={form.redes_sociales.youtube}
											onChange={(e) => {
												setForm({
													...form, redes_sociales: {
														...form.redes_sociales,
														youtube: e.target.value
													}
												})
											}}
											label='Youtube'
										/>
									</MContainer>
								</Grid>

								<Grid item xs={12} textAlign={'start'}>
									<MContainer direction='vertical' styles={{ alignContent: 'space-around' }}>
										<FormGroup
											icon={{
												element: <Image
													src="/assets/img/iconos/icon_linkedin_blue.svg"
													style={{ marginLeft: 10 }}
													width="20"
													height="30"
													alt=""
												/>,
												position: 'end'
											}}
											show_error_message={false}
											error={(() => {
												if (form.nombre.length === 0) {
													return 'El nombre no debe estar vacio';
												}
												return undefined;
											})()}
											style={{ width: 200 }}
											labelStyle={{ fontWeight: 800, fontSize: '1.1rem', textAlign: 'start', color: '#069cb1' }}
											value={form.redes_sociales.linkedin}
											onChange={(e) => {
												setForm({
													...form, redes_sociales: {
														...form.redes_sociales,
														linkedin: e.target.value
													}
												})
											}}
											label='LinkedIn'
										/>
									</MContainer>
								</Grid>

								<Grid item xs={12} textAlign={'start'}>
									<MContainer direction='vertical' styles={{ alignContent: 'space-around' }}>
										<FormGroup
											icon={{
												element: <Image
													src="/assets/img/iconos/icon_insta_blue.svg"
													style={{ marginLeft: 10 }}
													width="20"
													height="30"
													alt=""
												/>,
												position: 'end'
											}}
											show_error_message={false}
											error={(() => {
												/* if (form.nombre.length === 0) {
													return 'El nombre no debe estar vacio';
												} */
												return undefined;
											})()}
											style={{ width: 200 }}
											labelStyle={{ fontWeight: 800, fontSize: '1.1rem', textAlign: 'start', color: '#069cb1' }}
											value={form.redes_sociales.instagram}
											onChange={(e) => {
												setForm({
													...form, redes_sociales: {
														...form.redes_sociales,
														instagram: e.target.value
													}
												})
											}}
											label='Instagram'
										/>
									</MContainer>
								</Grid>

								<Grid item xs={12} textAlign={'start'}>
									<MContainer direction='vertical' styles={{ alignContent: 'space-around' }}>
										<FormGroup
											icon={{
												element: <Image
													src="/assets/img/iconos/icon_Twitwe_blue.svg"
													style={{ marginLeft: 10 }}
													width="20"
													height="30"
													alt=""
												/>,
												position: 'end'
											}}
											show_error_message={false}
											error={(() => {
												if (form.nombre.length === 0) {
													return 'El nombre no debe estar vacio';
												}
												return undefined;
											})()}
											style={{ width: 200 }}
											labelStyle={{ fontWeight: 800, fontSize: '1.1rem', textAlign: 'start', color: '#069cb1' }}
											value={form.redes_sociales.twitter}
											onChange={(e) => {
												setForm({
													...form, redes_sociales: {
														...form.redes_sociales,
														twitter: e.target.value
													}
												})
											}}
											label='Twitter'
										/>
									</MContainer>
								</Grid>

								<Grid item xs={12} textAlign={'start'}>
									<MContainer direction='vertical' styles={{ alignContent: 'space-around' }}>
										<FormGroup
											icon={{
												element: <Image
													src="/assets/img/iconos/icon_imbd_blue.svg"
													style={{ marginLeft: 10 }}
													width="20"
													height="30"
													alt=""
												/>,
												position: 'end'
											}}
											show_error_message={false}
											error={(() => {
												if (form.nombre.length === 0) {
													return 'El nombre no debe estar vacio';
												}
												return undefined;
											})()}
											style={{ width: 200 }}
											labelStyle={{ fontWeight: 800, fontSize: '1.1rem', textAlign: 'start', color: '#069cb1' }}
											value={form.redes_sociales.imdb}
											onChange={(e) => {
												setForm({
													...form, redes_sociales: {
														...form.redes_sociales,
														imdb: e.target.value
													}
												})
											}}
											label='IMDb'
										/>
									</MContainer>
								</Grid>
							</>
						}

						<Grid item xs={12} textAlign={'center'} sx={{ paddingBottom: 3 }}>
							<Button
								onClick={() => {
									if (user_info) {
										switch (user_info.tipo_usuario) {
											case TipoUsuario.TALENTO: {
												update_perfil_talento.mutate({
													nombre: form.nombre,
													biografia: (form.biografia) ? form.biografia : '',
												})
												break;
											}
											case TipoUsuario.CAZATALENTOS: {
												update_perfil_cazatalento.mutate({
													nombre: form.nombre,
													biografia: (form.biografia) ? form.biografia : '',
													posicion: form.posicion,
													compania: form.compania,
													redes_sociales: Object.keys(form.redes_sociales).map(key => ({
														nombre: key,
														url: form.redes_sociales[key] || ''
													}))
												})
												break;
											}
										}
									}
								}}
								style={{ backgroundColor: '#069cb1', width: 200, color: 'white', borderRadius: 16 }}
							>
								Guardar Cambios
							</Button>
						</Grid>
					</Grid>
				</motion.div>


				{!edit_mode &&
					<>
						<motion.img src="/assets/img/iconos/EZ_Claqueta.svg" className="mt-5 mb-3 claqueta_black" />
						<p className="h2 text-uppercase text-white mb-3"><b>EZ-CAST</b></p>
						{user_info?.tipo_usuario === TipoUsuario.TALENTO && <p className="h2 text-white mb-0">TALENTO</p>}
						<div className="mt-3 mb-3 avatar">
							<motion.img src="https://randomuser.me/api/portraits/men/34.jpg" alt="avatar" />
						</div>
						{is_fetching && <Skeleton className="h2 text-white mb-0" />}
						{!is_fetching && <p className="h2 text-white mb-0">{user_info?.nombre}</p>}
						{is_fetching && <Skeleton className="h2 text-white mb-3 user_lastName" />}
						{!is_fetching && <p className="h2 text-white mb-3 user_lastName">{user_info?.apellido}</p>}
						<motion.img src="/assets/img/iconos/icon_estrella_dorada.svg" className="ml-1 gold_star" alt="icono estrella dorada" />


						{!is_fetching && user_info?.tipo_usuario === TipoUsuario.CAZATALENTOS && <>
							<Typography sx={{ textAlign: 'center', color: '#fff', fontStyle: 'italic', fontSize: '1rem' }}>{user_info?.posicion}</Typography>

							<Typography sx={{ textAlign: 'center', color: '#fff', fontSize: '1rem' }}>{user_info?.biografia}</Typography>

							<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
								{form.redes_sociales.vimeo && <a href={form.redes_sociales.vimeo} target='_blank'>
									<Image
										src="/assets/img/iconos/icon_vimeo.svg"
										style={{ marginLeft: 10 }}
										width="20"
										height="30"
										alt=""
									/>
								</a>}
								{form.redes_sociales.linkedin && <a href={form.redes_sociales.linkedin} target='_blank'>
									<Image
										src="/assets/img/iconos/icon_linkedin.svg"
										style={{ marginLeft: 10 }}
										width="20"
										height="30"
										alt=""
									/>
								</a>}
								{form.redes_sociales.youtube && <a href={form.redes_sociales.youtube} target='_blank'>
									<Image
										src="/assets/img/iconos/icon_youtube.svg"
										style={{ marginLeft: 10 }}
										width="40"
										height="50"
										alt=""
									/>
								</a>}
								{form.redes_sociales.imdb && <a href={form.redes_sociales.imdb} target='_blank'>
									<Image
										src="/assets/img/iconos/icon_imbd.svg"
										style={{ marginLeft: 10 }}
										width="30"
										height="40"
										alt=""
									/>
								</a>}
								{form.redes_sociales.twitter && <a href={form.redes_sociales.twitter} target='_blank'>
									<Image
										src="/assets/img/iconos/icon_Twitwe.svg"
										style={{ marginLeft: 10 }}
										width="20"
										height="30"
										alt=""
									/>
								</a>}
								{form.redes_sociales.instagram && <a href={form.redes_sociales.instagram} target='_blank'>
									<Image
										src="/assets/img/iconos/icon_insta.svg"
										style={{ marginLeft: 10 }}
										width="20"
										height="30"
										alt=""
									/>
								</a>}
							</Box>

							<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
								<Image
									src="/assets/img/iconos/icon_website.svg"
									style={{ marginRight: 10 }}
									width="20"
									height="30"
									alt=""
								/>
								<a style={{ textDecoration: 'underline', color: '#fff' }} href={form.redes_sociales.pagina_web} target='_blank'>
									<Typography sx={{ fontSize: '1rem', color: '#fff' }}>{form.redes_sociales.pagina_web}</Typography>
								</a>
							</Box>
						</>}


						<hr />
						{is_fetching && <Skeleton className="mt-2 mb-5 text-white open_popup" />}
						{!is_fetching && <p onClick={() => setEditMode(edit => !edit)} className="mt-2 mb-5 text-white open_popup" data-popup="box_editprofile">Editar perfil</p>}
						<div className="sub_menu">
							<a href="#" className="active">Perfil</a>
							<a href="#">Casting Billboard</a>
							<a href="#">Tus Aplicaciones</a>
							<a href="#">Media Bank</a>
							<a className="msn_container" href="#"><span className="count_msn active">3</span>Mensajes</a>
							<a href="#">Ayuda</a>
						</div>
						<p className="mt-5 mb-2">
							<a
								onClick={() => {
									void signOut({
										callbackUrl: '/login'
									});
								}}
								className="text-white"
								href="#">
								Cerrar sesión
							</a>
						</p>
						<div className="popup_conteiner box_editprofile">
							<div className="close_popup close_popup_editprofile">
								<motion.img src="/assets/img/iconos/equiz_blue.svg" alt="icono" />
							</div>
							<div className="mt-3 mb-1 avatar">
								<motion.img src="https://randomuser.me/api/portraits/men/34.jpg" alt="avatar" />
								<motion.img src="/assets/img/iconos/cam_white.svg" alt="" />
							</div>
							<p className="mt-1 mb-2"><a className="text-grey" href="#">Cambiar foto</a></p>
							<div className="row">
								<div className="col-12">
									<div className="form-group">
										<label>Nombre de usuario</label>
										<input type="text" className="form-control form-control-sm text_custom" value="Iván Águila Orea" />
									</div>
									<div className="form-group">
										<label>Posición</label>
										<input type="text" className="form-control form-control-sm text_custom" value="Productor" />
									</div>
									<div className="form-group">
										<p className="text-left">Idioma</p>
										<div className="form-check">
											<input className="form-check-input" type="radio" name="exampleRadios" id="exampleRadios1" value="option1" checked={false} />
											<label className="form-check-label" htmlFor="exampleRadios1">
												Español
											</label>
										</div>
										<div className="form-check">
											<input className="form-check-input" type="radio" name="exampleRadios" id="exampleRadios2" value="option2" />
											<label className="form-check-label" htmlFor="exampleRadios2">
												English
											</label>
										</div>
									</div>
									<div className="form-group">
										<label>Link a página web</label>
										<input type="text" className="form-control form-control-sm text_custom" value="www.ivanaguilao.com" />
									</div>
									<p className="mt-2 mb-1 text-left">Link a redes sociales:</p>
									<div className="form-group">
										<label>Vimeo <motion.img src="/assets/img/iconos/icon_vimeo_blue.svg" alt="icono" /></label>
										<input type="text" className="form-control form-control-sm text_custom" value=" " />
									</div>
									<div className="form-group">
										<label>Youtube <motion.img src="/assets/img/iconos/icon_youtube_blue.svg" alt="icono" /></label>
										<input type="text" className="form-control form-control-sm text_custom" value=" " />
									</div>
									<div className="form-group">
										<label>LinkedIn <motion.img src="/assets/img/iconos/icon_linkedin_blue.svg" alt="icono" /></label>
										<input type="text" className="form-control form-control-sm text_custom" value=" " />
									</div>
									<div className="form-group">
										<label>Instagram <motion.img src="/assets/img/iconos/icon_insta_blue.svg" alt="icono" /></label>
										<input type="text" className="form-control form-control-sm text_custom" value=" " />
									</div>
									<div className="form-group">
										<label>Twitter <motion.img src="/assets/img/iconos/icon_Twitwe_blue.svg" alt="icono" /></label>
										<input type="text" className="form-control form-control-sm text_custom" value=" " />
									</div>
									<div className="form-group">
										<label>IMDb <motion.img src="/assets/img/iconos/icon_imbd_blue.svg" alt="icono" /></label>
										<input type="text" className="form-control form-control-sm text_custom" value=" " />
									</div>
									<button className="text-center btn btn-intro btn-confirm close_popup_link">
										Guardar cambios
									</button>
								</div>
							</div>
						</div>
					</>
				}

			</div>
		</>
	)
}
