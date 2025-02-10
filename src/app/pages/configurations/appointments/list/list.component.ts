import { Component, DoCheck, KeyValueDiffers, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as AppointmentActions from "@store/appointment.actions";
import { ActivatedRoute, Router } from '@angular/router';
import { MESSAGE } from '@labels/labels';
import { Appointment, Dependency, Hierarchy, Level, OrganizationChart, Scope, Validity } from '@models';
import { Store } from '@ngrx/store';
import { AppointmentService, AuthenticationService, ConfirmationDialogService, CryptojsService, LevelService, OrganizationChartService, ScopeService, StructureService, ValidityService } from '@services';
import { IMAGE_SIZE, Methods } from '@utils';
import { MenuItem, SelectItem, TreeNode } from 'primeng/api';
import { OverlayPanel } from 'primeng/overlaypanel';
import { TreeTable } from 'primeng/treetable';
import { finalize, Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducers';
import { MultiAppointmentsService } from 'src/app/services/multi-appointments.service';

class FiltersBy{
  organizationCharts: any[];
  dependencies: any[];
  validities: any[];
  scopes: any[];
  levels: any[];
}

class GroupAttribute{
  groupKey: 'idVigencia' | 'idNivel' | 'idEscalaSalarial' | 'idAlcance' | 'jerarquia.idDependencia' | 'jerarquia.idOrganigrama';
  groupValue: string;
  groupName: string
  type: 'ORGANIZATIONCHART' | 'DEPENDENCY' | 'VALIDITY' | 'LEVEL' | 'SALARYSCALE' | 'SCOPE';
}

class ComparisonAtrribute{
  comparisonKey: string;
  comparisonValue: string;
  comparisonLabel: string;
  comparisonName: string;
}

class InformationGroup{
  comparisonAtrribute: ComparisonAtrribute;
  groupAttributes: GroupAttribute[];
  code: number;
}

class ChartInformation{
  labels: string[];
  datasets?: any[];
  data?: any[];
  chartDetail?: ChartInformation;
}
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy, DoCheck{
  IMAGE_SIZE = IMAGE_SIZE;
  MESSAGE = MESSAGE;

  @ViewChild('filterOptionsOverlayPanel') filterOptionsOverlayPanel: OverlayPanel;
  @ViewChild('treeTableOfAppointments') treeTableOfAppointments: TreeTable;
  @ViewChild('detailOfAppointmentOverlayPanel') detailOfAppointmentOverlayPanel: OverlayPanel;
  @ViewChild('chartOrganizationChartOptionsOverlayPanel') chartOrganizationChartOptionsOverlayPanel: OverlayPanel;

  isAdmin: boolean;
  loading: boolean;
  filtering: boolean;
  hierarchy: Hierarchy;

  selectedNodesOfAppointments: TreeNode | TreeNode[] | null;

  appointments: Appointment[];
  selectedAppointment: Appointment;
  appointmentsSubscription: Subscription;
  expandedNodesSubscription: Subscription;
  informationGroupSubscription: Subscription;
  hierarchySubscription: Subscription;
  mustRechargeSubscription: Subscription;
  confirmedFiltersSubscription: Subscription;
  viewModeSubscription: Subscription;

  filtersBy: FiltersBy = new FiltersBy();
  filterProps = {
    organizationCharts: {icon: 'pi pi-sitemap', valueKey: 'nombre', internalKeyRelashionship: 'id',  externalKeyRelashionship: 'jerarquia.idOrganigrama'},
    dependencies: {icon: 'pi pi-ticket', valueKey: 'data.nombre', internalKeyRelashionship: 'data.id',  externalKeyRelashionship: 'jerarquia.idDependencia'},
    validities: {icon: 'pi pi-calendar', valueKey: 'nombre', internalKeyRelashionship: 'id',  externalKeyRelashionship: 'idVigencia'},
    scopes: {icon: 'pi pi-flag', valueKey: 'nombre', internalKeyRelashionship: 'id',  externalKeyRelashionship: 'idAlcance'},
    levels: {icon: 'pi pi-bookmark', valueKey: 'nombre', internalKeyRelashionship: 'id',  externalKeyRelashionship: 'idNivel'}
  }
  filterHasChanged: boolean = false;
  filtersByDiffer: any;
  confirmedFilters:FiltersBy;

  organizationChartOptions: OrganizationChart[] = [];
  dependencyOptions: TreeNode<Dependency>[] = [];
  validityOptions: Validity[] = [];
  scopeOptions: Scope[] = [];
  levelOptions: Level[] = [];

  comparisonObjects: any[] = [];
  informationGroup: InformationGroup;
  informationGroups: InformationGroup[] = [
    {
      code: 0,
      comparisonAtrribute: {comparisonKey: 'idAlcance', comparisonValue: 'alcance', comparisonLabel: 'nombre', comparisonName: 'Alcances'},
      groupAttributes: [
        {groupKey: 'jerarquia.idOrganigrama', groupValue: 'jerarquia.organigrama', type: 'ORGANIZATIONCHART', groupName: 'Organigrama'},
        {groupKey: 'jerarquia.idDependencia', groupValue: 'jerarquia.dependencia', type: 'DEPENDENCY', groupName: 'Dependencia'},
        {groupKey: 'idVigencia', groupValue: 'vigencia', type: 'VALIDITY', groupName: 'Vigencia'},
        {groupKey: 'idNivel', groupValue: 'nivel', type: 'LEVEL', groupName: 'Nivel ocupacional'},
        {groupKey: 'idEscalaSalarial', groupValue: 'escalaSalarial', type: 'SALARYSCALE', groupName: 'Escala salarial'},
      ]
    },
    {
      code: 1,
      comparisonAtrribute: {comparisonKey: 'idAlcance', comparisonValue: 'alcance', comparisonLabel: 'nombre', comparisonName: 'Alcances'},
      groupAttributes: [
        {groupKey: 'jerarquia.idOrganigrama', groupValue: 'jerarquia.organigrama', type: 'ORGANIZATIONCHART', groupName: 'Organigrama'},
        {groupKey: 'idVigencia', groupValue: 'vigencia', type: 'VALIDITY', groupName: 'Vigencia'},
        {groupKey: 'jerarquia.idDependencia', groupValue: 'jerarquia.dependencia', type: 'DEPENDENCY', groupName: 'Dependencia'},
        {groupKey: 'idNivel', groupValue: 'nivel', type: 'LEVEL', groupName: 'Nivel ocupacional'},
        {groupKey: 'idEscalaSalarial', groupValue: 'escalaSalarial', type: 'SALARYSCALE', groupName: 'Escala salarial'},
      ]
    },
    {
      code: 2,
      comparisonAtrribute: {comparisonKey: 'idVigencia', comparisonValue: 'vigencia', comparisonLabel: 'anio', comparisonName: 'Vigencias'},
      groupAttributes: [
        {groupKey: 'jerarquia.idOrganigrama', groupValue: 'jerarquia.organigrama', type: 'ORGANIZATIONCHART', groupName: 'Organigrama'},
        {groupKey: 'jerarquia.idDependencia', groupValue: 'jerarquia.dependencia', type: 'DEPENDENCY', groupName: 'Dependencia'},
        {groupKey: 'idAlcance', groupValue: 'alcance', type: 'SCOPE', groupName: 'Alcance'},
        {groupKey: 'idNivel', groupValue: 'nivel', type: 'LEVEL', groupName: 'Nivel ocupacional'},
        {groupKey: 'idEscalaSalarial', groupValue: 'escalaSalarial', type: 'SALARYSCALE', groupName: 'Escala salarial'},
      ]
    },
    {
      code: 3,
      comparisonAtrribute: {comparisonKey: 'idNivel', comparisonValue: 'nivel', comparisonLabel: 'nombre', comparisonName: 'Niveles ocup.'},
      groupAttributes: [
        {groupKey: 'jerarquia.idOrganigrama', groupValue: 'jerarquia.organigrama', type: 'ORGANIZATIONCHART', groupName: 'Organigrama'},
        {groupKey: 'idVigencia', groupValue: 'vigencia', type: 'VALIDITY', groupName: 'Vigencia'},
        {groupKey: 'idAlcance', groupValue: 'alcance', type: 'SCOPE', groupName: 'Alcance'},
        {groupKey: 'jerarquia.idDependencia', groupValue: 'jerarquia.dependencia', type: 'DEPENDENCY', groupName: 'Dependencia'},
      ]
    }
  ]

  treeDataset: TreeNode[] = [];

  menuItemsOfAppointment: MenuItem[] = [];
  menuItemsOfAppointmentGroup: MenuItem[] = [];

  showedIcons: any = {};
  expandedNodes: any[];

  menuBarItems: MenuItem[] = [];
  menuItemsOfDownload: MenuItem[] = [
    {label: 'Reporte de asignación de cargos en Excel', icon: 'pi pi-file-excel', automationId:"excel", command: (e) => { this.download(e) }},
  ];

  globalAmount: number = 0;
  globalAmountByOrganizationChart: number = 0;

  partialAmmount: number = 0;
  viewOptions: any[] = [
    {icon: 'pi pi-list', value: 'list', tooltip: 'Lista'}, 
    {icon: 'pi pi-chart-bar', value: 'chart', tooltip: 'Gráfica'
  }];
  viewMode: 'list' | 'chart';
  chartInformation: ChartInformation = new ChartInformation();
  colors: string[];
  chartFilters: any = {};
  chartGroupFilters: {scopes: any[], levels: any[], salaryScales};
  chartOrganizationChartOptions: SelectItem[] = [];
  chartSelectedOrganizationChart: OrganizationChart;

  constructor(
    private store: Store<AppState>,
    private validityService: ValidityService,
    private appointmentService: AppointmentService,
    private scopeService: ScopeService,
    private levelService: LevelService,
    private organizationChartService: OrganizationChartService,
    private multiAppointmentsService: MultiAppointmentsService,
    private confirmationDialogService: ConfirmationDialogService,
    private authService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
    private cryptoService: CryptojsService,
    private differs: KeyValueDiffers
  ){
    this.filtersByDiffer = this.differs.find({}).create();
  }

  ngOnInit(): void {
    const {isAdministrator, isOperator} = this.authService.roles();
    this.isAdmin = isAdministrator;

    /**Restablecemos el formulario de multiples asignaciones de cargos, si por alguna razón navegamos a él */
    this.multiAppointmentsService.setMustRechargeMultiAppointmentsFormGroup(true);

    this.initChartGroupFilters();
    const documentStyle = getComputedStyle(document.documentElement);
    this.colors = [
      documentStyle.getPropertyValue('--indigo-500'),
      documentStyle.getPropertyValue('--purple-500'),
      documentStyle.getPropertyValue('--teal-500'),
      documentStyle.getPropertyValue('--orange-500'),
      documentStyle.getPropertyValue('--pink-500'),
      documentStyle.getPropertyValue('--cyan-500'),
      documentStyle.getPropertyValue('--red-500'),
      documentStyle.getPropertyValue('--green-500'),
      documentStyle.getPropertyValue('--blue-500'),
      documentStyle.getPropertyValue('--yellow-500'),
      documentStyle.getPropertyValue('--gray-500'),
      documentStyle.getPropertyValue('--bluegray-500'),
    ];

    this.hierarchySubscription = this.store.select(state => state.appointment.hierarchy).subscribe(e => this.hierarchy = e);
    this.informationGroupSubscription = this.store.select(state => state.appointment.informationGroup).subscribe(e => this.informationGroup = e ?? this.informationGroups[0]);
    this.expandedNodesSubscription = this.store.select(state => state.appointment.expandedNodes).subscribe(e => this.expandedNodes = e);
    this.appointmentsSubscription =  this.store.select(state => state.appointment.items).subscribe(e => {
      this.appointments = e;
      this.buildDataset();
    });
    this.confirmedFiltersSubscription = this.store.select(state => state.appointment.confirmedFilters).subscribe(e => this.confirmedFilters = e);
    this.mustRechargeSubscription = this.store.select(state => state.appointment.mustRecharge).subscribe(e => {
      if (e){
        const filters = new FiltersBy();
        if(this.hierarchy){
          filters.dependencies = this.hierarchy.idDependencia ? [this.hierarchy.idDependencia] : [];
          filters.organizationCharts = this.hierarchy.idOrganigrama ? [this.hierarchy.idOrganigrama] : [];
        }
        this.loading = true;
        this.getAppointments(filters)
      }
    });
    this.viewModeSubscription = this.store.select(state => state.appointment.viewMode).subscribe(e => this.viewMode = e);
    this.initMenuItems();

    this.menuBarItems = [
      {label: 'Reportes', icon: 'pi pi-fw pi-file', items: this.menuItemsOfDownload},
    ];
  }

  ngOnDestroy(): void {
    this.appointmentsSubscription?.unsubscribe();
    this.expandedNodesSubscription?.unsubscribe();
    this.informationGroupSubscription?.unsubscribe();
    this.hierarchySubscription?.unsubscribe();
    this.mustRechargeSubscription?.unsubscribe();
    this.confirmedFiltersSubscription?.unsubscribe();
    this.viewModeSubscription?.unsubscribe();
  }

  ngDoCheck() {
    if (this.filtersByDiffer.diff(this.filtersBy)) {
      this.filterHasChanged = true;
    }
  }

  get totalSelectedAppointments(): number{
    const totalItems = (this.getSelectedRealAppointments() as TreeNode[])?.reduce((sum, obj) => sum + (obj.data?.items ? obj.data.items.length : 0), 0);
    return totalItems ?? 0;
  }

  initMenuItems(){
    this.menuItemsOfAppointment = [
      {label: 'Ver detalles', icon: 'pi pi-eye', command: (e) => this.viewDetailOfAppointment(e.item.id, e.originalEvent)},
      {label: 'Editar', icon: 'pi pi-pencil', visible: this.isAdmin, command: (e) => this.onGoToUpdateAppointment(e.item.id, e.originalEvent)},
      {label: 'Eliminar', icon: 'pi pi-trash', visible: this.isAdmin, command: (e) => this.onDeleteAppointment(e)},
    ];

    this.menuItemsOfAppointmentGroup = [
      {label: 'Eliminar asignaciones', icon: 'pi pi-trash', command: (e) => { this.onDeleteAppointments(e) }},
    ];
  }

  /**
   * Los cargos que realmente se  encuentran seleccionados son todos aquellos en el último nivel de la jerarquía en el árbol,
   * y estos son precisamente los del tipo que se encuentran en la última posición del objeto 'this.informationGroup.groupAttributes'.
   * Los elementos se encuentran dentro del atrributo data.items, ya que aquí se alojan los agrupados hasta ese nivel.
   */
  getSelectedRealAppointments(){
    return (this.selectedNodesOfAppointments as TreeNode[])?.filter(e => e.data.type == this.informationGroup.groupAttributes[this.informationGroup.groupAttributes.length - 1].type);
  }

  openFilterOptions(event: Event){
    this.filterOptionsOverlayPanel.show(event);
    if(!this.dependencyOptions?.length){
      this.getDependencies();
    }
    if(!this.organizationChartOptions?.length){
      this.getOrganizacionCharts();
    }
    if(!this.validityOptions?.length){
      this.getValidities();
    }
    if(!this.scopeOptions?.length){
      this.getScopes();
    }
    if(!this.levelOptions?.length){
      this.getLevels();
    }
  }

  getAppointments(filterIds: FiltersBy){
    this.appointmentService.getAppointments(filterIds).subscribe({
      next: (data) => {
        this.store.dispatch(AppointmentActions.setList({appointments: data as Appointment[]}));
        this.store.dispatch(AppointmentActions.setMustRecharge({mustRecharge: false}));
        this.loading = false;
        this.filtering = false;
      },
      error: ()=>{this.loading = false}
    })
  }

  buildDataset(){
    let data: Appointment[] = this.appointments;
    this.treeDataset = this.groupByAttributes(data, this.informationGroup.groupAttributes);
    this.restartChartInformation();
    //Construir los objetos que se tienen en cuenta en la comparación
    const list = Array.from(
      data.reduce((map, item) => {
        if (!map.has(item[this.informationGroup.comparisonAtrribute.comparisonKey])) {
          map.set(item[this.informationGroup.comparisonAtrribute.comparisonKey], item[this.informationGroup.comparisonAtrribute.comparisonValue]);
        }
        return map;
      }, new Map()).values()
    );
    this.comparisonObjects = list?.map(e => ({[this.informationGroup.comparisonAtrribute.comparisonKey]: e['id'], label: e[this.informationGroup.comparisonAtrribute.comparisonLabel]}));
  }

  restartChartInformation(){
    this.initChartGroupFilters();
    const data: Appointment[] = this.appointments;
    const uniqueOrganigrams = Array.from(
      new Map(
          data.map(app => [app.jerarquia.organigrama.id, app.jerarquia.organigrama])
      ).values()
    );

    this.chartOrganizationChartOptions = uniqueOrganigrams?.map( o => ({value: o, label: o.nombre})) ?? [];
    if (!this.chartSelectedOrganizationChart){
      this.chartSelectedOrganizationChart =  this.chartOrganizationChartOptions[0]?.value;
    }
    const filtered = data.filter(e => e.jerarquia.idOrganigrama == this.chartSelectedOrganizationChart.id);
    this.chartInformation = this.buildBarChartInformation(filtered, 'vigencia.nombre', 'alcance.nombre');
    this.globalAmountByOrganizationChart = filtered.reduce((acc, obj) => {
      return obj.totalCargos*obj.asignacionTotal + acc;
    }, 0);
    this.partialAmmount = this.globalAmountByOrganizationChart;
  }

  changeOrganizationChart(data: any){
    this.chartSelectedOrganizationChart = data.value;
    this.chartOrganizationChartOptionsOverlayPanel.hide();
    this.restartChartInformation();
  }

  getOrganizacionCharts(): void {
    this.organizationChartService.getOrganizationalCharts().subscribe({
      next: (e) => {
        this.organizationChartOptions = e;
        this.filtersBy.organizationCharts = this.organizationChartOptions?.filter(v => this.confirmedFilters?.organizationCharts?.map(o => o.id).includes(v.id));
      }
    });
  }

  getDependencies(): void {
    this.organizationChartService.getDependencies().subscribe({
      next: (e) => {
        this.builtNodes(e, this.dependencyOptions);
        this.filtersBy.dependencies = this.dependencyOptions.filter(s => this.confirmedFilters?.dependencies?.map(o => o.data.id).includes(s.data.id));
      }
    });
  }

  getValidities() {
    this.validityService.getValidities().subscribe({
      next: (e) => {
        this.validityOptions = e;
        this.filtersBy.validities = this.validityOptions?.filter(v => this.confirmedFilters?.validities?.map(o => o.id).includes(v.id));
      }
    })
  }

  getScopes() {
    this.scopeService.getScopes().subscribe({
      next: (e) => {
        this.scopeOptions = e;
        this.filtersBy.scopes = this.scopeOptions?.filter(s => this.confirmedFilters?.scopes?.map(o => o.id).includes(s.id));
      }
    })
  }

  getLevels() {
    this.levelService.getLevels().subscribe({
      next: (e) => {
        this.levelOptions = e;
        this.filtersBy.levels = this.levelOptions?.filter(l => this.confirmedFilters?.levels?.map(o => o.id).includes(l.id));
      }
    })
  }

  onFilter(treeTable: TreeTable, event: Event) {
    treeTable.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    this.initChartGroupFilters();
  }

  openNew() {
    this.router.navigate(['create'], { relativeTo: this.route, skipLocationChange: true});
  }

  onGoToUpdateAppointment (id : any, event: Event): void{
    event.preventDefault();
    event.stopPropagation();
    this.router.navigate([this.cryptoService.encryptParam(id)], {relativeTo: this.route, skipLocationChange: true})
  }

  onDeleteAppointment(event: any): void {
    let id = parseInt(event.item.id);
    event.originalEvent.preventDefault();
    event.originalEvent.stopPropagation();
    this.confirmationDialogService.showDeleteConfirmationDialog(
      () => {
        this.appointmentService.deleteAppointment(id)
        .subscribe({
          next: () => {
            this.store.dispatch(AppointmentActions.removeFromList({id: id}));
            this.desmarkAll();
          }
        });
      }
    )
  }

  onDeleteAppointments(data){
    let appointmentIds: number[] = (data.item.value.items.map(item => item.id) ?? []);
    this.confirmationDialogService.showDeleteConfirmationDialog(
      () => {
        this.appointmentService.deleteSelectedLevel(appointmentIds)
        .subscribe({
          next: (e) => {
           this.store.dispatch(AppointmentActions.removeItemsFromList({appointmentIds: appointmentIds}));
           this.desmarkAll();
          }
        });
      }
    )
  }

  deleteSelectedAppointments() {
    let appointmentIds: number[] = (this.getSelectedRealAppointments() as TreeNode[])?.flatMap(obj => obj.data.items ? obj.data.items.map(item => item.id) : []);
    this.confirmationDialogService.showDeleteConfirmationDialog(
      () => {
        this.appointmentService.deleteSelectedLevel(appointmentIds)
        .subscribe({
          next: (e) => {
           this.store.dispatch(AppointmentActions.removeItemsFromList({appointmentIds: appointmentIds}));
           this.desmarkAll();
          }
        });
      }
    )
  }

  desmarkAll() {
    this.selectedNodesOfAppointments = [];
  }

  transformToArray(value: any): any[] {
    return Array.isArray(value) ? value : [value];
  }

  getNestedProperty(obj, key) {
    if (!key) return obj;
    return key.split('.').reduce((acc, curr) => acc && acc[curr], obj);
  }

  onRemoveFilter(key, index){
    const deleted  = this.confirmedFilters[key][index];
    this.store.dispatch(AppointmentActions.removeConfirmedFilter({key: key, index: index}));
    this.filtersBy[key]?.splice(index, 1);
    if (this.confirmedFilters[key]?.length){
      const list = this.appointments.filter(
        e => this.getNestedProperty(e, this.filterProps[key].externalKeyRelashionship) != this.getNestedProperty(deleted, this.filterProps[key].internalKeyRelashionship) 
      );
      this.store.dispatch(AppointmentActions.setList({appointments: list}));
    }else if(this.isObjectEmpty(this.confirmedFilters)){
      this.store.dispatch(AppointmentActions.setList({appointments: []}));
      this.filterHasChanged = true;
    }
  }

  filterAppointments(){
    this.filterOptionsOverlayPanel.hide();
    if(this.filterHasChanged){
      this.filtering = true;
      const filters = new FiltersBy();
      filters.organizationCharts = this.filtersBy.organizationCharts?.map(e => e.id) ?? [];
      filters.dependencies = this.filtersBy.dependencies?.map(e => e.data.id) ?? [];
      filters.validities = this.filtersBy.validities?.map(e => e.id) ?? [];
      filters.scopes = this.filtersBy.scopes?.map(e => e.id) ?? [];
      filters.levels = this.filtersBy.levels?.map(e => e.id) ?? [];
      this.getAppointments(filters);
      this.filterHasChanged = false;
      this.store.dispatch(AppointmentActions.setConfirmedFilters({confirmedFilters: {...this.filtersBy}}));
    }
  }

  cancelFilterOptions(){
    this.filterOptionsOverlayPanel.hide();
  }

  toggleIcon(show: boolean, idEvent){
    this.showedIcons[idEvent] = show;
  }

  onNodeExpand(event: any) {
    this.store.dispatch(AppointmentActions.addToExpandedNodes({key: event.node.data.type + '|' + event.node.data.id}));
  }

  onNodeCollapse(event: any) {
    this.store.dispatch(AppointmentActions.removeFromExpandedNodes({key: event.node.data.type + '|' + event.node.data.id}));
  }

  viewDetailOfAppointment(appointmentId: any, event: Event) {
    this.detailOfAppointmentOverlayPanel.toggle(event);
    this.selectedAppointment = this.appointments.find(e => e.id == appointmentId);
  }

  changeInformationGroup(index: number){
    this.store.dispatch(AppointmentActions.setInformationGroup({informationGroup:  this.informationGroups[index]}));
    this.store.dispatch(AppointmentActions.reloadAppointmentsInStore());
  }

  parseToNumber(input): number{
    return Number(input) || 0
  }

  onViewChange(event: "list" | "chart") {
    this.store.dispatch(AppointmentActions.setViewMode({viewMode: event}));
    this.partialAmmount = this.globalAmountByOrganizationChart;
    this.initChartGroupFilters();
  }
  
  private initChartGroupFilters(){
    this.chartGroupFilters = {scopes: [], levels: [], salaryScales: []};
  }

  private updatePartialAmmount(){
    let sumOfRemovedScopes = this.chartInformation.datasets
      .filter(e => this.chartGroupFilters.scopes.includes(e.label))
      .reduce((sum, e) => sum + e.data.reduce((acc, o) => acc + o), 0);

    let sumOfRemovedLevels = this.chartInformation.chartDetail?.datasets
      .filter(e => this.chartGroupFilters.levels.includes(e.label))
      .reduce((sum, e) => sum + e.data.reduce((acc, o) => acc + o), 0) || 0;

    let sumOfRemovedSalaryScales = this.chartInformation.chartDetail?.chartDetail?.labels
      .map((e, index) => ({label: e, index: index}))
      .filter(e => this.chartGroupFilters.salaryScales.includes(e.label))
      .reduce((sum, e) => sum + this.chartInformation.chartDetail?.chartDetail.data[e.index], 0) || 0;

    this.partialAmmount = this.globalAmountByOrganizationChart - (sumOfRemovedScopes + sumOfRemovedLevels + sumOfRemovedSalaryScales);
  }

  onClickOnScopeAndValidityLegend(data: { originalEvent: Event; datasetIndex: number; hidden: boolean }): void {
    const dataset = this.chartInformation.datasets[data.datasetIndex];
    this.chartGroupFilters.scopes = data.hidden 
                                    ? [...this.chartGroupFilters.scopes, dataset.label]
                                    : this.chartGroupFilters.scopes.filter(item => item !== dataset.label);
  
    if(this.chartFilters.scope == dataset.label){
      this.chartInformation.chartDetail = null;
      this.chartGroupFilters.levels = [];
    }
    this.updatePartialAmmount();
  } 

  onClickOnDependencyAndLevelLegend(data: { originalEvent: Event; datasetIndex: number; hidden: boolean }): void {
    const { chartDetail } = this.chartInformation;
    const dataset = chartDetail.datasets[data.datasetIndex];
    this.chartGroupFilters.levels = data.hidden 
                                    ? [...this.chartGroupFilters.levels, dataset.label]
                                    : this.chartGroupFilters.levels.filter(item => item !== dataset.label);
  
    if(this.chartFilters.level == dataset.label){
      chartDetail.chartDetail = null;
      this.chartGroupFilters.salaryScales = [];
    }
    this.updatePartialAmmount();
  }

  onClickOnSalaryScaleLegend(data: { originalEvent: Event; index: number; hidden: boolean }): void {
    const { chartDetail } = this.chartInformation.chartDetail;
    const label = chartDetail.labels[data.index];
    this.chartGroupFilters.salaryScales = data.hidden 
                                    ? [...this.chartGroupFilters.salaryScales, label]
                                    : this.chartGroupFilters.salaryScales.filter(item => item !== label);
    this.updatePartialAmmount();
  }

  onClickOnScopeAndValidityBar(data: {originalEvent: Event, datasetIndex: number, dataIndex: number}){    
    const dataset = this.chartInformation.datasets[data.datasetIndex];
    const label = this.chartInformation.labels[data.dataIndex];
    this.chartFilters = {scope: dataset.label,  validity: label}
    const filtered = this.appointments.filter(
      e =>  e.jerarquia.idOrganigrama == this.chartSelectedOrganizationChart.id 
            && e.alcance.nombre == this.chartFilters.scope 
            && e.vigencia.nombre == this.chartFilters.validity);
    let chartDetail = this.buildBarChartInformation(filtered, 'jerarquia.dependencia.nombre', 'nivel.nombre');
    this.chartInformation.chartDetail = chartDetail;
  }

  onClickOnDependencyAndLevelBar(data: { originalEvent: any; datasetIndex: number; dataIndex: number }): void {
    const { chartDetail } = this.chartInformation;
    const dataset = chartDetail.datasets[data.datasetIndex];
    const label = chartDetail.labels[data.dataIndex];
    this.chartFilters = {...this.chartFilters, level: dataset.label, dependency: label };
    const { scope, validity, dependency, level } = this.chartFilters;
    const filtered = this.appointments.filter(e => 
        e.jerarquia.idOrganigrama == this.chartSelectedOrganizationChart.id &&
        e.alcance.nombre === scope &&
        e.vigencia.nombre === validity &&
        e.jerarquia.dependencia.nombre === dependency &&
        e.nivel.nombre === level
    );
    chartDetail.chartDetail = this.buildPolarChartInformation(filtered, 'escalaSalarial.nombre', 'nivel.nombre');
  }
  

  private isObjectEmpty(obj) {
    return Object.values(obj).every(value =>
        value === null ||
        value === undefined ||
        (Array.isArray(value) && value.length === 0)
    );
  }

  private builtNodes(dependencies: Dependency[], nodes: TreeNode<Dependency>[]) {
    if (!dependencies) return;
    for (let dependency of dependencies) {
      let node: TreeNode<Dependency> = {
        data: dependency,
        label: dependency.nombre,
        children: []
      };
      /*if (dependency.subDependencias?.length) {
        this.builtNodes(dependency.subDependencias, node.children)
      }*/
      nodes.push(node);
    }
  }

  private groupByAttributes(list: Appointment[], groupAttributes: GroupAttribute[]) {
    const groupKeys = groupAttributes.map( e => e.groupKey);
    const groupValues = groupAttributes.map( e => e.groupValue);
    const types = groupAttributes.map( e => e.type);
    const expandedNodes = this.expandedNodes;

    const comparisonAtrribute = this.informationGroup.comparisonAtrribute;
    const comparisonKeys = [...new Set(list.map(item => item[comparisonAtrribute.comparisonKey]))];

    function getNestedProperty(obj, key) {
      if (!key) return obj;
      return key.split('.').reduce((acc, curr) => acc && acc[curr], obj);
    }

    function groupRecursively(items, level = 0) {
        if (level >= groupKeys.length) {
            return items;
        }
        const attr = groupKeys[level];
        return items.reduce((acc, item) => {
            const key = getNestedProperty(item, attr);
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(item);
            return acc;
        }, {});
    }

    function buildTree(grouped, level = 0) {
        if (level >= groupKeys.length) return [];

        const result = [];
        let index = 0;
        for (const key in grouped) {
            const children = buildTree(
                groupRecursively(grouped[key], level + 1),
                level + 1
            );
            const comparisonsPercomparisonKey = new Map();
            grouped[key].forEach(obj => {
              const key = getNestedProperty(obj, comparisonAtrribute.comparisonKey);
              if (comparisonKeys.includes(key)) {
                if (!comparisonsPercomparisonKey.has(key)) {
                  comparisonsPercomparisonKey.set(key, {totalCargos: 0, asignacionTotal: 0, ids: []});
                }
                comparisonsPercomparisonKey.get(key).totalCargos +=  obj.totalCargos;
                comparisonsPercomparisonKey.get(key).asignacionTotal +=  obj.asignacionTotal*obj.totalCargos;
                comparisonsPercomparisonKey.get(key).ids.push(obj.id);
              }
            });
            result.push({
                data: {
                  [groupKeys[level]]: key,
                  type: types[level],
                  ... (groupValues[level] != null ? getNestedProperty(grouped[key][0], groupValues[level]) :  grouped[key][0]),
                  items: grouped[key] as Appointment[],
                  isLastGroup: level == groupKeys.length - 1,
                  isFirstGroup: level == 0,
                  total: grouped[key].length,
                  index: index,
                  comparisonsPercomparisonKey: Object.fromEntries(comparisonsPercomparisonKey),
                  asignacionTotal:  Array.from(comparisonsPercomparisonKey.values()).reduce((sum, value) => sum + value.asignacionTotal, 0)
                },
                children: children,
                expanded: expandedNodes.includes(types[level] + '|' + key)
            });
            index++;
        }
        return result;
    }
    const grouped = groupRecursively(list);
    const tree = buildTree(grouped);
    this.globalAmount = tree.reduce((sum, value) => sum + value.data.asignacionTotal, 0);
    return tree;
  }

  private buildBarChartInformation(list: Appointment[], att1: string, att2: string): ChartInformation {
    const grouped = list.reduce((acc, item) => {
      const {asignacionTotal, totalCargos } = item;
      const prop1: string = this.getNestedProperty(item, att1); 
      const prop2: string = this.getNestedProperty(item, att2); 
      if (!acc[prop1]) {
        acc[prop1] = {};
      }
      acc[prop1][prop2] = (acc[prop1][prop2] || 0 ) + asignacionTotal * totalCargos;
      return acc;
    }, {});
  
    const labels = Object.keys(grouped);
    const keys = new Set(list.map((item) => this.getNestedProperty(item, att2)));
    const datasets = Array.from(keys).map((group2, index) => ({
      label: group2,
      data: labels.map((group1) => grouped[group1]?.[group2] || 0),
      backgroundColor: this.colors[index],
      borderColor: this.colors[index],
      borderSkipped: false,
      tension: 0
    }));
    return { labels, datasets };
  }

  /**
   * Construye el dataset requerido para pintar el detalle más profundo de las gráficas.
   * @param list: Lista de asignaciones de cargos.
   * @param att1: Atributo por el que se agrupa la data en la gráfica.
   * @param optionalAtt: Se utiliza cuando no hay información para el attr1, 
   *                     por ejemplo, si no tiene escala salarial, use en su lugar el nivel ocupacional.
   * @returns: Información reuqrida para pintar la gráfica.
   */
  private buildPolarChartInformation(list: Appointment[], att1: string, optionalAtt: string): ChartInformation {
    const grouped = list.reduce((acc, item) => {
      const {asignacionTotal, totalCargos } = item;
      const prop1: string = this.getNestedProperty(item, att1) || this.getNestedProperty(item, optionalAtt); 
      acc[prop1] = (acc[prop1] || 0 ) + asignacionTotal * totalCargos;
      return acc;
    }, {});
  
    const labels = Object.keys(grouped);
    const data = labels.map((group1) => grouped[group1] || 0)
    return { labels, data };
  }

  private download(data: any) {
    const updateMenuItem = (menuItem: MenuItem, icon: string, disabled: boolean) => {
        if (menuItem) {
            menuItem.icon = icon;
            menuItem.disabled = disabled;
        }
    };
    const menuItem = this.menuItemsOfDownload.find(e => e.automationId == data.item.automationId);
    const initialIcon = menuItem?.icon;
    const initialState = menuItem?.disabled;

    let automationId = data.item.automationId;
    updateMenuItem(menuItem, "pi pi-spin pi-spinner", true);

    const filters = new FiltersBy();
    filters.organizationCharts = this.confirmedFilters?.organizationCharts?.map(e => e.id) ?? [];
    filters.dependencies = this.confirmedFilters?.dependencies?.map(e => e.data.id) ?? [];
    filters.validities = this.confirmedFilters?.validities?.map(e => e.id) ?? [];
    filters.scopes = this.confirmedFilters?.scopes?.map(e => e.id) ?? [];
    filters.levels = this.confirmedFilters?.levels?.map(e => e.id) ?? [];

    this.appointmentService.downloadReport(automationId, filters).pipe(
      finalize(()=>{
        updateMenuItem(menuItem, initialIcon, initialState);
      })
    ).subscribe({
      next: (downloadProgress) => {}
    });
  }
}
