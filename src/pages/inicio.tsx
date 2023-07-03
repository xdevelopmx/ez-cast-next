/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { type GetServerSideProps, type NextPage } from "next";
import Head from "next/head";
import Image from 'next/image';
import { motion } from 'framer-motion'
import { LoaderSlide, MainLayout } from "~/components";
import Link from "next/link";
import { api } from "~/utils/api";
import { type User } from "next-auth";
import { getSession } from "next-auth/react";
import { Carroucel } from "~/components/shared/Carroucel";
import { MContainer } from "~/components/layout/MContainer";
import { Button, Dialog, DialogActions, DialogContent, Typography } from "@mui/material";
//import { useRouter } from "next/router";
import { TipoUsuario } from "~/enums";
import { useRef, useState } from "react";
import { DetallesProyecto } from "~/components/proyecto/detalles";
import { MBanner } from "~/components/shared/MBanner";

type InicioPageProps = {
  user: User,
}

const InicioPage: NextPage<InicioPageProps> = ({ user }) => {

  const [dialog, setDialog] = useState<{ open: boolean, id_proyecto: number }>({ open: false, id_proyecto: 0 });

  const proyectos = api.proyectos.getProyectosRandom.useQuery(20, {
    refetchOnWindowFocus: false
  });

  const destacados = api.proyectos.getProyectosDestacados.useQuery(10, {
    refetchOnWindowFocus: false
  });

  //const router = useRouter();

  const redirect = (user.tipo_usuario) ? (user.tipo_usuario === TipoUsuario.TALENTO) ? '/talento/dashboard' : (user.tipo_usuario === TipoUsuario.CAZATALENTOS) ? '/cazatalentos/dashboard' : '/representante/dashboard' : '';

  const container_ref = useRef<HTMLDivElement>(null);


  const u = api.auth.createUser.useMutation({
    onSettled: () => {
      console.log('xd');
    }
  });


  return (
    <>
      <Head>
        <title>{user.tipo_usuario ? `${user.tipo_usuario?.charAt(0).toUpperCase()}${user.tipo_usuario?.substring(1, user.tipo_usuario.length).toLowerCase()} | Talent Corner` : ''}</title>
        <meta name="description" content="Talent Corner" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MainLayout menuSiempreBlanco={true}>
        <div ref={container_ref} className="container_slider_intro">
          <div>
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <p className="color_a mb-0"
                  style={{
                    fontSize: '30px',
                    fontWeight: '800'
                  }}
                ><b>Proyectos Activos</b></p>
                <p className="mb-5"
                  style={{
                    fontSize: '24px',
                    fontWeight: '400'
                  }}
                >Ahora siendo casteado…</p>
                <Button onClick={( ) => {
                  u.mutate({
                    tipo_usuario: TipoUsuario.CAZATALENTOS,
                    user: {
                      nombre: 'TEST', 
                      apellido: 'TEST', 
                      contrasenia: 'asdasdasd', 
                      usuario: 'TEST', 
                      email: 'test@gmail.com', 
                      profile_img_url: null, 
                      tipo_membresia: 'Gratis',
                      cobro_membresia: 'Anual',
                      id_openpay: null,
                      posicion_o_puesto: null,
                      compania: null,
                      biografia: 'asd'
                    }
                  })
                }}>
                  click
                </Button>
              </div>
              <div className="d-flex align-items-center">
                <Link href={redirect} style={{ textDecoration: 'none' }}>
                  <p className="mb-0 color_a mr-2">Continuar a EZ-Cast</p>
                </Link>
                <motion.img src="/assets/img/iconos/icon_next_blue.svg" alt="icon" />
              </div>
            </div>
            <div className="d-flex">
              <motion.img src="/assets/img/iconos/icon_estrella_dorada.svg" alt="icono" />
              <p className="mb-0 ml-2 h5"
                style={{
                  fontWeight: '800',
                  fontSize: '25px'
                }}
              >
                Destacados
              </p>
            </div>
          </div>
          <hr className="hr_gold" style={{ margin: '20px 0 30px 0' }} />

          {
            destacados.isLoading &&
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
          }

          {destacados.data && destacados.data.length > 0 &&
            <Carroucel
              navigationNew
              navigation={false}
              arrowsColor="#F9B233"
              slidesPerView={6}>

              {
                destacados.data.map((proyecto) => (
                  <MContainer key={proyecto.id} direction='vertical'>
                    <div style={{
                      position: 'relative',
                      width: '100%',
                      aspectRatio: '9/16'
                    }}>
                      <Image
                        onClick={() => { setDialog({ open: true, id_proyecto: proyecto.id }) }}
                        style={{ cursor: 'pointer', border: '1px solid #bababa' }}
                        fill
                        src={(proyecto.foto_portada) ? proyecto.foto_portada.url : '/assets/img/no-image.png'}
                        alt="" />
                    </div>
                    <Typography
                      sx={{
                        padding: '20px 0 0 0',
                        fontWeight: '800',
                        lineHeight: '1.2',
                        fontSize: '23px'
                      }}
                      onClick={() => {
                        setDialog({
                          open: true,
                          id_proyecto: proyecto.id
                        })
                      }}
                      style={{ cursor: 'pointer' }} align="center" variant="subtitle1">
                      {proyecto.nombre}
                    </Typography>
                  </MContainer>
                ))

              }

            </Carroucel>
          }
          <hr className="hr_gold" style={{ margin: '30px 0 40px 0' }} />
          {destacados.data && destacados.data.length === 0 &&
            <>
              <Typography fontSize={'1.5rem'} sx={{ color: '#F9B233' }} fontWeight={400}>Todavia no tienes proyectos destacados</Typography>
              <hr className="mb-5 mt-1 hr_gold" />
            </>
          }
          {container_ref.current &&
            <MBanner show_only_media width={container_ref.current.getBoundingClientRect().width} height={422} identificador="banner-cartelera-proyectos-1" />
          }
          <p className="mt-5 h5"
            style={{
              fontWeight: '800',
              fontSize: '25px'
            }}
          >
            Ahora casteando en EZ-Cast
          </p>
          <hr className="hr_blue"
            style={{ margin: '30px 0 40px 0' }}
          />

          {
            destacados.isLoading &&
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
          }
          {proyectos.data && <Carroucel
            navigationNew
            navigation={false}
            arrowsColor="#069cb1"
            slidesPerView={6}>
            {proyectos.data.map((proyecto, i) => (
              <MContainer key={i} direction='vertical'>
                <div style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '9/16'
                }}>
                  <Image
                    onClick={() => { setDialog({ open: true, id_proyecto: proyecto.id }) }}
                    style={{ cursor: 'pointer', border: '1px solid #bababa' }}
                    src={(proyecto.url) ? proyecto.url : '/assets/img/no-image.png'}
                    fill
                    alt="" />
                </div>
                <Typography
                  onClick={() => { setDialog({ open: true, id_proyecto: proyecto.id }) }}
                  style={{ cursor: 'pointer' }} align="center" variant="subtitle1"
                  sx={{
                    padding: '20px 0 0 0',
                    fontWeight: '800',
                    lineHeight: '1.2',
                    fontSize: '23px'
                  }}
                >
                  {proyecto.nombre}
                </Typography>
              </MContainer>
            ))}
          </Carroucel>}
          <hr className="hr_blue" style={{ margin: '20px 0 20px 0' }} />
          <div className="d-flex justify-content-end align-items-center">
            <Link href={redirect} style={{ textDecoration: 'none' }}>
              <p className="mb-0 color_a mr-2">Continuar a EZ-Cast</p>
            </Link>
            <motion.img src="/assets/img/iconos/icon_next_blue.svg" alt="" />
          </div>
        </div>
        <Dialog
          style={{
            marginTop: 56
          }}
          fullWidth={true}
          maxWidth={'md'}
          open={dialog.open}
          onClose={() => { setDialog({ ...dialog, open: false }) }}
        >
          <DialogContent>
            <DetallesProyecto id_proyecto={dialog.id_proyecto} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => { setDialog({ ...dialog, open: false }) }}>Cerrar</Button>
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
        user: session.user
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

export default InicioPage;