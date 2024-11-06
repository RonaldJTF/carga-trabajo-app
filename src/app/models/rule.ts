import { Variable } from "./variable";

export class Rule{
    id: number;
    nombre: string;
    descripcion: string;
    condiciones: string;
    global: string;
    estado: string;
    variablesRelacionadas: Variable[];
  }