import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import * as OrganizationChartActions from "@store/organizationChart.actions";
import * as HierarchyActions from "@store/hierarchy.actions";
import * as AppointmentActions from "@store/appointment.actions";
import {IMAGE_SIZE} from "@utils";
import {MESSAGE} from "@labels/labels";
import {Store} from "@ngrx/store";
import {AppState} from "../../../../../app.reducers";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthenticationService, ConfirmationDialogService, CryptojsService, OrganizationChartService} from "@services";
import {map, Observable, Subscription} from "rxjs";
import {Convention, Dependency, Hierarchy, OrganizationChart, Structure} from "@models";
import {MenuItem, TreeNode} from "primeng/api";
import { OverlayPanel } from 'primeng/overlaypanel';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {

  protected readonly IMAGE_SIZE = IMAGE_SIZE;
  protected readonly MESSAGE = MESSAGE;

  @ViewChild('dependencyOptionsOverlayPanel') dependencyOptionsOverlayPanel: OverlayPanel;

  loading: boolean = false;
  loadingHierarchies: boolean = false;
  loadingDependencies: boolean = false;
  isAdmin: boolean;

  organizationCharts$: Observable<OrganizationChart[]>;
  conventions$: Observable<Convention[]>;
  selectedOrganizationChart: OrganizationChart;
  hierarchyTree: TreeNode<Hierarchy>[] = [];
  hierarchies: Hierarchy[] = [];

  mustRechargeSubscription: Subscription;
  organizationChartSubscribe: Subscription;
  hierarchiesSubscribe: Subscription;

  menuItemsOrganizationChart: MenuItem[] = [];
  menuItemsHierarchy: MenuItem[] = [];

  showedIcons: any = {};
  hierarchyIdOnWorking: any;
  selectedDependency: Dependency;

  dependencies: Dependency[] = [];
  filteredDependencies: Dependency[] = [];
  menuBarItems: MenuItem[] = [];

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private organizationChartService: OrganizationChartService,
    private confirmationDialogService: ConfirmationDialogService,
    private cryptoService: CryptojsService,
  ) {
  }

  ngOnInit() {
    const {isAdministrator} = this.authService.roles();
    this.isAdmin = isAdministrator;
    this.organizationCharts$ =  this.store.select(state => state.organizationChart.items);
    this.conventions$ = this.store.select(state => state.hierarchy.items).pipe(
      map(e => {
        const associatedDependencies = [];
        this.getAssociatedDependenciesOnOrganizationChart(e, associatedDependencies);
        return this.getConventions(associatedDependencies);
      })
    );
    this.organizationChartSubscribe =  this.store.select(state => state.organizationChart.item).subscribe( e => this.selectedOrganizationChart = e);
    this.hierarchiesSubscribe =  this.store.select(state => state.hierarchy.items).subscribe( e => {
      this.hierarchies = e;
      const nodes = this.buildNodes(e);
      this.hierarchyTree = [];
      if(this.selectedOrganizationChart.id){
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
    this.mustRechargeSubscription = this.store.select(state => state.organizationChart.mustRecharge).subscribe(e => {
      if (e){this.getOrganizationCharts()}
    });
    this.initMenus();

    this.menuBarItems = [
      {label: 'Asignación de cargos', icon: 'pi pi-users', command: (e)=> this.onGoToManagementAppointments()}
    ];
  }

  ngOnDestroy(): void {
    this.hierarchiesSubscribe?.unsubscribe();
    this.organizationChartSubscribe?.unsubscribe();
    this.mustRechargeSubscription?.unsubscribe();
  }
  
  initMenus(){
    this.menuItemsOrganizationChart = [
      {label: 'Agregar dependencia', icon: 'pi pi-plus', visible: this.isAdmin, command: (e) => this.onGoCreateHierarchy(null, e.item.id)},
      {label: 'Asociar dependencia', icon: 'pi pi-arrow-right-arrow-left', visible: this.isAdmin, command: (e) => this.onGoAssociateHierarchy(null, e.originalEvent)},
      {label: 'Editar', icon: 'pi pi-pencil', visible: this.isAdmin, command: (e) => this.onGoUpdateOrganizationChart(e.item.id, e.originalEvent)},
      {label: 'Eliminar', icon: 'pi pi-trash', visible: this.isAdmin, command: (e) => this.onDeleteOrganizationChart(e)}
    ];

    this.menuItemsHierarchy = [
      {label: 'Agregar subdependencia', icon: 'pi pi-sitemap', visible: this.isAdmin, command: (e) => this.onGoCreateHierarchy(e.item.id, this.selectedOrganizationChart.id)},
      {label: 'Asociar subdependencia', icon: 'pi pi-arrow-right-arrow-left', visible: this.isAdmin, command: (e) => this.onGoAssociateHierarchy(e.item.id, e.originalEvent)},
      {label: 'Editar', icon: 'pi pi-pencil', visible: this.isAdmin, command: (e) => this.onGoUpdateHierarchy(e.item.id, e.originalEvent)},
      {label: 'Eliminar', icon: 'pi pi-trash', visible: this.isAdmin, command: (e) => this.onDeleteHierarchy(e)},
    ];
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
      }
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
      if(!conventions.map(obj => obj.id).includes(d.convencion.id)){
        conventions.push(d.convencion)
      }
    }
    return conventions;
  }

  onGoAssociateHierarchy(hierarchyId: any, event: Event){
    this.hierarchyIdOnWorking = hierarchyId;
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
      idPadre: this.hierarchyIdOnWorking,
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
  
  changeOrganizationChart(data: any){
    this.store.dispatch(OrganizationChartActions.setOrganizationChart({organizationChart: data.value}));
    this.getHierarchies(this.selectedOrganizationChart.id);
  }

  toggleIcon(show: boolean, id, key: 'hierarchy' | 'organizationChart'){
    this.showedIcons[key+id] = show;
  }

  onGoToManagementAppointments() {
    const backRoute = '/configurations/structures';
    this.store.dispatch(AppointmentActions.setHierarchyOnWorking({hierarchy: null}));
    this.store.dispatch(AppointmentActions.setMustRecharge({mustRecharge: true}));
    this.router.navigate(['configurations/appointments'], { skipLocationChange: true, queryParams: {backRoute: backRoute}})
  }

  onGoToManagementAppointmentsByHierarchyId(hierarchyId: number) {
    const backRoute = '/configurations/structures';
    this.store.dispatch(AppointmentActions.setHierarchyOnWorking({hierarchy: null}));
    this.store.dispatch(AppointmentActions.setMustRecharge({mustRecharge: true}));
    this.router.navigate(['configurations/appointments'], { skipLocationChange: true, queryParams: {backRoute: backRoute}})
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
}
