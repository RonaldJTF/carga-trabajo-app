import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompensationCategoryComponent } from './compensation-category/compensation-category.component';
import { CompensationCategoriesComponent } from './compensation-categories.component';

const routes: Routes = [
  {path: '', component: CompensationCategoriesComponent, children: [
      {path: 'create', component: CompensationCategoryComponent},
      {path: ':id', component: CompensationCategoryComponent},
    ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompensationCategoriesRoutingModule { }
