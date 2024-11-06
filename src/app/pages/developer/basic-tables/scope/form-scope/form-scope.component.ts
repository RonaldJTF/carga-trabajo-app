import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {finalize} from "rxjs";
import {BasicTablesService, ConfirmationDialogService, CryptojsService, UrlService} from "@services";
import { Scope } from '@models';


@Component({
  selector: 'app-form-scope',
  templateUrl: './form-scope.component.html',
  styleUrls: ['./form-scope.component.scss']
})
export class FormScopeComponent implements OnInit {

  formScope: FormGroup;

  updateMode: boolean = false;

  creatingOrUpdating: boolean = false;

  deleting: boolean = false;

  idScope: number;

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
        this.idScope = this.cryptoService.decryptParamAsNumber(params['id']);
        this.updateMode = true;
        this.getScope(this.idScope);
      }
    });
  }


  getScope(idScope: number) {

    this.basicTablesService.getScope(idScope).subscribe({
      next: (result) => {
        this.assignValuesToForm(result);
      }
    })
  }

  buildForm() {
    this.formScope = this.formBuilder.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required]
    });
  }

  assignValuesToForm(scope: Scope) {
    this.formScope.get('nombre').setValue(scope.nombre);
    this.formScope.get('descripcion').setValue(scope.descripcion);
  }

  private isValido(nombreAtributo: string) {
    return (
      this.formScope.get(nombreAtributo)?.invalid &&
      (this.formScope.get(nombreAtributo)?.dirty ||
        this.formScope.get(nombreAtributo)?.touched)
    );
  }

  get controls() {
    return this.formScope.controls;
  }

  get nombreNoValido() {
    return this.isValido('nombre');
  }

  get descripcionNoValido() {
    return this.isValido('descripcion');
  }


  onSubmitScope(event: Event): void {
    event.preventDefault();
    if (this.formScope.valid) {
      this.creatingOrUpdating = true;
      this.updateMode ? this.updateScope(this.idScope, this.formScope.value) : this.createScope(this.formScope.value);
    } else {
      this.formScope.markAllAsTouched();
    }
  }

  updateScope(idScope: number, scope: Scope): void {
    let message = '¿Está seguro de actualizar el registro?';
    this.confirmationDialogService.showEventConfirmationDialog(
      message,
      () => {
        this.basicTablesService.updateScope(idScope, scope).pipe(
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

  createScope(scope: Scope): void {
    this.basicTablesService.createScope(scope).pipe(
      finalize(() => {
        this.creatingOrUpdating = false;
      })
    ).subscribe({
      next: () => {
        this.goBack();
      }
    })
  }

  onDeleteScope(event: Event): void {
    event.preventDefault()
    this.deleting = true;
    this.basicTablesService.deleteScope(this.idScope).pipe(
      finalize(() => {
        this.deleting = false;
      })
    ).subscribe({
      next: () => {
        this.goBack();
      }
    })
  }

  onCancelScope(event: Event) {
    event.preventDefault();
    this.goBack();
  }

  goBack() {
    this.urlService.goBack();
    this.formScope.reset();
  }

}
