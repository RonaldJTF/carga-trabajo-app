import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { MenuItem } from 'primeng/api';
import { Functionality } from '../models/functionality';

  
@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: Functionality[] = [];

    constructor(public layoutService: LayoutService) { }

    ngOnInit() {
        this.model = [
            {
                label: 'Home',
                items: [
                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', color:'red', description: 'Tablero resumen de información de interés',  routerLink: ['/'], command: (e) => {}}
                ],
            },
            {
                label: 'Configuración',
                items: [
                    { label: 'Estructuras', icon: 'pi pi-sitemap', color:'blue', description: 'Gestión de estructuras de dependencias, procesos, procedimientos y actividades',  routerLink: ['/configurations/structures']},
                    { label: 'Usuarios', icon: 'pi pi-user', color:'blue', description: 'Gestión de usuarios para el acceso al aplicativo', routerLink: ['/configurations/users']}
                ],
            },
        ];
    }
}
