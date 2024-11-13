import { Component } from '@angular/core';
import { Functionality } from '@models';
import { MenuService } from '@services';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss']
})
export class AppointmentsComponent{
  functionality: Functionality = {
    label: 'Designación de cargos',
    icon: 'pi pi-users',
    color: 'primary',
    description: 'Gestión de la designación de cargos por dependencias, vigencias y niveles ocupacionales'
  };
}
