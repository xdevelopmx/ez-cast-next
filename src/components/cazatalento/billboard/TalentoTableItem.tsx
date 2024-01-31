import Image from "next/image";
import { Box, Grid, IconButton, Typography, useMediaQuery } from "@mui/material";
import { Carroucel } from "~/components/shared/Carroucel";
import { MTooltip } from "~/components/shared/MTooltip";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import Constants from "~/constants";
import { useTheme } from '@mui/material/styles';
export const TalentoTableItem = (props: {
  id_talento: number;
  id_rol: number;
  id_estado_aplicacion_rol: number;
  nombre: string;
  rating: number;
  union: string;
  ubicacion: string;
  peso: number;
  altura: number;
  has_content: {
    videos: boolean,
    document: boolean,
    photos: boolean,
    website: boolean
  };
  images_urls: string[];
}) => {
  const theme = useTheme();
  //para ver si la pantalla es gandre o no 
  const isLgScreen = useMediaQuery(theme.breakpoints.up('xl'));
  const router = useRouter();

  const images = useMemo(() => {
    if (props.images_urls.length === 0) {
      return [
        <Image
          key={1}
          style={{
            objectFit: "cover",
            objectPosition: 'center', // Centra la imagen  
          }}
          src={"/assets/img/no-image.png"}
          fill
          alt=""
        />,
      ];
    }
    return props.images_urls.map((url, i) => {
      return (
        <Image key={i}
          src={url}
          fill
          alt="" />
      );
    });
  }, [props.images_urls]);
  return (
    <Box sx={{ width: "90%", border: "4px solid #069cb1", marginTop: 2 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "4px",
          gap: 0.5,
          borderBottom: "4px solid #069cb1",
        }}
      >
        <MTooltip
          text="No vistos"
          color="orange"
          placement="top"
          icon={
            <Image
              src={`/assets/img/iconos/${props.id_estado_aplicacion_rol ===
                Constants.ESTADOS_APLICACION_ROL.NO_VISTO
                ? "icon_no_vistos_highlited"
                : "icon_no_vistos"
                }.svg`}
              // className="tamanio_iconos_resolucion"
              width={isLgScreen ? 16 : 12}
              height={isLgScreen ? 16 : 12}
              alt="no vistos"
            />
          }
        />
        <MTooltip
          text="Vistos"
          color="orange"
          placement="top"
          icon={
            <Image
              src={`/assets/img/iconos/${[Constants.ESTADOS_APLICACION_ROL.VISTO, Constants.ESTADOS_APLICACION_ROL.DESTACADO].includes(props.id_estado_aplicacion_rol) && props.rating === 0
                ? "icon_vistos_highlited"
                : "icon_vistos"
                }.svg`}
                width={isLgScreen ? 16 : 12}
                height={isLgScreen ? 16 : 12}
              alt="Vistos"
            />
          }
        />
        <MTooltip
          text="Destacado"
          color="orange"
          placement="top"
          icon={
            <Image
              src={`/assets/img/iconos/${[Constants.ESTADOS_APLICACION_ROL.VISTO, Constants.ESTADOS_APLICACION_ROL.DESTACADO].includes(props.id_estado_aplicacion_rol) && props.rating > 0
                ? "icon_estrella_dorada"
                : "icono_star_blue"
                }.svg`}
                width={isLgScreen ? 16 : 12}
                height={isLgScreen ? 16 : 12}
              alt="Destacado"
            />
          }
        />
        <MTooltip
          text="Audición"
          color="orange"
          placement="top"
          icon={
            <Image
              style={{
                filter:
                  props.id_estado_aplicacion_rol ===
                    Constants.ESTADOS_APLICACION_ROL.AUDICION
                    ? "brightness(0) saturate(100%) invert(85%) sepia(21%) saturate(2191%) hue-rotate(331deg) brightness(99%) contrast(97%)"
                    : "",
              }}
              src={"/assets/img/iconos/icono_lampara_blue.svg"}
              width={isLgScreen ? 16 : 12}
              height={isLgScreen ? 16 : 12}
              alt="Audicion"
            />
          }
        />
        <MTooltip
          text="Callback"
          color="orange"
          placement="top"
          icon={
            <Image
              style={{
                filter:
                  props.id_estado_aplicacion_rol ===
                    Constants.ESTADOS_APLICACION_ROL.CALLBACK
                    ? "brightness(0) saturate(100%) invert(85%) sepia(21%) saturate(2191%) hue-rotate(331deg) brightness(99%) contrast(97%)"
                    : "",
              }}
              src={"/assets/img/iconos/icono_claqueta_blue.svg"}
              width={isLgScreen ? 16 : 12}
              height={isLgScreen ? 16 : 12}
              alt="callback"
            />
          }
        />
      </Box>
      <Carroucel slidesPerView={1} navigation>
        {images.map((img, i) => {
          return (
            <Box
              key={i}
              sx={{
                position: 'relative',
                width: '100%',
                height: '230px',
                aspectRatio: '9/13',
                display: 'flex',
                justifyContent: 'center', // Centra horizontalmente
                alignItems: 'center', // Centra verticalmente
                cursor: 'pointer'
              }}
              onClick={() => {
                void router.push(
                  `/talento/dashboard?id_talento=${props.id_talento}&id_rol=${props.id_rol}`
                );
              }}
            >
              {img}
            </Box>
          );
        })}
      </Carroucel>
      <Box sx={{ padding: "10px" }}>
        <Typography fontWeight={800} sx={{ color: "#069cb1",cursor: 'pointer' }}
          onClick={() => {
            void router.push(
              `/talento/dashboard?id_talento=${props.id_talento}&id_rol=${props.id_rol}`
            );
          }}>
          {props.nombre}
        </Typography>
        <Grid item xs={4} lg={12} xl={6}>
          <Box sx={{ display: "flex", gap: 0.5 }}>
              {Array.from({ length: 5 }).map((v, i) => {
                return (
                  <Image
                    key={i}
                    style={{ cursor: "pointer" }}
                    src={
                      props.rating >= i + 1
                        ? "/assets/img/iconos/estrella-fill.svg"
                        : "/assets/img/iconos/estrella_empty.svg"
                    }
                    width={10}
                    height={10}
                    alt=""
                  />
                );
              })}
            </Box>
        </Grid>
        <Grid item xs={4} lg={12} xl={6}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
                <Image
                  src="/assets/img/iconos/ubicacion.svg"
                  width={10}
                  height={10}
                  alt=""
                />
                <Typography sx={{ fontSize: ".8rem" }}>
                  {props.ubicacion}
                </Typography>
              </Box>
        </Grid>
        <Box sx={{ display: "flex" }}>
          <Grid container xs={12}>
            <Grid item xs={4} lg={12} xl={8}>
              <Typography
                sx={{ textDecoration: "underline", fontSize: ".8rem" }}
              >
                {props.union}
              </Typography>
            </Grid>
            
            <Grid item xs={4} lg={12} xl={4}>
              <Box sx={{ display: "flex", flexDirection: 'column', alignItems: "center" }}>
                <Box sx={{display: 'flex', flexDirection: 'row'}}>
                  <Image
                    style={{ marginRight: 3, marginTop: 4 }}
                    src="/assets/img/iconos/medida.svg"
                    width={10}
                    height={10}
                    alt=""
                  />
                  <Typography sx={{ fontSize: ".8rem" }}>
                    {props.peso}kg 
                  </Typography>
                </Box>
                <Box marginLeft={'16px'}>
                  <Typography sx={{ fontSize: ".8rem" }}>
                      {props.altura}m
                    </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ display: "flex", gap: 1, justifyContent: 'space-between', marginTop: 1 }}>
          <MTooltip
            onClick={() => {
              if (props.has_content.videos) {
                void router.push(
                  `/talento/dashboard?id_talento=${props.id_talento}&id_rol=${props.id_rol}&scroll_section=media`
                );
              }
            }}
            text="Videos Talento"
            color="blue"
            placement="top"
            icon={
              <Image
                style={{
                  filter: props.has_content.videos ? '' : 'grayscale(100%)'
                }}
                src="/assets/img/iconos/play-video.svg"
                width={16}
                height={16}
                alt="Videos Talento"
              />
            }
          />
          <MTooltip
            onClick={() => {
              if (props.has_content.document) {
                void router.push(
                  `/talento/dashboard?id_talento=${props.id_talento}&id_rol=${props.id_rol}`
                );
              }
            }}
            text="Documento Talento"
            color="blue"
            placement="top"
            icon={
              <Image
                style={{
                  filter: props.has_content.document ? '' : 'grayscale(100%)'
                }}
                src="/assets/img/iconos/documento.svg"
                width={16}
                height={16}
                alt=""
              />
            }
          />
          <MTooltip
            onClick={() => {
              if (props.has_content.photos) {
                void router.push(
                  `/talento/dashboard?id_talento=${props.id_talento}&id_rol=${props.id_rol}&scroll_section=media`
                );
              }
            }}
            text="Fotos Talento"
            color="blue"
            placement="top"
            icon={
              <Image
                style={{
                  filter: props.has_content.photos ? '' : 'grayscale(100%)'
                }}
                src="/assets/img/iconos/icono_camara_cart_blue.svg"
                width={16}
                height={16}
                alt=""
              />
            }
          />
          <MTooltip
            onClick={() => {
              if (props.has_content.website) {
                void router.push(
                  `/talento/dashboard?id_talento=${props.id_talento}&id_rol=${props.id_rol}`
                );
              }
            }}
            text="Sitio Web"
            color="blue"
            placement="top"
            icon={
              <Image
                style={{
                  filter: props.has_content.website ? '' : 'grayscale(100%)'
                }}
                src="/assets/img/iconos/icono_web_site_blue.svg"
                width={16}
                height={16}
                alt=""
              />
            }
          />
        </Box>
      </Box>
    </Box>
  );
};
