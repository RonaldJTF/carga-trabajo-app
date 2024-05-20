import {Level} from "./level";

export class Activity {
  id?: number;
  frecuencia?: number;
  tiempoMaximo?: number;
  tiempoMinimo?: number;
  tiempoPromedio?: number;
  idNivel?: number;
  idEstructura?: number;
  descripcion?: string;
  nivel?: Level;
  tiempoTotalTarea?: number
}
