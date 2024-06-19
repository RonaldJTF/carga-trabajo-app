import { NgModule } from '@angular/core';

import { ContentRoutingModule } from './content-routing.module';
import { ContentComponent } from './content.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ChartsComponent } from './charts/charts.component';


@NgModule({
  declarations: [
    ContentComponent, ChartsComponent
  ],
  imports: [
    ContentRoutingModule, SharedModule
  ]
})
export class ContentModule {
}
