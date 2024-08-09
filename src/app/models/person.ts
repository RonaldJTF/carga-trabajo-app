import {Gender} from "./gender";
import {User} from "./user";
import {DocumentType} from "./documenttype";

export class Person {
  id: number;
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  idTipoDocumento: number;
  idGenero: number;
  tipoDocumento: DocumentType;
  documento: string;
  correo: string;
  genero: Gender;
  telefono: string;
  srcFoto: string;
  usuario: User;

  nombres: string;
  apellidos: string;
  nombreCompleto: string;
}
