import { useEffect, useRef, useMemo, useState, type FC } from 'react'
import Image from 'next/image'
import { MContainer } from '../layout/MContainer'
import { IconButton, LinearProgress, Typography } from '@mui/material';

interface Props {
    name: string;
    url: string;
}

export const AudioBar: FC<Props> = ({ name, url }) => {
    const audio_player = useRef<HTMLAudioElement | null>(null);
    const [action_selected, setActionSelected] = useState<'PLAY' | 'STOP' | 'PAUSE' | ''>('');
    return (
        <MContainer
            direction='horizontal'
            justify='space-between'
            styles={{ backgroundColor: '#EBEBEB', padding: 5, margin: 5, width: '100%', alignItems: 'center' }}>
            <MContainer direction='horizontal' styles={{ alignItems: 'center', gap: 10 }}>
                <IconButton onClick={() => {
                    if (audio_player.current) {
                        setActionSelected('PLAY');
                        void audio_player.current.play();
                    }
                }}>
                    <Image style={{ marginLeft: 5, cursor: 'pointer', filter: (action_selected === 'PLAY') ? 'invert(78%) sepia(63%) saturate(806%) hue-rotate(332deg) brightness(100%) contrast(96%)' : '' }} src="/assets/img/iconos/play.svg" width={20} height={20} alt="" />
                </IconButton>
                <IconButton onClick={() => {
                    if (audio_player.current) {
                        setActionSelected('PAUSE');
                        void audio_player.current.pause();
                    }
                }}>
                    <Image style={{ marginLeft: 5, cursor: 'pointer', filter: (action_selected === 'PAUSE') ? 'invert(78%) sepia(63%) saturate(806%) hue-rotate(332deg) brightness(100%) contrast(96%)' : '' }} src="/assets/img/iconos/pausa.svg" width={20} height={20} alt="" />
                </IconButton>
                <IconButton onClick={() => {
                    if (audio_player.current) {
                        setActionSelected('STOP');
                        audio_player.current.currentTime = 0;
                        audio_player.current.pause();
                    }
                }}>
                    <Image style={{ marginLeft: 5, cursor: 'pointer', filter: (action_selected === 'STOP') ? 'invert(78%) sepia(63%) saturate(806%) hue-rotate(332deg) brightness(100%) contrast(96%)' : '' }} src="/assets/img/iconos/stop.svg" width={20} height={20} alt="" />
                </IconButton>
                <Typography style={{ paddingLeft: 10 }}>{name}</Typography>
            </MContainer>
            <audio ref={audio_player}>
                <source src={url} type="audio/mpeg"/>
            </audio>
            <Typography
                onClick={() =>{
                    window.open(url);
                }}
                sx={{ color: '#069CB1', textDecoration: 'underline', cursor: 'pointer' }}>
                Descargar
            </Typography>
        </MContainer>
    )
}
