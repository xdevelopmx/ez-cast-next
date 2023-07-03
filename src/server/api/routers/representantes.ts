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
import dayjs from "dayjs";

export const RepresentantesRouter = createTRPCRouter({
	getAll: protectedProcedure
		.query(async ({ ctx }) => {
			return await ctx.prisma.representante.findMany();
		}
	),
	assignTalento: protectedProcedure
		.input(z.object({
			id_talento: z.number(),
		}))
		.mutation(async ({ input, ctx }) => {
			const user = ctx.session.user; 
			if (user && user.tipo_usuario === TipoUsuario.REPRESENTANTE) {
				return await ctx.prisma.talentosRepresentados.create({
					data: {
						id_representante: parseInt(user.id),
						id_talento: input.id_talento,
						hora_asignacion: dayjs().toDate()
					}
				})
			}
			throw new TRPCError({
				code: 'UNAUTHORIZED',
				message: 'Solo el rol de representante puede asignarse un talento',
				// optional: pass the original error to retain stack trace
				//cause: theError,
			});
		}
	),
	sendInvitation: protectedProcedure
		.input(z.object({
			to: z.string(),
			subject: z.string(),
			from: z.string(),
			data: z.any()
		}))
		.mutation(async ({ input, ctx }) => {
			
			let response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/email/send`, {
				method: "POST",
				body: JSON.stringify({
					"type": Constants.TIPOS_EMAILS.INVITACION_TALENTO,
					"to": input.to,
					"subject": input.subject,
					"from": input.from,
					"data": input.data as {[key: string]: string}
				})
			});

			return response.status === 200;
		}
	),

});