import { NgModule } from '@angular/core';

import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ChartsComponent } from './charts/charts.component';


@NgModule({
  declarations: [
    LayoutComponent, ChartsComponent
  ],
    imports: [
        LayoutRoutingModule, SharedModule
    ]
})
export class LayoutModule { }
