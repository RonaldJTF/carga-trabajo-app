import { NgModule } from '@angular/core';
import { AppointmentsRoutingModule } from './appointments-routing.module';
import { SharedModule } from '@shared';
import { ListComponent } from './list/list.component';
import { AppointmentComponent } from './appointment/appointment.component';
import { AppointmentsComponent } from './appointments.component';
import { AppointmentMenuItemComponent } from './list/appointment-menu-item/appointment-menu-item.component';
import { MultiAppointmentsComponent } from './multi-appointments/multi-appointments.component';


@NgModule({
  declarations: [
    ListComponent, AppointmentComponent, AppointmentsComponent, AppointmentMenuItemComponent, MultiAppointmentsComponent
  ],
  imports: [
    AppointmentsRoutingModule,
    SharedModule
  ]
})
export class AppointmentsModule { }
