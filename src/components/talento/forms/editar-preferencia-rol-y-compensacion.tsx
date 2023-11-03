import { useEffect, useState, type FC, useContext } from "react";
import { FormGroup } from "~/components";
import { Alert, Divider, Grid, IconButton, Typography } from "@mui/material";
import { MContainer } from "~/components/layout/MContainer";
import {
  MCheckboxGroup,
  MSelect,
  MRadioGroup,
  AddButton,
  Tag,
} from "~/components/shared";
import { type TalentoFormPreferencias } from "~/pages/talento/editar-perfil";
import { api } from "~/utils/api";
import MotionDiv from "~/components/layout/MotionDiv";
import useNotify from "~/hooks/useNotify";
import CloseIcon from "@mui/icons-material/Close";
import { MTooltip } from "~/components/shared/MTooltip";
import AppContext from "~/context/app";
import useLang from "~/hooks/useLang";

interface Props {
  state: TalentoFormPreferencias;
  onFormChange: (input: { [id: string]: unknown }) => void;
}

export const EditarPreferenciaRolYCompensacionTalento: FC<Props> = ({
  onFormChange,
  state,
}) => {
  const ctx = useContext(AppContext);
  const textos = useLang(ctx.lang);

  const { notify } = useNotify();

  const [otrasProfesionesInput, setOtrasProfesionesInput] =
    useState<string>("");
  const [locacionesAdicionalesSelect, setLocacionesAdicionalesSelect] =
    useState<string>("0");

  const [locacionPrincipalSelect, setLocacionPrincipalSelect] =
    useState<string>(state.id_estado_principal.toString());

  const [tieneAgenciaRepresentante, setTieneAgenciaRepresentante] =
    useState<boolean>(false);
  const [estaEmbarazada, setEstaEmbarazada] = useState<boolean>(false);

  const estados_republica = api.catalogos.getEstadosRepublica.useQuery(
    undefined,
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  const tipos_trabajo = api.catalogos.getTipoDeTrabajos.useQuery(undefined, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const tipos_interes_proyectos =
    api.catalogos.getTiposInteresesEnProyectos.useQuery(undefined, {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    });

  const tipos_documentos = api.catalogos.getTipoDeDocumentos.useQuery(
    undefined,
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  const tipos_disponibilidad = api.catalogos.getTipoDeDisponibilidad.useQuery(
    undefined,
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  const is_loading =
    estados_republica.isFetching ||
    tipos_trabajo.isFetching ||
    tipos_documentos.isFetching ||
    tipos_interes_proyectos.isFetching ||
    tipos_disponibilidad.isFetching;

  useEffect(() => {
    if (state.preferencias.meses_embarazo > 0) {
      setEstaEmbarazada(true);
    } else {
      setEstaEmbarazada(false);
    }
  }, [state.preferencias.meses_embarazo]);

  useEffect(() => {
    if (
      state.preferencias.nombre_agente !== "" ||
      state.preferencias.contacto_agente !== ""
    ) {
      setTieneAgenciaRepresentante(true);
    } else {
      setTieneAgenciaRepresentante(false);
    }
  }, [state.preferencias.nombre_agente, state.preferencias.contacto_agente]);

  const es_ingles = ctx.lang === "en";

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} style={{ paddingTop: 0 }}>
        <Alert
          severity="info"
          icon={false}
          sx={{
            textAlign: "center",
            justifyContent: "center",
            padding: "0px 16px",
          }}
        >
          {textos["preferencias_rol_alerta"]
            ? textos["preferencias_rol_alerta"]
            : "Texto No Definido"}
        </Alert>
      </Grid>
      <Grid item xs={6}>
        <MCheckboxGroup
          onAllOptionChecked={(checked) => {
            onFormChange({
              tipo_trabajo: !checked
                ? []
                : tipos_trabajo.data
                  ? tipos_trabajo.data.map((v) => v.id)
                  : [],
            });
          }}
          direction="vertical"
          title={textos["tipo_de_trabajo"]}
          onChange={(e, i) => {
            if (tipos_trabajo.data) {
              const tipo_trabajo = tipos_trabajo.data[i];
              if (tipo_trabajo) {
                let nuevosTipos = [];
                if (state.tipo_trabajo.includes(tipo_trabajo?.id)) {
                  nuevosTipos = state.tipo_trabajo.filter(
                    (id) => id !== tipo_trabajo.id
                  );
                } else {
                  nuevosTipos = [...state.tipo_trabajo, tipo_trabajo.id];
                }
                onFormChange({
                  tipo_trabajo: nuevosTipos,
                });
              }
            }
          }}
          id="tipo-trabajo"
          labelStyle={{ margin: 0 }}
          style={{ padding: "4px" }}
          options={
            tipos_trabajo.data
              ? tipos_trabajo.data.map((t) => (es_ingles ? t.en : t.es))
              : []
          }
          values={
            tipos_trabajo.data
              ? tipos_trabajo.data.map((v) => state.tipo_trabajo.includes(v.id))
              : [false]
          }
        />
      </Grid>
      <Grid item xs={6}>
        <MTooltip
          sx={{ mt: 6 }}
          text={
            textos["preferencias_rol_tipo_de_trabajo_tooltip"]
              ? textos["preferencias_rol_tipo_de_trabajo_tooltip"]
              : "Texto No Definido"
          }
          color="orange"
          placement="right"
        />
      </Grid>
      <Grid my={2} item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12}>
        <MContainer direction="vertical">
          <MContainer direction="horizontal">
            
            <Typography fontSize={"1.2rem"} fontWeight={600} component={"p"}>
              ¿
              {textos["preferencias_rol_interesado_trabajo_extra_title"]
                ? textos["preferencias_rol_interesado_trabajo_extra_title"]
                : "Texto No Definido"}
              ?
              {/* <MTooltip
                text={`¿${
                  textos["preferencias_rol_interesado_trabajo_extra_tooltip"]
                    ? textos[
                        "preferencias_rol_interesado_trabajo_extra_tooltip"
                      ]
                    : "Texto No Definido"
                }?`}
                color="orange"
                placement="right"
              /> */}
              <MTooltip
                    text={
                      <>
                        <Typography fontSize={"12px"} fontWeight={800}>
                          {textos["preferencias_rol_interesado_trabajo_extra_tooltip_tittle"]
                            ? textos["preferencias_rol_interesado_trabajo_extra_tooltip_tittle"]
                            : "Texto No Definido"}
                        </Typography>
                        <Typography fontSize={"12px"} fontWeight={400}>
                          {textos["preferencias_rol_interesado_trabajo_extra_tooltip"]
                            ? textos["preferencias_rol_interesado_trabajo_extra_tooltip"]
                            : "Texto No Definido"}
                        </Typography>
                      </>
                    }
                    color="orange"
                    placement="right"
                  />
            </Typography>
          </MContainer>
          <Typography
            fontSize={".9rem"}
            fontWeight={700}
            style={{ color: "#069cb1" }}
            component={"p"}
          >
            {textos["preferencias_rol_interesado_trabajo_extra_subtitle"]
              ? textos["preferencias_rol_interesado_trabajo_extra_subtitle"]
              : "Texto No Definido"}
            ?
          </Typography>
          <MRadioGroup
            id="interesado-trabajo-extra-group"
            options={[
              textos["si"] ? textos["si"] : "",
              textos["no"] ? textos["no"] : "",
            ]}
            disabled={false}
            labelStyle={{
              marginLeft: 112,
              fontWeight: 800,
              fontSize: "0.72rem",
              color: "#069cb1",
            }}
            value={
              state.preferencias.interesado_en_trabajos_de_extra
                ? textos["si"]
                  ? textos["si"]
                  : ""
                : textos["no"]
                  ? textos["no"]
                  : ""
            }
            onChange={(e) => {
              onFormChange({
                preferencias: {
                  interesado_en_trabajos_de_extra:
                    e.currentTarget.value.includes(
                      textos["si"] ? textos["si"] : "Texto No Definido"
                    ),
                },
              });
            }}
            label=""
          />
        </MContainer>
      </Grid>
      <Grid my={2} item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12}>
        <MCheckboxGroup
          direction="vertical"
          title={
            textos["preferencias_rol_interes_en_proyectos"]
              ? textos["preferencias_rol_interes_en_proyectos"]
              : "Texto No Definido"
          }
          textTooltip={
            textos["preferencias_rol_interes_en_proyectos_tooltip"]
              ? textos["preferencias_rol_interes_en_proyectos_tooltip"]
              : "Texto No Definido"
          }
          onChange={(e, i) => {
            if (tipos_interes_proyectos.data) {
              const tipo_interes_proyecto = tipos_interes_proyectos.data[i];
              if (tipo_interes_proyecto) {
                let nuevosTipos = [];
                if (
                  state.interes_en_proyectos.includes(tipo_interes_proyecto?.id)
                ) {
                  nuevosTipos = state.interes_en_proyectos.filter(
                    (id) => id !== tipo_interes_proyecto.id
                  );
                } else {
                  nuevosTipos = [
                    ...state.interes_en_proyectos,
                    tipo_interes_proyecto.id,
                  ];
                }
                onFormChange({
                  interes_en_proyectos: nuevosTipos,
                });
              }
            }
          }}
          id="interes-proyectos-checkbox"
          labelStyle={{ margin: 0 }}
          options={
            tipos_interes_proyectos.data
              ? tipos_interes_proyectos.data.map((t) =>
                es_ingles ? t.en : t.es
              )
              : []
          }
          values={
            tipos_interes_proyectos.data
              ? tipos_interes_proyectos.data.map((v) =>
                state.interes_en_proyectos.includes(v.id)
              )
              : [false]
          } //[(state) ? state.mostrar_anio_en_perfil : false]}
        />
      </Grid>
      <Grid my={2} item xs={12}>
        <Divider />
      </Grid>

      <Grid item xs={12}>
        <MContainer direction="vertical">
          <MContainer direction="horizontal">
            <Typography className="left-tool" fontSize={"1.2rem"} fontWeight={600} component={"p"}>
              {textos["preferencias_rol_locacion"]
                ? textos["preferencias_rol_locacion"]
                : "Texto No Definido"}
              <MTooltip
                text={
                  textos["preferencias_rol_locacion_tooltip"]
                    ? textos["preferencias_rol_locacion_tooltip"]
                    : "Texto No Definido"
                }
                color="orange"
                placement="right"
              />
            </Typography>
          </MContainer>

          <MContainer direction="horizontal" styles={{ gap: 40 }}>
            <MContainer direction="vertical">
              <MSelect
                loading={is_loading}
                id="locacion-principal-select"
                options={
                  estados_republica.isSuccess && estados_republica.data
                    ? estados_republica.data.map((u) => {
                      return { value: u.id.toString(), label: u.es };
                    })
                    : []
                }
                className={"form-input-md form-input-small"}
                style={{ width: 250 }}
                value={locacionPrincipalSelect}
                labelStyle={{ fontWeight: 400 }}
                onChange={(e) => {
                  setLocacionPrincipalSelect(e.target.value);
                  if (
                    state.locaciones.some((locacion) => locacion.es_principal)
                  ) {
                    onFormChange({
                      locaciones: state.locaciones.map((locacion) => {
                        if (locacion.es_principal)
                          return {
                            es_principal: true,
                            id_estado_republica: parseInt(e.target.value),
                          };
                        return locacion;
                      }),
                    });
                  } else {
                    onFormChange({
                      locaciones: [
                        {
                          es_principal: true,
                          id_estado_republica: parseInt(e.target.value),
                        },
                        ...state.locaciones,
                      ],
                    });
                  }
                }}
                label={
                  textos["principal"]
                    ? textos["principal"]
                    : "Texto No Definido"
                }
              />
            </MContainer>

            <MContainer direction="vertical">
              <MSelect
                loading={is_loading}
                id="locacion-principal-select"
                labelStyle={{ fontWeight: 400 }}
                className={"form-input-md form-input-small"}
                options={
                  estados_republica.isSuccess && estados_republica.data
                    ? estados_republica.data.map((u) => {
                      return { value: u.id.toString(), label: u.es };
                    })
                    : []
                }
                style={{ width: 250 }}
                value={locacionesAdicionalesSelect}
                onChange={(e) => {
                  setLocacionesAdicionalesSelect(e.target.value);
                }}
                label={
                  textos["adicional"]
                    ? textos["adicional"]
                    : "Texto No Definido"
                }
              />
              <AddButton
                aStyles={{ fontSize: '13px', fontWeight: 500 }}
                text={
                  textos["preferencias_rol_locacion_button"]
                    ? textos["preferencias_rol_locacion_button"]
                    : "Texto No Definido"
                }
                onClick={() => {
                  if (parseInt(locacionesAdicionalesSelect) > 0) {
                    if (
                      state.locaciones.some(
                        (locacion) =>
                          locacion.id_estado_republica ===
                          parseInt(locacionesAdicionalesSelect)
                      )
                    )
                      return;
                    onFormChange({
                      locaciones: [
                        ...state.locaciones,
                        {
                          es_principal: false,
                          id_estado_republica: parseInt(
                            locacionesAdicionalesSelect
                          ),
                        },
                      ],
                    });
                  } else {
                    notify(
                      "warning",
                      textos[
                        "preferencias_rol_locacion_empty_locacion_validation"
                      ]
                        ? textos[
                        "preferencias_rol_locacion_empty_locacion_validation"
                        ]
                        : "Texto No Definido"
                    );
                  }
                }}
              />

              <MContainer
                direction="horizontal"
                styles={{ gap: 10, marginTop: 20 }}
              >
                {state.locaciones.map((locacion) => (
                  <span
                    key={locacion.id_estado_republica}
                    style={{
                      position: "relative",
                      borderRadius: 8,
                      width: 200,
                      textAlign: "center",
                      backgroundColor: "#0ab2c8",
                      padding: "5px 10px",
                      color: "white",
                    }}
                  >
                    {estados_republica.data
                      ?.filter(
                        (estado) => estado.id === locacion.id_estado_republica
                      )
                      .map((estado) => estado.es)}
                    <IconButton
                      onClick={() => {
                        if (locacion.es_principal) {
                          setLocacionPrincipalSelect('0');
                        } else {
                          setLocacionesAdicionalesSelect('0');
                        }
                        onFormChange({
                          locaciones: state.locaciones.filter(l => l.id_estado_republica !== locacion.id_estado_republica)
                        });
                      }}
                      style={{
                        position: "absolute",
                        color: "white",
                        padding: 0,
                        left: 0,
                        marginLeft: 8,
                      }}
                      aria-label="Eliminar Equipo Deportivo"
                      component="label"
                    >
                      <CloseIcon style={{ width: 16 }} />
                    </IconButton>
                  </span>
                ))}
              </MContainer>
            </MContainer>
          </MContainer>
        </MContainer>
      </Grid>

      <Grid my={2} item xs={12}>
        <Divider />
      </Grid>

      <Grid item xs={12}>
        <MContainer direction="vertical">
          <Typography fontSize={"1.2rem"} fontWeight={600} component={"p"}>
            {textos["agencia"] ? textos["agencia"] : "Texto No Definido"}/
            {textos["representante"]
              ? textos["representante"]
              : "Texto No Definido"}
          </Typography>

          <MRadioGroup
            id="agencia-representante-radio"
            options={[
              textos["si"] ? textos["si"] : "",
              textos["no"] ? textos["no"] : "",
            ]}
            labelStyle={{
              marginLeft: 112,
              fontWeight: 800,
              fontSize: "0.72rem",
              color: "#069cb1",
            }}
            value={
              tieneAgenciaRepresentante
                ? textos["si"]
                  ? textos["si"]
                  : ""
                : textos["no"]
                  ? textos["no"]
                  : ""
            }
            onChange={(e) => {
              setTieneAgenciaRepresentante(
                e.currentTarget.value.includes(
                  textos["si"] ? textos["si"] : "Texto No Definido"
                )
              );
            }}
            label=""
          />
          <MotionDiv show={tieneAgenciaRepresentante} animation="fade">
            <MContainer direction="horizontal" styles={{ gap: 40 }}>
              <FormGroup
                className={"form-input-md form-input-small"}
                value={state.preferencias.nombre_agente}
                onChange={(e) => {
                  onFormChange({
                    preferencias: {
                      ...state.preferencias,
                      nombre_agente: e.currentTarget.value,
                    },
                  });
                }}
                label={
                  textos["nombre"] ? textos["nombre"] : "Texto No Definido"
                }
              />

              <FormGroup
                className={"form-input-md form-input-small"}
                type="email"
                textBlueLabel={
                  textos["correo_electronico"]
                    ? textos["correo_electronico"]
                    : "Texto No Definido"
                }
                value={state.preferencias.contacto_agente}
                onChange={(e) => {
                  onFormChange({
                    preferencias: {
                      ...state.preferencias,
                      contacto_agente: e.currentTarget.value,
                    },
                  });
                }}
                label={
                  textos["contacto"] ? textos["contacto"] : "Texto No Definido"
                }
              />
            </MContainer>
          </MotionDiv>
        </MContainer>
      </Grid>

      <Grid my={2} item xs={12}>
        <Divider />
      </Grid>

      <Grid item xs={12}>
        <MContainer direction="vertical">
          <Typography fontSize={"1.2rem"} fontWeight={600} component={"p"}>
            {textos["documentos"] ? textos["documentos"] : "Texto No Definido"}
          </Typography>

          <MCheckboxGroup
            direction="vertical"
            title={
              textos["preferencias_rol_documentos_subtitulo"]
                ? textos["preferencias_rol_documentos_subtitulo"]
                : "Texto No Definido"
            }
            onChange={(e, i) => {
              if (tipos_documentos.data) {
                const tipo_documento = tipos_documentos.data[i];
                if (tipo_documento) {
                  let nuevosTipos = [];
                  if (
                    state.documentos
                      .map((obj) => obj.id_documento)
                      .includes(tipo_documento?.id)
                  ) {
                    nuevosTipos = state.documentos.filter(
                      (obj) => obj.id_documento !== tipo_documento.id
                    );
                  } else {
                    nuevosTipos = [
                      ...state.documentos,
                      { id_documento: tipo_documento.id, descripcion: "" },
                    ];
                  }
                  onFormChange({
                    documentos: nuevosTipos,
                  });
                }
              }
            }}
            id="documentos-checkbox"
            labelStyle={{ margin: 0 }}
            titleStyle={{ paddingBottom: "10px" }}
            style={{ padding: "4px" }}
            fontWeight={400}
            options={
              tipos_documentos.data
                ? tipos_documentos.data.map((t) => (es_ingles ? t.en : t.es))
                : []
            }
            values={
              tipos_documentos.data
                ? tipos_documentos.data.map((v) =>
                  state.documentos
                    .map((documento) => documento.id_documento)
                    .includes(v.id)
                )
                : [false]
            } //[(state) ? state.mostrar_anio_en_perfil : false]}
          />

          {
            <MotionDiv
              show={state.documentos.some(
                (documento) => documento?.id_documento === 99
              )}
              animation="fade"
            >
              <FormGroup
                className={"form-input-md form-input-small"}
                labelClassName={"form-input-label"}
                value={
                  state.documentos.filter(
                    (documento) => documento?.id_documento === 99
                  )[0]?.descripcion
                }
                onChange={(e) => {
                  onFormChange({
                    documentos: state.documentos.map((documento) => {
                      if (documento?.id_documento === 99) {
                        return {
                          id_documento: 99,
                          descripcion: e.target.value || "",
                        };
                      }
                      return documento;
                    }),
                  });
                }}
              />
            </MotionDiv>
          }
        </MContainer>
      </Grid>

      <Grid my={2} item xs={12}>
        <Divider />
      </Grid>

      <Grid item xs={12}>
        <MContainer direction="vertical">
          <Typography
            fontSize={"1.2rem"}
            fontWeight={600}
            component={"p"}
            style={{ paddingBottom: "8px" }}
          >
            {textos["disponibilidad_para"]
              ? textos["disponibilidad_para"]
              : "Texto No Definido"}
          </Typography>

          <MCheckboxGroup
            direction="horizontal"
            title={
              textos["preferencias_rol_disponibilidad_subtitulo"]
                ? textos["preferencias_rol_disponibilidad_subtitulo"]
                : "Texto No Definido"
            }
            onChange={(e, i) => {
              if (tipos_disponibilidad.data) {
                const tipo_disponibilidad = tipos_disponibilidad.data[i];
                if (tipo_disponibilidad) {
                  let nuevosTipos = [];
                  if (state.disponibilidad.includes(tipo_disponibilidad?.id)) {
                    nuevosTipos = state.disponibilidad.filter(
                      (id) => id !== tipo_disponibilidad.id
                    );
                  } else {
                    nuevosTipos = [
                      ...state.disponibilidad,
                      tipo_disponibilidad.id,
                    ];
                  }
                  onFormChange({
                    disponibilidad: nuevosTipos,
                  });
                }
              }
            }}
            id="disponibilidad-para-checkboxgroup"
            labelStyle={{ margin: 0, width: "32%" }}
            titleStyle={{ paddingBottom: "15px", fontWeight: 500 }}
            style={{ padding: "6px" }}
            options={
              tipos_disponibilidad.data
                ? tipos_disponibilidad.data.map((t) =>
                  es_ingles ? t.en : t.es
                )
                : []
            }
            values={
              tipos_disponibilidad.data
                ? tipos_disponibilidad.data.map((v) =>
                  state.disponibilidad.includes(v.id)
                )
                : [false]
            } //[(state) ? state.mostrar_anio_en_perfil : false]}
          />
        </MContainer>
      </Grid>

      <Grid my={2} item xs={12}>
        <Divider />
      </Grid>

      <Grid item xs={12}>
        <Typography
          fontSize={"1.2rem"}
          fontWeight={600}
          component={"p"}
          sx={{ marginBottom: 1 }}
        >
          {textos["preferencias_rol_otras_profesiones"]
            ? textos["preferencias_rol_otras_profesiones"]
            : "Texto No Definido"}
          <MTooltip
            text={
              textos["preferencias_rol_otras_profesiones_tooltip"]
                ? textos["preferencias_rol_otras_profesiones_tooltip"]
                : "Texto No Definido"
            }
            color="orange"
            placement="right"
          />
        </Typography>
        <FormGroup
          className={"form-input-md form-input-small"}
          labelClassName={"form-input-label"}
          value={otrasProfesionesInput}
          onChange={(e) => {
            setOtrasProfesionesInput(e.currentTarget.value);
          }}
        />
        <AddButton
          text={`${textos["agregar"] ? textos["agregar"] : "Texto No Definido"
            }`}
          onClick={() => {
            if (!otrasProfesionesInput) return;
            onFormChange({
              otras_profesiones: [
                ...state.otras_profesiones,
                otrasProfesionesInput,
              ],
            });
            setOtrasProfesionesInput("");
          }}
        />

        <MContainer direction="horizontal" styles={{ gap: 10, marginTop: 20 }}>
          {state.otras_profesiones.map((profesion) => (
            <Tag
              key={profesion}
              text={profesion}
              onRemove={() => {
                onFormChange({
                  otras_profesiones: state.otras_profesiones.filter(
                    (p) => p != profesion
                  ),
                });
              }}
            />
          ))}
        </MContainer>
      </Grid>

      <Grid my={2} item xs={12}>
        <Divider />
      </Grid>

      <Grid item xs={12}>
        <MContainer direction="horizontal">
          <MContainer
            direction="horizontal"
            styles={{ alignItems: "center", gap: 40 }}
          >
            <Typography fontSize={"1.2rem"} fontWeight={600} component={"p"}>
              {textos["embarazo"] ? textos["embarazo"] : "Texto No Definido"}
            </Typography>
            <MRadioGroup
              id="embarazo-radio"
              options={[
                textos["si"] ? textos["si"] : "",
                textos["no"] ? textos["no"] : "",
              ]}
              labelStyle={{
                marginLeft: 112,
                fontWeight: 800,
                fontSize: "0.72rem",
                color: "#069cb1",
              }}
              value={
                estaEmbarazada
                  ? textos["si"]
                    ? textos["si"]
                    : ""
                  : textos["no"]
                    ? textos["no"]
                    : ""
              }
              onChange={(e) => {
                setEstaEmbarazada(
                  e.currentTarget.value.includes(
                    textos["si"] ? textos["si"] : "Texto No Definido"
                  )
                );
              }}
              label=""
            />

            <MotionDiv show={estaEmbarazada} animation="fade">
              <MContainer direction="horizontal">
                <MSelect
                  loading={is_loading}
                  id="locacion-principal-select"
                  labelStyle={{ fontWeight: 400 }}
                  options={Array.from({ length: 40 }).map((_, index) => ({
                    value: `${index + 1}`,
                    label: `Semana ${index + 1}`,
                  }))}
                  style={{ width: "100px !important" }}
                  value={`${state.preferencias.meses_embarazo}`}
                  onChange={(e) => {
                    onFormChange({
                      preferencias: {
                        ...state.preferencias,
                        meses_embarazo:
                          e.target.value === "" ? 0 : parseInt(e.target.value),
                      },
                    });
                  }}
                  label={
                    textos["meses"] ? textos["meses"] : "Texto No Definido"
                  }
                />
              </MContainer>
            </MotionDiv>
          </MContainer>
        </MContainer>
      </Grid>
    </Grid>
  );
};
