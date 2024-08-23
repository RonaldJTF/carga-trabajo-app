import {Action} from "./action";

export class Typology{
    id?: number;
    nombre?: string;
    claseIcono?: string;
    nombreColor?: string;
    idTipologiaSiguiente?: number;
    tipologiaSiguiente?: Typology;
    acciones?: Action[];
    esDependencia?: string;
}
