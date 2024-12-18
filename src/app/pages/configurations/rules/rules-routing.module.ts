import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RulesComponent } from './rules.component';
import { ListComponent } from './list/list.component';
import { RuleComponent } from './rule/rule.component';
import {adminGuard} from "@guards";

const routes: Routes = [{
  path: '', component: RulesComponent, children: [
    {path: '', component: ListComponent},
    {path: 'create', component: RuleComponent, canActivate: [adminGuard]},
    {path: ':id', component: RuleComponent, canActivate: [adminGuard]},
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RulesRoutingModule { }
