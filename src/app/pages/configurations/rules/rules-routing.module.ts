import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RulesComponent } from './rules.component';
import { ListComponent } from './list/list.component';
import { RuleComponent } from './rule/rule.component';

const routes: Routes = [{
  path: '', component: RulesComponent, children: [
    {path: '', component: ListComponent},
    {path: 'create', component: RuleComponent},
    {path: ':id', component: RuleComponent},
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RulesRoutingModule { }
