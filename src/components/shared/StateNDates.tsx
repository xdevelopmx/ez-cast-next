import {
  type FC,
  type CSSProperties,
  useState,
  useEffect,
  useContext,
} from "react";
import { Box, Button, Divider, Typography } from "@mui/material";
import { MSelect } from "./MSelect/MSelect";
import { MRadioGroup } from "./MRadioGroup";
import { MContainer } from "../layout/MContainer";
import { FormGroup } from "./FormGroup";
import MotionDiv from "../layout/MotionDiv";
import { Tag } from "./Tag";
import useNotify from "~/hooks/useNotify";
import AppContext from "~/context/app";
import useLang from "~/hooks/useLang";

interface Props {
  title?: string;
  stylesTitle?: CSSProperties;
  styleRoot?: CSSProperties;

  //select
  loadingSelect: boolean;
  optionsSelect: { value: string; label: string }[];
  nameSelect: string;
  valueSelect: string;
  onSelectChange: (value: string) => void;

  //radio
  nameRadio: string;

  //fechas
  valueFechas: { inicio: Date; fin?: Date }[];
  onAgregarFecha: (date: { inicio: Date; fin?: Date }) => void;
  onEliminarFecha: (index: number) => void;
}

export const StateNDates: FC<Props> = ({
  title,
  loadingSelect,
  nameSelect,
  optionsSelect,
  valueSelect,
  nameRadio,
  valueFechas,
  stylesTitle = {},
  styleRoot = {},
  onSelectChange,
  onAgregarFecha,
  onEliminarFecha,
}) => {
  const ctx = useContext(AppContext);
  const textos = useLang(ctx.lang);

  const [valueRadio, setValueRadio] = useState("Rango de fechas");

  const [date1, setDate1] = useState("");
  const [date2, setDate2] = useState<string | null>("");

  useEffect(() => {
    if (valueRadio === "Individuales") {
      setDate2(null);
    }
  }, [valueRadio]);

  const { notify } = useNotify();

  return (
    <Box sx={styleRoot}>
      <Typography sx={{ fontWeight: 600, ...stylesTitle }}>{title}</Typography>
      <Box
        sx={{
          border: "2px solid #069cb1",
          borderRadius: 2,
          padding: "10px 20px",
          width: 380,
        }}
      >
        <Box sx={{ marginTop: 2 }}>
          <MSelect
            id={nameSelect}
            loading={loadingSelect}
            options={optionsSelect}
            value={valueSelect}
            className={"form-input-md"}
            onChange={(e) => {
              onSelectChange(e.target.value);
            }}
            label={`${textos["ciudad"]}/${textos["estado"]}:`}
          />
        </Box>
        <Box sx={{ marginTop: 2 }}>
          <MRadioGroup
            label={`${textos["fecha"]}:`}
            labelStyle={{ fontSize: "1.1rem", color: "#000", fontWeight: 600 }}
            style={{ gap: 0 }}
            id={nameRadio}
            options={[`${textos["rango_fechas"]}`, `${textos["individuales"]}`]}
            value={valueRadio}
            direction="vertical"
            onChange={(e) => {
              setValueRadio(e.target.value);
            }}
          />
        </Box>

        <Box sx={{ marginTop: 2 }}>
          <Typography fontWeight={600}>{`${textos["fecha"]}`}:</Typography>
          <MContainer
            direction="horizontal"
            styles={{ justifyContent: "space-between" }}
          >
            <FormGroup
              type="date"
              className={"form-input-md"}
              labelStyle={{ fontWeight: 600 }}
              labelClassName={"form-input-label"}
              style={{ width: 130 }}
              value={date1}
              onChange={(e) => {
                setDate1(e.target.value);
              }}
              label=""
            />
            <MotionDiv
              animation="fade"
              show={valueRadio === `${textos["rango_fechas"]}`}
            >
              <Typography>{`${textos["a"]}`}</Typography>
            </MotionDiv>
            <MotionDiv
              animation="fade"
              show={valueRadio === `${textos["rango_fechas"]}`}
            >
              <FormGroup
                type="date"
                className={"form-input-md"}
                labelStyle={{ fontWeight: 600 }}
                labelClassName={"form-input-label"}
                style={{ width: 130 }}
                value={date2 ? date2 : ""}
                onChange={(e) => {
                  setDate2(e.target.value);
                }}
                label=""
              />
            </MotionDiv>
          </MContainer>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              onClick={() => {
                switch (valueRadio) {
                  case `${textos["rango_fechas"]}`: {
                    if (date2 != null && date2 !== "") {
                      const inicio = new Date(date1);
                      inicio.setDate(inicio.getDate() + 1);
                      const fin = new Date(date2);
                      fin.setDate(fin.getDate() + 1);
                      onAgregarFecha({ inicio: inicio, fin: fin });
                    } else {
                      notify("warning", `${textos["warning_rango_fechas"]}`);
                    }
                    break;
                  }
                  case `${textos["individuales"]}`: {
                    if (date1 !== "") {
                      const inicio = new Date(date1);
                      inicio.setDate(inicio.getDate() + 1);
                      onAgregarFecha({ inicio: inicio, fin: undefined });
                    } else {
                      notify(
                        "warning",
                        `${textos["warning_fecha_individual"]}`
                      );
                    }
                    break;
                  }
                }
              }}
              sx={{
                textTransform: "none",
                backgroundColor: "#069cb1",
                borderRadius: "3rem",
                color: "#fff",
                padding: "5px 40px",
                "&:hover": {
                  backgroundColor: "#03adc4",
                  color: "#fff",
                },
                border: "none",
                outline: "none",
              }}
            >
              {`${textos["agregar"]} ${textos["fecha"]}`}
            </Button>
          </Box>
        </Box>

        <Divider sx={{ marginTop: 2 }} />

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            padding: "10px 0px",
            maxWidth: "100%",
          }}
        >
          {valueFechas.map((fecha, i) => {
            if (fecha.inicio) {
              return (
                <Tag
                  key={i}
                  text={`${fecha.inicio.toLocaleDateString("es-mx", {day: 'numeric', month: 'numeric', year: '2-digit'})}${
                    fecha.fin
                      ? ` a ${fecha.fin.toLocaleDateString("es-mx", {day: 'numeric', month: 'numeric', year: '2-digit'})}`
                      : ""
                  }`}
                  onRemove={() => {
                    onEliminarFecha(i);
                  }}
                />
              );
            }
            return null;
          })}
        </Box>
      </Box>
    </Box>
  );
};
