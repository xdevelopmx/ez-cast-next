/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { NextApiRequest, NextApiResponse } from "next";
import S3 from "aws-sdk/clients/s3";

const s3 = new S3({
	region: process.env.AWSDEFAULTREGION,
	accessKeyId: process.env.AWSACCESSKEYID,
	secretAccessKey: process.env.AWSSECRETACCESSKEY,
	signatureVersion: "v4",
});

interface Body {
	path: string,
	name: string, 
    type: string,
	action: string
}


export const createPresignedUrl = async (req: NextApiRequest, res: NextApiResponse) => {

	if (req.method !== "POST") {
		return res.status(405).json({ message: "Method not allowed" });
	}

	try {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		const body: Body = JSON.parse(req.body as string);
		const fileParams = {
			Bucket: process.env.BUCKET_NAME,
			Key: (body.action.toUpperCase() === 'PUTOBJECT' ? `${body.path}/${body.name}` : body.path),
			Expires: 1200,
			ContentType: (body.action.toUpperCase() === 'PUTOBJECT') ? body.type : null,
			ContentEncoding: (body.action.toUpperCase() === 'PUTOBJECT') ? 'base64' : null,
			ACL: (body.action.toUpperCase() === 'PUTOBJECT') ? "public-read" : null
		};

		const url = await s3.getSignedUrlPromise(body.action, fileParams);
		
		res.status(200).json({ url });
	} catch (err) {
		console.log(err);
		res.status(400).json({ message: err });
	}
};

export default createPresignedUrl;

export const config = {
	api: {
		bodyParser: {
			sizeLimit: "8mb", // Set desired value here
		},
	},
};