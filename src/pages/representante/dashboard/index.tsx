import { type GetServerSideProps, type NextPage } from "next";
import Head from "next/head";
import {
  Alertas,
  MainLayout,
  MenuLateral,
  TalentoPreviewShort,
} from "~/components";
import { motion } from "framer-motion";
import { getSession, useSession } from "next-auth/react";
import { TipoUsuario } from "~/enums";
import { type User, type Session } from "next-auth";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Divider,
  Grid,
  Modal,
  Skeleton,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MContainer } from "~/components/layout/MContainer";
import Link from "next/link";
import MotionDiv from "~/components/layout/MotionDiv";
import { useEffect, useMemo, useState } from "react";
import { MTooltip } from "~/components/shared/MTooltip";
import { api, parseErrorBody } from "~/utils/api";
import { FileUploader } from "react-drag-drop-files";
import { FileManager } from "~/utils/file-manager";
import useNotify from "~/hooks/useNotify";

type DashboardRepresentante = {
  user: User;
};

const DashboardPage: NextPage<DashboardRepresentante> = ({ user }) => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const { notify } = useNotify();

  const info = api.representantes.getInfo.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const updatePerfil = api.representantes.updatePerfil.useMutation({
    onSuccess(input) {
      notify("success", "Se actualizo la foto de perfil.");
      info.refetch();
    },
    onError: (error) => {
      notify("error", parseErrorBody(error.message));
    },
  });

  const redes_sociales = useMemo(() => {
    const redes_sociales: { [nombre: string]: string } = {};
    if (info.data && info.data.redes_sociales) {
      info.data.redes_sociales.forEach((red) => {
        redes_sociales[red.nombre] = red.url;
      });
    }
    return redes_sociales;
  }, [info.data]);

  const [new_profile_img, setNewProfileImg] = useState<null | File>(null);

  const saveProfileImage = async () => {
    if (new_profile_img) {
      let url: null | string = null;
      const time = new Date().getTime();
      const base64_img = await FileManager.convertFileToBase64(new_profile_img);
      const to_be_saved: {
        path: string;
        name: string;
        file: File;
        base64: string;
      }[] = [
        {
          path: `representantes/${user.id}/foto-perfil`,
          name: `foto-perfil-representante-${user.id}-${time}`,
          file: new_profile_img,
          base64: base64_img,
        },
      ];
      const urls_saved = await FileManager.saveFiles(to_be_saved);
      if (urls_saved) {
        urls_saved.forEach((u) => {
          const foto_perfil = u[`foto-perfil-representante-${user.id}-${time}`];
          if (foto_perfil) {
            url = foto_perfil.url;
          }
        });
      }
      updatePerfil.mutate({
        foto_perfil: {
          nombre: new_profile_img.name,
          type: new_profile_img.type,
          url: `${url}`,
          clave: `representantes/${user.id}/foto-perfil/foto-perfil-representante-${user.id}-${time}`,
          referencia: `FOTOS-PERFIL-REPRESENTANTE-${user.id}`,
          identificador: `foto-perfil-representante-${user.id}`,
        },
      });
    }
  };

  useEffect(() => {
    if (new_profile_img) {
      saveProfileImage();
    }
  }, [new_profile_img]);

  const talentos_asignados = api.representantes.getTalentosAsignados.useQuery();

  return (
    <>
      <Head>
        <title>Representante | Talent Corner</title>
        <meta name="description" content="Talent Corner" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MainLayout menuSiempreBlanco={true}>
        <div className="d-flex wrapper_ezc">
          <MenuLateral />
          <div className="seccion_container col" style={{ paddingTop: 0 }}>
            <br />
            <br />
            <div className="container_box_header">
              <div className="d-flex justify-content-end align-items-start py-2">
                <Alertas />
              </div>
              <div className="d-flex">
                <p className="color_a h4 font-weight-bold mb-0">
                  {info.isFetching && <Skeleton width={300} />}
                  {!info.isFetching && (
                    <b>
                      Bienvenido, {info.data?.nombre} {info.data?.apellido}
                    </b>
                  )}
                </p>
              </div>
              <Grid container>
                <Grid item xs={12} md={5} sx={{ paddingTop: 3 }}>
                  {info.isFetching && <Skeleton width={300} />}
                  {!info.isFetching && (
                    <Typography fontWeight={900} sx={{ fontSize: "1.4rem" }}>
                      {info.data?.nombre} {info.data?.apellido}
                    </Typography>
                  )}
                  <div
                    style={{
                      position: "relative",
                      width: 350,
                      aspectRatio: "350/420",
                      maxWidth: "100%",
                    }}
                  >
                    <Image
                      fill
                      src={
                        info.data?.foto_perfil
                          ? info.data.foto_perfil.url
                          : "/assets/img/no-user-image.png"
                      }
                      style={{ objectFit: "cover", border: "1px solid #000" }}
                      alt=""
                    />
                  </div>

                  <FileUploader
                    classes={`root`}
                    handleChange={(file: File) => {
                      console.log(file);
                      if (file) {
                        setNewProfileImg(file);
                      }
                    }}
                    name="file"
                    types={["jpg", "png", "gif"]}
                  >
                    <Button sx={{ textTransform: "none" }}>
                      <Typography
                        sx={{ color: "#069cb1", textDecoration: "underline" }}
                      >
                        Cambiar foto de perfil
                      </Typography>
                    </Button>
                  </FileUploader>
                </Grid>
                <Grid item xs={12} md={7} sx={{ paddingTop: 8 }}>
                  <MContainer className="ml-5" direction="vertical">
                    <MContainer
                      styles={{ alignItems: "baseline" }}
                      className={`m-1`}
                      direction="horizontal"
                    >
                      <p style={{ fontSize: 30, fontWeight: 900 }}>
                        Información básica
                      </p>
                      <Button
                        onClick={() => {
                          // eslint-disable-next-line @typescript-eslint/no-floating-promises
                          router.push("/representante/editar-perfil?step=1");
                        }}
                        size="small"
                        sx={{ textTransform: "none", fontSize: "1.1rem" }}
                        className="ml-2 color_a"
                        variant="text"
                      >
                        Editar
                      </Button>
                    </MContainer>
                    <MContainer className={`m-1`} direction="horizontal">
                      {info.isFetching && <Skeleton width={200} />}
                      {!info.isFetching && (
                        <Typography
                          fontSize={"1.2rem"}
                          fontWeight={300}
                          variant="body1"
                        >{`Unión: ${
                          info.data?.info_basica?.union?.id_union === 99
                            ? info.data?.info_basica?.union?.descripcion
                            : info.data?.info_basica?.union?.union.es
                        }`}</Typography>
                      )}
                    </MContainer>
                    <MContainer
                      className={`m-1`}
                      direction="horizontal"
                      styles={{ alignItems: "center" }}
                    >
                      <p
                        style={{
                          display: "flex",
                          alignItems: "center",
                          fontSize: "1.1rem",
                          fontWeight: 100,
                          margin: 0,
                        }}
                      >
                        <span className="badge">
                          <Image
                            width={32}
                            height={32}
                            src="/assets/img/iconos/cart_location_blue.svg"
                            alt=""
                          />{" "}
                        </span>{" "}
                      </p>
                      {info.isFetching && <Skeleton width={200} />}
                      {!info.isFetching && (
                        <Typography
                          fontSize={"1.2rem"}
                          fontWeight={300}
                          variant="body1"
                        >
                          {info.data?.info_basica?.estado_republica.es}
                        </Typography>
                      )}
                    </MContainer>

                    <MContainer
                      className={`m-1`}
                      direction="horizontal"
                      styles={{ alignItems: "center" }}
                    >
                      <p
                        style={{
                          display: "flex",
                          alignItems: "center",
                          fontSize: "1.1rem",
                          fontWeight: 100,
                          margin: 0,
                        }}
                      >
                        <span className="badge">
                          <Image
                            width={32}
                            height={32}
                            src="/assets/img/iconos/icono_web_site_blue.svg"
                            alt=""
                          />{" "}
                        </span>{" "}
                      </p>
                      {info.isFetching && <Skeleton width={200} />}
                      {!info.isFetching && (
                        <Typography
                          fontSize={"1.2rem"}
                          fontWeight={300}
                          variant="body1"
                        >
                          {redes_sociales["pagina_web"]
                            ? redes_sociales["pagina_web"]
                            : "N/A"}
                        </Typography>
                      )}
                    </MContainer>

                    <MContainer className="mt-2 mb-4" direction="horizontal">
                      <MotionDiv show={true} animation="fade">
                        <Button
                          style={{
                            borderRadius: 16,
                            borderWidth: 3,
                            width: 200,
                            textTransform: "none",
                            fontSize: "1.1rem",
                            color: "#000",
                            fontWeight: 600,
                          }}
                          onClick={() => {
                            if (info.data) {
                              window.open(info.data.info_basica?.media?.url);
                            }
                          }}
                          variant="outlined"
                        >
                          <Image
                            style={{ marginRight: 10 }}
                            width={20}
                            height={20}
                            src="/assets/img/iconos/documento.svg"
                            alt=""
                          />
                          Descargar CV
                        </Button>
                      </MotionDiv>
                    </MContainer>
                    <MContainer className={`m-1`} direction="horizontal">
                      <>
                        {
                          /* redes_sociales['vimeo'] != null && */
                          <span className="badge">
                            <Image
                              width={32}
                              height={32}
                              src="/assets/img/iconos/icon_vimeo_blue.svg"
                              alt=""
                            />{" "}
                          </span>
                        }
                        {
                          /* redes_sociales['twitter'] && */
                          <span className="badge">
                            <Image
                              width={32}
                              height={32}
                              src="/assets/img/iconos/icon_Twitwe_blue.svg"
                              alt=""
                            />{" "}
                          </span>
                        }
                        {
                          /* redes_sociales['youtube'] && */
                          <span className="badge">
                            <Image
                              width={32}
                              height={32}
                              src="/assets/img/iconos/icon_youtube_blue.svg"
                              alt=""
                            />{" "}
                          </span>
                        }
                        {
                          /* redes_sociales['linkedin'] && */
                          <span className="badge">
                            <Image
                              width={32}
                              height={32}
                              src="/assets/img/iconos/icon_linkedin_blue.svg"
                              alt=""
                            />{" "}
                          </span>
                        }
                        {
                          /* redes_sociales['instagram'] && */
                          <span className="badge">
                            <Image
                              width={32}
                              height={32}
                              src="/assets/img/iconos/icon_insta_blue.svg"
                              alt=""
                            />{" "}
                          </span>
                        }
                        {
                          /* redes_sociales['imdb'] && */
                          <span className="badge">
                            <Image
                              width={32}
                              height={32}
                              src="/assets/img/iconos/icon_imbd_blue.svg"
                              alt=""
                            />{" "}
                          </span>
                        }
                      </>
                    </MContainer>
                  </MContainer>
                </Grid>
              </Grid>
              <Grid container mt={4} xs={12}>
                <Grid xs={12}>
                  <Typography fontWeight={900} sx={{ color: "#069cb1" }}>
                    Acerca de
                  </Typography>
                  {info.isFetching && <Skeleton width={200} />}
                  {!info.isFetching && (
                    <Typography>{info.data?.biografia}</Typography>
                  )}
                </Grid>
                <Grid xs={12} mt={4}>
                  <Divider />
                </Grid>
                <Grid xs={12} mt={4}>
                  <Typography fontWeight={900}>
                    Representas
                    <Typography
                      fontWeight={900}
                      component={"span"}
                      sx={{ padding: "0px 5px", color: "#069cb1" }}
                    >
                      {talentos_asignados.data?.length ?? 0}
                    </Typography>
                    talentos
                  </Typography>
                  <Typography>
                    Da click en el botón de Nuevo talento para comenzar a
                    agregar talentos.
                  </Typography>

                  <Grid container xs={12} spacing={3} mt={4}>
                    {talentos_asignados.isSuccess &&
                      talentos_asignados.data.map((entry, i) => (
                        <TalentoPreviewShort key={i} talento={entry.talento} />
                      ))}
                  </Grid>

                  <Button
                    className="btn btn-intro btn-price btn_out_line mb-2"
                    startIcon={
                      <Image
                        src={`/assets/img/iconos/cruz_ye.svg`}
                        height={16}
                        width={16}
                        alt={"agregar-rol"}
                        className="filtro-blanco "
                      />
                    }
                    sx={{
                      padding: "8px 40px",
                      marginTop: 0,
                      marginRight: 10,
                      fontWeight: 900,
                      textTransform: "none",
                      color: "#000",
                      backgroundColor: "#f9b233 !important",
                    }}
                    onClick={() => setShowModal(true)}
                  >
                    Nuevo talento
                  </Button>

                  <Button
                    className="btn btn-intro btn-price btn_out_line mb-2"
                    sx={{
                      padding: "8px 40px",
                      marginTop: 0,
                      marginRight: 10,
                      fontWeight: "900 !important",
                      textTransform: "none",
                      color: "#000",
                      border: "2px solid #f9b233",
                      backgroundColor: "#fff",
                      borderRadius: "80px",
                    }}
                  >
                    Administrar talentos
                  </Button>
                </Grid>
              </Grid>
            </div>
          </div>
        </div>

        <Dialog
          fullWidth
          maxWidth={"sm"}
          onClose={() => setShowModal(false)}
          open={showModal}
        >
          <DialogContent sx={{ overflow: "hidden", padding: 0 }}>
            <Grid container sx={{}}>
              <Grid item xs={12}>
                <Typography
                  fontWeight={600}
                  sx={{
                    color: "#069cb1",
                    textAlign: "center",
                    padding: "30px",
                  }}
                >
                  Nuevo Talento
                </Typography>
              </Grid>
              <Grid container item xs={12}>
                <Grid xs={6}>
                  <Button
                    sx={{
                      textTransform: "none",
                      width: "100%",
                      backgroundColor: "#069cb1",
                      color: "#fff",
                      borderRadius: 0,
                      "&:hover": {
                        backgroundColor: "#05acc2",
                      },
                      padding: "30px",
                    }}
                    onClick={() =>
                      router.push("/representante/registrar-talento")
                    }
                  >
                    <Typography>Registrar</Typography>
                  </Button>
                </Grid>
                <Grid xs={6}>
                  <Button
                    sx={{
                      textTransform: "none",
                      width: "100%",
                      padding: "30px",
                    }}
                    onClick={() =>
                      router.push("/representante/invitar-talento")
                    }
                  >
                    <Typography>Invitar a Talento</Typography>
                    <MTooltip
                      color="orange"
                      text={
                        "Link llegará a correo de Talento para que este llene su perfil con todas las especificaciones requeridas."
                      }
                      placement="right"
                    />
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>
      </MainLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  /* if (session && session.user) {
        if (session.user.tipo_usuario === TipoUsuario.TALENTO) {
            return {
                props: {
                    user: session.user,
                }
            }
        } 
         return {
            redirect: {
                destination: `/error?cause=${Constants.PAGE_ERRORS.UNAUTHORIZED_USER_ROLE}`,
                permanent: true
            }
        } 
    } */
  /* return {
        redirect: {
            destination: '/',
            permanent: true,
        },
    } */
  return {
    props: {
      user: session?.user,
    },
  };
};

export default DashboardPage;
