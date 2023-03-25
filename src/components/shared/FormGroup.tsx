
import { Skeleton, TextField } from '@mui/material';
import type { ChangeEventHandler, CSSProperties, FC, HTMLInputTypeAttribute } from 'react'
import type Image from 'next/image';
import { MContainer } from '../layout/MContainer';

interface Props {
    label?: string;
    id?: string;
    type?: HTMLInputTypeAttribute;
    onChange?: ChangeEventHandler<HTMLInputElement>;
    value?: string;
    style?: CSSProperties;
    className?: string;
    labelStyle?: CSSProperties;
    labelClassName?: string,
    rootStyle?: CSSProperties,
    icon?: JSX.Element,
    loading?: boolean
}

export const FormGroup: FC<Props> = ({ loading, icon, rootStyle, className, labelClassName, label, id, type = 'text', onChange, value, labelStyle, style }) => {
    let input: JSX.Element = <input style={{...style}} value={(value) ? value : ''} onChange={onChange} type={type} className={`form-control form-control-sm text_custom ${(className) ? className : ''}`}  id={id} />;
    if (type === 'text-area') {
        input = <TextField id={id} className={className} style={{...style}} value={(value) ? value : ''} onChange={onChange}  multiline rows={3}/>;
    }
    let label_element: JSX.Element | null = null; 
    if (label) {
        label_element = <label style={labelStyle} className={labelClassName} htmlFor={id}>{label}</label>;
        if (icon) {
            label_element = <MContainer direction='horizontal'>{icon}{label_element}</MContainer>
        }
    }

    return (
        <div className="form-group" style={rootStyle}>
            {label_element}
            {loading &&
                <Skeleton 
                    className={`form-control form-control-sm text_custom ${(className) ? className : ''}`} 
                    style={style} 
                    variant="rectangular"   
                />
            }
            {!loading && input}
        </div>
    )
}
