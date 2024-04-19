import { Component, Input, OnInit } from '@angular/core';
import { Person } from '../../../../models/person';
import { ActivatedRoute } from '@angular/router';
import { PersonService } from 'src/app/services/person.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-form-person',
  templateUrl: './form-person.component.html',
  styleUrls: ['./form-person.component.scss'],
})
export class FormPersonComponent implements OnInit {
  @Input() submitted: boolean;

  @Input() personDialog: boolean;

  statuses: any[] = [];

  person: Person = new Person();

  personCopy: Person = new Person();

  personId: number = null;

  loading = [false, false, false, false];

  formPerson!: FormGroup;

  constructor(
    private readonly route: ActivatedRoute,
    private personService: PersonService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.buildForm();

    this.statuses = [
      { label: 'Pasaporte', value: 3 },
      { label: 'Cedula de Ciudadania', value: 1 },
      { label: 'Tarjeta de Indentidad', value: 2 },
    ];
    this.route.params.subscribe((params) => {
      this.personId = params['id'];
    });

    if (this.personId != null) {
      this.getPerson(this.personId);
    }
  }

  buildForm() {
    this.formPerson = this.formBuilder.group({
      primerNombre: ['', Validators.compose([Validators.required])],
      segundoNombre: [''],
      primerApellido: ['', Validators.compose([Validators.required])],
      segundoApellido: [''],
      tipoDocumento: ['', Validators.compose([Validators.required])],
      numeroDocumento: ['', Validators.compose([Validators.required])],
      correo: [
        '',
        Validators.compose([
          Validators.email,
          Validators.required,
          Validators.maxLength(120),
        ]),
      ],
      telefono: [''],
    });
  }

  private isValido(nombreAtributo: string) {
    return (
      this.formPerson.get(nombreAtributo)?.invalid &&
      (this.formPerson.get(nombreAtributo)?.dirty ||
        this.formPerson.get(nombreAtributo)?.touched)
    );
  }

  get controls() {
    return this.formPerson.controls;
  }

  get nombrePrimeroNoValido() {
    return this.isValido('primerNombre');
  }

  get nombreSegundoNoValido() {
    return this.isValido('segundoNombre');
  }

  get apellidoPrimeroNoValido() {
    return this.isValido('primerApellido');
  }

  get apellidoSegundoNoValido() {
    return this.isValido('segundoApellido');
  }

  get tipoDocumentoNoValido() {
    return this.isValido('tipoDocumento');
  }

  get numeroDocumentoNoValido() {
    return this.isValido('numeroDocumento');
  }

  get correoNoValido() {
    return this.isValido('correo');
  }

  get telefonoNoValido() {
    return this.isValido('telefono');
  }

  getPerson(personId: number) {
    this.personService.getPerson(personId).subscribe({
      next: (data) => {
        this.person = data;
        this.personCopy = this.person;
      },
      error: (err) => {
        console.log(err.error);
      },
    });
  }

  hideDialog() {
    this.personDialog = false;
    this.submitted = false;
  }

  savePerson() {
   // this.submitted = true;
    console.log(this.person);
  }
}
