import { Grid } from "@mui/material";
import { type FC } from "react";
import { FormGroup, SectionTitle } from "~/components";
import { type ProyectoForm } from "~/pages/cazatalentos/proyecto";
import useLang from "~/hooks/useLang";
import AppContext from "~/context/app";
import { useContext } from "react";

interface Props {
  state: ProyectoForm;
  onFormChange: (input: { [id: string]: unknown }) => void;
}

export const EquipoCreativo: FC<Props> = ({ state, onFormChange }) => {
  const ctx = useContext(AppContext);
  const textos = useLang(ctx.lang);
  const paso = textos["paso"] + " 3";
  return (
    <Grid mb={5} container>
      <Grid item xs={12}>
        <SectionTitle
          title={paso}
          titleSx={{
            fontSize: "1.2rem",
          }}
          subtitle={textos["equipo_creativo"]}
          subtitleSx={{
            ml: 4,
            color: "#069cb1",
            fontWeight: 600,
            fontSize: "1.2rem",
          }}
        />
      </Grid>
      <Grid item xs={12} md={4} mt={8}>
        <FormGroup
          className={"form-input-md"}
          labelStyle={{ fontWeight: 600 }}
          labelClassName={"form-input-label"}
          value={state.productor}
          onChange={(e) => {
            onFormChange({
              productor: e.target.value,
            });
          }}
          label={textos["productor"]}
        />
      </Grid>
      <Grid item xs={8} mt={8}>
        <FormGroup
          className={"form-input-md"}
          labelStyle={{ fontWeight: 600 }}
          labelClassName={"form-input-label"}
          value={state.casa_productora}
          onChange={(e) => {
            onFormChange({
              casa_productora: e.target.value,
            });
          }}
          label={textos["casa_productora"]}
        />
      </Grid>
      <Grid item xs={12} md={4} mt={8}>
        <FormGroup
          className={"form-input-md"}
          labelStyle={{ fontWeight: 600 }}
          labelClassName={"form-input-label"}
          value={state.director}
          onChange={(e) => {
            onFormChange({
              director: e.target.value,
            });
          }}
          label={textos["director"]}
        />
      </Grid>
      <Grid item xs={12} md={4} mt={8}>
        <FormGroup
          className={"form-input-md"}
          labelStyle={{ fontWeight: 600 }}
          labelClassName={"form-input-label"}
          value={state.agencia_publicidad}
          onChange={(e) => {
            onFormChange({
              agencia_publicidad: e.target.value,
            });
          }}
          label={textos["agencia_publicidad"]}
        />
      </Grid>
    </Grid>
  );
};
