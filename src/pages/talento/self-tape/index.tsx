import { Alert, Box, Button, ButtonGroup, Divider, FormControlLabel, Grid, IconButton, Skeleton, Slider, Switch, SxProps, TablePagination, TextField, Theme, Typography } from "@mui/material";
import Head from "next/head";
import Image from 'next/image';
import Link from "next/link";
import { Alertas, FormGroup, MRadioGroup, MainLayout, MenuLateral, RolCompletoPreview } from "~/components";

import { LegacyRef, RefObject, useEffect, useMemo, useRef, useState } from "react";
import { DateCalendar, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import DualDatePicker from "~/components/shared/DualDatePicker/DualDatePicker";
import { api, parseErrorBody } from "~/utils/api";
import { AnimatePresence } from "framer-motion";
import MotionDiv from "~/components/layout/MotionDiv";
import { useRouter } from "next/router";
import ConfirmationDialog from "~/components/shared/ConfirmationDialog";
import useNotify from "~/hooks/useNotify";
import { MTooltip } from "~/components/shared/MTooltip";
import { expandDates } from "~/utils/dates";
import dayjs from "dayjs";
import { TipoUsuario } from "~/enums";
import { getSession } from "next-auth/react";
import { GetServerSideProps, NextPage } from "next";
import Constants from "~/constants";
import { User } from "next-auth";
import { RolPreviewLoader } from "~/components/shared/RolPreviewLoader";
import { RolPreview } from "~/components/shared/RolPreview";
import { MedidasDialog } from "~/components/talento/dialogs/MedidasDialog";
import { AplicacionRolDialog } from "~/components/talento/dialogs/AplicacionRolDialog";
import { TalentoAplicacionesRepresentante } from "~/components/representante/talento/TalentoAplicacionesRepresentante";
import { blob } from "aws-sdk/clients/codecommit";
import { Circle } from "@mui/icons-material";
import { FileManager } from "~/utils/file-manager";

type SelftapeTalentoPageProps = {
    user: User,
    id_talento: number
}

async function getDevices() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    console.log(devices);
}

const SelftapeTalentoPage: NextPage<SelftapeTalentoPageProps> = ({user, id_talento}) => {

    const router = useRouter();

    const selftapes = api.talentos.getSelftapesByIdTalento.useQuery({id: id_talento}, {
        refetchOnWindowFocus: false
    });

    const { notify } = useNotify();

    const [has_permissions, setPermissions] = useState<{camera: boolean, microphone: boolean}>({camera: false, microphone: false});

    const video_player = useRef<HTMLVideoElement | null>(null);

    const media_recorder = useRef<MediaRecorder | null>(null);

    const [recorded_url, setRecordedUrl] = useState('');

    const [blob, setBlob] = useState<BlobPart[]>([]);

    const [recording, setRecording] = useState(false);

    const _navigator = (typeof window !== 'undefined') ? navigator : null;

    useEffect(() => {
        if (_navigator) {
            //@ts-ignore
            _navigator.permissions.query({name: 'microphone'})
            .then((permissionObj) => {
                setPermissions(prev => ({...prev, microphone: (permissionObj.state === 'granted')}));
                permissionObj.onchange = () => {
                    setPermissions(prev => ({...prev, microphone: (permissionObj.state === 'granted')}));
                };
            })
            .catch((error) => {
                setPermissions(prev => ({...prev, microphone: false}));
            })
    
            //@ts-ignore
            _navigator.permissions.query({name: 'camera'})
            .then((permissionObj) => {
                setPermissions(prev => ({...prev, camera: (permissionObj.state === 'granted')}));
                permissionObj.onchange = () => {
                    setPermissions(prev => ({...prev, camera: (permissionObj.state === 'granted')}));
                };
            })
            .catch((error) => {
                setPermissions(prev => ({...prev, camera: false}));
            })
        }
    }, [_navigator]);

    useEffect(() => {
        if (recording) {
            if (!media_recorder.current || media_recorder.current.state !== 'recording') {
                if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
                    let mediaDevices = navigator.mediaDevices;
                    // Accessing the user camera and video.
                    mediaDevices.getUserMedia({
                            video: true,
                            audio: true,
                    }).then((stream) => {
                        if (video_player.current) {
                            video_player.current.srcObject = stream;
                            media_recorder.current = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9,opus'});
                            
                            media_recorder.current.ondataavailable = (ev) => {
                                blob.push(ev.data);
                                setBlob(blob.map(b => b))
                            }
                            
                            media_recorder.current.onstop = (ev) => {
                                // create local object URL from the recorded video blobs
                                let video_local = URL.createObjectURL(new Blob(blob, { type: 'video/webm' }));
                                setRecordedUrl(video_local);
                                stream.getTracks().forEach(function(track) {
                                    track.stop();
                                });
                            }

                            video_player.current.addEventListener("loadedmetadata", () => {
                                if (video_player.current) {
                                    video_player.current.play();
                                    if (media_recorder.current?.state !== 'recording') {
                                        media_recorder.current?.start(1000);
                                    }
                                }
                            });
                        }
                    })
                    .catch(alert);
                }
            }
        } else {
            if (media_recorder.current) {
                media_recorder.current.stop();
                media_recorder.current = null;
                video_player.current = null;
            }
            if (blob.length > 0) {
                setBlob([]);
            }
        }
    }, [recording, video_player.current, media_recorder.current, blob]);


    const [confirmation_dialog, setConfirmationDialog] = useState<{ opened: boolean, title: string, content: JSX.Element, action: 'PREVIEW' | 'CALLBACK', data: Map<string, unknown> }>({ opened: false, title: '', content: <></>, action: 'PREVIEW', data: new Map });
    
    const [lineas, setLineas] = useState("");

    const [delay, setDelay] = useState(-1);

    const textBoxRef = useRef<HTMLDivElement>(null);

    const [highlighted_text, sethighlightedText] = useState(0);

    const interval_time_ref = useRef<ReturnType<typeof setInterval> | null>(null);

    const formated_lineas = lineas.split('\n').filter(l => l.trim().length > 0);

    useEffect(() => {
        if (delay >= 0) {
            if (interval_time_ref.current) {
                clearInterval(interval_time_ref.current);
                interval_time_ref.current = null;
            }
            interval_time_ref.current = setInterval(() => {
                if (formated_lineas.length > (highlighted_text + 1)) {
                    sethighlightedText(prev => prev + 1 );
                }
            }, 5000 - (delay * 15 ));
        }
        return (() => {
            if (interval_time_ref.current) {
                clearInterval(interval_time_ref.current);
                interval_time_ref.current = null;
            }
        })
    }, [delay, highlighted_text, formated_lineas]);

    useEffect(() => {
        if (textBoxRef.current) {
            const el_text = textBoxRef.current.getElementsByClassName(`selected-text-${highlighted_text}`)[0];
            if (el_text) {
                el_text.scrollIntoView({
                    block: 'center',
                    behavior: 'smooth'
                });
                
            }
        }
    }, [highlighted_text, textBoxRef]);

    useEffect(() => {
        if (recorded_url) {
            const params = new Map<string, unknown>();
            params.set('public', true);
            setConfirmationDialog({ 
                action: 'PREVIEW', 
                data: params,
                opened: true, 
                title: '¿Deseas guardar Self-Tape?', 
                content: 
                    <Box>
                        <Typography>(Tendrás la posibilidad de reproducirlo y bajarlo en el Media Bank)</Typography>
                       <video controls style={{ width: '100%' }} src={recorded_url}>
                            Lo sentimos tu navegador no soporta videos.
                        </video>
                        <Box my={2}>
                            <label
                                style={{fontWeight: 600, width: '100%'}}
                                className={'form-input-label'}
                                htmlFor={'nombre-input'}
                            >
                                Nombre*
                            </label>
                            <TextField
                                size="small"
                                id="nombre-input"
                                type='text'
                                onChange={(e) => {
                                    params.set('nombre', e.target.value);
                                }}
                            />

                        </Box>
                        <FormControlLabel control={<Switch onChange={() => { 
                            const _public = params.get('public') as boolean;
                            params.set('public', !_public);
                         }} defaultChecked />} label="Publico" />
                    </Box>
            });
        }
    }, [recorded_url]);

    const saveSelftapeMedia = api.talentos.saveSelftape.useMutation({
        onSuccess(input) {
           notify('success', 'Se almaceno el selftape con exito');
           selftapes.refetch();
           setConfirmationDialog(prev => { return { ...prev, opened: false }});
        },
        onError: (error) => {
            notify('error', parseErrorBody(error.message));
        }
    })

    const can_record = selftapes.data && selftapes.data.length < 6;
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
                                        <Image src='/assets/img/iconos/agenda.svg' width={32} height={32} alt=""/>
                                        <Typography>Self-tape</Typography>
                                    </Box>
                                    <Typography>
                                        Un self tape es una técnica utilizada en el mundo cinematográfico en la que una persona se filma a sí misma en una prueba de casting.
                                        ¡Saca ventaja de esta herramienta y graba tus audiciones en segundos!
                                    </Typography>
                                    {selftapes.data && selftapes.data.length > 0 &&
                                        <Alert variant="filled" severity={!can_record ? 'warning' : 'info'} sx={{maxWidth: '85%', height: 72, my: 2}} > 
                                            {!can_record ? 'Solo se permite maximo 6 selftapes por usuario, por favor elimina uno antes de intentar grabar otro' : `Tienes ${selftapes.data?.length} selftapes disponibles en el Media Bank`}
                                            <Button onClick={() => { router.push('/talento/media-bank') }} variant="contained" color='success' size="small" sx={{ml: 2}}>Ir Media Bank</Button>
                                        </Alert>
                                    }
                                    <Box sx={{backgroundColor: (recording) ? 'lightgray' : ''}} width={'85%'} height={'55vh'} border={'solid'} borderColor={'#069cb1'} position={'relative'}>
                                        {!has_permissions.camera &&
                                            <Box display={'flex'} flexDirection={'column'} alignContent={'center'} alignItems={'center'} position={'absolute'} left={'calc(50% - 200px)'} top={'calc(50% - 60px)'} width={400} height={120}>
                                                <Image src='/assets/img/iconos/agenda.svg' width={32} height={32} alt=""/>
                                                <Typography>!Atencion!</Typography>
                                                <Typography textAlign={'center'}>
                                                    Para usar la función de self-tape, debes
                                                    dar permiso a la aplicación para acceder a tu cámara.
                                                </Typography>
                                                <Button onClick={ () => { setRecording(prev => true) }} size="small">Activar</Button>
                                            </Box>
                                        }
                                        {has_permissions.camera &&
                                           <>
                                            {can_record && !recording &&
                                                <Box position={'absolute'} left={'calc(50% - 100px)'} top={'calc(50% - 8px)'} width={200} height={16}>
                                                    <Image src='/assets/img/iconos/agenda.svg' width={32} height={32} alt=""/>
                                                    <Button onClick={ () => { setRecording(prev => !prev) }} size="small">Grabar self-tape</Button>
                                                </Box>
                                            }
                                            {!can_record &&
                                                <Box position={'absolute'} left={'calc(50% - 100px)'} top={'calc(50% - 8px)'} width={600} height={16}>
                                                    <Image src='/assets/img/iconos/agenda.svg' width={32} height={32} alt=""/>
                                                    <Typography variant="subtitle2">No puedes grabar mas selftapes</Typography>
                                                </Box>
                                            }
                                            {recording &&
                                                <Box position={'relative'} overflow={'hidden'} height={'100%'}>
                                                    <video ref={video_player} controls style={{ width: '100%', position: 'absolute', top: 0 }}>
                                                        Lo sentimos tu navegador no soporta videos.
                                                    </video>

                                                    <Box position={'relative'}>
                                                        <Image style={{position: 'absolute', top: 16}} src='/assets/img/logo_color.svg' width={256} height={32}  alt=""/>
                                                        <Box onClick={ () => { setRecording(prev => !prev) }} style={{position: 'absolute', top: 0, right: 0}}>
                                                            <Box sx={{cursor: 'pointer'}} display={'flex'} flexDirection={'row'} mt={2}>
                                                                <Circle style={{ color: 'tomato', width: 16, height: 16, marginTop: 8}} />
                                                                <Typography color={'white'} ml={1} mr={4}>Grabando</Typography>
                                                            </Box>
                                                        </Box>
                                                        <Box sx={{position: 'relative', top: 56, width: '90%'}} ref={textBoxRef} maxHeight={150} overflow={'hidden'} p={4}>
                                                            {formated_lineas.map((l, i) => {
                                                                return <p  className={`selected-text-${i}`} style={{fontSize: '1.3rem', padding: 0, margin: 0, backgroundColor: (highlighted_text === i) ? 'rgba(6, 156, 177, 0.5)' : '', color: 'white'}}>{l} [{i}]</p>
                                                            })}
                                                        </Box>
                                                        <Box display={'flex'} flexDirection={'column'} sx={{position: 'absolute', top: 32, right: 0}} p={4}>
                                                            <IconButton 
                                                                onClick={(e) => { 
                                                                    if ((highlighted_text - 1) >= 0) {
                                                                        sethighlightedText(prev => prev - 1 );
                                                                    }
                                                                    
                                                                }}
                                                            >
                                                                <Image src={`/assets/img/iconos/arrow_u_blue.svg`} width={40} height={40} alt=""/>
                                                            </IconButton>
                                                            <IconButton 
                                                                sx={{
                                                                    marginTop: 4
                                                                }}
                                                                onClick={(e) => { 
                                                                    if (formated_lineas.length > (highlighted_text + 1)) {
                                                                        sethighlightedText(prev => prev + 1 );
                                                                    }
                                                                }}
                                                            >
                                                                <Image src={`/assets/img/iconos/arrow_d_blue.svg`} width={40} height={40} alt=""/>
                                                            </IconButton>
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            }
                                           </>
                                        }
                                    </Box>
                                    
                                    
                                    <Grid container p={2}>
                                        <Grid item xs={6}>
                                            <FormGroup
                                                type={'text-area'}
                                                className={'form-input-md'}
                                                rows={5}
                                                style={{ width: '90%' }}
                                                labelStyle={{ fontWeight: 600 }}
                                                labelClassName={'form-input-label'}
                                                value={lineas}
                                                icon={{element: <Image src={'/assets/img/iconos/agenda.svg'} width={16} height={16} alt=""/>, position: 'start'}}
                                                onChange={(e) => {
                                                   setLineas(e.target.value)
                                                }}
                                                label='Lineas'
                                            />
                                        </Grid>
                                        {/*
                                        
                                            <Grid item xs={6}>
                                                <Box>
                                                    <Box display={'flex'} flexDirection={'row'} gap={2}>
                                                        <Image src='/assets/img/iconos/agenda.svg' width={32} height={32} alt=""/>
                                                        <Typography>Self-tape</Typography>
                                                        <MRadioGroup
                                                            id="quieres-agregar-descanso"
                                                            options={['Automático', 'Manual']}
                                                            value={'Manual'}
                                                            direction='horizontal'
                                                            onChange={(e) => {
                                                            }}
                                                        />
                                                    </Box>
                                                    <Box display={'flex'} flexDirection={'row'} gap={2}>
                                                        <Image src='/assets/img/iconos/agenda.svg' width={32} height={32} alt=""/>
                                                        <Typography>Velocidad</Typography>
                                                        <Slider
                                                            aria-label="Always visible"
                                                            defaultValue={0}
                                                            step={10}
                                                            value={delay}
                                                            onChange={(e, v) => {
                                                                setDelay(v as number);
                                                            }}
                                                            marks={[
                                                                {
                                                                    value: 0,
                                                                    label: 'Mas Lento',
                                                                },
                                                                {
                                                                    value: 100,
                                                                    label: 'Mas Rapido',
                                                                },
                                                            ]}
                                                            valueLabelDisplay="on"
                                                        />
                                                    </Box>

                                                </Box>
                                            </Grid>
                                        */}
                                    </Grid>
                                    
                                </Box>
                            </div>
                        </div>
                    </div>
                </AnimatePresence>
                <ConfirmationDialog
                    opened={confirmation_dialog.opened}
                    onOptionSelected={async (confirmed: boolean) => {
                        if (confirmed) {
                            switch (confirmation_dialog.action) {
                                case 'PREVIEW': {
                                    const id = confirmation_dialog.data.get('id');
                                    const input_name = (confirmation_dialog.data.has('nombre')) ? confirmation_dialog.data.get('nombre') as string : '';
                                    const is_public = (confirmation_dialog.data.has('public')) ? confirmation_dialog.data.get('public') as boolean : true;
                                    const file = await FileManager.convertUrlToFile(recorded_url, 'selftape', 'video/webm');
                                    const link = document.createElement('a');
                                    link.href = recorded_url;
                                    link.setAttribute('download', `selftape.webm`);
                                    document.body.appendChild(link);
                                    link.click();
                                    if (link && link.parentNode) {
                                        link.parentNode.removeChild(link);
                                    }
                                    const base_64 = await FileManager.convertFileToBase64(file);
                                    const date = new Date();
                                    const name = `selftape-${date.toLocaleDateString('es-mx').replaceAll('/', '-')}-${date.toLocaleTimeString('es-mx')}`;
                                    const urls_saved = await FileManager.saveFiles([{path: `talentos/${id_talento}/videos`, name: name, file: file, base64: base_64}]);
                                    if (urls_saved.length > 0) {
                                        urls_saved.forEach((res, j) => {
                                            Object.entries(res).forEach((e, i) => {
                                                const url = e[1].url;  
                                                if (url) {
                                                    saveSelftapeMedia.mutate({
                                                        id_talento: id_talento,
                                                        selftape: {
                                                            nombre: (input_name.length > 0) ? input_name : name,
                                                            type: 'video/webm',
                                                            url: (url) ? url : '',
                                                            clave: `talentos/${id_talento}/videos/${name}`,
                                                            referencia: `VIDEOS-SELFTAPE-TALENTO-${id_talento}`,
                                                            identificador: `video-selftape-${name}`,
                                                            public: is_public
                                                        }
                                                    })
                                                } else {
                                                    notify('error', `${(name) ? `El video ${name} no se pudo subir` : 'Un video no se pudo subir'}`);
                                                }
                                            })
                                        });
                                    }
                                    break;
                                }
                            }
                        }
                        setConfirmationDialog({ ...confirmation_dialog, opened: false });
                    }}
                    title={confirmation_dialog.title}
                    content={confirmation_dialog.content}
                />
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

export default SelftapeTalentoPage;