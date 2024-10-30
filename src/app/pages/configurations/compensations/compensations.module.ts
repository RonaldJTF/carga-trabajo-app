import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CompensationsRoutingModule} from './compensations-routing.module';
import {CompensationsComponent} from './compensations.component';
import {SharedModule} from "@shared";
import {ListComponent} from './list/list.component';
import {FormCompensationComponent} from './form-compensation/form-compensation.component';
import {BasicTablesModule} from "../../developer/basic-tables/basic-tables.module";
import { FormCategoryComponent } from './form-category/form-category.component';


@NgModule({
  declarations: [
    CompensationsComponent,
    ListComponent,
    FormCompensationComponent,
    FormCategoryComponent
  ],
  imports: [
    CommonModule,
    CompensationsRoutingModule,
    SharedModule,
    BasicTablesModule
  ]
})
export class CompensationsModule {
}
