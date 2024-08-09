import {Component, OnInit} from '@angular/core';
import {MegaMenuItem, Message} from "primeng/api";
import {MESSAGE} from "@labels/labels";
import {Router} from "@angular/router";
import {Location} from "@angular/common";
import {MenuService} from "@services";

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
        title: 'Acción',
        icon: 'pi pi-verified',
        url: 'action',
        label: 'Configure y gestione las acciones disponibles en el sistema.',
        iconStyle: 'primary',
        state: {
          message: 'Esto puede afectar la funcionalidad y la experiencia de usuario. Por favor, revise cuidadosamente los cambios y asegúrese de que no esté eliminando funcionalidades esenciales.',
          severity: 'warn',
          show: true
        }
      },
      {
        title: 'Ftp',
        icon: 'pi pi-folder',
        url: 'ftp',
        label: 'Configure y administre los servidores FTP.',
        iconStyle: 'primary',
        state: {
          message: 'Realizar modificaciones en la configuracion del los servidor FTP puede causar interrupciones en el servicio. Impactando en la conectividad y el acceso a los archivos.',
          severity: 'warn',
          show: true
        }
      },
      {
        title: 'Género',
        icon: 'pi pi-circle',
        url: 'gender',
        label: 'Gestiona las categorías de género disponibles para los perfiles de usuario.',
        iconStyle: 'primary',
        state: {
          message: '',
          severity: 'warn',
          show: false
        }
      },
      {
        title: 'Nivel ocupacional',
        icon: 'pi pi-bookmark',
        url: 'level',
        label: 'Define y administra los niveles ocupacionales dentro de la organización.',
        iconStyle: 'primary',
        state: {
          message: '',
          severity: 'warn',
          show: false
        }
      },
      {
        title: 'Rol',
        icon: 'pi pi-users',
        url: 'rol',
        label: 'Administra y define los roles de usuario en el sistema.',
        iconStyle: 'primary',
        state: {
          message: 'Hacer cambios en los roles puede impactar la seguridad y el control de acceso al aplicativo. Por favor, revise cuidadosamente los cambios.',
          severity: 'warn',
          show: true
        }
      },
      {
        title: 'Tipologia',
        icon: 'pi pi-sitemap',
        url: 'typology',
        label: 'Administra las diferentes tipologías disponibles para clasificación de las estructuras.',
        iconStyle: 'primary',
        state: {
          message: 'Realizar modificaciones en las tipologias puede impactar la integridad y la coherencia de los datos. Por favor, revise cuidadosamente los cambios y asegúrese de que no esté causando inconsistencias.',
          severity: 'warn',
          show: true
        }
      },
      {
        title: 'Tipo de documento',
        icon: 'pi pi-id-card',
        url: 'document-type',
        label: 'Configura y gestiona los tipos de documentos permitidos.',
        iconStyle: 'primary',
        state: {
          message: '',
          severity: 'warn',
          show: false
        }
      },
    ]
  }

}
