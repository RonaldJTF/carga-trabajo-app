import {NgModule} from '@angular/core';
import {LevelCompensationRoutingModule} from './level-compensation-routing.module';
import {LevelCompensationComponent} from './level-compensation.component';
import { ListComponent } from './list/list.component';
import {SharedModule} from "@shared";
import { FormLevelCompensationComponent } from './form-level-compensation/form-level-compensation.component';


@NgModule({
  declarations: [
    LevelCompensationComponent,
    ListComponent,
    FormLevelCompensationComponent
  ],
  imports: [
    LevelCompensationRoutingModule,
    SharedModule
  ]
})
export class LevelCompensationModule {
}
