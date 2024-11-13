import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import * as LevelCompensationActions from "@store/levelCompensation.actions";
import {AuthenticationService, CompensationService, ConfirmationDialogService, CryptojsService, LevelCompensationService} from "@services";
import {LevelCompensation} from "@models";
import {IMAGE_SIZE} from "@utils";
import {MESSAGE} from "@labels/labels";
import {ActivatedRoute, Router} from "@angular/router";
import {Table} from "primeng/table";
import {MenuItem} from "primeng/api";
import { Subscription} from "rxjs";
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducers';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {
  protected readonly MESSAGE = MESSAGE;
  protected readonly IMAGE_SIZE = IMAGE_SIZE;
  NUMBER_OF_ROWS: number = 3;

  @ViewChild('dt') dt!: Table;

  loading: boolean = false;
  isAdmin: boolean;

  idLevel: number;
  levelCompensation: LevelCompensation;
  levelCompensations: LevelCompensation[] = [];

  levelCompensationsSubscription: Subscription;
  levelCompensationSubscription: Subscription;

  selectedLevelCompensations: LevelCompensation[] = [];

  menuItemsOfLevelCompesantion: MenuItem[] = [];
  menuItemsOfValidity: MenuItem[] = [];

  rowGroupMetadata: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private confirmationDialogService: ConfirmationDialogService,
    private compensationService: CompensationService,
    private levelCompensationService: LevelCompensationService,
    private cryptojsService: CryptojsService,
    private store: Store<AppState>,
  ) {
  }

  ngOnInit() {
    const {isAdministrator} = this.authService.roles();
    this.isAdmin = isAdministrator;

    this.idLevel = this.cryptojsService.decryptParamAsNumber(this.route.snapshot.queryParams['idLevel']);
    this.levelCompensationsSubscription = this.store.select(state => state.levelCompensation.items).subscribe(e => this.levelCompensations = e);
    this.levelCompensationSubscription = this.store.select(state => state.levelCompensation.item).subscribe(e => this.levelCompensation = e);
    this.initMenuItems();
    this.getLevelCompensations(this.idLevel);
  }

  ngOnDestroy(): void {
    this.levelCompensationsSubscription?.unsubscribe();
    this.levelCompensationSubscription?.unsubscribe();
  }

  initMenuItems(){
    this.menuItemsOfLevelCompesantion = [
      {label: 'Editar', icon: 'pi pi-pencil', visible: this.isAdmin, command: (e) => this.onManagementLevelCompensations(e.item.id, e.originalEvent)},
      {label: 'Eliminar', icon: 'pi pi-trash', visible: this.isAdmin, command: (e) => this.onDeleteLevelCompensation(e)},
    ];
    this.menuItemsOfValidity = [
      {label: 'Editar', icon: 'pi pi-pencil', visible: this.isAdmin, command: (e) => this.onGoUpdateValidity(e.item.id, e.originalEvent)},
    ]
  }

  desmarkAll() {
    this.selectedLevelCompensations = [];
  }

  openNew() {
    const backRoute = `/configurations/level-compensations/`;
    this.router.navigate(['create'], { relativeTo: this.route, skipLocationChange: true, queryParams: {idLevel: this.cryptojsService.encryptParam(this.idLevel), backRoute: backRoute}});
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

  deleteSelectedCompensations() {
    let compensationIds: number[] = this.selectedLevelCompensations.map(item => item.id);
    this.confirmationDialogService.showDeleteConfirmationDialog(
      () => {
        this.compensationService.deleteSelectedCompensations(compensationIds)
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
    const backRoute = `/configurations/level-compensations/`;
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
              this.store.dispatch(LevelCompensationActions.removeFromList({id: event.item.id}));
              this.desmarkAll();
            },
          });
      }
    )
  }

  onGoUpdateValidity(id: any, event: Event) {
    const backRoute = '/configurations/level-compensations/';
    this.router.navigate(['configurations/validities', this.cryptojsService.encryptParam(id)], {skipLocationChange: true, queryParams: {backRoute: backRoute}})
  }

  onSort() {
    this.updateRowGroupMetaData(this.dt?.filteredValue ?? this.dt?.value ?? this.levelCompensations);
  }

  onFilter() {
    this.updateRowGroupMetaData(this.dt?.filteredValue ?? this.dt?.value ?? this.levelCompensations);
  }

  applyFilterGlobal($event, stringVal) {
    this.dt.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
    this.updateRowGroupMetaData(this.dt.filteredValue);
  }

  private comparar(a, b) {
    if (a.idVigencia == b.idVigencia) {
      if (a.idEscalaSalarial == null && b.idEscalaSalarial == null) {
        return 0;
      }
      if (a.idEscalaSalarial == null) {
        return -1;
      }
      if (b.idEscalaSalarial == null) {
        return 1;
      }
      return a.idEscalaSalarial - b.idEscalaSalarial;
    }
    return a.idVigencia - b.idVigencia;
  }

  updateRowGroupMetaData(levelsCompensations: LevelCompensation[]) {
    if (levelsCompensations) {
      levelsCompensations.sort( this.comparar )
      this.rowGroupMetadata = {};
      for (let i = 0; i < levelsCompensations.length; i++) {     
        levelsCompensations[i]['order'] = i;     
        const rowData = levelsCompensations[i];
        const idSalaryScale = rowData?.idEscalaSalarial || '';
        const idValidity = rowData?.idVigencia || '';
        if (i === 0) {
          this.rowGroupMetadata[idValidity] = { index: 0, size: 1 };
          this.rowGroupMetadata[idValidity][idSalaryScale] = { index: 0, size: 1 };
        }
        else {
          const previousRowData = levelsCompensations[i - 1];
          const previousRowGroup = previousRowData?.idEscalaSalarial;
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
      console.log(this.rowGroupMetadata)
    }
  }
}
