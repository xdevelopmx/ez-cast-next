import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

export const CatalogosRouter = createTRPCRouter({
    getHabilidades: publicProcedure
		.input(z.object({ include_subcategories: z.boolean() }))
		.query(async ({ input, ctx }) => {
			return await ctx.prisma.catalogoHabilidades.findMany({
				include: {
					habilidades_especificas: input.include_subcategories
				}
			})
		}
	),
	getUniones: publicProcedure
		.query(async ({ ctx }) => {
			return await ctx.prisma.catalogoUniones.findMany();
		}
	),
	getEstadosRepublica: publicProcedure
		.query(async ({ ctx }) => {
			return await ctx.prisma.catalogoEstadosRepublica.findMany();
		}
	),
});
//getSecretMessage: protectedProcedure.query(() => {
//    return "you can now see this secret message!";
//}),