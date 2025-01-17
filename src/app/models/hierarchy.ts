import {OrganizationChart} from "./organizationchart";
import {Dependency} from "./dependency";

export class Hierarchy {
  id: number;
  idOrganigrama: number;
  idDependencia: number;
  idDependenciaPadre: number;
  orden: number;
  organigrama: OrganizationChart;
  dependencia: Dependency;
  dependenciaPadre: Dependency;
}
