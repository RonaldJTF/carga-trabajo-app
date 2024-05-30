import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PersonService} from 'src/app/services/person.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Person} from 'src/app/models/person';
import {DocumentTypeService} from 'src/app/services/documenttype.service';
import {DocumentType} from 'src/app/models/documenttype';
import {Gender} from 'src/app/models/gender';
import {GenderService} from 'src/app/services/gender.service';
import {MESSAGE} from "../../../../../labels/labels";

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

  formPerson!: FormGroup;

  formData: FormData = new FormData();

  loadFile: boolean = false;

  documentTypes: DocumentType[] = [];

  genders: Gender[] = [];

  creatingOrUpdating: boolean = false;

  updateMode: boolean = false;

  deleting: boolean = false;

  fileInfo: string;

  severity: string;


  constructor(
    private readonly route: ActivatedRoute,
    private router: Router,
    private personService: PersonService,
    private formBuilder: FormBuilder,
    private documentTypeService: DocumentTypeService,
    private genderService: GenderService
  ) {
  }

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
      }
    });
  }

  getGenres(): void {
    this.genderService.getDocumentType().subscribe({
      next: (item) => {
        this.genders = item;
      }
    });
  }

  buildForm() {
    this.formPerson = this.formBuilder.group({
      primerNombre: ['', Validators.compose([Validators.required])],
      segundoNombre: [''],
      primerApellido: ['', Validators.compose([Validators.required])],
      segundoApellido: [''],
      idTipoDocumento: ['', Validators.required],
      documento: [null, Validators.compose([Validators.required, Validators.min(0)])],
      correo: [
        '',
        Validators.compose([
          Validators.email,
          Validators.required,
          Validators.maxLength(120),
        ]),
      ],
      telefono: [null, Validators.compose([Validators.min(0), Validators.max(9999999999)])],
      idGenero: ['', Validators.required],
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

  get generoNoValido() {
    return this.isValido('idGenero');
  }

  getPerson(personId: number) {
    this.personService.getPerson(personId).subscribe({
      next: (data) => {
        this.person = data;
        if (this.person) {
          this.personCopy = data;
          this.assignValuesToForm(this.person);
        }
      }
    });
  }

  assignValuesToForm(person: Person) {
    this.formPerson.get('primerNombre').setValue(person.primerNombre);
    this.formPerson.get('segundoNombre').setValue(person.segundoNombre);
    this.formPerson.get('primerApellido').setValue(person.primerApellido);
    this.formPerson.get('segundoApellido').setValue(person.segundoApellido);
    this.formPerson.get('idTipoDocumento').setValue(person.idTipoDocumento);
    this.formPerson.get('documento').setValue(person.documento);
    this.formPerson.get('correo').setValue(person.correo);
    this.formPerson.get('telefono').setValue(person.telefono);
    this.formPerson.get('idGenero').setValue(person.idGenero);
  }

  goBack() {
    this.router.navigate(['configurations/users'], {
      skipLocationChange: true,
    }).then();
  }

  updatePerson(id: number, payload: any): void {
    payload.srcFoto = ''
    this.personService.update(id, payload).subscribe({
      next: () => {
        this.goBack();
        this.creatingOrUpdating = false;
      },
      error: () => {
        this.creatingOrUpdating = false;
      },
    });
  }

  createPerson(payload: any): void {
    this.personService.create(payload).subscribe({
      next: () => {
        this.goBack();
        this.creatingOrUpdating = false;
      },
      error: () => {
        this.creatingOrUpdating = false;
      },
    });
  }

  onSubmitPerson(event: Event): void {
    this.formData.delete('person');
    event.preventDefault();
    this.formData.append('person', JSON.stringify(this.formPerson.value));
    if (this.formPerson.invalid) {
      this.formPerson.markAllAsTouched();
    } else {
      this.creatingOrUpdating = true;
      this.updateMode ? this.updatePerson(this.personId, this.formData) : this.createPerson(this.formData);
    }
  }

  onDeletePerson(event: Event): void {
    event.preventDefault();
    this.deleting = true;
    this.personService.delete(this.personId).subscribe({
      next: () => {
        this.goBack();
        this.deleting = false;
      }
    });
  }

  onCancelPerson(event: Event): void {
    event.preventDefault();
    this.updateMode = false;
    this.goBack();
  }

  onFileSelect(input: HTMLInputElement): void {
    this.formData.delete('file');

    function formatBytes(bytes: number): string {
      const UNITS = ['Bytes', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
      const factor = 1024;
      let index = 0;
      while (bytes >= factor) {
        bytes /= factor;
        index++;
      }
      return `${parseFloat(bytes.toFixed(2))} ${UNITS[index]}`;
    }

    const file = input.files[0];

    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validImageTypes.includes(file.type)) {
      this.loadFile = true;
      this.severity = 'error'
      this.fileInfo = 'Solo se permiten archivos de imagen (JPEG, PNG, GIF).';
      input.value = '';
      return;
    }

    const maxSizeInBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      alert(`El archivo es demasiado grande. El tamaño máximo permitido es ${formatBytes(maxSizeInBytes)}.`);
      input.value = '';
      return;
    }

    this.formData = new FormData();
    this.formData.append('file', file);
    this.fileInfo = `${file.name} (${formatBytes(file.size)})`;
    this.previewFoto(file);
  }

  previewFoto(file: File) {
    const img = document.getElementById('avatarPerson') as HTMLImageElement;
    if (file) {
      img.src = URL.createObjectURL(file);
      this.loadFile = true;
      this.severity = 'info'
    } else {
      this.loadFile = false;
      this.fileInfo = '';
      img.src = this.person.srcFoto;
    }
  }


  protected readonly MESSAGE = MESSAGE;
}
