import {Component, OnInit} from '@angular/core';
import {IMAGE_SIZE} from "@utils";
import {MESSAGE} from "@labels/labels";
import {MenuItem} from "primeng/api";
import {Router} from "@angular/router";
import {finalize} from "rxjs";
import {Convention} from "@models";
import {Table} from "primeng/table";
import {BasicTablesService, ConfirmationDialogService, CryptojsService} from "@services";


@Component({
  selector: 'app-conventions',
  templateUrl: './convention.component.html',
  styleUrls: ['./convention.component.scss']
})
export class ConventionComponent implements OnInit {

  protected readonly IMAGE_SIZE = IMAGE_SIZE;

  protected readonly MESSAGE = MESSAGE;

  conventions: Convention[] = [];

  loading: boolean = false;

  selectedConventions: Convention[] = [];

  items: MenuItem[] = [];

  constructor(
    private basicTableService: BasicTablesService,
    private confirmationDialogService: ConfirmationDialogService,
    private router: Router,
    private cryptoService: CryptojsService
  ) {
  }

  ngOnInit() {
    this.getConventions();
    this.intMenu();
  }

  intMenu() {
    this.items = [
      {label: 'Editar', icon: 'pi pi-pencil', command: (e) => this.editConvention(parseInt(e.item.id))},
      {label: 'Eliminar', icon: 'pi pi-trash', command: (e) => this.onDelete(parseInt(e.item.id))},
    ];
  }

  getConventions() {
    this.loading = true;
    this.basicTableService.getConventions().pipe(
      finalize(() => {
        this.loading = false;
      })
    ).subscribe({
      next: (res) => {
        this.conventions = res;
      }
    })
  }

  deleteSelectedConventions() {
    let conventionsIds: number[] = this.selectedConventions.map(item => item.id);
    this.confirmationDialogService.showDeleteConfirmationDialog(
      () => {
        this.basicTableService.deleteSelectedConventions(conventionsIds).subscribe({
          next: () => {
            this.desmarkAll();
            for (let id of conventionsIds) {
              this.filterConvention(id);
            }
          }
        });
      }
    )
  }

  editConvention(idConvention: number) {
    this.router.navigate(['developer/basic-tables/create-convention', this.cryptoService.encryptParam(idConvention)], {
      skipLocationChange: true,
    }).then();
  }

  filterConvention(idConvention: number) {
    this.conventions = this.conventions.filter((item) => item.id != idConvention);
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  desmarkAll() {
    this.selectedConventions = [];
  }

  openNew() {
    this.router.navigate(['developer/basic-tables/create-convention'], {
      skipLocationChange: true,
    }).then();
  }

  onDelete(idConvention: number) {
    this.confirmationDialogService.showDeleteConfirmationDialog(() => {
      this.basicTableService.deleteAction(idConvention).subscribe(() => {
        this.filterConvention(idConvention);
        this.desmarkAll();
      });
    });
  }

}
