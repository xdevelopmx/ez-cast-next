import { type GetServerSidePropsContext } from "next";
import {
	getServerSession,
	type NextAuthOptions,
	type DefaultSession,
	type DefaultUser,
	type User,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { env } from "~/env.mjs";
import { prisma } from "~/server/db";
import Constants from "~/constants";
import { Cazatalentos, Talentos } from "@prisma/client";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */

// Define a role enum
export enum TipoUsuario {
	TALENTO = "talento",
	CAZATALENTOS = "cazatalentos",
	NO_DEFINIDO = 'no_definido',
}

declare module "next-auth" {
	interface User {
		tipo_usuario?: TipoUsuario;
		profile_img?: string | null;
	}
	interface Session {
		user?: User;
	}
}
declare module "next-auth/jwt" {
	interface JWT extends User {
		tipo_usuario?: TipoUsuario;
		profile_img?: string | null;
	}
}


/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
	secret: process.env.NEXTAUTH_SECRET,
	session: {
		strategy: "jwt",
		maxAge: 604800, // 7 dias
	},
	callbacks: {
		redirect({ url, baseUrl }) {
			// Allows relative callback URLs
			if (url.startsWith("/")) return `${baseUrl}${url}`
			// Allows callback URLs on the same origin
			else if (new URL(url).origin === baseUrl) return url
			return baseUrl
		},
		signIn({ user, account, profile, email, credentials }) {
			return true
		},
		jwt({ token, user, account, profile, isNewUser }) {
			if (user) {
				token.tipo_usuario = user.tipo_usuario;
				token.profile_img = user.profile_img;
			}
			return token
		},
		session({ session, user, token }) {
			if (session.user) {
				session.user.tipo_usuario = token.tipo_usuario;
				session.user.id = (token.sub) ? token.sub : '0';
				session.user.profile_img = token.profile_img;
			}
			return session
		},
	},
	//adapter: PrismaAdapter(prisma),
	providers: [
		CredentialsProvider({
			// The name to display on the sign in form (e.g. "Sign in with...")
			name: "login",
			// `credentials` is used to generate a form on the sign in page.
			// You can specify which fields should be submitted, by adding keys to the `credentials` object.
			// e.g. domain, username, password, 2FA token, etc.
			// You can pass any HTML attribute to the <input> tag through the object.
			credentials: {
				user: { label: "usuario", type: "text" },
				password: { label: "password", type: "password" },
				tipo_usuario: { label: 'tipo_usuario', type: 'text' },
				correo_usuario: { label: 'correo_usuario', type: 'text' }
			},
			async authorize(credentials, req) {
				const APP_URL = (process.env.APP_URL) ? process.env.APP_URL : '';
				const login = async (username: string | null, email: string | null, password: string, tipo_usuario: TipoUsuario): Promise<{ id: string, name: string, email: string, tipo_usuario: TipoUsuario, profile_img: string | null } | null>  => {
					try {
						return fetch(`${APP_URL}/api/auth/login`, {
							method: 'POST',
							body: JSON.stringify({
								username: username,
								email: email,
								password: password,
								tipo_usuario: tipo_usuario
							})
						}).then(res => res.json()).then((res: { data: { id: string, name: string, email: string, tipo_usuario: TipoUsuario, profile_img: string | null } }) => {
							if (res.data) {
								return Promise.resolve(res.data);
							} else {
								return Promise.resolve(null);
							}
						});

					} catch (e) {
						return Promise.resolve(null);
					}
				}
				if (credentials) {
					let tipo_usuario = TipoUsuario.NO_DEFINIDO;
					switch (credentials.tipo_usuario) {
						case TipoUsuario.TALENTO: tipo_usuario = TipoUsuario.TALENTO; break;
						case TipoUsuario.CAZATALENTOS: tipo_usuario = TipoUsuario.CAZATALENTOS; break;
					}
					const login_intent = await login( (credentials.user) ? credentials.user : '', (credentials.correo_usuario) ? credentials.correo_usuario : '', (credentials.password) ? credentials.password : '', tipo_usuario);
					return login_intent;
				} 
				return null;
			}
		})
		/**
		 * ...add more providers here.
		 *
		 * Most other providers require a bit more work than the Discord provider. For example, the
		 * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
		 * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
		 *
		 * @see https://next-auth.js.org/providers/github
		 */
	],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
	req: GetServerSidePropsContext["req"];
	res: GetServerSidePropsContext["res"];
}) => {
	return getServerSession(ctx.req, ctx.res, authOptions);
};
