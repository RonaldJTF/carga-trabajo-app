import {Component, OnInit} from '@angular/core';
import {DynamicDialogRef} from "primeng/dynamicdialog";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import * as Sentry from '@sentry/angular'
import {ToastService} from "@services";

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  formCommentsSentry: FormGroup;

  creatingOrUpdating: boolean = false;

  constructor(
    private ref: DynamicDialogRef,
    private formBuilder: FormBuilder,
    private toastService: ToastService
  ) {
  }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.formCommentsSentry = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  private isValido(nombreAtributo: string) {
    return (
      this.formCommentsSentry.get(nombreAtributo)?.invalid &&
      (this.formCommentsSentry.get(nombreAtributo)?.dirty ||
        this.formCommentsSentry.get(nombreAtributo)?.touched)
    );
  }

  get controls() {
    return this.formCommentsSentry.controls;
  }

  get nameNoValido(): boolean {
    return this.isValido('name');
  }

  get emailNoValido(): boolean {
    return this.isValido('email');
  }

  get commentsNoValido(): boolean {
    return this.isValido('message');
  }

  hideDialog(): void {
    this.ref.close();
  }

  sendComments(): void {
    Sentry.sendFeedback(this.formCommentsSentry.value)
      .then(event => {
        event && this.toastService.showSuccess("Reporte enviado", "Gracias por ayudarnos a mejorar")
      });
    this.ref.close();
  }

}
