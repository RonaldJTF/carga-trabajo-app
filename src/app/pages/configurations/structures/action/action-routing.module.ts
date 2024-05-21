import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActivityComponent } from './activity/activity.component';

const routes: Routes = [
  { path: 'activity',   component: ActivityComponent },
  { path: 'activity/:idActivity',   component: ActivityComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActionRoutingModule { }
