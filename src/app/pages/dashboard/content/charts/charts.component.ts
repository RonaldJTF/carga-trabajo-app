import {Component, OnInit} from '@angular/core';
import {StatisticsService, StructureService} from "@services";
import {Structure} from "@models";
import {MESSAGE} from "@labels/labels";
import {TypologyInventory} from "@models";
import {TreeNode} from 'primeng/api';
import {IMAGE_SIZE, Methods} from '@utils';
import {finalize} from "rxjs";

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss'],
})
export class ChartsComponent implements OnInit {

  protected readonly MESSAGE = MESSAGE;
  protected readonly IMAGE_SIZE = IMAGE_SIZE;

  levels: string[];
  totalTimeByLevelDatasets: any[] = [];
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
    const documentStyle = getComputedStyle(document.documentElement);
    this.totalTimeByLevelDatasets = [
      {
        label: 'Total de horas',
        backgroundColor: documentStyle.getPropertyValue('--primary-500'),
        borderColor: documentStyle.getPropertyValue('--primary-500'),
        tension: 0,
        data: null
      }
    ];
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
        this.totalTimeByLevelDatasets[0]['data'] = data.map(item => item.tiempoTotal);//Sólo hay un dataset
        this.totalStaff = data.map(item => item.personalTotal);
      },
    });
  }

  getDependencies() {
    this.loading = true;
    this.structureService.getDependencies().subscribe({
      next: (data) => {
        this.builtNodes(data, this.structureOptions);
        this.dependency = this.getRandomDependency();
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

  getRandomDependency(): TreeNode<Structure> | null {
    if (this.structureOptions.length === 0) {
      return null;
    }
    const randomIndex = Math.floor(Math.random() * this.structureOptions.length);
    return this.structureOptions[randomIndex];
  }


  minutesToHours(minutes: number): string {
    if (isNaN(minutes) || minutes < 0) {
      return '';
    }
    return (minutes / 60).toFixed(2);
  }

  onChangeDependency() {
    this.getTimeStatistics(this.dependency.data.id);
  }

  downloadReport() {
    this.downloadingReport = true;
    this.structureService.downloadReport('pdf', this.dependency.data.id).pipe(
      finalize(()=>{
        this.downloadingReport = false;
      })
    ).subscribe();
  }
}

