import { Grid } from "@mui/material";
import { type CSSProperties, type FC } from "react";
import { MSelect, SectionTitle } from "~/components";
import { MTooltip } from "~/components/shared/MTooltip";
import { type ProyectoForm } from "~/pages/cazatalentos/proyecto";
import { api } from "~/utils/api";
import useLang from "~/hooks/useLang";
import AppContext from "~/context/app";
import { useContext } from "react";

const estilosBold: CSSProperties = { fontWeight: 700, fontSize: "1rem" };
//const estilosNormal: CSSProperties = { fontWeight: 600, fontSize: "1rem" };

interface Props {
  state: ProyectoForm;
  onFormChange: (input: { [id: string]: string | number }) => void;
}

export const LocacionProyecto: FC<Props> = ({ state, onFormChange }) => {
  const ctx = useContext(AppContext);
  const textos = useLang(ctx.lang);
  const paso = textos["paso"] + " 5";
  const estados_republica = api.catalogos.getEstadosRepublica.useQuery(
    undefined,
    {
      refetchOnWindowFocus: false,
    }
  );
  return (
    <Grid container>
      <Grid item xs={12}>
        <SectionTitle
          title={paso}
          titleSx={{
            fontSize: "1.2rem",
          }}
          subtitle={textos["loc_proy"]}
          subtitleSx={{
            ml: 4,
            color: "#069cb1",
            fontWeight: 600,
            fontSize: "1.2rem",
          }}
        />
      </Grid>
      <Grid item xs={4} my={4}>
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
          value={state.id_estado_republica.toString()}
          onChange={(e) => {
            onFormChange({
              id_estado_republica: parseInt(e.target.value),
            });
          }}
          tooltip={
            <MTooltip color="orange" text={textos["detp"]} placement="right" />
          }
          label={textos["loc_proy"] + "*"}
          inferiorBlueText={textos["elest"]}
          labelStyle={estilosBold}
        />
      </Grid>
    </Grid>
  );
};
