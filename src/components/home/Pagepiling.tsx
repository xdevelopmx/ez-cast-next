import Image from 'next/image'
import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { PagePilingComponent } from './PagePilingComponent';


export const Pagepiling = () => {

    return (
        <PagePilingComponent>
            <div className="section">
                <video autoPlay loop muted className="video_bg" poster="assets/posters/posterhome.png">
                    <source src='assets/video/video1.mp4' type="video/mp4" />
                </video>
                <video autoPlay loop muted className="video_bg video_mobile" poster="assets/posters/posterhome.png">
                    <source src="assets/video/video1.mp4" type="video/mp4" />
                </video>
                <div className="elm_abs w-30">
                    <p className="h2">HAZ CINE Y MÁS</p>
                    <p>“Cuando te embarcas en un proyecto, un sueño, una meta, cada pieza es importante y como un  rompecabezas, es clave encontrar las piezas que embonen y sumen a tu proyecto.</p>
                    <p>En Talent Corner® descubre herramientas increíbles que te ayudarán a traer esa visión a la realidad. ¡Que nadie te cierre la puerta y crea las oportunidades que muchos solo imaginan!” </p>
                </div>
                <a href="#section_1" className="link_bottom">
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" className="css-i6dzq1">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <polyline points="19 12 12 19 5 12"></polyline>
                    </svg>
                </a>
            </div>
            <div className="section" data-anchor="section_1">
                <div className="row align-items-center no-gutters justify-content-md-around justify-content-center yellow_cap">
                    <div className="col-md-4 col-sm-4 col-5 text-center text-uppercase">
                        <h1 className="titulo_page">Talent<br />Corner</h1>
                    </div>
                    <div className="col-md-2 col-sm-4 col-5 text-md-right text-sm-center">
                        <motion.img src="assets/img/camara.svg" id="camera" className="mb-2" alt='' />
                        <motion.img src="assets/img/sombra-camara.svg" id="shadow_camera" alt='' />
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
            <div className="section">
                <video autoPlay loop muted className="video_bg" poster="img/posterhome.png">
                    <source src="videos/TCvideo2.mov" type="video/mp4" />
                </video>
                <video autoPlay loop muted className="video_bg video_mobile" poster="img/posterhome.png">
                    <source src="videos/responsive/RD002.mov" type="video/mp4" />
                </video>
            </div>
            <div className="section">
                <div className="row no-gutters w-100 h-100">
                    <div className="col-md-6 align-self-center">
                        <div className="p-lg-5 m-3 text-white" data-animation="fade-up">
                            <h1>EZ-CAST</h1>
                            <p>EZ-CAST el lugar para los que quieren encontrar y ser encontrados, CASTINGS  </p>
                            <a href="#" className="know_more">Conoce más</a>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="img_talent w-100 h-100 aos-init" data-animation="mask_off" style={{ backgroundColor: "#069cb1" }}>
                            {/* <Image src="img/imagen1.jpg" alt='' /> */}
                        </div>
                    </div>
                </div>
            </div>
            <div className="section">
                <video autoPlay loop muted className="video_bg" poster="img/posterprox.png">
                    <source src="videos/TCvideo3.mov" type="video/mp4" />
                </video>
                <video autoPlay loop muted className="video_bg video_mobile" poster="img/posterhome.png">
                    <source src="videos/responsive/RD003.mov" type="video/mp4" />
                </video>
            </div>
            <div className="section">
                <div className="row no-gutters w-100 h-100">
                    <div className="col-md-6 align-self-center">
                        <div className="p-lg-5 m-3 text-white" data-animation="fade-up">
                            <h1>TREEHOUSE</h1>
                            <p>PRÓXIMAMENTE</p>
                            <p>¿Una mejor manera de buscar, encontrar, rentar locaciones!</p>
                            <a href="#" className="know_more">Conoce más</a>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="img_talent w-100 h-100 aos-init" data-animation="mask_off" style={{ backgroundColor: "#4EB106" }}>
                            {/* <Image src="img/imagen2.jpg" alt='' /> */}
                        </div>
                    </div>
                </div>
            </div>
            <div className="section">
                <video autoPlay loop muted className="video_bg" poster="img/posterprox01.png">
                    <source src="#" type="video/mp4" />
                </video>
                <video autoPlay loop muted className="video_bg video_mobile" poster="img/posterprox01.png">
                    <source src="#" type="video/mp4" />
                </video>
            </div>
            <div className="section">
                <div className="row no-gutters w-100 h-100">
                    <div className="col-md-6 align-self-center">
                        <div className="p-lg-5 m-3 text-white" data-animation="fade-up">
                            <h1>TALENT+</h1>
                            <p>PRÓXIMAMENTE</p>
                            <p>Encuentra al profesional independiente adecuado para comenzar a trabajar en su proyecto en minutos. Todo un mundo de talento autónomo a tu alcance.</p>
                            <a href="#" className="know_more">Conoce más</a>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="img_talent w-100 h-100 aos-init" data-animation="mask_off" style={{ backgroundColor: "#CB1B29" }}>
                            {/* <Image src="img/imagen2.jpg" alt='' /> */}
                        </div>
                    </div>
                </div>
            </div>
            <div className="section pp-scrollable">
                <video autoPlay loop muted className="video_bg" poster="img/posterprox02.png">
                    <source src="#" type="video/mp4" />
                </video>
                <video autoPlay loop muted className="video_bg video_mobile" poster="img/posterprox02.png">
                    <source src="#" type="video/mp4" />
                </video>
                <footer className="p-3 p-lg-5">
                    <div className="row justify-content-between">
                        <div className="col-md-4">
                            <div className="row">
                                <div className="col-md-4">
                                    <p className="font-weight-bold">Inicio</p>
                                    <a href="#" className="footer_link">EZ-Cast</a>
                                    <a href="#" className="footer_link">TreeHouse</a>
                                    <a href="#" className="footer_link">Talent+</a>
                                </div>
                                <div className="col-md-4">
                                    <Image src={''} height="40" className="d-block" alt='' />
                                    <a href="#" className="footer_link">Templates</a>
                                    <a href="#" className="footer_link">Online Store</a>
                                    <a href="#" className="footer_link">Tutoriales</a>
                                </div>
                                <div className="col-md-4">
                                    <p className="font-weight-bold">Ayuda</p>
                                    <a href="#" className="footer_link">Tutoriales</a>
                                    <a href="#" className="footer_link">Preguntas frecuentes</a>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3 text-right align-self-end">
                            <p className="m-0">© Talent Corner, 2021</p>
                            <a href="#" className="footer_link d-inline-block">Politica de privacidad</a>
                            <a href="#" className="footer_link d-inline-block">Términos y condiciones</a>
                        </div>
                    </div>
                </footer>
            </div>

        </PagePilingComponent>
    )
}
