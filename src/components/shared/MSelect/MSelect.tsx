
import { Box, Checkbox, FormControl, FormControlLabel, FormLabel, InputLabel, ListItemText, makeStyles, MenuItem, Radio, RadioGroup, Select, SelectChangeEvent, Skeleton, Typography } from '@mui/material';
import type { CSSProperties, FC, MouseEventHandler, ReactNode } from 'react';
import { MContainer } from '../../layout/MContainer';

interface Props {
    id: string,
    label?: string,
    options: { value: string, label: string }[],
    onChange?: ((event: SelectChangeEvent<string>, child: ReactNode) => void) | undefined;
    onClick?: ((event: unknown) => void) | undefined;
    value?: string | string[];
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
    disable_default_option?: boolean,
    default_option?: {value: string, label: string},
    renderValue?: (selected: string) => JSX.Element | string,
    highlight_default_option?: boolean,
    button_props?: CSSProperties,
    multiple?: boolean,
    placeholder?: string
}

export const MSelect: FC<Props> = ({
    disabled, loading, className, placeholder, renderValue, multiple, button_props, highlight_default_option, disable_default_option, default_option, icon, labelClassName, label, id, onChange, onClick, value, labelStyle, style, options, tooltip,
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

    const _default_option = (disable_default_option) ? [] : [(default_option) ? default_option : { value: default_value, label: 'Selecciona una opcion' }]; 
    
    let multiple_values: string[] = [];
    if (multiple) {
        const vals = value as string[];
        multiple_values = multiple_values.concat(vals)
    }

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
                    {multiple &&
                        <Box position={'relative'}>
                            {placeholder &&
                                <Typography position={'absolute'} style={{pointerEvents: 'none'}} left={12} top={8} zIndex={2} fontSize={'0.8rem'}>{placeholder}</Typography>
                            }
                            <Select
                                disabled={(disabled)}
                                multiple={multiple}
                                sx={{
                                    '&ul': {
                                        maxHeight: 100
                                    },
                                    '& > svg': (button_props) ? button_props : {
                                        fontSize: '2rem',
                                        position: 'absolute',
                                        height: '100%',
                                        top: 0,
                                        right: '0px'
                                    },
                                    ...style
                                }}
                                onClick={onClick}
                                labelId={id}
                                id={id}
                                style={{
                                    backgroundColor: (disabled) ? 'lightgray' : ''
                                }}
                                renderValue={renderValue}
                                /*
                                // @ts-ignore */
                                value={multiple_values}
                                className={`form-control form-control-sm text_custom ${(select_class) ? select_class : ''} ${(className) ? className : ''}`}
                                onChange={onChange}
                                MenuProps={{ classes: { paper: 'select-children' }, style: styleMenuProps }}
                            >
                                {options.map((e, index) => {
                                    return (
                                        <MenuItem key={index} value={e.value}>
                                            <Checkbox checked={((value as string[]).indexOf(e.value) > -1)} />
                                            {e.label}
                                        </MenuItem>
                                    )
                                })}
                            </Select>
                        </Box>
                    }
                    {!multiple &&
                        <Select
                            disabled={(disabled)}
                            multiple={multiple}
                            sx={{
                                '&ul': {
                                    maxHeight: 100
                                },
                                '& > svg': (button_props) ? button_props : {
                                    fontSize: '2rem',
                                    position: 'absolute',
                                    height: '100%',
                                    top: 0,
                                    right: '0px'
                                },
                                ...style
                            }}
                            onClick={onClick}
                            labelId={id}
                            id={id}
                            renderValue={renderValue}
                            value={value as string}
                            className={`form-control form-control-sm text_custom ${(select_class) ? select_class : ''} ${(className) ? className : ''}`}
                            onChange={onChange}
                            MenuProps={{ classes: { paper: 'select-children' }, style: styleMenuProps }}
                        >
                            {_default_option.concat(options).map((e, index) => <MenuItem style={(highlight_default_option && index === 0) ? {backgroundColor: 'gray', color: 'white'} : (e.value === value) ? {backgroundColor: '#069cb1', color: 'white'} : {}} key={index} value={e.value}>{e.label}</MenuItem>)}
                        </Select>
                    }
                    {inferiorBlueText && <Typography fontSize={14} sx={{ color: '#069cb1' }}>{inferiorBlueText}</Typography>}
                </>

            }
        </FormControl>
    )
}
