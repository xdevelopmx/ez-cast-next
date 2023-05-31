import { Box, Button, Dialog, DialogContent, DialogTitle, Divider, Grid, Typography } from '@mui/material'
import React, { type Dispatch, type SetStateAction, type FC, useState, useMemo } from 'react'
import Image from 'next/image'
import { FormGroup, MRadioGroup, MSelect } from '~/components/shared';
import { DesktopTimePicker, MobileTimePicker, StaticTimePicker, TimeField, TimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import useNotify from '~/hooks/useNotify';
import { formatDate } from '~/utils/dates';
import { MContainer } from '~/components/layout/MContainer';
import { LocalizacionesPorHorarioAgenda, Roles } from '@prisma/client';
import { Add, AddCircle } from '@mui/icons-material';
import { api } from '~/utils/api';

interface Props {
    locaciones: LocalizacionesPorHorarioAgenda[];
    roles: Roles[];
    isOpen: boolean;
    date: string;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export const ModalBloquesTiempos: FC<Props> = ({ isOpen, setIsOpen, date, roles, locaciones }) => {

    const {notify} = useNotify();

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

    const intervalos = useMemo(() => {
        let intervalos = 0;
        if (minutos_por_talento > 0) {
            const inicio = inicio_casting.split(':');
            const fin = fin_casting.split(':');
            const i_descanso = inicio_descanso.split(':');
            const f_descanso = fin_descanso.split(':');
            const hora_inicio = inicio[0];
            const minutos_inicio = inicio[1];
            const hora_fin = fin[0];
            const minutos_fin = fin[1];
            const hora_descanso_inicio = i_descanso[0];
            const minutos_descanso_inicio = i_descanso[1];
            const hora_descanso_fin = f_descanso[0];
            const minutos_descanso_fin = f_descanso[1];
            let diff = 0;
            if (hora_fin && minutos_fin && hora_inicio && minutos_inicio && hora_descanso_inicio && minutos_descanso_inicio && hora_descanso_fin && minutos_descanso_fin) {
                const hora_inicio_con_minutos = (parseInt(hora_inicio) * 60) + parseFloat(minutos_inicio);
                const hora_fin_con_minutos = (parseInt(hora_fin) * 60) + parseFloat(minutos_fin);
                if (usar_descanso === 'Si') {
                    const hora_incio_descanso_con_minutos = (parseInt(hora_descanso_inicio) * 60) + parseFloat(minutos_descanso_inicio);
                    const hora_fin_descanso_con_minutos = (parseInt(hora_descanso_fin) * 60) + parseFloat(minutos_descanso_fin); 
                    if (hora_fin_descanso_con_minutos < hora_incio_descanso_con_minutos) {
                        notify('warning', 'El fin del descanso no puede ser menor a la hora de inicio');
                        return 0;
                    }
                    const diff_primera_mitad = hora_incio_descanso_con_minutos - hora_inicio_con_minutos;
                    const diff_segunda_mitad = hora_fin_con_minutos - hora_fin_descanso_con_minutos;
                    diff = diff_primera_mitad + diff_segunda_mitad;
                    
                } else {
                    diff = hora_fin_con_minutos - hora_inicio_con_minutos;
                }
                if (diff >= minutos_por_talento) {
                    return Math.floor(diff / minutos_por_talento);
                }
            }
        }
        return intervalos;
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
                        <Grid xs={12}>
                            <MContainer direction='vertical' justify='center' styles={{textAlign: 'center', alignContent: 'center', marginTop: 16}}>

                                <Button
                                    onClick={() => {
                                        

                                        
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
