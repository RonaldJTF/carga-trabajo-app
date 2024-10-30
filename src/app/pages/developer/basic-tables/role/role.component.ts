import {Component, OnInit} from '@angular/core';
import {BasicTablesService, ConfirmationDialogService, CryptojsService} from "@services";
import {IMAGE_SIZE} from "@utils";
import {finalize} from "rxjs";
import {MESSAGE} from "@labels/labels";
import {Table} from "primeng/table";
import {Router} from "@angular/router";
import {MenuItem} from "primeng/api";
import {Role} from "@models";

@Component({
  selector: 'app-rol',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {

  protected readonly IMAGE_SIZE = IMAGE_SIZE;

  protected readonly MESSAGE = MESSAGE;

  roles: Role[] = [];

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
    this.getRoles();
    this.intMenu();
  }

  intMenu() {
    this.items = [
      {label: 'Editar', icon: 'pi pi-pencil', command: (e) => this.editRol(parseInt(e.item.id))},
      {label: 'Eliminar', icon: 'pi pi-trash', command: (e) => this.onDelete(parseInt(e.item.id))},
    ];
  }

  getRoles() {
    this.loading = true;
    this.basicTableService.getRoles().pipe(
      finalize(() => {
        this.loading = false;
      })
    ).subscribe({
      next: (res) => {
        this.roles = this.decryptList<Role>(res);
      }
    })
  }

  deleteSelectedRole() {
    let roleIds: string[] = this.selectedRole.map(item => this.cryptoService.encryptParam(item.id));
    this.confirmationDialogService.showDeleteConfirmationDialog(
      () => {
        this.basicTableService.deleteSelectedRole(roleIds)
          .subscribe({
            next: () => {
              this.desmarkAll();
              for (let id of roleIds) {
                this.filterRole(this.cryptoService.decryptParamAsNumber(id));
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

  filterRole(idRol: number) {
    this.roles = this.roles.filter((item) => item.id != idRol);
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
      this.basicTableService.deleteRole(this.cryptoService.encryptParam(idRol)).subscribe(() => {
        this.filterRole(idRol);
        this.desmarkAll();
      });
    });
  }

  decryptList<T>(param: string[]): T[] {
    let list: T[] = [];
    param.forEach(item => {
      let element: T = JSON.parse(this.cryptoService.decryptParamAsString(item));
      list.push(element);
    })
    return list;
  }

}
