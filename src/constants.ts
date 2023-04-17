const Constants = {
    TIPOS_USUARIO: {
        TALENTO: 'TALENTO',
        CAZATALENTOS: 'CAZATALENTOS',
        REPRESENTANTE: 'REPRESENTANTE'
    },
    PATTERNS: {
        EMAIL: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        URL: /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/
    }
}

export default Constants;