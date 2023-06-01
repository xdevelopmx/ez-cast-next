import { Typography } from '@mui/material';
import update, { extend } from 'immutability-helper'
import { type CSSProperties, type FC, useEffect } from 'react'
import { useCallback, useState } from 'react'
import MotionDiv from '~/components/layout/MotionDiv';

import { DraggableElement } from './DraggableElement';

export interface Item {
	id: number
	content: JSX.Element
}

interface Props {
	style?: CSSProperties,
	elementsStyle?: CSSProperties,
	elements: Item[],
	width?: number | string,
	direction?: 'horizontal' | 'vertical',
	hideDeleteButton?: boolean, 
	onElementsUpdate?: (ordered_elements_id: number[]) => void
}

export interface ContainerState {
	elements: Item[]
}

export const DraggableContainer: FC<Props> = (props: Props) => {
	const [ordered_elements_id, setsOrderedElementsId] = useState<number[]>([]);
	const [elements, setElements] = useState<Item[]>([]);

	useEffect(() => {
		extend('$updateIndices', function (_, original: Item[]) {
			setsOrderedElementsId(original.map(e => e.id));
			return original;
		});
	}, []);

	useEffect(() => {
		// primero checamos que los ids sean diferentes al len de los elementos, si es el caso entonces significa que se agrego un nuevo elemento
		// y hay que ajustar la lista de ids adjuntandolo al final de la lista.
		if (ordered_elements_id.length !== props.elements.length) {
			props.elements.forEach(ele => {
				if (!ordered_elements_id.includes(ele.id)) {
					ordered_elements_id.push(ele.id);
				}
			})
		}
		setsOrderedElementsId(ordered_elements_id.map(e => e));

		// a continuacion repasamos todos los ids ordenados para asi obtener de la lista de elementos de forma ordenada cada elemento
		const ordered_elements: Item[] = [];
		ordered_elements_id.forEach((id) => {
			const element = props.elements[id];
			if (element) {
				ordered_elements.push(element);
			}
		});
		setElements(ordered_elements);
	}, [props.elements]);

	useEffect(() => {
		// cuando se cambie el orden de elementos dentro del contenedor entrara aqui,
		// hay que comprobar que el numero de ids es el mismo de elementos
		if (ordered_elements_id.length === props.elements.length) {
			// con ayuda de la funcion join juntaremos todos los ids en una string para compararla con los ids de los elementos 
			if (props.elements.map(e => e.id).join('-') !== ordered_elements_id.join('-')) {
				if (props.onElementsUpdate) {
					props.onElementsUpdate(ordered_elements_id);
					setsOrderedElementsId([]);
				}
			}
		}
	}, [ordered_elements_id]);


	const moveImage = useCallback((dragIndex: number, hoverIndex: number) => {
		setElements((prev: Item[]) =>

			// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return
			update(prev, {
				$splice: [
					[dragIndex, 1],
					[hoverIndex, 0, prev[dragIndex] as Item]
				],
				$updateIndices: undefined
			})
		)
	}, [])

	const renderImage = useCallback(
		(element: { id: number; content: JSX.Element }, index: number) => {
			return (
				<DraggableElement
					key={element.id}
					style={props.elementsStyle}
					index={index}
					id={element.id}
					content={element.content}
					moveItem={moveImage}
					onItemRemove={(props.hideDeleteButton) ? undefined : (id_to_be_deleted: number) => {
						const new_ordered_elements_id = ordered_elements_id.filter(id => id !== id_to_be_deleted);
						if (props.onElementsUpdate) {
							props.onElementsUpdate(new_ordered_elements_id);
						}
					}}
				/>
			)
		},
		[ordered_elements_id],
	)
	return (
		<MotionDiv
			style={{ width: (props.width) ? props.width : 400, ...props.style, display: (props.direction === 'vertical') ? 'block' : 'flex', flexWrap: 'wrap', gap: 10 }}
			show={true}
			animation='left-to-right'
		>
			<>
				{elements.map((element, i) => renderImage(element, i))}
				{/* {elements.length === 0 &&
					<Typography fontSize={14}>
						No se ha agregado ningun elemento
					</Typography>
				} */}
			</>
		</MotionDiv>
	)
}

