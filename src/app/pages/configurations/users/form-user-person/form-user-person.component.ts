import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {SelectItem} from 'primeng/api';
import {OverlayPanel} from 'primeng/overlaypanel';
import {Methods} from "@utils";
import {MESSAGE} from "@labels/labels";
import {CryptojsService, PersonService, UrlService, UserService} from "@services";
import {Person, Role, User} from "@models";

@Component({
  selector: 'app-form-user-person',
  templateUrl: './form-user-person.component.html',
  styleUrls: ['./form-user-person.component.scss'],
})
export class FormUserPersonComponent implements OnInit {
  MESSAGE = MESSAGE;

  @ViewChild('rolOptionsOverlayPanel') rolOptionsOverlayPanel: OverlayPanel;

  person: Person = new Person();

  personId: string = null;

  formUser: FormGroup;

  roles: Role[];

  rolOptions: SelectItem[] = [];

  creatingOrUpdating: boolean = false;

  updateMode: boolean = false;

  deleting: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private readonly route: ActivatedRoute,
    private personService: PersonService,
    private userService: UserService,
    private cryptoService: CryptojsService,
    private urlService: UrlService,
  ) {
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params['id'] != null) {
        this.personId = params['id'];
        this.getUserPerson(this.personId);
      }
    });
    this.formUser = this.createFormUser();
  }

  get userRolesFormControl(): FormControl {
    return this.formUser.get('roles') as FormControl;
  }

  createFormUser() {
    return this.formBuilder.group({
      idPersona: [this.cryptoService.decryptParamAsNumber(this.personId)],
      username: ['', Validators.required],
      password: ['', Validators.required],
      activo: [false],
      roles: [[], Validators.required],
    });
  }

  private isValido(nombreAtributo: string) {
    return (
      this.formUser.get(nombreAtributo)?.invalid &&
      (this.formUser.get(nombreAtributo)?.dirty ||
        this.formUser.get(nombreAtributo)?.touched)
    );
  }

  get controls() {
    return this.formUser.controls;
  }

  get usuarioNoValido() {
    return this.isValido('username');
  }

  get paswordNoValido() {
    return this.isValido('password');
  }

  getUserPerson(personId: string) {
    this.personService.getPerson(personId).subscribe({
      next: (data) => {
        this.person = data;
        if (this.person.usuario) {
          this.person.usuario.roles.map((rol: Role) => this.addRol(rol));
          this.onValidacionCredenciales(this.person);
          this.updateMode = true;
          this.assignValuesToForm(this.person.usuario);
        }
        this.loadRoles();
      }
    });
  }

  assignValuesToForm(user: User) {
    this.formUser.get('username').setValue(user.username);
    this.formUser.get('password').setValue("***********");
    this.formUser.get('activo').setValue(Methods.parseStringToBoolean(user.activo));
    this.disabledInput(user);
  }

  disabledInput(user: User) {
    if (user) {
      this.formUser.get('username')?.disable();
      this.formUser.get('password')?.disable();

      // let inputPass = document.getElementById('password');
      // inputPass.setAttribute('type', 'password');
    }
  }

  loadRolesOptions() {
    this.rolOptions = this.roles?.map((objeto) => {
      return {
        label: objeto.nombre,
        value: objeto,
        disabled: this.userRolesFormControl.value?.some((e: any) => e.id === objeto.id)
      };
    });
  }

  loadRoles() {
    this.userService.loadRoles().subscribe({
      next: (e) => {
        this.roles = this.decriptList<Role>(e);
        this.loadRolesOptions();
      },
    });
  }

  addRol(rol: any) {
    let temporalRoles: Role[] = this.formUser.get('roles').value as Role[];
    this.formUser.get('roles').setValue([...(temporalRoles ?? []), rol]);
    this.rolOptionsOverlayPanel.hide();
    this.loadRolesOptions();
  }

  removeRol(id: number) {
    this.formUser.get('roles').setValue([...(this.formUser.get('roles').value ?? []).filter((e: any) => e.id !== id)]);
    this.rolOptionsOverlayPanel.hide();
    this.loadRolesOptions();
  }

  onSubmitUser(event: Event): void {
    event.preventDefault();
    let payload = this.formUser.value;
    payload.activo = Methods.parseBooleanToString(payload.activo);
    payload.password = this.cryptoService.encrypt(payload.password);
    payload = this.cryptoService.encryptParam(payload);
    if (this.formUser.invalid) {
      this.formUser.markAllAsTouched();
    } else {
      this.creatingOrUpdating = true;
      console.log(this.formUser.value)
      this.updateMode ? this.updateUser(this.personId, payload) : this.createUser(payload);
    }
  }

  updateUser(id: string, payload: any): void {
    this.userService.update(id, payload).subscribe({
      next: () => {
        this.urlService.goBack();
        this.creatingOrUpdating = false;
      },
      error: () => {
        this.creatingOrUpdating = false;
      },
    });
  }

  createUser(payload: any): void {
    this.userService.create(payload).subscribe({
      next: () => {
        this.formUser.reset();
        this.urlService.goBack();
        this.creatingOrUpdating = false;
      },
      error: () => {
        this.creatingOrUpdating = false;
      },
    });
  }

  onDeleteUserPerson(event: Event): void {
    event.preventDefault();
    this.deleting = true;
    this.userService.delete(this.personId).subscribe({
      next: () => {
        this.urlService.goBack();
        this.deleting = false;
      },
      error: () => {
        this.deleting = false;
      },
    });
  }

  onCancelUserPerson(event: Event): void {
    event.preventDefault();
    this.updateMode = false;
    this.urlService.goBack();
  }

  onValidacionCredenciales(person: Person): void {
    if (person.usuario) {
      this.removeValidateRequiredUser();
    } else {
      this.addValidateRequiredUser();
    }
  }

  addValidateRequiredUser(): void {
    if (this.formUser) {
      const controls = ['username', 'password'];

      controls.forEach(controlName => {
        const control = this.formUser.get(controlName);

        if (control) {
          control.clearValidators();
          control.setValidators([Validators.required]);
          control.markAsDirty();
          control.updateValueAndValidity();
        }
      });
    }
  }

  removeValidateRequiredUser(): void {
    if (this.formUser) {
      const controls = ['username', 'password'];

      controls.forEach(controlName => {
        const control = this.formUser.get(controlName);

        if (control) {
          control.clearValidators();
          control.markAsDirty();
          control.updateValueAndValidity();
        }
      })
    }
  }

  decriptList<T>(param: string[]): T[] {
    let list: T[] = [];
    param.forEach(item => {
      let elemnt: T = JSON.parse(this.cryptoService.decryptParamAsString(item));
      list.push(elemnt);
    })
    return list;
  }
}
