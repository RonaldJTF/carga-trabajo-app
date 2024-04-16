import { TipoDocumento } from "./tipodocumento";
import { User } from "./user";

export class Person{
    id: string;
    primerNombre: string ;
    segundoNombre: string;
    primerApellido: string;
    segundoApellido: string;
    tipoDocumento: TipoDocumento;
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