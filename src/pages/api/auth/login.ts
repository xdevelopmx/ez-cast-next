
import { Cazatalentos, Talentos } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { TipoUsuario } from "~/enums";
import { prisma } from "~/server/db";
import bcrypt from 'bcrypt';

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
					return res.status(200).json({status: 'success', message: 'Login correcto', data: { id: cazatalentos.id.toString(), name: `${cazatalentos.nombre} ${cazatalentos.apellido}`, email: cazatalentos.email, tipo_usuario: TipoUsuario.CAZATALENTOS, profile_img: '' }});
				}
			}
			break;
		}
	}

	return res.status(401).json({status: 'error', message: 'Login incorrecto'});
} 