
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Skeleton } from '@mui/material';
import type { ChangeEventHandler, CSSProperties, FC } from 'react'

interface Props {
    id: string,
    label?: string,
    options: string[],
    onChange?: ChangeEventHandler<HTMLInputElement>;
    value?: string;
    style?: CSSProperties,
    elementStyle?: CSSProperties,
    labelStyle?: CSSProperties,
    labelClassName?: string,
    disabled?: boolean,
    loading?: boolean,
    styleRoot?: CSSProperties,
    direction?: 'vertical' | 'horizontal'
}

export const MRadioGroup: FC<Props> = ({
    direction, loading, disabled, labelClassName, label, id, onChange, value, labelStyle, style, options, elementStyle, styleRoot = {}
}) => {
    return (
        <>
            {loading &&
                Array.from({ length: 10 }).map((n, i) => { return <Skeleton style={{ margin: 8 }} key={i} variant="rectangular" height={56} /> })
            }
            {!loading &&
                <FormControl sx={styleRoot}>
                    <FormLabel style={{ gap: 20, fontSize: 16, ...labelStyle }} className={labelClassName} id={id}>{label}</FormLabel>
                    <RadioGroup
                        style={{ gap: 30, ...style }}
                        id={id}
                        row={((direction && direction === 'horizontal') || !direction) ? true : false}
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                    >
                        {options.map(o => {
                            return <FormControlLabel
                                key={o}
                                style={elementStyle}
                                control={
                                    <Radio
                                        value={o}
                                        checked={o === value}
                                        disabled={(disabled)}
                                        style={{ fontSize: 16, color: (disabled) ? 'gray' : '#069cb1' }}
                                        onChange={onChange}
                                    />
                                }
                                label={o}
                            />
                        })}
                    </RadioGroup>
                </FormControl>
            }
        </>
    )
}
