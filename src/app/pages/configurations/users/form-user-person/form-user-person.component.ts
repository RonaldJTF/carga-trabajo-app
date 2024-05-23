import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Person} from 'src/app/models/person';
import {PersonService} from '../../../../services/person.service';
import {UserService} from 'src/app/services/user.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {Rol} from 'src/app/models/rol';
import {SelectItem} from 'primeng/api';
import {MESSAGE} from '../../../../../labels/labels';
import {OverlayPanel} from 'primeng/overlaypanel';
import {Methods} from 'src/app/utils/methods';
import {User} from "../../../../models/user";
import {CryptojsService} from "../../../../services/cryptojs.service";

@Component({
  selector: 'app-form-user-person',
  templateUrl: './form-user-person.component.html',
  styleUrls: ['./form-user-person.component.scss'],
})
export class FormUserPersonComponent implements OnInit {
  MESSAGE = MESSAGE;

  @ViewChild('rolOptionsOverlayPanel') rolOptionsOverlayPanel: OverlayPanel;

  person: Person = new Person();

  personId: number = null;

  formUser: FormGroup;

  roles: Rol[];

  rolOptions: SelectItem[] = [];

  creatingOrUpdating: boolean = false;

  updateMode: boolean = false;

  deleting: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private readonly route: ActivatedRoute,
    private personService: PersonService,
    private userService: UserService,
    private router: Router,
    private cryptoService: CryptojsService,
  ) {
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.personId = params['id'];
    });

    this.formUser = this.createFormUser();

    this.getUserPerson(this.personId);
  }

  get userRolesFormControl(): FormControl {
    return this.formUser.get('roles') as FormControl;
  }

  createFormUser() {
    return this.formBuilder.group({
      idPersona: [this.personId],
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

  getUserPerson(personId: number) {
    this.personService.getPerson(personId).subscribe({
      next: (data) => {
        this.person = data;
        if (this.person.usuario) {
          this.person.usuario.roles.map((rol) => this.addRol(rol));
          this.onValidacionCredenciales(data);
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

      let inputPass = document.getElementById('password');
      inputPass.setAttribute('type', 'password');
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
        this.roles = e;
        this.loadRolesOptions();
      },
    });
  }

  addRol(rol: any) {
    let temporalRoles: Rol[] = this.formUser.get('roles').value as Rol[];
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
    const payload = this.formUser.value;
    payload.activo = Methods.parseBooleanToString(payload.activo);
    payload.password = this.cryptoService.encryptString(payload.password);
    if (this.formUser.invalid) {
      this.formUser.markAllAsTouched();
    } else {
      this.creatingOrUpdating = true;
      this.updateMode
        ? this.updateUser(this.person.usuario.id, payload)
        : this.createUser(payload);
    }
  }

  updateUser(id: number, payload: any): void {
    this.userService.update(id, payload).subscribe({
      next: () => {
        this.goBack();
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
        this.goBack();
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
    this.userService.delete(this.person.usuario.id).subscribe({
      next: () => {
        this.goBack();
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
    this.goBack();
  }

  goBack() {
    this.router.navigate(['configurations/users'], {
      skipLocationChange: true,
    }).then();
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
        const  control = this.formUser.get(controlName);

        if (control){
          control.clearValidators();
          control.markAsDirty();
          control.updateValueAndValidity();
        }
      })
    }
  }

}
