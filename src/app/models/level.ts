import { Normativity } from "./normativity";

export class Level{
    id: number;
    descripcion: string;
    escalasSalariales: SalaryScale[];
    loaded: boolean;
}

export class SalaryScale{
    id: number;
    idNivel: number;
    codigo: string;
    nombre: string;
    estado: string;
    idNormatividad: number;
    incrementoPorcentual: number;
    normatividad: Normativity;
}
