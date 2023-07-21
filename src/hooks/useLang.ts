import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

const COMMON_TEXTS: {[lang: string]: {[key: string]: string}} = {
    en: {
        proximamente: 'comming soon',
        conoce_mas: 'learn more',
        çazatalentos : 'Headhunter',
        talento : 'Talent',
        representante : 'Representative',
        paso : 'Step'
    },
    es: {
        proximamente: 'proximamente',
        conoce_mas: 'conoce más',
        çazatalentos : 'Cazatalentos',
        talento : 'Talento',
        representante : 'Representante',
        paso : 'Paso'
    }
}

const TEXTS_BY_PATHNAME: {[path: string]: {[lang: string]: {[key: string]: string}}} = {
    '/': {
        en: {
            slide_1: `<p className="h2">MAKE FILMS AND MORE</p>
            <p>"When you embark on a project, a dream, a goal, every piece is important, and like a puzzle, it's crucial to find the pieces that fit together and add value to your project.</p>
            <p>In Talent Corner®, discover incredible tools that will help you bring that vision to reality. Don't let anyone close the door on you and create opportunities that many can only imagine!"</p>`,
            slide_2: `<p className="m-0 talent_corner">
            Talent Corner® is a digital platform that functions as a <strong>Match Maker</strong> tool in various areas and fields of production, enabling the creation, filmmaking, or showcasing of your talent. It brings together aspiring individuals who are looking to take their first steps in the artistic world, whether independently or professionally, as well as experienced individuals seeking to facilitate, streamline, and carry out their film productions in a more organized and intelligent manner.
            <br /><br />
            Talent Corner® consists of 3 different sections, each with tools targeting different audiences, all encompassing the same community with a shared purpose in this Talent Corner.
            <br /><br />
            These sections are: <em>EZ-CAST</em>, <em>TREEHOUSE</em>, and <em>TALENT+</em>.
            <br /><br />
            Talent Corner® offers professional tools and formats at your disposal to collaborate on and execute projects of all kinds, from script to the big screen! Talent Corner® also serves as a self-promotion tool!</p>`,
            slide_4: `EZ-CAST, the place for those who want to discover and be discovered, CASTINGS`,
            slide_6: `A better way to search, find, and rent locations!`,
            slide_8: `Find the right freelance professional to start working on your project in minutes. A whole world of freelance talent at your fingertips.`,
        },
        es: {
            slide_1: `<p className="h2">HAZ CINE Y MÁS</p>
            <p>“Cuando te embarcas en un proyecto, un sueño, una meta, cada pieza es importante y como un  rompecabezas, es clave encontrar las piezas que embonen y sumen a tu proyecto.</p>
            <p>En Talent Corner® descubre herramientas increíbles que te ayudarán a traer esa visión a la realidad. ¡Que nadie te cierre la puerta y crea las oportunidades que muchos solo imaginan!” </p>`,
            slide_2: `<p className="m-0 talent_corner">
            Talent Corner® es una plataforma digital que funciona como herramienta de Match Maker a nivel producción en diferentes espacios y ámbitos, para crear, hacer cine o exponer tu talento, reuniendo así a aspirantes que buscan dar sus primeros pasos en el mundo artístico tanto a nivel independiente como profesional, así como personas con experiencia que busquen facilitar, agilizar y realizar sus producciones cinematográficas de una manera más organizada e inteligente.
            <br /><br />
            Talent Corner® consta de 3 diferentes secciones, herramientas que van dirigidas a diferente público, englobando un mismo gremio con una misma finalidad en esta Esquina del Talento.
            <br /><br />
            Estas son: EZ-CAST, TREEHOUSE Y TALENT +
            <br /><br />
            Talent Corner® pone a su disposición herramientas y formatos profesionales para sumar y ejecutar proyectos de todo tipo, ¡Del guión a la pantalla grande! ¡Talent Corner®  sirve también como herramienta de AUTOPROMOCIÓN!</p>`,
            slide_4: `EZ-CAST el lugar para los que quieren encontrar y ser encontrados, CASTINGS`,
            slide_6: `¿Una mejor manera de buscar, encontrar, rentar locaciones!`,
            slide_8: `Encuentra al profesional independiente adecuado para comenzar a trabajar en su proyecto en minutos. Todo un mundo de talento autónomo a tu alcance.`,
        }
    },
    '/registro': {
        en: {
            Titulo: 'EZ-CAST REGISTRATION',
            return: 'BACK TO EZ-CAST INFORMATION',
            paso_1: 'STEP 1',
            crea_perfil : 'Create your profile',
            nombre : 'Name*',
            apellidos : 'Lastname*',
            usuario : 'User*',
            mail : 'E-mail',
            contra : 'Password',
            confirma_contra : 'Confirm Password',
            registrar_con : 'Or register with',
            siguiente_paso : 'Next Step ',
        },
        es: {
            Titulo: 'REGISTRO EZ-CAST',
            return: 'REGRESAR A INFORMACIÓN EZ-CAST',
            paso_1: '1',
            crea_perfil : 'Crea tu perfil',
            nombre : 'Nombre*',
            apellidos : 'Apellidos*',
            usuario : 'Usuario*',
            mail : 'Correo electrónico',
            contra : 'Contraseña',
            confirma_contra : 'Confirmar Contraseña',
            registrar_con : 'O registrate con',
            siguiente_paso : 'Siguiente Paso ',
        }
    },
    '/login': {
        en: {
            no_tienes_cuenta: 'You do not have an account?',
            registrate: 'Sign up here',
            mail: 'User / Email',
            password: 'Password',
            fgtpswd: 'Forgot your password?',
            restablecer: 'Restore',
            ingresar_como: 'Login as',
            accede_con: 'Or access with',
            necesitas_ayuda: 'Need help?',
            accede_a :'Access our',
            tutoriales : 'tutorials and frequently asked questions',
            descripción_cazatalentos : 'Profile for the person who seeks to "hunt" a person who meets the requirements and the talent that he needs.',
            descripcion_talento : 'Profile for the person looking to appear on screen and film projects.',
            descripcion_representante : 'Profile for the person who seeks to facilitate the connection with their talents and find more opportunities for them.',
        },
        es: {
            no_tienes_cuenta: 'No tienes cuenta?',
            registrate: 'Registrate aquí',
            mail: 'Usuario / Email',
            password: 'Contraseña',
            fgtpswd: 'Olvido su contraseña?',
            restablecer: 'Restablecer',
            ingresar_como: 'Ingresar como',
            accede_con: 'O accede con',
            necesitas_ayuda: 'Necesitas ayuda?',
            accede_a : 'Accede a nuestros',
            tutoriales : 'tutoriales y preguntas frecuentes.',
            descripción_cazatalentos : 'Perfil para la persona que busca “cazar” a una persona que cumpla con los requerimientos y el talento que éste necesita.',
            descripcion_talento : 'Perfil para la persona que busca aparecer en pantalla y proyectos de filmación.',
            descripcion_representante : 'Perfil para la persona que busca facilitar la conexión con sus talentos y encontrar más oportunidades para los mismos.',
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
                const common = COMMON_TEXTS[lang];
                setTexts((by_lang) ? {...by_lang, ...common} : {});
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