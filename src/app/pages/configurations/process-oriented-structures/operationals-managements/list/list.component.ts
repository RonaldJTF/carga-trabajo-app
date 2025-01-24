import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import * as OperationalManagementActions from "@store/operationalManagement.actions";
import * as StructureActions from "@store/structure.actions";
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { MESSAGE } from '@labels/labels';
import { OperationalManagement, Structure } from '@models';
import { Store } from '@ngrx/store';
import { AuthenticationService, BasicTablesService, ConfirmationDialogService, CryptojsService, OperationalManagementService, StatisticsService, StructureService } from '@services';
import { IMAGE_SIZE, Methods } from '@utils';
import { MenuItem, MessageService, TreeNode } from 'primeng/api';
import { TreeTable } from 'primeng/treetable';
import { finalize, map, Observable, Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducers';
import { OverlayPanel } from 'primeng/overlaypanel';

class StructureNode{
  id: number;
  subEstructuras: StructureNode[];
}
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent {
  IMAGE_SIZE = IMAGE_SIZE;
  MESSAGE = MESSAGE;
    
  @ViewChild('treeTableOperationalManagement') treeTableOperationalManagement: TreeTable;
  @ViewChild('treeTableStructure') treeTableStructure: TreeTable;
  @ViewChild('structuresOverlayPanel') structuresOverlayPanel: OverlayPanel;
    
  isAdmin: boolean;
  isOperator: boolean;
  isSuperAdmin: boolean;
  
  operationalsManagements$: Observable<TreeNode[]>;
  selectedNodesOfOperationalManagement: TreeNode | TreeNode[] | null;
  operationalManagementToMigrateStructures: OperationalManagement;

  structuresSubscription: Subscription;
  structureTree: TreeNode[];
  structures: Structure[];
  selectedStructures: StructureNode[] = [];
  selectedStructuresMap: any = {};

  expandedNodesSubscription: Subscription;
  mustRechargeSubscription: Subscription;
  orderIsAscendingSubscription: Subscription;
  operationalsManagementsSubscription: Subscription;
  expandedStructureNodesSubscription: Subscription;
  orderOfTypologiesSubscription: Subscription;

  orderOfTypologies: any;

  loading: boolean = false;
  loadingOperationalManagement: boolean = false;
  loadingDependencies: boolean = false;
  loadingStructureById: any = {};
  isMigrating: boolean = false;

  structureRowGroupMetadata: number[] = [];
  rowGroupMetadata: number[] = [];
  numberOfElementsByOperationalManagement: any = {};

  operationalManagementMenuItems: MenuItem[] = [];
  expandedNodes: number[];
  expandedStructureNodes: number[];
  orderIsAscending: boolean;

  menuBarItems: MenuItem[] = [];

  menuItemsOfDownload: MenuItem[] = [
    {label: 'Reporte de tiempos en Excel', escape: false, icon: 'pi pi-file-excel', automationId:"excel", command: (e) => { this.download(e) }},
  ];
  
  constructor(
    private store: Store<AppState>,
    private operationalManagementService: OperationalManagementService,
    private structureService: StructureService,
    private basicTablesService: BasicTablesService,
    private confirmationDialogService: ConfirmationDialogService,
    private statisticsService: StatisticsService,
    private authService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
    private cryptoService: CryptojsService,
    private cdr: ChangeDetectorRef,
    private messageService: MessageService,
    private sanitizer: DomSanitizer,
  ){}

  ngOnInit(): void {
    const {isAdministrator, isOperator, isSuperAdministrator} = this.authService.roles();
    this.isAdmin = isAdministrator;
    this.isOperator = isOperator;
    this.isSuperAdmin = isSuperAdministrator;

    this.operationalsManagements$ =  this.store.select(state => state.operationalManagement.items).pipe(
      map(e => e?.map ( obj => this.transformToTreeNode(obj)))
    );

    this.orderOfTypologiesSubscription =  this.store.select(state => state.operationalManagement.orderOfTypologies).subscribe( e => this.orderOfTypologies = e);
    this.structuresSubscription = this.store.select(state => state.structure.items)
      .subscribe(e => {
        this.structures = e;
        this.structureTree = e?.map( obj => this.transformStructureToTreeNode(obj));
        this.onGoToUpdateStructureRowGroupMetaData(this.structureTree);
    });
    this.expandedStructureNodesSubscription = this.store.select(state => state.structure.expandedNodes).subscribe(e => this.expandedStructureNodes = e);

    this.operationalsManagementsSubscription = this.operationalsManagements$.subscribe(e => {
      this.onGoToUpdateRowGroupMetaData(e);
      this.numberOfElementsByOperationalManagement[''] = e?.length;
      this.getNumberOfElementsByOperationalManagement(e);
    });
    this.orderIsAscendingSubscription = this.store.select(state => state.operationalManagement.orderIsAscending).subscribe(e => this.orderIsAscending = e);
    this.mustRechargeSubscription = this.store.select(state => state.operationalManagement.mustRecharge).subscribe(e => {
      if (e){this.getOperationalsManagements()}
    });
    this.expandedNodesSubscription = this.store.select(state => state.operationalManagement.expandedNodes).subscribe(e => this.expandedNodes = e);

    this.menuBarItems = [];
  }

  ngOnDestroy(): void {
    this.mustRechargeSubscription?.unsubscribe();
    this.expandedNodesSubscription?.unsubscribe();
    this.orderIsAscendingSubscription?.unsubscribe();
    this.operationalsManagementsSubscription?.unsubscribe();
    this.structuresSubscription?.unsubscribe();
    this.expandedStructureNodesSubscription?.unsubscribe();
    this.orderOfTypologiesSubscription?.unsubscribe();
  }

  get totalSelected(): number{
    return this.treeTableOperationalManagement?.selection?.length;
  }

  getOperationalsManagements(){
    this.loading = true;
    this.operationalManagementService.getOperationalsManagements().subscribe({
      next: (e)=> {
        this.store.dispatch(OperationalManagementActions.setList({operationalsManagements: e}));
        this.store.dispatch(OperationalManagementActions.setMustRecharge({mustRecharge: false}));
        this.loading = false;
      },
      error: (e)=>{
        this.loading = false;
      }
    })
  }

  getDependencies(){
    this.loadingDependencies = true;
    this.structureService.getDependencies().subscribe({
      next: (e)=> {
        this.store.dispatch(StructureActions.setList({structures: e}));
        this.store.dispatch(StructureActions.setMustRecharge({mustRecharge: false}));
        this.loadingDependencies = false;
      },
      error: (e)=>{
        this.loadingDependencies = false;
      }
    })
  }

  getOrderOfTypologies(){
    this.basicTablesService.getOrderOfTypologies().subscribe({
      next: (e)=> {
        this.store.dispatch(OperationalManagementActions.setOrderOfTypologies({orderOfTypologies: e}));
      },
      error: (e)=>{}
    })
  }
  
  private getNumberOfElementsByOperationalManagement(nodes: TreeNode[]){
    nodes?.forEach( e=> {
      this.numberOfElementsByOperationalManagement[e.data.id] = e.children?.length;
      this.getNumberOfElementsByOperationalManagement(e.children)
    })
  }

  private onGoToUpdateRowGroupMetaData(nodes: TreeNode[]){
    this.rowGroupMetadata = [];
    this.updateRowGroupMetaData(nodes ?? []);
  }

  private updateRowGroupMetaData(nodes: TreeNode[], idTipologiaPadre?: number){
    nodes.forEach( (e, index) => {
      const operationalManagement: OperationalManagement = e.data;
      if (index == 0){
        if (operationalManagement.idTipologia != idTipologiaPadre){
          this.rowGroupMetadata.push(operationalManagement.id);
        }
      }
      this.updateRowGroupMetaData(e.children ?? [], operationalManagement.idTipologia);
    })
  }

  private onGoToUpdateStructureRowGroupMetaData(nodes: TreeNode[]){
    this.structureRowGroupMetadata = [];
    this.updateStructureRowGroupMetaData(nodes ?? []);
  }

  private updateStructureRowGroupMetaData(nodes: TreeNode[], idTipologiaPadre?: number){
    nodes.forEach( (e, index) => {
      const structure: Structure = e.data;
      if (index == 0){
        if (structure.idTipologia != idTipologiaPadre){
          this.structureRowGroupMetadata.push(structure.id);
        }
      }
      this.updateStructureRowGroupMetaData(e.children ?? [], structure.idTipologia);
    })
  }

  private transformToTreeNode(operationalManagement: OperationalManagement): TreeNode | null {
    return (this.selectedNodesOfOperationalManagement as TreeNode[])?.find(e => e.data.id == operationalManagement.id) ?? {
      data: {...operationalManagement, menuItems: this.getMenuItemsOfOperationalManagement(operationalManagement)},
      children: operationalManagement.subGestionesOperativas?.map(e => this.transformToTreeNode(e)).filter(e => e),
      expanded: this.expandedNodes?.includes(operationalManagement.id),
    };
  }

  private transformStructureToTreeNode(structure: Structure): TreeNode | null {
    return {
      data: {...structure},
      children: structure.subEstructuras?.map(e => this.transformStructureToTreeNode(e)).filter(e => e),
      expanded: this.expandedStructureNodes?.includes(structure.id),
    };
  }

  private getMenuItemsOfOperationalManagement(operationalManagement: OperationalManagement): MenuItem []{
    if(!operationalManagement){
      return [];
    }
    let generalMenuItem = [];
    generalMenuItem.push(
      {label: 'Migrar', icon: 'pi pi-window-minimize', visible: this.isAdmin, command: (e) => this.viewStructuresToMigrate(e.item['value'], e.originalEvent)},
      {label: 'Editar', icon: 'pi pi-pencil', visible: this.isAdmin, command: (e) => this.onGoToUpdate(e.item.id)},
      {label: 'Eliminar', icon: 'pi pi-trash', visible: this.isAdmin, data:operationalManagement, command: (e) => this.onDeleteStructure(e)},
    );

    return [
      ...generalMenuItem
    ]
  }

  deleteSelectedOperationalManagement() {
    let operationalsManagementsIds = (this.selectedNodesOfOperationalManagement as TreeNode[]).map(e => e.data.id);
    this.confirmationDialogService.showDeleteConfirmationDialog(
      () => {
        this.operationalManagementService.deleteSelectedOperationalsManagements(operationalsManagementsIds)
        .subscribe({
          next: (e) => {
            this.store.dispatch(OperationalManagementActions.removeItemsFromList({operationalsManagementsIds: operationalsManagementsIds}));
            this.desmarkAll();
          }
        });
      }
    )
  }

  onDeleteStructure(event: any): void {
    let id = parseInt(event.item.id);
    event.originalEvent.preventDefault();
    event.originalEvent.stopPropagation();
    this.confirmationDialogService.showDeleteConfirmationDialog(
      () => {
        this.operationalManagementService.deleteOperationalManagement(id)
        .subscribe({
          next: () => {
            this.store.dispatch(OperationalManagementActions.removeFromList({id: id}));
            this.desmarkAll();
          },
        });
      }
    )
  }

  openNew() {
    this.router.navigate(['create'], { relativeTo: this.route, skipLocationChange: true});
  }

  onGoToUpdate (id : any): void{
    this.router.navigate([this.cryptoService.encryptParam(id)], {relativeTo: this.route, skipLocationChange: true})
  }

  hasDetailToShow(operationalManagement : OperationalManagement){
    if (operationalManagement.actividad){
      return true;
    }
    return false;
  }
  
  onNodeExpand(event) {
    this.store.dispatch(OperationalManagementActions.addToExpandedNodes({id: event.node.data.id}));
  }

  onNodeCollapse(event) {
    this.store.dispatch(OperationalManagementActions.removeFromExpandedNodes({id: event.node.data.id}));
  }

  onStructureNodeExpand(event) {
    this.store.dispatch(StructureActions.addToExpandedNodes({id: event.node.data.id}));
  }

  onStructureNodeCollapse(event) {
    this.store.dispatch(StructureActions.removeFromExpandedNodes({id: event.node.data.id}));
  }

  changeOrder(event: Event){
    this.store.dispatch(OperationalManagementActions.setOrderIsAscending({orderIsAscending: !this.orderIsAscending}));
    this.store.dispatch(OperationalManagementActions.order());
  }

  onFilter(event: Event) {
    this.treeTableOperationalManagement.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  onFilterStructure(event: Event) {
    this.treeTableStructure.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
  
  desmarkAll(){
    this.selectedNodesOfOperationalManagement = [];
  }

  download(data: any, idOperationalManagement?: number) {
    const updateMenuItem = (menuItem: MenuItem, icon: string, disabled: boolean, label?: string) => {
      if (menuItem) {
        menuItem.label = label;
        menuItem.icon = icon;
        menuItem.disabled = disabled;
        menuItem.label = label;
      }
    };

    const automationId = data.item.automationId;
    const menuItem = !idOperationalManagement
                      ? this.menuItemsOfDownload.find(e => e.automationId === automationId)
                      : null;
    const initialIcon = menuItem?.icon;
    const initialState = menuItem?.disabled;
    const initialLabel = menuItem?.label;

    updateMenuItem(menuItem, "pi pi-spin pi-spinner", true);
    const operationalManagementIds = idOperationalManagement ? [idOperationalManagement] : (this.selectedNodesOfOperationalManagement as TreeNode[])?.map(e => e.data.id) || [];
    /*this.operationalManagementService.downloadReport(automationId, operationalManagementIds).pipe(
      finalize(() => {
        updateMenuItem(menuItem, initialIcon, initialState, initialLabel);
      })
    ).subscribe({
      next: (res) => {
        this.reportUploaded(menuItem, initialLabel, automationId, res);
      }
    });*/
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

  viewStructuresToMigrate(operationalManagement: OperationalManagement, event: Event) {
    this.selectedStructures = [];
    this.selectedStructuresMap = {};
    this.markStructures(this.structureTree);
    this.operationalManagementToMigrateStructures = operationalManagement;
    if(!this.structures?.length) this.getDependencies();
    if(!this.orderOfTypologies?.length) this.getOrderOfTypologies();
    this.structuresOverlayPanel.toggle(event);
  }

  viewDependency(structure: Structure){
    if(!this.hasNoDependency(structure) && Methods.parseStringToBoolean(structure.tipologia.esDependencia)){
      this.loadingStructureById[structure.id] = true;
      this.structureService.getDependencyInformationById(structure.id).subscribe({
        next: (e) =>{
          this.store.dispatch(StructureActions.setDependency({structure: e, hasLoadedInformation: false}));
          this.loadingStructureById[structure.id] = false;
          this.markStructures(this.structureTree);
        },
        error: (e)=>{
          this.loadingStructureById[structure.id] = false;
        }
      })
    }
  }

  private hasNoDependency(structure: Structure){
    return structure.subEstructuras?.some(e => !Methods.parseStringToBoolean(e.tipologia.esDependencia));
  }

  parseToBoolean(str: string){
    return Methods.parseStringToBoolean(str);
  }

  migrateStructures(){
    this.isMigrating = true;
    this.operationalManagementService.migrateStructures(this.operationalManagementToMigrateStructures.id, this.selectedStructures).subscribe({
      next: (e) => {
        this.store.dispatch(OperationalManagementActions.setMigratedOperationalsManagements({operationalsManagements: e}));
        this.structuresOverlayPanel.hide();
        this.isMigrating = false;
      },
      error: (error) => {
        this.isMigrating = false;
      },
    });
  }

  onChangeSelectedStructure(structure: Structure, event: any) {
    if (event.checked) {
      const parentNode: StructureNode = this.findStructureNode(structure.idPadre, this.selectedStructures);
      if (parentNode) {
        parentNode.subEstructuras.push(this.buildStructureNode(structure));
      } else {
        const newNode: StructureNode = this.buildStructureNode(structure);
        this.selectedStructures = this.selectedStructures.filter(existingNode =>
          !this.findStructureNode(existingNode.id, newNode.subEstructuras)
        );
        this.selectedStructures.push(newNode);
      }
    }else {
      this.selectedStructures = this.removeStructureNode(structure.id, this.selectedStructures);
    }
    this.updateSelectedStructuresMap();
  }
  
  private updateSelectedStructuresMap() {
    this.selectedStructuresMap = {};
    this.plainSelectedStructures(this.selectedStructures, this.selectedStructuresMap);
    this.markStructures(this.structureTree);
  }

  private plainSelectedStructures(nodes: StructureNode[], map: any){
    if (!nodes) return;
    for (let node of nodes){
      map[node.id] = node.subEstructuras;
      this.plainSelectedStructures(node.subEstructuras, map);
    }
  }

  private markStructures(nodes: TreeNode[]){
    if (!nodes) return;
    for (let node of nodes){
      node.data.selected = node.data.id in this.selectedStructuresMap;
      this.markStructures(node.children);
    }
  }

  private removeStructureNode(id: number, nodes: StructureNode[]){
    if (!nodes) return null;
    const filteredNodes = nodes.filter(e => e.id != id);
    for (let node of filteredNodes) {
      node.subEstructuras = this.removeStructureNode(id, node.subEstructuras);
    }
    return filteredNodes;
  }

  private buildStructureNode(structure: Structure): StructureNode{
    if(!structure) return null;
    return{
      id: structure.id,
      subEstructuras: structure.subEstructuras?.map(e => this.buildStructureNode(e))
    }
  }

  private findStructureNode(id: number, nodes: StructureNode[]){
    if(!nodes) return null;
    for (let node of nodes){
      if (node.id == id){
        return node;
      }
      const temp = this.findStructureNode(id, node.subEstructuras);
      if (temp) return temp; 
    }
  }
}
