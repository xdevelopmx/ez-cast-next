import Image from 'next/image'
import { Box, Button, Divider, Grid, Typography } from '@mui/material'
import { MContainer } from '~/components/layout/MContainer'
import { MSelect } from '~/components/shared'
import { TalentoTableItem } from './TalentoTableItem'
import { Fragment, type FC } from 'react'
import { type RolCompleto } from '~/pages/cazatalentos/billboard'

interface Props {
    rol?: RolCompleto;
}

export const PerfilTable: FC<Props> = ({ rol }) => {

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
                        <Typography>Ver <Typography component={'span'} sx={{ backgroundColor: '#fff', borderRadius: '1rem', padding: '0px 8px' }}>25</Typography> resultados</Typography>
                        <Button sx={{ width: '20px', padding: 0 }}>
                            <Image src="/assets/img/iconos/arrow_l_white.svg" width={20} height={20} alt="" />
                        </Button>
                        <Typography>Página <Typography component={'span'} sx={{ backgroundColor: '#fff', borderRadius: '1rem', padding: '0px 8px' }}>1</Typography> de 1</Typography>
                        <Button sx={{ width: '20px', padding: 0 }}>
                            <Image src="/assets/img/iconos/arrow_r_white.svg" width={20} height={20} alt="" />
                        </Button>
                    </MContainer>
                </Grid>
            </Grid>
            <Grid xs={12} sx={{ backgroundColor: '#EBEBEB', padding: '10px' }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Typography>{rol?.tipo_rol?.tipo || 'No especificado'}</Typography>
                        <Divider style={{ borderWidth: 1, height: 12, borderColor: '#069cb1', margin: 8 }} orientation='vertical' />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        {
                            rol?.filtros_demograficos && rol?.filtros_demograficos.generos && rol?.filtros_demograficos.generos.length > 0
                                ? rol?.filtros_demograficos.generos.map(g => (
                                    <Fragment key={g.id}>
                                        <Typography>{g.genero?.es}</Typography>
                                        <Divider style={{ borderWidth: 1, height: 12, borderColor: '#069cb1', margin: 8 }} orientation='vertical' />
                                    </Fragment>
                                ))
                                : <>
                                    <Typography>No especificado</Typography>
                                    <Divider style={{ borderWidth: 1, height: 12, borderColor: '#069cb1', margin: 8 }} orientation='vertical' />
                                </>
                        }

                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Typography>{rol?.tipo_rol?.tipo || 'No especificado'}</Typography>
                        <Divider style={{ borderWidth: 1, height: 12, borderColor: '#069cb1', margin: 8 }} orientation='vertical' />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Typography>{`${rol?.filtros_demograficos?.rango_edad_inicio || 'na'}-${rol?.filtros_demograficos?.rango_edad_fin || 'na'}`}</Typography>
                        <Divider style={{ borderWidth: 1, height: 12, borderColor: '#069cb1', margin: 8 }} orientation='vertical' />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {
                            rol?.filtros_demograficos && rol?.filtros_demograficos?.aparencias_etnicas && rol?.filtros_demograficos?.aparencias_etnicas.length > 0
                                ? rol?.filtros_demograficos.aparencias_etnicas.map(ae => (
                                    <Fragment key={ae.id}>
                                        <Typography>{ae.aparencia_etnica.es}</Typography>
                                        <Divider style={{ borderWidth: 1, height: 12, borderColor: '#069cb1', margin: 8 }} orientation='vertical' />
                                    </Fragment>
                                ))
                                : <>
                                    <Typography>No especificado</Typography>
                                    <Divider style={{ borderWidth: 1, height: 12, borderColor: '#069cb1', margin: 8 }} orientation='vertical' />
                                </>
                        }
                    </Box>
                    <Box sx={{ display: 'flex' }}>
                        <Typography fontWeight={100} fontStyle={'italic'}>
                            {rol?.descripcion || 'No especificado'}
                        </Typography>
                    </Box>
                </Box>
            </Grid>
            <Grid container item xs={12} gap={1} sx={{ justifyContent: 'space-between' }} mt={1}>
                {/*
                
                    {
                        Array.from({ length: 12 }).map((_, i) => (
                            <TalentoTableItem key={i} />
                        ))
                    }
            
                */}
            </Grid>
            <Grid xs={12} mt={4}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button sx={{ textTransform: 'none' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Image src="/assets/img/iconos/arow_l_blue.svg" width={15} height={15} alt="" />
                            <Typography fontWeight={600}>Página previa</Typography>
                        </Box>
                    </Button>

                    <Typography sx={{ color: '#069cb1' }} fontWeight={600} >1 de 1</Typography>

                    <Button sx={{ textTransform: 'none' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography fontWeight={600}>Siguiente página</Typography>
                            <Image src="/assets/img/iconos/arow_r_blue.svg" width={15} height={15} alt="" />
                        </Box>
                    </Button>
                </Box>
            </Grid>
        </Grid>
    )
}
