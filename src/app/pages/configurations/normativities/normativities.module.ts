import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NormativitiesRoutingModule } from './normativities-routing.module';
import { SharedModule } from '@shared';
import { NormativityComponent } from './normativity/normativity.component';
import { NormativitiesComponent } from './normativities.component';


@NgModule({
  declarations: [
    NormativityComponent,
    NormativitiesComponent
  ],
  imports: [
    NormativitiesRoutingModule,
    SharedModule
  ]
})
export class NormativitiesModule { }
