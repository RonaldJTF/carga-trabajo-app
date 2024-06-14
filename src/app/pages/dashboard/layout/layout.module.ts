import { NgModule } from '@angular/core';

import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { StructureResumeComponent } from './structure-resume/structure-resume.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ChartsComponent } from './charts/charts.component';
import {RippleModule} from "primeng/ripple";
import { WorkplanResumeComponent } from './workplan-resume/workplan-resume.component';


@NgModule({
  declarations: [
    LayoutComponent,StructureResumeComponent, ChartsComponent, WorkplanResumeComponent
  ],
    imports: [
        LayoutRoutingModule, SharedModule
    ]
})
export class LayoutModule { }
