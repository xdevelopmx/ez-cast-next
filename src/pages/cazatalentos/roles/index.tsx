import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import React, { Fragment, useMemo, useState } from "react";
import { Flotantes, MainLayout, MenuLateral } from "~/components";
import { AnimatePresence, type Variants, motion } from "framer-motion";
import UpIcon from "@mui/icons-material/KeyboardArrowUp";
import DownIcon from "@mui/icons-material/KeyboardArrowDown";
import { api, parseErrorBody } from "~/utils/api";
import useNotify from "~/hooks/useNotify";
import CircleIcon from "@mui/icons-material/Circle";
import {
  Box,
  Button,
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

const RolesIndexPage: NextPage<RolesIndexPageProps> = ({
  user,
  id_proyecto,
  can_edit,
  onProjectChange,
}) => {
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

  const proyecto = api.proyectos.getById.useQuery(id_proyecto, {
    refetchOnWindowFocus: false,
  });

  const roles = api.roles.getAllCompleteByProyecto.useQuery(id_proyecto, {
    refetchOnWindowFocus: false,
  });

  //const delayed_proyecto_fetching = useDelay(1500);

  console.log(roles.data);

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
          <p className="h3">No has creado ningún rol</p>
          <p>
            Al crear un rol, aquí tendrás una vista general de tus roles activos
            e inactivos.
            <br />
            Recuerda crear todos tus roles y leer los requisitos de aprobación
            antes de terminar y mandarlos.
            <br />
            ¡Comienza ahora mismo!
          </p>
        </div>
      );
    }
    if (tabSelected === "ARCHIVADOS") {
      return (
        <div className="box_message_blue">
          <p className="h3">No tienes ningún rol archivado</p>
          <p>
            Aquí aparecerán todos los roles que hayas colocado como archivados
            <br />
          </p>
        </div>
      );
    }
  }, [tabSelected]);

  const deleteRol = api.roles.deleteRolById.useMutation({
    onSuccess() {
      notify("success", "Se elimino el rol con éxito");
      void roles.refetch();
    },
    onError(error) {
      notify("error", parseErrorBody(error.message));
    },
  });

  const updateEstadoRol = api.roles.updateEstadoRolById.useMutation({
    onSuccess() {
      notify("success", "Se cambio el estado del rol con éxito");
      void roles.refetch();
    },
    onError(error) {
      notify("error", parseErrorBody(error.message));
    },
  });

  const updateEstadoProyecto = api.proyectos.updateEstadoProyecto.useMutation({
    onSuccess() {
      notify("success", "Se cambio el estado del proyecto con éxito");
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
      sx={{ color: "#000" }}
      fontSize={"1.2rem"}
      fontWeight={600}
      component={"p"}
    >
      Nombre
    </Typography>,
    <Typography
      key={2}
      sx={{ color: "#000" }}
      fontSize={"1.2rem"}
      fontWeight={600}
      component={"p"}
    >
      Estado
    </Typography>,
    <Typography
      key={3}
      sx={{ color: "#000" }}
      fontSize={"1.2rem"}
      fontWeight={600}
      component={"p"}
    >
      No Vistos
    </Typography>,
    <Typography
      key={4}
      sx={{ color: "#000" }}
      fontSize={"1.2rem"}
      fontWeight={600}
      component={"p"}
    >
      Vistos
    </Typography>,
    <Typography
      key={5}
      sx={{ color: "#000" }}
      fontSize={"1.2rem"}
      fontWeight={600}
      component={"p"}
    >
      Destacados
    </Typography>,
    <Typography
      key={6}
      sx={{ color: "#000" }}
      fontSize={"1.2rem"}
      fontWeight={600}
      component={"p"}
    >
      Audición
    </Typography>,
    <Typography
      key={7}
      sx={{ color: "#000" }}
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
                <div className="d-flex justify-content-end align-items-start py-2">
                  <Alertas />
                </div>
              )}
              {!IS_ADMIN && (
                <div className="d-flex">
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
                    <p className="color_a mb-0 ml-2">
                      <b>Regresar a vista general</b>
                    </p>
                  </Button>
                </div>
              )}
              <br />
              <MContainer direction="horizontal" justify="space-between">
                <MContainer direction="horizontal">
                  <p className="h5 font-weight-bold">
                    <b>{proyecto.data?.nombre}</b>
                  </p>
                  <motion.div layout>
                    <div
                      className="ctrl_box_top"
                      style={{
                        height: 24,
                        padding: 0,
                        paddingRight: 8,
                        paddingLeft: 8,
                      }}
                    >
                      {!proyecto_details_expanded && (
                        <IconButton
                          onClick={() => setProyectoDetailsExpanded(true)}
                        >
                          <Image
                            src={`/assets/img/iconos/arrow_d_white.svg`}
                            height={12}
                            width={12}
                            alt={"agregar-rol"}
                          />
                        </IconButton>
                      )}
                      {proyecto_details_expanded && (
                        <IconButton
                          onClick={() => setProyectoDetailsExpanded(false)}
                        >
                          <Image
                            src={`/assets/img/iconos/arrow_u_white.svg`}
                            height={12}
                            width={12}
                            alt={"agregar-rol"}
                          />
                        </IconButton>
                      )}
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
                      {!IS_ADMIN && (
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
                                Nuevo rol
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
                                        action: "PROYECTO_ENVIADO_A_APROBACION",
                                        data: new Map<string, unknown>(),
                                        opened: true,
                                        title: "Enviar proyecto a aprobación",
                                        content: (
                                          <Typography variant="body2">{`Seguro que deseas mandar este proyecto a aprobación?`}</Typography>
                                        ),
                                      });
                                    }}
                                    className="btn btn-sm btn-intro btn-price mb-2"
                                    style={{
                                      padding: "8px 40px",
                                      marginTop: 0,
                                      display: "block",
                                      height: 40,
                                      fontWeight: 500,
                                      textTransform: "none",
                                    }}
                                  >
                                    Enviar proyecto para aprobación
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
                  <MContainer
                    direction="horizontal"
                    styles={{ alignItems: "center" }}
                  >
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
                      }}
                    />
                    <Typography
                      variant="subtitle2"
                      sx={{
                        textTransform: "capitalize !important",
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
                  <Typography variant="subtitle2">
                    {proyecto.data && proyecto.data.tipo
                      ? proyecto.data.tipo.id_tipo_proyecto === 99
                        ? proyecto.data.tipo.descripcion
                        : proyecto.data.tipo.tipo_proyecto.es
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
                  <Typography variant="subtitle2">
                    {proyecto.data && proyecto.data.sindicato
                      ? proyecto.data.sindicato.id_sindicato === 99
                        ? proyecto.data.sindicato.descripcion
                        : proyecto.data.sindicato.sindicato.es
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
                      Contacto de casting
                    </Typography>
                    <Divider style={{ borderWidth: 1 }} />
                  </Grid>
                  <Grid mt={2} item xs={6} md={2}>
                    <Typography fontWeight={500}>
                      {proyecto.data ? proyecto.data.director_casting : "ND"}
                    </Typography>
                  </Grid>
                  <Grid mt={2} item xs={6} md={2}>
                    <Typography fontWeight={500}>
                      {proyecto.data ? proyecto.data.email_contacto : "ND"}
                    </Typography>
                  </Grid>
                  <Grid mt={2} item xs={6} md={2}>
                    <Typography fontWeight={500}>
                      {proyecto.data ? proyecto.data.telefono_contacto : "ND"}
                    </Typography>
                  </Grid>

                  <Grid mt={2} item xs={12}>
                    <Typography
                      style={{ color: "#069cb1", fontStyle: "italic" }}
                    >
                      Equipo creativo
                    </Typography>
                    <Divider style={{ borderWidth: 1 }} />
                  </Grid>
                  <Grid mt={2} item md={4}>
                    <MContainer direction="horizontal">
                      <Typography sx={{ paddingRight: 2, fontWeight: 600 }}>
                        Productor
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
                        Casa productora
                      </Typography>
                      <Typography sx={{ color: "#928F8F" }}>
                        {proyecto.data ? proyecto.data.casa_productora : "ND"}
                      </Typography>
                    </MContainer>
                  </Grid>
                  <Grid mt={2} item md={6}>
                    <MContainer direction="horizontal">
                      <Typography sx={{ paddingRight: 2, fontWeight: 600 }}>
                        Agencia de Publicidad
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
                      Detalles adicionales
                    </Typography>
                    <Divider style={{ borderWidth: 1 }} />
                  </Grid>
                  <Grid mt={2} item xs={12}>
                    <MContainer direction="horizontal">
                      <Typography sx={{ paddingRight: 2, fontWeight: 600 }}>
                        Sinopsis
                      </Typography>
                      <Typography sx={{ color: "#928F8F" }}>
                        {proyecto.data ? proyecto.data.sinopsis : "ND"}
                      </Typography>
                    </MContainer>
                  </Grid>
                  <Grid mt={2} item xs={12}>
                    <MContainer direction="horizontal">
                      <Typography sx={{ paddingRight: 2, fontWeight: 100 }}>
                        Archivos
                      </Typography>
                      <Typography>{"ND"}</Typography>
                    </MContainer>
                  </Grid>
                  <Grid mt={2} item xs={12}>
                    <Typography
                      style={{ color: "#069cb1", fontStyle: "italic" }}
                    >
                      Locación proyecto
                    </Typography>
                    <Divider style={{ borderWidth: 1 }} />
                  </Grid>

                  <Grid mt={2} item xs={12}>
                    <MContainer direction="horizontal">
                      <Typography sx={{ paddingRight: 2, fontWeight: 600 }}>
                        Estado
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
                        Roles actuales
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
                        Roles archivados
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
                            sx={{ color: "#000" }}
                            fontSize={"1.2rem"}
                            fontWeight={600}
                            component={"p"}
                          >
                            Acciones
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
                                  src={
                                    "/assets/img/iconos/icono_claqueta_blue.svg"
                                  }
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
                                  <IconButton
                                    onClick={(e) => {
                                      const params = new Map<string, unknown>();
                                      params.set("id", r.id);
                                      params.set(
                                        "state",
                                        r.estatus.toUpperCase() === "ARCHIVADO"
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
                                            ? "Desarchivar Rol"
                                            : "Archivar Rol",
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
                                                Seguro que deseas eliminar este
                                                rol?
                                              </Typography>
                                            ),
                                          });
                                          e.stopPropagation();
                                        }}
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
                  accordionContent={(
                    element_index: number,
                    container_width: number
                  ) => {
                    const element = filtered_roles[element_index];
                    if (element) {
                      return (
                        <div style={{ position: "relative", width: 100 }}>
                          <div
                            style={{
                              position: "absolute",
                              width: container_width - 8,
                            }}
                          >
                            <IconButton
                              onClick={() => {
                                setExpandedRows((prev) => {
                                  if (prev.includes(`panel${element_index}`)) {
                                    return prev.filter(
                                      (p) => p !== `panel${element_index}`
                                    );
                                  }
                                  return prev.concat([`panel${element_index}`]);
                                });
                              }}
                              style={{
                                position: "absolute",
                                width: 20,
                                top: 8,
                                right: 8,
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
                          <Grid
                            container
                            p={2}
                            style={{ width: container_width, paddingLeft: 40 }}
                          >
                            <Grid item container xs={12}>
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
                                  {roles.data &&
                                  roles.data[element_index]?.tipo_rol.tipo ? (
                                    <Divider
                                      style={{
                                        borderWidth: 1,
                                        height: 12,
                                        borderColor: "#069cb1",
                                        margin: 8,
                                      }}
                                      orientation="vertical"
                                    />
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

                                  {roles.data &&
                                  roles.data[element_index]?.compensaciones &&
                                  roles.data[element_index]?.compensaciones
                                    ?.compensaciones_no_monetarias ? (
                                    <>
                                      {roles.data[
                                        element_index
                                      ]?.compensaciones?.compensaciones_no_monetarias.map(
                                        (c, i) => {
                                          if (roles.data) {
                                            const el =
                                              roles.data[element_index];
                                            if (el) {
                                              return (
                                                <Fragment
                                                  key={c.id_compensacion}
                                                >
                                                  <Typography
                                                    component={"span"}
                                                    sx={{ color: "#928F8F" }}
                                                  >
                                                    {c.compensacion.es}
                                                  </Typography>
                                                  {i !==
                                                    (el.compensaciones
                                                      ?.compensaciones_no_monetarias
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
                                          }
                                        }
                                      )}
                                    </>
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

                                  {roles.data &&
                                  roles.data[element_index]?.proyecto &&
                                  roles.data[element_index]?.proyecto
                                    ?.sindicato &&
                                  roles.data[element_index]?.proyecto?.sindicato
                                    ?.sindicato ? (
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
                                            roles.data[element_index]?.proyecto
                                              ?.sindicato?.sindicato.es
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
                                </MContainer>

                                <MContainer
                                  direction="horizontal"
                                  styles={{ gap: 10 }}
                                >
                                  {roles.data &&
                                  roles.data[element_index]
                                    ?.filtros_demograficos &&
                                  roles.data[element_index]
                                    ?.filtros_demograficos?.generos ? (
                                    <>
                                      {roles.data[
                                        element_index
                                      ]?.filtros_demograficos?.generos.map(
                                        (g) => (
                                          <Fragment key={g.id_genero}>
                                            <Typography
                                              component={"span"}
                                              sx={{ color: "#928F8F" }}
                                            >
                                              {g.genero.es}
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

                                  {roles.data &&
                                  roles.data[element_index]
                                    ?.filtros_demograficos &&
                                  typeof roles.data[element_index]
                                    ?.filtros_demograficos?.rango_edad_fin ===
                                    "number" &&
                                  typeof roles.data[element_index]
                                    ?.filtros_demograficos
                                    ?.rango_edad_inicio === "number" ? (
                                    <>
                                      <Typography
                                        component={"span"}
                                        sx={{ color: "#928F8F" }}
                                      >
                                        {
                                          roles.data[element_index]
                                            ?.filtros_demograficos
                                            ?.rango_edad_inicio
                                        }
                                        -
                                        {
                                          roles.data[element_index]
                                            ?.filtros_demograficos
                                            ?.rango_edad_fin
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

                                  {roles.data &&
                                  roles.data[element_index]
                                    ?.filtros_demograficos &&
                                  roles.data[element_index]
                                    ?.filtros_demograficos
                                    ?.aparencias_etnicas ? (
                                    <>
                                      {roles.data[
                                        element_index
                                      ]?.filtros_demograficos?.aparencias_etnicas.map(
                                        (ae) => (
                                          <Fragment
                                            key={ae.id_aparencia_etnica}
                                          >
                                            <Typography
                                              component={"span"}
                                              sx={{ color: "#928F8F" }}
                                            >
                                              {ae.aparencia_etnica.es}
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

                                  {roles.data &&
                                  roles.data[element_index]
                                    ?.filtros_demograficos &&
                                  roles.data[element_index]
                                    ?.filtros_demograficos?.pais ? (
                                    <Typography
                                      component={"span"}
                                      sx={{ color: "#928F8F" }}
                                    >
                                      {
                                        roles.data[element_index]
                                          ?.filtros_demograficos?.pais.es
                                      }
                                    </Typography>
                                  ) : (
                                    <>
                                      <Typography sx={{ color: "#928F8F" }}>
                                        No especificado
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
                                    }}
                                  >
                                    Descripción:
                                  </Typography>
                                  {roles.data
                                    ? roles.data[element_index]?.descripcion ||
                                      "No especificado"
                                    : "No especificado"}
                                </Typography>
                              </Grid>
                            </Grid>
                            <Grid item xs={12}>
                              <Divider
                                style={{
                                  margin: "6px 0",
                                }}
                              />
                            </Grid>
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
                                            color: "#928F8F",
                                            paddingRight: 1,
                                            fontStyle: "italic",
                                          }}
                                        >
                                          Habilidades:
                                        </Typography>
                                        <MContainer direction="horizontal">
                                          {roles.data &&
                                          roles.data[element_index]
                                            ?.habilidades &&
                                          roles.data[element_index]?.habilidades
                                            ?.habilidades_seleccionadas ? (
                                            <>
                                              {roles.data[
                                                element_index
                                              ]?.habilidades?.habilidades_seleccionadas.map(
                                                (h, i) => {
                                                  if (roles.data) {
                                                    const el =
                                                      roles.data[element_index];
                                                    if (el) {
                                                      return (
                                                        <Fragment
                                                          key={h.id_habilidad}
                                                        >
                                                          <Typography
                                                            component={"span"}
                                                            sx={{
                                                              color: "#928F8F",
                                                            }}
                                                          >
                                                            {h.habilidad.es}
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
                                                No especificado
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
                                            color: "#928F8F",
                                            paddingRight: 1,
                                            fontStyle: "italic",
                                          }}
                                        >
                                          Desnudos situaciones sexuales:
                                        </Typography>
                                        <MContainer direction="horizontal">
                                          {roles.data &&
                                          roles.data[element_index]?.nsfw &&
                                          roles.data[element_index]?.nsfw
                                            ?.nsfw_seleccionados ? (
                                            <>
                                              {roles.data[
                                                element_index
                                              ]?.nsfw?.nsfw_seleccionados.map(
                                                (n, i) => {
                                                  if (roles.data) {
                                                    const el =
                                                      roles.data[element_index];
                                                    if (el) {
                                                      return (
                                                        <Fragment
                                                          key={n.id_nsfw}
                                                        >
                                                          <Typography
                                                            component={"span"}
                                                            sx={{
                                                              color: "#928F8F",
                                                            }}
                                                          >
                                                            {n.nsfw?.es}
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
                                                No especificado
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
                                            color: "#928F8F",
                                            paddingRight: 1,
                                            fontStyle: "italic",
                                          }}
                                        >
                                          Locación de casting y fechas:
                                        </Typography>
                                        <MContainer direction="horizontal">
                                          {roles.data &&
                                          roles.data[element_index]?.casting &&
                                          (roles.data[element_index]?.casting
                                            .length || 0) > 0 ? (
                                            <>
                                              {roles.data[
                                                element_index
                                              ]?.casting.map((c) => (
                                                <Fragment key={c.id}>
                                                  <Typography
                                                    component={"span"}
                                                    sx={{ color: "#928F8F" }}
                                                  >
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
                                                  <Typography
                                                    component={"span"}
                                                    sx={{ color: "#928F8F" }}
                                                  >
                                                    {c.fecha_inicio.toString()}
                                                    {c.fecha_fin
                                                      ? `a ${c.fecha_fin.toString()}`
                                                      : ""}
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
                                                No especificado
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
                                            color: "#928F8F",
                                            paddingRight: 1,
                                            fontStyle: "italic",
                                          }}
                                        >
                                          Locación de filmación y fechas:
                                        </Typography>
                                        <MContainer direction="horizontal">
                                          {roles.data &&
                                          roles.data[element_index]
                                            ?.filmaciones &&
                                          (roles.data[element_index]
                                            ?.filmaciones.length || 0) > 0 ? (
                                            <>
                                              {roles.data[
                                                element_index
                                              ]?.filmaciones.map((c) => (
                                                <Fragment key={c.id}>
                                                  <Typography
                                                    component={"span"}
                                                    sx={{ color: "#928F8F" }}
                                                  >
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
                                                  <Typography
                                                    component={"span"}
                                                    sx={{ color: "#928F8F" }}
                                                  >
                                                    {c.fecha_inicio.toString()}
                                                    {c.fecha_fin
                                                      ? `a ${c.fecha_fin.toString()}`
                                                      : ""}
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
                                                No especificado
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
                                            color: "#928F8F",
                                            paddingRight: 1,
                                            fontStyle: "italic",
                                          }}
                                        >
                                          Presentación de solicitud:
                                        </Typography>
                                        <MContainer direction="horizontal">
                                          <Typography
                                            component={"span"}
                                            sx={{ color: "#928F8F" }}
                                          >
                                            {roles.data &&
                                            roles.data[element_index]
                                              ?.requisitos &&
                                            roles.data[element_index]
                                              ?.requisitos?.estado_republica
                                              ? roles.data[element_index]
                                                  ?.requisitos?.estado_republica
                                                  .es
                                              : "No especificado"}
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
                                            {roles.data &&
                                            roles.data[element_index]
                                              ?.requisitos &&
                                            roles.data[element_index]
                                              ?.requisitos
                                              ?.presentacion_solicitud
                                              ? roles.data[
                                                  element_index
                                                ]?.requisitos?.presentacion_solicitud.toString()
                                              : "No especificado"}
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
                                            {roles.data &&
                                            roles.data[element_index]
                                              ?.requisitos &&
                                            roles.data[element_index]
                                              ?.requisitos?.uso_horario
                                              ? roles.data[element_index]
                                                  ?.requisitos?.uso_horario.es
                                              : "No especificado"}
                                          </Typography>
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
                                            color: "#928F8F",
                                            paddingRight: 1,
                                            fontStyle: "italic",
                                          }}
                                        >
                                          Requisitos:
                                        </Typography>
                                        <MContainer direction="horizontal">
                                          {roles.data &&
                                          roles.data[element_index]
                                            ?.requisitos &&
                                          roles.data[element_index]?.requisitos
                                            ?.medios_multimedia &&
                                          (roles.data[element_index]?.requisitos
                                            ?.medios_multimedia.length || 0) >
                                            0 ? (
                                            <>
                                              {roles.data[
                                                element_index
                                              ]?.requisitos?.medios_multimedia.map(
                                                (m, i) => {
                                                  if (roles.data) {
                                                    const el =
                                                      roles.data[element_index];
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
                                                              color: "#928F8F",
                                                            }}
                                                          >
                                                            {
                                                              m.medio_multimedia
                                                                .es
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
                                                No especificado
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
                                            color: "#928F8F",
                                            paddingRight: 1,
                                            fontStyle: "italic",
                                          }}
                                        >
                                          Archivos adicionales:
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
                                                {element.selftape.lineas.nombre}
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
