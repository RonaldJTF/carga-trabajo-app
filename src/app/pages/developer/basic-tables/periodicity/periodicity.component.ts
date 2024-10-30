import {Component, OnInit} from '@angular/core';
import {BasicTablesService, ConfirmationDialogService, CryptojsService} from "@services";
import {IMAGE_SIZE} from "@utils";
import {finalize} from "rxjs";
import {MESSAGE} from "@labels/labels";
import {Table} from "primeng/table";
import {Router} from "@angular/router";
import {MenuItem} from "primeng/api";
import { Periodicity } from '@models';

@Component({
  selector: 'app-periodicity',
  templateUrl: './periodicity.component.html',
  styleUrls: ['./periodicity.component.scss']
})
export class PeriodicityComponent implements OnInit {

  protected readonly IMAGE_SIZE = IMAGE_SIZE;

  protected readonly MESSAGE = MESSAGE;

  tipoPeriodicidad: Periodicity[] = [];

  loading: boolean = false;

  selectedPeriodicities: Periodicity[] = [];

  items: MenuItem[] = [];

  constructor(
    private basicTableService: BasicTablesService,
    private confirmationDialogService: ConfirmationDialogService,
    private router: Router,
    private cryptoService: CryptojsService
  ) {
  }

  ngOnInit() {
    this.getPeriodicities();
    this.intMenu();
  }

  intMenu() {
    this.items = [
      {label: 'Editar', icon: 'pi pi-pencil', command: (e) => this.editPeriodicity(parseInt(e.item.id))},
      {label: 'Eliminar', icon: 'pi pi-trash', command: (e) => this.onDelete(parseInt(e.item.id))},
    ];
  }

  getPeriodicities() {
    this.loading = true;
    this.basicTableService.getPeriodicities().pipe(
      finalize(() => {
        this.loading = false;
      })
    ).subscribe({
      next: (res) => {
        this.tipoPeriodicidad = res;
      }
    })
  }

  deleteSelectedPeriodicity() {
    let periodicityIds: number[] = this.selectedPeriodicities.map(item => item.id);
    this.confirmationDialogService.showDeleteConfirmationDialog(
      () => {
        this.basicTableService.deleteSelectedPeriodicity(periodicityIds)
          .subscribe({
            next: () => {
              this.desmarkAll();
              for (let id of periodicityIds) {
                this.filterPeriodicity(id);
              }
            }
          });
      }
    )
  }

  editPeriodicity(idPeriodicity: number) {
    this.router.navigate(['developer/basic-tables/create-periodicity', this.cryptoService.encryptParam(idPeriodicity)], {
      skipLocationChange: true,
    }).then();
  }

  filterPeriodicity(idPeriodicity: number) {
    this.tipoPeriodicidad = this.tipoPeriodicidad.filter((item) => item.id != idPeriodicity);
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  desmarkAll() {
    this.selectedPeriodicities = [];
  }

  openNew() {
    this.router.navigate(['developer/basic-tables/create-periodicity'], {
      skipLocationChange: true,
    }).then();
  }

  onDelete(idPeriodicity: number) {
    this.confirmationDialogService.showDeleteConfirmationDialog(() => {
      this.basicTableService.deletePeriodicity(idPeriodicity).subscribe(() => {
        this.filterPeriodicity(idPeriodicity);
        this.desmarkAll();
      });
    });
  }

}
