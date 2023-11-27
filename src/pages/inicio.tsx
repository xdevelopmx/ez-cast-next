/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { type GetServerSideProps, type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { motion } from "framer-motion";
import { LoaderSlide, MainLayout } from "~/components";
import Link from "next/link";
import { api } from "~/utils/api";
import { type User } from "next-auth";
import { getSession } from "next-auth/react";
import { Carroucel } from "~/components/shared/Carroucel";
import { MContainer } from "~/components/layout/MContainer";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
} from "@mui/material";
//import { useRouter } from "next/router";
import { TipoUsuario } from "~/enums";
import { useContext, useRef, useState } from "react";
import { DetallesProyecto } from "~/components/proyecto/detalles";
import { MBanner } from "~/components/shared/MBanner";
import AppContext from "~/context/app";
import useLang from "~/hooks/useLang";

const urlBanners = [
  {
    url: '/assets/img/banners/1.png'
  },
  {
    url: '/assets/img/banners/2.png'
  },
  {
    url: '/assets/img/banners/3.png'
  },
  {
    url: '/assets/img/banners/4.png'
  },
  {
    url: '/assets/img/banners/5.png'
  },
  {
    url: '/assets/img/banners/6.png'
  },
  {
    url: '/assets/img/banners/8.png'
  },
  {
    url: '/assets/img/banners/13.png'
  },
  {
    url: '/assets/img/banners/14.png'
  },
]

type InicioPageProps = {
  user: User;
};

const InicioPage: NextPage<InicioPageProps> = ({ user }) => {
  const ctx = useContext(AppContext);
  const textos = useLang(ctx.lang);

  const [dialog, setDialog] = useState<{ open: boolean; id_proyecto: number }>({
    open: false,
    id_proyecto: 0,
  });

  const proyectos = api.proyectos.getProyectosEnCartelera.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const destacados = api.proyectos.getProyectosDestacados.useQuery(10, {
    refetchOnWindowFocus: false,
  });

  console.log(proyectos.data);

  const banners = api.banners.getBannersByRef.useQuery('banners-cartelera-proyectos', {
    refetchOnWindowFocus: false
  });

  //const router = useRouter();

  const redirect = user.tipo_usuario
    ? user.tipo_usuario === TipoUsuario.TALENTO
      ? "/talento/dashboard"
      : user.tipo_usuario === TipoUsuario.CAZATALENTOS
      ? "/cazatalentos/dashboard"
      : "/representante/dashboard"
    : "";

  const container_ref = useRef<HTMLDivElement>(null);

  return (
    <>
      <Head>
        <title>
          {user.tipo_usuario
            ? `${user.tipo_usuario?.charAt(0).toUpperCase()}${user.tipo_usuario
                ?.substring(1, user.tipo_usuario.length)
                .toLowerCase()} | Talent Corner`
            : ""}
        </title>
        <meta name="description" content="Talent Corner" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MainLayout menuSiempreBlanco={true}>
        <div ref={container_ref} className="container_slider_intro">
          <div>
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <p
                  className="color_a mb-0"
                  style={{
                    fontSize: "26px",
                    fontWeight: "800",
                    lineHeight: "25px",
                  }}
                >
                  <b>
                    {textos["proyectos_activos"]
                      ? textos["proyectos_activos"]
                      : "Texto No definido"}
                  </b>
                </p>
                <p
                  className="mb-5"
                  style={{
                    fontSize: "20px",
                    fontWeight: "600",
                  }}
                >
                  {textos["ahora_siendo_casteado"]
                    ? textos["ahora_siendo_casteado"]
                    : "Texto No definido"}
                </p>
              </div>
              <div className="d-flex align-items-center">
                <Link href={redirect} style={{ textDecoration: "none" }}>
                  <p
                    className="mb-0 color_a mr-2"
                    style={{
                      fontWeight: 600,
                      fontSize: "1.2rem",
                    }}
                  >
                    {textos["continuar_a_ezcast"]
                      ? textos["continuar_a_ezcast"]
                      : "Texto No definido"}
                  </p>
                </Link>
                <motion.img
                  src="/assets/img/iconos/icon_next_blue.svg"
                  alt="icon"
                />
              </div>
            </div>
            <div className="d-flex">
              <motion.img
                src="/assets/img/iconos/icon_estrella_dorada.svg"
                alt="icono"
              />
              <p
                className="mb-0 ml-2 h5"
                style={{
                  fontWeight: "600",
                  fontSize: "24px",
                  textTransform: "capitalize",
                }}
              >
                {textos["destacados"]
                  ? textos["destacados"]
                  : "Texto No definido"}
              </p>
            </div>
          </div>
          <hr className="hr_gold" style={{ margin: "10px 0 30px 0" }} />

          {destacados.isLoading && (
            <Carroucel
              navigationNew
              navigation={false}
              arrowsColor="#F9B233"
              slidesPerView={6}
              spaceBetween={5}
            >
              {Array.from({ length: 10 }).map((_, i) => (
                <LoaderSlide key={i} />
              ))}
            </Carroucel>
          )}

          {destacados.data && destacados.data.length > 0 && (
            <Carroucel
              navigationNew
              navigation={false}
              arrowsColor="#F9B233"
              slidesPerView={destacados.data.length >= 6 ? 6 : destacados.data.length}
              spaceBetween={30}
            >
              {destacados.data.map((proyecto) => (
                <MContainer key={proyecto.id} direction="vertical">
                  <div
                    style={{
                      position: "relative",
                      width: "90%",
                      aspectRatio: "9/13",
                      margin: "auto",
                    }}
                  >
                    <Image
                      onClick={() => {
                        setDialog({ open: true, id_proyecto: proyecto.id });
                      }}
                      style={{ cursor: "pointer", border: "1px solid #bababa" }}
                      fill
                      src={
                        proyecto.foto_portada
                          ? proyecto.foto_portada.url
                          : "/assets/img/no-image.png"
                      }
                      alt=""
                    />
                  </div>
                  <Typography
                    sx={{
                      padding: "40px 0 0 0",
                      fontWeight: "800",
                      lineHeight: "1.2",
                      fontSize: "18px",
                    }}
                    onClick={() => {
                      setDialog({
                        open: true,
                        id_proyecto: proyecto.id,
                      });
                    }}
                    style={{ cursor: "pointer" }}
                    align="center"
                    variant="subtitle1"
                  >
                    {proyecto.nombre}
                  </Typography>
                </MContainer>
              ))}
            </Carroucel>
          )}
          <hr className="hr_gold" style={{ margin: "30px 0 40px 0" }} />
          {destacados.data && destacados.data.length === 0 && (
            <>
              <Typography
                fontSize={"1.3rem"}
                sx={{ color: "#F9B233" }}
                fontWeight={400}
              >
                Todavía no tienes proyectos destacados
              </Typography>
              <hr className="mb-5 mt-1 hr_gold" />
            </>
          )}
          {container_ref.current && (
            <Carroucel
              navigationNew
              navigation={false}
              arrowsColor="#F9B233"
              slidesPerView={1}
              autoplay={{
                delay: 5000
              }}
              forceFirstSwap={{
                delay: 5000
              }}
              spaceBetween={0}
            >
              {banners.data && banners.data.map((banner, i) => {
                return (
                  <div key={i} style={{width: '1000px', margin: '0 auto'}}>
                  <MBanner
                    show_only_media
                    width={1000}
                    height={222}
                    imageStyles={{
                      width: "100%",
                      margin: 0
                    }}
                    urlImage={banner.content.url}
                    identificador={banner.identificador}
                  />
                </div>
                )
              })}
          </Carroucel>
          )}
          <br />
          <p
              className="mb-2 ml-2 h5"
              style={{
                fontWeight: "600",
                fontSize: "24px",
                textTransform: "capitalize",
              }}
            >
              {textos["ahora_castenado_en_ezcast"]
            ? textos["ahora_castenado_en_ezcast"]
            : "Texto No definido"}
          </p>
          <hr className="hr_blue" style={{ margin: "0px 0 40px 0" }} />

          {proyectos.isLoading && (
            <Carroucel
              navigationNew
              navigation={false}
              arrowsColor="#F9B233"
              slidesPerView={6}
              spaceBetween={5}
            >
              {Array.from({ length: 10 }).map((_, i) => (
                <LoaderSlide key={i} />
              ))}
            </Carroucel>
          )}
          {proyectos.data && (
            <Carroucel
              navigationNew
              navigation={false}
              arrowsColor="#069cb1"
              slidesPerView={proyectos.data.length >= 6 ? 6 : proyectos.data.length}
              spaceBetween={30}
            >
              {proyectos.data.map((proyecto, i) => (
                <MContainer key={i} direction="vertical">
                  <div
                    style={{
                      position: "relative",
                      width: "90%",
                      aspectRatio: "9/13",
                      margin: "auto",
                    }}
                  >
                    <Image
                      onClick={() => {
                        setDialog({ open: true, id_proyecto: proyecto.id });
                      }}
                      style={{ cursor: "pointer", border: "1px solid #bababa" }}
                      src={
                        proyecto.foto_portada ? proyecto.foto_portada.url : "/assets/img/no-image.png"
                      }
                      fill
                      alt=""
                    />
                  </div>
                  <Typography
                    onClick={() => {
                      setDialog({ open: true, id_proyecto: proyecto.id });
                    }}
                    style={{ cursor: "pointer" }}
                    align="center"
                    variant="subtitle1"
                    sx={{
                      padding: "40px 0 0 0",
                      fontWeight: "800",
                      lineHeight: "1.2",
                      fontSize: "18px",
                    }}
                  >
                    {proyecto.nombre}
                  </Typography>
                </MContainer>
              ))}
            </Carroucel>
          )}
          <hr className="hr_blue" style={{ margin: "20px 0 20px 0" }} />
          <div className="d-flex justify-content-end align-items-center">
            <Link href={redirect} style={{ textDecoration: "none" }}>
              <p className="mb-0 color_a mr-2 fw-600">
                {textos["continuar_a_ezcast"]
                  ? textos["continuar_a_ezcast"]
                  : "Texto No definido"}
              </p>
            </Link>
            <motion.img src="/assets/img/iconos/icon_next_blue.svg" alt="" />
          </div>
        </div>
        <Dialog
          style={{
            marginTop: 56,
          }}
          fullWidth={true}
          maxWidth={"md"}
          open={dialog.open}
          onClose={() => {
            setDialog({ ...dialog, open: false });
          }}
        >
          <DialogContent>
            <DetallesProyecto
              minHeight={532}
              id_proyecto={dialog.id_proyecto}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setDialog({ ...dialog, open: false });
              }}
            >
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>
      </MainLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (session && session.user) {
    return {
      props: {
        user: session.user,
      },
    };
  }
  return {
    redirect: {
      destination: "/",
      permanent: true,
    },
  };
};

export default InicioPage;
