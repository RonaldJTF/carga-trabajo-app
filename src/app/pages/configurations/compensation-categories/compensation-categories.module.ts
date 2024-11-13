import { NgModule } from '@angular/core';

import { CompensationCategoriesRoutingModule } from './compensation-categories-routing.module';
import { CompensationCategoriesComponent } from './compensation-categories.component';
import { CompensationCategoryComponent } from './compensation-category/compensation-category.component';
import { SharedModule } from '@shared';


@NgModule({
  declarations: [
    CompensationCategoriesComponent,
    CompensationCategoryComponent
  ],
  imports: [
    CompensationCategoriesRoutingModule,
    SharedModule
  ]
})
export class CompensationCategoriesModule { }
