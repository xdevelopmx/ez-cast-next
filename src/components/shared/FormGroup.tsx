import type { ChangeEventHandler, FC, HTMLInputTypeAttribute } from 'react'

interface Props {
    label?: string;
    id?: string;
    type?: HTMLInputTypeAttribute;
    onChange?: ChangeEventHandler<HTMLInputElement>;
    value?: string;
}

export const FormGroup: FC<Props> = ({ label, id, type = 'text', onChange, value }) => {
    return (
        <div className="form-group">
            {label && <label htmlFor={id}>{label}</label>}
            <input value={value} onChange={onChange} type={type} className="form-control form-control-sm text_custom" id={id} />
        </div>
    )
}
