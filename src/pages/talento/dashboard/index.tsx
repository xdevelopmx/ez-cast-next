import { type GetServerSideProps, type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { Alertas, Flotantes, MainLayout, MenuLateral } from "~/components";
import { OptionsGroup } from "~/components/shared/OptionsGroup";
import { MContainer } from "~/components/layout/MContainer";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Link,
  Skeleton,
} from "@mui/material";
import {
  Activos,
  Creditos,
  FiltrosApariencias,
  Habilidades,
  Media,
  Preferencias,
} from "~/components/talento";
import { InfoGeneral } from "~/components/talento/dashboard-sections/InfoGeneral";
import { api } from "~/utils/api";
import { getSession } from "next-auth/react";
import { TipoUsuario } from "~/enums";
import Constants from "~/constants";
import { type User } from "next-auth/core/types";
import { useContext, useEffect, useState } from "react";
import { TalentoDashBoardSelect } from "~/components/cazatalento/talento/talento-dashboard-select";
import { TalentoDashBoardRepresentanteSection } from "~/components/representante/talento/TalentoDashBoardRepresentanteSection";
import { prisma } from "~/server/db";
import AppContext from "~/context/app";
import useLang from "~/hooks/useLang";
import useNotify from "~/hooks/useNotify";

const DashBoardTalentosPage: NextPage<{
  user?: User;
  id_talento: number;
  id_rol: number;
  scroll_section: string;
  can_edit: boolean;
}> = (props) => {
  const [dialog_open, setDialogOpen] = useState(false);
  const { notify } = useNotify();
  const ctx = useContext(AppContext);
  const textos = useLang(ctx.lang);
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    section?.scrollIntoView({ behavior: "smooth" });
  };

  const talento = api.talentos.getById.useQuery(
    { id: props.id_talento },
    {
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    if (talento.data) {
      scrollToSection(props.scroll_section);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [talento.data]);

  return (
    <>
      <Head>
        <title>DashBoard ~ Talentos | Talent Corner</title>
        <meta name="description" content="Talent Corner" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MainLayout
        menuSiempreBlanco={true}
        hideFooter={!props.user}
        hideHeader={!props.user}
      >
        <div className="d-flex wrapper_ezc">
          {props.user && <MenuLateral />}
          <div
            className="seccion_container col"
            style={{ paddingTop: props.user ? 50 : 0 }}
          >
            {props.user && (
              <>
                <br />
                <br />
              </>
            )}
            {props.id_talento > 0 &&
              props.id_rol > 0 &&
              props.user?.tipo_usuario === TipoUsuario.CAZATALENTOS && (
                <TalentoDashBoardSelect
                  id_talento={props.id_talento}
                  id_rol={props.id_rol}
                />
              )}
            <div className="container_box_header">
              {props.user && (
                <div className="d-flex justify-content-end align-items-start py-2">
                  {<Alertas />}
                </div>
              )}
              {props.user && (
                <>
                  <div className="d-flex justify-content-between">
                    <div className="d-flex">
                      {talento.isFetching && (
                        <Skeleton
                          style={{ marginLeft: 16 }}
                          width={200}
                          height={24}
                        />
                      )}
                      {!talento.isFetching && talento.data && (
                        <p className="h3 font-weight-bold mb-0 ml-2">
                          {talento.data.nombre} {talento.data.apellido}
                        </p>
                      )}
                    </div>
                    {props.user &&
                      props.user.tipo_usuario &&
                      [TipoUsuario.TALENTO, TipoUsuario.ADMIN].includes(
                        props.user.tipo_usuario
                      ) && (
                        <div className="d-flex-column">
                          <Button
                            className="m-0 p-0"
                            onClick={() => {
                              setDialogOpen(true);
                            }}
                          >
                            <Image
                              src="/assets/img/iconos/eye_blue.svg"
                              width={20}
                              height={20}
                              alt=""
                            />{" "}
                            {textos["vertd"]}
                          </Button>
                          <p className="m-0 p-0">
                            <Button
                              sx={{
                                textTransform: "capitalize",
                                textDecoration: "underline",
                              }}
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  `${process.env.NEXT_PUBLIC_APP_URL}/talento/dashboard?id_talento=${props.id_talento}`
                                );
                                notify("success", `${textos["link_copiado"]}`);
                              }}
                            >
                              {textos["copiartd"]}
                            </Button>
                          </p>
                        </div>
                      )}
                  </div>
                  {props.id_talento > 0 &&
                    props.user?.tipo_usuario === TipoUsuario.REPRESENTANTE && (
                      <TalentoDashBoardRepresentanteSection
                        id_talento={props.id_talento}
                        id_representante={parseInt(props.user.id)}
                      />
                    )}
                </>
              )}
              <br />
              <MContainer direction="vertical">
                <OptionsGroup
                  styleContainer={{
                    display: "flex",
                    gap: "40px",
                    marginBottom: 0,
                  }}
                  styleButton={{
                    textTransform: "none",
                    fontSize: "1rem",
                  }}
                  id="opciones-usuario"
                  onOptionClick={(id: string, label: string) => {
                    const id_section = label.toLowerCase().replace(/\s+/g, "-");
                    console.log(id_section);
                    scrollToSection(id_section);
                  }}
                  labels={[
                    textos["info_basica"] ? textos["info_basica"] : "",
                    textos["media"] ? textos["media"] : "",
                    textos["credito"] ? `${textos["credito"]}s` : "",
                    textos["habilidades"] ? textos["habilidades"] : "",
                    textos["medidas"] ? textos["medidas"] : "",
                    textos["activos"] ? textos["activos"] : "",
                    textos["preferencias_roles"]
                      ? textos["preferencias_roles"]
                      : "",
                  ]}
                />
                <InfoGeneral
                  id_talento={props.id_talento}
                  read_only={!props.can_edit}
                />
              </MContainer>

              <Media
                id_talento={props.id_talento}
                read_only={!props.can_edit}
              />

              <Creditos
                id_talento={props.id_talento}
                read_only={!props.can_edit}
              />

              <Habilidades
                id_talento={props.id_talento}
                read_only={!props.can_edit}
              />

              <Activos
                id_talento={props.id_talento}
                read_only={!props.can_edit}
              />
              <FiltrosApariencias
                id_talento={props.id_talento}
                read_only={!props.can_edit}
              />
              <Preferencias
                id_talento={props.id_talento}
                read_only={!props.can_edit}
              />
            </div>
          </div>
        </div>
      </MainLayout>
      <Dialog
        style={{
          marginTop: 56,
        }}
        fullWidth={true}
        maxWidth={"xl"}
        open={dialog_open}
        onClose={() => {
          setDialogOpen(false);
        }}
      >
        <DialogContent>
          <DashBoardTalentosPage
            id_talento={props.id_talento}
            id_rol={0}
            scroll_section={""}
            can_edit={false}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setDialogOpen(false);
            }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
      {props.user && <Flotantes />}
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (session && session.user && session.user.tipo_usuario) {
    if (
      [
        TipoUsuario.CAZATALENTOS,
        TipoUsuario.TALENTO,
        TipoUsuario.REPRESENTANTE,
      ].includes(session.user.tipo_usuario)
    ) {
      const { id_talento } = context.query;
      const { scroll_section } = context.query;
      const { id_rol } = context.query;
      let talento_id = id_talento ? parseInt(id_talento as string) : 0;
      if (session.user.tipo_usuario === TipoUsuario.TALENTO) {
        talento_id = parseInt(session.user.id);
        const talento_info = await prisma.infoBasicaPorTalentos.findFirst({
          where: {
            id_talento: talento_id,
          },
        });
        if (!talento_info) {
          // si no tiene info basica lo mandamos a el form de editar talento
          return {
            redirect: {
              destination: `/talento/editar-perfil`,
              permanent: true,
            },
          };
        }
      }
      let can_edit = true;
      const rep = await prisma.talentosRepresentados.findFirst({
        where: {
          id_talento: talento_id,
        },
        include: {
          representante: {
            include: {
              permisos: true,
            },
          },
        },
      });
      if (rep) {
        if (session.user.tipo_usuario === TipoUsuario.TALENTO) {
          can_edit = Boolean(
            rep.representante.permisos?.puede_editar_perfil_talento
          );
        }
        if (session.user.tipo_usuario === TipoUsuario.REPRESENTANTE) {
          can_edit = Boolean(
            rep.representante.permisos?.puede_editar_perfil_representante
          );
        }
      }

      if (session.user.tipo_usuario === TipoUsuario.CAZATALENTOS) {
        can_edit = false;
      }

      return {
        props: {
          user: session.user,
          id_talento: talento_id,
          id_rol: id_rol ? parseInt(id_rol as string) : 0,
          scroll_section: scroll_section ? (scroll_section as string) : "",
          can_edit: can_edit,
        },
      };
    }
    return {
      redirect: {
        destination: `/error?cause=${Constants.PAGE_ERRORS.UNAUTHORIZED_USER_ROLE}`,
        permanent: true,
      },
    };
  }
  return {
    redirect: {
      destination: "/",
      permanent: true,
    },
  };
};

export default DashBoardTalentosPage;
