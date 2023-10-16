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
      notify("success", `${textos['se_elimino_el_proyecto_con_exito']}`);
      void proyectos.refetch();
    },
    onError(error) {
      notify("error", parseErrorBody(error.message));
    },
  });
  const updateEstadoProyecto = api.proyectos.updateEstadoProyecto.useMutation({
    onSuccess() {
      notify("success", `${textos['se_cambio_el_estado_del_proyecto_con_exito']}`);
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
          {textos["no_creado"]?? ""}
          </p>
          <p>
          {textos["al_crear"]?? ""}
            <br />
            {textos["recuerda_crear"]?? ""}
            <br />
            {textos["comienza"]?? ""}
          </p>
        </div>
      );
    }
    if (tabSelected === "ARCHIVADOS") {
      return (
        <div className="box_message_blue">
          <p className="h3" style={{ fontWeight: 600 }}>
          {textos["no_tienes_proyectos"]?? ""}
          </p>
          <p>
          {textos["aqui_apareceran"]?? ""}
            <br />
          </p>
        </div>
      );
    }
  }, [tabSelected, textos]);

  return (
    <>
      <Head>
        <title>DashBoard ~ {textos["cazatalentos"]?? ""} | Talent Corner</title>
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
              <div className="d-flex"
                style={{
                  padding: "40px 0 0 0"
                }}
              >
                <motion.img
                  src="/assets/img/iconos/chair_dir_blue.svg"
                  alt="icono"
                />
                <p
                  className="color_a h4 font-weight-bold mb-0 ml-2"
                  style={{
                    fontSize: "1.35rem",
                    padding: "10px 0 0 0"
                  }}
                >
                  <b>{textos["bienvenido"]?? ""}, {user.name}</b>
                </p>
              </div>
              <br />
              <div className="row d-lg-flex">
                <div className="mt-1 col-md-6">
                  <p
                    className="h5 font-weight-bold"
                    style={{ fontSize: "1.36rem" }}
                  >
                    <b>{textos["encabezado"]?? ""}</b>
                  </p>
                  <div className="container_text_scroll">
                    <div>
                      <ol>
                        <li>{textos["requisito_uno"] ?? ""}</li>
                        <li>{textos["requisito_dos"]?? ""}</li>
                        <li>
                        {textos["requisito_tres"]?? ""}
                        </li>
                        <li>
                        {textos["requisito_cuatro"]?? ""}
                        </li>
                        <li>{textos["requisito_cinco"]?? ""}</li>
                        <li>{textos["requisito_seis"]?? ""}</li>
                        <li>
                        {textos["requisito_siete"]?? ""}
                        </li>
                        <li>
                        {textos["requisito_ocho"]?? ""}
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
                  <p className="font-weight-bold h2 mr-3 mb-2">{textos["proyectos"]?? ""}</p>
                </div>
                <div>
                  <Link
                    href="/cazatalentos/proyecto"
                    className="btn btn-intro btn-price mb-2 nuevo-proyecto-btn"
                  >
                    {textos["nuevo_proyecto"]?? ""}
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
                        {textos["activos"]?? ""}
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
                        {textos["archivados"]?? ""}
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
                      {textos["nombre"]?? ""}
                    </Typography>,
                    <Typography
                      key={3}
                      sx={{ color: "#000" }}
                      fontSize={"1.2rem"}
                      fontWeight={600}
                      component={"p"}
                    >
                      {textos["estado"]?? ""}
                    </Typography>,
                    <Typography
                      key={4}
                      sx={{ color: "#000" }}
                      fontSize={"1.2rem"}
                      fontWeight={600}
                      component={"p"}
                    >
                      {textos["tipo"]?? ""}
                    </Typography>,
                    <Typography
                      key={4}
                      sx={{ color: "#000" }}
                      fontSize={"1.2rem"}
                      fontWeight={600}
                      component={"p"}
                    >
                      {textos["fecha"]?? ""}
                    </Typography>,
                    <Typography
                      key={4}
                      sx={{ color: "#000" }}
                      fontSize={"1.2rem"}
                      fontWeight={600}
                      component={"p"}
                    >
                      
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
                                    sx={{ fontSize: "1.1rem" }}
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
                                        fontSize: "1.1rem",
                                        padding: "0px",
                                        color: 'gray'
                                      }}
                                    >
                                      {textos["pendiente"]?? ""}
                                    </Typography>
                                  );
                                case Constants.ESTADOS_PROYECTO.ARCHIVADO:
                                  return (
                                    <Typography
                                      variant="subtitle2"
                                      sx={{
                                        fontSize: "1.1rem",
                                        padding: "0px",
                                      }}
                                    >
                                      {textos["archivado"]?? ""}
                                    </Typography>
                                  );
                                case Constants.ESTADOS_PROYECTO
                                  .ENVIADO_A_APROBACION:
                                  return (
                                    <Typography
                                      variant="subtitle2"
                                      sx={{
                                        fontSize: "1.1rem",
                                        padding: "0px",
                                        color: 'gold'
                                      }}
                                    >
                                      {textos["enviado_aprobacion"]?? ""}
                                    </Typography>
                                  );
                                case Constants.ESTADOS_PROYECTO.RECHAZADO:
                                  return (
                                    <Typography
                                      variant="subtitle2"
                                      sx={{
                                        fontSize: "1.1rem",
                                        padding: "0px",
                                      }}
                                    >
                                      {textos["inactivo"]?? ""}
                                    </Typography>
                                  );
                                case Constants.ESTADOS_PROYECTO.APROBADO:
                                  return (
                                    <Typography
                                      variant="subtitle2"
                                      sx={{
                                        fontSize: "1.1rem",
                                        padding: "0px",
                                        color: 'green'
                                      }}
                                    >
                                      {textos["activo"]?? ""}
                                    </Typography>
                                  );
                              }
                              return (
                                <Typography
                                  variant="subtitle2"
                                  sx={{
                                    fontSize: "1.1rem",
                                    padding: "0px",
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
                                  fontSize: "1.1rem",
                                  padding: "0px",
                                }}
                              >
                                {p.tipo.id_tipo_proyecto === 99
                                  ? p.tipo.descripcion
                                  : ctx.lang === 'es' ? p.tipo.tipo_proyecto.es : p.tipo.tipo_proyecto.en}
                              </Typography>
                            ) : (
                              <Typography
                                variant="subtitle2"
                                sx={{
                                  fontSize: "1.1rem",
                                  padding: "0px",
                                }}
                              >
                                ND
                              </Typography>
                            ),
                            fecha: (
                              <Typography
                                variant="subtitle2"
                                sx={{
                                  fontSize: "1.1rem",
                                  padding: "0px",
                                }}
                              >
                                {p.created.toLocaleDateString("es-mx")}
                              </Typography>
                            ),
                            acciones: (
                              <MContainer
                                direction="horizontal"
                                justify="end"
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
                                                    ? `${textos['desarchivar_proyecto']}`
                                                    : `${textos['archivar_proyecto']}`,
                                                content: (
                                                  <Typography variant="body2">{`${
                                                    p.estatus.toUpperCase() ===
                                                    "ARCHIVADO"
                                                      ? `${textos['desarchivar_proyecto_message']}`
                                                      : `${textos['archivar_proyecto_message']}`
                                                  }`}</Typography>
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
                                        text="Editar proyecto"
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
                                        text="Editar rol"
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
                                                "/assets/img/iconos/edit_icon_blue.png"
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
                                  {[Constants.ESTADOS_PROYECTO.ARCHIVADO, Constants.ESTADOS_PROYECTO.RECHAZADO, Constants.ESTADOS_PROYECTO.POR_VALIDAR].includes(
                                    p.estatus.toUpperCase()
                                  ) && (
                                    <MTooltip
                                        color="orange"
                                        placement="top"
                                        text="Borrar"
                                        icon={
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
                                                title: `${textos['eliminar']} ${textos['proyecto']}`,
                                                content: (
                                                  <Typography variant="body2">
                                                    {textos["seguro"]?? ""}
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
                                                "/assets/img/iconos/equiz_blue.svg"
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
  console.log(session?.user);
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
