import type { CSSProperties, FC, ReactNode } from 'react'

interface Props {
    direction: 'horizontal' | 'vertical',
    justify?: 'start' | 'end' | 'space-between' | 'center',
    children: ReactNode,
    styles?: CSSProperties,
    className?: string
}

export const MContainer: FC<Props> = ({ direction, justify, children, styles, className }) => {
    return (
        <div className={className} style={{
            display: 'flex',
            justifyContent: (justify) ? justify : 'start',
            flexDirection: (direction === 'horizontal') ? 'row' : 'column',
            flexWrap: 'wrap',
            ...styles
        }}>
            {children}
        </div>
    )
}
