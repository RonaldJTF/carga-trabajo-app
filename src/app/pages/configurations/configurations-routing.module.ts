import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {adminGuard} from "../../guards/admin.guard";

const routes: Routes = [
  {path: 'structures', loadChildren: ()=>import('./structures/structures.module').then(m=>m.StructuresModule)},
  {path: 'users', loadChildren: ()=>import('./users/users.module').then(m=>m.UsersModule), canActivate: [adminGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigurationsRoutingModule { }
