import { type NextPage } from "next";
import Head from "next/head";

import { motion } from 'framer-motion'

import { Alertas, Destacados, Flotantes, ListadoProductos, MainLayout, MenuLateral } from "~/components";

const DashBoardCazaTalentos: NextPage = () => {


  return (
    <>
      <Head>
        <title>DashBoard ~ Cazatalentos | Talent Corner</title>
        <meta name="description" content="Talent Corner" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MainLayout menuSiempreBlanco={true} >
        <div className="d-flex wrapper_ezc">
          <MenuLateral />
          <div className="seccion_container col" style={{ paddingTop: 0 }}>
            <br /><br />
            <div className="container_box_header">
              <div className="d-flex justify-content-end align-items-start py-2">
                <Alertas />
              </div>
              <div className="d-flex">
                <motion.img src="/assets/img/iconos/chair_dir_blue.svg" alt="icono" />
                <p className="color_a h4 font-weight-bold mb-0 ml-2"><b>Bienvenido, Iván</b></p>
              </div>
              <br />
              <div className="row d-lg-flex">
                <div className="mt-2 col-md-6">
                  <p className="h5 font-weight-bold"><b>Requisitos para aprobación:</b></p>
                  <div className="container_text_scroll">
                    <div>
                      <ol>
                        <li>Deberás crear roles específicos.</li>
                        <li>Presentar un resumen que describa
                          tu proyecto.</li>
                        <li>Incluir detalles de mis personajes incluyendo rasgos físicos, personalidad y desarrollo en escena.
                        </li>
                        <li>Si tu proyecto incluye a un menor de edad, la descripción del personaje deberá incluir el número
                          de horas en set y detalles inherentes al personaje</li>
                        <li>Deberás crear roles específicos.</li>
                        <li>Presentar un resumen que describa
                          tu proyecto.</li>
                        <li>Incluir detalles de mis personajes incluyendo rasgos físicos, personalidad y desarrollo en escena.
                        </li>
                        <li>Si tu proyecto incluye a un menor de edad, la descripción del personaje deberá incluir el número
                          de horas en set y detalles inherentes al personaje</li>
                      </ol>
                    </div>
                  </div>
                </div>
                <Destacados />
              </div>
            </div>
            <ListadoProductos />

          </div>
        </div>
      </MainLayout>
      <Flotantes />
    </>
  );
};

export default DashBoardCazaTalentos;