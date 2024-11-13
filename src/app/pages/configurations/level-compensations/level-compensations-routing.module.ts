import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LevelCompensationsComponent } from './level-compensations.component';
import { ListComponent } from './list/list.component';
import { LevelCompensationComponent } from './level-compensation/level-compensation.component';

const routes: Routes = [
  {path: '', component: LevelCompensationsComponent, children: [
      {path: '', component: ListComponent},
      {path: 'create', component: LevelCompensationComponent},
      {path: ':id', component: LevelCompensationComponent},
    ]}
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LevelCompensationsRoutingModule { }
