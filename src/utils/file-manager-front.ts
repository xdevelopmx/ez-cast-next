const VALID_EXTENSIONS = ['png','jpg','jpeg','gif','webp','txt','docx','doc','pdf', 'mp4', 'mov', 'mp3', 'wav'];

export const FileManagerFront = {
    
    convertFileToBase64: async (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              resolve(reader.result as string);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        })
    },
    convertUrlToFile: async (url: string, type: string) => {
        const blob = await (await fetch(url)).blob();
        const file = new File([blob], "File name",{ type: type })
        return file;
    },
    createDummyFile: (name: string, type: string) => {
        return new File([], name,{ type: type });
    },
    saveFiles: async (to_be_saved: {path: string, file: File, base64: string, name: string}[]) => {            
        const result = await Promise.all(to_be_saved.map(async (file) => {
            const response: {[name: string]: {presigned_url: string | null, url: string | null, error: string | null}} = {};
            response[file.name] = {presigned_url: null, url: null, error: null};
            try {
                const result = await (await fetch(`${(process.env.APP_URL) ? process.env.APP_URL : ''}/api/s3/create-presigned-url`, {
                    method: 'POST',
                    body: JSON.stringify({path: file.path, name: file.name, type: file.file.type, action: 'putObject'})
                })).json() as {url: string};
                if (result.url && response[file.name]) {
                    response[file.name] = {presigned_url: result.url, url: null, error: null};
                }
            } catch (e) {
                const error = e as Error;
                response[file.name] = {presigned_url: null, url: null, error: error.message};
            }
            if (response[file.name]) {
                try {
                    const result_save = await (await fetch(`${(process.env.APP_URL) ? process.env.APP_URL : ''}/api/s3/upload`, {
                        method: 'POST',
                        //body: JSON.stringify({path: file.path, name: file.name, type: file.type, action: 'putObject'})
                        body: JSON.stringify({
                            body: file.base64,
                            url: response[file.name]?.presigned_url,
                            type: file.file.type
                        })
                    })).json() as {url: string | null};   
                    console.log('RESULT_SAVE', result_save);
                    response[file.name] = {presigned_url: null, error: null, url: result_save.url};
                } catch (e) {
                    const error = e as Error;
                    response[file.name] = {presigned_url: null, url: null, error: error.message};
                    console.log('error uploading file s3', e);
                }
            }
            return response;
        }));
        return result;
    },
}
