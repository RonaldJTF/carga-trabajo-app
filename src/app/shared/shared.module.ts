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

import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { MenuItemComponent } from './menu-item/menu-item.component';
import { InputMaskModule } from 'primeng/inputmask';
import { MultiSelectModule } from "primeng/multiselect";

@NgModule({
  declarations: [
    FunctionalityComponent,
    MenuItemComponent,


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
        MenuItemComponent,
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

  //LPR: Agregó
    ToastModule,
    ToolbarModule,
    RatingModule,
    InputTextareaModule,
    DropdownModule,
    InputNumberModule,
    DialogModule,
    TableModule,
    MenuModule,
    DataViewModule,
    TagModule,
    InputMaskModule,
    MultiSelectModule,
  // LPR:FIN

  ], 
  exports: [
    FunctionalityComponent,
    MenuItemComponent,
    
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

    //LPR: Agregó
    ToastModule,
    ToolbarModule,
    RatingModule,
    InputTextareaModule,
    DropdownModule,
    InputNumberModule,
    DialogModule,
    TableModule,
    MenuModule,
    DataViewModule,
    TagModule,
    InputMaskModule,
    MultiSelectModule,
    //LPR: FIN
  ], 
  providers: []
})
export class SharedModule { }
