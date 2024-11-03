import { NgModule } from '@angular/core';

import { ValiditiesRoutingModule } from './validities-routing.module';
import { ValidityComponent } from './validity/validity.component';
import { ListComponent } from './list/list.component';
import { ValiditiesComponent } from './validities.component';
import { SharedModule } from '@shared';


@NgModule({
  declarations: [
    ValiditiesComponent,
    ValidityComponent,
    ListComponent
  ],
  imports: [
    ValiditiesRoutingModule,
    SharedModule
  ]
})
export class ValiditiesModule { }
