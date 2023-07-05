import { Box, Button, Divider, Grid, IconButton, Typography } from '@mui/material'
import React, { type SetStateAction, type FC, type Dispatch } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import Constants from '~/constants';
import { type TalentoInfo, type Aplicacion } from '../interfaces'
import { convertirMediaObjAString } from '~/utils/fotos'
import { AplicacionRolPorTalento, Media, MediaPorTalentos, Talentos } from '@prisma/client'
import { api } from '~/utils/api'

type Props = {
    talento: Talentos & { media: (MediaPorTalentos & { media: Media; })[]; aplicaciones: AplicacionRolPorTalento[]; },
    setShowModal: Dispatch<SetStateAction<boolean>>,
    onRemoveTalento: (id_talento: number) => void
}

export const TalentoPreviewLong: FC<Props> = ({ setShowModal, talento, onRemoveTalento }) => {
    const router = useRouter()

    const redirect = async () => {
        await router.push(`/talento/billboard?id_talento=${talento.id}`)
    }

    const irPerfilTalento = async () => {
        await router.push(`/talento/dashboard?id_talento=${talento.id}`)
    }

    return (
        <Grid container item xs={12} mt={4}>
            <Grid xs={3}>
                <Box
                    sx={{ position: 'relative', width: '100%', aspectRatio: '1/1', cursor: 'pointer' }}
                    onClick={() => setShowModal(true)}
                >
                    <Image
                        src={convertirMediaObjAString(talento.media)}
                        fill alt=""
                        style={{ objectFit: 'cover', borderRadius: '100%' }}
                    />
                </Box>
            </Grid>
            <Grid xs={1}></Grid>
            <Grid xs={8}>
                <Grid xs={12}>
                
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <IconButton 
                            onClick={(e) => { onRemoveTalento(talento.id) }}
                        >
                            <Image src={'/assets/img/iconos/trash_blue.png'} width={16} height={16} alt="remover talento" />
                        </IconButton>
                        <IconButton 
                            onClick={(e) => { }}
                        >
                            <Image src={`/assets/img/iconos/kebab-menu-k.svg`} width={16} height={16} alt=""/>
                        </IconButton>
                    </Box>
                    
                </Grid>
                <Grid xs={12}>
                    <Typography fontWeight={600} sx={{}}>
                        {`${talento.nombre ?? ''}${`${talento.apellido ? ` ${talento.apellido}` : ''}`}`}
                    </Typography>
                </Grid>
                <Grid container xs={12} mt={2}>
                    <Grid xs={4}>
                        {/* eslint-disable-next-line @typescript-eslint/no-misused-promises*/}
                        <Button sx={{ textTransform: 'none' }} onClick={irPerfilTalento}>
                            <Typography fontWeight={600} sx={{ color: '#069cb1' }}>Ir a Perfil</Typography>
                        </Button>
                    </Grid>
                    <Grid xs={8}>
                        <Button
                            sx={{ textTransform: 'none' }}
                            // eslint-disable-next-line @typescript-eslint/no-misused-promises
                            onClick={redirect}>
                            <Typography fontWeight={600} sx={{ color: '#069cb1' }}>Ir a Casting Billboard</Typography>
                        </Button>
                    </Grid>
                </Grid>
                <Grid container xs={12} gap={2} mt={9}>
                    <Grid xs={3}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
                            <Image src="/assets/img/iconos/download.svg" width={20} height={20} alt="" />
                            <Typography>Aplicaciones</Typography>
                            <Typography fontWeight={600}>{talento.aplicaciones.length}</Typography>
                        </Box>
                    </Grid>

                    <Grid xs={3}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
                            <Image src="/assets/img/iconos/icono_lampara_blue.svg" width={20} height={20} alt="" />
                            <Typography>Audiciones</Typography>
                            <Typography fontWeight={600}>
                                {talento.aplicaciones.filter(a => a.id_estado_aplicacion === Constants.ESTADOS_APLICACION_ROL.AUDICION).length}
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid xs={3}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
                            <Image src="/assets/img/iconos/icono_claqueta_blue.svg" width={20} height={20} alt="" />
                            <Typography>Callbacks</Typography>
                            <Typography fontWeight={600}>
                                {talento.aplicaciones.filter(a => a.id_estado_aplicacion === Constants.ESTADOS_APLICACION_ROL.CALLBACK).length}
                            </Typography>
                        </Box>
                    </Grid>

                </Grid>
            </Grid>
            <Grid xs={12} mt={4}>
                <Divider />
            </Grid>
        </Grid>
    )
}
