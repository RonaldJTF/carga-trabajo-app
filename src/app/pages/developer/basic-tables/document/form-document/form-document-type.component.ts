import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {finalize} from "rxjs";
import {BasicTablesService, ConfirmationDialogService, CryptojsService, UrlService} from "@services";
import {DocumentType} from "@models";

@Component({
  selector: 'app-form-document-type',
  templateUrl: './form-document-type.component.html',
  styleUrls: ['./form-document-type.component.scss']
})
export class FormDocumentTypeComponent implements OnInit {

  formDocumentType: FormGroup;

  updateMode: boolean = false;

  creatingOrUpdating: boolean = false;

  deleting: boolean = false;

  idDocumentType: number;

  constructor(
    private formBuilder: FormBuilder,
    private basicTablesService: BasicTablesService,
    private route: ActivatedRoute,
    private cryptoService: CryptojsService,
    private urlService: UrlService,
    private confirmationDialogService: ConfirmationDialogService,
  ) {
  }


  ngOnInit() {
    this.buildForm();
    this.getInitialValue();
  }


  getInitialValue() {
    this.route.params.subscribe((params) => {
      if (params['id'] != null) {
        this.idDocumentType = params['id'];
        this.updateMode = true;
        this.getDocumentType(this.idDocumentType);
      }
    });
  }


  getDocumentType(idDocumentType: number) {
    this.basicTablesService.getDocumentType(idDocumentType).subscribe({
      next: (result) => {
        this.assignValuesToForm(result);
      }
    })
  }

  buildForm() {
    this.formDocumentType = this.formBuilder.group({
      descripcion: ['', Validators.required],
      abreviatura: ['', Validators.required]
    });
  }

  assignValuesToForm(documentType: DocumentType) {
    this.formDocumentType.get('descripcion').setValue(documentType.descripcion);
    this.formDocumentType.get('abreviatura').setValue(documentType.abreviatura);
  }

  private isValido(nombreAtributo: string) {
    return (
      this.formDocumentType.get(nombreAtributo)?.invalid &&
      (this.formDocumentType.get(nombreAtributo)?.dirty ||
        this.formDocumentType.get(nombreAtributo)?.touched)
    );
  }

  get controls() {
    return this.formDocumentType.controls;
  }

  get descripcionNoValido() {
    return this.isValido('descripcion');
  }

  get abreviaturaNoValido() {
    return this.isValido('abreviatura');
  }

  onSubmitDocumentType(event: Event): void {
    event.preventDefault();
    if (this.formDocumentType.valid) {
      this.creatingOrUpdating = true;
      this.updateMode ? this.updateDocumentType(this.idDocumentType, this.formDocumentType.value) : this.createDocumentType(this.formDocumentType.value);
    } else {
      this.formDocumentType.markAllAsTouched();
    }
  }

  updateDocumentType(idDocumentType: number, documentType: DocumentType): void {
    let message = '¿Está seguro de actualizar el registro?';
    this.confirmationDialogService.showEventConfirmationDialog(
      message,
      () => {
        this.basicTablesService.updateDocumentType(idDocumentType, documentType).pipe(
          finalize(() => {
            this.creatingOrUpdating = false;
          })
        ).subscribe({
          next: () => {
            this.goBack();
          }
        })
      },
      () => {
        this.creatingOrUpdating = false;
      }
    )
  }

  createDocumentType(documentType: DocumentType): void {
    this.basicTablesService.createDocumentType(documentType).pipe(
      finalize(() => {
        this.creatingOrUpdating = false;
      })
    ).subscribe({
      next: () => {
        this.goBack();
      }
    })
  }

  onDeleteDocumentType(event: Event): void {
    event.preventDefault()
    this.deleting = true;
    this.basicTablesService.deleteDocumentType(this.idDocumentType).pipe(
      finalize(() => {
        this.deleting = false;
      })
    ).subscribe({
      next: () => {
        this.goBack();
      }
    })
  }

  onCancelDocumentType(event: Event) {
    event.preventDefault();
    this.goBack();
  }

  goBack() {
    this.urlService.goBack();
    this.formDocumentType.reset();
  }

}
