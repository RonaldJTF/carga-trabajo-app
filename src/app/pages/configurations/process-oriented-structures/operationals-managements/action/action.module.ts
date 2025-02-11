import { NgModule } from '@angular/core';

import { ActionRoutingModule } from './action-routing.module';
import { ActivityComponent } from './activity/activity.component';
import {SharedModule} from "@shared";


@NgModule({
  declarations: [
    ActivityComponent,
  ],
  imports: [
    ActionRoutingModule,
    SharedModule
  ]
})
export class ActionModule { }
