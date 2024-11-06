import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Gender, Person, DocumentType} from '@models';
import {MESSAGE} from "@labels/labels";
import {
  AuthenticationService,
  CryptojsService,
  DocumentTypeService,
  GenderService,
  PersonService,
  UrlService
} from '@services';

@Component({
  selector: 'app-form-person',
  templateUrl: './form-person.component.html',
  styleUrls: ['./form-person.component.scss'],
})
export class FormPersonComponent implements OnInit {

  protected readonly MESSAGE = MESSAGE;

  @Input() submitted: boolean;

  @Input() personDialog: boolean;

  person: Person = new Person();

  personCopy: Person = new Person();

  personId: string = null;

  param: string;

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

  isSuperAdmin: boolean;

  constructor(
    private readonly route: ActivatedRoute,
    private personService: PersonService,
    private formBuilder: FormBuilder,
    private documentTypeService: DocumentTypeService,
    private genderService: GenderService,
    private urlService: UrlService,
    private authService: AuthenticationService,
    private cryptoService: CryptojsService,
  ) {
  }

  ngOnInit() {
    this.getDocumentTypes();
    this.getGender();
    this.buildForm();
    this.getInitialValue();
    this.getRole();
  }

  getInitialValue() {
    this.route.params.subscribe((params) => {
      if (params['id'] != null) {
        this.personId = params['id'];
        this.updateMode = true;
        this.getPerson(this.personId);
      }
    });
  }

  getRole() {
    const {isSuperAdministrator} = this.authService.roles();
    this.isSuperAdmin = isSuperAdministrator;
  }

  getDocumentTypes(): void {
    this.documentTypeService.getDocumentType().subscribe({
      next: (resp) => {
        this.documentTypes = resp;

      }
    });
  }

  getGender(): void {
    this.genderService.getGenders().subscribe({
      next: (resp) => {
        this.genders = resp;
      }
    });
  }

  buildForm() {
    this.formPerson = this.formBuilder.group({
      primerNombre: ['', Validators.compose([Validators.required, this.noWhitespaceValidator])],
      segundoNombre: [''],
      primerApellido: ['', Validators.compose([Validators.required, this.noWhitespaceValidator])],
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

  get apellidoPrimeroNoValido() {
    return this.isValido('primerApellido');
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

  getPerson(personId: string) {
    this.personService.getPerson(personId).subscribe({
      next: (data) => {
        this.person = data;
        if (this.person) {
          this.personCopy = this.person;
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

  updatePerson(id: string, payload: any): void {
    payload.srcFoto = ''
    this.personService.update(id, payload).subscribe({
      next: () => {
        this.urlService.goBack();
        this.creatingOrUpdating = false;
      },
      error: () => {
        this.creatingOrUpdating = false;
      },
    });
  }

  createPerson(payload: any): void {
    this.personService.create(payload).subscribe({
      next: (res) => {
        this.urlService.goBack();
        this.creatingOrUpdating = false;
      },
      error: (err) => {
        this.creatingOrUpdating = false;
      },
    });
  }

  onSubmitPerson(event: Event): void {
    this.formData.delete('person');
    event.preventDefault();
    this.formData.append('person', this.cryptoService.encryptParam(JSON.stringify(this.formPerson.value)));
    if (this.formPerson.invalid) {
      this.formPerson.markAllAsTouched();
    } else {
      this.creatingOrUpdating = true;
      console.log(this.formPerson.value)
      this.updateMode ? this.updatePerson(this.personId, this.formData) : this.createPerson(this.formData);
    }
  }

  onDeletePerson(event: Event): void {
    event.preventDefault();
    this.deleting = true;
    this.personService.delete(this.personId).subscribe({
      next: () => {
        this.urlService.goBack();
        this.deleting = false;
      }
    });
  }

  onCancelPerson(event: Event): void {
    event.preventDefault();
    this.updateMode = false;
    this.urlService.goBack();
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

  noWhitespaceValidator(control: AbstractControl) {
    const value = control.value || '';
    if (!value.trim() && value.length > 0) {
      return { 'whitespace': true };
    }
    return null;
  }

}
