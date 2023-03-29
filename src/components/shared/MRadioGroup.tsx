
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Skeleton } from '@mui/material';
import type { ChangeEventHandler, CSSProperties, FC } from 'react'

interface Props {
    id: string,
    label?: string,
    options: string[],
    onChange?: ChangeEventHandler<HTMLInputElement>;
    value?: string;
    style?: CSSProperties,
    labelStyle?: CSSProperties,
    labelClassName?: string,
    disabled?: boolean,
    loading?: boolean,
    styleRoot?: CSSProperties,
}

export const MRadioGroup: FC<Props> = ({
    loading, disabled, labelClassName, label, id, onChange, value, labelStyle, style, options, styleRoot = {}
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
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                    >
                        {options.map(o => {
                            return <FormControlLabel
                                key={o}
                                control={
                                    <Radio
                                        value={o}
                                        checked={o === value}
                                        disabled={(disabled)}
                                        style={{ fontSize: 16, color: (disabled) ? 'gray' : '#4ab7c6' }}
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
