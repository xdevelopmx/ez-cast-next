export default function ApiResponses(route: string, lang: string) {
    const API_RESPONSES_TEXTS: {[route: string]: {[lang: string]: {[key: string]: string}}} = {
        Alertas_getByUser: {
            en: {
                error: 'test error',
            },
            es: {
                error: 'prueba error',
            },
        }
    }
    const _route = API_RESPONSES_TEXTS[route];
    if (_route) {
        const texts = _route[lang];
        if (texts) {
            return (_key: string) => {
                const _text = texts[_key];
                if (_text) {
                    return _text;
                }
                return 'Texto No Definido';
            }    
        }
    }
    return (_key: string) => {
        return 'Texto No Definido';
    };
}

