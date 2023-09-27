import { useMemo, type CSSProperties, type FC, useContext } from 'react'
import type { DragSourceMonitor } from 'react-dnd'
import Image from 'next/image';
import { useDrag } from 'react-dnd'
import { Box, Button, Divider, Grid, Typography } from '@mui/material'
import { TalentoReclutadoCardProps } from '~/components';
import AppContext from '~/context/app';
import useLang from '~/hooks/useLang';
import Constants from '~/constants';

const style: CSSProperties = {
  border: '1px dashed gray',
  backgroundColor: 'white',
  width: '100%',
  margin: 4,
}

interface DropResult {
  allowedDropEffect: string
  dropEffect: string
  name: string
}

export const TalentoReclutadoListCard: FC<(TalentoReclutadoCardProps & {action: JSX.Element, tipo_agenda?: string, ubicacion: string, notas?: { talento?: string, cazatalentos?: string }})> = ({ id_talento, onDrop, profile_url, nombre, union, ubicacion, calificacion, estado, action, notas, tipo_agenda}) => {
  const input_background_color = (tipo_agenda === 'callback') ? '#F9B233' : '#069cb1';
  const ctx = useContext(AppContext);
  const textos = useLang(ctx.lang);
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

  const estado_label = useMemo(() => {
    console.log(estado);
    switch (estado) {
      case Constants.ESTADOS_ASIGNACION_HORARIO.CONFIRMADO: return `${textos['confirmado']}`;
      case Constants.ESTADOS_ASIGNACION_HORARIO.APROBADO: return `${textos['aprobado']}`;
      case Constants.ESTADOS_ASIGNACION_HORARIO.RECHAZADO: return `${textos['inactivo']}`;
      case Constants.ESTADOS_ASIGNACION_HORARIO.PENDIENTE: return `${textos['pendiente']}`;
    }
    return 'N/D';
  }, [textos]);

  return (
    <div ref={drag} style={{...style}}>
        <Box display={'flex'} flexDirection={'row'} sx={{backgroundColor: input_background_color}}>
            <Image src={profile_url} width={76} height={88} alt=""  />
            <Box display={'flex'} flexDirection={'column'} flexGrow={1} paddingLeft={8} paddingTop={2}>
                <Typography color={'white'}>{nombre}</Typography>
                <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'}>
                    <Typography color={'white'}>{ubicacion}</Typography>
                    <Box sx={{ display: 'flex', gap: .3, marginTop: '5px' }}>
                      {Array.from({length: calificacion}).map((_) => {
                        return <Image src={(tipo_agenda === 'callback') ? '/assets/img/iconos/icono_star_blue.svg' : '/assets/img/iconos/icono_star_blue_active.svg'} width={12} height={12} alt="" />
                      })}
                    </Box>
                    <Typography color={'white'}>{estado_label}</Typography>
                    {action}
                </Box>
            </Box>
        </Box>
        {notas &&
          <Grid container>
            {notas.cazatalentos &&
              <Grid item xs={12}>
                {notas.cazatalentos}
              </Grid>
            }
            {notas.cazatalentos && notas.talento &&
              <Grid item xs={12} m={1}>
                <Divider orientation='horizontal'/>
              </Grid>
            }
            {notas.talento &&
              <Grid item xs={12}>
                {notas.talento}
              </Grid>
            }
          </Grid>
        
        }
    </div>
  )
}