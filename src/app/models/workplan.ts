import {File} from "./File";

export class Workplan {
  id: number;
  nombre: string;
  descripcion: string;
  etapas: Stage[];
  avance: number;
}

export class Stage {
  id: number;
  nombre: string;
  descripcion: string;
  idPadre: number;
  idPlanTrabajo: number;
  subEtapas: Stage[];
  tareas: Task[];
  avance: number;
}

export class Task{
  id: number;
  fechaInicio: string;
  fechaFin: string;
  nombre: string;
  descripcion: string;
  entregable: string;
  responsable: string;
  idEtapa: number;
  activo: string;
  seguimientos: FollowUp[];
  avance: number;
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
