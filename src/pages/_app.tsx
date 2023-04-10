import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { AnimatePresence } from "framer-motion";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import AppContext, { type AppAlert } from "~/context/app";
import { useState } from "react";
import { CustomThemeProvider } from "~/theme";
import { CssBaseline } from "@mui/material";



const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const [app_alerts, setAppAlerts] = useState<Map<string, AppAlert>>(new Map);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);
  return (
    <SessionProvider session={session}>
      <DndProvider backend={HTML5Backend}>
        <AppContext.Provider value={{
          alerts: app_alerts,
          setAlerts: (alerts: Map<string, AppAlert>) => {
            setAppAlerts(new Map(alerts));
          },

          isLoadingData: isLoadingData,
          setIsloadingData: setIsLoadingData,
        }}>
          <CustomThemeProvider>
            <CssBaseline />
            <AnimatePresence
              mode="wait"
              initial={true}
              onExitComplete={() => { window.scrollTo(0, 0) }}
            >
              <Component {...pageProps} />
            </AnimatePresence>
          </CustomThemeProvider>

        </AppContext.Provider>
      </DndProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
