import type { CSSProperties, FC } from 'react'
import type { DragSourceMonitor } from 'react-dnd'
import Image from 'next/image';
import { useDrag } from 'react-dnd'
import { Box, Button, Divider, Grid, Typography } from '@mui/material'

const style: CSSProperties = {
  border: '1px dashed gray',
  backgroundColor: 'white',
  marginRight: '1.5rem',
  marginBottom: '1.5rem',
  width: '100%',
  float: 'left',
}

export interface TalentoReclutadoCardProps {
    id_talento: number,
    profile_url: string,
    nombre: string,
    union: string,
    calificacion: number,
    estado: string,
    tipo_agenda?: string,
    notas?: {
      talento?: string,
      cazatalentos?: string
    },
    onDrop: (id_talento: number) => void
}

interface DropResult {
  allowedDropEffect: string
  dropEffect: string
  name: string
}

export const TalentoReclutadoCard: FC<TalentoReclutadoCardProps> = ({ id_talento, onDrop, profile_url, nombre, union, notas, tipo_agenda, calificacion}) => {
  const input_background_color = (tipo_agenda === 'callback') ? '#F9B233' : '#069cb1';
  const [{ opacity }, drag] = useDrag(
    () => ({
      type: 'ELEMENT',
      item: { id_talento },
      end(item, monitor) {
        const dropResult = monitor.getDropResult() as DropResult
        if (item && dropResult) {
          const isDropAllowed = dropResult.allowedDropEffect === 'any' || dropResult.allowedDropEffect === dropResult.dropEffect;

          if (isDropAllowed) {
            onDrop(item.id_talento);
          }
        }
      },
      collect: (monitor: DragSourceMonitor) => ({
        opacity: monitor.isDragging() ? 0.4 : 1,
      }),
    }),
    [name, id_talento],
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
            <Grid xs={7} sx={{ backgroundColor: input_background_color, padding: '10px' }}>
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
                  {Array.from({length: calificacion}).map((_) => {
                    return <Image src={(tipo_agenda === 'callback') ? '/assets/img/iconos/icono_star_blue.svg' : '/assets/img/iconos/icono_star_blue_active.svg'} width={12} height={12} alt="" />
                  })}
                </Box>
            </Grid>
            {notas &&
              <Grid xs={12}>
                  <Grid container>
                    {notas.cazatalentos &&
                      <Grid item xs={(notas.cazatalentos && !notas.cazatalentos) ? 12 : 4}>
                        {notas.cazatalentos}
                      </Grid>
                    }
                    {notas.cazatalentos && notas.talento &&
                      <Grid item xs={2} m={1}>
                        <Divider orientation='vertical'/>
                      </Grid>
                    }
                    {notas.talento &&
                      <Grid item xs={(!notas.cazatalentos && notas.cazatalentos) ? 12 : 4}>
                        {notas.talento}
                      </Grid>
                    }
                  </Grid>
              </Grid>
            
            }
        </Grid>
      
    </div>
  )
}