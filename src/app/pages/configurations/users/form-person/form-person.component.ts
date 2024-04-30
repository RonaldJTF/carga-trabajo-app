import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonService } from 'src/app/services/person.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Person } from 'src/app/models/person';
import { DocumentTypeService } from 'src/app/services/documenttype.service';
import { DocumentType } from 'src/app/models/documenttype';
import { Location } from '@angular/common';
import { Gender } from 'src/app/models/gender';
import { GenderService } from 'src/app/services/gender.service';

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

  formData: FormData = new FormData();

  uploadedFiles: any[] = [];

  documentTypes: DocumentType[] = [];

  genders: Gender[] = [];

  creatingOrUpdating: boolean = false;

  updateMode: boolean = false;

  deleting: boolean = false;

  constructor(
    private readonly route: ActivatedRoute,
    private router: Router,
    private personService: PersonService,
    private formBuilder: FormBuilder,
    private documentTypeService: DocumentTypeService,
    private genderService: GenderService
  ) {}

  ngOnInit() {
    this.getDocumentTypes();
    this.getGenres();
    this.buildForm();

    this.route.params.subscribe((params) => {
      this.personId = params['id'];
    });

    if (this.personId != null) {
      this.updateMode = true;
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

  getGenres(): void {
    this.genderService.getDocumentType().subscribe({
      next: (item) => {
        this.genders = item;
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
      idTipoDocumento: [''],
      documento: ['', Validators.compose([Validators.required])],
      correo: [
        '',
        Validators.compose([
          Validators.email,
          Validators.required,
          Validators.maxLength(120),
        ]),
      ],
      telefono: ['', Validators.required],
      idGenero: [''],
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
    return this.isValido('idTipoDocumento');
  }

  get numeroDocumentoNoValido() {
    return this.isValido('documento');
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
        console.log(data);
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
    if (this.person && this.person.id) {
      this.update();
    } else {
      this.create();
    }
  }

  create(): void {
    this.formData.append('person', JSON.stringify(this.person));

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
        .update(this.personId, this.person)
        .subscribe((json) => {
          this.formPerson.reset();
          this.person = new Person();
          this.goBack();
        });
    }
  }

  goBack() {
    this.router.navigate(['configurations/users'], {
      skipLocationChange: true,
    });
  }

  updatePerson(id: number, payload: any): void {
    payload.srcFoto = ''
    this.personService.update(id, payload).subscribe({
      next: (e) => {
        this.goBack();
        this.creatingOrUpdating = false;
      },
      error: (error) => {
        this.creatingOrUpdating = false;
      },
    });
  }

  createPerson(payload: any): void {
    this.personService.create(payload).subscribe({
      next: (e) => {
        this.goBack();
        this.creatingOrUpdating = false;
      },
      error: (error) => {
        this.creatingOrUpdating = false;
      },
    });
  }

  onSubmitPerson(event: Event): void {
    event.preventDefault();
    this.formData.append('person', JSON.stringify({ ...this.person, ...this.formPerson.value }));
    console.log(this.formData.get('person'))
    if (this.formPerson.invalid) {
      this.formPerson.markAllAsTouched();
    } else {
      this.creatingOrUpdating = true;
      this.updateMode
        ? this.updatePerson(this.personId, this.formData)
        : this.createPerson(this.formData);
    }
  }

  onDeletePerson(event: Event): void {
    event.preventDefault();
    this.deleting = true;
    this.personService.delete(this.personId).subscribe({
      next: () => {
        this.goBack();
        this.deleting = false;
      },
      error: (error) => {
        this.deleting = false;
      },
    });
  }

  onCancelPerson(event: Event): void {
    event.preventDefault();
    this.updateMode = false;
    this.goBack();
  }

  onFileSelected(event: any): void {
    this.formData = new FormData();
    const file: File = event.files[0];
    this.formData.append('file', file);
  }

  onSelectFile(event: any) {
    this.uploadedFiles = [];
    for (const file of event.files) {
      this.uploadedFiles.push(file);
    }
  }

  onRemoveFile(event: any) {
    this.uploadedFiles = this.uploadedFiles.filter(
      (objeto) => objeto.name !== event.file.name
    );
  }
}
