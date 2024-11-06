import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {StructuresComponent} from "../structures/structures.component";
import {ListComponent} from "./list/list.component";
import {FormCompensationComponent} from "./form-compensation/form-compensation.component";
import {FormCategoryComponent} from "./form-category/form-category.component";

const routes: Routes = [
  {path: '', component: StructuresComponent, children: [
      {path: '', component: ListComponent},
      {path: 'create', component: FormCompensationComponent},
      {path: 'create/:id', component: FormCompensationComponent},
      {path: 'category', component: FormCategoryComponent},
      {path: 'category/:id', component: FormCategoryComponent}
    ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompensationsRoutingModule { }
