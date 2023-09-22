import { type FC, useReducer, useContext, useMemo, CSSProperties } from "react";
import Image from "next/image";
import { Box, Button, Grid, Typography } from "@mui/material";
import { MContainer } from "~/components/layout/MContainer";
import {
  FormGroup,
  MCheckboxGroup,
  MRadioGroup,
  MSelect,
  SectionTitle,
} from "~/components/shared";
import { api } from "~/utils/api";
import { MTooltip } from "~/components/shared/MTooltip";
import { type FiltrosDemograficosRolForm } from "~/pages/cazatalentos/roles/agregar-rol";
import AppContext from "~/context/app";
import useLang from "~/hooks/useLang";

interface Props {
  fetching: boolean;
  state: FiltrosDemograficosRolForm;
  onFormChange: (input: { [id: string]: unknown }) => void;
}

const estilosBold: CSSProperties = { fontWeight: 700, fontSize: "1rem" };
const estilosNormal: CSSProperties = { fontWeight: 600, fontSize: "1rem" };

export const FiltrosDemograficosRol: FC<Props> = ({ state, onFormChange }) => {
  const ctx = useContext(AppContext);
  const textos = useLang(ctx.lang);

  const generos = api.catalogos.getGeneros.useQuery(undefined, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const mascotas = api.catalogos.getTipoMascotas.useQuery(undefined, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const apariencias = api.catalogos.getAparienciasEtnicas.useQuery(undefined, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const nacionalidades = api.catalogos.getNacionalidades.useQuery(undefined, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const tamanio_animal = useMemo(() => {
    if (state.animal) {
      switch (state.animal.tamanio) {
        case "Small":
          return ctx.lang === "en" ? state.animal.tamanio : "Chico";
        case "Medium":
          return ctx.lang === "en" ? state.animal.tamanio : "Mediano";
        case "Large":
          return ctx.lang === "en" ? state.animal.tamanio : "Grande";
        case "Chico":
          return ctx.lang === "es" ? state.animal.tamanio : "Small";
        case "Mediano":
          return ctx.lang === "es" ? state.animal.tamanio : "Medium";
        case "Grande":
          return ctx.lang === "es" ? state.animal.tamanio : "Large";
      }
      return `${textos["chico"]}`;
    }
    return "";
  }, [state.animal?.tamanio, ctx.lang]);

  return (
    <Grid container item xs={12} mt={8}>
      <Grid item xs={12}>
        <SectionTitle
          title={`${textos["paso"]} 3`}
          titleSx={{
            fontSize: "1.2rem",
          }}
          subtitle={`${textos["filtros_demograficos"]}`}
          subtitleSx={{
            ml: 4,
            color: "#069cb1",
            fontWeight: 600,
            fontSize: "1.2rem",
          }}
          dividerSx={{ backgroundColor: "#9B9B9B" }}
        />
      </Grid>

      <Grid item xs={12} mt={4}>
        <Grid container item xs={12}>
          <Grid item container xs={6}>
            <Grid item xs={12}>
              <Typography fontWeight={600}>
                {`${textos["rango_edad"]}`} (
                {state.rango_edad_en_meses
                  ? `${textos["mes"]}${ctx.lang === "es" ? "es" : "s"}`
                  : `${textos["anio"]}s`}
                )*
              </Typography>
              <MContainer
                direction="horizontal"
                styles={{ alignItems: "center", gap: 30, marginTop: 5 }}
              >
                <FormGroup
                  type="number"
                  className={"form-input-md"}
                  labelStyle={estilosBold}
                  labelClassName={"form-input-label"}
                  rootStyle={{ margin: 0 }}
                  style={{ width: 60 }}
                  value={`${state.rango_edad_inicio}`}
                  onChange={(e) => {
                    onFormChange({
                      rango_edad_inicio: parseInt(e.target.value || "0"),
                    });
                  }}
                  label=""
                />
                <Typography>a</Typography>
                <FormGroup
                  type="number"
                  className={"form-input-md"}
                  labelStyle={estilosBold}
                  labelClassName={"form-input-label"}
                  rootStyle={{ margin: 0 }}
                  style={{ width: 60 }}
                  value={`${state.rango_edad_fin}`}
                  onChange={(e) => {
                    onFormChange({
                      rango_edad_fin: parseInt(e.target.value || "0"),
                    });
                  }}
                  label=""
                />
              </MContainer>
              <Button
                sx={{ textTransform: "none" }}
                onClick={() => {
                  onFormChange({
                    rango_edad_en_meses: !state.rango_edad_en_meses,
                  });
                }}
              >
                <Image
                  src="/assets/img/iconos/change_blue_icon.svg"
                  width={25}
                  height={25}
                  style={{ marginRight: 3 }}
                  alt="icon-change"
                />
                <Typography>
                  {`${textos["cambiar_a"]}`}{" "}
                  {state.rango_edad_en_meses
                    ? `${textos["anio"]}s`
                    : `${textos["mes"]}${ctx.lang === "es" ? "es" : "s"}`}
                </Typography>
              </Button>
            </Grid>
            <Grid item xs={12}>
              <MRadioGroup
                label={`${textos["genero_rol"]}*`}
                labelStyle={{
                  ...estilosBold,
                  color: "#000",
                  margin: "0px !important",
                }}
                style={{ gap: 0 }}
                styleRoot={{ marginTop: 5 }}
                id="genero-del-rol"
                options={[
                  `${textos["no_especificado"]}`,
                  `${textos["genero_especificado"]}`,
                ]}
                value={state.genero_del_rol}
                direction="vertical"
                onChange={(e) => {
                  onFormChange({
                    genero_del_rol: e.target.value,
                  });
                }}
              />
              <Box sx={{ padding: "0px 40px" }}>
                <MCheckboxGroup
                  disabled={
                    state.genero_del_rol === `${textos["no_especificado"]}`
                  }
                  onAllOptionChecked={(checked) => {
                    onFormChange({
                      generos:
                        checked && generos.data
                          ? generos.data.map((g) => g.id)
                          : [],
                    });
                  }}
                  direction="vertical"
                  title={`${textos["genero_interesado_en_interpretar"]}`}
                  onChange={(e, i) => {
                    const genero = generos.data?.filter(
                      (_, index) => index === i
                    )[0];
                    if (genero) {
                      onFormChange({
                        generos: state.generos.includes(genero.id)
                          ? state.generos.filter((e) => e !== genero.id)
                          : state.generos.concat([genero.id]),
                      });
                    }
                  }}
                  id="genero-interesado-interpretar"
                  labelStyle={{
                    marginBottom: 0,
                    width: "100%",
                    ...estilosBold,
                  }}
                  options={
                    generos.data
                      ? generos.data.map((g) =>
                          ctx.lang === "es" ? g.es : g.en
                        )
                      : []
                  }
                  values={
                    generos.data
                      ? generos.data.map((g) => {
                          return state.generos.includes(g.id);
                        })
                      : [false]
                  }
                />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <MRadioGroup
                label={`${textos["apariencia_etnica_del_rol"]}*`}
                labelStyle={{
                  fontSize: "1.1rem",
                  color: "#000",
                  fontWeight: 600,
                }}
                style={{ gap: 0 }}
                styleRoot={{ marginTop: 5 }}
                id="apariencia-etnica-del-rol"
                options={[
                  `${textos["no_especificado"]}`,
                  `${textos["especificado"]}`,
                ]}
                value={state.apariencia_etnica_del_rol}
                direction="vertical"
                onChange={(e) => {
                  onFormChange({
                    apariencia_etnica_del_rol: e.target.value,
                  });
                }}
              />
              <Box sx={{ padding: "0px 0px 0px 40px" }}>
                <MCheckboxGroup
                  disabled={
                    state.apariencia_etnica_del_rol ===
                    `${textos["no_especificado"]}`
                  }
                  onAllOptionChecked={(checked) => {
                    onFormChange({
                      apariencias_etnias:
                        checked && apariencias.data
                          ? apariencias.data.map((g) => g.id)
                          : [],
                    });
                  }}
                  direction="horizontal"
                  title=""
                  onChange={(e, i) => {
                    const apariencia = apariencias.data?.filter(
                      (_, index) => index === i
                    )[0];
                    if (apariencia) {
                      onFormChange({
                        apariencias_etnias: state.apariencias_etnias.includes(
                          apariencia.id
                        )
                          ? state.apariencias_etnias.filter(
                              (e) => e !== apariencia.id
                            )
                          : state.apariencias_etnias.concat([apariencia.id]),
                      });
                    }
                  }}
                  id="tipos-apariencias-rol"
                  labelStyle={{ marginBottom: 0, width: "45%", ...estilosBold }}
                  options={
                    apariencias.data
                      ? apariencias.data.map((g) =>
                          ctx.lang === "es" ? g.es : g.en
                        )
                      : []
                  }
                  values={
                    apariencias.data
                      ? apariencias.data.map((g) => {
                          return state.apariencias_etnias.includes(g.id);
                        })
                      : [false]
                  }
                />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <MSelect
                id="tipo-nacionalidades-select"
                loading={nacionalidades.isFetching}
                labelStyle={{ marginTop: 32, ...estilosBold }}
                labelClassName={"form-input-label"}
                label={`${textos["nacionalidad_etnia"]}*`}
                options={
                  nacionalidades.data
                    ? nacionalidades.data.map((s) => {
                        return {
                          value: s.id.toString(),
                          label: ctx.lang === "es" ? s.es : s.en,
                        };
                      })
                    : []
                }
                value={state.id_pais.toString()}
                className={"form-input-md"}
                onChange={(e) => {
                  onFormChange({
                    id_pais: parseInt(e.target.value),
                  });
                }}
              />
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <Grid xs={12}>
              <MCheckboxGroup
                direction="horizontal"
                title=""
                onChange={(e, i) => {
                  onFormChange({
                    es_mascota: e,
                  });
                  console.log("change");
                }}
                id="mascota-o-animal-checkbox"
                labelStyle={{ marginBottom: 0, fontWeight: 600 }}
                options={[`¿${textos["mascota_o_animal"]}?`]}
                values={
                  /* (apariencias.data) ? apariencias.data.map(g => {
                                    return state.apariencias_interesado_en_interpretar.includes(g.id);
                                }) : */ [state.es_mascota]
                }
              />
              <MSelect
                disabled={!state.es_mascota}
                id="tipo-mascotas-select"
                loading={mascotas.isFetching}
                options={
                  mascotas.data
                    ? mascotas.data.map((s) => {
                        return {
                          value: s.id.toString(),
                          label: ctx.lang === "es" ? s.es : s.en,
                        };
                      })
                    : []
                }
                value={state.animal ? state.animal.id.toString() : "0"}
                className={"form-input-md"}
                onChange={(e) => {
                  onFormChange({
                    animal: { ...state.animal, id: parseInt(e.target.value) },
                  });
                }}
                labelStyle={estilosBold}
              />
            </Grid>
            <Grid xs={12}>
              <FormGroup
                disabled={
                  !state.es_mascota || (state.animal && state.animal.id <= 0)
                }
                className={"form-input-md"}
                labelStyle={estilosBold}
                labelClassName={"form-input-label"}
                rootStyle={{ marginTop: 30 }}
                value={state.animal ? state.animal.descripcion : ""}
                onChange={(e) => {
                  onFormChange({
                    animal: { ...state.animal, descripcion: e.target.value },
                  });
                }}
                label={`${textos["descripcion"]}`}
                tooltip={
                  <MTooltip
                    color="blue"
                    placement="right"
                    text="¡Sé especifico en cuanto a Especie o Raza o describe la puesta en escena!"
                  />
                }
              />
              <MRadioGroup
                disabled={
                  !state.es_mascota || (state.animal && state.animal.id <= 0)
                }
                label={`${textos["tamanio"]}`}
                labelStyle={{
                  fontSize: "1.1rem",
                  color: "#000",
                  fontWeight: 600,
                }}
                style={{ gap: 0 }}
                styleRoot={{ marginTop: 5, ...estilosBold }}
                id="tamano-mascota-rol"
                options={[
                  `${textos["chico"]}`,
                  `${textos["mediano"]}`,
                  `${textos["grande"]}`,
                ]}
                value={tamanio_animal}
                direction="vertical"
                onChange={(e) => {
                  let tamanio = e.target.value;
                  switch (e.target.value) {
                    case "Small":
                      tamanio = "Chico";
                      break;
                    case "Medium":
                      tamanio = "Mediano";
                      break;
                    case "Large":
                      tamanio = "Grande";
                      break;
                  }
                  onFormChange({
                    animal: { ...state.animal, tamanio: tamanio },
                  });
                }}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
