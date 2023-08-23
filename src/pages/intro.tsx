import React from "react";
import { MainLayout } from "~/components";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

const IntroPage = () => {
  return (
    <>
      <Head>
        <title>Intro | Talent Corner</title>
        <meta name="description" content="Talent Corner" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MainLayout menuSiempreBlanco={true}>
        <svg
          style={{ position: "absolute", top: "-1000px" }}
          id="icon-1"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          stroke="currentColor"
          stroke-width="2"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
          className="css-i6dzq1"
        >
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>

        <div className="h-50-vh">
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
            }}
          >
            <Image
              src="/assets/img/treehouseintro@1x.jpg"
              className="w-100 h-100 intro_img"
              fill
              alt=""
            />
          </div>
        </div>
        <section className="ezcast_container">
          <div className="intro_container">
            <div className="row align-items-end">
              <div className="col-md-6">
                <h2 className="m-0 text-white">INTRO</h2>
                <h1>EZ-CAST</h1>
              </div>
              <div className="col-md-6">
                <p className="font-weight-bold">
                  Ez-Cast es una sección en Talent Corner, que agiliza, facilita
                  y organiza el proceso de{" "}
                  <span className="font-weight-bold text-white">CASTINGS</span>{" "}
                  para tus producciones Cinematográficas. El encontrar al elenco
                  para tus proyectos no debería ser trabajo difícil, por eso
                  EZ-CAST, una herramienta para quien busca encontrar o ser
                  encontrado, ¡reune al Cazatalento (Quien recluta Talento) y al
                  Talento (Quien busca ser reclutado) en un mismo espacio!
                </p>
              </div>
            </div>
            <hr />
            <p className="text-white font-weight-bold h5">
              Descubre nuestras herramientas:
            </p>
            <div className="row mt-5">
              <div className="col-md-4">
                <div className="d-flex">
                  <div className="mr-3">
                    <Image
                      src="/assets/img/luz-ezcast.svg"
                      width={31.5}
                      height={35}
                      alt=""
                    />
                  </div>
                  <div>
                    <p className="text-white font-weight-bold h5 mb-3">
                      ¿Que es un perfil de Talento?
                    </p>
                    <p className="font-weight-bold">
                      Crea tu perfil, sube tus fotos, comparte tus habilidades,
                      Video Reel y Curriculum, y expon tu persona, y talento en
                      nuestro espacio, además descubre nuestra herramientas que
                      te ayuda grabar tus “selftapes” y mostrar tu portafolio.
                      Descubre las convocatorias abiertas solo para ti, de miles
                      de proyectos de todo tipo, audiciona para más roles que en
                      cualquier otro lugar, todo al alcance de un click!
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="d-flex">
                  <div className="mr-3">
                    <Image
                      src="assets/img/silla-ezcast.svg"
                      width={29}
                      height={35}
                      alt=""
                    />
                  </div>
                  <div>
                    <p className="text-white font-weight-bold h5 mb-3">
                      ¿Que es un perfil Cazatalentos?
                    </p>
                    <p className="font-weight-bold">
                      Crea tu perfil y utiliza la plataforma de Castings más
                      sofisticada y profesional del mundo! Administra y empieza
                      tus proyectos desde cero, busca y encuentra a tu elenco de
                      ensueño, al TALENTO indicado para todos tus proyectos,
                      crea roles y filtros, con las habilidades y aspectos
                      físicos que estas buscando y sorprendente con el talento
                      en nuestra plataforma
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="d-flex">
                  <div className="mr-3">
                    <Image
                      src="/assets/img/EZ_Representante_NS.svg"
                      width={30}
                      height={35}
                      alt=""
                    />
                  </div>
                  <div>
                    <p className="text-white font-weight-bold h5 mb-3">
                      ¿Que es un perfil Representante?
                    </p>
                    <p className="font-weight-bold">
                      Crea tu perfil, y conecta a todos los talentos a tu cargo
                      a un sin número de proyectos, conoce la manera más optima
                      y eficaz de organizar y administrar castings y llamados en
                      tiempo y forma con ayuda de nuestras herramientas.
                      <br />
                      <br />
                      Ten acceso a más oportunidades para ti y tu talento!
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center">
              <a className="inscribete btn btn-intro">Inscríbete ahora</a>
            </div>
            <p className="text-white mt-3">
              Visita nuestro
              <Link
                href={"/ayuda-ezcast"}
                style={{ padding: "0 5px" }}
                className="font-weight-bold text-white text-underline"
              >
                <u>centro de ayuda</u>
              </Link>
              para que te guiemos en la plataforma
            </p>
          </div>
        </section>
        <video id="video-intro-ezcast" autoPlay loop muted playsInline>
          <source src="assets/videos/TCvideo1.mp4" type="video/mp4" />
        </video>
        <div className="pt-3 container_membership_nav">
          <p className="h1 text-center text-uppercase">MEMBRESÍAS</p>
          <div className="d-lg-flex align-items-center justify-content-center text-center">
            <div>
              <span
                className="switch_span active"
                data-tableshow="container_table_01"
              >
                Cazatalentos
              </span>
            </div>
            <div className="mx-4">
              <span className="switch_span" data-tableshow="container_table_02">
                Talento
              </span>
            </div>
            <div>
              <span className="switch_span" data-tableshow="container_table_03">
                Representante
              </span>
            </div>
          </div>
          <div className="d-lg-flex align-items-center">
            <div>
              <div className="annual_monthly m-auto">
                <span>Mensual</span>
                <span>Anual</span>
              </div>
            </div>
            <div>
              <p className="text-center mt-sm-3 ml-lg-3">
                <span className="font-weight-bold color_a">Ahorra un 20%</span>{" "}
                pagando anualmente
              </p>
            </div>
          </div>
        </div>
        <div className="container_table_01 container_menbresias active">
          <div className="pt-3 container_membership" id="price">
            <div className="row justify-content-center">
              <div className="col-md-3">
                <div className="price_tab first_tab">
                  <div className="price_header text-center p-3">
                    <p className="h4 text-uppercase font-weight-bold">
                      Gratuita
                    </p>
                    <p
                      className="h4 text-uppercase font-weight-bold text-white price_descriptor"
                      data-price-month="0"
                      data-price-year="0"
                    >
                      $<span>0</span> MXP
                    </p>
                    <p>
                      <span className="text-white">Prueba Gratis</span> -
                      Limitado a 1 mes
                    </p>
                  </div>
                  <div className="price_intern text-left p-2 pt-3">
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>
                        Limitado a <strong>2</strong> proyectos
                      </p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Expo. Billboard</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>
                        <strong>2</strong> docs. de referencia
                      </p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Alertas correo electrónico</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Personalizar perfil con info.</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Personalizar perfil con info.</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>
                        Creación de <strong>2</strong> personajes (roles)
                      </p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Filtros físicos</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Tutoriales</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Mostrar estatus proyecto</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Descripción de proyecto (párrafo limitado)</p>
                    </div>
                    <div className="text-center">
                      <a className="btn btn-intro btn-price">Suscribir</a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="price_tab">
                  <div className="price_header text-center p-3">
                    <p className="h4 text-uppercase font-weight-bold">
                      STANDARD
                    </p>
                    <p
                      className="h4 text-uppercase font-weight-bold text-white price_descriptor"
                      data-price-month="300"
                      data-price-year="2880"
                    >
                      $<span>300</span> MXP
                    </p>
                    <p>
                      <span className="text-white month_descriptor">
                        /mensual
                      </span>
                    </p>
                  </div>
                  <div className="price_intern text-left p-2 pt-3">
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Crear Proyecto</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Expo. Billboard</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Subir doc. referencia</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Alertas correo electrónico</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Personalizar perfil</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Crear roles (personajes)</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Filtros Físicos</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Hasta # personas, # cuentas</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Tutoriales</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Certificar perfil</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Mostrar estatus del proyecto</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Añadir descripción de proyecto</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Calendario virtual</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>
                        Descripción de personaje (<strong>2</strong>)
                      </p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>
                        Calendario virtual (<strong>2 proyectos</strong>)
                      </p>
                    </div>
                    <div className="text-center">
                      <a className="btn btn-intro btn-price">Suscribir</a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="price_tab penlast_tab">
                  <div className="price_header text-center p-3">
                    <p className="h4 text-uppercase font-weight-bold">
                      PREMIUM
                    </p>
                    <p
                      className="h4 text-uppercase font-weight-bold text-white price_descriptor"
                      data-price-month="600"
                      data-price-year="1200"
                    >
                      $<span>600</span> MXP
                    </p>
                    <p>
                      <span className="text-white month_descriptor">
                        /mensual
                      </span>
                    </p>
                  </div>
                  <div className="price_intern text-left p-2 pt-3">
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Crear Proyecto</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Expo. Billboard</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Subir doc. referencia</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Alertas correo electrónico</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Personalizar perfil</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Crear roles (personajes)</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Filtros Físicos</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Hasta # personas, 5 cuentas</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Tutoriales</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Certificar perfil</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Mostrar estatus del proyecto</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Añadir descripción de proyecto</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Calendario virtual</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Añadir descripción de personaje</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Calendario virtual</p>
                    </div>
                    <div className="text-center">
                      <a className="btn btn-intro btn-price">Suscribir</a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="price_tab last_tab">
                  <div className="price_header text-center p-3">
                    <p className="h4 text-uppercase font-weight-bold">
                      EXECUTIVE
                    </p>
                    <p
                      className="h4 text-uppercase font-weight-bold text-white price_descriptor"
                      data-price-month="1200"
                      data-price-year="2400"
                    >
                      $<span>1200</span> MXP
                    </p>
                    <p>
                      <span className="text-white month_descriptor">
                        /mensual
                      </span>
                    </p>
                  </div>
                  <div className="price_intern text-left p-2 pt-3">
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Crear Proyecto</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Expo. Billboard</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Subir doc. referencia</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Alertas correo electrónico</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Personalizar perfil</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Crear roles (personajes)</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Filtros Físicos</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Hasta # personas, 5 cuentas</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Tutoriales</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Certificar perfil</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Mostrar estatus del proyecto</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Añadir descripción de proyecto</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Calendario virtual</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Añadir descripción de personaje</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Categorías de selección de casting</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Calendario virtual</p>
                    </div>
                    <div className="text-center">
                      <a className="btn btn-intro btn-price">Suscribir</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="container_membership_table">
            <table className="table table-striped price_comparative">
              <thead>
                <tr>
                  <th scope="col">Cazatalento</th>
                  <th
                    className="price_header text-center pt-4 pb-1 px-1"
                    scope="col"
                  >
                    <b>GRATUITA</b>
                    <br />
                    $0 MXP
                    <br />
                    <span>Prueba Gratis</span>
                    <span className="txt_black">- Limitado a 1 mes</span>
                  </th>
                  <th
                    className="price_header text-center p-1 col_standar"
                    scope="col"
                  >
                    <b>STANDARD</b>
                    <br />
                    $300 MXP
                    <br />
                    <span>/mensual</span>
                  </th>
                  <th
                    className="price_header text-center p-1 col_premium"
                    scope="col"
                  >
                    <b>PREMIUM</b>
                    <br />
                    $600 MXP
                    <br />
                    <span>/mensual</span>
                  </th>
                  <th
                    className="price_header text-center p-1 col_executive"
                    scope="col"
                  >
                    <b>EXECUTIVE</b>
                    <br />
                    $1200 MXP
                    <br />
                    <span>/mensual</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Crear perfil (Cuenta)</td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td>Crear Proyecto</td>
                  <td>Limitado a 1</td>
                  <td>Limitado a 3</td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td>Crear Roles</td>
                  <td>Limitado a 3</td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td>Expo. Billboard</td>
                  <td>Lim. 1Proyecto, 3 Roles</td>
                  <td>Lim. 3Proyectos, Roles ilimitados</td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td>Alertas/Correo electrónico</td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td>Personalizar perfil</td>
                  <td>Limitada. (Nom, Pos, 1/3 link, Foto)</td>
                  <td>(Nom, Bio, Pos, Links, Foto)</td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td>Tutoriales</td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td>Notas/Coment. al Talento</td>
                  <td> </td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td># Admin de Cuenta</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>3 cuentas, (T.Extra) $350 Adicionales</td>
                </tr>
                <tr>
                  <td>Landing P. POSTERS</td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td>Verificación Perf.</td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td>Pantalla El Gremio</td>
                  <td></td>
                  <td></td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td>Visibilidad/Alcance Proyecto</td>
                  <td>Limitada</td>
                  <td>Estándar</td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td>Descargar CV</td>
                  <td></td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td>Vista Rapida Calend/Chat</td>
                  <td></td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td>Acceso Perfil Talento</td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td>Descargar Self-tape/Fotos Tal.</td>
                  <td></td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td>Agenda Virtual</td>
                  <td></td>
                  <td>Limitado</td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td>Subir foto referencia Proy.</td>
                  <td>Predeterminada</td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                </tr>
              </tbody>
            </table>
            <table className="boxBtnTable">
              <tbody>
                <tr>
                  <td></td>
                  <td>
                    <button className="btn btn-intro btn-zc-b">
                      Suscribir
                    </button>
                  </td>
                  <td>
                    <button className="btn btn-intro btn-help-subs">
                      Suscribir
                    </button>
                  </td>
                  <td>
                    <button className="btn btn-intro btn-price">
                      Suscribir
                    </button>
                  </td>
                  <td>
                    <button className="btn btn-intro btn-black ">
                      Suscribir
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="container_table_02 container_menbresias">
          <div className="pt-3 container_membership">
            <div className="row justify-content-center">
              <div className="col-md-3">
                <div className="price_tab first_tab">
                  <div className="price_header text-center p-3">
                    <p className="h4 text-uppercase font-weight-bold">
                      Gratuita
                    </p>
                    <p
                      className="h4 text-uppercase font-weight-bold text-white price_descriptor"
                      data-price-month="0"
                      data-price-year="0"
                    >
                      $<span>0</span> MXP
                    </p>
                    <p>
                      <span className="text-white">Prueba Gratis</span> -
                      Limitado a 1 mes
                    </p>
                  </div>
                  <div className="price_intern text-left p-2 pt-3">
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Limitado</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Limitado</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>2 Headshots</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Limit tiempo/GB</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Subir CV</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Vertificar Perfil</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Limitado</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Info. Medidas</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Limitado #Creditos</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Alertas/C. Electr</p>
                    </div>

                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Limitado # veces</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Tutoriales</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Limitado</p>
                    </div>

                    <div className="text-center">
                      <a className="btn btn-intro btn-price">Suscribir</a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="price_tab">
                  <div className="price_header text-center p-3">
                    <p className="h4 text-uppercase font-weight-bold">
                      STANDARD
                    </p>
                    <p
                      className="h4 text-uppercase font-weight-bold text-white price_descriptor"
                      data-price-month="200"
                      data-price-year="166"
                    >
                      $<span>200</span> MXP
                    </p>
                    <p>
                      <span className="text-white month_descriptor">
                        /mensual
                      </span>
                    </p>
                  </div>
                  <div className="price_intern text-left p-2 pt-3">
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Crear Proyecto</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Estándar</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>4 Headshots, pagar por foto</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>1 video reel (3min)</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Subir CV</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Vertificar Perfil</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Skills/Habilidades</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Info. Medidas</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Creditos</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Alertas/C. Electr</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Actualizar/Editar Perfil (V.Previa)</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Tutoriales</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Estándar</p>
                    </div>

                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Casting por Agenda Virtual</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Acceso a Representante</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Preferencias de Role</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Vista Rapida Calenda/Chat</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Agregar Activos</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Almacenar Selftapes</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>3 meses: $550</p>
                    </div>

                    <div className="text-center">
                      <a className="btn btn-intro btn-price">Suscribir</a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="price_tab penlast_tab">
                  <div className="price_header text-center p-3">
                    <p className="h4 text-uppercase font-weight-bold">
                      PREMIUM
                    </p>
                    <p
                      className="h4 text-uppercase font-weight-bold text-white price_descriptor"
                      data-price-month="400"
                      data-price-year="333"
                    >
                      $<span>400</span> MXP
                    </p>
                    <p>
                      <span className="text-white month_descriptor">
                        /mensual
                      </span>
                    </p>
                  </div>
                  <div className="price_intern text-left p-2 pt-3">
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Crear Proyecto</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Expo. Billboard</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Subir Headshots ilimitadas</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Subir Reel</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Subir CV</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Vertificar Perfil</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Skills/Habilidades</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Info. Medidas</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Creditos</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Alertas/C. Electr</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Actualizar/Editar Perfil (V.Previa)</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Tutoriales</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Alcance Buscador de Proyectos</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Casting por Agenda Virtual</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Acceso a Representante</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Preferencias de Role</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Vista Rapida Calenda/Chat</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Agregar Activos</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Almacenar Selftapes</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>3 meses $1100</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Grabar Selftape</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Reel Editado</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Studio Shots, headshots</p>
                    </div>
                    <div className="text-center">
                      <a className="btn btn-intro btn-price">Suscribir</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="container_membership_table">
            <table className="table table-striped price_comparative table_talento">
              <thead>
                <tr>
                  <th scope="col">Talento</th>
                  <th
                    className="price_header text-center pt-4 pb-1 px-1"
                    scope="col"
                  >
                    <b>GRATUITA</b>
                    <br />
                    $0 MXP
                    <br />
                    <span>Prueba Gratis - Limitado a 1 mes</span>
                  </th>
                  <th
                    className="price_header text-center p-1 col_standar"
                    scope="col"
                  >
                    <b>STANDARD</b>
                    <br />
                    $200 MXP
                    <br />
                    <span>/mensual</span>
                  </th>
                  <th
                    className="price_header text-center p-1 col_premium"
                    scope="col"
                  >
                    <b>PREMIUM</b>
                    <br />
                    $400 MXP
                    <br />
                    <span>/mensual</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Crear Perfil/Espec</td>
                  <td>Limitado</td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td>Expo. Billboard</td>
                  <td>Limitado</td>
                  <td>Estándar</td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td>Subir Headshots</td>
                  <td>2 Headshots</td>
                  <td>4 Headshots, pagar por foto</td>
                  <td>Ilimitadas</td>
                </tr>
                <tr>
                  <td>Subir Reel</td>
                  <td>Lim. 1Proyecto, 3 Roles</td>
                  <td>Lim. 3Proyectos, Roles ilimitados</td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td>Subir CV</td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td>Grabar Selftape</td>
                  <td></td>
                  <td></td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td>Reel Editado</td>
                  <td></td>
                  <td></td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td>Vertificar Perfil</td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td>Casting por Agenda Virtual</td>
                  <td></td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td>Skills/Habilidades</td>
                  <td>Limitado</td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td>Info. Medidas</td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td>Creditos</td>
                  <td>Limitado #Creditos</td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td>Alertas/C. Electr</td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td>Studio Shots, headshots</td>

                  <td></td>
                  <td></td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td>Actualizar/Editar Perfil (V.Previa)</td>
                  <td>Limitado # veces</td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td>Acceso a Representante</td>
                  <td></td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td>Preferencias de Role</td>
                  <td></td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td>Vista Rapida Calenda/Chat</td>
                  <td></td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td>Tutoriales</td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td>Alcance Buscador de Proyectos</td>
                  <td>Limitado</td>
                  <td>Estándar</td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td>Agregar Activos</td>
                  <td></td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td>Almacenar Selftapes</td>
                  <td></td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td>PAQUETES:</td>
                  <td></td>
                  <td>3 meses: $550</td>
                  <td>3 meses $1100</td>
                </tr>
              </tbody>
            </table>
            <table className="boxBtnTable">
              <tbody>
                <tr>
                  <td></td>
                  <td>
                    <button className="btn btn-intro btn-zc-b">
                      Suscribir
                    </button>
                  </td>
                  <td>
                    <button className="btn btn-intro btn-help-subs">
                      Suscribir
                    </button>
                  </td>
                  <td>
                    <button className="btn btn-intro btn-price">
                      Suscribir
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="container_table_03 container_menbresias">
          <div className="pt-3 container_membership">
            <div className="row justify-content-center">
              <div className="col-md-3">
                <div className="price_tab">
                  <div className="price_header text-center p-3">
                    <p className="h4 text-uppercase font-weight-bold">
                      STANDARD
                    </p>
                    <p
                      className="h4 text-uppercase font-weight-bold text-white price_descriptor"
                      data-price-month="1200"
                      data-price-year="1000"
                    >
                      $<span>1200</span> MXP
                    </p>
                    <p>
                      <span className="text-white month_descriptor">
                        /mensual
                      </span>
                    </p>
                  </div>
                  <div className="price_intern text-left p-2 pt-3">
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Crear Perfil</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Verif/Seguridad Cuenta</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Limitado # 5 Talentos</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Permisos Admin. Talentos</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Alertas</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Tabla de Aplic. por Talento</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Tutoriales</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Limitado a Membresía Talento</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Estándar</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Mensajes Directos</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Vista Rápida Chat/Calend.</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Acceso Perfil Talento</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Almacenar Selftapes</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>3 mese $3200</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Extras</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Online Store</p>
                    </div>

                    <div className="text-center">
                      <a className="btn btn-intro btn-price">Suscribir</a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="price_tab penlast_tab">
                  <div className="price_header text-center p-3">
                    <p className="h4 text-uppercase font-weight-bold">
                      PREMIUM
                    </p>
                    <p
                      className="h4 text-uppercase font-weight-bold text-white price_descriptor"
                      data-price-month="1500"
                      data-price-year="1200"
                    >
                      $<span>1500</span> MXP
                    </p>
                    <p>
                      <span className="text-white month_descriptor">
                        /mensual
                      </span>
                    </p>
                  </div>
                  <div className="price_intern text-left p-2 pt-3">
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Crear Perfil</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Verif/Seguridad Cuenta</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Añadir Talentos</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Permisos Admin. Talentos</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Alertas</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Tabla de Aplic. por Talento</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Tutoriales</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Subir Media</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Expo. Casting Billboard</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Mensajes Directos</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Vista Rápida Chat/Calend.</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Acceso Perfil Talento</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Almacenar Selftapes</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>3 meses $4000</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Extras</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Online Store</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Agenda Virtual</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Actualizar/Editar Perfil (V.Previa)</p>
                    </div>
                    <div className="d-flex">
                      <svg width="24" height="24" className="mr-3 ml-3">
                        <use href="#icon-1"></use>
                      </svg>
                      <p>Enviar Selftape a Talento</p>
                    </div>

                    <div className="text-center">
                      <a className="btn btn-intro btn-price">Suscribir</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="container_membership_table">
            <table className="table table-striped price_comparative table_representante">
              <thead>
                <tr>
                  <th scope="col">Talento</th>
                  <th
                    className="price_header text-center p-1 col_standar"
                    scope="col"
                  >
                    <b>STANDARD</b>
                    <br />
                    $1200 MXP
                    <br />
                    <span>/mensual</span>
                  </th>
                  <th
                    className="price_header text-center p-1 col_premium"
                    scope="col"
                  >
                    <b>PREMIUM</b>
                    <br />
                    $1500 MXP
                    <br />
                    <span>/mensual</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Crear Perfil</td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td>Verif/Seguridad Cuenta</td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td>Añadir Talentos</td>
                  <td>Limitado # 5 Talentos</td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td>Permisos Admin. Talentos</td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td>Alertas</td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td>Tabla de Aplic. por Talento</td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td>Tutoriales</td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td>Subir Media</td>
                  <td>Limitado a Membresía Talento</td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td>Expo. Casting Billboard</td>
                  <td>Estándar</td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td>Mensajes Directos</td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td>Agenda Virtual</td>
                  <td></td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td>Vista Rápida Chat/Calend.</td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td>Actualizar/Editar Perfil (V.Previa)</td>
                  <td></td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td>Acceso Perfil Talento</td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td>Almacenar Selftapes</td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td>Enviar Selftape a Talento</td>
                  <td></td>
                  <td>
                    <svg width="24" height="24" className="mr-3 ml-3">
                      <use href="#icon-1"></use>
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td>PAQUETES: </td>
                  <td>3 mese $3200</td>
                  <td>3 meses $4000</td>
                </tr>
                <tr>
                  <td>Extras (TODOS)</td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td>Online Store (TODOS)</td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
            <table className="boxBtnTable">
              <tbody>
                <tr>
                  <td></td>
                  <td>
                    <button className="btn btn-intro btn-help-subs">
                      Suscribir
                    </button>
                  </td>
                  <td>
                    <button className="btn btn-intro btn-price">
                      Suscribir
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </MainLayout>
    </>
  );
};

export default IntroPage;
