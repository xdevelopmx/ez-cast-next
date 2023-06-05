import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import type { Cazatalentos, Proyecto, Talentos } from "@prisma/client";
import { FileManager } from "~/utils/file-manager";
import { TipoUsuario } from "~/enums";
import Constants from "~/constants";

export const RepresentantesRouter = createTRPCRouter({
    getAll: protectedProcedure
		.query(async ({ ctx }) => {
			return await ctx.prisma.representante.findMany();
		}
    ),
});