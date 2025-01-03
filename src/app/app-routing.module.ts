import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {AppLayoutComponent} from './layout/app.layout.component';
import {adminOrOperatorGuard, authGuard, developerGuard} from '@guards';
import {NotFoundComponent} from './pages/not-found/not-found.component';

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot([
      { path: "account", loadChildren: () => import("./pages/account/account.module").then((m) => m.AccountModule)},
      {
        path: '',
        component: AppLayoutComponent,
        children: [
          { path: '', loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule),canActivate: [adminOrOperatorGuard]},
          { path: 'configurations', loadChildren: () => import('./pages/configurations/configurations.module').then(m => m.ConfigurationsModule), canActivate:[adminOrOperatorGuard]},
          { path: 'developer', loadChildren: () => import('./pages/developer/developer.module').then(m => m.DeveloperModule), canActivate: [developerGuard]},
        ],
     canActivate: [authGuard]},
      { path: '**', component: NotFoundComponent}
  ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
