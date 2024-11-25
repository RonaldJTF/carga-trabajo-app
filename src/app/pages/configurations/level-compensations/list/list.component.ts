import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import * as LevelCompensationActions from "@store/levelCompensation.actions";
import {
  AuthenticationService,
  CompensationService,
  ConfirmationDialogService,
  CryptojsService,
  LevelCompensationService,
  LevelService
} from "@services";
import {LevelCompensation} from "@models";
import {IMAGE_SIZE, Methods} from "@utils";
import {MESSAGE} from "@labels/labels";
import {ActivatedRoute, Router} from "@angular/router";
import {Table} from "primeng/table";
import {MenuItem} from "primeng/api";
import { Subscription} from "rxjs";
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducers';
import { OverlayPanel } from 'primeng/overlaypanel';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {
  protected readonly MESSAGE = MESSAGE;
  protected readonly IMAGE_SIZE = IMAGE_SIZE;

  @ViewChild('dt') dt!: Table;

  loading: boolean = false;
  loadingLevelCompensationById: any = {};
  isAdmin: boolean;

  levelId: number;
  levelCompensations: LevelCompensation[] = [];

  levelCompensationsSubscription: Subscription;
  levelIdSubscription: Subscription;

  selectedLevelCompensations: LevelCompensation[] = [];

  menuItemsOfLevelCompensation: MenuItem[] = [];
  menuItemsOfSalaryScale: MenuItem[] = [];
  menuItemsOfValidity: MenuItem[] = [];
  menuItemsOfValueByRule: MenuItem[] = [];

  rowGroupMetadata: any;
  order: {field: string, order: 1 | -1};
  numberOfRows: number = 10;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private confirmationDialogService: ConfirmationDialogService,
    private levelCompensationService: LevelCompensationService,
    private cryptojsService: CryptojsService,
    private store: Store<AppState>,
  ) {
  }

  ngOnInit() {
    const {isAdministrator} = this.authService.roles();
    this.isAdmin = isAdministrator;

    this.levelIdSubscription = this.store.select(state => state.levelCompensation.levelId).subscribe(e => this.levelId = e);
    this.levelCompensationsSubscription = this.store.select(state => state.levelCompensation.items).subscribe(e => this.levelCompensations = e);
    this.initMenuItems();
    this.getLevelCompensations(this.levelId);
  }

  ngOnDestroy(): void {
    this.levelCompensationsSubscription?.unsubscribe();
  }

  initMenuItems(){
    this.menuItemsOfLevelCompensation = [
      {label: 'Editar', icon: 'pi pi-pencil', visible: this.isAdmin, command: (e) => this.onManagementLevelCompensations(e.item.id, e.originalEvent)},
      {label: 'Eliminar', icon: 'pi pi-trash', visible: this.isAdmin, command: (e) => this.onDeleteLevelCompensation(e)},
    ];
    this.menuItemsOfValidity = [
      {label: 'Editar', icon: 'pi pi-pencil', visible: this.isAdmin, command: (e) => this.onGoUpdateValidity(e.item.id, e.originalEvent)},
    ];
    this.menuItemsOfSalaryScale = [
      {label: 'Editar', icon: 'pi pi-pencil', visible: this.isAdmin, command: (e) => this.onGoUpdateSalaryScale(e.item.id, e.originalEvent)},
    ];
    this.menuItemsOfValueByRule = [
      {label: 'Gestión de valor', icon: 'pi pi-pencil', visible: this.isAdmin, command: (e) => this.onManagementValueInRule(e.item['value'], e.originalEvent)},
      {label: 'Eliminar', icon: 'pi pi-trash', visible: this.isAdmin, command: (e) => this.onDeleteValueInRule(e)},
    ];
  }

  desmarkAll() {
    this.selectedLevelCompensations = [];
  }

  openNew() {
    const backRoute = `/configurations/level-compensations`;
    this.router.navigate(['create'], { relativeTo: this.route, skipLocationChange: true, queryParams: {backRoute: backRoute}});
  }

  getLevelCompensations(idLevel: number){
    this.loading = true;
    this.levelCompensationService.getLevelCompensations(idLevel).subscribe({
      next: (data) => {
        this.store.dispatch(LevelCompensationActions.setList({levelCompensations: data as LevelCompensation[]}));
        this.loading = false;
      },
      error: ()=>{this.loading = false}
    })
  }

  deleteSelectedLevelCompensations() {
    let compensationIds: number[] = this.selectedLevelCompensations.map(item => item.id);
    this.confirmationDialogService.showDeleteConfirmationDialog(
      () => {
        this.levelCompensationService.deleteSelectedLevelCompensations(compensationIds)
          .subscribe({
            next: () => {
              this.store.dispatch(LevelCompensationActions.removeItemsFromList({levelCompensationIds: this.selectedLevelCompensations.map(item => item.id)}));
              this.desmarkAll();
            }
          });
      }
    )
  }

  onManagementLevelCompensations(idCompensation: any, event: Event) {
    const backRoute = `/configurations/level-compensations`;
    this.router.navigate([this.cryptojsService.encryptParam(idCompensation)], {relativeTo: this.route, skipLocationChange: true,  queryParams: {backRoute: backRoute}});
  }

  onDeleteLevelCompensation(event: any) {
    let id = event.item.id;
    event.originalEvent.preventDefault();
    this.confirmationDialogService.showDeleteConfirmationDialog(
      () => {
        this.levelCompensationService.deleteLevelCompensation(id)
          .subscribe({
            next: () => {
              this.store.dispatch(LevelCompensationActions.removeFromList({id: id}));
              this.desmarkAll();
            },
          });
      }
    )
  }

  onGoUpdateValidity(id: any, event: Event) {
    const backRoute = `/configurations/level-compensations`;
    this.router.navigate(['configurations/validities', this.cryptojsService.encryptParam(id)], {skipLocationChange: true, queryParams: {backRoute: backRoute}})
  }

  onGoUpdateSalaryScale(id: any, event: Event) {
    const backRoute = `/configurations/level-compensations`;
    this.router.navigate(['configurations/levels', this.cryptojsService.encryptParam(this.levelId)], {skipLocationChange: true, queryParams: {backRoute: backRoute}})
  }

  onManagementValueInRule(levelCompensation: LevelCompensation, event: Event) {
    const backRoute = `/configurations/level-compensations`;
    this.router.navigate([this.cryptojsService.encryptParam(levelCompensation.id)], {relativeTo: this.route, skipLocationChange: true,  queryParams: {backRoute: backRoute}});
  }

  onDeleteValueInRule(event: any) {
    let valueByRuleId = event.item.id;
    event.originalEvent.preventDefault();
    this.confirmationDialogService.showDeleteConfirmationDialog(
      () => {
        this.levelCompensationService.deleteValueByRule(valueByRuleId)
          .subscribe({
            next: () => {
              this.store.dispatch(LevelCompensationActions.removeValueByRuleToLevelCompensation({valueByRuleId: valueByRuleId}));
              this.desmarkAll();
            },
          });
      }
    )
  }

  loadValuesByRulesOverlayPanel(levelCompensation:LevelCompensation, overlayPanel?: OverlayPanel,  event?: Event){
    if (overlayPanel){
      overlayPanel.show(event);
    }
    if(!levelCompensation.loaded){
      this.loadingLevelCompensationById[levelCompensation.id] = true;
      this.levelCompensationService.getValuesByRuleByLevelCompensationId(levelCompensation.id).subscribe({
        next: (e) =>{
          this.store.dispatch(LevelCompensationActions.updateValuesByRulesToLevelCompensation({levelCompensationId: levelCompensation.id, valuesByRules: e}));
          this.loadingLevelCompensationById[levelCompensation.id] = false;
        }
      })
    }
  }

  onSort(event) {
    this.order = event.order;
    this.updateRowGroupMetaData(this.dt?.filteredValue ?? this.dt?.value ?? this.levelCompensations);
  }

  onFilter() {
    this.updateRowGroupMetaData(this.dt?.filteredValue ?? this.dt?.value ?? this.levelCompensations);
  }

  onRowsChange(data: number){
    this.numberOfRows = data;
  }

  applyFilterGlobal($event, stringVal) {
    this.dt.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
    this.updateRowGroupMetaData(this.dt.filteredValue);
  }

  parseStringToBoolean(str: string): boolean{
    return Methods.parseStringToBoolean(str);
  }

  private fieldCompare(a, b){
    const fieldA = a[this.order.field];
    const fieldB = b[this.order.field];

    if (fieldA < fieldB) {
      return -1 * this.order.order;
    }
    if (fieldA > fieldB) {
      return 1 * this.order.order;
    }
    return 0;
  }

  private compare(a, b) {
    if (a.idVigencia == b.idVigencia) {
      if (a.idEscalaSalarial == null && b.idEscalaSalarial == null) {
        return this.fieldCompare(a, b);
      }
      if (a.idEscalaSalarial == null) {
        return -1;
      }
      if (b.idEscalaSalarial == null) {
        return 1;
      }

      if (a.idEscalaSalarial == b.idEscalaSalarial) {
        return this.fieldCompare(a, b);
      }
      return a.idEscalaSalarial - b.idEscalaSalarial;
    }
    return a.idVigencia - b.idVigencia;
  }

  private updateRowGroupMetaData(levelsCompensations: LevelCompensation[]) {
    if (levelsCompensations) {
      levelsCompensations.sort((a, b) => this.compare(a, b));
      this.rowGroupMetadata = {};
      for (let i = 0; i < levelsCompensations.length; i++) {
        levelsCompensations[i]['order'] = i;
        const rowData = levelsCompensations[i];
        const idSalaryScale = rowData?.idEscalaSalarial || '';
        const idValidity = rowData?.idVigencia;
        if (i === 0) {
          this.rowGroupMetadata[idValidity] = { index: 0, size: 1 };
          this.rowGroupMetadata[idValidity][idSalaryScale] = { index: 0, size: 1 };
        }
        else {
          const previousRowData = levelsCompensations[i - 1];
          const previousRowGroup = previousRowData?.idEscalaSalarial || '';
          const previousRowGroupOfConvocation = previousRowData?.idVigencia;

          if (idValidity === previousRowGroupOfConvocation) {
              this.rowGroupMetadata[idValidity].size++;
              if (idSalaryScale === previousRowGroup) {
                this.rowGroupMetadata[idValidity][idSalaryScale].size++;
              }else {
                this.rowGroupMetadata[idValidity][idSalaryScale] = { index: i, size: 1 };
              }
          }else {
            this.rowGroupMetadata[idValidity] = { index: i, size: 1 };
            this.rowGroupMetadata[idValidity][idSalaryScale] = { index: i, size: 1 };
          }
        }
      }
    }
  }
}
