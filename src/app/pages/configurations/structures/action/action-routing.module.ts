import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActivityComponent } from './activity/activity.component';
import { NoDependencyComponent } from './no-dependency/no-dependency.component';
import { DependencyComponent } from './dependency/dependency.component';

const routes: Routes = [
  { path: 'activity',   component: ActivityComponent },
  { path: 'dependency',   component: DependencyComponent },
  { path: 'dependency/:id',   component: DependencyComponent },
  { path: 'no-dependency',   component: NoDependencyComponent },
  { path: 'no-dependency/:id',   component: NoDependencyComponent },
  { path: 'sub-item',   component: NoDependencyComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActionRoutingModule { }
