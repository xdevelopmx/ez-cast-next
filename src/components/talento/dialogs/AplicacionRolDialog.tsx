import { Check, Close } from "@mui/icons-material";
import { Dialog, DialogContent, Typography, ButtonGroup, Button, DialogActions, Grid, Divider, Box } from "@mui/material"
import { useState, useRef, useEffect, useMemo, useContext } from "react";
import MotionDiv from "~/components/layout/MotionDiv"
import { AudioBar, FormGroup, MSelect, RolCompletoPreview } from "~/components/shared";
import { RolPreview } from "~/components/shared/RolPreview";
import { RolPreviewLoader } from "~/components/shared/RolPreviewLoader";
import Constants from "~/constants";
import useNotify from "~/hooks/useNotify";
import { api, parseErrorBody } from "~/utils/api";
import Image from 'next/image';
import AppContext from "~/context/app";
import useLang from "~/hooks/useLang";


export const AplicacionRolDialog = (props: { readonly: boolean, id_aplicacion: number, id_rol?: number, id_talento?: number, opened: boolean, onClose: (changed: boolean) => void }) => {
	const ctx = useContext(AppContext);
  	const textos = useLang(ctx.lang);
    const { notify } = useNotify();

    const [ubicacion_selected, setUbicacionSelected] = useState('0');
    const [nota, setNota] = useState('');

    const aplicacion = api.roles.getAplicacionesRolesByIdAplicacion.useQuery({id: props.id_aplicacion}, {
        refetchOnWindowFocus: false
    })

    const talento = api.talentos.getCompleteById.useQuery({id: (aplicacion.data) ? aplicacion.data.id_talento : (props.id_talento) ? props.id_talento : 0}, {
        refetchOnWindowFocus: false
    })

    useEffect(() => {
        if (talento.data) {
            const locacion_principal = talento.data.preferencias?.locaciones.filter(loc => loc.es_principal)[0];
            if (locacion_principal) {
                setUbicacionSelected(locacion_principal.id_estado_republica.toString());
            }
        }
    }, [talento.data]);

    useEffect(() => {
        if (aplicacion.data) {
            setNota(aplicacion.data.nota);
        }
    }, [aplicacion.data]);

    const rol = api.roles.getRolWithProyectoById.useQuery((props.id_rol) ? props.id_rol : 0, {
        refetchOnWindowFocus: false
    })

    const _data = useMemo(() => {
		if (aplicacion.isFetching) {
			return <RolPreviewLoader />;
		} 
        
        if (aplicacion.data) {
            return (
                <Box>
                    <RolPreview 
                        no_border
                        no_poster
                        key={aplicacion.data.rol.id} 
                        rol={aplicacion.data.rol as unknown as RolCompletoPreview} 
                    />
                </Box>    
            )
        }
        
        if (rol.data) {
            return (
                <Box>
                    <RolPreview 
                        no_border
                        no_poster
                        key={rol.data.id} 
                        rol={rol.data as unknown as RolCompletoPreview} 
                    />
                </Box>    
            )
        }
        return [];
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [aplicacion.isFetching, aplicacion.data, rol.data]);

    const createAplicacionTalento = api.roles.createAplicacionTalento.useMutation({
        onSuccess: (data) => {
            notify('success', 'Se creo la aplicacion para este rol con exito');
            props.onClose(true);
        }, 
        onError: (err) => {
            notify('error', parseErrorBody(err.message));
        }
    })

	return (
		<Dialog fullWidth maxWidth={'md'} onClose={() => { props.onClose(false) }} open={props.opened}>
			<DialogContent sx={{ height: 700, overflow: 'auto' }} >
				<Grid container sx={{ mt: 0 }}>
					<Grid item xs={12} mt={4}>
						<Typography variant="h6" color={'#069cb1'}>
							{props.readonly ? `${textos['detalles']} ${textos['de']} ${textos['tu']} ${textos['aplicacion']}` : `${textos['confirmar']} ${textos['tu']} ${textos['aplicacion']}`}
						</Typography>
                        <Divider style={{width: '80%'}}/>
					</Grid>

					<Grid item xs={12}>
                        {_data}	
					</Grid>
                    <Grid item xs={12}>
                        <Divider style={{width: '80%'}}/>
					</Grid>
                    <Grid item xs={12}>
                        <Box display={'flex'} flexDirection={'row'} gap={2}>
                            <Typography variant='body2' fontSize={'1.5rem'} fontWeight={700} color={'#069cb1'}>1.-</Typography>
                            <Typography variant='body2' fontSize={'1.5rem'}>{props.readonly ? textos['ubicacion'] : `${textos['confirmar']} ${textos['tu']} ${textos['ubicacion']}`}</Typography>
                        </Box>
                        {props.readonly && aplicacion.data &&
                            <Typography>{aplicacion.data.estado_republica.es}</Typography>
                        }
                        {!props.readonly &&
                            <MSelect
                                id="ubicaciones-select"
                                label={`${textos['ciudad']} / ${textos['estado']}:`}
                                labelStyle={{ fontWeight: 600 }}
                                labelClassName={'form-input-label'}
                                options={(talento.data && talento.data.preferencias) ? talento.data.preferencias.locaciones.map(loc => {
                                    return {value: loc.id_estado_republica.toString(), label: `${loc.estado_republica.es} - ${(loc.es_principal) ? 'Principal' : 'Adicional'}`};
                                }) : []}
                                value={ubicacion_selected}
                                className={'form-input-md'}
                                styleRoot={{marginTop: 2, marginBottom: 2}}
                                onChange={(e) => {
                                    setUbicacionSelected(e.target.value)
                                }}
                                disable_default_option
                            />
                        }
					</Grid>
                    <Grid item xs={12}>
                        <Box display={'flex'} flexDirection={'row'} gap={2}>
                            <Typography variant='body2' fontSize={'1.5rem'} fontWeight={700} color={'#069cb1'}>2.-</Typography>
                            <Typography variant='body2' fontSize={'1.5rem'}>{props.readonly ? 'Media' : `${textos['revisa']} ${textos['tu']} media`}</Typography>
                        </Box>
                        <Box padding={4}>
                            <Typography variant='body2' fontSize={'1rem'}>{textos['imagenes']}</Typography>
                            <Box display={'flex'} flexDirection={'row'} gap={2}>
                                {talento.data && talento.data.media.filter(m => m.media.type.includes('image')).length === 0 &&
                                    <Typography>{textos['no_tienes_elementos']?.replace('[N]', `${textos['imagen']}`)} </Typography>
                                }
                                {talento.data && talento.data.media.filter(m => m.media.type.includes('image')).map((m, i) => {
                                    return (
                                        <div key={i} style={{border: '1px solid #069CB1', padding: '10px' }}>
                                            <Image
                                                style={{ objectFit: 'cover' }}
                                                alt={`Imagen`}
                                                width={60}
                                                height={80}
                                                src={m.media.url}
                                            />
                                        </div>
                                    )
                                })}
                            </Box>
                            <Box my={2} sx={{overflowX: 'scroll'}}>
                                <Typography variant='body2' fontSize={'1rem'}>Videos</Typography>
                                <Box display={'flex'} flexDirection={'row'} gap={2}>
                                    {talento.data && talento.data.media.filter(m => m.media.type.includes('video')).length === 0 &&
                                        <Typography>{textos['no_tienes_elementos']?.replace('[N]', `${textos['video']}`)}</Typography>
                                    }
                                    {talento.data && talento.data.media.filter(m => m.media.type.includes('video')).map((m, i) => {
                                        return (
                                            <div key={i} style={{border: '1px solid #069CB1', padding: '10px' }}>
                                                <video controls style={{ width: '200px', height: 164 }}>
                                                    <source src={m.media.url} type="video/mp4" />
                                                    Lo sentimos tu navegador no soporta videos.
                                                </video>
                                            </div>
                                        )
                                    })}
                                </Box>
                            </Box>
                            <Typography variant='body2' fontSize={'1rem'}>Audios</Typography>
                            <Box display={'flex'} flexDirection={'row'} gap={2}>
                                {talento.data && talento.data.media.filter(m => m.media.type.includes('audio')).length === 0 &&
                                    <Typography>{textos['no_tienes_elementos']?.replace('[N]', `${textos['audio']}`)}</Typography>
                                }
                                {talento.data && talento.data.media.filter(m => m.media.type.includes('audio')).map((m, i) => {
                                    
                                    return (
                                        <div key={i} style={{border: '1px solid #069CB1', padding: '10px' }}>
                                            <AudioBar key={i}
                                                name={m.media.nombre}
                                                url={m.media.url}
                                            />
                                        </div>
                                    )
                                })}
                            </Box>
                        </Box>
                        
					</Grid>
                    <Grid item xs={12}>
                        <Box display={'flex'} flexDirection={'row'} gap={2}>
                            <Typography variant='body2' fontSize={'1.5rem'} fontWeight={700} color={'#069cb1'}>3.-</Typography>
                            <Typography variant='body2' fontSize={'1.5rem'}>{props.readonly ? textos['nota'] : `${textos['agregar']} ${textos['una']} ${textos['nota']}`}</Typography>
                        </Box>
                        <FormGroup
                            type={'text-area'}
                            className={'form-input-md'}
                            style={{ width: '80%' }}
                            labelStyle={{ fontWeight: 600, width: '100%' }}
                            labelClassName={'form-input-label'}
                            value={nota}
                            disabled={props.readonly}
                            onChange={(e) => {
                                setNota(e.target.value);
                            }}
                            label=''
                        />
					</Grid>
				</Grid>
			</DialogContent>
			<DialogActions sx={{ justifyContent: 'center' }}>
				<Button style={{ textDecoration: 'underline', fontWeight: 800 }} onClick={() => { props.onClose(false) }} variant='text' startIcon={<Close />}>
					{textos['cerrar']}
				</Button>
                {!props.readonly &&
                    <Button style={{ textDecoration: 'underline', fontWeight: 800 }} onClick={() => { 
                        const id_talento = (props.id_talento) ? props.id_talento : 0;
                        const id_rol = (props.id_rol) ? props.id_rol : 0;
                        const id_ubicacion = parseInt(ubicacion_selected);
                        if (id_talento <= 0) {
                            notify('warning', `${textos['campo_no_definido']?.replace('[N]', `${textos['talento']}`)}`);
                            return;
                        }
                        if (id_rol <= 0) {
                            notify('warning', `${textos['campo_no_definido']?.replace('[N]', `${textos['rol']}`)}`);
                            return;
                        }
                        if (id_ubicacion <= 0) {
                            notify('warning', `${textos['campo_no_definido']?.replace('[N]', `${textos['ubicacion']}`)}`);
                            return;
                        }
                        createAplicacionTalento.mutate({
                            id_talento: id_talento,
                            id_rol: id_rol,
                            id_ubicacion: id_ubicacion,
                            nota: nota
                        })
                    }} variant='text' startIcon={<Check />}>
                        {textos['aplicar']}
                    </Button>
                }
			</DialogActions>

		</Dialog>
	)

}