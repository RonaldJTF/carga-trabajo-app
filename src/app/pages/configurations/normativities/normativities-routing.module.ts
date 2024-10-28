import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NormativitiesComponent } from './normativities.component';
import { NormativityComponent } from './normativity/normativity.component';

const routes: Routes = [{
  path: '', component: NormativitiesComponent, children: [
    {path: 'create', component: NormativityComponent},
    {path: ':id', component: NormativityComponent},
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NormativitiesRoutingModule { }
