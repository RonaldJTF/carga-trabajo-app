import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
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
import { DataViewModule } from 'primeng/dataview';
import { AuthRoutingModule } from '../pages/account/auth/auth-routing.module';
import { FunctionalityComponent } from './funcionality/functionality.component';
import { GoToIfNotFoundComponent } from './go-to-if-not-found/go-to-if-not-found.component';
import { MenuItemComponent } from './menu-item/menu-item.component';
import { DividerModule } from 'primeng/divider';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PanelModule } from 'primeng/panel';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { TreeTableModule} from 'primeng/treetable';
import { NoResultComponent } from './no-result/no-result.component';
import { LabelValueChartComponent } from './charts/label-value-chart/label-value-chart.component';
import { FileUploadModule } from 'primeng/fileupload'
import { FormActionButtonComponent } from './form-action-button/form-action-button.component';
import { InputTextareaModule } from "primeng/inputtextarea";
import { TimeComponent } from './time/time.component';
import { DropdownModule } from 'primeng/dropdown';
import { BadgeModule } from 'primeng/badge';
import { PluralizePipe } from '../pipes/pluralize/pluralize.pipe';
import { SkeletonModule } from 'primeng/skeleton';
import { SkeletonListGridComponent } from './skeleton/skeleton-list-grid/skeleton-list-grid.component';
import { TimeNamePipe } from '../pipes/time-name/time-name.pipe';
import { ListboxModule } from 'primeng/listbox';

@NgModule({
  declarations: [
    FunctionalityComponent,
    GoToIfNotFoundComponent,
    MenuItemComponent,
    NoResultComponent,
    LabelValueChartComponent,
    FormActionButtonComponent,
    TimeComponent,
    SkeletonListGridComponent,

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
    PluralizePipe,
    TimeNamePipe,

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
    DataViewModule,
    DividerModule,
    OverlayPanelModule,
    PanelModule,
    MenuModule,
    TableModule,
    TreeTableModule,
    FileUploadModule,
    InputTextareaModule,
    DropdownModule,
    BadgeModule,
    SkeletonModule,
    ListboxModule,
  ], 
  exports: [
    FunctionalityComponent,
    GoToIfNotFoundComponent,
    MenuItemComponent,
    NoResultComponent,
    LabelValueChartComponent,
    FormActionButtonComponent,
    TimeComponent,
    SkeletonListGridComponent,

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
    PluralizePipe,
    TimeNamePipe,

    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    AuthRoutingModule,
    CheckboxModule,
    PasswordModule,
    ButtonModule,
    InputTextModule,
    DataViewModule,
    DividerModule,
    OverlayPanelModule,
    PanelModule,
    MenuModule,
    TableModule,
    TreeTableModule,
    FileUploadModule,
    InputTextareaModule,
    DropdownModule,
    BadgeModule,
    SkeletonModule,
    ListboxModule,
  ], 
  providers: []
})
export class SharedModule { }
