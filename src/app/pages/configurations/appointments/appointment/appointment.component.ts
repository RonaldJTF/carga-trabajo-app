import { Location } from '@angular/common';
import * as AppointmentActions from "@store/appointment.actions";
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MESSAGE } from '@labels/labels';
import { Appointment, Hierarchy, JobTitle, Level, Normativity, OrganizationChart, SalaryScale} from '@models';
import { Store } from '@ngrx/store';
import { AppointmentService, AuthenticationService, BasicTablesService, ConfirmationDialogService, CryptojsService, LevelService, NormativityService, OrganizationChartService, UrlService, ValidityService } from '@services';
import { IMAGE_SIZE, Methods } from '@utils';
import { MenuItem, SelectItem, TreeNode } from 'primeng/api';
import { OverlayPanel } from 'primeng/overlaypanel';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducers';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.scss']
})
export class AppointmentComponent implements OnInit, OnDestroy {
  IMAGE_SIZE = IMAGE_SIZE;
  MESSAGE = MESSAGE;
  ROUTE_TO_BACK: string = '/configurations/appointments';

  @ViewChild('validityOptionsOverlayPanel') validityOptionsOverlayPanel: OverlayPanel;
  @ViewChild('normativityOptionsOverlayPanel') normativityOptionsOverlayPanel: OverlayPanel;
  @ViewChild('organizationChartOptionsOverlayPanel') organizationChartOptionsOverlayPanel: OverlayPanel;
  @ViewChild('jobTitleOptionsOverlayPanel') jobTitleOptionsOverlayPanel: OverlayPanel;

  isAdmin: boolean;
  formAppointment !: FormGroup;
  appointment: Appointment;
  updateMode: boolean;
  creatingOrUpdating: boolean = false;
  deleting: boolean = false;
  loadingAppointment: boolean = false;
  loadingSalaryScales: boolean = false;
  loadingHierarchies: boolean = false;

  mustRechargeAppointmentFormGroup: boolean;
  mustRechargeAppointmentFormGroupSubscription: Subscription;
  appointmentSubscription: Subscription;
  levelSubscription: Subscription;
  hierarchySubscription: Subscription;
  organizationChartSubscription: Subscription;

  levels: Level[] = [];
  salaryScales: SalaryScale[] = [];
  normativities: Normativity[] = [];

  backRoute: string;

  jobTitles: JobTitle[] = [];
  jobTitleOptions: JobTitle[] = [];
  organizationChartOptions: SelectItem[] = [];
  validityOptions: SelectItem[] = [];
  normativityOptions: SelectItem[] = [];
  hierarchyOptions: TreeNode<Hierarchy>[] = [];
  menuItemsOfValidity: MenuItem[] = [];

  constructor(
    private store: Store<AppState>,
    private confirmationDialogService: ConfirmationDialogService,
    private normativityService: NormativityService,
    private levelService: LevelService,
    private validityService: ValidityService,
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

    this.mustRechargeAppointmentFormGroupSubscription = this.appointmentService.mustRechargeAppointmentFormGroup$.subscribe(e => this.mustRechargeAppointmentFormGroup = e);
    this.appointmentSubscription = this.appointmentService.appointment$.subscribe(e => this.appointment = e)

    if (this.mustRechargeAppointmentFormGroup){
      this.appointmentService.createAppointmentFormGroup();
    }

    this.hierarchySubscription = this.appointmentService.getAppointmentFormGroup().get('hierarchyTreeNode').valueChanges.subscribe((value: TreeNode<Hierarchy>) => {
      this.appointmentService.setHierarchyToAppointment(value);
    });
    this.levelSubscription = this.appointmentService.getAppointmentFormGroup().get('idNivel').valueChanges.subscribe((value: number) => {
      this.loadSalaryScale(value);
    });

    this.organizationChartSubscription = this.appointmentService.getAppointmentFormGroup().get('idOrganigrama').valueChanges.subscribe(
      (value: number) => {
        if(value){
          this.loadHierarchies(value);
          this.hierarchyTreeNodeAbstractControl?.setValue(null);
          this.idJerarquiaAbstractControl?.markAsUntouched();
        }
      }
    );

    const initialOrganizationChartId: number | null = this.appointmentService.getAppointmentFormGroup().get('idOrganigrama')?.value;
    if (initialOrganizationChartId) {
      this.loadHierarchies(initialOrganizationChartId);
      this.hierarchyTreeNodeAbstractControl?.setValue(null);
      this.idJerarquiaAbstractControl?.markAsUntouched();
    }

    const appointmentId = this.cryptoService.decryptParamAsNumber(this.route.snapshot.params['id']);
    this.loadAppointmentInformation(appointmentId);
    this.loadOrganizacionCharts();
    this.loadValidities(appointmentId);
    this.initMenus();
    this.loadLevels();
    this.loadNormativities();
    this.loadJobTitles();
  }

  ngOnDestroy(): void {
    this.mustRechargeAppointmentFormGroupSubscription?.unsubscribe();
    this.appointmentSubscription?.unsubscribe();
    this.levelSubscription?.unsubscribe();
    this.hierarchySubscription?.unsubscribe();
    this.organizationChartSubscription?.unsubscribe();
  }

  initMenus(){}

  get denominacionesEmpleosFormArray(): FormArray{
    return this.formAppointment?.get('denominacionesEmpleos') as FormArray;
  }

  get hierarchyTreeNodeAbstractControl(): AbstractControl{
    return this.formAppointment?.get('hierarchyTreeNode');
  }

  get idJerarquiaAbstractControl(): AbstractControl{
    return this.formAppointment?.get('idJerarquia');
  }

  loadAppointmentInformation(id: number){
    if (id == undefined){
      this.updateMode = false;
      this.formAppointment = this.appointmentService.getAppointmentFormGroup();
      this.appointmentService.setMustRechargeAppointmentFormGroup(false);
      if(this.formAppointment.get('idNivel').value){
        this.loadSalaryScale(this.formAppointment.get('idNivel').value);
      }
    }else{
      this.updateMode = true;
      if (this.mustRechargeAppointmentFormGroup){
        this.loadingAppointment = true;
        this.appointmentService.getAppointment(id).subscribe({
          next: (e) => {
            this.formAppointment = this.appointmentService.initializeAppointmentFormGroup(e);
            this.appointmentService.setMustRechargeAppointmentFormGroup(false);
            this.loadingAppointment = false;
          },
        });
      }else{
        this.formAppointment = this.appointmentService.getAppointmentFormGroup();
        if(this.formAppointment.get('idNivel').value){
          this.loadSalaryScale(this.formAppointment.get('idNivel').value);
        }
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
        this.loadingHierarchies = false;this.loadingHierarchies = false;
      },
      error: (e) => this.loadingHierarchies = false
    });
  }

  loadValidities(appointmentId: number): void {
    this.validityService.getValidities().subscribe({
      next: (e) => {
        this.validityOptions = e?.map( o => ({value: o, label: o.nombre}));
        const activeValidity = e?.find(o => Methods.parseStringToBoolean(o.estado));
        if(!appointmentId && activeValidity){
          this.appointmentService.setValidityToAppointment(activeValidity);
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
        this.jobTitles = e;
        this.updateJobTitleOptions();
      }
    });
  }

  updateAppointment(payload: Appointment, id: number): void {
    this.appointmentService.updateAppointment(id, payload).subscribe({
      next: (e) => {
        this.store.dispatch(AppointmentActions.updateFromList({appointment: e}));
        this.router.navigate([this.backRoute], {skipLocationChange: true});
        this.creatingOrUpdating = false;
        this.appointmentService.resetFormInformation();
      },
      error: (error) => {
        this.creatingOrUpdating = false;
      },
    });
  }

  createAppointment(payload: Appointment): void {
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

  onSubmitAppointment(event : Event): void {
    event.preventDefault();
    let payload = {...this.appointment, ...this.formAppointment.value};
    payload.totalCargos = this.denominacionesEmpleosFormArray.value.reduce((acc, e) => e.totalCargos + acc, 0) ?? 0;
    delete payload.hierarchyTreeNode;
    if (this.formAppointment.invalid) {
      this.formAppointment.markAllAsTouched();
    } else {
      this.creatingOrUpdating = true;
      this.updateMode ? this.updateAppointment(payload, this.appointment.id) : this.createAppointment(payload);
    }
  }

  onDeleteAppointment(event : Event): void {
    event.preventDefault();
    this.deleting = true;
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
    });
  }

  onCancelAppointment(event : Event): void {
    event.preventDefault();
    this.router.navigate([this.backRoute], {skipLocationChange: true});
    this.appointmentService.resetFormInformation();
  }

  changeValidity(data: any){
    this.appointmentService.setValidityToAppointment(data.value);
    this.validityOptionsOverlayPanel.hide();
  }

  removeValidity(){
    this.appointmentService.setValidityToAppointment(null);
  }

  openNewValidity() {
    //Reestablecemos a valores iniciales cuando vayamos a crear una vigencia
    this.validityService.setMustRechargeValidityFormGroup(true);
    const backRoute = this.appointment ? `${'/configurations/appointments/'+ this.cryptoService.encryptParam(this.appointment.id)}` : '/configurations/appointments/create';
    this.router.navigate(['/configurations/validities/create'], { skipLocationChange: true, queryParams: {backRoute: backRoute}});
  }

  onGoToUpdateValidity (id : any, event: Event): void{
    event.preventDefault();
    event.stopPropagation();
    //Reestablecemos a valores iniciales cuando vayamos a editar una vigencia
    this.validityService.setMustRechargeValidityFormGroup(true);
    const backRoute = this.appointment ? `${'/configurations/appointments/'+ this.cryptoService.encryptParam(this.appointment.id)}` : '/configurations/appointments/create';
    this.router.navigate(["/configurations/validities", this.cryptoService.encryptParam(id)], {skipLocationChange: true, queryParams: {backRoute: backRoute}})
  }

  changeNormativity(data: any){
    this.appointmentService.setNormativityToAppointment(data.value);
    this.normativityOptionsOverlayPanel.hide();
  }

  removeNormativity(){
    this.appointmentService.setNormativityToAppointment(null);
  }

  openNewNormativity() {
    const backRoute = this.appointment ? `${'/configurations/appointments/'+ this.cryptoService.encryptParam(this.appointment.id)}` : '/configurations/appointments/create';
    this.router.navigate(['/configurations/normativities/create'], { skipLocationChange: true, queryParams: {backRoute: backRoute, showScopes: true}});
  }

  onGoToUpdateNormativity (id : any, event: Event): void{
    event.preventDefault();
    event.stopPropagation();
    const backRoute = this.appointment ? `${'/configurations/appointments/'+ this.cryptoService.encryptParam(this.appointment.id)}` : '/configurations/appointments/create';
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
            this.appointmentService.removeNormativityInAppointment(normativity.id);
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
    this.appointmentService.setOrganizationChartToAppointment(data.value);
    this.organizationChartOptionsOverlayPanel.hide();
  }

  changeJobTitle(data: any){
    this.appointmentService.submiJobTitle(data.value);
    this.jobTitleOptionsOverlayPanel.hide();
    this.updateJobTitleOptions();
  }

  private updateJobTitleOptions(){
    const jobTitleIds: number[] = this.denominacionesEmpleosFormArray?.value?.map(e => e.id) ?? [];
    this.jobTitleOptions = this.jobTitles?.map( e =>  { return {...e, disabled: jobTitleIds.includes(e.id)}} )
  }

  removeJobTitle(index: number){
    this.appointmentService.removeJobTitle(index);
    this.updateJobTitleOptions();
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
