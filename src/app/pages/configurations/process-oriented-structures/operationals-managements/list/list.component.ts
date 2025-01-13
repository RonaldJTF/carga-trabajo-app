import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { MESSAGE } from '@labels/labels';
import { OperationalManagement } from '@models';
import { Store } from '@ngrx/store';
import { AuthenticationService, ConfirmationDialogService, CryptojsService, StatisticsService } from '@services';
import { IMAGE_SIZE } from '@utils';
import { MenuItem, MessageService, TreeNode } from 'primeng/api';
import { TreeTable } from 'primeng/treetable';
import { map, Observable, Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducers';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent {
  IMAGE_SIZE = IMAGE_SIZE;
  MESSAGE = MESSAGE;
    
  @ViewChild('treeTableOperationalManagement') treeTableOperationalManagement: TreeTable;
    
  isAdmin: boolean;
  isOperator: boolean;
  isSuperAdmin: boolean;
  
  operationalsManagements$: Observable<TreeNode[]>;
  selectedNodesOfOperationalManagement: TreeNode | TreeNode[] | null;

  expandedNodesSubscription: Subscription;
  mustRechargeSubscription: Subscription;
  orderIsAscendingSubscription: Subscription;

  loading: boolean = false;
  loadingOperationalManagement: boolean = false;

  operationalManagementMenuItems: MenuItem[] = [];
  expandedNodes: number[];
  orderIsAscending: boolean;
  
  constructor(
    private store: Store<AppState>,
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

    this.orderIsAscendingSubscription = this.store.select(state => state.operationalManagement.orderIsAscending).subscribe(e => this.orderIsAscending = e);
    this.mustRechargeSubscription = this.store.select(state => state.operationalManagement.mustRecharge).subscribe(e => {
      //f (e){this.getOperationalsManagements()}
    });
    this.expandedNodesSubscription = this.store.select(state => state.structure.expandedNodes).subscribe(e => this.expandedNodes = e);

    /*this.menuBarItems = [
      {label: 'Reportes', icon: 'pi pi-fw pi-file', items: this.menuItemsOfDownload},
      {label: 'Más', icon: 'pi pi-cog',
        items: [
          {label: 'Asignación de cargos', icon: 'pi pi-users', command: (e)=> this.onGoToManagementAppointments()}
        ]
      }
    ];*/
  }

  ngOnDestroy(): void {
    this.mustRechargeSubscription?.unsubscribe();
    this.expandedNodesSubscription?.unsubscribe();
    this.orderIsAscendingSubscription?.unsubscribe();
  }

  get totalSelected(): number{
    return this.treeTableOperationalManagement?.selection?.length;
  }

  
  openNew() {
    this.router.navigate(['create'], { relativeTo: this.route, skipLocationChange: false});
  }

  onNodeExpand(event) {
    //this.store.dispatch(StructureActions.addToExpandedNodes({id: event.node.data.id}));
  }

  onNodeCollapse(event) {
    //this.store.dispatch(StructureActions.removeFromExpandedNodes({id: event.node.data.id}));
  }

  private transformToTreeNode(operationalManagement: OperationalManagement): TreeNode | null {
    return (this.selectedNodesOfOperationalManagement as TreeNode[])?.find(e => e.data.id == operationalManagement.id) ?? {
      data: {...operationalManagement, menuItems: this.getMenuItemsOfOperationalManagement(operationalManagement)},
      children: operationalManagement.subGestionesOperativas?.map(e => this.transformToTreeNode(e)).filter(e => e),
      expanded: this.expandedNodes?.includes(operationalManagement.id),
    };
  }

  private getMenuItemsOfOperationalManagement(operationalManagement: OperationalManagement): MenuItem []{
    if(!operationalManagement){
      return [];
    }
    let generalMenuItem = [];
    generalMenuItem.push(
      //{label: 'Editar', icon: 'pi pi-pencil', visible: this.isAdmin, command: (e) => this.onGoToUpdate(e.item.id, Methods.parseStringToBoolean(structure.tipologia?.esDependencia), e.originalEvent)},
      //{label: 'Eliminar', icon: 'pi pi-trash', visible: this.isAdmin, data:structure, command: (e) => this.onDeleteStructure(e)},
    );

    return [
      ...generalMenuItem
    ]
  }
}
