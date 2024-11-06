import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path: 'structures', loadChildren: ()=>import('./structures/structures.module').then(m=>m.StructuresModule)},
  {path: 'users', loadChildren: ()=>import('./users/users.module').then(m=>m.UsersModule)},
  {path: 'workplans', loadChildren: ()=>import('./workplans/workplans.module').then(m=>m.WorkplansModule)},
  {path: 'levels', loadChildren: ()=>import('./levels/levels.module').then(m=>m.LevelsModule)},
  {path: 'normativities', loadChildren: ()=>import('./normativities/normativities.module').then(m=>m.NormativitiesModule)},
  {path: 'appointments', loadChildren: ()=>import('./appointments/appointments.module').then(m=>m.AppointmentsModule)},
  {path: 'validities', loadChildren: ()=>import('./validities/validities.module').then(m=>m.ValiditiesModule)},
  {path: 'variables', loadChildren: ()=>import('./variables/variables.module').then(m=>m.VariablesModule)},
  {path: 'rules', loadChildren: ()=>import('./rules/rules.module').then(m=>m.RulesModule)},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigurationsRoutingModule { }
