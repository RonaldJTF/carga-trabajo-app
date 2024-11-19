import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import * as StructureActions from "@store/structure.actions";
import {finalize, map, Observable, Subscription} from 'rxjs';
import {Store} from '@ngrx/store';
import {AppState} from 'src/app/app.reducers';
import {IMAGE_SIZE, Methods} from '@utils';
import {MESSAGE} from '@labels/labels';
import {MenuItem, TreeNode} from 'primeng/api';
import {ActivatedRoute, Router} from '@angular/router';
import {TreeTable} from 'primeng/treetable';
import {AuthenticationService, ConfirmationDialogService, CryptojsService, StructureService} from "@services";
import {Structure} from "@models";
import {Menu} from "primeng/menu";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy{
  IMAGE_SIZE = IMAGE_SIZE;
  MESSAGE = MESSAGE;
  /*Nota: PATH_NO_MANAGED_BY_PARENT hace referencia a todas aquellas rutas que no son gestionadas por aquellas estructuras que figuran como padre de
   elementos de su mismo tipo, es decir, si es una estructura actividad y tiene subactividades, esta no pueden gestionarse (asignar tiempo usual, tiempo max, etc.)*/
  PATH_NO_MANAGED_BY_PARENT: string[] = ['configurations/structures/action/activity'];

  /*Nota: PATH_NO_MANAGED_IF_HAS_ACTIVITY hace referencia a todas aquellas rutas que no son gestionadas si ya la estructura tiene una actividad gestionada*/
  PATH_NO_MANAGED_IF_HAS_ACTIVITY: string[] = ['configurations/structures/action/sub-item'];

  @ViewChild('treeTableDependency') treeTableDependency: TreeTable;
  @ViewChild('treeTableOfStructuresNoDependency') treeTableOfStructuresNoDependency: TreeTable;

  isAdmin: boolean;
  isOperator: boolean;
  isSuperAdmin: boolean;

  structures$: Observable<Structure[]>;
  dependency$: Observable<Structure>;
  dependencies$: Observable<TreeNode[]>;
  noDependencies$: Observable<TreeNode[]>;

  selectedNodesOfDependency: TreeNode | TreeNode[] | null;
  selectedNodesOfStructuresNoDependency: TreeNode | TreeNode[] | null;

  filteredValuesSubscription: Subscription;
  noDependenciesSubscription: Subscription;
  mustRechargeSubscription: Subscription;
  dependencySubscription: Subscription;
  expandedNodesSubscription: Subscription;
  structuresSubscription: Subscription;
  orderIsAscendingSubscription: Subscription;


  loading: boolean = false;
  loadingDependency = false;
  rowGroupMetadata: number[] = [];
  numberOfElementsByStructure: any = {};

  dependencyMenuItems: MenuItem[] = [];
  expandedNodes: number[];
  orderIsAscending: boolean;

  menuBarItems: MenuItem[] = [];
  menuItemsOfDownload: MenuItem[] = [
    {label: 'Reporte de tiempos en PDF', escape: false, icon: 'pi pi-file-pdf', automationId:"pdf", command: (e) => { this.download(e) }},
    {separator: true},
    {label: 'Reporte de tiempos en Excel', escape: false, icon: 'pi pi-file-excel', automationId:"excel", command: (e) => { this.download(e) }},
    {label: 'Reporte plano de tiempos en Excel', escape: false, icon: 'pi pi-list', automationId:"excel", command: (e) => { this.reportFlat(e) }},
  ]

  @ViewChild('menu') menu!: Menu;

  constructor(
    private store: Store<AppState>,
    private confirmationDialogService: ConfirmationDialogService,
    private structureService: StructureService,
    private authService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
    private cryptoService: CryptojsService,
    private cdr: ChangeDetectorRef
  ){}

  ngOnInit(): void {
    const {isAdministrator, isOperator, isSuperAdministrator} = this.authService.roles();
    this.isAdmin = isAdministrator;
    this.isOperator = isOperator;
    this.isSuperAdmin = isSuperAdministrator;

    this.structures$ = this.store.select(state => state.structure.items);
    this.dependency$ = this.store.select(state => state.structure.dependency);
    this.dependencies$ = this.structures$.pipe(map(e => e?.map ( obj => this.transformToTreeNode(obj, true))));
    this.noDependencies$ = this.dependency$.pipe(map(e => e?.subEstructuras?.map( obj => this.transformToTreeNode(obj, false)).filter(o => o)));

    this.orderIsAscendingSubscription = this.store.select(state => state.structure.orderIsAscending).subscribe(e => this.orderIsAscending = e);
    this.noDependenciesSubscription = this.noDependencies$.subscribe( e=> {
      if(e?.length){this.numberOfElementsByStructure[e[0].data.idPadre] = e.length;}
      this.onGoToUpdateRowGroupMetaData(e);
      this.getNumberOfElementsByStructure(e);
    });
    this.mustRechargeSubscription = this.store.select(state => state.structure.mustRecharge).subscribe(e => {
      if (e){this.getDependencies()}
    });
    this.dependencySubscription = this.dependency$.subscribe( e => this.dependencyMenuItems = this.getMenuItemsOfStructure(e));
    this.expandedNodesSubscription = this.store.select(state => state.structure.expandedNodes).subscribe(e => this.expandedNodes = e);

    const backRoute = '/configurations/structures';
    this.menuBarItems = [
      {label: 'Reportes', icon: 'pi pi-fw pi-file', visible: this.isSuperAdmin, items: this.menuItemsOfDownload},
      {label: 'Designación de cargos', icon: 'pi pi-users', visible: this.isAdmin, command: ()=>{this.router.navigate(['configurations/appointments'], { skipLocationChange: true, queryParams: {backRoute: backRoute}})}}
    ];
  }

  ngOnDestroy(): void {
    this.filteredValuesSubscription?.unsubscribe();
    this.noDependenciesSubscription?.unsubscribe();
    this.mustRechargeSubscription?.unsubscribe();
    this.dependencySubscription?.unsubscribe();
    this.expandedNodesSubscription?.unsubscribe();
    this.orderIsAscendingSubscription?.unsubscribe();
  }

  get totalSelected(): number{
    return this.treeTableDependency?.selection?.length;
  }

  get totalSelectedStructuresNoDependency(): number{
    return this.treeTableOfStructuresNoDependency?.selection?.length ?? 0;
  }

  private getNumberOfElementsByStructure(nodes: TreeNode[]){
    nodes?.forEach( e=> {
      this.numberOfElementsByStructure[e.data.id] = e.children?.length;
      this.getNumberOfElementsByStructure(e.children)
    })
  }

  private transformToTreeNode(structure: Structure, isDependency: boolean): TreeNode | null {
    if (Methods.parseStringToBoolean(structure.tipologia.esDependencia) === isDependency) {
      /*Esto se hace (lo del if) porque si cambia la lista de items, entonces se tienen nuevas refeencias de objetos seleccionados en la tabla,
        así que para no perder esta referencia, se usan los mismos que ya habían sido seleccionados*/
      return (this.selectedNodesOfDependency as TreeNode[])?.find(e => e.data.id == structure.id) ?? {
        data: {...structure, menuItems: this.getMenuItemsOfStructure(structure)},
        children: structure.subEstructuras?.map(e => this.transformToTreeNode(e, isDependency)).filter(e => e),
        expanded: this.expandedNodes?.includes(structure.id),
      };
    }
    return null;
  }

  private getMenuItemsOfStructure(structure: Structure): MenuItem []{
    const extraMenuItemsOfDependency = [];
    let extraMenuItemOfActions = [];
    let generalMenuItem = [];

    if (this.isAdmin){
      extraMenuItemOfActions = structure?.tipologia?.acciones?.map(obj => ({
        label: obj.nombre, icon: `pi ${obj.claseIcono}`, data:obj, command: (e) => {this.goToPage(e, structure)},
        disabled: (this.hasChildrenOfTheSameType(structure) && this.PATH_NO_MANAGED_BY_PARENT.includes(obj.path)) ||
                  (structure.actividad != null && this.PATH_NO_MANAGED_IF_HAS_ACTIVITY.includes(obj.path))
      })) ?? [];

      generalMenuItem.push({label: 'Editar', icon: 'pi pi-pencil', command: (e) => this.onGoToUpdate(e.item.id, Methods.parseStringToBoolean(structure?.tipologia?.esDependencia), e.originalEvent)})
      generalMenuItem.push({label: 'Eliminar', icon: 'pi pi-trash', data:structure, command: (e) => this.onDeleteStructure(e)})

      if (Methods.parseStringToBoolean(structure?.tipologia?.esDependencia)){
        extraMenuItemsOfDependency.push({label: 'Ver', icon: `pi pi-eye`, data:structure, command: (e) => this.viewDependency(e.item.data)})
        if(this.isSuperAdmin){
          extraMenuItemsOfDependency.push({label: 'Descargar', icon: 'pi pi-cloud-download', items: [
            {label: 'Reporte PDF', icon: 'pi pi-file-pdf', automationId:"pdf", command: (e) => { this.download(e, structure.id) }},
            {label: 'Reporte Excel', icon: 'pi pi-file-excel', automationId:"excel", command: (e) => { this.download(e, structure.id) }},
          ]})
        }
      }
    }else if(this.isOperator || this.isSuperAdmin){
      if (Methods.parseStringToBoolean(structure?.tipologia?.esDependencia)){
        extraMenuItemsOfDependency.push({label: 'Ver', icon: `pi pi-eye`, data:structure, command: (e) => this.viewDependency(e.item.data)})
        if(this.isSuperAdmin){
          extraMenuItemsOfDependency.push({label: 'Descargar', icon: 'pi pi-cloud-download',  items: [
            {label: 'Reporte PDF', icon: 'pi pi-file-pdf', automationId:"pdf", command: (e) => { this.download(e, structure.id) }},
            {label: 'Reporte Excel', icon: 'pi pi-file-excel', automationId:"excel", command: (e) => { this.download(e, structure.id) }},
          ]})
        }
      }
    }
    return [
      ...extraMenuItemsOfDependency,
      ...extraMenuItemOfActions,
      ...generalMenuItem
    ]
  }

  private hasChildrenOfTheSameType(structure: Structure){
    return structure.subEstructuras?.some(e => e.idTipologia == structure.idTipologia);
  }

  private onGoToUpdateRowGroupMetaData(nodes: TreeNode[]){
    this.rowGroupMetadata = [];
    this.updateRowGroupMetaData(nodes ?? []);
  }

  private updateRowGroupMetaData(nodes: TreeNode[], idTipologiaPadre?: number){
    nodes.forEach( (e, index) => {
      const structure: Structure = e.data;
      if (index == 0){
        if (structure.idTipologia != idTipologiaPadre){
          this.rowGroupMetadata.push(structure.id);
        }
      }
      this.updateRowGroupMetaData(e.children ?? [], structure.idTipologia);
    })
  }


  private verifyIfSelectedDependencyWasDeleted(removedIds){
    this.store.dispatch(StructureActions.removeDependencyIfWasDeleted({removedIds: removedIds}));
  }

  getDependencies(){
    this.loading = true;
    this.structureService.getDependencies().subscribe({
      next: (e)=> {
        this.store.dispatch(StructureActions.setList({structures: e}));
        this.store.dispatch(StructureActions.setMustRecharge({mustRecharge: false}));
        this.loading = false;
      },
      error: (e)=>{
        this.loading = false;
      }
    })
  }

  openNew() {
    this.router.navigate(['action/dependency'], { relativeTo: this.route, skipLocationChange: true});
  }

  onGoToUpdate (id : any, isDependency:boolean, event: Event): void{
    event.preventDefault();
    event.stopPropagation();
    this.router.navigate([isDependency ? 'action/dependency' : 'action/no-dependency', this.cryptoService.encryptParam(id)], {relativeTo: this.route, skipLocationChange: true})
  }

  viewDependency(structure: Structure){
    if(!this.hasNoDependency(structure)){
      this.loadingDependency = true;
      this.structureService.getDependencyInformationById(structure.id).subscribe({
        next: (e) =>{
          this.store.dispatch(StructureActions.setDependency({structure: e, hasLoadedInformation: false}));
          this.loadingDependency = false;
        },
        error: (e)=>{
          this.loadingDependency = false;
        }
      })
    }else{
      this.store.dispatch(StructureActions.setDependency({structure: structure, hasLoadedInformation: true}));
    }
  }

  private hasNoDependency(structure: Structure){
    return structure.subEstructuras?.some(e => !Methods.parseStringToBoolean(e.tipologia.esDependencia));
  }

  onFilter(event: Event, isDependency: boolean) {
    if(isDependency){
      this.treeTableDependency.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }else{
      this.treeTableOfStructuresNoDependency.filterGlobal((event.target as HTMLInputElement).value, 'contains');
      if(!this.filteredValuesSubscription){
        this.filteredValuesSubscription = this.treeTableOfStructuresNoDependency.onFilter.asObservable().subscribe( e => this.onGoToUpdateRowGroupMetaData(e.filteredValue))
      }
    }
  }

  desmarkAll(isDependency: boolean){
    if(isDependency){
      this.selectedNodesOfDependency = [];
    }else{
      this.selectedNodesOfStructuresNoDependency = [];
    }
  }

  goToAddSubstructure(structure: Structure){
    let childrenNoDependency = structure.subEstructuras?.filter( e => !Methods.parseStringToBoolean(e.tipologia.esDependencia));
    this.router.navigate(['action/no-dependency'], {
      relativeTo: this.route,
      skipLocationChange: true,
      queryParams: {
        idParent: this.cryptoService.encryptParam(structure.id),
        idTipology: this.cryptoService.encryptParam(structure.tipologia.idTipologiaSiguiente),
        defaultOrder: this.cryptoService.encryptParam(childrenNoDependency?.length ? (this.getLastOrder(childrenNoDependency) ?? childrenNoDependency.length) + 1 :  1)
      }});
  }

  private getLastOrder(structures: Structure[]): number{
    let lastOrder: number = 0;
    if (!structures?.length){
      return null;
    }
    for (let e of structures){
      if (lastOrder < e.orden){
        lastOrder = e.orden;
      }
    }
    return lastOrder == 0 ? null : lastOrder;
  }

  /**
   * NOTA: si el path de la accion es action/no-dependency, significa que va agregarse una subestructura de la siguiente tipología, por lo que
   * el id de la tipología para esa nueva subestructura debe ser del tipo de tipología siguiente que tiene el padre.
   */
  goToPage(event: any, structure: Structure){
    const path = event.item.data.path;
    const idStructure = event.item.id;
    let childrenNoDependency = structure.subEstructuras?.filter( e => !Methods.parseStringToBoolean(e.tipologia.esDependencia));
    this.router.navigate([path], {
      skipLocationChange: true,
      queryParams: {
        idStructure: this.cryptoService.encryptParam(idStructure),
        idParent: this.cryptoService.encryptParam(structure.id),
        idActivity: this.cryptoService.encryptParam(structure.actividad?.id),
        idTipology: this.cryptoService.encryptParam(path == 'configurations/structures/action/no-dependency' ? structure.tipologia.idTipologiaSiguiente : structure.idTipologia),
        defaultOrder: this.cryptoService.encryptParam(childrenNoDependency?.length ? (this.getLastOrder(childrenNoDependency) ?? childrenNoDependency.length) + 1 :  1)
      }});
  }

  deleteSelectedStructures(nodes: any, isDependency: boolean) {
    let structureIds = (nodes as TreeNode[]).map(e => e.data.id);
    this.confirmationDialogService.showDeleteConfirmationDialog(
      () => {
        this.structureService.deleteSelectedStrustures(structureIds)
        .subscribe({
          next: (e) => {
           this.store.dispatch(StructureActions.removeItemsFromList({structureIds: structureIds}));
           this.verifyIfSelectedDependencyWasDeleted(structureIds);
           this.desmarkAll(isDependency);
          }
        });
      }
    )
  }

  onDeleteStructure(event: any): void {
    let id = parseInt(event.item.id);
    let isDependency = Methods.parseStringToBoolean(event.item.data.tipologia.esDependencia);
    event.originalEvent.preventDefault();
    event.originalEvent.stopPropagation();
    this.confirmationDialogService.showDeleteConfirmationDialog(
      () => {
        this.structureService.deleteStructure(id)
        .subscribe({
          next: () => {
            this.store.dispatch(StructureActions.removeFromList({id: id}));
            this.verifyIfSelectedDependencyWasDeleted([id]);
            this.desmarkAll(isDependency);
          },
        });
      }
    )
  }

  hasDetailToShow(structure : Structure){
    if (structure.actividad){
      return true;
    }
    return false;
  }

  onNodeExpand(event) {
    this.store.dispatch(StructureActions.addToExpandedNodes({id: event.node.data.id}));
  }

  onNodeCollapse(event) {
    this.store.dispatch(StructureActions.removeFromExpandedNodes({id: event.node.data.id}));
  }

  download(data: any, idStructure?: number) {
    const updateMenuItem = (menuItem: MenuItem, icon: string, disabled: boolean, label?: string) => {
        if (menuItem) {
            menuItem.icon = icon;
            menuItem.disabled = disabled;
            menuItem.label = label;
        }
    };
    const menuItem = !idStructure ? this.menuItemsOfDownload.find(e => e.automationId === data.item.automationId) : null;
    const initialIcon = menuItem?.icon;
    const initialState = menuItem?.disabled;
    const initialLabel = menuItem?.label;

    let automationId = data.item.automationId;

    updateMenuItem(menuItem, "pi pi-spin pi-spinner", true);
    const structureIds = idStructure
        ? [idStructure]
        : (this.selectedNodesOfDependency as TreeNode[])?.map(e => e.data.id) || [];
    this.structureService.downloadReport(automationId, structureIds).pipe(
      finalize(()=>{
        updateMenuItem(menuItem, initialIcon, initialState, initialLabel);
      })
    ).subscribe({
      next: (res) => {
        this.reportUploaded(menuItem, automationId, res);
      }
    });
  }

  changeOrder(event: Event){
    this.store.dispatch(StructureActions.setOrderIsAscending({orderIsAscending: !this.orderIsAscending}));
    this.store.dispatch(StructureActions.order());
  }

  reportUploaded(menuItem: MenuItem, automationId: string, downloadProgress: number) {
    let format = automationId === 'excel' ? Methods.capitalizeFirstLetter(automationId) : automationId.toUpperCase();
    menuItem.label = `
      <span>Reporte de tiempos en ${format}</span>
      <progress id="progressBar-${automationId}" max="100" style="width: 100%"></progress>
    `;
    if (downloadProgress > 0) {
      let element = document.getElementById(`progressBar-${automationId}`) as HTMLProgressElement;
      element.value = downloadProgress;
    }
    this.cdr.detectChanges();
  }

  reportFlat(data: any, idStructure?: number){
    const updateMenuItem = (menuItem: MenuItem, icon: string, disabled: boolean, label?: string) => {
      if (menuItem) {
        menuItem.icon = icon;
        menuItem.disabled = disabled;
        menuItem.label = label;
      }
    };
    const menuItem = !idStructure ? this.menuItemsOfDownload.find(e => e.automationId === data.item.automationId) : null;
    const initialIcon = menuItem?.icon;
    const initialState = menuItem?.disabled;
    const initialLabel = menuItem?.label;

    let automationId = data.item.automationId;

    updateMenuItem(menuItem, "pi pi-spin pi-spinner", true);
    const structureIds = idStructure
      ? [idStructure]
      : (this.selectedNodesOfDependency as TreeNode[])?.map(e => e.data.id) || [];
    this.structureService.downloadReportFlat(automationId, structureIds).pipe(
      finalize(()=>{
        updateMenuItem(menuItem, initialIcon, initialState, initialLabel);
      })
    ).subscribe({
      next: (res) => {
        this.reportUploaded(menuItem, automationId, res);
      }
    });
  }

}
