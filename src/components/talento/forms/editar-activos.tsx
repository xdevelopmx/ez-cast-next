import { useMemo, type FC, useContext } from "react";
import { AddButton, FormGroup } from "~/components";
import { Button, Divider, Grid, TableRow, Typography } from "@mui/material";
import { MContainer } from "~/components/layout/MContainer";
import { MSelect } from "~/components/shared/MSelect/MSelect";
import { MCheckboxGroup } from "~/components/shared/MCheckboxGroup";
import { MTable } from "~/components/shared/MTable/MTable";
import { type TalentoFormActivos } from "~/pages/talento/editar-perfil";
import { api } from "~/utils/api";
import MotionDiv from "~/components/layout/MotionDiv";
import useNotify from "~/hooks/useNotify";
import { Close } from "@mui/icons-material";
import AppContext from "~/context/app";
import useLang from "~/hooks/useLang";

interface Props {
  state: TalentoFormActivos;
  onFormChange: (input: { [id: string]: unknown }) => void;
}
const CURRENT_YEAR = new Date().getFullYear();
const VEHICULO_YEARS = Array.from({ length: 100 }).map(
  (v, i) => CURRENT_YEAR - i
);

export const EditarActivosTalento: FC<Props> = ({ onFormChange, state }) => {
  const ctx = useContext(AppContext);
  const textos = useLang(ctx.lang);
  const tipos_vehiculos = api.catalogos.getTipoVehiculos.useQuery();
  const tipos_mascotas = api.catalogos.getTipoMascotas.useQuery();
  const tipos_razas = api.catalogos.getTipoRazasMascotas.useQuery();
  const tipos_vestuarios = api.catalogos.getTipoVestuarios.useQuery();
  const tipos_vestuarios_especificos =
    api.catalogos.getTipoVestuarioEspecifico.useQuery();
  const tipos_props = api.catalogos.getTipoProps.useQuery();
  const tipo_equipo_deportivo = api.catalogos.getTipoEquipoDeportivo.useQuery();
  const { notify } = useNotify();
  const raza_select: JSX.Element | null = useMemo(() => {
    if (state.mascota) {
      if (state.mascota.id_tipo_mascota === 5) {
        return (
          <MSelect
            id="tipo-raza-select"
            className={"form-input-md form-input-small"}
            options={
              tipos_razas.data
                ? tipos_razas.data.map((m) => {
                  return {
                    value: m.id.toString(),
                    label: ctx.lang === "es" ? m.es : m.en,
                  };
                })
                : []
            }
            style={{ width: 200 }}
            value={state.mascota.id_raza.toString()}
            onChange={(e) => {
              const tipo = tipos_razas.data
                ? tipos_razas.data.filter(
                  (d) => d.id === parseInt(e.target.value)
                )
                : [];
              onFormChange({
                mascota: {
                  ...state.mascota,
                  tipo_raza:
                    tipo.length > 0 && tipo[0] != null
                      ? ctx.lang === "es"
                        ? tipo[0].es
                        : tipo[0].en
                      : "ND",
                  id_raza: parseInt(e.target.value),
                },
              });
            }}
            label="Raza"
          />
        );
      }
    }
    return null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.mascota, ctx.lang]);

  const vestuario_especifico_select: JSX.Element | null = useMemo(() => {
    if (state.vestuario) {
      if (state.vestuario.id_tipo > 0 && state.vestuario.id_tipo !== 3) {
        return (
          <MSelect
            id="tipo-vestuario-especifico-select"
            className={"form-input-md form-input-small"}
            options={
              tipos_vestuarios_especificos.data
                ? tipos_vestuarios_especificos.data
                  .filter(
                    (v) => v.id_tipo_vestuario === state.vestuario?.id_tipo
                  )
                  .map((m) => {
                    return {
                      value: m.id.toString(),
                      label: ctx.lang === "es" ? m.es : m.en,
                    };
                  })
                : []
            }
            style={{ width: 200 }}
            value={state.vestuario.id_tipo_vestuario_especifico.toString()}
            onChange={(e) => {
              const tipo = tipos_vestuarios_especificos.data
                ? tipos_vestuarios_especificos.data.filter(
                  (d) => d.id === parseInt(e.target.value)
                )
                : [];
              onFormChange({
                vestuario: {
                  ...state.vestuario,
                  tipo_especifico:
                    tipo.length > 0 && tipo[0] != null
                      ? ctx.lang === "es"
                        ? tipo[0].es
                        : tipo[0].en
                      : "ND",
                  id_tipo_vestuario_especifico: parseInt(e.target.value),
                },
              });
            }}
            label="Tipo Vestuario Especifico"
          />
        );
      }
    }
    return null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.vestuario, ctx.lang]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={3} lg={4}>
        <MContainer direction="vertical">
          <MCheckboxGroup
            onChange={(e) => {
              onFormChange({ has_vehiculos: e });
            }}
            id="mostrar-vehiculos"
            labelClassName={"label-black-lg"}
            labelStyle={{ margin: 0 }}
            options={[
              textos["vehiculos"] ? textos["vehiculos"] : "Texto No Definido",
            ]}
            values={[state.has_vehiculos]} //[(state) ? state.mostrar_anio_en_perfil : false]}
          />
          <MotionDiv show={state.has_vehiculos} animation="fade">
            <>
              <MSelect
                id="tipo-vehiculo-select"
                className={"form-input-md form-input-small"}
                options={
                  tipos_vehiculos.data
                    ? tipos_vehiculos.data.map((v) => {
                      return {
                        value: v.id.toString(),
                        label: ctx.lang === "es" ? v.es : v.en,
                      };
                    })
                    : []
                }
                value={state.vehiculo.id_tipo_vehiculo.toString()}
                onChange={(e) => {
                  const tipo = tipos_vehiculos.data
                    ? tipos_vehiculos.data.filter(
                      (d) => d.id === parseInt(e.target.value)
                    )
                    : [];
                  onFormChange({
                    vehiculo: {
                      ...state.vehiculo,
                      tipo:
                        tipo.length > 0 && tipo[0] != null
                          ? ctx.lang === "es"
                            ? tipo[0].es
                            : tipo[0].en
                          : "ND",
                      id_tipo_vehiculo: parseInt(e.target.value),
                    },
                  });
                }}
                label={
                  textos["tipo_vehiculo"]
                    ? textos["tipo_vehiculo"]
                    : "Texto No Definido"
                }
              />
              <FormGroup
                className={"form-input-md form-input-small"}
                labelClassName={"form-input-label"}
                value={state.vehiculo?.marca}
                onChange={(e) => {
                  onFormChange({
                    vehiculo: { ...state.vehiculo, marca: e.target.value },
                  });
                }}
                label={textos["marca"] ? textos["marca"] : "Texto No Definido"}
              />
              <FormGroup
                className={"form-input-md form-input-small"}
                labelClassName={"form-input-label"}
                value={state.vehiculo?.modelo}
                onChange={(e) => {
                  onFormChange({
                    vehiculo: { ...state.vehiculo, modelo: e.target.value },
                  });
                }}
                label={
                  textos["modelo"] ? textos["modelo"] : "Texto No Definido"
                }
              />
              <FormGroup
                className={"form-input-md form-input-small"}
                labelClassName={"form-input-label"}
                value={state.vehiculo?.color}
                onChange={(e) => {
                  onFormChange({
                    vehiculo: { ...state.vehiculo, color: e.target.value },
                  });
                }}
                label={textos["color"] ? textos["color"] : "Texto No Definido"}
              />
              <MSelect
                id="anio-vehiculo-select"
                className={"form-input-md form-input-small"}
                options={VEHICULO_YEARS.map((i) => {
                  return { value: i.toString(), label: i.toString() };
                })}
                style={{ width: 200 }}
                value={state.vehiculo?.anio?.toString()}
                onChange={(e) => {
                  onFormChange({
                    vehiculo: {
                      ...state.vehiculo,
                      anio: parseInt(e.target.value),
                    },
                  });
                }}
                label={textos["anio"] ? textos["anio"] : "Texto No Definido"}
              />
              <AddButton
                aStyles={{ marginLeft: 0, width: 100 }}
                text={
                  textos["agregar"] ? textos["agregar"] : "Texto No Definido"
                }
                onClick={() => {
                  if (state.vehiculos) {
                    if (
                      state.vehiculo &&
                      state.vehiculo.anio > 0 &&
                      state.vehiculo.marca.length > 0 &&
                      state.vehiculo.modelo.length > 0 &&
                      state.vehiculo.color.length > 0 &&
                      state.vehiculo.id_tipo_vehiculo > 0
                    ) {
                      if (state.vehiculos.length < 5) {
                        onFormChange({
                          vehiculos: state.vehiculos.concat([state.vehiculo]),
                        });
                      } else {
                        notify(
                          "warning",
                          textos["activos_vehiculos_max_validacion"]
                            ? textos["activos_vehiculos_max_validacion"]
                            : "Texto No Definido"
                        );
                      }
                    } else {
                      notify(
                        "warning",
                        textos["llenar_todos_los_campos"]
                          ? textos["llenar_todos_los_campos"].replace(
                            "[TYPE]",
                            textos["activos"]
                              ? textos["activos"]
                              : "Texto No Definido"
                          )
                          : "Texto No Definido"
                      );
                    }
                  } else {
                    onFormChange({ vehiculos: [state.vehiculo] });
                  }
                }}
              />
            </>
          </MotionDiv>
        </MContainer>
      </Grid>
      <Grid item xs={12} md={9} lg={8}>
        <MotionDiv show={state.has_vehiculos} animation="fade">
          <MContainer direction="vertical">
            <Divider style={{ marginTop: 32 }} />
            <MTable
            
              columnsHeader={[
                <Typography
                  key={1}
                  fontSize={"1.2rem"}
                  fontWeight={600}
                  component={"p"}
                  sx={{ textAlign: "center" }}
                >
                  {textos["tipo"] ? textos["tipo"] : "Texto No Definido"}
                </Typography>,
                <Typography
                  key={2}
                  fontSize={"1.2rem"}
                  fontWeight={600}
                  component={"p"}
                  sx={{ textAlign: "center" }}
                >
                  {textos["marca"] ? textos["marca"] : "Texto No Definido"}
                </Typography>,
                <Typography
                  key={3}
                  fontSize={"1.2rem"}
                  fontWeight={600}
                  component={"p"}
                  sx={{ textAlign: "center" }}
                >
                  {textos["modelo"] ? textos["modelo"] : "Texto No Definido"}
                </Typography>,
                <Typography
                  key={4}
                  fontSize={"1.2rem"}
                  fontWeight={600}
                  component={"p"}
                  sx={{ textAlign: "center" }}
                >
                  {textos["color"] ? textos["color"] : "Texto No Definido"}
                </Typography>,
                <Typography
                  key={5}
                  fontSize={"1.2rem"}
                  fontWeight={600}
                  component={"p"}
                  sx={{ textAlign: "center" }}
                >
                  {textos["anio"] ? textos["anio"] : "Texto No Definido"}
                </Typography>,
                <Typography
                  key={6}
                  fontSize={"1.2rem"}
                  fontWeight={600}
                  component={"p"}
                  sx={{ textAlign: "center" }}
                >
                  {textos["acciones"]
                    ? textos["acciones"]
                    : "Texto No Definido"}
                </Typography>,
              ]}
              loading={!state.vehiculos}
              data={
                state.vehiculos
                  ? state.vehiculos.map((e, j) => {
                    return {
                      tipo: (
                        <TableRow style={{ display: 'flex', justifyContent: 'center' }}>
                          {e.tipo}
                        </TableRow>
                      ),
                      marca: (
                        <TableRow style={{ display: 'flex', justifyContent: 'center' }}>
                          {e.marca}
                        </TableRow>
                      ),
                      modelo: (
                        <TableRow style={{ display: 'flex', justifyContent: 'center' }}>
                          {e.modelo}
                        </TableRow>
                      ),
                      color: (
                        <TableRow style={{ display: 'flex', justifyContent: 'center' }}>
                          {e.color}
                        </TableRow>
                      ),
                      anio: (
                        <TableRow style={{ display: 'flex', justifyContent: 'center' }}>
                          {e.anio}
                        </TableRow>
                      ),
                      delete: (
                        <TableRow style={{ display: 'flex', justifyContent: 'center' }}>
                          <Button
                            style={{
                              minWidth: 10,
                              textTransform: "capitalize",
                              fontWeight: 800,
                              color: "#069CB1",
                            }}
                            onClick={() => {
                              if (state.vehiculos) {
                                onFormChange({
                                  vehiculos: state.vehiculos.filter(
                                    (v, i) => i !== j
                                  ),
                                });
                              }
                            }}
                            variant="outlined"
                            startIcon={<Close />}
                          >
                            {textos["eliminar"]
                              ? textos["eliminar"]
                              : "Texto No Definido"}
                          </Button>
                        </TableRow>
                      ),
                    };
                  })
                  : []
              }
            />
          </MContainer>
        </MotionDiv>
      </Grid>
      <Grid my={4} item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12} md={3} lg={4}>
        <MContainer direction="vertical">
          <MCheckboxGroup
            onChange={(e) => {
              onFormChange({ has_mascotas: e });
            }}
            id="mostrar-mascotas"
            labelClassName={"label-black-lg"}
            labelStyle={{ margin: 0 }}
            options={[
              textos["mascotas"] ? textos["mascotas"] : "Texto No Definido",
            ]}
            values={[state.has_mascotas]} //[(state) ? state.mostrar_anio_en_perfil : false]}
          />
          <MotionDiv show={state.has_mascotas} animation="fade">
            <MContainer direction="vertical">
              <MSelect
                id="tipo-mascota-select"
                className={"form-input-md form-input-small"}
                options={
                  tipos_mascotas.data
                    ? tipos_mascotas.data.map((m) => {
                      return {
                        value: m.id.toString(),
                        label: ctx.lang === "es" ? m.es : m.en,
                      };
                    })
                    : []
                }
                style={{ width: 200 }}
                value={state.mascota.id_tipo_mascota.toString()}
                onChange={(e) => {
                  const tipo = tipos_mascotas.data
                    ? tipos_mascotas.data.filter(
                      (d) => d.id === parseInt(e.target.value)
                    )
                    : [];
                  onFormChange({
                    mascota: {
                      ...state.mascota,
                      id_tipo_raza: 0,
                      tipo:
                        tipo.length > 0 && tipo[0] != null
                          ? ctx.lang === "es"
                            ? tipo[0].es
                            : tipo[0].en
                          : "ND",
                      id_tipo_mascota: parseInt(e.target.value),
                    },
                  });
                }}
                label={
                  textos["tipo_mascota"]
                    ? textos["tipo_mascota"]
                    : "Texto No Definido"
                }
              />
              <>{raza_select}</>
              <MSelect
                id="tamanio-mascota-select"
                className={"form-input-md form-input-small"}
                options={[
                  {
                    value: "Chico",
                    label: textos["chico"]
                      ? textos["chico"]
                      : "Texto No Definido",
                  },
                  {
                    value: "Mediano",
                    label: textos["mediano"]
                      ? textos["mediano"]
                      : "Texto No Definido",
                  },
                  {
                    value: "Grande",
                    label: textos["grande"]
                      ? textos["grande"]
                      : "Texto No Definido",
                  },
                ]}
                style={{ width: 200 }}
                value={state.mascota.tamanio}
                onChange={(e) => {
                  onFormChange({
                    mascota: { ...state.mascota, tamanio: e.target.value },
                  });
                }}
                label={
                  textos["tamanio"] ? textos["tamanio"] : "Texto No Definido"
                }
              />
              <AddButton
                aStyles={{ marginLeft: 0, width: 100 }}
                text={
                  textos["agregar"] ? textos["agregar"] : "Texto No Definido"
                }
                onClick={() => {
                  if (state.mascotas) {
                    if (
                      state.mascota &&
                      state.mascota.id_tipo_mascota > 0 &&
                      state.mascota.tamanio.length > 0
                    ) {
                      if (state.mascotas.length < 5) {
                        if (
                          (state.mascota.id_tipo_mascota === 5 &&
                            state.mascota.id_raza > 0) ||
                          state.mascota.id_tipo_mascota !== 5
                        ) {
                          onFormChange({
                            mascotas: state.mascotas.concat([state.mascota]),
                          });
                        } else {
                          notify(
                            "warning",
                            textos["llenar_todos_los_campos"]
                              ? textos["llenar_todos_los_campos"].replace(
                                "[TYPE]",
                                textos["activos"]
                                  ? textos["activos"]
                                  : "Texto No Definido"
                              )
                              : "Texto No Definido"
                          );
                        }
                      } else {
                        notify(
                          "warning",
                          textos["activos_mascotas_max_validacion"]
                            ? textos["activos_mascotas_max_validacion"]
                            : "Texto No Definido"
                        );
                      }
                    } else {
                      notify(
                        "warning",
                        textos["llenar_todos_los_campos"]
                          ? textos["llenar_todos_los_campos"].replace(
                            "[TYPE]",
                            textos["activos"]
                              ? textos["activos"]
                              : "Texto No Definido"
                          )
                          : "Texto No Definido"
                      );
                    }
                  } else {
                    onFormChange({ mascotas: [state.mascota] });
                  }
                }}
              />
            </MContainer>
          </MotionDiv>
        </MContainer>
      </Grid>
      <Grid item xs={12} md={9} lg={8}>
        <MotionDiv show={state.has_mascotas} animation="fade">
          <MContainer direction="vertical">
            <Divider style={{ marginTop: 32 }} />
            <MTable
              columnsHeader={[
                <Typography
                  key={1}
                  fontSize={"1.2rem"}
                  fontWeight={600}
                  component={"p"}
                  sx={{ textAlign: "center" }}
                >
                  {textos["mascota"] ? textos["mascota"] : "Texto No Definido"}
                </Typography>,
                <Typography
                  key={2}
                  fontSize={"1.2rem"}
                  fontWeight={600}
                  component={"p"}
                  sx={{ textAlign: "center" }}
                >
                  {textos["raza"] ? textos["raza"] : "Texto No Definido"}
                </Typography>,
                <Typography
                  key={3}
                  fontSize={"1.2rem"}
                  fontWeight={600}
                  component={"p"}
                  sx={{ textAlign: "center" }}
                >
                  {textos["tamanio"] ? textos["tamanio"] : "Texto No Definido"}
                </Typography>,
                <Typography
                  key={4}
                  fontSize={"1.2rem"}
                  fontWeight={600}
                  component={"p"}
                  sx={{ textAlign: "center" }}
                >
                  {textos["acciones"]
                    ? textos["acciones"]
                    : "Texto No Definido"}
                </Typography>,
              ]}
              loading={!state.mascotas}
              data={
                state.mascotas
                  ? state.mascotas?.map((mascota, j) => {
                    return {
                      tipo: (
                        <TableRow style={{ display: 'flex', justifyContent: 'center' }}>
                          {mascota.tipo}
                        </TableRow>
                      ),
                      tipo_raza: (
                        <TableRow style={{ display: 'flex', justifyContent: 'center' }}>
                          {mascota.id_tipo_mascota === 5
                            ? mascota.tipo_raza
                            : "No Aplica"}
                        </TableRow>
                      ),
                      tamanio: (() => {
                        //mascota.tamanio
                        if (ctx.lang === "en") {
                          switch (mascota.tamanio.toLowerCase()) {
                            case "chico":
                              return "Small";
                            case "mediano":
                              return "Medium";
                            case "grande":
                              return "Large";
                          }
                        }
                        return (
                          <TableRow style={{ display: 'flex', justifyContent: 'center' }}>
                            {mascota.tamanio}
                          </TableRow>
                        );
                      })(),
                      delete: (
                        <TableRow style={{ display: 'flex', justifyContent: 'center' }}>
                          <Button
                            style={{
                              textTransform: "capitalize",
                              fontWeight: 800,
                              color: "#069CB1",
                            }}
                            onClick={() => {
                              if (state.mascotas) {
                                onFormChange({
                                  mascotas: state.mascotas.filter(
                                    (v, i) => i !== j
                                  ),
                                });
                              }
                            }}
                            variant="outlined"
                            startIcon={<Close />}
                          >
                            {textos["eliminar"]
                              ? textos["eliminar"]
                              : "Texto No Definido"}
                          </Button>
                        </TableRow>
                      ),
                    };
                  })
                  : []
              }
            />
          </MContainer>
        </MotionDiv>
      </Grid>
      <Grid my={4} item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12} md={3} lg={4}>
        <MContainer direction="vertical">
          <MCheckboxGroup
            onChange={(e) => {
              onFormChange({ has_vestuario: e });
            }}
            id="mostrar-vestuario"
            labelClassName={"label-black-lg"}
            labelStyle={{ margin: 0 }}
            options={[
              textos["vestuarios"] ? textos["vestuarios"] : "Texto No Definido",
            ]}
            values={[state.has_vestuario]} //[(state) ? state.mostrar_anio_en_perfil : false]}
          />
          <MotionDiv show={state.has_vestuario} animation="fade">
            <>
              <MSelect
                id="tipo-vestuario-select"
                className={"form-input-md form-input-small"}
                options={
                  tipos_vestuarios.data
                    ? tipos_vestuarios.data.map((m) => {
                      return {
                        value: m.id.toString(),
                        label: ctx.lang === "es" ? m.es : m.en,
                      };
                    })
                    : []
                }
                style={{ width: 200 }}
                value={state.vestuario.id_tipo.toString()}
                onChange={(e) => {
                  const tipo = tipos_vestuarios.data
                    ? tipos_vestuarios.data.filter(
                      (d) => d.id === parseInt(e.target.value)
                    )
                    : [];
                  onFormChange({
                    vestuario: {
                      ...state.vestuario,
                      tipo:
                        tipo.length > 0 && tipo[0] != null
                          ? ctx.lang === "es"
                            ? tipo[0].es
                            : tipo[0].en
                          : "ND",
                      id_tipo: parseInt(e.target.value),
                      id_tipo_especifico: 0,
                    },
                  });
                }}
                label={
                  textos["tipo_vestuario"]
                    ? textos["tipo_vestuario"]
                    : "Texto No Definido"
                }
              />
              <>{vestuario_especifico_select}</>
              <FormGroup
                className={"form-input-md form-input-small"}
                labelClassName={"form-input-label"}
                value={state.vestuario?.descripcion}
                onChange={(e) => {
                  onFormChange({
                    vestuario: {
                      ...state.vestuario,
                      descripcion: e.target.value,
                    },
                  });
                }}
                label={
                  textos["descripcion"]
                    ? textos["descripcion"]
                    : "Texto No Definido"
                }
              />
              <AddButton
                text={
                  textos["agregar"] ? textos["agregar"] : "Texto No Definido"
                }
                aStyles={{ marginLeft: 0, width: 100 }}
                onClick={() => {
                  if (state.vestuarios) {
                    if (
                      state.vestuario &&
                      state.vestuario.id_tipo > 0 &&
                      state.vestuario.id_tipo_vestuario_especifico > 0 &&
                      state.vestuario.descripcion.length > 0
                    ) {
                      onFormChange({
                        vestuarios: state.vestuarios.concat([state.vestuario]),
                      });
                    } else {
                      notify(
                        "warning",
                        textos["llenar_todos_los_campos"]
                          ? textos["llenar_todos_los_campos"].replace(
                            "[TYPE]",
                            textos["activos"]
                              ? textos["activos"]
                              : "Texto No Definido"
                          )
                          : "Texto No Definido"
                      );
                    }
                  } else {
                    onFormChange({ vestuarios: [state.vestuario] });
                  }
                }}
              />
            </>
          </MotionDiv>
        </MContainer>
      </Grid>
      <Grid item xs={12} md={9} lg={8}>
        <MotionDiv show={state.has_vestuario} animation="fade">
          <MContainer direction="vertical">
            <Divider style={{ marginTop: 32 }} />
            <MTable
              columnsHeader={[
                <Typography
                  key={1}
                  fontSize={"1.2rem"}
                  fontWeight={600}
                  component={"p"}
                  sx={{ textAlign: "center" }}
                >
                  {textos["tipo_vestuario"]
                    ? textos["tipo_vestuario"]
                    : "Texto No Definido"}
                </Typography>,
                <Typography
                  key={2}
                  fontSize={"1.2rem"}
                  fontWeight={600}
                  component={"p"}
                  sx={{ textAlign: "center" }}
                >
                  {textos["tipo_vestuario_especifico"]
                    ? textos["tipo_vestuario_especifico"]
                    : "Texto No Definido"}
                </Typography>,
                <Typography
                  key={3}
                  fontSize={"1.2rem"}
                  fontWeight={600}
                  component={"p"}
                  sx={{ textAlign: "center" }}
                >
                  {textos["descripcion"]
                    ? textos["descripcion"]
                    : "Texto No Definido"}
                </Typography>,
                <Typography
                  key={4}
                  fontSize={"1.2rem"}
                  fontWeight={600}
                  component={"p"}
                  sx={{ textAlign: "center" }}
                >
                  {textos["acciones"]
                    ? textos["acciones"]
                    : "Texto No Definido"}
                </Typography>,
              ]}
              loading={!state.vestuarios}
              data={
                state.vestuarios
                  ? state.vestuarios?.map((vestuario, j) => {
                    return {
                      tipo: (
                        <TableRow style={{ display: 'flex', justifyContent: 'center' }}>
                          {vestuario.tipo}
                        </TableRow>
                      ),
                      tipo_especifico: (
                        <TableRow style={{ display: 'flex', justifyContent: 'center' }}>
                          {vestuario.id_tipo !== 3
                            ? vestuario.tipo_especifico
                            : "No Aplica"}
                        </TableRow>
                      ),
                      descripcion: (
                        <TableRow style={{ display: 'flex', justifyContent: 'center' }}>
                          {vestuario.descripcion}
                        </TableRow>
                      ),
                      delete: (
                        <TableRow style={{ display: 'flex', justifyContent: 'center' }}>
                          <Button
                            style={{
                              textTransform: "capitalize",
                              fontWeight: 800,
                              color: "#069CB1",
                            }}
                            onClick={() => {
                              if (state.vestuarios) {
                                onFormChange({
                                  vestuarios: state.vestuarios.filter(
                                    (v, i) => i !== j
                                  ),
                                });
                              }
                            }}
                            variant="outlined"
                            startIcon={<Close />}
                          >
                            {textos["eliminar"]
                              ? textos["eliminar"]
                              : "Texto No Definido"}
                          </Button>
                        </TableRow>
                      ),
                    };
                  })
                  : []
              }
            />
          </MContainer>
        </MotionDiv>
      </Grid>
      <Grid my={4} item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12} md={3} lg={4}>
        <MContainer direction="vertical">
          <MCheckboxGroup
            onChange={(e) => {
              onFormChange({ has_props: e });
            }}
            id="mostrar-props"
            labelClassName={"label-black-lg"}
            labelStyle={{ margin: 0 }}
            options={["Props"]}
            values={[state.has_props]} //[(state) ? state.mostrar_anio_en_perfil : false]}
          />
          <MotionDiv show={state.has_props} animation="fade">
            <>
              <MSelect
                id="tipo-prop-select"
                className={"form-input-md form-input-small"}
                options={
                  tipos_props.data
                    ? tipos_props.data.map((m) => {
                      return {
                        value: m.id.toString(),
                        label: ctx.lang === "es" ? m.es : m.en,
                      };
                    })
                    : []
                }
                style={{ width: 200 }}
                value={state.prop.id_tipo_props.toString()}
                onChange={(e) => {
                  const tipo = tipos_props.data
                    ? tipos_props.data.filter(
                      (d) => d.id === parseInt(e.target.value)
                    )
                    : [];
                  onFormChange({
                    prop: {
                      ...state.prop,
                      tipo:
                        tipo.length > 0 && tipo[0] != null
                          ? ctx.lang === "es"
                            ? tipo[0].es
                            : tipo[0].en
                          : "ND",
                      id_tipo_props: parseInt(e.target.value),
                    },
                  });
                }}
                label={
                  textos["tipo_prop"]
                    ? textos["tipo_prop"]
                    : "Texto No Definido"
                }
              />
              <FormGroup
                className={"form-input-md form-input-small"}
                labelClassName={"form-input-label"}
                value={state.prop?.descripcion}
                onChange={(e) => {
                  onFormChange({
                    prop: { ...state.prop, descripcion: e.target.value },
                  });
                }}
                label={
                  textos["descripcion"]
                    ? textos["descripcion"]
                    : "Texto No Definido"
                }
              />
              <AddButton
                text={
                  textos["agregar"] ? textos["agregar"] : "Texto No Definido"
                }
                aStyles={{ marginLeft: 0, width: 100 }}
                onClick={() => {
                  if (state.props) {
                    if (
                      state.prop &&
                      state.prop.id_tipo_props > 0 &&
                      state.prop.descripcion.length > 0
                    ) {
                      onFormChange({ props: state.props.concat([state.prop]) });
                    } else {
                      notify(
                        "warning",
                        textos["llenar_todos_los_campos"]
                          ? textos["llenar_todos_los_campos"].replace(
                            "[TYPE]",
                            textos["activos"]
                              ? textos["activos"]
                              : "Texto No Definido"
                          )
                          : "Texto No Definido"
                      );
                    }
                  } else {
                    onFormChange({ props: [state.prop] });
                  }
                }}
              />
            </>
          </MotionDiv>
        </MContainer>
      </Grid>
      <Grid item xs={12} md={9} lg={8}>
        <MotionDiv show={state.has_props} animation="fade">
          <MContainer direction="vertical">
            <Divider style={{ marginTop: 32 }} />
            <MTable
              columnsHeader={[
                <Typography
                  key={1}
                  fontSize={"1.2rem"}
                  fontWeight={600}
                  component={"p"}
                  sx={{ textAlign: "center" }}
                >
                  {textos["tipo_prop"]
                    ? textos["tipo_prop"]
                    : "Texto No Definido"}
                </Typography>,
                <Typography
                  key={2}
                  fontSize={"1.2rem"}
                  fontWeight={600}
                  component={"p"}
                  sx={{ textAlign: "center" }}
                >
                  {textos["descripcion"]
                    ? textos["descripcion"]
                    : "Texto No Definido"}
                </Typography>,
                <Typography
                  key={3}
                  fontSize={"1.2rem"}
                  fontWeight={600}
                  component={"p"}
                  sx={{ textAlign: "center" }}
                >
                  {textos["acciones"]
                    ? textos["acciones"]
                    : "Texto No Definido"}
                </Typography>,
              ]}
              loading={!state.props}
              data={
                state.props
                  ? state.props?.map((prop, j) => {
                    return {
                      tipo: (
                        <TableRow style={{ display: 'flex', justifyContent: 'center' }}>
                          {prop.tipo}
                        </TableRow>
                      ),
                      descripcion: (
                        <TableRow style={{ display: 'flex', justifyContent: 'center' }}>
                          {prop.descripcion}
                        </TableRow>
                      ),
                      delete: (
                        <TableRow style={{ display: 'flex', justifyContent: 'center' }}>
                          <Button
                            style={{
                              textTransform: "capitalize",
                              fontWeight: 800,
                              color: "#069CB1",
                            }}
                            onClick={() => {
                              if (state.props) {
                                onFormChange({
                                  props: state.props.filter((v, i) => i !== j),
                                });
                              }
                            }}
                            variant="outlined"
                            startIcon={<Close />}
                          >
                            {textos["eliminar"]
                              ? textos["eliminar"]
                              : "Texto No Definido"}
                          </Button>
                        </TableRow>
                      ),
                    };
                  })
                  : []
              }
            />
          </MContainer>
        </MotionDiv>
      </Grid>
      <Grid my={4} item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12} md={3} lg={4}>
        <MContainer direction="vertical">
          <MCheckboxGroup
            onChange={(e) => {
              onFormChange({ has_equipo_deportivo: e });
            }}
            id="mostrar-equipo-deportivo"
            labelClassName={"label-black-lg"}
            labelStyle={{ margin: 0 }}
            options={[
              textos["equipo_deportivo"]
                ? textos["equipo_deportivo"]
                : "Texto No Definido",
            ]}
            values={[state.has_equipo_deportivo]} //[(state) ? state.mostrar_anio_en_perfil : false]}
          />
          <MotionDiv show={state.has_equipo_deportivo} animation="fade">
            <>
              <MSelect
                id="tipo-equipo-deportivo-select"
                className={"form-input-md form-input-small"}
                options={
                  tipo_equipo_deportivo.data
                    ? tipo_equipo_deportivo.data.map((m) => {
                      return {
                        value: m.id.toString(),
                        label: ctx.lang === "es" ? m.es : m.en,
                      };
                    })
                    : []
                }
                style={{ width: 200 }}
                value={state.equipo_deportivo.id_tipo_equipo_deportivo.toString()}
                onChange={(e) => {
                  const tipo = tipo_equipo_deportivo.data
                    ? tipo_equipo_deportivo.data.filter(
                      (d) => d.id === parseInt(e.target.value)
                    )
                    : [];
                  onFormChange({
                    equipo_deportivo: {
                      ...state.equipo_deportivo,
                      tipo:
                        tipo.length > 0 && tipo[0] != null
                          ? ctx.lang === "es"
                            ? tipo[0].es
                            : tipo[0].en
                          : "ND",
                      id_tipo_equipo_deportivo: parseInt(e.target.value),
                    },
                  });
                }}
                label={
                  textos["tipo_equipo"]
                    ? textos["tipo_equipo"]
                    : "Texto No Definido"
                }
              />
              <FormGroup
                className={"form-input-md form-input-small"}
                labelClassName={"form-input-label"}
                value={state.equipo_deportivo?.descripcion}
                onChange={(e) => {
                  onFormChange({
                    equipo_deportivo: {
                      ...state.equipo_deportivo,
                      descripcion: e.target.value,
                    },
                  });
                }}
                label={
                  textos["descripcion"]
                    ? textos["descripcion"]
                    : "Texto No Definido"
                }
              />
              <AddButton
                text={
                  textos["agregar"] ? textos["agregar"] : "Texto No Definido"
                }
                aStyles={{ marginLeft: 0, width: 100 }}
                onClick={() => {
                  if (state.equipos_deportivos) {
                    if (
                      state.equipo_deportivo &&
                      state.equipo_deportivo.id_tipo_equipo_deportivo > 0 &&
                      state.equipo_deportivo.descripcion.length > 0
                    ) {
                      if (state.equipos_deportivos.length < 5) {
                        onFormChange({
                          equipos_deportivos: state.equipos_deportivos.concat([
                            state.equipo_deportivo,
                          ]),
                        });
                      } else {
                        notify(
                          "warning",
                          textos["activos_equipo_deportivo_max_validacion"]
                            ? textos["activos_equipo_deportivo_max_validacion"]
                            : "Texto No Definido"
                        );
                      }
                    } else {
                      notify(
                        "warning",
                        textos["llenar_todos_los_campos"]
                          ? textos["llenar_todos_los_campos"].replace(
                            "[TYPE]",
                            textos["activos"]
                              ? textos["activos"]
                              : "Texto No Definido"
                          )
                          : "Texto No Definido"
                      );
                    }
                  } else {
                    onFormChange({
                      equipos_deportivos: [state.equipo_deportivo],
                    });
                  }
                }}
              />
            </>
          </MotionDiv>
        </MContainer>
      </Grid>
      <Grid item xs={12} md={9} lg={8}>
        <MotionDiv show={state.has_equipo_deportivo} animation="fade">
          <MContainer direction="vertical">
            <Divider style={{ marginTop: 32 }} />
            <MTable
              columnsHeader={[
                <Typography
                  key={1}
                  fontSize={"1.2rem"}
                  fontWeight={600}
                  component={"p"}
                  sx={{ textAlign: "center" }}
                >
                  {textos["tipo_equipo"]
                    ? textos["tipo_equipo"]
                    : "Texto No Definido"}
                </Typography>,
                <Typography
                  key={2}
                  fontSize={"1.2rem"}
                  fontWeight={600}
                  component={"p"}
                  sx={{ textAlign: "center" }}
                >
                  {textos["descripcion"]
                    ? textos["descripcion"]
                    : "Texto No Definido"}
                </Typography>,
                <Typography
                  key={3}
                  fontSize={"1.2rem"}
                  fontWeight={600}
                  component={"p"}
                  sx={{ textAlign: "center" }}
                >
                  {textos["acciones"]
                    ? textos["acciones"]
                    : "Texto No Definido"}
                </Typography>,
              ]}
              loading={!state.equipos_deportivos}
              data={
                state.equipos_deportivos
                  ? state.equipos_deportivos?.map((ed, j) => {
                    return {
                      tipo: (
                        <TableRow style={{ display: 'flex', justifyContent: 'center' }}>
                          {ed.tipo}
                        </TableRow>
                      ),
                      descripcion: (
                        <TableRow style={{ display: 'flex', justifyContent: 'center' }}>
                          {ed.descripcion}
                        </TableRow>
                      ),
                      delete: (
                        <TableRow style={{ display: 'flex', justifyContent: 'center' }}>
                          <Button
                            style={{
                              textTransform: "capitalize",
                              fontWeight: 800,
                              color: "#069CB1",
                            }}
                            onClick={() => {
                              if (state.equipos_deportivos) {
                                onFormChange({
                                  equipos_deportivos:
                                    state.equipos_deportivos.filter(
                                      (v, i) => i !== j
                                    ),
                                });
                              }
                            }}
                            variant="outlined"
                            startIcon={<Close />}
                          >
                            {textos["eliminar"]
                              ? textos["eliminar"]
                              : "Texto No Definido"}
                          </Button>
                        </TableRow>
                      ),
                    };
                  })
                  : []
              }
            />
          </MContainer>
        </MotionDiv>
      </Grid>
    </Grid>
  );
};
