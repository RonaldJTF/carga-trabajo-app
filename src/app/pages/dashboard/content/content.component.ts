import {Component, OnInit} from '@angular/core';
import {OverlayPanel} from 'primeng/overlaypanel';
import {TypologyInventory, Workplan} from '@models';
import {AuthenticationService, StatisticsService, WorkplanService} from '@services';
import {IMAGE_SIZE} from '@utils';
import {MESSAGE} from '@labels/labels';
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'app-layout',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {
  protected readonly Math = Math;
  protected readonly MESSAGE = MESSAGE;
  protected readonly IMAGE_SIZE = IMAGE_SIZE;

  isSuperAdmin: boolean;

  workplans: Workplan[];
  inventory: TypologyInventory[];
  datasetOfAdvanceConsolidated: any;
  loading: boolean = false;
  loadingAdvanceCosolidated: boolean = false;

  timeTypeOptions: any[] = [
    {icon: 'pi pi-calendar-times', value: 'day', tooltip: 'Por día'},
    {icon: 'pi pi-calendar-minus', value: 'week', tooltip: 'Por semana'},
    {icon: 'pi pi-calendar', value: 'month', tooltip: 'Por mes'}
  ];
  viewMode: 'day' | 'week' | 'month' = 'day';



  formVerificarcion: FormGroup;



  constructor(
    private workplanService: WorkplanService,
    private statisticsService: StatisticsService,
    private authService: AuthenticationService) {
  }

  ngOnInit() {
    this.getWorkplans();
    const {isAdministrator, isOperator, isSuperAdministrator} = this.authService.roles();
    this.isSuperAdmin = isSuperAdministrator;
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
    this.statisticsService.getInventory().subscribe({
      next: (data) => {
        this.inventory = data;
        this.loading = false;
      },
    });
  }

  loadAdvanceConsolidated(idWorkplan: number, timeType: 'day' | 'week' | 'month', event?: Event, overlayPanel?: OverlayPanel) {
    if (overlayPanel) {
      this.datasetOfAdvanceConsolidated = null;
      overlayPanel.show(event);
    }
    this.loadingAdvanceCosolidated = true;
    this.statisticsService.getAdvanceConsolidated(idWorkplan, timeType).subscribe({
      next: (data) => {
        let dataset = [
          {label: 'Avance', values: data.dateAdvances.map(e => e.advance)},
          {label: 'Avance esperado', values: data.dateAdvances.map(e => e.idealAdvance), borderDash: [5, 5]}
        ]
        this.datasetOfAdvanceConsolidated = data;
        this.datasetOfAdvanceConsolidated['labels'] = data.dateAdvances.map(e => e.formattedDate);
        this.datasetOfAdvanceConsolidated['dataset'] = dataset;
        this.loadingAdvanceCosolidated = false;
      }
    })
  }

  onChangeTimeType(timeType: 'day' | 'week' | 'month') {
    this.loadAdvanceConsolidated(this.datasetOfAdvanceConsolidated?.planTrabajo.id, timeType);
  }

  toggleIcon(show: boolean, element: HTMLSpanElement) {
    element.style.display = show ? 'block' : 'none';
  }
}
