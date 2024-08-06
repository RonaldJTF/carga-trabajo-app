import {Component, OnInit} from '@angular/core';
import {MenuItem} from "primeng/api";
import {IMAGE_SIZE} from "../../../../utils/constants";
import {MESSAGE} from "../../../../../labels/labels";
import {BasicTablesService} from "../../../../services/basic-tables.service";
import {ConfirmationDialogService} from "../../../../services/confirmation-dialog.service";
import {Router} from "@angular/router";
import {CryptojsService} from "../../../../services/cryptojs.service";
import {finalize} from "rxjs";
import {Table} from "primeng/table";
import {Level} from "../../../../models/level";

@Component({
  selector: 'app-level',
  templateUrl: './level.component.html',
  styleUrls: ['./level.component.scss']
})
export class LevelComponent implements OnInit{
  protected readonly IMAGE_SIZE = IMAGE_SIZE;

  protected readonly MESSAGE = MESSAGE;

  levels: Level[] = [];

  loading: boolean = false;

  selectedLevels: Level[] = [];

  items: MenuItem[] = [];

  constructor(
    private basicTableService: BasicTablesService,
    private confirmationDialogService: ConfirmationDialogService,
    private router: Router,
    private cryptoService: CryptojsService
  ) {
  }

  ngOnInit() {
    this.getLevels();
    this.intMenu();
  }

  intMenu() {
    this.items = [
      {label: 'Editar', icon: 'pi pi-pencil', command: (e) => this.editLevel(parseInt(e.item.id))},
      {label: 'Eliminar', icon: 'pi pi-trash', command: (e) => this.onDelete(parseInt(e.item.id))},
    ];
  }

  getLevels() {
    this.loading = true;
    this.basicTableService.getLevels().pipe(
      finalize(() => {
        this.loading = false;
      })
    ).subscribe({
      next: (res) => {
        this.levels = res;
      }
    })
  }

  deleteSelectedLevel() {
    let levelIds: number[] = this.selectedLevels.map(item => item.id);
    this.confirmationDialogService.showDeleteConfirmationDialog(
      () => {
        this.basicTableService.deleteSelectedLevel(levelIds)
          .subscribe({
            next: () => {
              this.desmarkAll();
              for (let id of levelIds) {
                this.filterLevel(id);
              }
            }
          });
      }
    )
  }

  editLevel(idLevel: number) {
    this.router.navigate(['developer/basic-tables/create-level', this.cryptoService.encryptParam(idLevel)], {
      skipLocationChange: true,
    }).then();
  }

  filterLevel(idLevel: number) {
    this.levels = this.levels.filter((item) => item.id != idLevel);
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  desmarkAll() {
    this.selectedLevels = [];
  }

  openNew() {
    this.router.navigate(['developer/basic-tables/create-level'], {
      skipLocationChange: true,
    }).then();
  }

  onDelete(idLevel: number) {
    this.confirmationDialogService.showDeleteConfirmationDialog(() => {
      this.basicTableService.deleteLevel(idLevel).subscribe(() => {
        this.filterLevel(idLevel);
      });
    });
  }

}
