import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NormativitiesComponent } from './normativities.component';
import { NormativityComponent } from './normativity/normativity.component';
import {adminGuard} from "@guards";

const routes: Routes = [{
  path: '', component: NormativitiesComponent, children: [
    {path: 'create', component: NormativityComponent, canActivate: [adminGuard]},
    {path: ':id', component: NormativityComponent, canActivate: [adminGuard]},
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NormativitiesRoutingModule { }
