import { Block, CancelOutlined, Check, CheckCircle, CheckCircleOutline, CheckOutlined, Circle, LockOpen, LockPerson, Report, Star } from "@mui/icons-material"
import { Alert, AlertTitle, Box, Button, Card, CardActions, CardContent, CardMedia, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, Tab, Tabs, TextField, Typography } from "@mui/material"
import { ReporteTalentos } from "@prisma/client"
import Image from "next/image"
import { useEffect, useMemo, useState } from "react"
import { MContainer } from "~/components/layout/MContainer"
import MotionDiv from "~/components/layout/MotionDiv"
import { DetallesProyecto } from "~/components/proyecto/detalles"
import { FormGroup, MRadioGroup, MSelect, SectionTitle } from "~/components/shared"
import ConfirmationDialog from "~/components/shared/ConfirmationDialog"
import { MSearchInput } from "~/components/shared/MSearchInput"
import { MTable } from "~/components/shared/MTable/MTable"
import { ReportesDialog } from "~/components/talento/dialogs/ReportesDialog"
import Constants from "~/constants"
import useNotify from "~/hooks/useNotify"
import DashBoardTalentosPage from "~/pages/talento/dashboard"
import { Archivo } from "~/server/api/root"
import { api, parseErrorBody } from "~/utils/api"
import { FileManager } from "~/utils/file-manager"

export const CatalogoTalentos = () => {
	const { notify } = useNotify();
    
    const [dialog, setDialog] = useState<{open: boolean, id_talento: number}>({open: false, id_talento: 0});

    const [reportes_dialog, setReportesDialog] = useState<{open: boolean, id_talento: number}>({open: false, id_talento: 0});


    const [confirmation_dialog, setConfirmationDialog] = useState<{ opened: boolean, title: string, content: JSX.Element, action: 'BLOQUEAR', data: Map<string, unknown> }>({ opened: false, title: '', content: <></>, action: 'BLOQUEAR', data: new Map });

    const [data, setData] = useState<any[]>([]);

    const [estatus, setEstatus] = useState<'' | 'destacados' | 'reportados'>('');

    const [search_text, setSearchText] = useState('');

    const getQueryParams = () => {
        switch (estatus) {
            case 'destacados': return {
                where: { es_destacado: true },
                include: { reportes: true },
                order_by: null
            }
            case 'reportados': return {
                where: {reportes: { some: {} }},
                include: { reportes: true },
                order_by: null
            }
            default: return {
                where: null,
                include: { reportes: true },
                order_by: [ {es_destacado: 'desc'}, {id: 'asc'} ]
            } 
        }
    }

    const talentos = api.talentos.getAll.useQuery(getQueryParams(), {
		refetchOnWindowFocus: false,
        keepPreviousData: true
	});


    console.log(talentos.data);

    useEffect(() => {
        if (talentos.data) {
            setData(talentos.data);
        }
    }, [talentos.data]);

    const update_destacado = api.talentos.updateDestacado.useMutation({
        onSuccess: (data) => {
			setData(prev => { return prev.map(p => {
                if (p.id === data.id) {
                    p.es_destacado = data.es_destacado;
                }
                return p;
            })})
            notify('success', 'Se actualizo el talento con exito');
		},
		onError: (error) => {
			notify('error', parseErrorBody(error.message));
		}
    })

    const update_esta_activo = api.talentos.updateEstaActivo.useMutation({
        onSuccess: (data) => {
			setData(prev => { return prev.map(p => {
                if (p.id === data.id) {
                    p.activo = data.activo;
                }
                return p;
            })})
            notify('success', 'Se actualizo el talento con exito');
		},
		onError: (error) => {
			notify('error', parseErrorBody(error.message));
		}
    })
	

    const table_data = useMemo(() => {
        if (!data) {
            return [];
        }
        if (search_text.length === 0) {
            return data;
        }
        const s_text = search_text.toLowerCase();
        return data.filter( t => {
            const activo = (t.activo ) ? 'activo' : 'bloqueado';
            return t.id.toString().includes(s_text) || t.email.toLowerCase().includes(s_text) || t.usuario.toLowerCase().includes(s_text) || t.nombre.toLowerCase().includes(s_text) || t.apellido.toLowerCase().includes(s_text) || t.tipo_membresia.toLowerCase().includes(s_text) || activo.includes(s_text)
        })
    }, [search_text, data]);

	return (
		<Box>
			<SectionTitle titleSx={{marginTop: 2, marginBottom: 4}}
				title='Catalogo de Talentos en EZCast'
			/>
            <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'}>
                <Tabs sx={{ my: 2 }} value={estatus} onChange={(e, tab) => {setEstatus(tab)}} aria-label="basic tabs example">
                    <Tab label="Todos" value={''}/>
                    <Tab label="Destacados" value={'destacados'}/>
                    <Tab label="Reportados" value={'reportados'}/>
                </Tabs>
                <MSearchInput placeholder="Buscar talentos" onChange={(value) => { setSearchText(value) }}/>
            </Box>
			<MTable
                columnsHeader={[
                    <Typography key={1} sx={{ color: '#fff' }} fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                        ID
                    </Typography>,
                    <Typography key={2} sx={{ color: '#fff' }} fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                        Usuario
                    </Typography>,
                    <Typography key={3} sx={{ color: '#fff' }} fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                        Email
                    </Typography>,
                    <Typography key={4} sx={{ color: '#fff' }} fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                        Nombre
                    </Typography>,
                    <Typography key={5} sx={{ color: '#fff' }} fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                        Tipo membresia
                    </Typography>,
                    <Typography key={6} sx={{ color: '#fff' }} fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                        Activo
                    </Typography>,
                    <Typography key={7} sx={{ color: '#fff' }} fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                        Acciones
                    </Typography>,
                ]}
                backgroundColorHeader='#069cb1'
                styleHeaderTableCell={{ padding: '5px !important' }}
                loading={talentos.isFetching}
                data={table_data.map(p => {
                    const reportes: ReporteTalentos[] | null = p.reportes as unknown as ReporteTalentos[];
                    return {
                        id: p.id,
                        usuario: <Typography variant="subtitle2">{p.usuario}</Typography>, 
                        estado: <Typography variant="subtitle2">{p.email}</Typography>,
                        nombre: <Typography variant="subtitle2">{p.nombre} {p.apellido}</Typography>, 
                        tipo_membresia: <Typography variant="subtitle2">{p.tipo_membresia}</Typography>, 
                        activo: <Typography variant="subtitle2">{(p.activo) ? 'Activo' : 'Bloqueado'}</Typography>,
                        acciones: <MContainer direction="horizontal" justify='center'>
                            <>
                                <IconButton
                                    style={{ color: (p.es_destacado) ? '#f9b233' : 'gray' }}
                                    aria-label="marcar como destacado"
                                    onClick={() => {
                                        update_destacado.mutate({id_talento: p.id, destacado: !p.es_destacado});
                                    }}
                                >
                                    <Star />
                                </IconButton>
                                {reportes && reportes.length > 0 &&
                                    <IconButton
                                        style={{ color: 'tomato' }}
                                        aria-label="Reporte Usuario"
                                        onClick={() => {
                                            setReportesDialog({id_talento: p.id, open: true});
                                        }}
                                    >
                                        <Report />
                                    </IconButton>                                
                                }
                                <IconButton
                                    aria-label={`${p.activo ? 'Bloquear' : 'Desbloquear'} talento`}
                                    onClick={() => {
                                        const params = new Map<string, unknown>();
                                        params.set('id', p.id);
                                        params.set('activo', !p.activo);
                                        setConfirmationDialog({ 
                                            action: 'BLOQUEAR', 
                                            data: params, 
                                            opened: true, 
                                            title: `${(p.activo) ? 'Bloquear' : 'Desbloquear'} Talento`, 
                                            content: <Box>
                                                <Typography variant="body2">Seguro que deseas {(p.activo) ? 'bloquear' : 'desbloquear'} este talento?</Typography>
                                            </Box>
                                        })
                                    }}
                                >
                                    {(p.activo) ? <LockOpen/> : <LockPerson/>}
                                </IconButton> 
                                <IconButton 
                                    onClick={(e) => {
                                        setDialog({open: true, id_talento: p.id});
                                        e.stopPropagation();
                                    }} 
                                    color="primary" 
                                    aria-label="consultar" 
                                    component="label"
                                >
                                    <Image src={'/assets/img/iconos/search_blue.png'} width={16} height={16} alt="archivar"/>
                                </IconButton>
                            </>
                        </MContainer>
                    }
                })}
                noDataContent={
                    (table_data.length > 0) ? undefined :
                    (talentos.isFetching) ? undefined :
                    <div className="box_message_blue">
                        <p className="h3">
                            {   
                                (() => {
                                    if (search_text.length > 0) {
                                        return 'No se encontro ningun talento.';
                                    }
                                    if (estatus === 'destacados') {
                                        return 'No hay ningun talento destacado.'
                                    }
                                    if (estatus === 'reportados') {
                                        return 'No hay ningun talento reportado.'
                                    }
                                    return 'No se ha registrado ningun talento aun.';
                                })()
                            }
                        </p>
                    </div>
                }
            />
            <ReportesDialog 
                readonly={false}
                id_talento={reportes_dialog.id_talento} 
                opened={reportes_dialog.open}
                onClose={(changed: boolean) => { setReportesDialog(prev => { return { ...prev, open: false } }) }} 
            />
            <ConfirmationDialog
                opened={confirmation_dialog.opened}
                onOptionSelected={(confirmed: boolean) => {
                    if (confirmed) {
                        switch (confirmation_dialog.action) {
                            case 'BLOQUEAR': {
                                const id = confirmation_dialog.data.get('id');
                                const activo = confirmation_dialog.data.get('activo');
                                if (id) {
                                    update_esta_activo.mutate({
                                        id_talento: id as number,
                                        activo: activo as boolean
                                    })
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
            <Dialog
                style={{
                    marginTop: 56
                }}
                fullWidth={true}
                maxWidth={'xl'}
                open={dialog.open}
                onClose={() => { setDialog({...dialog, open: false}) }}
            >
                <DialogContent>
                    <DashBoardTalentosPage id_talento={dialog.id_talento} id_rol={0} scroll_section={""} can_edit={false} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setDialog({...dialog, open: false}) }}>Cerrar</Button>
                </DialogActions>
            </Dialog>
		</Box>
	)
}
