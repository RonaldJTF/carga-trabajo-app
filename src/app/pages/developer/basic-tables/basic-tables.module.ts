import {NgModule} from '@angular/core';
import {BasicTablesRoutingModule} from './basic-tables-routing.module';
import {BasicTablesComponent} from './basic-tables.component';
import {GenderComponent} from './gender/gender.component';
import {FormGenderComponent} from "./gender/form-gender/form-gender.component";
import {FormRoleComponent} from "./role/form-role/form-role.component";
import {RoleComponent} from "./role/role.component";
import {TypologyComponent} from './typology/typology.component';
import {FormTypologyComponent} from './typology/form-typology/form-typology.component';
import {FtpComponent} from './ftp/ftp.component';
import {FormFtpComponent} from './ftp/form-ftp/form-ftp.component';
import {FormActionComponent} from './action/form-action/form-action.component';
import {TypologyActionComponent} from './typology-action/typology-action.component';
import {ListComponent} from "./typology-action/actions/list/list.component";
import {ActionComponent} from "./action/action.component";
import {FormComponent} from './typology-action/actions/form/form.component';
import {SharedModule} from "@shared";
import {DocumentTypeComponent} from './document/document-type.component';
import {FormDocumentTypeComponent} from './document/form-document/form-document-type.component';
import { ScopeComponent } from './scope/scope.component';
import { FormScopeComponent } from './scope/form-scope/form-scope.component';
import { PeriodicityComponent } from './periodicity/periodicity.component';
import { FormPeriodicityComponent } from './periodicity/form-periodicity/form-periodicity.component';

@NgModule({
  declarations: [
    BasicTablesComponent,
    RoleComponent,
    FormRoleComponent,
    GenderComponent,
    FormGenderComponent,
    TypologyComponent,
    FormTypologyComponent,
    FtpComponent,
    FormFtpComponent,
    FormActionComponent,
    TypologyActionComponent,
    ListComponent,
    ActionComponent,
    FormComponent,
    DocumentTypeComponent,
    FormDocumentTypeComponent,
    ScopeComponent,
    FormScopeComponent,
    PeriodicityComponent,
    FormPeriodicityComponent
  ],
  imports: [BasicTablesRoutingModule, SharedModule]
})
export class BasicTablesModule {
}
