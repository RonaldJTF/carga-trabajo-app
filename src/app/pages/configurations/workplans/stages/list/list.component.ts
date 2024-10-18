import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import * as StageActions from "@store/stage.actions";
import {ActivatedRoute, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {MenuItem, TreeNode} from 'primeng/api';
import {TreeTable} from 'primeng/treetable';
import {finalize, map, Observable, Subscription} from 'rxjs';
import {AppState} from 'src/app/app.reducers';
import {Table} from 'primeng/table';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {OverlayPanel} from 'primeng/overlaypanel';
import chroma from 'chroma-js';
import {IMAGE_SIZE, Methods} from "@utils";
import {MESSAGE} from "@labels/labels";
import {FollowUp, Stage, Task, Workplan} from "@models";
import {
  AuthenticationService, ConfirmationDialogService, CryptojsService, MediaService, WorkplanService
} from "@services";
import {CalendarComponent} from "@shared";

@Component({
  selector: 'app-stage-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {

  formData: FormData = new FormData();
  formFollowUp: FormGroup;
  updateMode: boolean;
  creatingOrUpdating: boolean = false;
  uploadedFiles: any[] = [];

  IMAGE_SIZE = IMAGE_SIZE;
  MESSAGE = MESSAGE;

  @ViewChild('treeTableOfStages') treeTableOfStages: TreeTable;
  @ViewChild('tableOfTask') tableOfTask: Table;
  @ViewChild('detailOfTaskOverlayPanel') detailOfTaskOverlayPanel: OverlayPanel;
  @ViewChild('calendarOfAllTasks') calendarOfAllTasks: CalendarComponent;

  taskOfCalendar: Task = new Task();
  tasksSubscription: Subscription;
  tasks: Task[] = [];
  allTasks: any[] = [];
  nodesOfAllStages: any[] = [];
  generatedColors = new Set();
  statusInformation: any[] = [];
  totalTasks$: Observable<number>;
  dateSummary$: Observable<any>;
  downloadingGlobalReport = false;

  viewOptions: any[] = [{icon: 'pi pi-list', value: 'diary', tooltip: 'Lista'}, {
    icon: 'pi pi-calendar',
    value: 'calendar',
    tooltip: 'Calendario'
  }];
  selectedViewFollowUp: 'list' | 'form' = "list";
  viewMode: 'diary' | 'calendar';
  isAdmin: boolean;
  isOperator: boolean;
  isSuperAdmin: boolean;

  stage$: Observable<Stage>;
  stages$: Observable<TreeNode[]>;

  selectedNodesOfStage: TreeNode | TreeNode[] | null;
  selectedTasks: Task[] = [];

  loading: boolean = false;

  expandedNodes: number[];
  showMoreDetailOfTasks: boolean;
  calendarFullView: boolean;

  allTaskSubscription: Subscription;
  mustRechargeSubscription: Subscription;
  expandedNodesSubscription: Subscription;
  workplanSubscription: Subscription;
  showMoreDetailOfTasksSubscription: Subscription;
  advanceSliderSubscription: Subscription;
  advanceSubscription: Subscription;
  viewModeSubscription: Subscription;

  workplan: Workplan;

  menuItemsOfTask: MenuItem[] = [
    {label: 'Editar', icon: 'pi pi-pencil', command: (e) => this.onGoToUpdateTask(e.item.id, e.originalEvent)},
    {label: 'Eliminar', icon: 'pi pi-trash', command: (e) => this.onDeleteTask(e)}
  ];

  menuItemsOfTaskInCalendar: MenuItem[] = []

  menuItemsOfDownload: MenuItem[] = [
    {
      label: 'Reporte de avance', icon: 'pi pi-file-excel', automationId: "excel", command: (e) => {
        this.download(e)
      }
    },
  ]

  menuItemsOfFollowUp: MenuItem[] = [
    {label: 'Eliminar', icon: 'pi pi-trash', command: (e) => this.deleteFollowUp(e)},
  ];

  constructor(
    private store: Store<AppState>,
    private confirmationDialogService: ConfirmationDialogService,
    private workplanService: WorkplanService,
    private mediaService: MediaService,
    private authService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private cryptoService: CryptojsService,
  ) {
  }

  ngOnInit(): void {
    const {isAdministrator, isOperator, isSuperAdministrator} = this.authService.roles();
    this.isAdmin = isAdministrator;
    this.isOperator = isOperator;
    this.isSuperAdmin = isSuperAdministrator;

    this.menuItemsOfTaskInCalendar = [
      {
        label: 'Gestión de seguimientos',
        icon: 'pi pi-cog',
        command: (e) => this.goToManagementFollowUp(e.item.id, e.originalEvent)
      },
      {
        label: 'Editar',
        icon: 'pi pi-pencil',
        visible: this.isAdmin,
        command: (e) => this.onGoToUpdateTask(e.item.id, e.originalEvent)
      },
      {label: 'Eliminar', icon: 'pi pi-trash', visible: this.isAdmin, command: (e) => this.onDeleteTask(e)}
    ]

    this.workplanSubscription = this.store.select(state => state.workplan.item).subscribe(e => this.workplan = e);
    this.viewModeSubscription = this.store.select(state => state.stage.viewMode).subscribe(e => this.viewMode = e);
    this.totalTasks$ = this.store.select(state => state.stage.items).pipe(map(e => this.getTotalTasks(e)));
    this.dateSummary$ = this.store.select(state => state.stage.items).pipe(map(e => {
      const initialStartDate = new Date(8640000000000000);
      const initialEndDate = new Date(-8640000000000000);
      const {minDate, maxDate} = this.getDateRange(e, initialStartDate, initialEndDate);

      if (minDate.getTime() === initialStartDate.getTime() || maxDate.getTime() === initialEndDate.getTime()) {
        return {totalDays: 0, start: null, end: null};
      } else {
        const msPerDay = 24 * 60 * 60 * 1000;
        const utc1 = Date.UTC(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());
        const utc2 = Date.UTC(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate());
        return {totalDays: Math.floor((utc2 - utc1) / msPerDay) + 1, start: minDate, end: maxDate}; // +1 ya que el la fecha fin termina a las 23:59:59
      }
    }));

    this.allTaskSubscription = this.store.select(state => state.stage.items).subscribe(e => {
      this.allTasks = [];
      this.nodesOfAllStages = this.getAllTasksAndBuildMetadata(e);

      let status: any[] = this.allTasks.map(e => e.status);

      const classStyleCounts = status.reduce((acc, s) => {
        acc[s.classStyle] = (acc[s.classStyle] || 0) + 1;
        return acc;
      }, {});
      const uniqueClassStyles = new Set(status.map(s => s.classStyle));
      this.statusInformation = Array.from(uniqueClassStyles).map(classStyle => {
        const obj = status.find(s => s.classStyle === classStyle);
        return {
          ...obj,
          total: classStyleCounts[classStyle]
        };
      });
    });
    this.stages$ = this.store.select(state => state.stage.items).pipe(map(e => e.map(obj => this.transformToTreeNode(obj))));
    this.stage$ = this.store.select(state => state.stage.item).pipe(map(e => ({
      ...e,
      menuItems: this.getMenuItemsOfStage(e)
    })));

    this.showMoreDetailOfTasksSubscription = this.store.select(state => state.stage.showMoreDetailOfTasks).subscribe(e => this.showMoreDetailOfTasks = e);
    this.mustRechargeSubscription = this.store.select(state => state.stage.mustRecharge).subscribe(e => {
      if (e) {
        this.getStages()
      }
    });
    this.expandedNodesSubscription = this.store.select(state => state.stage.expandedNodes).subscribe(e => this.expandedNodes = e);
    this.tasksSubscription = this.stage$.subscribe(e => this.tasks = JSON.parse(JSON.stringify(e.tareas ?? [])));

    this.buildForm();

    this.advanceSubscription = this.formFollowUp.get('porcentajeAvance').valueChanges.subscribe(value => {
      this.formFollowUp.get('porcentajeAvanceSlider').setValue(value, {emitEvent: false});
    });

    this.advanceSliderSubscription = this.formFollowUp.get('porcentajeAvanceSlider').valueChanges.subscribe(value => {
      this.formFollowUp.get('porcentajeAvance').setValue(value, {emitEvent: false});
      if (this.formFollowUp.get('porcentajeAvance')?.invalid) {
        this.formFollowUp.get('porcentajeAvance').markAsDirty();
        this.formFollowUp.get('porcentajeAvance').markAllAsTouched();
      }
    });
  }

  ngOnDestroy(): void {
    this.mustRechargeSubscription?.unsubscribe();
    this.workplanSubscription?.unsubscribe();
    this.expandedNodesSubscription?.unsubscribe();
    this.showMoreDetailOfTasksSubscription?.unsubscribe();
    this.tasksSubscription?.unsubscribe();
    this.advanceSubscription?.unsubscribe();
    this.advanceSliderSubscription?.unsubscribe();
    this.viewModeSubscription?.unsubscribe();
    this.allTaskSubscription?.unsubscribe();
  }

  get totalSelectedStages(): number {
    return this.treeTableOfStages?.selection?.length;
  }

  getStages() {
    this.loading = true;
    this.workplanService.getStages(this.workplan.id).subscribe(e => {
      this.store.dispatch(StageActions.setList({stages: e}));
      this.store.dispatch(StageActions.setMustRecharge({mustRecharge: false}));
      this.loading = false;
    })
  }

  private transformToTreeNode(stage: Stage): TreeNode | null {
    return {
      data: {...stage, menuItems: this.getMenuItemsOfStage(stage)},
      children: stage.subEtapas?.map(e => this.transformToTreeNode(e)).filter(e => e),
      expanded: this.expandedNodes?.includes(stage.id)
    };
  }

  private getMenuItemsOfStage(stage: Stage): MenuItem [] {
    if (!stage) {
      return [];
    }
    let menuItem = [];
    if (this.isAdmin) {
      menuItem.push({label: 'Ver', icon: `pi pi-eye`, data: stage, command: (e) => this.viewStage(e.item.data)});
      menuItem.push({
        label: 'Nueva subetapa',
        disabled: stage.tareas?.length,
        icon: `pi pi-plus`,
        data: stage,
        command: (e) => this.goToAddSubstage(e.item.data)
      });
      menuItem.push({
        label: 'Nueva tarea',
        disabled: stage.subEtapas?.length,
        icon: `pi pi-plus`,
        data: stage,
        command: (e) => this.goToAddTask(e.item.data)
      });
      menuItem.push({
        label: 'Descargar', icon: 'pi pi-cloud-download', items: [
          {
            label: 'Reporte Excel',
            icon: 'pi pi-file-excel',
            automationId: "excel",
            command: (e) => this.download(e, stage.id)
          },
        ]
      });
      menuItem.push({
        label: 'Editar',
        icon: 'pi pi-pencil',
        command: (e) => this.onGoToUpdate(e.item.id, e.originalEvent)
      });
      menuItem.push({label: 'Eliminar', icon: 'pi pi-trash', data: stage, command: (e) => this.onDeleteStage(e)});
    } else if (this.isOperator || this.isSuperAdmin) {
      menuItem.push({label: 'Ver', icon: `pi pi-eye`, data: stage, command: (e) => this.viewStage(e.item.data)});
      menuItem.push({
        label: 'Descargar', icon: 'pi pi-cloud-download', items: [
          {
            label: 'Reporte Excel',
            icon: 'pi pi-file-excel',
            automationId: "excel",
            command: (e) => this.download(e, stage.id)
          },
        ]
      });
    }
    return menuItem;
  }

  openNew() {
    this.router.navigate(['create'], {
      relativeTo: this.route,
      skipLocationChange: true,
      queryParams: {idWorkplan: this.cryptoService.encryptParam(this.workplan.id)}
    });
  }

  onGoToUpdate(id: any, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.router.navigate([this.cryptoService.encryptParam(id)], {relativeTo: this.route, skipLocationChange: true})
  }

  onGoToUpdateTask(id: any, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.router.navigate(["task", this.cryptoService.encryptParam(id)], {
      relativeTo: this.route,
      skipLocationChange: true
    })
  }

  viewStage(stage: Stage) {
    this.store.dispatch(StageActions.setItem({stage: stage}));
  }

  goToAddSubstage(stage: Stage) {
    this.router.navigate(['create'], {
      relativeTo: this.route,
      skipLocationChange: true,
      queryParams: {
        idWorkplan: this.cryptoService.encryptParam(this.workplan.id),
        idParent: this.cryptoService.encryptParam(stage.id)
      }
    });
  }

  goToAddTask(stage: Stage) {
    this.router.navigate(['task/create'], {
      relativeTo: this.route,
      skipLocationChange: true,
      queryParams: {idStage: this.cryptoService.encryptParam(stage.id)}
    });
  }

  private verifyIfSelectedStageWasDeleted(removedIds) {
    this.store.dispatch(StageActions.removeStageIfWasDeleted({removedIds: removedIds}));
  }

  onFilterStage(event: Event) {
    this.treeTableOfStages.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  onFilterTask(event: Event) {
    this.tableOfTask.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  desmarkAllStages() {
    this.selectedNodesOfStage = [];
  }

  desmarkAllTasks() {
    this.selectedTasks = [];
  }

  deleteSelectedStages() {
    let stageIds = (this.selectedNodesOfStage as TreeNode[]).map(e => e.data.id);
    this.confirmationDialogService.showDeleteConfirmationDialog(
      () => {
        this.workplanService.deleteSelectedStages(stageIds)
          .subscribe({
            next: (e) => {
              this.store.dispatch(StageActions.removeItemsFromList({stageIds: stageIds}));
              this.verifyIfSelectedStageWasDeleted(stageIds);
              this.desmarkAllStages();
            }
          });
      }
    )
  }

  onDeleteStage(event: any): void {
    let id = parseInt(event.item.id);
    event.originalEvent.preventDefault();
    event.originalEvent.stopPropagation();
    this.confirmationDialogService.showDeleteConfirmationDialog(
      () => {
        this.workplanService.deleteStage(id)
          .subscribe({
            next: () => {
              this.store.dispatch(StageActions.removeFromList({id: id}));
              this.verifyIfSelectedStageWasDeleted([id]);
              this.desmarkAllStages();
            },
          });
      }
    )
  }

  deleteSelectedTasks() {
    let taskIds = (this.selectedTasks).map(e => e.id);
    this.confirmationDialogService.showDeleteConfirmationDialog(
      () => {
        this.workplanService.deleteSelectedTasks(taskIds)
          .subscribe({
            next: (e) => {
              this.store.dispatch(StageActions.removeTasksFromStage({taskIds: taskIds}));
              this.desmarkAllTasks();
            }
          });
      }
    )
  }

  onDeleteTask(event: any): void {
    let id = parseInt(event.item.id);
    event.originalEvent.preventDefault();
    event.originalEvent.stopPropagation();
    this.confirmationDialogService.showDeleteConfirmationDialog(
      () => {
        this.workplanService.deleteTask(id)
          .subscribe({
            next: () => {
              this.store.dispatch(StageActions.removeTasksFromStage({taskIds: [id]}));
              this.desmarkAllTasks();
            }
          });
      }
    )
  }

  onNodeExpand(event) {
    this.store.dispatch(StageActions.addToExpandedNodes({id: event.node.data.id}));
  }

  onNodeCollapse(event) {
    this.store.dispatch(StageActions.removeFromExpandedNodes({id: event.node.data.id}));
  }


  download(data: any, idStage?: number) {
    const updateMenuItem = (menuItem: MenuItem, icon: string, disabled: boolean) => {
      if (menuItem) {
        menuItem.icon = icon;
        menuItem.disabled = disabled;
      }
    };
    const menuItem = !idStage ? this.menuItemsOfDownload.find(e => e.automationId === data.item.automationId) : null;
    const initialIcon = menuItem?.icon;
    const initialState = menuItem?.disabled;
    updateMenuItem(menuItem, "pi pi-spin pi-spinner", true);
    const stageIds = idStage
      ? [idStage]
      : (this.selectedNodesOfStage as TreeNode[])?.map(e => e.data.id) || [];
    this.workplanService.downloadReport(data.item.automationId, stageIds, this.workplan.id).subscribe({
      next: () => updateMenuItem(menuItem, initialIcon, initialState),
      error: () => updateMenuItem(menuItem, initialIcon, initialState)
    });
  }

  downloadGlobalReport() {
    this.downloadingGlobalReport = true;
    this.workplanService.downloadReport('excel', null, this.workplan.id).subscribe({
      next: () => {
        this.downloadingGlobalReport = false;
      },
      error: () => {
        this.downloadingGlobalReport = false;
      }
    });
  }

  downloadFile(id: number, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.mediaService.download(id);
  }

  hasDetailToShow(task: Task) {
    if (task.seguimientos?.length) {
      return true;
    }
    return false;
  }

  onChangeShowMoreDetail(event: any) {
    this.store.dispatch(StageActions.setShowMoreDetailOfTasks({showMoreDetailOfTasks: event.checked}));
  }

  onTemplateChange(event: "diary" | "calendar") {
    this.store.dispatch(StageActions.setViewMode({viewMode: event}));
  }

  newFollowUp(task: Task) {
    this.clearForm();
    if (task.seguimientos?.length) {
      this.addValidateAvance(task);
    }
    this.selectedViewFollowUp = 'form';
  }

  onBackTask() {
    this.selectedViewFollowUp = 'list';
  }

  clearForm() {
    this.uploadedFiles = [];
    this.formFollowUp.reset();
    this.formData.delete('files');
    this.formData.delete('followUp');
    this.removeValidateAvance();
  }

  buildForm() {
    this.formFollowUp = this.formBuilder.group({
      id: null,
      idTarea: null,
      porcentajeAvance: [0, Validators.compose([Validators.required, Validators.min(0.01), Validators.max(100)])],
      porcentajeAvanceSlider: [0, Validators.compose([Validators.required, Validators.min(0.01), Validators.max(100)])],
      observacion: ['']
    })
  }

  private isValido(nombreAtributo: string) {
    return (
      this.formFollowUp.get(nombreAtributo)?.invalid &&
      (this.formFollowUp.get(nombreAtributo)?.dirty || this.formFollowUp.get(nombreAtributo)?.touched)
    );
  }

  get controls() {
    return this.formFollowUp.controls;
  }

  get porcentajeNoValido() {
    return this.isValido('porcentajeAvance');
  }

  get observacionNoValido() {
    return this.isValido('observacion');
  }

  onSubmitFollowUp(event: Event, task: Task) {
    event.preventDefault();
    this.formFollowUp.get('idTarea').setValue(task.id);
    this.formData = new FormData();

    for (const file of this.uploadedFiles) {
      this.formData.append('files', file);
    }

    let form: any = this.formFollowUp.value;
    delete form.porcentajeAvanceSlider;
    this.formData.append('followUp', JSON.stringify(form));

    if (this.formFollowUp.invalid) {
      this.formFollowUp.markAllAsTouched();
    } else {
      this.creatingOrUpdating = true;
      this.updateMode ? this.updateFollowUp(this.formFollowUp.value.id, this.formData) : this.createFollowUp(this.formData);
    }
  }

  updateFollowUp(idFollowUp, payload: any): void {
    this.workplanService.updateFollowUp(idFollowUp, payload).pipe(
      finalize(() => {
        this.creatingOrUpdating = false;
      })
    ).subscribe({
      next: (e) => {
        this.onBackTask();
        this.taskOfCalendar = this.tasks.find(item => item.id == e.idTarea);
      }
    })
  }

  createFollowUp(payload: any): void {
    this.workplanService.createFollowUp(payload).pipe(
      finalize(() => {
        this.creatingOrUpdating = false;
      })
    ).subscribe({
      next: (data) => {
        this.onBackTask();
        this.store.dispatch(StageActions.addFollowUpToTask({idTask: data.idTarea, followUp: data}));
        this.taskOfCalendar = this.tasks.find(item => item.id == data.idTarea);
      }
    })
  }

  onSelectFile(event: any) {
    for (const file of event.files) {
      this.uploadedFiles.push(file);
    }
  }

  onRemoveFile(event: any) {
    this.uploadedFiles = this.uploadedFiles.filter(objeto => objeto.name !== event.file.name);
  }

  deleteFollowUp(event: any) {
    const followUp: FollowUp = event.item.value;
    const idFollowUp: number = followUp.id;
    this.confirmationDialogService.showDeleteConfirmationDialog(
      () => {
        this.workplanService.deleteFollowUp(idFollowUp).subscribe({
          next: () => {
            this.store.dispatch(StageActions.removeFollowUpFromTask({
              idTask: followUp.idTarea,
              idFollowUp: idFollowUp
            }));
            this.taskOfCalendar = this.tasks.find(item => item.id == followUp.idTarea);
          }
        })
      }
    )
  }

  addValidateAvance(task: Task): void {
    if (this.formFollowUp) {
      let seguimiento = this.obtenerSeguimientoMasReciente(task.seguimientos);
      let control = this.formFollowUp.get('porcentajeAvance');
      if (control) {
        control.setValue(seguimiento.porcentajeAvance);
        control.addValidators([Validators.min(seguimiento.porcentajeAvance)]);
        control.updateValueAndValidity();
      }
    }
  }

  removeValidateAvance(): void {
    if (this.formFollowUp) {
      const control = this.formFollowUp.get('porcentajeAvance');
      if (control) {
        control.clearValidators();
        control.updateValueAndValidity();
      }
    }
  }

  obtenerSeguimientoMasReciente(follows: FollowUp[]) {
    if (!follows?.length) {
      return null;
    }
    return follows.reduce((reciente, actual) => {
      const fechaMasReciente = new Date(reciente.fecha);
      const fechaActual = new Date(actual.fecha);
      return fechaActual > fechaMasReciente ? actual : reciente;
    });
  }

  goToManagementFollowUp(idTask: any, event: Event) {
    this.selectedViewFollowUp = 'list';
    this.detailOfTaskOverlayPanel.toggle(event)
    this.taskOfCalendar = this.allTasks.find(item => item.id == idTask);
  }

  updateDates(data: any) {
    data.originalEvent.preventDefault();
    this.workplanService.updateDates(data.id, {fechaInicio: data.start, fechaFin: data.end}).subscribe({
      next: (e) => {
        this.store.dispatch(StageActions.updateTaskFromStage({task: e}));
      }
    });
  }

  goToAddTaskFromCalendar(data: any, stage: Stage) {
    this.router.navigate(['task/create'], {
      relativeTo: this.route,
      skipLocationChange: true,
      queryParams: {idStage: this.cryptoService.encryptParam(stage.id), startDate: data.start}
    });
  }

  showCalendarFullView() {
    this.calendarOfAllTasks?.updateSize();
    this.calendarFullView = true;
  }

  private getAllTasksAndBuildMetadata(stages: Stage[]): TreeNode[] | null {
    if (!stages) {
      return null
    }
    return stages.map(e => {
      let color;
      if (e.tareas?.length) {
        color = this.findColorInNodes(e.id, this.nodesOfAllStages) ?? this.generateRandomColor();
        this.allTasks.push(...e.tareas.map(
          t => {
            return {
              ...t,
              color: color,
              parent: e.nombre,
              status: Methods.getActivityStatus(new Date(t.fechaInicio), new Date(t.fechaFin), new Date(this.obtenerSeguimientoMasReciente(t.seguimientos)?.fecha), t.avance)
            }
          }
        ));
      }
      return {
        data: {...e, color: color, total: e.tareas?.length},
        children: this.getAllTasksAndBuildMetadata(e.subEtapas),
        expanded: true
      };
    })
  }

  private getTotalTasks(stages: Stage[]): number | null {
    if (!stages) {
      return 0
    }
    return stages.reduce((sum, e) => {
      return sum + e.tareas?.length + this.getTotalTasks(e.subEtapas);
    }, 0)
  }

  private getDateRange(stages: Stage[], startDate: Date, endDate: Date): { minDate: Date, maxDate: Date } {
    if (!stages) {
      return {minDate: startDate, maxDate: endDate};
    }
    for (const e of stages) {
      if (e.tareas) {
        const {minDate, maxDate} = e.tareas.reduce((acc, tarea) => {
          const fechaInicio = new Date(tarea.fechaInicio);
          const fechaFin = new Date(tarea.fechaFin);

          if (!acc.minDate || fechaInicio < acc.minDate) {
            acc.minDate = fechaInicio;
          }
          if (!acc.maxDate || fechaFin > acc.maxDate) {
            acc.maxDate = fechaFin;
          }
          return acc;
        }, {minDate: startDate, maxDate: endDate});

        startDate = minDate < startDate ? minDate : startDate;
        endDate = maxDate > endDate ? maxDate : endDate;
      }
      const subRange = this.getDateRange(e.subEtapas, startDate, endDate);
      startDate = subRange.minDate < startDate ? subRange.minDate : startDate;
      endDate = subRange.maxDate > endDate ? subRange.maxDate : endDate;
    }

    return {minDate: startDate, maxDate: endDate};
  }


  private findColorInNodes(id: number, nodes: TreeNode[]): string | undefined {
    for (const node of nodes) {
      if (node.data.id === id && node.data.color) {
        return node.data.color;
      }
      if (node.children) {
        const color = this.findColorInNodes(id, node.children);
        if (color) {
          return color;
        }
      }
    }
    return undefined;
  }

  private generateRandomColor() {
    let color;
    do {
      color = chroma.random().set('hsl.s', 0.6).set('hsl.l', 0.8).hex();
    } while (this.generatedColors.has(color));
    this.generatedColors.add(color);
    return color;
  }

  goBack() {
    this.router.navigate(['configurations/workplans'], {
      skipLocationChange: true,
    }).then();
  }

}
