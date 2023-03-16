import { motion } from 'framer-motion'

export const Footer = () => {
    return (
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
                            <motion.img height="40" className="d-block" />
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
    )
}
