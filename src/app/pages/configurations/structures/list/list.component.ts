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
import { StructureService } from 'src/app/services/structure.service';
import { TreeTable } from 'primeng/treetable';

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

  structures$: Observable<Structure[]>;
  structure$: Observable<Structure>;
  dependency$: Observable<Structure>;
  dependencies$: Observable<TreeNode[]>;
  noDependencies$: Observable<TreeNode[]>;

  selectedNodesOfDependency: TreeNode | TreeNode[] | null;
  selectedNodesOfStructuresNoDependency: TreeNode | TreeNode[] | null;

  filteredValuesSubscription: Subscription;
  noDependenciesSubscription: Subscription;

  loading: boolean = false;
  rowGroupMetadata: number[] = [];

  constructor(
    private store: Store<AppState>,
    private confirmationDialogService: ConfirmationDialogService,
    private structureService: StructureService,
    private router: Router,
    private route: ActivatedRoute,
  ){}

  ngOnInit(): void {
    this.structures$ = this.store.select(state => state.structure.items);
    this.structure$ = this.store.select(state => state.structure.item);
    this.dependency$ = this.store.select(state => state.structure.dependency);
    this.dependencies$ = this.structures$.pipe(map(e => e?.map ( obj => this.transformToTreeNodeToDependency(obj))));
    this.noDependencies$ = this.dependency$.pipe(map(e => e.subEstructuras?.map( obj => this.transformToTreeNodeToNoDependency(obj)).filter(o => o)));
    this.noDependenciesSubscription = this.noDependencies$.subscribe( e=> {this.onGoToUpdateRowGroupMetaData(e)})
    this.getStructures();
  }

  ngOnDestroy(): void {
    this.filteredValuesSubscription?.unsubscribe();
    this.noDependenciesSubscription?.unsubscribe();
  }

  get totalSelected(): number{
    return this.treeTableDependency?.selection?.length;
  }

  get totalSelectedStructuresNoDependency(): number{
    return this.treeTableOfStructuresNoDependency?.selection?.length;
  }

  private transformToTreeNodeToDependency(structure: Structure): TreeNode{
    return structure.tipologia.esDependencia ? {
      data: {...structure, menuItems: this.getMenuItemsOfStructure(structure)}, 
      children: structure.subEstructuras?.map( e => this.transformToTreeNodeToDependency(e)).filter( e => e)
    } : null;
  }

  private transformToTreeNodeToNoDependency(structure: Structure): TreeNode{
    return !structure.tipologia.esDependencia ? {
      data: {...structure, menuItems: this.getMenuItemsOfStructure(structure)}, 
      children: structure.subEstructuras?.map( e => this.transformToTreeNodeToNoDependency(e)).filter( e => e)
    } : null;
  }

  private getMenuItemsOfStructure(structure: Structure): MenuItem []{
    let extraMenuItemsOfDependency = [];
    let extraMenuItemOfSubstructure = [];

    if (structure.tipologia.esDependencia){
      extraMenuItemsOfDependency.push({label: 'Ver', icon: `pi pi-eye`, data:structure, command: (e) => this.viewDependency(e.item.data)})
      extraMenuItemsOfDependency.push({label: 'Nueva subdependencia', icon: `pi pi-plus`, data:structure, command: (e) => this.goToAddSubdependency(e.item.data)})
    }

    if(structure.tipologia?.tipologiaSiguiente){
      extraMenuItemOfSubstructure.push({label: `Agregar ${structure.tipologia.tipologiaSiguiente.nombre ?? 'subestructura'}`, icon: 'pi pi-sitemap', command: (e) => {this.goToAddSubstructure(e.item.data)}})
    }

    return [
      ...structure.tipologia.acciones.map(obj => ({label: obj.nombre, icon: `pi ${obj.claseIcono}`, command: (e) => {}})),
      ...extraMenuItemsOfDependency,
      ...extraMenuItemOfSubstructure,
      {label: 'Editar', icon: 'pi pi-pencil', command: (e) => this.onGoToUpdate(e.item.id, e.originalEvent)},
      {label: 'Eliminar', icon: 'pi pi-trash', data:structure, command: (e) => this.onDeleteStructure(e)},
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
      this.loading = false;
    })
  }

  openNew() {
    this.router.navigate(['create'], { relativeTo: this.route, skipLocationChange: true });
  }

  onGoToUpdate (id : any, event: Event): void{
    event.preventDefault();
    event.stopPropagation(); 
    this.router.navigate(['/configurations/structures', id])
  }

  viewDependency(structure: Structure){
    this.store.dispatch(StructureActions.setDependency({structure: structure}));
  }

  viewStructureDetails(structure: Structure){
    this.store.dispatch(StructureActions.setStructure({structure: structure}));
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
    console.log(isDependency)
    if(isDependency){
      this.selectedNodesOfDependency = [];
    }else{
      this.selectedNodesOfStructuresNoDependency = [];
    }
  }

  goToAddSubdependency(structure: Structure){
    this.router.navigate(['create'], { relativeTo: this.route, queryParams: {idPadre: structure.id, idTipologia:structure.tipologia.id}, skipLocationChange: true });
  }

  goToAddSubstructure(structure: Structure){
    this.router.navigate(['create'], { relativeTo: this.route, queryParams: {idPadre: structure.id, idTipologia: structure.tipologia.idTipologiaSiguiente}, skipLocationChange: true });
  }

  goToPage(path: string, structure: Structure){
    this.router.navigate([path], { relativeTo: this.route, queryParams: {id: structure.id}, skipLocationChange: true });
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
    let isDependency = event.item.data.tipologia.esDependencia;
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
}
