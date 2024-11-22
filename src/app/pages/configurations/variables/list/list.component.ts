import { Component, OnDestroy, OnInit} from '@angular/core';
import * as VariableActions from "@store/variable.actions";
import { ActivatedRoute, Router } from '@angular/router';
import { MESSAGE } from '@labels/labels';
import { Variable } from '@models';
import { Store } from '@ngrx/store';
import { AuthenticationService, ConfirmationDialogService, CryptojsService } from '@services';
import { IMAGE_SIZE, Methods } from '@utils';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducers';
import { VariableService } from 'src/app/services/variable.service';
import { Table } from 'primeng/table';
import { MathjaxService } from 'src/app/services/mathjax.service';

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

  variables: Variable[] = [];
  variablesSubscription: Subscription;

  selectedVariables: Variable[] = [];
  menuItemsOfVariable: MenuItem[] = [];
  menuItemsOfPrimaryVariable: MenuItem[] = [];

  constructor(
    private store: Store<AppState>,
    private confirmationDialogService: ConfirmationDialogService,
    private variableService: VariableService,
    private authService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
    private cryptoService: CryptojsService,
    private mathJaxService: MathjaxService
  ){}

  ngOnInit(): void {
    
    const {isAdministrator, isOperator} = this.authService.roles();
    this.isAdmin = isAdministrator;

    this.variablesSubscription =  this.store.select(state => state.variable.items).subscribe(e => this.variables = e);
    this.getVariables();
    this.initMenus();
  }

  ngOnDestroy(): void {
    this.variablesSubscription?.unsubscribe();
  }

  initMenus() {
    this.menuItemsOfVariable = [
      {label: 'Editar', icon: 'pi pi-pencil', visible: this.isAdmin, command: (e) => this.onGoToUpdateVariable(e.item.id, e.originalEvent)},
      {label: 'Eliminar', icon: 'pi pi-trash', visible: this.isAdmin, command: (e) => this.onDeleteVariable(e)},
    ];
    this.menuItemsOfPrimaryVariable = [
      {label: 'Editar', icon: 'pi pi-pencil', visible: this.isAdmin, command: (e) => this.onGoToUpdateVariable(e.item.id, e.originalEvent)},
    ]
  }

  getVariables(){
    this.loading = true;
    this.variableService.getVariables().subscribe( e => {
      this.store.dispatch(VariableActions.setList({variables: e as Variable[]}));
      this.loading = false;
    })
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  openNew() {
    this.router.navigate(['create'], { relativeTo: this.route, skipLocationChange: true});
  }

  onGoToUpdateVariable (id : any, event: Event): void{
    event.preventDefault();
    event.stopPropagation();
    this.router.navigate([this.cryptoService.encryptParam(id)], {relativeTo: this.route, skipLocationChange: true})
  }

  onDeleteVariable(event: any): void {
    let id = parseInt(event.item.id);
    const nameVariables = this.variables.filter( e => e.valor.includes(`$[${id}]`)).map(e => e.nombre).join(', ');
    const detail = nameVariables ? `(${nameVariables})` : '';

    event.originalEvent.preventDefault();
    event.originalEvent.stopPropagation();
    this.confirmationDialogService.showDeleteConfirmationDialog(
      () => {
        this.variableService.deleteVariable(id)
        .subscribe({
          next: () => {
            this.store.dispatch(VariableActions.removeFromList({id: id}));
            this.desmarkAll();
          },
        });
      },
       `
      ¿Está seguro de eliminar la variable <strong>${event.item.value?.nombre}</strong>?
      <div class="bg-yellow-50 text-yellow-500 border-round-xl p-4 text-justify mt-2">
        <span>
            <strong>Advertencia:</strong> 
            Eliminar esta variable conlleva a eliminar a las otras variables en cascada <strong>${detail}</strong> y las reglas que tienen relación con ella. 
            Por favor, asegúrese de que comprende el impacto de esta acción antes de proceder.
        </span>
      </div>
      `
    )
  }

  deleteSelectedVariables() {
    let variableIds: number[] = this.selectedVariables.map(item => item.id);
    this.confirmationDialogService.showDeleteConfirmationDialog(
      () => {
        this.variableService.deleteSelectedVariables(variableIds)
        .subscribe({
          next: (e) => {
           this.store.dispatch(VariableActions.removeItemsFromList({variableIds: variableIds}));
           this.desmarkAll();
          }
        });
      },
      `
      ¿Está seguro de eliminar las variables?
      <div class="bg-yellow-50 text-yellow-500 border-round-xl p-4 text-justify mt-2">
        <span>
            <strong>Advertencia:</strong> 
            Eliminar estas variables conlleva a eliminar a las otras variables en cascada y las reglas que tienen relación con cada una.  
            Por favor, asegúrese de que comprende el impacto de esta acción antes de proceder.
        </span>
      </div>
      `
    )
  }

  desmarkAll() {
    this.selectedVariables = [];
  }

  parseStringToBoolean(str: string): boolean{
    return Methods.parseStringToBoolean(str);
  }
}