import { NgModule } from '@angular/core';

import { ProcessOrientedStructuresRoutingModule } from './process-oriented-structures-routing.module';
import { SharedModule } from '@shared';
import { ProcessOrientedStructuresComponent } from './process-oriented-structures.component';

@NgModule({
  declarations: [ProcessOrientedStructuresComponent],
  imports: [
    ProcessOrientedStructuresRoutingModule,
    SharedModule
  ]
})
export class ProcessOrientedStructuresModule { }
