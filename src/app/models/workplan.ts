import {File} from "./File";

export class Workplan {
  id: number;
  nombre: string;
  descripcion: string;
  etapas: Stage[];
}

export class Stage {
  id: number;
  nombre: string;
  descripcion: string;
  idPadre: number;
  idPlanTrabajo: number;
  tareas: Task[];
}

export class Task{
  id: number;
  fechaInicio: string;
  fechaFin: string;
  nombre: string;
  descripcion: string;
  entregable: string;
  responsable: string;
  idEtapas: number;
  activo: string;
  seguimientos: FollowUp[];

}

export class FollowUp{
  id: number;
  porcentajeAvance: number;
  observacion: string;
  activo: string;
  fecha: string;
  idTarea: number;
  archivos: File[];
}
