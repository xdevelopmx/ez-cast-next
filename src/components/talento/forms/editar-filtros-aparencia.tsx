import { useContext, type FC } from "react";
import {
  AddButton,
  FormGroup,
  MCheckboxGroup,
  MRadioGroup,
  MSelect,
  Tag,
} from "~/components";
import { Alert, Divider, Grid, Typography } from "@mui/material";
import { MContainer } from "~/components/layout/MContainer";
import { type FiltrosAparienciaForm } from "~/pages/talento/editar-perfil";
import { api } from "~/utils/api";
import useNotify from "~/hooks/useNotify";
import MotionDiv from "~/components/layout/MotionDiv";
import AppContext from "~/context/app";
import useLang from "~/hooks/useLang";

interface Props {
  state: FiltrosAparienciaForm;
  onFormChange: (input: { [id: string]: unknown }) => void;
}

export const EditarFiltrosAparenciasTalento: FC<Props> = ({
  onFormChange,
  state,
}) => {
  const ctx = useContext(AppContext);
  const textos = useLang(ctx.lang);

  const { notify } = useNotify();

  const colores_cabello = api.catalogos.getColorCabello.useQuery(undefined, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const estilos_cabello = api.catalogos.getEstiloCabello.useQuery(undefined, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const vellos_facial = api.catalogos.getVelloFacial.useQuery(undefined, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const colores_ojos = api.catalogos.getColorOjos.useQuery(undefined, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const generos = api.catalogos.getGeneros.useQuery(undefined, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const apariencias_etnicas = api.catalogos.getAparienciasEtnicas.useQuery(
    undefined,
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  const tipos_tatuajes = api.catalogos.getTiposTatuajes.useQuery(undefined, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const tipos_piercings = api.catalogos.getTiposPiercings.useQuery(undefined, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const tipos_hermanos = api.catalogos.getTipoHermanos.useQuery(undefined, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const tipos_particularidades = api.catalogos.getParticularidades.useQuery(
    undefined,
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  const nacionalidades = api.catalogos.getNacionalidades.useQuery(undefined, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const is_loading =
    nacionalidades.isFetching ||
    tipos_piercings.isFetching ||
    tipos_tatuajes.isFetching ||
    apariencias_etnicas.isFetching ||
    colores_cabello.isFetching ||
    estilos_cabello.isFetching ||
    vellos_facial.isFetching ||
    colores_ojos.isFetching;

  const es_ingles = ctx.lang === "en";

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} style={{ paddingTop: "5px" }}>
        <Alert
          severity="info"
          icon={false}
          sx={{ textAlign: "center", justifyContent: "center", padding: "0px" }}
        >
          {textos["filtros_apariencia_alerta"]
            ? textos["filtros_apariencia_alerta"]
            : "Texto No Definido"}
        </Alert>
      </Grid>
      <Grid item xs={12}>
        <MContainer direction="vertical">
          <Typography fontSize={"1.2rem"} fontWeight={600} component={"p"}>
            {textos["rango_de_edad_a_interpretar"]
              ? textos["rango_de_edad_a_interpretar"]
              : "Texto No Definido"}
          </Typography>
          <MContainer
            direction="horizontal"
            styles={{ gap: "0px 40px", alignItems: "center", marginTop: 10 }}
          >
            <FormGroup
              className={"form-input-md form-input-small"}
              labelClassName={"form-input-label"}
              value={`${state.apariencia.rango_inicial_edad}`}
              style={{ width: 60 }}
              rootStyle={{ margin: 0 }}
              type="number"
              onChange={(e) => {
                onFormChange({
                  apariencia: {
                    ...state.apariencia,
                    rango_inicial_edad: parseInt(e.currentTarget.value),
                  },
                });
              }}
            />
            <Typography>a</Typography>
            <FormGroup
              className={"form-input-md form-input-small"}
              labelClassName={"form-input-label"}
              value={`${state.apariencia.rango_final_edad}`}
              style={{ width: 60 }}
              type="number"
              rootStyle={{ margin: 0 }}
              onChange={(e) => {
                onFormChange({
                  apariencia: {
                    ...state.apariencia,
                    rango_final_edad: parseInt(e.currentTarget.value),
                  },
                });
              }}
            />
          </MContainer>
        </MContainer>
      </Grid>

      <Grid
        my={4}
        item
        xs={12}
        style={{ paddingTop: "0px", marginTop: "10px", marginBottom: "10px" }}
      >
        <Divider />
      </Grid>

      <Grid item xs={12}>
        <MContainer direction="horizontal" styles={{ gap: 30 }}>
          <MSelect
            label={
              textos["se_identifica_como"]
                ? textos["se_identifica_como"]
                : "Texto No Definido"
            }
            loading={is_loading}
            id="genero-identifica"
            options={
              generos.isSuccess && generos.data
                ? generos.data.map((u) => {
                    return {
                      value: u.id.toString(),
                      label: es_ingles ? u.en : u.es,
                    };
                  })
                : []
            }
            className={"form-input-small"}
            style={{ width: 250 }}
            value={`${state.apariencia.id_genero}`}
            onChange={(e) => {
              onFormChange({
                apariencia: {
                  ...state.apariencia,
                  id_genero: parseInt(e.target.value),
                },
              });
            }}
          />

          <MCheckboxGroup
            onAllOptionChecked={(checked) => {
              if (generos.data) {
                onFormChange({
                  generos_interesado_en_interpretar: checked
                    ? generos.data.map((i) => i.id)
                    : [],
                });
              }
            }}
            direction="horizontal"
            title={
              textos["interesado_en_interpretar"]
                ? textos["interesado_en_interpretar"]
                : "Texto No Definido"
            }
            onChange={(e, i) => {
              const genero = generos.data?.filter((_, index) => index === i)[0];
              if (genero) {
                onFormChange({
                  generos_interesado_en_interpretar:
                    state.generos_interesado_en_interpretar.includes(genero.id)
                      ? state.generos_interesado_en_interpretar.filter(
                          (e) => e !== genero.id
                        )
                      : state.generos_interesado_en_interpretar.concat([
                          genero.id,
                        ]),
                });
              }
            }}
            id="genero-interesado-interpretar"
            labelStyle={{ margin: 0, width: "32%" }}
            options={
              generos.data
                ? generos.data.map((g) => (es_ingles ? g.en : g.es))
                : []
            }
            values={
              generos.data
                ? generos.data.map((g) => {
                    return state.generos_interesado_en_interpretar.includes(
                      g.id
                    );
                  })
                : [false]
            }
          />
        </MContainer>
      </Grid>

      <Grid
        my={4}
        item
        xs={12}
        style={{ paddingTop: "0px", marginTop: "15px", marginBottom: "15px" }}
      >
        <Divider />
      </Grid>

      <Grid item xs={12}>
        <MContainer direction="horizontal" styles={{ gap: 16 }}>
          <MSelect
            label={
              textos["apariencia_etnica"]
                ? textos["apariencia_etnica"]
                : "Texto No Definido"
            }
            loading={is_loading}
            id="etinia-select"
            options={
              apariencias_etnicas.isSuccess && apariencias_etnicas.data
                ? apariencias_etnicas.data.map((u) => {
                    return {
                      value: u.id.toString(),
                      label: es_ingles ? u.en : u.es,
                    };
                  })
                : []
            }
            style={{ width: 250 }}
            value={`${state.apariencia.id_apariencia_etnica}`}
            className={"form-input-small"}
            onChange={(e) => {
              onFormChange({
                apariencia: {
                  ...state.apariencia,
                  id_apariencia_etnica: parseInt(e.target.value),
                },
              });
            }}
          />
          <MSelect
            id="tipo-nacionalidades-select"
            loading={nacionalidades.isFetching}
            labelStyle={{ fontWeight: 600 }}
            labelClassName={"form-input-label"}
            label={`${
              textos["nacionalidad_etnia"]
                ? textos["nacionalidad_etnia"]
                : "Texto No Definido"
            }*`}
            options={
              nacionalidades.data
                ? nacionalidades.data.map((s) => {
                    return {
                      value: s.id.toString(),
                      label: es_ingles ? s.en : s.es,
                    };
                  })
                : []
            }
            value={state.apariencia.id_pais.toString()}
            className={"form-input-md form-input-small"}
            onChange={(e) => {
              onFormChange({
                apariencia: {
                  ...state.apariencia,
                  id_pais: parseInt(e.target.value),
                },
              });
            }}
          />
        </MContainer>
      </Grid>

      <Grid
        my={4}
        item
        xs={12}
        style={{ paddingTop: "0px", marginTop: "15px", marginBottom: "15px" }}
      >
        <Divider />
      </Grid>

      <Grid container item xs={12}>
        <Grid container item xs={5} gap={3}>
          <Grid container item xs={12} alignItems={"center"}>
            <Grid item xs={6}>
              <Typography>
                {textos["color_de_cabello"]
                  ? textos["color_de_cabello"]
                  : "Texto No Definido"}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <MSelect
                loading={is_loading}
                id="color-cabello"
                className={"form-input-small"}
                options={
                  colores_cabello.isSuccess && colores_cabello.data
                    ? colores_cabello.data.map((u) => {
                        return {
                          value: u.id.toString(),
                          label: es_ingles ? u.en : u.es,
                        };
                      })
                    : []
                }
                style={{ width: "140px" }}
                value={`${state.apariencia.id_color_cabello}`}
                onChange={(e) => {
                  onFormChange({
                    apariencia: {
                      ...state.apariencia,
                      id_color_cabello: parseInt(e.target.value),
                    },
                  });
                }}
              />
            </Grid>
          </Grid>

          <Grid container item xs={12} alignItems={"center"}>
            <Grid item xs={6}>
              <Typography>
                {textos["estilo_de_cabello"]
                  ? textos["estilo_de_cabello"]
                  : "Texto No Definido"}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <MSelect
                id="estilo-cabello"
                className={"form-input-small"}
                options={
                  estilos_cabello.isSuccess && estilos_cabello.data
                    ? estilos_cabello.data.map((u) => {
                        return {
                          value: u.id.toString(),
                          label: es_ingles ? u.en : u.es,
                        };
                      })
                    : []
                }
                style={{ width: "140px" }}
                value={`${state.apariencia.id_estilo_cabello}`}
                onChange={(e) => {
                  onFormChange({
                    apariencia: {
                      ...state.apariencia,
                      id_estilo_cabello: parseInt(e.target.value),
                    },
                  });
                }}
              />
            </Grid>
          </Grid>

          <Grid container item xs={12} alignItems={"center"}>
            <Grid item xs={6}>
              <Typography>
                {textos["vello_facial"]
                  ? textos["vello_facial"]
                  : "Texto No Definido"}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <MSelect
                id="vello-facial"
                className={"form-input-small"}
                options={
                  vellos_facial.isSuccess && vellos_facial.data
                    ? vellos_facial.data.map((u) => {
                        return {
                          value: u.id.toString(),
                          label: es_ingles ? u.en : u.es,
                        };
                      })
                    : []
                }
                style={{ width: "140px" }}
                value={`${state.apariencia.id_vello_facial}`}
                onChange={(e) => {
                  onFormChange({
                    apariencia: {
                      ...state.apariencia,
                      id_vello_facial: parseInt(e.target.value),
                    },
                  });
                }}
              />
            </Grid>
          </Grid>

          <Grid container item xs={12} alignItems={"center"}>
            <Grid item xs={6}>
              <Typography>
                {textos["color_de_ojos"]
                  ? textos["color_de_ojos"]
                  : "Texto No Definido"}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <MSelect
                id="color-ojos"
                className={"form-input-small"}
                options={
                  colores_ojos.isSuccess && colores_ojos.data
                    ? colores_ojos.data.map((u) => {
                        return {
                          value: u.id.toString(),
                          label: es_ingles ? u.en : u.es,
                        };
                      })
                    : []
                }
                style={{ width: "140px" }}
                value={`${state.apariencia.id_color_ojos}`}
                onChange={(e) => {
                  onFormChange({
                    apariencia: {
                      ...state.apariencia,
                      id_color_ojos: parseInt(e.target.value),
                    },
                  });
                }}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid container item xs={7} gap={3}>
          <Grid container item xs={12} alignItems={"center"}>
            <Grid item xs={7}>
              <Typography paddingX={2}>
                ¿
                {textos["dispuesto_a_cambiar_de_color_de_cabello"]
                  ? textos["dispuesto_a_cambiar_de_color_de_cabello"]
                  : "Texto No Definido"}
                ?
              </Typography>
            </Grid>
            <Grid
              item
              xs={5}
              sx={{ display: "flex", justifyContent: "flex-end" }}
            >
              <MRadioGroup
                id="dispuesto-cambiar-color"
                options={[
                  textos["si"] ? textos["si"] : "",
                  textos["no"] ? textos["no"] : "",
                ]}
                styleRoot={{ height: 37 }}
                labelStyle={{
                  margin: 0,
                  fontWeight: 800,
                  fontSize: "0.72rem",
                  color: "#069cb1",
                }}
                value={
                  state.apariencia.disposicion_cambio_color_cabello
                    ? textos["si"]
                      ? textos["si"]
                      : ""
                    : textos["no"]
                    ? textos["no"]
                    : ""
                }
                onChange={(e) => {
                  onFormChange({
                    apariencia: {
                      ...state.apariencia,
                      disposicion_cambio_color_cabello: e.target.value.includes(
                        textos["si"] ? textos["si"] : "Texto No Definido"
                      ),
                    },
                  });
                }}
                label=""
              />
            </Grid>
          </Grid>

          <Grid container item xs={12} alignItems={"center"}>
            <Grid item xs={7} paddingX={2}>
              <Typography>
                ¿
                {textos["dispuesto_a_cortar_cabello"]
                  ? textos["dispuesto_a_cortar_cabello"]
                  : "Texto No Definido"}
                ?
              </Typography>
            </Grid>
            <Grid
              item
              xs={5}
              sx={{ display: "flex", justifyContent: "flex-end" }}
            >
              <MRadioGroup
                id="dispuesto-cambiar-corte"
                options={[
                  textos["si"] ? textos["si"] : "",
                  textos["no"] ? textos["no"] : "",
                ]}
                styleRoot={{ height: 37 }}
                labelStyle={{
                  margin: 0,
                  fontWeight: 800,
                  fontSize: "0.72rem",
                  color: "#069cb1",
                }}
                value={
                  state.apariencia.disposicion_corte_cabello
                    ? textos["si"]
                      ? textos["si"]
                      : ""
                    : textos["no"]
                    ? textos["no"]
                    : ""
                }
                onChange={(e) => {
                  onFormChange({
                    apariencia: {
                      ...state.apariencia,
                      disposicion_corte_cabello: e.target.value.includes(
                        textos["si"] ? textos["si"] : "Texto No Definido"
                      ),
                    },
                  });
                }}
                label=""
              />
            </Grid>
          </Grid>

          <Grid container item xs={12} alignItems={"center"}>
            <Grid item xs={7} paddingX={2}>
              <Typography>
                ¿
                {textos["dispuesto_a_crecer_o_afeitar_vello_facial"]
                  ? textos["dispuesto_a_crecer_o_afeitar_vello_facial"]
                  : "Texto No Definido"}
                ?
              </Typography>
            </Grid>
            <Grid
              item
              xs={5}
              sx={{ display: "flex", justifyContent: "flex-end" }}
            >
              <MRadioGroup
                id="dispuesto-cambiar-corte"
                options={[
                  textos["si"] ? textos["si"] : "",
                  textos["no"] ? textos["no"] : "",
                ]}
                styleRoot={{ height: 37 }}
                labelStyle={{
                  margin: 0,
                  fontWeight: 800,
                  fontSize: "0.72rem",
                  color: "#069cb1",
                }}
                value={
                  state.apariencia.disposicion_afeitar_o_crecer_vello_facial
                    ? textos["si"]
                      ? textos["si"]
                      : ""
                    : textos["no"]
                    ? textos["no"]
                    : ""
                }
                onChange={(e) => {
                  onFormChange({
                    apariencia: {
                      ...state.apariencia,
                      disposicion_afeitar_o_crecer_vello_facial:
                        e.target.value.includes(
                          textos["si"] ? textos["si"] : "Texto No Definido"
                        ),
                    },
                  });
                }}
                label=""
              />
            </Grid>
          </Grid>
          <Grid container item xs={12} alignItems={"center"}>
            <Grid item xs={7}>
              <div style={{ height: 37.42, width: 10 }}></div>
            </Grid>
            <Grid item xs={5}>
              <div style={{ height: 37.42, width: 10 }}></div>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid
        my={4}
        item
        xs={12}
        style={{ paddingTop: "0px", marginTop: "15px", marginBottom: "15px" }}
      >
        <Divider />
      </Grid>

      <Grid item xs={12}>
        <MContainer direction="vertical" styles={{ gap: 10 }}>
          <Typography fontSize={"1.2rem"} fontWeight={600} component={"p"}>
            {textos["tatuajes"] ? textos["tatuajes"] : "Texto No Definido"}
          </Typography>
          <Typography>
            {textos["filtros_apariencias_tatuajes_subtitulo"]
              ? textos["filtros_apariencias_tatuajes_subtitulo"]
              : "Texto No Definido"}
          </Typography>
          <MRadioGroup
            id="tiene-tatuajes-distintivos"
            options={[
              textos["si"] ? textos["si"] : "",
              textos["no"] ? textos["no"] : "",
            ]}
            labelStyle={{
              marginLeft: 112,
              fontWeight: 800,
              fontSize: "0.72rem",
              color: "#069cb1",
            }}
            value={
              state.has_tatoos
                ? textos["si"]
                  ? textos["si"]
                  : ""
                : textos["no"]
                ? textos["no"]
                : ""
            }
            onChange={(e) => {
              onFormChange({
                has_tatoos: e.currentTarget.value.includes(
                  textos["si"] ? textos["si"] : "Texto No Definido"
                ),
                tatuajes: e.currentTarget.value.includes(
                  textos["si"] ? textos["si"] : "Texto No Definido"
                )
                  ? state.tatuajes
                  : [],
                id_tipo_tatuaje: e.currentTarget.value.includes(
                  textos["si"] ? textos["si"] : "Texto No Definido"
                )
                  ? state.id_tipo_tatuaje
                  : 0,
                descripcion_tatoo: e.currentTarget.value.includes(
                  textos["si"] ? textos["si"] : "Texto No Definido"
                )
                  ? state.descripcion_tatoo
                  : "",
              });
            }}
            label=""
          />
          <MotionDiv show={state.has_tatoos} animation="fade">
            <>
              <MContainer
                direction="horizontal"
                styles={{ marginBottom: 16, alignItems: "center", gap: 20 }}
              >
                <Typography minWidth={150}>
                  {textos["visibilidad"]
                    ? textos["visibilidad"]
                    : "Texto No Definido"}
                </Typography>
                <MSelect
                  id="filtos_apariencias_subtitutlo-tatuaje"
                  className={"form-input-small"}
                  options={
                    tipos_tatuajes.data
                      ? tipos_tatuajes.data.map((t) => {
                          return {
                            value: t.id.toString(),
                            label: es_ingles ? t.en : t.es,
                          };
                        })
                      : []
                  }
                  style={{ minWidth: 200 }}
                  onChange={(e) => {
                    onFormChange({ id_tipo_tatuaje: parseInt(e.target.value) });
                  }}
                  value={state.id_tipo_tatuaje.toString()}
                />
              </MContainer>

              <MContainer
                direction="horizontal"
                styles={{ alignItems: "center", gap: 20 }}
              >
                <Typography width={150}>
                  {textos["descripcion"]
                    ? textos["descripcion"]
                    : "Texto No Definido"}
                </Typography>
                <FormGroup
                  rootStyle={{ margin: 0 }}
                  className={"form-input-md form-input-small"}
                  labelClassName={"form-input-label"}
                  value={state.descripcion_tatoo}
                  onChange={(e) => {
                    onFormChange({ descripcion_tatoo: e.currentTarget.value });
                  }}
                />
              </MContainer>
              <AddButton
                aStyles={{ marginBottom: 16 }}
                text={
                  textos["agregar"] ? textos["agregar"] : "Texto No Definido"
                }
                onClick={() => {
                  if (
                    state.id_tipo_tatuaje > 0 &&
                    state.descripcion_tatoo.length > 0
                  ) {
                    onFormChange({
                      tatuajes: state.tatuajes.concat([
                        {
                          id_tipo_tatuaje: state.id_tipo_tatuaje,
                          descripcion: state.descripcion_tatoo,
                        },
                      ]),
                    });
                  } else {
                    notify(
                      "warning",
                      textos["filtros_apariencias_empty_fields_tattoos"]
                        ? textos["filtros_apariencias_empty_fields_tattoos"]
                        : "Texto No Definido"
                    );
                  }
                }}
              />
              <MContainer direction="horizontal" styles={{ gap: 10 }}>
                {state.tatuajes.map((t, i) => {
                  let tipo_tatoo = "";
                  const filtered_tatoo_type = tipos_tatuajes.data?.filter(
                    (tatoo) => tatoo.id === t.id_tipo_tatuaje
                  )[0];
                  if (filtered_tatoo_type) {
                    tipo_tatoo = es_ingles
                      ? filtered_tatoo_type.en
                      : filtered_tatoo_type.es;
                  }
                  return (
                    <Tag
                      key={i}
                      text={`${tipo_tatoo} - ${t.descripcion}`}
                      onRemove={(e) => {
                        onFormChange({
                          tatuajes: state.tatuajes.filter((_, j) => i !== j),
                        });
                      }}
                    />
                  );
                })}
              </MContainer>
            </>
          </MotionDiv>
        </MContainer>
      </Grid>

      <Grid
        my={4}
        item
        xs={12}
        style={{ paddingTop: "0px", marginTop: "15px", marginBottom: "15px" }}
      >
        <Divider />
      </Grid>

      <Grid item xs={12}>
        <MContainer direction="vertical" styles={{ gap: 20 }}>
          <Typography fontSize={"1.2rem"} fontWeight={600} component={"p"}>
            Piercings
          </Typography>
          <Typography>
            {textos["filtros_apariencias_piercings_subtitulo"]
              ? textos["filtros_apariencias_piercings_subtitulo"]
              : "Texto No Definido"}
          </Typography>
          <MRadioGroup
            id="tiene-piercing"
            options={[
              textos["si"] ? textos["si"] : "",
              textos["no"] ? textos["no"] : "",
            ]}
            labelStyle={{
              marginLeft: 112,
              fontWeight: 800,
              fontSize: "0.72rem",
              color: "#069cb1",
            }}
            value={
              state.has_piercings
                ? textos["si"]
                  ? textos["si"]
                  : ""
                : textos["no"]
                ? textos["no"]
                : ""
            }
            onChange={(e) => {
              onFormChange({
                has_piercings: e.currentTarget.value.includes(
                  textos["si"] ? textos["si"] : "Texto No Definido"
                ),
                piercings: e.currentTarget.value.includes(
                  textos["si"] ? textos["si"] : "Texto No Definido"
                )
                  ? state.piercings
                  : [],
                id_tipo_piercing: e.currentTarget.value.includes(
                  textos["si"] ? textos["si"] : "Texto No Definido"
                )
                  ? state.id_tipo_piercing
                  : 0,
                descripcion_piercing: e.currentTarget.value.includes(
                  textos["si"] ? textos["si"] : "Texto No Definido"
                )
                  ? state.descripcion_piercing
                  : "",
              });
            }}
            label=""
          />
          <MotionDiv show={state.has_piercings} animation="fade">
            <>
              <MContainer
                direction="horizontal"
                styles={{ gap: 40, alignItems: "center" }}
              >
                <Typography minWidth={150}>
                  {textos["filtros_apariencias_piercings_lugar"]
                    ? textos["filtros_apariencias_piercings_lugar"]
                    : "Texto No Definido"}
                </Typography>
                <MSelect
                  id="tipo-piercing"
                  className={"form-input-small"}
                  options={
                    tipos_piercings.data
                      ? tipos_piercings.data.map((t) => {
                          return {
                            value: t.id.toString(),
                            label: es_ingles ? t.en : t.es,
                          };
                        })
                      : []
                  }
                  style={{ width: 200 }}
                  onChange={(e) => {
                    onFormChange({
                      id_tipo_piercing: parseInt(e.target.value),
                    });
                  }}
                  value={state.id_tipo_piercing.toString()}
                />
              </MContainer>

              <MContainer
                direction="horizontal"
                styles={{
                  marginTop: 16,
                  marginBottom: 16,
                  gap: 40,
                  alignItems: "center",
                }}
              >
                <Typography minWidth={150}>
                  {textos["descripcion"]
                    ? textos["descripcion"]
                    : "Texto No Definido"}
                </Typography>
                <FormGroup
                  className={"form-input-md form-input-small"}
                  labelClassName={"form-input-label"}
                  value={state.descripcion_piercing}
                  rootStyle={{ margin: 0 }}
                  onChange={(e) => {
                    onFormChange({
                      descripcion_piercing: e.currentTarget.value,
                    });
                  }}
                />
              </MContainer>

              <AddButton
                text={
                  textos["agregar"] ? textos["agregar"] : "Texto No Definido"
                }
                onClick={() => {
                  if (
                    state.id_tipo_piercing > 0 &&
                    state.descripcion_piercing.length > 0
                  ) {
                    onFormChange({
                      piercings: state.piercings.concat([
                        {
                          id_tipo_piercing: state.id_tipo_piercing,
                          descripcion: state.descripcion_piercing,
                        },
                      ]),
                    });
                  } else {
                    notify(
                      "warning",
                      textos["filtros_apariencias_empty_fields_piercings"]
                        ? textos["filtros_apariencias_empty_fields_piercings"]
                        : "Texto No Definido"
                    );
                  }
                }}
              />
              <MContainer
                styles={{ marginTop: 16, marginBottom: 16, gap: 10 }}
                direction="horizontal"
              >
                {state.piercings.map((_p, i) => {
                  let tipo_piercing = "";
                  const filtered_piercing_type = tipos_piercings.data?.filter(
                    (p) => p.id === _p.id_tipo_piercing
                  )[0];
                  if (filtered_piercing_type) {
                    tipo_piercing = es_ingles
                      ? filtered_piercing_type.en
                      : filtered_piercing_type.es;
                  }
                  return (
                    <Tag
                      key={i}
                      text={`${tipo_piercing} - ${_p.descripcion}`}
                      onRemove={(_) => {
                        onFormChange({
                          piercings: state.piercings.filter((_, j) => i !== j),
                        });
                      }}
                    />
                  );
                })}
              </MContainer>
            </>
          </MotionDiv>
        </MContainer>
      </Grid>

      <Grid
        my={4}
        item
        xs={12}
        style={{ paddingTop: "0px", marginTop: "15px", marginBottom: "15px" }}
      >
        <Divider />
      </Grid>

      <Grid item xs={12}>
        <MContainer direction="vertical" styles={{ gap: 20 }}>
          <Typography fontSize={"1.2rem"} fontWeight={600} component={"p"}>
            {textos["gemelo_o_trillizo"]
              ? textos["gemelo_o_trillizo"]
              : "Texto No Definido"}
          </Typography>
          <MContainer
            direction="horizontal"
            styles={{ alignItems: "center", gap: 40 }}
          >
            <Typography>
              ¿
              {textos["filtros_apariencias_eres_gemelo_o_trillizo"]
                ? textos["filtros_apariencias_eres_gemelo_o_trillizo"]
                : "Texto No Definido"}
              ?
            </Typography>
            <MRadioGroup
              id="eres-gemelo-trillizo"
              options={[
                textos["si"] ? textos["si"] : "",
                textos["no"] ? textos["no"] : "",
              ]}
              labelStyle={{
                marginLeft: 112,
                fontWeight: 800,
                fontSize: "0.72rem",
                color: "#069cb1",
              }}
              value={
                state.has_hermanos
                  ? textos["si"]
                    ? textos["si"]
                    : ""
                  : textos["no"]
                  ? textos["no"]
                  : ""
              }
              onChange={(e) => {
                onFormChange({
                  has_hermanos: e.currentTarget.value.includes(
                    textos["si"] ? textos["si"] : "Texto No Definido"
                  ),
                });
              }}
              label=""
            />
          </MContainer>
          <MotionDiv show={state.has_hermanos} animation="fade">
            <>
              <MContainer
                direction="horizontal"
                styles={{ alignItems: "center" }}
              >
                <MRadioGroup
                  style={{}}
                  id="tienes-hermanos"
                  options={
                    tipos_hermanos.data
                      ? tipos_hermanos.data.map((h) => {
                          return es_ingles ? h.en : h.es;
                        })
                      : []
                  }
                  value={state.tipo_hermano_selected}
                  onChange={(e) => {
                    const _tipo_hermanos = tipos_hermanos.data?.filter((h) => {
                      return e.target.value === h.es || e.target.value === h.en;
                    })[0];
                    if (_tipo_hermanos) {
                      onFormChange({
                        hermanos: {
                          ...state.hermanos,
                          id_tipo_hermanos: _tipo_hermanos.id,
                          descripcion:
                            _tipo_hermanos.id === 99
                              ? ""
                              : state.hermanos
                              ? state.hermanos.descripcion
                              : "",
                        },
                        tipo_hermano_selected: e.target.value,
                      });
                    }
                  }}
                />
                <MotionDiv
                  show={state.hermanos?.id_tipo_hermanos === 99}
                  animation={"fade"}
                >
                  <FormGroup
                    label=""
                    className={"form-input-md form-input-small"}
                    labelClassName={"form-input-label"}
                    value={state.hermanos?.descripcion}
                    onChange={(e) => {
                      onFormChange({
                        hermanos: {
                          ...state.hermanos,
                          descripcion: e.currentTarget.value,
                        },
                      });
                    }}
                  />
                </MotionDiv>
              </MContainer>
            </>
          </MotionDiv>
        </MContainer>
      </Grid>

      <Grid
        my={4}
        item
        xs={12}
        style={{ paddingTop: "0px", marginTop: "15px", marginBottom: "15px" }}
      >
        <Divider />
      </Grid>

      <Grid item xs={12}>
        <MContainer direction="vertical" styles={{ gap: 20 }}>
          <Typography fontSize={"1.2rem"} fontWeight={600} component={"p"}>
            {textos["particularidades"]
              ? textos["particularidades"]
              : "Texto No Definido"}
          </Typography>
          <Typography>
            {textos["filtros_apariencias_particularidades_subtitle"]
              ? textos["filtros_apariencias_particularidades_subtitle"]
              : "Texto No Definido"}
          </Typography>
          <MContainer direction="vertical">
            <MCheckboxGroup
              direction="horizontal"
              onChange={(e, i) => {
                const particularidad = tipos_particularidades.data?.filter(
                  (_, index) => index === i
                )[0];
                if (particularidad) {
                  onFormChange({
                    particularidades: state.particularidades
                      .map((e) => e.id_particularidad)
                      .includes(particularidad.id)
                      ? state.particularidades.filter(
                          (e) => e.id_particularidad !== particularidad.id
                        )
                      : state.particularidades.concat([
                          {
                            id_particularidad: particularidad.id,
                            descripcion:
                              particularidad.id === 99
                                ? `${
                                    state.descripcion_otra_particularidad
                                      ? state.descripcion_otra_particularidad
                                      : ""
                                  }`
                                : "",
                          },
                        ]),
                  });
                }
              }}
              values={
                tipos_particularidades.data
                  ? tipos_particularidades.data.map((g) => {
                      return state.particularidades
                        .map((e) => e.id_particularidad)
                        .includes(g.id);
                    })
                  : [false]
              }
              id="particularidades-checkboxgroup"
              labelStyle={{ margin: 0, width: "32%" }}
              options={
                tipos_particularidades.data
                  ? tipos_particularidades.data.map((tp) =>
                      es_ingles ? tp.en : tp.es
                    )
                  : []
              }
            />
            <MotionDiv
              show={state.particularidades.some(
                (e) => e.id_particularidad === 99
              )}
              animation={"fade"}
            >
              <FormGroup
                label={
                  textos["filtros_apariencias_particularidades_otro_tipo"]
                    ? textos["filtros_apariencias_particularidades_otro_tipo"]
                    : "Texto No Definido"
                }
                className={"form-input-md form-input-small"}
                labelClassName={"form-input-label"}
                value={state.descripcion_otra_particularidad}
                rootStyle={{ margin: 0 }}
                onChange={(e) => {
                  onFormChange({
                    descripcion_otra_particularidad: e.currentTarget.value,
                    particularidades: state.particularidades.map((p) => {
                      if (p.id_particularidad === 99) {
                        p.descripcion = e.target.value;
                      }
                      return p;
                    }),
                  });
                }}
              />
            </MotionDiv>
          </MContainer>
        </MContainer>
      </Grid>
    </Grid>
  );
};
