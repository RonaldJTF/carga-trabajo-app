import { Component, DoCheck, IterableDiffers, KeyValueChangeRecord, KeyValueDiffers, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as AppointmentActions from "@store/appointment.actions";
import { ActivatedRoute, Router } from '@angular/router';
import { MESSAGE } from '@labels/labels';
import { Appointment, Structure, Validity } from '@models';
import { Store } from '@ngrx/store';
import { AppointmentService, AuthenticationService, ConfirmationDialogService, CryptojsService, ScopeService, StructureService, ValidityService } from '@services';
import { IMAGE_SIZE, Methods } from '@utils';
import { MenuItem, TreeNode } from 'primeng/api';
import { OverlayPanel } from 'primeng/overlaypanel';
import { TreeTable } from 'primeng/treetable';
import { filter, Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducers';

class FiltersBy{
  dependencies: any[];
  validities: any[];
}

class GroupAttribute{
  groupKey: 'idEstructura' | 'idVigencia' | 'idNivel' | 'idEscalaSalarial' | 'idAlcance';
  groupValue: string;
  type: 'STRUCTURE' | 'VALIDITY' | 'LEVEL' | 'SALARYSCALE' | 'SCOPE';
}

class ComparisonAtrribute{
  comparisonKey: string;
  comparisonValue: string;
  comparisonLabel: string;
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

  isAdmin: boolean;
  loading: boolean;
  filtering: boolean;
  idStructure: number;

  selectedNodesOfAppointments: TreeNode | TreeNode[] | null;

  appointments: Appointment[];
  selectedAppointment: Appointment;
  appointmentsSubscription: Subscription;
  expandedNodesSubscription: Subscription;

  filtersBy: FiltersBy = new FiltersBy();
  filterProps = {
    dependencies: {icon: 'pi pi-sitemap', valueKey: 'data.nombre', internalKeyRelashionship: 'data.id',  externalKeyRelashionship: 'idEstructura'},
    validities: {icon: 'pi pi-calendar', valueKey: 'nombre', internalKeyRelashionship: 'id',  externalKeyRelashionship: 'idVigencia'}
  }
  filterHasChanged: boolean = false;
  confirmedFilters: FiltersBy;

  structureOptions: TreeNode<Structure>[] = [];
  validityOptions: Validity[] = [];

  comparisonAtrribute: ComparisonAtrribute =  {comparisonKey: 'idAlcance', comparisonValue: 'alcance', comparisonLabel: 'nombre'};
  groupAttributes : GroupAttribute[] = [
    {groupKey: 'idEstructura', groupValue: 'estructura', type: 'STRUCTURE'},
    {groupKey: 'idVigencia', groupValue: 'vigencia', type: 'VALIDITY'},
    {groupKey: 'idNivel', groupValue: 'nivel', type: 'LEVEL'},
    {groupKey: 'idEscalaSalarial', groupValue: 'escalaSalarial', type: 'SALARYSCALE'},
  ];
  comparisonObjects: any[] = [];

  tree: TreeNode[] = [];
  filtersByDiffer: any;

  menuItemsOfAppointment: MenuItem[] = [];
  menuItemsOfAppointmentGroup: MenuItem[] = [];

  showedIcons: any = {};
  expandedNodes: any[];

  constructor(
    private store: Store<AppState>,
    private structureService: StructureService,
    private validityService: ValidityService,
    private appointmentService: AppointmentService,
    private scopeService: ScopeService,
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

    this.expandedNodesSubscription = this.store.select(state => state.appointment.expandedNodes).subscribe(e => this.expandedNodes = e);
    this.appointmentsSubscription =  this.store.select(state => state.appointment.items).subscribe(e => {
      this.appointments = e;
      this.buildDataset(e);
    });
    this.idStructure = this.cryptoService.decryptParamAsNumber(this.route.snapshot.queryParams['idStructure']);

    const filters = new FiltersBy();
    if(this.idStructure > 0){
      filters.dependencies = [this.idStructure];
    }
    this.loading = true;
    this.initMenuItems();
    this.getAppointments(filters);
  }

  ngOnDestroy(): void {
    this.appointmentsSubscription?.unsubscribe();
    this.expandedNodesSubscription?.unsubscribe();
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
   * Los cargos que sealmente se  encuentran seleccionados son todos aquellos en el último nivel de la jerarquía en el árbol,
   * Y estos son precisamente los del tipo que se encuentran en la última posición del objeto 'this.groupAttributes'.
   * Los elementos se encuentran dentro del atrributo data.items, ya que aquí se alojan los agrupados hasta ese nivel.
   */
  getSelectedRealAppointments(){
    return (this.selectedNodesOfAppointments as TreeNode[])?.filter(e => e.data.type == this.groupAttributes[this.groupAttributes.length - 1].type);
  }

  openFilterOptions(event: Event){
    this.filterOptionsOverlayPanel.show(event);
    if(!this.structureOptions?.length){
      this.getDependencies();
    }
    if(!this.validityOptions?.length){
      this.getValidities();
    }
  }

  getAppointments(filterIds: FiltersBy){
    this.appointmentService.getAppointments(filterIds).subscribe({
      next: (data) => {
        this.store.dispatch(AppointmentActions.setList({appointments: data as Appointment[]}));
        this.loading = false;
        this.filtering = false;
      }
    })
  }

  buildDataset(data: any[]){
    this.tree = this.groupByAttributes(data, this.groupAttributes);
    //Cosntruir los objetos que se tienen en cuenta en la comparación
    const list = Array.from(
      data.reduce((map, item) => {
        if (!map.has(item[this.comparisonAtrribute.comparisonKey])) {
          map.set(item[this.comparisonAtrribute.comparisonKey], item[this.comparisonAtrribute.comparisonValue]);
        }
        return map;
      }, new Map()).values()
    );
    this.comparisonObjects = list?.map(e => ({[this.comparisonAtrribute.comparisonKey]: e['id'], label: e[this.comparisonAtrribute.comparisonLabel]}));
  }

  getDependencies() {
    this.structureService.getDependencies().subscribe({
      next: (data) => {
        this.builtNodes(data, this.structureOptions);
      }
    })
  }

  getValidities() {
    this.validityService.getValidities().subscribe({
      next: (e) => {
        this.validityOptions = e;
      }
    })
  }

  onFilter(treeTable: TreeTable, event: Event) {
    treeTable.filterGlobal((event.target as HTMLInputElement).value, 'contains');
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
    const deleted = this.filtersBy[key]?.splice(index, 1);
    if (this.filtersBy[key]?.length){
      const list = this.appointments.filter(
        e => this.getNestedProperty(e, this.filterProps[key].externalKeyRelashionship) != this.getNestedProperty(deleted[0], this.filterProps[key].internalKeyRelashionship)
      );
      this.store.dispatch(AppointmentActions.setList({appointments: list}));
    }else if(this.isObjectEmpty(this.filtersBy)){
      this.store.dispatch(AppointmentActions.setList({appointments: []}));
      this.filterHasChanged = true;
    }
  }

  filterAppointments(){
    this.filterOptionsOverlayPanel.hide();
    if(this.filterHasChanged){
      this.filtering = true;
      const filters = new FiltersBy();
      filters.dependencies = this.filtersBy.dependencies?.map(e => e.data.id) ?? [];
      filters.validities = this.filtersBy.validities?.map(e => e.id) ?? [];
      this.getAppointments(filters);
      this.filterHasChanged = false;
      this.confirmedFilters = {...this.filtersBy};
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

  private isObjectEmpty(obj) {
    return Object.values(obj).every(value =>
        value === null ||
        value === undefined ||
        (Array.isArray(value) && value.length === 0)
    );
  }

  private builtNodes(structures: Structure[], nodes: TreeNode<Structure>[]) {
    if (!structures) {
      return;
    }
    for (let structure of structures) {
      if (Methods.parseStringToBoolean(structure.tipologia.esDependencia)) {
        let node: TreeNode<Structure> = {
          data: structure,
          label: structure.nombre,
          children: []
        };
        if (structure.subEstructuras?.length) {
          this.builtNodes(structure.subEstructuras, node.children)
        }
        nodes.push(node);
      }
    }
  }

  private groupByAttributes(list, groupAttributes: GroupAttribute[]) {
    const groupKeys = groupAttributes.map( e => e.groupKey);
    const groupValues = groupAttributes.map( e => e.groupValue);
    const types = groupAttributes.map( e => e.type);
    const expandedNodes = this.expandedNodes;

    const comparisonAtrribute = this.comparisonAtrribute;
    const comparisonKeys = [...new Set(list.map(item => item[comparisonAtrribute.comparisonKey]))];

    function groupRecursively(items, level = 0) {
        if (level >= groupKeys.length) {
            return items;
        }

        const attr = groupKeys[level];
        return items.reduce((acc, item) => {
            const key = item[attr];
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
        for (const key in grouped) {
            const children = buildTree(
                groupRecursively(grouped[key], level + 1),
                level + 1
            );

            const comparisonsPercomparisonKey = new Map();
            grouped[key].forEach(obj => {
              if (comparisonKeys.includes(obj[comparisonAtrribute.comparisonKey])) {
                if (!comparisonsPercomparisonKey.has(obj[comparisonAtrribute.comparisonKey])) {
                  comparisonsPercomparisonKey.set(obj[comparisonAtrribute.comparisonKey], 0);
                }
                comparisonsPercomparisonKey.set(
                  obj[comparisonAtrribute.comparisonKey],
                  comparisonsPercomparisonKey.get(obj[comparisonAtrribute.comparisonKey]) + obj.asignacionTotal
                );
              }
            });

            result.push({
                data: {
                  [groupKeys[level]]: key,
                  type: types[level],
                  ... (groupValues[level] != null ? grouped[key][0][groupValues[level]] :  grouped[key][0]),
                  items: grouped[key],
                  isLastGroup: level == groupKeys.length - 1,
                  total: grouped[key].length,
                  comparisonsPercomparisonKey: Object.fromEntries(comparisonsPercomparisonKey)
                },
                children: children,
                expanded: expandedNodes.includes(types[level] + '|' + key),
            });
        }
        return result;
    }

    const grouped = groupRecursively(list);
    return buildTree(grouped);
  }
}
