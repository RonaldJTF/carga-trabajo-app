import {Component, OnInit} from '@angular/core';
import {BasicTablesService, ConfirmationDialogService, CryptojsService} from "@services";
import {IMAGE_SIZE} from "@utils";
import {finalize} from "rxjs";
import {MESSAGE} from "@labels/labels";
import {Table} from "primeng/table";
import {Router} from "@angular/router";
import {MenuItem} from "primeng/api";
import {NormativityType} from "@models";

@Component({
  selector: 'app-normativity-type',
  templateUrl: './normativity-type.component.html',
  styleUrls: ['./normativity-type.component.scss']
})
export class NormativityTypeComponent implements OnInit {

  protected readonly IMAGE_SIZE = IMAGE_SIZE;

  protected readonly MESSAGE = MESSAGE;

  tipoNormatividades: NormativityType[] = [];

  loading: boolean = false;

  selectedNormativityTypes: NormativityType[] = [];

  items: MenuItem[] = [];

  constructor(
    private basicTableService: BasicTablesService,
    private confirmationDialogService: ConfirmationDialogService,
    private router: Router,
    private cryptoService: CryptojsService
  ) {
  }

  ngOnInit() {
    this.getNormativityTypes();
    this.intMenu();
  }

  intMenu() {
    this.items = [
      {label: 'Editar', icon: 'pi pi-pencil', command: (e) => this.editNormativityType(parseInt(e.item.id))},
      {label: 'Eliminar', icon: 'pi pi-trash', command: (e) => this.onDelete(parseInt(e.item.id))},
    ];
  }

  getNormativityTypes() {
    this.loading = true;
    this.basicTableService.getNormativityTypes().pipe(
      finalize(() => {
        this.loading = false;
      })
    ).subscribe({
      next: (res) => {
        this.tipoNormatividades = res;
      }
    })
  }

  deleteSelectedNormativityTypes() {
    let normativityTypeIds: number[] = this.selectedNormativityTypes.map(item => item.id);
    this.confirmationDialogService.showDeleteConfirmationDialog(
      () => {
        this.basicTableService.deleteSelectedNormativityType(normativityTypeIds)
          .subscribe({
            next: () => {
              this.desmarkAll();
              for (let id of normativityTypeIds) {
                this.filterNormativityType(id);
              }
            }
          });
      }
    )
  }

  editNormativityType(idNormativityType: number) {
    this.router.navigate(['developer/basic-tables/create-normativity-type', this.cryptoService.encryptParam(idNormativityType)], {
      skipLocationChange: true,
    }).then();
  }

  filterNormativityType(idNormativityType: number) {
    this.tipoNormatividades = this.tipoNormatividades.filter((item) => item.id != idNormativityType);
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  desmarkAll() {
    this.selectedNormativityTypes = [];
  }

  openNew() {
    this.router.navigate(['developer/basic-tables/create-normativity-type'], {
      skipLocationChange: true,
    }).then();
  }

  onDelete(idNormativityType: number) {
    this.confirmationDialogService.showDeleteConfirmationDialog(() => {
      this.basicTableService.deleteNormativityType(idNormativityType).subscribe(() => {
        this.filterNormativityType(idNormativityType);
        this.desmarkAll();
      });
    });
  }

}
