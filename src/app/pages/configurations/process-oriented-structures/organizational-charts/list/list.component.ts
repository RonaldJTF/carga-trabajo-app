import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import * as OrganizationChartActions from "@store/organizationChart.actions";
import * as HierarchyActions from "@store/hierarchy.actions";
import * as AppointmentActions from "@store/appointment.actions";
import {IMAGE_SIZE} from "@utils";
import {MESSAGE} from "@labels/labels";
import {Store} from "@ngrx/store";
import {AppState} from "../../../../../app.reducers";
import {ActivatedRoute, Router} from "@angular/router";
import {
  AuthenticationService,
  ConfirmationDialogService,
  CryptojsService,
  OrganizationChartService
} from "@services";
import {finalize, map, Observable, Subscription} from "rxjs";
import {Convention, Dependency, Hierarchy, OperationalManagement, OrganizationChart} from "@models";
import {MenuItem, TreeNode} from "primeng/api";
import { OverlayPanel } from 'primeng/overlaypanel';
import {DomSanitizer} from "@angular/platform-browser";
import { TreeTable } from 'primeng/treetable';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {

  protected readonly IMAGE_SIZE = IMAGE_SIZE;
  protected readonly MESSAGE = MESSAGE;

  @ViewChild('dependencyOptionsOverlayPanel') dependencyOptionsOverlayPanel: OverlayPanel;
  @ViewChild('organizationChartOptionsOverlayPanel') organizationChartOptionsOverlayPanel: OverlayPanel;
  @ViewChild('operationalsManagementsOverlayPanel') operationalsManagementsOverlayPanel: OverlayPanel;
  @ViewChild('detailOfOrganizationChartOverlayPanel') detailOfOrganizationChartOverlayPanel: OverlayPanel;
  @ViewChild('treeTableAssignedOperationalManagement') treeTableAssignedOperationalManagement: TreeTable;
  @ViewChild('treeTableNoAssignedOperationalManagement') treeTableNoAssignedOperationalManagement: TreeTable;

  loading: boolean = false;
  loadingHierarchies: boolean = false;
  loadingDependencies: boolean = false;
  loadingAssignedOperationalsManagements: boolean = false;
  loadingNoAssignedOperationalsManagements: boolean = false;
  isAdmin: boolean;
  isAssigning: boolean = false;

  organizationCharts$: Observable<OrganizationChart[]>;
  conventions$: Observable<Convention[]>;
  selectedOrganizationChart: OrganizationChart;
  hierarchyTree: TreeNode<Hierarchy>[] = [];
  hierarchies: Hierarchy[] = [];

  mustRechargeSubscription: Subscription;
  organizationChartSubscribe: Subscription;
  hierarchiesSubscribe: Subscription;
  viewModeSubscription: Subscription;

  menuItemsOrganizationChart: MenuItem[] = [];
  menuItemsHierarchy: MenuItem[] = [];
  operationalManagementItems: any[] | undefined;
  operationalManagementActiveItem: any | undefined;

  showedIcons: any = {};
  hierarchyOnWorking: Hierarchy;
  selectedDependency: Dependency;

  dependencies: Dependency[] = [];
  filteredDependencies: Dependency[] = [];
  menuBarItems: MenuItem[] = [];

  menuItemsOfDownload: MenuItem[] = [
    {label: 'Reporte de tiempos en Excel', escape: false, icon: 'pi pi-file-excel', automationId:"excel", command: (e) => { this.download(e) }},
    //{label: 'Reporte plano de tiempos en Excel', escape: false, icon: 'pi pi-file-excel', automationId:"flat-excel", command: (e) => { this.download(e) }},
  ];

  assignedOperationalsManagementsTree: TreeNode[];
  assignedOperationalsManagementsSubscription: Subscription;
  selectedNodesOfAssignedOperationalManagement: TreeNode | TreeNode[] | null;
  mustRechargeAssignedOperationalsManagements: boolean;
  assignedOperationalsManagementsRowGroupMetadata: number[] = [];
  numberOfElementsByAssignedOperationalManagement: any = {};

  noAssignedOperationalsManagementsTree: TreeNode[];
  noAssignedOperationalsManagementsSubscription: Subscription;
  selectedNodesOfNoAssignedOperationalManagement: TreeNode | TreeNode[] | null;
  mustRechargeNoAssignedOperationalsManagements: boolean;
  mustRechargeNoAssignedOperationalsManagementsSubscription: Subscription;
  noAssignedOperationalsManagementsRowGroupMetadata: number[] = [];
  numberOfElementsByNoAssignedOperationalManagement: any = {};
  
  operationalManagementExpandedNodesSubscription: Subscription;
  operationalManagementExpandedNodes: number[];

  filteredAssignedValuesSubscription: Subscription;
  filteredNoAssignedValuesSubscription: Subscription;

  viewOptions: any[] = [
    {icon: 'pi pi-table', value: 'base-structure', tooltip: 'Estructura base'}, 
    {icon: 'pi pi-sitemap', value: 'diagram', tooltip: 'Diagrama'
  }];
  viewMode: 'base-structure' | 'diagram';

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private organizationChartService: OrganizationChartService,
    private confirmationDialogService: ConfirmationDialogService,
    private cryptoService: CryptojsService,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    const {isAdministrator} = this.authService.roles();
    this.isAdmin = isAdministrator;
    this.store.dispatch(OrganizationChartActions.setMustRechargeNoAssignedOperationalsManagements({mustRecharge: true}));
    
    this.organizationCharts$ =  this.store.select(state => state.organizationChart.items);
    this.conventions$ = this.store.select(state => state.hierarchy.items).pipe(
      map(e => {
        const associatedDependencies = [];
        this.getAssociatedDependenciesOnOrganizationChart(e, associatedDependencies);
        return this.getConventions(associatedDependencies);
      })
    );

    this.assignedOperationalsManagementsSubscription = this.store.select(state => state.organizationChart.assignedOperationalsManagements).subscribe(e => {
      let elements = this.filterByActivity(e);
      this.assignedOperationalsManagementsTree = elements?.map ( obj => this.transformAssignedOperationalManagementToTreeNode(obj));
      this.assignedOperationalsManagementsRowGroupMetadata = this.onGoToUpdateOperationalManagementRowGroupMetaData(this.assignedOperationalsManagementsTree);
      this.numberOfElementsByAssignedOperationalManagement[''] = elements?.length;
      this.getNumberOfElementsByOperationalManagement(this.assignedOperationalsManagementsTree, this.numberOfElementsByAssignedOperationalManagement);
    });

    this.noAssignedOperationalsManagementsSubscription = this.store.select(state => state.organizationChart.noAssignedOperationalsManagements).subscribe(e => {
      let elements = this.filterByActivity(e);
      this.noAssignedOperationalsManagementsTree = elements?.map ( obj => this.transformNoAssignedOperationalManagementToTreeNode(obj));
      this.noAssignedOperationalsManagementsRowGroupMetadata = this.onGoToUpdateOperationalManagementRowGroupMetaData(this.noAssignedOperationalsManagementsTree);
      this.numberOfElementsByNoAssignedOperationalManagement[''] = elements?.length;
      this.getNumberOfElementsByOperationalManagement(this.noAssignedOperationalsManagementsTree, this.numberOfElementsByNoAssignedOperationalManagement);
    });

    this.organizationChartSubscribe =  this.store.select(state => state.organizationChart.item).subscribe( e => {
      this.selectedOrganizationChart = e;
      if(this.hierarchyTree?.length){
        this.hierarchyTree[0].data = {root: true, ...this.selectedOrganizationChart};
      }
    });
    this.hierarchiesSubscribe =  this.store.select(state => state.hierarchy.items).subscribe( e => {
      this.hierarchies = e;
      const nodes = this.buildNodes(e);
      this.hierarchyTree = [];
      if(this.selectedOrganizationChart?.id){
        this.hierarchyTree.push(
          {
            expanded: true,
            data: {root: true, ...this.selectedOrganizationChart},
            styleClass: `bg-primary-50 border-round border-primary-300`,
            children: nodes
          }
        )
      }
    });
    this.operationalManagementExpandedNodesSubscription = this.store.select(state => state.organizationChart.operationalManagementExpandedNodes).subscribe(
      e => {this.operationalManagementExpandedNodes = e;}
    );
    this.viewModeSubscription = this.store.select(state => state.organizationChart.viewMode).subscribe(e => this.viewMode = e);
    this.mustRechargeSubscription = this.store.select(state => state.organizationChart.mustRecharge).subscribe(e => {
      if (e){this.getOrganizationCharts()}
    });
    this.mustRechargeNoAssignedOperationalsManagementsSubscription = this.store.select(state => state.organizationChart.mustRechargeNoAssignedOperationalsManagements).subscribe(
      e => {this.mustRechargeNoAssignedOperationalsManagements = e;
    });

    this.initMenus();
  }

  ngOnDestroy(): void {
    this.hierarchiesSubscribe?.unsubscribe();
    this.organizationChartSubscribe?.unsubscribe();
    this.mustRechargeSubscription?.unsubscribe();
    this.operationalManagementExpandedNodesSubscription?.unsubscribe();
    this.viewModeSubscription?.unsubscribe();
    this.assignedOperationalsManagementsSubscription?.unsubscribe();
    this.noAssignedOperationalsManagementsSubscription?.unsubscribe();
    this.mustRechargeNoAssignedOperationalsManagementsSubscription?.unsubscribe();
    this.filteredNoAssignedValuesSubscription?.unsubscribe();
    this.filteredAssignedValuesSubscription?.unsubscribe();
  }

  initMenus(){
    this.menuBarItems = [
      {label: 'Asignación de cargos', icon: 'pi pi-users', command: (e)=> this.onGoToManagementAppointments({} as Hierarchy, e.originalEvent)},
      {label: 'Reportes', icon: 'pi pi-fw pi-file', items: this.menuItemsOfDownload}
    ];
    
    this.operationalManagementItems = [
      { label: 'Asignadas', icon: 'pi pi-check-circle', command: ()=> this.getAssignedOperationalsManagements(), viewMode: 'ASSIGNED'},
      { label: 'Sin asignar', icon: 'pi pi-hourglass',command: ()=> this.getNoAssignedOperationalsManagements(), viewMode: 'NO_ASSIGNED'}
    ];

    this.menuItemsOrganizationChart = [
      {label: 'Ver detalles', icon: 'pi pi-eye', command: (e) => this.showDetailOfOrganizationChart(e.originalEvent)},
      {label: 'Agregar dependencia', icon: 'pi pi-plus', visible: this.isAdmin, command: (e) => this.onGoCreateHierarchy(null, e.item.id)},
      {label: 'Asociar dependencia', icon: 'pi pi-arrow-right-arrow-left', visible: this.isAdmin, command: (e) => this.onGoAssociateHierarchy(null, e.originalEvent)},
      {label: 'Asignación de cargos', icon: 'pi pi-users', command: (e)=> this.onGoToManagementAppointments({idOrganigrama: parseInt( e.item.id)} as Hierarchy, e.originalEvent)},
      {label: 'Editar', icon: 'pi pi-pencil', visible: this.isAdmin, command: (e) => this.onGoUpdateOrganizationChart(e.item.id, e.originalEvent)},
      {label: 'Eliminar organigrama', icon: 'pi pi-trash', visible: this.isAdmin, command: (e) => this.onDeleteOrganizationChart(e)},
    ];

    this.menuItemsHierarchy = [
      {label: 'Gestiones operativas', icon: 'pi pi-list', command: (e)=> this.onGoAssociateOperationalsManagements(e.item['value'], e.originalEvent)},
      {label: 'Agregar subdependencia', icon: 'pi pi-sitemap', visible: this.isAdmin, command: (e) => this.onGoCreateHierarchy(e.item.id, this.selectedOrganizationChart.id)},
      {label: 'Asociar subdependencia', icon: 'pi pi-arrow-right-arrow-left', visible: this.isAdmin, command: (e) => this.onGoAssociateHierarchy(e.item['value'], e.originalEvent)},
      {label: 'Asignación de cargos', icon: 'pi pi-users', command: (e)=> this.onGoToManagementAppointments(e.item['value'], e.originalEvent)},
      {label: 'Editar', icon: 'pi pi-pencil', visible: this.isAdmin, command: (e) => this.onGoUpdateHierarchy(e.item.id, e.originalEvent)},
      {label: 'Eliminar jerarquía', icon: 'pi pi-trash', visible: this.isAdmin, command: (e) => this.onDeleteHierarchy(e)},
      {label: 'Eliminar dependencia', icon: 'pi pi-trash', visible: this.isAdmin, command: (e) => this.onDeleteHierarchyAndDependency(e)},
    ];
  }  

  get totalOfSelectedAssignedOperationalsManagements(): number{
    return this.treeTableAssignedOperationalManagement?.selection?.length;
  }

  get totalOfSelectedNoAssignedOperationalsManagements(): number{
    return this.treeTableNoAssignedOperationalManagement?.selection?.length;
  }

  get numberOfDependenciesInOrganizationChart(): number{
    return this.getNumberOfDependenciesInOrganizationChart(this.hierarchies);
  }

  filterByActivity(elements: OperationalManagement[]): OperationalManagement[] {
    return elements
      .map((element) => {
        if (element.subGestionesOperativas && element.subGestionesOperativas.length > 0) {
          element.subGestionesOperativas = this.filterByActivity(element.subGestionesOperativas);
        }
        const hasActivity =
          element.actividad !== undefined || 
          (element.subGestionesOperativas && element.subGestionesOperativas.length > 0);

        return hasActivity ? element : null;
      })
      .filter((element) => element !== null) as OperationalManagement[];
  }
  

  getNumberOfDependenciesInOrganizationChart(hierarchies: Hierarchy[]){
    let total = 0;
    if(!hierarchies?.length) return  total;

    for (let e of hierarchies){
      total += 1 + this.getNumberOfDependenciesInOrganizationChart(e.subJerarquias);
    }
    return total;
  }

  getOrganizationCharts(){
    this.loading = true;
    this.organizationChartService.getOrganizationalCharts().subscribe({
      next: (e)=> {
        this.store.dispatch(OrganizationChartActions.setList({organizationCharts: e}));
        this.store.dispatch(OrganizationChartActions.setMustRecharge({mustRecharge: false}));
        if(e?.length){
          const first = e[0];
          this.store.dispatch(OrganizationChartActions.setOrganizationChart({organizationChart: first}));
          this.getHierarchies(first.id);
        }
        this.loading = false;
      },
      error: (e)=>{
        this.loading = false;
      }
    })
  }

  onDeleteOrganizationChart(event: any): void {
    let id = parseInt(event.item.id);
    event.originalEvent.preventDefault();
    event.originalEvent.stopPropagation();
    this.confirmationDialogService.showDeleteConfirmationDialog(
      () => {
        this.organizationChartService.deleteOrganizationChart(id)
        .subscribe({
          next: () => {
            this.store.dispatch(OrganizationChartActions.removeFromList({id: id}));
            this.store.dispatch(OrganizationChartActions.setOrganizationChart({organizationChart: null}));
            this.store.dispatch(HierarchyActions.setList({hierarchies: null}));
          },
        });
      }
    )
  }

  onGoUpdateOrganizationChart(id: any, event: Event) {
    this.router.navigate([this.cryptoService.encryptParam(id)], {
      relativeTo: this.route,
      skipLocationChange: true,
    }).then();
  }

  getHierarchies(organizaonChartId: number): void {
    this.loadingHierarchies = true;
    this.organizationChartService.getHierarchiesByOrganizationChartId(organizaonChartId).subscribe({
      next: (e) => {
        this.store.dispatch(HierarchyActions.setList({hierarchies: e}));
        this.loadingHierarchies = false;this.loadingHierarchies = false;
      },
      error: (e) => this.loadingHierarchies = false
    });
  }

  openNew() {
    this.router.navigate(['create'], {
      relativeTo: this.route,
      skipLocationChange: true
    }).then();
  }

  onGoCreateHierarchy(parentId: any, organizationChartId: any){
    this.router.navigate(['hierarchy/create'], {
      relativeTo: this.route,
      skipLocationChange: true,
      queryParams: {parentId: this.cryptoService.encryptParam(parentId), organizationChartId: this.cryptoService.encryptParam(organizationChartId)}
    }).then();
  }

  onGoUpdateHierarchy(id: any, event: Event) {
    this.router.navigate(['hierarchy', this.cryptoService.encryptParam(id)], {
      relativeTo: this.route,
      skipLocationChange: true,
    }).then();
  }

  onDeleteHierarchy(event: any): void {
    let id = parseInt(event.item.id);
    let hierarchy: Hierarchy = event.item['value'];
    event.originalEvent.preventDefault();
    event.originalEvent.stopPropagation();
    this.confirmationDialogService.showDeleteConfirmationDialog(
      () => {
        this.organizationChartService.deleteHierarchy(id)
        .subscribe({
          next: () => {
            this.store.dispatch(HierarchyActions.removeFromList({id: id}));
          },
        });
      },
      `
      ¿Está seguro de eliminar la relación de la dependencia <strong>${hierarchy?.dependencia?.nombre}</strong>
      en el organigrama <strong>${hierarchy?.organigrama?.nombre}</strong>?
      <div class="bg-yellow-50 text-yellow-500 border-round-xl p-4 text-justify mt-2">
        <span>
            <strong>Advertencia:</strong>
            Eliminar la relación implica eliminar las relaciones con las subdependencias. Aquí no se eliminan las dependencias relacionadas.
            Por favor, asegúrese de que comprende el impacto de esta acción antes de proceder.
        </span>
      </div>
      `
    )
  }

  onDeleteHierarchyAndDependency(event : any): void {
    let hierarchyId = parseInt(event.item.id);
    let hierarchy: Hierarchy = event.item['value'];
    event.originalEvent.preventDefault();
    event.originalEvent.stopPropagation();
    this.confirmationDialogService.showDeleteConfirmationDialog(
      () => {
        this.organizationChartService.deleteHierarchyAndDependency(hierarchyId).subscribe({
          next: () => {
            this.store.dispatch(HierarchyActions.removeFromList({id: hierarchyId}));
            this.dependencies= this.dependencies?.filter(e => e.id != hierarchy.idDependencia);
            this.filteredDependencies = this.filterDependencies(this.dependencies);
          }
        });
      },
      `
      ¿Está seguro de eliminar la dependencia <strong>${hierarchy?.dependencia?.nombre}</strong>?
      <div class="bg-yellow-50 text-yellow-500 border-round-xl p-4 text-justify mt-2">
        <span>
            <strong>Advertencia:</strong>
            Eliminar la dependencia implica eliminar su relación en ésta y en otras estructuras organizacionales.
            Por favor, asegúrese de que comprende el impacto de esta acción antes de proceder.
        </span>
      </div>
      `
    )
  }

  onDeleteDependency(dependency: Dependency, event: Event){
    event.preventDefault();
    event.stopPropagation();
    this.confirmationDialogService.showDeleteConfirmationDialog(
      () => {
        this.organizationChartService.deleteDependency(dependency.id).subscribe({
          next: () => {
            this.dependencies= this.dependencies.filter(e => e.id != dependency.id);
            this.filteredDependencies = this.filterDependencies(this.dependencies);
          }
        });
      },
      `¿Está seguro de eliminar la dependencia <strong>${dependency.nombre}</strong>?`
    )
  }

  getDependencies(): void {
    this.loadingDependencies = true;
    this.organizationChartService.getDependencies().subscribe({
      next: (e) => {
        this.dependencies=e;
        this.filteredDependencies = this.filterDependencies(this.dependencies);
        this.loadingDependencies = false;
      },
      error: () => this.loadingDependencies = false
    });
  }

  getConventions(dependencies: Dependency[]){
    if (!dependencies) return [];
    let conventions = [];
    for (let d of dependencies){
      if(!conventions.map(obj => obj.id).includes(d.idConvencion) && d.convencion){
        conventions.push(d.convencion)
      }
    }
    return conventions;
  }

  onGoAssociateHierarchy(hierarchy: Hierarchy, event: Event){
    this.hierarchyOnWorking = hierarchy;
    if(!this.dependencies?.length){
      this.getDependencies();
    }else{
      this.filteredDependencies = this.filterDependencies(this.dependencies);
    }
    this.dependencyOptionsOverlayPanel.toggle(event);
  }

  private filterDependencies(dependencies: Dependency[]): Dependency[]{
    let usedDependencies = [];
    this.getAssociatedDependenciesOnOrganizationChart(this.hierarchies, usedDependencies);
    return dependencies?.filter(e => !usedDependencies?.map(obj => obj.id).includes(e.id));
  }

  private getAssociatedDependenciesOnOrganizationChart(hierarchies: Hierarchy[],  dependencies: Dependency[]){
    if(!hierarchies) return;
    for (let hierarchy of hierarchies){
      dependencies.push(hierarchy.dependencia);
      this.getAssociatedDependenciesOnOrganizationChart(hierarchy.subJerarquias, dependencies);
    }
  }

  selectDependency(data: any){
    this.selectedDependency = data.value;
    let hierarchy = {
      idDependencia: this.selectedDependency.id,
      idOrganigrama: this.selectedOrganizationChart.id,
      idPadre: this.hierarchyOnWorking?.id,
    }

    let formData = new FormData();
    formData.append('hierarchy', JSON.stringify(hierarchy));

    this.dependencyOptionsOverlayPanel.hide();
    this.createHierarchy(formData);
  }

  createHierarchy(formData: any): void {
    this.organizationChartService.createHierarchy(formData).subscribe({
      next: (e) => {
        let obj = e as Hierarchy;
        obj.dependencia = this.selectedDependency;
        obj.organigrama = this.selectedOrganizationChart;
        this.store.dispatch(HierarchyActions.addToList({hierarchy: obj}));
      },
      error: (error) => {},
    });
  }
  
  onViewChange(event: "base-structure" | "diagram") {
    this.store.dispatch(OrganizationChartActions.setViewMode({viewMode: event}));
  }

  changeOrganizationChart(data: any){
    this.store.dispatch(OrganizationChartActions.setOrganizationChart({organizationChart: data.value}));
    this.getHierarchies(this.selectedOrganizationChart.id);
    this.organizationChartOptionsOverlayPanel.hide();
  }

  toggleIcon(show: boolean, id, key: 'hierarchy' | 'organizationChart'){
    this.showedIcons[key+id] = show;
  }

  showDetailOfOrganizationChart(event: Event){
    this.detailOfOrganizationChartOverlayPanel.toggle(event);
  } 

  onGoToManagementAppointments(hierarchy: Hierarchy, event: Event) {
    const backRoute = '/configurations/structures';
    this.store.dispatch(AppointmentActions.setHierarchyOnWorking({hierarchy: hierarchy}));
    this.store.dispatch(AppointmentActions.setMustRecharge({mustRecharge: true}));
    this.router.navigate(['configurations/appointments'], { skipLocationChange: true, queryParams: {backRoute: backRoute}})
  }

  onGoAssociateOperationalsManagements(hierarchy: Hierarchy, event: Event){
    this.mustRechargeAssignedOperationalsManagements = hierarchy.id != this.hierarchyOnWorking?.id;
    this.hierarchyOnWorking = hierarchy;
    this.operationalsManagementsOverlayPanel.toggle(event);
    if(!this.operationalManagementActiveItem){
      this.operationalManagementActiveItem = this.operationalManagementItems[0];
    }
    this.desmarkAllAssignedOperationalsManagements();
    this.desmarkAllNoAssignedOperationalsManagements();
    this.operationalManagementActiveItem.command();
  }

  onOperationalsManagementsActiveItemChange(menuItem: MenuItem){
    this.operationalManagementActiveItem = menuItem;
  }

  private getNumberOfElementsByOperationalManagement(nodes: TreeNode[], numberOfElementsBy){
    nodes?.forEach( e=> {
      numberOfElementsBy[e.data.id] = e.children?.length;
      this.getNumberOfElementsByOperationalManagement(e.children, numberOfElementsBy)
    })
  }

  hasDetailToShow(operationalManagement : OperationalManagement){
    if (operationalManagement.actividad){
      return true;
    }
    return false;
  }

  showDetailOfActivity(elementRef: HTMLDivElement, event: Event) {
    if (elementRef.style.display === 'none' || !elementRef.style.display) {
      elementRef.style.display = 'block';
    } else {
      elementRef.style.display = 'none'; 
    }

    const button = event.currentTarget as HTMLElement;
    const iconElement = button.querySelector('span'); 
    if (iconElement) {
      if (iconElement.classList.contains('pi-eye')) {
        iconElement.classList.remove('pi-eye');
        iconElement.classList.add('pi-eye-slash');
      } else {
        iconElement.classList.remove('pi-eye-slash');
        iconElement.classList.add('pi-eye');
      }
    }
  }

  getAssignedOperationalsManagements(){
    if(this.mustRechargeAssignedOperationalsManagements){
      this.loadingAssignedOperationalsManagements = true;
      this.organizationChartService.getAssignedOperationalsManagements(this.hierarchyOnWorking.id).subscribe({
        next: (e)=> {
          this.store.dispatch(OrganizationChartActions.setAssignedOperationalsManagements({assignedOperationalsManagements: e}));
          this.loadingAssignedOperationalsManagements = false;
          this.mustRechargeAssignedOperationalsManagements = false;
        },
        error: (e)=>{
          this.loadingAssignedOperationalsManagements = false;
        }
      });
    }
  }

  getNoAssignedOperationalsManagements(){
    if(this.mustRechargeNoAssignedOperationalsManagements){
      this.loadingNoAssignedOperationalsManagements = true;
      this.organizationChartService.getNoAssignedOperationalsManagements(this.selectedOrganizationChart.id).subscribe({
        next: (e)=> {
          this.store.dispatch(OrganizationChartActions.setNoAssignedOperationalsManagements({noAssignedOperationalsManagements: e}));
          this.store.dispatch(OrganizationChartActions.setMustRechargeNoAssignedOperationalsManagements({mustRecharge: false}));
          this.loadingNoAssignedOperationalsManagements = false;
        },
        error: (e)=>{
          this.loadingNoAssignedOperationalsManagements = false;
        }
      });
    }
  }

  onOperationalManagementNodeExpand(event) {
    this.store.dispatch(OrganizationChartActions.addToOperationalManagementExpandedNodes({operationalManagementId: event.node.data.id}));
  }

  onOperationalManagementNodeCollapse(event) {
    this.store.dispatch(OrganizationChartActions.removeFromOperationalManagementExpandedNodes({operationalManagementId: event.node.data.id}));
  }

  onFilterAssignedOperationalManagement(event: Event) {
    this.treeTableAssignedOperationalManagement.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    if(!this.filteredAssignedValuesSubscription){
      this.filteredAssignedValuesSubscription = this.treeTableAssignedOperationalManagement.onFilter.asObservable().subscribe( 
        e => {
          this.assignedOperationalsManagementsRowGroupMetadata = this.onGoToUpdateOperationalManagementRowGroupMetaData(e.filteredValue);
        }
      )
    }
  }

  onFilterNoAssignedOperationalManagement(event: Event) {
    this.treeTableNoAssignedOperationalManagement.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    if(!this.filteredNoAssignedValuesSubscription){
      this.filteredNoAssignedValuesSubscription = this.treeTableNoAssignedOperationalManagement.onFilter.asObservable().subscribe(
         e => {
          this.noAssignedOperationalsManagementsRowGroupMetadata = this.onGoToUpdateOperationalManagementRowGroupMetaData(e.filteredValue);
         }
      )
    }
  }

  desmarkAllAssignedOperationalsManagements(){
    this.selectedNodesOfAssignedOperationalManagement = [];
  }

  desmarkAllNoAssignedOperationalsManagements(){
    this.selectedNodesOfNoAssignedOperationalManagement = [];
  }

  /**
   * Elimina la relación de las gestiones operativas en una jerarquía.
   */
  deleteSelectedAssignedOperationalManagement() {
    let relationshipIds = (this.selectedNodesOfAssignedOperationalManagement as TreeNode[])
      .filter(e => e.data.idJerarquiaGestionOperativa != null)
      .map(e => e.data.idJerarquiaGestionOperativa);
    let operationalsManagementsIds = (this.selectedNodesOfAssignedOperationalManagement as TreeNode[]).map(e => e.data.id);
    this.confirmationDialogService.showDeleteConfirmationDialog(
      () => {
        this.organizationChartService.deleteHierarchyRelationshipWithOperationalsManagements(relationshipIds)
        .subscribe({
          next: (e) => {
            this.store.dispatch(OrganizationChartActions.removeItemsFromAssignedOperationalsManagements({operationalsManagementsIds: operationalsManagementsIds}));
            this.store.dispatch(OrganizationChartActions.setMustRechargeNoAssignedOperationalsManagements({mustRecharge: true}));
            this.desmarkAllAssignedOperationalsManagements();
          }
        });
      }
    )
  }

  deleteHierarchyRelationshipWithOperationalManagement(operationalManagement: OperationalManagement, event: Event){
    event.preventDefault();
    event.stopPropagation();
    this.confirmationDialogService.showDeleteConfirmationDialog(
      () => {
        this.organizationChartService.deleteHierarchyRelationshipWithOperationalManagement(operationalManagement.idJerarquiaGestionOperativa).subscribe({
          next: (e) => {
            this.store.dispatch(OrganizationChartActions.removeFromAssignedOperationalsManagements({operationalManagementId: operationalManagement.id}));
            this.store.dispatch(OrganizationChartActions.setMustRechargeNoAssignedOperationalsManagements({mustRecharge: true}));
            this.desmarkAllAssignedOperationalsManagements();
          }
        });
      }
    )
  } 

  assignOperationalsManagements(){
    this.isAssigning = true;
    let operationalsManagementsIds = (this.selectedNodesOfNoAssignedOperationalManagement as TreeNode[]).filter(e => e.data.actividad != null).map(e => e.data.id);
    this.organizationChartService.createHierarchyRelationshipWithOperationalsManagements(operationalsManagementsIds, this.hierarchyOnWorking.id).subscribe({
      next: (e) => {
        this.store.dispatch(OrganizationChartActions.addToAssignedOperationalsManagements({operationalsManagements: e}));
        this.store.dispatch(OrganizationChartActions.removeItemsFromNoAssignedOperationalsManagements({operationalsManagementsIds: operationalsManagementsIds}));
        this.desmarkAllNoAssignedOperationalsManagements();
        this.isAssigning = false;
      },
      error: ()=> this.isAssigning = false
    });
  }

  private onGoToUpdateOperationalManagementRowGroupMetaData(nodes: TreeNode[]){
    let rowGroupMetadata = [];
    this.updateOperationalManagementRowGroupMetaData(nodes ?? [], rowGroupMetadata);
    return rowGroupMetadata;
  }

  private updateOperationalManagementRowGroupMetaData(nodes: TreeNode[], rowGroupMetadata: any[], idTipologiaPadre?: number){
    nodes.forEach( (e, index) => {
      const operationalManagement: OperationalManagement = e.data;
      if (index == 0){
        if (operationalManagement.idTipologia != idTipologiaPadre){
          rowGroupMetadata.push(operationalManagement.id);
        }
      }
      this.updateOperationalManagementRowGroupMetaData(e.children ?? [], rowGroupMetadata, operationalManagement.idTipologia);
    })
  }

  private transformAssignedOperationalManagementToTreeNode(operationalManagement: OperationalManagement): TreeNode | null {
    return (this.selectedNodesOfAssignedOperationalManagement as TreeNode[])?.find(e => e.data.id == operationalManagement.id) ?? {
      data: {...operationalManagement, menuItems: this.getMenuItemsOfAssignedOperationalManagement(operationalManagement)},
      children: operationalManagement.subGestionesOperativas?.map(e => this.transformAssignedOperationalManagementToTreeNode(e)).filter(e => e),
      expanded: this.operationalManagementExpandedNodes?.includes(operationalManagement.id),
    };
  }

  private transformNoAssignedOperationalManagementToTreeNode(operationalManagement: OperationalManagement): TreeNode | null {
    return (this.selectedNodesOfAssignedOperationalManagement as TreeNode[])?.find(e => e.data.id == operationalManagement.id) ?? {
      data: {...operationalManagement, menuItems:[]},
      children: operationalManagement.subGestionesOperativas?.map(e => this.transformNoAssignedOperationalManagementToTreeNode(e)).filter(e => e),
      expanded: this.operationalManagementExpandedNodes?.includes(operationalManagement.id),
    };
  }

  /**
   * Obtiene el menú de opciones para una gestión operativa.
   * Nota: Aquí las únicas gestiones operativas que tienen el atributo idJerarquiaGestionOperativa son aquellas 
   * gestiones operativas que estan relacionadas o han sido asignadas a una jerarquía.
   * @param operationalManagement: Gestión operativa 
   * @returns 
   */
  private getMenuItemsOfAssignedOperationalManagement(operationalManagement: OperationalManagement): MenuItem []{
    if(!operationalManagement){
      return [];
    }
    let generalMenuItem = [];
    if(operationalManagement.idJerarquiaGestionOperativa != null){
      generalMenuItem.push(
        {
          label: 'Eliminar', icon: 'pi pi-trash', visible: this.isAdmin && operationalManagement.idJerarquiaGestionOperativa != null, 
          data:operationalManagement, command: (e) => this.deleteHierarchyRelationshipWithOperationalManagement(e.item['value'], e.originalEvent)
        },
      );
    }
    return [
      ...generalMenuItem
    ]
  }

  buildNodes(hierarchies: Hierarchy[]): TreeNode<Hierarchy>[] {
    if (!hierarchies) {
      return [];
    }
    const nodes: TreeNode<OrganizationChart>[] = [];
    for (const jerarquia of hierarchies) {
      const node: TreeNode<OrganizationChart> = {
        expanded: true,
        data: jerarquia,
        styleClass: `bg-${jerarquia.dependencia.convencion?.nombreColor}-50 border-round border-${jerarquia.dependencia.convencion?.nombreColor}-300`,
        children: this.buildNodes(jerarquia.subJerarquias)
      };
      nodes.push(node);
    }
    return nodes;
  }

  download(data: any) {
    const updateMenuItem = (menuItem: MenuItem, icon: string, disabled: boolean, label?: string) => {
      if (menuItem) {
        menuItem.label = label;
        menuItem.icon = icon;
        menuItem.disabled = disabled;
        menuItem.label = label;
      }
    };

    const automationId = data.item.automationId;
    const menuItem = ! this.selectedOrganizationChart.id
      ? this.menuItemsOfDownload.find(e => e.automationId === automationId)
      : null;
    const initialIcon = menuItem?.icon;
    const initialState = menuItem?.disabled;
    const initialLabel = menuItem?.label;

    updateMenuItem(menuItem, "pi pi-spin pi-spinner", true);
    this.organizationChartService.downloadReport(automationId, this.selectedOrganizationChart.id).pipe(
      finalize(() => {
        updateMenuItem(menuItem, initialIcon, initialState, initialLabel);
      })
    ).subscribe({
      next: (res) => {
        //this.reportUploaded(menuItem, initialLabel, automationId, res);
      }
    });
  }

  private reportUploaded(menuItem: MenuItem, label: string, automationId: string, downloadProgress: number) {
    let element = document.getElementById(`${automationId}`) as HTMLProgressElement;
    if (element === null) {
      menuItem.label = `
            <span>${label}</span>
            <progress id="${automationId}" max="100" style="width: 100%"></progress>
        `;
      menuItem.label = this.sanitizer.bypassSecurityTrustHtml(menuItem.label as string) as unknown as string;
    } else if (downloadProgress > 0) {
      element.setAttribute('value', `${downloadProgress}`);
    }
    this.cdr.detectChanges();
  }
}
