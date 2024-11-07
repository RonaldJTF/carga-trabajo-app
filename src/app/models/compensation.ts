import {Periodicity} from "./periodicity";
import {Category} from "./category";
import {Level, SalaryScale} from "./level";
import {Scope} from "./normativity";
import {Rule} from "./rule";
import {Variable} from "./variable";

export class Compensation {
  id?: number;
  nombre?: string;
  descripcion?: string;
  estado?: string;
  idCategoria?: number;
  categoria?: Category;
  idPeriodicidad?: number;
  periodicidad?: Periodicity;
}

export class LevelCompensation{
  id: number;
  idNivel?: number;
  idCompensacionLaboral: number;
  idEscalaSalarial: number;
  idVigencia: number;
  idRegla: number;
  idVariable: number;
  nivel: Level;
  compensacionLaboral: Compensation;
  escalaSalarial: SalaryScale;
  vigencia: Scope;
  regla: Rule;
  variable: Variable;
  valorAplicado: number;
}
