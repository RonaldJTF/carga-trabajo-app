import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-form-workplan',
  templateUrl: './form-workplan.component.html',
  styleUrls: ['./form-workplan.component.scss']
})
export class FormWorkplanComponent implements OnInit {

  @Input() idObject: number;
  @Input() updateMode: boolean;
  @Input() deleting: boolean = false;
  @Input() creatingOrUpdating: boolean = false;
  @Input() object: any;
  @Input() stage: boolean = false;

  @Output() notifyCancelar = new EventEmitter();
  @Output() notifyDelete = new EventEmitter();
  @Output() notifyCreate = new EventEmitter();
  @Output() notifyUpdate = new EventEmitter();

  form: FormGroup;

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.buildForm();
    if (this.object) {
      this.assignValuesToForm(this.object);
    }
  }

  buildForm() {
    this.form = this.formBuilder.group({
      id: null,
      nombre: ['', Validators.required],
      descripcion: ''
    })
  }

  private isValido(nombreAtributo: string) {
    return (
      this.form.get(nombreAtributo)?.invalid &&
      (this.form.get(nombreAtributo)?.dirty ||
        this.form.get(nombreAtributo)?.touched)
    );
  }

  get controls() {
    return this.form.controls;
  }

  get nombreNoValido() {
    return this.isValido('nombre');
  }

  get descripcionNoValido() {
    return this.isValido('descripcion');
  }

  assignValuesToForm(object: any) {
    object.id ? this.form.get('id').setValue(object.id) : null;
    object.nombre ? this.form.get('nombre').setValue(object.nombre) : null;
    object.descripcion ? this.form.get('descripcion').setValue(object.descripcion) : null;
    object.idPlanTrabajo && this.stage ? this.addAttribute(object) : null;
  }

  addAttribute(object: any) {
    this.form = this.formBuilder.group({
      idPantarbajo: new FormControl(object.idPantarbajo, Validators.required),
      idPadre: new FormControl(object.idPadre, Validators.required)
    })
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    if (this.form.invalid) {
      this.form.markAllAsTouched();
    } else {
      this.updateMode && this.idObject ? this.update(this.idObject) : this.create();
    }
  }

  update(id: number): void {
    if (this.form.invalid && id !== null) {
      this.form.markAllAsTouched();
    } else {
      this.notifyUpdate.emit(this.form.value);
    }
  }

  create(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
    } else {
      this.notifyCreate.emit(this.form.value);
    }
  }

  onDelete(event: Event): void {
    event.preventDefault();
    this.deleting = true;
    this.notifyDelete.emit(this.object);
  }

  onCancel(event: Event): void {
    event.preventDefault();
    this.notifyCancelar.emit(true);
  }

}
