import { NgModule } from '@angular/core';

import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { HeardPageComponent } from './heard-page/heard-page.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ChartsComponent } from './charts/charts.component';
import {RippleModule} from "primeng/ripple";


@NgModule({
  declarations: [
    LayoutComponent,HeardPageComponent, ChartsComponent
  ],
    imports: [
        LayoutRoutingModule, SharedModule
    ]
})
export class LayoutModule { }
