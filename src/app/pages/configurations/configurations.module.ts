import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigurationsRoutingModule } from './configurations-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { UsersComponent } from './users/users.component';
import { ListComponent } from './users/list/list.component';


@NgModule({
  declarations: [],
  imports: [
    ConfigurationsRoutingModule,
    SharedModule
  ]
})
export class ConfigurationsModule { }
