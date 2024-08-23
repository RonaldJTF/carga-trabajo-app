import { NgModule } from '@angular/core';
import { StructuresRoutingModule } from './structures-routing.module';
import { StructuresComponent } from './structures.component';
import { ListComponent } from './list/list.component';
import {SharedModule} from "@shared";


@NgModule({
  declarations: [
    StructuresComponent,
    ListComponent,
  ],
  imports: [
    StructuresRoutingModule,
    SharedModule
  ]
})
export class StructuresModule { }
