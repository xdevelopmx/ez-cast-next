import { Box, Button, Divider, Grid, IconButton, Skeleton, Slider, SxProps, TablePagination, Theme, Typography } from "@mui/material";
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

    const { notify } = useNotify();

    useEffect(() => {
        if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
            navigator.mediaDevices.getUserMedia({video: {
                facingMode: {
                    exact: 'environment'
                }
            }})
            getDevices();
            alert("Let's get this party started")
          }
    }, []);

    const [confirmation_dialog, setConfirmationDialog] = useState<{ opened: boolean, title: string, content: JSX.Element, action: 'DELETE' | 'CALLBACK', data: Map<string, unknown> }>({ opened: false, title: '', content: <></>, action: 'DELETE', data: new Map });
    
    const [lineas, setLineas] = useState("");

    const [recording, setRecording] = useState(true);
    
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
                                    <Box sx={{backgroundColor: (recording) ? 'lightgray' : ''}} width={'85%'} height={376} border={'solid'} borderColor={'red'} position={'relative'}>
                                        {!recording &&
                                            <Box position={'absolute'} left={'calc(50% - 100px)'} top={'calc(50% - 8px)'} width={200} height={16}>
                                                <Image src='/assets/img/iconos/agenda.svg' width={32} height={32} alt=""/>
                                                <Button size="small">Grabar self-tape</Button>
                                            </Box>
                                        }
                                        {recording &&
                                            <Box position={'relative'}>
                                                <Image style={{position: 'absolute', top: 0}} src='/assets/img/logo_color.svg' width={128} height={32} alt=""/>
                                                <Box style={{position: 'absolute', top: 0, right: 0}}>
                                                    <p>Grabando</p>
                                                </Box>
                                                <Box sx={{position: 'relative', top: 32, width: '90%'}} ref={textBoxRef} maxHeight={150} overflow={'hidden'} p={4}>
                                                    {formated_lineas.map((l, i) => {
                                                        return <p  className={`selected-text-${i}`} style={{fontSize: '1.3rem', padding: 0, margin: 0, backgroundColor: (highlighted_text === i) ? 'rgba(6, 156, 177, 0.5)' : '', color: (highlighted_text === i) ? 'white' : 'black' }}>{l} [{i}]</p>
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
                                                        <Image src={`/assets/img/iconos/arrow_u_blue.svg`} width={16} height={16} alt=""/>
                                                    </IconButton>
                                                    <IconButton 
                                                        onClick={(e) => { 
                                                            if (formated_lineas.length > (highlighted_text + 1)) {
                                                                sethighlightedText(prev => prev + 1 );
                                                            }
                                                        }}
                                                    >
                                                        <Image src={`/assets/img/iconos/arrow_d_blue.svg`} width={16} height={16} alt=""/>
                                                    </IconButton>
                                                </Box>
                                            </Box>
                                        }
                                    </Box>
                                    <Grid container p={2}>
                                        <Grid item xs={6}>
                                            <FormGroup
                                                type={'text-area'}
                                                className={'form-input-md'}
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
                                    </Grid>
                                    
                                </Box>
                            </div>
                        </div>
                    </div>
                </AnimatePresence>
                <ConfirmationDialog
                    opened={confirmation_dialog.opened}
                    onOptionSelected={(confirmed: boolean) => {
                        if (confirmed) {
                            switch (confirmation_dialog.action) {
                                case 'DELETE': {
                                    const id = confirmation_dialog.data.get('id');
                                   
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