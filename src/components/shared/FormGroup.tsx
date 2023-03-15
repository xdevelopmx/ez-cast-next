import { type FC, type HTMLInputTypeAttribute } from 'react'

interface Props {
    label?: string;
    id?: string;
    type?: HTMLInputTypeAttribute;
}

export const FormGroup: FC<Props> = ({ label, id, type = 'text' }) => {
    return (
        <div className="form-group">
            {label && <label htmlFor={id}>{label}</label>}
            <input type={type} className="form-control form-control-sm text_custom" id={id} />
        </div>
    )
}
