import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LevelsComponent } from './levels.component';
import { ListComponent } from './list/list.component';
import { LevelComponent } from './level/level.component';


const routes: Routes = [{
  path: '', component: LevelsComponent, children: [
    {path: '', component: ListComponent},
    {path: 'create', component: LevelComponent},
    {path: ':id', component: LevelComponent},
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LevelsRoutingModule { }
