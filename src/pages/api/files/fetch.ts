import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    console.log(req.body);
    if (req.body.url) {
        try {
            console.log(req.body.url);
            const blob = await (await fetch(req.body.url)).blob();
            console.log(blob.type, req.body.type);
            if (blob.type === req.body.type) {
                const buffer = Buffer.from(await blob.arrayBuffer());
                return res.status(200).json({ file: "data:" + blob.type + ';base64,' + buffer.toString('base64'), type: blob.type });
            } else {
                throw Error('Tipo invalido de archivo en : ' + req.body.url);
            }
        } catch (e) {
            console.log(e);
        }
    }
    return res.status(500);
}