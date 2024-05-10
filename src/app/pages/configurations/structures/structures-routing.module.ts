import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StructuresComponent } from './structures.component';
import { ListComponent } from './list/list.component';
import { StructureComponent } from './structure/structure.component';
import { adminGuard } from 'src/app/guards/admin.guard';

const routes: Routes = [
  {path: '', component: StructuresComponent, children: [
    {path: '', component: ListComponent},
    {path: 'create', component: StructureComponent, canActivate: [adminGuard]},
    {path: ':id', component: StructureComponent, canActivate: [adminGuard]},
    {path: 'action', loadChildren: ()=>import('./action/action.module').then(m=>m.ActionModule), canActivate: [adminGuard]}
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StructuresRoutingModule { }
