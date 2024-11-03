import { Variable } from "./variable";

export class Validity{
    id: number;
    nombre: string;
    anio: string;
    estado: string;
    valoresVigencia: ValueInValidity[];
}

export class ValueInValidity{
    id: number;
    idVariable: number;
    idVigencia: number;
    valor: number;
    variable: Variable;
    vigencia: Validity;
}