import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ConfirmationService, MessageService } from 'primeng/api';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'src/environments/environment';
import { QuillModule } from 'ngx-quill';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { OkInterceptor } from './interceptors/ok.interceptor';
import { StorageService } from './services/storage.service';
import { AuthenticationService } from './services/auth.service';
import { CryptojsService } from './services/cryptojs.service';
import { AppLayoutModule } from './layout/app.layout.module';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { DashboardModule } from './pages/dashboard/dashboard.module';

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
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production
    }),
  ],
  providers: [
    MessageService, ConfirmationService, StorageService, AuthenticationService, CryptojsService, 
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: OkInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: 'es' },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
