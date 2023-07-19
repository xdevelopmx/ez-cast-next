import { Check, Close } from "@mui/icons-material";
import { Dialog, DialogContent, Typography, ButtonGroup, Button, DialogActions, Grid, Divider, Box, Chip, Stack, Paper, CircularProgress } from "@mui/material"
import { useState, useRef, useEffect, useMemo } from "react";
import MotionDiv from "~/components/layout/MotionDiv"
import { AudioBar, FormGroup, MSelect, RolCompletoPreview } from "~/components/shared";
import { RolPreview } from "~/components/shared/RolPreview";
import { RolPreviewLoader } from "~/components/shared/RolPreviewLoader";
import Constants from "~/constants";
import useNotify from "~/hooks/useNotify";
import { api, parseErrorBody } from "~/utils/api";
import Image from 'next/image';


export const ReportesDialog = (props: { readonly: boolean, id_talento: number, opened: boolean, onClose: (changed: boolean) => void }) => {
	const { notify } = useNotify();

    const talento = api.talentos.getCompleteById.useQuery({id: props.id_talento}, {
        refetchOnWindowFocus: false
    })

    const tipos_reportes = api.catalogos.getTipoReportesTalento.useQuery(undefined, {
        refetchOnWindowFocus: false
    })

	return (
		<Dialog fullWidth maxWidth={'sm'} onClose={() => { props.onClose(false) }} open={props.opened}>
			<DialogContent sx={{ height: 700, overflow: 'auto' }} >
                {talento.isFetching && <CircularProgress sx={{width: 100, height: 64, marginLeft: 'calc(50% - 25px)', marginTop: 'calc(50% - 16px)'}} />}
                {!talento.isFetching &&
                    <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
                    
                        <Box>
                            <Typography  gutterBottom variant="h4" component="div">
                                Reportes hechos a {talento.data?.nombre} {talento.data?.apellido}
                            </Typography>
                        </Box>
                        <Divider/>
                        {talento.data && talento.data.reportes.length > 0 &&
                            talento.data.reportes.map((r, i) => {
                                return <Paper elevation={3} sx={{padding: '16px', my: 2}} key={i}>
                                    <Box sx={{ my: 3, mx: 2 }}>
                                        <Grid container alignItems="center">
                                        <Grid item xs>
                                            <Typography gutterBottom variant="h5" component="div">
                                            Reporte Por {r.cazatlentos.nombre} {r.cazatlentos.apellido}
                                            </Typography>
                                            
                                        </Grid>
                                    
                                        </Grid>
                                        {r.comentario && r.comentario.length > 0 &&
                                            <Typography color="text.secondary" variant="body2">
                                                {r.comentario}
                                            </Typography>
                                        }
                                        {!r.comentario || r.comentario.length === 0 &&
                                            <Typography color="text.secondary" variant="body2">
                                                Sin comentarios
                                            </Typography>
                                        }
                                    </Box>
                                    <Divider variant="middle" />
                                    <Box sx={{ m: 2 }}>
                                        <Typography gutterBottom variant="body1">
                                            Tipo de reporte
                                        </Typography>
                                        <Stack direction="row" spacing={1}>
                                            {tipos_reportes.data && tipos_reportes.data.map((tr, i) => {
                                                if (r.id_tipo_reporte === tr.id) {
                                                    return <Chip color={'primary'} key={i} label={tr.es} />
                                                }
                                                return null; 
                                            })}
                                        </Stack>
                                    </Box>
                                </Paper>    
                            })
                        }
                    </Box>
                }
			</DialogContent>
			<DialogActions sx={{ justifyContent: 'center' }}>
				<Button style={{ textDecoration: 'underline', fontWeight: 800 }} onClick={() => { props.onClose(false) }} variant='text' startIcon={<Close />}>
					Cerrar
				</Button>
			</DialogActions>

		</Dialog>
	)

}
