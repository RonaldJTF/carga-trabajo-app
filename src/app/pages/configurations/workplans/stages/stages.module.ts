import {NgModule} from '@angular/core';
import {StagesRoutingModule} from './stages-routing.module';
import {ListComponent} from "./list/list.component";
import {StageComponent} from "./stage/stage.component";
import {TaskComponent} from "./task/task.component";
import {StagesComponent} from './stages.component';
import {SharedModule} from "@shared";


@NgModule({
  declarations: [
    ListComponent,
    StageComponent,
    TaskComponent,
    StagesComponent
  ],
  imports: [
    StagesRoutingModule,
    SharedModule,
  ]
})
export class StagesModule {
}
