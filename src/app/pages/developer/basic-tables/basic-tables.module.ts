import {NgModule} from '@angular/core';
import {BasicTablesRoutingModule} from './basic-tables-routing.module';
import {BasicTablesComponent} from './basic-tables.component';
import {GenderComponent} from './gender/gender.component';
import {FormGenderComponent} from "./gender/form-gender/form-gender.component";
import {FormRoleComponent} from "./role/form-role/form-role.component";
import {RoleComponent} from "./role/role.component";
import {LevelComponent} from './level/level.component';
import {FormLevelComponent} from './level/form-level/form-level.component';
import {DocumentTypeComponent} from './document-type/document-type.component';
import {FormDocumentTypeComponent} from './document-type/form-document-type/form-document-type.component';
import {TypologyComponent} from './typology/typology.component';
import {FormTypologyComponent} from './typology/form-typology/form-typology.component';
import {FtpComponent} from './ftp/ftp.component';
import {FormFtpComponent} from './ftp/form-ftp/form-ftp.component';
import {FormActionComponent} from './action/form-action/form-action.component';
import {TypologyActionComponent} from './typology-action/typology-action.component';
import {SharedModule} from "../../../shared/shared.module";
import {ListComponent} from "./typology-action/actions/list/list.component";
import {ActionComponent} from "./action/action.component";
import { FormComponent } from './typology-action/actions/form/form.component';

@NgModule({
  declarations: [
    BasicTablesComponent,
    RoleComponent,
    FormRoleComponent,
    GenderComponent,
    FormGenderComponent,
    LevelComponent,
    FormLevelComponent,
    DocumentTypeComponent,
    FormDocumentTypeComponent,
    TypologyComponent,
    FormTypologyComponent,
    FtpComponent,
    FormFtpComponent,
    FormActionComponent,
    TypologyActionComponent,
    ListComponent,
    ActionComponent,
    FormComponent
  ],
  imports: [
    BasicTablesRoutingModule,
    SharedModule
  ]
})
export class BasicTablesModule {
}