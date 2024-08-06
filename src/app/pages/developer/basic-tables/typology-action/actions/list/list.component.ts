import {Component, OnInit} from '@angular/core';
import {MESSAGE} from "../../../../../../../labels/labels";
import {Action} from "../../../../../../models/action";
import {ConfirmationDialogService} from "../../../../../../services/confirmation-dialog.service";
import {BasicTablesService} from "../../../../../../services/basic-tables.service";
import {Table} from "primeng/table";
import {ActivatedRoute, Router} from "@angular/router";
import {CryptojsService} from "../../../../../../services/cryptojs.service";
import {MenuItem} from "primeng/api";
import {Typology} from "../../../../../../models/typology";
import {IMAGE_SIZE} from "../../../../../../utils/constants";
import {finalize, isEmpty} from "rxjs";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  protected readonly MESSAGE = MESSAGE;

  protected readonly IMAGE_SIZE = IMAGE_SIZE;

  typology: Typology;

  loading: boolean = false;

  filteredAction: any[] = [];

  selectedActions: Action[] = [];

  actions: Action[];

  items: MenuItem[] = [];

  visible: boolean = false;

  creatingOrUpdating: boolean = false;

  constructor(
    private confirmationDialogService: ConfirmationDialogService,
    private basicTablesService: BasicTablesService,
    private router: Router,
    private cryptoService: CryptojsService,
    private route: ActivatedRoute,
  ) {
  }

  showDialog() {
    this.visible = true;
  }

  ngOnInit() {
    this.intMenu();
    this.getActions();
    this.getInitialValue();
  }

  getInitialValue() {
    const idTypology = this.route.snapshot.queryParams['idTypology'];
    if (idTypology) {
      this.getTypology(idTypology);
    }
  }

  getActions() {
    this.loading = true;
    this.basicTablesService.getActions().pipe(
      finalize(() => {
        this.loading = false;
      })
    ).subscribe({
      next: (res) => {
        this.actions = res;
        this.filteredAction = res;
      }
    })
  }

  intMenu() {
    this.items = [
      {label: 'Editar', icon: 'pi pi-pencil', command: (e) => this.editAction(parseInt(e.item.id))},
      {label: 'Eliminar', icon: 'pi pi-trash', command: (e) => this.onDelete(e.item)},
    ];
  }

  deleteSelectedActions() {
    let actionsIds: number[] = this.selectedActions.map(item => item.id);
    this.confirmationDialogService.showDeleteConfirmationDialog(
      () => {
        this.basicTablesService.deleteSelectedTypologyActions(this.typology.id, actionsIds).subscribe({
          next: () => {
            for (let id of actionsIds) {
              this.filterAction(id);
              this.addActionToActions(id);
            }
          }
        });
      }
    )
  }

  getTypology(idTypology: number) {
    this.loading = true;
    this.basicTablesService.getTypology(idTypology).pipe(
      finalize(() => {
        this.loading = false;
      })
    ).subscribe({
      next: (resp) => {
        this.typology = resp;
        if (this.typology.acciones) {
          for (let action of this.typology.acciones) {
            this.filterListActions(action.id);
          }
        }
      }
    })
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  desmarkAll() {
    this.selectedActions = [];
  }

  filterAction(idAction: number) {
    this.typology.acciones = this.typology.acciones.filter((item) => item.id != idAction);
  }

  editAction(idAction: number) {
    this.router.navigate(['../form'], {
      relativeTo: this.route,
      skipLocationChange: true,
      queryParams: {
        idTypology: this.typology.id,
        idAction: idAction
      }
    }).then();
  }

  onDelete(event: any) {
    let action = event.value;
    this.confirmationDialogService.showDeleteConfirmationDialog(() => {
      this.basicTablesService.deleteTypologyAction(this.typology.id, action.id).subscribe(() => {
        this.filterAction(action.id);
        this.actions.push(action);
      });
    });
  }

  openNew() {
    this.router.navigate(['../form'], {
      relativeTo: this.route,
      skipLocationChange: true,
      queryParams: {
        idTypology: this.typology.id,
        idAction: null
      }
    }).then();
  }

  addAction(action: Action) {
    this.creatingOrUpdating = true;
    this.basicTablesService.createTypologyAction(this.typology.id, action).pipe(
      finalize(() => {
        this.creatingOrUpdating = false;
      })
    ).subscribe({
      next: () => {
        this.filterListActions(action.id);
        this.addActionToTypology(action);
      }
    })
  }

  filterListActions(idAction: number) {
    this.actions = this.actions?.filter((item) => item.id !== idAction);
    this.filteredAction = this.actions;
  }

  addActionToTypology(action: Action) {
    this.typology.acciones.push(action);
  }

  addActionToActions(idAction: number) {
    this.selectedActions.map(item => {
        if (item.id === idAction) {
          this.actions.push(item);
        }
      }
    );
    this.desmarkAll();
  }

  onFilterAction(event: Event): void {
    const searchText = (event.target as HTMLInputElement).value;
    if (!searchText) {
      this.filteredAction = this.actions;
    } else {
      this.filteredAction = this.actions.filter(it => {
        return it.nombre.includes(searchText);
      });
    }
  }

  goBack(): void {
    this.actions = [];
    this.router.navigate(['/developer/basic-tables/typology'], {
      skipLocationChange: true
    }).then();
  }

  protected readonly isEmpty = isEmpty;
  protected readonly Object = Object;
}
