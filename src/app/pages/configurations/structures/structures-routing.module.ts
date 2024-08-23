import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StructuresComponent } from './structures.component';
import { ListComponent } from './list/list.component';
import { adminGuard } from '@guards';

const routes: Routes = [
  {path: '', component: StructuresComponent, children: [
    {path: '', component: ListComponent},
    {path: 'action', loadChildren: ()=>import('./action/action.module').then(m=>m.ActionModule), canActivate: [adminGuard]}
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StructuresRoutingModule { }
