import {Component, OnInit} from '@angular/core';
import {StatisticsService, StructureService} from "@services";
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
  totalTimeByLevel: string[];
  totalStaff: number[];
  dependency: TreeNode<Structure> = {};
  inventory: TypologyInventory[];
  structureOptions: TreeNode<Structure>[] = [];
  loading: boolean = false;
  downloadingReport: boolean = false;

  constructor(
    private dashboardService: StatisticsService,
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

  getTimeStatistics(structureId: number) {
    this.dashboardService.getTimeStatistics(structureId).subscribe({
      next: (data) => {
        this.levels = data?.map((item: any) => item.nivel);
        this.totalTimeByLevel = data.map(item => item.tiempoTotal);
        this.totalStaff = data.map(item => item.personalTotal);
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
          this.getTimeStatistics(this.dependency.data.id);
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

  onChangeDependency() {
    this.getTimeStatistics(this.dependency.data.id);
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

