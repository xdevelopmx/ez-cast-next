export class InvalidEmailError extends Error {
    constructor(){
        const msg = "Correo electrónico no válido";
        super(msg);
        this.name = msg;
    }
}

export class InvalidFieldError extends Error {
    constructor(msg: string){
        super(msg);
        this.name = msg;
    }
}