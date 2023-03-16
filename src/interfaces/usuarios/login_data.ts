import { type tipo_usuario } from "./tipo_usuario";

export interface login_data{
    tipo_usuario: tipo_usuario;
    usuario: string;
    contrasena: string;
}