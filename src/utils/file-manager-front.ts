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
}
