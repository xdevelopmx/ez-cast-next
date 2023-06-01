import { TRPCError } from "@trpc/server";
import { z } from "zod";

import bcrypt from 'bcrypt';

import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";
import type { Cazatalentos, Talentos } from "@prisma/client";
import { TipoUsuario } from "~/enums";

export const AuthRouter = createTRPCRouter({
    getById: publicProcedure
		.input(z.object({ id: z.number() }))
		.query(async ({ input, ctx }) => {
			const rol = await ctx.prisma.roles.findUnique({
				where: {id: input.id}
			});
			return rol;
		}
	),
  	createUser: publicProcedure
    	.input(z.object({ 
			tipo_usuario: z.string(),
			user: z.object({
				nombre: z.string().min(2).max(255), 
				apellido: z.string().min(2).max(255), 
				contrasenia: z.string().min(8).max(255), 
				usuario: z.string().min(1).max(255), 
				email: z.string().email(), 
				profile_img_url: z.string().nullish(), 
				tipo_membresia: z.string(),
				cobro_membresia: z.string(),
				id_openpay: z.string().nullish(),
				posicion_o_puesto: z.string().min(1).max(255).nullish(),
				compania: z.string().min(1).max(255).nullish(),
				biografia: z.string().min(1).max(255).nullish()
			})
		}))
		.mutation(async ({ input, ctx }) => {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
			const hashed_password = await bcrypt.hash(input.user.contrasenia, 12);
			if (!hashed_password) {
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: 'No se pudo cifrar la contrasena',
					// optional: pass the original error to retain stack trace
					//cause: theError,
				});
			}
			switch (input.tipo_usuario) {
				case TipoUsuario.TALENTO: {
					return await ctx.prisma.talentos.create({
						data: { ...input.user, contrasenia: hashed_password }
					});
					break;
				}
				case TipoUsuario.CAZATALENTOS: {
					return await ctx.prisma.cazatalentos.create({
						data: { 
							...input.user, 
							contrasenia: hashed_password, 
							posicion: (input.user.posicion_o_puesto) ? input.user.posicion_o_puesto : '',
							id_openpay: (input.user.id_openpay) ? input.user.id_openpay : '',
							compania: (input.user.compania) ? input.user.compania : '',
							biografia: (input.user.biografia) ? input.user.biografia : '',
						}
					});
					break;
				}
				case TipoUsuario.REPRESENTANTE: {
					return await ctx.prisma.representante.create({
						data: { 
							...input.user, 
							contrasenia: hashed_password, 
							posicion: (input.user.posicion_o_puesto) ? input.user.posicion_o_puesto : '',
							id_openpay: (input.user.id_openpay) ? input.user.id_openpay : '',
							compania: (input.user.compania) ? input.user.compania : '',
							biografia: (input.user.biografia) ? input.user.biografia : '',
						}
					});
					break;
				}
			}
			
			throw new TRPCError({
				code: 'BAD_REQUEST',
				message: 'No se envio un tipo de usuario valido',
				// optional: pass the original error to retain stack trace
				//cause: theError,
			});
		}
	),
});
//getSecretMessage: protectedProcedure.query(() => {
//    return "you can now see this secret message!";
//}),