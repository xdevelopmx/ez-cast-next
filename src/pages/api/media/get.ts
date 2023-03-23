
import { Cazatalentos, Talentos } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { TipoUsuario } from "~/enums";
import { prisma } from "~/server/db";
import { FileManager } from "~/utils/file-manager";

interface Request extends NextApiRequest {
	body: string
}

interface Body {
	path: string, 
	name: string, 
    extension: string
}

export default async function handler(req: Request, res: NextApiResponse) {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const form: Body = JSON.parse(req.body);
    const file = await FileManager.getFileAsBase64(`${form.path}${form.name}`);
    if (file.error) {
        res.status(404).json({status: 'error', message: 'No se encontro'});
    }
	return res.status(200).json({status: 'success', message: 'Se encontro', base64: file.file});
} 