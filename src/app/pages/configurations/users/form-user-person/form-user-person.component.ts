import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Person } from 'src/app/models/person';
import { PersonService } from '../../../../services/person.service';
import { UserService } from 'src/app/services/user.service';
import { RolesUser } from 'src/app/models/rolesuser';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Rol } from 'src/app/models/rol';
import { SelectItem } from 'primeng/api';
import { MESSAGE } from '../../../../../labels/labels';
import { OverlayPanel } from 'primeng/overlaypanel';
import { filter, map } from 'rxjs';

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

  constructor(
    private formBuilder: FormBuilder,
    private readonly route: ActivatedRoute,
    private personService: PersonService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.personId = params['id'];
    });

    this.formUser = this.createFormUser();

    this.getPerson(this.personId);
  }

  get userRoles(): Rol[] {
    return this.person.usuario?.roles;
  }

  get userRolesFormControl(): FormControl{
    return this.formUser.get("roles") as FormControl
  }

  createFormUser() {
    return this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      activo: [false, Validators.required],
      roles: [],
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

  getPerson(personId: number) {
    this.personService.getPerson(personId).subscribe({
      next: (data) => {
        this.person = data;
        this.loadRoles();
      },
      error: (err) => {
        console.log(err.error);
      },
    });
  }

  loadRolesOptions() {
     this.rolOptions = this.roles?.map((objeto) => {
       return {
         label: objeto.nombre,
         value: objeto,
         disabled: this.userRolesFormControl.value?.some( e => e.id === objeto.id)
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

  addRol(event: any) {
    let temporalRoles: Rol[] = this.formUser.get('roles').value as Rol[];
    this.formUser.get('roles').setValue([...(temporalRoles ?? []), event.value.value]);
    this.rolOptionsOverlayPanel.hide();
    this.loadRolesOptions();
  }

  removeRol(id: number) {
    this.formUser.get('roles').setValue([...(this.formUser.get('roles').value ?? []).filter(e => e.id !== id)]);
    this.rolOptionsOverlayPanel.hide();
    this.loadRolesOptions();
  }

  onSubmitPerson(event: Event): void {
    event.preventDefault();
    if (this.formUser.invalid) {
      this.formUser.markAllAsTouched();
    } else {
      this.creatingOrUpdating = true;
      this.updateMode
        ? this.updateUser(this.personId, this.formUser.value)
        : this.createUser(this.formUser.value);
    }
  }

  updateUser(id: number, payload: any): void {
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

  createUser(payload: any): void {
    console.log(payload);
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

  goBack() {
    this.router.navigate(['configurations/users'], {
      skipLocationChange: true,
    });
  }
}
