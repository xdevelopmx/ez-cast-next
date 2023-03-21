
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';
import type { ChangeEventHandler, CSSProperties, FC, HTMLInputTypeAttribute } from 'react'

interface Props {
    id: string,
    label?: string,
    options: string[],
    onChange?: ChangeEventHandler<HTMLInputElement>;
    value?: string;
    style?: CSSProperties,
    labelStyle?: CSSProperties,
    labelClassName?: string,
}

export const MRadioGroup: FC<Props> = ({ labelClassName, label, id, onChange, value, labelStyle, style, options }) => {
    return (
        <FormControl>
            <FormLabel style={labelStyle} className={labelClassName} id={id}>{label}</FormLabel>
            <RadioGroup
                style={style}
                id={id}
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
            >
                {options.map(o => {
                    return <FormControlLabel key={o} value={o} control={<Radio style={{color: '#4ab7c6'}} />} label={o} />
                })}
            </RadioGroup>
        </FormControl>
    )
}
