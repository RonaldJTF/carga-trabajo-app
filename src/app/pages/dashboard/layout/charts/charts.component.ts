import {Component, OnInit} from '@angular/core';
import {Activity} from "../../../../models/activity";
import {DashboardService} from "../../../../services/dashboard.service";
import {StructureService} from "../../../../services/structure.service";
import {Structure} from "../../../../models/structure";
import {MESSAGE} from "../../../../../labels/labels";
import {TypologyInventory} from "../../../../models/typologyinventory";
import { TreeNode } from 'primeng/api';
import { Methods } from 'src/app/utils/methods';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss'],
})
export class ChartsComponent implements OnInit {

  protected readonly MESSAGE = MESSAGE;

  statistics: Activity[];

  //structure: Structure[];

  levels: string[];

  timesTareas: string[];

  personasRequeridas: number[];

  dependency: TreeNode<Structure>;

  inventory: TypologyInventory[];

  structureOptions: TreeNode<Structure>[] = [];

  constructor(private dashboardService: DashboardService, private structureService: StructureService) {
  }

  ngOnInit() {
    this.getInventarioTipologia();
    this.getStructure();

  }

  getInventarioTipologia() {
    this.dashboardService.getInventory().subscribe({
      next: (data) => {
        this.inventory = data;
      },
    });
  }

  public getLevels(data: Activity[]) {
    this.levels = data?.map(item => item.nivel);
    this.timesTareas = data.map(item => this.minutesToHours(item.tiempoTotalTarea));

    this.personasRequeridas = data.map(item => parseFloat(this.minutesToHours(item.tiempoTotalTarea)) / 167);
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
    this.dashboardService.getDependencies().subscribe({
      next: (data) => {
        this.builtNodes(data, this.structureOptions);
        this.dependency = this.structureOptions[0];
        this.getStatistics(this.dependency.data.id);
      }
    })
  }

  builtNodes(structures: Structure[], nodes: TreeNode<Structure>[]){
    for (let structure of structures){
      if (Methods.parseStringToBoolean(structure.tipologia.esDependencia) ){
        let node: TreeNode<Structure> = {
          data: structure,
          label: structure.nombre,
          children: []
        };
  
        if (structure.subEstructuras?.length){
          this.builtNodes(structure.subEstructuras, node.children)
        }
  
        nodes.push(node);
      }
    }
  }

  minutesToHours(minutes: number): string {
    if (isNaN(minutes) || minutes < 0) {
      return '';
    }
    return (minutes / 60).toFixed(2);
  }

  onChangeDependency() {
    this.getStatistics(this.dependency.data.id);
  }
  
  downloadReport() {
    this.structureService.downloadReport('pdf', this.dependency.data.id).subscribe({});
  }
}

