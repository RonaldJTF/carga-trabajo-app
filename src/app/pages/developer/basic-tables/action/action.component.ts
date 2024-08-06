import {Component, OnInit} from '@angular/core';
import {IMAGE_SIZE} from "../../../../utils/constants";
import {MESSAGE} from "../../../../../labels/labels";
import {MenuItem} from "primeng/api";
import {BasicTablesService} from "../../../../services/basic-tables.service";
import {ConfirmationDialogService} from "../../../../services/confirmation-dialog.service";
import {Router} from "@angular/router";
import {CryptojsService} from "../../../../services/cryptojs.service";
import {finalize} from "rxjs";
import {Action} from "../../../../models/action";
import {Table} from "primeng/table";

@Component({
  selector: 'app-actions',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss']
})
export class ActionComponent implements OnInit {

  protected readonly IMAGE_SIZE = IMAGE_SIZE;

  protected readonly MESSAGE = MESSAGE;

  actions: Action[] = [];

  loading: boolean = false;

  selectedActions: Action[] = [];

  items: MenuItem[] = [];

  constructor(
    private basicTableService: BasicTablesService,
    private confirmationDialogService: ConfirmationDialogService,
    private router: Router,
    private cryptoService: CryptojsService
  ) {
  }

  ngOnInit() {
    this.getActions();
    this.intMenu();
  }

  intMenu() {
    this.items = [
      {label: 'Editar', icon: 'pi pi-pencil', command: (e) => this.editAction(parseInt(e.item.id))},
      {label: 'Eliminar', icon: 'pi pi-trash', command: (e) => this.onDelete(parseInt(e.item.id))},
    ];
  }

  getActions() {
    this.loading = true;
    this.basicTableService.getActions().pipe(
      finalize(() => {
        this.loading = false;
      })
    ).subscribe({
      next: (res) => {
        this.actions = res;
      }
    })
  }

  deleteSelectedActions() {
    let actionsIds: number[] = this.selectedActions.map(item => item.id);
    this.confirmationDialogService.showDeleteConfirmationDialog(
      () => {
        this.basicTableService.deleteSelectedActions(actionsIds).subscribe({
          next: () => {
            this.desmarkAll();
            for (let id of actionsIds) {
              this.filterAction(id);
            }
          }
        });
      }
    )
  }

  editAction(idAction: number) {
    this.router.navigate(['developer/basic-tables/create-action', this.cryptoService.encryptParam(idAction)], {
      skipLocationChange: true,
    }).then();
  }

  filterAction(idAction: number) {
    this.actions = this.actions.filter((item) => item.id != idAction);
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  desmarkAll() {
    this.selectedActions = [];
  }

  openNew() {
    this.router.navigate(['developer/basic-tables/create-action'], {
      skipLocationChange: true,
    }).then();
  }

  onDelete(idAction: number) {
    this.confirmationDialogService.showDeleteConfirmationDialog(() => {
      this.basicTableService.deleteAction(idAction).subscribe(() => {
        this.filterAction(idAction);
      });
    });
  }

}
