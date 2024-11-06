import {Component, OnInit} from '@angular/core';
import {MegaMenuItem, Message} from "primeng/api";
import {MESSAGE} from "@labels/labels";
import {Location} from "@angular/common";
import {MenuService} from "@services";
import { Router } from '@angular/router';

@Component({
  selector: 'app-basic-tables',
  templateUrl: './basic-tables.component.html',
  styleUrls: ['./basic-tables.component.scss']
})
export class BasicTablesComponent implements OnInit {

  protected readonly MESSAGE = MESSAGE;

  menuItems: MegaMenuItem[];

  selectedOption: MegaMenuItem;

  messages: Message | undefined;

  constructor(
    public menuService: MenuService,
    private router: Router,
    private location: Location,
  ) {
  }

  ngOnInit() {
    this.initializeOptions();
  }

  showMessage(state: any) {
    this.clearMessage();
    if (state?.show) {
      this.messages = {severity: state.severity, detail: state.message};
    }
  }

  onChangeTable(selected: MegaMenuItem = {url: '', state: undefined}): void {
    if (selected) {
      this.router.navigate([`developer/basic-tables/${selected.url}`], {
        skipLocationChange: true
      }).then(() => {
        this.location.replaceState('developer/basic-tables');
        this.showMessage(selected.state);
      })
    } else {
      this.clearMessage();
    }
  }

  clearMessage() {
    this.messages = null;
  }

  initializeOptions() {
    this.menuItems = [
      {
        title: 'Acciones',
        icon: 'pi pi-verified',
        url: 'action',
        label: 'Gestión de las acciones que se pueden realizar en el sistema',
        iconStyle: 'primary',
        state: {
          message: 'Esto puede afectar el acceso a las funcionalidades ya relacionadas y por lo tanto, la experiencia del usuario. Por favor, revise cuidadosamente los cambios y asegúrese de que no eliminar acceso a funcionalidades esenciales.',
          severity: 'warn',
          show: true
        }
      },
      {
        title: 'Alcance',
        icon: 'pi pi-compass',
        url: 'scope',
        label: 'Gestión de alcance',
        iconStyle: 'primary',
        state: {}
      },
      {
        title: 'Documentos de identidad',
        icon: 'pi pi-id-card',
        url: 'document-type',
        label: 'Gestión de los tipos de documentos de identidad',
        iconStyle: 'primary',
        state: {}
      },
      {
        title: 'Géneros',
        icon: 'pi pi-circle',
        url: 'gender',
        label: 'Gestión de las categorías de los géneros disponibles para los perfiles de usuario',
        iconStyle: 'primary',
        state: {}
      },
      {
        title: 'Periodicidad',
        icon: 'pi pi-calendar-plus',
        url: 'periodicity',
        label: 'Gestión de periodicidad',
        iconStyle: 'primary',
        state: {}
      },
      {
        title: 'Roles de acceso',
        icon: 'pi pi-users',
        url: 'rol',
        label: 'Gestión de los roles de usuario en el sistema',
        iconStyle: 'primary',
        state: {
          message: 'Realizar cambios en los roles puede impactar en la seguridad y en el control de acceso del aplicativo. Por favor, revise cuidadosamente los cambios.',
          severity: 'warn',
          show: true
        }
      },
      {
        title: 'Servidores FTPs',
        icon: 'pi pi-folder',
        url: 'ftp',
        label: 'Gestión de los servidores FTPs que alojan archivos soportes',
        iconStyle: 'primary',
        state: {
          message: 'Realizar modificaciones en la configuración de los servidores FTPs puede causar inconvenientes en el acceso y almacenamiento de los archivos soportes.',
          severity: 'warn',
          show: true
        }
      },
      {
        title: 'Tipologías',
        icon: 'pi pi-sitemap',
        url: 'typology',
        label: 'Gestión de las tipologías para la categorización de las estructuras',
        iconStyle: 'primary',
        state: {
          message: 'Realizar modificaciones en las tipologías puede impactar en la integridad y la coherencia de los datos. Por favor, revise cuidadosamente los cambios y asegúrese de que no esté causando inconsistencias.',
          severity: 'warn',
          show: true
        }
      },
      {
        title: 'Tipos de normatividad',
        icon: 'pi pi-book',
        url: 'normativity-type',
        label: 'Gestión de tipos de normatividad',
        iconStyle: 'primary',
        state: {}
      }
    ]
  }

}
