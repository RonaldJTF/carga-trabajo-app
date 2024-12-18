import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompensationCategoryComponent } from './compensation-category/compensation-category.component';
import { CompensationCategoriesComponent } from './compensation-categories.component';
import {adminGuard} from "@guards";

const routes: Routes = [
  {path: '', component: CompensationCategoriesComponent, children: [
      {path: 'create', component: CompensationCategoryComponent, canActivate: [adminGuard]},
      {path: ':id', component: CompensationCategoryComponent, canActivate: [adminGuard]},
    ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompensationCategoriesRoutingModule { }
