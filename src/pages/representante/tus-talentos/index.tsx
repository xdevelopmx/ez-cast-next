import Head from "next/head";
import Image from "next/image";
import { Box, Button, Divider, Grid, Typography } from "@mui/material";
import { Alertas, MainLayout, MenuLateral, ModalTalento } from "~/components";
import { TalentoPreviewLong } from "~/components/representante/talento-preview-long";
import { useState } from "react";
import { api, parseErrorBody } from "~/utils/api";
import useNotify from "~/hooks/useNotify";

const RepresentanteTusTalentosPage = () => {
  const [showModal, setShowModal] = useState(false);

  const { notify } = useNotify();

  const [option_selected, setOptionSelected] = useState<
    "APLICACIONES" | "AUDICIONES" | "CALLBACK"
  >("APLICACIONES");

  const [requisitoSelected, setRequisitoSelected] = useState<
    "PROYECTO" | "ROL" | "SELF-TAPE"
  >("PROYECTO");

  const talentos_asignados = api.representantes.getTalentosAsignados.useQuery();

  const removeTalento = api.representantes.removeTalento.useMutation({
    onSuccess(data, input) {
      notify("success", "Se removio el talento con exito");
      void talentos_asignados.refetch();
    },
    onError: (error) => {
      notify("error", parseErrorBody(error.message));
    },
  });

  return (
    <>
      <Head>
        <title>Representante | Talent Corner</title>
        <meta name="description" content="Talent Corner" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MainLayout menuSiempreBlanco={true}>
        <div className="d-flex wrapper_ezc">
          <MenuLateral />
          <div className="seccion_container col" style={{ paddingTop: 0 }}>
            <br />
            <br />
            <div className="container_box_header">
              <div className="d-flex justify-content-end align-items-start py-2">
                <Alertas />
              </div>

              <Grid container xs={12} mt={6}>
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 800,
                        fontSize: "1.8rem",
                      }}
                    >
                      Tus talentos
                    </Typography>
                  </Box>
                </Grid>

                <Grid xs={12} mt={4}>
                  <Typography fontWeight={800}>
                    Representas
                    <Typography
                      fontWeight={800}
                      component={"span"}
                      sx={{ padding: "0px 5px", color: "#069cb1" }}
                    >
                      {talentos_asignados.data?.length ?? 0}
                    </Typography>
                    talentos
                  </Typography>
                  <Typography>
                    Da click en el botón de Nuevo talento para comenzar a
                    agregar talentos.
                  </Typography>
                </Grid>

                <Grid xs={12} mt={4}>
                  <Divider />
                </Grid>

                <Grid xs={12}>
                  {talentos_asignados.isSuccess &&
                    talentos_asignados.data.map((entry, i) => (
                      <TalentoPreviewLong
                        onRemoveTalento={(id_talento) => {
                          removeTalento.mutate({
                            id_talento: id_talento,
                          });
                        }}
                        talento={entry.talento}
                        setShowModal={setShowModal}
                        key={i}
                      />
                    ))}
                </Grid>
              </Grid>
            </div>
          </div>
        </div>

        <ModalTalento
          option_selected={option_selected}
          setOptionSelected={setOptionSelected}
          requisitoSelected={requisitoSelected}
          setRequisitoSelected={setRequisitoSelected}
          showModal={showModal}
          setShowModal={setShowModal}
        />
      </MainLayout>
    </>
  );
};

export default RepresentanteTusTalentosPage;
