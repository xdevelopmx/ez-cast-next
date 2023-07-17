
import type { Cazatalentos, Talentos, Administradores, Representante } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { TipoUsuario } from "~/enums";
import { prisma } from "~/server/db";
import bcrypt from 'bcrypt';
import Constants from "~/constants";

interface Request extends NextApiRequest {
	body: string
}

interface Body {
	username: string, 
	email: string, 
	password: string, 
	tipo_usuario: string
}

export default async function handler(req: Request, res: NextApiResponse) {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const form: Body = JSON.parse(req.body);
	switch (form.tipo_usuario) {
		case TipoUsuario.TALENTO: {
			const talento: Talentos | null = await prisma.talentos.findFirst({
				where: {
					OR: [
						{ email: { equals: (form.email) ? form.email : '' } },
						{ usuario: { equals: (form.username) ? form.username : '' } }
					],
				}
			});
			if (talento) {
				const correct_pass = await bcrypt.compare(form.password, talento.contrasenia);
				if (correct_pass) {
					return res.status(200).json({status: 'success', message: 'Login correcto', data: { id: talento.id.toString(), name: `${talento.nombre} ${talento.apellido}`, email: talento.email, tipo_usuario: TipoUsuario.TALENTO, profile_img: '' }});
				}
			}
			break;
		}
		case TipoUsuario.CAZATALENTOS: {
			const cazatalentos: Cazatalentos | null = await prisma.cazatalentos.findFirst({
				where: {
					OR: [
						{ email: { equals: (form.email) ? form.email : '' } },
						{
							usuario: { equals: (form.username) ? form.username : '' }
						}],
				}
			});
			if (cazatalentos) {
				const correct_pass = await bcrypt.compare(form.password, cazatalentos.contrasenia);
				if (correct_pass) {

					// revisar si tiene proyectos que no se han enviado a revision
					const proyectos_pendientes_a_revisar = await prisma.proyecto.findMany({
						where: {
							id_cazatalentos: cazatalentos.id,
							estatus: {
								in: [Constants.ESTADOS_PROYECTO.POR_VALIDAR, Constants.ESTADOS_PROYECTO.RECHAZADO]
							}
						}
					})
					if (proyectos_pendientes_a_revisar.length > 0) {
						await Promise.all(proyectos_pendientes_a_revisar.map(async (proyecto) => {
							const message = `¡Hola <span style="color: white; font-weight: 800;">“${cazatalentos.nombre} ${cazatalentos.apellido}”</span>! Te recordamos que tu proyecto <span style="color: white; font-weight: 800;">“${proyecto.nombre}“</span>, aún no
							ha sido enviado a aprobacion, ¡aprovecha esos momentos de inspiración y <a style="text-decoration: underline; color: white;" href="/cazatalentos/proyecto?id_proyecto=${proyecto.id}">concluye</a> o <a style="text-decoration: underline; color: white;" href="/cazatalentos/roles?id_proyecto=${proyecto.id}">manda tu proyecto a revision</a> para que pronto
							podamos aprobarlo y así comiences a filmar!`;
							const alerta = await prisma.alertas.findFirst({
								where: {
									mensaje: {
										equals: message
									}
								}
							})
							if (alerta) {
								return await prisma.alertas.update({
									where: { id: alerta.id },
									data: { visto: false }
								})
							} else {
								return await prisma.alertas.create({
									data: {
										id_usuario: proyecto.id_cazatalentos,
										tipo_usuario: TipoUsuario.CAZATALENTOS,
										visto: false,
										mensaje: message
									}
								})
							}
						}))
					}
					return res.status(200).json({status: 'success', message: 'Login correcto', data: { id: cazatalentos.id.toString(), name: `${cazatalentos.nombre} ${cazatalentos.apellido}`, email: cazatalentos.email, tipo_usuario: TipoUsuario.CAZATALENTOS, profile_img: '' }});
				}
			}
			break;
		}
		case TipoUsuario.REPRESENTANTE: {
			const representante: Representante | null = await prisma.representante.findFirst({
				where: {
					OR: [
						{ email: { equals: (form.email) ? form.email : '' } },
						{
							usuario: { equals: (form.username) ? form.username : '' }
						}],
				}
			});
			if (representante) {
				const correct_pass = await bcrypt.compare(form.password, representante.contrasenia);
				if (correct_pass) {
					return res.status(200).json({status: 'success', message: 'Login correcto', data: { id: representante.id.toString(), name: `${representante.nombre} ${representante.apellido}`, email: representante.email, tipo_usuario: TipoUsuario.REPRESENTANTE, profile_img: '' }});
				}
			}
			break;
		}
		case TipoUsuario.ADMIN: {
			const admin: Administradores | null = await prisma.administradores.findFirst({
				where: {
					OR: [
						{ email: { equals: (form.email) ? form.email : '' } },
						{
							usuario: { equals: (form.username) ? form.username : '' }
						}],
				}
			});
			if (admin) {
				const correct_pass = await bcrypt.compare(form.password, admin.contrasenia);
				if (correct_pass) {
					return res.status(200).json({status: 'success', message: 'Login correcto', data: { id: admin.id.toString(), name: 'ADMIN', email: admin.email, tipo_usuario: TipoUsuario.ADMIN, profile_img: '' }});
				}
			}
			break;
		}
	}

	return res.status(401).json({status: 'error', message: 'Login incorrecto'});
} 