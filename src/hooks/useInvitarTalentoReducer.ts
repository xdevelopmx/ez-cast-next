import { useReducer } from 'react'
import Constants from '~/constants';
import { InvalidEmailError, InvalidFieldError } from '~/utils/errores';

enum TiposAcciones {
    UPDATE_NOMBRE,
    UPDATE_APELLIDO,
    UPDATE_CORREO_ELECTRONICO,
    UPDATE_NOTA,
    UPDATE_TIPO_CORREO,
    UPDATE_CORREO_INVITACION,
}

type Form = {
    nombre: string;
    apellido: string;
    correo_electronico: string;
    nota: string;
    tipo_correo: string;
    correo_invitacion: string;
}

type Action = {
    payload: string;
    type: TiposAcciones;
}

const initial: Form = {
    apellido: '',
    correo_electronico: '',
    correo_invitacion: '',
    nombre: '',
    nota: '',
    tipo_correo: '',
}

const formReducer = (state: Form, action: Action): Form => {
    switch (action.type) {
        case TiposAcciones.UPDATE_NOMBRE:
            return {
                ...state,
                nombre: action.payload
            }
        case TiposAcciones.UPDATE_APELLIDO:
            return {
                ...state,
                apellido: action.payload
            }
        case TiposAcciones.UPDATE_CORREO_ELECTRONICO:
            return {
                ...state,
                correo_electronico: action.payload
            }
        case TiposAcciones.UPDATE_NOTA:
            return {
                ...state,
                nota: action.payload
            }
        case TiposAcciones.UPDATE_TIPO_CORREO:
            return {
                ...state,
                tipo_correo: action.payload
            }
        case TiposAcciones.UPDATE_CORREO_INVITACION:
            return {
                ...state,
                correo_invitacion: action.payload
            }
        default:
            return state;
    }
}


const useInvitarTalentoReducer = () => {

    const [state, dispatch] = useReducer(formReducer, initial);

    const validarFormulario = (state: Form) => {
        if (state.nombre.length < 3) {
            throw new InvalidFieldError("El nombre debe tener al menos 3 dígitos");
        }
        if (state.apellido.length < 3) {
            throw new InvalidFieldError("El apellido debe tener al menos 3 dígitos");
        }
        if (!Constants.PATTERNS.EMAIL.test(state.correo_electronico)) {
            throw new InvalidEmailError();
        }
        if (!state.tipo_correo) {
            throw new InvalidFieldError("Elige una opción de invitación");
        }
        if (!Constants.PATTERNS.EMAIL.test(state.correo_invitacion)) {
            throw new InvalidEmailError();
        }
    }

    return {
        state,
        dispatch,
        TiposAcciones,
        validarFormulario
    }
}

export default useInvitarTalentoReducer;