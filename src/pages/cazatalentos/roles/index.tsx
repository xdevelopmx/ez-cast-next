import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import React, { Fragment, useContext, useMemo, useState } from "react";
import { Acordeon, Flotantes, MainLayout, MenuLateral } from "~/components";
import { AnimatePresence, type Variants, motion } from "framer-motion";
import UpIcon from "@mui/icons-material/KeyboardArrowUp";
import DownIcon from "@mui/icons-material/KeyboardArrowDown";
import { api, parseErrorBody } from "~/utils/api";
import useNotify from "~/hooks/useNotify";
import CircleIcon from "@mui/icons-material/Circle";
import {
  Box,
  Button,
  Dialog,
  Divider,
  Grid,
  IconButton,
  Skeleton,
  Typography,
} from "@mui/material";
import Constants from "~/constants";
import { useRouter } from "next/router";
import { type User } from "next-auth";
import { getSession } from "next-auth/react";
import ConfirmationDialog from "~/components/shared/ConfirmationDialog";
import Link from "next/link";
import { MTable } from "~/components/shared/MTable/MTable";
import { MContainer } from "~/components/layout/MContainer";
import MotionDiv from "~/components/layout/MotionDiv";
import { TipoUsuario } from "~/enums";
import { Alertas } from "~/components/componentes-dashboards/Alertas copy";
//import useDelay from "~/hooks/useDelay";
import estilos from "./estilos.module.css";
import AppContext from "~/context/app";
import useLang from "~/hooks/useLang";
import { MTooltip } from "~/components/shared/MTooltip";

const variants: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
};

type RolesIndexPageProps = {
  user?: User;
  id_proyecto: number;
  can_edit: boolean;
  onProjectChange?: (
    action: "PROYECTO_APROBADO" | "PROYECTO_RECHAZADO"
  ) => void;
};

function handleRolApplication(map: Map<string, number>, key: string) {
  const count = map.get(key);
  if (count) {
    map.set(key, count + 1);
  } else {
    map.set(key, 1);
  }
}

const AnimatedImage = motion(Image);

const RolesIndexPage: NextPage<RolesIndexPageProps> = ({
  user,
  id_proyecto,
  can_edit,
  onProjectChange,
}) => {
  const ctx = useContext(AppContext);
  const textos = useLang(ctx.lang);
  const [tabSelected, setTabSelected] = useState<"ACTIVOS" | "ARCHIVADOS">(
    "ACTIVOS"
  );
  const [confirmation_dialog, setConfirmationDialog] = useState<{
    opened: boolean;
    title: string;
    content: JSX.Element;
    action: "STATE_CHANGE" | "DELETE" | "PROYECTO_ENVIADO_A_APROBACION";
    data: Map<string, unknown>;
  }>({
    opened: false,
    title: "",
    content: <></>,
    action: "DELETE",
    data: new Map(),
  });
  const [proyecto_details_expanded, setProyectoDetailsExpanded] =
    useState(false);
  const { notify } = useNotify();
  const router = useRouter();
  const [expanded_rows, setExpandedRows] = useState<string[]>([]);

  const [modalConfirmacion, setModalConfirmacion] = useState(false);

  const proyecto = api.proyectos.getById.useQuery(id_proyecto, {
    refetchOnWindowFocus: false,
  });

  const roles = api.roles.getAllCompleteByProyecto.useQuery(id_proyecto, {
    refetchOnWindowFocus: false,
  });

  //const delayed_proyecto_fetching = useDelay(1500);

  const talentos_applications_stats = useMemo(() => {
    const map = new Map<string, number>();
    if (roles.data) {
      roles.data.forEach((r) => {
        r.aplicaciones_por_talento.forEach((apt) => {
          switch (apt.id_estado_aplicacion) {
            case Constants.ESTADOS_APLICACION_ROL.NO_VISTO: {
              handleRolApplication(map, `${apt.id_rol}-no-vistos`);
              break;
            }
            case Constants.ESTADOS_APLICACION_ROL.VISTO: {
              handleRolApplication(map, `${apt.id_rol}-vistos`);
              break;
            }
            case Constants.ESTADOS_APLICACION_ROL.DESTACADO: {
              handleRolApplication(map, `${apt.id_rol}-destacados`);
              break;
            }
            case Constants.ESTADOS_APLICACION_ROL.AUDICION: {
              handleRolApplication(map, `${apt.id_rol}-audicion`);
              break;
            }
            case Constants.ESTADOS_APLICACION_ROL.CALLBACK: {
              handleRolApplication(map, `${apt.id_rol}-callback`);
              break;
            }
          }
        });
      });
    }
    return map;
  }, [roles.data]);

  const filtered_roles = useMemo(() => {
    if (roles.data) {
      if (tabSelected === "ARCHIVADOS") {
        return roles.data.filter(
          (p) => p.estatus.toUpperCase() === "ARCHIVADO"
        );
      }
      return roles.data.filter((p) => p.estatus.toUpperCase() !== "ARCHIVADO");
    }
    return [];
  }, [tabSelected, roles.data]);

  const no_data_message = useMemo(() => {
    if (tabSelected === "ACTIVOS") {
      return (
        <div className="box_message_blue">
          <p className="h3">{`${textos["no_roles_creados_title"]}`}</p>
          <p>{`${textos["no_roles_creados_body"]}`}</p>
        </div>
      );
    }
    if (tabSelected === "ARCHIVADOS") {
      return (
        <div className="box_message_blue">
          <p className="h3">{`${textos["no_roles_archivados_title"]}`}</p>
          <p>
            {`${textos["no_roles_archivados_body"]}`}
            <br />
          </p>
        </div>
      );
    }
  }, [tabSelected, textos]);

  const deleteRol = api.roles.deleteRolById.useMutation({
    onSuccess() {
      notify("success", `${textos['se_elimino_el_rol_con_exito']}`);
      void roles.refetch();
    },
    onError(error) {
      notify("error", parseErrorBody(error.message));
    },
  });

  const updateEstadoRol = api.roles.updateEstadoRolById.useMutation({
    onSuccess() {
      notify("success", `${textos['se_cambio_el_estado_del_rol_con_exito']}`);
      void roles.refetch();
    },
    onError(error) {
      notify("error", parseErrorBody(error.message));
    },
  });

  const updateEstadoProyecto = api.proyectos.updateEstadoProyecto.useMutation({
    onSuccess() {
      notify("success", `${textos['se_cambio_el_estado_del_proyecto_con_exito']}`);
      void proyecto.refetch();
    },
    onError(error) {
      notify("error", parseErrorBody(error.message));
    },
  });

  const IS_ADMIN = user && user.tipo_usuario === TipoUsuario.ADMIN;

  const table_actions = [
    <Typography
      key={1}
      sx={{ color: "#000", textAlign: "center !important" }}
      fontSize={"1.2rem"}
      fontWeight={600}
      component={"p"}
    >
      {`${textos["nombre"]}`}
    </Typography>,
    <Typography
      key={2}
      sx={{ color: "#000", textAlign: "center !important" }}
      fontSize={"1.2rem"}
      fontWeight={600}
      component={"p"}
    >
      {`${textos["estado"]}`}
    </Typography>,
    <Typography
      key={3}
      sx={{ color: "#000", textAlign: "center !important" }}
      fontSize={"1.2rem"}
      fontWeight={600}
      component={"p"}
    >
      {`${textos["no_visto"]}`}
    </Typography>,
    <Typography
      key={4}
      sx={{ color: "#000", textAlign: "center !important" }}
      fontSize={"1.2rem"}
      fontWeight={600}
      component={"p"}
    >
      {`${textos["visto"]}`}
    </Typography>,
    <Typography
      key={5}
      sx={{ color: "#000", textAlign: "center !important" }}
      fontSize={"1.2rem"}
      fontWeight={600}
      component={"p"}
    >
      {`${textos["destacado"]}`}
    </Typography>,
    <Typography
      key={6}
      sx={{ color: "#000", textAlign: "center !important" }}
      fontSize={"1.2rem"}
      fontWeight={600}
      component={"p"}
    >
      {`${textos["audicion"]}`}
    </Typography>,
    <Typography
      key={7}
      sx={{ color: "#000", textAlign: "center !important" }}
      fontSize={"1.2rem"}
      fontWeight={600}
      component={"p"}
    >
      Callback
    </Typography>,
  ];

  return (
    <>
      <Head>
        <title>DashBoard ~ Cazatalentos | Talent Corner</title>
        <meta name="description" content="Talent Corner" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MainLayout
        style={{ marginTop: IS_ADMIN ? 0 : 76 }}
        menuSiempreBlanco={true}
        hideFooter={IS_ADMIN}
        hideHeader={IS_ADMIN}
      >
        <div className="d-flex wrapper_ezc">
          {!IS_ADMIN && <MenuLateral />}
          <div className="seccion_container col" style={{ paddingTop: 0 }}>
            <br />
            <br />
            <div className="container_box_header">
              {!IS_ADMIN && (
                <div
                  className="d-flex"
                  style={{
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Button
                    onClick={() => {
                      void router.replace(`/cazatalentos/dashboard`);
                    }}
                    variant="text"
                    startIcon={
                      <motion.img
                        src="/assets/img/iconos/return_blue.svg"
                        alt="icono"
                      />
                    }
                  >
                    <p
                      className="color_a mb-0 ml-2"
                      style={{ fontWeight: 400 }}
                    >
                      <>{`${textos["regresar_vista_general"]}`}</>
                    </p>
                  </Button>
                  {!IS_ADMIN && (
                    <div className="d-flex justify-content-end align-items-start py-2">
                      <Alertas
                        style={{
                          position: "static",
                          padding: "0 !important",
                        }}
                        messageProps={{
                          style: {
                            marginRight: "0px !important",
                          },
                        }}
                      />
                    </div>
                  )}
                </div>
              )}
              <br />
              <MContainer
                direction="horizontal"
                justify="space-between"
                styles={{ alignItems: "center" }}
              >
                <MContainer direction="horizontal">
                  <p
                    className="h5 font-weight-bold"
                    style={{
                      fontSize: "1.5rem !important",
                    }}
                  >
                    <b
                      style={{
                        fontSize: "1.5rem !important",
                      }}
                    >
                      {proyecto.data?.nombre}
                    </b>
                  </p>
                  <motion.div layout>
                    <div
                      className="ctrl_box_top"
                      style={{
                        display: "grid",
                        placeContent: "center",
                        height: 20,
                        padding: 0,
                        paddingRight: 10,
                        paddingLeft: 10,
                        marginTop: 3,
                      }}
                      onClick={() =>
                        setProyectoDetailsExpanded((prev) => !prev)
                      }
                    >
                      <IconButton
                        sx={{
                          padding: 0,
                        }}
                      >
                        <AnimatedImage
                          src={`/assets/img/iconos/arrow_d_white.svg`}
                          initial={false}
                          animate={
                            !proyecto_details_expanded
                              ? {
                                  rotate: "0deg",
                                }
                              : { rotate: "180deg" }
                          }
                          height={12}
                          width={12}
                          alt={"agregar-rol"}
                        />
                      </IconButton>
                    </div>
                  </motion.div>
                </MContainer>
                <Box>
                  {!proyecto.isFetched && (
                    <MContainer
                      direction="horizontal"
                      styles={{ gap: 16, alignItems: "start" }}
                    >
                      <Skeleton
                        style={{ borderRadius: 16 }}
                        width={200}
                        height={64}
                      ></Skeleton>
                      <Skeleton
                        style={{ borderRadius: 16 }}
                        width={200}
                        height={64}
                      ></Skeleton>
                    </MContainer>
                  )}
                  <MotionDiv show={proyecto.isFetched} animation="fade">
                    <>
                      {IS_ADMIN &&
                        proyecto.data &&
                        proyecto.data.estatus ===
                          Constants.ESTADOS_PROYECTO.ENVIADO_A_APROBACION && (
                          <>
                            <MContainer
                              direction="horizontal"
                              styles={{ alignItems: "start" }}
                            >
                              <MContainer
                                direction="vertical"
                                styles={{ marginRight: 8 }}
                              >
                                <Button
                                  onClick={() => {
                                    if (onProjectChange) {
                                      onProjectChange("PROYECTO_RECHAZADO");
                                    }
                                  }}
                                  className="btn btn-sm btn-intro btn-price mb-2"
                                  style={{
                                    padding: "8px 40px",
                                    marginTop: 0,
                                    display: "block",
                                    height: 40,
                                    fontWeight: 500,
                                    backgroundColor: "tomato",
                                    color: "white",
                                  }}
                                >
                                  Rechazar
                                </Button>
                              </MContainer>
                              <MContainer direction="vertical">
                                <Button
                                  onClick={() => {
                                    if (onProjectChange) {
                                      onProjectChange("PROYECTO_APROBADO");
                                    }
                                  }}
                                  className="btn btn-sm btn-intro btn-price mb-2"
                                  style={{
                                    padding: "8px 40px",
                                    marginTop: 0,
                                    display: "block",
                                    height: 40,
                                    fontWeight: 500,
                                    backgroundColor: "forestgreen",
                                    color: "white",
                                  }}
                                >
                                  Aprobar
                                </Button>
                              </MContainer>
                            </MContainer>
                          </>
                        )}
                      {!IS_ADMIN &&
                        proyecto.data &&
                        [
                          Constants.ESTADOS_PROYECTO.RECHAZADO,
                          Constants.ESTADOS_PROYECTO.ARCHIVADO,
                          Constants.ESTADOS_PROYECTO.POR_VALIDAR,
                        ].includes(proyecto.data.estatus) && (
                          <>
                            <MContainer
                              direction="horizontal"
                              styles={{ alignItems: "start" }}
                            >
                              <Link
                                href={`/cazatalentos/roles/agregar-rol?id-proyecto=${id_proyecto}`}
                              >
                                <Button
                                  className="btn btn-intro btn-price btn_out_line mb-2"
                                  startIcon={
                                    <Image
                                      src={`/assets/img/iconos/cruz_ye.svg`}
                                      height={16}
                                      width={16}
                                      alt={"agregar-rol"}
                                    />
                                  }
                                  style={{
                                    padding: "8px 40px",
                                    marginTop: 0,
                                    marginRight: 10,
                                    fontWeight: 500,
                                  }}
                                >
                                  {`${textos["nuevo_rol"]}`}
                                </Button>
                              </Link>
                              <MContainer direction="vertical">
                                <>
                                  {![
                                    Constants.ESTADOS_PROYECTO.APROBADO,
                                    Constants.ESTADOS_PROYECTO
                                      .ENVIADO_A_APROBACION,
                                  ].includes(
                                    proyecto.data ? proyecto.data.estatus : ""
                                  ) && (
                                    <Button
                                      onClick={() => {
                                        setConfirmationDialog({
                                          action:
                                            "PROYECTO_ENVIADO_A_APROBACION",
                                          data: new Map<string, unknown>(),
                                          opened: true,
                                          title: `${textos["enviar_proyecto_a_aprobacion_title"]}`,
                                          content: (
                                            <Typography variant="body2">{`${textos["enviar_proyecto_a_aprobacion_body"]}`}</Typography>
                                          ),
                                        });
                                      }}
                                      className="btn btn-sm btn-intro btn-price mb-2"
                                      style={{
                                        padding: "8px 40px",
                                        marginTop: 0,
                                        display: "block",
                                        height: 40,
                                        fontWeight: 700,
                                        textTransform: "none",
                                        color: "#000",
                                      }}
                                    >
                                      {`${textos["enviar_proyecto_para_aprobacion"]}`}
                                    </Button>
                                  )}
                                </>
                              </MContainer>
                            </MContainer>
                          </>
                        )}
                    </>
                  </MotionDiv>
                </Box>
              </MContainer>
              <MContainer direction="vertical">
                <MContainer direction="horizontal">
                  <MContainer direction="horizontal" styles={{}}>
                    <CircleIcon
                      style={{
                        color: (() => {
                          let color = "grey";
                          switch (proyecto.data?.estatus.toUpperCase()) {
                            case Constants.ESTADOS_PROYECTO
                              .ENVIADO_A_APROBACION:
                              color = "gold";
                              break;
                            case Constants.ESTADOS_PROYECTO.RECHAZADO:
                              color = "tomato";
                              break;
                            case Constants.ESTADOS_PROYECTO.APROBADO:
                              color = "green";
                              break;
                          }
                          return color;
                        })(),
                        width: 12,
                        height: 12,
                        marginRight: 5,
                        marginTop: 6,
                      }}
                    />
                    <Typography
                      variant="subtitle2"
                      sx={{
                        textTransform: "capitalize !important",
                        fontSize: "1.1rem",
                      }}
                    >
                      {proyecto.data
                        ? proyecto.data?.estatus
                            .replaceAll("_", " ")
                            .toLocaleLowerCase()
                        : "ND"}
                    </Typography>
                  </MContainer>
                  <Divider
                    style={{
                      borderWidth: 1,
                      height: 12,
                      borderColor: "#069cb1",
                      margin: 8,
                    }}
                    orientation="vertical"
                  />
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontSize: "1.1rem",
                    }}
                  >
                    {proyecto.data && proyecto.data.tipo
                      ? proyecto.data.tipo.id_tipo_proyecto === 99
                        ? proyecto.data.tipo.descripcion
                        : ctx.lang === "es"
                        ? proyecto.data.tipo.tipo_proyecto.es
                        : proyecto.data.tipo.tipo_proyecto.en
                      : "ND"}
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
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontSize: "1.1rem",
                    }}
                  >
                    {proyecto.data && proyecto.data.sindicato
                      ? proyecto.data.sindicato.id_sindicato === 99
                        ? proyecto.data.sindicato.descripcion
                        : ctx.lang === "es"
                        ? proyecto.data.sindicato.sindicato.es
                        : proyecto.data.sindicato.sindicato.en
                      : "ND"}
                  </Typography>
                </MContainer>
                <Divider style={{ borderWidth: 2 }} />
              </MContainer>

              <MotionDiv show={proyecto_details_expanded} animation="fade">
                <Grid container>
                  <Grid mt={2} item xs={12}>
                    <Typography
                      style={{ color: "#069cb1", fontStyle: "italic" }}
                    >
                      {`${textos["contacto_casting"]}`}
                    </Typography>
                    <Divider style={{ borderWidth: 1 }} />
                  </Grid>
                  <Grid mt={2} item xs={12} md={12}>
                    <Typography fontWeight={500}>
                      {proyecto.data ? proyecto.data.director_casting : "ND"}
                      &nbsp;&nbsp; &nbsp;&nbsp;
                      <span style={{ color: "#928F8F", fontWeight: "400" }}>
                        {proyecto.data ? proyecto.data.email_contacto : "ND"}
                      </span>
                      &nbsp;&nbsp; &nbsp;&nbsp;
                      <span style={{ color: "#928F8F", fontWeight: "400" }}>
                        {proyecto.data ? proyecto.data.telefono_contacto : "ND"}
                      </span>
                    </Typography>
                  </Grid>

                  <Grid mt={2} item xs={12}>
                    <Typography
                      style={{ color: "#069cb1", fontStyle: "italic" }}
                    >
                      {`${textos["equipo_creativo"]}`}
                    </Typography>
                    <Divider style={{ borderWidth: 1 }} />
                  </Grid>
                  <Grid mt={2} item md={4}>
                    <MContainer direction="horizontal">
                      <Typography sx={{ paddingRight: 2, fontWeight: 600 }}>
                        {`${textos["productor"]}`}
                      </Typography>
                      <Typography sx={{ color: "#928F8F" }}>
                        {proyecto.data ? proyecto.data.productor : "ND"}
                      </Typography>
                    </MContainer>
                  </Grid>
                  <Grid mt={2} item md={6}>
                    <MContainer direction="horizontal">
                      <Typography sx={{ paddingRight: 2, fontWeight: 600 }}>
                        Director
                      </Typography>
                      <Typography sx={{ color: "#928F8F" }}>
                        {proyecto.data ? proyecto.data.director : "ND"}
                      </Typography>
                    </MContainer>
                  </Grid>
                  <Grid mt={2} item md={4}>
                    <MContainer direction="horizontal">
                      <Typography sx={{ paddingRight: 2, fontWeight: 600 }}>
                        {`${textos["casa_productora"]}`}
                      </Typography>
                      <Typography sx={{ color: "#928F8F" }}>
                        {proyecto.data ? proyecto.data.casa_productora : "ND"}
                      </Typography>
                    </MContainer>
                  </Grid>
                  <Grid mt={2} item md={6}>
                    <MContainer direction="horizontal">
                      <Typography sx={{ paddingRight: 2, fontWeight: 600 }}>
                        {`${textos["agencia_publicidad"]}`}
                      </Typography>
                      <Typography sx={{ color: "#928F8F" }}>
                        {proyecto.data
                          ? proyecto.data.agencia_publicidad
                          : "ND"}
                      </Typography>
                    </MContainer>
                  </Grid>
                  <Grid mt={2} item xs={12}>
                    <Typography
                      style={{ color: "#069cb1", fontStyle: "italic" }}
                    >
                      {`${textos["detalles_adicionales"]}`}
                    </Typography>
                    <Divider style={{ borderWidth: 1 }} />
                  </Grid>
                  <Grid mt={2} item xs={12}>
                    <MContainer direction="horizontal">
                      <Typography sx={{ paddingRight: 2, fontWeight: 600 }}>
                        {`${textos["sinopsis"]}`}
                      </Typography>
                      <Typography sx={{ color: "#928F8F" }}>
                        {proyecto.data ? proyecto.data.sinopsis : "ND"}
                      </Typography>
                    </MContainer>
                  </Grid>
                  <Grid mt={2} item xs={12}>
                    <MContainer direction="horizontal">
                      <Typography sx={{ paddingRight: 2, fontWeight: 100 }}>
                        {`${textos["archivos"]}`}
                      </Typography>
                      <Typography>{"ND"}</Typography>
                    </MContainer>
                  </Grid>
                  <Grid mt={2} item xs={12}>
                    <Typography
                      style={{ color: "#069cb1", fontStyle: "italic" }}
                    >
                      {`${textos["locacion_proyecto"]}`}
                    </Typography>
                    <Divider style={{ borderWidth: 1 }} />
                  </Grid>

                  <Grid mt={2} item xs={12}>
                    <MContainer direction="horizontal">
                      <Typography sx={{ paddingRight: 2, fontWeight: 600 }}>
                        {`${textos["estado"]}`}
                      </Typography>
                      <Typography sx={{ color: "#928F8F" }}>
                        {proyecto.data
                          ? proyecto.data.estado_republica.es
                          : "ND"}
                      </Typography>
                    </MContainer>
                  </Grid>
                </Grid>
              </MotionDiv>
            </div>

            <div className="row mt-5">
              <div className="col container_list_proyects">
                <div className="row">
                  <ul
                    className="nav nav-tabs col ml-3"
                    id="myTab"
                    role="tablist"
                  >
                    <li className="nav-item">
                      <a
                        onClick={() => {
                          setTabSelected("ACTIVOS");
                        }}
                        className={`nav-link ${
                          tabSelected === "ACTIVOS" ? "active" : ""
                        }`}
                        id="activos-tab"
                        data-toggle="tab"
                        href="#activos"
                        role="tab"
                        aria-controls="activos"
                        aria-selected="true"
                      >
                        {`${textos["roles_actuales"]}`}
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        onClick={() => {
                          setTabSelected("ARCHIVADOS");
                        }}
                        className={`nav-link ${
                          tabSelected === "ARCHIVADOS" ? "active" : ""
                        }`}
                        id="archivados-tab"
                        data-toggle="tab"
                        href="#archivados"
                        role="tab"
                        aria-controls="archivados"
                        aria-selected="false"
                      >
                        {`${textos["roles_archivados"]}`}
                      </a>
                    </li>
                  </ul>
                </div>
                <MTable
                  style={{ overflowX: "hidden" }}
                  styleTableRow={{ cursor: "pointer" }}
                  alternate_colors={false}
                  columnsHeader={
                    can_edit
                      ? table_actions.concat(
                          <Typography
                            key={8}
                            sx={{
                              color: "#000",
                              textAlign: "center !important",
                            }}
                            fontSize={"1.2rem"}
                            fontWeight={600}
                            component={"p"}
                          >
                            {`${textos["acciones"]}`}
                          </Typography>
                        )
                      : table_actions
                  }
                  backgroundColorHeader="#069cb1"
                  styleHeaderTableCell={{ padding: "5px !important" }}
                  loading={roles.isFetching}
                  data={
                    filtered_roles
                      ? filtered_roles.map((r) => {
                          const content: {
                            nombre: JSX.Element;
                            estado: string;
                            no_vistos: JSX.Element;
                            vistos: JSX.Element;
                            destacados: JSX.Element;
                            audicion: JSX.Element;
                            callback: JSX.Element;
                            acciones?: JSX.Element;
                          } = {
                            nombre: (
                              <MContainer direction="horizontal">
                                <CircleIcon
                                  style={{
                                    color:
                                      r.estatus.toUpperCase() === "ACTIVO"
                                        ? "green"
                                        : "grey",
                                    width: 12,
                                    height: 12,
                                    marginTop: 6,
                                    marginRight: 4,
                                  }}
                                />
                                <Typography variant="subtitle2">
                                  {r.nombre}
                                </Typography>
                              </MContainer>
                            ),
                            estado:
                              r.estatus === "SIN_FINALIZAR"
                                ? "Pendiente"
                                : "Archivado",
                            no_vistos: (
                              <MContainer
                                direction="horizontal"
                                justify="center"
                              >
                                <Image
                                  src={"/assets/img/iconos/icon_no_vistos.svg"}
                                  width={16}
                                  height={16}
                                  alt="no vistos"
                                />
                                <Typography
                                  style={{ marginLeft: 8 }}
                                  variant={"body2"}
                                >
                                  {talentos_applications_stats.has(
                                    `${r.id}-no-vistos`
                                  )
                                    ? talentos_applications_stats.get(
                                        `${r.id}-no-vistos`
                                      )
                                    : 0}
                                </Typography>
                              </MContainer>
                            ),
                            vistos: (
                              <MContainer
                                direction="horizontal"
                                justify="center"
                              >
                                <Image
                                  src={"/assets/img/iconos/icon_vistos.svg"}
                                  width={16}
                                  height={16}
                                  alt="vistos"
                                />
                                <Typography
                                  style={{ marginLeft: 8 }}
                                  variant={"body2"}
                                >
                                  {talentos_applications_stats.has(
                                    `${r.id}-vistos`
                                  )
                                    ? talentos_applications_stats.get(
                                        `${r.id}-vistos`
                                      )
                                    : 0}
                                </Typography>
                              </MContainer>
                            ),
                            destacados: (
                              <MContainer
                                direction="horizontal"
                                justify="center"
                              >
                                <Image
                                  src={"/assets/img/iconos/icono_star_blue.svg"}
                                  width={16}
                                  height={16}
                                  alt="destacados"
                                />
                                <Typography
                                  style={{ marginLeft: 8 }}
                                  variant={"body2"}
                                >
                                  {talentos_applications_stats.has(
                                    `${r.id}-destacados`
                                  )
                                    ? talentos_applications_stats.get(
                                        `${r.id}-destacados`
                                      )
                                    : 0}
                                </Typography>
                              </MContainer>
                            ),
                            audicion: (
                              <MContainer
                                direction="horizontal"
                                justify="center"
                              >
                                <Image
                                  src={
                                    "/assets/img/iconos/icono_lampara_blue.svg"
                                  }
                                  width={16}
                                  height={16}
                                  alt="audicion"
                                />
                                <Typography
                                  style={{ marginLeft: 8 }}
                                  variant={"body2"}
                                >
                                  {talentos_applications_stats.has(
                                    `${r.id}-audicion`
                                  )
                                    ? talentos_applications_stats.get(
                                        `${r.id}-audicion`
                                      )
                                    : 0}
                                </Typography>
                              </MContainer>
                            ),
                            callback: (
                              <MContainer
                                direction="horizontal"
                                justify="center"
                              >
                                <Image
                                  src={
                                    "/assets/img/iconos/icono_claqueta_blue.svg"
                                  }
                                  width={16}
                                  height={16}
                                  alt="callback"
                                />
                                <Typography
                                  style={{ marginLeft: 8 }}
                                  variant={"body2"}
                                >
                                  {talentos_applications_stats.has(
                                    `${r.id}-callback`
                                  )
                                    ? talentos_applications_stats.get(
                                        `${r.id}-callback`
                                      )
                                    : 0}
                                </Typography>
                              </MContainer>
                            ),
                            acciones: (
                              <MContainer
                                direction="horizontal"
                                justify="center"
                              >
                                <>
                                  <MTooltip
                                    color="orange"
                                    placement="top"
                                    text="Archivar"
                                    icon={
                                      <IconButton
                                        onClick={(e) => {
                                          const params = new Map<
                                            string,
                                            unknown
                                          >();
                                          params.set("id", r.id);
                                          params.set(
                                            "state",
                                            r.estatus.toUpperCase() ===
                                              "ARCHIVADO"
                                              ? "Pendiente"
                                              : "Archivado"
                                          );
                                          setConfirmationDialog({
                                            action: "STATE_CHANGE",
                                            data: params,
                                            opened: true,
                                            title:
                                              r.estatus.toUpperCase() ===
                                              "ARCHIVADO"
                                                ? "Desarchivar"
                                                : "Archivar",
                                            content: (
                                              <Typography variant="body2">{`Seguro que deseas ${
                                                r.estatus.toUpperCase() ===
                                                "ARCHIVADO"
                                                  ? "desarchivar"
                                                  : "archivar"
                                              } este rol?`}</Typography>
                                            ),
                                          });
                                          e.stopPropagation();
                                        }}
                                        color="primary"
                                        aria-label="archivar"
                                        component="label"
                                      >
                                        <Image
                                          src={
                                            "/assets/img/iconos/archivar_blue.svg"
                                          }
                                          width={16}
                                          height={16}
                                          alt="archivar"
                                        />
                                      </IconButton>
                                    }
                                  />
                                  {![
                                    Constants.ESTADOS_PROYECTO.APROBADO,
                                    Constants.ESTADOS_PROYECTO
                                      .ENVIADO_A_APROBACION,
                                  ].includes(
                                    proyecto.data
                                      ? proyecto.data.estatus.toUpperCase()
                                      : ""
                                  ) && (
                                    <>
                                      <MTooltip
                                        color="orange"
                                        placement="top"
                                        text="Editar Rol"
                                        icon={
                                          <IconButton
                                            onClick={(e) => {
                                              void router.push(
                                                `/cazatalentos/roles/agregar-rol?id-proyecto=${r.id_proyecto}&id-rol=${r.id}`
                                              );
                                              e.stopPropagation();
                                            }}
                                            color="primary"
                                            aria-label="editar"
                                            component="label"
                                          >
                                            <Image
                                              src={
                                                "/assets/img/iconos/edit_icon_blue.png"
                                              }
                                              width={16}
                                              height={16}
                                              alt="archivar"
                                            />
                                          </IconButton>
                                        }
                                      />
                                      <MTooltip
                                        color="orange"
                                        placement="top"
                                        text="Archivar"
                                        icon={
                                          <IconButton
                                            onClick={(e) => {
                                              const params = new Map<
                                                string,
                                                unknown
                                              >();
                                              params.set("id", r.id);
                                              setConfirmationDialog({
                                                action: "DELETE",
                                                data: params,
                                                opened: true,
                                                title: "Eliminar Rol",
                                                content: (
                                                  <Typography variant="body2">
                                                    Seguro que deseas eliminar
                                                    este rol?
                                                  </Typography>
                                                ),
                                              });
                                              e.stopPropagation();
                                            }}
                                            style={{padding: 0}}
                                            color="primary"
                                            aria-label="eliminar"
                                            component="label"
                                          >
                                            <Image
                                              src={
                                                "/assets/img/iconos/trash_blue.png"
                                              }
                                              width={16}
                                              height={16}
                                              alt="archivar"
                                            />
                                          </IconButton>
                                        }
                                      />
                                    </>
                                  )}
                                </>
                              </MContainer>
                            ),
                          };
                          if (!can_edit) {
                            delete content.acciones;
                          }
                          return content;
                        })
                      : []
                  }
                  filasExpandidas={expanded_rows}
                  accordionContent={(element_index: number) => {
                    if (roles.isFetching) {
                      return null;
                    }
                    const element = filtered_roles[element_index];
                    if (element) {
                      console.log(element);
                      return (
                        <div style={{ width: "100%" }}>
                          <Grid container p={2}>
                            <Grid item container xs={11}>
                              <Grid item xs={7}>
                                <MContainer
                                  direction="horizontal"
                                  styles={{ gap: 10 }}
                                >
                                  {roles.data ? (
                                    <Typography
                                      component={"span"}
                                      sx={{
                                        color: "#928F8F",
                                        textTransform: "capitalize",
                                      }}
                                    >
                                      {roles.data[element_index]?.tipo_rol.tipo}
                                    </Typography>
                                  ) : (
                                    <>
                                      <Typography sx={{ color: "#928F8F" }}>
                                        No especificado
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
                                    </>
                                  )}
                                  {(
                                    <>
                                      <Divider
                                        style={{
                                          borderWidth: 1,
                                          height: 12,
                                          borderColor: "#069cb1",
                                          margin: 8,
                                        }}
                                        orientation="vertical"
                                      />
                                      <Typography sx={{ color: "#928F8F" }}>
                                        {ctx.lang === 'es' ? element.tipo_rol.es : element.tipo_rol.en}
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
                                    </>
                                  )}

                                  {element.compensaciones &&
                                    element.compensaciones.compensaciones_no_monetarias && element.compensaciones.compensaciones_no_monetarias.length > 0 ? (
                                    <>
                                      {element.compensaciones.compensaciones_no_monetarias.map(
                                        (c, i) => {
                                          return (
                                            <Fragment
                                              key={c.id_compensacion}
                                            >
                                              <Typography
                                                component={"span"}
                                                sx={{ color: "#928F8F" }}
                                              >
                                                {ctx.lang === 'es' ? c.compensacion.es : c.compensacion.en}
                                              </Typography>
                                              {i !==
                                                (element.compensaciones && element.compensaciones.compensaciones_no_monetarias
                                                  .length || 0) -
                                                  1 && (
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
                                          );
                                        }
                                      )}
                                    </>
                                  ) : (
                                    <>
                                      <Typography sx={{ color: "#928F8F" }}>
                                        {textos['no_especificado']}
                                      </Typography>
                                    </>
                                  )}

                                  {element.proyecto && element.proyecto.sindicato ? (
                                    <>
                                    <Fragment>
                                      <Divider
                                        style={{
                                          borderWidth: 1,
                                          height: 12,
                                          borderColor: "#069cb1",
                                          margin: 8,
                                        }}
                                        orientation="vertical"
                                      />
                                      <Typography
                                        component={"span"}
                                        sx={{ color: "#928F8F" }}
                                      >
                                        {
                                          ctx.lang === 'es' ? element.proyecto.sindicato.sindicato.es : element.proyecto.sindicato.sindicato.en
                                        }
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
                                  </>
                                  ) : (
                                    <>
                                      <Divider
                                        style={{
                                          borderWidth: 1,
                                          height: 12,
                                          borderColor: "#069cb1",
                                          margin: 8,
                                        }}
                                        orientation="vertical"
                                      />
                                      <Typography sx={{ color: "#928F8F" }}>
                                        {`${textos['no_especificado']}`}
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
                                    </>
                                  )}
                                </MContainer>

                                <MContainer
                                  direction="horizontal"
                                  styles={{ gap: 10 }}
                                >
                                  {element.filtros_demograficos && element.filtros_demograficos.generos.length > 0 ? (
                                    element.filtros_demograficos.generos.map(
                                      (g) => (
                                        <Fragment key={g.id_genero}>
                                          <Typography
                                            component={"span"}
                                            sx={{ color: "#928F8F" }}
                                          >
                                            {ctx.lang === 'es' ? g.genero.es : g.genero.en}
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
                                      )
                                    )
                                  ) : (
                                    <>
                                      <Typography sx={{ color: "#928F8F" }}>
                                        {`${textos['no_especificado']}`}
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
                                    </>
                                  )}

                                  {element.filtros_demograficos ? (
                                    <>
                                      <Typography
                                        component={"span"}
                                        sx={{ color: "#928F8F" }}
                                      >
                                        {
                                          element.filtros_demograficos.rango_edad_inicio
                                        }
                                        -
                                        {
                                          element.filtros_demograficos.rango_edad_fin
                                        }
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
                                    </>
                                  ) : (
                                    <>
                                      <Typography sx={{ color: "#928F8F" }}>
                                        {`${textos['no_especificado']}`}
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
                                    </>
                                  )}

                                  {element.filtros_demograficos && element.filtros_demograficos.aparencias_etnicas.length > 0 ? (
                                    <>
                                      {element.filtros_demograficos.aparencias_etnicas.map(
                                        (ae) => (
                                          <Fragment
                                            key={ae.id_aparencia_etnica}
                                          >
                                            <Typography
                                              component={"span"}
                                              sx={{ color: "#928F8F" }}
                                            >
                                              {ctx.lang === 'es' ? ae.aparencia_etnica.es : ae.aparencia_etnica.en}
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
                                        )
                                      )}
                                    </>
                                  ) : (
                                    <>
                                      <Typography sx={{ color: "#928F8F" }}>
                                        {`${textos['no_especificado']}`}
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
                                    </>
                                  )}

                                  {element.filtros_demograficos ? (
                                    <Typography
                                      component={"span"}
                                      sx={{ color: "#928F8F" }}
                                    >
                                      {
                                        ctx.lang === 'es' ? element.filtros_demograficos.pais.es : element.filtros_demograficos.pais.en
                                      }
                                    </Typography>
                                  ) : (
                                    <>
                                      <Typography sx={{ color: "#928F8F" }}>
                                        {`${textos['no_especificado']}`}
                                      </Typography>
                                    </>
                                  )}
                                </MContainer>
                              </Grid>
                              <Grid item xs={5}>
                                <Typography
                                  component={"p"}
                                  sx={{ color: "#928F8F" }}
                                >
                                  <Typography
                                    component={"span"}
                                    fontWeight={600}
                                    sx={{
                                      paddingRight: 1,
                                      fontStyle: "italic",
                                      color: "#000000!important",
                                    }}
                                  >
                                    {`${textos["descripcion"]}`}:
                                  </Typography>
                                  {element.descripcion &&
                                    element.descripcion
                                  }
                                  {!element.descripcion &&
                                    `${textos['no_especificado']}`
                                  }
                                </Typography>
                              </Grid>
                            </Grid>
                            <Grid
                              item
                              container
                              justifyContent={"flex-end"}
                              xs={1}
                            >
                              <div>
                                <IconButton
                                  onClick={() => {
                                    setExpandedRows((prev) => {
                                      if (
                                        prev.includes(`panel${element_index}`)
                                      ) {
                                        return prev.filter(
                                          (p) => p !== `panel${element_index}`
                                        );
                                      }
                                      return prev.concat([
                                        `panel${element_index}`,
                                      ]);
                                    });
                                  }}
                                  color="primary"
                                  aria-label="expandir"
                                  component="label"
                                >
                                  {expanded_rows.includes(
                                    `panel${element_index}`
                                  ) ? (
                                    <UpIcon sx={{ color: "#928F8F" }} />
                                  ) : (
                                    <DownIcon sx={{ color: "#928F8F" }} />
                                  )}
                                </IconButton>
                              </div>
                            </Grid>
                            <Grid item xs={12}>
                              <Divider
                                style={{
                                  margin: "6px 0",
                                }}
                              />
                            </Grid>

                            <Acordeon
                              show={expanded_rows.includes(
                                `panel${element_index}`
                              )}
                            >
                              <Grid container>
                                <AnimatePresence>
                                  {expanded_rows.includes(
                                    `panel${element_index}`
                                  ) && (
                                    <motion.div
                                      style={{ width: "100%" }}
                                      variants={variants}
                                      initial="initial"
                                      animate="animate"
                                      exit="exit"
                                    >
                                      <Grid item container xs={12}>
                                        <MContainer direction="horizontal">
                                          <Typography
                                            fontWeight={600}
                                            sx={{
                                              color: "#000000",
                                              paddingRight: 1,
                                              fontStyle: "italic",
                                            }}
                                          >
                                            {`${textos["habilidades"]}`}:
                                          </Typography>
                                          <MContainer direction="horizontal">
                                            {element.habilidades && element.habilidades.habilidades_seleccionadas.length > 0 ? (
                                              <>
                                                {element.habilidades.habilidades_seleccionadas.map(
                                                  (h, i) => {
                                                    if (roles.data) {
                                                      const el =
                                                        roles.data[
                                                          element_index
                                                        ];
                                                      if (el) {
                                                        return (
                                                          <Fragment
                                                            key={h.id_habilidad}
                                                          >
                                                            <Typography
                                                              component={"span"}
                                                              sx={{
                                                                color:
                                                                  "#928F8F",
                                                              }}
                                                            >
                                                              {ctx.lang === 'es' ? h.habilidad.es : h.habilidad.en}
                                                            </Typography>
                                                            {i !==
                                                              (el.habilidades
                                                                ?.habilidades_seleccionadas
                                                                .length || 0) -
                                                                1 && (
                                                              <Divider
                                                                style={{
                                                                  borderWidth: 1,
                                                                  height: 12,
                                                                  borderColor:
                                                                    "#069cb1",
                                                                  margin: 8,
                                                                }}
                                                                orientation="vertical"
                                                              />
                                                            )}
                                                          </Fragment>
                                                        );
                                                      }
                                                    }
                                                  }
                                                )}
                                              </>
                                            ) : (
                                              <>
                                                <Typography
                                                  component={"span"}
                                                  sx={{ color: "#928F8F" }}
                                                >
                                                  {`${textos['no_especificado']}`}
                                                </Typography>
                                              </>
                                            )}
                                          </MContainer>
                                        </MContainer>
                                      </Grid>
                                      <Grid item xs={12}>
                                        <Divider
                                          style={{
                                            margin: "6px 0",
                                          }}
                                        />
                                      </Grid>
                                      <Grid item container xs={12}>
                                        <MContainer direction="horizontal">
                                          <Typography
                                            fontWeight={600}
                                            sx={{
                                              color: "#000000",
                                              paddingRight: 1,
                                              fontStyle: "italic",
                                            }}
                                          >
                                            {`${textos["desnudos_o_situaciones_sexuales"]}`}
                                            :
                                          </Typography>
                                          <MContainer direction="horizontal">
                                            {element.nsfw && element.nsfw.nsfw_seleccionados.length > 0 ? (
                                              <>
                                                {element.nsfw.nsfw_seleccionados.map(
                                                  (n, i) => {
                                                    if (roles.data) {
                                                      const el =
                                                        roles.data[
                                                          element_index
                                                        ];
                                                      if (el) {
                                                        return (
                                                          <Fragment
                                                            key={n.id_nsfw}
                                                          >
                                                            <Typography
                                                              component={"span"}
                                                              sx={{
                                                                color:
                                                                  "#928F8F",
                                                              }}
                                                            >
                                                              {ctx.lang === 'es' ? n.nsfw?.es : n.nsfw?.en}
                                                            </Typography>
                                                            {i !==
                                                              (el.nsfw
                                                                ?.nsfw_seleccionados
                                                                .length || 0) -
                                                                1 && (
                                                              <Divider
                                                                style={{
                                                                  borderWidth: 1,
                                                                  height: 12,
                                                                  borderColor:
                                                                    "#069cb1",
                                                                  margin: 8,
                                                                }}
                                                                orientation="vertical"
                                                              />
                                                            )}
                                                          </Fragment>
                                                        );
                                                      }
                                                    }
                                                  }
                                                )}
                                              </>
                                            ) : (
                                              <>
                                                <Typography
                                                  component={"span"}
                                                  sx={{ color: "#928F8F" }}
                                                >
                                                  {`${textos['no_especificado']}`}
                                                </Typography>
                                              </>
                                            )}
                                          </MContainer>
                                        </MContainer>
                                      </Grid>
                                      <Grid item xs={12}>
                                        <Divider
                                          style={{
                                            margin: "6px 0",
                                          }}
                                        />
                                      </Grid>
                                      <Grid item container xs={12}>
                                        <MContainer direction="horizontal">
                                          <Typography
                                            fontWeight={600}
                                            sx={{
                                              color: "#000000",
                                              paddingRight: 1,
                                              fontStyle: "italic",
                                            }}
                                          >
                                            {`${textos["locacion_de_casting_y_fechas"]}`}
                                            :
                                          </Typography>
                                          <MContainer direction="horizontal">
                                            {element.casting && element.casting.length > 0 ? (
                                              <>
                                                {element.casting.map((c) => (
                                                  
                                                  <Fragment key={c.id}>
                                                    <Typography
                                                      component={"span"}
                                                      sx={{ color: "#928F8F" }}
                                                    >
                                                      {ctx.lang === 'es' ? c.estado_republica.es : c.estado_republica.en}
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
                                                    <Typography
                                                      component={"span"}
                                                      sx={{ color: "#928F8F" }}
                                                    >
                                                      
                                                      {ctx.lang === 'es' ? new Date(c.fecha_inicio).toLocaleDateString('es-mx',{weekday: 'long',year: 'numeric',month: 'long',day: 'numeric',}) + ' ' + new Date(c.fecha_inicio).toLocaleTimeString('es-MX')+ ' - ': new Date(c.fecha_inicio).toLocaleDateString('en-us',{weekday: 'long',year: 'numeric',month: 'long',day: 'numeric',})  + ' ' + new Date(c.fecha_inicio).toLocaleTimeString('en-us')+ ' - '  }
                                                      
                                                      {ctx.lang === 'es' ? (c.fecha_fin?new Date(c.fecha_fin).toLocaleDateString('es-mx',{weekday: 'long',year: 'numeric',month: 'long',day: 'numeric',}) + ' ' + new Date(c.fecha_inicio).toLocaleTimeString('es-MX'):'') : (c.fecha_fin?new Date(c.fecha_fin).toLocaleDateString('en-us',{weekday: 'long',year: 'numeric',month: 'long',day: 'numeric',}) + ' ' + new Date(c.fecha_inicio).toLocaleTimeString('en-us'):'')  }

                                                      
                                                      {/* {c.fecha_inicio.toString()}
                                                      {c.fecha_fin
                                                        ? `a ${c.fecha_fin.toString()}`
                                                        : ""} */}
                                                    </Typography>
                                                  </Fragment>
                                                ))}
                                              </>
                                            ) : (
                                              <>
                                                <Typography
                                                  component={"span"}
                                                  sx={{ color: "#928F8F" }}
                                                >
                                                  {`${textos['no_especificado']}`}
                                                </Typography>
                                              </>
                                            )}
                                          </MContainer>
                                        </MContainer>
                                      </Grid>
                                      <Grid item xs={12}>
                                        <Divider
                                          style={{
                                            margin: "6px 0",
                                          }}
                                        />
                                      </Grid>
                                      <Grid item container xs={12}>
                                        <MContainer direction="horizontal">
                                          <Typography
                                            fontWeight={600}
                                            sx={{
                                              color: "#000000",
                                              paddingRight: 1,
                                              fontStyle: "italic",
                                            }}
                                          >
                                            {`${textos["locacion_de_filmacion_y_fechas"]}`}
                                            :
                                          </Typography>
                                          <MContainer direction="horizontal">
                                            {element.filmaciones && element.filmaciones.length > 0 ? (
                                              <>
                                                {element.filmaciones.map((c) => (
                                                  <Fragment key={c.id}>
                                                    <Typography
                                                      component={"span"}
                                                      sx={{ color: "#928F8F" }}
                                                    >
                                                      {ctx.lang === 'es' ? c.estado_republica.es : c.estado_republica.en}
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
                                                    <Typography
                                                      component={"span"}
                                                      sx={{ color: "#928F8F" }}
                                                    >
                                                      {/* {c.fecha_inicio.toString() + ' -'} */}
                                                      {ctx.lang === 'es' ? new Date(c.fecha_inicio).toLocaleDateString('es-mx',{weekday: 'long',year: 'numeric',month: 'long',day: 'numeric',})+ ' ' + new Date(c.fecha_inicio).toLocaleTimeString('en-mx') + ' - ': new Date(c.fecha_inicio).toLocaleDateString('en-us',{weekday: 'long',year: 'numeric',month: 'long',day: 'numeric',}) + ' ' + new Date(c.fecha_inicio).toLocaleTimeString('en-us')+ ' - '  }
                                                      {ctx.lang === 'es' ? (c.fecha_fin? new Date(c.fecha_fin).toLocaleDateString('es-mx',{weekday: 'long',year: 'numeric',month: 'long',day: 'numeric',})+ ' ' + new Date(c.fecha_inicio).toLocaleTimeString('en-mx'):'') : (c.fecha_fin?new Date(c.fecha_fin).toLocaleDateString('en-us',{weekday: 'long',year: 'numeric',month: 'long',day: 'numeric',})+ ' ' + new Date(c.fecha_inicio).toLocaleTimeString('en-us'):'')  }
                                                      {/* {c.fecha_fin
                                                        ? `a ${c.fecha_fin.toString()}`
                                                        : ""} */}

                                                    </Typography>
                                                  </Fragment>
                                                ))}
                                              </>
                                            ) : (
                                              <>
                                                <Typography
                                                  component={"span"}
                                                  sx={{ color: "#928F8F" }}
                                                >
                                                  {`${textos['no_especificado']}`}
                                                </Typography>
                                              </>
                                            )}
                                          </MContainer>
                                        </MContainer>
                                      </Grid>
                                      <Grid item xs={12}>
                                        <Divider
                                          style={{
                                            margin: "6px 0",
                                          }}
                                        />
                                      </Grid>
                                      <Grid item container xs={12}>
                                        <MContainer direction="horizontal">
                                          <Typography
                                            fontWeight={600}
                                            sx={{
                                              color: "#000000",
                                              paddingRight: 1,
                                              fontStyle: "italic",
                                            }}
                                          >
                                            {`${textos["presentacion_solicitud"]}`}
                                            :
                                          </Typography>
                                          <MContainer direction="horizontal">
                                            {element.requisitos &&
                                              <Typography
                                                component={"span"}
                                                sx={{ color: "#928F8F" }}
                                              >
                                                {ctx.lang === 'es' ? element.requisitos.estado_republica.es : element.requisitos.estado_republica.en}
                                              </Typography>
                                            }
                                            {!element.requisitos &&
                                              <Typography
                                                component={"span"}
                                                sx={{ color: "#928F8F" }}
                                              >
                                                {`${textos['no_especificado']}`}
                                              </Typography>
                                            }

                                            <Divider
                                              style={{
                                                borderWidth: 1,
                                                height: 12,
                                                borderColor: "#069cb1",
                                                margin: 8,
                                              }}
                                              orientation="vertical"
                                            />
                                            {element.requisitos &&
                                              <Typography
                                                component={"span"}
                                                sx={{ color: "#928F8F" }}
                                              >
                                                {element.requisitos.presentacion_solicitud.toLocaleDateString(ctx.lang === 'es' ? 'es-mx' : 'en-us')}
                                              </Typography>
                                            }
                                            {!element.requisitos &&
                                              <Typography
                                                component={"span"}
                                                sx={{ color: "#928F8F" }}
                                              >
                                                {`${textos['no_especificado']}`}
                                              </Typography>
                                            }
                                            <Divider
                                              style={{
                                                borderWidth: 1,
                                                height: 12,
                                                borderColor: "#069cb1",
                                                margin: 8,
                                              }}
                                              orientation="vertical"
                                            />
                                            {element.requisitos &&
                                              <Typography
                                                component={"span"}
                                                sx={{ color: "#928F8F" }}
                                              >
                                                {ctx.lang === 'es' ? element.requisitos.uso_horario.es : element.requisitos.uso_horario.en}
                                              </Typography>
                                            }
                                            {!element.requisitos &&
                                              <Typography
                                                component={"span"}
                                                sx={{ color: "#928F8F" }}
                                              >
                                                {`${textos['no_especificado']}`}
                                              </Typography>
                                            }
                                          </MContainer>
                                        </MContainer>
                                      </Grid>
                                      <Grid item xs={12}>
                                        <Divider
                                          style={{
                                            margin: "6px 0",
                                          }}
                                        />
                                      </Grid>
                                      <Grid item container xs={12}>
                                        <MContainer direction="horizontal">
                                          <Typography
                                            fontWeight={600}
                                            sx={{
                                              color: "#000000",
                                              paddingRight: 1,
                                              fontStyle: "italic",
                                            }}
                                          >
                                            {`${textos["requisitos"]}`}:
                                          </Typography>
                                          <MContainer direction="horizontal">
                                            {element.requisitos && element.requisitos.medios_multimedia.length > 0 ? (
                                              <>
                                                {element.requisitos.medios_multimedia.map(
                                                  (m, i) => {
                                                    if (roles.data) {
                                                      const el =
                                                        roles.data[
                                                          element_index
                                                        ];
                                                      if (el) {
                                                        return (
                                                          <Fragment
                                                            key={
                                                              m.id_medio_multimedia
                                                            }
                                                          >
                                                            <Typography
                                                              component={"span"}
                                                              sx={{
                                                                color:
                                                                  "#928F8F",
                                                              }}
                                                            >
                                                              {
                                                                ctx.lang === 'es' ? m.medio_multimedia.es : m.medio_multimedia.en
                                                              }
                                                            </Typography>
                                                            {i !==
                                                              (el.requisitos
                                                                ?.medios_multimedia
                                                                .length || 0) -
                                                                1 && (
                                                              <Divider
                                                                style={{
                                                                  borderWidth: 1,
                                                                  height: 12,
                                                                  borderColor:
                                                                    "#069cb1",
                                                                  margin: 8,
                                                                }}
                                                                orientation="vertical"
                                                              />
                                                            )}
                                                          </Fragment>
                                                        );
                                                      }
                                                    }
                                                  }
                                                )}
                                              </>
                                            ) : (
                                              <>
                                                <Typography
                                                  component={"span"}
                                                  sx={{ color: "#928F8F" }}
                                                >
                                                  {`${textos['no_especificado']}`}
                                                </Typography>
                                              </>
                                            )}
                                          </MContainer>
                                        </MContainer>
                                      </Grid>
                                      <Grid item xs={12}>
                                        <Divider
                                          style={{
                                            margin: "6px 0",
                                          }}
                                        />
                                      </Grid>
                                      <Grid item container xs={12}>
                                        <MContainer direction="horizontal">
                                          <Typography
                                            fontWeight={600}
                                            sx={{
                                              color: "#000000",
                                              paddingRight: 1,
                                              fontStyle: "italic",
                                            }}
                                          >
                                            {`${textos["archivos_adicionales"]}`}
                                            :
                                          </Typography>
                                          <MContainer
                                            direction="horizontal"
                                            styles={{ gap: 10 }}
                                          >
                                            {element.lineas && (
                                              <Typography
                                                component={"span"}
                                                sx={{
                                                  color: "#069cb1",
                                                  textDecoration: "underline",
                                                }}
                                              >
                                                {element.lineas.nombre}
                                              </Typography>
                                            )}
                                            {element.selftape &&
                                              element.selftape.lineas && (
                                                <Typography
                                                  component={"span"}
                                                  sx={{
                                                    color: "#069cb1",
                                                    textDecoration: "underline",
                                                  }}
                                                >
                                                  {
                                                    element.selftape.lineas
                                                      .nombre
                                                  }
                                                </Typography>
                                              )}
                                            {element.foto_referencia && (
                                              <Typography
                                                component={"span"}
                                                sx={{
                                                  color: "#069cb1",
                                                  textDecoration: "underline",
                                                }}
                                              >
                                                {element.foto_referencia.nombre}
                                              </Typography>
                                            )}
                                          </MContainer>
                                        </MContainer>
                                      </Grid>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </Grid>
                            </Acordeon>
                          </Grid>
                        </div>
                      );
                    }
                    return null;
                  }}
                  noDataContent={
                    filtered_roles.length > 0
                      ? undefined
                      : roles.isFetching
                      ? undefined
                      : no_data_message
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
      <Flotantes />
      <ConfirmationDialog
        opened={confirmation_dialog.opened}
        onOptionSelected={(confirmed: boolean) => {
          if (confirmed) {
            switch (confirmation_dialog.action) {
              case "DELETE": {
                const id = confirmation_dialog.data.get("id");
                if (id) {
                  deleteRol.mutate(id as number);
                }
                break;
              }
              case "PROYECTO_ENVIADO_A_APROBACION": {
                updateEstadoProyecto.mutate({
                  id: id_proyecto,
                  estatus: Constants.ESTADOS_PROYECTO.ENVIADO_A_APROBACION,
                });
                setModalConfirmacion(true);
                break;
              }
              case "STATE_CHANGE": {
                const id = confirmation_dialog.data.get("id");
                const new_state = confirmation_dialog.data.get("state");
                if (id) {
                  updateEstadoRol.mutate({
                    id: id as number,
                    estatus: new_state as string,
                  });
                }
                break;
              }
            }
          }
          setConfirmationDialog({ ...confirmation_dialog, opened: false });
          console.log(confirmed);
        }}
        title={confirmation_dialog.title}
        content={confirmation_dialog.content}
      />

      <Dialog
        open={modalConfirmacion}
        onClose={() => setModalConfirmacion(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <div className={estilos.modal}>
          <Button
            className={estilos["modal-cerrar"]}
            onClick={() => setModalConfirmacion(false)}
          >
            <Image
              src="/assets/img/iconos/close.svg"
              width={20}
              height={20}
              alt=""
            />
          </Button>
          <h3 className={estilos["modal-confirmacion-h3"]}>
            Se ha enviado tu proyecto para aprobación
          </h3>
          <p className={estilos["modal-p"]}>
            Latino/Hispano Nacionalidad al pendiente de tu correo electrónico,
            ya que ahí recibirás respuesta a tu proyecto.
          </p>
          <p>
            ¿Dudas? Visita nuestro centro de ayuda{" "}
            <a className={estilos["modal-a"]} href={"/"} target="_blank">
              {" "}
              aquí.
            </a>{" "}
          </p>
        </div>
      </Dialog>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  const { id_proyecto } = context.query;
  if (session && session.user) {
    if (session.user.tipo_usuario === TipoUsuario.CAZATALENTOS) {
      return {
        props: {
          user: session.user,
          id_proyecto: parseInt(id_proyecto as string),
          can_edit: true,
        },
      };
    }
    return {
      redirect: {
        destination: `/error?cause=${Constants.PAGE_ERRORS.UNAUTHORIZED_USER_ROLE}`,
        permanent: true,
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

export default RolesIndexPage;
