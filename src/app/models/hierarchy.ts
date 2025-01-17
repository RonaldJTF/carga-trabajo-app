import {OrganizationChart} from "./organizationchart";
import {Dependency} from "./dependency";

export class Hierarchy {
  id: number;
  idOrganigrama: number;
  idDependencia: number;
  orden: number;
  organigrama: OrganizationChart;
  dependencia: Dependency;
  idJerarquiaPadre: number;
  subJerarquias: Hierarchy[];
}
