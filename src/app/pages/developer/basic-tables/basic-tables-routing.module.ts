import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RolComponent} from "./rol/rol.component";
import {BasicTablesComponent} from "./basic-tables.component";
import {FormRolComponent} from "./rol/form-rol/form-rol.component";
import {GenderComponent} from "./gender/gender.component";
import {FormGenderComponent} from "./gender/form-gender/form-gender.component";

const routes: Routes = [{
  path: '', component: BasicTablesComponent, children: [
    {path: 'rol', component: RolComponent},
    {path: 'create-role', component: FormRolComponent},
    {path: 'create-role/:id', component: FormRolComponent},
    {path: 'gender', component: GenderComponent},
    {path: 'create-gender', component: FormGenderComponent},
    {path: 'create-gender/:id', component: FormGenderComponent},
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BasicTablesRoutingModule {
}
