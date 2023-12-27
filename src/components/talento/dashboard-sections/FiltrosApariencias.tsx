import {
  Divider,
  Grid,
  Link,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import { useContext, useMemo, useState } from "react";
import { SectionTitle } from "~/components/shared";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { MedidasDialog } from "../dialogs/MedidasDialog";
import AppContext from "~/context/app";
import useLang from "~/hooks/useLang";

export const FiltrosApariencias = (props: {
  id_talento: number;
  read_only: boolean;
}) => {
  const ctx = useContext(AppContext);
  const textos = useLang(ctx.lang);

  const router = useRouter();
  const [dialog, setDialog] = useState<{
    opened: boolean;
    data: Map<string, unknown>;
  }>({ opened: false, data: new Map() });

  const filtros = api.talentos.getFiltrosAparienciaByIdTalento.useQuery(
    { id: props.id_talento },
    {
      refetchOnWindowFocus: false,
    }
  );

  const medidas = api.talentos.getMedidasByIdTalento.useQuery(
    props.id_talento,
    {
      refetchOnWindowFocus: false,
    }
  );

  const loading = filtros.isFetching;
  const data = useMemo(() => {
    if (filtros.data) {
      console.log("filtros_data", filtros.data);
      return filtros.data;
    }
    return null;
  }, [filtros.data]);

  const medidas_grouped = useMemo(() => {
    if (medidas.data) {
      const _medidas = [
        {
          parent: textos["generales"]
            ? textos["generales"]
            : "Texto No Definido",
          childrens: [
            {
              name: `${
                textos["cadera"] ? textos["cadera"] : "Texto No Definido"
              } (cm)`,
              value: medidas.data.general_cadera,
            },
            {
              name: `${
                textos["entrepierna"]
                  ? textos["entrepierna"]
                  : "Texto No Definido"
              } (cm)`,
              value: medidas.data.general_entrepiernas,
            },
            {
              name: textos["guantes"] ? textos["guantes"] : "Texto No Definido",
              value: medidas.data.general_guantes,
            },
            {
              name: textos["sombrero"]
                ? textos["sombrero"]
                : "Texto No Definido",
              value: medidas.data.general_sombrero,
            },
          ],
        },
        {
          parent: textos["hombre"] ? textos["hombre"] : "Texto No Definido",
          childrens: [
            {
              name: `${
                textos["pecho"] ? textos["pecho"] : "Texto No Definido"
              } (cm)`,
              value: medidas.data.hombre_pecho,
            },
            {
              name: `${
                textos["cuello"] ? textos["cuello"] : "Texto No Definido"
              } (cm)`,
              value: medidas.data.hombre_cuello,
            },
            {
              name: `${
                textos["mangas"] ? textos["mangas"] : "Texto No Definido"
              } (${
                textos["largo"] ? textos["largo"] : "Texto No Definido"
              } cm)`,
              value: medidas.data.hombre_mangas,
            },
            {
              name: textos["saco"] ? textos["saco"] : "Texto No Definido",
              value: medidas.data.hombre_saco,
            },
            {
              name: textos["playera"] ? textos["playera"] : "Texto No Definido",
              value: medidas.data.hombre_playera,
            },
            {
              name: `${
                textos["calzado"] ? textos["calzado"] : "Texto No Definido"
              } (cm)`,
              value: medidas.data.hombre_calzado,
            },
          ],
        },
        {
          parent: textos["mujer"] ? textos["mujer"] : "Texto No Definido",
          childrens: [
            {
              name: textos["vestido"] ? textos["vestido"] : "Texto No Definido",
              value: medidas.data.mujer_vestido,
            },
            {
              name: `${
                textos["busto"] ? textos["busto"] : "Texto No Definido"
              } (cm)`,
              value: medidas.data.mujer_busto,
            },
            {
              name: textos["copa"] ? textos["copa"] : "Texto No Definido",
              value: medidas.data.mujer_copa,
            },
            {
              name: `${
                textos["cadera"] ? textos["cadera"] : "Texto No Definido"
              } (cm)`,
              value: medidas.data.mujer_cadera,
            },
            {
              name: textos["playera"] ? textos["playera"] : "Texto No Definido",
              value: medidas.data.mujer_playera,
            },
            {
              name: `${
                textos["playera"] ? textos["playera"] : "Texto No Definido"
              } (cm)`,
              value: medidas.data.mujer_pants,
            },
            {
              name: `${
                textos["calzado"] ? textos["calzado"] : "Texto No Definido"
              } (cm)`,
              value: medidas.data.mujer_calzado,
            },
          ],
        },
        {
          parent: `${textos["nino"] ? textos["nino"] : "Texto No Definido"} / ${
            textos["nina"] ? textos["nina"] : "Texto No Definido"
          }`,
          childrens: [
            {
              name: `${
                textos["nino"] ? textos["nino"] : "Texto No Definido"
              } 4-18 ${textos["anio"] ? textos["anio"] : "Texto No Definido"}s`,
              value: medidas.data.nino_4_18_anios,
            },
            {
              name: `${
                textos["nina"] ? textos["nina"] : "Texto No Definido"
              } 4-18 ${textos["anio"] ? textos["anio"] : "Texto No Definido"}s`,
              value: medidas.data.nina_4_18_anios,
            },
            {
              name: `Toddler (${
                textos["bebe"] ? textos["bebe"] : "Texto No Definido"
              })`,
              value: medidas.data.toddler,
            },
            {
              name: `${
                textos["bebe"] ? textos["bebe"] : "Texto No Definido"
              } (${textos["meses"] ? textos["meses"] : "Texto No Definido"})`,
              value: medidas.data.bebe_meses,
            },
            {
              name: textos["calzado_ninos"]
                ? textos["calzado_ninos"]
                : "Texto No Definido",
              value: medidas.data.calzado_ninos,
            },
          ],
        },
      ];
      const _medidas_filtered = _medidas
        .filter((entry) => {
          return entry.childrens.filter((child) => child.value).length > 0;
        })
        .map((entry) => {
          entry.childrens = entry.childrens.filter((child) => child.value);
          return entry;
        });
      console.log("medidas", _medidas_filtered);
      return _medidas_filtered.length === 0 ? null : _medidas_filtered;
    }
    return null;
  }, [medidas.data, textos]);

  const tatuajes = useMemo(() => {
    if (data) {
      if (data.tatuajes.length > 0) {
        return data.tatuajes.map((t, i) => {
          const _divider =
            i < data.tatuajes.length - 1 ? <Divider className="my-2" /> : null;
          return (
            <div key={i}>
              <Typography fontSize={"1.2rem"} fontWeight={400}>
                {ctx.lang === "es" ? t.tipo_tatuaje.es : t.tipo_tatuaje.en}
              </Typography>
              <Typography fontSize={"1rem"} fontWeight={400}>
                {t.descripcion}
              </Typography>
              {_divider}
            </div>
          );
        });
      } else {
        return (
          <Typography fontSize={"1rem"} fontWeight={400} variant="body1">
            {"N/A"}
          </Typography>
        );
      }
    }
    return null;
  }, [data, ctx.lang]);

  const piercings = useMemo(() => {
    if (data) {
      if (data.piercings.length > 0) {
        return data.piercings.map((t, i) => {
          const _divider =
            i < data.piercings.length - 1 ? <Divider className="my-2" /> : null;
          return (
            <div key={i}>
              <Typography fontSize={"1.2rem"} fontWeight={400}>
                {ctx.lang === "es" ? t.piercing.es : t.piercing.en}
              </Typography>
              <Typography fontSize={"1rem"} fontWeight={400}>
                {t.descripcion}
              </Typography>
              {_divider}
            </div>
          );
        });
      } else {
        return (
          <Typography fontSize={"1rem"} fontWeight={400} variant="body1">
            {"N/A"}
          </Typography>
        );
      }
    }
    return null;
  }, [data, ctx.lang]);

  return (
    <>
      <Grid id={`${textos['medidas']}`} container sx={{ mt: 10 }}>
        <Grid item xs={12}>
          <SectionTitle
            title={
              textos["apariencia"]
                ? `${textos["apariencia"]}`
                : "Texto No definido"
            }
            textButton={
              textos["editar"] ? textos["editar"] : "Texto No definido"
            }
            dividerSx={{
              borderTop: "2px solid #069cb1",
            }}
            titleSx={{
              fontSize: "24px",
            }}
            onClickButton={
              !props.read_only
                ? () => {
                    // eslint-disable-next-line @typescript-eslint/no-floating-promises
                    router.push(
                      `/talento/editar-perfil?step=7&id_talento=${props.id_talento}`
                    );
                  }
                : undefined
            }
          />
        </Grid>
        <Grid item xs={6} mt={4}>
          <Typography
            fontSize={"1.4rem"}
            sx={{ color: "#069cb1" }}
            fontWeight={600}
          >
            {textos["rango_de_edad_a_interpretar"]
              ? `${textos["rango_de_edad_a_interpretar"]}:`
              : "Texto No definido"}
          </Typography>
        </Grid>
        <Grid item alignItems={"self-start"} xs={6} mt={4}>
          <Typography fontSize={"1rem"} fontWeight={400} variant="body1">
            {loading ? (
              <Skeleton className="md-skeleton" />
            ) : data ? (
              `${data.rango_inicial_edad} a ${data.rango_final_edad}`
            ) : (
              "N/D"
            )}
          </Typography>
        </Grid>
        <Grid item my={2} xs={12}>
          <Divider />
        </Grid>

        <Grid item xs={6} mt={4}>
          <Typography
            fontSize={"1.4rem"}
            sx={{ color: "#069cb1" }}
            fontWeight={600}
          >
            {textos["se_identifica_como"]
              ? `${textos["se_identifica_como"]}:`
              : "Texto No definido"}
          </Typography>
        </Grid>
        <Grid item alignItems={"self-start"} xs={6} mt={4}>
          <Typography fontSize={"1rem"} fontWeight={400} variant="body1">
            {loading ? (
              <Skeleton className="md-skeleton" />
            ) : data && data.genero ? (
              ctx.lang === "es" ? (
                data.genero.es
              ) : (
                data.genero.en
              )
            ) : (
              "N/D"
            )}
          </Typography>
        </Grid>
        <Grid item my={2} xs={12}>
          <Divider />
        </Grid>

        <Grid item xs={6} mt={4}>
          <Typography
            fontSize={"1.4rem"}
            sx={{ color: "#069cb1" }}
            fontWeight={600}
          >
            {textos["interesado_en_interpretar"]
              ? `${textos["interesado_en_interpretar"]}:`
              : "Texto No definido"}
          </Typography>
        </Grid>
        <Grid item alignItems={"self-start"} xs={6} mt={4}>
          <Typography fontSize={"1rem"} fontWeight={400} variant="body1">
            {loading ? (
              <Skeleton className="md-skeleton" />
            ) : data && data.generos_interesados_en_interpretar.length > 0 ? (
              data.generos_interesados_en_interpretar
                .map((g) => (ctx.lang === "es" ? g.genero.es : g.genero.en))
                .join(", ")
            ) : (
              "N/A"
            )}
          </Typography>
        </Grid>
        <Grid item my={2} xs={12}>
          <Divider />
        </Grid>

        <Grid item xs={6} mt={4}>
          <Typography
            fontSize={"1.4rem"}
            sx={{ color: "#069cb1" }}
            fontWeight={600}
          >
            {textos["apariencia_etnica"]
              ? `${textos["apariencia_etnica"]}:`
              : "Texto No definido"}
          </Typography>
        </Grid>
        <Grid item alignItems={"self-start"} xs={6} mt={4}>
          <Typography fontSize={"1rem"} fontWeight={400} variant="body1">
            {loading ? (
              <Skeleton className="md-skeleton" />
            ) : data && data.apariencia_etnica ? (
              ctx.lang === "en" ? (
                data.apariencia_etnica.en
              ) : (
                data.apariencia_etnica.es
              )
            ) : (
              "N/D"
            )}
          </Typography>
        </Grid>
        <Grid item my={2} xs={12}>
          <Divider />
        </Grid>

        <Grid item xs={6} mt={4}>
          <Typography
            fontSize={"1.4rem"}
            sx={{ color: "#069cb1" }}
            fontWeight={600}
          >
            {textos["nacionalidad_etnia"]
              ? `${textos["nacionalidad_etnia"]}:`
              : "Texto No definido"}
          </Typography>
        </Grid>
        <Grid item alignItems={"self-start"} xs={6} mt={4}>
          <Typography fontSize={"1rem"} fontWeight={400} variant="body1">
            {loading ? (
              <Skeleton className="md-skeleton" />
            ) : data ? (
              ctx.lang === "es" ? (
                data.nacionalidad.es
              ) : (
                data.nacionalidad.en
              )
            ) : (
              "N/D"
            )}
          </Typography>
        </Grid>
        <Grid item my={2} xs={12}>
          <Divider />
        </Grid>

        <Grid item xs={6} mt={4}>
          <Typography
            fontSize={"1.4rem"}
            sx={{ color: "#069cb1" }}
            fontWeight={600}
          >
            {textos["color_de_cabello"]
              ? `${textos["color_de_cabello"]}:`
              : "Texto No definido"}
          </Typography>
        </Grid>
        <Grid item alignItems={"self-start"} xs={6} mt={4}>
          <Typography fontSize={"1rem"} fontWeight={400} variant="body1">
            {loading ? (
              <Skeleton className="md-skeleton" />
            ) : data ? (
              ctx.lang === "es" ? (
                data.color_cabello.es
              ) : (
                data.color_cabello.en
              )
            ) : (
              "N/D"
            )}
          </Typography>
        </Grid>
        <Grid item my={2} xs={12}>
          <Divider />
        </Grid>

        <Grid item xs={6} mt={4}>
          <Typography
            fontSize={"1.4rem"}
            sx={{ color: "#069cb1" }}
            fontWeight={600}
          >
            ¿
            {textos["dispuesto_a_cambiar_de_color_de_cabello"]
              ? `${textos["dispuesto_a_cambiar_de_color_de_cabello"]}`
              : "Texto No definido"}
            ?:
          </Typography>
        </Grid>
        <Grid item alignItems={"self-start"} xs={6} mt={4}>
          <Typography fontSize={"1rem"} fontWeight={400} variant="body1">
            {loading ? (
              <Skeleton className="md-skeleton" />
            ) : data ? (
              data.disposicion_cambio_color_cabello ? (
                "Si"
              ) : (
                "No"
              )
            ) : (
              "N/D"
            )}
          </Typography>
        </Grid>
        <Grid item my={2} xs={12}>
          <Divider />
        </Grid>

        <Grid item xs={6} mt={4}>
          <Typography
            fontSize={"1.4rem"}
            sx={{ color: "#069cb1" }}
            fontWeight={600}
          >
            {textos["estilo_de_cabello"]
              ? `${textos["estilo_de_cabello"]}:`
              : "Texto No definido"}
          </Typography>
        </Grid>
        <Grid item alignItems={"self-start"} xs={6} mt={4}>
          <Typography fontSize={"1rem"} fontWeight={400} variant="body1">
            {loading ? (
              <Skeleton className="md-skeleton" />
            ) : data ? (
              ctx.lang === "es" ? (
                data.estilo_cabello.es
              ) : (
                data.estilo_cabello.en
              )
            ) : (
              "N/D"
            )}
          </Typography>
        </Grid>
        <Grid item my={2} xs={12}>
          <Divider />
        </Grid>

        <Grid item xs={6} mt={4}>
          <Typography
            fontSize={"1.4rem"}
            sx={{ color: "#069cb1" }}
            fontWeight={600}
          >
            ¿
            {textos["dispuesto_a_cortar_cabello"]
              ? `${textos["dispuesto_a_cortar_cabello"]}`
              : "Texto No definido"}
            ?:
          </Typography>
        </Grid>
        <Grid item alignItems={"self-start"} xs={6} mt={4}>
          <Typography fontSize={"1rem"} fontWeight={400} variant="body1">
            {loading ? (
              <Skeleton className="md-skeleton" />
            ) : data ? (
              data.disposicion_corte_cabello ? (
                "Si"
              ) : (
                "No"
              )
            ) : (
              "N/D"
            )}
          </Typography>
        </Grid>
        <Grid item my={2} xs={12}>
          <Divider />
        </Grid>

        <Grid item xs={6} mt={4}>
          <Typography
            fontSize={"1.4rem"}
            sx={{ color: "#069cb1" }}
            fontWeight={600}
          >
            {textos["vello_facial"]
              ? `${textos["vello_facial"]}:`
              : "Texto No definido"}
          </Typography>
        </Grid>
        <Grid item alignItems={"self-start"} xs={6} mt={4}>
          <Typography fontSize={"1rem"} fontWeight={400} variant="body1">
            {loading ? (
              <Skeleton className="md-skeleton" />
            ) : data ? (
              ctx.lang === "es" ? (
                data.vello_facial.es
              ) : (
                data.vello_facial.en
              )
            ) : (
              "N/D"
            )}
          </Typography>
        </Grid>
        <Grid item my={2} xs={12}>
          <Divider />
        </Grid>

        <Grid item xs={6} mt={4}>
          <Typography
            fontSize={"1.4rem"}
            sx={{ color: "#069cb1" }}
            fontWeight={600}
          >
            ¿
            {textos["dispuesto_a_crecer_o_afeitar_vello_facial"]
              ? `${textos["dispuesto_a_crecer_o_afeitar_vello_facial"]}`
              : "Texto No definido"}
            ?:
          </Typography>
        </Grid>
        <Grid item alignItems={"self-start"} xs={6} mt={4}>
          <Typography fontSize={"1rem"} fontWeight={400} variant="body1">
            {loading ? (
              <Skeleton className="md-skeleton" />
            ) : data ? (
              data.disposicion_afeitar_o_crecer_vello_facial ? (
                "Si"
              ) : (
                "No"
              )
            ) : (
              "N/D"
            )}
          </Typography>
        </Grid>
        <Grid item my={2} xs={12}>
          <Divider />
        </Grid>

        <Grid item xs={6} mt={4}>
          <Typography
            fontSize={"1.4rem"}
            sx={{ color: "#069cb1" }}
            fontWeight={600}
          >
            {textos["color_de_ojos"]
              ? `${textos["color_de_ojos"]}:`
              : "Texto No definido"}
          </Typography>
        </Grid>
        <Grid item alignItems={"self-start"} xs={6} mt={4}>
          <Typography fontSize={"1rem"} fontWeight={400} variant="body1">
            {loading ? (
              <Skeleton className="md-skeleton" />
            ) : data ? (
              ctx.lang === "es" ? (
                data.color_ojos.es
              ) : (
                data.color_ojos.en
              )
            ) : (
              "N/D"
            )}
          </Typography>
        </Grid>
        <Grid item my={2} xs={12}>
          <Divider />
        </Grid>

        <Grid item xs={6} mt={4}>
          <Typography
            fontSize={"1.4rem"}
            sx={{ color: "#069cb1" }}
            fontWeight={600}
          >
            {textos["tatuajes"]
              ? `${textos["tatuajes"]}:`
              : "Texto No definido"}
          </Typography>
        </Grid>
        <Grid item alignItems={"self-start"} xs={6} mt={4}>
          {loading && <Skeleton className="md-skeleton" />}
          {!loading && tatuajes}
        </Grid>
        <Grid item my={2} xs={12}>
          <Divider />
        </Grid>

        <Grid item xs={6} mt={4}>
          <Typography
            fontSize={"1.4rem"}
            sx={{ color: "#069cb1" }}
            fontWeight={600}
          >
            {textos["piercings"]
              ? `${textos["piercings"]}:`
              : "Texto No definido"}
          </Typography>
        </Grid>
        <Grid item alignItems={"self-start"} xs={6} mt={4}>
          {loading && <Skeleton className="md-skeleton" />}
          {!loading && piercings}
        </Grid>
        <Grid item my={2} xs={12}>
          <Divider />
        </Grid>

        <Grid item xs={6} mt={4}>
          <Typography
            fontSize={"1.4rem"}
            sx={{ color: "#069cb1" }}
            fontWeight={600}
          >
            {textos["gemelo_o_trillizo"]
              ? `${textos["gemelo_o_trillizo"]}:`
              : "Texto No definido"}
          </Typography>
        </Grid>
        <Grid item alignItems={"self-start"} xs={6} mt={4}>
          <Typography fontSize={"1rem"} fontWeight={400} variant="body1">
            {loading ? (
              <Skeleton className="md-skeleton" />
            ) : data && data.hermanos ? (
              data.hermanos.descripcion
            ) : (
              "N/D"
            )}
          </Typography>
        </Grid>
        <Grid item my={2} xs={12}>
          <Divider />
        </Grid>

        <Grid item xs={6} mt={4}>
          <Typography
            fontSize={"1.4rem"}
            sx={{ color: "#069cb1" }}
            fontWeight={600}
          >
            {textos["atributos_o_condiciones_unicas"]
              ? `${textos["atributos_o_condiciones_unicas"]}:`
              : "Texto No definido"}
          </Typography>
        </Grid>
        <Grid item alignItems={"self-start"} xs={6} mt={4}>
          <Typography fontSize={"1rem"} fontWeight={400} variant="body1">
            {loading ? (
              <Skeleton className="md-skeleton" />
            ) : data && data.particularidades.length > 0 ? (
              data.particularidades
                .map((p) => {
                  if (p.id_particularidad === 99) {
                    return p.descripcion;
                  }
                  return ctx.lang === "es"
                    ? p.particularidad.es
                    : p.particularidad.en;
                })
                .join(", ")
            ) : (
              "N/A"
            )}
          </Typography>
        </Grid>
        <Grid item my={2} xs={12}>
          <Divider />
        </Grid>
        <Grid my={6} item xs={12}>
          <div id="medidas" style={{margin: '-100px 0 100px 0'}}>

          </div>
          <SectionTitle
            title={
              textos["medidas"] ? `${textos["medidas"]}:` : "Texto No definido"
            }
            textButton={
              textos["editar"] ? textos["editar"] : "Texto No definido"
            }
            onClickButton={
              !props.read_only
                ? () => {
                    setDialog((prev) => {
                      return { ...prev, opened: true };
                    });
                  }
                : undefined
            }
            titleSx={{
              fontSize:  '26px'
            }}
            dividerSx={{
              borderTop: "2px solid #069cb1",
            }}
          />
        </Grid>
        <Grid item alignItems={"self-start"} xs={12}>
          {!medidas_grouped && medidas.isFetching && (
            <Skeleton className="md-skeleton" />
          )}
          {!medidas.isFetching && !medidas_grouped && (
            <Typography
              fontSize={"1.3rem"}
              sx={{ color: "#F9B233" }}
              fontWeight={400}
            >
              No haz capturado aun las medidas
            </Typography>
          )}
          {medidas_grouped && medidas_grouped.length > 0 && (
            <Grid container>
              {medidas_grouped.map((medida, j) => {
                return (
                  <>
                    <Grid item xs={4}>
                      <Typography
                        fontSize={"1.4rem"}
                        sx={{ color: "#069cb1" }}
                        fontWeight={600}
                      >
                        {medida.parent}
                      </Typography>
                    </Grid>
                    <Grid item xs={8}>
                      {medida.childrens.map((child, i) => {
                        return (
                          <div key={i}>
                            <Typography fontSize={"1.2rem"} fontWeight={400}>
                              {child.name}
                            </Typography>
                            <Typography fontSize={"1rem"} fontWeight={400}>
                              {child.value}
                            </Typography>
                            {i < medida.childrens.length - 1 && (
                              <Divider className="my-2" />
                            )}
                          </div>
                        );
                      })}
                    </Grid>
                    {j < medidas_grouped.length - 1 && (
                      <Grid item xs={12}>
                        <Divider style={{ borderWidth: 2 }} className="my-2" />
                      </Grid>
                    )}
                  </>
                );
              })}
            </Grid>
          )}
        </Grid>
      </Grid>
      <MedidasDialog
        id_talento={props.id_talento}
        onClose={(changed: boolean) => {
          if (changed) {
            void medidas.refetch();
          }
          setDialog((prev) => {
            return { ...prev, opened: false };
          });
        }}
        opened={dialog.opened}
      />
    </>
  );
};
