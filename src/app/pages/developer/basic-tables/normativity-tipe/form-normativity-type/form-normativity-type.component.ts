import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {finalize} from "rxjs";
import {BasicTablesService, ConfirmationDialogService, CryptojsService, UrlService} from "@services";
import {NormativityType} from "@models";

@Component({
  selector: 'app-form-normativity-type',
  templateUrl: './form-normativity-type.component.html',
  styleUrls: ['./form-normativity-type.component.scss']
})
export class FormNormativityTypeComponent implements OnInit {

  formNormativityType: FormGroup;

  updateMode: boolean = false;

  creatingOrUpdating: boolean = false;

  deleting: boolean = false;

  idNormativityType: number;

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
        this.idNormativityType = this.cryptoService.decryptParamAsNumber(params['id']);
        this.updateMode = true;
        this.getNormativityType(this.idNormativityType);
      }
    });
  }


  getNormativityType(idNormativityType: number) {
    
    this.basicTablesService.getNormativityType(idNormativityType).subscribe({
      next: (result) => {
        this.assignValuesToForm(result);
      }
    })
  }

  buildForm() {
    this.formNormativityType = this.formBuilder.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required]
    });
  }

  assignValuesToForm(normativityType: NormativityType) {
    this.formNormativityType.get('nombre').setValue(normativityType.nombre);
    this.formNormativityType.get('descripcion').setValue(normativityType.descripcion);
  }

  private isValido(nombreAtributo: string) {
    return (
      this.formNormativityType.get(nombreAtributo)?.invalid &&
      (this.formNormativityType.get(nombreAtributo)?.dirty ||
        this.formNormativityType.get(nombreAtributo)?.touched)
    );
  }

  get controls() {
    return this.formNormativityType.controls;
  }

  get nombreNoValido() {
    return this.isValido('nombre');
  }

  get descripcionNoValido() {
    return this.isValido('descripcion');
  }

  onSubmitNormativityType(event: Event): void {
    event.preventDefault();
    if (this.formNormativityType.valid) {
      this.creatingOrUpdating = true;
      this.updateMode ? this.updateNormativityType(this.idNormativityType, this.formNormativityType.value) : this.createNormativityType(this.formNormativityType.value);
    } else {
      this.formNormativityType.markAllAsTouched();
    }
  }

  updateNormativityType(idNormativityType: number, normativityType: NormativityType): void {
    let message = '¿Está seguro de actualizar el registro?';
    this.confirmationDialogService.showEventConfirmationDialog(
      message,
      () => {
        this.basicTablesService.updateNormativityType(idNormativityType, normativityType).pipe(
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

  createNormativityType(normativityType: NormativityType): void {
    this.basicTablesService.createNormativityType(normativityType).pipe(
      finalize(() => {
        this.creatingOrUpdating = false;
      })
    ).subscribe({
      next: () => {
        this.goBack();
      }
    })
  }

  onDeleteNormativityType(event: Event): void {
    event.preventDefault()
    this.deleting = true;
    this.basicTablesService.deleteNormativityType(this.idNormativityType).pipe(
      finalize(() => {
        this.deleting = false;
      })
    ).subscribe({
      next: () => {
        this.goBack();
      }
    })
  }

  onCancelNormativityType(event: Event) {
    event.preventDefault();
    this.goBack();
  }

  goBack() {
    this.urlService.goBack();
    this.formNormativityType.reset();
  }

}
