export const Footer = () => {
    return (
        <footer className="p-3 p-lg-5">
            <div className="row justify-content-between">
                <div className="col-md-4">
                    <div className="row">
                        <div className="col-md-6"
                            style={{padding: '0 0 0 30px'}}
                        >
                            <p className="font-weight-bold">Inicio</p>
                            <p style={{margin: 0}}><a href="./" className="footer_link">EZ-Cast</a></p>
                            <p style={{margin: 0}}><a href="#" className="footer_link">Online Store</a></p>
                            <p style={{margin: 0}}><a href="#" className="footer_link">TreeHouse</a></p>
                            <p style={{margin: 0}}><a href="#" className="footer_link">Talent+</a></p>
                        </div>
                        <div className="col-md-6">
                            <p className="font-weight-bold">Ayuda</p>
                            <p style={{margin: 0}}><a href="./intro" className="footer_link">Tutoriales</a></p>
                            <p style={{margin: 0}}><a href="./ayuda-ezcast" className="footer_link">Preguntas frecuentes</a></p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 text-right align-self-end">
                    <p className="m-0">© Talent Corner, 2023</p>
                    <a href="#" className="footer_link d-inline-block">Politica de privacidad</a>
                    <a href="#" className="footer_link d-inline-block">Términos y condiciones</a>
                </div>
            </div>
        </footer>
    )
}
