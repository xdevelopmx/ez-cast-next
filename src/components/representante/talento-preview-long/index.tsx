import { Box, Button, Divider, Grid, Typography } from '@mui/material'
import React, { type SetStateAction, type FC, type Dispatch } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import type { Talentos, Media } from "@prisma/client";
import { useRouter } from 'next/router'

type MediaObj = {
    media: Media;
}

interface Props {
    talento: Omit<Talentos & {
        media: MediaObj[];
        aplicaciones: {
            id: number;
        }[];
        audiciones: {
            id: number;
        }[];
    }, "contrasenia" | "tipo_membresia" | "cobro_membresia">;
    setShowModal: Dispatch<SetStateAction<boolean>>;
}

export const TalentoPreviewLong: FC<Props> = ({ setShowModal, talento }) => {
    const router = useRouter()

    const redirect = async () => {
        await router.push(`/representante/casting-billboard?talentoId=${talento.id}`)
    }

    const getFoto = (media: MediaObj[]): string => {
        if (media.length < 1) {
            return "/assets/img/no-user-image.png"
        }
        if (!media[0]) {
            return "/assets/img/no-user-image.png"
        }
        return media[0].media.url;
    }

    return (
        <Grid container item xs={12} mt={4}>
            <Grid xs={3}>
                <Box
                    sx={{ position: 'relative', width: '100%', aspectRatio: '1/1', cursor: 'pointer' }}
                    onClick={() => setShowModal(true)}
                >
                    <Image
                        src={getFoto(talento.media)}
                        fill alt=""
                        style={{ objectFit: 'cover', borderRadius: '100%' }}
                    />
                </Box>
            </Grid>
            <Grid xs={1}></Grid>
            <Grid xs={8}>
                <Grid xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <div className="box_alert_header mr-4">
                            <motion.img src="/assets/img/iconos/bell_blue.svg" alt="" />
                            <span className="count_msn active">2</span>
                        </div>
                    </Box>
                </Grid>
                <Grid xs={12}>
                    <Typography fontWeight={600} sx={{}}>
                        {`${talento.nombre ?? ''}${`${talento.apellido ? ` ${talento.apellido}` : ''}`}`}
                    </Typography>
                </Grid>
                <Grid container xs={12} mt={2}>
                    <Grid xs={4}>
                        <Button sx={{ textTransform: 'none' }}>
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
                            <Typography fontWeight={600}>{talento.aplicaciones.length ?? 0}</Typography>
                        </Box>
                    </Grid>

                    <Grid xs={3}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
                            <Image src="/assets/img/iconos/icono_lampara_blue.svg" width={20} height={20} alt="" />
                            <Typography>Audiciones</Typography>
                            <Typography fontWeight={600}>{talento.audiciones.length ?? 0}</Typography>
                        </Box>
                    </Grid>

                    <Grid xs={3}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
                            <Image src="/assets/img/iconos/icono_claqueta_blue.svg" width={20} height={20} alt="" />
                            <Typography>Callbacks</Typography>
                            <Typography fontWeight={600}>1</Typography>
                        </Box>
                    </Grid>

                    <Grid xs={1}>
                        <Image src="/assets/img/iconos/eye_blue.svg" width={20} height={20} alt="" />
                    </Grid>
                </Grid>
            </Grid>
            <Grid xs={12} mt={4}>
                <Divider />
            </Grid>
        </Grid>
    )
}
