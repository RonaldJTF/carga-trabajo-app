import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BasicTablesComponent} from "./basic-tables.component";
import {GenderComponent} from "./gender/gender.component";
import {FormGenderComponent} from "./gender/form-gender/form-gender.component";
import {RoleComponent} from "./role/role.component";
import {FormRoleComponent} from "./role/form-role/form-role.component";
import {LevelComponent} from "./level/level.component";
import {FormLevelComponent} from "./level/form-level/form-level.component";
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
import { CategoryComponent } from './category/category.component';
import { FormCategoryComponent } from './category/form-category/form-category.component';
import { PeriodicityComponent } from './periodicity/periodicity.component';
import { FormPeriodicityComponent } from './periodicity/form-periodicity/form-periodicity.component';

const routes: Routes = [{
  path: '', component: BasicTablesComponent, children: [
    {path: '', component: WarningComponent},
    {path: 'rol', component: RoleComponent},
    {path: 'create-role', component: FormRoleComponent},
    {path: 'create-role/:id', component: FormRoleComponent},
    {path: 'gender', component: GenderComponent},
    {path: 'create-gender', component: FormGenderComponent},
    {path: 'create-gender/:id', component: FormGenderComponent},
    {path: 'level', component: LevelComponent},
    {path: 'create-level', component: FormLevelComponent},
    {path: 'create-level/:id', component: FormLevelComponent},
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
    {path: 'category', component: CategoryComponent},
    {path: 'create-category', component: FormCategoryComponent},
    {path: 'create-category/:id', component: FormCategoryComponent},
    {path: 'periodicity', component: PeriodicityComponent},
    {path: 'create-periodicity', component: FormPeriodicityComponent},
    {path: 'create-periodicity/:id', component: FormPeriodicityComponent}
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BasicTablesRoutingModule {
}
