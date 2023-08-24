import Image from "next/image";
import {
  Alert,
  Box,
  Button,
  Dialog,
  Divider,
  Grid,
  Slide,
  Typography,
} from "@mui/material";
import React, {
  type ReactNode,
  type FC,
  type CSSProperties,
  useState,
  Fragment,
  useContext,
} from "react";
import { MContainer } from "../layout/MContainer";
import { motion } from "framer-motion";
import { type RolCompletoPreview } from "./RolesTable";
import { conversorFecha } from "~/utils/conversor-fecha";
import { type TransitionProps } from "@mui/material/transitions";
import { Check } from "@mui/icons-material";
import { CazatalentosPreview } from "../cazatalento/dialogs/cazatalentos-preview";
import AppContext from "~/context/app";
import useLang from "~/hooks/useLang";

interface PropsIndividualData {
  title: ReactNode;
  children: ReactNode;
  stylesContainerData?: CSSProperties;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<unknown, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const IndividualData: FC<PropsIndividualData> = ({
  title,
  children, 
  stylesContainerData = {},
}) => {
  return (
    <>
      <Grid item xs={12} mt={1}>
        <Divider style={{ marginBottom: '10px' }} />
      </Grid>
      <Grid item container xs={12}>
        <MContainer direction="horizontal">
          <Typography
            fontWeight={600}
            sx={{ color: "#928F8F", paddingRight: 1, fontStyle: "italic" }}
          >
            {title}
          </Typography>
          <MContainer direction="horizontal" styles={stylesContainerData}>
            {children}
          </MContainer>
        </MContainer>
      </Grid>
    </>
  );
};

interface PropsRol {
  rol: RolCompletoPreview;
  action?: JSX.Element;
  no_border?: boolean;
  no_poster?: boolean;
  popUp?: boolean;
}

const GridMotion = motion(Grid);
const MotionImage = motion(Image);

const containerVariants = {
  closed: {
    height: 0,
    opacity: 0,
    padding: 0,
  },
  open: {
    height: "auto",
    opacity: 1,
    padding: "20px",
  },
};

export const RolPreview: FC<PropsRol> = ({
  popUp = false,
  rol,
  action,
  no_border,
  no_poster,
}) => {
  const ctx = useContext(AppContext);
  const textos = useLang(ctx.lang);

  const [dialogImage, setDialogImage] = useState<{
    open: boolean;
    image: string;
  }>({ open: false, image: "" });
  const [dialogInfoProductor, setDialogInfoProductor] = useState<{
    open: boolean;
  }>({ open: false });

  const [showPreview, setShowPreview] = useState(false);

  const es_ingles = ctx.lang === "en";
  return (
    <Grid
      item
      container
      xs={12}
      sx={{ border: !no_border ? "2px solid #928F8F" : "" }}
    >
      <GridMotion container item xs={12} sx={{ alignItems: "flex-start" }}>
        {!no_poster && (
          <Grid item xs={4}>
            <Box
              sx={{
                position: "relative",
                width: "100%",
                aspectRatio: "16/12",
                marginTop: "10px",
                marginBottom: "50px",
              }}
            >
              <Image
                onClick={() => {
                  setDialogImage({
                    open: true,
                    image: rol.proyecto.foto_portada
                      ? rol.proyecto.foto_portada.url
                      : "/assets/img/no-image.png",
                  });
                }}
                src={
                  rol.proyecto.foto_portada
                    ? rol.proyecto.foto_portada.url
                    : "/assets/img/no-image.png"
                }
                style={{ objectFit: "cover", cursor: "pointer" }}
                fill
                alt=""
              />
            </Box>
          </Grid>
        )}
        <Grid container item xs={no_poster ? 12 : 8} sx={{ padding: "20px" }}>
          <Grid container item xs={12}>
            <Grid item xs={9}>
              <MContainer direction="horizontal">
                <Typography
                  fontWeight={900}
                  sx={{ fontSize: "1.4rem", marginRight: 1 }}
                >
                  {rol.proyecto.nombre}
                </Typography>
                <Typography fontWeight={900} sx={{ fontSize: "1.4rem" }}>
                  {" - " + rol.nombre}
                </Typography>
              </MContainer>
              {rol.porcentaje_filter && (
                <Alert
                  style={{
                    padding: 0,
                    //width: "45%",
                    marginTop: 8,
                    marginBottom: 8,
                  }}
                  icon={<Check fontSize="inherit" />}
                  severity="success"
                >
                  <Typography variant="body2">
                    {rol.porcentaje_filter}% {textos["compatibilidad_text"]}
                  </Typography>
                </Alert>
              )}
            </Grid>
            <Grid item xs={3}>
              {action}
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Image
                  src="/assets/img/iconos/icono_relog_blue.png"
                  width={15}
                  height={15}
                  alt=""
                />
                <Typography sx={{ color: "#069cb1", fontSize: "0.9rem" }}>
                  {textos["fecha_limite_entrega_de_aplicaciones"]}:
                  <Typography
                    component={"span"}
                    sx={{
                      color: "#069cb1",
                      marginLeft: "5px",
                      fontSize: "0.9rem",
                    }}
                  >
                    {(rol.casting &&
                      rol.casting.length > 0 &&
                      conversorFecha(
                        new Date(
                          Math.max(
                            ...rol.casting.map(
                              (c) =>
                                c.fecha_fin?.getTime() ||
                                c.fecha_inicio?.getTime() ||
                                0
                            )
                          )
                        )
                      )) ||
                      textos["no_especificado"]}
                  </Typography>
                </Typography>
              </Box>
            </Grid>
            <Grid container item xs={12}>
              <Grid xs={6} item>
                <Typography sx={{ color: "#069cb1", fontSize: ".9rem" }}>
                  {popUp === true ? (
                    <>
                      {textos["inicio_de_proyecto"]}
                      <Typography
                        component={"span"}
                        sx={{
                          paddingLeft: "5px",
                          paddingRight: "5px",
                          color: "#069cb1",
                          fontSize: ".9rem",
                        }}
                      >
                        {(rol.filmaciones &&
                          rol.filmaciones.length > 0 &&
                          rol.filmaciones[0]?.fecha_inicio &&
                          conversorFecha(rol.filmaciones[0]?.fecha_inicio)) ||
                          textos["no_especificado"]}
                      </Typography>
                    </>
                  ) : (
                    ""
                  )}
                  {textos["en"]}{" "}
                  {(rol.casting &&
                    rol.casting.length > 0 &&
                    rol.casting[0]?.estado_republica.es) ||
                    textos["no_especificado"]}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                {popUp === true ? (
                  <Typography sx={{ color: "#069cb1", fontSize: ".9rem" }}>
                    {textos["aceptando_aplicaciones_de"]}:
                    <Typography
                      component={"span"}
                      sx={{
                        marginLeft: "5px",
                        color: "#069cb1",
                        fontSize: ".9rem",
                      }}
                    >
                      {(rol.casting &&
                        rol.casting.length > 0 &&
                        rol.casting
                          .reduce(
                            (acumulador, current) =>
                              (acumulador +=
                                current.estado_republica.es + ", "),
                            ""
                          )
                          .slice(0, -2)) ||
                        textos["no_especificado"]}
                    </Typography>
                  </Typography>
                ) : (
                  ""
                )}
              </Grid>
            </Grid>
            {popUp === true ? (
              <Grid item xs={12}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Image
                    style={{ borderRadius: "50%", border: "2px solid #000" }}
                    src={
                      rol.proyecto.cazatalentos.foto_perfil
                        ? rol.proyecto.cazatalentos.foto_perfil.url
                        : "/assets/img/no-image.png"
                    }
                    width={25}
                    height={25}
                    alt=""
                  />

                  <Typography sx={{ fontSize: "0.9rem", fontWeight: 400 }}>
                    {textos["proyecto_por"]}: {rol.proyecto.productor}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      paddingLeft: "10px",
                      gap: 1,
                      cursor: "pointer",
                    }}
                  >
                    <Image
                      src="/assets/img/iconos/eye_blue.svg"
                      width={20}
                      height={20}
                      alt=""
                    />
                    <Button
                      onClick={() => {
                        setDialogInfoProductor({ open: true });
                      }}
                      style={{ textTransform: "capitalize" }}
                    >
                      {textos["ver"]} {textos["perfil"]}
                    </Button>
                  </Box>
                </Box>
              </Grid>
            ) : (
              ""
            )}
            <Grid item xs={12} mt={1}>
              <Divider sx={{ borderWidth: 1 }} />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                <Typography>{rol.proyecto.tipo.tipo_proyecto.es}</Typography>
                <Divider
                  style={{
                    borderWidth: 1,
                    height: 12,
                    borderColor: "#069cb1",
                    margin: 8,
                  }}
                  orientation="vertical"
                />
                {rol?.compensaciones &&
                rol.compensaciones?.compensaciones_no_monetarias &&
                rol.compensaciones.compensaciones_no_monetarias.length > 0 ? (
                  rol.compensaciones.compensaciones_no_monetarias.map(
                    (c, i) => (
                      <Fragment key={c.id}>
                        <Typography>{c.compensacion.es}</Typography>
                        <Divider
                          style={{
                            borderWidth: 1,
                            height: 12,
                            borderColor: "#069cb1",
                            margin: 8,
                          }}
                          orientation="vertical"
                        />
                        {i === 4 ? (
                          <>
                            {popUp === true ? (
                              <Button onClick={() => setShowPreview((v) => !v)}>
                                <MotionImage
                                  src="/assets/img/iconos/arrow_d_blue.svg"
                                  width={20}
                                  height={20}
                                  alt=""
                                  animate={{
                                    rotate: showPreview ? "180deg" : "0",
                                  }}
                                />
                              </Button>
                            ) : (
                              ""
                            )}
                          </>
                        ) : (
                          ""
                        )}
                      </Fragment>
                    )
                  )
                ) : (
                  <>
                    <Typography>{textos["no_especificado"]}</Typography>
                    <Divider
                      style={{
                        borderWidth: 1,
                        height: 12,
                        borderColor: "#069cb1",
                        margin: 8,
                      }}
                      orientation="vertical"
                    />
                  </>
                )}

                <Typography>{rol.proyecto.sindicato.sindicato.es}</Typography>
                <Divider
                  style={{
                    borderWidth: 1,
                    height: 12,
                    borderColor: "#069cb1",
                    margin: 8,
                  }}
                  orientation="vertical"
                />
              </Box>
              <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                <Typography>
                  {rol?.tipo_rol?.tipo || textos["no_especificado"]}
                </Typography>
                <Divider
                  style={{
                    borderWidth: 1,
                    height: 12,
                    borderColor: "#069cb1",
                    margin: 8,
                  }}
                  orientation="vertical"
                />

                {rol.filtros_demograficos &&
                rol.filtros_demograficos.generos &&
                rol.filtros_demograficos.generos.length > 0 ? (
                  rol.filtros_demograficos.generos.map((g) => (
                    <Fragment key={g.id}>
                      <Typography>{g.genero.es}</Typography>
                      <Divider
                        style={{
                          borderWidth: 1,
                          height: 12,
                          borderColor: "#069cb1",
                          margin: 8,
                        }}
                        orientation="vertical"
                      />
                    </Fragment>
                  ))
                ) : (
                  <>
                    <Typography>{textos["no_especificado"]}</Typography>
                    <Divider
                      style={{
                        borderWidth: 1,
                        height: 12,
                        borderColor: "#069cb1",
                        margin: 8,
                      }}
                      orientation="vertical"
                    />
                  </>
                )}

                <Typography>
                  {rol.filtros_demograficos &&
                  rol.filtros_demograficos.rango_edad_inicio &&
                  rol.filtros_demograficos.rango_edad_fin
                    ? `${rol.filtros_demograficos.rango_edad_inicio}-${rol.filtros_demograficos.rango_edad_fin}`
                    : textos["no_especificado"]}
                </Typography>
                <Divider
                  style={{
                    borderWidth: 1,
                    height: 12,
                    borderColor: "#069cb1",
                    margin: 8,
                  }}
                  orientation="vertical"
                />

                {rol.filtros_demograficos &&
                rol.filtros_demograficos.aparencias_etnicas &&
                rol.filtros_demograficos.aparencias_etnicas.length > 0 ? (
                  rol.filtros_demograficos.aparencias_etnicas.map((ae) => (
                    <Fragment key={ae.id}>
                      <Typography>
                        {es_ingles
                          ? ae.aparencia_etnica.en
                          : ae.aparencia_etnica.es}
                      </Typography>
                      <Divider
                        style={{
                          borderWidth: 1,
                          height: 12,
                          borderColor: "#069cb1",
                          margin: 8,
                        }}
                        orientation="vertical"
                      />
                    </Fragment>
                  ))
                ) : (
                  <>
                    <Typography>{textos["no_especificado"]}</Typography>
                    <Divider
                      style={{
                        borderWidth: 1,
                        height: 12,
                        borderColor: "#069cb1",
                        margin: 8,
                      }}
                      orientation="vertical"
                    />
                  </>
                )}

                <Typography>
                  {(rol.filtros_demograficos &&
                    rol.filtros_demograficos.pais.es) ||
                    textos["no_especificado"]}
                </Typography>
              </Box>
              <Typography>
                <Typography
                  fontWeight={600}
                  component={"span"}
                  sx={{ paddingRight: "10px", fontStyle: "italic" }}
                >
                  {textos["descripcion"]}:
                </Typography>
                {rol?.descripcion ?? textos["no_especificado"]}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </GridMotion>
      <GridMotion
        item
        container
        xs={12}
        variants={containerVariants}
        initial="closed"
        animate={showPreview ? "open" : "closed"}
        transition={{ duration: 0.3 }}
        sx={{
          overflow: "hidden",
        }}
      >
        <IndividualData title={`${textos["habilidades"] ?? ""}:`}>
          {rol.habilidades &&
          rol.habilidades.habilidades_seleccionadas &&
          rol.habilidades.habilidades_seleccionadas.length > 0 ? (
            rol.habilidades.habilidades_seleccionadas.map((h, i) => (
              <Fragment key={h.id}>
                <Typography component={"span"} sx={{ color: "#928F8F" }}>
                  {es_ingles ? h.habilidad.en : h.habilidad.es}
                </Typography>
                {i !== rol.habilidades.habilidades_seleccionadas.length - 1 && (
                  <Divider
                    style={{
                      borderWidth: 1,
                      height: 12,
                      borderColor: "#069cb1",
                      margin: 8,
                    }}
                    orientation="vertical"
                  />
                )}
              </Fragment>
            ))
          ) : (
            <>
              <Typography component={"span"} sx={{ color: "#928F8F" }}>
                {textos["no_especificado"]}
              </Typography>
            </>
          )}
        </IndividualData>

        <IndividualData
          title={`${textos["desnudos_o_situaciones_sexuales"] ?? ""}:`}
        >
          {rol.nsfw &&
          rol.nsfw.nsfw_seleccionados &&
          rol.nsfw.nsfw_seleccionados.length > 0 ? (
            rol.nsfw.nsfw_seleccionados.map((n, i) => (
              <Fragment key={n.id}>
                <Typography component={"span"} sx={{ color: "#928F8F" }}>
                  {es_ingles ? n.nsfw.en : n.nsfw.es}
                </Typography>
                {i !== rol.nsfw.nsfw_seleccionados.length - 1 && (
                  <Divider
                    style={{
                      borderWidth: 1,
                      height: 12,
                      borderColor: "#069cb1",
                      margin: 8,
                    }}
                    orientation="vertical"
                  />
                )}
              </Fragment>
            ))
          ) : (
            <>
              <Typography component={"span"} sx={{ color: "#928F8F" }}>
                {textos["no_especificado"]}
              </Typography>
            </>
          )}
        </IndividualData>

        <IndividualData
          title={`${textos["locacion_de_casting_y_fechas"] ?? ""}:`}
        >
          {rol.casting && rol.casting.length > 0 ? (
            rol.casting.map((c, i) => (
              <Fragment key={c.id}>
                <Typography component={"span"} sx={{ color: "#928F8F" }}>
                  {c.estado_republica.es}
                </Typography>
                <Divider
                  style={{
                    borderWidth: 1,
                    height: 12,
                    borderColor: "#069cb1",
                    margin: 8,
                  }}
                  orientation="vertical"
                />
                <Typography component={"span"} sx={{ color: "#928F8F" }}>
                  {conversorFecha(c.fecha_inicio)}
                </Typography>
                {c.fecha_fin && (
                  <Typography
                    component={"span"}
                    sx={{ color: "#928F8F", paddingLeft: "5px" }}
                  >
                    {" "}
                    a {conversorFecha(c.fecha_fin)}
                  </Typography>
                )}
                {i !== rol.casting.length - 1 && (
                  <Divider
                    style={{
                      borderWidth: 1,
                      height: 12,
                      borderColor: "#069cb1",
                      margin: 8,
                    }}
                    orientation="vertical"
                  />
                )}
              </Fragment>
            ))
          ) : (
            <>
              <Typography component={"span"} sx={{ color: "#928F8F" }}>
                {textos["no_especificado"]}
              </Typography>
            </>
          )}
        </IndividualData>

        <IndividualData
          title={`${textos["locacion_de_filmacion_y_fechas"] ?? ""}:`}
        >
          {rol.filmaciones && rol.filmaciones.length > 0 ? (
            rol.filmaciones.map((c, i) => (
              <Fragment key={c.id}>
                <Typography component={"span"} sx={{ color: "#928F8F" }}>
                  {c.estado_republica.es}
                </Typography>
                <Divider
                  style={{
                    borderWidth: 1,
                    height: 12,
                    borderColor: "#069cb1",
                    margin: 8,
                  }}
                  orientation="vertical"
                />
                <Typography component={"span"} sx={{ color: "#928F8F" }}>
                  {conversorFecha(c.fecha_inicio)}
                </Typography>
                {c.fecha_fin && (
                  <Typography
                    component={"span"}
                    sx={{ color: "#928F8F", paddingLeft: "5px" }}
                  >
                    {" "}
                    a {conversorFecha(c.fecha_fin)}
                  </Typography>
                )}
                {i !== rol.filmaciones.length - 1 && (
                  <Divider
                    style={{
                      borderWidth: 1,
                      height: 12,
                      borderColor: "#069cb1",
                      margin: 8,
                    }}
                    orientation="vertical"
                  />
                )}
              </Fragment>
            ))
          ) : (
            <>
              <Typography component={"span"} sx={{ color: "#928F8F" }}>
                {textos["no_especificado"]}
              </Typography>
            </>
          )}
        </IndividualData>

        <IndividualData title={`${textos["presentacion_solicitud"] ?? ""}:`}>
          <Typography component={"span"} sx={{ color: "#928F8F" }}>
            {rol?.requisitos?.estado_republica?.es || textos["no_especificado"]}
          </Typography>
          <Divider
            style={{
              borderWidth: 1,
              height: 12,
              borderColor: "#069cb1",
              margin: 8,
            }}
            orientation="vertical"
          />
          <Typography component={"span"} sx={{ color: "#928F8F" }}>
            {(rol.requisitos &&
              rol.requisitos.presentacion_solicitud &&
              conversorFecha(rol.requisitos.presentacion_solicitud)) ||
              textos["no_especificado"]}
          </Typography>
          <Divider
            style={{
              borderWidth: 1,
              height: 12,
              borderColor: "#069cb1",
              margin: 8,
            }}
            orientation="vertical"
          />
          <Typography component={"span"} sx={{ color: "#928F8F" }}>
            {(rol.requisitos &&
              (es_ingles
                ? rol.requisitos.uso_horario.en
                : rol.requisitos.uso_horario.es)) ||
              textos["no_especificado"]}
          </Typography>
        </IndividualData>

        <IndividualData
          title={`${textos["informacion_trabajo_y_notas"] ?? ""}:`}
        >
          <Typography component={"span"} sx={{ color: "#928F8F" }}>
            {rol.detalles_adicionales || textos["no_especificado"]}
          </Typography>
        </IndividualData>

        <IndividualData title={`${textos["requisitos"] ?? ""}:`}>
          {rol.requisitos &&
          rol.requisitos.medios_multimedia &&
          rol.requisitos.medios_multimedia.length > 0 ? (
            rol.requisitos.medios_multimedia.map((m, i) => (
              <Fragment key={m.id}>
                <Typography component={"span"} sx={{ color: "#928F8F" }}>
                  {es_ingles ? m.medio_multimedia.en : m.medio_multimedia.es}
                </Typography>
                {i !== rol.requisitos.medios_multimedia.length - 1 && (
                  <Divider
                    style={{
                      borderWidth: 1,
                      height: 12,
                      borderColor: "#069cb1",
                      margin: 8,
                    }}
                    orientation="vertical"
                  />
                )}
              </Fragment>
            ))
          ) : (
            <>
              <Typography component={"span"} sx={{ color: "#928F8F" }}>
                {textos["no_especificado"]}
              </Typography>
            </>
          )}
        </IndividualData>

        <IndividualData
          title={`${textos["archivos_adicionales"] ?? ""}:`}
          stylesContainerData={{ gap: 10 }}
        >
          <Typography
            component={"span"}
            sx={{ color: "#069cb1", textDecoration: "underline" }}
          >
            lineas.pdf
          </Typography>
          <Typography
            component={"span"}
            sx={{ color: "#069cb1", textDecoration: "underline" }}
          >
            headshot.jpg
          </Typography>
          <Typography
            component={"span"}
            sx={{ color: "#069cb1", textDecoration: "underline" }}
          >
            referencia1.jpg
          </Typography>
          <Typography
            component={"span"}
            sx={{ color: "#069cb1", textDecoration: "underline" }}
          >
            referencia2.jpg
          </Typography>
        </IndividualData>
      </GridMotion>
      <CazatalentosPreview
        onClose={() =>
          setDialogInfoProductor({ ...dialogInfoProductor, open: false })
        }
        open={dialogInfoProductor.open}
        cazatalento={rol.proyecto.cazatalentos}
      />
      <Dialog
        maxWidth={"md"}
        style={{ padding: 0, margin: 0, overflow: "hidden" }}
        open={dialogImage.open}
        onClose={() => setDialogImage({ ...dialogImage, open: false })}
        TransitionComponent={Transition}
      >
        <div
          style={{
            position: "relative",
            width: 800,
            aspectRatio: "900/720",
            maxWidth: "100%",
          }}
        >
          <Image
            fill
            src={dialogImage.image}
            style={{ objectFit: "cover" }}
            alt=""
          />
          <button
            style={{
              width: "40px",
              fontWeight: "900",
              borderRadius: "0.5rem",
              color: "#069cb1",
              textTransform: "none",
              padding: "3px",
              justifyContent: "center",
              zIndex: "1",
              position: "absolute",
              top: 0,
              right: 0,
              display: "flex",
              border: "none",
            }}
            onClick={() => setDialogImage({ ...dialogImage, open: false })}
          >
            X
          </button>
        </div>
      </Dialog>
    </Grid>
  );
};
