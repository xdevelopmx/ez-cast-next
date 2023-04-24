import { Alert, AlertTitle, Box, Button, Card, CardActions, CardContent, CardMedia, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, TextField, Typography } from "@mui/material"
import Image from "next/image"
import { useState } from "react"
import { MContainer } from "~/components/layout/MContainer"
import MotionDiv from "~/components/layout/MotionDiv"
import { FormGroup, MRadioGroup, MSelect, SectionTitle } from "~/components/shared"
import useNotify from "~/hooks/useNotify"
import { Archivo } from "~/server/api/root"
import { api, parseErrorBody } from "~/utils/api"
import { FileManager } from "~/utils/file-manager"

export const Banners = () => {
	const [dialog, setDialog] = useState({
		open: false,
		title: '',
		ref: '',
		identificador: ''
	})
	const { notify } = useNotify();
	const banners = api.banners.getAll.useQuery(undefined, {
		refetchOnWindowFocus: false
	})
	console.log(banners.data, 'BANNERS')
	const [banner, setBanner] = useState<{
		id?: number,
		position: string,
		isButton: boolean,
		text: string,
		redirect_url: string,
		archivo: Archivo | null,
	}>({
		position: ' ',
		isButton: false,
		text: '',
		redirect_url: '',
		archivo: null
	})

	const update_banner = api.banners.updateBanner.useMutation({
        onSuccess(data, input) {
            notify('success', 'Se actualizo el banner con exito');
            void banners.refetch();
			setDialog(prev => {return {...prev, open: false}});
        },
        onError: (error) => {
            notify('error', parseErrorBody(error.message));
        }
    });

	const delete_banner = api.banners.deleteBanner.useMutation({
		onSuccess(data, input) {
            notify('success', 'Se elimino el banner con exito');
            void banners.refetch();
        },
        onError: (error) => {
            notify('error', parseErrorBody(error.message));
        }
	})

	const seccion_cartelera_has_banners = (banners.data) ? banners.data.filter(b => b.identificador === 'banner-cartelera-proyectos-1').length > 0 : false;
	return (
		<Box>
			<SectionTitle
				title='Banner Seccion Cartelera De Proyectos'
			/>
			<MotionDiv show={!banners.isFetching && !seccion_cartelera_has_banners} animation="fade">
				<Alert style={{ marginTop: 16, marginBottom: 16 }} severity="info">
					<AlertTitle>Info</AlertTitle>
					No se ha configurado un banner para mostrar en la cartelera de proyectos <Button onClick={() => { setDialog({...dialog, open: true, title: 'Agregar Banner', identificador: 'banner-cartelera-proyectos-1', ref: 'banners-cartelera-proyectos'}) }} style={{ marginLeft: 16 }} variant='contained' color='success' size='small'>Agregar Banner</Button>
				</Alert>
			</MotionDiv>
			<MotionDiv style={{marginTop: 16}} show={!banners.isFetching && seccion_cartelera_has_banners} animation="fade">
				<>
					{banners.data && banners.data.map((b, i) => {
						return <Card key={i} style={{width: 970}} >
							{b.type.includes('video') &&
								<video autoPlay style={{ width: 970, height: 250 }}>
									<source src={b.content.url} type="video/mp4" />
									Lo sentimos tu navegador no soporta videos.
								</video>   
							}
							{b.type.includes('image') &&
								<Image width={970} height={250} alt={b.identificador} src={b.content.url}/>
							}
							<CardContent>
								<Typography gutterBottom variant="h5" component="div">
									{b.identificador}
								</Typography>
								<Typography variant="body2" color="text.secondary">
									{b.text}
								</Typography>
							</CardContent>
							<CardActions>
								<Button size="small" onClick={() => {
									delete_banner.mutate(b.id);
								}}>Eliminar</Button>
								<Button size="small" onClick={async () => { 
									const file = await FileManager.convertUrlToFile(b.content.url, b.content.nombre, b.content.type);
									const base64 = await FileManager.convertFileToBase64(file);
									setBanner({
										id: b.id,
										position: b.position,
										isButton: b.isButton,
										text: b.text,
										redirect_url: b.redirect_url,
										archivo: {
											id: b.content.id,
											file: file,
											name: b.content.nombre,
											base64: base64,
											url: b.content.url
										}
									})
									setDialog({...dialog, open: true, title: 'Editar Banner', identificador: 'banner-cartelera-proyectos-1', ref: 'banners-cartelera-proyectos'}) 
								}}>Editar</Button>
							</CardActions>
						</Card>
					})}
				</>
			</MotionDiv>
			<Dialog  maxWidth={'xl'} style={{minWidth: 986}} open={dialog.open} onClose={() => setDialog({...dialog, open: false})}>
				<DialogTitle>{dialog.title}</DialogTitle>
				<DialogContent>
				<MotionDiv show={!banner.archivo} animation="fade">
					<Alert style={{ marginTop: 16, marginBottom: 16, width: 970 }} severity='warning'>
						<AlertTitle>Atencion</AlertTitle>
						Selecciona una imagen o video corto para subir 
					</Alert>
				</MotionDiv>
				<MotionDiv show={banner.archivo != null} animation="fade">
					<>
						{banner.archivo?.file.type.includes('image') &&
							<Image src={(banner.archivo) ? banner.archivo.base64 : ''} width={970} height={250} alt={`banner-${banner.archivo?.file.name}`}/>
						}
						{banner.archivo?.file.type.includes('video') &&
							<video autoPlay style={{ width: 970, height: 250 }}>
								<source src={banner.archivo.base64} type="video/mp4" />
								Lo sentimos tu navegador no soporta videos.
							</video>   
						}
					</>
				</MotionDiv>
				<Button style={{ minWidth: 150, padding: 6, fontWeight: 800, color: '#069cb1', marginTop: 8 }} className="btn  btn-social mr-1 ml-1" variant="outlined" component="label">
					Seleccionar Archivo
					<input onChange={async (ev) => {
						if (ev.target.files) {
							const file = ev.target.files[0];
							if (file) {
								const base64 = await FileManager.convertFileToBase64(file);
								setBanner(prev => { 
									return {
										...prev,
										archivo: {
											base64: base64,
											name: file.name,
											file: file
										}
									}
								})
							}
						}
					}} hidden accept="video/mp4, video/mov, image/png, image/jpg, image/jpeg, image/gif" type="file" />
				</Button>
				<MContainer direction="horizontal" justify='space-between' styles={{padding: 16}}>

					<MSelect
						id="posicion-contenido-select"
						labelStyle={{ fontWeight: 600 }}
						labelClassName={'form-input-label'}
						label='Posicion Contenido*'
						options={[{value: 'top', label: 'Arriba'}, {value: 'bottom', label: 'Abajo'}, {value: 'left', label: 'Izquierda'}, {value: 'Right', label: 'Derecha'}]}
						value={banner.position}
						className={'form-input-md'}
						onChange={(e) => {
							setBanner(prev => { 
								return {
									...prev,
									position: e.target.value
								}
							})
						}}
					/>
					<FormGroup
						className={'form-input-md'}
						style={{ width: 300}}
						labelStyle={{ fontWeight: 600, width: '100%' }}
						labelClassName={'form-input-label'}
						value={banner.text}
						label='Texto Contenido'
						onChange={(e) => {
							setBanner(prev => { 
								return {
									...prev,
									text: e.target.value
								}
							})
						}}
					/>
					<FormGroup
						className={'form-input-md'}
						labelStyle={{ fontWeight: 600 }}
						labelClassName={'form-input-label'}
						label='Link Redireccion*'
						value={banner.redirect_url}
						onChange={(e) => {
							setBanner(prev => { 
								return {
									...prev,
									redirect_url: e.target.value
								}
							})
						}}
					/>
					<MRadioGroup
						label='¿Mostrar como boton?'
						labelStyle={{ fontSize: '1.1rem', color: '#000', fontWeight: 600 }}
						style={{ gap: 0 }}
						id="mostrar como boton"
						options={['Si', 'No']}
						value={(banner.isButton) ? 'Si' : 'No'}
						direction='horizontal'
						onChange={(e) => {
							setBanner(prev => { 
								return {
									...prev,
									isButton: e.target.value === 'Si'
								}
							})
						}}
					/>
				</MContainer>
				</DialogContent>
				<DialogActions>
				<Button onClick={() => setDialog({...dialog, open: false})}>Cancelar</Button>
				<Button onClick={() => {
					if (banner.archivo) {
						const time = new Date().getTime();
						void FileManager.saveFiles([{path: `banners`, name: `${dialog.identificador}-${time}`, file: banner.archivo.file, base64: banner.archivo.base64}]).then((result) => {
							result.forEach((res) => {
								const response = res[`${dialog.identificador}-${time}`];
								console.log(response, 'response')
								if (response) {
									update_banner.mutate({
										id: banner.id,
										position: banner.position,
										isButton: banner.isButton,
										text: banner.text,
										redirect_url: banner.redirect_url,
										type: (banner.archivo) ? banner.archivo.file.type : '',
										content: {
											nombre: (banner.archivo) ? banner.archivo.file.name : '',
											type: (banner.archivo) ? banner.archivo.file.type : '',
											url: (response.url) ? response.url : '',
											clave: `banners/${dialog.identificador}-${time}`,
											referencia: `${dialog.ref}`,
											identificador: `${dialog.identificador}`
										},
										ref: `${dialog.ref}`,
										identificador: `${dialog.identificador}`
									})
								}
								
							})
						});
					} else {
						notify('warning', 'Es necesario agregar un archivo para poder guardar el banner');
					}
				}}>Guardar</Button>
				</DialogActions>
			</Dialog>
		</Box>
	)
}
