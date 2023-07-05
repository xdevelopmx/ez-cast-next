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
    id_talento: number
}

export const TalentoAplicacionesRepresentante: FC<Props> = ({ id_talento }) => {

    const { notify } = useNotify();

    const router = useRouter();

    const talento = api.talentos.getById.useQuery({id: id_talento}, {
        refetchOnWindowFocus: false
    });
	
    return (
        <>
            <Box maxWidth={360}>
                <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'} mt={2}>
                    <Box p={2} width={300} display={'flex'} sx={{backgroundColor: '#069cb1'}} flexDirection={'row'}>
                        <Typography color="white" mr={2}>Talento: </Typography>
                        <Typography color="white">{talento.data?.nombre} {talento.data?.apellido}</Typography>
                    </Box>
                    <Box mt={1} ml={2}>
                        <Avatar src={talento.data?.media.filter(m => m.media.identificador.includes('foto-perfil'))[0]?.media.url}/>
                    </Box>
                    
                </Box>
                <Divider/>
            </Box>
        </>
    )
}
