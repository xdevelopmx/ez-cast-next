import {
  Box,
  Button,
  Grid,
  //type SxProps,
  //type Theme,
  Typography,
} from "@mui/material";
import Head from "next/head";
import Image from "next/image";
import {
  Alertas,
  MainLayout,
  MenuLateral,
  type RolCompletoPreview,
} from "~/components";

import { useContext, useMemo, useState } from "react";
import { api } from "~/utils/api";
import { AnimatePresence } from "framer-motion";
import ConfirmationDialog from "~/components/shared/ConfirmationDialog";
//import { useRouter } from "next/router";
//import useNotify from "~/hooks/useNotify";
import { TipoUsuario } from "~/enums";
import { getSession } from "next-auth/react";
import type { GetServerSideProps, NextPage } from "next";
import Constants from "~/constants";
import type { User } from "next-auth";
import { RolPreviewLoader } from "~/components/shared/RolPreviewLoader";
import { RolPreview } from "~/components/shared/RolPreview";
import { AplicacionRolDialog } from "~/components/talento/dialogs/AplicacionRolDialog";
import { TalentoAplicacionesRepresentante } from "~/components/representante/talento/TalentoAplicacionesRepresentante";
import AppContext from "~/context/app";
import useLang from "~/hooks/useLang";

/* const estilos_calendario: SxProps<Theme> = {
  "& .MuiPickersCalendarHeader-label": {
    fontWeight: "bold",
  },
  "& .MuiDayCalendar-weekDayLabel": {
    color: "#069cb1",
    fontWeight: "bold",
    margin: 0,
    borderBottom: "2px solid #069cb1",
    fontSize: "0.9rem",
  },
  "& .MuiDayCalendar-header": {},
  "& .MuiPickersDay-root": {
    margin: 0,
    fontWeight: "bold",
    fontSize: "0.9rem",
  },
  "& .MuiPickersDay-today": {
    borderRadius: 0,
    backgroundColor: "#FCD081",
    color: "#000",
    border: "none",
  },
  "& .Mui-selected, & .Mui-selected:hover, & .Mui-selected:focus": {
    borderRadius: 0,
    backgroundColor: "#9CF2FD",
    color: "#000",
    border: "none",
  },
}; */

type AplicacionesTalentoPageProps = {
  user: User;
  id_talento: number;
};

const AplicacionesTalento: NextPage<AplicacionesTalentoPageProps> = ({
  user,
  id_talento,
}) => {
  const ctx = useContext(AppContext);
  const textos = useLang(ctx.lang);

  const [pagination, setPagination] = useState<{
    page: number;
    page_size: number;
  }>({ page: 0, page_size: 5 });
  const [confirmation_dialog, setConfirmationDialog] = useState<{
    opened: boolean;
    title: string;
    content: JSX.Element;
    action: "DELETE" | "CALLBACK";
    data: Map<string, unknown>;
  }>({
    opened: false,
    title: "",
    content: <></>,
    action: "DELETE",
    data: new Map(),
  });

  const [dialog, setDialog] = useState<{
    opened: boolean;
    data: Map<string, unknown>;
  }>({ opened: false, data: new Map() });

  const aplicaciones_roles = api.roles.getAplicacionesRolesPorTalento.useQuery(
    {
      id_talento: id_talento,
      pagination: {
        skip: pagination.page * pagination.page_size,
        take: pagination.page_size,
      },
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  const _data = useMemo(() => {
    if (aplicaciones_roles.isFetching) {
      return Array.from({ length: 5 }).map((n, i) => {
        return <RolPreviewLoader key={i} />;
      });
    } else {
      if (aplicaciones_roles.data) {
        return aplicaciones_roles.data.map((aplicacion) => (
          <Box key={aplicacion.id}>
            <Box display={"flex"} flexDirection={"row"} gap={2}>
              <Typography
                variant="body2"
                fontSize={"1.5rem"}
                fontWeight={700}
                color={"#069cb1"}
              >
                {textos["status"]}:
              </Typography>
              <Typography variant="body2" fontSize={"1.5rem"}>
                {(() => {
                  switch (aplicacion.id_estado_aplicacion) {
                    case Constants.ESTADOS_APLICACION_ROL.NO_VISTO:
                      return textos["no_visto"];
                    case Constants.ESTADOS_APLICACION_ROL.VISTO:
                      return textos["visto"];
                    case Constants.ESTADOS_APLICACION_ROL.DESTACADO:
                      return textos["destacado"];
                    case Constants.ESTADOS_APLICACION_ROL.AUDICION:
                      return textos["audicion"];
                    case Constants.ESTADOS_APLICACION_ROL.CALLBACK:
                      return "Callback";
                  }
                  return "ND";
                })()}
              </Typography>
            </Box>
            <RolPreview
              key={aplicacion.rol.id}
              rol={aplicacion.rol as unknown as RolCompletoPreview}
              popUp
              action={
                <Button
                  onClick={() => {
                    const params = new Map<string, unknown>();
                    params.set("id_aplicacion", aplicacion.id);
                    setDialog((prev) => {
                      return { ...prev, opened: true, data: params };
                    });
                  }}
                  sx={{
                    backgroundColor: "#069cb1",
                    borderRadius: "2rem",
                    color: "#fff",
                    textTransform: "none",
                    padding: "0px 35px",

                    "&:hover": {
                      backgroundColor: "#069cb1",
                    },
                  }}
                >
                  {textos["ver"]} {textos["aplicacion"]}
                </Button>
              }
            />
          </Box>
        ));
      }
    }
    return [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aplicaciones_roles.isFetching, aplicaciones_roles.data]);

  const paginated_data = useMemo(() => {
    const start = pagination.page * pagination.page_size;
    const end = pagination.page * pagination.page_size + pagination.page_size;
    const sliced_data = _data.slice(start, end);
    if (sliced_data.length === 0 && pagination.page > 0) {
      setPagination((v) => {
        return { ...v, page: v.page - 1 };
      });
    }
    return sliced_data;
  }, [pagination, _data]);

  return (
    <>
      <Head>
        <title>Talentos | Talent Corner</title>
        <meta name="description" content="Talent Corner" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MainLayout menuSiempreBlanco={true}>
        <AnimatePresence>
          <div className="d-flex wrapper_ezc">
            <MenuLateral />
            <div className="seccion_container col" style={{ paddingTop: 0 }}>
              <br />
              <br />
              <div className="container_box_header">
                <div className="d-flex justify-content-end align-items-start py-2">
                  <Alertas />
                </div>
                <Grid container>
                  <Grid item xs={12}>
                    <Grid container item columns={12}>
                      <Grid item md={1} textAlign={"center"}>
                        <Image
                          src="/assets/img/iconos/tus-aplicaciones.png"
                          width={40}
                          height={30}
                          style={{
                            margin: "15px 0 0 0",
                            filter:
                              "invert(43%) sepia(92%) saturate(431%) hue-rotate(140deg) brightness(97%) contrast(101%)",
                          }}
                          alt=""
                        />
                      </Grid>
                      <Grid item md={11}>
                        <Typography
                          fontWeight={800}
                          sx={{ color: "#000000", fontSize: "1.8rem" }}
                        >
                          {textos["tus"]} {textos["aplicaciones"]}
                        </Typography>
                      </Grid>
                      {user.tipo_usuario === TipoUsuario.REPRESENTANTE && (
                        <TalentoAplicacionesRepresentante
                          id_talento={id_talento}
                        />
                      )}
                    </Grid>
                  </Grid>
                  {paginated_data.length === 0 && (
                    <Grid item xs={12} className="container_list_proyects">
                      <div
                        style={{ width: "80%" }}
                        className="box_message_blue"
                      >
                        <p className="h3" style={{ fontWeight: 600 }}>
                          {textos["no_aplicaciones_title"]}
                        </p>
                        <p
                          style={{
                            width: "60%",
                            marginLeft: "20%",
                            textAlign: "justify",
                          }}
                        >
                          {textos["no_aplicaciones_body"]}
                        </p>
                      </div>
                    </Grid>
                  )}
                  {paginated_data.length > 0 && (
                    <>
                      <Grid item xs={12} container gap={2} mt={4}>
                        {paginated_data}
                      </Grid>
                      <Grid item xs={12} mt={4}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Button
                            disabled={
                              !aplicaciones_roles.data ||
                              (pagination.page + 1) * pagination.page_size -
                                pagination.page_size <=
                                0
                            }
                            sx={{ textTransform: "none" }}
                            onClick={() => {
                              setPagination((prev) => {
                                return { ...prev, page: prev.page - 1 };
                              });
                            }}
                          >
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Image
                                src="/assets/img/iconos/arow_l_blue.svg"
                                width={15}
                                height={15}
                                alt=""
                              />
                              <Typography fontWeight={600}>
                                {textos["pagina_anterior"]}
                              </Typography>
                            </Box>
                          </Button>

                          {aplicaciones_roles.data &&
                            aplicaciones_roles.data.length > 0 && (
                              <Typography
                                sx={{ color: "#069cb1" }}
                                fontWeight={600}
                              >
                                {textos["pagina"]} {pagination.page + 1}{" "}
                                {textos["de"]?.toLowerCase()}{" "}
                                {Math.ceil(
                                  aplicaciones_roles.data.length /
                                    pagination.page_size
                                )}
                              </Typography>
                            )}
                          <Button
                            disabled={
                              !aplicaciones_roles.data ||
                              (pagination.page + 1) * pagination.page_size >
                                aplicaciones_roles.data.length
                            }
                            sx={{ textTransform: "none" }}
                            onClick={() => {
                              setPagination((prev) => {
                                return { ...prev, page: prev.page + 1 };
                              });
                            }}
                          >
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Typography fontWeight={600}>
                                {textos["siguiente_pagina"]}
                              </Typography>
                              <Image
                                src="/assets/img/iconos/arow_r_blue.svg"
                                width={15}
                                height={15}
                                alt=""
                              />
                            </Box>
                          </Button>
                        </Box>
                      </Grid>
                    </>
                  )}
                </Grid>
              </div>
            </div>
          </div>
        </AnimatePresence>
        <ConfirmationDialog
          opened={confirmation_dialog.opened}
          onOptionSelected={(confirmed: boolean) => {
            if (confirmed) {
              switch (confirmation_dialog.action) {
                case "DELETE": {
                  const id = confirmation_dialog.data.get("id");

                  break;
                }
              }
            }
            setConfirmationDialog({ ...confirmation_dialog, opened: false });
          }}
          title={confirmation_dialog.title}
          content={confirmation_dialog.content}
        />
      </MainLayout>
      <AplicacionRolDialog
        readonly
        id_aplicacion={dialog.data.get("id_aplicacion") as number}
        onClose={(changed: boolean) => {
          if (changed) {
            //void medidas.refetch();
          }
          setDialog((prev) => {
            return { ...prev, opened: false };
          });
        }}
        opened={dialog.opened}
      />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (session && session.user && session.user.tipo_usuario) {
    if (
      [TipoUsuario.TALENTO, TipoUsuario.REPRESENTANTE].includes(
        session.user.tipo_usuario
      )
    ) {
      const { id_talento } = context.query;
      const talento_id =
        session.user.tipo_usuario === TipoUsuario.TALENTO
          ? session.user.id
          : (id_talento as string);
      return {
        props: {
          user: session.user,
          id_talento: parseInt(talento_id),
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

export default AplicacionesTalento;
