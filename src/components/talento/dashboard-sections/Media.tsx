import Image from 'next/image';
import { Divider, Grid, Typography } from '@mui/material';
import React from 'react'
import { AddButton, AudioBar, SectionTitle } from '~/components/shared'
import { Carroucel } from '~/components/shared/Carroucel';
import { MContainer } from '~/components/layout/MContainer';

export const Media = () => {
    return (
        <Grid container sx={{ mt: 10 }}>
            <Grid item xs={12}>
                <SectionTitle title='Media' onClickButton={() => { console.log('click'); }} />
            </Grid>
            <Grid item xs={12}>
                <MContainer direction='horizontal' styles={{ alignItems: 'center', padding: '15px 0px' }}>
                    <Image src="/assets/img/iconos/cam_outline_blue.svg" width={30} height={30} alt="" />
                    <Typography sx={{ color: '#069CB1', pl: 1 }} fontWeight={900}>GALERÍA DE IMÁGENES</Typography>
                </MContainer>
                <Carroucel>
                    <Image width={191} height={217} src="/assets/img/slider_modelo_01.png" alt="" />
                    <Image width={191} height={217} src="/assets/img/slider_modelo_01.png" alt="" />
                    <Image width={191} height={217} src="/assets/img/slider_modelo_01.png" alt="" />
                    <Image width={191} height={217} src="/assets/img/slider_modelo_01.png" alt="" />
                    <Image width={191} height={217} src="/assets/img/slider_modelo_01.png" alt="" />
                    <Image width={191} height={217} src="/assets/img/slider_modelo_01.png" alt="" />
                    <Image width={191} height={217} src="/assets/img/slider_modelo_01.png" alt="" />
                </Carroucel>
                <Divider sx={{ mt: 3 }} />
            </Grid>

            <Grid item xs={12}>
                <MContainer direction='horizontal' justify='space-between' styles={{ alignItems: 'center' }}>
                    <MContainer direction='vertical' styles={{ width: '28%', alignItems: 'center' }}>
                        <Image src="/assets/img/iconos/web_cam_blue.png" width={50} height={30} alt="" />
                        <Typography sx={{ color: '#069CB1', textAlign: 'center' }} fontWeight={900}>
                            VIDEO <br /> REEL
                        </Typography>
                    </MContainer>
                    <MContainer direction='vertical' styles={{ width: '70%', alignItems: 'flex-end' }}>
                        <AddButton text='Agregar videos' aStyles={{ margin: 10 }} onClick={() => { console.log('click'); }} />

                        <video controls style={{ width: '100%' }}>
                            <source src="/assets/video/video1.mp4" type="video/mp4" />
                            Lo sentimos tu navegador no soporta videos.
                        </video>
                    </MContainer>
                </MContainer>
                <Divider sx={{ mt: 3 }} />
            </Grid>

            <Grid item xs={12}>
                <MContainer direction='horizontal' justify='space-between' styles={{ alignItems: 'center' }}>
                    <MContainer direction='vertical' styles={{ width: '28%', alignItems: 'center' }}>
                        <Image src="/assets/img/iconos/micro_web_blue.svg" width={50} height={30} alt="" />
                        <Typography sx={{ color: '#069CB1', textAlign: 'center' }} fontWeight={900}>
                            AUDIO <br /> CLIPS
                        </Typography>
                    </MContainer>
                    <MContainer direction='vertical' styles={{ width: '70%', alignItems: 'flex-end' }}>
                        <AddButton text='Agregar audios' onClick={() => console.log('click')} />
                        <AudioBar
                            name='Archivo audio.mp3'
                            onPlay={() => { console.log('click'); }}
                            onPause={() => { console.log('click'); }}
                            onExit={() => { console.log('click'); }}
                            onDownload={() => { console.log('click'); }}
                        />
                        <AudioBar
                            name='miaudio.mp3'
                            onPlay={() => { console.log('click'); }}
                            onPause={() => { console.log('click'); }}
                            onExit={() => { console.log('click'); }}
                            onDownload={() => { console.log('click'); }}
                        />
                    </MContainer>
                </MContainer>
            </Grid>
        </Grid>
    )
}

