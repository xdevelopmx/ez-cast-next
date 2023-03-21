
import { FormControl, FormControlLabel, FormLabel, InputLabel, MenuItem, Radio, RadioGroup, Select, SelectChangeEvent } from '@mui/material';
import type { ChangeEventHandler, CSSProperties, FC, HTMLInputTypeAttribute, ReactNode } from 'react';
import classes from '../talento/forms/talento-forms.module.css';
import { MContainer } from '../layout/MContainer';

interface Props {
    id: string,
    label?: string,
    options: {value: string, label: string}[],
    onChange?: ((event: SelectChangeEvent<string>, child: ReactNode) => void) | undefined;
    value?: string;
    style?: CSSProperties,
    className?: string,
    labelStyle?: CSSProperties,
    labelClassName?: string,
    icon?: JSX.Element
}

export const MSelect: FC<Props> = ({ className, icon, labelClassName, label, id, onChange, value, labelStyle, style, options }) => {
    let label_element: JSX.Element | null = null; 
    if (label) {
        label_element = <label style={labelStyle} className={labelClassName} htmlFor={id}>{label}</label>;
        if (icon) {
            label_element = <MContainer direction='horizontal'>{icon}{label_element}</MContainer>
        }
    }
    const select_class = classes['select-form-control'];
    return (
        <FormControl>
            {label_element}
            <Select
                labelId={id}
                id={id}
                value={value}
                style={{...style}}
                className={`form-control form-control-sm text_custom ${(select_class) ? select_class : ''} ${(className) ? className : ''}`}
                onChange={onChange}
                MenuProps={{ classes: { paper: classes.select } }}
            >
                {options.map((e, index) => <MenuItem key={index} value={e.value}>{e.label}</MenuItem>)}
            </Select>
        </FormControl>
    )
}
