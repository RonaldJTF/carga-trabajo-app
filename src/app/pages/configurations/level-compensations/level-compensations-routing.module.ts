import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LevelCompensationsComponent } from './level-compensations.component';
import { ListComponent } from './list/list.component';
import { LevelCompensationComponent } from './level-compensation/level-compensation.component';
import {adminGuard} from "@guards";

const routes: Routes = [
  {path: '', component: LevelCompensationsComponent, children: [
      {path: '', component: ListComponent},
      {path: 'create', component: LevelCompensationComponent, canActivate: [adminGuard]},
      {path: ':id', component: LevelCompensationComponent, canActivate: [adminGuard]},
    ]}
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LevelCompensationsRoutingModule { }
