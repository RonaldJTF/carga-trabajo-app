export class Categoria {
  id: number;
  nombre: string;
  descripcion: string;
}

export class Periodicidad {
  id: number;
  nombre: string;
  frecuencia: number;
}

export class Compensation {
  id: number;
  nombre: string;
  descripcion: string;
  estado: string;
  idCategoria: number;
  categoria: Categoria;
  idPeriodicidad: number;
  periodicidad: Periodicidad;
}
