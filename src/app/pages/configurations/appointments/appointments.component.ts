import { Component } from '@angular/core';
import { Functionality } from '@models';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss']
})
export class AppointmentsComponent {
  functionality: Functionality = {
    label: 'Designación de cargos',
    icon: 'pi pi-calendar',
    color: 'primary',
    description: 'Gestión de la designación de cargos laborales por dependencia'
  };
}
