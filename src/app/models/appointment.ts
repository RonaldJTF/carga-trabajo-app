import { LevelCompensation } from "./compensation";
import { Normativity } from "./normativity";
import { Structure } from "./structure";
import { Validity } from "./validity";

export class Appointment{
    id: number;
    asignacionBasicaMensual: number;
    totalCargos: number;
    idEstructura: number;
    idNivel: number;
    idNormatividad: number;
    idEscalaSalarial: number;
    idAlcance: number;
    idVigencia: number;
    vigencia: Validity;
    estructura: Structure;
    normatividad: Normativity;
    asignacionTotal: number;
    compensacionesLaboralesAplicadas: LevelCompensation[];
    asignacionBasicaAnual: number;
}