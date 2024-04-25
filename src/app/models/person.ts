
import { DocumentType } from "./documenttype";
import { User } from "./user";

export class Person{
    id: number;
    primerNombre: string ;
    segundoNombre: string;
    primerApellido: string;
    segundoApellido: string;
    tipoDocumento: DocumentType;
    numeroDocumento: string;
    correo: string;
    genero: string;
    telefono: string;
    srcFoto: string;
    usuario: User;

    nombres: string;
    apellidos: string;
    nombreCompleto: string;
}