import { useState, useEffect, useContext } from "react";
import AppContext, { type AppAlert } from "~/context/app";

const useNotify = () => {
  const [alert, setAlert] = useState<AppAlert>();
  const ctx = useContext(AppContext);
  useEffect(() => {
    if (alert) {
      ctx.alerts.set("alert-" + new Date().getTime().toString(), alert);
      ctx.setAlerts(ctx.alerts);
      setAlert(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alert]);

  return {
    notify: (severity: "success" | "error" | "warning", message: string) => {
      const d = new Date();
      d.setMilliseconds(d.getMilliseconds() + 3000);
      setAlert({
        severity: severity,
        message: message,
        expire_time: d,
      });
    },
  };
};

export default useNotify;
