import { Box, Divider, Grid, Typography } from "@mui/material";
import Head from "next/head";
import { FormGroup, MRadioGroup, MainLayout } from "~/components";
import { MTooltip } from "~/components/shared/MTooltip";
import useNotify from "~/hooks/useNotify";
import { InvalidEmailError, InvalidFieldError } from "~/utils/errores";
import { useReducer, type FormEvent } from "react";
import InvitacionTalentoEmail from "~/components/emails/invitacion-talento";
import { api, parseErrorBody } from "~/utils/api";
import { useRouter } from "next/router";
import RegistroPage from "../registro";
import { TipoUsuario } from "~/enums";

type RegistrarTalentoState = {};

const reducer = (
  state: RegistrarTalentoState,
  action: { type: string; data: unknown }
): RegistrarTalentoState => {
  switch (action.type) {
    default:
      return state;
  }
};

const initial_state: RegistrarTalentoState = {};

const RegistrarTalentoPage = () => {
  const [state, dispatch] = useReducer(reducer, initial_state);

  const { notify } = useNotify();

  const router = useRouter();

  const assignTalento = api.representantes.assignTalento.useMutation({
    onSuccess: (data) => {
      notify("success", "Se creo el talento con exito");
      router.replace(`/talento/editar-perfil?id_talento=${data.id_talento}`);
    },
    onError: (err) => {
      notify("error", parseErrorBody(err.message));
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
        <RegistroPage
          is_representante
          onSave={(id_user, tipo_user) => {
            if (tipo_user === TipoUsuario.TALENTO) {
              assignTalento.mutate({ id_talento: id_user });
            }
          }}
        />
      </MainLayout>
    </>
  );
};

export default RegistrarTalentoPage;
