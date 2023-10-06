const VALID_EXTENSIONS = [
  "png",
  "jpg",
  "jpeg",
  "gif",
  "webp",
  "txt",
  "docx",
  "doc",
  "pdf",
  "mp4",
  "mov",
  "mp3",
  "wav",
];

export const FileManager = {
  convertFileToBase64: async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },
  getFileBuffer: async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base = reader.result as string;
        if (base.includes("data:image")) {
          resolve(
            new Buffer(
              base.replace(/^data:image\/\w+;base64,/, ""),
              "base64"
            ).toString()
          );
        }
        if (base.includes("data:application")) {
          resolve(
            new Buffer(
              base.replace(/^data:application\/\w+;base64,/, ""),
              "base64"
            ).toString()
          );
        }
        if (base.includes("data:video")) {
          resolve(
            new Buffer(
              base.replace(/^data:video\/\w+;base64,/, ""),
              "base64"
            ).toString()
          );
        }
        if (base.includes("data:audio")) {
          resolve(
            new Buffer(
              base.replace(/^data:audio\/\w+;base64,/, ""),
              "base64"
            ).toString()
          );
        }
        resolve(new Buffer(base, "base64").toString());
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },
  checkFilesRepeatedInArray: async (files: File[]) => {
    const n_files = Array.from(files);
    const buffers: string[] = await Promise.all(
      n_files.map(async (f): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const base = reader.result as string;
            if (base.includes("data:image")) {
              resolve(
                new Buffer(
                  base.replace(/^data:image\/\w+;base64,/, ""),
                  "base64"
                ).toString()
              );
            }
            if (base.includes("data:application")) {
              resolve(
                new Buffer(
                  base.replace(/^data:application\/\w+;base64,/, ""),
                  "base64"
                ).toString()
              );
            }
            if (base.includes("data:video")) {
              resolve(
                new Buffer(
                  base.replace(/^data:video\/\w+;base64,/, ""),
                  "base64"
                ).toString()
              );
            }
            if (base.includes("data:audio")) {
              resolve(
                new Buffer(
                  base.replace(/^data:audio\/\w+;base64,/, ""),
                  "base64"
                ).toString()
              );
            }
            resolve(new Buffer(base, "base64").toString());
          };
          reader.onerror = reject;
          reader.readAsDataURL(f);
        });
      })
    );
    const unique_buffers: string[] = [];
    buffers.forEach((b) => {
      if (!unique_buffers.includes(b)) {
        unique_buffers.push(b);
      }
    });
    return n_files.length === unique_buffers.length;
  },
  compareBase64Strings: (base64_1: string, base64_2: string) => {
    const bases: string[] = [base64_1, base64_2].map((base) => {
      if (base.includes("data:image")) {
        new Buffer(
          base.replace(/^data:image\/\w+;base64,/, ""),
          "base64"
        ).toString();
      }
      if (base.includes("data:application")) {
        new Buffer(
          base.replace(/^data:application\/\w+;base64,/, ""),
          "base64"
        ).toString();
      }
      if (base.includes("data:video")) {
        new Buffer(
          base.replace(/^data:video\/\w+;base64,/, ""),
          "base64"
        ).toString();
      }
      if (base.includes("data:audio")) {
        new Buffer(
          base.replace(/^data:audio\/\w+;base64,/, ""),
          "base64"
        ).toString();
      }
      return new Buffer(base, "base64").toString();
    });
    return bases[0] === bases[1];
  },
  convertUrlToFile: async (url: string, name: string, type: string) => {
    try {
      const blob = await (await fetch(url)).blob();
      const file = new File([blob], name, { type: type });
      return file;
    } catch (e) {
      console.error(e);
      try {
        const result = await fetch(`/api/files/fetch`, {
          method: 'POST',
          body: JSON.stringify({
            url: url,
            type: type
          }),
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
          },
        });
        if (result.ok) {
          const file_result = await result.json();
          const _file = await (await fetch(file_result.file)).blob();
          const file = new File([_file], name, { type: type });
          return file;
        }
      } catch (e2) {
        console.error(e2);
      }
    }
    return null;
  },
  createDummyFile: (name: string, type: string) => {
    return new File([], name, { type: type });
  },
  deleteFiles: async (to_be_deleted: string[]) => {
    const results = await Promise.all(
      to_be_deleted.map(async (clave) => {
        console.log("ELIMINAR ARCHIVO S3", clave);
        const response: {
          clave: string;
          deleted: boolean;
          error: string | null;
          url: string | null;
        } = { clave: clave, deleted: false, error: null, url: null };
        try {
          const result = (await (
            await fetch(
              `${
                process.env.NEXT_PUBLIC_APP_URL
                  ? process.env.NEXT_PUBLIC_APP_URL
                  : ""
              }/api/s3/create-presigned-url`,
              {
                method: "POST",
                body: JSON.stringify({
                  path: clave,
                  name: null,
                  type: null,
                  action: "deleteObject",
                }),
              }
            )
          ).json()) as { url: string };
          if (result.url) {
            response.url = result.url;
          }
        } catch (e) {
          const error = e as Error;
          response.error = error.message;
        }
        if (response.url) {
          try {
            const result_delete = await fetch(response.url, {
              method: "DELETE",
            });
            console.log("RESULT_DELETE", result_delete.ok);
            response.deleted = result_delete.ok;
          } catch (e) {
            const error = e as Error;
            response.error = error.message;
            console.log("error uploading file s3", e);
          }
        }
        return response;
      })
    );
    const errors: (string | null)[] = results
      .filter((r) => r.error != null)
      .map((r) => r.error);
    return { status: errors.length === 0, error: errors.join(", ") };
  },
  saveFiles: async (
    to_be_saved: { path: string; file: File; base64: string; name: string }[]
  ) => {
    let result: {
      [name: string]: {
        presigned_url: string | null;
        url: string | null;
        error: string | null;
      };
    }[] = [];
    if (to_be_saved) {
      result = await Promise.all(
        to_be_saved.map(async (file) => {
          const response: {
            [name: string]: {
              presigned_url: string | null;
              url: string | null;
              error: string | null;
            };
          } = {};
          response[file.name] = { presigned_url: null, url: null, error: null };
          try {
            const result = (await (
              await fetch(
                `${
                  process.env.NEXT_PUBLIC_APP_URL
                    ? process.env.NEXT_PUBLIC_APP_URL
                    : ""
                }/api/s3/create-presigned-url`,
                {
                  method: "POST",
                  body: JSON.stringify({
                    path: file.path,
                    name: file.name,
                    type: file.file.type,
                    action: "putObject",
                  }),
                }
              )
            ).json()) as { url: string };
            if (result.url && response[file.name]) {
              response[file.name] = {
                presigned_url: result.url,
                url: null,
                error: null,
              };
            }
          } catch (e) {
            const error = e as Error;
            response[file.name] = {
              presigned_url: null,
              url: null,
              error: error.message,
            };
          }
          if (response[file.name]) {
            try {
              const _res = await fetch(
                `${
                  process.env.NEXT_PUBLIC_APP_URL
                    ? process.env.NEXT_PUBLIC_APP_URL
                    : ""
                }/api/s3/upload`,
                {
                  method: "POST",
                  //body: JSON.stringify({path: file.path, name: file.name, type: file.type, action: 'putObject'})
                  body: JSON.stringify({
                    body: file.base64,
                    url: response[file.name]?.presigned_url,
                    type: file.file.type,
                  }),
                }
              );
              if (_res.ok) {
                const result_save = (await _res.json()) as { url: string | null };
                console.log("RESULT_SAVE", result_save);
                response[file.name] = {
                  presigned_url: null,
                  error: null,
                  url: result_save.url,
                };
              } else {
                throw Error(_res.statusText);
              }
            } catch (e) {
              const error = e as Error;
              response[file.name] = {
                presigned_url: null,
                url: null,
                error: error.message,
              };
              console.log("error uploading file s3", e);
            }
          }
          return response;
        })
      );
    }
    return result;
  },
};
