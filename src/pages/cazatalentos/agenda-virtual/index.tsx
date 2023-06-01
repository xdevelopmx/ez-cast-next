import { Box, Button, Divider, Grid, IconButton, Skeleton, SxProps, TablePagination, Theme, Typography } from "@mui/material";
import Head from "next/head";
import Image from 'next/image';
import Link from "next/link";
import { Alertas, MainLayout, MenuLateral } from "~/components";

import { useMemo, useState } from "react";
import { DateCalendar, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import DualDatePicker from "~/components/shared/DualDatePicker";
import { api, parseErrorBody } from "~/utils/api";
import { AnimatePresence } from "framer-motion";
import MotionDiv from "~/components/layout/MotionDiv";
import { useRouter } from "next/router";
import ConfirmationDialog from "~/components/shared/ConfirmationDialog";
import useNotify from "~/hooks/useNotify";

const estilos_calendario: SxProps<Theme> = {
    '& .MuiPickersCalendarHeader-label': {
        fontWeight: 'bold'
    },
    '& .MuiDayCalendar-weekDayLabel': {
        color: '#069cb1',
        fontWeight: 'bold',
        margin: 0,
        borderBottom: '2px solid #069cb1',
        fontSize: '1rem'
    },
    '& .MuiDayCalendar-header': {

    },
    '& .MuiPickersDay-root': {
        margin: 0,
        fontWeight: 'bold',
        fontSize: '1rem'
    },
    '& .MuiPickersDay-today': {
        borderRadius: 0,
        backgroundColor: '#FCD081',
        color: '#000',
        border: 'none'
    },
    '& .Mui-selected, & .Mui-selected:hover, & .Mui-selected:focus': {
        borderRadius: 0,
        backgroundColor: '#9CF2FD',
        color: '#000',
        border: 'none'
    }
}

const AgendaVirtual = () => {

    const horarios = api.agenda_virtual.getAllHorarioAgendaByCazatalento.useQuery(undefined, {
        refetchOnWindowFocus: false,
    });

    const { notify } = useNotify();

    const deleteHorario = api.agenda_virtual.deleteById.useMutation({
        onSuccess: (data) => {
            notify('success', 'Se elimino con exito');
            horarios.refetch();
        }, 
        onError: (err) => {
            notify('error', parseErrorBody(err.message));
        }
    })

    const [pagination, setPagination] = useState<{ page: number, page_size: number }>({ page: 0, page_size: 5 });
    const [confirmation_dialog, setConfirmationDialog] = useState<{ opened: boolean, title: string, content: JSX.Element, action: 'DELETE', data: Map<string, unknown> }>({ opened: false, title: '', content: <></>, action: 'DELETE', data: new Map });

    const paginated_data = useMemo(() => {
		const start = (pagination.page * pagination.page_size);
		const end = (pagination.page * pagination.page_size) + pagination.page_size;
        const _data = (horarios.data) ? horarios.data : [];
		const sliced_data = _data.slice(start, end);
		if (sliced_data.length === 0 && pagination.page > 0) {
			setPagination(v => { return { ...v, page: v.page - 1 } });
		}
		return sliced_data;
	}, [pagination, horarios.data]);

    const router = useRouter();

    return (
        <>
            <Head>
                <title>Cazatalentos | Talent Corner</title>
                <meta name="description" content="Talent Corner" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <MainLayout menuSiempreBlanco={true}>
                <AnimatePresence>
                    <div className="d-flex wrapper_ezc">
                        <MenuLateral />
                        <div className="seccion_container col" style={{ paddingTop: 0 }}>
                            <br /><br />
                            <div className="container_box_header">
                                <div className="d-flex justify-content-end align-items-start py-2">
                                    <Alertas />
                                </div>
                                <Grid container>
                                    <Grid item xs={12}>
                                        <Grid container item columns={12}>
                                            <Grid item md={1} textAlign={'center'}>
                                                <Image src="/assets/img/iconos/agenda.svg" width={50} height={50} style={{ margin: '15px 0 0 0', filter: 'invert(43%) sepia(92%) saturate(431%) hue-rotate(140deg) brightness(97%) contrast(101%)' }} alt="" />
                                            </Grid>
                                            <Grid item md={11}>
                                                <Typography fontWeight={800} sx={{ color: '#069cb1', fontSize: '2rem' }}>Agenda Virtual</Typography>
                                                <Typography fontWeight={600} sx={{ color: '#000', fontSize: '`.7rem' }}>Horarios</Typography>
                                            </Grid>

                                        </Grid>
                                    </Grid>
                                    <div style={{ textAlign: 'right', width: '100%' }}>
                                        <Link href="/cazatalentos/agenda-virtual/crear" className="btn btn-intro btn-price mb-2 mt-3"><Image src="/assets/img/iconos/mas.svg" width={14} height={14} style={{ filter: 'invert(1)', margin: '0 0 2px 0' }} alt="" />&nbsp;&nbsp;Nuevo horario</Link>
                                    </div>
                                    <Grid item xs={12}>
                                        <Grid container item xs={20} sx={{ backgroundColor: '#fff', padding: '10px 10px' }} columns={18}>
                                            <Grid item md={4} textAlign={'center'}>

                                            </Grid>
                                            <Grid item md={1} textAlign={'center'}>

                                            </Grid>
                                            <Grid item md={3} textAlign={'center'}>

                                            </Grid>
                                            <Grid item md={2} textAlign={'center'}>
                                                Pendientes
                                            </Grid>
                                            <Grid item md={2} textAlign={'center'}>
                                                Confirmados
                                            </Grid>
                                            <Grid item md={2} textAlign={'center'}>
                                                No confirmados
                                            </Grid>
                                            <Grid item md={2} textAlign={'center'}>
                                                Reagendados
                                            </Grid>
                                            <Grid item md={1} textAlign={'center'}>

                                            </Grid>
                                        </Grid>
                                        <Grid container item xs={18} sx={{ backgroundColor: '#069cb1', padding: '16px 10px', margin: '0 0 16px 0' }} columns={18}>
                                            <Grid item md={4} textAlign={'center'}>
                                                <Typography variant="subtitle1" fontWeight={800}>
                                                    Nombre
                                                </Typography>
                                            </Grid>
                                            <Grid item md={1} textAlign={'center'}>
                                                <Typography variant="subtitle1" fontWeight={800}>
                                                    Roles
                                                </Typography>
                                            </Grid>
                                            <Grid item md={3} textAlign={'center'}>
                                                <Typography variant="subtitle1" fontWeight={800}>
                                                    Fecha de creación
                                                </Typography>
                                            </Grid>
                                            <Grid item md={2} textAlign={'center'}>
                                                <Image src="/assets/img/iconos/relojdearena.svg" width={20} height={20} style={{ filter: 'invert(1)' }} alt="" />
                                            </Grid>
                                            <Grid item md={2} textAlign={'center'}>
                                                <Image src="/assets/img/iconos/check-k.svg" width={20} height={20} style={{ filter: 'invert(1)' }} alt="" />
                                            </Grid>
                                            <Grid item md={2} textAlign={'center'}>
                                                <Image src="/assets/img/iconos/tache.svg" width={20} height={20} style={{ filter: 'invert(1)' }} alt="" />
                                            </Grid>
                                            <Grid item md={2} textAlign={'center'}>
                                                <Image src="/assets/img/iconos/reloj.svg" width={20} height={20} style={{ filter: 'invert(1)' }} alt="" />
                                            </Grid>
                                            <Grid item md={2} textAlign={'right'}>

                                            </Grid>
                                        </Grid>
                                        {!horarios.isFetching && paginated_data.length === 0 &&
                                            <Grid container item xs={20} sx={{ backgroundColor: '#069cb185', padding: '5px 10px', margin: '4px 0' }} columns={18} justifyContent={'center'} textAlign={'center'}>
                                                <div className="box_message_blue">
                                                    <p className="h3" style={{ fontWeight: 600 }}>No has creado ningún horario</p>
                                                    <p>Al crear un horario, aquí tendrás una vista general de tus horarios activos.<br />
                                                        .<br />
                                                        ¡Comienza ahora mismo!</p>
                                                </div>
                                            </Grid>
                                        }
                                        {!horarios.isFetching && paginated_data.length > 0 &&
                                            <>
                                                {paginated_data.map((h, i) => {
                                                    return (
                                                        <Grid key={i} container item xs={20} sx={{ backgroundColor: (h.tipo_agenda === 'AUDICION') ? '#069cb185' : '#ea9d2185', padding: '5px 10px', margin: '4px 0' }} columns={18}>
                                                            <Grid item md={4} textAlign={'center'}>
                                                                {h.proyecto.nombre}
                                                            </Grid>
                                                            <Grid item md={1} textAlign={'center'}>
                                                                {h.proyecto.rol.length}
                                                            </Grid>
                                                            <Grid item md={3} textAlign={'center'}>
                                                                {h.fecha_creacion.toLocaleDateString('es-mx')}
                                                            </Grid>
                                                            <Grid item md={2} textAlign={'center'}>
                                                                9
                                                            </Grid>
                                                            <Grid item md={2} textAlign={'center'}>
                                                                1
                                                            </Grid>
                                                            <Grid item md={2} textAlign={'center'}>
                                                                1
                                                            </Grid>
                                                            <Grid item md={2} textAlign={'center'}>
                                                                2
                                                            </Grid>
                                                            <Grid item md={2} textAlign={'right'}>
                                                                <IconButton
                                                                    onClick={(e) => {
                                                                        void router.push(`/cazatalentos/agenda-virtual/crear?id_horario=${h.id}`);
                                                                        e.stopPropagation();
                                                                    }}
                                                                    color="primary"
                                                                    aria-label="editar"
                                                                    component="label"
                                                                >
                                                                    <Image src={'/assets/img/iconos/edit_icon_blue.png'} width={16} height={16} alt="editar" />
                                                                </IconButton>
                                                                <IconButton
                                                                    onClick={(e) => {
                                                                        const params = new Map<string, unknown>();
                                                                        params.set('id', h.id);
                                                                        setConfirmationDialog({ action: 'DELETE', data: params, opened: true, title: 'Eliminar Horario', content: <Typography variant="body2">Seguro que deseas eliminar este horario?</Typography> });
                                                                        e.stopPropagation();
                                                                    }}
                                                                    color="primary"
                                                                    aria-label="eliminar"
                                                                    component="label"
                                                                >
                                                                    <Image src={'/assets/img/iconos/trash_blue.png'} width={16} height={16} alt="archivar" />
                                                                </IconButton>
                                                                <IconButton
                                                                    onClick={(e) => {
                                                                        void router.push(`/cazatalentos/agenda-virtual/horario/${h.id}`);
                                                                        e.stopPropagation();
                                                                    }}
                                                                    color="primary"
                                                                    aria-label="consultar"
                                                                    component="label"
                                                                >
                                                                    <Image src={'/assets/img/iconos/search_blue.png'} width={16} height={16} alt="editar" />
                                                                </IconButton>
                                                            </Grid>
                                                        </Grid>
                                                    )
                                                })}
                                            </>
                                        }
                                        {horarios.isFetching &&
                                            <Grid container item xs={20} sx={{ padding: '5px 10px', margin: '4px 0' }} columns={18}>
                                                {Array.from({ length: 5 }).map((n, i) => {
                                                    return <Grid gap={1} container> 
                                                        {Array.from({ length: 11 }).map((_, j) => {
                                                            return <Grid item xs={1}> <Skeleton key={j} className="my-2 p-3" variant="rectangular" height={32} /></Grid>
                                                        })}   
                                                    </Grid>
                                                })} 
                                            </Grid>
                                        }
                                        <MotionDiv show={horarios.data != null && horarios.data.length > 5} animation={'fade'} style={{ backgroundColor: '#069cb1', width: '100%' }}>
                                            <Grid container item xs={20} sx={{ padding: '5px 10px', margin: '4px 0' }} columns={18}>
                                                <TablePagination
                                                    sx={{ backgroundColor: '#069cb1' }}
                                                    labelRowsPerPage={'Registros por pagina'}
                                                    component="div"
                                                    count={horarios.data != null ? horarios.data.length : 0}
                                                    page={pagination.page}
                                                    rowsPerPageOptions={[1, 3, 5, 10, 15, 20]}
                                                    onPageChange={(e, page) => { setPagination({ ...pagination, page: page }) }}
                                                    rowsPerPage={pagination.page_size}
                                                    onRowsPerPageChange={(e) => { setPagination({ ...pagination, page_size: parseInt(e.target.value) }) }}
                                                />
                                            </Grid>
                                        </MotionDiv>
                                        <Grid container xs={12} columns={12} sx={{ border: '3px solid #069cb1', padding: '30px' }} mt={4}>
                                            <Grid xs={12} sx={{ display: 'flex', justifyContent: 'center', }}>
                                                <DualDatePicker direction="horizontal" sx={estilos_calendario}/>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </div>
                        </div>
                    </div>
                </AnimatePresence>
                <ConfirmationDialog
                    opened={confirmation_dialog.opened}
                    onOptionSelected={(confirmed: boolean) => {
                        if (confirmed) {
                            switch (confirmation_dialog.action) {
                                case 'DELETE': {
                                    const id = confirmation_dialog.data.get('id');
                                    if (id) {
                                        //deleteProyecto.mutate({ id: id as number });
                                        deleteHorario.mutate(id as number);
                                    }
                                    break;
                                }
                            }
                        }
                        setConfirmationDialog({ ...confirmation_dialog, opened: false });
                    }}
                    title={confirmation_dialog.title}
                    content={confirmation_dialog.content}
                />
            </MainLayout>
        </>

    )
}

export default AgendaVirtual