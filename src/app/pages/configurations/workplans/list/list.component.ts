import { Component, OnDestroy, OnInit } from '@angular/core';
import * as WorkplanActions from "@store/workplan.actions";
import * as StageActions from "@store/stage.actions";
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { MenuItem } from 'primeng/api';
import { Observable, Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducers';
import { Table } from 'primeng/table';
import { OverlayPanel } from 'primeng/overlaypanel';
import {Workplan} from "@models";
import {IMAGE_SIZE} from "@utils";
import {MESSAGE} from "@labels/labels";
import {AuthenticationService, ConfirmationDialogService, CryptojsService, WorkplanService} from "@services";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy{
  IMAGE_SIZE = IMAGE_SIZE;
  MESSAGE = MESSAGE;

  isAdmin: boolean;

  workplans: Workplan[] = [];

  loading: boolean = false;
  loadingAdvanceCosolidated: boolean = false;
  workplans$: Observable<Workplan[]>;
  workplansSubscription: Subscription;
  selectedWorkplans: Workplan[] = [];
  datasetOfAdvanceConsolidated: any;
  timeTypeOptions: any[] = [
    {icon: 'pi pi-calendar-times', value: 'day', tooltip: 'Por día'},
    {icon: 'pi pi-calendar-minus', value: 'week', tooltip: 'Por semana'},
    {icon: 'pi pi-calendar', value: 'month', tooltip: 'Por mes'}
  ];
  viewMode: 'day' | 'week' | 'month' = 'day';

  constructor(
    private store: Store<AppState>,
    private confirmationDialogService: ConfirmationDialogService,
    private workplanService: WorkplanService,
    private authService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
    private cryptoService: CryptojsService
  ){}

  ngOnInit(): void {
    const {isAdministrator, isOperator} = this.authService.roles();
    this.isAdmin = isAdministrator;
    this.workplans$ = this.store.select(state => state.workplan.items);
    this.workplansSubscription =  this.store.select(state => state.workplan.items).subscribe(e =>{
       this.workplans = JSON.parse(JSON.stringify(e));
       this.workplans?.forEach( e => {
        e['menuItems'] = this.getMenuItemsOfWorkplan(e);
       })
    });
    this.getWorkplans();
  }

  ngOnDestroy(): void {
      this.workplansSubscription?.unsubscribe();
  }

  private getMenuItemsOfWorkplan(workplan: Workplan): MenuItem [] {
    if (!workplan){
      return [];
    }
    return [
      {label: 'Gestionar etapa', icon: 'pi pi-cog',command: (e) => this.onManagementStage(e.item.id, e.originalEvent)},
      {label: 'Editar', icon: 'pi pi-pencil', visible: this.isAdmin, command: (e) => this.onGoToUpdate(e.item.id, e.originalEvent)},
      {label: 'Eliminar', icon: 'pi pi-trash', visible: this.isAdmin, command: (e) => this.onDeleteWorkplan(e)},
      {label: 'Descargar', icon: 'pi pi-cloud-download', items: [
        {label: 'Reporte Excel', icon: 'pi pi-file-excel', automationId: "excel", command: (e) => {this.download(e, workplan.id)}},
      ]},
    ];
  }


  getWorkplans(){
    this.loading = true;
    this.workplanService.getWorkplans().subscribe( e => {
      this.store.dispatch(WorkplanActions.setList({workplans: e as Workplan[]}));
      this.loading = false;
    })
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  openNew() {
    this.router.navigate(['create'], { relativeTo: this.route, skipLocationChange: true});
  }

  onGoToUpdate (id : any, event: Event): void{
    event.preventDefault();
    event.stopPropagation();
    this.router.navigate([this.cryptoService.encryptParam(id)], {relativeTo: this.route, skipLocationChange: true})
  }

  onManagementStage (id : any, event: Event): void{
    event.preventDefault();
    event.stopPropagation();
    this.store.dispatch(StageActions.reset());
    this.store.dispatch(WorkplanActions.setItem({id: id}));
    this.router.navigate(['stages'], {relativeTo: this.route, skipLocationChange: true});
  }

  onDeleteWorkplan(event: any): void {
    let id = parseInt(event.item.id);
    event.originalEvent.preventDefault();
    event.originalEvent.stopPropagation();
    this.confirmationDialogService.showDeleteConfirmationDialog(
      () => {
        this.workplanService.deleteWorkplan(id)
        .subscribe({
          next: () => {
            this.store.dispatch(WorkplanActions.removeFromList({id: id}));
            this.desmarkAll();
          },
        });
      }
    )
  }

  deleteSelectedWorkplans() {
    let workplanIds: number[] = this.selectedWorkplans.map(item => item.id);
    this.confirmationDialogService.showDeleteConfirmationDialog(
      () => {
        this.workplanService.deleteSelectedWorkplans(workplanIds)
        .subscribe({
          next: (e) => {
           this.store.dispatch(WorkplanActions.removeItemsFromList({workplanIds: workplanIds}));
           this.desmarkAll();
          }
        });
      }
    )
  }

  desmarkAll() {
    this.selectedWorkplans = [];
  }

  download(data: any, idWorkplan: any) {
    this.workplanService.downloadReport(data.item.automationId, null, idWorkplan).subscribe({});
  }

  loadAdvanceConsolidated(idWorkplan: number, timeType: 'day' | 'week' | 'month', event?: Event, overlayPanel?: OverlayPanel){
    if (overlayPanel){
      this.datasetOfAdvanceConsolidated = null;
      overlayPanel.show(event);
    }
    this.loadingAdvanceCosolidated = true;
      this.workplanService.getAdvanceConsolidated(idWorkplan, timeType).subscribe({
        next: (data) =>{
          let dataset = [
            {label: 'Avance', values: data.dateAdvances.map(e => e.advance)},
            {label: 'Avance esperado', values: data.dateAdvances.map(e => e.idealAdvance),  borderDash: [5, 5]}
          ]
          this.datasetOfAdvanceConsolidated = data;
          this.datasetOfAdvanceConsolidated['labels'] = data.dateAdvances.map( e => e.formattedDate);
          this.datasetOfAdvanceConsolidated['dataset'] = dataset;
          this.loadingAdvanceCosolidated = false;
        }
      })
  }

  onChangeTimeType(timeType: 'day' | 'week' | 'month') {
    this.loadAdvanceConsolidated(this.datasetOfAdvanceConsolidated?.planTrabajo.id, timeType);
  }
}
