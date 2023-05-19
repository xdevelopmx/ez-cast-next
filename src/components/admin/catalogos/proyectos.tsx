import { Circle, Star } from "@mui/icons-material"
import { Alert, AlertTitle, Box, Button, Card, CardActions, CardContent, CardMedia, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, TextField, Typography } from "@mui/material"
import Image from "next/image"
import { useEffect, useMemo, useState } from "react"
import { MContainer } from "~/components/layout/MContainer"
import MotionDiv from "~/components/layout/MotionDiv"
import { DetallesProyecto } from "~/components/proyecto/detalles"
import { FormGroup, MRadioGroup, MSelect, SectionTitle } from "~/components/shared"
import { MTable } from "~/components/shared/MTable/MTable"
import Constants from "~/constants"
import useNotify from "~/hooks/useNotify"
import { Archivo } from "~/server/api/root"
import { api, parseErrorBody } from "~/utils/api"
import { FileManager } from "~/utils/file-manager"

export const CatalogoProyectos = () => {
	const { notify } = useNotify();
    
    const [dialog, setDialog] = useState<{open: boolean, id_proyecto: number}>({open: false, id_proyecto: 0});

    const [data, setData] = useState<any[]>([]);

    const proyectos = api.proyectos.getAll.useQuery(undefined, {
		refetchOnWindowFocus: false,
        keepPreviousData: true
	});

    useEffect(() => {
        if (proyectos.data) {
            setData(proyectos.data);
        }
    }, [proyectos.data]);

    const update_destacado = api.proyectos.updateDestacado.useMutation({
        onSuccess: (data) => {
			setData(prev => { return prev.map(p => {
                if (p.id === data.id) {
                    p.destacado = data.destacado;
                }
                return p;
            })})
            notify('success', 'Se actualizo el proyecto con exito');
		},
		onError: (error) => {
			notify('error', parseErrorBody(error.message));
		}
    })
	
	return (
		<Box>
			<SectionTitle titleSx={{marginTop: 2, marginBottom: 4}}
				title='Catalogo de Proyectos en EZCast'
			/>
			<MTable
                columnsHeader={[
                    <Typography key={1} sx={{ color: '#fff' }} fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                        Nombre
                    </Typography>,
                    <Typography key={3} sx={{ color: '#fff' }} fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                        Estado
                    </Typography>,
                    <Typography key={4} sx={{ color: '#fff' }} fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                        Tipo
                    </Typography>,
                    <Typography key={4} sx={{ color: '#fff' }} fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                        Fecha
                    </Typography>,
                    <Typography key={4} sx={{ color: '#fff' }} fontSize={'1.2rem'} fontWeight={600} component={'p'}>
                        Acciones
                    </Typography>,
                ]}
                backgroundColorHeader='#069cb1'
                styleHeaderTableCell={{ padding: '5px !important' }}
                loading={proyectos.isFetching}
                data={(proyectos.data) ? proyectos.data.map(p => {
                    return {
                        nombre: (() => {
                            let color = 'grey';
                            switch (p.estatus.toUpperCase()) {
                                case Constants.ESTADOS_PROYECTO.ENVIADO_A_APROBACION: color = 'gold'; break;
                                case Constants.ESTADOS_PROYECTO.RECHAZADO: color = 'tomato'; break;
                                case Constants.ESTADOS_PROYECTO.APROBADO: color = 'green'; break;
                            }
                            return (
                                <MContainer direction="horizontal">
                                    <Circle style={{color: color, width: 12, height: 12, marginTop: 6, marginRight: 4}} />
                                    <Typography variant="subtitle2">
                                        {p.nombre}
                                    </Typography>
                                </MContainer>
                            );
                        })(), 
                        estado: (() => {
                            switch (p.estatus.toUpperCase()) {
                                case Constants.ESTADOS_PROYECTO.POR_VALIDAR: return 'Por validar';
                                case Constants.ESTADOS_PROYECTO.ARCHIVADO: return 'Archivado';
                                case Constants.ESTADOS_PROYECTO.ENVIADO_A_APROBACION: return 'Enviado a aprobacion';
                                case Constants.ESTADOS_PROYECTO.RECHAZADO: return 'Rechazado';
                                case Constants.ESTADOS_PROYECTO.APROBADO: return 'Aprobado';
                            }
                            return p.estatus;
                        })(), 
                        tipo: (p.tipo) ? (p.tipo.id_tipo_proyecto === 99) ? p.tipo.descripcion : p.tipo.tipo_proyecto.es : 'ND', 
                        fecha: p.created.toLocaleDateString('es-mx'), 
                        acciones: <MContainer direction="horizontal" justify='center'>
                            <>
                                <IconButton
                                    style={{ color: (p.destacado) ? 'gold' : 'gray' }}
                                    aria-label="marcar como destacado"
                                    onClick={() => {
                                        update_destacado.mutate({id: p.id, destacado: !p.destacado});
                                    }}
                                >
                                    <Star />
                                </IconButton>
                                <IconButton 
                                    onClick={(e) => {
                                        setDialog({open: true, id_proyecto: p.id});
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
                }) : []}
                noDataContent={
                    (proyectos.data && proyectos.data.length > 0) ? undefined :
                    (proyectos.isFetching) ? undefined :
                    <div className="box_message_blue">
                        <p className="h3">No has creado ningún proyecto</p>
                        <p>Al crear un proyecto, aquí tendrás una vista general de tus proyectos activos e inactivos.<br />
                            Recuerda crear todos tus roles y leer los requisitos de aprobación antes de terminar y
                            mandarlos.<br />
                            ¡Comienza ahora mismo!</p>
                    </div>
                }
            />
            <Dialog
                style={{
                    marginTop: 56
                }}
                fullWidth={true}
                maxWidth={'md'}
                open={dialog.open}
                onClose={() => { setDialog({...dialog, open: false}) }}
            >
                <DialogContent>
                    <DetallesProyecto id_proyecto={dialog.id_proyecto}/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setDialog({...dialog, open: false}) }}>Cerrar</Button>
                </DialogActions>
            </Dialog>
		</Box>
	)
}
