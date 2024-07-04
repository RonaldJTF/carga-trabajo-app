import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { Functionality } from '../models/functionality';
import {AuthenticationService} from "../services/auth.service";


@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: Functionality[] = [];

    isAdmin: boolean;
    isSuperAdmin: boolean;

    constructor(public layoutService: LayoutService, private authService: AuthenticationService) { }

    ngOnInit() {
      const {isAdministrator, isOperator, isSuperAdministrator} = this.authService.roles();
      this.isAdmin = isAdministrator;
      this.isSuperAdmin = isSuperAdministrator;
      this.model = [
        {
          label: 'Home',
          items: [
            { label: 'Dashboard', icon: 'pi pi-fw pi-home', color:'red', description: 'Tablero resumen de información de interés',  routerLink: ['/'] }
          ],
        },
        {
          label: 'Configuración',
          items: [
            { label: 'Usuarios', icon: 'pi pi-user', color:'cyan', description: 'Gestión de usuarios', routerLink: ['/configurations/users'], visible: this.isSuperAdmin },
            { label: 'Estructuras', icon: 'pi pi-sitemap', color:'blue', description: 'Gestión de dependencias, procesos, procedimientos y actividades',  routerLink: ['/configurations/structures'] },
            { label: 'Planes de trabajo', icon: 'pi pi-calendar', color:'green', description: 'Gestión de planes de trabajos',  routerLink: ['/configurations/workplans'] },
          ],
        },
      ];
    }
}
