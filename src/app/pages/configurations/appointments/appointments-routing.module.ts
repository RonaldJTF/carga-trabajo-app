import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppointmentsComponent } from './appointments.component';
import { ListComponent } from './list/list.component';
import { AppointmentComponent } from './appointment/appointment.component';

const routes: Routes = [{
  path: '', component: AppointmentsComponent, children: [
    {path: '', component: ListComponent},
    {path: 'create', component: AppointmentComponent},
    {path: ':id', component: AppointmentComponent},
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppointmentsRoutingModule { }
