import {Component, OnInit} from '@angular/core';
import {BasicTablesService, ConfirmationDialogService, CryptojsService} from "@services";
import {IMAGE_SIZE} from "@utils";
import {finalize} from "rxjs";
import {MESSAGE} from "@labels/labels";
import {Table} from "primeng/table";
import {Router} from "@angular/router";
import {MenuItem} from "primeng/api";
import { Scope } from 'src/app/models/scope';

@Component({
  selector: 'app-scope',
  templateUrl: './scope.component.html',
  styleUrls: ['./scope.component.scss']
})
export class ScopeComponent implements OnInit {

  protected readonly IMAGE_SIZE = IMAGE_SIZE;

  protected readonly MESSAGE = MESSAGE;

  tipoAlcances: Scope[] = [];

  loading: boolean = false;

  selectedScopes: Scope[] = [];

  items: MenuItem[] = [];

  constructor(
    private basicTableService: BasicTablesService,
    private confirmationDialogService: ConfirmationDialogService,
    private router: Router,
    private cryptoService: CryptojsService
  ) {
  }

  ngOnInit() {
    this.getScopes();
    this.intMenu();
  }

  intMenu() {
    this.items = [
      {label: 'Editar', icon: 'pi pi-pencil', command: (e) => this.editScope(parseInt(e.item.id))},
      {label: 'Eliminar', icon: 'pi pi-trash', command: (e) => this.onDelete(parseInt(e.item.id))},
    ];
  }

  getScopes() {
    this.loading = true;
    this.basicTableService.getScopes().pipe(
      finalize(() => {
        this.loading = false;
      })
    ).subscribe({
      next: (res) => {
        this.tipoAlcances = res;
      }
    })
  }

  deleteSelectedScope() {
    let scopeIds: number[] = this.selectedScopes.map(item => item.id);
    this.confirmationDialogService.showDeleteConfirmationDialog(
      () => {
        this.basicTableService.deleteSelectedScope(scopeIds)
          .subscribe({
            next: () => {
              this.desmarkAll();
              for (let id of scopeIds) {
                this.filterScope(id);
              }
            }
          });
      }
    )
  }

  editScope(idScope: number) {
    this.router.navigate(['developer/basic-tables/create-scope', this.cryptoService.encryptParam(idScope)], {
      skipLocationChange: true,
    }).then();
  }

  filterScope(idScope: number) {
    this.tipoAlcances = this.tipoAlcances.filter((item) => item.id != idScope);
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  desmarkAll() {
    this.selectedScopes = [];
  }

  openNew() {
    this.router.navigate(['developer/basic-tables/create-scope'], {
      skipLocationChange: true,
    }).then();
  }

  onDelete(idScope: number) {
    this.confirmationDialogService.showDeleteConfirmationDialog(() => {
      this.basicTableService.deleteScope(idScope).subscribe(() => {
        this.filterScope(idScope);
        this.desmarkAll();
      });
    });
  }

}
