import fs from 'fs';
//import path from 'path';
const VALID_EXTENSIONS = ['png','jpg','jpeg','gif','webp','txt','docx','doc','pdf', 'mp4', 'mov', 'mp3', 'wav'];

export const FileManager = {
    S3: {
        saveFiles: async (to_be_saved: {path: string, base64: string, name: string, type: string}[]) => {            
            const result = await Promise.all(to_be_saved.map(async (file) => {
                let url: string | undefined = undefined;
                try {
                    const result = await (await fetch(`${(process.env.APP_URL) ? process.env.APP_URL : ''}/api/s3/upload`, {
                        method: 'POST',
                        //body: JSON.stringify({path: file.path, name: file.name, type: file.type, action: 'putObject'})
                        body: JSON.stringify({path: file.path, name: file.name, type: file.type, action: 'putObject'})
                    })).json() as {url: string};
                    if (result.url) {
                        url = result.url;
                    }
                } catch (e) {
                    console.log('error get url s3', e);
                }
                if (url) {
                    try {
                        const base64String = file.base64.replace(/^data:image\/\w+;base64,/, '');
                        const buff = new Buffer(base64String, 'base64');
                        await fs.promises.writeFile(`temp`, buff, {encoding: 'base64'});
                        const temp = await fs.promises.readFile('temp');

                        await fetch(`${url}`, {
                            method: 'PUT',
                            headers: {
                                "Content-Type": file.type,
                                //'Content-Encoding': 'base64',
                                "Access-Control-Allow-Origin": "*",
                            },
                            //body: buff
                            body: temp
                        })
                    } catch (e) {
                        url = undefined;
                        console.log('error uploading file s3', e);
                    }
                }
                return url;
            }));
            console.log(result);
            return result;
        },
        deleteFiles: async (paths: string[]) => {
            const result = await Promise.all(paths.map(async (path) => {
                let url: string | undefined = undefined;
                try {
                    const result = await (await fetch(`${(process.env.APP_URL) ? process.env.APP_URL : ''}/api/s3/upload`, {
                        method: 'POST',
                        body: JSON.stringify({path: path, action: 'deleteObject'})
                    })).json() as {url: string};
                    if (result.url) {
                        url = result.url;
                    }
                } catch (e) {
                    console.log('error get url s3', e);
                }
                
                if (url) {
                    try {
                        await fetch(`${url}`, {
                            method: 'DELETE',
                            headers: {
                                "Access-Control-Allow-Origin": "*",
                            }
                        })
                    } catch (e) {
                        url = undefined;
                        console.log('error deleting file s3', e);
                    }
                }
                return url;
            }));
            return result;
        }  
    },
    /*
    saveFile: async (file_name: string, file_in_base64: string, pathname: string) => {
        if (process.env.FILES_ROOT_FOLDER) {
            const exploded_filename = file_name.split('.');    
            const name = exploded_filename[0];
            if (name) {
                const extension = exploded_filename[exploded_filename.length - 1];
                if (extension) {
                    console.log(extension)
                    if (!VALID_EXTENSIONS.includes(extension.toLowerCase())) {
                        return {result: null, error: new Error('Archivo con extension invalida')};     
                    }
    
                    const upload_path = path.join(process.env.FILES_ROOT_FOLDER, `/uploads/${pathname}`);
                    // checamos si existe la carpeta del path si no entonces la creamos
                    try {
                        await fs.promises.stat(`${upload_path}`);
                        console.log(upload_path);
                    } catch (err) {
                        console.log(upload_path);
                        console.log('la carpeta no existe se va a crear');
                        try {
                            await fs.promises.mkdir(upload_path, { recursive: true });
                        } catch(error) {
                            return {result: null, error: new Error('No se pudo crear la carpeta a la cual subir los archivos')}; 
                        }
                    }
                    const file_path = path.join(upload_path, `${name}.${extension}`);
                    try {
                        const curated_data = file_in_base64.replace(/^data:image\/\w+;base64,/, "");
                        const imageBuffer = Buffer.from(curated_data, 'base64');
                        await fs.promises.writeFile(file_path, imageBuffer, 'binary');
                        
                        //await fs.promises.rename(file.filepath, file_path);
                        //await file.mv(file_path);
                    } catch (err) {
                        return {result: null, error: new Error('No se pudo crear el archivo')}; 
                    }
                    return {result: `/uploads/${pathname}${name}.${extension}`, error: null};
                } else {
                    return {result: null, error: new Error('El archivo no tiene una extension definido')};
                }
            } else {
                return {result: null, error: new Error('El archivo no tiene un nombre definido')};
            }
        } else {
            return {result: null, error: new Error('No se definio una carpeta donde almacenar los archivos')}; 
        }
    },
    getFileAsBase64: async (file_path: string) => {
        const result: {file: null | string, error: Error | null} = { file: null, error: null };
        try {
            if (process.env.FILES_ROOT_FOLDER) {
                const upload_path = path.join(process.env.FILES_ROOT_FOLDER, `${file_path}`);
                const file = await fs.promises.readFile(upload_path, { encoding: 'base64' });
                result.file = file;
            } else {
                result.error = new Error('No esta definida la ruta donde estan almacenados los archivos');
            }
        } catch (err) {
            result.error = new Error('Ocurrio un problema al tratar de decodificar el archivo en base 64');
        }
        return result;
    },
    deleteFile: async (pathname: string) => {
        const upload_path = path.join(__dirname, `..${pathname}`);
        try {
            await fs.promises.stat(`${upload_path}`);
        } catch (err) {
            console.log('El archivo no existe');
            return {result: true, error: null};
        }
        try {
            await fs.promises.unlink(`${upload_path}`);
        } catch (err) {
            return {result: false, error: {
                status: 'error',
                msg: 'Ocurrio un error al tratar de eliminar el archivo ' + pathname,
                //detailed_msg: err.toString()
            }};
        }
        return { result: true, error: null};
    }
    */
}
