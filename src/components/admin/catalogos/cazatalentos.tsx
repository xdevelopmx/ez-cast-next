import { Block, CancelOutlined, Check, CheckCircle, CheckCircleOutline, CheckOutlined, Circle, LockOpen, LockPerson, Report, Star } from "@mui/icons-material"
import { Alert, AlertTitle, Box, Button, Card, CardActions, CardContent, CardMedia, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, Tab, Tabs, TextField, Typography } from "@mui/material"
import { ReporteTalentos } from "@prisma/client"
import Image from "next/image"
import { useEffect, useMemo, useState } from "react"
import { CazatalentosPreview } from "~/components/cazatalento/dialogs/cazatalentos-preview"
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

export const CatalogoCazatalentos = () => {
	const { notify } = useNotify();
    
    const [dialog, setDialog] = useState<{open: boolean, id_cazatalentos: number}>({open: false, id_cazatalentos: 0});

    const [confirmation_dialog, setConfirmationDialog] = useState<{ opened: boolean, title: string, content: JSX.Element, action: 'BLOQUEAR', data: Map<string, unknown> }>({ opened: false, title: '', content: <></>, action: 'BLOQUEAR', data: new Map });

    const [data, setData] = useState<any[]>([]);

    const [search_text, setSearchText] = useState('');

    const cazatalentos = api.cazatalentos.getAll.useQuery(undefined, {
		refetchOnWindowFocus: false,
        keepPreviousData: true
	});

    useEffect(() => {
        if (cazatalentos.data) {
            setData(cazatalentos.data);
        }
    }, [cazatalentos.data])
    
    const update_esta_activo = api.cazatalentos.updateEstaActivo.useMutation({
        onSuccess: (data) => {
			setData(prev => { return prev.map(p => {
                if (p.id === data.id) {
                    p.activo = data.activo;
                }
                return p;
            })})
            notify('success', 'Se actualizo el cazatalentos con exito');
		},
		onError: (error) => {
			notify('error', parseErrorBody(error.message));
		}
    })
	
    const table_data = useMemo(() => {
        if (!cazatalentos.data) {
            return [];
        }
        if (search_text.length === 0) {
            return cazatalentos.data;
        }
        const s_text = search_text.toLowerCase();
        return cazatalentos.data.filter( t => {
            const activo = (t.activo) ? 'activo' : 'bloqueado';
            return t.id.toString().includes(s_text) || t.email.toLowerCase().includes(s_text) || t.usuario.toLowerCase().includes(s_text) || t.nombre.toLowerCase().includes(s_text) || t.apellido.toLowerCase().includes(s_text) || t.tipo_membresia.toLowerCase().includes(s_text) || activo.includes(s_text)
        })
    }, [search_text, data]);

	return (
		<Box>
			<SectionTitle titleSx={{marginTop: 2, marginBottom: 4}}
				title='Catalogo de Cazatalentos en EZCast'
			/>
            <Box display={'flex'} flexDirection={'row'} justifyContent={'end'} marginTop={2} marginBottom={2} alignItems={'center'}>
                <MSearchInput placeholder="Buscar cazatalentos" onChange={(value) => { setSearchText(value) }}/>
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
                loading={cazatalentos.isFetching}
                data={table_data.map(p => {
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
                                    aria-label={`${p.activo ? 'Bloquear' : 'Desbloquear'} talento`}
                                    onClick={() => {
                                        const params = new Map<string, unknown>();
                                        params.set('id', p.id);
                                        params.set('activo', !p.activo);
                                        setConfirmationDialog({ 
                                            action: 'BLOQUEAR', 
                                            data: params, 
                                            opened: true, 
                                            title: `${(p.activo) ? 'Bloquear' : 'Desbloquear'} Cazatalentos`, 
                                            content: <Box>
                                                <Typography variant="body2">Seguro que deseas {(p.activo) ? 'bloquear' : 'desbloquear'} este cazatalentos?</Typography>
                                            </Box>
                                        })
                                    }}
                                >
                                    {(p.activo) ? <LockOpen/> : <LockPerson/>}
                                </IconButton> 
                                <IconButton 
                                    onClick={(e) => {
                                        setDialog({open: true, id_cazatalentos: p.id});
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
                    (cazatalentos.isFetching) ? undefined :
                    <div className="box_message_blue">
                        <p className="h3">
                            {   
                                (() => {
                                    if (search_text.length > 0) {
                                        return 'No se encontro ningun cazatalento.';
                                    }
                                    return 'No se ha registrado ningun cazatalento aun.';
                                })()
                            }
                        </p>
                    </div>
                }
            />
            <CazatalentosPreview
                onClose={() => setDialog({ ...dialog, open: false })}
                open={dialog.open}
                id_cazatalentos={dialog.id_cazatalentos}
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
		</Box>
	)
}
