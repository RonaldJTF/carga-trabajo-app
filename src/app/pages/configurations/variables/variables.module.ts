import { NgModule } from '@angular/core';

import { VariablesRoutingModule } from './variables-routing.module';
import { VariablesComponent } from './variables.component';
import { VariableComponent } from './variable/variable.component';
import { ListComponent } from './list/list.component';
import { SharedModule } from '@shared';


@NgModule({
  declarations: [
    VariablesComponent,
    VariableComponent,
    ListComponent
  ],
  imports: [
    VariablesRoutingModule,
    SharedModule
  ]
})
export class VariablesModule { }
