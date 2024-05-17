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

    isAdmin: boolean = false;

    constructor(public layoutService: LayoutService, private authService: AuthenticationService,) { }

    ngOnInit() {
      this.isAdmin = this.authService.roleIsAdministrator();
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
            { label: 'Usuarios', icon: 'pi pi-user', color:'cyan', description: 'Gestión de usuarios', routerLink: ['/configurations/users'], visible: this.isAdmin },
            { label: 'Estructuras', icon: 'pi pi-sitemap', color:'blue', description: 'Gestión de dependencias, procesos, procedimientos y actividades',  routerLink: ['/configurations/structures'] },
          ],
        },
      ];
    }
}
