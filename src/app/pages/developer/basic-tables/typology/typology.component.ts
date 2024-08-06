import {Component, OnInit} from '@angular/core';
import {MenuItem} from "primeng/api";
import {BasicTablesService} from "../../../../services/basic-tables.service";
import {ConfirmationDialogService} from "../../../../services/confirmation-dialog.service";
import {Router} from "@angular/router";
import {CryptojsService} from "../../../../services/cryptojs.service";
import {IMAGE_SIZE} from "../../../../utils/constants";
import {MESSAGE} from "../../../../../labels/labels";
import {Typology} from "../../../../models/typology";
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
    this.router.navigate(['developer/basic-tables/typology-action'/*, this.cryptoService.encryptParam(typology.id)*/], {
      skipLocationChange: true,
      queryParams: {
        id: typology.value.id,
        nombre: typology.value.nombre,
        claseIcono: typology.value.claseIcono,
        nombreColor: typology.value.nombreColor,
        idTipologiaSiguiente: typology.value?.idTipologiaSiguiente,
        accionesLength: typology.value.acciones.length,
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
