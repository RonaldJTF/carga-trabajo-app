import {Component, OnInit} from '@angular/core';
import {Gender} from "@models";
import {IMAGE_SIZE} from "@utils";
import {MESSAGE} from "@labels/labels";
import {BasicTablesService, ConfirmationDialogService, CryptojsService} from "@services";
import {Router} from "@angular/router";
import {MenuItem} from "primeng/api";
import {Table} from "primeng/table";
import {finalize} from "rxjs";

@Component({
  selector: 'app-gender',
  templateUrl: './gender.component.html',
  styleUrls: ['./gender.component.scss']
})
export class GenderComponent implements OnInit {

  protected readonly IMAGE_SIZE = IMAGE_SIZE;

  protected readonly MESSAGE = MESSAGE;

  genders: Gender[] = [];

  loading: boolean = false;

  selectedGender: Gender[] = [];

  items: MenuItem[] = [];

  constructor(
    private basicTableService: BasicTablesService,
    private confirmationDialogService: ConfirmationDialogService,
    private router: Router,
    private cryptoService: CryptojsService
  ) {
  }

  ngOnInit() {
    this.getGenders();
    this.intMenu();
  }

  intMenu() {
    this.items = [
      {label: 'Editar', icon: 'pi pi-pencil', command: (e) => this.editGender(parseInt(e.item.id))},
      {label: 'Eliminar', icon: 'pi pi-trash', command: (e) => this.onDelete(parseInt(e.item.id))},
    ];
  }

  getGenders() {
    this.loading = true;
    this.basicTableService.getGenders().pipe(
      finalize(() => {
        this.loading = false;
      })
    ).subscribe({
      next: (res) => {
        this.genders = res;
      }
    })
  }

  openNew() {
    this.router.navigate(['developer/basic-tables/create-gender'], {
      skipLocationChange: true,
    }).then();
  }

  deleteSelectedGender() {
    let genderIds: number[] = this.selectedGender.map(item => item.id);
    this.confirmationDialogService.showDeleteConfirmationDialog(
      () => {
        this.basicTableService.deleteSelectedGender(genderIds)
          .subscribe({
            next: () => {
              this.desmarkAll();
              for (let id of genderIds) {
                this.filterRole(id);
              }
            }
          });
      }
    )
  }

  filterRole(idPerson: number) {
    this.genders = this.genders.filter((item) => item.id != idPerson);
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  desmarkAll() {
    this.selectedGender = [];
  }

  editGender(idGender: number) {
    this.router.navigate(['developer/basic-tables/create-gender', this.cryptoService.encryptParam(idGender)], {
      skipLocationChange: true,
    }).then();
  }

  onDelete(id: number) {
    this.confirmationDialogService.showDeleteConfirmationDialog(() => {
      this.basicTableService.deleteGender(id).subscribe(() => {
        this.filterRole(id);
        this.desmarkAll();
      });
    });
  }
}
