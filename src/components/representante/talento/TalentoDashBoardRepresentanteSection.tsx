import { Close, MessageOutlined } from '@mui/icons-material';
import { Avatar, Box, Button, Checkbox, Dialog, DialogContent, DialogContentText, DialogTitle, Divider, FormControlLabel, Grid, Typography } from '@mui/material'
import { type FC, useReducer, useState, useEffect, useRef } from 'react';
import { MContainer } from '~/components/layout/MContainer'
import MotionDiv from '~/components/layout/MotionDiv';
import { FormGroup, MCheckboxGroup, MRadioGroup, SectionTitle } from '~/components/shared'
import { MTooltip } from '~/components/shared/MTooltip'
import { type RolCompensacionForm } from '~/pages/cazatalentos/roles/agregar-rol';
import { api, parseErrorBody } from '~/utils/api';
import Image from 'next/image';
import useNotify from '~/hooks/useNotify';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { conversorFecha } from '~/utils/conversor-fecha';
import {DatePicker, DesktopDatePicker, esES, jaJP } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { PermisosRepresentanteView } from '../forms/PermisosRepresentante';

interface Props {
    id_talento: number,
	id_representante: number
}

export const TalentoDashBoardRepresentanteSection: FC<Props> = ({ id_talento, id_representante }) => {

    const [dialog, setDialog] = useState<{open: boolean, title: string, id: 'agregar_nota_talento' | 'reportar_talento' | 'permisos' }>({ open: false, title: '', id: 'permisos' });
	
    const { notify } = useNotify();

    const router = useRouter();

    const representante = api.representantes.getInfo.useQuery(id_representante, {
        refetchOnWindowFocus: false
    });
	
    return (
        <>
            <Box>
                <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'} mt={2}>
                    <Box display={'flex'} flexDirection={'row'}>
                        <Typography>Representado por: </Typography>
                        <Avatar src={representante.data?.foto_perfil?.url}/>
                        <Typography>{representante.data?.nombre} {representante.data?.apellido}</Typography>
                    </Box>
                    <Box>
                        <Box display={'flex'} flexDirection={'row'}>
                            <Image 
                                src={`/assets/img/iconos/icon_vistos.svg`} 
                                width={30} 
                                height={20} 
                                alt="Vistos" 
                            />
                            <Typography>Ver como Cazatalento</Typography>
                        </Box>
                        <Button onClick={() => {
                            navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_APP_URL}/talento/dashboard?id_talento=${id_talento}`);
                            notify('success', 'Se copio el link');
                        }}>
                            Copiar link de perfil para compartir
                        </Button>
                    </Box>	
                </Box>
                <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'} mt={4}>
                    <Button 
                        onClick={() => {
                            router.push(`/talento/aplicaciones?id_talento=${id_talento}`)
                        }}
                        startIcon={
                            <Image 
                                src={`/assets/img/iconos/documento.svg`} 
                                width={30} 
                                height={20} 
                                alt="" 
                            />
                        }
                    >
                        Ver aplicaciones
                    </Button>
                    <Button 
                         onClick={() => {
                            router.push(`/talento/billboard?id_talento=${id_talento}`)
                        }}
                        startIcon={
                            <Image 
                                src={`/assets/img/iconos/documento.svg`} 
                                width={30} 
                                height={20} 
                                alt="" 
                            />
                        }
                    >
                        Ver billboard de talento
                    </Button>
                    <Button 
                        onClick={() => {
                            setDialog({...dialog, id: 'permisos', open: true})
                        }}
                        startIcon={
                            <Image 
                                src={`/assets/img/iconos/documento.svg`} 
                                width={30} 
                                height={20} 
                                alt="" 
                            />
                        }
                    >
                        Permisos
                    </Button>
                </Box>
                <Divider/>
            </Box>
			<Dialog maxWidth={'xs'} style={{ padding: 0, margin: 0 }} open={dialog.id === 'permisos'  && dialog.open} onClose={() => setDialog({ ...dialog, open: false })}>
				<DialogTitle align="center" style={{color: '#069cb1'}}>{dialog.title}</DialogTitle>
				<DialogContent style={{padding: 16}}>
                    <PermisosRepresentanteView
                        state={{
                            puede_aceptar_solicitudes: {
                                talentos: Boolean(representante.data?.permisos?.puede_aceptar_solicitudes_talento),
                                representante: Boolean(representante.data?.permisos?.puede_aceptar_solicitudes_representante)
                            },
                            puede_editar_perfil: {
                                talentos: Boolean(representante.data?.permisos?.puede_editar_perfil_talento),
                                representante: Boolean(representante.data?.permisos?.puede_editar_perfil_representante)
                            }
                        }}
                        readonly
                        representante_fetching={false}
                        onFormChange={(input) => {}}
                    />
					
					
				</DialogContent>
				<Box style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
					<Button style={{marginLeft: 8, marginRight: 8}} startIcon={<Close />} onClick={() => setDialog({ ...dialog, open: false })}>Cerrar</Button>
				</Box>
			</Dialog>
        </>
    )
}
