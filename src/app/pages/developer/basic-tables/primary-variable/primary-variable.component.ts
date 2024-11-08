import {Component, OnInit} from '@angular/core';
import {BasicTablesService, ConfirmationDialogService, CryptojsService} from "@services";
import {IMAGE_SIZE} from "@utils";
import {finalize} from "rxjs";
import {MESSAGE} from "@labels/labels";
import {Table} from "primeng/table";
import {Router} from "@angular/router";
import {MenuItem} from "primeng/api";
import {Variable} from "@models";

@Component({
  selector: 'app-primary-variable',
  templateUrl: './primary-variable.component.html',
  styleUrls: ['./primary-variable.component.scss']
})
export class PrimaryVariableComponent implements OnInit {

  protected readonly IMAGE_SIZE = IMAGE_SIZE;

  protected readonly MESSAGE = MESSAGE;

  primaryVariables: Variable[] = [];

  loading: boolean = false;

  selectedPrimaryVariable: Variable[] = [];

  items: MenuItem[] = [];

  constructor(
    private basicTableService: BasicTablesService,
    private confirmationDialogService: ConfirmationDialogService,
    private router: Router,
    private cryptoService: CryptojsService
  ) {
  }

  ngOnInit() {
    this.getVariables();
    this.intMenu();
  }

  intMenu() {
    this.items = [
      {label: 'Editar', icon: 'pi pi-pencil', command: (e) => this.editVariable(parseInt(e.item.id))},
      {label: 'Eliminar', icon: 'pi pi-trash', command: (e) => this.onDelete(parseInt(e.item.id))},
    ];
  }

  getVariables() {
    this.loading = true;
    this.basicTableService.getPrimaryVariables().pipe(
      finalize(() => {
        this.loading = false;
      })
    ).subscribe({
      next: (res) => {
        this.primaryVariables = res;
      }
    })
  }

  deleteSelectedVariable() {
    let variableIds: number[] = this.selectedPrimaryVariable.map(item => item.id);
    this.confirmationDialogService.showDeleteConfirmationDialog(
      () => {
        this.basicTableService.deleteSelectedPrimaryVariable(variableIds)
          .subscribe({
            next: () => {
              this.desmarkAll();
              for (let id of variableIds) {
                this.filterVariable(id);
              }
            }
          });
      }
    )
  }

  editVariable(idVariable: number) {
    this.router.navigate(['developer/basic-tables/create-primary-variable', this.cryptoService.encryptParam(idVariable)], {
      skipLocationChange: true,
    }).then();
  }

  filterVariable(idVariable: number) {
    this.primaryVariables = this.primaryVariables.filter((item) => item.id != idVariable);
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  desmarkAll() {
    this.selectedPrimaryVariable = [];
  }

  openNew() {
    this.router.navigate(['developer/basic-tables/create-primary-variable'], {
      skipLocationChange: true,
    }).then();
  }

  onDelete(idVariable: number) {
    this.confirmationDialogService.showDeleteConfirmationDialog(() => {
      this.basicTableService.deletePrimaryVariable(idVariable).subscribe(() => {
        this.filterVariable(idVariable);
        this.desmarkAll();
      });
    });
  }

}