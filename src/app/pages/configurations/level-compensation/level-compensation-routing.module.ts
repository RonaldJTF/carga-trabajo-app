import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LevelCompensationComponent} from "./level-compensation.component";
import {ListComponent} from "./list/list.component";
import {FormLevelCompensationComponent} from "./form-level-compensation/form-level-compensation.component";

const routes: Routes = [
  {
    path: '', component: LevelCompensationComponent, children: [
      {path: '', component: ListComponent},
      {path: 'create', component: FormLevelCompensationComponent},
      {path: 'create/:id', component: FormLevelCompensationComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LevelCompensationRoutingModule {
}
