import {NgModule} from '@angular/core';
import {ContentRoutingModule} from './content-routing.module';
import {ContentComponent} from './content.component';
import {ChartsComponent} from './charts/charts.component';
import {SharedModule} from "@shared";


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
