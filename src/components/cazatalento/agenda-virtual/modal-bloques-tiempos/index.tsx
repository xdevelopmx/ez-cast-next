import { Box, Button, Dialog, DialogContent, DialogTitle, Divider, Grid, Typography } from '@mui/material'
import React, { type Dispatch, type SetStateAction, type FC, useState, useMemo, useEffect } from 'react'
import Image from 'next/image'
import { FormGroup, MRadioGroup, MSelect } from '~/components/shared';
import { DesktopTimePicker, MobileTimePicker, StaticTimePicker, TimeField, TimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import useNotify from '~/hooks/useNotify';
import { calculateIntervalos, formatDate } from '~/utils/dates';
import { MContainer } from '~/components/layout/MContainer';
import { LocalizacionesPorHorarioAgenda, Roles } from '@prisma/client';
import { Add, AddCircle } from '@mui/icons-material';
import { api, parseErrorBody } from '~/utils/api';

interface Props {
    locaciones: LocalizacionesPorHorarioAgenda[];
    roles: Roles[];
    isOpen: boolean;
    date: string;
    id_horario_agenda: number;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export const ModalBloquesTiempos: FC<Props> = ({ isOpen, setIsOpen, date, roles, locaciones, id_horario_agenda }) => {

    const {notify} = useNotify();

    const bloque = api.agenda_virtual.getBloqueHorarioByDateAndIdHorario.useQuery({
        id_horario_agenda: id_horario_agenda, fecha: new Date(date)
    }, {
        refetchOnWindowFocus: false
    })

    const updateBloqueHorario = api.agenda_virtual.updateBloqueHorario.useMutation({
        onSuccess: (data) => {
            notify('success', 'Se actualizo el bloque de horario con exito');
            setIsOpen(false);
        },
        onError: (err) => {
            notify('error', parseErrorBody(err.message));
        }
    })

    const [minutos_por_talento, setMinutosPorTalento] = useState(0);

    const [inicio_casting, setInicioCasting] = useState('12:00');

    const [fin_casting, setFinCasting] = useState('13:00');

    const [inicio_descanso, setInicioDescanso] = useState('00:00');

    const [fin_descanso, setFinDescanso] = useState('00:00');

    const [usar_descanso, setUsarDescanso] = useState('No');

    const [administrar_intervalos, setAdministrarIntervalos] = useState<'Manualmente' | 'Automaticamente'>('Manualmente');

    const [asignaciones_intervalos_por_rol, setAsignacionesIntervalosPorRol] = useState<number[]>(roles.map((r, i) => r.id));

    const [roles_selects, setRolesSelects] = useState<JSX.Element[]>([]);

    const [selected_locacion, setSelectedLocacion] = useState('');

    const estados_republica = api.catalogos.getEstadosRepublica.useQuery(undefined, {
        refetchOnWindowFocus: false,
        refetchOnMount: false
    })

    useEffect(() => {
        if (bloque.data && estados_republica.data) {
            setMinutosPorTalento(bloque.data.minutos_por_talento);
            setInicioCasting(bloque.data.hora_inicio);
            setFinCasting(bloque.data.hora_fin);
            setInicioDescanso((bloque.data.hora_descanso_inicio) ? bloque.data.hora_descanso_inicio : '00:00');
            setFinDescanso((bloque.data.hora_descanso_fin) ? bloque.data.hora_descanso_fin : '00:00');
            setUsarDescanso(bloque.data.hora_descanso_inicio != null ? 'Si' : 'No');
            const locacion = locaciones.map(l => `${l.direccion}, ${estados_republica.data.filter(er => er.id === l.id_estado_republica)[0]?.es}`)[0];
            if (locacion) {
                setSelectedLocacion(locacion)
            }
        }
    }, [bloque.data, estados_republica.data]);

    const intervalos = useMemo(() => {
        return calculateIntervalos(minutos_por_talento, inicio_casting, fin_casting, (usar_descanso) ? {inicio_tiempo: inicio_descanso, fin_tiempo: fin_descanso} : undefined);
    }, [minutos_por_talento, inicio_descanso, fin_descanso, inicio_casting, fin_casting]);

    return (
        <Dialog
            open={isOpen}
            onClose={() => setIsOpen(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            sx={{
                width: '100%',
                '& .MuiPaper-root': {
                    maxWidth: '100%',
                    maxHeight: '80%'
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
                            {JSON.stringify(bloque.data)}
                            <Typography>
                                {new Date(date).toLocaleString('es-mx', {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                })}
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
                                    type='time'
                                    style={{ width: 150 }}
                                    labelStyle={{ fontWeight: 600, width: '100%' }}
                                    labelClassName={'form-input-label'}
                                    value={inicio_casting}
                                    label='Inicia casting'
                                    onChange={(e) => {
                                        setInicioCasting(e.target.value);
                                    }}
                                />
                                <FormGroup
                                    className={'form-input-md'}
                                    style={{ width: 175 }}
                                    type='number'
                                    labelStyle={{ fontWeight: 600, width: '100%' }}
                                    labelClassName={'form-input-label'}
                                    
                                    value={`${minutos_por_talento.toString()}`}
                                    label='Tiempo por talento (min)'
                                    onChange={(e) => {
                                        setMinutosPorTalento(parseInt(e.target.value));
                                    }}
                                />
                                <FormGroup
                                    className={'form-input-md'}
                                    style={{ width: 150 }}
                                    type='time'
                                    labelStyle={{ fontWeight: 600, width: '100%' }}
                                    labelClassName={'form-input-label'}
                                    value={fin_casting}
                                    label='Finaliza casting'
                                    onChange={(e) => {
                                        setFinCasting(e.target.value);
                                    }}
                                />
                            </Box>
                        </Grid>
                        <Grid xs={12}>
                            <Typography fontWeight={600} sx={{ color: '#069cb1' }}>
                                {intervalos} intervalos
                            </Typography>
                        </Grid>
                        <Grid xs={12}>
                            <MRadioGroup
                                label='¿Deseas agregar un descanso?'
                                labelStyle={{ fontSize: '1.1rem', color: '#000', fontWeight: 600 }}
                                style={{ gap: 0 }}
                                id="quieres-agregar-descanso"
                                options={['Si', 'No']}
                                value={usar_descanso}
                                direction='horizontal'
                                onChange={(e) => {
                                    setUsarDescanso(e.target.value);
                                }}
                            />
                        </Grid>
                        <Grid xs={12}>
                            {usar_descanso === 'Si' &&
                                <Typography fontWeight={600} sx={{ color: '#069cb1' }}>
                                    Crear descanso
                                </Typography>
                            }
                        </Grid>
                        <Grid xs={12}>
                            {usar_descanso === 'Si' &&
                            
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    flexWrap: 'wrap'
                                }}>
                                    <FormGroup
                                        className={'form-input-md'}
                                        style={{ width: 150 }}
                                        type='time'
                                        labelStyle={{ fontWeight: 600, width: '100%' }}
                                        labelClassName={'form-input-label'}
                                        value={inicio_descanso}
                                        label='Hora de inicio'
                                        onChange={(e) => {
                                            setInicioDescanso(e.target.value);
                                        }}
                                    />
                                    <FormGroup
                                        className={'form-input-md'}
                                        style={{ width: 150 }}
                                        type='time'
                                        labelStyle={{ fontWeight: 600, width: '100%' }}
                                        labelClassName={'form-input-label'}
                                        value={fin_descanso}
                                        label='Hora fin'
                                        onChange={(e) => {
                                            setFinDescanso(e.target.value);
                                        }}
                                    />
                                    <Box sx={{ width: 150 }}>

                                    </Box>
                                </Box>
                            }
                        </Grid>
                    </Grid>
                    <Grid xs={12}>
                        <Divider />
                    </Grid>
                    <Grid xs={12}>
                        {
                            /*
                        <Grid xs={12}>
                            <Typography fontWeight={600} sx={{ color: '#069cb1' }}>
                                Administrar Bloques de Tiempo
                            </Typography>
                        </Grid>
                        <Grid xs={12}>
                            <MRadioGroup
                                label='¿Como te gustaría administrar los intervalos?'
                                labelStyle={{ fontSize: '1.1rem', color: '#000', fontWeight: 600 }}
                                style={{ gap: 0 }}
                                id="como-adminisitrar-intervalos"
                                options={['Manualmente', 'Automaticamente']}
                                value={administrar_intervalos}
                                direction='vertical'
                                onChange={(e) => {
                                    setAdministrarIntervalos(e.target.value === 'Manualmente' ? 'Manualmente' : 'Automaticamente');
                                }}
                            />
                        </Grid>
                        

                        <Grid xs={12} p={3} sx={{backgroundColor: 'lightgrey'}}>
                            <Grid container>
                                <Grid xs={10} >
                                    <MContainer direction='horizontal' justify='space-between'>
                                        <MContainer direction='vertical'>
                                            <Typography fontWeight={600}>
                                                Rol
                                            </Typography>
                                            {administrar_intervalos === 'Manualmente' && roles_selects.map(rs => rs)}
                                            {administrar_intervalos === 'Automaticamente' && roles.map(rs => <Typography>{rs.nombre}</Typography>)}
                                        </MContainer>
                                        <MContainer direction='vertical'>
                                            <Typography fontWeight={600}>
                                            # de talentos por intervalo
                                            </Typography>
                                            {administrar_intervalos === 'Automaticamente' && roles.map(rs => <Typography>{Math.floor(intervalos/roles.length)}</Typography>)}
                                        </MContainer>
                                    </MContainer>
                                    <Box width={250}>
                                        {administrar_intervalos === 'Manualmente' && roles_selects.length !== roles.length &&
                                        
                                            <Button 
                                                variant='text' 
                                                startIcon={<AddCircle color='primary'/>} 
                                                style={{textTransform: 'capitalize', color: 'black'}}
                                                onClick={() => {
                                                    setRolesSelects(prev => {
                                                        return prev.concat(
                                                            <MSelect
                                                                id={`rol-select-${prev.length}`}
                                                                options={roles.map(r => { return {label: `${r.nombre}-${prev.length}`, value: r.id.toString()}})}
                                                                value={asignaciones_intervalos_por_rol[prev.length]?.toString()}
                                                                className={'form-input-md'}
                                                                onChange={(e) => {
                                                                    const v = parseInt(e.target.value);
                                                                    if (asignaciones_intervalos_por_rol.includes(v)) {
                                                                        notify('warning', 'Ese rol ya esta asignado en otro select');
                                                                    } else {
                                                                        const index = asignaciones_intervalos_por_rol.indexOf(v);
                                                                        setAsignacionesIntervalosPorRol(prev => {
                                                                            prev.splice(index, 0, v);
                                                                            return prev;
                                                                        })
                                                                    }
                                                                    
                                                                }}
                                                            />
                                                        )
                                                    })
                                                }}
                                            >
                                                Agregar otro rol
                                            </Button>
                                        }
                                    </Box>
                                </Grid>
                            </Grid>
                        </Grid>
                            */
                        }
                        <Grid xs={12}>
                            <Typography fontWeight={600} sx={{ color: '#069cb1' }}>
                                Locación
                            </Typography>
                        </Grid>
                        <Grid xs={12}>
                            <MRadioGroup
                                label='¿Donde se llevará a cabo?'
                                labelStyle={{ fontSize: '1.1rem', color: '#000', fontWeight: 600 }}
                                style={{ gap: 0 }}
                                id="locaciones"
                                options={(estados_republica.data) ? locaciones.map(l => `${l.direccion}, ${estados_republica.data.filter(er => er.id === l.id_estado_republica)[0]?.es}`) : []}
                                value={selected_locacion}
                                direction='vertical'
                                onChange={(e) => {
                                    setSelectedLocacion(e.target.value);
                                }}
                            />
                            <Divider/>
                        </Grid>
                        {
                            /*
                        <Grid xs={12}>
                            <Typography fontWeight={600} sx={{ color: '#069cb1' }}>
                                Resumen casting
                            </Typography>
                        </Grid>
                        
                                <Grid xs={10}>
                                    <MContainer direction='horizontal' justify='space-between'>
                                        <MContainer direction='vertical'>
                                            <Typography>
                                                {intervalos}
                                            </Typography>
                                            <Typography>
                                                Intervalos
                                            </Typography>
                                        </MContainer>
                                        <MContainer direction='vertical'>
                                            <Typography>
                                                {administrar_intervalos === 'Automaticamente' ? '0' : ''}
                                            </Typography>
                                            <Typography>
                                                Intervalos vacios
                                            </Typography>
                                        </MContainer>
                                        <MContainer direction='vertical'>
                                            <Typography>
                                                {intervalos}
                                            </Typography>
                                            <Typography>
                                                Talentos agendados
                                            </Typography>
                                        </MContainer>
                                    </MContainer>
                                </Grid>
                            */
                        }
                        <Grid xs={12}>
                            <MContainer direction='vertical' justify='center' styles={{textAlign: 'center', alignContent: 'center', marginTop: 16}}>

                                <Button
                                    onClick={() => {
                                        if (intervalos === 0) {
                                            notify('warning', 'No se han definido los intervalos');
                                            return;
                                        }
                                        let loc = 0;
                                        if (estados_republica.data) {
                                            const locacion = locaciones.filter(l => `${l.direccion}, ${estados_republica.data.filter(er => er.id === l.id_estado_republica)[0]?.es}` === selected_locacion)[0];
                                            if (locacion) {
                                                loc = locacion.id;
                                            }
                                        }
                                        if (loc === 0) {
                                            notify('warning', 'No se han seleccionado una locacion');
                                            return;
                                        }
                                        updateBloqueHorario.mutate({
                                            id_bloque: (bloque.data) ? bloque.data.id : 0,
                                            id_horario_agenda: id_horario_agenda,
                                            fecha: new Date(date),
                                            hora_inicio: inicio_casting,
                                            hora_fin: fin_casting,
                                            minutos_por_talento: minutos_por_talento,
                                            hora_descanso_inicio: (usar_descanso) ? inicio_descanso : null,
                                            hora_descanso_fin: (usar_descanso) ? fin_descanso : null,
                                            id_locacion: loc		
                                        });
                                    }}
                                    sx={{
                                        width: 200,
                                        textTransform: 'none',
                                        backgroundColor: '#069cb1',
                                        color: '#fff',
                                        borderRadius: '2rem',
                                        '&:hover': {
                                            backgroundColor: '#06adc3',
                                        }
                                    }}>
                                    <Typography>
                                        Agregar horario
                                    </Typography>
                                </Button>
                                <Button
                                    onClick={() => {
                                        setIsOpen(false);
                                    }}
                                    sx={{
                                        textTransform: 'none',
                                    }}>
                                    <Typography sx={{ color: '#06adc3', textDecoration: 'underline' }}>
                                        Cancelar
                                    </Typography>
                                </Button>
                            </MContainer>
                        </Grid>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    )
}
