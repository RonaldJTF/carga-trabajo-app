import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LevelsComponent } from './levels.component';
import { ListComponent } from './list/list.component';
import { LevelComponent } from './level/level.component';
import {adminGuard} from "@guards";


const routes: Routes = [{
  path: '', component: LevelsComponent, children: [
    {path: '', component: ListComponent},
    {path: 'create', component: LevelComponent, canActivate: [adminGuard]},
    {path: ':id', component: LevelComponent, canActivate: [adminGuard]},
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LevelsRoutingModule { }
