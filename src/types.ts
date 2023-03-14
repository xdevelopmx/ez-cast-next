import type { NextApiRequest } from "next";
import type formidable from 'formidable';

export interface RequestWithForm extends NextApiRequest {
    files: {[key: string]: formidable.File}
}
