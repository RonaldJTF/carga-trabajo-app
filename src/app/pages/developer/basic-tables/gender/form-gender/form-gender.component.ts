import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {BasicTablesService, ConfirmationDialogService, CryptojsService, UrlService} from "@services";
import {Gender} from "@models";
import {finalize} from "rxjs";

@Component({
  selector: 'app-form-gender',
  templateUrl: './form-gender.component.html',
  styleUrls: ['./form-gender.component.scss']
})
export class FormGenderComponent implements OnInit {

  formGender: FormGroup;

  updateMode: boolean = false;

  creatingOrUpdating: boolean = false;

  deleting: boolean = false;

  idGender: string;

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

  buildForm() {
    this.formGender = this.formBuilder.group({
      nombre: ['', Validators.required]
    });
  }

  getInitialValue() {
    this.route.params.subscribe((params) => {
      if (params['id'] != null) {
        this.idGender = params['id'];
        this.updateMode = true;
        this.getGender(this.idGender);
      }
    });
  }

  getGender(idGender: string) {
    this.basicTablesService.getGender(idGender).subscribe({
      next: (result) => {
        this.assignValuesToForm(JSON.parse(this.cryptoService.decryptParamAsString(result)));
      }
    })
  }

  assignValuesToForm(gender: Gender) {
    this.formGender.get('nombre').setValue(gender.nombre);
  }

  private isValido(nombreAtributo: string) {
    return (
      this.formGender.get(nombreAtributo)?.invalid &&
      (this.formGender.get(nombreAtributo)?.dirty ||
        this.formGender.get(nombreAtributo)?.touched)
    );
  }

  get controls() {
    return this.formGender.controls;
  }

  get nombreNoValido() {
    return this.isValido('nombre');
  }

  onSubmitGender(event: Event): void {
    event.preventDefault();
    if (this.formGender.valid) {
      this.creatingOrUpdating = true;
      this.updateMode ? this.updateGender(this.idGender, this.formGender.value) : this.createGender(this.formGender.value);
    } else {
      this.formGender.markAllAsTouched();
    }
  }

  updateGender(idGender: string, gender: Gender): void {
    let message = '¿Está seguro de actualizar el registro?';
    this.confirmationDialogService.showEventConfirmationDialog(
      message,
      () => {
        this.basicTablesService.updateGender(idGender, gender).pipe(
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

  createGender(gender: Gender): void {
    this.basicTablesService.createGender(gender).pipe(
      finalize(() => {
        this.creatingOrUpdating = false;
      })
    ).subscribe({
      next: () => {
        this.goBack();
      }
    })
  }

  onDeleteRol(event: Event): void {
    event.preventDefault()
    this.deleting = true;
    this.basicTablesService.deleteGender(this.idGender).pipe(
      finalize(() => {
        this.deleting = false;
      })
    ).subscribe({
      next: () => {
        this.goBack();
      }
    })
  }

  onCancelRol(event: Event) {
    event.preventDefault();
    this.goBack();
  }

  goBack() {
    this.urlService.goBack();
    this.formGender.reset();
  }

}
