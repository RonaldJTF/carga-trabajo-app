import {APP_INITIALIZER, ErrorHandler, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {ConfirmationService, MessageService} from 'primeng/api';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {ToastModule} from 'primeng/toast';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {environment} from 'src/environments/environment';
import {QuillModule} from 'ngx-quill';
import {ErrorInterceptor, OkInterceptor} from '@interceptors';
import {
  AuthenticationService,
  ChangePasswordService,
  CryptojsService,
  DashboardService,
  DocumentTypeService,
  GenderService,
  LevelService,
  MatrizlevantamientoService,
  MediaService,
  PersonService,
  SentryInitService,
  StorageService,
  StructureService,
  UrlService,
  UserService,
  WorkplanService,
  ScopeService,
  PeriodicityService,
  CategoryService
} from '@services';
import {AppLayoutModule} from './layout/app.layout.module';
import {NotFoundComponent} from './pages/not-found/not-found.component';
import {DashboardModule} from './pages/dashboard/dashboard.module';
import {StoreModule} from '@ngrx/store';
import {structureReducer} from '@store/structure.reducer';
import {workplanReducer} from "@store/workplan.reducer";
import {stageReducer} from '@store/stage.reducer';
import {RippleModule} from "primeng/ripple";
import * as Sentry from "@sentry/angular";
import {Router} from "@angular/router";
import {DialogService} from "primeng/dynamicdialog";



@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AppLayoutModule,
    DashboardModule,
    ToastModule,
    ConfirmDialogModule,
    QuillModule.forRoot(),
    StoreModule.forRoot({structure: structureReducer, workplan: workplanReducer, stage: stageReducer}),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production
    }),
    RippleModule,
  ],
  providers: [
    MessageService, ConfirmationService, StorageService, AuthenticationService, CryptojsService, MediaService,
    StructureService, LevelService, DashboardService, DocumentTypeService, ScopeService, PeriodicityService, CategoryService, GenderService, PersonService,
    UserService, MatrizlevantamientoService, WorkplanService, UrlService, ChangePasswordService, SentryInitService, DialogService,
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: OkInterceptor, multi: true},
    {provide: ErrorHandler, useValue: Sentry.createErrorHandler({showDialog: false})},
    {provide: Sentry.TraceService, deps: [Router]},
    {provide: APP_INITIALIZER, useFactory: () => () => {}, deps: [Sentry.TraceService], multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
