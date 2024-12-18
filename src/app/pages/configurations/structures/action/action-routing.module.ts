import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActivityComponent } from './activity/activity.component';
import { NoDependencyComponent } from './no-dependency/no-dependency.component';
import { DependencyComponent } from './dependency/dependency.component';
import {adminGuard} from "@guards";

const routes: Routes = [
  { path: 'activity',   component: ActivityComponent },
  { path: 'dependency',   component: DependencyComponent, canActivate: [adminGuard] },
  { path: 'dependency/:id',   component: DependencyComponent, canActivate: [adminGuard] },
  { path: 'no-dependency',   component: NoDependencyComponent, canActivate: [adminGuard] },
  { path: 'no-dependency/:id',   component: NoDependencyComponent, canActivate: [adminGuard] },
  { path: 'sub-item',   component: NoDependencyComponent, canActivate: [adminGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActionRoutingModule { }
