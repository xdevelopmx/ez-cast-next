import { Box, Button, ButtonGroup, Grid, Tooltip, Typography, tooltipClasses } from '@mui/material'
import Image from 'next/image'
import React, { useState } from 'react'
import { ModalBloquesTiempos } from '../modal-bloques-tiempos'

export const HorariosTable = () => {

    const [opcionSelected, setOpcionSelected] = useState<string>('03/09/21')

    const [isOpendModal, setIsOpendModal] = useState(false)

    return (
        <Grid xs={12}>
            <Grid xs={12} sx={{
                backgroundColor: '#069cb1',
                padding: '20px',
                alignItems: 'center',
            }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography fontWeight={600} sx={{ color: '#fff', fontSize: '1.4rem' }}>
                        Horario
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
                        <Button sx={{
                            textTransform: 'none',
                            color: '#fff',
                            border: '1px solid #fff',
                            borderRadius: '2rem',
                            padding: '5px 20px',
                            backgroundColor: '#069cb1',
                            '&:hover': {
                                backgroundColor: '#07a6bb'
                            },
                            lineHeight: '20px',
                        }}>
                            <Image src="/assets/img/iconos/cruz_white.svg" width={15} height={15} alt="" />
                            <Typography sx={{ paddingLeft: '10px' }}>
                                Añadir descanso
                            </Typography>
                        </Button>

                        <Button sx={{
                            display: 'flex',
                            textTransform: 'none',
                            color: '#fff',
                            border: '1px solid #fff',
                            borderRadius: '2rem',
                            padding: '5px 20px',
                            backgroundColor: '#069cb1',
                            '&:hover': {
                                backgroundColor: '#07a6bb'
                            },
                            lineHeight: '20px',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis'
                        }}>
                            <Image src="/assets/img/iconos/cruz_white.svg" width={15} height={15} alt="" />
                            <Typography sx={{ paddingLeft: '10px' }}>
                                Añadir bloque de tiempo
                            </Typography>
                        </Button>
                    </Box>
                </Box>
            </Grid>
            <Grid xs={12} sx={{
                borderLeft: '3px solid #EBEBEB',
                borderBottom: '3px solid #EBEBEB',
                borderRight: '3px solid #EBEBEB'
            }}>
                <Grid xs={12}>
                    <ButtonGroup sx={{ mt: 2, mb: 0, gap: 1, display: 'flex', flexWrap: 'wrap', boxShadow: 'none' }} variant="contained" aria-label="outlined primary button group">
                        <Button
                            onClick={() => { setOpcionSelected('03/09/21') }}
                            variant={opcionSelected === '03/09/21' ? 'contained' : 'outlined'}
                        >
                            03/09/21
                        </Button>
                        <Button
                            onClick={() => { setOpcionSelected('04/09/21') }}
                            variant={opcionSelected === '04/09/21' ? 'contained' : 'outlined'}
                        >
                            04/09/21
                        </Button>
                        <Button
                            onClick={() => { setOpcionSelected('06/09/21') }}
                            variant={opcionSelected === '06/09/21' ? 'contained' : 'outlined'}
                        >
                            06/09/21
                        </Button>
                        <Button
                            onClick={() => { setOpcionSelected('07/09/21') }}
                            variant={opcionSelected === '07/09/21' ? 'contained' : 'outlined'}
                        >
                            07/09/21
                        </Button>
                        <Button
                            onClick={() => { setOpcionSelected('08/09/21') }}
                            variant={opcionSelected === '08/09/21' ? 'contained' : 'outlined'}
                        >
                            08/09/21
                        </Button>
                    </ButtonGroup>
                </Grid>
                <Grid xs={12}>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'column',
                        minHeight: '400px',
                        justifyContent: 'center'
                    }}>
                        <Typography fontWeight={600} sx={{ color: '#827F7F', marginBottom: '20px' }}>
                            ¡Comienza a crear tu horario y castea organizadamente!
                        </Typography>

                        <Tooltip
                            title='Comienza a crear tu horario, ¡y castea organizadamente!'
                            arrow
                            sx={{
                                [`& .${tooltipClasses.tooltip}`]: {
                                    backgroundColor: 'orange',
                                    color: 'white',
                                },
                            }}
                        >
                            <Button sx={{
                                textTransform: 'none',
                                border: '1px solid #069cb1',
                                borderRadius: '2rem',
                                padding: '5px 20px',
                                color: '#000'
                            }}
                                onClick={() => setIsOpendModal(true)}
                            >
                                <Image src="/assets/img/iconos/cruz_blue.svg" width={15} height={15} alt="" />
                                <Typography fontWeight={600} sx={{ paddingLeft: '10px' }}>
                                    Añadir bloque de tiempo
                                </Typography>
                            </Button>
                        </Tooltip>
                    </Box>
                </Grid>
            </Grid>

            <ModalBloquesTiempos
                isOpen={isOpendModal}
                setIsOpen={setIsOpendModal}
            />
        </Grid>
    )
}
