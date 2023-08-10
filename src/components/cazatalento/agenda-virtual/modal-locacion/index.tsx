import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
} from "@mui/material";
import React, {
  type Dispatch,
  type SetStateAction,
  type FC,
  useState,
  useEffect,
} from "react";
import { FormGroup, MCheckboxGroup, MSelect } from "~/components/shared";
import useNotify from "~/hooks/useNotify";
import { api, parseErrorBody } from "~/utils/api";

export type ModalLocacionState = {
  id: number;
  direccion: string;
  direccion2?: string;
  id_estado_republica: number;
  codigo_postal: number;
  guardado_en_bd: boolean;
};

interface Props {
  isOpen: boolean;
  initialData?: ModalLocacionState;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  onChange: (data: ModalLocacionState, result: number) => void;
}

export const ModalLocacion: FC<Props> = ({
  initialData,
  isOpen,
  setIsOpen,
  onChange,
}) => {
  const { notify } = useNotify();

  const estados_republica = api.catalogos.getEstadosRepublica.useQuery(
    undefined,
    {
      refetchOnWindowFocus: false,
    }
  );

  const [data, setData] = useState<ModalLocacionState>({
    id: 0,
    direccion: "",
    id_estado_republica: 1,
    codigo_postal: 0,
    guardado_en_bd: false,
  });

  const update_locacion = api.agenda_virtual.updateLocalizacion.useMutation({
    onSuccess: (input) => {
      notify("success", "Se la locacion con exito");
      onChange({ ...data, id: input.id }, input.result);
      setIsOpen(false);
    },
    onError: (error) => {
      notify("error", parseErrorBody(error.message));
    },
  });

  useEffect(() => {
    if (initialData) {
      setData(initialData);
    } else {
      setData({
        id: 0,
        direccion: "",
        id_estado_republica: 1,
        codigo_postal: 0,
        guardado_en_bd: false,
      });
    }
  }, [initialData]);

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle
        id="alert-dialog-title"
        sx={{ padding: "30px 100px 30px 100px" }}
      >
        <Typography
          fontWeight={600}
          sx={{ fontSize: "1.4rem", color: "#069cb1" }}
        >
          Añadir locación
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ padding: "0px 100px" }}>
        <Grid xs={12}>
          <Grid xs={12}>
            <FormGroup
              value={data.direccion}
              labelClassName={"form-input-label"}
              labelStyle={{ fontWeight: 600 }}
              label="Dirección*"
              onChange={(e) => {
                setData((prev) => {
                  return { ...prev, direccion: e.target.value };
                });
              }}
            />
          </Grid>
          <Grid xs={12}>
            <FormGroup
              value={data.direccion2}
              labelClassName={"form-input-label"}
              labelStyle={{ fontWeight: 600 }}
              label="Dirección 2"
              onChange={(e) => {
                setData((prev) => {
                  return { ...prev, direccion2: e.target.value };
                });
              }}
            />
          </Grid>
          <Grid xs={12}>
            <MSelect
              id="estados-republica-select"
              options={
                estados_republica.data
                  ? estados_republica.data.map((e) => {
                      return { value: e.id.toString(), label: e.es };
                    })
                  : []
              }
              styleRoot={{ width: "100%", marginBottom: "1rem" }}
              style={{ width: "100%" }}
              value={data.id_estado_republica.toString()}
              onChange={(e) => {
                setData((prev) => {
                  return {
                    ...prev,
                    id_estado_republica: parseInt(e.target.value),
                  };
                });
              }}
              label="Estado/Provincia*"
            />
          </Grid>
          <Grid xs={12}>
            <FormGroup
              labelClassName={"form-input-label"}
              labelStyle={{ fontWeight: 600 }}
              label="Código postal*"
              type="number"
              value={data.codigo_postal.toString()}
              onChange={(e) => {
                setData((prev) => {
                  return { ...prev, codigo_postal: parseInt(e.target.value) };
                });
              }}
            />
          </Grid>
          <Grid xs={12}>
            <MCheckboxGroup
              direction="vertical"
              onChange={(e, i) => {
                setData((prev) => {
                  return { ...prev, guardado_en_bd: e };
                });
              }}
              id="guardar-para-uso-futuro"
              //labelStyle={{ marginBottom: 0, width: '32%' }}
              options={["Guardar para uso futuro"]}
              values={
                /* (generos.data) ? generos.data.map(g => {
                                return state.generos.includes(g.id);
                            }) : */ [data.guardado_en_bd]
              }
            />
          </Grid>
          <Grid xs={12} sx={{ paddingBottom: "30px" }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Button
                onClick={() => {
                  update_locacion.mutate(data);
                }}
                sx={{
                  borderRadius: "2rem",
                  backgroundColor: "#069cb1",
                  color: "#fff",
                  textTransform: "none",
                  minWidth: "80%",
                  "&:hover": {
                    backgroundColor: "#06acc2",
                  },
                }}
              >
                <Typography>Añadir locación</Typography>
              </Button>
              <Button
                sx={{
                  color: "#069cb1",
                  textTransform: "none",
                  textDecoration: "underline",
                }}
                onClick={() => setIsOpen(false)}
              >
                <Typography>Cancelar</Typography>
              </Button>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
