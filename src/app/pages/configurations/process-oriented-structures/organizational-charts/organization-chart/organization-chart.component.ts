import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import * as OrganizationChartActions from "@store/organizationChart.actions";
import {FormBuilder, FormGroup} from "@angular/forms";
import {AuthenticationService, ConfirmationDialogService, CryptojsService, NormativityService, OrganizationChartService, UrlService} from "@services";
import {Normativity, OrganizationChart} from "@models";
import {IMAGE_SIZE, Methods} from "@utils";
import {MESSAGE} from "@labels/labels";
import {OverlayPanel} from "primeng/overlaypanel";
import {SelectItem} from "primeng/api";
import {ActivatedRoute, Router} from "@angular/router";
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducers';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';

@Component({
  selector: 'app-organization-chart',
  templateUrl: './organization-chart.component.html',
  styleUrls: ['./organization-chart.component.scss']
})
export class OrganizationChartComponent implements OnInit, OnDestroy {
  IMAGE_SIZE = IMAGE_SIZE;
  MESSAGE = MESSAGE;
  ROUTE_TO_BACK: string = '/configurations/process-oriented-structures/organizational-charts';

  @ViewChild('normativityOptionsOverlayPanel') normativityOptionsOverlayPanel: OverlayPanel;

  isAdmin: boolean;
  formOrganizationChart !: FormGroup;
  organizationChart: OrganizationChart;
  updateMode: boolean;
  creatingOrUpdating: boolean = false;
  deleting: boolean = false;
  loadingOrganizationChart: boolean = false;

  mustRechargeOrganizationChartFormGroup: boolean;
  mustRechargeOrganizationChartFormGroupSubscription: Subscription;
  organizationChartSubscription: Subscription;

  normativities: Normativity[] = [];

  backRoute: string;

  organizationChartOptions: SelectItem[] = [];
  normativityOptions: SelectItem[] = [];

  constructor(
    private store: Store<AppState>,
    private confirmationDialogService: ConfirmationDialogService,
    private normativityService: NormativityService,
    private organizationChartService: OrganizationChartService,
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

    this.mustRechargeOrganizationChartFormGroupSubscription = this.organizationChartService.mustRechargeOrganizationChartFormGroup$.subscribe(e => this.mustRechargeOrganizationChartFormGroup = e);
    this.organizationChartSubscription = this.organizationChartService.organizationChart$.subscribe(e => this.organizationChart = e)

    if (this.mustRechargeOrganizationChartFormGroup){
      this.organizationChartService.createOrganizationChartFormGroup();
    }

    const organizationChartId = this.cryptoService.decryptParamAsNumber(this.route.snapshot.params['id']);
    this.loadOrganizationChartInformation(organizationChartId);
    this.initMenus();
    this.loadNormativities();
  }

  ngOnDestroy(): void {
    this.mustRechargeOrganizationChartFormGroupSubscription?.unsubscribe();
    this.organizationChartSubscription?.unsubscribe();
  }

  initMenus(){}

  loadOrganizationChartInformation(id: number){
    if (id == undefined){
      this.updateMode = false;
      this.formOrganizationChart = this.organizationChartService.getOrganizationChartFormGroup();
      this.organizationChartService.setMustRechargeOrganizationChartFormGroup(false);
    }else{
      this.updateMode = true;
      if (this.mustRechargeOrganizationChartFormGroup){
        this.loadingOrganizationChart = true;
        this.organizationChartService.getOrganizationChart(id).subscribe({
          next: (e) => {
            this.formOrganizationChart = this.organizationChartService.initializeOrganizationChartFormGroup(e);
            this.organizationChartService.setMustRechargeOrganizationChartFormGroup(false);
            this.loadingOrganizationChart = false;
          },
        });
      }else{
        this.formOrganizationChart = this.organizationChartService.getOrganizationChartFormGroup();
      }
    }
  }

  loadNormativities(): void {
    this.normativityService.getGeneralNormativities('1').subscribe({
      next: (e) => {
        this.normativityOptions = e?.map( o => ({value: o, label: o.nombre}));
      }
    });
  }

  updateOrganizationChart(payload: OrganizationChart, id: number): void {
    this.organizationChartService.updateOrganizationChart(id, payload).subscribe({
      next: (e) => {
        this.store.dispatch(OrganizationChartActions.updateFromList({organizationChart: e}));
        this.router.navigate([this.backRoute], {skipLocationChange: true});
        this.creatingOrUpdating = false;
        this.organizationChartService.resetFormInformation();
      },
      error: (error) => {
        this.creatingOrUpdating = false;
      },
    });
  }

  createOrganizationChart(payload: OrganizationChart): void {
    this.organizationChartService.createOrganizationChart(payload).subscribe({
      next: (e) => {
        this.store.dispatch(OrganizationChartActions.addToList({organizationChart: e}));
        this.router.navigate([this.backRoute], {skipLocationChange: true});
        this.creatingOrUpdating = false;
        this.organizationChartService.resetFormInformation();
      },
      error: (error) => {
        this.creatingOrUpdating = false;
      },
    });
  }

  onSubmitOrganizationChart(event : Event): void {
    event.preventDefault();
    let payload = {...this.organizationChart, ...this.formOrganizationChart.value};
    delete payload.hierarchyTree;
    if (this.formOrganizationChart.invalid) {
      this.formOrganizationChart.markAllAsTouched();
    } else {
      this.creatingOrUpdating = true;
      this.updateMode ? this.updateOrganizationChart(payload, this.organizationChart.id) : this.createOrganizationChart(payload);
    }
  }

  onDeleteOrganizationChart(event : Event): void {
    event.preventDefault();
    this.deleting = true;
    this.organizationChartService.deleteOrganizationChart(this.organizationChart.id).subscribe({
      next: () => {
        this.store.dispatch(OrganizationChartActions.removeFromList({id: this.organizationChart.id}));
        this.router.navigate([this.backRoute], {skipLocationChange: true});
        this.deleting = false;
        this.organizationChartService.resetFormInformation();
      },
      error: (error) => {
        this.deleting = false;
      },
    });
  }

  onCancelOrganizationChart(event : Event): void {
    event.preventDefault();
    this.router.navigate([this.backRoute], {skipLocationChange: true});
    this.organizationChartService.resetFormInformation();
  }

  changeNormativity(data: any){
    this.organizationChartService.setNormativityToOrganizationChart(data.value);
    this.normativityOptionsOverlayPanel.hide();
  }

  removeNormativity(){
    this.organizationChartService.setNormativityToOrganizationChart(null);
  }

  openNewNormativity() {
    const backRoute = this.organizationChart 
      ? `${'/configurations/process-oriented-structures/organizational-charts/'+ this.cryptoService.encryptParam(this.organizationChart.id)}` 
      : '/configurations/process-oriented-structures/organizational-charts/create';
    this.router.navigate(['/configurations/normativities/create'], { skipLocationChange: true, queryParams: {backRoute: backRoute}});
  }

  onGoToUpdateNormativity (id : any, event: Event): void{
    event.preventDefault();
    event.stopPropagation();
    const backRoute = this.organizationChart 
      ? `${'/configurations/process-oriented-structures/organizational-charts/'+ this.cryptoService.encryptParam(this.organizationChart.id)}` 
      : '/configurations/process-oriented-structures/organizational-charts/create';
    this.router.navigate(["/configurations/normativities", this.cryptoService.encryptParam(id)], {skipLocationChange: true, queryParams: {backRoute: backRoute}})
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

  parseStringToBoolean(str: string): boolean{
    return Methods.parseStringToBoolean(str);
  }
}
