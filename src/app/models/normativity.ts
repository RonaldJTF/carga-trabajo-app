import { SalaryScale } from "./level";

export class Normativity{
    id: number;
    nombre: string;
    descripcion: string;
    emisor: string;
    fechaInicioVigencia: string;
    fechaFinVigencia: string;
    estado: string;
    esEscalaSalarial: string;
    idAlcance: number;
    idTipoNormatividad: number;
    tipoNormatividad: NormativityType;
    alcance: Scope;
    salaryScales: SalaryScale[];
}

export class NormativityType{
    id: number;
    nombre: string;
    descripcion: string;
}

export class Scope{
    id: number;
    nombre: string;
    descripcion: string;
}