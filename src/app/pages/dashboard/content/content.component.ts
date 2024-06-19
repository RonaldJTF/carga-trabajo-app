import { Component, OnInit } from '@angular/core';
import { TypologyInventory } from 'src/app/models/typologyinventory';
import { Workplan } from 'src/app/models/workplan';
import { DashboardService } from 'src/app/services/dashboard.service';
import { WorkplanService } from 'src/app/services/workplan.service';
import { IMAGE_SIZE } from 'src/app/utils/constants';
import { MESSAGE } from 'src/labels/labels';

@Component({
  selector: 'app-layout',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit{
  protected readonly Math = Math;
  protected readonly MESSAGE = MESSAGE;
  protected readonly IMAGE_SIZE = IMAGE_SIZE;

  workplans: Workplan[];
  inventory: TypologyInventory[];
  loading: boolean = false;

  constructor(private workplanService: WorkplanService, private dashboardService: DashboardService) {}

  ngOnInit() {
    this.getWorkplans();
  }

  getWorkplans() {
    this.loading = true;
    this.workplanService.getWorkplans().subscribe({
      next: (data) => {
        this.workplans = data;
        this.loading = false;
        this.getInventarioTipologia();
      },
    });
  }

  getInventarioTipologia() {
    this.loading = true;
    this.dashboardService.getInventory().subscribe({
      next: (data) => {
        this.inventory = data;
        this.loading = false;
      },
    });
  }
}
