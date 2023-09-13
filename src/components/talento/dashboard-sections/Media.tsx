import Image from "next/image";
import { Button, Divider, Grid, Typography } from "@mui/material";
import React, { useMemo, useState, useEffect, useRef, useContext } from "react";
import { AddButton, AudioBar, SectionTitle } from "~/components/shared";
import { MContainer } from "~/components/layout/MContainer";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import AppContext from "~/context/app";
import useLang from "~/hooks/useLang";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";

import "swiper/css";
import "swiper/css/navigation";

export const Media = (props: { id_talento: number; read_only: boolean }) => {
  const ctx = useContext(AppContext);
  const textos = useLang(ctx.lang);

  const router = useRouter();
  const [current_video_url, setCurrentVideoUrl] = useState("");

  const [current_selftape_video_url, setCurrentSeltapeVideoUrl] = useState("");

  const media_por_talento = api.talentos.getMediaByIdTalento.useQuery(
    { id: props.id_talento },
    {
      refetchOnWindowFocus: false,
    }
  );

  const video_player = useRef<HTMLVideoElement | null>(null);

  const selftape_video_player = useRef<HTMLVideoElement | null>(null);

  const media = useMemo(() => {
    if (media_por_talento.data) {
      const fotos = media_por_talento.data
        .filter((m) => m.media.type.includes("image"))
        .map((a) => a.media);
      const audios = media_por_talento.data
        .filter((m) => m.media.type.includes("audio"))
        .map((a) => a.media);
      const videos = media_por_talento.data
        .filter(
          (m) =>
            m.media.type.includes("video") &&
            m.media.referencia.startsWith("VIDEOS-TALENTO")
        )
        .map((a) => a.media);
      const selftapes = media_por_talento.data
        .filter(
          (m) =>
            m.media.type.includes("video") &&
            m.media.public &&
            m.media.referencia.startsWith("VIDEOS-SELFTAPE")
        )
        .map((a) => a.media);
      return {
        fotos: fotos,
        audios: audios,
        videos: videos,
        selftapes: selftapes,
      };
    }
    return null;
  }, [media_por_talento.data]);

  useEffect(() => {
    if (current_video_url !== "" && video_player.current) {
      video_player.current.setAttribute("src", current_video_url);
      video_player.current.load();
    }
  }, [current_video_url]);

  useEffect(() => {
    if (media && media.videos.length > 0 && current_video_url === "") {
      const video = media.videos[0];
      if (video) {
        setCurrentVideoUrl(video.url);
      }
    }
    if (
      media &&
      media.selftapes.length > 0 &&
      current_selftape_video_url === ""
    ) {
      const video = media.selftapes[0];
      if (video) {
        setCurrentSeltapeVideoUrl(video.url);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [media]);

  useEffect(() => {
    if (current_selftape_video_url !== "" && selftape_video_player.current) {
      selftape_video_player.current.setAttribute(
        "src",
        current_selftape_video_url
      );
      selftape_video_player.current.load();
    }
  }, [current_selftape_video_url]);

  return (
    <Grid id="media" container sx={{ mt: 10 }}>
      <Grid item xs={12}>
        <SectionTitle
          title={textos["media"] ? textos["media"] : "Texto No definido"}
          textButton={textos["editar"] ? textos["editar"] : "Texto No definido"}
          onClickButton={
            !props.read_only
              ? () => {
                  // eslint-disable-next-line @typescript-eslint/no-floating-promises
                  router.push(
                    `/talento/editar-perfil?step=2&id_talento=${props.id_talento}`
                  );
                }
              : undefined
          }
          titleSx={{
            fontWeight: 800,
            fontSize: "24px",
          }}
          dividerSx={{
            borderTop: "2px solid #069CB1",
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <MContainer
          direction="horizontal"
          styles={{
            alignItems: "center",
            padding: "15px 0px",
            justifyContent: "space-between",
          }}
        >
          <MContainer direction="horizontal" styles={{ alignItems: "initial" }}>
            <Image
              src="/assets/img/iconos/cam_outline_blue.svg"
              width={30}
              height={30}
              alt=""
            />
            <Typography
              sx={{ color: "#069CB1", pl: 1, fontSize: "20px" }}
              fontWeight={800}
            >
              {textos["galeria_imagenes"]
                ? textos["galeria_imagenes"].toUpperCase()
                : "Texto No definido"}
            </Typography>
          </MContainer>
          {!props.read_only && (
            <AddButton
              aStyles={{ margin: 0, borderRadius: "50px", width: "170px" }}
              onClick={() => {
                // eslint-disable-next-line @typescript-eslint/no-floating-promises
                router.push("/talento/editar-perfil?step=2");
              }}
              text={
                textos["agregar"] && textos["imagen"]
                  ? `${textos["agregar"]} ${textos["imagen"]}`
                  : "Texto No definido"
              }
            />
          )}
        </MContainer>
        <Swiper
          modules={[Navigation]}
          spaceBetween={1}
          slidesPerView={4}
          navigation
          loop
        >
          {media &&
            media.fotos.map((image, i) => {
              return (
                <SwiperSlide key={i}>
                  <Image
                    width={191}
                    height={240}
                    style={{ border: "1px solid #000000", objectFit: 'cover' }}
                    src={image.url}
                    alt=""
                  />
                  {i === 0 && (
                    <Typography sx={{ color: "#069CB1" }}>
                      Foto de perfil
                    </Typography>
                  )}
                </SwiperSlide>
              );
            })}
        </Swiper>
        {!media ||
          (media.fotos.length === 0 && (
            <Typography
              fontSize={"1.3rem"}
              sx={{ color: "#F9B233" }}
              fontWeight={400}
            >
              {textos["usuario_no_ha_capturado"]
                ? textos["usuario_no_ha_capturado"].replace(
                    "[TYPE]",
                    `${textos["imagen"] ?? ""}`
                  )
                : "Texto No definido"}
            </Typography>
          ))}
        <Divider
          sx={{ mt: 3, borderTop: "2px solid #807D7D", marginBottom: 3 }}
        />
      </Grid>

      <Grid item xs={12}>
        <MContainer
          direction="horizontal"
          justify="space-between"
          styles={{ alignItems: "center" }}
        >
          <MContainer
            direction="vertical"
            styles={{ width: "28%", alignItems: "center" }}
          >
            <Image
              src="/assets/img/iconos/web_cam_blue.png"
              width={50}
              height={30}
              alt=""
            />
            <Typography
              sx={{
                color: "#069CB1",
                textAlign: "center",
                marginTop: 1,
                fontSize: "20px",
              }}
              fontWeight={800}
            >
              VIDEO <br /> REEL
            </Typography>
          </MContainer>
          <MContainer
            direction="vertical"
            styles={{ width: "70%", alignItems: "flex-end" }}
          >
            {!props.read_only && (
              <AddButton
                text={
                  textos["agregar"] && textos["video"]
                    ? `${textos["agregar"]} ${textos["video"]}`
                    : "Texto No definido"
                }
                aStyles={{ margin: 10, borderRadius: 50, width: 170 }}
                onClick={() => {
                  // eslint-disable-next-line @typescript-eslint/no-floating-promises
                  router.push("/talento/editar-perfil?step=2");
                }}
              />
            )}
            {media && media.videos.length > 0 && (
              <>
                <video
                  ref={video_player}
                  controls
                  style={{
                    width: "550px",
                    maxWidth: "100%",
                    aspectRatio: "16 / 9",
                  }}
                >
                  <source src={current_video_url} type="video/mp4" />
                  Lo sentimos tu navegador no soporta videos.
                </video>
                <MContainer styles={{ marginTop: 16 }} direction="horizontal">
                  <>
                    {media.videos.map((v, i) => {
                      return (
                        <Button
                          key={i}
                          onClick={() => {
                            setCurrentVideoUrl(v.url);
                          }}
                          size="small"
                          style={{ margin: 8 }}
                          variant={
                            v.url === current_video_url
                              ? "contained"
                              : "outlined"
                          }
                          endIcon={
                            <Image
                              style={{
                                marginLeft: 5,
                                cursor: "pointer",
                                filter:
                                  v.url === current_video_url
                                    ? "brightness(0) saturate(100%) invert(85%) sepia(21%) saturate(2191%) hue-rotate(331deg) brightness(99%) contrast(97%)"
                                    : "",
                              }}
                              src="/assets/img/iconos/play.svg"
                              width={20}
                              height={20}
                              alt=""
                            />
                          }
                        >
                          {v.nombre}
                        </Button>
                      );
                    })}
                  </>
                </MContainer>
              </>
            )}
            {!media ||
              (media.videos.length === 0 && (
                <Typography
                  fontSize={"1.3rem"}
                  sx={{ color: "#F9B233" }}
                  fontWeight={400}
                >
                  {textos["usuario_no_ha_capturado"]
                    ? textos["usuario_no_ha_capturado"].replace(
                        "[TYPE]",
                        `${textos["video"] ?? ""}`
                      )
                    : "Texto No definido"}
                </Typography>
              ))}
          </MContainer>
        </MContainer>
        <Divider sx={{ mt: 3, borderTop: "2px solid #807D7D" }} />
      </Grid>

      <Grid item xs={12} style={{ padding: "30px 0" }}>
        <MContainer
          direction="horizontal"
          justify="space-between"
          styles={{ alignItems: "center" }}
        >
          <MContainer
            direction="vertical"
            styles={{ width: "28%", alignItems: "center" }}
          >
            <Image
              src="/assets/img/iconos/micro_web_blue.svg"
              width={60}
              height={40}
              alt=""
            />
            <Typography
              sx={{
                color: "#069CB1",
                textAlign: "center",
                marginTop: 1,
                fontSize: "20px",
              }}
              fontWeight={800}
            >
              AUDIO <br /> CLIPS
            </Typography>
          </MContainer>
          <MContainer
            direction="vertical"
            styles={{ width: "70%", alignItems: "flex-end" }}
          >
            {!props.read_only && (
              <AddButton
                text={
                  textos["agregar"] && textos["audio"]
                    ? `${textos["agregar"]} ${textos["audio"]}`
                    : "Texto No definido"
                }
                aStyles={{ marginBottom: 10, borderRadius: 50, width: 170 }}
                onClick={() => {
                  // eslint-disable-next-line @typescript-eslint/no-floating-promises
                  router.push("/talento/editar-perfil?step=2");
                }}
              />
            )}
            {media &&
              media.audios.length > 0 &&
              media.audios.map((audio, i) => {
                return <AudioBar key={i} name={audio.nombre} url={audio.url} />;
              })}
            {!media ||
              (media.audios.length === 0 && (
                <Typography
                  fontSize={"1.3rem"}
                  sx={{ color: "#F9B233" }}
                  fontWeight={400}
                >
                  {textos["usuario_no_ha_capturado"]
                    ? textos["usuario_no_ha_capturado"].replace(
                        "[TYPE]",
                        `${textos["audio"] ?? ""}`
                      )
                    : "Texto No definido"}
                </Typography>
              ))}
          </MContainer>
        </MContainer>
        <Divider sx={{ mt: 3, borderTop: "2px solid #807D7D" }} />
      </Grid>
      <Grid item xs={12}>
        <MContainer
          direction="horizontal"
          justify="space-between"
          styles={{ alignItems: "center" }}
        >
          <MContainer
            direction="vertical"
            styles={{ width: "28%", alignItems: "center" }}
          >
            <Image
              src="/assets/img/iconos/icono-selftape.svg"
              width={50}
              height={30}
              alt=""
            />
            <Typography
              sx={{
                color: "#069CB1",
                textAlign: "center",
                marginTop: 1,
                fontSize: 22,
              }}
              fontWeight={800}
            >
              SELF
              <br />
              TAPES
            </Typography>
          </MContainer>
          <MContainer
            direction="vertical"
            styles={{ width: "70%", alignItems: "flex-end" }}
          >
            {!props.read_only && (
              <AddButton
                text={
                  textos["grabar_selftape"]
                    ? textos["grabar_selftape"]
                    : "Texto No definido"
                }
                aStyles={{ margin: 10, borderRadius: 12 }}
                onClick={() => {
                  // eslint-disable-next-line @typescript-eslint/no-floating-promises
                  router.push("/talento/self-tape");
                }}
              />
            )}
            {media && media.selftapes.length > 0 && (
              <>
                <video
                  ref={selftape_video_player}
                  controls
                  style={{ width: "100%" }}
                >
                  <source src={current_selftape_video_url} type="video/mp4" />
                  Lo sentimos tu navegador no soporta videos.
                </video>
                <MContainer styles={{ marginTop: 16 }} direction="horizontal">
                  <>
                    {media.selftapes.map((v, i) => {
                      return (
                        <Button
                          key={i}
                          onClick={() => {
                            setCurrentSeltapeVideoUrl(v.url);
                          }}
                          size="small"
                          style={{ margin: 8 }}
                          variant={
                            v.url === current_selftape_video_url
                              ? "contained"
                              : "outlined"
                          }
                          endIcon={
                            <Image
                              style={{
                                marginLeft: 5,
                                cursor: "pointer",
                                filter:
                                  v.url === current_selftape_video_url
                                    ? "brightness(0) saturate(100%) invert(85%) sepia(21%) saturate(2191%) hue-rotate(331deg) brightness(99%) contrast(97%)"
                                    : "",
                              }}
                              src="/assets/img/iconos/play.svg"
                              width={20}
                              height={20}
                              alt=""
                            />
                          }
                        >
                          {v.nombre}
                        </Button>
                      );
                    })}
                  </>
                </MContainer>
              </>
            )}
            {!media ||
              (media.selftapes.length === 0 && (
                <Typography
                  fontSize={"1.3rem"}
                  sx={{ color: "#F9B233" }}
                  fontWeight={400}
                >
                  {textos["usuario_no_ha_capturado"]
                    ? textos["usuario_no_ha_capturado"].replace(
                        "[TYPE]",
                        `${textos["selftape"] ?? ""}`
                      )
                    : "Texto No definido"}
                </Typography>
              ))}
          </MContainer>
        </MContainer>
      </Grid>
    </Grid>
  );
};
