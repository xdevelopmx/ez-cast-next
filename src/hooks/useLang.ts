import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

const TEXTS_BY_PATHNAME: {[path: string]: {[lang: string]: {[key: string]: string}}} = {
    '/registro': {
        en: {
            test: 'test',
            car: 'car',
            cat: 'Cat'
        },
        es: {
            test: 'Prueba',
            car: 'Carro',
            cat: 'Gato'
        }
    },
    '/login': {
        en: {
            test: 'test',
            car: 'car',
            cat: 'Cat',
            cow: 'Cow'
        },
        es: {
            test: 'Prueba',
            car: 'Carro',
            cat: 'Gato',
            cow: 'VACA'
        }
    }
}


const useLang = (lang: string) => {

    const route = useRouter();

    const [texts, setTexts] = useState<{[key: string]: string}>({});

    useEffect(() => {
        if (TEXTS_BY_PATHNAME[route.pathname]) {
            const by_path = TEXTS_BY_PATHNAME[route.pathname];
            if (by_path) {
                const by_lang = by_path[lang];
                setTexts((by_lang) ? by_lang : {});
            } else {
                setTexts({});
            }
        } else {
            setTexts({});
        }
    }, [lang, route.pathname]);

    return texts;
};

export default useLang;