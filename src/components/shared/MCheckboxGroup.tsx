
import { Checkbox, Divider, FormControl, FormControlLabel, FormGroup, FormLabel, Radio, RadioGroup, Typography } from '@mui/material';
import type { ChangeEventHandler, CSSProperties, FC, HTMLInputTypeAttribute } from 'react'
import { MContainer } from '../layout/MContainer';

interface Props {
    id: string,
    label?: string,
    options: string[],
    onChange?: ChangeEventHandler<HTMLInputElement>;
    values: boolean[];
    style?: CSSProperties,
    labelStyle?: CSSProperties,
    labelClassName?: string,
    onAllOptionChecked?: () => void,
    title?: string,
    titleStyle?: CSSProperties,
    direction?: 'vertical' | 'horizontal'
}

export const MCheckboxGroup: FC<Props> = ({ direction, title, titleStyle, onAllOptionChecked, labelClassName, id, onChange, values, labelStyle, style, options }) => {
    return (
        <div>
            {title &&
                <Typography fontSize={'1.2rem'} fontWeight={600} style={titleStyle} component={'p'}>
                    {title}
                </Typography>
            }
            {onAllOptionChecked &&
                <FormGroup id={id}>
                    <MContainer direction='vertical'>
                        <FormControlLabel className={labelClassName} style={labelStyle} control={<Checkbox onChange={onAllOptionChecked} style={style} />} label={'Seleccionar todos'} />
                        <Divider style={{ margin: 8 }} />
                    </MContainer>
                </FormGroup>
            }
            <FormGroup id={id}>
                <MContainer direction={(direction) ? direction : 'vertical'}>

                    {options.map((e, i) => {
                        const value = values[i];
                        return <FormControlLabel className={labelClassName} style={labelStyle} key={i}
                            control={
                                <Checkbox checked={(value && value === true) ? value : false} onChange={onChange} style={style} />
                            } label={e} />
                    })}
                </MContainer>
            </FormGroup>
        </div>
    )
}
