import {Periodicity} from "./periodicity";
import {Category} from "./category";
import {Level, SalaryScale} from "./level";
import {Rule} from "./rule";
import {Variable} from "./variable";
import { Validity } from "./validity";

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
  vigencia: Validity;
  regla: Rule;
  variable: Variable;
  valorAplicado: number;
}
