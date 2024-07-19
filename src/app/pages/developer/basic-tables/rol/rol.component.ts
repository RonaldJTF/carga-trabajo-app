import {Component, OnInit} from '@angular/core';
import {BasicTablesService} from "../../../../services/basic-tables.service";
import {IMAGE_SIZE} from "../../../../utils/constants";
import {finalize} from "rxjs";
import {MESSAGE} from "../../../../../labels/labels";
import {ConfirmationDialogService} from "../../../../services/confirmation-dialog.service";
import {Table} from "primeng/table";
import {Router} from "@angular/router";
import {CryptojsService} from "../../../../services/cryptojs.service";
import {MenuItem} from "primeng/api";
import {Role} from "../../../../models/role";

@Component({
  selector: 'app-rol',
  templateUrl: './rol.component.html',
  styleUrls: ['./rol.component.scss']
})
export class RolComponent implements OnInit {

  protected readonly IMAGE_SIZE = IMAGE_SIZE;

  protected readonly MESSAGE = MESSAGE;

  role: Role[] = [];

  loading: boolean = false;

  selectedRole: Role[] = [];

  items: MenuItem[] = [];

  constructor(
    private basicTableService: BasicTablesService,
    private confirmationDialogService: ConfirmationDialogService,
    private router: Router,
    private cryptoService: CryptojsService
  ) {
  }

  ngOnInit() {
    this.getRole();
    this.intMenu();
  }

  intMenu() {
    this.items = [
      {label: 'Editar', icon: 'pi pi-pencil', command: (e) => this.editRol(parseInt(e.item.id))},
      {label: 'Eliminar', icon: 'pi pi-trash', command: (e) => this.onDelete(parseInt(e.item.id))},
    ];
  }

  getRole() {
    this.loading = true;
    this.basicTableService.getRoles().pipe(
      finalize(() => {
        this.loading = false;
      })
    ).subscribe({
      next: (res) => {
        this.role = res;
      }
    })
  }

  deleteSelectedRole() {
    let roleIds: number[] = this.selectedRole.map(item => item.id);
    this.confirmationDialogService.showDeleteConfirmationDialog(
      () => {
        this.basicTableService.deleteSelectedRole(roleIds)
          .subscribe({
            next: () => {
              this.desmarkAll();
              for (let id of roleIds) {
                this.filterRole(id);
              }
            }
          });
      }
    )
  }

  editRol(idRol: number) {
    this.router.navigate(['developer/basic-tables/create-role', this.cryptoService.encryptParam(idRol)], {
      skipLocationChange: true,
    }).then();
  }

  filterRole(idPerson: number) {
    this.role = this.role.filter((item) => item.id != idPerson);
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  desmarkAll() {
    this.selectedRole = [];
  }

  openNew() {
    this.router.navigate(['developer/basic-tables/create-role'], {
      skipLocationChange: true,
    }).then();
  }

  onDelete(idRol: number) {
    this.confirmationDialogService.showDeleteConfirmationDialog(() => {
      this.basicTableService.deleteRole(idRol).subscribe(() => {
        this.filterRole(idRol);
      });
    });
  }

}
