import { Component, OnInit } from '@angular/core';
import { TypologyInventory } from 'src/app/models/typologyinventory';
import { DashboardService } from 'src/app/services/dashboard.service';

@Component({
  selector: 'app-structure-resume',
  templateUrl: './structure-resume.component.html',
  styleUrls: ['./structure-resume.component.scss'],
})
export class StructureResumeComponent {

  inventory: TypologyInventory[];
  loading: boolean = false;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.getInventarioTipologia();
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
