import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProcessOrientedStructuresComponent } from './process-oriented-structures.component';
import { adminGuard } from '@guards';

const routes: Routes = [
  {path: '', component: ProcessOrientedStructuresComponent, children: [
    {path: 'operationals-managements', loadChildren: ()=>import('./operationals-managements/operationals-managements.module').then(m=>m.OperationalManagementModule), canActivate: [adminGuard]},
    {path: 'organizational-charts', loadChildren: ()=>import('./organizational-charts/organizational-charts.module').then(m=> m.OrganizationalChartsModule), canActivate: [adminGuard]}
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProcessOrientedStructuresRoutingModule { }
