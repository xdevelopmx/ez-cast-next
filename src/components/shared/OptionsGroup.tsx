import { Button, Divider } from '@mui/material';
import { useState, type CSSProperties, type FC } from 'react'

interface Props {
    id: string;
    labels: string[];
    onOptionClick: (id: string, label: string) => void;
    styleContainer?: CSSProperties;
    styleButton?: CSSProperties;
}

export const OptionsGroup: FC<Props> = ({ id, labels, onOptionClick, styleContainer = {}, styleButton = {} }) => {

    const [seleccionado, setSeleccionado] = useState(0)

    return (
        <>
            <div className="form-group" style={styleContainer}>
                {labels.filter(l => l.length > 0).map((label, index) => {
                    return <Button
                        sx={styleButton}
                        size='small'
                        className={`font-weight-bold color_a fs-20px hover-bg-blue ${(seleccionado === index? 'seleccionado' : '')}`}
                        key={label}
                        onClick={() => { 
                            onOptionClick(id, label),
                            setSeleccionado(index)
                         }}
                        variant="text"
                    >
                        {label}
                    </Button>;
                })}
            </div>
            <Divider style={{ borderWidth: 2, backgroundColor: 'rgb(0 206 235)' }} />
        </>
    )
}
