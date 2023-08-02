import { Typography } from '@mui/material'
import type { CSSProperties, FC } from 'react'
import { useDrop } from 'react-dnd'

const style: CSSProperties = {
  height: '12rem',
  width: '12rem',
  marginRight: '1.5rem',
  marginBottom: '1.5rem',
  color: 'white',
  padding: '1rem',
  textAlign: 'center',
  fontSize: '1rem',
  lineHeight: 'normal',
  float: 'left',
}

export interface DraggableHorarioContainerProps {
  allowedDropEffect: string,
  onDrop: (item: unknown) => void,
  fecha: string,
  id_rol: number
}

function selectBackgroundColor(isActive: boolean, canDrop: boolean) {
  if (isActive) {
    return 'darkgreen'
  } else if (canDrop) {
    return 'darkkhaki'
  } else {
    return '#222'
  }
}
  

export const DraggableHorarioContainer: FC<DraggableHorarioContainerProps> = ({ allowedDropEffect, onDrop, fecha, id_rol }) => {
  const [{ canDrop, isOver }, drop] = useDrop(
    () => ({
      accept: 'ELEMENT',
      drop: (item, monitor) => {
        onDrop(item);
        return {
            name: `${allowedDropEffect} Dustbin`,
            allowedDropEffect,
        }
      },
      collect: (monitor: any) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [allowedDropEffect, fecha, id_rol],
  )

  const isActive = canDrop && isOver
  const backgroundColor = selectBackgroundColor(isActive, canDrop)
  return (
    <div  ref={drop} style={{marginTop: 40, width: '90%', marginLeft: 'auto', marginRight: 'auto', border: 'dotted', borderRadius: 16, padding: 2, color: backgroundColor}}>
        <Typography>{isActive ? 'Suelta' : 'Arrastra'} aqui para agregar talento a este intervalo</Typography>
    </div>
  )
}