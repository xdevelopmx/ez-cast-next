import React, {
  type CSSProperties,
  useEffect,
  useMemo,
  useState,
  useContext,
} from "react";
import Link from "next/link";
import {
  Grid,
  IconButton,
  Button,
  Typography,
  Skeleton,
  Box,
} from "@mui/material";
import { motion } from "framer-motion";
import { CameraAlt, Close } from "@mui/icons-material";
import { FormGroup } from "../shared/FormGroup";
import { MContainer } from "../layout/MContainer";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { api, parseErrorBody } from "~/utils/api";
import { useSession } from "next-auth/react";
import { TipoUsuario } from "~/enums";
import useNotify from "~/hooks/useNotify";
import { type Archivo } from "~/server/api/root";
import { FileManager } from "~/utils/file-manager";
import { useRouter } from "next/router";
import AppContext from "~/context/app";
import useLang from "~/hooks/useLang";
import { useTheme } from '@mui/material/styles';
type Props = {
  stylesRoot?: CSSProperties;
};

export const MenuLateral = ({ stylesRoot }: Props) => {
  const [form, setForm] = useState<{
    tipo_usuario: string;
    nombre: string;
    biografia?: string;
    redes_sociales: { [nombre: string]: string };
    posicion: string;
    compania: string;
    foto_perfil: string;
    foto_selected: Archivo | null;
  }>({
    tipo_usuario: TipoUsuario.NO_DEFINIDO,
    nombre: "",
    biografia: "",
    redes_sociales: {
      pagina_web: "",
      vimeo: "",
      youtube: "",
      linkedin: "",
      instagram: "",
      twitter: "",
      imdb: "",
    },

    posicion: "",
    compania: "",
    foto_selected: null,
    foto_perfil: "",
  });
  const ctx = useContext(AppContext);
  const textos = useLang(ctx.lang);
  const router = useRouter();
  const { id_talento } = router.query;
  const [edit_mode, setEditMode] = useState(false);
  const session = useSession();
  const theme = useTheme();
  const cazatalentos = api.cazatalentos.getPerfilById.useQuery(
    session && session.data?.user?.tipo_usuario === TipoUsuario.CAZATALENTOS
      ? parseInt(session.data.user.id)
      : 0,
    {
      refetchOnWindowFocus: false,
    }
  );

  const representante = api.representantes.getInfo.useQuery(
    session && session.data?.user?.tipo_usuario === TipoUsuario.REPRESENTANTE
      ? parseInt(session.data.user.id)
      : 0,
    {
      refetchOnWindowFocus: false,
    }
  );

  const talento = api.talentos.getById.useQuery(
    {
      id:
        session && session.data?.user?.tipo_usuario === TipoUsuario.TALENTO
          ? parseInt(session.data.user.id)
          : 0,
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  const talento_representado = api.talentos.getById.useQuery(
    { id: id_talento ? parseInt(id_talento as string) : 0 },
    {
      refetchOnWindowFocus: false,
    }
  );

  const info_gral_talento = api.talentos.getInfoBasicaByIdTalento.useQuery(
    {
      id:
        session && session.data?.user?.tipo_usuario === TipoUsuario.TALENTO
          ? parseInt(session.data.user.id)
          : 0,
    },
    {
      refetchOnWindowFocus: false,
    }
  );
  const media_por_talento = api.talentos.getMediaByIdTalento.useQuery(
    { id: talento.data ? talento.data.id : 0 },
    {
      refetchOnWindowFocus: false,
    }
  );

  const { notify } = useNotify();

  const profile_img_talento_representado = talento_representado.data
    ? talento_representado.data.media.filter((m) =>
      m.media.identificador.includes("foto-perfil")
    )[0]?.media.url
    : undefined;

  const update_perfil_talento = api.talentos.updatePerfil.useMutation({
    onSuccess: (_, input) => {
      notify("success", `${textos["success_update_talento"] ?? ""}`);
      setEditMode(false);
      void talento.refetch();
      void media_por_talento.refetch();
    },
    onError: (error) => {
      notify("error", parseErrorBody(error.message));
    },
  });

  const update_perfil_cazatalento = api.cazatalentos.updatePerfil.useMutation({
    onSuccess: (_, input) => {
      notify("success", `${textos["success_update_cazatalento"] ?? ""}`);
      setEditMode(false);
      void cazatalentos.refetch();
    },
    onError: (error) => {
      notify("error", parseErrorBody(error.message));
    },
  });

  const update_perfil_representante =
    api.representantes.updatePerfil.useMutation({
      onSuccess: (_, input) => {
        notify("success", `${textos["success_update_representante"] ?? ""}`);
        setEditMode(false);
        void representante.refetch();
      },
      onError: (error) => {
        notify("error", parseErrorBody(error.message));
      },
    });

  const is_fetching =
    talento.isFetching ||
    info_gral_talento.isFetching ||
    cazatalentos.isFetching ||
    representante.isFetching ||
    talento_representado.isFetching;

  const user_info = useMemo(() => {
    if (session.data && session.data.user) {
      switch (session.data.user.tipo_usuario) {
        case TipoUsuario.TALENTO: {
          if (talento.data && info_gral_talento.data) {
            let foto_perfil = "";
            if (talento.data) {
              const foto = talento.data.media.filter((m) =>
                m.media.identificador.includes("foto-perfil-talento")
              )[0];
              if (foto) {
                foto_perfil = foto.media.url;
              }
            }
            return {
              tipo_usuario: TipoUsuario.TALENTO,
              nombre: talento.data.nombre,
              apellido: talento.data.apellido,
              biografia: info_gral_talento.data.info_basica?.biografia,
              redes_sociales: {},
              foto_perfil: foto_perfil,
            };
          }
        }
        case TipoUsuario.CAZATALENTOS: {
          if (cazatalentos.data) {
            const redes_sociales: { [red_social: string]: string } = {};
            cazatalentos.data.redes_sociales.forEach((red) => {
              redes_sociales[red.nombre] = red.url;
            });
            let foto_perfil = "";
            if (cazatalentos.data.foto_perfil) {
              foto_perfil = cazatalentos.data.foto_perfil.url;
            }
            return {
              tipo_usuario: TipoUsuario.CAZATALENTOS,
              nombre: cazatalentos.data.nombre,
              apellido: cazatalentos.data.apellido,
              biografia: cazatalentos.data.biografia,
              redes_sociales: redes_sociales,

              posicion: cazatalentos.data.posicion,
              compania: cazatalentos.data.compania,
              foto_perfil: foto_perfil,
            };
          }
        }
        case TipoUsuario.REPRESENTANTE: {
          if (representante.data) {
            const redes_sociales: { [red_social: string]: string } = {};
            representante.data.redes_sociales.forEach((red) => {
              redes_sociales[red.nombre] = red.url;
            });
            let foto_perfil = "";
            if (representante.data.foto_perfil) {
              foto_perfil = representante.data.foto_perfil.url;
            }
            return {
              tipo_usuario: TipoUsuario.REPRESENTANTE,
              nombre: representante.data.nombre,
              apellido: representante.data.apellido,
              biografia: representante.data.biografia,
              redes_sociales: redes_sociales,
              posicion: representante.data.posicion,
              compania: representante.data.compania,
              foto_perfil: foto_perfil,
            };
          }
        }
      }
    }
    return null;
  }, [
    session,
    cazatalentos.data,
    talento.data,
    info_gral_talento.data,
    representante.data,
  ]);

  useEffect(() => {
    if (user_info) {
      setForm({
        tipo_usuario: user_info.tipo_usuario,
        nombre: user_info.nombre,
        biografia: user_info.biografia,
        redes_sociales: user_info.redes_sociales,
        posicion: user_info.posicion || "",
        compania: user_info.compania || "",
        foto_selected: null,
        foto_perfil: user_info.foto_perfil,
      });
    }
  }, [user_info]);

  const foto_perfil = useMemo(() => {
    if (form.foto_selected) {
      return form.foto_selected.base64;
    } else {
      if (form.foto_perfil !== "") {
        return form.foto_perfil;
      }
      return "/assets/img/no-user-image.png";
    }
  }, [form.foto_perfil, form.foto_selected]);

  return (
    <>
      <div
        className="menu_container text-center ezcast_container"
        style={{ position: "relative", ...stylesRoot }}
      >
        <motion.div
          style={{
            position: "absolute",
            width: "80%",
            left: "10%",
            height:
              user_info && user_info.tipo_usuario === TipoUsuario.TALENTO
                ? "550px"
                : user_info &&
                  user_info.tipo_usuario === TipoUsuario.CAZATALENTOS
                  ? "calc(75vh)"
                  : "calc(75vh)",
            overflowY:
              user_info && user_info.tipo_usuario === TipoUsuario.TALENTO
                ? "visible"
                : "scroll",
            boxShadow:
              "rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
            top: 32,
            borderRadius: 4,
            zIndex: 99,
            backgroundColor: "white",
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={
            edit_mode ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }
          }
          exit={{ opacity: 0, scale: 0 }}
          transition={{
            ease: "linear",
            duration: 0.4,
            opacity: { duration: 0.4 },
            scale: { duration: 0.4 },
          }}
        >
          <IconButton
            style={{
              position: "absolute",
              right: 0,
              color: "#069cb1",
            }}
            aria-label="Cancelar edicion usuario"
            onClick={() => {
              setEditMode((edit) => !edit);
            }}
          >
            <Close />
          </IconButton>
          <Grid container justifyContent="center">
            <Grid item xs={12}>
              <div
                className="mt-3 mb-3 avatar"
                style={{ position: "relative" }}
              >
                <motion.img width={128} src={foto_perfil} alt="avatar" />
                <IconButton
                  style={{
                    position: "absolute",
                    top: "35%",
                    left: "35%",
                    color: user_info?.foto_perfil === "" ? "black" : "white",
                  }}
                  aria-label="Cancelar edicion usuario"
                >
                  <CameraAlt />
                </IconButton>
              </div>
              <Button
                color={"inherit"}
                style={{ textDecoration: "underline", fontWeight: 800 }}
                variant="text"
                component="label"
              >
                {textos["cambiar"] ? textos["cambiar"] : "Texto No Definido"}{" "}
                {textos["foto"] ? textos["foto"] : "Texto No Definido"}
                <input
                  onChange={(ev) => {
                    if (ev.target.files) {
                      const file = ev.target.files[0];
                      if (file) {
                        void FileManager.convertFileToBase64(file).then(
                          (base64) => {
                            setForm({
                              ...form,
                              foto_selected: {
                                base64: base64,
                                name: file.name,
                                file: file,
                              },
                            });
                          }
                        );
                      }
                    }
                  }}
                  hidden
                  accept="image/png, image/jpg, image/jpeg"
                  type="file"
                />
              </Button>
            </Grid>
            <Grid
              item
              xs={12}
              sx={{ mt: 4, padding: '0 20px' }}
              textAlign={"start"}
              maxHeight={"95vh"}
            >
              <MContainer
                direction="vertical"
                styles={{ alignContent: "space-around" }}
              >
                <FormGroup
                  show_error_message={false}
                  error={(() => {
                    if (form.nombre.length === 0) {
                      return textos["field_cant_be_empty"]
                        ? textos["field_cant_be_empty"].replace(
                          "[CAMPO]",
                          textos["nombre"]
                            ? textos["nombre"]
                            : "Texto No Definido"
                        )
                        : "Texto No Definido";
                    }
                    return undefined;
                  })()}
                  style={{ width: 200, maxWidth: '100%' }}
                  labelStyle={{
                    marginBottom: '0',
                    fontWeight: 800,
                    fontSize: "0.8rem",
                    textAlign: "start",
                    color: "#069cb1",
                  }}
                  value={form.nombre}
                  onChange={(e) => {
                    setForm({ ...form, nombre: e.target.value });
                  }}
                  label={`${textos["nombre"] ? textos["nombre"] : "Texto No Definido"
                    }*`}
                />
              </MContainer>
            </Grid>

            {user_info &&
              user_info.tipo_usuario === TipoUsuario.CAZATALENTOS && (
                <>
                  <Grid item xs={12} textAlign={"start"} sx={{ padding: '0 20px' }}>
                    <MContainer
                      direction="vertical"
                      styles={{ alignContent: "space-around" }}
                    >
                      <FormGroup
                        show_error_message={false}
                        error={(() => {
                          /* if (form.nombre.length === 0) {
                          return 'El nombre no debe estar vacio';
                        } */
                          return undefined;
                        })()}
                        style={{ width: 200, maxWidth: '100%' }}
                        labelStyle={{
                          marginBottom: '0',
                          fontWeight: 800,
                          fontSize: "0.8rem",
                          textAlign: "start",
                          color: "#069cb1",
                        }}
                        value={form.posicion}
                        onChange={(e) => {
                          setForm({ ...form, posicion: e.target.value });
                        }}
                        label="Posición"
                      />
                    </MContainer>
                  </Grid>

                  <Grid item xs={12} textAlign={"start"} sx={{ padding: '0 20px' }}>
                    <MContainer
                      direction="vertical"
                      styles={{ alignContent: "space-around" }}
                    >
                      <FormGroup
                        show_error_message={false}
                        error={(() => {
                          /* if (form.nombre.length === 0) {
                          return 'El nombre no debe estar vacio';
                        } */
                          return undefined;
                        })()}
                        style={{ width: 200, maxWidth: '100%' }}
                        labelStyle={{
                          marginBottom: '0',
                          fontWeight: 800,
                          fontSize: "0.8rem",
                          textAlign: "start",
                          color: "#069cb1",
                        }}
                        value={form.compania}
                        onChange={(e) => {
                          setForm({ ...form, compania: e.target.value });
                        }}
                        label="Compañia"
                      />
                    </MContainer>
                  </Grid>
                </>
              )}

            <Grid item xs={12} textAlign={"start"} sx={{ padding: '0 20px' }}>
              <MContainer
                direction="vertical"
                styles={{ alignContent: "space-around", textAlign: "center" }}
              >
                <FormGroup
                  type={"text-area"}
                  style={{ width: 200, maxWidth: '100%' }}
                  labelStyle={{
                    marginBottom: '0',
                    width: 200, maxWidth: '100%',
                    fontWeight: 800,
                    fontSize: "0.8rem",
                    textAlign: "start",
                    color: "#069cb1",
                  }}
                  value={form.biografia}
                  rows={2}
                  onChange={(e) => {
                    setForm({ ...form, biografia: e.target.value });
                  }}
                  label={
                    textos["biografia"]
                      ? textos["biografia"]
                      : "Texto No Definido"
                  }
                />
              </MContainer>
            </Grid>

            {user_info &&
              [TipoUsuario.CAZATALENTOS, TipoUsuario.REPRESENTANTE].includes(
                user_info.tipo_usuario
              ) && (
                <>
                  <Grid item xs={12} textAlign={"start"} sx={{ padding: '0 20px' }}>
                    <MContainer
                      direction="vertical"
                      styles={{ alignContent: "space-around" }}
                    >
                      <FormGroup
                        show_error_message={false}
                        error={(() => {
                          /* if (form.nombre.length === 0) {
                          return 'El nombre no debe estar vacio';
                        } */
                          return undefined;
                        })()}
                        style={{ width: 200, maxWidth: '100%' }}
                        labelStyle={{
                          marginBottom: '0',
                          fontWeight: 800,
                          fontSize: "0.8rem",
                          textAlign: "start",
                          color: "#069cb1",
                        }}
                        value={form.redes_sociales.pagina_web}
                        onChange={(e) => {
                          setForm({
                            ...form,
                            redes_sociales: {
                              ...form.redes_sociales,
                              pagina_web: e.target.value,
                            },
                          });
                        }}
                        label="Link a página web"
                      />
                    </MContainer>
                  </Grid>

                  <Grid item xs={12} textAlign={"start"} sx={{ padding: '0 20px' }}>
                    <MContainer
                      direction="vertical"
                      styles={{ alignContent: "space-around" }}
                    >
                      <Typography>Link a redes sociales:</Typography>
                      <FormGroup
                        icon={{
                          element: (
                            <Image
                              src="/assets/img/iconos/icon_vimeo_blue.svg"
                              style={{ marginLeft: 10 }}
                              width="20"
                              height="30"
                              alt=""
                            />
                          ),
                          position: "end",
                        }}
                        show_error_message={false}
                        error={(() => {
                          /* if (form.nombre.length === 0) {
                          return 'El nombre no debe estar vacio';
                        } */
                          return undefined;
                        })()}
                        style={{ width: 200, maxWidth: '100%' }}
                        labelStyle={{
                          marginBottom: '0',
                          fontWeight: 800,
                          fontSize: "0.8rem",
                          textAlign: "start",
                          color: "#069cb1",
                        }}
                        value={form.redes_sociales.vimeo}
                        onChange={(e) => {
                          setForm({
                            ...form,
                            redes_sociales: {
                              ...form.redes_sociales,
                              vimeo: e.target.value,
                            },
                          });
                        }}
                        label="Vimeo"
                      />
                    </MContainer>
                  </Grid>

                  <Grid item xs={12} textAlign={"start"} sx={{ padding: '0 20px' }}>
                    <MContainer
                      direction="vertical"
                      styles={{ alignContent: "space-around" }}
                    >
                      <FormGroup
                        icon={{
                          element: (
                            <Image
                              src="/assets/img/iconos/icon_youtube_blue.svg"
                              style={{ marginLeft: 10 }}
                              width="30"
                              height="30"
                              alt=""
                            />
                          ),
                          position: "end",
                        }}
                        show_error_message={false}
                        error={(() => {
                          /* if (form.nombre.length === 0) {
                          return 'El nombre no debe estar vacio';
                        } */
                          return undefined;
                        })()}
                        style={{ width: 200, maxWidth: '100%' }}
                        labelStyle={{
                          marginBottom: '0',
                          fontWeight: 800,
                          fontSize: "0.8rem",
                          textAlign: "start",
                          color: "#069cb1",
                        }}
                        value={form.redes_sociales.youtube}
                        onChange={(e) => {
                          setForm({
                            ...form,
                            redes_sociales: {
                              ...form.redes_sociales,
                              youtube: e.target.value,
                            },
                          });
                        }}
                        label="Youtube"
                      />
                    </MContainer>
                  </Grid>

                  <Grid item xs={12} textAlign={"start"} sx={{ padding: '0 20px' }}>
                    <MContainer
                      direction="vertical"
                      styles={{ alignContent: "space-around" }}
                    >
                      <FormGroup
                        icon={{
                          element: (
                            <Image
                              src="/assets/img/iconos/icon_linkedin_blue.svg"
                              style={{ marginLeft: 10 }}
                              width="20"
                              height="30"
                              alt=""
                            />
                          ),
                          position: "end",
                        }}
                        show_error_message={false}
                        error={(() => {
                          if (form.nombre.length === 0) {
                            return "El nombre no debe estar vacio";
                          }
                          return undefined;
                        })()}
                        style={{ width: 200, maxWidth: '100%' }}
                        labelStyle={{
                          marginBottom: '0',
                          fontWeight: 800,
                          fontSize: "0.8rem",
                          textAlign: "start",
                          color: "#069cb1",
                        }}
                        value={form.redes_sociales.linkedin}
                        onChange={(e) => {
                          setForm({
                            ...form,
                            redes_sociales: {
                              ...form.redes_sociales,
                              linkedin: e.target.value,
                            },
                          });
                        }}
                        label="LinkedIn"
                      />
                    </MContainer>
                  </Grid>

                  <Grid item xs={12} textAlign={"start"} sx={{ padding: '0 20px' }}>
                    <MContainer
                      direction="vertical"
                      styles={{ alignContent: "space-around" }}
                    >
                      <FormGroup
                        icon={{
                          element: (
                            <Image
                              src="/assets/img/iconos/icon_insta_blue.svg"
                              style={{ marginLeft: 10 }}
                              width="20"
                              height="30"
                              alt=""
                            />
                          ),
                          position: "end",
                        }}
                        show_error_message={false}
                        error={(() => {
                          /* if (form.nombre.length === 0) {
                          return 'El nombre no debe estar vacio';
                        } */
                          return undefined;
                        })()}
                        style={{ width: 200, maxWidth: '100%' }}
                        labelStyle={{
                          marginBottom: '0',
                          fontWeight: 800,
                          fontSize: "0.8rem",
                          textAlign: "start",
                          color: "#069cb1",
                        }}
                        value={form.redes_sociales.instagram}
                        onChange={(e) => {
                          setForm({
                            ...form,
                            redes_sociales: {
                              ...form.redes_sociales,
                              instagram: e.target.value,
                            },
                          });
                        }}
                        label="Instagram"
                      />
                    </MContainer>
                  </Grid>

                  <Grid item xs={12} textAlign={"start"} sx={{ padding: '0 20px' }}>
                    <MContainer
                      direction="vertical"
                      styles={{ alignContent: "space-around" }}
                    >
                      <FormGroup
                        icon={{
                          element: (
                            <Image
                              src="/assets/img/iconos/icon_Twitwe_blue.svg"
                              style={{ marginLeft: 10 }}
                              width="20"
                              height="30"
                              alt=""
                            />
                          ),
                          position: "end",
                        }}
                        show_error_message={false}
                        error={(() => {
                          if (form.nombre.length === 0) {
                            return "El nombre no debe estar vacio";
                          }
                          return undefined;
                        })()}
                        style={{ width: 200, maxWidth: '100%' }}
                        labelStyle={{
                          marginBottom: '0',
                          fontWeight: 800,
                          fontSize: "0.8rem",
                          textAlign: "start",
                          color: "#069cb1",
                        }}
                        value={form.redes_sociales.twitter}
                        onChange={(e) => {
                          setForm({
                            ...form,
                            redes_sociales: {
                              ...form.redes_sociales,
                              twitter: e.target.value,
                            },
                          });
                        }}
                        label="Twitter"
                      />
                    </MContainer>
                  </Grid>

                  <Grid item xs={12} textAlign={"start"} sx={{ padding: '0 20px' }}>
                    <MContainer
                      direction="vertical"
                      styles={{ alignContent: "space-around" }}
                    >
                      <FormGroup
                        icon={{
                          element: (
                            <Image
                              src="/assets/img/iconos/icon_imbd_blue.svg"
                              style={{ marginLeft: 10 }}
                              width="20"
                              height="30"
                              alt=""
                            />
                          ),
                          position: "end",
                        }}
                        show_error_message={false}
                        error={(() => {
                          if (form.nombre.length === 0) {
                            return "El nombre no debe estar vacio";
                          }
                          return undefined;
                        })()}
                        style={{ width: 200, maxWidth: '100%' }}
                        labelStyle={{
                          marginBottom: '0',
                          fontWeight: 800,
                          fontSize: "0.8rem",
                          textAlign: "start",
                          color: "#069cb1",
                        }}
                        value={form.redes_sociales.imdb}
                        onChange={(e) => {
                          setForm({
                            ...form,
                            redes_sociales: {
                              ...form.redes_sociales,
                              imdb: e.target.value,
                            },
                          });
                        }}
                        label="IMDb"
                      />
                    </MContainer>
                  </Grid>
                </>
              )}

            <Grid item xs={12} textAlign={"center"} sx={{ paddingBottom: 3, paddingRight: '20px', paddingLeft: '20px' }}>
              <Button
                onClick={() => {
                  if (user_info) {
                    switch (user_info.tipo_usuario) {
                      case TipoUsuario.TALENTO: {
                        if (talento.data) {
                          if (form.foto_selected) {
                            const time = new Date().getTime();
                            void FileManager.saveFiles([
                              {
                                path: `talentos/${talento.data.id}/fotos-perfil`,
                                name: `foto-perfil-talento-${talento.data.id}-${time}`,
                                file: form.foto_selected.file,
                                base64: form.foto_selected.base64,
                              },
                            ]).then((result) => {
                              result.forEach((res) => {
                                if (talento.data) {
                                  const response =
                                    res[
                                    `foto-perfil-talento-${talento.data.id}-${time}`
                                    ];
                                  if (response) {
                                    update_perfil_talento.mutate({
                                      id_talento: talento.data.id,
                                      foto_perfil: {
                                        nombre: form.foto_selected
                                          ? form.foto_selected.file.name
                                          : "",
                                        type: form.foto_selected
                                          ? form.foto_selected.file.type
                                          : "",
                                        url: response.url ? response.url : "",
                                        clave: `talentos/${talento.data.id}/fotos-perfil/foto-perfil-talento-${talento.data.id}-${time}`,
                                        referencia: `FOTOS-PERFIL-TALENTO-${talento.data.id}`,
                                        identificador: `foto-perfil-talento-${talento.data.id}`,
                                      },
                                      nombre: form.nombre,
                                      biografia: form.biografia
                                        ? form.biografia
                                        : "",
                                    });
                                  }
                                }
                              });
                            });
                          } else {
                            update_perfil_talento.mutate({
                              id_talento: talento.data.id,
                              nombre: form.nombre,
                              biografia: form.biografia ? form.biografia : "",
                            });
                          }
                        }
                        break;
                      }
                      case TipoUsuario.CAZATALENTOS: {
                        if (cazatalentos.data && form.foto_selected) {
                          const time = new Date().getTime();
                          void FileManager.saveFiles([
                            {
                              path: `cazatalentos/${cazatalentos.data.id}/foto-perfil`,
                              name: `foto-perfil-cazatalentos-${cazatalentos.data.id}-${time}`,
                              file: form.foto_selected.file,
                              base64: form.foto_selected.base64,
                            },
                          ]).then((result) => {
                            result.forEach((res) => {
                              if (cazatalentos.data) {
                                const response =
                                  res[
                                  `foto-perfil-cazatalentos-${cazatalentos.data.id}-${time}`
                                  ];
                                if (response) {
                                  update_perfil_cazatalento.mutate({
                                    foto_perfil: {
                                      nombre: form.foto_selected
                                        ? form.foto_selected.file.name
                                        : "",
                                      type: form.foto_selected
                                        ? form.foto_selected.file.type
                                        : "",
                                      url: response.url ? response.url : "",
                                      clave: `cazatalentos/${cazatalentos.data.id}/foto-perfil/foto-perfil-cazatalentos-${cazatalentos.data.id}-${time}`,
                                      referencia: `FOTOS-PERFIL-CAZATALENTOS-${cazatalentos.data.id}`,
                                      identificador: `foto-perfil-cazatalentos-${cazatalentos.data.id}`,
                                    },
                                    nombre: form.nombre,
                                    biografia: form.biografia
                                      ? form.biografia
                                      : "",
                                    posicion: form.posicion,
                                    compania: form.compania,
                                    redes_sociales: Object.keys(
                                      form.redes_sociales
                                    ).map((key) => ({
                                      nombre: key,
                                      url: form.redes_sociales[key] || "",
                                    })),
                                  });
                                }
                              }
                            });
                          });
                        } else {
                          update_perfil_cazatalento.mutate({
                            nombre: form.nombre,
                            biografia: form.biografia ? form.biografia : "",
                            posicion: form.posicion,
                            compania: form.compania,
                            redes_sociales: Object.keys(
                              form.redes_sociales
                            ).map((key) => ({
                              nombre: key,
                              url: form.redes_sociales[key] || "",
                            })),
                          });
                        }
                        break;
                      }
                      case TipoUsuario.REPRESENTANTE: {
                        if (representante.data && form.foto_selected) {
                          const time = new Date().getTime();
                          void FileManager.saveFiles([
                            {
                              path: `representante/${representante.data.id}/foto-perfil`,
                              name: `foto-perfil-representante-${representante.data.id}-${time}`,
                              file: form.foto_selected.file,
                              base64: form.foto_selected.base64,
                            },
                          ]).then((result) => {
                            result.forEach((res) => {
                              if (representante.data) {
                                const response =
                                  res[
                                  `foto-perfil-representante-${representante.data.id}-${time}`
                                  ];
                                if (response) {
                                  update_perfil_representante.mutate({
                                    foto_perfil: {
                                      nombre: form.foto_selected
                                        ? form.foto_selected.file.name
                                        : "",
                                      type: form.foto_selected
                                        ? form.foto_selected.file.type
                                        : "",
                                      url: response.url ? response.url : "",
                                      clave: `representantes/${representante.data.id}/foto-perfil/foto-perfil-representante-${representante.data.id}-${time}`,
                                      referencia: `FOTOS-PERFIL-REPRESENTANTE-${representante.data.id}`,
                                      identificador: `foto-perfil-representante-${representante.data.id}`,
                                    },
                                    nombre: form.nombre,
                                    biografia: form.biografia
                                      ? form.biografia
                                      : "",
                                    redes_sociales: Object.keys(
                                      form.redes_sociales
                                    ).map((key) => ({
                                      nombre: key,
                                      url: form.redes_sociales[key] || "",
                                    })),
                                  });
                                }
                              }
                            });
                          });
                        } else {
                          update_perfil_representante.mutate({
                            nombre: form.nombre,
                            biografia: form.biografia ? form.biografia : "",
                            redes_sociales: Object.keys(
                              form.redes_sociales
                            ).map((key) => ({
                              nombre: key,
                              url: form.redes_sociales[key] || "",
                            })),
                          });
                        }
                        break;
                      }
                    }
                  }
                }}
                style={{
                  backgroundColor: "#069cb1",
                  width: 200, maxWidth: '100%',
                  color: "white",
                  fontSize: '10px',
                  borderRadius: 16,
                }}
              >
                {textos["guardar"] ? textos["guardar"] : "Texto No Definido"}
              </Button>
            </Grid>
          </Grid>
        </motion.div>

        {!edit_mode && (
          <>
            {/* <motion.img
              src="/assets/img/iconos/EZ_Claqueta.svg"
              className="mb-3 claqueta_black"
              style={{
                width: "55px",
                marginTop: "30px"
              }}
            /> */}
            {/* <p
              className="h2 text-uppercase text-white mb-3"
              style={{
                fontSize: "24px",
              }}
            > */}
              {/* <b>EZ-CAST</b> */}
            {/* </p> */}
            {user_info?.tipo_usuario === TipoUsuario.TALENTO && (
              <p
                className="h2 text-white mb-0"
                style={{
                  fontSize: "24px",
                }}
              >
                TALENTO
              </p>
            )}
            <Box position={"relative"}>
              <div className="mt-3 mb-3 avatar">
                <motion.img width={120} src={foto_perfil} alt="avatar" />
              </div>
              {profile_img_talento_representado && (
                <motion.img
                  width={40}
                  style={{
                    backgroundColor: "white",
                    borderRadius: 32,
                    position: "absolute",
                    top: "calc(80% - 16px)",
                    left: "calc(65% - 28px)",
                  }}
                  src={profile_img_talento_representado}
                  alt="avatar"
                />
              )}
            </Box>
            {is_fetching && <Skeleton className="h2 text-white mb-0" />}
            {!is_fetching && (
              <p className="h2 text-white mb-0"  style={{
                fontSize: "22px",
              }}>{user_info?.nombre}</p>
            )}
            {is_fetching && (
              <Skeleton className="h2 text-white mb-3 user_lastName" />
            )}
            {!is_fetching && (
              <p className="h2 text-white mb-3 user_lastName"  style={{
                fontSize: "22px"}}>
                {user_info?.apellido}
              </p>
            )}
            {/* <motion.img
              src="/assets/img/iconos/icon_estrella_dorada.svg"
              className="ml-1 gold_star"
              alt="icono estrella dorada"
            /> */}

            {!is_fetching &&
              user_info?.tipo_usuario === TipoUsuario.CAZATALENTOS && (
                <>
                  <Typography
                    sx={{
                      textAlign: "center",
                      color: "#fff",
                      fontStyle: "italic",
                      fontSize: "0.9rem",
                    }}
                  >
                    {user_info?.posicion}
                  </Typography>

                  <Typography
                    sx={{
                      textAlign: "center",
                      color: "#fff",
                      fontSize: "0.9rem",
                    }}
                  >
                    {user_info?.biografia}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    {form.redes_sociales.vimeo && (
                      <a href={form.redes_sociales.vimeo} target="_blank">
                        <Image
                          src="/assets/img/iconos/icon_vimeo.svg"
                          style={{ marginLeft: 10 }}
                          width="20"
                          height="30"
                          alt=""
                        />
                      </a>
                    )}
                    {form.redes_sociales.linkedin && (
                      <a href={form.redes_sociales.linkedin} target="_blank">
                        <Image
                          src="/assets/img/iconos/icon_linkedin.svg"
                          style={{ marginLeft: 10 }}
                          width="20"
                          height="30"
                          alt=""
                        />
                      </a>
                    )}
                    {form.redes_sociales.youtube && (
                      <a href={form.redes_sociales.youtube} target="_blank">
                        <Image
                          src="/assets/img/iconos/icon_youtube.svg"
                          style={{ marginLeft: 10 }}
                          width="40"
                          height="50"
                          alt=""
                        />
                      </a>
                    )}
                    {form.redes_sociales.imdb && (
                      <a href={form.redes_sociales.imdb} target="_blank">
                        <Image
                          src="/assets/img/iconos/icon_imbd.svg"
                          style={{ marginLeft: 10 }}
                          width="30"
                          height="40"
                          alt=""
                        />
                      </a>
                    )}
                    {form.redes_sociales.twitter && (
                      <a href={form.redes_sociales.twitter} target="_blank">
                        <Image
                          src="/assets/img/iconos/icon_Twitwe.svg"
                          style={{ marginLeft: 10 }}
                          width="20"
                          height="30"
                          alt=""
                        />
                      </a>
                    )}
                    {form.redes_sociales.instagram && (
                      <a href={form.redes_sociales.instagram} target="_blank">
                        <Image
                          src="/assets/img/iconos/icon_insta.svg"
                          style={{ marginLeft: 10 }}
                          width="20"
                          height="30"
                          alt=""
                        />
                      </a>
                    )}
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                      <a href={form.redes_sociales.pagina_web} target="_blank" style={{ textDecoration: "underline", color: '#fff', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}>
                        <Image
                          src="/assets/img/iconos/icon_website.svg"
                          style={{ marginRight: 10 }}
                          width="20"
                          height="30"
                          alt=""
                        />
                        {form.redes_sociales.pagina_web}
                      </a>
                  </Box>
                </>
              )}

            <hr />
            {is_fetching && (
              <Skeleton className="mt-2 mb-5 text-white open_popup" />
            )}
            {!is_fetching && (
              <p
                onClick={() => setEditMode((edit) => !edit)}
                className="mt-2 text-white open_popup"
                data-popup="box_editprofile"
                style={{
                  textDecoration: "underline",
                }}
              >
                {textos["editar"] ? textos["editar"] : "Texto No Definido"}{" "}
                {textos["perfil"] ? textos["perfil"] : "Texto No Definido"}
              </p>
            )}
            {is_fetching && <Skeleton className="sub_menu" />}
            {!is_fetching &&
              user_info?.tipo_usuario === TipoUsuario.TALENTO && (
                <div className="sub_menu">
                  <Link
                    href="/talento/dashboard"
                    className={
                      router.pathname === "/talento/dashboard" ? "active" : ""
                    }
                  >
                    {textos["perfil"] ? textos["perfil"] : "Texto No Definido"}
                  </Link>
                  <Link
                    href="/talento/billboard"
                    className={
                      router.pathname === "/talento/billboard" ? "active" : ""
                    }
                  >
                    Casting Billboard
                  </Link>
                  <Link
                    href="/talento/aplicaciones"
                    className={
                      router.pathname === "/talento/aplicaciones"
                        ? "active"
                        : ""
                    }
                  >
                    {textos["tus_aplicaciones"]
                      ? textos["tus_aplicaciones"]
                      : "Texto No Definido"}
                  </Link>
                  <Link
                    href="/talento/self-tape"
                    className={
                      router.pathname === "/talento/self-tape" ? "active" : ""
                    }
                  >
                    {textos["grabar_selftape"]
                      ? textos["grabar_selftape"]
                      : "Texto No Definido"}
                  </Link>
                  <Link
                    href="/talento/media-bank"
                    className={
                      router.pathname === "/talento/media-bank" ? "active" : ""
                    }
                  >
                    Media Bank
                  </Link>
                  <Link
                    href="/mensajes"
                    className={router.pathname === "/mensajes" ? "active" : ""}
                  >
                    {textos["mensajes"]
                      ? textos["mensajes"]
                      : "Texto No Definido"}
                  </Link>
                  <Link
                    href="/ayuda-ezcast"
                    className={
                      router.pathname === "/ayuda-ezcast" ? "active" : ""
                    }
                  >
                    {textos["ayuda"] ? textos["ayuda"] : "Texto No Definido"}
                  </Link>
                </div>
              )}

            {!is_fetching &&
              user_info?.tipo_usuario === TipoUsuario.CAZATALENTOS && (
                <div className="sub_menu">
                  <Link
                    href="/cazatalentos/dashboard"
                    className={
                      router.pathname === "/cazatalentos/dashboard"
                        ? "active"
                        : ""
                    }
                  >
                    {textos['mis_proyectos']}
                  </Link>
                  <Link
                    href="/cazatalentos/billboard"
                    className={
                      router.pathname === "/cazatalentos/billboard"
                        ? "active"
                        : ""
                    }
                  >
                    Billboard
                  </Link>
                  <Link
                    href="/cazatalentos/agenda-virtual"
                    className={
                      router.pathname.includes("agenda-virtual") ? "active" : ""
                    }
                  >
                    {textos['agenda_virtual']}
                  </Link>
                  <Link
                    href="/mensajes"
                    className={router.pathname === "/mensajes" ? "active" : ""}
                  >
                    {textos['mensajes']}
                  </Link>
                  <Link
                    href="/ayuda-ezcast"
                    className={
                      router.pathname === "/ayuda-ezcast" ? "active" : ""
                    }
                  >
                    {textos['ayuda']}
                  </Link>
                </div>
              )}
            {!is_fetching &&
              user_info?.tipo_usuario === TipoUsuario.REPRESENTANTE && (
                <div className="sub_menu">
                  <Link
                    href="/representante/dashboard"
                    className={
                      router.pathname === "/representante/dashboard"
                        ? "active"
                        : ""
                    }
                  >
                    Tu Perfil
                  </Link>
                  <Link
                    href="/representante/tus-talentos"
                    className={
                      router.pathname === "/representante/tus-talentos"
                        ? "active"
                        : ""
                    }
                  >
                    Tus Talentos
                  </Link>
                  {id_talento && parseInt(id_talento as string) > 0 && (
                    <>
                      <Link
                        href={`/talento/billboard?id_talento=${id_talento as string
                          }`}
                        className={
                          router.pathname.includes("/talento/billbarod")
                            ? "active"
                            : ""
                        }
                      >
                        Casting Billboard
                      </Link>
                      <Link
                        href={`/representante/aplicaciones?id_talento=${id_talento as string
                          }`}
                        className={
                          router.pathname.includes(
                            "/representante/aplicaciones"
                          )
                            ? "active"
                            : ""
                        }
                      >
                        Aplicaciones
                      </Link>
                      <Link
                        href={`/talento/agenda-virtual?id_talento=${id_talento as string
                          }`}
                        className={
                          router.pathname.includes("agenda-virtual")
                            ? "active"
                            : ""
                        }
                      >
                        Agenda Virtual
                      </Link>
                    </>
                  )}
                  <Link
                    href="/mensajes"
                    className={router.pathname === "/mensajes" ? "active" : ""}
                  >
                    Mensajes
                  </Link>
                  <Link
                    href="/ayuda-ezcast"
                    className={
                      router.pathname === "/ayuda-ezcast" ? "active" : ""
                    }
                  >
                    Ayuda
                  </Link>
                </div>
              )}
            <p className="mt-5 mb-2">
              <a
                onClick={() => {
                  void signOut({
                    callbackUrl: "/login",
                  });
                }}
                className="text-white"
                href="#"
              >
                {textos["cerrar_sesion"]
                  ? textos["cerrar_sesion"]
                  : "Texto No Definido"}
              </a>
            </p>
            <div className="popup_conteiner box_editprofile">
              <div className="close_popup close_popup_editprofile">
                <motion.img
                  src="/assets/img/iconos/equiz_blue.svg"
                  alt="icono"
                />
              </div>
              <div className="mt-3 mb-1 avatar">
                <motion.img
                  src="https://randomuser.me/api/portraits/men/34.jpg"
                  alt="avatar"
                />
                <motion.img src="/assets/img/iconos/cam_white.svg" alt="" />
              </div>
              <p className="mt-1 mb-2">
                <a className="text-grey" href="#">
                  {textos["cambiar"] ? textos["cambiar"] : "Texto No Definido"}{" "}
                  {textos["foto"] ? textos["foto"] : "Texto No Definido"}
                </a>
              </p>
              <div className="row">
                <div className="col-12">
                  <div className="form-group">
                    <label>Nombre de usuario</label>
                    <input
                      type="text"
                      className="form-control form-control-sm text_custom"
                      value="Iván Águila Orea"
                    />
                  </div>
                  <div className="form-group">
                    <label>Posición</label>
                    <input
                      type="text"
                      className="form-control form-control-sm text_custom"
                      value="Productor"
                    />
                  </div>
                  <div className="form-group">
                    <p className="text-left">Idioma</p>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="exampleRadios"
                        id="exampleRadios1"
                        value="option1"
                        checked={false}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="exampleRadios1"
                      >
                        Español
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="exampleRadios"
                        id="exampleRadios2"
                        value="option2"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="exampleRadios2"
                      >
                        English
                      </label>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Link a página web</label>
                    <input
                      type="text"
                      className="form-control form-control-sm text_custom"
                      value="www.ivanaguilao.com"
                    />
                  </div>
                  <p className="mt-2 mb-1 text-left">Link a redes sociales:</p>
                  <div className="form-group">
                    <label>
                      Vimeo{" "}
                      <motion.img
                        src="/assets/img/iconos/icon_vimeo_blue.svg"
                        alt="icono"
                      />
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm text_custom"
                      value=" "
                    />
                  </div>
                  <div className="form-group">
                    <label>
                      Youtube{" "}
                      <motion.img
                        src="/assets/img/iconos/icon_youtube_blue.svg"
                        alt="icono"
                      />
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm text_custom"
                      value=" "
                    />
                  </div>
                  <div className="form-group">
                    <label>
                      LinkedIn{" "}
                      <motion.img
                        src="/assets/img/iconos/icon_linkedin_blue.svg"
                        alt="icono"
                      />
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm text_custom"
                      value=" "
                    />
                  </div>
                  <div className="form-group">
                    <label>
                      Instagram{" "}
                      <motion.img
                        src="/assets/img/iconos/icon_insta_blue.svg"
                        alt="icono"
                      />
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm text_custom"
                      value=" "
                    />
                  </div>
                  <div className="form-group">
                    <label>
                      Twitter{" "}
                      <motion.img
                        src="/assets/img/iconos/icon_Twitwe_blue.svg"
                        alt="icono"
                      />
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm text_custom"
                      value=" "
                    />
                  </div>
                  <div className="form-group">
                    <label>
                      IMDb{" "}
                      <motion.img
                        src="/assets/img/iconos/icon_imbd_blue.svg"
                        alt="icono"
                      />
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm text_custom"
                      value=" "
                    />
                  </div>
                  <button className="text-center btn btn-intro btn-confirm close_popup_link">
                    Guardar cambios
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};
