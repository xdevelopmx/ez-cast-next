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
	getTipoProyectos: publicProcedure
		.query(async ({ ctx }) => {
			return await ctx.prisma.catalogoTipoProyectos.findMany();
		}
	),
	getTipoVehiculos: publicProcedure
		.query(async ({ ctx }) => {
			return await ctx.prisma.catalogoTipoVehiculos.findMany();
		}
	),
	getTipoMascotas: publicProcedure
		.query(async ({ ctx }) => {
			return await ctx.prisma.catalogoTipoMascota.findMany();
		}
	),
	getTipoRazasMascotas: publicProcedure
		.query(async ({ ctx }) => {
			return await ctx.prisma.catalogoRazaMascota.findMany();
		}
	),
	getTipoVestuarios: publicProcedure
		.query(async ({ ctx }) => {
			return await ctx.prisma.catalogoTipoVestuario.findMany();
		}
	),
	getTipoVestuarioEspecifico: publicProcedure
		.query(async ({ ctx }) => {
			return await ctx.prisma.catalogoTipoVestuarioEspecifico.findMany();
		}
	),
	getTipoProps: publicProcedure
		.query(async ({ ctx }) => {
			return await ctx.prisma.catalogoTipoProps.findMany();
		}
	),
	getTipoEquipoDeportivo: publicProcedure
		.query(async ({ ctx }) => {
			return await ctx.prisma.catalogoTipoEquipoDeportivo.findMany();
		}
	),
	getTipoDeTrabajos: publicProcedure
		.query(async ({ ctx }) => {
			return await ctx.prisma.catalogoTipoTrabajo.findMany();
		}
	),
	getTipoDeDocumentos: publicProcedure
		.query(async ({ ctx }) => {
			return await ctx.prisma.catalogoTipoDocumentos.findMany();
		}
	),
	getTipoDeDisponibilidad: publicProcedure
		.query(async ({ ctx }) => {
			return await ctx.prisma.catalogoTipoDisponibilidad.findMany();
		}
	),
});
//getSecretMessage: protectedProcedure.query(() => {
//    return "you can now see this secret message!";
//}),