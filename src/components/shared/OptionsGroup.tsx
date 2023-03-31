import { Button, Divider } from '@mui/material';
import type { CSSProperties, FC } from 'react'

interface Props {
    id: string;
    labels: string[];
    onOptionClick: (id: string, label: string) => void;

    styleContainer?: CSSProperties;
    styleButton?: CSSProperties;
}

export const OptionsGroup: FC<Props> = ({ id, labels, onOptionClick, styleContainer = {}, styleButton = {} }) => {
    return (
        <>
            <div className="form-group" style={styleContainer}>
                {labels.map(label => {
                    return <Button
                        sx={styleButton}
                        size='small'
                        className='font-weight-bold color_a'
                        key={label}
                        onClick={() => { onOptionClick(id, label) }}
                        variant="text"
                    >
                        {label}
                    </Button>;
                })}
            </div>
            <Divider style={{ borderWidth: 1, backgroundColor: 'var(--color_a) !important' }} />
        </>
    )
}
