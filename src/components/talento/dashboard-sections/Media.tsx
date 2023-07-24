import Image from 'next/image';
import { Button, Divider, Grid, Typography } from '@mui/material';
import React, { useMemo, useState, useEffect, useRef } from 'react'
import { AddButton, AudioBar, SectionTitle } from '~/components/shared'
import { MContainer } from '~/components/layout/MContainer';
import { useRouter } from 'next/router';
import { api } from '~/utils/api';
import { Carroucel } from '~/components/shared/Carroucel';

export const Media = (props: { id_talento: number, read_only: boolean }) => {
    const router = useRouter();
    const [current_video_url, setCurrentVideoUrl] = useState('');

    const [current_selftape_video_url, setCurrentSeltapeVideoUrl] = useState('');

    const media_por_talento = api.talentos.getMediaByIdTalento.useQuery({id: props.id_talento}, {
        refetchOnWindowFocus: false
    });

    const video_player = useRef<HTMLVideoElement | null>(null);

    const selftape_video_player = useRef<HTMLVideoElement | null>(null);

    const media = useMemo(() => {
        if (media_por_talento.data) {
            const fotos = media_por_talento.data.filter(m => m.media.type.includes('image')).map(a => a.media);
            const audios = media_por_talento.data.filter(m => m.media.type.includes('audio')).map(a => a.media);
            const videos = media_por_talento.data.filter(m => m.media.type.includes('video') && m.media.public && m.media.referencia.startsWith('VIDEOS-TALENTO')).map(a => a.media);
			const selftapes = media_por_talento.data.filter(m => m.media.type.includes('video') && m.media.referencia.startsWith('VIDEOS-SELFTAPE')).map(a => a.media);
			return { fotos: fotos, audios: audios, videos: videos, selftapes: selftapes }
        }
        return null;
    }, [media_por_talento.data]);

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

    return (
        <Grid id="media" container sx={{ mt: 10 }}>
            <Grid item xs={12}>
                <SectionTitle title='Media' onClickButton={(!props.read_only) ? () => {
                    // eslint-disable-next-line @typescript-eslint/no-floating-promises
                    router.push(`/talento/editar-perfil?step=2&id_talento=${props.id_talento}`);
                } : undefined} />
            </Grid>
            <Grid item xs={12}>
                <MContainer direction='horizontal' styles={{ alignItems: 'center', padding: '15px 0px', justifyContent: 'space-between' }}>
                    <MContainer direction='horizontal' styles={{ alignItems: 'center' }}>
                        <Image src="/assets/img/iconos/cam_outline_blue.svg" width={30} height={30} alt="" />
                        <Typography sx={{ color: '#069CB1', pl: 1 }} fontWeight={900}>GALERÍA DE IMÁGENES</Typography>
                    </MContainer>
                    {!props.read_only &&
                        <AddButton
                            aStyles={{ margin: 0 }}
                            onClick={() => {
                                // eslint-disable-next-line @typescript-eslint/no-floating-promises
                                router.push('/talento/editar-perfil?step=2')
                            }}
                            text="Agregar imágenes"
                        />
                    }
                </MContainer>
                {media && media.fotos.map((image, i) => {
                    return <Image key={i} width={191} height={217} src={image.url} alt="" /> 
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
                            <AddButton text='Agregar videos' aStyles={{ margin: 10 }} onClick={() => {
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
                                <MContainer styles={{marginTop: 16}} direction='horizontal'>
                                    <>
                                        {media.videos.map((v, i) => {
                                            return <Button
                                                key={i} 
                                                onClick={() => {
                                                    setCurrentVideoUrl(v.url);
                                                }}
                                                size='small'
                                                style={{margin: 8}}
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
                            <Typography fontSize={'1.5rem'} sx={{ color: '#F9B233' }} fontWeight={400}>No haz capturado aun ningun video</Typography>
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
                            <AddButton text='Agregar audios' aStyles={{ marginBottom: 10 }} onClick={() => {
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
                            <Typography fontSize={'1.5rem'} sx={{ color: '#F9B233' }} fontWeight={400}>No haz capturado aun ningun audio</Typography>
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
                            <AddButton text='Grabar selftape' aStyles={{ margin: 10 }} onClick={() => {
                                // eslint-disable-next-line @typescript-eslint/no-floating-promises
                                router.push('/talento/self-tape')
                            }} />
                        }
                        {media && media.selftapes.length > 0 &&
                            <>
                                <video ref={selftape_video_player} controls style={{ width: '100%' }}>
                                    <source src={current_selftape_video_url} type="video/mp4" />
                                    Lo sentimos tu navegador no soporta videos.
                                </video>
                                <MContainer styles={{ marginTop: 16 }} direction='horizontal'>
                                    <>
                                        {media.selftapes.map((v, i) => {
                                            return <Button
                                                key={i}
                                                onClick={() => {
                                                    setCurrentSeltapeVideoUrl(v.url);
                                                }}
                                                size='small'
                                                style={{ margin: 8 }}
                                                variant={v.url === current_selftape_video_url ? 'contained' : 'outlined'}
                                                endIcon={<Image style={{ marginLeft: 5, cursor: 'pointer', filter: (v.url === current_selftape_video_url) ? 'brightness(0) saturate(100%) invert(85%) sepia(21%) saturate(2191%) hue-rotate(331deg) brightness(99%) contrast(97%)' : '' }} src="/assets/img/iconos/play.svg" width={20} height={20} alt="" />}
                                            >
                                                {v.nombre}
                                            </Button>
                                        })}
                                    </>
                                </MContainer>

                            </>

                        }
                        {!media || media.selftapes.length === 0 &&
                            <Typography fontSize={'1.5rem'} sx={{ color: '#F9B233' }} fontWeight={400}>No haz capturado aun ningun selftape</Typography>
                        }
                    </MContainer>
                </MContainer>
            </Grid>
            
        </Grid>
    )
}

