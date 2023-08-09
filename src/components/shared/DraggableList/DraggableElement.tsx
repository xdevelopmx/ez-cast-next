/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { IconButton } from '@mui/material'
import type { Identifier, XYCoord } from 'dnd-core'
import type { FC } from 'react'
import { useRef, type CSSProperties } from 'react'
import { useDrag, useDrop } from 'react-dnd';
import { Close } from '@mui/icons-material';

export interface DraggableItem {
  id: number,
  content: JSX.Element
}

interface Props {
  id: number,
  content: JSX.Element
  index: number,
  style?: CSSProperties
  moveItem: (dragIndex: number, hoverIndex: number) => void,
  onItemRemove?: (id: number) => void
}

interface DragItem {
  index: number
  id: string
  type: string
}

export const DraggableElement: FC<Props> = ({ id, content, index, moveItem, onItemRemove, style }) => {
  const ref = useRef<HTMLDivElement>(null)
  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: 'ELEMENT',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect()

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

      // Determine mouse position
      const clientOffset = monitor.getClientOffset()

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      // Time to actually perform the action
      moveItem(dragIndex, hoverIndex)

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex
    },
  })

  const [{ isDragging }, drag] = useDrag({
    type: 'ELEMENT',
    item: () => {
      return { id, index }
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const opacity = isDragging ? 0 : 1
  drag(drop(ref))
  return (
    <div ref={ref} style={{ cursor: 'pointer', ...style, opacity }} data-handler-id={handlerId}>
      <>
        {onItemRemove &&
          <ContainerWithDeleteButton id={id} content={content} onItemRemove={onItemRemove} />
        }
        {!onItemRemove && content}
      </>
    </div>
  )
}

function ContainerWithDeleteButton(props: { id: number, content: JSX.Element, onItemRemove: (id: number) => void }) {
  return (
    <div style={{
      position: 'relative',
    }}>
      <div style={{
        position: 'absolute',
        left: 3,
        top: -3
      }}>
        <IconButton
          sx={{ backgroundColor: '#EBEBEB', width: 13, height: 13, padding: '7px' }}
          onClick={() => { props.onItemRemove(props.id) }} aria-label="delete"
        >
          <span style={{fontSize: '13px', fontWeight: 900}}>x</span>
        </IconButton>
      </div>
      <div style={{ left: 0, top: 0, aspectRatio: '16/9' }}>
        {props.content}
      </div>

    </div>
  )
}