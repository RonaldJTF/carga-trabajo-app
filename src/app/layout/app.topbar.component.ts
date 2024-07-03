import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {LayoutService} from "./service/app.layout.service";
import {Person} from '../models/person';
import {AuthenticationService} from '../services/auth.service';
import {Observable, Subscription} from 'rxjs';
import {Router} from "@angular/router";

@Component({
  selector: 'app-topbar',
  templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent implements OnInit {

  items!: MenuItem[];

  loguedPerson$: Observable<Person>;

  @ViewChild('menubutton') menuButton!: ElementRef;

  @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

  @ViewChild('topbarmenu') menu!: ElementRef;

  constructor(
    public layoutService: LayoutService,
    private authenticationService: AuthenticationService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.loguedPerson$ = this.authenticationService.loguedPerson$;
  }

  editPerson(idPerson: number) {
    this.router.navigate(['configurations/users/person/', idPerson], {
      skipLocationChange: true,
      queryParams:{
        backLocation: true
      }
    }).then();
  }

  menuItems: MenuItem[] = [
    {
      label: 'Perfil',
      icon: 'pi pi-user',
      command: () => {
        let idPerson: number;
        this.loguedPerson$.subscribe((person: Person) => {
          idPerson = person?.id
        })
        this.editPerson(idPerson)
      }
    },
    {
      separator: true
    },
    {
      label: 'Salir',
      icon: 'pi pi-sign-out',
      command: () => {
        this.authenticationService.logout();
      }
    },
  ];
}
