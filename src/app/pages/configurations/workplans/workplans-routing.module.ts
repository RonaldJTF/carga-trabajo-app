import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {WorkplansComponent} from "./workplans.component";
import {WorkplanComponent} from "./workplan/workplan.component";
import {ListComponent} from "./list/list.component";

const routes: Routes = [{
  path: '', component: WorkplansComponent, children: [
    {path: '', component: ListComponent},
    {path: 'stages', loadChildren: ()=>import('./stages/stages.module').then(m=>m.StagesModule)},
    {path: 'create', component: WorkplanComponent},
    {path: ':id', component: WorkplanComponent},
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkplansRoutingModule {
}
