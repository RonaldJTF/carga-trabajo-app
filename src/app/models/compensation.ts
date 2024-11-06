import {Periodicity} from "./periodicity";
import {Category} from "./category";

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
