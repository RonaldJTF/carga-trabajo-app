import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppointmentsComponent } from './appointments.component';
import { ListComponent } from './list/list.component';
import { AppointmentComponent } from './appointment/appointment.component';
import {adminGuard} from "@guards";
import { MultiAppointmentsComponent } from './multi-appointments/multi-appointments.component';

const routes: Routes = [{
  path: '', component: AppointmentsComponent, children: [
    {path: '', component: ListComponent},
    {path: 'create', component: MultiAppointmentsComponent, canActivate: [adminGuard]},
    {path: ':id', component: AppointmentComponent, canActivate: [adminGuard]},
    {path: 'multiappointments/:id', component: MultiAppointmentsComponent, canActivate: [adminGuard]},
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppointmentsRoutingModule { }
