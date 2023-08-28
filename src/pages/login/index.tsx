import { type NextPage } from "next";
import { useContext, useMemo, useReducer } from "react";
import { signIn } from "next-auth/react";

import { motion } from "framer-motion";

import { CarrucelFondo, FormGroup, MainLayout } from "~/components";
import { Link, Typography } from "@mui/material";
import MotionDiv from "~/components/layout/MotionDiv";
import { TipoUsuario } from "~/enums";
import useLang from "~/hooks/useLang";
import useNotify from "~/hooks/useNotify";
import { useRouter } from "next/navigation";
import { MContainer } from "~/components/layout/MContainer";
import Image from "next/image";
import { MTooltip } from "~/components/shared/MTooltip";
import AppContext from "~/context/app";

type LoginForm = {
  user: string;
  password: string;
  tipo_usuario: TipoUsuario | null;
  errors: {
    user?: string;
    password?: string;
  };
};

function reducer(
  state: LoginForm,
  action: { type: string; value: { [key: string]: unknown } }
) {
  if (action.type === "update-form") {
    return { ...state, ...action.value };
  }
  throw Error(`Acción no definida ${action.type}`);
}

const LoginPage: NextPage = () => {
  const ctx = useContext(AppContext);
  const textos = useLang(ctx.lang);

  const { notify } = useNotify();
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, {
    user: "",
    password: "",
    errors: {},
    tipo_usuario: TipoUsuario.NO_DEFINIDO,
  });

  const validationLogin = useMemo(() => {
    const result = {
      errors: {
        user:
          !state.user || state.user.length < 2
            ? "El usuario es demasiado corto"
            : undefined,
        password:
          !state.password || state.password.length < 8
            ? "La contraseña es demasiado corta"
            : undefined,
      },
      hasErrors: false,
    };
    result.hasErrors =
      Object.entries(result.errors).filter((e) => e[1] != null).length > 0;
    return result;
  }, [state.password, state.user]);

  return (
    <MotionDiv show={true} animation="down-to-up">
      <MainLayout style={{ marginTop: 0 }}>
        <CarrucelFondo>
          <div className="box_cart_login">
            <div className="login_container text-center">
              <Image
                src="/assets/img/iconos/EZ_Claqueta_N_S.svg"
                width={40}
                height={40}
                alt=""
                style={{ margin: "25px 0 10px" }}
              />
              <h1 className="h1-login text-uppercase mb-3 text-center">
                EZ-CAST
              </h1>
              <p className="text-muted">
              {textos["no_tienes_cuenta"]?? ""}{" "}
                <Link href="/registro" className="color_a">
                {textos["registrate"]?? ""}
                </Link>
              </p>
              <div className="d-lg-flex align-items-center justify-content-center box_input">
                <MContainer
                  direction="horizontal"
                  styles={{ width: "100%", maxWidth: 300 }}
                  className="w-100 d-lg-flex justify-content-between"
                >
                  <label
                    style={{
                      margin: "4px 16px 0 0",
                      fontSize: 15,
                      fontWeight: 500,
                    }}
                    htmlFor="user"
                  >
                    {textos["mail"]?? ""}                  </label>
                  <FormGroup
                    error={state.errors.user}
                    show_error_message
                    className={`form-control form-control-sm text_custom ${
                      state.user.length < 2 ? "" : "login_custom"
                    } m-0`}
                    labelStyle={{ fontWeight: 400 }}
                    style={{
                      width: "160px",
                      fontSize: 13,
                      borderColor: "#069cb1!important",
                      background: "transparent",
                      borderRadius: 100,
                      padding: "0px 5px",
                    }}
                    value={state.user}
                    onChange={(e) => {
                      dispatch({
                        type: "update-form",
                        value: {
                          user: e.currentTarget.value,
                          errors: {
                            ...state.errors,
                            user:
                              !e.target.value || e.target.value.length < 2
                                ? "El usuario es demasiado corto"
                                : undefined,
                          },
                        },
                      });
                    }}
                  />
                </MContainer>
              </div>
              <div className="d-lg-flex align-items-center justify-content-center box_input w-100">
                <MContainer
                  direction="horizontal"
                  styles={{ width: "100%", maxWidth: 300 }}
                  className="w-100 d-lg-flex justify-content-between"
                >
                  <label
                    style={{
                      margin: "4px 16px 0 0",
                      fontSize: 15,
                      fontWeight: 500,
                    }}
                    htmlFor="user"
                  >
                    {textos["password"]?? ""}
                  </label>
                  <FormGroup
                    type="password"
                    show_error_message
                    error={state.errors.password}
                    className={`form-control form-control-sm text_custom ${
                      state.user.length < 2 ? "" : "login_custom"
                    } m-0`}
                    labelStyle={{ fontWeight: 400 }}
                    value={state.password}
                    style={{
                      width: "160px",
                      fontSize: 13,
                      borderColor: "#069cb1!important",
                      background: "transparent",
                      borderRadius: 100,
                      padding: "0px 5px",
                    }}
                    onChange={(e) => {
                      dispatch({
                        type: "update-form",
                        value: {
                          password: e.currentTarget.value,
                          errors: {
                            ...state.errors,
                            password:
                              !e.target.value || e.target.value.length < 8
                                ? "La contraseña es demasiado corta"
                                : undefined,
                          },
                        },
                      });
                    }}
                    label=""
                  />
                </MContainer>
              </div>
              <p className="text-muted">
              {textos["fgtpswd"]?? ""}{" "}
                <Link href="/restablecer-contrasena" className="color_a">
                {textos["restablecer"]?? ""}
                </Link>
              </p>
              <p>{textos["ingresar_como"]?? ""}</p>

              <div className="d-flex align-items-center justify-content-center text-center flex-wrap">
                <div>
                  <span
                    className={`switch_span switch_login ${
                      state.tipo_usuario === TipoUsuario.CAZATALENTOS
                        ? "active"
                        : ""
                    }`}
                    onClick={() => {
                      dispatch({
                        type: "update-form",
                        value: { tipo_usuario: TipoUsuario.CAZATALENTOS },
                      });
                    }}
                    style={{
                      padding: "2px 10px",
                      borderColor: "#069cb1",
                      color:
                        state.tipo_usuario === TipoUsuario.CAZATALENTOS
                          ? "#fff"
                          : "#000",
                    }}
                  >
                    {textos["cazatalentos"]?? ""}
                  </span>
                  <MTooltip
                    color="orange"
                    sx={{
                      margin: "0!important",
                    }}
                    text={
                      <>
                        <Typography fontSize={14}>
                        {textos["descripcion_cazatalentos"]?? ""}
                        </Typography>
                      </>
                    }
                    placement="right"
                  />
                </div>
                <div>
                  <span
                    className={`switch_span switch_login ${
                      state.tipo_usuario === TipoUsuario.TALENTO ? "active" : ""
                    }`}
                    onClick={() => {
                      dispatch({
                        type: "update-form",
                        value: { tipo_usuario: TipoUsuario.TALENTO },
                      });
                    }}
                    style={{
                      borderColor: "#069cb1",
                      color:
                        state.tipo_usuario === TipoUsuario.TALENTO
                          ? "#fff"
                          : "#000",
                    }}
                  >
                    {textos["talento"]?? ""}
                  </span>
                  <MTooltip
                    sx={{
                      margin: "0!important",
                    }}
                    color="orange"
                    text={
                      <>
                        <Typography fontSize={14}>
                        {textos["descripcion_talento"]?? ""}
                        </Typography>
                      </>
                    }
                    placement="right"
                  />
                </div>
                <div>
                  <span
                    className={`switch_span switch_login ${
                      state.tipo_usuario === TipoUsuario.REPRESENTANTE
                        ? "active"
                        : ""
                    }`}
                    onClick={() => {
                      dispatch({
                        type: "update-form",
                        value: { tipo_usuario: TipoUsuario.REPRESENTANTE },
                      });
                    }}
                    style={{
                      padding: "2px 10px",
                      borderColor: "#069cb1",
                      color:
                        state.tipo_usuario === TipoUsuario.REPRESENTANTE
                          ? "#fff"
                          : "#000",
                    }}
                  >
                    {textos["representante"]?? ""}
                  </span>
                  <MTooltip
                    color="orange"
                    sx={{
                      margin: "0!important",
                    }}
                    text={
                      <>
                        <Typography fontSize={14}>
                        {textos["descripcion_representante"]?? ""}
                        </Typography>
                      </>
                    }
                    placement="right"
                  />
                </div>
              </div>

              <div className="text-center mt-5 pl-2 pr-2">
                <button
                  className="btn btn-intro btn-confirm mt-0"
                  style={{ padding: "8px 87px" }}
                  onClick={() => {
                    if (!validationLogin.hasErrors) {
                      signIn("credentials", {
                        user: state.user,
                        password: state.password,
                        tipo_usuario: state.tipo_usuario,
                        correo_usuario: state.user,
                        lang: ctx.lang,
                        redirect: false,
                      })
                        .then((res) => {
                          if (res?.ok) {
                            notify(
                              "success",
                              `${textos["success_login"] ?? ""}`
                            );
                            router.push("/inicio");
                          } else {
                            notify("error", `${textos["error_login"] ?? ""}`);
                          }
                          console.log(res);
                        })
                        .catch((err: Error) => {
                          notify("error", err.message);
                        });
                    } else {
                      dispatch({
                        type: "update-form",
                        value: { errors: validationLogin.errors },
                      });
                      notify("warning", `${textos["error_form"] ?? ""}`);
                    }
                  }}
                >
                  {textos["login"]?? ""}
                </button>
              </div>

              <div className="text-center mt-3">
                <p>{textos["accede_con"]?? ""}</p>
              </div>
              <div className="d-lg-flex justify-content-center">
                <a
                  href="#"
                  style={{ width: "120px" }}
                  className="btn btn-intro btn-social btn-social-login mr-3 ml-3"
                >
                  <motion.img
                    height="16"
                    className="mr-2"
                    src="assets/img/iconos/google-logo.svg"
                    alt="Google"
                  />
                  Google
                </a>
                <a
                  href="#"
                  style={{ width: "120px" }}
                  className="btn btn-intro btn-social btn-social-login mr-3 ml-3"
                >
                  <motion.img
                    height="16"
                    className="mr-2"
                    src="assets/img/iconos/facebook-logo.svg"
                    alt="Facebook"
                  />
                  Facebook
                </a>
              </div>
            </div>
            <p className="text-white mt-2">
              <a href="./ayuda-ezcast" className="text-white">
                <u>{textos["necesitas_ayuda"]?? ""}</u>
              </a>
              &nbsp; {textos["accede_a"]?? ""} &nbsp;
              <a href="./ayuda-ezcast" className="text-white">
                <u>{textos["tutoriales"]?? ""}</u>
              </a>
            </p>
          </div>
        </CarrucelFondo>
      </MainLayout>
    </MotionDiv>
  );
};

export default LoginPage;
