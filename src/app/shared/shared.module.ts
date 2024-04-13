import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AuthModule } from 'src/app/pages/account/auth/auth.module';
import { DarkenColorPipe } from '../pipes/darken-color/darken-color.pipe';
import { LightenColorPipe } from '../pipes/lighten-color/lighten-color.pipe';
import { FileSizePipe } from '../pipes/file-size/file-size.pipe';
import { CapitalizeFirstLetterPipe } from '../pipes/capitalize-first-letter/capitalize-first-letter.pipe';
import { FileIconPipe } from '../pipes/file-icon/file-icon.pipe';
import { FirstNamePipe } from '../pipes/first-name/first-name.pipe';
import { StatePipe } from '../pipes/state/state.pipe';
import { SanitizeHtmlPipe } from '../pipes/sanitize-html/sanitize-html.pipe';
import { PrettyDatePipe } from '../pipes/pretty-date/pretty-date.pipe';
import { TimeAgoPipe } from '../pipes/time-ago/time-ago.pipe';
import { ImageFallbackDirective } from '../directives/image-fallback.directive';
import { CommonModule } from '@angular/common';
import { MenuModule } from 'primeng/menu';
import { InputSwitchModule } from 'primeng/inputswitch';
import { BadgeModule } from 'primeng/badge';
import { TooltipModule } from 'primeng/tooltip';
import { RadioButtonModule } from 'primeng/radiobutton';
import { QuillModule } from 'ngx-quill';
import { SidebarModule } from 'primeng/sidebar';
import { AuthRoutingModule } from '../pages/account/auth/auth-routing.module';
import { FunctionalityComponent } from './funcionality/functionality.component';

@NgModule({
  declarations: [
    FunctionalityComponent,


    FirstNamePipe, 
    StatePipe, 
    FileSizePipe,
    SanitizeHtmlPipe,
    PrettyDatePipe,
    CapitalizeFirstLetterPipe,
    TimeAgoPipe,
    FileIconPipe,
    LightenColorPipe,
    DarkenColorPipe,


    ImageFallbackDirective,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    AuthRoutingModule,
    CheckboxModule,
    PasswordModule,
    ButtonModule,
    InputTextModule,
  ], 
  exports: [
    FunctionalityComponent,
    
    ImageFallbackDirective,
    
    FirstNamePipe, 
    StatePipe, 
    FileSizePipe,
    SanitizeHtmlPipe,
    PrettyDatePipe,
    CapitalizeFirstLetterPipe,
    TimeAgoPipe,
    FileIconPipe,
    LightenColorPipe,
    DarkenColorPipe,

    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    AuthRoutingModule,
    CheckboxModule,
    PasswordModule,
    ButtonModule,
    InputTextModule,
  ], 
  providers: []
})
export class SharedModule { }
