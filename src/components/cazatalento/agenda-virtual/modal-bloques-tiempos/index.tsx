import { Box, Dialog, DialogContent, DialogTitle, Divider, Grid, Typography } from '@mui/material'
import React, { type Dispatch, type SetStateAction, type FC } from 'react'
import Image from 'next/image'
import { FormGroup } from '~/components/shared';

interface Props {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export const ModalBloquesTiempos: FC<Props> = ({ isOpen, setIsOpen }) => {
    return (
        <Dialog
            open={isOpen}
            onClose={() => setIsOpen(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            sx={{
                width: '100%',
                '& .MuiPaper-root': {
                    maxWidth: '100%'
                }
            }}
        >
            <DialogContent sx={{
                padding: '30px 100px',
                width: '800px',

            }}>
                <Grid xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
                        <Image src="/assets/img/iconos/icono_relog_blue.png" width={30} height={30} alt="" />
                        <Box>
                            <Typography fontWeight={600} sx={{ fontSize: '1.4rem' }}>
                                Crear Bloques de Tiempo
                            </Typography>
                            <Typography>
                                27 de septiembre de 2021
                            </Typography>
                        </Box>
                    </Box>
                </Grid>
                <Grid xs={12}>
                    <Grid xs={12}>
                        <Typography fontWeight={600} sx={{ color: '#069cb1' }}>
                            Intervalos de tiempo (Duración)
                        </Typography>
                    </Grid>
                    <Grid xs={12}>
                        <Grid xs={12}>
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                flexWrap: 'wrap'
                            }}>
                                <FormGroup
                                    className={'form-input-md'}
                                    style={{ width: 150 }}
                                    labelStyle={{ fontWeight: 600, width: '100%' }}
                                    labelClassName={'form-input-label'}
                                    value={''}
                                    label='Inicia casting'
                                    onChange={(e) => {
                                        /* setBanner(prev => {
                                            return {
                                                ...prev,
                                                text: e.target.value
                                            }
                                        }) */
                                    }}
                                />
                                <FormGroup
                                    className={'form-input-md'}
                                    style={{ width: 150 }}
                                    labelStyle={{ fontWeight: 600, width: '100%' }}
                                    labelClassName={'form-input-label'}
                                    value={''}
                                    label='Tiempo por talento'
                                    onChange={(e) => {
                                        /* setBanner(prev => {
                                            return {
                                                ...prev,
                                                text: e.target.value
                                            }
                                        }) */
                                    }}
                                />
                                <FormGroup
                                    className={'form-input-md'}
                                    style={{ width: 150 }}
                                    labelStyle={{ fontWeight: 600, width: '100%' }}
                                    labelClassName={'form-input-label'}
                                    value={''}
                                    label='Finaliza casting'
                                    onChange={(e) => {
                                        /* setBanner(prev => {
                                            return {
                                                ...prev,
                                                text: e.target.value
                                            }
                                        }) */
                                    }}
                                />
                            </Box>
                        </Grid>
                        <Grid xs={12}>
                            <Typography fontWeight={600} sx={{ color: '#069cb1' }}>
                                12 intervalos
                            </Typography>
                        </Grid>
                        <Grid xs={12}>
                            <Typography fontWeight={600} sx={{ color: '#069cb1' }}>
                                Crear descanso
                            </Typography>
                        </Grid>
                        <Grid xs={12}>
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                flexWrap: 'wrap'
                            }}>
                                <FormGroup
                                    className={'form-input-md'}
                                    style={{ width: 150 }}
                                    labelStyle={{ fontWeight: 600, width: '100%' }}
                                    labelClassName={'form-input-label'}
                                    value={''}
                                    label='Hora de inicio'
                                    onChange={(e) => {
                                        /* setBanner(prev => {
                                            return {
                                                ...prev,
                                                text: e.target.value
                                            }
                                        }) */
                                    }}
                                />
                                <FormGroup
                                    className={'form-input-md'}
                                    style={{ width: 150 }}
                                    labelStyle={{ fontWeight: 600, width: '100%' }}
                                    labelClassName={'form-input-label'}
                                    value={''}
                                    label='Hora fin'
                                    onChange={(e) => {
                                        /* setBanner(prev => {
                                            return {
                                                ...prev,
                                                text: e.target.value
                                            }
                                        }) */
                                    }}
                                />
                                <Box sx={{ width: 150 }}>

                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                    <Grid xs={12}>
                        <Divider />
                    </Grid>
                    <Grid xs={12}>
                        <Grid xs={12}>
                            <Typography fontWeight={600} sx={{ color: '#069cb1' }}>
                                Administrar Bloques de Tiempo
                            </Typography>
                            <Typography fontWeight={600} sx={{ color: '#878585' }}>
                                ¿Como te gustaría administrar los intervalos?
                            </Typography>
                        </Grid>
                        <Grid xs={12}>

                        </Grid>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    )
}
