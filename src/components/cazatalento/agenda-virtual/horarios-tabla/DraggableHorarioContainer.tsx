import { Typography } from '@mui/material'
import { useContext, type CSSProperties, type FC } from 'react'
import { useDrop } from 'react-dnd'
import AppContext from '~/context/app'
import useLang from '~/hooks/useLang'

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
  

export const DraggableHorarioContainer: FC<DraggableHorarioContainerProps> = ({ allowedDropEffect, onDrop, fecha }) => {
  const ctx = useContext(AppContext);
  const textos = useLang(ctx.lang);
  const [{ canDrop, isOver }, drop] = useDrop(
    () => ({
      accept: 'ELEMENT',
      drop: (item, monitor) => {
        console.log(item);
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
    [allowedDropEffect, fecha],
  )

  const isActive = canDrop && isOver
  const backgroundColor = selectBackgroundColor(isActive, canDrop)
  return (
    <div  ref={drop} style={{marginTop: 40, width: '90%', marginLeft: 'auto', marginRight: 'auto', border: 'dotted', borderRadius: 16, padding: 2, color: backgroundColor}}>
        <Typography>{isActive ? `${textos['suelta_para_agregar_talento']}` : `${textos['arrastra_para_agregar_talento']}`}</Typography>
    </div>
  )
}