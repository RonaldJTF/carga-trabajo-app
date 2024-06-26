import { NgModule } from '@angular/core';
import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ListComponent } from './list/list.component';
import { FormPersonComponent } from './form-person/form-person.component';
import { FormUserPersonComponent } from './form-user-person/form-user-person.component';

@NgModule({
  declarations: [
    UsersComponent,
    ListComponent,
    FormPersonComponent,
    FormUserPersonComponent,
  ],
  imports: [UsersRoutingModule, SharedModule],
})
export class UsersModule {}
