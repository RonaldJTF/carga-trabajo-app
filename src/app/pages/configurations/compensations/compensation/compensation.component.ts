import { Location } from '@angular/common';
import * as CompensationActions from "@store/compensation.actions";
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MESSAGE } from '@labels/labels';
import { Category, Compensation, Periodicity } from '@models';
import { Store } from '@ngrx/store';
import { AuthenticationService, CompensationCategoryService, CompensationService, ConfirmationDialogService, CryptojsService, LevelCompensationService, LevelService, NormativityService, PeriodicityService, UrlService } from '@services';
import { IMAGE_SIZE, Methods, Url } from '@utils';
import { SelectItem } from 'primeng/api';
import { OverlayPanel } from 'primeng/overlaypanel';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducers';

@Component({
  selector: 'app-compensation',
  templateUrl: './compensation.component.html',
  styleUrls: ['./compensation.component.scss']
})
export class CompensationComponent implements OnInit, OnDestroy {
  IMAGE_SIZE = IMAGE_SIZE;
  MESSAGE = MESSAGE;
  ROUTE_TO_BACK: string = '/configurations/compensations';

  @ViewChild('categoryOptionsOverlayPanel') categoryOptionsOverlayPanel: OverlayPanel;

  isAdmin: boolean;
  formCompensation !: FormGroup;
  compensation: Compensation;
  updateMode: boolean;
  creatingOrUpdating: boolean = false;
  deleting: boolean = false;
  loadingCompensation: boolean = false;

  mustRechargeCompensationFormGroup: boolean;
  mustRechargeCompensationFormGroupSubscription: Subscription;
  mustCloseFormSubscription: Subscription;
  compensationSubscription: Subscription;

  categories: Category[] = [];
  periodicities: Periodicity[] = [];

  backRoute: string;

  categoryOptions: SelectItem[] = [];

  constructor(
    private store: Store<AppState>,
    private confirmationDialogService: ConfirmationDialogService,
    private periodicityService: PeriodicityService,
    private compensationCategoryService: CompensationCategoryService,
    private compensationService: CompensationService,
    private levelCompensationService: LevelCompensationService,
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

    this.mustRechargeCompensationFormGroupSubscription = this.compensationService.mustRechargeCompensationFormGroup$.subscribe(e => this.mustRechargeCompensationFormGroup = e);
    this.compensationSubscription = this.compensationService.compensation$.subscribe(e => this.compensation = e);
    this.mustCloseFormSubscription = this.compensationService.mustCloseForm$.subscribe(e => {
      if(e){
        this.compensationService.resetFormInformation();
        this.goBack();
      }
    });
    if (this.mustRechargeCompensationFormGroup){
      this.compensationService.createCompensationFormGroup();
    }

    const compensationId = this.cryptoService.decryptParamAsNumber(this.route.snapshot.params['id']);
    this.loadCompensationInformation(compensationId);
    this.initMenus();
    this.loadCategories();
    this.loadPeriodicities();
  }

  ngOnDestroy(): void {
    this.mustRechargeCompensationFormGroupSubscription?.unsubscribe();
    this.compensationSubscription?.unsubscribe();
    this.mustCloseFormSubscription?.unsubscribe();
  }

  initMenus(){}
  
  loadCompensationInformation(id: any){
    if (id == undefined){
      this.updateMode = false;
      this.formCompensation = this.compensationService.getCompensationFormGroup();
      this.compensationService.setMustRechargeCompensationFormGroup(false);
    }else{
      this.updateMode = true;
      if (this.mustRechargeCompensationFormGroup){
        this.loadingCompensation = true;
        this.compensationService.getCompensation(id).subscribe({
          next: (e) => {
            this.formCompensation = this.compensationService.initializeCompensationFormGroup(e);
            this.compensationService.setMustRechargeCompensationFormGroup(false);
            this.loadingCompensation = false;
          },
        });
      }else{
        this.formCompensation = this.compensationService.getCompensationFormGroup();
      }
    }
  }

  loadCategories(): void {
    this.compensationCategoryService.getCategories().subscribe({
      next: (e) => {
        this.categoryOptions = e?.map( o => ({value: o, label: o.nombre}));
      }
    });
  }

  loadPeriodicities(): void {
    this.periodicityService.getPeriodicities().subscribe({
      next: (e) => {
        this.periodicities = e;
      }
    });
  }

  updateCompensation(payload: Compensation, id: number): void {
    this.compensationService.updateCompensation(id, payload).subscribe({
      next: (e) => {
        this.store.dispatch(CompensationActions.updateFromList({compensation: e}));
        this.creatingOrUpdating = false;
        this.compensationService.resetFormInformation();
        this.goBack();
        //Actualizamos del formulario de relación de compensación laboral de niveles en una vigencia la nueva información de la compensación
        this.levelCompensationService.updateCompensationInLevelCompensation(e);
      },
      error: (error) => {
        this.creatingOrUpdating = false;
      },
    });
  }

  createCompensation(payload: Compensation): void {
    this.compensationService.createCompensation(payload).subscribe({
      next: (e) => {
        this.store.dispatch(CompensationActions.updateFromList({compensation: e}));
        this.creatingOrUpdating = false;
        this.compensationService.resetFormInformation();
        this.goBack();
      },
      error: (error) => {
        this.creatingOrUpdating = false;
      },
    });
  }

  onSubmitCompensation(event : Event): void {
    event.preventDefault();
    let payload = {...this.compensation, ...this.formCompensation.value};
    payload.estado = Methods.parseBooleanToString(payload.estado);
    if (this.formCompensation.invalid) {
      this.formCompensation.markAllAsTouched();
    } else {
      this.creatingOrUpdating = true;
      this.updateMode ? this.updateCompensation(payload, this.compensation.id) : this.createCompensation(payload);
    }
  }

  onDeleteCompensation(event : Event): void {
    event.preventDefault();
    const compensationId = this.compensation.id;
    this.deleting = true;
    this.compensationService.deleteCompensation(compensationId).subscribe({
      next: () => {
        this.store.dispatch(CompensationActions.removeFromList({id: compensationId}));
        this.deleting = false;
        this.compensationService.resetFormInformation();
        this.goBack();
        //Removemos del formulario de relación de compensación laboral de niveles en una vigencia la variable si es la que se aplica
        this.levelCompensationService.removeCompensationInLevelCompensation(compensationId);
      },
      error: (error) => {
        this.deleting = false;
      },
    });
  }

  onCancelCompensation(event : Event): void {
    event.preventDefault();
    this.compensationService.resetFormInformation();
    this.goBack();
  }

  changeCategory(data: any){
    this.compensationService.setCategoryToCompensation(data.value);
    this.categoryOptionsOverlayPanel.hide();
  }

  removeCategory(){
    this.compensationService.setCategoryToCompensation(null);
  }

  openNewCategory() {
    const backRoute = this.compensation ? `${'/configurations/compensations/'+ this.cryptoService.encryptParam(this.compensation.id)}` : '/configurations/compensations/create';
    this.router.navigate(['/configurations/compensation-categories/create'], { skipLocationChange: true, queryParams: {backRoute: backRoute}});
  }

  onGoToUpdateCategory (id : any, event: Event): void{
    event.preventDefault();
    event.stopPropagation();
    const backRoute = this.compensation ? `${'/configurations/compensations/'+ this.cryptoService.encryptParam(this.compensation.id)}` : '/configurations/compensations/create';
    this.router.navigate(["/configurations/compensation-categories", this.cryptoService.encryptParam(id)], {skipLocationChange: true, queryParams: {backRoute: backRoute}})
  }

  onDeleteCategory(category: Category, event: Event): void{
    event.preventDefault();
    event.stopPropagation();
    this.confirmationDialogService.showDeleteConfirmationDialog(
      () => {
        this.compensationCategoryService.deleteCategory(category.id).subscribe({
          next: () => {
            this.compensationService.removeCategoryInCompensation(category.id);
            this.categoryOptions = this.categoryOptions.filter(e => e.value?.id != category.id);
          },
        });
      },
      `
      ¿Está seguro de eliminar la categoría <strong>${category?.nombre}</strong>?
      <div class="bg-yellow-50 text-yellow-500 border-round-xl p-4 text-justify mt-2">
        <span>
            <strong>Advertencia:</strong> 
            Eliminar la categoría implica eliminar todas las compensaciones laborales asociadas con ella.
            Por favor, asegúrese de que comprende el impacto de esta acción antes de proceder.
        </span>
      </div>
      `
    )
  }
  
  parseStringToBoolean(str: string): boolean{
    return Methods.parseStringToBoolean(str);
  }

  private goBack(){
    let obj = Url.extractPathAndParams(this.backRoute);
    this.router.navigate([obj.path], {skipLocationChange: true, queryParams: obj.queryParams});
  }
}