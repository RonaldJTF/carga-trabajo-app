import {OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {Component} from '@angular/core';
import {LayoutService} from './service/app.layout.service';
import {Functionality} from '../models/functionality';
import {AuthenticationService} from "../services/auth.service";
import {Subscription} from "rxjs";
import {KeySequenceService} from "../services/key-sequence.service";


@Component({
  selector: 'app-menu',
  templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit, OnDestroy {

  model: Functionality[] = [];

  isSuperAdmin: boolean;

  sectionVisible: boolean = false;

  private keySequenceSubscription: Subscription;

  constructor(
    public layoutService: LayoutService,
    private authService: AuthenticationService,
    private keySequenceService: KeySequenceService
  ) {
    this.keySequenceSubscription = this.keySequenceService.keySequence$.subscribe(() => {
      if (this.isSuperAdmin) {
        this.toggleSectionVisibility();
      }
    });
  }

  ngOnInit() {
    const {isSuperAdministrator} = this.authService.roles();
    this.isSuperAdmin = isSuperAdministrator;

    this.buildManu();
  }

  buildManu() {
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
      {
        label: 'Desarrollador',
        items: [
          { label: 'Tablas básicas', icon: 'pi pi-database', color:'yellow', description: 'Gestión de las tablas básicas', routerLink: ['/developer/basic-tables']},
          ],
      },
    ];
  }

  ngOnDestroy() {
    if (this.keySequenceSubscription) {
      this.keySequenceSubscription.unsubscribe();
    }
  }

  toggleSectionVisibility() {
    this.sectionVisible = !this.sectionVisible;
    this.buildManu();
    console.log(`Section visibility toggled: ${this.sectionVisible}`);
  }

}
