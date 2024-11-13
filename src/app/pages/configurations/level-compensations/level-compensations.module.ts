import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LevelCompensationsRoutingModule } from './level-compensations-routing.module';
import { LevelCompensationsComponent } from './level-compensations.component';
import { ListComponent } from './list/list.component';
import { LevelCompensationComponent } from './level-compensation/level-compensation.component';
import { SharedModule } from '@shared';


@NgModule({
  declarations: [
    LevelCompensationsComponent,
    ListComponent,
    LevelCompensationComponent
  ],
  imports: [
    LevelCompensationsRoutingModule,
    SharedModule
  ]
})
export class LevelCompensationsModule { }
