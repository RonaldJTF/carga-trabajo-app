import { NgModule } from '@angular/core';

import { ActionRoutingModule } from './action-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { TaskComponent } from './task/task.component';


@NgModule({
  declarations: [
    TaskComponent
  ],
  imports: [
    ActionRoutingModule,
    SharedModule
  ]
})
export class ActionModule { }
