import { Button, Link, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { type NextPage } from "next";
import Head from "next/head";
import { useContext, useState } from "react";
import SendIcon from '@mui/icons-material/Send';
import { CarrucelFondo, MainLayout, RestablecerContrasenaComponent } from "~/components";
import AppContext from "~/context/app";
import useLang from "~/hooks/useLang";
import useNotify from "~/hooks/useNotify";
import { api, parseErrorBody } from "~/utils/api";
import { TipoUsuario } from "~/enums";
import { MTooltip } from "~/components/shared/MTooltip";
import MotionDiv from "~/components/layout/MotionDiv";

const RestablecerContrasena: NextPage = () => {
  const ctx = useContext(AppContext);
  const textos = useLang(ctx.lang);
  const [requested_code, setRequestedCode] = useState(false);
  const [tipo_usuario, setTipoUsuario] = useState(TipoUsuario.TALENTO);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [valid_code, setValidCode] = useState(false);
  const [password, setPassword] = useState({
    password: '',
    confirmation: ''
  });
  
  const {notify} = useNotify();
  
  const user_exists = api.auth.checkIfUsersExistsByEmailAndType.useQuery({
    type: tipo_usuario,
    email: email
  });

  const verifyCode = api.auth.verifyCode.useMutation({
    onSuccess: (success) => {
      notify("success", `${textos['codigo_valido']}`);
      setValidCode(true);
      setRequestedCode(false);
    },
    onError: (error) => {
      setValidCode(false);
      notify("error", parseErrorBody(error.message));
    },
  });

  const sendCode = api.auth.sendCode.useMutation({
    onSuccess: (success) => {
      notify(
        success ? "success" : "error",
        success
          ? `${textos['se_envio_codigo_restablecer_password']}`
          : `${textos['error_envio_codigo_restablecer_password']}`
      );
      setRequestedCode(true);
    },
    onError: (error) => {
      notify("error", parseErrorBody(error.message));
    },
  });

  const updatePassword = api.auth.updatePasswordByCode.useMutation({
    onSuccess: (success) => {
      notify(
        success ? "success" : "error",
        tipo_usuario === TipoUsuario.TALENTO
          ? `${textos['success_update_talento']}`
          : `${textos['success_update_cazatalento']}`
      );
      setRequestedCode(false);
      setValidCode(false);
      setCode('');
      setPassword({password: '', confirmation: ''});
    },
    onError: (error) => {
      notify("error", parseErrorBody(error.message));
    },
  });
  return (
    <>
      <Head>
        <title>Restablecer contraseña | Talent Corner</title>
        <meta name="description" content="Talent Corner" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MotionDiv show={true} animation="down-to-up">
      <MainLayout style={{ marginTop: 0 }}>
        <CarrucelFondo>
          
            <div className="box_cart_login">
                <div className="login_container text-center">
                    <motion.img className="logo_head_cart" src="/assets/img/iconos/EZ_Claqueta_N_S.svg" alt="icono" />
                    <p className="h1 text-uppercase mb-3 text-center">EZ-CAST</p>

                    <a onClick={(e) => {
                      setRequestedCode(!requested_code);
                      setCode('');
                      e.preventDefault();
                    }} style={{color: 'blue'}}>{requested_code ? `${textos['obten_tu_codigo']}` : `${textos['tienes_codigo']}`}</a>
                    <div className="d-flex align-items-center justify-content-center text-center flex-wrap">
                <div style={{marginTop: 16, marginBottom: 16}}>
                  <span
                    className={`switch_span switch_login ${
                      tipo_usuario === TipoUsuario.CAZATALENTOS
                        ? "active"
                        : ""
                    }`}
                    onClick={() => {
                      setTipoUsuario(TipoUsuario.CAZATALENTOS);
                    }}
                    style={{
                      padding: "2px 10px",
                      borderColor: "#069cb1",
                      color:
                        tipo_usuario === TipoUsuario.CAZATALENTOS
                          ? "#fff"
                          : "#000",
                    }}
                  >
                    {textos["cazatalentos"] ?? ""}
                  </span>
                  <MTooltip
                    color="orange"
                    sx={{
                      margin: "0!important",
                    }}
                    text={
                      <>
                        <Typography fontSize={"12px"}>
                          {textos["descripcion_cazatalentos"] ?? ""}
                        </Typography>
                      </>
                    }
                    placement="right"
                  />
                </div>
                <div>
                  <span
                    className={`switch_span switch_login ${
                      tipo_usuario === TipoUsuario.TALENTO ? "active" : ""
                    }`}
                    onClick={() => {
                      setTipoUsuario(TipoUsuario.TALENTO)
                    }}
                    style={{
                      borderColor: "#069cb1",
                      color:
                        tipo_usuario === TipoUsuario.TALENTO
                          ? "#fff"
                          : "#000",
                    }}
                  >
                    {textos["talento"] ?? ""}
                  </span>
                  <MTooltip
                    sx={{
                      margin: "0!important",
                    }}
                    color="orange"
                    text={
                      <>
                        <Typography fontSize={"12px"}>
                          {textos["descripcion_talento"] ?? ""}
                        </Typography>
                      </>
                    }
                    placement="right"
                  />
                </div>
              </div>
                    {!requested_code && !valid_code &&
                      <div className="d-lg-flex align-items-center justify-content-center p-2 box_input">
                          <div className="flex_half">
                              <label htmlFor="user">Email</label>
                          </div>
                          <div className="flex_one">
                              <input value={email} onChange={(e) => setEmail(e.target.value)} type="text" className="form-control form-control-sm text_custom login_custom m-0" />
                          </div>
                      </div>
                    }
                    {valid_code &&
                      <>
                        <div className="d-lg-flex align-items-center justify-content-center p-2 box_input">
                          <div className="flex_half">
                              <label htmlFor="user">{`${textos['nueva_contrasena']}`}</label>
                          </div>
                          <div className="flex_one">
                              <input value={password.password} onChange={(e) => { setPassword(prev => { return {...prev, password: e.target.value}})}} type='password' className="form-control form-control-sm text_custom login_custom m-0" />
                          </div>
                      </div>
                      <div className="d-lg-flex align-items-center justify-content-center p-2 box_input">
                          <div className="flex_half">
                              <label htmlFor="user">{`${textos['confirmar_nueva_contrasena']}`}</label>
                          </div>
                          <div className="flex_one">
                              <input value={password.confirmation} onChange={(e) => { setPassword(prev => { return {...prev, confirmation: e.target.value}})}} type='password' className="form-control form-control-sm text_custom login_custom m-0" />
                          </div>
                      </div>
                      
                      </>
                    }
                    {requested_code && !valid_code &&
                      <div className="d-lg-flex align-items-center justify-content-center p-2 box_input">
                          <div className="flex_half">
                              <label htmlFor="user">{`${textos['codigo']}`}</label>
                          </div>
                          <div className="flex_one">
                              <input value={code} onChange={(e) => setCode(e.target.value)} type='password' className="form-control form-control-sm text_custom login_custom m-0" />
                          </div>
                      </div>
                    }

                    {!requested_code && !valid_code &&
                      <div className="text-center mt-3 pl-2 pr-2">
                          <Button 
                            sx={{
                              backgroundColor: '#069cb1'
                            }}
                            onClick={() => {
                              if (Boolean(user_exists.data)) {
                                sendCode.mutate({
                                  to: email,
                                  subject: `${textos['password_recovery']}`,
                                  from: 'talent.corner22@gmail.com',
                                  data: {
                                    tipo_usuario: tipo_usuario 
                                  },
                                });
                              } else {
                                notify('warning', `${textos['user_dont_exists']}`);
                              }
                            }}
                            className="btn btn-intro btn-confirm mt-0">
                              {`${textos['enviar_codigo']}`}
                          </Button>
                      </div>
                    }

                    {requested_code &&
                      <div className="text-center mt-3 pl-2 pr-2">
                          <Button 
                            sx={{
                              backgroundColor: '#069cb1'
                            }}
                            onClick={async () => {
                              verifyCode.mutate({
                                  code: code
                              });
                            }}
                            className="btn btn-intro btn-confirm mt-0">
                              {`${textos['verificar_codigo']}`}
                          </Button>
                      </div>
                    }

                    {valid_code &&
                      <div className="text-center mt-3 pl-2 pr-2">
                          <Button 
                            onClick={() => {
                              if (password.password.length >= 6 && password.password === password.confirmation) {
                                updatePassword.mutate({
                                  code: code,
                                  email: email,
                                  tipo_usuario: tipo_usuario,
                                  password: password.password
                                })
                              } else {
                                notify('warning', `${textos['contrasena_invalida']}`);
                              }
                            }}
                            sx={{
                              backgroundColor: '#069cb1'
                            }}
                            className="btn btn-intro btn-confirm mt-0">
                              {`${textos['guardar_cambios']}`}
                          </Button>
                      </div>
                    }

                </div>
                <p className="text-white mt-2">
                  <a href="./ayuda-ezcast" className="text-white">
                    <u>{`${textos["necesitas_ayuda"]}`}</u>
                  </a>
                  &nbsp; {textos["accede_a"] ?? ""} &nbsp;
                  <a href="./ayuda-ezcast" className="text-white">
                    <u>{textos["tutoriales"] ?? ""}</u>
                  </a>
                </p>
            </div>
        </CarrucelFondo>
      </MainLayout>
      </MotionDiv>
    </>
  );
};

export default RestablecerContrasena;
