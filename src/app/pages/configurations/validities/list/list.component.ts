import { Component, OnDestroy, OnInit } from '@angular/core';
import * as ValidityActions from "@store/validity.actions";
import { ActivatedRoute, Router } from '@angular/router';
import { MESSAGE } from '@labels/labels';
import { Validity } from '@models';
import { Store } from '@ngrx/store';
import { AuthenticationService, ConfirmationDialogService, CryptojsService, ValidityService } from '@services';
import { IMAGE_SIZE } from '@utils';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducers';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy{
  IMAGE_SIZE = IMAGE_SIZE;
  MESSAGE = MESSAGE;

  isAdmin: boolean;
  loading: boolean = false;
  loadingValidityById: any = {};

  validities: Validity[] = [];
  validitiesSubscription: Subscription;

  selectedValidities: Validity[] = [];
  menuItemsOfValidity: MenuItem[] = [];
  menuItemsOfValueInValidity: MenuItem[] = [];

  constructor(
    private store: Store<AppState>,
    private confirmationDialogService: ConfirmationDialogService,
    private validityService: ValidityService,
    private authService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
    private cryptoService: CryptojsService
  ){}

  ngOnInit(): void {
    const {isAdministrator, isOperator} = this.authService.roles();
    this.isAdmin = isAdministrator;

    this.validitiesSubscription =  this.store.select(state => state.validity.items).subscribe(e => this.validities = e);
    this.getValidities();
    this.initMenus();
    //Reestablecemos a valores iniciales cuando vayamos a editar o a gestionar las parametrizaciones o valores de las variables de una vigencia
    this.validityService.setMustRechargeValidityFormGroup(true);
  }

  ngOnDestroy(): void {
    this.validitiesSubscription?.unsubscribe();
  }

  initMenus() {
    this.menuItemsOfValidity = [
      {label: 'Gestión de variables', icon: 'pi pi-cog', visible: this.isAdmin, command: (e) => this.onGoToUpdateValidity(e.item.id, e.originalEvent)},
      {label: 'Editar', icon: 'pi pi-pencil', visible: this.isAdmin, command: (e) => this.onGoToUpdateValidity(e.item.id, e.originalEvent)},
      {label: 'Eliminar', icon: 'pi pi-trash', visible: this.isAdmin, command: (e) => this.onDeleteValidity(e)},
    ];
    this.menuItemsOfValueInValidity = [{label: 'Eliminar', icon: 'pi pi-trash', visible: this.isAdmin, command: (e) => this.onDeleteValueInValidity(e)}]
  }

  getValidities(){
    this.loading = true;
    this.validityService.getValidities().subscribe( e => {
      this.store.dispatch(ValidityActions.setList({validities: e as Validity[]}));
      this.loading = false;
    })
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  openNew() {
    this.router.navigate(['create'], { relativeTo: this.route, skipLocationChange: true});
  }

  onGoToUpdateValidity (id : any, event: Event): void{
    event.preventDefault();
    event.stopPropagation();
    this.router.navigate([this.cryptoService.encryptParam(id)], {relativeTo: this.route, skipLocationChange: true})
  }

  onDeleteValidity(event: any): void {
    let id = parseInt(event.item.id);
    event.originalEvent.preventDefault();
    event.originalEvent.stopPropagation();
    this.confirmationDialogService.showDeleteConfirmationDialog(
      () => {
        this.validityService.deleteValidity(id)
        .subscribe({
          next: () => {
            this.store.dispatch(ValidityActions.removeFromList({id: id}));
            this.desmarkAll();
          },
        });
      },
      `
      ¿Está seguro de eliminar la vigencia <strong>${event.item.value?.nombre}</strong>?
      <div class="bg-yellow-50 text-yellow-500 border-round-xl p-4 text-justify mt-2">
        <span>
            <strong>Advertencia:</strong>
            Eliminar la vigencia implica eliminar todas las parametrizaciones de los valores de las variables designados en esa vigencia.
            Por favor, asegúrese de que comprende el impacto de esta acción antes de proceder.
        </span>
      </div>
      `
    )
  }

  deleteSelectedValidities() {
    let validityIds: number[] = this.selectedValidities.map(item => item.id);
    this.confirmationDialogService.showDeleteConfirmationDialog(
      () => {
        this.validityService.deleteSelectedValidities(validityIds)
        .subscribe({
          next: (e) => {
           this.store.dispatch(ValidityActions.removeItemsFromList({validityIds: validityIds}));
           this.desmarkAll();
          }
        });
      }
    )
  }

  desmarkAll() {
    this.selectedValidities = [];
  }

  onDeleteValueInValidity(event: any): void {
    let id = parseInt(event.item.id);
    event.originalEvent.preventDefault();
    event.originalEvent.stopPropagation();
    this.confirmationDialogService.showDeleteConfirmationDialog(
      () => {
        this.validityService.deleteValueInValidity(id)
        .subscribe({
          next: () => {
            this.store.dispatch(ValidityActions.removeValueInValidityToValidity({valueInValidityId: id}));
            this.desmarkAll();
          },
        });
      }
    )
  }

  loadValuesInValidityToTable(validityId: number, isLoaded: boolean, expanded: boolean){
    if(!expanded && !isLoaded){
      this.loadingValidityById[validityId] = true;
      this.validityService.getValuesInValidityByValidityId(validityId).subscribe({
        next: (e) =>{
          this.store.dispatch(ValidityActions.updateValuesInValitiyToValidity({validityId: validityId, valuesInValidity: e}));
          this.loadingValidityById[validityId] = false;
        }
      })
    }
  }
}
