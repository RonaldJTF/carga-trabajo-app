import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CompensationsModule} from "./compensations/compensations.module";

const routes: Routes = [
  {path: 'structures', loadChildren: ()=>import('./structures/structures.module').then(m=>m.StructuresModule)},
  {path: 'users', loadChildren: ()=>import('./users/users.module').then(m=>m.UsersModule)},
  {path: 'workplans', loadChildren: ()=>import('./workplans/workplans.module').then(m=>m.WorkplansModule)},
  {path: 'compensations', loadChildren: ()=>import('./compensations/compensations.module').then(m=>CompensationsModule)}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigurationsRoutingModule { }
