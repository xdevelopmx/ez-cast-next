import { type NextPage } from "next";
import Head from "next/head";

import { motion } from 'framer-motion'

import { MainLayout, SlideImagenesLinks } from "~/components";
import Link from "next/link";

const CazaTalentos: NextPage = () => {


  return (
    <>
      <Head>
        <title>Cazatalentos | Talent Corner</title>
        <meta name="description" content="Talent Corner" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MainLayout menuSiempreBlanco={true}>
        <div className="container_slider_intro">
          <div>
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <p className="color_a mb-0"><b>Proyectos Activos</b></p>
                <p className="mb-5">Ahora siendo casteado…</p>
              </div>
              <div className="d-flex align-items-center">
                <Link href={'/cazatalentos/dashboard'} style={{ textDecoration: 'none' }}>
                  <p className="mb-0 color_a mr-2">Continuar a EZ-Cast</p>
                </Link>
                <motion.img src="/assets/img/iconos/icon_next_blue.svg" alt="icon" />
              </div>
            </div>
            <div className="d-flex">
              <motion.img src="/assets/img/iconos/icon_estrella_dorada.svg" alt="icono" />
              <p className="mb-0 ml-2 h5">Destacados </p>
            </div>
          </div>
          <hr className="mb-1 hr_gold" />
          <SlideImagenesLinks />
          <hr className="mb-5 mt-1 hr_gold" />
          <div className="banner_slider_full">
            <motion.img src="/assets/img/banner_slider_full.png" alt="icono" />
          </div>
          <p className="mt-5 h5">Ahora casteando en EZ-Cast</p>
          <hr className="hr_blue" />
          <SlideImagenesLinks />
          <hr className="hr_blue" />
          <div className="d-flex justify-content-end align-items-center">
            <p className="mb-0 color_a mr-2">Continuar a EZ-Cast</p>
            <motion.img src="/assets/img/iconos/icon_next_blue.svg" alt="" />
          </div>
        </div>
      </MainLayout>
    </>
  );
};

export default CazaTalentos;