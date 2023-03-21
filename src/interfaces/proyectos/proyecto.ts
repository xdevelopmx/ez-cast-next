export type Proyecto = {
    nombre: string,
    sindicato: string,
    tipo: string,
    director_casting: string,
    telefono_contacto: string,
    email_contacto: string,
    productor: string,
    casa_productora: string,
    director: string,
    agencia_publicidad: string,
    sinopsis: string,
    detalles_adicionales: string,
    locacion: string,
    compartir_nombre: boolean,
    estatus: string,
}

export type ProyectForm = {
    id?: number,
    proyecto: Proyecto,
    files: {
        archivo: {
            base64: string,
            extension: string
        },
        foto_portada: {
            base64: string,
            extension: string
        }
    }
}