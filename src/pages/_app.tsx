import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import CssBaseline from '@mui/material/CssBaseline';

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { AnimatePresence } from "framer-motion";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";



const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
        <DndProvider backend={HTML5Backend}>
          <AnimatePresence
            mode="wait"
            initial={true}
            onExitComplete={() => { window.scrollTo(0, 0) }}
            >
            <Component {...pageProps} />
          </AnimatePresence>
        </DndProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
