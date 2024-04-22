import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonService } from 'src/app/services/person.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Person } from 'src/app/models/person';
import { DocumentTypeService } from 'src/app/services/documenttype.service';
import { DocumentType } from 'src/app/models/documenttype';
import { Location } from '@angular/common';

@Component({
  selector: 'app-form-person',
  templateUrl: './form-person.component.html',
  styleUrls: ['./form-person.component.scss'],
})
export class FormPersonComponent implements OnInit {
  @Input() submitted: boolean;

  @Input() personDialog: boolean;

  person: Person = new Person();

  personCopy: Person = new Person();

  personId: number = null;

  loading = [false, false, false, false];

  formPerson!: FormGroup;

  documentTypes: DocumentType[] = [];

  constructor(
    private readonly route: ActivatedRoute,
    private router: Router,
    private personService: PersonService,
    private formBuilder: FormBuilder,
    private documentTypeService: DocumentTypeService
  ) {}

  ngOnInit() {
    
    this.getDocumentTypes();
    this.buildForm();

    this.route.params.subscribe((params) => {
      this.personId = params['id'];
    });

    if (this.personId != null) {
      this.getPerson(this.personId);
    }
  }

  getDocumentTypes(): void {
    this.documentTypeService.getDocumentType().subscribe({
      next: (item) => {
        this.documentTypes = item;
      },
      error: (err) => {
        console.log(err);
      },
    });
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
  
  compararTiposDocumentos(id1: number, id2: number): boolean {
    return id1 === id2;
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
    console.log(this.person);

    if (this.person && this.person.id) {
      this.update();
    } else {
      this.create();
    }
  }

  create(): void {
    if (this.formPerson.valid) {
      this.personService.create(this.person).subscribe((json) => {
        this.formPerson.reset();
        this.person = new Person();
        this.goBack();
      });
    }
  }

  update(): void {
    if (this.formPerson.valid) {
      this.personService
        .update(this.person.id, this.person)
        .subscribe((json) => {
          this.formPerson.reset();
          this.person = new Person();
          this.goBack();
        });
    }
  }

  goBack(){
    this.router.navigate(['configurations/users'], {
      skipLocationChange: true,
    });
  }
}
