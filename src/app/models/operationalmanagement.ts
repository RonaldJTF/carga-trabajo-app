import { Typology } from "./typology";

export class OperationalManagement{
    id?: number;
    nombre?: string;
    descripcion?: string;
    idTipologia?: number;
    idPadre?: number;
    subGestionesOperativas?: OperationalManagement[];
    tipologia?: Typology;
    orden?: number;
    loaded?: boolean;
}