import { type GetServerSidePropsContext } from "next";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import {
	getServerSession,
	type NextAuthOptions,
	type User,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { env } from "~/env.mjs";
import { TipoUsuario } from "~/enums";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */

declare module "next-auth" {
	interface User {
		tipo_usuario?: TipoUsuario;
		profile_img?: string | null;
		lang: 'es' | 'en';
		provider: 'CREDENTIALS' | 'FACEBOOK_OR_GOOGLE'
	}
	interface Session {
		user?: User;
	}
}
declare module "next-auth/jwt" {
	interface JWT extends User {
		tipo_usuario?: TipoUsuario;
		profile_img?: string | null;
		lang: 'es' | 'en';
		provider: 'CREDENTIALS' | 'FACEBOOK_OR_GOOGLE'
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
		jwt({ token, user, trigger, session, account, profile, isNewUser }) {
			console.log(user);
			if (user) {
				token.tipo_usuario = user.tipo_usuario;
				token.profile_img = user.profile_img;
				token.lang = user.lang;
				token.provider = 'CREDENTIALS';
			}
			if (trigger === "update" && session?.lang) {
				// Note, that `session` can be any arbitrary object, remember to validate it!
				token.lang = session.lang;
			}
			if (trigger === 'update' && session?.tipo_usuario) {
				token.tipo_usuario = session.tipo_usuario;
			}
			if (trigger === 'update' && session?.profile_img) {
				token.profile_img = session.profile_img;
			}
			if (trigger === 'update' && session?.id) {
				token.id = session.id;
			}
			if (trigger === 'update' && session?.name) {
				token.name = session.name;
			}
			if (trigger === 'update' && session?.lastname) {
				token.lastname = session.lastname;
			}
			if (trigger === 'update' && session?.provider) {
				token.provider = 'FACEBOOK_OR_GOOGLE';
			}	
			return token
		},
		session({ session, user, token }) {
			console.log(token);
			if (session.user) {
				session.user.tipo_usuario = token.tipo_usuario;
				session.user.provider = token.provider;
				if (session.user.provider === 'CREDENTIALS') {
					session.user.id = (token.sub) ? token.sub : '0';
				} else {
					session.user.id = token.id;
				}
				session.user.profile_img = token.profile_img;
				session.user.lang = token.lang;
			}
			return session
		},
	},
	//adapter: PrismaAdapter(prisma),
	providers: [
		FacebookProvider({
			clientId: `${process.env.NEXT_PUBLIC_FB_ID}`,
			clientSecret: `${process.env.NEXT_PUBLIC_FB_SECRET}`,
		}),
		GoogleProvider({
			clientId: `${process.env.NEXT_PUBLIC_GOOGLE_ID}`,
			clientSecret: `${process.env.NEXT_PUBLIC_GOOGLE_SECRET}`,
			authorization: {
				params: {
				  prompt: "consent",
				  access_type: "offline",
				  response_type: "code"
				}
			}
		}),
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
				correo_usuario: { label: 'correo_usuario', type: 'text' },
				lang: { label: 'lang', type: 'text' },
			},
			async authorize(credentials, req) {
				const INTERNAL_URL = (process.env.NEXT_PUBLIC_INTERNAL_URL) ? process.env.NEXT_PUBLIC_INTERNAL_URL : '';
				const login = async (username: string | null, email: string | null, password: string, tipo_usuario: TipoUsuario, lang: 'es' | 'en'): Promise<{ id: string, name: string, lastname: string, email: string, tipo_usuario: TipoUsuario, profile_img: string | null, lang: 'es' | 'en' } | null>  => {
					try {
						return fetch(`${INTERNAL_URL}/api/auth/login`, {
							method: 'POST',
							body: JSON.stringify({
								username: username,
								email: email,
								password: password,
								tipo_usuario: tipo_usuario
							})
						}).then(res => res.json()).then((res: { data: { id: string, name: string, lastname: string, email: string, tipo_usuario: TipoUsuario, profile_img: string | null } }) => {
							if (res.data) {
								return Promise.resolve({...res.data, lang: lang});
							} else {
								return Promise.resolve(null);
							}
						});

					} catch (e) {
						return Promise.resolve(null);
					}
				}
				if (credentials) {
					if (credentials.password.length < 8) {
						return null;
					}

					if (credentials.user.length < 2) {
						return null;
					}
					let tipo_usuario = TipoUsuario.NO_DEFINIDO;
					switch (credentials.tipo_usuario) {
						case TipoUsuario.TALENTO: tipo_usuario = TipoUsuario.TALENTO; break;
						case TipoUsuario.CAZATALENTOS: tipo_usuario = TipoUsuario.CAZATALENTOS; break;
						case TipoUsuario.REPRESENTANTE: tipo_usuario = TipoUsuario.REPRESENTANTE; break;
						case TipoUsuario.ADMIN: tipo_usuario = TipoUsuario.ADMIN; break;
					}
					const login_intent = await login( (credentials.user) ? credentials.user : '', (credentials.correo_usuario) ? credentials.correo_usuario : '', (credentials.password) ? credentials.password : '', tipo_usuario, (credentials.lang) ? credentials.lang === 'es' ? 'es' : 'en' : 'es');
					console.log(login_intent);
					return {...login_intent, lang: login_intent?.lang ? login_intent.lang : 'es', id: `${login_intent?.id}`, provider: 'CREDENTIALS'};
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
