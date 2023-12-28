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
	getGeneros: publicProcedure
		.query(async ({ ctx }) => {
			return await ctx.prisma.catalogoGeneros.findMany();
		}
	),
	getAparienciasEtnicas: publicProcedure
		.query(async ({ ctx }) => {
			return await ctx.prisma.catalogoAparenciasEtnicas.findMany();
		}
	),
	getUniones: publicProcedure
		.query(async ({ ctx }) => {
			return await ctx.prisma.catalogoUniones.findMany();
		}
	),
	getEstadosRepublica: publicProcedure
		.query(async ({ ctx }) => {
			return (await ctx.prisma.catalogoEstadosRepublica.findMany()).sort((e, e2) => {
				if (ctx.session?.user?.lang === 'en') {
					if (e.en > e2.en) return 1;
					if (e.en < e2.en) return -1;
					return 0; 
				}
				if (e.es > e2.es) return 1;
				if (e.es < e2.es) return -1;
				return 0; 
			});
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
	getTiposInteresesEnProyectos: publicProcedure
		.query(async ({ ctx }) => {
			return await ctx.prisma.catalogoTipoInteresProyectos.findMany();
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
	getColorCabello: publicProcedure
		.query(async ({ ctx }) => {
			return await ctx.prisma.catalogoColorCabello.findMany();
		}
	),
	getEstiloCabello: publicProcedure
		.query(async ({ ctx }) => {
			return await ctx.prisma.catalogoEstiloCabello.findMany();
		}
	),
	getVelloFacial: publicProcedure
		.query(async ({ ctx }) => {
			return await ctx.prisma.catalogoVelloFacial.findMany();
		}
	),
	getColorOjos: publicProcedure
		.query(async ({ ctx }) => {
			return await ctx.prisma.catalogoColorOjos.findMany();
		}
	),
	getTiposPiercings: publicProcedure
		.query(async ({ ctx }) => {
			return await ctx.prisma.catalogoTiposPiercings.findMany();
		}
	),
	getTipoHermanos: publicProcedure
		.query(async ({ ctx }) => {
			return await ctx.prisma.catalogoTiposHermanos.findMany();
		}
	),
	getParticularidades: publicProcedure
		.query(async ({ ctx }) => {
			return await ctx.prisma.catalogoParticularidades.findMany();
		}
	),
	getTiposTatuajes: publicProcedure
		.query(async ({ ctx }) => {
			return await ctx.prisma.catalogoTiposTatuajes.findMany();
		}
	),
	getTiposRoles: publicProcedure
		.query(async ({ ctx }) => {
			return await ctx.prisma.catalogoTiposRoles.findMany();
		}
	),
	getTiposCompensacionesNoMonetarias: publicProcedure
		.query(async ({ ctx }) => {
			return await ctx.prisma.catalogosCompNoMones.findMany();
		},
	),
	getTiposNSFW: publicProcedure
		.query(async ({ ctx }) => {
			return await ctx.prisma.catalogoNSFW.findMany();
		},
	),
	getTiposMultimedia: publicProcedure
		.query(async ({ ctx }) => {
			return await ctx.prisma.catalogoMediosMultimedia.findMany();
		},
	),
	getUsosDeHorario: publicProcedure
		.query(async ({ ctx }) => {
			return await ctx.prisma.catalogoTipoUsosHorario.findMany();
		},
	),
	getIdiomas: publicProcedure
		.query(async ({ ctx }) => {
			return await ctx.prisma.catalogoIdiomas.findMany();
		},
	),
	getNacionalidades: publicProcedure
		.query(async ({ ctx }) => {
			return await ctx.prisma.catalogoPaises.findMany();
		},
	),
	getEstadosAplicacionesRoles: publicProcedure
		.query(async ({ ctx }) => {
			return await ctx.prisma.catalogoEstadosAplicacionesRoles.findMany({
				orderBy: {
					id: 'asc',
				},
			});
		},
	),
	getTipoReportesTalento: publicProcedure
		.query(async ({ ctx }) => {
			return await ctx.prisma.catalogoTiposReportesTalento.findMany();
		},
	),
});
//getSecretMessage: protectedProcedure.query(() => {
//    return "you can now see this secret message!";
//}),