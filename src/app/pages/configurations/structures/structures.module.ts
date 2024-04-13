import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StructuresRoutingModule } from './structures-routing.module';
import { StructuresComponent } from './structures.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    StructuresComponent
  ],
  imports: [
    StructuresRoutingModule,
    SharedModule
  ]
})
export class StructuresModule { }
