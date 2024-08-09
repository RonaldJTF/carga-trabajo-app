import {Component, OnInit} from '@angular/core';
import {MenuItem} from "primeng/api";
import {BasicTablesService, ConfirmationDialogService, CryptojsService} from "@services";
import {Router} from "@angular/router";
import {IMAGE_SIZE} from "@utils";
import {MESSAGE} from "@labels/labels";
import {Typology} from "@models";
import {finalize} from "rxjs";
import {Table} from "primeng/table";

@Component({
  selector: 'app-typology',
  templateUrl: './typology.component.html',
  styleUrls: ['./typology.component.scss']
})
export class TypologyComponent implements OnInit {

  protected readonly IMAGE_SIZE = IMAGE_SIZE;

  protected readonly MESSAGE = MESSAGE;

  typologies: Typology[] = [];

  loading: boolean = false;

  selectedTypoligies: Typology[] = [];

  items: MenuItem[] = [];

  constructor(
    private basicTableService: BasicTablesService,
    private confirmationDialogService: ConfirmationDialogService,
    private router: Router,
    private cryptoService: CryptojsService
  ) {
  }

  ngOnInit() {
    this.getTypologies();
    this.intMenu();
  }

  intMenu() {
    this.items = [
      {label: 'Gestionar acciones', icon: 'pi pi-verified', command: (e) => this.editManageActions(e.item)},
      {label: 'Editar', icon: 'pi pi-pencil', command: (e) => this.editTypology(parseInt(e.item.id))},
      {label: 'Eliminar', icon: 'pi pi-trash', command: (e) => this.onDelete(parseInt(e.item.id))},
    ];
  }

  getTypologies() {
    this.loading = true;
    this.basicTableService.getTypoligies().pipe(
      finalize(() => {
        this.loading = false;
      })
    ).subscribe({
      next: (res) => {
        this.typologies = res;
      }
    })
  }

  deleteSelectedTypology() {
    let typologyIds: number[] = this.selectedTypoligies.map(item => item.id);
    this.confirmationDialogService.showDeleteConfirmationDialog(
      () => {
        this.basicTableService.deleteSelectedTypologies(typologyIds)
          .subscribe({
            next: () => {
              this.desmarkAll();
              for (let id of typologyIds) {
                this.filterTypology(id);
              }
            }
          });
      }
    )
  }

  editManageActions(typology: any) {
    this.router.navigate(['developer/basic-tables/typology-action'], {
      skipLocationChange: true,
      queryParams: {
        id: this.cryptoService.encryptParam(typology.value.id),
        nombre: this.cryptoService.encryptParam(typology.value.nombre),
        claseIcono: this.cryptoService.encryptParam(typology.value.claseIcono),
        nombreColor: this.cryptoService.encryptParam(typology.value.nombreColor),
        idTipologiaSiguiente: this.cryptoService.encryptParam(typology.value?.idTipologiaSiguiente),
        accionesLength: this.cryptoService.encryptParam(typology.value.acciones.length),
      },
    }).then();
  }

  editTypology(idTypology: number) {
    this.router.navigate(['developer/basic-tables/create-typology', this.cryptoService.encryptParam(idTypology)], {
      skipLocationChange: true,
    }).then();
  }

  filterTypology(idTypology: number) {
    this.typologies = this.typologies.filter((item) => item.id != idTypology);
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  desmarkAll() {
    this.selectedTypoligies = [];
  }

  openNew() {
    this.router.navigate(['developer/basic-tables/create-typology'], {
      skipLocationChange: true,
    }).then();
  }

  onDelete(idTypology: number) {
    this.confirmationDialogService.showDeleteConfirmationDialog(() => {
      this.basicTableService.deleteTypology(idTypology).subscribe(() => {
        this.filterTypology(idTypology);
      });
    });
  }
}
