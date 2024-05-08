import {Component, OnInit} from '@angular/core';
import {Activity} from "../../../../models/activity";
import {DashboardService} from "../../../../services/dashboard.service";
import {StructureService} from "../../../../services/structure.service";
import {Structure} from "../../../../models/structure";
import {MESSAGE} from "../../../../../labels/labels";


@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss'],
})
export class ChartsComponent implements OnInit {

  statistics: Activity[];

  structure: Structure[];

  levels: string[];

  timesTareas: number[];

  personasRequeridas: number[];

  dependence: Structure;

  constructor(private dashboardService: DashboardService, private structureService: StructureService) {
  }

  ngOnInit() {
    this.getStructure();

  }

  public getLevels(data: Activity[]) {
    this.levels = data?.map(item => item.nivel);
    this.timesTareas = data.map(item => this.minutesToHours(item.tiempoTotalTarea));
    this.personasRequeridas = data.map(item => Math.floor(this.minutesToHours(item.tiempoTotalTarea)) / 167);
  }

  getStatistics(idDependence: number) {
    this.dashboardService.getStatistics(idDependence).subscribe({
      next: (data) => {
        this.statistics = data;
        this.getLevels(this.statistics);
      },
    });
  }

  getStructure() {
    this.structureService.getStructures().subscribe({
      next: (data) => {
        this.structure = data;
        this.dependence = this.structure[0];
        this.getStatistics(this.dependence.id);
      }
    })
  }

  minutesToHours(minutes: number): number {
    if (isNaN(minutes) || minutes < 0) {
      return 0;
    }
    return Math.floor(minutes / 60);
  }

  dependenceSelected(event: any) {
    this.getStatistics(event.id);
    //this.getProcesses(event);
  }

  getProcesses(estructura: Structure): Structure[] {
    let processes: Structure[] = [];
    estructura.subEstructuras.forEach((subestructura) => {
      // Verificar si la subestructura es de tipo "Dependencia"
      if (subestructura.tipologia.nombre === "Proceso") {
        processes.push(subestructura);
      }
      // Si la subestructura tiene más subestructuras, llamar recursivamente a esta función
      if (subestructura.subEstructuras.length > 0) {
        processes = processes.concat(this.getProcesses(subestructura));
      }
    });
    return processes;
  }

  protected readonly MESSAGE = MESSAGE;
}

