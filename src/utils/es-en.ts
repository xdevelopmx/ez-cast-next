const TEXTOS: {[lang: string]: {[key: string]: string}} = {
    'en': {
        'prueba': 'test'
    },
    'es': {
        'prueba': 'prueba'
    }
}

export default function getText(key: string, idioma: 'en' | 'es') {
    const text = TEXTOS[idioma];
    if (text) {
        return (text[key]) ? text[key] : `TEXTO CON KEY ${key} ES INDFINIDO`;
    }
    return `IDIOMA ${idioma} NO DEFINIDO`;
}