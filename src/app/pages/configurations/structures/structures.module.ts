import { NgModule } from '@angular/core';

import { StructuresRoutingModule } from './structures-routing.module';
import { StructuresComponent } from './structures.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ListComponent } from './list/list.component';
import { StructureComponent } from './structure/structure.component';


@NgModule({
  declarations: [
    StructuresComponent,
    ListComponent,
    StructureComponent
  ],
  imports: [
    StructuresRoutingModule,
    SharedModule
  ]
})
export class StructuresModule { }
