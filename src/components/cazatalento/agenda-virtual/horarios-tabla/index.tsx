import { Box, Button, ButtonGroup, Grid, Tooltip, Typography, tooltipClasses } from '@mui/material'
import Image from 'next/image'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { ModalBloquesTiempos } from '../modal-bloques-tiempos'
import useNotify from '~/hooks/useNotify'
import { LocalizacionesPorHorarioAgenda, Roles } from '@prisma/client'
import { api } from '~/utils/api'
import { generateIntervalos } from '~/utils/dates'
import { DraggableContainer } from '~/components/shared/DraggableList/DraggableContainer'
import { DraggableHorarioContainer } from './DraggableHorarioContainer'
import AppContext from '~/context/app'
import useLang from '~/hooks/useLang'

export const HorariosTable = (props: {
    id_horario_agenda: number,
    dates: string[],
    roles: Roles[],
    locaciones: LocalizacionesPorHorarioAgenda[]
}) => {

    const [opcionSelected, setOpcionSelected] = useState<string>(new Date().toString());

    const [isOpendModal, setIsOpendModal] = useState(false);

    const ctx = useContext(AppContext);
    const textos = useLang(ctx.lang);

    const {notify} = useNotify();

    const bloque = api.agenda_virtual.getBloqueHorarioByDateAndIdHorario.useQuery({
        id_horario_agenda: props.id_horario_agenda, fecha: new Date(opcionSelected)
    }, {
        refetchOnWindowFocus: false
    })

    const intervalos = useMemo(() => {
        if (bloque.data) {
            return generateIntervalos(bloque.data.minutos_por_talento, 
                bloque.data.hora_inicio, 
                bloque.data.hora_fin, 
                (bloque.data.hora_descanso_inicio && bloque.data.hora_descanso_inicio !== '00:00' && bloque.data.hora_descanso_fin && bloque.data.hora_descanso_fin !== '00:00') ? 
                {inicio_tiempo: bloque.data.hora_descanso_inicio, fin_tiempo: bloque.data.hora_descanso_fin} : undefined);
        }
        return [];
    }, [bloque.data]);

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
                        {props.dates.map(date => {
                            return (
                                <Button
                                    onClick={() => { setOpcionSelected(date) }}
                                    variant={opcionSelected === date ? 'contained' : 'outlined'}
                                >
                                    {date}
                                </Button>
                            )
                        })}
                        
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
                        {bloque.data && bloque.isFetched &&
                            <>
                                {intervalos.map(i => {
                                    return (
                                        <div style={{ backgroundColor: (i.tipo === 'intervalo') ? '#a8e2ea' : '#94f0d1', width: '90%', height: 88, margin: 8, position: 'relative'}}>
                                            <p style={{position: 'absolute', top: 8, left: 8}}>{`${(i.inicio.length < 5) ? `${i.inicio}0` : i.inicio} - ${(i.fin. length < 5) ? `${i.fin}0` : i.fin }`}</p>
                                            <DraggableHorarioContainer onDrop={(id_talento) => { } } allowedDropEffect="any" fecha={''} id_rol={0} />
                                        </div>
                                    )
                                })}
                            </>
                        }
                        {!bloque.data && bloque.isFetched &&
                            <>
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
                                        onClick={() => {
                                            if (opcionSelected !== '') {
                                                setIsOpendModal(true);
                                            } else {
                                                notify('warning', `${textos['no_haz_seleccionado_ninguna_fecha']}`);
                                            }
                                        }}
                                    >
                                        <Image src="/assets/img/iconos/cruz_blue.svg" width={15} height={15} alt="" />
                                        <Typography fontWeight={600} sx={{ paddingLeft: '10px' }}>
                                            Añadir bloque de tiempo
                                        </Typography>
                                    </Button>
                                </Tooltip>
                            </>
                        }
                    </Box>
                </Grid>
            </Grid>

            <ModalBloquesTiempos
                id_horario_agenda={props.id_horario_agenda}
                locaciones={props.locaciones}
                roles={props.roles}
                date={opcionSelected}
                isOpen={isOpendModal}
                setIsOpen={setIsOpendModal} onChange={function (): void {
                    throw new Error('Function not implemented.')
                } }            />
        </Grid>
    )
}
