import { type tipo_usuario } from "~/interfaces"


export const useLogin = () => {

    const estaSeleccionado = (tipo_a_comprobar: tipo_usuario, tipo_usuario: tipo_usuario) => {
        return tipo_a_comprobar === tipo_usuario
    }

    const loguearse = (tipo_usuario: tipo_usuario) => {
        //
    }

    return {
        estaSeleccionado,
        loguearse
    }
}
