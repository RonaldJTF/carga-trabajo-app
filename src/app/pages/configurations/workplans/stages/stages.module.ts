import { NgModule } from '@angular/core';

import { StagesRoutingModule } from './stages-routing.module';
import {SharedModule} from "../../../../shared/shared.module";
import {ListComponent} from "./list/list.component";
import {StageComponent} from "./stage/stage.component";
import {ActivityComponent} from "./activity/activity.component";
import { StagesComponent } from './stages.component';


@NgModule({
  declarations: [
    ListComponent,
    StageComponent,
    ActivityComponent,
    StagesComponent
  ],
  imports: [
    StagesRoutingModule,
    SharedModule,
  ]
})
export class StagesModule { }
