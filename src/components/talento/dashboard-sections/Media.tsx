import Image from 'next/image';
import { Grid, Typography } from '@mui/material';
import React from 'react'
import { SectionTitle } from '~/components/shared'
import { Carroucel } from '~/components/shared/Carroucel';

export const Media = () => {
    return (
        <Grid container sx={{mt: 10}}>
            <Grid item xs={12}>
                <SectionTitle title='Media' onClickButton={() => { console.log('click'); }} />
            </Grid>
            <Grid item xs={12}>
                <Carroucel>
                    <Image width={191} height={217} src="/assets/img/slider_modelo_01.png" alt="" />
                    <Image width={191} height={217} src="/assets/img/slider_modelo_01.png" alt="" />
                    <Image width={191} height={217} src="/assets/img/slider_modelo_01.png" alt="" />
                    <Image width={191} height={217} src="/assets/img/slider_modelo_01.png" alt="" />
                    <Image width={191} height={217} src="/assets/img/slider_modelo_01.png" alt="" />
                    <Image width={191} height={217} src="/assets/img/slider_modelo_01.png" alt="" />
                    <Image width={191} height={217} src="/assets/img/slider_modelo_01.png" alt="" />
                </Carroucel>
            </Grid>
        </Grid>
    )
}

