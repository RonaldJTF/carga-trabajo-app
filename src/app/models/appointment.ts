import { LevelCompensation } from "./compensation";
import { Hierarchy } from "./hierarchy";
import { Level } from "./level";
import { Normativity, Scope } from "./normativity";
import { Structure } from "./structure";
import { Validity } from "./validity";

export class Appointment{
    id: number;
    asignacionBasicaMensual: number;
    totalCargos: number;
    idJerarquia: number;
    idNivel: number;
    idNormatividad: number;
    idEscalaSalarial: number;
    idAlcance: number;
    idVigencia: number;
    vigencia: Validity;
    jerarquia: Hierarchy;
    normatividad: Normativity;
    alcance: Scope;
    nivel: Level;
    asignacionTotal: number;
    compensacionesLaboralesAplicadas: LevelCompensation[];
    asignacionBasicaAnual: number;
}