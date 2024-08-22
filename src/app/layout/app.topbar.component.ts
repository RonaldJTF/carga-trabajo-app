import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {AuthenticationService, CryptojsService, LayoutService} from '@services';
import {Observable} from 'rxjs';
import {Router} from "@angular/router";
import {Person} from "@models";

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

  editPerson(idPerson: number) {
    this.router.navigate(['configurations/users/person/', this.cryptoService.encryptParam(idPerson)], {
      skipLocationChange: true,
    }).then();
  }

  changePassword() {
    this.router.navigate(['configurations/users/change-password/'], {
      skipLocationChange: true,
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
        this.editPerson(idPerson);
      }
    },
    {
      label: 'Cambiar contraseña',
      icon: 'pi pi-key',
      command: () => {
        this.changePassword();
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
