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
    id_rol_application: number,
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
  onDrop: (data: { id_talento: number, id_rol_application: number}) => void
}

interface DropResult {
  allowedDropEffect: string
  dropEffect: string
  name: string
}

export const TalentoReclutadoCard: FC<TalentoReclutadoCardProps> = ({ id_talento, id_rol_application, onDrop, profile_url, nombre, union, notas, tipo_agenda, calificacion}) => {
  const input_background_color = (tipo_agenda === 'callback') ? '#F9B233' : '#069cb1';
  const [{ opacity }, drag] = useDrag(
    () => ({
      type: 'ELEMENT',
      item: { id_talento, id_rol_application },
      end(item, monitor) {
        const dropResult = monitor.getDropResult() as DropResult
        if (item && dropResult) {
          const isDropAllowed = dropResult.allowedDropEffect === 'any' || dropResult.allowedDropEffect === dropResult.dropEffect;

          if (isDropAllowed) {
            onDrop({ id_talento: item.id_talento, id_rol_application: id_rol_application });
          }
        }
      },
      collect: (monitor: DragSourceMonitor) => ({
        opacity: monitor.isDragging() ? 0.4 : 1,
      }),
    }),
    [name, id_talento, id_rol_application],
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
                <Divider orientation='horizontal' style={{margin: 2}} />
                  <Grid container>
                    {notas.cazatalentos &&
                      <Grid item padding={1} xs={(notas.cazatalentos && !notas.talento) ? 12 : 4}>
                        <p style={{ fontSize: 10, fontWeight: 600, color: '#069cb1' }}>Nota cazatalentos</p>
                        <p style={{ fontSize: 12 }}>{notas.cazatalentos}</p>
                      </Grid>
                    }
                    {notas.cazatalentos && notas.talento &&
                      <Grid item xs={2} m={1}>
                        <Divider orientation='vertical'/>
                      </Grid>
                    }
                    {notas.talento &&
                      <Grid item padding={1} xs={(!notas.cazatalentos && notas.talento) ? 12 : 4}>
                        <p style={{ fontSize: 10, fontWeight: 600, color: '#069cb1'}}>Nota talento</p>
                        <p style={{ fontSize: 12 }}>{notas.talento}</p>
                        
                      </Grid>
                    }
                  </Grid>
              </Grid>
            
            }
        </Grid>
      
    </div>
  )
}