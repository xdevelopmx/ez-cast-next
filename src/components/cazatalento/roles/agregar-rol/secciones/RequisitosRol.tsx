import { Grid } from "@mui/material";
import { CSSProperties, FC, useContext, useReducer } from "react";
import {
  FormGroup,
  MCheckboxGroup,
  MSelect,
  SectionTitle,
} from "~/components/shared";
import AppContext from "~/context/app";
import useLang from "~/hooks/useLang";
import { RequisitosRolForm } from "~/pages/cazatalentos/roles/agregar-rol";
import { api } from "~/utils/api";

interface Props {
  fetching: boolean;
  state: RequisitosRolForm;
  onFormChange: (input: { [id: string]: unknown }) => void;
}

const estilosBold: CSSProperties = { fontWeight: 700, fontSize: "1rem" };
const estilosNormal: CSSProperties = { fontWeight: 600, fontSize: "1rem" };

export const RequisitosRol: FC<Props> = ({ state, onFormChange }) => {
  const ctx = useContext(AppContext);
  const textos = useLang(ctx.lang);

  const usos_horarios = api.catalogos.getUsosDeHorario.useQuery(undefined, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const estados_republica = api.catalogos.getEstadosRepublica.useQuery(
    undefined,
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  );

  const idiomas = api.catalogos.getIdiomas.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const medios_multimedia_a_incluir = api.catalogos.getTiposMultimedia.useQuery(
    undefined,
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  );

  return (
    <Grid container item xs={12} mt={8}>
      <Grid item xs={12}>
        <SectionTitle
          title={`${textos["paso"]} 7`}
          titleSx={{
            fontSize: "1.2rem",
          }}
          subtitle={`${textos["requisitos"]}`}
          subtitleSx={{
            ml: 4,
            color: "#069cb1",
            fontWeight: 600,
            fontSize: "1.2rem",
          }}
          dividerSx={{ backgroundColor: "#9B9B9B" }}
        />
      </Grid>
      <Grid item container xs={6} mt={4}>
        <Grid item xs={12}>
          <FormGroup
            type={"date"}
            className={"form-input-md"}
            labelStyle={estilosBold}
            labelClassName={"form-input-label"}
            value={state.fecha_presentacion}
            onChange={(e) => {
              onFormChange({
                fecha_presentacion: e.target.value,
              });
            }}
            label={`${textos["presentacion_solicitud"]}*`}
          />
        </Grid>
        <Grid item xs={12}>
          <MSelect
            id="sindicato-select"
            loading={usos_horarios.isFetching}
            options={
              usos_horarios.data
                ? usos_horarios.data.map((s) => {
                    return {
                      value: s.id.toString(),
                      label: ctx.lang === "es" ? s.es : s.en,
                    };
                  })
                : []
            }
            className={"form-input-md"}
            value={state.id_uso_horario.toString()}
            onChange={(e) => {
              onFormChange({
                id_uso_horario: parseInt(e.target.value),
              });
            }}
            label={`${textos["timezone"]}*`}
            labelStyle={estilosBold}
          />
        </Grid>
        <Grid item xs={12}>
          <FormGroup
            type={"text-area"}
            className={"form-input-md"}
            style={{ width: "80%" }}
            labelStyle={{ ...estilosBold, width: "100%", marginTop: 10 }}
            labelClassName={"form-input-label"}
            value={state.info_trabajo}
            onChange={(e) => {
              onFormChange({
                info_trabajo: e.target.value,
              });
            }}
            label={`${textos["informacion_trabajo_y_notas"]}*`}
          />
        </Grid>
        <Grid item xs={12}>
          <MSelect
            id="idiomas-select"
            loading={idiomas.isFetching}
            options={
              idiomas.data
                ? idiomas.data.map((s) => {
                    return {
                      value: s.id.toString(),
                      label: ctx.lang === "es" ? s.es : s.en,
                    };
                  })
                : []
            }
            className={"form-input-md"}
            value={state.id_idioma.toString()}
            onChange={(e) => {
              onFormChange({
                id_idioma: parseInt(e.target.value),
              });
            }}
            label={`${textos["agregar"]} ${textos["idioma"]}*`}
            labelStyle={estilosBold}
          />
        </Grid>
      </Grid>

      <Grid item xs={6} mt={4}>
        <Grid item xs={6}>
          <MCheckboxGroup
            title={`${textos["talento_debe_incluir"]}*:`}
            onChange={(e, i) => {
              const medio = medios_multimedia_a_incluir.data?.filter(
                (_, index) => index === i
              )[0];
              if (medio) {
                onFormChange({
                  medios_multimedia_a_incluir:
                    state.medios_multimedia_a_incluir.includes(medio.id)
                      ? state.medios_multimedia_a_incluir.filter(
                          (h) => h !== medio.id
                        )
                      : state.medios_multimedia_a_incluir.concat([medio.id]),
                });
              }
            }}
            direction="vertical"
            id="talento-debera-incluir-rol"
            options={
              medios_multimedia_a_incluir.data
                ? medios_multimedia_a_incluir.data.map((m) =>
                    ctx.lang === "es" ? m.es : m.en
                  )
                : []
            }
            label="¿Qué compensación no monetaria recibirá el talento?"
            labelStyle={{ fontWeight: "400", fontSize: "1.1rem" }}
            values={
              medios_multimedia_a_incluir.data
                ? medios_multimedia_a_incluir.data.map((m) => {
                    return state.medios_multimedia_a_incluir.includes(m.id);
                  })
                : [false]
            } //[(state) ? state.mostrar_anio_en_perfil : false]}
          />
        </Grid>
        <Grid item xs={6}>
          <MSelect
            id="sindicato-select"
            options={
              estados_republica.data
                ? estados_republica.data.map((e) => {
                    return { value: e.id.toString(), label: e.es };
                  })
                : []
            }
            style={{ width: 200 }}
            value={state.id_estado_donde_aceptan_solicitudes.toString()}
            onChange={(e) => {
              onFormChange({
                id_estado_donde_aceptan_solicitudes: parseInt(e.target.value),
              });
            }}
            label={`${textos["aceptando_aplicaciones_de"]} *`}
            labelStyle={estilosBold}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};
