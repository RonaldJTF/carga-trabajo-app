import { LevelCompensation } from "./compensation";
import { Hierarchy } from "./hierarchy";
import { Level, SalaryScale } from "./level";
import { Normativity, Scope } from "./normativity";
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
    escalaSalarial: SalaryScale;
    asignacionTotal: number;
    compensacionesLaboralesAplicadas: LevelCompensation[];
    asignacionBasicaAnual: number;
    denominacionesEmpleos: JobTitle[];
}

export class JobTitle{
    id: number;
    nombre: string;
    descripcion: string;
    totalCargos: number;
}

export class MultiAppointments{
    idJerarquia: number;
    idNormatividad: number;
    idAlcance: number;
    idVigencia: number;
    jerarquia: Hierarchy;
    normatividad: Normativity;
    alcance: Scope;
    vigencia: Validity;
    gruposNiveles: LevelGroupOfMultiAppointment[];
}

export class LevelGroupOfMultiAppointment{
    idNivel: number;
    nivel: Level;
    gruposEscalasSalariales: SalaryScaleGroupOfMultiAppointment[];
}

export class SalaryScaleGroupOfMultiAppointment{
    idCargo: number;
    idEscalaSalarial: number;
    escalaSalarial: SalaryScale;
    asignacionBasicaMensual: number;
    totalCargos: number;
    denominacionesEmpleos: JobTitle[];
}