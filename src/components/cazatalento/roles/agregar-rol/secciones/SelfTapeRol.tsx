import Image from "next/image";
import { Grid, Typography } from "@mui/material";
import { FormGroup, MCheckboxGroup, SectionTitle } from "~/components/shared";
import DragNDrop from "~/components/shared/DragNDrop/DragNDrop";
import { type SelftapeRolForm } from "~/pages/cazatalentos/roles/agregar-rol";
import { type CSSProperties, type FC, useContext } from "react";
import { FileManager } from "~/utils/file-manager";
import AppContext from "~/context/app";
import useLang from "~/hooks/useLang";

interface Props {
  fetching: boolean;
  state: SelftapeRolForm;
  onFormChange: (input: { [id: string]: unknown }) => void;
}

const estilosBold: CSSProperties = { fontWeight: 700, fontSize: "1rem" };
//const estilosNormal: CSSProperties = { fontWeight: 600, fontSize: "1rem" };

export const SelfTapeRol: FC<Props> = ({ state, onFormChange }) => {
  const ctx = useContext(AppContext);
  const textos = useLang(ctx.lang);

  return (
    <Grid container item xs={12} mt={8}>
      <Grid item xs={12}>
        <SectionTitle
          title={`${textos["paso"]} 8`}
          titleSx={{
            fontSize: "1.2rem",
          }}
          subtitle={`${textos["selftape"]} (${textos["opcional"]})`}
          subtitleSx={{
            ml: 4,
            color: "#069cb1",
            fontWeight: 600,
            fontSize: "1.2rem",
          }}
          dividerSx={{ backgroundColor: "#9B9B9B" }}
        />
      </Grid>
      <Grid item xs={12} mt={2}>
        <MCheckboxGroup
          title=""
          onChange={(e, i) => {
            onFormChange({
              pedir_selftape: e,
            });
          }}
          direction="horizontal"
          id="pedir-self-tape"
          options={[`${textos["pedir_selftape"]}`]}
          label=""
          labelStyle={estilosBold}
          values={[state.pedir_selftape]} //[(state) ? state.mostrar_anio_en_perfil : false]}
        />
      </Grid>
      <Grid item xs={6} mt={2}>
        <FormGroup
          type={"text-area"}
          className={"form-input-md"}
          style={{ width: "80%" }}
          labelStyle={{ ...estilosBold, width: "100%", marginTop: 10 }}
          labelClassName={"form-input-label"}
          value={state.indicaciones}
          onChange={(e) => {
            onFormChange({
              indicaciones: e.target.value,
            });
          }}
          label={`${textos["indicaciones"]}`}
        />
      </Grid>
      <Grid item xs={6} mt={2}>
        <DragNDrop
          id="id-drag-n-drop-foto-referencia"
          noIconLabel={true}
          label={
            <Typography
              fontWeight={600}
              sx={estilosBold}
            >{`${textos["lineas"]}`}</Typography>
          }
          text_label_download={`${textos["descargar"]} ${textos["lineas"]}`}
          max_file_size={5120}
          download_url={state.files.lineas?.url}
          files={state.files.lineas ? [state.files.lineas] : []}
          filetypes={["DOC", "DOCX", "PDF"]}
          text_button={`${textos["agregar"]} PDF`}
          mainIcon={
            <Image
              src={"/assets/img/iconos/ico_pdf_blue.svg"}
              width={25}
              height={25}
              alt="cam-icon"
            />
          }
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
                    lineas: files_conv[0],
                    touched: {
                      lineas: true,
                    },
                  },
                });
              })
              .catch((err) => {
                console.log(err);
                onFormChange({ files: { ...state.files, archivo: undefined } });
              });
          }}
        />
      </Grid>
    </Grid>
  );
};
