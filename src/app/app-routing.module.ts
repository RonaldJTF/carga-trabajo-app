import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppLayoutComponent } from './layout/app.layout.component';
import { authGuard } from './guards/auth.guard';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot([
      { path: "account", loadChildren: () => import("./pages/account/account.module").then((m) => m.AccountModule)},
      { path: '',
        component: AppLayoutComponent,
        children: [
          {path: '', loadChildren: ()=>import('./pages/dashboard/dashboard.module').then(m=>m.DashboardModule)},
          {path: 'configurations', loadChildren: ()=>import('./pages/configurations/configurations.module').then(m=>m.ConfigurationsModule)}
        ],
        canActivate: [authGuard]},
      { path: '**', component: NotFoundComponent}
  ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
