import { Box, Button, Divider, Grid, Typography } from '@mui/material'
import React from 'react'
import { MContainer } from '~/components/layout/MContainer'
import { MSelect } from '~/components/shared'
import Image from 'next/image'
import { TalentoTableItem } from './TalentoTableItem'

export const PerfilTable = () => {
    return (
        <Grid container item xs={12} mt={1}>
            <Grid container item xs={20} sx={{ backgroundColor: '#069cb1', padding: '20px 10px' }} columns={20}>
                <Grid item xs={4}>
                    <MContainer direction='horizontal' styles={{ gap: 10 }}>
                        <Typography sx={{ paddingRight: 1 }}>Ver</Typography>
                        <MSelect
                            id="nombre-proyecto-select"
                            options={[
                                { value: 'Callback', label: 'Callback' },
                                { value: 'Callback 2', label: 'Callback 2' },
                                { value: 'Callback 3', label: 'Callback 3' }
                            ]}
                            styleRoot={{ width: '70%' }}
                            value={'Callback'}
                            onChange={(e) => {
                                /* onFormChange({
                                    id_sindicato: parseInt(e.target.value)
                                }) */
                            }}
                            label=''
                        />
                    </MContainer>
                </Grid>
                <Grid item xs={4}>
                    <MContainer direction='horizontal' styles={{ gap: 10 }}>
                        <Typography>Rol</Typography>
                        <MSelect
                            id="nombre-proyecto-select"
                            options={[
                                { value: 'Nombre', label: 'Nombre' },
                                { value: 'Nombre 2', label: 'Nombre 2' },
                                { value: 'Nombre 3', label: 'Nombre 3' }
                            ]}
                            styleRoot={{ width: '70%' }}
                            value={'Nombre'}
                            onChange={(e) => {
                                /* onFormChange({
                                    id_sindicato: parseInt(e.target.value)
                                }) */
                            }}
                            label=''
                        />
                    </MContainer>
                </Grid>

                <Grid xs={3}>
                    <Typography sx={{ color: '#fff', textAlign: 'center' }}>0 resultados totales</Typography>
                </Grid>

                <Grid xs={9}>
                    <MContainer direction='horizontal' styles={{ alignItems: 'center', justifyContent: 'flex-end' }}>
                        <Typography>Ver <Typography component={'span'}>25</Typography> resultados</Typography>
                        <Button sx={{ width: '20px', padding: 0 }}>
                            <Image src="/assets/img/iconos/arrow_l_white.svg" width={20} height={20} alt="" />
                        </Button>
                        <Typography>Página <Typography component={'span'}>1</Typography> de 1</Typography>
                        <Button sx={{ width: '20px', padding: 0 }}>
                            <Image src="/assets/img/iconos/arrow_r_white.svg" width={20} height={20} alt="" />
                        </Button>
                    </MContainer>
                </Grid>
            </Grid>
            <Grid xs={12} sx={{ backgroundColor: '#EBEBEB', padding: '10px' }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Typography>Cortometraje</Typography>
                        <Divider style={{ borderWidth: 1, height: 12, borderColor: '#069cb1', margin: 8 }} orientation='vertical' />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Typography>Hombre</Typography>
                        <Divider style={{ borderWidth: 1, height: 12, borderColor: '#069cb1', margin: 8 }} orientation='vertical' />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Typography>Protagonista</Typography>
                        <Divider style={{ borderWidth: 1, height: 12, borderColor: '#069cb1', margin: 8 }} orientation='vertical' />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Typography>25-30</Typography>
                        <Divider style={{ borderWidth: 1, height: 12, borderColor: '#069cb1', margin: 8 }} orientation='vertical' />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Typography>Latino/Hispano</Typography>
                        <Divider style={{ borderWidth: 1, height: 12, borderColor: '#069cb1', margin: 8 }} orientation='vertical' />
                    </Box>
                    <Box sx={{ display: 'flex' }}>
                        <Typography fontWeight={100} fontStyle={'italic'}>Description breve del personaje</Typography>
                    </Box>
                </Box>
            </Grid>
            <Grid container item xs={12} gap={1} sx={{ justifyContent: 'space-between' }} mt={1}>
                {
                    Array.from({ length: 12 }).map((_, i) => (
                        <TalentoTableItem key={i} />
                    ))
                }
            </Grid>
        </Grid>
    )
}
