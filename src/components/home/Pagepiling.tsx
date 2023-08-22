// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { CSSProperties, FC, useContext, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { PagePilingComponent } from './PagePilingComponent';
import { Footer } from '../layout';
import useLang from '~/hooks/useLang';
import AppContext from '~/context/app';
import useTimeout from '~/hooks/useDelay';

const estilos: CSSProperties = {
    position: 'absolute',
    width: '100%',
    height: 'auto',
}

interface Props {
    onCambiarPagina?: (pagina: number) => void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const Pagepiling: FC<Props> = ({ onCambiarPagina }) => {
    const ctx = useContext(AppContext);
    const textos = useLang(ctx.lang);

    const finished = useTimeout(1500);

    const [videos_urls, setVideosUrls] = useState<{video2: string, video3: string}>({video2: '', video3: ''});

    useEffect(() => {
        if (finished) {
            fetch('/assets/video/TCvideo2.mp4').then(res => res.blob()).then(res => {
                setVideosUrls(prev => { return {...prev, video2: URL.createObjectURL(res)}})
            })
            fetch('/assets/video/TCvideo3.mp4').then(res => res.blob()).then(res => {
                setVideosUrls(prev => { return {...prev, video3: URL.createObjectURL(res)}})
            })
            console.log('aqui');
        }
    }, [finished]);

    return (
        <PagePilingComponent onCambiarPagina={onCambiarPagina}>
            <div className="section" style={estilos}>
                <video autoPlay loop muted className="video_bg" poster="/assets/posters/posterhome.png">
                    <source src='/assets/video/video1.mp4' type="video/mp4" />
                </video>
                <video autoPlay loop muted className="video_bg video_mobile" poster="/assets/posters/posterhome.png">
                    <source src="/assets/video/video1.mp4" type="video/mp4" />
                </video>
                <div className="elm_abs w-30" dangerouslySetInnerHTML={{__html: (textos['slide_1']) ? textos['slide_1'] : '<p>Texto No definido</p>'}}>
                    {/*
                        <p className="h2">HAZ CINE Y MÁS</p>
                        <p>“Cuando te embarcas en un proyecto, un sueño, una meta, cada pieza es importante y como un  rompecabezas, es clave encontrar las piezas que embonen y sumen a tu proyecto.</p>
                        <p>En Talent Corner® descubre herramientas increíbles que te ayudarán a traer esa visión a la realidad. ¡Que nadie te cierre la puerta y crea las oportunidades que muchos solo imaginan!” </p>
                    */}
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
                        <div className="m-4 p-4 d-flex align-items-center projected " dangerouslySetInnerHTML={{__html: (textos['slide_2']) ? textos['slide_2'] : '<p>Texto No definido</p>'}}>
                            
                        </div>
                    </div>
                </div>
            </div>

            <div className="section" style={estilos}>
                <video autoPlay loop muted className="video_bg" poster="/assets/posters/posterhome.png">
                    <source src={videos_urls.video2} type="video/mp4" />
                </video>
                <video autoPlay loop muted className="video_bg video_mobile" poster="/assets/posters/posterhome.png">
                    <source src={videos_urls.video2} type="video/mp4" />
                </video>
            </div>

            <div className="section" style={estilos}>
                <div className="row no-gutters w-100 h-100" style={{ backgroundColor: "#069cb1" }}>
                    <div className="col-md-6 align-self-center">
                        <div className="p-lg-5 m-3 text-white" >
                            <h1>EZ-CAST</h1>
                            <p>{textos['slide_4'] ? textos['slide_4'] : 'Texto No definido'}</p>
                            <a href="#" className="know_more" style={{textTransform: 'capitalize'}}>{textos['conoce_mas'] ? textos['conoce_mas'] : 'Texto no definido'}</a>
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
                    <source src={videos_urls.video3} type="video/mp4" />
                </video>
                <video autoPlay loop muted className="video_bg video_mobile" poster="/assets/posters/posterprox.png">
                    <source src={videos_urls.video3} type="video/mp4" />
                </video>
            </div>

            <div className="section" style={estilos}>
                <div className="row no-gutters w-100 h-100" style={{ backgroundColor: 'rgb(78, 177, 6)' }}>
                    <div className="col-md-6 align-self-center">
                        <div className="p-lg-5 m-3 text-white">
                            <h1>TREEHOUSE</h1>
                            <p style={{textTransform: 'capitalize'}}>{textos['proximamente'] ? textos['proximamente'] : 'Texto no definido'}</p>
                            <p>{textos['slide_6'] ? textos['slide_6'] : 'Texto no definido'}</p>
                            <a href="#" className="know_more" style={{textTransform: 'capitalize'}}>{textos['conoce_mas'] ? textos['conoce_mas'] : 'Texto no definido'}</a>
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
                            <p style={{textTransform: 'capitalize'}}>{textos['proximamente'] ? textos['proximamente'] : 'Texto no definido'}</p>
                            <p>{textos['slide_8'] ? textos['slide_8'] : 'Texto no definido'}</p>
                            <a href="#" className="know_more" style={{textTransform: 'capitalize'}}>{textos['conoce_mas'] ? textos['conoce_mas'] : 'Texto no definido'}</a>
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
            </div>

        </PagePilingComponent>
    )
}
