import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Person } from 'src/app/models/person';
import { PersonService } from '../../../../services/person.service';
import { UserService } from 'src/app/services/user.service';
import { RolesUser } from 'src/app/models/rolesuser';

@Component({
  selector: 'app-form-user-person',
  templateUrl: './form-user-person.component.html',
  styleUrls: ['./form-user-person.component.scss'],
})
export class FormUserPersonComponent implements OnInit {
  person: Person = new Person();

  userId: number = null;

  rolesUser: RolesUser[] = [];

  loading = [false, false, false, false];

  constructor(
    private readonly route: ActivatedRoute,
    private personService: PersonService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.userId = params['id'];
    });

    this.getUser(this.userId);
    this.getRolesUser(this.userId);
  }

  getUser(userId: number) {
    this.personService.getPerson(userId).subscribe({
      next: (data) => {
        this.person = data;
      },
      error: (err) => {
        console.log(err.error);
      },
    });
  }

  getRolesUser(userId: number) {
    this.userService.getRolsUser(userId).subscribe({
      next: (data) => {
        this.rolesUser = data;
      },
      error: (err)=>{
        console.log(err.error);
      }
    });
  }

  load(index: number) {
    this.loading[index] = true;
    setTimeout(() => (this.loading[index] = false), 1000);
  }
}
