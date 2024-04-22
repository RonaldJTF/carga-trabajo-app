import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StructuresComponent } from './structures.component';
import { ListComponent } from './list/list.component';
import { StructureComponent } from './structure/structure.component';

const routes: Routes = [
  {path: '', component: StructuresComponent, children: [
    {path: '', component: ListComponent},
    {path: 'create', component: StructureComponent},
    {path: ':id', component: StructureComponent}
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StructuresRoutingModule { }
