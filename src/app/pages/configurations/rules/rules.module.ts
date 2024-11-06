import { NgModule } from '@angular/core';

import { RulesRoutingModule } from './rules-routing.module';
import { RulesComponent } from './rules.component';
import { RuleComponent } from './rule/rule.component';
import { ListComponent } from './list/list.component';
import { SharedModule } from '@shared';


@NgModule({
  declarations: [
    RulesComponent,
    RuleComponent,
    ListComponent
  ],
  imports: [
    RulesRoutingModule,
    SharedModule
  ]
})
export class RulesModule { }
