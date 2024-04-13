import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [RouterModule.forChild([
    { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  ])],
  exports: []
})
export class AccountRoutingModule { }
