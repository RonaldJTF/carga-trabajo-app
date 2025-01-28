import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {BasicTablesService, ConfirmationDialogService, CryptojsService, UrlService} from "@services";
import {ActivatedRoute} from "@angular/router";
import {JobTitle} from "@models";
import {finalize} from "rxjs";

@Component({
  selector: 'app-form-job-title',
  templateUrl: './form-job-title.component.html',
  styleUrls: ['./form-job-title.component.scss']
})
export class FormJobTitleComponent implements OnInit {
  formJobTitle: FormGroup;

  updateMode: boolean = false;

  creatingOrUpdating: boolean = false;

  deleting: boolean = false;

  jobTitleId: number;

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
        this.jobTitleId = this.cryptoService.decryptParamAsNumber(params['id']);
        this.updateMode = true;
        this.getJobTitle(this.jobTitleId);
      }
    });
  }

  getJobTitle(jobTitleId: number) {
    this.basicTablesService.getJobTitle(jobTitleId).subscribe({
      next: (result) => {
        this.assignValuesToForm(result);
      }
    })
  }

  buildForm() {
    this.formJobTitle = this.formBuilder.group({
      nombre: ['', Validators.required],
      descripcion: ['']
    });
  }

  assignValuesToForm(jobTitle: JobTitle) {
    this.formJobTitle.get('nombre').setValue(jobTitle.nombre);
    this.formJobTitle.get('descripcion').setValue(jobTitle.descripcion);
  }

  private isValido(field: string) {
    return (this.formJobTitle.get(field)?.invalid && (this.formJobTitle.get(field)?.dirty || this.formJobTitle.get(field)?.touched));
  }

  controls(field: string) {
    return this.formJobTitle.controls[field].errors?.['required'];
  }

  invalidField(field: string) {
    return this.isValido(field);
  }

  onSubmitScope(event: Event): void {
    event.preventDefault();
    if (this.formJobTitle.valid) {
      this.creatingOrUpdating = true;
      this.updateMode ? this.updateJobTitle(this.jobTitleId, this.formJobTitle.value) : this.createJobTitle(this.formJobTitle.value);
    } else {
      this.formJobTitle.markAllAsTouched();
    }
  }

  updateJobTitle(jobTitleId: number, jobTitle: JobTitle): void {
    let message = '¿Está seguro de actualizar el registro?';
    this.confirmationDialogService.showEventConfirmationDialog(
      message,
      () => {
        this.basicTablesService.updateJobTitle(jobTitleId, jobTitle).pipe(
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

  createJobTitle(jobTitle: JobTitle): void {
    this.basicTablesService.createJobTitle(jobTitle).pipe(
      finalize(() => {
        this.creatingOrUpdating = false;
      })
    ).subscribe({
      next: () => {
        this.goBack();
      }
    })
  }

  onDeleteJobTitle(event: Event): void {
    event.preventDefault()
    this.deleting = true;
    this.basicTablesService.deleteJobTitle(this.jobTitleId).pipe(
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
    this.formJobTitle.reset();
  }
}
