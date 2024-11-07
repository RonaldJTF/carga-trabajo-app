import {OnInit} from '@angular/core';
import {Component} from '@angular/core';
import {Functionality} from "@models";
import {AuthenticationService, LayoutService} from "@services";

@Component({
  selector: 'app-menu',
  templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

  model: Functionality[] = [];

  isSuperAdmin: boolean;

  isDesarrollador: boolean;

  isAdministrator: boolean;

  isOperator: boolean;

  constructor(
    public layoutService: LayoutService,
    private authService: AuthenticationService,
  ) {
  }

  ngOnInit() {
    this.initializeRoles();
    this.buildManu();
  }

  initializeRoles() {
    const {isSuperAdministrator, isDeveloper, isAdministrator, isOperator} = this.authService.roles();
    this.isSuperAdmin = isSuperAdministrator;
    this.isDesarrollador = isDeveloper;
    this.isAdministrator = isAdministrator;
    this.isOperator = isOperator;
  }

  buildManu() {
    this.model = [
      {
        label: 'Home',
        visible: this.isAdministrator || this.isOperator || this.isSuperAdmin,
        items: [
          {
            label: 'Dashboard',
            icon: 'pi pi-fw pi-home',
            color: 'primary',
            description: 'Tablero resumen de información de interés',
            routerLink: ['/']
          }
        ],
      },
      {
        label: 'Gestión',
        visible: this.isAdministrator || this.isOperator || this.isSuperAdmin,
        items: [
          {
            label: 'Usuarios',
            icon: 'pi pi-user',
            color: 'primary',
            description: 'Gestión de usuarios',
            routerLink: ['/configurations/users'],
            visible: this.isSuperAdmin
          },
          {
            label: 'Vigencias',
            icon: 'pi pi-calendar',
            color: 'primary',
            description: 'Gestión de las vigencias para las asignaciones laborales',
            routerLink: ['/configurations/validities'],
          },
          {
            label: 'Niveles ocupacionales',
            icon: 'pi pi-bookmark',
            color: 'primary',
            description: 'Gestión de los niveles ocupacionales en el ámbito laboral',
            routerLink: ['/configurations/levels'],
          },
          {
            label: 'Estructuras',
            icon: 'pi pi-sitemap',
            color: 'primary',
            description: 'Gestión de dependencias, procesos, procedimientos y actividades',
            routerLink: ['/configurations/structures']
          },
          {
            label: 'Planes de trabajo',
            icon: 'pi pi-calendar',
            color: 'primary',
            description: 'Gestión de planes de trabajos',
            routerLink: ['/configurations/workplans']
          },
        ],
      },
      {
        label: 'Desarrollador',
        visible: this.isDesarrollador,
        items: [
          {
            label: 'Tablas básicas',
            icon: 'pi pi-database',
            color: 'primary',
            description: 'Gestión de las tablas básicas del sistema',
            routerLink: ['/developer/basic-tables']
          }
        ],
      },
    ];
  }

}
