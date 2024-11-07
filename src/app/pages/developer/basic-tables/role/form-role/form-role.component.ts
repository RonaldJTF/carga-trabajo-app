import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {finalize} from "rxjs";
import {BasicTablesService, ConfirmationDialogService, CryptojsService, UrlService} from "@services";
import {Role} from "@models";

@Component({
  selector: 'app-form-rol',
  templateUrl: './form-role.component.html',
  styleUrls: ['./form-role.component.scss']
})
export class FormRoleComponent implements OnInit {

  formRol: FormGroup;

  updateMode: boolean = false;

  creatingOrUpdating: boolean = false;

  deleting: boolean = false;

  idRol: string;

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
        this.idRol = params['id'];
        this.updateMode = true;
        this.getRole(this.idRol);
      }
    });
  }

  getRole(idRol: string) {
    this.basicTablesService.getRole(idRol).subscribe({
      next: (result) => {
        this.assignValuesToForm(result);
      }
    })
  }

  buildForm() {
    this.formRol = this.formBuilder.group({
      nombre: ['', Validators.required],
      codigo: ['', Validators.required]
    });
  }

  assignValuesToForm(rol: Role) {
    this.formRol.get('nombre').setValue(rol.nombre);
    this.formRol.get('codigo').setValue(rol.codigo);
  }

  private isValido(nombreAtributo: string) {
    return (
      this.formRol.get(nombreAtributo)?.invalid &&
      (this.formRol.get(nombreAtributo)?.dirty ||
        this.formRol.get(nombreAtributo)?.touched)
    );
  }

  get controls() {
    return this.formRol.controls;
  }

  get nombreNoValido() {
    return this.isValido('nombre');
  }

  get codigoNoValido() {
    return this.isValido('codigo');
  }

  onSubmitRol(event: Event): void {
    event.preventDefault();
    if (this.formRol.valid) {
      this.creatingOrUpdating = true;
      this.updateMode ? this.updateRole(this.idRol, this.formRol.value) : this.createRole(this.formRol.value);
    } else {
      this.formRol.markAllAsTouched();
    }
  }

  updateRole(idRol: string, rol: Role): void {
    let message = '¿Está seguro de actualizar el registro?';
    this.confirmationDialogService.showEventConfirmationDialog(
      message,
      () => {
        this.basicTablesService.updateRole(idRol, rol).pipe(
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

  createRole(rol: Role): void {
    this.basicTablesService.createRole(rol).pipe(
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
    this.basicTablesService.deleteRole(this.idRol).pipe(
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
    this.formRol.reset();
  }

}
