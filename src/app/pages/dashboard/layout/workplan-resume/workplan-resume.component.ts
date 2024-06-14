import {Component, Input} from '@angular/core';
import {TypologyInventory} from "../../../../models/typologyinventory";
import {DashboardService} from "../../../../services/dashboard.service";
import {Workplan} from "../../../../models/workplan";
import {WorkplanService} from "../../../../services/workplan.service";

@Component({
  selector: 'app-workplan-resume',
  templateUrl: './workplan-resume.component.html',
  styleUrls: ['./workplan-resume.component.scss']
})
export class WorkplanResumeComponent {
  @Input() classStyle: string;

  workplans: Workplan[];
  loading: boolean = false;

  constructor(private workplanService: WorkplanService) {}

  ngOnInit() {
    this.getWorkplans();
  }

  getWorkplans() {
    this.loading = true;
    this.workplanService.getWorkplans().subscribe({
      next: (data) => {
        this.workplans = data;
        this.loading = false;
      },
    });
  }

  protected readonly Math = Math;
}
