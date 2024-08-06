import {Component, OnInit} from '@angular/core';
import {IMAGE_SIZE} from "../../../../utils/constants";
import {MESSAGE} from "../../../../../labels/labels";
import {MenuItem} from "primeng/api";
import {BasicTablesService} from "../../../../services/basic-tables.service";
import {ConfirmationDialogService} from "../../../../services/confirmation-dialog.service";
import {Router} from "@angular/router";
import {CryptojsService} from "../../../../services/cryptojs.service";
import {Ftp} from "../../../../models/ftp";
import {finalize} from "rxjs";
import {Table} from "primeng/table";

@Component({
  selector: 'app-ftp',
  templateUrl: './ftp.component.html',
  styleUrls: ['./ftp.component.scss']
})
export class FtpComponent implements OnInit{

  protected readonly IMAGE_SIZE = IMAGE_SIZE;

  protected readonly MESSAGE = MESSAGE;

  ftps: Ftp[] = [];

  loading: boolean = false;

  selectedFtps: Ftp[] = [];

  items: MenuItem[] = [];

  constructor(
    private basicTableService: BasicTablesService,
    private confirmationDialogService: ConfirmationDialogService,
    private router: Router,
    private cryptoService: CryptojsService
  ) {
  }

  ngOnInit() {
    this.getFtps();
    this.intMenu();
  }

  intMenu() {
    this.items = [
      {label: 'Editar', icon: 'pi pi-pencil', command: (e) => this.editFtp(parseInt(e.item.id))},
      {label: 'Eliminar', icon: 'pi pi-trash', command: (e) => this.onDelete(parseInt(e.item.id))},
    ];
  }

  getFtps() {
    this.loading = true;
    this.basicTableService.getFtps().pipe(
      finalize(() => {
        this.loading = false;
      })
    ).subscribe({
      next: (res) => {
        this.ftps = res;
      }
    })
  }

  deleteSelectedFtps() {
    let ftpIds: number[] = this.selectedFtps.map(item => item.id);
    this.confirmationDialogService.showDeleteConfirmationDialog(
      () => {
        this.basicTableService.deleteSelectedFtps(ftpIds)
          .subscribe({
            next: () => {
              this.desmarkAll();
              for (let id of ftpIds) {
                this.filterFtp(id);
              }
            }
          });
      }
    )
  }

  editFtp(idFtp: number) {
    this.router.navigate(['developer/basic-tables/create-ftp', this.cryptoService.encryptParam(idFtp)], {
      skipLocationChange: true,
    }).then();
  }

  filterFtp(idFtp: number) {
    this.ftps = this.ftps.filter((item) => item.id != idFtp);
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  desmarkAll() {
    this.selectedFtps = [];
  }

  openNew() {
    this.router.navigate(['developer/basic-tables/create-ftp'], {
      skipLocationChange: true,
    }).then();
  }

  onDelete(idLevel: number) {
    this.confirmationDialogService.showDeleteConfirmationDialog(() => {
      this.basicTableService.deleteFtp(idLevel).subscribe(() => {
        this.filterFtp(idLevel);
      });
    });
  }

}
