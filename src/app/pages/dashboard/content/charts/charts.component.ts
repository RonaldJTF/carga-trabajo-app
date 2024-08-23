import {Component, OnInit} from '@angular/core';
import {DashboardService, StructureService} from "@services";
import {Structure} from "@models";
import {MESSAGE} from "@labels/labels";
import {TypologyInventory} from "@models";
import {TreeNode} from 'primeng/api';
import {IMAGE_SIZE, Methods} from '@utils';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss'],
})
export class ChartsComponent implements OnInit {

  protected readonly MESSAGE = MESSAGE;
  protected readonly IMAGE_SIZE = IMAGE_SIZE;

  levels: string[];
  timesTareas: string[];
  personasRequeridas: number[];
  dependency: TreeNode<Structure> = {};
  inventory: TypologyInventory[];
  structureOptions: TreeNode<Structure>[] = [];
  loading: boolean = false;
  downloadingReport: boolean = false;

  constructor(
    private dashboardService: DashboardService,
    private structureService: StructureService
  ) {
  }

  ngOnInit() {
    this.getInventarioTipologia();
    this.getDependencies();
  }

  getInventarioTipologia() {
    this.dashboardService.getInventory().subscribe({
      next: (data) => {
        this.inventory = data;
      },
    });
  }

  public getLevels(data: any[]) {
    this.levels = data?.map((item: any) => item.nivel);
    this.timesTareas = data.map(item => this.minutesToHours(item.tiempoTotalTarea));
    this.personasRequeridas = data.map(item => parseFloat(this.minutesToHours(item.tiempoTotalTarea)) / 167);
  }

  getStatistics(idDependence: number) {
    this.dashboardService.getStatistics(idDependence).subscribe({
      next: (data) => {
        this.getLevels(data);
      },
    });
  }

  getDependencies() {
    this.loading = true;
    this.structureService.getDependencies().subscribe({
      next: (data) => {
        this.builtNodes(data, this.structureOptions);
        this.dependency = this.structureOptions?.length ? this.structureOptions[0] : null;
        if (this.dependency) {
          this.getStatistics(this.dependency.data.id);
        }
        this.loading = false;
      }
    })
  }

  builtNodes(structures: Structure[], nodes: TreeNode<Structure>[]) {
    if (!structures) {
      return;
    }
    for (let structure of structures) {
      if (Methods.parseStringToBoolean(structure.tipologia.esDependencia)) {
        let node: TreeNode<Structure> = {
          data: structure,
          label: structure.nombre,
          children: []
        };
        if (structure.subEstructuras?.length) {
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
    this.downloadingReport = true;
    this.structureService.downloadReport('pdf', this.dependency.data.id).subscribe({
      next: () => {
        this.downloadingReport = false;
      },
      error: () => {
        this.downloadingReport = false;
      }
    });
  }
}

