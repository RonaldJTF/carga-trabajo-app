import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as StructureActions from "./../../../../store/structure.actions";
import { map, Observable, Subscription } from 'rxjs';
import { Structure } from 'src/app/models/structure';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducers';
import { IMAGE_SIZE } from 'src/app/utils/constants';
import { MESSAGE } from 'src/labels/labels';
import { MenuItem, TreeNode } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationDialogService } from 'src/app/services/confirmation-dialog.service';
import { TreeTable } from 'primeng/treetable';
import { Methods } from 'src/app/utils/methods';
import { AuthenticationService } from 'src/app/services/auth.service';
import { StructureService } from 'src/app/services/structure.service';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy{
  IMAGE_SIZE = IMAGE_SIZE;
  MESSAGE = MESSAGE;

  @ViewChild('treeTableDependency') treeTableDependency: TreeTable;
  @ViewChild('treeTableOfStructuresNoDependency') treeTableOfStructuresNoDependency: TreeTable;

  isAdmin: boolean;
  isOperator: boolean;

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

  loading: boolean = false;
  rowGroupMetadata: number[] = [];
  numberOfElementsByStructure: any = {};

  dependencyMenuItems: MenuItem[] = [];
  expandedNodes: number[];

  menuItemsOfDownload: MenuItem[] = [
    {label: 'PDF', icon: 'pi pi-file-pdf', id:"pdf", command: (e) => { this.download(e) }},
    {label: 'Excel', icon: 'pi pi-file-excel', id:"excel", command: (e) => { this.download(e) }},
  ]

  constructor(
    private store: Store<AppState>,
    private confirmationDialogService: ConfirmationDialogService,
    private structureService: StructureService,
    private authService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute
  ){}

  ngOnInit(): void {
    this.isAdmin = this.authService.roleIsAdministrator();
    this.isOperator = this.authService.roleIsOperator();
    this.structures$ = this.store.select(state => state.structure.items);
    this.dependency$ = this.store.select(state => state.structure.dependency);
    this.dependencies$ = this.structures$.pipe(map(e => e?.map ( obj => this.transformToTreeNode(obj, true))));
    this.noDependencies$ = this.dependency$.pipe(map(e => e?.subEstructuras?.map( obj => this.transformToTreeNode(obj, false)).filter(o => o)));
    this.noDependenciesSubscription = this.noDependencies$.subscribe( e=> {
      if(e?.length){this.numberOfElementsByStructure[e[0].data.idPadre] = e.length;}
      this.onGoToUpdateRowGroupMetaData(e);
      this.getNumberOfElementsByStructure(e);
    });
    this.mustRechargeSubscription = this.store.select(state => state.structure.mustRecharge).subscribe(e => {
      if (e){this.getStructures()}
    });
    this.dependencySubscription = this.store.select(state => state.structure.dependency).subscribe( e => this.dependencyMenuItems = this.getMenuItemsOfStructure(e));
    this.expandedNodesSubscription = this.store.select(state => state.structure.expandedNodes).subscribe(e => this.expandedNodes = e);
  }

  ngOnDestroy(): void {
    this.filteredValuesSubscription?.unsubscribe();
    this.noDependenciesSubscription?.unsubscribe();
    this.mustRechargeSubscription?.unsubscribe();
    this.dependencySubscription?.unsubscribe();
    this.expandedNodesSubscription?.unsubscribe();
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
      return {
        data: { ...structure, menuItems: this.getMenuItemsOfStructure(structure) },
        children: structure.subEstructuras?.map(e => this.transformToTreeNode(e, isDependency)).filter(e => e),
        expanded: this.expandedNodes?.includes(structure.id)
      };
    }
    return null;
  }

  private getMenuItemsOfStructure(structure: Structure): MenuItem []{
    let extraMenuItemsOfDependency = [];
    let extraMenuItemOfSubstructure = [];
    let extraMenuItemOfActions = [];
    let generalMenuItem = []

    if (this.isAdmin){
      extraMenuItemOfActions = structure?.tipologia?.acciones?.map(obj => ({label: obj.nombre, icon: `pi ${obj.claseIcono}`, data:obj, command: (e) => {this.goToPage(e, structure)}})) ?? [];

      generalMenuItem.push({label: 'Editar', icon: 'pi pi-pencil', command: (e) => this.onGoToUpdate(e.item.id, e.originalEvent)})
      generalMenuItem.push({label: 'Eliminar', icon: 'pi pi-trash', data:structure, command: (e) => this.onDeleteStructure(e)})

      if (Methods.parseStringToBoolean(structure?.tipologia?.esDependencia)){
        extraMenuItemsOfDependency.push({label: 'Ver', icon: `pi pi-eye`, data:structure, command: (e) => this.viewDependency(e.item.data)})
        extraMenuItemsOfDependency.push({label: 'Descargar', icon: 'pi pi-cloud-download', items: [
          {label: 'PDF', icon: 'pi pi-file-pdf', id:"pdf", command: (e) => { this.download(e, structure.id) }},
          {label: 'Excel', icon: 'pi pi-file-excel', id:"excel", command: (e) => { this.download(e, structure.id) }},
        ]})
        extraMenuItemsOfDependency.push({label: 'Nueva sub' + structure.tipologia.nombre.toLowerCase(), icon: `pi pi-plus`, data:structure, command: (e) => this.goToAddSubdependency(e.item.data)})
      }

      if(structure?.tipologia?.tipologiaSiguiente){
        extraMenuItemOfSubstructure.push({label: `Agregar ${structure.tipologia.tipologiaSiguiente.nombre.toLowerCase()}`, icon: 'pi pi-sitemap', data:structure, command: (e) => {this.goToAddSubstructure(e.item.data)}})
      }
    }else if(this.isOperator){
      if (Methods.parseStringToBoolean(structure?.tipologia?.esDependencia)){
        extraMenuItemsOfDependency.push({label: 'Ver', icon: `pi pi-eye`, data:structure, command: (e) => this.viewDependency(e.item.data)})
        extraMenuItemsOfDependency.push({label: 'Descargar', icon: 'pi pi-cloud-download',  items: [
          {label: 'PDF', icon: 'pi pi-file-pdf', id:"pdf", command: (e) => { this.download(e, structure.id) }},
          {label: 'Excel', icon: 'pi pi-file-excel', id:"excel", command: (e) => { this.download(e, structure.id) }},
        ]})
      }
    }

    return [
      ...extraMenuItemOfActions,
      ...extraMenuItemsOfDependency,
      ...extraMenuItemOfSubstructure,
      ...generalMenuItem
    ]
  }

  private onGoToUpdateRowGroupMetaData(nodes: TreeNode[]){
    this.rowGroupMetadata = [];
    this.updateRowGroupMetaData(nodes ?? []);
  }

  private updateRowGroupMetaData(nodes: TreeNode[]){
    nodes.forEach( (e, index) => {
      if (index == 0){
        this.rowGroupMetadata.push(e.data.id);
      }
      this.updateRowGroupMetaData(e.children ?? []);
    })
  }

  private verifyIfSelectedDependencyWasDeleted(removedIds){
    this.store.dispatch(StructureActions.removeDependencyIfWasDeleted({removedIds: removedIds}));
  }

  getStructures(){
    this.loading = true;
    this.structureService.getStructures().subscribe( e => {
      this.store.dispatch(StructureActions.setList({structures: e}));
      this.store.dispatch(StructureActions.setMustRecharge({mustRecharge: false}));
      this.loading = false;
    })
  }

  openNew() {
    this.router.navigate(['create'], { relativeTo: this.route, skipLocationChange: true});
  }

  onGoToUpdate (id : any, event: Event): void{
    event.preventDefault();
    event.stopPropagation();
    this.router.navigate(['/configurations/structures', id], {skipLocationChange: true})
  }

  viewDependency(structure: Structure){
    this.store.dispatch(StructureActions.setDependency({structure: structure}));
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

  goToAddSubdependency(structure: Structure){
    this.router.navigate(['create'], { relativeTo: this.route, skipLocationChange: true, queryParams: {idParent: structure.id, idTipology:structure.tipologia.id}});
  }

  goToAddSubstructure(structure: Structure){
    this.router.navigate(['create'], { relativeTo: this.route, skipLocationChange: true, queryParams: {idParent: structure.id, idTipology: structure.tipologia.idTipologiaSiguiente}});
  }

  goToPage(event: any, structure: Structure){
    const path = event.item.data.path;
    const idStructure = event.item.id;
    this.router.navigate([path], { relativeTo: this.route, skipLocationChange: true, queryParams: {idStructure: idStructure, idActivity: structure?.actividad?.id} });
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

  download(data: any, idStructure?: number){
    const menuItem: MenuItem = this.menuItemsOfDownload.find(e => e.id === data.item.id);
    const initialIcon = menuItem.icon;
    const initialState = menuItem.disabled;

    menuItem.icon = "pi pi-spin pi-spinner";
    menuItem.disabled = true;
    let structureIds = (this.selectedNodesOfDependency as TreeNode[])?.map(e => e.data.id);

    if (idStructure){
      if (structureIds == undefined){
        structureIds = [idStructure];
      }else{
        structureIds.push(idStructure)
      }
    }

    this.structureService.downloadReport(data.item.id, structureIds).subscribe({
      next: () => {
        menuItem.icon = initialIcon;
        menuItem.disabled = initialState;
      },
      error: ()=>{
        menuItem.icon = initialIcon;
        menuItem.disabled = initialState;
      }
    });
  }

}
