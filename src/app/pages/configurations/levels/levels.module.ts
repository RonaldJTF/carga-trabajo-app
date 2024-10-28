import { NgModule } from '@angular/core';

import { LevelsRoutingModule } from './levels-routing.module';
import { SharedModule } from '@shared';
import { LevelsComponent } from './levels.component';
import { ListComponent } from './list/list.component';
import { LevelComponent } from './level/level.component';

@NgModule({
  declarations: [
    LevelsComponent,
    ListComponent,
    LevelComponent
  ],
  imports: [
    LevelsRoutingModule,
    SharedModule
  ]
})
export class LevelsModule { }
