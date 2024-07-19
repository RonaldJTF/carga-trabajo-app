import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {BasicTablesService} from "../../../../../services/basic-tables.service";
import {CryptojsService} from "../../../../../services/cryptojs.service";
import {UrlService} from "../../../../../services/url.service";
import {ConfirmationDialogService} from "../../../../../services/confirmation-dialog.service";
import {Gender} from "../../../../../models/gender";
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

  idGender: number;

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

  buildForm() {
    this.formGender = this.formBuilder.group({
      nombre: ['', Validators.required]
    });
  }

  getInitialValue() {
    this.route.params.subscribe((params) => {
      this.param = params['id'];
    });
    if (this.param != null) {
      this.idGender = this.cryptoService.decryptParamAsNumber(this.param);
      this.updateMode = true;
      this.getGender(this.idGender);
    }
  }

  getGender(idGender: number) {
    this.basicTablesService.getGender(idGender).subscribe({
      next: (result) => {
        this.assignValuesToForm(result);
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

  updateGender(idGender: number, gender: Gender): void {
    let message = '¿Está seguro de actulizar el registro?';
    this.confirmationDialogService.showEventConfirmationDialog(message, () => {
      console.log("Actualizando...")
      this.basicTablesService.updateGender(idGender, gender).pipe(
        finalize(() => {
          this.creatingOrUpdating = false;
          this.urlService.goBack();
        })
      ).subscribe({
        next: (res) => {
          console.log(res);
        }
      })
    })
  }

  createGender(gender: Gender): void {
    console.log("Creando...")
    this.basicTablesService.createGender(gender).pipe(
      finalize(() => {
        this.creatingOrUpdating = false;
      })
    ).subscribe({
      next: () => {
        this.urlService.goBack();
      }
    })
  }

  onDeleteRol(event: Event): void {
    event.preventDefault()
    console.log("Eliminando...", this.idGender)
    this.deleting = true;
    this.basicTablesService.deleteGender(this.idGender).pipe(
      finalize(() => {
        this.deleting = false;
      })
    ).subscribe({
      next: (res) => {
        console.log(res);
        this.urlService.goBack();
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  onCancelRol(event: Event) {
    event.preventDefault();
    this.router.navigate(['developer/basic-tables/gender'], {
      skipLocationChange: true,
    }).then();
  }

}
