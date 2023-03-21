import { Button, Divider } from '@mui/material';
import type { ChangeEventHandler, FC, HTMLInputTypeAttribute } from 'react'

interface Props {
    id: string,
    labels: string[];
    onOptionClick: (id: string, label: string) => void
}

export const OptionsGroup: FC<Props> = ({ id, labels, onOptionClick }) => {
    return (
        <div className="form-group">
           {labels.map(label => {
                return <Button size='small' className='font-weight-bold color_a' key={label} onClick={() => {onOptionClick(id, label)}} variant="text">{label}</Button>;
           })}
           <Divider style={{borderWidth: 1, backgroundColor: 'var(--color_a) !important'}} />
        </div>
    )
}
