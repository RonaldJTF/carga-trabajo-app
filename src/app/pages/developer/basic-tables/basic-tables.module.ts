import {NgModule} from '@angular/core';
import {BasicTablesRoutingModule} from './basic-tables-routing.module';
import {RolComponent} from './rol/rol.component';
import {BasicTablesComponent} from './basic-tables.component';
import {SharedModule} from "../../../shared/shared.module";
import { FormRolComponent } from './rol/form-rol/form-rol.component';
import { GenderComponent } from './gender/gender.component';
import {FormGenderComponent} from "./gender/form-gender/form-gender.component";

@NgModule({
  declarations: [
    RolComponent,
    BasicTablesComponent,
    FormRolComponent,
    GenderComponent,
    FormGenderComponent
  ],
  imports: [
    BasicTablesRoutingModule,
    SharedModule
  ]
})
export class BasicTablesModule {
}
