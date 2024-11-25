import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MESSAGE} from "@labels/labels";
import {IMAGE_SIZE, Methods} from "@utils";
import {Subscription} from "rxjs";
import {Compensation} from "@models";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthenticationService, CompensationCategoryService, CompensationService, ConfirmationDialogService, CryptojsService} from "@services";
import {Table} from "primeng/table";
import {MenuItem} from "primeng/api";
import {Store} from "@ngrx/store";
import {AppState} from "../../../../app.reducers";

import * as CompensationActions from "@store/compensation.actions";

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
  isAdmin: boolean;

  compensation: Compensation;
  compensations: Compensation[] = [];

  compensationsSubscription: Subscription;
  compensationSubscription: Subscription;

  selectedCompensations: Compensation[] = [];

  menuItemsOfCompesantion: MenuItem[] = [];
  menuItemsOfCategory: MenuItem[] = [];

  rowGroupMetadata: any;
  numberOfRows: number = 10;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private confirmationDialogService: ConfirmationDialogService,
    private compensationService: CompensationService,
    private compensationCategoryService: CompensationCategoryService,
    private cryptojsService: CryptojsService,
    private store: Store<AppState>,
  ) {
  }

  ngOnInit() {
    const {isAdministrator} = this.authService.roles();
    this.isAdmin = isAdministrator;

    this.compensationsSubscription = this.store.select(state => state.compensation.items).subscribe(e => this.compensations = e);
    this.compensationSubscription = this.store.select(state => state.compensation.item).subscribe(e => this.compensation = e);
    this.initMenuItems();
    this.getCompensations();
  }

  ngOnDestroy(): void {
    this.compensationsSubscription?.unsubscribe();
    this.compensationSubscription?.unsubscribe();
  }

  initMenuItems(){
    this.menuItemsOfCompesantion = [
      {label: 'Editar', icon: 'pi pi-pencil', visible: this.isAdmin, command: (e) => this.onManagementCompensations(e.item.id, e.originalEvent)},
      {label: 'Eliminar', icon: 'pi pi-trash', visible: this.isAdmin, command: (e) => this.onDeleteCompensation(e)},
    ];
    this.menuItemsOfCategory = [
      {label: 'Editar', icon: 'pi pi-pencil', visible: this.isAdmin, command: (e) => this.onGoUpdateCategory(e.item.id, e.originalEvent)},
      {label: 'Eliminar', icon: 'pi pi-trash', visible: this.isAdmin, command: (e) => this.onDeleteCategory(e)},
    ]
  }

  desmarkAll() {
    this.selectedCompensations = [];
  }

  openNew() {
    this.router.navigate(['create'], { relativeTo: this.route, skipLocationChange: true});
  }

  getCompensations(){
    this.loading = true;
    this.compensationService.getCompesations().subscribe({
      next: (data) => {
        this.store.dispatch(CompensationActions.setList({compensations: data as Compensation[]}));
        this.loading = false;
      },
      error: ()=>{this.loading = false}
    })
  }

  deleteSelectedCompensations() {
    let compensationIds: number[] = this.selectedCompensations.map(item => item.id);
    this.confirmationDialogService.showDeleteConfirmationDialog(
      () => {
        this.compensationService.deleteSelectedCompensations(compensationIds)
          .subscribe({
            next: () => {
              this.store.dispatch(CompensationActions.removeItemsFromList({compensationIds: this.selectedCompensations.map(item => item.id)}));
              this.desmarkAll();
            }
          });
      }
    )
  }

  onManagementCompensations(idCompensation: any, event: Event) {
    const backRoute = '/configurations/compensations/';
    this.router.navigate([this.cryptojsService.encryptParam(idCompensation)], {relativeTo: this.route, skipLocationChange: true,  queryParams: {backRoute: backRoute}});
  }

  onDeleteCompensation(event: any) {
    let id = event.item.id;
    event.originalEvent.preventDefault();
    this.confirmationDialogService.showDeleteConfirmationDialog(
      () => {
        this.compensationService.deleteCompensation(id)
          .subscribe({
            next: () => {
              this.store.dispatch(CompensationActions.removeFromList({id: event.item.id}));
              this.desmarkAll();
            },
          });
      }
    )
  }

  onGoUpdateCategory(id: any, event: Event) {
    const backRoute = 'configurations/compensations/';
    this.router.navigate(['configurations/compensation-categories', this.cryptojsService.encryptParam(id)], {skipLocationChange: true, queryParams: {backRoute: backRoute}})
  }

  onDeleteCategory(event: any) {
    let id = event.item.id;
    event.originalEvent.preventDefault();
    this.confirmationDialogService.showDeleteConfirmationDialog(
      () => {
        this.compensationCategoryService.deleteCategory(id)
          .subscribe({
            next: () => {
              this.store.dispatch(CompensationActions.removeFromListWithCategoryId({categoryId: id}));
              this.desmarkAll();
            }
          });
      },
      `
      ¿Está seguro de eliminar la categoría <strong>${event.data?.nombre}</strong>?
      <div class="bg-yellow-50 text-yellow-500 border-round-xl p-4 text-justify mt-2">
        <span>
            <strong>Advertencia:</strong>
            Eliminar la categoría implica eliminar todas las compensaciones laborales asociadas con ella.
            Por favor, asegúrese de que comprende el impacto de esta acción antes de proceder.
        </span>
      </div>
      `
    )
  }

  onSort() {
    this.updateRowGroupMetaData(this.dt?.filteredValue ?? this.dt?.value ?? this.compensations);
  }

  onFilter() {
    this.updateRowGroupMetaData(this.dt?.filteredValue ?? this.dt?.value ?? this.compensations);
  }

  applyFilterGlobal($event, stringVal) {
    this.dt.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
    this.updateRowGroupMetaData(this.dt.filteredValue);
  }

  onRowsChange(data: number){
    this.numberOfRows = data;
  }

  parseStringToBoolean(str: string): boolean{
    return Methods.parseStringToBoolean(str);
  }

  updateRowGroupMetaData(compesations: Compensation[]) {
    this.rowGroupMetadata = {};
    if (compesations) {
      for (let i = 0; i < compesations.length; i++) {
        const rowData = compesations[i];
        const categoryId = rowData?.idCategoria || '';
        if (i === 0) {
          this.rowGroupMetadata[categoryId] = { index: 0, size: 1 };
        }
        else {
          const previousRowData = compesations[i - 1];
          const previousRowGroup = previousRowData?.idCategoria || '';
          if (categoryId === previousRowGroup) {
            this.rowGroupMetadata[categoryId].size++;
          }
          else {
            this.rowGroupMetadata[categoryId] = { index: i, size: 1 };
          }
        }
      }
    }
  }
}
