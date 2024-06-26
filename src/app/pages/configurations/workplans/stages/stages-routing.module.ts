import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {StageComponent} from "./stage/stage.component";
import {TaskComponent} from "./task/task.component";
import {StagesComponent} from "./stages.component";
import {ListComponent} from "./list/list.component";

const routes: Routes = [
  {path: '', component: StagesComponent, children: [
      {path: '', component: ListComponent},
      {path: 'create', component: StageComponent},
      {path: ':id', component: StageComponent},
      {path: 'task/create', component: TaskComponent},
      {path: 'task/:id', component: TaskComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StagesRoutingModule {
}
