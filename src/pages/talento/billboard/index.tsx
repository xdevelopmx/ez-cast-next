import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { type GetServerSideProps, type NextPage } from "next";
import { type User } from "next-auth";
import { getSession } from "next-auth/react";
import Head from "next/head";
import React, { useState, useEffect, useMemo, useContext } from "react";
import {
  Alertas,
  FormGroup,
  MCheckboxGroup,
  MSelect,
  MainLayout,
  MenuLateral,
  type RolCompletoPreview,
  Tag,
  Flotantes,
} from "~/components";
import Constants from "~/constants";
import { TipoUsuario } from "~/enums";
import Image from "next/image";
import { api } from "~/utils/api";
import { MContainer } from "~/components/layout/MContainer";
import useNotify from "~/hooks/useNotify";
import { Close } from "@mui/icons-material";
import { RolPreview } from "~/components/shared/RolPreview";
import { RolPreviewLoader } from "~/components/shared/RolPreviewLoader";
import { AplicacionRolDialog } from "~/components/talento/dialogs/AplicacionRolDialog";
import { TalentoAplicacionesRepresentante } from "~/components/representante/talento/TalentoAplicacionesRepresentante";
import AppContext from "~/context/app";
import useLang from "~/hooks/useLang";
import { Buscador } from "~/components/shared/Buscador";
const filtros_initial_state = {
  tipo_busqueda: "todos",
  id_estado_republica: [],
  id_union: [],
  id_tipo_rol: [],
  tipo_rango_edad: " ",
  edad_inicio: 0,
  edad_fin: 0,
  id_tipo_proyecto: [],
  id_genero_rol: [],
  id_apariencia_etnica: [],
  id_nacionalidades: [],
  id_preferencias_de_pago: [],
  autorellenar: true,
};

type BillboardTalentosPageProps = {
  user: User;
  id_proyecto: number;
  id_talento: number;
};

const BillboardPage: NextPage<BillboardTalentosPageProps> = ({
  user,
  id_talento,
}) => {
  const ctx = useContext(AppContext);
  const textos = useLang(ctx.lang);

  const { notify } = useNotify();
  const [dialog, setDialog] = useState<{
    id: string;
    title: string;
    opened: boolean;
    data: Map<string, unknown>;
  }>({ id: "", title: "", opened: false, data: new Map() });

  const [pagination, setPagination] = useState({ page: 0, page_size: 5 });
  const [form_filtros, setFormFiltros] = useState<{
    tipo_busqueda: string;
    id_estado_republica: number[];
    id_union: number[];
    id_tipo_rol: string[];
    edad_inicio: number;
    edad_fin: number;
    id_tipo_proyecto: number[];
    id_genero_rol: number[];
    id_apariencia_etnica: number[];
    id_nacionalidades: number[];
    id_preferencias_de_pago: number[];
    autorellenar: boolean;
  }>(filtros_initial_state);

  const talento = api.talentos.getCompleteById.useQuery(
    { id: id_talento },
    {
      refetchOnWindowFocus: false,
    }
  );

  const aplicaciones_por_talento =
    api.roles.getAplicacionesRolesPorTalento.useQuery(
      { id_talento: id_talento },
      {
        refetchOnWindowFocus: false,
      }
    );

  const roles_billboard = api.roles.getRolesBillboardTalentos.useQuery(
    {
      id_talento: id_talento,
      tipo_busqueda: form_filtros.tipo_busqueda,
      id_estados_republica: form_filtros.id_estado_republica,
      id_uniones: form_filtros.id_union,
      tipos_roles: form_filtros.id_tipo_rol,
      edad_inicio: form_filtros.edad_inicio,
      edad_fin: form_filtros.edad_fin,
      id_tipos_proyectos: form_filtros.id_tipo_proyecto,
      id_generos_rol: form_filtros.id_genero_rol,
      id_apariencias_etnicas: form_filtros.id_apariencia_etnica,
      id_nacionalidades: form_filtros.id_nacionalidades,
      id_preferencias_de_pago: form_filtros.id_preferencias_de_pago,
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    if (roles_billboard.data) {
      setPagination({ page: 0, page_size: pagination.page_size });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roles_billboard.data]);

  useEffect(() => {
    if (talento.data && form_filtros.autorellenar) {
      setFormFiltros((prev) => {
        const id_union = talento.data?.info_basica?.union?.id_union;
        const edad_inicio =
          talento.data?.filtros_aparencias?.rango_inicial_edad;
        const edad_fin = talento.data?.filtros_aparencias?.rango_final_edad;
        const genero = talento.data?.filtros_aparencias?.genero.id;
        const apariencia_etnica =
          talento.data?.filtros_aparencias?.apariencia_etnica.id;
        const preferencia_de_pago =
          talento.data?.preferencias?.interes_en_proyectos.map(
            (i) => i.id_interes_en_proyecto
          );
        return {
          ...prev,
          id_union: id_union ? [id_union] : [],
          edad_inicio: edad_inicio ? edad_inicio : 1,
          edad_fin: edad_fin ? edad_fin : 99,
          id_genero_rol: genero ? [genero] : [],
          id_apariencia_etnica: apariencia_etnica ? [apariencia_etnica] : [],
          id_preferencias_de_pago: preferencia_de_pago
            ? preferencia_de_pago
            : [],
        };
      });
    }
  }, [talento.data, form_filtros.autorellenar]);

  const estados_republica = api.catalogos.getEstadosRepublica.useQuery(
    undefined,
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  );

  const nacionalidades = api.catalogos.getNacionalidades.useQuery(undefined, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const uniones = api.catalogos.getUniones.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  /* const tipos_roles = api.catalogos.getTiposRoles.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  }); */

  const tipos_proyectos = api.catalogos.getTipoProyectos.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const generos_rol = api.catalogos.getGeneros.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const apariencias_etnicas = api.catalogos.getAparienciasEtnicas.useQuery(
    undefined,
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  );

  const _data = useMemo(() => {
    if (roles_billboard.isFetching) {
      return Array.from({ length: 5 }).map((n, i) => {
        return <RolPreviewLoader key={i} />;
      });
    } else {
      if (roles_billboard.data) {
        if (roles_billboard.data.length === 0) {
          return [
            <Box
              key={0}
              display="flex"
              flexDirection={"column"}
              justifyContent={"center"}
              alignItems={"center"}
              className="container_list_proyects"
              marginLeft={"auto"}
              marginRight={"auto"}
            >
              <div className="box_message_blue">
                <p className="h3" style={{ fontWeight: 600 }}>
                  {textos["no_proyectos_titulo"]}
                </p>
                <p>
                  {textos["no_proyectos_body"]}
                  <br />
                </p>
              </div>
            </Box>,
          ];
        }
        return roles_billboard.data.map((rol) => {
          let aplicacion_id = 0;
          if (aplicaciones_por_talento.data) {
            const aplicacion = aplicaciones_por_talento.data.filter(
              (apt) => apt.id_rol === rol.id && apt.id_talento === id_talento
            )[0];
            if (aplicacion) {
              aplicacion_id = aplicacion.id;
            }
          }
          return (
            <RolPreview
              key={rol.id}
              rol={rol as unknown as RolCompletoPreview}
              popUp
              action={
                <Button
                  onClick={() => {
                    const params = new Map();
                    params.set("id_aplicacion", aplicacion_id);
                    params.set("id_rol", rol.id);
                    params.set("id_talento", id_talento);
                    setDialog((prev) => {
                      return {
                        ...prev,
                        id: "aplicar_dialog",
                        title: "",
                        opened: true,
                        data: params as Map<string, unknown>,
                      };
                    });
                  }}
                  sx={{
                    backgroundColor: "#069cb199",
                    borderRadius: "0.5rem",
                    color: "#fff",
                    textTransform: "none",
                    padding: "0px 35px",
                    justifyContent: "end",

                    "&:hover": {
                      backgroundColor: "#069cb1",
                    },
                  }}
                >
                  {aplicacion_id > 0 ? textos["aplicado"] : textos["aplicar"]}
                </Button>
              }
            />
          );
        });
      }
    }
    return [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    roles_billboard.isFetching,
    roles_billboard.data,
    aplicaciones_por_talento.data,
  ]);

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

  const es_ingles = ctx.lang === "en";

  return (
    <>
      <Head>
        <title>Talento | Talent Corner</title>
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
              <Grid container>
                <Grid xs={12} mt={4}>
                  <Grid container mt={4} mb={3}>
                    <Grid item container xs={12}>
                      <Typography fontWeight={800} sx={{ fontSize: "22.5px", padding: "0" }}>
                        Casting Billboard
                      </Typography>
                    </Grid>
                    <Alertas />
                  </Grid>
                </Grid>
                <Grid xs={12}>
                  <Grid container mt={4}>
                    <Grid item container xs={12}>
                      <Grid xs={2}>
                        <Typography
                          fontWeight={600}
                          sx={{ color: "#069cb1", fontSize: "1rem" }}
                        >
                          {textos["filtros"]}
                        </Typography>
                      </Grid>
                      <Grid
                        xs={4}
                        style={{
                          display: "flex",
                          alignItems: "flex-end",
                          justifyContent: "center",
                        }}
                      >
                        {roles_billboard.data &&
                          roles_billboard.data.length > 0 && (
                            <Typography
                              fontWeight={600}
                              sx={{
                                color: "#069cb1",
                                fontSize: "0.82rem",
                                textAlign: "center",
                              }}
                            >
                              {textos["PAGINADOR_RESULTS_LABEL"]
                                ?.replace(
                                  "[N1]",
                                  `${
                                    (pagination.page + 1) *
                                      pagination.page_size >
                                    roles_billboard.data?.length
                                      ? roles_billboard.data?.length
                                      : (pagination.page + 1) *
                                        pagination.page_size
                                  }`
                                )
                                .replace(
                                  "[N2]",
                                  `${roles_billboard.data?.length}`
                                )}
                            </Typography>
                          )}
                      </Grid>
                      <Grid
                        xs={6}
                        sx={{ display: "flex", justifyContent: "flex-end" }}
                      >
                        <Typography
                           fontWeight={600}
                           sx={{ color: "#069cb1", fontSize: "0.82rem" }}
                        >
                          Ver 
                          <Typography onChange={(ev) => {setPagination(prev => {
                            return {
                              ...prev,
                              page_size: parseInt(ev.target.value)
                            }
                          })}} component={'select'} sx={{ marginLeft: 2, marginRight: 2, backgroundColor: '#fff', borderRadius: '1rem', padding: '0px 8px' }}>{pagination.page_size}
                            <option selected={pagination.page_size === 2} value={2}>2</option>
                            <option selected={pagination.page_size === 4} value={4}>4</option>
                            <option selected={pagination.page_size === 8} value={8}>8</option>
                            <option selected={pagination.page_size === 16} value={16}>16</option>
                          </Typography> 
                          
                        </Typography>
                        <Typography
                          fontWeight={600}
                          sx={{ color: "#069cb1", fontSize: "0.82rem" }}
                        >
                          {' resultados por página '}
                          {roles_billboard.data &&
                            roles_billboard.data.length > 0 && (
                              <Typography
                                fontWeight={600}
                                component={"span"}
                                sx={{ paddingLeft: "40px" }}
                              >
                                {textos["pagina"]} {pagination.page + 1}{" "}
                                {textos["de"]?.toLowerCase()}{" "}
                                {Math.ceil(
                                  roles_billboard.data.length /
                                    pagination.page_size
                                )}
                              </Typography>
                            )}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid item xs={12}>
                      {user.tipo_usuario === TipoUsuario.REPRESENTANTE && (
                        <TalentoAplicacionesRepresentante
                          id_talento={id_talento}
                        />
                      )}
                      <Divider
                        sx={{
                          borderColor: "#069cb1",
                          borderWidth: 2,
                          marginTop: "6px",
                        }}
                      />
                    </Grid>

                    <Grid
                      item
                      container
                      xs={12}
                      sx={{ backgroundColor: "#EBEBEB", padding: "10px 20px" }}
                      mt={1}
                    >
                      <Grid item container xs={12}>
                        <Grid
                          container
                          xs={12}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                            }}
                          >
                            <Typography>{textos["buscar"]}</Typography>
                            <MSelect
                              id="filtro-rol-proyecto-todos"
                              options={[
                                {
                                  value: "todos",
                                  label: textos["todos"]
                                    ? textos["todos"]
                                    : "Texto No Definido",
                                },
                                {
                                  value: "por_rol",
                                  label: textos["por_rol"]
                                    ? textos["por_rol"]
                                    : "Texto No Definido",
                                },
                                {
                                  value: "por_proyecto",
                                  label: textos["por_proyecto"]
                                    ? textos["por_proyecto"]
                                    : "Texto No Definido",
                                },
                              ]}
                              styleRoot={{ width: 128 }}
                              style={{ width: "100%", fontSize: "0.72rem" }}
                              value={form_filtros.tipo_busqueda}
                              onChange={(e) => {
                                setFormFiltros((prev) => {
                                  return {
                                    ...prev,
                                    tipo_busqueda: e.target.value,
                                  };
                                });
                              }}
                              label=""
                              disable_default_option
                            />
                            <Buscador
                              inputProps={{
                                className:
                                  "form-control form-control-sm text_custom form-input-md",
                                style: {
                                  margin: 0,
                                  width: "130px",
                                  paddingRight: "30px",
                                },
                              }}
                              buttonProps={{
                                onClick: () => {
                                  console.log("Click");
                                },
                              }}
                            />
                            <MCheckboxGroup
                              onChange={(e) => {
                                setFormFiltros((prev) => {
                                  return { ...prev, autorellenar: e };
                                });
                              }}
                              direction="vertical"
                              id="talento-autorellenar"
                              options={[
                                `${textos["auto_rellenado_text"] ?? ""}`,
                              ]}
                              labelStyle={{
                                fontWeight: "400",
                                fontSize: "1rem",
                                margin: 0,
                              }}
                              values={[form_filtros.autorellenar]}
                            />
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                            }}
                          >
                            <Button
                              variant="text"
                              style={{
                                textTransform: "none",
                              }}
                              onClick={() => {
                                setFormFiltros((prev) => {
                                  return {
                                    ...prev,
                                    ...filtros_initial_state,
                                    autorellenar: false,
                                  };
                                });
                              }}
                            >
                              {textos["eliminar"]} {textos["filtros"]}
                            </Button>
                            <Button
                              onClick={() => {
                                setDialog((prev) => {
                                  return {
                                    ...prev,
                                    id: "filtros",
                                    title: `${
                                      textos["filtros_aplicados"] ?? ""
                                    }`,
                                    opened: true,
                                  };
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
                              {textos["filtros"]}
                            </Button>
                          </Box>
                        </Grid>
                      </Grid>
                      <Grid container xs={12} mt={2} gap={1}>
                        <MSelect
                          id="ubicacion-select"
                          renderValue={() => {
                            return "";
                          }}
                          placeholder={textos["ubicacion"]}
                          value={form_filtros.id_estado_republica.map((r) =>
                            r.toString()
                          )}
                          styleRoot={{ width: "100px", padding: 0 }}
                          style={{ width: "100%", fontSize: "0.72rem" }}
                          className="borde_azul"
                          onChange={(e) => {
                            setFormFiltros((prev) => {
                              return {
                                ...prev,
                                id_estado_republica: `${e.target.value}`
                                  .split(",")
                                  .map((id) => parseInt(id))
                                  .filter((id) => !isNaN(id)),
                              };
                            });
                          }}
                          multiple
                          options={
                            estados_republica.data
                              ? estados_republica.data.map((er) => {
                                  return {
                                    label: es_ingles ? er.en : er.es,
                                    value: er.id.toString(),
                                  };
                                })
                              : []
                          }
                        />
                        <MSelect
                          id="union-select"
                          renderValue={() => {
                            return "";
                          }}
                          placeholder={textos["union"]}
                          disabled={form_filtros.autorellenar}
                          styleRoot={{ width: "76px" }}
                          style={{ width: "100%", fontSize: "0.72rem" }}
                          className="borde_azul"
                          value={form_filtros.id_union.map((r) => r.toString())}
                          onChange={(e) => {
                            setFormFiltros((prev) => {
                              return {
                                ...prev,
                                id_union: `${e.target.value}`
                                  .split(",")
                                  .map((id) => parseInt(id))
                                  .filter((id) => !isNaN(id)),
                              };
                            });
                          }}
                          multiple
                          options={
                            uniones.data
                              ? uniones.data.map((er) => {
                                  return {
                                    label: es_ingles ? er.en : er.es,
                                    value: er.id.toString(),
                                  };
                                })
                              : []
                          }
                        />

                        <MSelect
                          id="tipos-roles-select"
                          styleRoot={{ width: "90px" }}
                          style={{ width: "100%", fontSize: "0.72rem" }}
                          className="borde_azul"
                          value={form_filtros.id_tipo_rol.map((r) => r)}
                          onChange={(e) => {
                            setFormFiltros((prev) => {
                              return {
                                ...prev,
                                id_tipo_rol: `${e.target.value}`
                                  .split(",")
                                  .map((id) => id)
                                  .filter((id) => id !== ""),
                              };
                            });
                          }}
                          renderValue={() => {
                            return "";
                          }}
                          placeholder={textos["tipo_rol"]}
                          multiple
                          options={[
                            { label: "Principal", value: "PRINCIPAL" },
                            { label: "Extra", value: "EXTRA" },
                          ]}
                        />

                        <Box
                          display={"flex"}
                          position={"relative"}
                          flexDirection={"row"}
                          gap={1}
                        >
                          <Typography
                            textAlign={"center"}
                            fontSize={"1rem"}
                            style={{
                              position: "absolute",
                              top: -24,
                              left: 4,
                            }}
                          >
                            {textos["rango_edad"]}
                          </Typography>
                          <FormGroup
                            placeholder="Desde Edad"
                            className={"form-input-md borde_azul"}
                            type="number"
                            value={form_filtros.edad_inicio.toString()}
                            rootStyle={{ margin: 0, width: "48px" }}
                            style={{
                              border: "none",
                              width: "100%",
                              fontSize: "0.72rem",
                            }}
                            onChange={(e) => {
                              setFormFiltros((prev) => {
                                return {
                                  ...prev,
                                  edad_inicio: parseInt(e.target.value),
                                };
                              });
                            }}
                          />
                          <FormGroup
                            placeholder="Hasta Edad"
                            className={"form-input-md borde_azul"}
                            type="number"
                            value={form_filtros.edad_fin.toString()}
                            rootStyle={{ margin: 0, width: "48px" }}
                            style={{
                              border: "none",
                              width: "100%",
                              fontSize: "0.72rem",
                            }}
                            onChange={(e) => {
                              setFormFiltros((prev) => {
                                return {
                                  ...prev,
                                  edad_fin: parseInt(e.target.value),
                                };
                              });
                            }}
                          />
                        </Box>
                        <MSelect
                          id="tipos-proyectos-select"
                          styleRoot={{ width: "120px" }}
                          style={{ width: "100%", fontSize: "0.72rem" }}
                          className="borde_azul"
                          value={form_filtros.id_tipo_proyecto.map((r) =>
                            r.toString()
                          )}
                          onChange={(e) => {
                            setFormFiltros((prev) => {
                              return {
                                ...prev,
                                id_tipo_proyecto: `${e.target.value}`
                                  .split(",")
                                  .map((id) => parseInt(id))
                                  .filter((id) => !isNaN(id)),
                              };
                            });
                          }}
                          renderValue={() => {
                            return "";
                          }}
                          placeholder={textos["tipo_proyecto"]}
                          multiple
                          options={
                            tipos_proyectos.data
                              ? tipos_proyectos.data.map((er) => {
                                  return {
                                    label: es_ingles ? er.en : er.es,
                                    value: er.id.toString(),
                                  };
                                })
                              : []
                          }
                        />

                        <MSelect
                          id="generos-select"
                          disabled={form_filtros.autorellenar}
                          styleRoot={{ width: "110px" }}
                          style={{ width: "100%", fontSize: "0.72rem" }}
                          className="borde_azul"
                          value={form_filtros.id_genero_rol.map((r) =>
                            r.toString()
                          )}
                          onChange={(e) => {
                            const v_exploded = `${e.target.value}`.split(",");
                            const v = v_exploded[v_exploded.length - 1];
                            const value: number = parseInt(v ? v : "");
                            setFormFiltros((prev) => {
                              return {
                                ...prev,
                                id_genero_rol: !isNaN(value) ? [value] : [],
                              };
                            });
                          }}
                          renderValue={() => {
                            return "";
                          }}
                          placeholder={textos["genero_rol"]}
                          multiple
                          options={
                            generos_rol.data
                              ? generos_rol.data.map((er) => {
                                  return {
                                    label: es_ingles ? er.en : er.es,
                                    value: er.id.toString(),
                                  };
                                })
                              : []
                          }
                        />
                        <MSelect
                          id="apariencias-etnicas-select"
                          styleRoot={{ width: "150px" }}
                          style={{ fontSize: "0.72rem" }}
                          className="borde_azul"
                          value={form_filtros.id_apariencia_etnica.map((r) =>
                            r.toString()
                          )}
                          onChange={(e) => {
                            const v_exploded = `${e.target.value}`.split(",");
                            const v = v_exploded[v_exploded.length - 1];
                            const value: number = parseInt(v ? v : "");
                            setFormFiltros((prev) => {
                              return {
                                ...prev,
                                id_apariencia_etnica: !isNaN(value)
                                  ? [value]
                                  : [],
                              };
                            });
                          }}
                          button_props={{
                            fontSize: "1.8rem",
                            position: "absolute",
                            height: "100%",
                            top: 0,
                            right: "16px",
                          }}
                          renderValue={() => {
                            return "";
                          }}
                          placeholder={textos["apariencia_etnica"]}
                          multiple
                          options={
                            apariencias_etnicas.data
                              ? apariencias_etnicas.data.map((er) => {
                                  return {
                                    label: es_ingles ? er.en : er.es,
                                    value: er.id.toString(),
                                  };
                                })
                              : []
                          }
                        />
                        <MSelect
                          id="nacionalidades-etnicas-select"
                          styleRoot={{ width: "170px" }}
                          style={{ fontSize: "0.72rem" }}
                          className="borde_azul"
                          value={form_filtros.id_nacionalidades.map((r) =>
                            r.toString()
                          )}
                          onChange={(e) => {
                            const v_exploded = `${e.target.value}`.split(",");
                            const v = v_exploded[v_exploded.length - 1];
                            const value: number = parseInt(v ? v : "");
                            setFormFiltros((prev) => {
                              return {
                                ...prev,
                                id_nacionalidades: !isNaN(value) ? [value] : [],
                              };
                            });
                          }}
                          button_props={{
                            fontSize: "1.8rem",
                            position: "absolute",
                            height: "100%",
                            top: 0,
                            right: "16px",
                          }}
                          renderValue={() => {
                            return "";
                          }}
                          placeholder={`${textos["nacionalidad_etnia"] ?? ""}`}
                          multiple
                          options={
                            nacionalidades.data
                              ? nacionalidades.data.map((er) => {
                                  return {
                                    label: es_ingles ? er.en : er.es,
                                    value: er.id.toString(),
                                  };
                                })
                              : []
                          }
                        />
                        <MSelect
                          id="preferencias-pago-select"
                          styleRoot={{ width: "138px" }}
                          style={{ width: "100%", fontSize: "0.72rem" }}
                          className="borde_azul"
                          value={form_filtros.id_preferencias_de_pago.map((r) =>
                            r.toString()
                          )}
                          onChange={(e) => {
                            setFormFiltros((prev) => {
                              return {
                                ...prev,
                                id_preferencias_de_pago: `${e.target.value}`
                                  .split(",")
                                  .map((id) => parseInt(id))
                                  .filter((id) => !isNaN(id)),
                              };
                            });
                          }}
                          renderValue={() => {
                            return "";
                          }}
                          placeholder={textos["preferencia_pago"]}
                          multiple
                          options={[
                            { label: `${textos["pagado"] ?? ""}`, value: "1" },
                            {
                              label: `${textos["no_pagado"] ?? ""}`,
                              value: "2",
                            },
                          ]}
                        />
                      </Grid>
                    </Grid>

                    <Grid xs={12} container gap={2} mt={4}>
                      <MContainer direction="horizontal">
                        <Typography mr={1}>
                          {textos["filtros_aplicados"]}{" "}
                        </Typography>
                        <MContainer
                          direction="horizontal"
                          justify="space-between"
                          styles={{ gap: 8 }}
                        >
                          {form_filtros.id_estado_republica.length === 0 &&
                            form_filtros.id_union.length === 0 &&
                            form_filtros.id_tipo_rol.length === 0 &&
                            (form_filtros.edad_inicio <= 0 ||
                              form_filtros.edad_fin <= 0 ||
                              form_filtros.edad_fin <
                                form_filtros.edad_inicio) &&
                            form_filtros.id_tipo_proyecto.length === 0 &&
                            form_filtros.id_genero_rol.length === 0 &&
                            form_filtros.id_apariencia_etnica.length === 0 &&
                            form_filtros.id_preferencias_de_pago.length ===
                              0 && (
                              <Typography mt={0.5} variant="body2">
                                {textos["no_filtros"]}
                              </Typography>
                            )}
                          {form_filtros.id_estado_republica.length > 0 && (
                            <Tag
                              tacheDerecha
                              text={`${textos["ubicacion"] ?? ""}`}
                              onRemove={() => {
                                setFormFiltros((prev) => {
                                  return { ...prev, id_estado_republica: [] };
                                });
                              }}
                            />
                          )}
                          {form_filtros.id_union.length > 0 && (
                            <Tag
                              tacheDerecha
                              text={`${textos["union"] ?? ""}`}
                              onRemove={() => {
                                if (form_filtros.autorellenar) {
                                  notify(
                                    "warning",
                                    `${
                                      textos[
                                        "validacion_filtro_con_autorellenado"
                                      ] ?? ""
                                    }`
                                  );
                                } else {
                                  setFormFiltros((prev) => {
                                    return { ...prev, id_union: [] };
                                  });
                                }
                              }}
                            />
                          )}
                          {form_filtros.id_tipo_rol.length > 0 && (
                            <Tag
                              tacheDerecha
                              text={`${textos["tipo_rol"] ?? ""}`}
                              onRemove={() => {
                                setFormFiltros((prev) => {
                                  return { ...prev, id_tipo_rol: [] };
                                });
                              }}
                            />
                          )}
                          {form_filtros.edad_inicio > 0 &&
                            form_filtros.edad_fin > 0 &&
                            form_filtros.edad_fin >=
                              form_filtros.edad_inicio && (
                              <Tag
                                tacheDerecha
                                text={`${textos["rango_edad"] ?? ""}`}
                                onRemove={() => {
                                  setFormFiltros((prev) => {
                                    return { ...prev, tipo_rango_edad: " " };
                                  });
                                }}
                              />
                            )}
                          {form_filtros.id_tipo_proyecto.length > 0 && (
                            <Tag
                              tacheDerecha
                              text={`${textos["tipo_proyecto"] ?? ""}`}
                              onRemove={() => {
                                setFormFiltros((prev) => {
                                  return { ...prev, id_tipo_proyecto: [] };
                                });
                              }}
                            />
                          )}
                          {form_filtros.id_genero_rol.length > 0 && (
                            <Tag
                              tacheDerecha
                              text={`${textos["genero_rol"] ?? ""}`}
                              onRemove={() => {
                                if (form_filtros.autorellenar) {
                                  notify(
                                    "warning",
                                    `${
                                      textos[
                                        "validacion_filtro_con_autorellenado"
                                      ] ?? ""
                                    }`
                                  );
                                } else {
                                  setFormFiltros((prev) => {
                                    return { ...prev, id_genero_rol: [] };
                                  });
                                }
                              }}
                            />
                          )}
                          {form_filtros.id_apariencia_etnica.length > 0 && (
                            <Tag
                              tacheDerecha
                              text={`${textos["apariencia_etnica"] ?? ""}`}
                              onRemove={() => {
                                setFormFiltros((prev) => {
                                  return { ...prev, id_apariencia_etnica: [] };
                                });
                              }}
                            />
                          )}
                          {form_filtros.id_nacionalidades.length > 0 && (
                            <Tag
                              tacheDerecha
                              text={`${textos["nacionalidad_etnia"] ?? ""}`}
                              onRemove={() => {
                                setFormFiltros((prev) => {
                                  return { ...prev, id_nacionalidades: [] };
                                });
                              }}
                            />
                          )}
                          {form_filtros.id_preferencias_de_pago.length > 0 && (
                            <Tag
                              tacheDerecha
                              text={`${textos["preferencia_pago"] ?? ""}`}
                              onRemove={() => {
                                setFormFiltros((prev) => {
                                  return {
                                    ...prev,
                                    id_preferencias_de_pago: [],
                                  };
                                });
                              }}
                            />
                          )}
                        </MContainer>
                      </MContainer>
                    </Grid>
                    <Grid xs={12} container gap={2} mt={4}>
                      {paginated_data}
                    </Grid>
                    <Grid xs={12} mt={4}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Button
                          disabled={
                            !roles_billboard.data ||
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

                        {roles_billboard.data &&
                          roles_billboard.data.length > 0 && (
                            <Typography
                              sx={{ color: "#069cb1" }}
                              fontWeight={600}
                            >
                              {textos["pagina"]} {pagination.page + 1}{" "}
                              {textos["de"]?.toLowerCase()}{" "}
                              {Math.ceil(
                                roles_billboard.data.length /
                                  pagination.page_size
                              )}
                            </Typography>
                          )}
                        <Button
                          disabled={
                            !roles_billboard.data ||
                            (pagination.page + 1) * pagination.page_size >
                              roles_billboard.data.length
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
                  </Grid>
                </Grid>
              </Grid>
            </div>
          </div>
        </div>
        <Dialog
          maxWidth={"md"}
          style={{ padding: 0, margin: 0, overflow: "hidden" }}
          open={dialog.id === "filtros" && dialog.opened}
          onClose={() => setDialog({ ...dialog, opened: false })}
        >
          <DialogTitle align="left" style={{ color: "#069cb1" }}>
            {dialog.title}
          </DialogTitle>
          <DialogContent style={{ padding: 0, width: 650, overflow: "hidden" }}>
            <Box px={4} width={700}>
              <MContainer direction="horizontal">
                <Typography fontSize={"1.2rem"} mr={2}>
                  {textos["tipo_rol"]}
                </Typography>
                <Button
                  onClick={() => {
                    setFormFiltros((prev) => {
                      return { ...prev, id_tipo_rol: [] };
                    });
                  }}
                  style={{ textDecoration: "underline" }}
                  size="small"
                  variant="text"
                >
                  {textos["eliminar"]} {textos["todos"]}
                </Button>
              </MContainer>
              {form_filtros.id_tipo_rol.length === 0 && (
                <Typography variant="body2">
                  {textos["no_opciones_seleccionadas"]}
                </Typography>
              )}
              {form_filtros.id_tipo_rol.map((tipo, i) => {
                return (
                  <Tag
                    key={i}
                    styles={{ marginRight: 1 }}
                    text={tipo === "PRINCIPAL" ? "Principal" : "Extra"}
                    onRemove={() => {
                      setFormFiltros((prev) => {
                        return {
                          ...prev,
                          id_tipo_rol: form_filtros.id_tipo_rol.filter(
                            (i) => i !== tipo
                          ),
                        };
                      });
                    }}
                  />
                );
              })}

              <MContainer styles={{ marginTop: 16 }} direction="horizontal">
                <Typography fontSize={"1.2rem"} mr={2}>
                  {textos["tipo_proyecto"]}
                </Typography>
                <Button
                  onClick={() => {
                    setFormFiltros((prev) => {
                      return { ...prev, id_tipo_proyecto: [] };
                    });
                  }}
                  style={{ textDecoration: "underline" }}
                  size="small"
                  variant="text"
                >
                  {textos["eliminar"]} {textos["todos"]}
                </Button>
              </MContainer>
              {form_filtros.id_tipo_proyecto.length === 0 && (
                <Typography variant="body2">
                  {textos["no_opciones_seleccionadas"]}
                </Typography>
              )}
              {form_filtros.id_tipo_proyecto.map((tipo, i) => {
                const tipo_proyecto = tipos_proyectos.data?.filter(
                  (tp) => tp.id === tipo
                )[0];
                if (tipo_proyecto) {
                  return (
                    <Tag
                      key={i}
                      styles={{ marginRight: 1 }}
                      text={es_ingles ? tipo_proyecto.en : tipo_proyecto.es}
                      onRemove={() => {
                        setFormFiltros((prev) => {
                          return {
                            ...prev,
                            id_tipo_proyecto:
                              form_filtros.id_tipo_proyecto.filter(
                                (i) => i !== tipo
                              ),
                          };
                        });
                      }}
                    />
                  );
                }
              })}

              <MContainer styles={{ marginTop: 16 }} direction="horizontal">
                <Typography fontSize={"1.2rem"} mr={2}>
                  {textos["preferencia_pago"]}
                </Typography>
                <Button
                  onClick={() => {
                    setFormFiltros((prev) => {
                      return { ...prev, id_preferencias_de_pago: [] };
                    });
                  }}
                  style={{ textDecoration: "underline" }}
                  size="small"
                  variant="text"
                >
                  {textos["eliminar"]} {textos["todos"]}
                </Button>
              </MContainer>
              {form_filtros.id_preferencias_de_pago.length === 0 && (
                <Typography variant="body2">
                  {textos["no_opciones_seleccionadas"]}
                </Typography>
              )}
              {form_filtros.id_preferencias_de_pago.map((tipo, i) => {
                return (
                  <Tag
                    key={i}
                    styles={{ marginRight: 1 }}
                    text={`${
                      tipo === 1
                        ? textos["pagado"] ?? ""
                        : textos["no_pagado"] ?? ""
                    }`}
                    onRemove={() => {
                      setFormFiltros((prev) => {
                        return {
                          ...prev,
                          id_preferencias_de_pago:
                            form_filtros.id_preferencias_de_pago.filter(
                              (i) => i !== tipo
                            ),
                        };
                      });
                    }}
                  />
                );
              })}

              <MContainer styles={{ marginTop: 16 }} direction="horizontal">
                <Typography fontSize={"1.2rem"} mr={2}>
                  {textos["union"]}
                </Typography>
                <Button
                  onClick={() => {
                    if (form_filtros.autorellenar) {
                      notify(
                        "warning",
                        `${textos["validacion_filtro_con_autorellenado"] ?? ""}`
                      );
                    } else {
                      setFormFiltros((prev) => {
                        return { ...prev, id_union: [] };
                      });
                    }
                  }}
                  style={{ textDecoration: "underline" }}
                  size="small"
                  variant="text"
                >
                  {textos["eliminar"]} {textos["todos"]}
                </Button>
              </MContainer>
              {form_filtros.id_union.length === 0 && (
                <Typography variant="body2">
                  {textos["no_opciones_seleccionadas"]}
                </Typography>
              )}
              {form_filtros.id_union.map((tipo, i) => {
                const union = uniones.data?.filter((tp) => tp.id === tipo)[0];
                if (union) {
                  return (
                    <Tag
                      key={i}
                      styles={{ marginRight: 1 }}
                      text={es_ingles ? union.en : union.es}
                      onRemove={() => {
                        if (form_filtros.autorellenar) {
                          notify(
                            "warning",
                            `${
                              textos["validacion_filtro_con_autorellenado"] ??
                              ""
                            }`
                          );
                        } else {
                          setFormFiltros((prev) => {
                            return {
                              ...prev,
                              id_union: form_filtros.id_union.filter(
                                (i) => i !== tipo
                              ),
                            };
                          });
                        }
                      }}
                    />
                  );
                }
              })}

              <MContainer styles={{ marginTop: 16 }} direction="horizontal">
                <Typography fontSize={"1.2rem"} mr={2}>
                  {textos["genero_rol"]}
                </Typography>
                <Button
                  onClick={() => {
                    if (form_filtros.autorellenar) {
                      notify(
                        "warning",
                        `${textos["validacion_filtro_con_autorellenado"] ?? ""}`
                      );
                    } else {
                      setFormFiltros((prev) => {
                        return { ...prev, id_genero_rol: [] };
                      });
                    }
                  }}
                  style={{ textDecoration: "underline" }}
                  size="small"
                  variant="text"
                >
                  {textos["eliminar"]} {textos["todos"]}
                </Button>
              </MContainer>
              {form_filtros.id_genero_rol.length === 0 && (
                <Typography variant="body2">
                  {textos["no_opciones_seleccionadas"]}
                </Typography>
              )}
              {form_filtros.id_genero_rol.map((tipo, i) => {
                const genero = generos_rol.data?.filter(
                  (tp) => tp.id === tipo
                )[0];
                if (genero) {
                  return (
                    <Tag
                      key={i}
                      styles={{ marginRight: 1 }}
                      text={es_ingles ? genero.en : genero.es}
                      onRemove={() => {
                        if (form_filtros.autorellenar) {
                          notify(
                            "warning",
                            `${
                              textos["validacion_filtro_con_autorellenado"] ??
                              ""
                            }`
                          );
                        } else {
                          setFormFiltros((prev) => {
                            return {
                              ...prev,
                              id_genero_rol: form_filtros.id_genero_rol.filter(
                                (i) => i !== tipo
                              ),
                            };
                          });
                        }
                      }}
                    />
                  );
                }
              })}

              <MContainer styles={{ marginTop: 16 }} direction="horizontal">
                <Typography fontSize={"1.2rem"} mr={2}>
                  {textos["apariencia_etnica"]}
                </Typography>
                <Button
                  onClick={() => {
                    setFormFiltros((prev) => {
                      return { ...prev, id_apariencia_etnica: [] };
                    });
                  }}
                  style={{ textDecoration: "underline" }}
                  size="small"
                  variant="text"
                >
                  {textos["eliminar"]} {textos["todos"]}
                </Button>
              </MContainer>
              {form_filtros.id_apariencia_etnica.length === 0 && (
                <Typography variant="body2">
                  No se han seleccionado opciones
                </Typography>
              )}
              {form_filtros.id_apariencia_etnica.map((tipo, i) => {
                const etnia = apariencias_etnicas.data?.filter(
                  (tp) => tp.id === tipo
                )[0];
                if (etnia) {
                  return (
                    <Tag
                      key={i}
                      styles={{ marginRight: 1 }}
                      text={es_ingles ? etnia.en : etnia.es}
                      onRemove={() => {
                        setFormFiltros((prev) => {
                          return {
                            ...prev,
                            id_apariencia_etnica:
                              form_filtros.id_apariencia_etnica.filter(
                                (i) => i !== tipo
                              ),
                          };
                        });
                      }}
                    />
                  );
                }
              })}

              <MContainer styles={{ marginTop: 16 }} direction="horizontal">
                <Typography fontSize={"1.2rem"} mr={2}>
                  {textos["nacionalidad_etnia"]}
                </Typography>
                <Button
                  onClick={() => {
                    setFormFiltros((prev) => {
                      return { ...prev, id_nacionalidades: [] };
                    });
                  }}
                  style={{ textDecoration: "underline" }}
                  size="small"
                  variant="text"
                >
                  {textos["eliminar"]} {textos["todos"]}
                </Button>
              </MContainer>
              {form_filtros.id_nacionalidades.length === 0 && (
                <Typography variant="body2">
                  {textos["no_opciones_seleccionadas"]}
                </Typography>
              )}
              {form_filtros.id_nacionalidades.map((tipo, i) => {
                const nacionalidad = nacionalidades.data?.filter(
                  (tp) => tp.id === tipo
                )[0];
                if (nacionalidad) {
                  return (
                    <Tag
                      key={i}
                      styles={{ marginRight: 1 }}
                      text={es_ingles ? nacionalidad.en : nacionalidad.es}
                      onRemove={() => {
                        setFormFiltros((prev) => {
                          return {
                            ...prev,
                            id_nacionalidades:
                              form_filtros.id_nacionalidades.filter(
                                (i) => i !== tipo
                              ),
                          };
                        });
                      }}
                    />
                  );
                }
              })}

              <MContainer styles={{ marginTop: 16 }} direction="horizontal">
                <Typography fontSize={"1.2rem"} mr={2}>
                  {textos["ubicacion"]}
                </Typography>
                <Button
                  onClick={() => {
                    setFormFiltros((prev) => {
                      return { ...prev, id_estado_republica: [] };
                    });
                  }}
                  style={{ textDecoration: "underline" }}
                  size="small"
                  variant="text"
                >
                  {textos["eliminar"]} {textos["todos"]}
                </Button>
              </MContainer>
              {form_filtros.id_estado_republica.length === 0 && (
                <Typography variant="body2">
                  {textos["no_opciones_seleccionadas"]}
                </Typography>
              )}
              {form_filtros.id_estado_republica.map((tipo, i) => {
                const ubicacion = estados_republica.data?.filter(
                  (tp) => tp.id === tipo
                )[0];
                if (ubicacion) {
                  return (
                    <Tag
                      key={i}
                      styles={{ marginRight: 1 }}
                      text={es_ingles ? ubicacion.en : ubicacion.es}
                      onRemove={() => {
                        setFormFiltros((prev) => {
                          return {
                            ...prev,
                            id_estado_republica:
                              form_filtros.id_estado_republica.filter(
                                (i) => i !== tipo
                              ),
                          };
                        });
                      }}
                    />
                  );
                }
              })}

              <MContainer styles={{ marginTop: 16 }} direction="horizontal">
                <Typography fontSize={"1.2rem"} mr={2}>
                  {textos["rango_edad"]}
                </Typography>
                <Button
                  onClick={() => {
                    setFormFiltros((prev) => {
                      return { ...prev, edad_inicio: 0, edad_fin: 0 };
                    });
                  }}
                  style={{ textDecoration: "underline" }}
                  size="small"
                  variant="text"
                >
                  {textos["eliminar"]} {textos["todos"]}
                </Button>
              </MContainer>
              {(form_filtros.edad_inicio <= 0 ||
                form_filtros.edad_fin <= 0 ||
                form_filtros.edad_fin < form_filtros.edad_inicio) && (
                <Typography variant="body2">
                  {textos["no_opciones_seleccionadas"]}
                </Typography>
              )}
              {form_filtros.edad_inicio > 0 &&
                form_filtros.edad_fin > 0 &&
                form_filtros.edad_fin >= form_filtros.edad_inicio && (
                  <Tag
                    styles={{ marginRight: 1 }}
                    text={`${(textos["desde_hasta"] ?? "")
                      ?.replace("[N1]", `${form_filtros.edad_inicio}`)
                      .replace("[N2]", `${form_filtros.edad_fin}`)}`}
                    onRemove={() => {
                      setFormFiltros((prev) => {
                        return { ...prev, edad_inicio: 0, edad_fin: 0 };
                      });
                    }}
                  />
                )}
            </Box>
          </DialogContent>
          <Box
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <Button
              style={{ marginLeft: 8, marginRight: 8 }}
              startIcon={<Close />}
              onClick={() => setDialog({ ...dialog, opened: false })}
            >
              {textos["cerrar"]}
            </Button>
          </Box>
        </Dialog>
        <AplicacionRolDialog
          id_aplicacion={dialog.data.get("id_aplicacion") as number}
          id_rol={dialog.data.get("id_rol") as number}
          id_talento={dialog.data.get("id_talento") as number}
          readonly={(dialog.data.get("id_aplicacion") as number) > 0}
          onClose={(changed: boolean) => {
            if (changed) {
              void aplicaciones_por_talento.refetch();
              //void medidas.refetch();
            }
            setDialog((prev) => {
              return { ...prev, opened: false };
            });
          }}
          opened={dialog.opened && dialog.id === "aplicar_dialog"}
        />
      </MainLayout>
      <Flotantes />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  let id_proyecto = 0;
  let id_talento = 0;
  if (context.query) {
    id_proyecto = parseInt(context.query["id-proyecto"] as string);
    id_talento = parseInt(context.query["id_talento"] as string);
  }
  if (session && session.user && session.user.tipo_usuario) {
    if (
      [TipoUsuario.TALENTO, TipoUsuario.REPRESENTANTE].includes(
        session.user.tipo_usuario
      )
    ) {
      return {
        props: {
          user: session.user,
          id_proyecto: id_proyecto,
          id_talento:
            session.user.tipo_usuario === TipoUsuario.TALENTO
              ? parseInt(session.user.id)
              : id_talento,
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

export default BillboardPage;
