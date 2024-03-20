import { Box, Button, Dialog, DialogContent, DialogTitle, Divider, Grid, Typography } from '@mui/material'
import React, { type Dispatch, type SetStateAction, type FC, useState, useMemo, useEffect, useContext } from 'react'
import Image from 'next/image'
import { FormGroup, MRadioGroup, MSelect } from '~/components/shared';
import { DesktopTimePicker, MobileTimePicker, StaticTimePicker, TimeField, TimePicker, esES } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import useNotify from '~/hooks/useNotify';
import { formatDate } from '~/utils/dates';
import { MContainer } from '~/components/layout/MContainer';
import { LocalizacionesPorHorarioAgenda, Roles } from '@prisma/client';
import { Add, AddCircle } from '@mui/icons-material';
import { api, parseErrorBody } from '~/utils/api';
import AppContext from '~/context/app';
import useLang from '~/hooks/useLang';

interface Props {
    locaciones: LocalizacionesPorHorarioAgenda[];
    id_role: number;
    isOpen: boolean;
    date: string;
    id_horario_agenda: number;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    onChange: () => void;
}

export const ModalBloquesTiempos: FC<Props> = ({ isOpen, setIsOpen, date, id_role, locaciones, id_horario_agenda, onChange }) => {

    const {notify} = useNotify();
    const ctx = useContext(AppContext);
    const textos = useLang(ctx.lang);

    const bloque = api.agenda_virtual.getBloqueHorarioByDateAndIdHorario.useQuery({
        id_horario_agenda: id_horario_agenda, fecha: dayjs(date, "DD/MM/YYYY").toDate()
    }, {
        refetchOnWindowFocus: false
    });

    const updateBloqueHorario = api.agenda_virtual.updateBloqueHorario.useMutation({
        onSuccess: (data) => {
            bloque.refetch();
            //notify('success', 'Se actualizo el bloque de horario con exito');
            notify('success', `${textos['se_actualizo_con_exito']}`);
            setIsOpen(false);
        },
        onError: (err) => {
            notify('error', parseErrorBody(err.message));
        },
        onSettled: () => {
            onChange();
        }
    })

    // const [minutos_por_talento, setMinutosPorTalento] = useState(0);

    const [inicio_casting, setInicioCasting] = useState('12:00');

    const [fin_casting, setFinCasting] = useState('13:00');

    const [duracion_descanso, setDuracionDescanso] = useState(0);

    const [count_intervalos, setCountIntervalos] = useState(1);

    const [usar_descanso, setUsarDescanso] = useState('No');

    const [administrar_intervalos, setAdministrarIntervalos] = useState<string>('');

    const [selected_locacion, setSelectedLocacion] = useState('');

    const estados_republica = api.catalogos.getEstadosRepublica.useQuery(undefined, {
        refetchOnWindowFocus: false,
        refetchOnMount: false
    })

    useEffect(() => {
        if (bloque.data && estados_republica.data) {
            //setMinutosPorTalento(bloque.data.minutos_por_talento);
            setInicioCasting(bloque.data.hora_inicio);
            setFinCasting(bloque.data.hora_fin);
            setDuracionDescanso((bloque.data.duracion_descanso) ? bloque.data.duracion_descanso : 0);
            setUsarDescanso(bloque.data.duracion_descanso != null && bloque.data.duracion_descanso > 0 ? `${textos['si']}` : `${textos['no']}`);
            setAdministrarIntervalos(bloque.data.tipo_administracion_intervalo.toLowerCase() === 'automaticamente' ? `${textos['automaticamente']}` : `${textos['manualmente']}`);
            const locacion = locaciones.map(l => `${l.direccion}, ${estados_republica.data.filter(er => er.id === l.id_estado_republica)[0]?.es}`)[0];
            if (locacion) {
                setSelectedLocacion(locacion)
            }
        }
    }, [bloque.data, estados_republica.data, textos]);

    // const intervalos = useMemo(() => {
    //     return calculateIntervalos(inicio_casting, fin_casting, (usar_descanso) ? {inicio_tiempo: inicio_descanso, fin_tiempo: fin_descanso} : undefined);
    // }, [inicio_descanso, fin_descanso, inicio_casting, fin_casting]);

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
                                {textos['crear']} {textos['bloque_de_tiempo']}
                            </Typography>
                            <Typography>
                                {dayjs(date, 'DD/MM/YYYY').toDate().toLocaleString(ctx.lang === 'es' ? 'es-mx' : 'en-us', {
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
                            {textos['intervalos_tiempo']}
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
                                    label={`${textos['inicia_casting']}`}
                                    onChange={(e) => {
                                        setInicioCasting(e.target.value);
                                    }}
                                />
                                {/* <FormGroup
                                    className={'form-input-md'}
                                    style={{ width: 175 }}
                                    type='number'
                                    labelStyle={{ fontWeight: 600, width: '100%' }}
                                    labelClassName={'form-input-label'}
                                    
                                    value={`${minutos_por_talento.toString()}`}
                                    label={`${textos['tiempo_por_talento']}`}
                                    onChange={(e) => {
                                        setMinutosPorTalento(parseInt(e.target.value));
                                    }}
                                /> */}
                                <FormGroup
                                    className={'form-input-md'}
                                    style={{ width: 150 }}
                                    type='time'
                                    labelStyle={{ fontWeight: 600, width: '100%' }}
                                    labelClassName={'form-input-label'}
                                    value={fin_casting}
                                    label={`${textos['finaliza_casting']}`}
                                    onChange={(e) => {
                                        setFinCasting(e.target.value);
                                    }}
                                />
                            </Box>
                        </Grid>
                        {/* <Grid xs={12}>
                            <Typography fontWeight={600} sx={{ color: '#069cb1' }}>
                                {bloque.data?.intervalos.length} {textos['intervalos']}
                            </Typography>
                        </Grid> */}
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
                                    type='number'
                                    labelStyle={{ fontWeight: 600, width: '100%' }}
                                    labelClassName={'form-input-label'}
                                    value={count_intervalos.toString()}
                                    label={`${textos['intervalos']}`}
                                    onChange={(e) => {
                                        setCountIntervalos(+e.target.value);
                                    }}
                                />
                            </Box>
                        </Grid>
                        <Grid xs={12}>
                            <MRadioGroup
                                label={`${textos['desea_agregar_descanso']}`}
                                labelStyle={{ fontSize: '1.1rem', color: '#000', fontWeight: 600 }}
                                style={{ gap: 0 }}
                                id="quieres-agregar-descanso"
                                options={[`${textos['si']}`, `${textos['no']}`]}
                                value={usar_descanso}
                                direction='horizontal'
                                onChange={(e) => {
                                    setUsarDescanso(e.target.value);
                                }}
                            />
                        </Grid>
                        <Grid xs={12}>
                            {usar_descanso === `${textos['si']}` &&
                            
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    flexWrap: 'wrap'
                                }}>
                                    <FormGroup
                                        className={'form-input-md'}
                                        style={{ width: 150 }}
                                        type='number'
                                        labelStyle={{ fontWeight: 600, width: '100%' }}
                                        labelClassName={'form-input-label'}
                                        value={duracion_descanso.toString()}
                                        label={`${textos['duracion']}`}
                                        onChange={(e) => {
                                            setDuracionDescanso(+e.target.value);
                                        }}
                                    />
                                    {/* <FormGroup
                                        className={'form-input-md'}
                                        style={{ width: 150 }}
                                        type='time'
                                        labelStyle={{ fontWeight: 600, width: '100%' }}
                                        labelClassName={'form-input-label'}
                                        value={fin_descanso}
                                        label={`${textos['hora_fin']}`}
                                        onChange={(e) => {
                                            setFinDescanso(e.target.value);
                                        }}
                                    />
                                    <Box sx={{ width: 150 }}>

                                    </Box> */}
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
                                {textos['administrar_bloques']}
                            </Typography>
                        </Grid>
                        <Grid xs={12}>
                            <MRadioGroup
                                label={`${textos['como_manejar_intervalos']}`}
                                labelStyle={{ fontSize: '1.1rem', color: '#000', fontWeight: 600 }}
                                style={{ gap: 0 }}
                                id="como-adminisitrar-intervalos"
                                options={[`${textos['manualmente']}`, `${textos['automaticamente']}`]}
                                value={administrar_intervalos}
                                direction='vertical'
                                onChange={(e) => {
                                    setAdministrarIntervalos(e.target.value);
                                }}
                            />
                        </Grid>
                        <Grid xs={12}>
                            <Typography fontWeight={600} sx={{ color: '#069cb1' }}>
                                {textos['locacion']}
                            </Typography>
                        </Grid>
                        <Grid xs={12}>
                            <MRadioGroup
                                label={`${textos['donde_se_llevara_acabo']}`}
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
                                        // if (bloque.data?.intervalos.length === 0) {
                                        //     notify('warning', `${textos['no_se_han_definido_los_intervalos']}`);
                                        //     return;
                                        // }
                                        let loc = 0;
                                        if (estados_republica.data) {
                                            const locacion = locaciones.filter(l => `${l.direccion}, ${estados_republica.data.filter(er => er.id === l.id_estado_republica)[0]?.es}` === selected_locacion)[0];
                                            if (locacion) {
                                                loc = locacion.id;
                                            }
                                        }
                                        if (loc === 0) {
                                            notify('warning', `${textos['no_se_ha_seleccionado_una_locacion']}`);
                                            return;
                                        }
                                        updateBloqueHorario.mutate({
                                            id_bloque: (bloque.data) ? bloque.data.id : 0,
                                            id_horario_agenda: id_horario_agenda,
                                            tipo_administracion_intervalo: administrar_intervalos === `${textos['manualmente']}` ? 'Manualmente' : 'Automaticamente',
                                            fecha: dayjs(date, "DD/MM/YYYY").toDate(),
                                            hora_inicio: inicio_casting,
                                            hora_fin: fin_casting,
                                            duracion_descanso: usar_descanso === `${textos['si']}` ? duracion_descanso : 0,
                                            id_locacion: loc,
                                            intervalos_count: count_intervalos
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
                                        {textos['agregar']} {textos['horario']}
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
                                        {textos['cancelar']}
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
