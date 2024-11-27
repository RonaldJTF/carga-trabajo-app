import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BasicTablesComponent} from "./basic-tables.component";
import {GenderComponent} from "./gender/gender.component";
import {FormGenderComponent} from "./gender/form-gender/form-gender.component";
import {RoleComponent} from "./role/role.component";
import {FormRoleComponent} from "./role/form-role/form-role.component";
import {TypologyComponent} from "./typology/typology.component";
import {FormTypologyComponent} from "./typology/form-typology/form-typology.component";
import {FtpComponent} from "./ftp/ftp.component";
import {FormFtpComponent} from "./ftp/form-ftp/form-ftp.component";
import {ActionComponent} from "./action/action.component";
import {FormActionComponent} from "./action/form-action/form-action.component";
import {TypologyActionComponent} from "./typology-action/typology-action.component";
import {ListComponent} from "./typology-action/actions/list/list.component";
import {FormComponent} from "./typology-action/actions/form/form.component";
import {WarningComponent} from "../../../shared/warning/warning.component";
import {DocumentTypeComponent} from './document/document-type.component';
import {FormDocumentTypeComponent} from './document/form-document/form-document-type.component';
import { ScopeComponent } from './scope/scope.component';
import { FormScopeComponent } from './scope/form-scope/form-scope.component';
import { PeriodicityComponent } from './periodicity/periodicity.component';
import { FormPeriodicityComponent } from './periodicity/form-periodicity/form-periodicity.component';
import { NormativityTypeComponent } from './normativity-tipe/normativity-type.component';
import { FormNormativityTypeComponent } from './normativity-tipe/form-normativity-type/form-normativity-type.component';
import { PrimaryVariableComponent } from './primary-variable/primary-variable.component';
import { FormPrimaryVariableComponent } from './primary-variable/form-primary-variable/form-primary-variable.component';

const routes: Routes = [{
  path: '', component: BasicTablesComponent, children: [
    {path: '', component: WarningComponent},
    {path: 'rol', component: RoleComponent},
    {path: 'create-role', component: FormRoleComponent},
    {path: 'create-role/:id', component: FormRoleComponent},
    {path: 'gender', component: GenderComponent},
    {path: 'create-gender', component: FormGenderComponent},
    {path: 'create-gender/:id', component: FormGenderComponent},
    {path: 'typology', component: TypologyComponent},
    {path: 'create-typology', component: FormTypologyComponent},
    {path: 'create-typology/:id', component: FormTypologyComponent},
    {path: 'ftp', component: FtpComponent},
    {path: 'create-ftp', component: FormFtpComponent},
    {path: 'create-ftp/:id', component: FormFtpComponent},
    {path: 'action', component: ActionComponent},
    {path: 'create-action', component: FormActionComponent},
    {path: 'create-action/:id', component: FormActionComponent},
    {
      path: 'typology-action', component: TypologyActionComponent, children: [
        {path: 'list', component: ListComponent},
        {path: 'form', component: FormComponent},
      ]
    },
    {path: 'document-type', component: DocumentTypeComponent},
    {path: 'create-document-type', component: FormDocumentTypeComponent},
    {path: 'create-document-type/:id', component: FormDocumentTypeComponent },
    {path: 'scope', component: ScopeComponent},
    {path: 'create-scope', component: FormScopeComponent},
    {path: 'create-scope/:id', component:FormScopeComponent},
    {path: 'periodicity', component: PeriodicityComponent},
    {path: 'create-periodicity', component: FormPeriodicityComponent},
    {path: 'create-periodicity/:id', component: FormPeriodicityComponent},
    {path: 'normativity-type', component: NormativityTypeComponent},
    {path: 'create-normativity-type', component: FormNormativityTypeComponent},
    {path: 'create-normativity-type/:id', component: FormNormativityTypeComponent},
    {path: 'primary-variable', component: PrimaryVariableComponent},
    {path: 'create-primary-variable', component: FormPrimaryVariableComponent},
    {path: 'create-primary-variable/:id', component: FormPrimaryVariableComponent},
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BasicTablesRoutingModule {
}
