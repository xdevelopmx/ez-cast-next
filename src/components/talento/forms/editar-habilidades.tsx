import { useMemo, type FC, useContext } from "react";
import {
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  Skeleton,
  Chip,
} from "@mui/material";
import { Add, ExpandMore, Remove } from "@mui/icons-material";
import { api } from "~/utils/api";
import { type TalentoFormHabilidades } from "~/pages/talento/editar-perfil";
import { MContainer } from "~/components/layout/MContainer";
import AppContext from "~/context/app";
import useLang from "~/hooks/useLang";

interface EditarHabilidadesTalentoPageProps {
  state: TalentoFormHabilidades;
  onFormChange: (input: { [id: string]: unknown }) => void;
}

const EditarHabilidadesTalento: FC<EditarHabilidadesTalentoPageProps> = ({
  onFormChange,
  state,
}) => {
  const ctx = useContext(AppContext);
  const textos = useLang(ctx.lang);

  const habilidades = api.catalogos.getHabilidades.useQuery(
    { include_subcategories: true },
    {
      refetchOnWindowFocus: false,
    }
  );
  const accordions = useMemo(() => {
    if (!habilidades.isSuccess || habilidades.isFetching) {
      return Array.from({ length: 10 }).map((n, i) => {
        console.log(i);
        return (
          <Skeleton
            style={{ margin: 8 }}
            key={i}
            variant="rectangular"
            height={56}
          />
        );
      });
    }
    if (habilidades.data) {
      
      return habilidades.data.filter(h => !h.parent).map((habilidad, i) => {
        const habilidades_childrens = habilidades.data.filter(h => h.parent && h.parent === habilidad.id);
        let habilidades_especificas_seleccionadas_by_id: number[] = [];
        if (state) {
          if (state.habilidades_seleccionadas.has(habilidad.id)) {
            const habilidades_in_map: number[] | undefined = state.habilidades_seleccionadas.get(habilidad.id);
            if (habilidades_in_map) {
              habilidades_especificas_seleccionadas_by_id = habilidades_in_map;
            }
          }
          habilidades_childrens.forEach((h_child) => {
            console.log(h_child);
            if (state.habilidades_seleccionadas.has(h_child.id)) {
              const habilidades_in_map: number[] | undefined = state.habilidades_seleccionadas.get(h_child.id);
              if (habilidades_in_map) {
                habilidades_especificas_seleccionadas_by_id = habilidades_especificas_seleccionadas_by_id.concat(habilidades_in_map);
              }
            }
          });
        }
        if (habilidades_childrens.length > 0) {
          return (
            <Accordion sx={{boxShadow: 'none', border: 'none', position: 'static'}} key={i}>
              <AccordionSummary
                style={{
                  color:
                    habilidades_especificas_seleccionadas_by_id.length > 0
                      ? "#f2f2f2"
                      : "black",
                  backgroundColor:
                    habilidades_especificas_seleccionadas_by_id.length > 0
                      ? "#069cb1"
                      : "#f2f2f2",
                }}
                expandIcon={
                  <ExpandMore
                    style={{
                      color:
                        habilidades_especificas_seleccionadas_by_id.length > 0
                          ? "#000"
                          : "#06acc2",
                    }}
                  />
                }
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography
                  sx={{ margin: 0 }}
                  fontSize={"1.1rem"}
                  fontWeight={500}
                >
                  {ctx.lang === "es" ? habilidad.es : habilidad.en}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {habilidades_childrens.map((h_child, k) => {
                  let child_habilidades_especificas_seleccionadas_by_id: number[] = [];
                  if (state) {
                    if (state.habilidades_seleccionadas.has(h_child.id)) {
                      const habilidades_in_map: number[] | undefined = state.habilidades_seleccionadas.get(h_child.id);
                      if (habilidades_in_map) {
                        child_habilidades_especificas_seleccionadas_by_id = habilidades_in_map;
                      }
                    }
                  }
                  return (
                    <Accordion sx={{boxShadow: 'none', border: 'none', position: 'static'}} key={k}>
                      <AccordionSummary
                        style={{
                          color:
                          child_habilidades_especificas_seleccionadas_by_id.length > 0
                              ? "#f2f2f2"
                              : "black",
                          backgroundColor:
                          child_habilidades_especificas_seleccionadas_by_id.length > 0
                              ? "#069cb1"
                              : "#f2f2f2",
                        }}
                        expandIcon={
                          <ExpandMore
                            style={{
                              color:
                              child_habilidades_especificas_seleccionadas_by_id.length > 0
                                  ? "#000"
                                  : "#06acc2",
                            }}
                          />
                        }
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                      >
                        <Typography
                          sx={{ margin: 0 }}
                          fontSize={"1.1rem"}
                          fontWeight={500}
                        >
                          {ctx.lang === "es" ? h_child.es : h_child.en}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        {h_child.habilidades_especificas.map((he, j) => {
                          return (
                            <Chip
                              onClick={() => {
                                if (state) {
                                  if (child_habilidades_especificas_seleccionadas_by_id.length > 0) {
                                    if (child_habilidades_especificas_seleccionadas_by_id.includes(he.id)) {
                                      state.habilidades_seleccionadas.set(h_child.id, child_habilidades_especificas_seleccionadas_by_id.filter((h) => h !== he.id));
                                    } else {
                                      // si no esta lo insertamos
                                      state.habilidades_seleccionadas.set(h_child.id, child_habilidades_especificas_seleccionadas_by_id.concat([he.id]));
                                    }
                                  } else {
                                      state.habilidades_seleccionadas.set(h_child.id, [he.id]);
                                  }
                                  onFormChange({
                                    habilidades_seleccionadas: new Map(
                                      state.habilidades_seleccionadas
                                    ),
                                  });
                                  
                                }
                              }}
                              icon={
                                child_habilidades_especificas_seleccionadas_by_id.includes(
                                  he.id
                                ) ? (
                                  <Remove
                                    style={{
                                      color: "#f2f2f2",
                                      marginRight: "0px",
                                      marginLeft: "4px",
                                    }}
                                  />
                                ) : (
                                  <Add
                                    style={{
                                      color: "#069cb1",
                                      marginRight: "0px",
                                      marginLeft: "4px",
                                    }}
                                  />
                                )
                              }
                              key={j}
                              label={ctx.lang === "es" ? he.es : he.en}
                              style={{
                                margin: 4,
                                fontWeight: 800,
                                borderRadius: 10,
                                flexDirection: "row-reverse",
                                color:
                                child_habilidades_especificas_seleccionadas_by_id.includes(
                                    he.id
                                  )
                                    ? "#f2f2f2"
                                    : "#069cb1",
                                borderColor:
                                child_habilidades_especificas_seleccionadas_by_id.includes(
                                    he.id
                                  )
                                    ? "none"
                                    : "#069cb1",
                                backgroundColor:
                                child_habilidades_especificas_seleccionadas_by_id.includes(
                                    he.id
                                  )
                                    ? "#069cb1"
                                    : "white",
                              }}
                              variant="outlined"
                            />
                          );
                        })}
                      </AccordionDetails>
                    </Accordion>
                  )
                })}
              </AccordionDetails>
            </Accordion>
          )
        }
        return (
          <Accordion sx={{boxShadow: 'none', border: 'none', position: 'static'}} key={i}>
            <AccordionSummary
              style={{
                color:
                habilidades_especificas_seleccionadas_by_id.length > 0
                    ? "#f2f2f2"
                    : "black",
                backgroundColor:
                habilidades_especificas_seleccionadas_by_id.length > 0
                    ? "#069cb1"
                    : "#f2f2f2",
              }}
              expandIcon={
                <ExpandMore
                  style={{
                    color:
                    habilidades_especificas_seleccionadas_by_id.length > 0
                        ? "#000"
                        : "#06acc2",
                  }}
                />
              }
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography
                sx={{ margin: 0 }}
                fontSize={"1.1rem"}
                fontWeight={500}
              >
                {ctx.lang === "es" ? habilidad.es : habilidad.en}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {habilidad.habilidades_especificas.map((he, j) => {
                return (
                  <Chip
                    onClick={() => {
                      if (state) {
                        if (habilidades_especificas_seleccionadas_by_id.length > 0) {
                          if (
                            habilidades_especificas_seleccionadas_by_id.includes(
                              he.id
                            )
                          ) {
                            state.habilidades_seleccionadas.set(
                              habilidad.id,
                              habilidades_especificas_seleccionadas_by_id.filter(
                                (h) => h !== he.id
                              )
                            );
                          } else {
                            // si no esta lo insertamos
                            state.habilidades_seleccionadas.set(
                              habilidad.id,
                              habilidades_especificas_seleccionadas_by_id.concat(
                                [he.id]
                              )
                            );
                          }
                        } else {
                          state.habilidades_seleccionadas.set(habilidad.id, [
                            he.id,
                          ]);
                        }
                        onFormChange({
                          habilidades_seleccionadas: new Map(
                            state.habilidades_seleccionadas
                          ),
                        });
                      }
                    }}
                    icon={
                      habilidades_especificas_seleccionadas_by_id.includes(
                        he.id
                      ) ? (
                        <Remove
                          style={{
                            color: "#f2f2f2",
                            marginRight: "0px",
                            marginLeft: "4px",
                          }}
                        />
                      ) : (
                        <Add
                          style={{
                            color: "#069cb1",
                            marginRight: "0px",
                            marginLeft: "4px",
                          }}
                        />
                      )
                    }
                    key={j}
                    label={ctx.lang === "es" ? he.es : he.en}
                    style={{
                      margin: 4,
                      fontWeight: 800,
                      borderRadius: 10,
                      flexDirection: "row-reverse",
                      color:
                      habilidades_especificas_seleccionadas_by_id.includes(
                          he.id
                        )
                          ? "#f2f2f2"
                          : "#069cb1",
                      borderColor:
                      habilidades_especificas_seleccionadas_by_id.includes(
                          he.id
                        )
                          ? "none"
                          : "#069cb1",
                      backgroundColor:
                      habilidades_especificas_seleccionadas_by_id.includes(
                          he.id
                        )
                          ? "#069cb1"
                          : "white",
                    }}
                    variant="outlined"
                  />
                );
              })}
            </AccordionDetails>
          </Accordion>
        );
      });
    }
    return [
      <Typography key={1} fontSize={"1.2rem"} fontWeight={600} component={"p"}>
        No hay registros en el catalogo de habilidades
      </Typography>,
    ];

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    habilidades.isSuccess,
    habilidades.isFetching,
    habilidades.data,
    state,
    ctx.lang,
  ]);
  return (
    <MContainer direction="vertical">{accordions.map((a) => a)}</MContainer>
  );
};

export default EditarHabilidadesTalento;
