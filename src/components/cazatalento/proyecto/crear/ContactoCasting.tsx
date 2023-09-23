import { Grid, Typography } from "@mui/material";
import { type CSSProperties, type FC } from "react";
import { FormGroup, SectionTitle } from "~/components";
import { MTooltip } from "~/components/shared/MTooltip";
import { type ProyectoForm } from "~/pages/cazatalentos/proyecto";
import useLang from "~/hooks/useLang";
import AppContext from "~/context/app";
import { useContext } from "react";

const estilosBold: CSSProperties = { fontWeight: 700, fontSize: "1rem" };
const estilosNormal: CSSProperties = { fontWeight: 600, fontSize: "1rem" };

interface Props {
  state: ProyectoForm;
  onFormChange: (input: { [id: string]: unknown }) => void;
}

export const ContactoCasting: FC<Props> = ({ state, onFormChange }) => {
  const ctx = useContext(AppContext);
  const textos = useLang(ctx.lang);
  let paso = textos["paso"] + " 2";
  return (
    <Grid mb={5} container>
      <Grid item xs={12}>
        <SectionTitle
          title={paso}
          titleSx={{
            fontSize: "1.2rem",
          }}
          subtitle={textos["contacto_casting"]}
          subtitleSx={{
            ml: 4,
            color: "#069cb1",
            fontWeight: 600,
            fontSize: "1.2rem",
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <div className="info_bg_a">
          <Typography>{textos["privacidad"]}</Typography>
        </div>
      </Grid>
      <Grid item xs={12} md={4} mt={4}>
        <FormGroup
          error={
            state.errors.director && state.director_casting != null
              ? state.errors.director
              : undefined
          }
          show_error_message
          className={"form-input-md"}
          labelClassName={"form-input-label"}
          value={state.director_casting ? state.director_casting : ""}
          onChange={(e) => {
            onFormChange({
              director_casting: e.target.value,
            });
          }}
          label={textos["director_de_casting"]}
          labelStyle={estilosBold}
        />
      </Grid>
      <Grid item xs={8} mt={4}>
        <FormGroup
          error={
            state.errors.telefono_contacto && state.telefono_contacto != null
              ? state.errors.telefono_contacto
              : undefined
          }
          show_error_message
          type="number"
          className={"form-input-md"}
          labelClassName={"form-input-label"}
          value={state.telefono_contacto ? state.telefono_contacto : ""}
          onChange={(e) => {
            onFormChange({
              telefono_contacto: e.target.value,
            });
          }}
          label={textos["numero_telefono"]}
          labelStyle={estilosBold}
        />
      </Grid>
      <Grid item xs={12} md={4} mt={4}>
        <FormGroup
          error={
            state.errors.email_contacto && state.email_contacto != null
              ? state.errors.email_contacto
              : undefined
          }
          show_error_message
          className={"form-input-md"}
          type="email"
          labelClassName={"form-input-label"}
          value={state.email_contacto ? state.email_contacto : ""}
          onChange={(e) => {
            onFormChange({
              email_contacto: e.target.value,
            });
          }}
          label={textos["email"]}
          labelStyle={estilosBold}
        />
      </Grid>
      <Grid item xs={12} md={4} mt={4}>
        <FormGroup
          error={
            state.errors.email_contacto_confirmacion &&
            state.email_contacto_confirmacion != null
              ? state.errors.email_contacto_confirmacion
              : undefined
          }
          show_error_message
          className={"form-input-md"}
          type="email"
          labelStyle={estilosNormal}
          labelClassName={"form-input-label"}
          value={
            state.email_contacto_confirmacion
              ? state.email_contacto_confirmacion
              : ""
          }
          tooltip={
            <MTooltip
              color="blue"
              text={
                <>
                  <Typography fontWeight={600}>
                    {textos["info_contacto"]}
                  </Typography>
                  <Typography>{textos["info_contacto1"]}</Typography>
                </>
              }
              placement="right"
            />
          }
          onChange={(e) => {
            onFormChange({
              email_contacto_confirmacion: e.target.value,
            });
          }}
          label={textos["confirmar_correo"]}
        />
      </Grid>
    </Grid>
  );
};
