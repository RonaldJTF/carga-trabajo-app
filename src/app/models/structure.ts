import { Activity } from "./activity";
import { Typology } from "./typology";

export class Structure{
    id?: number;
    nombre?: string;
    descripcion?: string;
    idTipologia?: number;
    idPadre?: number;
    subEstructuras?: Structure[];
    tipologia?: Typology;
    srcIcono?: string;
    archivo?: File;
    actividad?: Activity;
    orden?: number;
    selected?: boolean;
}