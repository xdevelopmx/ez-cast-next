// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { CSSProperties, FC } from 'react'
import { motion } from 'framer-motion'
import { PagePilingComponent } from './PagePilingComponent';
import { Footer } from '../layout';

const estilos: CSSProperties = {
    position: 'absolute',
    width: '100%',
    height: '100vh',
}

interface Props {
    onCambiarPagina?: (pagina: number) => void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const Pagepiling: FC<Props> = ({ onCambiarPagina }) => {

    return (
        <PagePilingComponent onCambiarPagina={onCambiarPagina}>
            <div className="section" style={estilos}>
                <video autoPlay loop muted className="video_bg" poster="/assets/posters/posterhome.png">
                    <source src='/assets/video/video1.mp4' type="video/mp4" />
                </video>
                <video autoPlay loop muted className="video_bg video_mobile" poster="/assets/posters/posterhome.png">
                    <source src="/assets/video/video1.mp4" type="video/mp4" />
                </video>
                <div className="elm_abs w-30">
                    <p className="h2">HAZ CINE Y MÁS</p>
                    <p>“Cuando te embarcas en un proyecto, un sueño, una meta, cada pieza es importante y como un  rompecabezas, es clave encontrar las piezas que embonen y sumen a tu proyecto.</p>
                    <p>En Talent Corner® descubre herramientas increíbles que te ayudarán a traer esa visión a la realidad. ¡Que nadie te cierre la puerta y crea las oportunidades que muchos solo imaginan!” </p>
                </div>
                <a href="#section_1" className="link_bottom">
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="css-i6dzq1">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <polyline points="19 12 12 19 5 12"></polyline>
                    </svg>
                </a>
            </div>

            <div
                className="section"
                style={{
                    ...estilos,
                    backgroundColor: 'rgb(249, 178, 51)',
                    display: 'flex'
                }}
                data-anchor="section_1">
                <div className="row align-items-center no-gutters justify-content-md-around justify-content-center yellow_cap">
                    <div className="col-md-4 col-sm-4 col-5 text-center text-uppercase">
                        <h1 className="titulo_page">Talent<br />Corner</h1>
                    </div>
                    <div className="col-md-2 col-sm-4 col-5 text-md-right text-sm-center">
                        <motion.img src="/assets/img/camara.svg" id="camera" className="mb-2" alt='' />
                        <motion.img src="/assets/img/sombra-camara.svg" id="shadow_camera" alt='' />
                    </div>
                    <div className="col-md-4">
                        <div className="m-4 p-4 d-flex align-items-center projected ">
                            <p className="m-0 talent_corner">
                                Talent Corner® es una plataforma digital que funciona como herramienta de Match Maker a nivel producción en diferentes espacios y ámbitos, para crear, hacer cine o exponer tu talento, reuniendo así a aspirantes que buscan dar sus primeros pasos en el mundo artístico tanto a nivel independiente como profesional, así como personas con experiencia que busquen facilitar, agilizar y realizar sus producciones cinematográficas de una manera más organizada e inteligente.
                                <br /><br />
                                Talent Corner® consta de 3 diferentes secciones, herramientas que van dirigidas a diferente público, englobando un mismo gremio con una misma finalidad en esta Esquina del Talento.
                                <br /><br />
                                Estas son: EZ-CAST, TREEHOUSE Y TALENT +
                                <br /><br />
                                Talent Corner® pone a su disposición herramientas y formatos profesionales para sumar y ejecutar proyectos de todo tipo, ¡Del guión a la pantalla grande! ¡Talent Corner®  sirve también como herramienta de AUTOPROMOCIÓN!

                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="section" style={estilos}>
                <video autoPlay loop muted className="video_bg" poster="/assets/posters/posterhome.png">
                    <source src="/assets/video/TCvideo2.mp4" type="video/mp4" />
                </video>
                <video autoPlay loop muted className="video_bg video_mobile" poster="/assets/posters/posterhome.png">
                    <source src="/assets/video/TCvideo2.mp4" type="video/mp4" />
                </video>
            </div>

            <div className="section" style={estilos}>
                <div className="row no-gutters w-100 h-100" style={{ backgroundColor: "#069cb1" }}>
                    <div className="col-md-6 align-self-center">
                        <div className="p-lg-5 m-3 text-white">
                            <h1>EZ-CAST</h1>
                            <p>EZ-CAST el lugar para los que quieren encontrar y ser encontrados, CASTINGS  </p>
                            <a href="#" className="know_more">Conoce más</a>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="img_talent w-100 h-100 aos-init" style={{ backgroundColor: "#069cb1" }}>
                            <motion.img src="/assets/img/imagen1.jpg" alt='' />
                        </div>
                    </div>
                </div>
            </div>

            <div className="section" style={estilos}>
                <video autoPlay loop muted className="video_bg" poster="/assets/posters/posterprox.png">
                    <source src="/assets/video/TCvideo3.mp4" type="video/mp4" />
                </video>
                <video autoPlay loop muted className="video_bg video_mobile" poster="/assets/posters/posterprox.png">
                    <source src="/assets/video/TCvideo3.mp4" type="video/mp4" />
                </video>
            </div>

            <div className="section" style={estilos}>
                <div className="row no-gutters w-100 h-100" style={{ backgroundColor: 'rgb(78, 177, 6)' }}>
                    <div className="col-md-6 align-self-center">
                        <div className="p-lg-5 m-3 text-white">
                            <h1>TREEHOUSE</h1>
                            <p>PRÓXIMAMENTE</p>
                            <p>¿Una mejor manera de buscar, encontrar, rentar locaciones!</p>
                            <a href="#" className="know_more">Conoce más</a>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="img_talent w-100 h-100 aos-init" style={{ backgroundColor: "#4EB106" }}>
                            <motion.img src="/assets/img/imagen2.jpg" alt='' />
                        </div>
                    </div>
                </div>
            </div>

            <div className="section" style={estilos}>
                <video autoPlay loop muted className="video_bg" poster="/assets/posters/posterprox01.png">
                    <source src="#" type="video/mp4" />
                </video>
                <video autoPlay loop muted className="video_bg video_mobile" poster="/assets/posters/posterprox01.png">
                    <source src="#" type="video/mp4" />
                </video>
            </div>

            <div className="section" style={estilos}>
                <div className="row no-gutters w-100 h-100" style={{ backgroundColor: "#CB1B29" }}>
                    <div className="col-md-6 align-self-center">
                        <div className="p-lg-5 m-3 text-white">
                            <h1>TALENT+</h1>
                            <p>PRÓXIMAMENTE</p>
                            <p>Encuentra al profesional independiente adecuado para comenzar a trabajar en su proyecto en minutos. Todo un mundo de talento autónomo a tu alcance.</p>
                            <a href="#" className="know_more">Conoce más</a>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="img_talent w-100 h-100 aos-init" style={{ backgroundColor: "#CB1B29" }}>
                            <motion.img src="/assets/img/imagen2.jpg" alt='' />
                        </div>
                    </div>
                </div>
            </div>

            <div className="section" style={estilos}>
                <video autoPlay loop muted className="video_bg" poster="/assets/posters/posterprox02.png">
                    <source src="#" type="video/mp4" />
                </video>
                <video autoPlay loop muted className="video_bg video_mobile" poster="/assets/posters/posterprox02.png">
                    <source src="#" type="video/mp4" />
                </video>
                <Footer />
            </div>

        </PagePilingComponent>
    )
}
