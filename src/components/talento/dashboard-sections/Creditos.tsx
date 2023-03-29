import { Grid, IconButton, Typography } from '@mui/material'
import Image from 'next/image';
import React, { useState } from 'react'
import { MContainer } from '~/components/layout/MContainer';
import { SectionTitle } from '~/components/shared';
import { MTable } from '~/components/shared/MTable/MTable';
import { api, parseErrorBody } from '~/utils/api';
import { useMemo } from 'react';
import { useRouter } from 'next/router';
import { Star } from '@mui/icons-material';
import useNotify from '~/hooks/useNotify';

export const Creditos = (props: {id_talento: number}) => {
    const router = useRouter();

    const creditos = api.talentos.getCreditosByIdTalento.useQuery({id: props.id_talento}, {
        refetchOnWindowFocus: false,
        keepPreviousData: true
    });

    const {notify} = useNotify();

    const loading = creditos.isFetching;
    const data = useMemo(() => {
        if (creditos.data) {
            return creditos.data;
        }
        return null;
    }, [creditos.data]);

    const update_credito = api.talentos.updateCreditoDestacado.useMutation({
        onSuccess(data, input) {
            notify('success', 'Se guardo los creditos con exito');
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            creditos.refetch();
        },
        onError: (error) => {
            notify('error', parseErrorBody(error.message));
        }
    });

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
                    disable_animation
                    loading={loading && !creditos.isSuccess}
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
                        //const es_destacado = (credito.destacado) ? <Image src="/assets/img/iconos/icon_estrella_dorada.svg" style={{marginLeft: 16}} width={30} height={30} alt="" /> : <></>;
                        return {
                            titulo: credito.titulo,
                            rol: credito.rol,
                            director: credito.director,
                            anio: credito.anio,
                            clip: <MContainer direction='horizontal' styles={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Typography>Reproducir</Typography>
                               
                            </MContainer>,
                            destacado: <IconButton
                                style={{ color: (credito.destacado) ? 'gold' : 'gray' }}
                                aria-label="marcar como destacado"
                                onClick={() => {
                                    update_credito.mutate({id_credito: credito.id, destacado: !credito.destacado});
                                }}
                            >
                                <Star />
                            </IconButton>,

                        }
                    }) : []}
                />
            </Grid>
        </Grid>
    )
}
