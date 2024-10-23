import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {finalize} from "rxjs";
import {BasicTablesService, ConfirmationDialogService, CryptojsService, UrlService} from "@services";
import { Periodicity } from '@models';


@Component({
  selector: 'app-form-periodicity',
  templateUrl: './form-periodicity.component.html',
  styleUrls: ['./form-periodicity.component.scss']
})
export class FormPeriodicityComponent implements OnInit {

  formPeriodicity: FormGroup;

  updateMode: boolean = false;

  creatingOrUpdating: boolean = false;

  deleting: boolean = false;

  idPeriodicity: number;

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
        this.idPeriodicity = this.cryptoService.decryptParamAsNumber(params['id']);
        this.updateMode = true;
        this.getPeriodicity(this.idPeriodicity);
      }
    });
  }


  getPeriodicity(idPeriodicity: number) {
    
    this.basicTablesService.getPeriodicity(idPeriodicity).subscribe({
      next: (result) => {
        this.assignValuesToForm(result);
      }
    })
  }

  buildForm() {
    this.formPeriodicity = this.formBuilder.group({
      nombre: ['', Validators.required],
      frecuenciaAnual: ['', Validators.required]
    });
  }

  assignValuesToForm(periodicity: Periodicity) {
    this.formPeriodicity.get('nombre').setValue(periodicity.nombre);
    this.formPeriodicity.get('frecuenciaAnual').setValue(periodicity.frecuenciaAnual);
  }

  private isValido(nombreAtributo: string) {
    return (
      this.formPeriodicity.get(nombreAtributo)?.invalid &&
      (this.formPeriodicity.get(nombreAtributo)?.dirty ||
        this.formPeriodicity.get(nombreAtributo)?.touched)
    );
  }

  get controls() {
    return this.formPeriodicity.controls;
  }

  get nombreNoValido() {
    return this.isValido('nombre');
  }

  get frecuenciaNoValido() {
    return this.isValido('frecuenciaAnual');
  }


  onSubmitPeriodicity(event: Event): void {
    event.preventDefault();
    if (this.formPeriodicity.valid) {
      this.creatingOrUpdating = true;
      this.updateMode ? this.updatePeriodicity(this.idPeriodicity, this.formPeriodicity.value) : this.createPeriodicity(this.formPeriodicity.value);
    } else {
      this.formPeriodicity.markAllAsTouched();
    }
  }

  updatePeriodicity(idPeriodicity: number, periodicity: Periodicity): void {
    let message = '¿Está seguro de actualizar el registro?';
    this.confirmationDialogService.showEventConfirmationDialog(
      message,
      () => {
        this.basicTablesService.updatePeriodicity(idPeriodicity, periodicity).pipe(
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

  createPeriodicity(periodicity: Periodicity): void {
    this.basicTablesService.createPeriodicity(periodicity).pipe(
      finalize(() => {
        this.creatingOrUpdating = false;
      })
    ).subscribe({
      next: () => {
        this.goBack();
      }
    })
  }

  onDeletePeriodicity(event: Event): void {
    event.preventDefault()
    this.deleting = true;
    this.basicTablesService.deletePeriodicity(this.idPeriodicity).pipe(
      finalize(() => {
        this.deleting = false;
      })
    ).subscribe({
      next: () => {
        this.goBack();
      }
    })
  }

  onCancelPeriodicity(event: Event) {
    event.preventDefault();
    this.goBack();
  }

  goBack() {
    this.urlService.goBack();
    this.formPeriodicity.reset();
  }

}
