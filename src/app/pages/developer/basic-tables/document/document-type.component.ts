import {Component, OnInit} from '@angular/core';
import {BasicTablesService, ConfirmationDialogService, CryptojsService} from "@services";
import {IMAGE_SIZE} from "@utils";
import {finalize} from "rxjs";
import {MESSAGE} from "@labels/labels";
import {Table} from "primeng/table";
import {Router} from "@angular/router";
import {MenuItem} from "primeng/api";
import {DocumentType} from "@models";

@Component({
  selector: 'app-document-type',
  templateUrl: './document-type.component.html',
  styleUrls: ['./document-type.component.scss']
})
export class DocumentTypeComponent implements OnInit {

  protected readonly IMAGE_SIZE = IMAGE_SIZE;

  protected readonly MESSAGE = MESSAGE;

  tipoDocumentos: DocumentType[] = [];

  loading: boolean = false;

  selectedDocumentsType: DocumentType[] = [];

  items: MenuItem[] = [];

  constructor(
    private basicTableService: BasicTablesService,
    private confirmationDialogService: ConfirmationDialogService,
    private router: Router,
    private cryptoService: CryptojsService
  ) {
  }

  ngOnInit() {
    this.getDocumentsType();
    this.intMenu();
  }

  // inicializa las opciones del menú contextual (componente de sakaing)
  intMenu() {
    this.items = [
      {label: 'Editar', icon: 'pi pi-pencil', command: (e) => this.editDocumentType(parseInt(e.item.id))},
      {label: 'Eliminar', icon: 'pi pi-trash', command: (e) => this.onDelete(parseInt(e.item.id))},
    ];
  }

  // Carga todos los tipos de documentos desde el servicio
  getDocumentsType() {
    this.loading = true;
    // regresa un observable, lo que significa que la llamada a la API es asíncrona.
    // el método no espera de manera síncrona el resultado, si no que se suscribe para
    // recibir los datos cuando estén disponibles.

    // el operador PIPE se utiliza para encadenar operadores que transforman o actúan
    // sobre el observable
    this.basicTableService.getDocumentsType().pipe(
      // se ejecuta una acción cuando el observable completa su ejecución
      finalize(() => {
        this.loading = false;
      })
      // inicia la ejecución del observable
    ).subscribe({
      // función a ejecutar cuando la solicitud es exitosa y se reciben datos de la API
      next: (res) => {
        // almacenar los datos recibidos. El array "res" es la respuesta de la API, 
        // contiene los tipos de documentos que se mostrarán en la UI.
        this.tipoDocumentos = res;
      }
    })
  }

  deleteSelectedDocumentType() {
    // extrae todos los ids de los docs seleccionados.
    let documentTypeIds: number[] = this.selectedDocumentsType.map(item => item.id);
    // antes de eliminar los docs muestra un diálogo de confirmación.
    this.confirmationDialogService.showDeleteConfirmationDialog(
      () => {
        // confirmada la eliminación se procede a realizarla
        this.basicTableService.deleteSelectedDocumentType(documentTypeIds)
        // se suscribe al observable que retorna la operación de eliminación.
          .subscribe({
            // una vez eliminado se procede a desmarcar los elementos seleccionados
            next: () => {
              this.desmarkAll();
              // bucle sobre el array para 
              for (let id of documentTypeIds) {
                this.filterDocumentType(id);
              }
            }
          });
      }
    )
  }

  editDocumentType(idDocumentType: number) {
    // al usar esta opción se redirige al formulario de crear (editar) documento
    this.router.navigate(['developer/basic-tables/create-document-type', this.cryptoService.encryptParam(idDocumentType)], {
      skipLocationChange: true,
    }).then();
  }

  // Se encarga de eliminar un tipo documento de la lista
  filterDocumentType(idDocumentType: number) {
    // crea una lista con los elementos que no coinciden con el ID proporcionado
    // filter recorre cada elemento del objeto. Excluye al elemento que tiene el mismo id.
    this.tipoDocumentos = this.tipoDocumentos.filter((item) => item.id != idDocumentType);
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  desmarkAll() {
    this.selectedDocumentsType = [];
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
