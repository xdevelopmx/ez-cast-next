import { TRPCError } from "@trpc/server";
import { z } from "zod";

import bcrypt from 'bcrypt';

import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";
import type { Cazatalentos, Talentos } from "@prisma/client";
import { TipoUsuario } from "~/enums";

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
});
//getSecretMessage: protectedProcedure.query(() => {
//    return "you can now see this secret message!";
//}),