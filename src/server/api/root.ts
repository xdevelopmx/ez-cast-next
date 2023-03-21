import { createTRPCRouter } from "~/server/api/trpc";
import { AuthRouter } from "./routers/auth";
import { ProyectosRouter } from "./routers/proyectos";
import { RolesRouter } from "./routers/roles";
import { CatalogosRouter } from './routers/catalogos';

export type Archivo = {
  base64: string,
  name: string,
  file: File
}

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  roles: RolesRouter,
  auth: AuthRouter,
  proyectos: ProyectosRouter,
  catalogos: CatalogosRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
