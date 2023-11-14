import React, { useContext, useEffect, useMemo, useState } from "react";

import { motion } from "framer-motion";
import { Box, Button, Grid, IconButton, Menu, MenuItem } from "@mui/material";
import { Circle, Close } from "@mui/icons-material";
import { api, parseErrorBody } from "~/utils/api";
import { useSession } from "next-auth/react";
import Image from "next/image";
import useNotify from "~/hooks/useNotify";
import AppContext from "~/context/app";
import useLang from "~/hooks/useLang";
import { useTheme } from '@mui/material/styles';
export const Alertas = () => {
  const ctx = useContext(AppContext);
  const textos = useLang(ctx.lang);

  const { notify } = useNotify();
  const session = useSession();
  const [show_alertas, setShowAlertas] = useState(false);
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<{
    el: null | HTMLElement;
    id_alerta: number;
  } | null>(null);

  const alertas = api.alertas.getByUser.useQuery({
    id_user:
      session.data && session.data.user ? parseInt(session.data.user.id) : 0,
    tipo_user:
      session.data && session.data.user && session.data.user.tipo_usuario
        ? session.data.user.tipo_usuario
        : "",
  });

  useEffect(() => {
    setAnchorEl(null);
  }, [alertas.data]);

  const updateOneSeen = api.alertas.updateOneSeen.useMutation({
    onSuccess(data, input) {
      notify("success", `${textos["success_update_alert"]}`);
      alertas.refetch();
    },
    onError: (error) => {
      notify("error", parseErrorBody(error.message));
    },
  });

  const markAllAsSeen = api.alertas.markAllAsSeen.useMutation({
    onSuccess(data, input) {
      notify("success", `${textos["success_update_alert"]}`);
      alertas.refetch();
    },
    onError: (error) => {
      notify("error", parseErrorBody(error.message));
    },
  });

  const deleteOne = api.alertas.deleteOne.useMutation({
    onSuccess(data, input) {
      notify("success", `${textos["success_delete_alert"]}`);
      alertas.refetch();
    },
    onError: (error) => {
      notify("error", parseErrorBody(error.message));
    },
  });

  const alert_elements = useMemo(() => {
    if (alertas.data) {
      return alertas.data.map((a, i) => {
        return (
          <div
            key={i}
            // style={{ backgroundColor: a.visto ? "lightgray" : "#4ab7c6", textAlign: 'center', }}
            style={{ backgroundColor: a.visto ? "lightgray" : "#4ab7c6", textAlign: 'center', display: 'flex', alignItems: 'center' }}
          >

            {/* <div style={{ marginLeft: 'auto', marginRight: 'auto', width: '100%', textAlign: 'justify' }}> */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'justify' }}>
              <div style={{ margin: 0, paddingLeft: 10, paddingRight: 5, }}>
                {!a.visto && (
                  <Circle
                    style={{
                      color: "tomato",
                      width: 16,
                      height: 16,
                      marginRight: 4,
                    }}
                  />
                )
                }

              </div>
              <div style={{ margin: 0, paddingTop: 20, paddingLeft: 5, paddingRight: 25, paddingBottom: 10 }} dangerouslySetInnerHTML={{ __html: a.mensaje }} />
            </div>
            <IconButton
              onClick={(e) => {
                setAnchorEl({ el: e.currentTarget, id_alerta: a.id });
              }}
              sx={{
                position: "absolute",
                top: 8,
                right: 0,
                width: "50px",
              }}
            >
              <Image
                src={`/assets/img/iconos/control_rol_edit.svg`}
                width={16}
                height={16}
                alt=""
              />
            </IconButton>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl?.el}
              open={Boolean(anchorEl && anchorEl.id_alerta === a.id)}
              onClose={() => {
                setAnchorEl(null);
              }}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <MenuItem
                onClick={() => {
                  updateOneSeen.mutate({
                    id_alerta: a.id,
                    new_state: !a.visto,
                  });
                }}
              >
                {textos["mc"]}{" "}
                {`${a.visto ? textos["no_leido"] : textos["leido"]}`}
              </MenuItem>
              <MenuItem
                onClick={() => {
                  deleteOne.mutate({ id_alerta: a.id });
                }}
              >
                {textos["eliminar"]}
              </MenuItem>
            </Menu>
          </div>
        );
      });
    }
    return [];
  }, [alertas.data, anchorEl]);

  return (
    <>
      <div style={{ position: "relative", width: "100%" }}>
        <motion.div
          style={{
            padding: 32,
            position: "absolute",
            width: "50%",
            right: -32,
            maxHeight: "75vh",
            boxShadow:
              "rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
            top: -64,
            borderRadius: 4,
            zIndex: show_alertas ? 99 : 0,
            backgroundColor: "#dff8fc",
          }}
          initial={{ opacity: 0, y: -100 }}
          animate={
            show_alertas ? { opacity: 1, y: 0 } : { opacity: 0, y: -100 }
          }
          exit={{ opacity: 0, y: -100 }}
          transition={{
            ease: "linear",
            duration: 0.4,
            opacity: { duration: 0.4 },
            y: { duration: 0.4 },
          }}
        >
          <IconButton
            style={{
              position: "absolute",
              right: 0,
              color: "#069cb1",
            }}
            aria-label="Cancelar edicion usuario"
            onClick={() => {
              setShowAlertas((show) => !show);
            }}
          >
            <Close />
          </IconButton>
          <div className="d-flex justify-content-end btn_alerts_header">
            <div className="box_alert_header mr-4">
              <motion.img src="/assets/img/iconos/bell_blue.svg" alt="" />
              {alertas.data &&
                alertas.data.filter((a) => !a.visto).length > 0 ? (
                <span className="count_msn active">
                  {alertas.data.filter((a) => !a.visto).length}
                </span>
              ) : null}
            </div>
            <p className="font-weight-bold h4 mr-5 mb-0 color_a">
              {textos["talertas"]}
            </p>
          </div>
          <Box textAlign={"end"}>
            <Button>{textos["vt"]}</Button>
            <Button
              onClick={() => {
                markAllAsSeen.mutate({
                  id_user:
                    session.data && session.data.user
                      ? parseInt(session.data.user.id)
                      : 0,
                  tipo_user:
                    session.data &&
                      session.data.user &&
                      session.data.user.tipo_usuario
                      ? session.data.user.tipo_usuario
                      : "",
                });
              }}
            >
              {textos["mtcl"]}
            </Button>
          </Box>
          <Grid
            container
            gap={2}
            justifyContent="center"
            overflow={"auto"}
            className="grid-scroll"
            sx={{
              [theme.breakpoints.up('xl')]: {
                maxHeight: '60dvh'
              },
              [theme.breakpoints.up('lg')]: {
                maxHeight: '55dvh'
              },
              [theme.breakpoints.up('md')]: {
                maxHeight: '40dvh'
              },
              [theme.breakpoints.up('sm')]: {
                maxHeight: '35dvh'
              },
              [theme.breakpoints.up('xs')]: {
                maxHeight: '25dvh'
              },
            }}
          >
            {alert_elements.map((r, i) => {
              return (
                <Grid key={i} item xs={12}>
                  <Box
                  >
                    {r}
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </motion.div>
      </div>
      <div className="pt-5 container_alerts_header">
        <div className="d-flex justify-content-end btn_alerts_header">
          <div className="box_alert_header mr-4">
            <motion.img
              onClick={() => {
                setShowAlertas((show) => !show);
              }}
              src="/assets/img/iconos/bell_blue.svg"
              alt=""
            />
            {alertas.data && alertas.data.filter((a) => !a.visto).length > 0 ? (
              <span className="count_msn active">
                {alertas.data.filter((a) => !a.visto).length}
              </span>
            ) : null}
          </div>
          <p
            onClick={() => {
              setShowAlertas((show) => !show);
            }}
            className="font-weight-bold h4 mr-5 mb-0 color_a"
          >
            {textos["talertas"]}
          </p>
        </div>
      </div>
    </>
  );
};
