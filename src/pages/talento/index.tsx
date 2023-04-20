/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { GetServerSideProps, type NextPage } from "next";
import Head from "next/head";
import Image from 'next/image';
import { motion } from 'framer-motion'

import { MainLayout, SlideImagenesLinks } from "~/components";
import Link from "next/link";
import { api } from "~/utils/api";
import { User } from "next-auth";
import { getSession } from "next-auth/react";
import { Carroucel } from "~/components/shared/Carroucel";
import { MContainer } from "~/components/layout/MContainer";
import { Typography } from "@mui/material";
import { useRouter } from "next/router";
import { TipoUsuario } from "~/enums";
import Constants from "~/constants";

type CazaTalentosIndexPageProps = {
  user: User,
}

const CazaTalentosIndexPage: NextPage<CazaTalentosIndexPageProps> = ({user}) => {

  const proyectos = api.proyectos.getProyectosRandom.useQuery(20, {
		refetchOnWindowFocus: false
	});

  const destacados = api.proyectos.getProyectosDestacados.useQuery(10, {
    refetchOnWindowFocus: false
  });

  const router = useRouter();

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
                <Link href={'/talento/dashboard'} style={{ textDecoration: 'none' }}>
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
          {destacados.data && destacados.data.length > 0 &&
             <Carroucel slidesPerView={6}>
               {destacados.data.map((proyecto, i) => {
                return <MContainer key={i} direction='vertical'>
                  <Image onClick={() => { void router.push(`/talento/billboard?id-proyecto=${proyecto.id}`) }} style={{cursor: 'pointer'}} width={250} height={330} src={(proyecto.foto_portada) ? proyecto.foto_portada.url : '/assets/img/no-image.png'} alt="" /> 
                  <Typography onClick={() => { void router.push(`/talento/billboard?id-proyecto=${proyecto.id}`) }} style={{cursor: 'pointer'}} align="center" variant="subtitle1">{proyecto.nombre}</Typography>
                </MContainer>
               })}
             </Carroucel>
          }
          {destacados.data && destacados.data.length === 0 &&
            <>
              <Typography fontSize={'1.5rem'} sx={{ color: '#F9B233' }} fontWeight={400}>Todavia no tienes proyectos destacados</Typography>
              <hr className="mb-5 mt-1 hr_gold" />
            </>
          }
          <div className="banner_slider_full">
            <motion.img src="/assets/img/banner_slider_full.png" alt="icono" />
          </div>
          <p className="mt-5 h5">Ahora casteando en EZ-Cast</p>
          <hr className="hr_blue" />
          <Carroucel slidesPerView={6}>
              {proyectos.data && proyectos.data.map((proyecto, i) => {
                  return <MContainer key={i} direction='vertical'>
                      <Image onClick={() => { void router.push(`/talento/billboard?id-proyecto=${proyecto.id}`) }} style={{cursor: 'pointer'}} width={250} height={330} src={(proyecto.url) ? proyecto.url : '/assets/img/no-image.png'} alt="" /> 
                      <Typography onClick={() => { void router.push(`/talento/billboard?id-proyecto=${proyecto.id}`) }} style={{cursor: 'pointer'}} align="center" variant="subtitle1">{proyecto.nombre}</Typography>
                    </MContainer>
              })}
          </Carroucel>
          <hr className="hr_blue" />
          <div className="d-flex justify-content-end align-items-center">
            <Link href={'/talento/dashboard'} style={{ textDecoration: 'none' }}>
              <p className="mb-0 color_a mr-2">Continuar a EZ-Cast</p>
            </Link>
            <motion.img src="/assets/img/iconos/icon_next_blue.svg" alt="" />
          </div>
        </div>
      </MainLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (session && session.user) {
      if (session.user.tipo_usuario === TipoUsuario.TALENTO) {
          return {
              props: {
                  user: session.user
              }
          }
      } 
      return {
          redirect: {
              destination: `/error?cause=${Constants.PAGE_ERRORS.UNAUTHORIZED_USER_ROLE}`,
              permanent: true
          }
      }
  }
  return {
      redirect: {
          destination: '/',
          permanent: true,
      },
  }
}

export default CazaTalentosIndexPage;