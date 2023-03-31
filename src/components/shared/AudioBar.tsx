import { type FC } from 'react'
import Image from 'next/image'
import { MContainer } from '../layout/MContainer'
import { Typography } from '@mui/material';

interface Props {
    name: string;
    onPlay: (...args: unknown[]) => unknown;
    onPause: (...args: unknown[]) => unknown;
    onExit: (...args: unknown[]) => unknown;
    onDownload: (...args: unknown[]) => unknown;
}

export const AudioBar: FC<Props> = ({ name, onExit, onPause, onPlay, onDownload }) => {
    return (
        <MContainer
            direction='horizontal'
            justify='space-between'
            styles={{ backgroundColor: '#EBEBEB', padding: 5, margin: 5, width: '100%', alignItems: 'center' }}>
            <MContainer direction='horizontal' styles={{ alignItems: 'center', gap: 10 }}>
                <Image onClick={onPlay} style={{ marginLeft: 5, cursor: 'pointer' }} src="/assets/img/iconos/play.svg" width={20} height={20} alt="" />
                <Image onClick={onExit} style={{ marginLeft: 5, cursor: 'pointer' }} src="/assets/img/iconos/pausa.svg" width={20} height={20} alt="" />
                <Image onClick={onPause} style={{ marginLeft: 5, cursor: 'pointer' }} src="/assets/img/iconos/stop.svg" width={20} height={20} alt="" />
                <Typography style={{ paddingLeft: 10 }}>{name}</Typography>
            </MContainer>

            <Typography
                onClick={onDownload}
                sx={{ color: '#069CB1', textDecoration: 'underline', cursor: 'pointer' }}>
                Descargar
            </Typography>
        </MContainer>
    )
}
