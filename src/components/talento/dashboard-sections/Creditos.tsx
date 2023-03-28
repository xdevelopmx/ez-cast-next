import { Grid, Typography } from '@mui/material'
import Image from 'next/image';
import React from 'react'
import { MContainer } from '~/components/layout/MContainer';
import { SectionTitle } from '~/components/shared';
import { MTable } from '~/components/shared/MTable/MTable';
import { api } from '~/utils/api';
import { useMemo } from 'react';
import { useRouter } from 'next/router';

export const Creditos = (props: {id_talento: number}) => {
    const router = useRouter();

    const creditos = api.talentos.getCreditosByIdTalento.useQuery({id: props.id_talento});
    const loading = creditos.isFetching;
    const data = useMemo(() => {
        if (creditos.data) {
            console.log('creditos_data', creditos.data)
            return creditos.data;
        }
        return null;
    }, [creditos.data]);

    return (
        <Grid container sx={{ mt: 10 }}>
            <Grid item xs={12}>
                <SectionTitle title='Créditos' onClickButton={() => { 
                    // eslint-disable-next-line @typescript-eslint/no-floating-promises
                    router.push('/talento/editar-perfil?step=3')  
                }} />
            </Grid>
            <Grid item xs={12}>
                <Typography my={1} fontSize={30} sx={{ color: '#4ab7c6' }} fontWeight={900}>{(creditos.data) ? creditos.data.creditos.length : ''}</Typography>
                <MTable
                    backgroundColorHeader='#4ab7c6'
                    columnsHeader={[
                        <Typography key={1} sx={{ color: '#fff' }} fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                            Título
                        </Typography>,
                        <Typography key={1} sx={{ color: '#fff' }} fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                            Rol
                        </Typography>,
                        <Typography key={1} sx={{ color: '#fff' }} fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                            Director
                        </Typography>,
                        <Typography key={1} sx={{ color: '#fff' }} fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                            Año
                        </Typography>,
                        <Typography key={1} sx={{ color: '#fff' }} fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                            Clip
                        </Typography>,
                        <Typography key={1} sx={{ color: '#fff' }} fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                            
                        </Typography>,
                    ]}
                    data={(data) ? data.creditos.map(credito => {
                        const es_destacado = (credito.destacado) ? <Image src="/assets/img/iconos/icon_estrella_dorada.svg" style={{marginLeft: 16}} width={30} height={30} alt="" /> : <></>;
                        return {
                            titulo: credito.titulo,
                            rol: credito.rol,
                            director: credito.director,
                            anio: credito.anio,
                            clip: <MContainer direction='horizontal' styles={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Typography>Reproducir</Typography>
                               
                            </MContainer>,
                            destacado: es_destacado
                        }
                    }) : []}
                />
            </Grid>
        </Grid>
    )
}
