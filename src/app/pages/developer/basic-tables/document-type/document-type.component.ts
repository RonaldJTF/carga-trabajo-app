import {Component, OnInit} from '@angular/core';
import {MenuItem} from "primeng/api";
import {IMAGE_SIZE} from "@utils";
import {MESSAGE} from "@labels/labels";
import {DocumentType} from "@models";
import {BasicTablesService, ConfirmationDialogService, CryptojsService} from "@services";
import {Router} from "@angular/router";
import {finalize} from "rxjs";
import {Table} from "primeng/table";

@Component({
  selector: 'app-document-type',
  templateUrl: './document-type.component.html',
  styleUrls: ['./document-type.component.scss']
})
export class DocumentTypeComponent implements OnInit {

  protected readonly IMAGE_SIZE = IMAGE_SIZE;

  protected readonly MESSAGE = MESSAGE;

  documentTypes: DocumentType[] = [];

  loading: boolean = false;

  selectedDocumentTipe: DocumentType[] = [];

  items: MenuItem[] = [];

  constructor(
    private basicTableService: BasicTablesService,
    private confirmationDialogService: ConfirmationDialogService,
    private router: Router,
    private cryptoService: CryptojsService
  ) {
  }

  ngOnInit() {
    this.getDocumentTypes();
    this.intMenu();
  }


  intMenu() {
    this.items = [
      {label: 'Editar', icon: 'pi pi-pencil', command: (e) => this.editDocumentType(parseInt(e.item.id))},
      {label: 'Eliminar', icon: 'pi pi-trash', command: (e) => this.onDelete(parseInt(e.item.id))},
    ];
  }

  getDocumentTypes() {
    this.loading = true;
    this.basicTableService.getDocumentTypes().pipe(
      finalize(() => {
        this.loading = false;
      })
    ).subscribe({
      next: (res) => {
        this.documentTypes = res;
      }
    })
  }

  deleteSelectedDocumentType() {
    let documentTypeIds: number[] = this.selectedDocumentTipe.map(item => item.id);
    this.confirmationDialogService.showDeleteConfirmationDialog(
      () => {
        this.basicTableService.deleteSelectedDocumentType(documentTypeIds)
          .subscribe({
            next: () => {
              this.desmarkAll();
              for (let id of documentTypeIds) {
                this.filterDocumentType(id);
              }
            }
          });
      }
    )
  }

  editDocumentType(idDocumentType: number) {
    this.router.navigate(['developer/basic-tables/create-document-type', this.cryptoService.encryptParam(idDocumentType)], {
      skipLocationChange: true,
    }).then();
  }

  filterDocumentType(idDocumentType: number) {
    this.documentTypes = this.documentTypes.filter((item) => item.id != idDocumentType);
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  desmarkAll() {
    this.selectedDocumentTipe = [];
  }

  openNew() {
    this.router.navigate(['developer/basic-tables/create-document-type'], {
      skipLocationChange: true,
    }).then();
  }

  onDelete(idDocumentType: number) {
    this.confirmationDialogService.showDeleteConfirmationDialog(() => {
      this.basicTableService.deleteDocumentType(idDocumentType).subscribe(() => {
        this.filterDocumentType(idDocumentType);
      });
    });
  }

}
