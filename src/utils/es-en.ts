const Textos = {
    'en': {
        'prueba': 'test'
    },
    'es': {
        'prueba': 'prueba'
    }
}

export default function getText(key: string, idioma: 'en' | 'es') {
    switch (idioma) {
        case 'en': {
            return Textos[idioma][key]
        }

        case 'es': {
            break;
        }
    
        default:
            break;
    }
}