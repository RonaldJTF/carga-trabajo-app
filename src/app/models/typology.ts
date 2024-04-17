import { Action } from "./action";

export class Typology{
    id?: number;
    nombre?: string;
    descripcion?: string;
    claseIcono?: string;
    color?: string;
    idTipologiaSiguiente?: number;
    tipologiaSiguiente?: Typology;
    acciones?: Action[];
    esDependencia?: boolean;
}