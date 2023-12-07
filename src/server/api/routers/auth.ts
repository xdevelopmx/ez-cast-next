import { TRPCError } from "@trpc/server";
import { z } from "zod";

import bcrypt from 'bcrypt';

import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";
import type { Cazatalentos, Talentos } from "@prisma/client";
import { TipoUsuario } from "~/enums";
import ApiResponses from "~/utils/api-response";
import Constants from "~/constants";

export const AuthRouter = createTRPCRouter({
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
			const lang = (ctx.session && ctx.session.user) ? ctx.session.user.lang : 'es';
			const getResponse = ApiResponses('AuthRouter_createUser', lang);

			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
			const hashed_password = await bcrypt.hash(input.user.contrasenia, 12);
			if (!hashed_password) {
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: getResponse('error_no_cifro_contrasena')
				});
			}
			switch (input.tipo_usuario) {
				case TipoUsuario.TALENTO: {
					const talento = await ctx.prisma.talentos.findFirst({
						where: {
							OR: [
								{
									usuario: {
										equals: input.user.usuario
									}
								},
								{
									email: {
										equals: input.user.email
									}
								}
							]
						}
					})
					if (talento) {
						throw new TRPCError({
							code: 'CONFLICT',
							message: getResponse('error_usuario_o_correo_repetido')
						});
					}
					return await ctx.prisma.talentos.create({
						data: { ...input.user, contrasenia: hashed_password }
					});
					break;
				}
				case TipoUsuario.CAZATALENTOS: {
					const cazatalento = await ctx.prisma.cazatalentos.findFirst({
						where: {
							OR: [
								{
									usuario: {
										equals: input.user.usuario
									}
								},
								{
									email: {
										equals: input.user.email
									}
								}
							]
						}
					})
					if (cazatalento) {
						throw new TRPCError({
							code: 'CONFLICT',
							message: getResponse('error_usuario_o_correo_repetido')
						});
					}
					return await ctx.prisma.cazatalentos.create({
						data: { 
							nombre: input.user.nombre, 
							apellido: input.user.apellido,  
							usuario: input.user.usuario, 
							email: input.user.email,
							tipo_membresia: input.user.tipo_membresia,
							cobro_membresia: input.user.cobro_membresia,
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
					const representante = await ctx.prisma.representante.findFirst({
						where: {
							OR: [
								{
									usuario: {
										equals: input.user.usuario
									}
								},
								{
									email: {
										equals: input.user.email
									}
								}
							]
						}
					})
					if (representante) {
						throw new TRPCError({
							code: 'CONFLICT',
							message: getResponse('error_usuario_o_correo_repetido')
						});
					}
					return await ctx.prisma.representante.create({
						data: { 
							nombre: input.user.nombre, 
							apellido: input.user.apellido,  
							usuario: input.user.usuario, 
							email: input.user.email,
							tipo_membresia: input.user.tipo_membresia,
							cobro_membresia: input.user.cobro_membresia,
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
				message: getResponse('error_usuario_invalido')
			});
		}
	),
	updatePasswordByCode: publicProcedure
		.input(z.object({
			code: z.string(),
			tipo_usuario: z.string(),
			email: z.string(),
			password: z.string()
		}))
		.mutation(async ({ input, ctx }) => {
			console.log(input);
			const lang = (ctx.session && ctx.session.user) ? ctx.session.user.lang : 'en';
			const getResponse = ApiResponses('AuthRouter_updatePasswordByCode', lang);

			const code = await ctx.prisma.codigosRecuperacionPassword.findFirst({
				where: {
					code: input.code,
					for_user_with_email: input.email
				},
				take: 1,
				orderBy: {valid_until: 'desc'}
			});
			console.log(code);
			if (!code) {
				throw new TRPCError({
					code: 'BAD_REQUEST',
					message: getResponse('error_codigo_no_existe')
				});
			}
			const today = new Date();
			if (code.valid_until.getTime() < today.getTime()) {
				throw new TRPCError({
					code: 'BAD_REQUEST',
					message: getResponse('error_code_expired')
				});
			}
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
			const hashed_password = await bcrypt.hash(input.password, 12);
			if (!hashed_password) {
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: getResponse('error_no_cifro_contrasena')
				});
			}
			switch (input.tipo_usuario) {
				case TipoUsuario.CAZATALENTOS: {
					return await ctx.prisma.cazatalentos.updateMany({
						where: {
							email: input.email
						}, 
						data: {contrasenia: hashed_password}
					})
					break;
				}
				case TipoUsuario.TALENTO: {
					return await ctx.prisma.talentos.updateMany({
						where: {
							email: input.email
						}, 
						data: {contrasenia: hashed_password}
					})
					break;
				}
			}
			console.log('llego aqui');
			throw new TRPCError({
				code: 'INTERNAL_SERVER_ERROR',
				message: getResponse('error')
			});
		}
	),
	verifyCode: publicProcedure
	.input(z.object({
		code: z.string()
	}))
	.mutation(async ({ input, ctx }) => {
		const lang = (ctx.session && ctx.session.user) ? ctx.session.user.lang : 'en';
		const getResponse = ApiResponses('AuthRouter_verifyCode', lang);
		console.log(input);
		const code = await ctx.prisma.codigosRecuperacionPassword.findFirst({
			where: {
				code: input.code
			}
		});
		console.log(code);
		if (!code) {
			throw new TRPCError({
				code: 'BAD_REQUEST',
				message: getResponse('error_codigo_no_existe')
			});
		}
		const today = new Date();
		if (code.valid_until.getTime() < today.getTime()) {
			throw new TRPCError({
				code: 'BAD_REQUEST',
				message: getResponse('error_code_expired')
			});
		}
		return true;
	}),
	checkIfUsersExistsByEmailAndType: publicProcedure
	.input(z.object({
		email: z.string(),
		type: z.string()
	}))
	.query(async ({ input, ctx }) => {
		switch (input.type) {
			case TipoUsuario.TALENTO: {
				const talento = await ctx.prisma.talentos.findFirst({
					where: {
						email: input.email
					}
				});
				return talento !== null;
			}
			case TipoUsuario.CAZATALENTOS: {
				const cazatalentos = await ctx.prisma.cazatalentos.findFirst({
					where: {
						email: input.email
					}
				});
				return cazatalentos !== null;
			}
		}
		return false;
	}
),
	sendCode: publicProcedure
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
					"type": Constants.TIPOS_EMAILS.PASSWORD_RECOVERY,
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
//getSecretMessage: protectedProcedure.query(() => {
//    return "you can now see this secret message!";
//}),