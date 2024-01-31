import { Grid, Skeleton, Typography } from "@mui/material";
import { MContainer } from "~/components/layout/MContainer";
import { SectionTitle } from "~/components/shared";
import { api } from "~/utils/api";
import { useContext, useMemo } from "react";
import MotionDiv from "~/components/layout/MotionDiv";
import { useRouter } from "next/router";
import AppContext from "~/context/app";
import useLang from "~/hooks/useLang";
import MAlert from "~/components/shared/MAlert";

export const Habilidades = (props: {
  id_talento: number;
  read_only: boolean;
}) => {
  const ctx = useContext(AppContext);
  const textos = useLang(ctx.lang);

  const router = useRouter();

  const habilidades = api.talentos.getHabilidadesByIdTalento.useQuery(
    { id: props.id_talento },
    {
      refetchOnWindowFocus: false,
    }
  );
  const loading = habilidades.isFetching;
  const data = useMemo(() => {
    if (habilidades.data) {
      console.log("habilidades_data", habilidades.data);
      return habilidades.data;
    }
    return null;
  }, [habilidades.data]);

  const habilidades_map = useMemo(() => {
    if (data) {
      const h_map: Map<string, string[]> = new Map();

      data.forEach((entry) => {
        if (
          h_map.has(ctx.lang === "es" ? entry.habilidad.es : entry.habilidad.en)
        ) {
          const arr = h_map.get(
            ctx.lang === "es" ? entry.habilidad.es : entry.habilidad.en
          );
          if (arr) {
            h_map.set(
              ctx.lang === "es" ? entry.habilidad.es : entry.habilidad.en,
              arr.concat([
                ctx.lang === "es"
                  ? entry.habilidad_especifica.es
                  : entry.habilidad_especifica.en,
              ])
            );
          }
        } else {
          h_map.set(
            ctx.lang === "es" ? entry.habilidad.es : entry.habilidad.en,
            [
              ctx.lang === "es"
                ? entry.habilidad_especifica.es
                : entry.habilidad_especifica.en,
            ]
          );
        }
      });
      return h_map;
    }
    return null;
  }, [data, ctx.lang]);

  return (
    <Grid  container sx={{ mt: 10 }}>
      <div id={`${textos['habilidades']}`} style={{margin: '-100px 0 100px 0'}}>

      </div>
      <Grid item xs={12}>
        <SectionTitle
          title={
            textos["habilidades"]
              ? `${textos["habilidades"]}`
              : "Texto No definido"
          }
          dividerSx={{
            borderTop: "2px solid #069cb1",
          }}
          titleSx={{
            fontSize: "24px",
          }}
          textButton={textos["editar"] ? textos["editar"] : "Texto No definido"}
          onClickButton={
            !props.read_only
              ? () => {
                  // eslint-disable-next-line @typescript-eslint/no-floating-promises
                  router.push(
                    `/talento/editar-perfil?step=4&id_talento=${props.id_talento}`
                  );
                }
              : undefined
          }
        />
      </Grid>

      <Grid item xs={12}>
        {!loading && habilidades.data?.length === 0 && (
          <MAlert
            title={`${textos['habilidades']}`}
            body={textos["usuario_no_ha_capturado"]
              ? textos["usuario_no_ha_capturado"].replace(
                "[TYPE]",
                `${textos["habilidad"] ?? ""}`
              )
              : "Texto No definido"}
          />
        )}

        <MotionDiv show={loading} animation={"fade"}>
          <>
            {Array.from({ length: 4 }).map((n, i) => {
              return (
                <MContainer key={i} direction="vertical">
                  <Skeleton
                    className="my-2 sm-skeleton"
                    variant="rectangular"
                  />
                  <MContainer direction="horizontal">
                    {Array.from({ length: 4 }).map((m, j) => {
                      return (
                        <Skeleton
                          key={j}
                          className="my-2 p-3"
                          variant="rectangular"
                          width={150}
                          sx={{
                            marginRight: 16,
                            padding: "0px 30px",
                            borderRadius: 10,
                            border: "2px solid #069cb1",
                          }}
                        />
                      );
                    })}
                  </MContainer>
                </MContainer>
              );
            })}
          </>
        </MotionDiv>
        <MotionDiv show={!loading} animation={"fade"} style={{paddingBottom:20}}>
          <>
            {habilidades_map &&
              Array.from(habilidades_map).map((entry, i) => {
                return (
                  <MContainer
                    key={i}
                    direction="vertical"
                    styles={{ marginTop: 20 }}
                  >
                    <Typography
                      sx={{ color: "#069cb1", fontSize: "18px" }}
                      fontWeight={600}
                    >
                      {entry[0]}
                    </Typography>
                    <MContainer direction="horizontal" styles={{ gap: 10 }}>
                      {entry[1].map((he, j) => {
                        return (
                          <Typography
                            key={j}
                            sx={{
                              textAlign: "center",
                              width: 200,
                              padding: "0px 30px",
                              borderRadius: "8px!important",
                              border: "2px solid #069cb1",
                            }}
                          >
                            {he}
                          </Typography>
                        );
                      })}
                    </MContainer>
                  </MContainer>
                );
              })}
          </>
        </MotionDiv>
      </Grid>
    </Grid>
  );
};
