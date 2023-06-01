import type { CSSProperties, FC } from 'react'
import type { DragSourceMonitor } from 'react-dnd'
import Image from 'next/image';
import { useDrag } from 'react-dnd'
import { Box, Button, Grid, Typography } from '@mui/material'

const style: CSSProperties = {
  border: '1px dashed gray',
  backgroundColor: 'white',
  padding: '0.5rem 1rem',
  marginRight: '1.5rem',
  marginBottom: '1.5rem',
  float: 'left',
}

export interface TalentoReclutadoCardProps {
    id_talento: number,
    profile_url: string,
    nombre: string,
    union: string,
    onDrop: (id_talento: number) => void
}

interface DropResult {
  allowedDropEffect: string
  dropEffect: string
  name: string
}

export const TalentoReclutadoCard: FC<TalentoReclutadoCardProps> = ({ id_talento, onDrop, profile_url, nombre, union}) => {
  const [{ opacity }, drag] = useDrag(
    () => ({
      type: 'ELEMENT',
      item: { id_talento },
      end(item, monitor) {
        const dropResult = monitor.getDropResult() as DropResult
        if (item && dropResult) {
          const isDropAllowed = dropResult.allowedDropEffect === 'any' || dropResult.allowedDropEffect === dropResult.dropEffect;

          if (isDropAllowed) {
            onDrop(id_talento);
          }
        }
      },
      collect: (monitor: DragSourceMonitor) => ({
        opacity: monitor.isDragging() ? 0.4 : 1,
      }),
    }),
    [name],
  )

  return (
    <div ref={drag} style={{ ...style, opacity }}>
        <Grid container xs={12}>
            <Grid xs={5}>
                <Box sx={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '9/16'
                }}>
                    <Image style={{ objectFit: 'cover' }} src={profile_url} fill alt="" />
                </Box>
            </Grid>
            <Grid xs={7} sx={{ backgroundColor: '#069cb1', padding: '10px' }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Typography
                        variant="body1"
                        component="p"
                        fontWeight={500}
                        sx={{
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 2,
                            color: '#fff',
                            lineHeight: '20px',
                            height: '40px',
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            //whiteSpace: 'nowrap'
                        }}
                    >
                        {nombre}
                    </Typography>
                    <Image src="/assets/img/iconos/control_rol_edit.svg" width={20} height={20} alt="" />
                </Box>
                <Typography fontWeight={500} sx={{ color: '#fff', lineHeight: '20px' }}>
                    {union}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1, marginTop: '5px' }}>
                    <Image src="/assets/img/iconos/pendiente_table.png" width={8} height={12} alt="" />
                    <Image src="/assets/img/iconos/pendiente_table.png" width={8} height={12} alt="" />
                </Box>
                <Box sx={{ display: 'flex', gap: .3, marginTop: '5px' }}>
                    <Image src="/assets/img/iconos/icono_star_blue_active.svg" width={12} height={12} alt="" />
                    <Image src="/assets/img/iconos/icono_star_blue_active.svg" width={12} height={12} alt="" />
                    <Image src="/assets/img/iconos/icono_star_blue_active.svg" width={12} height={12} alt="" />
                    <Image src="/assets/img/iconos/icono_star_blue_active.svg" width={12} height={12} alt="" />
                    <Image src="/assets/img/iconos/icono_star_blue_active.svg" width={12} height={12} alt="" />
                </Box>
            </Grid>
            <Grid xs={12}>
                <Typography sx={{ lineHeight: '20px', padding: '20px', border: '2px solid #069cb1' }}>
                    Notas sobre el actor,
                    detalles que comparte
                    O lo que sea.
                </Typography>
            </Grid>
        </Grid>
      
    </div>
  )
}