const Constants = {
    TIPOS_USUARIO: {
        TALENTO: 'TALENTO',
        CAZATALENTOS: 'CAZATALENTOS',
        REPRESENTANTE: 'REPRESENTANTE'
    },
    ESTADOS_APLICACION_ROL: {
        NO_VISTO: 1, 
        VISTO: 2, 
        DESTACADO: 3, 
        AUDICION: 4,
        CALLBACK: 5, 
    },
    ESTADOS_ROLES: {
        ARCHIVADO: 'ARCHIVADO',
        SIN_FINALIZAR: 'SIN_FINALIZAR'
    },
    ESTADOS_PROYECTO: {
        POR_VALIDAR: 'POR_VALIDAR',
        ARCHIVADO: 'ARCHIVADO',
        ENVIADO_A_APROBACION: 'ENVIADO_A_APROBACION',
        APROBADO: 'APROBADO',
        RECHAZADO: 'RECHAZADO'
    },
    PATTERNS: {
        EMAIL: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        URL: /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/
    },
    PAGE_ERRORS: {
        USER_DONT_EXISTS: 'USER_DONT_EXISTS',
        UNAUTHORIZED_USER_ROLE: 'UNAUTHORIZED_USER_ROLE'
    }
}

export default Constants;