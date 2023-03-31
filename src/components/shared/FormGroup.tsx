
import { Skeleton, TextField, Typography } from '@mui/material';
import type { ChangeEventHandler, CSSProperties, FC, HTMLInputTypeAttribute, ReactNode } from 'react'
import { MContainer } from '../layout/MContainer';
import MotionDiv from '../layout/MotionDiv';

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
    icon?: {
        element: JSX.Element,
        position: 'start' | 'end'
    },
    loading?: boolean,
    error?: string,
    show_error_message?: boolean,
    rows?: number,
    textBlueLabel?: string,

    tooltip?: ReactNode;
}

export const FormGroup: FC<Props> = ({
    show_error_message, rows, error, loading, icon, rootStyle, className, labelClassName, label, id, type = 'text',
    onChange, value, labelStyle, style, textBlueLabel, tooltip
}) => {
    let input: JSX.Element = <input style={{ fontSize: 16, ...style, borderColor: (error != null) ? 'red' : 'black' }} value={(value) ? value : ''} onChange={onChange} type={type} className={`form-control form-control-sm text_custom ${(className) ? className : ''}`} id={id} />;
    if (type === 'text-area') {
        input = <TextField
            id={id}
            className={className}
            style={{ ...style }}
            value={(value) ? value : ''}
            onChange={onChange}
            multiline
            rows={(rows) ? rows : 3}
        />;
    }
    let label_element: JSX.Element | null = null;
    if (label) {
        label_element = <label
            style={labelStyle}
            className={labelClassName}
            htmlFor={id}>{label} {textBlueLabel && <span style={{ color: '#069CB1', paddingLeft: 2 }}>{textBlueLabel}</span>} {tooltip}</label>;
        if (icon) {
            if (icon.position === 'start') {
                label_element = <MContainer direction='horizontal'>{icon.element}{label_element}</MContainer>
            } else {
                label_element = <MContainer direction='horizontal'>{label_element}{icon.element}</MContainer>
            }
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
            <MotionDiv show={error != null && show_error_message != null} animation='down-to-up'>
                <Typography color={'red'} variant="caption" display="block" gutterBottom>
                    {error}
                </Typography>
            </MotionDiv>
        </div>
    )
}
