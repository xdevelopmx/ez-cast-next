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
import { Box, CssBaseline } from "@mui/material";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, esES } from "@mui/x-date-pickers";
import 'dayjs/locale/es-mx';
import { Header } from "~/components";


const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const [app_alerts, setAppAlerts] = useState<Map<string, AppAlert>>(new Map);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);
  const [lang, setLang] = useState<'es' | 'en'>('es');
  return (
    <SessionProvider session={session}>
      <DndProvider backend={HTML5Backend}>
        <AppContext.Provider value={{
          alerts: app_alerts,
          setAlerts: (alerts: Map<string, AppAlert>) => {
            setAppAlerts(new Map(alerts));
          },
          lang: lang,
          setLang: (lang) => {
            setLang(lang);
          },
          isLoadingData: isLoadingData,
          setIsloadingData: setIsLoadingData,
        }}>
          <CustomThemeProvider>
            <CssBaseline />
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'es-mx'}>
              <AnimatePresence
                mode="wait"
                initial={true}
                onExitComplete={() => { window.scrollTo(0, 0) }}
              >
                <Component {...pageProps} />
              </AnimatePresence>
            </LocalizationProvider>
          </CustomThemeProvider>

        </AppContext.Provider>
      </DndProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
