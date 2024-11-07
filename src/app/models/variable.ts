export class Variable{
    id: number;
    nombre: string;
    descripcion: string;
    valor: string;
    primaria: string;
    global: string;
    porVigencia: string;
    estado: string;
    expresionValor: string;
    variablesRelacionadas: Variable[];
  }