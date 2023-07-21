import { Close } from "@mui/icons-material";
import { Avatar, Box, Dialog, DialogContent, Divider, IconButton, Slide, Typography } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { Cazatalentos, Media, RedesSocialesPorCazatalentos } from "@prisma/client";
import { motion } from "framer-motion";
import React, { useMemo } from "react";
import { MContainer } from "~/components/layout/MContainer";
import { api } from "~/utils/api";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
      children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
  ) {
    return <Slide direction="down" ref={ref} {...props} />;
});

export const CazatalentosPreview = (props: {open: boolean, onClose: () => void, id_proyecto?: number, id_cazatalentos?: number, cazatalento?: Cazatalentos & {
    foto_perfil: Media | null;
    redes_sociales: RedesSocialesPorCazatalentos[];
}}) => {
    const cazatalento_por_id = api.cazatalentos.getPerfilById.useQuery(props.id_cazatalentos ? props.id_cazatalentos : 0, {
        refetchOnWindowFocus: false
    });

    const cazatalento_por_proyecto = api.cazatalentos.getByIdProyecto.useQuery(props.id_proyecto ? props.id_proyecto : 0, {
        refetchOnWindowFocus: false
    });

    const cazatalento = useMemo(() => {
        if (props.cazatalento) {
            return props.cazatalento;
        }
        if (cazatalento_por_id.data) {
            return cazatalento_por_id.data;
        }
        if (cazatalento_por_proyecto.data) {
            return cazatalento_por_proyecto.data;
        }
        return null;
    }, [cazatalento_por_id.data, cazatalento_por_proyecto.data, props.cazatalento]);

    return (
        <Dialog  
            maxWidth={'md'} style={{ padding: 0, margin: 0, overflow: 'hidden'}} 
            open={props.open} 
            onClose={props.onClose}
            TransitionComponent={Transition}
        >
            <IconButton
                style={{
                    position: 'absolute',
                    right: 0,
                    color: '#069cb1'
                }}
                aria-label="Cancelar edicion usuario"
                onClick={props.onClose}
            >
                <Close />
            </IconButton>
            <DialogContent style={{padding: 0, width: 400, overflow: 'hidden'}}>
                <MContainer direction='vertical' styles={{padding: 40, alignItems: 'center'}} justify='center'>
                    <Avatar sx={{ width: 156, height: 156 }} alt="Foto productor" src={cazatalento && cazatalento.foto_perfil ? cazatalento.foto_perfil.url : '/assets/img/no-image.png'} />
                    <MContainer direction='horizontal'>
                        <motion.img style={{marginRight: 16}}  src="/assets/img/iconos/chair_dir_blue.svg" alt="icono" />
                        <Typography fontSize={'2rem'}>{cazatalento?.nombre} {cazatalento?.apellido}</Typography>
                    </MContainer>
                    <Divider style={{borderColor: '#069cb1', width: '70%', borderWidth: '1px'}}/>
                    <Typography style={{color: '#069cb1', marginTop: 16}}>
                        {cazatalento?.posicion}
                    </Typography>
                    <Typography variant='body2' paddingLeft={2} paddingRight={2}>
                        {cazatalento?.biografia}
                    </Typography>
                    <Box my={3} display={'flex'} flexDirection={'row'} justifyContent={'space-between'} width={'80%'}>
                        {cazatalento && cazatalento.redes_sociales && cazatalento.redes_sociales.map(red => {
                            switch (red.nombre) {
                                case 'vimeo': return <motion.img width={24} height={24} src="/assets/img/iconos/icon_vimeo_blue.svg" alt="icono" />;
                                case 'linkedin': return <motion.img width={24} height={24} src="/assets/img/iconos/icon_linkedin_blue.svg" alt="icono" />;
                                case 'youtube': return <motion.img width={24} height={24} src="/assets/img/iconos/icon_youtube_blue.svg" alt="icono" />;
                                case 'imdb': return <motion.img width={24} height={24} src="/assets/img/iconos/icon_imbd_blue.svg" alt="icono" />;
                                case 'twitter': return <motion.img width={24} height={24} src="/assets/img/iconos/icon_Twitwe_blue.svg" alt="icono" />;
                                case 'instagram': return <motion.img width={24} height={24} src="/assets/img/iconos/icon_insta_blue.svg" alt="icono" />;
                                
                            }
                            return null;
                        })}
                    </Box>
                    {cazatalento && cazatalento.redes_sociales.filter(r => r.nombre === 'pagina_web').length > 0 &&
                        cazatalento.redes_sociales.filter(r => r.nombre === 'pagina_web').map((r, i) => {
                            return <MContainer key={i} direction='horizontal' justify='start' styles={{width: '80%', alignItems: 'end'}}>
                                <motion.img width={24} height={24} src="/assets/img/iconos/icono_web_site_blue.svg" alt="icono" />
                                <Typography ml={2}>{r.url}</Typography>
                            </MContainer>
                        })
                    }
                </MContainer>
            </DialogContent>
        </Dialog>
    )
}