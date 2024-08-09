import { NgModule } from '@angular/core';

import { ActionRoutingModule } from './action-routing.module';
import { ActivityComponent } from './activity/activity.component';
import { NoDependencyComponent } from './no-dependency/no-dependency.component';
import { DependencyComponent } from './dependency/dependency.component';
import {SharedModule} from "@shared";


@NgModule({
  declarations: [
    ActivityComponent,
    NoDependencyComponent,
    DependencyComponent
  ],
  imports: [
    ActionRoutingModule,
    SharedModule
  ]
})
export class ActionModule { }
