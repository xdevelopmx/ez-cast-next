import { createTRPCRouter } from "~/server/api/trpc";
import { AuthRouter } from "./routers/auth";
import { ProyectosRouter } from "./routers/proyectos";
import { RolesRouter } from "./routers/roles";
import { CatalogosRouter } from './routers/catalogos';
import { TalentosRouter } from "./routers/talentos";
import { CazatalentosRouter } from "./routers/cazatalentos";
import { BannersRouter } from "./routers/banners";

export type Archivo = {
  id?: number,
  base64: string,
  name: string,
  file: File,
  url?: string
}

export type NewMedia = {
  id: number,
  nombre: string,
  type: string,
  url: string,
  clave: string,
  referencia: string,
  identificador: string
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
  talentos: TalentosRouter,
  cazatalentos: CazatalentosRouter,
  banners: BannersRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
