import { Location } from '@angular/common';
import * as AppointmentActions from "@store/appointment.actions";
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MESSAGE } from '@labels/labels';
import { Appointment, Hierarchy, JobTitle, Level, LevelGroupOfMultiAppointment, MultiAppointments, Normativity, OrganizationChart, SalaryScale, SalaryScaleGroupOfMultiAppointment} from '@models';
import { Store } from '@ngrx/store';
import { AppointmentService, AuthenticationService, BasicTablesService, ConfirmationDialogService, CryptojsService, LevelService, NormativityService, OrganizationChartService, UrlService, ValidityService } from '@services';
import { IMAGE_SIZE, Methods } from '@utils';
import { MenuItem, SelectItem, TreeNode } from 'primeng/api';
import { OverlayPanel } from 'primeng/overlaypanel';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducers';
import { MultiAppointmentsService } from 'src/app/services/multi-appointments.service';

@Component({
  selector: 'app-multi-appointments',
  templateUrl: './multi-appointments.component.html',
  styleUrls: ['./multi-appointments.component.scss']
})
export class MultiAppointmentsComponent implements OnInit, OnDestroy {
  IMAGE_SIZE = IMAGE_SIZE;
  MESSAGE = MESSAGE;
  ROUTE_TO_BACK: string = '/configurations/appointments';

  @ViewChild('validityOptionsOverlayPanel') validityOptionsOverlayPanel: OverlayPanel;
  @ViewChild('normativityOptionsOverlayPanel') normativityOptionsOverlayPanel: OverlayPanel;
  @ViewChild('organizationChartOptionsOverlayPanel') organizationChartOptionsOverlayPanel: OverlayPanel;
  @ViewChild('salaryScaleOptionsOverlayPanel') salaryScaleOptionsOverlayPanel: OverlayPanel;

  isAdmin: boolean;
  formMultiAppointments !: FormGroup;
  multiAppointments: MultiAppointments;
  updateMode: boolean;
  creatingOrUpdating: boolean = false;
  deleting: boolean = false;
  loadingAppointments: boolean = false;
  loadingSalaryScales: boolean = false;
  loadingHierarchies: boolean = false;

  indexOfLevelGroup: number;
  levelGroupFormGroup: FormGroup;
  mustRechargeMultiAppointmentsFormGroup: boolean;
  mustRechargeMultiAppointmentsFormGroupSubscription: Subscription;
  levelGroupFormGroupSubscription: Subscription;
  multiAppointmentsSubscription: Subscription;
  indexOfLevelGroupSubscription: Subscription;
  organizationChartSubscription: Subscription;
  hierarchySubscription: Subscription;
  levelSubscription: Subscription;

  levels: Level[] = [];
  salaryScales: SalaryScale[] = [];
  normativities: Normativity[] = [];

  backRoute: string;

  jobTitleOptions: JobTitle[] = [];
  organizationChartOptions: SelectItem[] = [];
  validityOptions: SelectItem[] = [];
  normativityOptions: SelectItem[] = [];
  hierarchyOptions: TreeNode<Hierarchy>[] = [];
  menuItemsOfValidity: MenuItem[] = [];
  menuItemsOfLevelGroup: MenuItem[] = [];

  appointmentIdOfGroup: number;

  constructor(
    private store: Store<AppState>,
    private confirmationDialogService: ConfirmationDialogService,
    private normativityService: NormativityService,
    private levelService: LevelService,
    private validityService: ValidityService,
    private multiAppointmentsService: MultiAppointmentsService,
    private appointmentService: AppointmentService,
    private organizationChartService: OrganizationChartService,
    private basicTablesService: BasicTablesService,
    private authService: AuthenticationService,
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private urlService: UrlService,
    private cryptoService: CryptojsService
  ){}

  ngOnInit(): void {
    const {isAdministrator, isOperator} = this.authService.roles();
    this.isAdmin = isAdministrator;

    this.backRoute = this.route.snapshot.queryParams['backRoute'] ?? this.ROUTE_TO_BACK;

    this.indexOfLevelGroupSubscription =  this.multiAppointmentsService.indexOfLevelGroup$.subscribe(e => this.indexOfLevelGroup = e);
    this.levelGroupFormGroupSubscription = this.multiAppointmentsService.levelGroupFormGroup$.subscribe(e => this.levelGroupFormGroup = e);
    this.mustRechargeMultiAppointmentsFormGroupSubscription = this.multiAppointmentsService.mustRechargeMultiAppointmentsFormGroup$.subscribe(
      e => {this.mustRechargeMultiAppointmentsFormGroup = e;}
    );
    this.multiAppointmentsSubscription = this.multiAppointmentsService.multiAppointments$.subscribe(e => this.multiAppointments = e)

    if (this.mustRechargeMultiAppointmentsFormGroup){
      this.multiAppointmentsService.createMultiAppointmentsFormGroup();
    }

    this.hierarchySubscription = this.multiAppointmentsService.getMultiAppointmentsFormGroup().get('hierarchyTreeNode').valueChanges.subscribe(
      (value: TreeNode<Hierarchy>) => {
        this.multiAppointmentsService.setHierarchyToMultiAppointments(value);
      }
    );

    this.organizationChartSubscription = this.multiAppointmentsService.getMultiAppointmentsFormGroup().get('idOrganigrama').valueChanges.subscribe(
      (value: number) => {
        this.loadHierarchies(value);
        this.hierarchyTreeNodeAbstractControl.setValue(null);
        this.idJerarquiaAbstractControl.markAsUntouched();
      }
    );

    this.appointmentIdOfGroup = this.cryptoService.decryptParamAsNumber(this.route.snapshot.params['id']);
    this.loadMultiAppointmentInformation(this.appointmentIdOfGroup);
    this.loadOrganizacionCharts();
    this.loadValidities(this.appointmentIdOfGroup);
    this.initMenus();
    this.loadLevels();
    this.loadNormativities();
    this.loadJobTitles();
  }

  ngOnDestroy(): void {
    this.mustRechargeMultiAppointmentsFormGroupSubscription?.unsubscribe();
    this.multiAppointmentsSubscription?.unsubscribe();
    this.indexOfLevelGroupSubscription?.unsubscribe();
    this.levelGroupFormGroupSubscription?.unsubscribe();
    this.organizationChartSubscription?.unsubscribe();
    this.hierarchySubscription?.unsubscribe();
    this.levelSubscription?.unsubscribe();
  }

  initMenus(){
    this.menuItemsOfLevelGroup = [
      {label: 'Editar', icon: 'pi pi-pencil', visible: this.isAdmin, command: (e) => this.modifyLevelGroup(e.item['index'], e.originalEvent)},
      {label: 'Remover', icon: 'pi pi-trash', visible: this.isAdmin, command: (e) => this.removeLevelGroup(e.item['index'], e.originalEvent)},
    ];
  }

  get levelGroupsFormArray(): FormArray{
    return this.formMultiAppointments.get('gruposNiveles') as FormArray;
  }
  
  get salaryScaleGroupFormArray(): FormArray{
    return this.levelGroupFormGroup.get('gruposEscalasSalariales') as FormArray;
  }

  get hierarchyTreeNodeAbstractControl(): AbstractControl{
    return this.formMultiAppointments.get('hierarchyTreeNode');
  }

  get idJerarquiaAbstractControl(): AbstractControl{
    return this.formMultiAppointments.get('idJerarquia');
  }

  getDenominacionesEmpleosFormArray(control: AbstractControl): FormArray{
    return control.get('denominacionesEmpleos') as FormArray;
  }

  loadMultiAppointmentInformation(appointmentIdOfGroup: number){
    if (appointmentIdOfGroup == undefined){
      this.updateMode = false;
      this.formMultiAppointments = this.multiAppointmentsService.getMultiAppointmentsFormGroup();
      this.multiAppointmentsService.setMustRechargeMultiAppointmentsFormGroup(false);
    }else{
      this.updateMode = true;
      if (this.mustRechargeMultiAppointmentsFormGroup){
        this.loadingAppointments = true;
        this.appointmentService.getMultiAppointments(appointmentIdOfGroup).subscribe({
          next: (e) => {
            this.formMultiAppointments = this.multiAppointmentsService.initializeMultiAppointmentsFormGroup(
              this.multiAppointmentsService.transformAppointmentsToMultiAppointments(e)
            );
            this.multiAppointmentsService.setMustRechargeMultiAppointmentsFormGroup(false);
            this.loadingAppointments = false;
          },
          error: () => this.loadingAppointments = false
        });
      }else{
        this.formMultiAppointments = this.multiAppointmentsService.getMultiAppointmentsFormGroup();
      }
    }
  }

  loadOrganizacionCharts(): void {
    this.organizationChartService.getOrganizationalCharts().subscribe({
      next: (e) => {
        this.organizationChartOptions = e?.map( o => ({value: o, label: o.nombre}));
      }
    });
  }

  loadHierarchies(organizaonChartId: number): void {
    this.loadingHierarchies = true;
    this.organizationChartService.getHierarchiesByOrganizationChartId(organizaonChartId).subscribe({
      next: (e) => {
        this.hierarchyOptions = [];
        this.builtNodes(e, this.hierarchyOptions);
        this.loadingHierarchies = false;
      },
      error: (e) => this.loadingHierarchies = false
    });
  }

  loadValidities(appointmentIdOfGroup: number): void {
    this.validityService.getValidities().subscribe({
      next: (e) => {
        this.validityOptions = e?.map( o => ({value: o, label: o.nombre}));
        const activeValidity = e?.find(o => Methods.parseStringToBoolean(o.estado));
        if(!appointmentIdOfGroup && activeValidity){
          this.multiAppointmentsService.setValidityToMultiAppointments(activeValidity);
        }
      }
    });
  }

  loadLevels(): void {
    this.levelService.getLevels().subscribe({
      next: (e) => {
        this.levels = e;
      }
    });
  }

  loadSalaryScale(levelId: number){
    this.loadingSalaryScales = true;
    this.levelService.getSalaryScalesByLevelIdAndActive(levelId).subscribe({
      next: (e) => {
        this.salaryScales = e;
        this.loadingSalaryScales = false;
        if(!this.salaryScales?.length && this.indexOfLevelGroup < 0){
          this.multiAppointmentsService.setNewSalaryScaleGroup({} as SalaryScaleGroupOfMultiAppointment);
        }
      },
      error: ()=>{this.loadingSalaryScales = false;}
    });
  }

  loadNormativities(): void {
    this.normativityService.getAppointmentNormativities('1').subscribe({
      next: (e) => {
        this.normativityOptions = e?.map( o => ({value: o, label: o.nombre}));
      }
    });
  }

  loadJobTitles(){
    this.basicTablesService.getJobTitles().subscribe({
      next: (e) => {
        this.jobTitleOptions = e;
      }
    });
  }

  openNewLevelGroup(){
    this.multiAppointmentsService.setNewLevelGroup({} as LevelGroupOfMultiAppointment);
  }

  cancelLevelGroup(event: Event){
    this.multiAppointmentsService.cancelLevelGroup();
  }

  submitLevelGroup(event:Event){
    if (this.levelGroupFormGroup.invalid) {
      this.levelGroupFormGroup.markAllAsTouched();
    } else {
      this.multiAppointmentsService.submitLevelGroup();
    }
  }

  onChangeLevel(data: any){
    const levelId: number = data.value;
    const level = this.levels.find( e => e.id == levelId);
    /*Si no está editando, entonces es que debe de crear un nuevo grupo por nivel ocupacional, 
    pero si está editando se actualiza al nuevo nivel */
    if(this.indexOfLevelGroup < 0){
      this.multiAppointmentsService.setNewLevelGroup({idNivel: level.id, nivel: level} as LevelGroupOfMultiAppointment);
    }else{
      this.multiAppointmentsService.updateLevelGroup({idNivel: level.id, nivel: level} as LevelGroupOfMultiAppointment);
    }
    this.loadSalaryScaleOnChangeLevel();
  }


  selectSalaryScale(data: any){
    const salaryScale: SalaryScale = data.value;
    this.salaryScaleOptionsOverlayPanel.hide();
    this.multiAppointmentsService.setNewSalaryScaleGroup(
      {idEscalaSalarial: salaryScale.id, escalaSalarial: salaryScale} as SalaryScaleGroupOfMultiAppointment
    );
  }

  modifyLevelGroup(index: number, event: Event){
    event.preventDefault();
    event.stopPropagation();
    this.multiAppointmentsService.modifyLevelGroup(index);
    this.loadSalaryScaleOnChangeLevel();
  }

  removeLevelGroup(index: number, event: Event){
    event.preventDefault();
    event.stopPropagation();
    this.multiAppointmentsService.removeLevelGroup(index);
  }

  loadSalaryScaleOnChangeLevel(){
    const levelId = this.levelGroupFormGroup.get('idNivel').value;
    if(levelId){
      this.loadSalaryScale(levelId);
    }
  }


  updateMultiAppointmenta(payload: Appointment[]): void {
    /*this.appointmentService.updateAppointment(id, payload).subscribe({
      next: (e) => {
        this.store.dispatch(AppointmentActions.updateFromList({appointment: e}));
        this.router.navigate([this.backRoute], {skipLocationChange: true});
        this.creatingOrUpdating = false;
        this.appointmentService.resetFormInformation();
      },
      error: (error) => {
        this.creatingOrUpdating = false;
      },
    });*/
  }

  createMultiAppointmenta(payload: Appointment[]): void {
    this.appointmentService.createAppointment(payload).subscribe({
      next: (e) => {
        this.store.dispatch(AppointmentActions.addToList({appointment: e}));
        this.router.navigate([this.backRoute], {skipLocationChange: true});
        this.creatingOrUpdating = false;
        this.appointmentService.resetFormInformation();
      },
      error: (error) => {
        this.creatingOrUpdating = false;
      },
    });
  }

  onSubmitMultiAppointments(event : Event): void {
    event.preventDefault();
    console.log(this.formMultiAppointments)
    console.log(this.multiAppointmentsService.transformMultiAppointmentsToAppointments(this.formMultiAppointments.value))
    /*let payload = {...this.appointment, ...this.formAppointment.value};
    payload.totalCargos = this.denominacionesEmpleosFormArray.value.reduce((acc, e) => e.totalCargos + acc, 0) ?? 0;
    delete payload.hierarchyTreeNode;

    
    console.log(payload)
    if (this.formAppointment.invalid) {
      this.formAppointment.markAllAsTouched();
    } else {
      this.creatingOrUpdating = true;
      this.updateMode ? this.updateAppointment(payload, this.appointment.id) : this.createAppointment(payload);
    }*/
  }

  onDeleteMultiAppointments(event : Event): void {
    event.preventDefault();
    /*this.deleting = true;
    this.appointmentService.deleteAppointment(this.appointment.id).subscribe({
      next: () => {
        this.store.dispatch(AppointmentActions.removeFromList({id: this.appointment.id}));
        this.router.navigate([this.backRoute], {skipLocationChange: true});
        this.deleting = false;
        this.appointmentService.resetFormInformation();
      },
      error: (error) => {
        this.deleting = false;
      },
    });*/
  }

  onCancelMultiAppointments(event : Event): void {
    event.preventDefault();
    this.router.navigate([this.backRoute], {skipLocationChange: true});
    this.multiAppointmentsService.resetFormInformation();
  }

  changeValidity(data: any){
    this.multiAppointmentsService.setValidityToMultiAppointments(data.value);
    this.validityOptionsOverlayPanel.hide();
  }

  removeValidity(){
    this.multiAppointmentsService.setValidityToMultiAppointments(null);
  }

  openNewValidity() {
    //Reestablecemos a valores iniciales cuando vayamos a crear una vigencia
    this.validityService.setMustRechargeValidityFormGroup(true);
    const backRoute = this.multiAppointments ? `${'/configurations/appointments/'+ this.cryptoService.encryptParam(this.appointmentIdOfGroup)}` : '/configurations/appointments/create';
    this.router.navigate(['/configurations/validities/create'], { skipLocationChange: true, queryParams: {backRoute: backRoute}});
  }

  onGoToUpdateValidity (id : any, event: Event): void{
    event.preventDefault();
    event.stopPropagation();
    //Reestablecemos a valores iniciales cuando vayamos a editar una vigencia
    this.validityService.setMustRechargeValidityFormGroup(true);
    const backRoute = this.multiAppointments ? `${'/configurations/appointments/'+ this.cryptoService.encryptParam(this.appointmentIdOfGroup)}` : '/configurations/appointments/create';
    this.router.navigate(["/configurations/validities", this.cryptoService.encryptParam(id)], {skipLocationChange: true, queryParams: {backRoute: backRoute}})
  }

  changeNormativity(data: any){
    this.multiAppointmentsService.setNormativityToMultiAppointments(data.value);
    this.normativityOptionsOverlayPanel.hide();
  }

  removeNormativity(){
    this.multiAppointmentsService.setNormativityToMultiAppointments(null);
  }

  openNewNormativity() {
    const backRoute = this.multiAppointments ? `${'/configurations/appointments/'+ this.cryptoService.encryptParam(this.appointmentIdOfGroup)}` : '/configurations/appointments/create';
    this.router.navigate(['/configurations/normativities/create'], { skipLocationChange: true, queryParams: {backRoute: backRoute, showScopes: true}});
  }

  onGoToUpdateNormativity (id : any, event: Event): void{
    event.preventDefault();
    event.stopPropagation();
    const backRoute = this.multiAppointments ? `${'/configurations/appointments/'+ this.cryptoService.encryptParam(this.appointmentIdOfGroup)}` : '/configurations/appointments/create';
    this.router.navigate(["/configurations/normativities", this.cryptoService.encryptParam(id)], {skipLocationChange: true, queryParams: {backRoute: backRoute, showScopes: true}})
  }

  showDetailOfNormativity(elementRef: HTMLDivElement, event: Event) {
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

  onDeleteNormativity(normativity: Normativity, event: Event): void{
    event.preventDefault();
    event.stopPropagation();
    this.confirmationDialogService.showDeleteConfirmationDialog(
      () => {
        this.normativityService.deleteNormativity(normativity.id).subscribe({
          next: () => {
            this.multiAppointmentsService.removeNormativityInMultiAppointments(normativity.id);
            this.normativityOptions = this.normativityOptions.filter(e => e.value?.id != normativity.id)
          },
        });
      },
      `¿Está seguro de eliminar la normatividad <strong>${normativity?.nombre}</strong>?`
    )
  }

  parseStringToBoolean(str: string): boolean{
    return Methods.parseStringToBoolean(str);
  }

  changeOrganizationChart(data: any){
    this.multiAppointmentsService.setOrganizationChartToMultiAppointments(data.value);
    this.validityOptionsOverlayPanel.hide();
    this.organizationChartOptionsOverlayPanel.hide();
  }

  changeJobTitle(data: any, indexOfSalaryScaleGroup: number, overlayPanel: OverlayPanel){
    this.multiAppointmentsService.setNewJobTitle(data.value, indexOfSalaryScaleGroup);
    overlayPanel.hide();
  }

  removeJobTitle(indexOfJobTitle: number, indexOfSalaryScaleGroup: number){
    this.multiAppointmentsService.removeJobTitle(indexOfJobTitle, indexOfSalaryScaleGroup);
  }

  removeJobTitleToMultiAppointments(indexOfJobTitle: number, indexOfSalaryScaleGroup: number, indexOfLevelGroup){
    this.multiAppointmentsService.removeJobTitleToMultiAppointments(indexOfJobTitle, indexOfSalaryScaleGroup, indexOfLevelGroup);
  }

  removeSalaryScaleGroupToMultiAppointments(indexOfSalaryScaleGroup: number, indexOfLevelGroup){
    this.multiAppointmentsService.removeSalaryScaleGroupToMultiAppointments(indexOfSalaryScaleGroup, indexOfLevelGroup);
  }

  removeSalaryScaleGroup(indexOfSalaryScaleGroup: number){
    this.multiAppointmentsService.removeSalaryScaleGroup(indexOfSalaryScaleGroup);
  }

  showDetailOfOrganizationChartNormativity(elementRef: HTMLDivElement, event: Event) {
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

  private builtNodes(hierarchies: Hierarchy[], nodes: TreeNode<Hierarchy>[]) {
    if (!hierarchies) return;
    for (let hierarchy of hierarchies) {
      let node: TreeNode<Hierarchy> = {
        data: hierarchy,
        label: hierarchy.dependencia.nombre,
        children: [],
        key: hierarchy.id.toString(),
        expanded: true
      };
      if (hierarchy.subJerarquias?.length) {
        this.builtNodes(hierarchy.subJerarquias, node.children)
      }
      nodes.push(node);
    }
  }
}
