import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {BasicTablesService, ConfirmationDialogService, CryptojsService, UrlService} from "@services";
import {Ftp} from "@models";
import {finalize} from "rxjs";

@Component({
  selector: 'app-form-ftp',
  templateUrl: './form-ftp.component.html',
  styleUrls: ['./form-ftp.component.scss']
})
export class FormFtpComponent implements OnInit {

  formFtp: FormGroup;

  updateMode: boolean = false;

  creatingOrUpdating: boolean = false;

  deleting: boolean = false;

  idFtp: number;

  ftp: Ftp = new Ftp();

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
    this.formFtp = this.formBuilder.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      codigo: ['', Validators.required],
      activo: [false, Validators.required]
    });
  }

  getInitialValue() {
    this.route.params.subscribe((params) => {
      if (params['id'] != null) {
        this.idFtp = this.cryptoService.decryptParamAsNumber(params['id']);
        this.updateMode = true;
        this.getFtp(this.idFtp);
      }
    });
  }

  getFtp(idFtp: number) {
    this.basicTablesService.getFtp(idFtp).subscribe({
      next: (result) => {
        this.assignValuesToForm(result);
      }
    })
  }

  assignValuesToForm(ftp: Ftp) {
    this.formFtp.get('nombre').setValue(ftp.nombre);
    this.formFtp.get('descripcion').setValue(ftp.descripcion);
    this.formFtp.get('codigo').setValue(ftp.codigo);
    this.formFtp.get('activo').setValue(ftp.activo === '1');
  }

  private isValido(nombreAtributo: string) {
    return (
      this.formFtp.get(nombreAtributo)?.invalid &&
      (this.formFtp.get(nombreAtributo)?.dirty ||
        this.formFtp.get(nombreAtributo)?.touched)
    );
  }

  get controls() {
    return this.formFtp.controls;
  }

  get nombreNoValido() {
    return this.isValido('nombre');
  }

  get descripcionNoValido() {
    return this.isValido('descripcion');
  }

  onSubmitFtp(event: Event): void {
    event.preventDefault();
    if (this.formFtp.valid) {
      this.creatingOrUpdating = true;
      const payload = this.buildRequest(this.formFtp.value);
      this.updateMode ? this.updateFtp(this.idFtp, payload) : this.createFtp(payload);
    } else {
      this.formFtp.markAllAsTouched();
    }
  }

  buildRequest(form: any): Ftp {
    this.ftp = form;
    this.ftp.activo = form.activo ? '1' : '0';
    return this.ftp;
  }

  updateFtp(idFtp: number, ftp: Ftp): void {
    let message = '¿Está seguro de actualizar el registro?';
    this.confirmationDialogService.showEventConfirmationDialog(
      message,
      () => {
        this.basicTablesService.updateFtp(idFtp, ftp).pipe(
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

  createFtp(ftp: Ftp): void {
    this.basicTablesService.createFtp(ftp).pipe(
      finalize(() => {
        this.creatingOrUpdating = false;
      })
    ).subscribe({
      next: () => {
        this.goBack();
      }
    })
  }

  onDeleteFtp(event: Event): void {
    event.preventDefault();
    this.deleting = true;
    this.basicTablesService.deleteFtp(this.idFtp).pipe(
      finalize(() => {
        this.deleting = false;
      })
    ).subscribe({
      next: () => {
        this.goBack();
      }
    })
  }

  onCancelFtp(event: Event) {
    event.preventDefault();
    this.goBack();
  }

  goBack() {
    this.urlService.goBack();
    this.formFtp.reset();
  }
}
