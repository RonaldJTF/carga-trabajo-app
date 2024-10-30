import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalaryScalesRoutingModule } from './salary-scales-routing.module';
import { ListComponent } from './list/list.component';


@NgModule({
  declarations: [
    ListComponent
  ],
  imports: [
    CommonModule,
    SalaryScalesRoutingModule
  ]
})
export class SalaryScalesModule { }
