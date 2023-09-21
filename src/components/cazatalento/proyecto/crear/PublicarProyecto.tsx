import { Grid, Typography } from "@mui/material";
import { type FC } from "react";
import { MRadioGroup, SectionTitle } from "~/components";
import DragNDrop from "~/components/shared/DragNDrop/DragNDrop";
import { type ProyectoForm } from "~/pages/cazatalentos/proyecto";
import { FileManager } from "~/utils/file-manager";
import Image from "next/image";
import { MTooltip } from "~/components/shared/MTooltip";
import useLang from "~/hooks/useLang";
import AppContext from "~/context/app";
import { useContext } from "react";

interface Props {
  state: ProyectoForm;
  onFormChange: (input: { [id: string]: unknown }) => void;
}

export const PublicarProyecto: FC<Props> = ({ state, onFormChange }) => {
  const ctx = useContext(AppContext);
  const textos = useLang(ctx.lang);
  const paso = textos["paso"] + " 6";
  return (
    <Grid container>
      <Grid item xs={12}>
        <SectionTitle
          title={paso}
          titleSx={{
            fontSize: "1.2rem",
          }}
          subtitle={textos["pbdt"]}
          subtitleSx={{
            ml: 4,
            color: "#069cb1",
            fontWeight: 600,
            fontSize: "1.2rem",
          }}
        />
      </Grid>
      <Grid item mt={4} xs={12}>
        <DragNDrop
          id="id-drag-n-drop-archivo"
          noIconLabel={true}
          label={
            <Typography fontWeight={600} fontSize={"14px"}>
              {textos["afp"]}
              <MTooltip
                color="blue"
                text={
                  <>
                    <Typography fontWeight={600}>{textos["titool"]}</Typography>
                    <Typography>{textos["textool"]}</Typography>
                  </>
                }
                placement="right"
              />
            </Typography>
          }
          text_label_download=""
          max_file_size={5120}
          download_url={state.files.foto_portada?.url}
          files={state.files.foto_portada ? [state.files.foto_portada] : []}
          filetypes={["png", "jpg", "jpeg"]}
          maxWidth={400}
          //height={100}

          onChange={(files: File[]) => {
            const files_converted = Promise.all(
              files.map(async (f) => {
                const base64 = await FileManager.convertFileToBase64(f);
                return { base64: base64, name: f.name, file: f };
              })
            );
            files_converted
              .then((files_conv) => {
                console.log(files_conv);
                onFormChange({
                  files: {
                    ...state.files,
                    foto_portada: files_conv[0],
                    touched: {
                      ...state.files.touched,
                      foto_portada: true,
                    },
                  },
                });
              })
              .catch((err) => {
                console.log(err);
                onFormChange({ files: { ...state.files, archivo: undefined } });
              });
          }}
          styleContainerDrag={{
            backgroundColor: "#fff",
          }}
          styleBoxBtnUpload={{
            border: "1px solid #000",
            borderRadius: ".5rem",
          }}
          mainIcon={
            <Image
              src="/assets/img/iconos/cam_outline_blue.svg"
              width={30}
              height={30}
              alt=""
            />
          }
          textoArrastrarArchivos={
            <Typography sx={{ fontSize: "1rem" }}>{textos["aar"]}</Typography>
          }
          hasNoIconInButton={true}
          text_button={textos["addph"]}
          stylesButton={{
            backgroundColor: "#069cb1",
            color: "#fff",
            width: "150px",
            maxWidth: "100%",
          }}
        />
      </Grid>
      <Grid item xs={12} mt={4}>
        <MRadioGroup
          label={textos["deseas_compartir"]}
          labelStyle={{ fontSize: "16px", color: "#000", fontWeight: 600 }}
          style={{ gap: 0 }}
          id="quieres-compartir"
          options={[`${textos["si_compartir"]}`, `${textos["no_compartir"]}`]}
          value={
            state.compartir_nombre
              ? `${textos["no_compartir"]}`
              : `${textos["si_compartir"]}`
          }
          direction="vertical"
          onChange={(e) => {
            onFormChange({
              compartir_nombre: e.target.value === `${textos["no_compartir"]}`,
            });
          }}
        />
      </Grid>
    </Grid>
  );
};
