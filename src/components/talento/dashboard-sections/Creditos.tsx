import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, Typography } from '@mui/material'
import Image from 'next/image';
import React, { useContext, useState } from 'react'
import { MContainer } from '~/components/layout/MContainer';
import { SectionTitle } from '~/components/shared';
import { MTable } from '~/components/shared/MTable/MTable';
import { api, parseErrorBody } from '~/utils/api';
import { useMemo } from 'react';
import { useRouter } from 'next/router';
import { Star } from '@mui/icons-material';
import useNotify from '~/hooks/useNotify';
import AppContext from '~/context/app';
import useLang from '~/hooks/useLang';

export const Creditos = (props: {id_talento: number, read_only: boolean}) => {
    const ctx = useContext(AppContext);
  	const textos = useLang(ctx.lang);
    const router = useRouter();
    const [dialog, setDialog] = useState<{open: boolean, url: string, name: string}>({open: false, url: '', name: ''});

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
            notify('success', `${textos['success_update_creditos']}`);
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            creditos.refetch();
        },
        onError: (error) => {
            notify('error', parseErrorBody(error.message));
        }
    });

    return (
        <>
        
            <Grid id="creditos" container sx={{ mt: 10 }}>
                <Grid item xs={12}>
                    <SectionTitle title={textos['credito'] ? `${textos['credito']}s` : 'Texto No definido'} textButton={textos['editar'] ? textos['editar'] : 'Texto No definido'} onClickButton={(!props.read_only) ? () => { 
                        // eslint-disable-next-line @typescript-eslint/no-floating-promises
                        router.push(`/talento/editar-perfil?step=3&id_talento=${props.id_talento}`)  
                    } : undefined} />
                </Grid>
                <Grid item xs={12}>
                    <Typography my={1} fontSize={30} sx={{ color: '#069cb1' }} fontWeight={900}>
                        {(creditos.data) ? creditos.data.creditos.length : ''}
                    </Typography>
                    <MTable
                        disable_animation
                        loading={loading && !creditos.isSuccess}
                        backgroundColorHeader='#069cb1'
                        columnsHeader={[
                            <Typography key={1} sx={{ color: '#fff' }} fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                                {textos['titulo'] ? textos['titulo'] : 'Texto No definido'}
                            </Typography>,
                            <Typography key={2} sx={{ color: '#fff' }} fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                                {textos['rol'] ? textos['rol'] : 'Texto No definido'}
                            </Typography>,
                            <Typography key={3} sx={{ color: '#fff' }} fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                                {textos['director'] ? textos['director'] : 'Texto No definido'}
                            </Typography>,
                            <Typography key={4} sx={{ color: '#fff' }} fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                                {textos['anio'] ? textos['anio'] : 'Texto No definido'}
                            </Typography>,
                            <Typography key={5} sx={{ color: '#fff' }} fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                                {textos['clip'] ? textos['clip'] : 'Texto No definido'}
                            </Typography>,
                            <Typography key={6} sx={{ color: '#fff' }} fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                                {textos['destacado'] ? textos['destacado'] : 'Texto No definido'}
                            </Typography>,
                        ]}
                        data={(data) ? data.creditos.map(credito => {
                            //const es_destacado = (credito.destacado) ? <Image src="/assets/img/iconos/icon_estrella_dorada.svg" style={{marginLeft: 16}} width={30} height={30} alt="" /> : <></>;
                            return {
                                titulo: credito.titulo,
                                rol: credito.rol,
                                director: credito.director,
                                anio: credito.anio,
                                clip: (!credito.media) ? <></> : <MContainer direction="horizontal" justify='center'>
                                <IconButton onClick={() => {
                                    if (credito.media) {
                                        setDialog({open: true, name: credito.media.nombre, url: credito.media.url})
                                    }
                                }}>
                                    <Image style={{ marginLeft: 5, cursor: 'pointer' }} src="/assets/img/iconos/play.svg" width={20} height={20} alt="" />
                                </IconButton>
                                <Typography>
                                    {credito.media.nombre}
                                </Typography>
                            </MContainer>,
                                destacado: <IconButton
                                    style={{ color: (credito.destacado) ? 'gold' : 'gray' }}
                                    aria-label="marcar como destacado"
                                    onClick={() => {
                                        update_credito.mutate({id_talento: props.id_talento, id_credito: credito.id, destacado: !credito.destacado});
                                    }}
                                >
                                    <Star />
                                </IconButton>,

                            }
                        }) : []}
                    />
                </Grid>
            </Grid>
            <Dialog
                fullWidth={true}
                maxWidth={'md'}
                open={dialog.open}
                onClose={() => { setDialog({...dialog, open: false}) }}
            >
                <DialogTitle>{dialog.name}</DialogTitle>
                <DialogContent>
                    <video controls style={{ width: '100%' }}>
                        <source src={dialog.url} type="video/mp4" />
                        Lo sentimos tu navegador no soporta videos.
                    </video>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setDialog({...dialog, open: false}) }}>Cerrar</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
