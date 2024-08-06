import { NgModule } from '@angular/core';
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
import { StoreModule } from '@ngrx/store';
import { StructureService } from './services/structure.service';
import { structureReducer } from './store/structure.reducer';
import { LevelService } from './services/level.service';
import { DashboardService } from './services/dashboard.service';
import { DocumentTypeService } from './services/documenttype.service';
import { GenderService } from './services/gender.service';
import { PersonService } from './services/person.service';
import { UserService } from './services/user.service';
import { MatrizlevantamientoService } from './services/matrizlevantamiento.service';
import {workplanReducer} from "./store/workplan.reducer";
import { WorkplanService } from './services/workplan.service';
import { stageReducer } from './store/stage.reducer';
import { MediaService } from './services/media.service';
import {UrlService} from "./services/url.service";
import {RippleModule} from "primeng/ripple";
import {ChangePasswordService} from "./pages/configurations/users/change-password/service/change-password.service";

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
    StructureService, LevelService, DashboardService, DocumentTypeService, GenderService, PersonService,
    UserService, MatrizlevantamientoService, WorkplanService, UrlService, ChangePasswordService,
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: OkInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
