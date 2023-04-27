
import { FormControl, FormControlLabel, FormLabel, InputLabel, makeStyles, MenuItem, Radio, RadioGroup, Select, SelectChangeEvent, Skeleton, Typography } from '@mui/material';
import type { CSSProperties, FC, MouseEventHandler, ReactNode } from 'react';
import { MContainer } from '../../layout/MContainer';

interface Props {
    id: string,
    label?: string,
    options: { value: string, label: string }[],
    onChange?: ((event: SelectChangeEvent<string>, child: ReactNode) => void) | undefined;
    onClick?: ((event: unknown) => void) | undefined;
    value?: string;
    style?: CSSProperties,
    className?: string,
    labelStyle?: CSSProperties,
    labelClassName?: string,
    icon?: JSX.Element,
    loading?: boolean,
    styleRoot?: CSSProperties,
    disabled?: boolean,
    tooltip?: ReactNode,
    inferiorBlueText?: ReactNode,
    styleMenuProps?: CSSProperties,
    placeholder?: string,
    disable_default_option?: boolean,
    default_value_label?: string
}

export const MSelect: FC<Props> = ({
    disabled, loading, className, disable_default_option, default_value_label, placeholder, icon, labelClassName, label, id, onChange, onClick, value, labelStyle, style, options, tooltip,
    inferiorBlueText, styleRoot = {}, styleMenuProps = {}
}) => {
    let label_element: JSX.Element | null = null;
    if (label) {
        label_element = <>
            <label
                style={{ fontWeight: 800, ...labelStyle }}
                className={labelClassName}
                htmlFor={id}
            >
                {label} {tooltip}
            </label>
        </>
        if (icon) {
            label_element = <MContainer direction='horizontal'>{icon}{label_element}</MContainer>
        }
    }
    const select_class = 'select-form-control';
    let default_value = '0';
    if (options.length > 0) {
        const option = options[0];
        if (option) {
            if (isNaN(parseInt(option.value)) || option.value.length !== parseInt(option.value).toString().length) {
                default_value = ' ';
            }
        }
    }

    const default_option = (disable_default_option) ? [] : [{ value: default_value, label: (default_value_label) ? default_value_label : 'Selecciona una opcion' }]; 
    
    return (
        <FormControl sx={styleRoot}>
            {label_element}
            {loading &&
                <Skeleton
                    className={`form-control-sm text_custom ${(select_class) ? select_class : ''} ${(className) ? className : ''}`}
                    style={style}
                    variant="rectangular"
                />
            }
            {!loading &&
                <>
                    <Select
                        disabled={(disabled)}
                        sx={{
                            '&ul': {
                                maxHeight: 100
                            },
                            ...style
                        }}
                        onClick={onClick}
                        labelId={id}
                        id={id}
                        placeholder={placeholder}
                        value={value}
                        className={`form-control form-control-sm text_custom ${(select_class) ? select_class : ''} ${(className) ? className : ''}`}
                        onChange={onChange}
                        MenuProps={{ classes: { paper: 'select-children' }, style: styleMenuProps }}
                    >
                        {default_option.concat(options).map((e, index) => <MenuItem key={index} value={e.value}>{e.label}</MenuItem>)}
                    </Select>
                    {inferiorBlueText && <Typography fontSize={14} sx={{ color: '#069cb1' }}>{inferiorBlueText}</Typography>}
                </>

            }
        </FormControl>
    )
}
