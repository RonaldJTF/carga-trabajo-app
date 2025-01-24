import {Normativity} from "./normativity";

export class OrganizationChart {
  id: number;
  nombre: string;
  descripcion: string;
  idNormatividad: number;
  normatividad: Normativity;
  srcDiagrama: string;
}
