import { Box, Typography } from '@mui/material'
import React, { type CSSProperties } from 'react'
import Image from 'next/image'

const estilos_ellipsis: CSSProperties = {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
}

const estilos_mensaje_propio: CSSProperties = {
    backgroundColor: '#069cb1',
    color: '#fff'
}

const estilos_mensaje_no_propio: CSSProperties = {
    backgroundColor: '#fff',
    color: '#000'
}

type Props = {
    esMensajePropio: boolean;
    nombre: string;
    mensaje: string;
    imagen: string;
}

export const Message = ({ imagen, mensaje, esMensajePropio, nombre }: Props) => {
    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'flex-start',
            margin: '25px 0px',
            flexDirection: esMensajePropio ? 'row-reverse' : 'row'
        }}>
            <Box sx={{
                position: 'relative',
                width: '60px',
                aspectRatio: '1/1',
                marginRight: esMensajePropio ? '0px' : '20px',
                marginLeft: esMensajePropio ? '20px' : '0px',
            }}>
                <Image src={imagen} style={{
                    borderRadius: '100%'
                }} fill alt="" />
            </Box>

            <Box sx={{
                width: 'calc( 100% - 80px )',
                minWidth: '50%',
                padding: '10px 20px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
                borderRadius: '10px',
                ...esMensajePropio ? estilos_mensaje_propio : estilos_mensaje_no_propio
            }}>
                <Typography sx={{
                    color: esMensajePropio ? '#fff' : '#069cb1',
                    //fontWeight: 600,
                    ...estilos_ellipsis
                }}>
                    {nombre}
                </Typography>
                <Typography>
                    {mensaje}
                </Typography>
            </Box>
        </Box>
    )
}
