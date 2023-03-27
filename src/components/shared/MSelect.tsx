
import { FormControl, FormControlLabel, FormLabel, InputLabel, makeStyles, MenuItem, Radio, RadioGroup, Select, SelectChangeEvent, Skeleton } from '@mui/material';
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
    icon?: JSX.Element,
    loading?: boolean
}

export const MSelect: FC<Props> = ({ loading, className, icon, labelClassName, label, id, onChange, value, labelStyle, style, options }) => {
    let label_element: JSX.Element | null = null; 
    if (label) {
        label_element = <label style={{fontWeight: 800,...labelStyle}} className={labelClassName} htmlFor={id}>{label}</label>;
        if (icon) {
            label_element = <MContainer direction='horizontal'>{icon}{label_element}</MContainer>
        }
    }
    const select_class = classes['select-form-control'];
    return (
        <FormControl>
            {label_element}
            {loading &&
                <Skeleton 
                    className={`form-control form-control-sm text_custom ${(select_class) ? select_class : ''} ${(className) ? className : ''}`}
                    style={style} 
                    variant="rectangular"   
                />
            }
            {!loading &&
            
                <Select
                    sx={{
                        '&ul': {
                            maxHeight: 100
                        },
                    }}
                    labelId={id}
                    id={id}
                    value={value}
                    style={{...style}}
                    className={`form-control form-control-sm text_custom ${(select_class) ? select_class : ''} ${(className) ? className : ''}`}
                    onChange={onChange}
                    MenuProps={{ classes: { paper: classes['select-children'] } }}
                >
                    {[{value: '0', label: 'Selecciona una opcion'}].concat(options).map((e, index) => <MenuItem key={index} value={e.value}>{e.label}</MenuItem>)}
                </Select>
            }
        </FormControl>
    )
}
