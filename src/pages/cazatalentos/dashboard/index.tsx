import { type GetServerSideProps, type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { motion } from "framer-motion";
import { IconButton, Typography } from "@mui/material";
import {
  Alertas,
  TalentosDestacados,
  Flotantes,
  MainLayout,
  MenuLateral,
} from "~/components";
import { api, parseErrorBody } from "~/utils/api";
import { getSession } from "next-auth/react";
import { MTable } from "~/components/shared/MTable/MTable";
import Link from "next/link";
import { MContainer } from "~/components/layout/MContainer";
import { type User } from "next-auth";
import CircleIcon from "@mui/icons-material/Circle";
import ConfirmationDialog from "~/components/shared/ConfirmationDialog";
import { useMemo, useState } from "react";
import useNotify from "~/hooks/useNotify";
import { useRouter } from "next/router";
import Constants from "~/constants";
import { TipoUsuario } from "~/enums";
import useLang from "~/hooks/useLang";
import AppContext from "~/context/app";
import { useContext } from "react";
import { MTooltip } from "~/components/shared/MTooltip";

type DashBoardCazaTalentosPageProps = {
  user: User;
};

const DashBoardCazaTalentosPage: NextPage<DashBoardCazaTalentosPageProps> = ({
  user,
}) => {
  const ctx = useContext(AppContext);
  const textos = useLang(ctx.lang);
  const { notify } = useNotify();
  const router = useRouter();
  const [tabSelected, setTabSelected] = useState<"ACTIVOS" | "ARCHIVADOS">(
    "ACTIVOS"
  );
  const [confirmation_dialog, setConfirmationDialog] = useState<{
    opened: boolean;
    title: string;
    content: JSX.Element;
    action: "STATE_CHANGE" | "DELETE";
    data: Map<string, unknown>;
  }>({
    opened: false,
    title: "",
    content: <></>,
    action: "DELETE",
    data: new Map(),
  });
  const proyectos = api.proyectos.getAllByIdCazatalentos.useQuery(
    { id: parseInt(user.id) },
    {
      refetchOnWindowFocus: false,
    }
  );
  const deleteProyecto = api.proyectos.deleteById.useMutation({
    onSuccess() {
      notify("success", "Se elimino el proyecto con exito");
      void proyectos.refetch();
    },
    onError(error) {
      notify("error", parseErrorBody(error.message));
    },
  });
  const updateEstadoProyecto = api.proyectos.updateEstadoProyecto.useMutation({
    onSuccess() {
      notify("success", "Se cambio el estado el proyecto con exito");
      void proyectos.refetch();
    },
    onError(error) {
      notify("error", parseErrorBody(error.message));
    },
  });

  const filtered_proyectos = useMemo(() => {
    if (proyectos.data) {
      if (tabSelected === "ARCHIVADOS") {
        return proyectos.data.filter(
          (p) => p.estatus.toUpperCase() === "ARCHIVADO"
        );
      }
      return proyectos.data.filter(
        (p) => p.estatus.toUpperCase() !== "ARCHIVADO"
      );
    }
    return [];
  }, [tabSelected, proyectos.data]);

  const no_data_message = useMemo(() => {
    if (tabSelected === "ACTIVOS") {
      return (
        <div className="box_message_blue">
          <p className="h3" style={{ fontWeight: 600 }}>
            No has creado ningún proyecto
          </p>
          <p>
            Al crear un proyecto, aquí tendrás una vista general de tus
            proyectos activos e inactivos.
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
          <p className="h3" style={{ fontWeight: 600 }}>
            No tienes ningún proyecto archivado
          </p>
          <p>
            Aqui apareceran todos los proyectos que hayas colocado como
            archivados
            <br />
          </p>
        </div>
      );
    }
  }, [tabSelected]);

  return (
    <>
      <Head>
        <title>DashBoard ~ Cazatalentos | Talent Corner</title>
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
                <motion.img
                  src="/assets/img/iconos/chair_dir_blue.svg"
                  alt="icono"
                />
                <p
                  className="color_a h4 font-weight-bold mb-0 ml-2"
                  style={{
                    fontSize: "1.7rem",
                  }}
                >
                  <b>Bienvenido, {user.name}</b>
                </p>
              </div>
              <br />
              <div className="row d-lg-flex">
                <div className="mt-1 col-md-6">
                  <p
                    className="h5 font-weight-bold"
                    style={{ fontSize: "1.5rem" }}
                  >
                    <b>{textos["encabezado"]}</b>
                  </p>
                  <div className="container_text_scroll">
                    <div>
                      <ol>
                        <li>Deberás crear roles específicos.</li>
                        <li>Presentar un resumen que describa tu proyecto.</li>
                        <li>
                          Incluir detalles de mis personajes incluyendo rasgos
                          físicos, personalidad y desarrollo en escena.
                        </li>
                        <li>
                          Si tu proyecto incluye a un menor de edad, la
                          descripción del personaje deberá incluir el número de
                          horas en set y detalles inherentes al personaje
                        </li>
                        <li>Deberás crear roles específicos.</li>
                        <li>Presentar un resumen que describa tu proyecto.</li>
                        <li>
                          Incluir detalles de mis personajes incluyendo rasgos
                          físicos, personalidad y desarrollo en escena.
                        </li>
                        <li>
                          Si tu proyecto incluye a un menor de edad, la
                          descripción del personaje deberá incluir el número de
                          horas en set y detalles inherentes al personaje
                        </li>
                      </ol>
                    </div>
                  </div>
                </div>
                <TalentosDestacados slidesPerView={2} />
              </div>
            </div>
            <div className="row title_list_proyects">
              <div className="col d-lg-flex mt-5">
                <div>
                  <p className="font-weight-bold h2 mr-3 mb-2">Proyectos</p>
                </div>
                <div>
                  <Link
                    href="/cazatalentos/proyecto"
                    className="btn btn-intro btn-price mb-2 nuevo-proyecto-btn"
                  >
                    Nuevo proyecto
                  </Link>
                </div>
              </div>
            </div>
            <div className="row mt-2">
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
                        Activos
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
                        Archivados
                      </a>
                    </li>
                  </ul>
                </div>
                <MTable
                  columnsHeader={[
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
                      key={3}
                      sx={{ color: "#000" }}
                      fontSize={"1.2rem"}
                      fontWeight={600}
                      component={"p"}
                    >
                      Estado
                    </Typography>,
                    <Typography
                      key={4}
                      sx={{ color: "#000" }}
                      fontSize={"1.2rem"}
                      fontWeight={600}
                      component={"p"}
                    >
                      Tipo
                    </Typography>,
                    <Typography
                      key={4}
                      sx={{ color: "#000" }}
                      fontSize={"1.2rem"}
                      fontWeight={600}
                      component={"p"}
                    >
                      Fecha
                    </Typography>,
                    <Typography
                      key={4}
                      sx={{ color: "#000" }}
                      fontSize={"1.2rem"}
                      fontWeight={600}
                      component={"p"}
                    >
                      Acciones
                    </Typography>,
                  ]}
                  backgroundColorHeader="#069cb1"
                  //styleHeaderTableCell={{ padding: "5px !important" }}
                  loading={proyectos.isFetching}
                  dataStylesRow={{
                    paddingLeft: "5px !important",
                    paddingRight: "5px !important",
                  }}
                  data={
                    filtered_proyectos
                      ? filtered_proyectos.map((p) => {
                          return {
                            nombre: (() => {
                              let color = "grey";
                              switch (p.estatus.toUpperCase()) {
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
                              return (
                                <MContainer
                                  direction="horizontal"
                                  styles={{ alignItems: "center" }}
                                >
                                  <CircleIcon
                                    style={{
                                      color: color,
                                      width: 12,
                                      height: 12,
                                      marginRight: 4,
                                    }}
                                  />
                                  <Typography
                                    variant="subtitle2"
                                    sx={{ fontSize: "1.2rem" }}
                                  >
                                    {p.nombre}
                                  </Typography>
                                </MContainer>
                              );
                            })(),
                            estado: (() => {
                              switch (p.estatus.toUpperCase()) {
                                case Constants.ESTADOS_PROYECTO.POR_VALIDAR:
                                  return (
                                    <Typography
                                      variant="subtitle2"
                                      sx={{
                                        fontSize: "1.2rem",
                                        padding: "0px 11px",
                                      }}
                                    >
                                      Pendiente
                                    </Typography>
                                  );
                                case Constants.ESTADOS_PROYECTO.ARCHIVADO:
                                  return (
                                    <Typography
                                      variant="subtitle2"
                                      sx={{
                                        fontSize: "1.2rem",
                                        padding: "0px 11px",
                                      }}
                                    >
                                      Archivado
                                    </Typography>
                                  );
                                case Constants.ESTADOS_PROYECTO
                                  .ENVIADO_A_APROBACION:
                                  return (
                                    <Typography
                                      variant="subtitle2"
                                      sx={{
                                        fontSize: "1.2rem",
                                        padding: "0px 11px",
                                      }}
                                    >
                                      Enviado a aprobación
                                    </Typography>
                                  );
                                case Constants.ESTADOS_PROYECTO.RECHAZADO:
                                  return (
                                    <Typography
                                      variant="subtitle2"
                                      sx={{
                                        fontSize: "1.2rem",
                                        padding: "0px 11px",
                                      }}
                                    >
                                      Inactivo
                                    </Typography>
                                  );
                                case Constants.ESTADOS_PROYECTO.APROBADO:
                                  return (
                                    <Typography
                                      variant="subtitle2"
                                      sx={{
                                        fontSize: "1.2rem",
                                        padding: "0px 11px",
                                      }}
                                    >
                                      Activo
                                    </Typography>
                                  );
                              }
                              return (
                                <Typography
                                  variant="subtitle2"
                                  sx={{
                                    fontSize: "1.2rem",
                                    padding: "0px 11px",
                                  }}
                                >
                                  {p.estatus}
                                </Typography>
                              );
                            })(),
                            tipo: p.tipo ? (
                              <Typography
                                variant="subtitle2"
                                sx={{
                                  fontSize: "1.2rem",
                                  padding: "0px 11px",
                                }}
                              >
                                {p.tipo.id_tipo_proyecto === 99
                                  ? p.tipo.descripcion
                                  : p.tipo.tipo_proyecto.es}
                              </Typography>
                            ) : (
                              <Typography
                                variant="subtitle2"
                                sx={{
                                  fontSize: "1.2rem",
                                  padding: "0px 11px",
                                }}
                              >
                                ND
                              </Typography>
                            ),
                            fecha: (
                              <Typography
                                variant="subtitle2"
                                sx={{
                                  fontSize: "1.2rem",
                                  padding: "0px 11px",
                                }}
                              >
                                {p.created.toLocaleDateString("es-mx")}
                              </Typography>
                            ),
                            acciones: (
                              <MContainer
                                direction="horizontal"
                                justify="start"
                              >
                                <>
                                  {[
                                    Constants.ESTADOS_PROYECTO.POR_VALIDAR,
                                    Constants.ESTADOS_PROYECTO.ARCHIVADO,
                                    Constants.ESTADOS_PROYECTO.RECHAZADO,
                                  ].includes(p.estatus.toUpperCase()) && (
                                    <>
                                      <MTooltip
                                        color="orange"
                                        placement="top"
                                        text="Archivar"
                                        icon={
                                          <IconButton
                                            sx={{ padding: "0!important" }}
                                            onClick={(e) => {
                                              const params = new Map<
                                                string,
                                                unknown
                                              >();
                                              params.set("id", p.id);
                                              params.set(
                                                "state",
                                                p.estatus.toUpperCase() ===
                                                  "ARCHIVADO"
                                                  ? "POR_VALIDAR"
                                                  : "ARCHIVADO"
                                              );
                                              setConfirmationDialog({
                                                action: "STATE_CHANGE",
                                                data: params,
                                                opened: true,
                                                title:
                                                  p.estatus.toUpperCase() ===
                                                  "ARCHIVADO"
                                                    ? "Desarchivar Proyecto"
                                                    : "Archivar Proyecto",
                                                content: (
                                                  <Typography variant="body2">{`Seguro que deseas ${
                                                    p.estatus.toUpperCase() ===
                                                    "ARCHIVADO"
                                                      ? "desarchivar"
                                                      : "archivar"
                                                  } este proyecto?`}</Typography>
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
                                      <MTooltip
                                        color="orange"
                                        placement="top"
                                        text="Editar"
                                        icon={
                                          <IconButton
                                            sx={{ padding: "0!important" }}
                                            onClick={(e) => {
                                              void router.push(
                                                `/cazatalentos/proyecto?id_proyecto=${p.id}`
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
                                        text="Borrar"
                                        icon={
                                          <IconButton
                                            sx={{ padding: "0!important" }}
                                            onClick={(e) => {
                                              void router.push(
                                                `/cazatalentos/roles?id_proyecto=${p.id}`
                                              );
                                              e.stopPropagation();
                                            }}
                                            color="primary"
                                            aria-label="consultar"
                                            component="label"
                                          >
                                            <Image
                                              src={
                                                "/assets/img/iconos/equiz_blue.svg"
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
                                <>
                                  {[
                                    Constants.ESTADOS_PROYECTO.APROBADO,
                                    Constants.ESTADOS_PROYECTO
                                      .ENVIADO_A_APROBACION,
                                  ].includes(p.estatus.toUpperCase()) && (
                                    <MTooltip
                                      color="orange"
                                      placement="top"
                                      text="Ir al rol"
                                      icon={
                                        <IconButton
                                          sx={{ padding: "0!important" }}
                                          onClick={(e) => {
                                            void router.push(
                                              `/cazatalentos/roles?id_proyecto=${p.id}`
                                            );
                                            e.stopPropagation();
                                          }}
                                          color="primary"
                                          aria-label="consultar"
                                          component="label"
                                        >
                                          <Image
                                            src={
                                              "/assets/img/iconos/search_blue.png"
                                            }
                                            width={16}
                                            height={16}
                                            alt="archivar"
                                          />
                                        </IconButton>
                                      }
                                    />
                                  )}
                                </>
                                <>
                                  {["ACTIVO"].includes(
                                    p.estatus.toUpperCase()
                                  ) && (
                                    <IconButton
                                      onClick={(e) => {
                                        const params = new Map<
                                          string,
                                          unknown
                                        >();
                                        params.set("id", p.id);
                                        setConfirmationDialog({
                                          action: "DELETE",
                                          data: params,
                                          opened: true,
                                          title: "Eliminar Proyecto",
                                          content: (
                                            <Typography variant="body2">
                                              Seguro que deseas eliminar este
                                              proyecto?
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
                                  )}
                                </>
                              </MContainer>
                            ),
                          };
                        })
                      : []
                  }
                  noDataContent={
                    filtered_proyectos.length > 0
                      ? undefined
                      : proyectos.isFetching
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
                  deleteProyecto.mutate({ id: id as number });
                }
                break;
              }
              case "STATE_CHANGE": {
                const id = confirmation_dialog.data.get("id");
                const new_state = confirmation_dialog.data.get("state");
                if (id) {
                  updateEstadoProyecto.mutate({
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
  if (session && session.user) {
    if (session.user.tipo_usuario === TipoUsuario.CAZATALENTOS) {
      return {
        props: {
          user: session.user,
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

export default DashBoardCazaTalentosPage;
