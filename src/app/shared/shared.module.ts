import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CheckboxModule} from 'primeng/checkbox';
import {PasswordModule} from 'primeng/password';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {
  ActivityExpirationPipe, CapitalizeFirstLetterPipe, DarkenColorPipe, DateRangePipe, FileIconPipe, FileSizePipe,
  FirstNamePipe, LightenColorPipe, PluralizePipe, PrettyDatePipe, SanitizeHtmlPipe, StatePipe, TimeAgoPipe, TimeNamePipe
} from '@pipes';
import {ImageFallbackDirective, SvgColorDirective} from '@directives';
import {CommonModule} from '@angular/common';
import {DataViewModule} from 'primeng/dataview';
import {AuthRoutingModule} from '../pages/account/auth/auth-routing.module';
import {FunctionalityComponent} from './funcionality/functionality.component';
import {GoToIfNotFoundComponent} from './go-to-if-not-found/go-to-if-not-found.component';
import {MenuItemComponent} from './menu-item/menu-item.component';
import {DividerModule} from 'primeng/divider';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {PanelModule} from 'primeng/panel';
import {MenuModule} from 'primeng/menu';
import {TableModule} from 'primeng/table';
import {TreeTableModule} from 'primeng/treetable';
import {NoResultComponent} from './no-result/no-result.component';
import {LabelValueChartComponent} from './charts/label-value-chart/label-value-chart.component';
import {FileUploadModule} from 'primeng/fileupload';
import {ToolbarModule} from 'primeng/toolbar';
import {RatingModule} from 'primeng/rating';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {DropdownModule} from 'primeng/dropdown';
import {InputNumberModule} from 'primeng/inputnumber';
import {DialogModule} from 'primeng/dialog';
import {TagModule} from 'primeng/tag';
import {InputMaskModule} from 'primeng/inputmask';
import {MultiSelectModule} from 'primeng/multiselect';
import {ListboxModule} from 'primeng/listbox';
import {InputSwitchModule} from 'primeng/inputswitch';
import {TimeComponent} from './time/time.component';
import {SkeletonListGridComponent} from './skeleton/skeleton-list-grid/skeleton-list-grid.component';
import {BadgeModule} from 'primeng/badge';
import {SkeletonModule} from 'primeng/skeleton';
import {ChartModule} from 'primeng/chart';
import {BarChartComponent} from './charts/bar-chart/bar-chart.component';
import {PolarChartComponent} from './charts/polar-chart/polar-chart.component'
import {MessageModule} from "primeng/message";
import {TieredMenuModule} from 'primeng/tieredmenu';
import {RippleModule} from "primeng/ripple";
import {TreeSelectModule} from "primeng/treeselect";
import {TimeRangeComponent} from './charts/time-range/time-range.component';
import {HeadSkeletonComponent} from './skeleton/dashboard/head-skeleton/head-skeleton.component';
import {BodySkeletonComponent} from './skeleton/dashboard/body-skeleton/body-skeleton.component';
import {PercentComponent} from './charts/percent/percent.component';
import {CalendarModule} from "primeng/calendar";
import {SelectButtonModule} from "primeng/selectbutton";
import {SliderModule} from "primeng/slider";
import {FullCalendarModule} from '@fullcalendar/angular';
import {SpeedDialModule} from 'primeng/speeddial';
import {CalendarMenuItemComponent} from './calendar/calendar-menu-item/calendar-menu-item.component';
import {SidebarModule} from 'primeng/sidebar';
import {LineChartComponent} from './charts/line-chart/line-chart.component';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {LoadingComponent} from './loading/loading.component';
import {StepsModule} from "primeng/steps";
import {CountdownTimerComponent} from './countdown-timer/countdown-timer.component';
import {MegaMenuModule} from "primeng/megamenu";
import {SplitterModule} from "primeng/splitter";
import {FormActionButtonComponent} from "./form-action-button/form-action-button.component";
import {MessagesModule} from "primeng/messages";
import {WarningComponent} from "./warning/warning.component";
import {CalendarComponent} from "./calendar/calendar.component";

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
    TimeRangeComponent,
    MenuItemComponent,
    BarChartComponent,
    PolarChartComponent,
    HeadSkeletonComponent,
    BodySkeletonComponent,
    PercentComponent,
    CalendarComponent,
    CalendarMenuItemComponent,
    LineChartComponent,
    LoadingComponent,
    CountdownTimerComponent,
    WarningComponent,

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
    ActivityExpirationPipe,
    DateRangePipe,

    ImageFallbackDirective,
    SvgColorDirective,
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
    FileUploadModule,
    ListboxModule,
    InputSwitchModule,
    BadgeModule,
    SkeletonModule,
    ChartModule,
    MessagesModule,
    MessageModule,
    ListboxModule,
    TieredMenuModule,
    RippleModule,
    TreeSelectModule,
    CalendarModule,
    SelectButtonModule,
    SliderModule,
    FullCalendarModule,
    SpeedDialModule,
    SidebarModule,
    ProgressSpinnerModule,
    StepsModule,
    MegaMenuModule,
    SplitterModule
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
    TimeRangeComponent,
    MenuItemComponent,
    BarChartComponent,
    PolarChartComponent,
    HeadSkeletonComponent,
    BodySkeletonComponent,
    PercentComponent,
    CalendarComponent,
    LineChartComponent,
    LoadingComponent,
    CountdownTimerComponent,
    WarningComponent,

    ImageFallbackDirective,
    SvgColorDirective,

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
    ActivityExpirationPipe,
    DateRangePipe,

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
    FileUploadModule,
    InputTextareaModule,
    ListboxModule,
    InputSwitchModule,
    BadgeModule,
    SkeletonModule,
    ChartModule,
    MessagesModule,
    MessageModule,
    TieredMenuModule,
    RippleModule,
    TreeSelectModule,
    CalendarModule,
    SelectButtonModule,
    SliderModule,
    FullCalendarModule,
    SpeedDialModule,
    SidebarModule,
    ProgressSpinnerModule,
    StepsModule,
    MegaMenuModule,
    SplitterModule
  ],
  providers: []
})
export class SharedModule {
}
export {CalendarComponent}

