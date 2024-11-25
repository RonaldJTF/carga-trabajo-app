import { Normativity } from "./normativity";
import {LevelCompensation} from "./compensation";

export class Level{
    id: number;
    descripcion: string;
    nombre: string;
    escalasSalariales: SalaryScale[];
    compensacionesLabNivelVigencias: LevelCompensation[];
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
