import { Box, Grid, Typography } from '@mui/material'
import Image from 'next/image'
import React from 'react'
import { FormGroup, MSelect } from '~/components/shared'
import { TalentoReclutadoCard } from '../talento-reclutado-card'

export const TalentosReclutadosGrid = () => {
    return (
        <Grid xs={12}>
            <Grid container xs={12} sx={{
                backgroundColor: '#069cb1',
                padding: '20px',
                alignItems: 'center',
            }}>
                <Grid xs={8}>
                    <Typography fontWeight={600} sx={{ color: '#fff', fontSize: '1.4rem' }}>
                        Talentos reclutados
                    </Typography>
                </Grid>
                <Grid container xs={4}>
                    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
                        <Typography sx={{ color: '#fff', fontSize: '1.1rem' }}>
                            Vista:
                        </Typography>

                        <Image src="/assets/img/iconos/vista_cuadros.png" width={20} height={20} alt="" />

                        <Image src="/assets/img/iconos/vista_columnas.png" width={20} height={20} alt="" />
                    </Box>

                </Grid>
            </Grid>
            <Grid xs={12}>
                <Grid xs={12} sx={{
                    padding: '10px 30px 5px 30px',
                    borderLeft: '3px solid #EBEBEB',
                    borderRight: '3px solid #EBEBEB',
                }}>
                    <Grid xs={12}>
                        <MSelect
                            id="posicion-contenido-select"
                            labelStyle={{ fontWeight: 600 }}
                            labelClassName={'form-input-label'}
                            label='Rol'
                            options={[{ value: 'top', label: 'Arriba' }, { value: 'bottom', label: 'Abajo' }, { value: 'left', label: 'Izquierda' }, { value: 'Right', label: 'Derecha' }]}
                            value={''}
                            className={'form-input-md'}
                            onChange={(e) => {
                                /* setBanner(prev => {
                                    return {
                                        ...prev,
                                        position: e.target.value
                                    }
                                }) */
                            }}
                        />
                    </Grid>
                    <Grid xs={12}>
                        <Box>
                            <Typography>
                                Ver:
                            </Typography>
                            <MSelect
                                id="posicion-contenido-select"
                                labelStyle={{ fontWeight: 600 }}
                                labelClassName={'form-input-label'}
                                options={[{ value: 'top', label: 'Arriba' }, { value: 'bottom', label: 'Abajo' }, { value: 'left', label: 'Izquierda' }, { value: 'Right', label: 'Derecha' }]}
                                value={''}
                                className={'form-input-md'}
                                onChange={(e) => {
                                    /* setBanner(prev => {
                                        return {
                                            ...prev,
                                            position: e.target.value
                                        }
                                    }) */
                                }}
                            />
                        </Box>
                    </Grid>
                </Grid>
                <Grid xs={12} sx={{ backgroundColor: '#EBEBEB', padding: '5px 30px' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography>
                            Filtrar por:
                        </Typography>
                        <MSelect
                            id="posicion-contenido-select"
                            labelStyle={{ fontWeight: 600 }}
                            options={[{ value: 'top', label: 'Arriba' }, { value: 'bottom', label: 'Abajo' }, { value: 'left', label: 'Izquierda' }, { value: 'Right', label: 'Derecha' }]}
                            value={''}
                            className={'form-input-md'}
                            onChange={(e) => {
                                /* setBanner(prev => {
                                    return {
                                        ...prev,
                                        position: e.target.value
                                    }
                                }) */
                            }}
                        />
                    </Box>
                </Grid>

                <Grid container xs={12} gap={2} sx={{
                    justifyContent: 'center',
                    borderLeft: '3px solid #EBEBEB',
                    borderRight: '3px solid #EBEBEB',
                    borderBottom: '3px solid #EBEBEB',
                    padding: '30px 0'
                }}>
                    {
                        Array.from({ length: 4 }).map((_, i) => (
                            <Grid key={i} xs={5}>
                                <TalentoReclutadoCard />
                            </Grid>
                        ))
                    }
                </Grid>

                
            </Grid>
        </Grid>
    )
}
