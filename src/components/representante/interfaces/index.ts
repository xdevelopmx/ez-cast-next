import { type Talentos, type Media } from "@prisma/client";

export type MediaObj = {
    media: Media;
}

export type Aplicacion = {
    id: number;
}

export type TalentoInfo = Omit<Talentos & {
    media: MediaObj[];
    aplicaciones: Aplicacion[];
}, "contrasenia" | "tipo_membresia" | "cobro_membresia">;