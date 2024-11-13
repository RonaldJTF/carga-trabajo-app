import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CompensationsModule} from "./compensations/compensations.module";

const routes: Routes = [
  {path: 'structures', loadChildren: ()=>import('./structures/structures.module').then(m=>m.StructuresModule)},
  {path: 'users', loadChildren: ()=>import('./users/users.module').then(m=>m.UsersModule)},
  {path: 'workplans', loadChildren: ()=>import('./workplans/workplans.module').then(m=>m.WorkplansModule)},
  {path: 'compensations', loadChildren: ()=>import('./compensations/compensations.module').then(m=>CompensationsModule)},
  {path: 'compensation-categories', loadChildren: ()=>import('./compensation-categories/compensation-categories.module').then(m=>m.CompensationCategoriesModule)},
  {path: 'levels', loadChildren: ()=>import('./levels/levels.module').then(m=>m.LevelsModule)},
  {path: 'normativities', loadChildren: ()=>import('./normativities/normativities.module').then(m=>m.NormativitiesModule)},
  {path: 'appointments', loadChildren: ()=>import('./appointments/appointments.module').then(m=>m.AppointmentsModule)},
  {path: 'validities', loadChildren: ()=>import('./validities/validities.module').then(m=>m.ValiditiesModule)},
  {path: 'variables', loadChildren: ()=>import('./variables/variables.module').then(m=>m.VariablesModule)},
  {path: 'rules', loadChildren: ()=>import('./rules/rules.module').then(m=>m.RulesModule)},
  {path: 'level-compensations', loadChildren: ()=>import('./level-compensations/level-compensations.module').then(m=>m.LevelCompensationsModule)},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigurationsRoutingModule { }
