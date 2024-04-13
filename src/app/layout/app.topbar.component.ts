import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { Person } from '../models/person';
import { AuthenticationService } from '../services/auth.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent implements OnInit{

    items!: MenuItem[];

    loguedPerson$: Observable<Person>;

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    constructor(
        public layoutService: LayoutService, 
        private authenticationService: AuthenticationService,
    ) { }
    
    ngOnInit(): void {
        this.loguedPerson$ = this.authenticationService.loguedPerson$;
    }

    menuItems: MenuItem[] = [
        {
            label: 'Profile',
            icon: 'pi pi-user',
            command: () => {
                
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
