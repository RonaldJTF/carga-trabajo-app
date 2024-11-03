import { Normativity } from "./normativity";
import { Structure } from "./structure";
import { Validity } from "./validity";

export class Appointment{
    id: number;
    asignacionBasica: number;
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
}