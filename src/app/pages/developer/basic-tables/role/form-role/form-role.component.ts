import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {BasicTablesService} from "../../../../../services/basic-tables.service";
import {CryptojsService} from "../../../../../services/cryptojs.service";
import {finalize} from "rxjs";
import {UrlService} from "../../../../../services/url.service";
import {ConfirmationDialogService} from "../../../../../services/confirmation-dialog.service";
import {Role} from "../../../../../models/role";

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

  idRol: number;

  param: string;

  constructor(
    private router: Router,
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
      this.param = params['id'];
    });
    if (this.param != null) {
      this.idRol = this.cryptoService.decryptParamAsNumber(this.param);
      this.updateMode = true;
      this.getRole(this.idRol);
    }
  }

  getRole(idRol: number) {
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

  updateRole(idRol: number, rol: Role): void {
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
            this.urlService.goBack();
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
      next: (res) => {
        this.urlService.goBack();
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
        this.urlService.goBack();
      }
    })
  }

  onCancelRol(event: Event) {
    event.preventDefault();
    this.router.navigate(['developer/basic-tables/rol'], {
      skipLocationChange: true,
    }).then();
  }

}
