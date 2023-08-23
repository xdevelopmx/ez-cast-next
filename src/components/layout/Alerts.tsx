import { Alert, AlertTitle } from "@mui/material";
import { useContext, type FC } from "react";
import useAlerts from "~/hooks/useAlerts";
import MotionDiv from "./MotionDiv";
import AppContext from "~/context/app";

export const Alerts: FC = () => {
  const { alerts } = useAlerts();
  const ctx = useContext(AppContext);
  return (
    <div
      style={{
        position: "absolute",
        top: 76,
        width: "100%",
        margin: 0,
        zIndex: 9999,
        left: 0,
      }}
    >
      {Array.from(alerts).map((v, i) => {
        const color =
          v[1].severity === "success"
            ? "forestgreen"
            : v[1].severity === "error"
            ? "tomato"
            : "orange";
        return (
          <MotionDiv
            show={true}
            key={i}
            animation={"down-to-up"}
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "center",
              backgroundColor: color,
              border: "solid",
              borderColor: "rgba(0, 0, 0, 0.3)",
            }}
          >
            <Alert
              severity="success"
              sx={{
                backgroundColor: color,
                color: "whitesmoke",
                textAlign: "center",
              }}
              icon={null}
            >
              <AlertTitle>
                {v[1].severity === "success" ? ctx.lang === 'es' ? "Éxito" : 'Success' : ctx.lang === 'es' ? "Ocurrió un problema" : `There's been a problem`}
              </AlertTitle>
              {v[1].message}
            </Alert>
          </MotionDiv>
        );
      })}
    </div>
  );
};
