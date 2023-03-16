import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { type login_data, type tipo_usuario } from "~/interfaces"


export const useLogin = () => {

    const { mutate, isLoading, error } = useMutation(
        (loginData: login_data) => axios.post('/api/login', loginData),
        {
            onSuccess: (data) => {
                // Lógica que se ejecuta después de que el inicio de sesión tenga éxito
                console.log(data);
            },
        }
    );

    const estaSeleccionado = (tipo_a_comprobar: tipo_usuario, tipo_usuario: tipo_usuario) => {
        return tipo_a_comprobar === tipo_usuario
    }

    const loguearse = ({ tipo_usuario, usuario, contrasena }: login_data) => {
        mutate({ tipo_usuario, usuario, contrasena });
    }

    return {
        estaSeleccionado,
        loguearse, 
        isLoading,
        error,
    }
}
