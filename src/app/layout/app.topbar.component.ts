import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {LayoutService} from "./service/app.layout.service";
import {Person} from '../models/person';
import {AuthenticationService} from '../services/auth.service';
import {Observable, Subscription} from 'rxjs';
import {Router} from "@angular/router";
import {CryptojsService} from "../services/cryptojs.service";

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
    private router: Router,
    private cryptoService: CryptojsService,
  ) {
  }

  ngOnInit(): void {
    this.loguedPerson$ = this.authenticationService.loguedPerson$;
  }

  editPerson(idPerson: string) {
    this.router.navigate(['configurations/users/person/', this.cryptoService.encryptParam(idPerson)], {
      skipLocationChange: true,
      queryParams:{
        backLocation: true
      }
    }).then();
  }

  changePassword(idPerson: string, userName: string) {
    this.router.navigate(['configurations/users/change-password/', this.cryptoService.encryptParam(idPerson)], {
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
        this.editPerson(idPerson.toString())
      }
    },
    {
      label: 'Cambiar contraseña',
      icon: 'pi pi-key',
      command: () => {
        let idPerson: number, userName: string;
        this.loguedPerson$.subscribe((person: Person) => {
          idPerson = person?.id
          userName = person?.usuario.username;
        })
        this.changePassword(idPerson.toString(), userName);
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
