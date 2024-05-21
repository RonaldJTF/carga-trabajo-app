import { NgModule } from '@angular/core';

import { ActionRoutingModule } from './action-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ActivityComponent } from './activity/activity.component';


@NgModule({
  declarations: [
    ActivityComponent
  ],
  imports: [
    ActionRoutingModule,
    SharedModule
  ]
})
export class ActionModule { }
