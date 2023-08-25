import { Grid, Skeleton, Typography } from "@mui/material";
import { SectionTitle } from "~/components/shared";
import { api } from "~/utils/api";
import { useContext, useMemo } from "react";
import { MTable } from "~/components/shared/MTable/MTable";
import { useRouter } from "next/router";
import AppContext from "~/context/app";
import useLang from "~/hooks/useLang";

export const Activos = (props: { id_talento: number; read_only: boolean }) => {
  const ctx = useContext(AppContext);
  const textos = useLang(ctx.lang);

  const router = useRouter();

  const activos = api.talentos.getActivosByIdTalento.useQuery(
    { id: props.id_talento },
    {
      refetchOnWindowFocus: false,
    }
  );
  const loading = activos.isFetching;
  const data = useMemo(() => {
    if (activos.data) {
      console.log("activos_data", activos.data);
      return activos.data;
    }
    return null;
  }, [activos.data]);

  const activos_arr = useMemo(() => {
    let arrays: {
      mascotas: { tipo: string; raza: string; tamanio: string }[];
      vehiculos: {
        tipo: string;
        marca: string;
        modelo: string;
        color: string;
        anio: string;
      }[];
      vestuarios: {
        tipo: string;
        tipo_especifico: string;
        descripcion: string;
      }[];
      props: { tipo: string; descripcion: string }[];
      equipos_deportivos: { tipo: string; descripcion: string }[];
    } = {
      mascotas: [],
      vehiculos: [],
      vestuarios: [],
      props: [],
      equipos_deportivos: [],
    };
    if (data) {
      arrays = {
        mascotas: data.mascotas.map((m) => {
          let tamanio = m.tamanio;
          //mascota.tamanio
          if (ctx.lang === "en") {
            switch (m.tamanio.toLowerCase()) {
              case "chico":
                tamanio = "Small";
                break;
              case "mediano":
                tamanio = "Medium";
                break;
              case "grande":
                tamanio = "Large";
                break;
            }
          }

          if (m.tipo_mascota) {
            if (m.id_tipo_mascota === 5 && m.raza_mascota) {
              return {
                tipo: ctx.lang === "es" ? m.tipo_mascota.es : m.tipo_mascota.en,
                raza: ctx.lang === "es" ? m.raza_mascota.es : m.raza_mascota.en,
                tamanio: tamanio,
              };
            }
            return {
              tipo: ctx.lang === "es" ? m.tipo_mascota.es : m.tipo_mascota.en,
              raza: "N/A",
              tamanio: tamanio,
            };
          }
          return { tipo: "N/D", raza: "N/D", tamanio: "N/D" };
        }),
        vehiculos: data.vehiculos.map((v) => {
          if (v.tipo_vehiculo) {
            return {
              tipo: ctx.lang === "es" ? v.tipo_vehiculo.es : v.tipo_vehiculo.en,
              marca: v.marca,
              modelo: v.modelo,
              color: v.color,
              anio: `${v.anio}`,
            };
          }
          return {
            tipo: "N/D",
            marca: "N/D",
            modelo: "N/D",
            color: "N/D",
            anio: "N/D",
          };
        }),
        vestuarios: data.vestuario.map((v) => {
          if (
            v.tipo_vestuario_especifico &&
            v.tipo_vestuario_especifico.tipo_vestuario
          ) {
            return {
              tipo:
                ctx.lang === "es"
                  ? v.tipo_vestuario_especifico.tipo_vestuario.es
                  : v.tipo_vestuario_especifico.en,
              tipo_especifico:
                ctx.lang === "es"
                  ? v.tipo_vestuario_especifico.es
                  : v.tipo_vestuario_especifico.en,
              descripcion: v.descripcion,
            };
          }
          return {
            tipo: "Otro",
            tipo_especifico: "N/A",
            descripcion: v.descripcion,
          };
        }),
        props: data.props.map((p) => {
          if (p.tipo_props) {
            return {
              tipo: ctx.lang === "es" ? p.tipo_props.es : p.tipo_props.en,
              descripcion: p.descripcion,
            };
          }
          return { tipo: "N/D", descripcion: "N/D" };
        }),
        equipos_deportivos: data.equipo_deportivo.map((e) => {
          if (e.tipo_equipo_deportivo) {
            return {
              tipo:
                ctx.lang === "es"
                  ? e.tipo_equipo_deportivo.es
                  : e.tipo_equipo_deportivo.en,
              descripcion: e.descripcion,
            };
          }
          return { tipo: "N/D", descripcion: "N/D" };
        }),
      };
      return arrays;
    }
    return arrays;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <Grid id="activos" container sx={{ mt: 10 }}>
      <Grid item xs={12}>
        <SectionTitle
          title={
            textos["activos"] ? `${textos["activos"]}` : "Texto No definido"
          }
          dividerSx={{
            borderTop: "2px solid #069cb1",
          }}
          titleSx={{
            fontSize: "26px",
          }}
          textButton={textos["editar"] ? textos["editar"] : "Texto No definido"}
          onClickButton={
            !props.read_only
              ? () => {
                  // eslint-disable-next-line @typescript-eslint/no-floating-promises
                  router.push(
                    `/talento/editar-perfil?step=5&id_talento=${props.id_talento}`
                  );
                }
              : undefined
          }
        />
      </Grid>
      <Grid item xs={12}>
        {loading && <Skeleton className={"md-skeleton"} />}
        {!loading && (
          <Typography
            my={2}
            fontSize={"22px"}
            sx={{ color: "#069cb1" }}
            fontWeight={800}
          >
            {textos["mascotas"] ? textos["mascotas"] : "Texto No definido"}
          </Typography>
        )}
        <MTable
          backgroundColorHeader="#069cb1"
          styleHeaderRow={{ padding: "0px !important" }}
          styleHeaderTableCell={{ padding: "5px !important" }}
          columnsHeader={[
            <Typography
              key={2}
              sx={{ color: "#fff", padding: 0 }}
              fontSize={"1.2rem"}
              fontWeight={600}
              component={"p"}
            >
              {textos["tipo"] ? textos["tipo"] : "Texto No definido"}
            </Typography>,
            <Typography
              key={3}
              sx={{ color: "#fff", padding: 0 }}
              fontSize={"1.2rem"}
              fontWeight={600}
              component={"p"}
            >
              {textos["raza"] ? textos["raza"] : "Texto No definido"}
            </Typography>,
            <Typography
              key={4}
              sx={{ color: "#fff", padding: 0 }}
              fontSize={"1.2rem"}
              fontWeight={600}
              component={"p"}
            >
              {textos["tamanio"] ? textos["tamanio"] : "Texto No definido"}
            </Typography>,
          ]}
          data={
            !loading
              ? activos_arr.mascotas
              : Array.from({ length: 4 }).map((n, i) => {
                  return {
                    tipo: (
                      <Skeleton
                        className="my-2 p-3"
                        key={i}
                        variant="rectangular"
                        height={32}
                      />
                    ),
                    raza: (
                      <Skeleton
                        className="my-2 p-3"
                        key={i}
                        variant="rectangular"
                        height={32}
                      />
                    ),
                    tamanio: (
                      <Skeleton
                        className="my-2 p-3"
                        key={i}
                        variant="rectangular"
                        height={32}
                      />
                    ),
                  };
                })
          }
        />
      </Grid>
      <Grid item xs={12} my={2}>
        {loading && <Skeleton className={"md-skeleton"} />}
        {!loading && (
          <Typography
            my={2}
            fontSize={"22px"}
            sx={{ color: "#069cb1" }}
            fontWeight={800}
          >
            {" "}
            {textos["vehiculos"] ? textos["vehiculos"] : "Texto No definido"}
          </Typography>
        )}
        <MTable
          backgroundColorHeader="#069cb1"
          styleHeaderTableCell={{ padding: "5px !important" }}
          columnsHeader={[
            <Typography
              key={2}
              sx={{ color: "#fff" }}
              fontSize={"1.2rem"}
              fontWeight={600}
              component={"p"}
            >
              {textos["tipo"] ? textos["tipo"] : "Texto No definido"}
            </Typography>,
            <Typography
              key={3}
              sx={{ color: "#fff" }}
              fontSize={"1.2rem"}
              fontWeight={600}
              component={"p"}
            >
              {textos["marca"] ? textos["marca"] : "Texto No definido"}
            </Typography>,
            <Typography
              key={4}
              sx={{ color: "#fff" }}
              fontSize={"1.2rem"}
              fontWeight={600}
              component={"p"}
            >
              {textos["modelo"] ? textos["modelo"] : "Texto No definido"}
            </Typography>,
            <Typography
              key={4}
              sx={{ color: "#fff" }}
              fontSize={"1.2rem"}
              fontWeight={600}
              component={"p"}
            >
              {textos["color"] ? textos["color"] : "Texto No definido"}
            </Typography>,
            <Typography
              key={4}
              sx={{ color: "#fff" }}
              fontSize={"1.2rem"}
              fontWeight={600}
              component={"p"}
            >
              {textos["anio"] ? textos["anio"] : "Texto No definido"}
            </Typography>,
          ]}
          data={
            !loading
              ? activos_arr.vehiculos
              : Array.from({ length: 4 }).map((n, i) => {
                  return {
                    tipo: (
                      <Skeleton
                        className="my-2 p-3"
                        key={i}
                        variant="rectangular"
                        height={32}
                      />
                    ),
                    marca: (
                      <Skeleton
                        className="my-2 p-3"
                        key={i}
                        variant="rectangular"
                        height={32}
                      />
                    ),
                    modelo: (
                      <Skeleton
                        className="my-2 p-3"
                        key={i}
                        variant="rectangular"
                        height={32}
                      />
                    ),
                    color: (
                      <Skeleton
                        className="my-2 p-3"
                        key={i}
                        variant="rectangular"
                        height={32}
                      />
                    ),
                    anio: (
                      <Skeleton
                        className="my-2 p-3"
                        key={i}
                        variant="rectangular"
                        height={32}
                      />
                    ),
                  };
                })
          }
        />
      </Grid>
      <Grid item xs={12} my={2}>
        {loading && <Skeleton className={"md-skeleton"} />}
        {!loading && (
          <Typography
            my={2}
            fontSize={"22px"}
            sx={{ color: "#069cb1" }}
            fontWeight={800}
          >
            {textos["vestuarios"] ? textos["vestuarios"] : "Texto No definido"}
          </Typography>
        )}
        <MTable
          backgroundColorHeader="#069cb1"
          styleHeaderTableCell={{ padding: "5px !important" }}
          columnsHeader={[
            <Typography
              key={2}
              sx={{ color: "#fff" }}
              fontSize={"1.2rem"}
              fontWeight={600}
              component={"p"}
            >
              {textos["tipo"] ? textos["tipo"] : "Texto No definido"}
            </Typography>,
            <Typography
              key={3}
              sx={{ color: "#fff" }}
              fontSize={"1.2rem"}
              fontWeight={600}
              component={"p"}
            >
              {textos["tipo_especifico"]
                ? textos["tipo_especifico"]
                : "Texto No definido"}
            </Typography>,
            <Typography
              key={4}
              sx={{ color: "#fff" }}
              fontSize={"1.2rem"}
              fontWeight={600}
              component={"p"}
            >
              {textos["descripcion"]
                ? textos["descripcion"]
                : "Texto No definido"}
            </Typography>,
          ]}
          data={
            !loading
              ? activos_arr.vestuarios
              : Array.from({ length: 4 }).map((n, i) => {
                  return {
                    tipo: (
                      <Skeleton
                        className="my-2 p-3"
                        key={i}
                        variant="rectangular"
                        height={32}
                      />
                    ),
                    tipo_especifico: (
                      <Skeleton
                        className="my-2 p-3"
                        key={i}
                        variant="rectangular"
                        height={32}
                      />
                    ),
                    descripcion: (
                      <Skeleton
                        className="my-2 p-3"
                        key={i}
                        variant="rectangular"
                        height={32}
                      />
                    ),
                  };
                })
          }
        />
      </Grid>
      <Grid item xs={12} my={2}>
        {loading && <Skeleton className={"md-skeleton"} />}
        {!loading && (
          <Typography
            my={2}
            fontSize={"22px"}
            sx={{ color: "#069cb1" }}
            fontWeight={800}
          >
            {textos["props"] ? textos["props"] : "Texto No definido"}
          </Typography>
        )}
        <MTable
          backgroundColorHeader="#069cb1"
          styleHeaderTableCell={{ padding: "5px !important" }}
          columnsHeader={[
            <Typography
              key={2}
              sx={{ color: "#fff" }}
              fontSize={"1.2rem"}
              fontWeight={600}
              component={"p"}
            >
              {textos["tipo"] ? textos["tipo"] : "Texto No definido"}
            </Typography>,
            <Typography
              key={4}
              sx={{ color: "#fff" }}
              fontSize={"1.2rem"}
              fontWeight={600}
              component={"p"}
            >
              {textos["descripcion"]
                ? textos["descripcion"]
                : "Texto No definido"}
            </Typography>,
          ]}
          data={
            !loading
              ? activos_arr.props
              : Array.from({ length: 4 }).map((n, i) => {
                  return {
                    tipo: (
                      <Skeleton
                        className="my-2 p-3"
                        key={i}
                        variant="rectangular"
                        height={32}
                      />
                    ),
                    descripcion: (
                      <Skeleton
                        className="my-2 p-3"
                        key={i}
                        variant="rectangular"
                        height={32}
                      />
                    ),
                  };
                })
          }
        />
      </Grid>
      <Grid item xs={12} my={2}>
        {loading && <Skeleton className={"md-skeleton"} />}
        {!loading && (
          <Typography
            my={2}
            fontSize={"22px"}
            sx={{ color: "#069cb1" }}
            fontWeight={800}
          >
            {textos["equipo_deportivo"]
              ? textos["equipo_deportivo"]
              : "Texto No definido"}
          </Typography>
        )}
        <MTable
          backgroundColorHeader="#069cb1"
          styleHeaderTableCell={{ padding: "5px !important" }}
          columnsHeader={[
            <Typography
              key={2}
              sx={{ color: "#fff" }}
              fontSize={"1.2rem"}
              fontWeight={600}
              component={"p"}
            >
              {textos["tipo"] ? textos["tipo"] : "Texto No definido"}
            </Typography>,
            <Typography
              key={4}
              sx={{ color: "#fff" }}
              fontSize={"1.2rem"}
              fontWeight={600}
              component={"p"}
            >
              {textos["descripcion"]
                ? textos["descripcion"]
                : "Texto No definido"}
            </Typography>,
          ]}
          data={
            !loading
              ? activos_arr.equipos_deportivos
              : Array.from({ length: 4 }).map((n, i) => {
                  return {
                    tipo: (
                      <Skeleton
                        className="my-2 p-3"
                        key={i}
                        variant="rectangular"
                        height={32}
                      />
                    ),
                    descripcion: (
                      <Skeleton
                        className="my-2 p-3"
                        key={i}
                        variant="rectangular"
                        height={32}
                      />
                    ),
                  };
                })
          }
        />
      </Grid>
    </Grid>
  );
};
