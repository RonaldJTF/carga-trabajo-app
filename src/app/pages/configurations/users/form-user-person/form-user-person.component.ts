import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Person} from 'src/app/models/person';
import {PersonService} from '../../../../services/person.service';
import {UserService} from 'src/app/services/user.service';
import {RolesUser} from 'src/app/models/rolesuser';
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

  rolesUser: RolesUser[] = [];

  formUser: FormGroup;

  roles: Rol[];

  rolOptions: SelectItem[] = [];

  creatingOrUpdating: boolean = false;

  updateMode: boolean = false;

  deleting: boolean = false;

  stateSwitch: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private readonly route: ActivatedRoute,
    private personService: PersonService,
    private userService: UserService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.personId = params['id'];
    });

    this.formUser = this.createFormUser();

    this.getUserPerson(this.personId);
  }

  get userRoles(): Rol[] {
    return this.person.usuario?.roles;
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
      },
      error: (err) => {
        console.log(err.error);
      },
    });
  }

  assignValuesToForm(user: User) {
    this.formUser.get('username').setValue(user.username);
    this.formUser.get('password').setValue(user.password);
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
        disabled: this.userRolesFormControl.value?.some((e) => e.id === objeto.id)
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
    this.formUser.get('roles').setValue([...(this.formUser.get('roles').value ?? []).filter((e) => e.id !== id)]);
    this.rolOptionsOverlayPanel.hide();
    this.loadRolesOptions();
  }

  onSubmitUser(event: Event): void {
    event.preventDefault();
    const payload = this.formUser.value;
    payload.activo = Methods.parseBooleanToString(payload.activo);
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
      next: (e) => {
        this.goBack();
        this.creatingOrUpdating = false;
      },
      error: (error) => {
        this.creatingOrUpdating = false;
      },
    });
  }

  createUser(payload: any): void {
    this.userService.create(payload).subscribe({
      next: (e) => {
        this.formUser.reset();
        this.goBack();
        this.creatingOrUpdating = false;
      },
      error: (error) => {
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
      error: (error) => {
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
    });
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
      //Obtenemos el control ya instanciado en el formulario.
      let userControl = this.formUser.get('username');
      let passControl = this.formUser.get('password');

      //Quitamos todas las validaciones del control.
      userControl?.clearValidators();
      passControl?.clearValidators();

      //Agregamos la validacion:
      userControl?.setValidators([Validators.required]);
      passControl?.setValidators([Validators.required]);

      //Para evitar problemas con la validacion marcamos el campo con
      // dirty, de esta manera se ejecutan de nuevo las validaciones
      userControl?.markAsDirty();
      passControl?.markAsDirty();
      //Recalculamos el estado del campo para que cambie el estado
      // del formulario.
      userControl?.updateValueAndValidity();
      passControl?.updateValueAndValidity();
    }
  }

  removeValidateRequiredUser(): void {
    if (this.formUser) {
      //Obtenemos el control ya instanciado en el formulario.
      let userControl = this.formUser.get('username');
      let passControl = this.formUser.get('password');

      //Quitamos todas las validaciones del control.
      userControl?.clearValidators();
      passControl?.clearValidators();

      //Para evitar problemas con la validacion marcamos el campo con
      // dirty, de esta manera se ejecutan de nuevo las validaciones
      userControl?.markAsDirty();
      passControl?.markAsDirty();
      //Recalculamos el estado del campo para que cambie el estado
      // del formulario.
      userControl?.updateValueAndValidity();
      passControl?.updateValueAndValidity();
    }
  }
}
