/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { NextApiRequest, NextApiResponse } from "next";

interface Body {
	body: string,
	url: string,
	type: string
}


export const upload = async (req: NextApiRequest, res: NextApiResponse) => {
	let url: string | null = null;
	if (req.method !== "POST") {
		return res.status(405).json({ message: "Method not allowed" });
	}

	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const body: Body = JSON.parse(req.body as string);
	if (body.body) {
		try {
			let base64String = body.body;
			if (base64String.includes('data:image')) {
				base64String = base64String.replace(/^data:image\/\w+;base64,/, '');
			}
			if (base64String.includes('data:application')) {
				base64String = base64String.replace(/^data:application\/\w+;base64,/, '');
			}
			if (base64String.includes('data:video')) {
				base64String = base64String.replace(/^data:video\/\w+;base64,/, '');
			}
			if (base64String.includes('data:audio')) {
				base64String = base64String.replace(/^data:audio\/\w+;base64,/, '');
			}
			
			const buff = new Buffer(base64String, 'base64');
			const result = await fetch(`${body.url}`, {
				method: 'PUT',
				headers: {
					"Content-Type": body.type,
					'Content-Encoding': 'base64',
					"Access-Control-Allow-Origin": "*",
				},
				body: buff
			});
			if (result.status === 200) {
				url = decodeURIComponent(result.url).substring(0, decodeURIComponent(result.url).indexOf('?'));
			}
		} catch (e) {
			console.log('error uploading file s3', e);
		}
	}
	return res.json({url: url});
};

export default upload;

export const config = {
	api: {
		bodyParser: {
			sizeLimit: "8mb", // Set desired value here
		},
	},
};