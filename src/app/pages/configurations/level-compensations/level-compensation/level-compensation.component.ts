import { Location } from '@angular/common';
import * as LevelCompensationActions from "@store/levelCompensation.actions";
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MESSAGE } from '@labels/labels';
import { Compensation, LevelCompensation, Rule, SalaryScale, Validity, Variable} from '@models';
import { Store } from '@ngrx/store';
import { AuthenticationService, CompensationService, LevelCompensationService, ConfirmationDialogService, CryptojsService, PeriodicityService, UrlService, ValidityService, LevelService, RuleService } from '@services';
import { IMAGE_SIZE, Methods } from '@utils';
import { SelectItem, SelectItemGroup } from 'primeng/api';
import { OverlayPanel } from 'primeng/overlaypanel';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducers';
import { VariableService } from 'src/app/services/variable.service';

@Component({
  selector: 'app-level-compensation',
  templateUrl: './level-compensation.component.html',
  styleUrls: ['./level-compensation.component.scss']
})
export class LevelCompensationComponent implements OnInit, OnDestroy {
  IMAGE_SIZE = IMAGE_SIZE;
  MESSAGE = MESSAGE;
  ROUTE_TO_BACK: string = '/configurations/level-compensations';

  @ViewChild('validityOptionsOverlayPanel') validityOptionsOverlayPanel: OverlayPanel;
  @ViewChild('compensationOptionsOverlayPanel') compensationOptionsOverlayPanel: OverlayPanel;
  @ViewChild('ruleOptionsOverlayPanel') ruleOptionsOverlayPanel: OverlayPanel;
  @ViewChild('variableOptionsOverlayPanel') variableOptionsOverlayPanel: OverlayPanel;

  isAdmin: boolean;
  updateMode: boolean;
  creatingOrUpdating: boolean = false;
  deleting: boolean = false;
  loadingLevelCompensation: boolean = false;
  loadingSalaryScales: boolean = false;

  formLevelCompensation !: FormGroup;
  levelCompensation: LevelCompensation;
  mustRechargeLevelCompensationFormGroup: boolean;

  mustRechargeLevelCompensationFormGroupSubscription: Subscription;
  levelCompensationSubscription: Subscription;

  backRoute: string;
  validityOptions: SelectItem[] = [];
  compensationOptions: SelectItemGroup[] = [];
  ruleOptions: SelectItem[] = [];
  variableOptions: SelectItem[] = [];

  salaryScales: SalaryScale[] = [];

  //idLevel: number; 

  constructor(
    private store: Store<AppState>,
    private confirmationDialogService: ConfirmationDialogService,
    private periodicityService: PeriodicityService,
    private levelCompensationService: LevelCompensationService,
    private compensationService: CompensationService,
    private validityService: ValidityService,
    private levelService: LevelService,
    private ruleService: RuleService,
    private variableService: VariableService,
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

    this.mustRechargeLevelCompensationFormGroupSubscription = this.levelCompensationService.mustRechargeLevelCompensationFormGroup$.subscribe(e => this.mustRechargeLevelCompensationFormGroup = e);
    this.levelCompensationSubscription = this.levelCompensationService.levelCompensation$.subscribe(e => this.levelCompensation = e);

    if (this.mustRechargeLevelCompensationFormGroup){
      const idLevel = this.cryptoService.decryptParamAsNumber(this.route.snapshot.queryParams['idLevel']); //Indispensable para los nuevas relaciones
      this.levelCompensationService.createLevelCompensationFormGroup(idLevel);
    }

    const idLevelCompensation = this.cryptoService.decryptParamAsNumber(this.route.snapshot.params['id']);
    this.loadSalaryScale(this.levelId);
    this.loadLevelCompensationInformation(idLevelCompensation);
    this.initMenus();
    this.loadValidities(idLevelCompensation);
    this.loadCompensations();
    this.loadRules();
    this.loadVariables();
  }

  ngOnDestroy(): void {
    this.mustRechargeLevelCompensationFormGroupSubscription?.unsubscribe();
    this.levelCompensationSubscription?.unsubscribe();
  }

  get levelId(): number{
    this.formLevelCompensation = this.levelCompensationService.getLevelCompensationFormGroup();
    return this.formLevelCompensation.get('idNivel')?.value;
  }

  initMenus(){}
  
  loadLevelCompensationInformation(id: any){
    if (id == undefined){
      this.updateMode = false;
      this.formLevelCompensation = this.levelCompensationService.getLevelCompensationFormGroup();
      this.levelCompensationService.setMustRechargeLevelCompensationFormGroup(false);
    }else{
      this.updateMode = true;
      if (this.mustRechargeLevelCompensationFormGroup){
        this.loadingLevelCompensation = true;
        this.levelCompensationService.getLevelCompensation(id).subscribe({
          next: (e:LevelCompensation) => {
            this.formLevelCompensation = this.levelCompensationService.initializeLevelCompensationFormGroup(e);
            this.levelCompensationService.setMustRechargeLevelCompensationFormGroup(false);
            this.loadingLevelCompensation = false;
            this.extendValidityOptions([e.vigencia ?? []].flat())
            this.extendSalaryScaleOptions([e.escalaSalarial ?? []].flat());
            this.extendRuleOptions([e.regla ?? []].flat());
            this.extendVariableOptions([e.variable ?? []].flat());
            this.extendCompensationOptions([e.compensacionLaboral ?? []].flat());
          },
        });
      }else{
        this.formLevelCompensation = this.levelCompensationService.getLevelCompensationFormGroup();
      }
    }
  }

  loadValidities(levelCompensationId: number): void {
    this.validityService.getValidities().subscribe({
      next: (e) => {
        this.extendValidityOptions(e);
        const activeValidity = e?.find(o => Methods.parseStringToBoolean(o.estado));
        if(!levelCompensationId){
          this.levelCompensationService.setValidityToLevelCompensation(activeValidity);
        }
      }
    });
  }

  loadCompensations(): void {
    this.compensationService.getCompesations().subscribe({
      next: (e) => {
        this.extendCompensationOptions(e);
      }
    });
  }

  loadRules(): void {
    this.ruleService.getRules().subscribe({
      next: (e) => {
        this.extendRuleOptions(e);
      }
    });
  }

  loadVariables(): void {
    this.variableService.getVariables().subscribe({
      next: (e) => {
        this.extendVariableOptions(e);
      }
    });
  }

  loadSalaryScale(idLevel: number){
    this.loadingSalaryScales = true;
    this.levelService.getSalaryScalesByLevelIdAndActive(idLevel).subscribe({
      next: (e) => {
        this.extendSalaryScaleOptions(e);
        this.loadingSalaryScales = false;
      },
      error: ()=>{this.loadingSalaryScales = false;}
    });
  }

  updateLevelCompensation(payload: LevelCompensation, id: number): void {
    this.levelCompensationService.updateLevelCompensation(id, payload).subscribe({
      next: (e) => {
        this.store.dispatch(LevelCompensationActions.updateFromList({levelCompensation: e}));
        this.router.navigate([this.backRoute], {skipLocationChange: true, queryParams: {idLevel: this.cryptoService.encryptParam(payload.idNivel)}});
        this.creatingOrUpdating = false;
        this.levelCompensationService.resetFormInformation();
      },
      error: (error) => {
        this.creatingOrUpdating = false;
      },
    });
  }

  createLevelCompensation(payload: LevelCompensation): void {
    this.levelCompensationService.createLevelCompensation(payload).subscribe({
      next: (e) => {
        this.store.dispatch(LevelCompensationActions.updateFromList({levelCompensation: e}));
        this.router.navigate([this.backRoute], {skipLocationChange: true, queryParams: {idLevel: this.cryptoService.encryptParam(payload.idNivel)}});
        this.creatingOrUpdating = false;
        this.levelCompensationService.resetFormInformation();
      },
      error: (error) => {
        this.creatingOrUpdating = false;
      },
    });
  }

  onSubmitLevelCompensation(event : Event): void {
    event.preventDefault();
    let payload = {...this.levelCompensation, ...this.formLevelCompensation.value};
    if (this.formLevelCompensation.invalid) {
      this.formLevelCompensation.markAllAsTouched();
    } else {
      this.creatingOrUpdating = true;
      this.updateMode ? this.updateLevelCompensation(payload, this.levelCompensation.id) : this.createLevelCompensation(payload);
    }
  }

  onDeleteLevelCompensation(event : Event): void {
    event.preventDefault();
    this.deleting = true;
    this.levelCompensationService.deleteLevelCompensation(this.levelCompensation.id).subscribe({
      next: () => {
        this.store.dispatch(LevelCompensationActions.removeFromList({id: this.levelCompensation.id}));
        this.router.navigate([this.backRoute], {skipLocationChange: true, queryParams: {idLevel: this.cryptoService.encryptParam(this.levelId)}});
        this.deleting = false;
        this.levelCompensationService.resetFormInformation();
      },
      error: (error) => {
        this.deleting = false;
      },
    });
  }

  onCancelLevelCompensation(event : Event): void {
    event.preventDefault();
    this.router.navigate([this.backRoute], {skipLocationChange: true, queryParams: {idLevel: this.cryptoService.encryptParam(this.levelId)}});
    this.levelCompensationService.resetFormInformation();
  }

  /*********************** TO VALIDITY ***********************/
  changeValidity(data: any){
    this.levelCompensationService.setValidityToLevelCompensation(data.value);
    this.validityOptionsOverlayPanel.hide();
  }

  removeValidity(){
    this.levelCompensationService.setValidityToLevelCompensation(null);
  }

  openNewValidity() {
    const backRoute = this.levelCompensation ? `${'/configurations/level-compensations/'+ this.cryptoService.encryptParam(this.levelCompensation.id)}` : '/configurations/level-compensations/create';
    this.router.navigate(['/configurations/validities/create'], { skipLocationChange: true, queryParams: {backRoute: backRoute}});
  }

  onGoToUpdateValidity (id : any, event: Event): void{
    event.preventDefault();
    event.stopPropagation();
    const backRoute = this.levelCompensation ? `${'/configurations/level-compensations/'+ this.cryptoService.encryptParam(this.levelCompensation.id)}` : '/configurations/level-compensations/create';
    this.router.navigate(["/configurations/validities", this.cryptoService.encryptParam(id)], {skipLocationChange: true, queryParams: {backRoute: backRoute}})
  }

  /*********************** TO COMPENSATION ***********************/
  changeCompensation(data: any){
    this.levelCompensationService.setCompensationToLevelCompensation(data.value);
    this.compensationOptionsOverlayPanel.hide();
  }

  removeCompensation(){
    this.levelCompensationService.setCompensationToLevelCompensation(null);
  }

  openNewCompensation() {
    const backRoute = this.levelCompensation ? `${'/configurations/level-compensations/'+ this.cryptoService.encryptParam(this.levelCompensation.id)}` : '/configurations/level-compensations/create';
    this.router.navigate(['/configurations/compensations/create'], { skipLocationChange: true, queryParams: {backRoute: backRoute}});
  }

  onGoToUpdateCompensation (id : any, event: Event): void{
    event.preventDefault();
    event.stopPropagation();
    const backRoute = this.levelCompensation ? `${'/configurations/level-compensations/'+ this.cryptoService.encryptParam(this.levelCompensation.id)}` : '/configurations/level-compensations/create';
    this.router.navigate(["/configurations/compensations", this.cryptoService.encryptParam(id)], {skipLocationChange: true, queryParams: {backRoute: backRoute}})
  }

  /*********************** TO RULE **********************/
  changeRule(data: any){
    this.levelCompensationService.setRuleToLevelCompensation(data.value);
    this.ruleOptionsOverlayPanel.hide();
  }

  removeRule(){
    this.levelCompensationService.setRuleToLevelCompensation(null);
  }

  openNewRule() {
    const backRoute = this.levelCompensation ? `${'/configurations/level-compensations/'+ this.cryptoService.encryptParam(this.levelCompensation.id)}` : '/configurations/level-compensations/create';
    this.router.navigate(['/configurations/rules/create'], { skipLocationChange: true, queryParams: {backRoute: backRoute}});
  }

  onGoToUpdateRule (id : any, event: Event): void{
    event.preventDefault();
    event.stopPropagation();
    const backRoute = this.levelCompensation ? `${'/configurations/level-compensations/'+ this.cryptoService.encryptParam(this.levelCompensation.id)}` : '/configurations/level-compensations/create';
    this.router.navigate(["/configurations/rules", this.cryptoService.encryptParam(id)], {skipLocationChange: true, queryParams: {backRoute: backRoute}})
  }
  
  /*********************** TO VARIABLE **********************/
  changeVariable(data: any){
    this.levelCompensationService.setVariableToLevelCompensation(data.value);
    this.ruleOptionsOverlayPanel.hide();
  }

  removeVariable(){
    this.levelCompensationService.setVariableToLevelCompensation(null);
  }

  openNewVariable() {
    const backRoute = this.levelCompensation ? `${'/configurations/level-compensations/'+ this.cryptoService.encryptParam(this.levelCompensation.id)}` : '/configurations/level-compensations/create';
    this.router.navigate(['/configurations/variables/create'], { skipLocationChange: true, queryParams: {backRoute: backRoute}});
  }

  onGoToUpdateVariable (id : any, event: Event): void{
    event.preventDefault();
    event.stopPropagation();
    const backRoute = this.levelCompensation ? `${'/configurations/level-compensations/'+ this.cryptoService.encryptParam(this.levelCompensation.id)}` : '/configurations/level-compensations/create';
    this.router.navigate(["/configurations/variables", this.cryptoService.encryptParam(id)], {skipLocationChange: true, queryParams: {backRoute: backRoute}})
  }

  parseStringToBoolean(str: string): boolean{
    return Methods.parseStringToBoolean(str);
  }

  private extendSalaryScaleOptions(newItems: SalaryScale[]){
    newItems?.forEach(item => {
      if (!this.salaryScales.some(existingItem => existingItem.id === item.id)) {
        this.salaryScales.push(item);
      }
    });
  }

  private extendValidityOptions(newItems: Validity[]){
    newItems?.forEach(item => {
      if (!this.validityOptions.some(existingItem => existingItem.value.id === item.id)) {
        this.validityOptions.push({value: item, label: item.nombre});
      }
    });
  }

  private extendRuleOptions(newItems: Rule[]){
    newItems?.forEach(item => {
      if (!this.ruleOptions.some(existingItem => existingItem.value.id === item.id)) {
        this.ruleOptions.push({value: item, label: item.nombre});
      }
    });
  }

  private extendVariableOptions(newItems: Variable[]){
    newItems?.forEach(item => {
      if (!this.variableOptions.some(existingItem => existingItem.value.id === item.id)) {
        this.variableOptions.push({value: item, label: item.nombre});
      }
    });
  }

  private extendCompensationOptions(newItems: Compensation[]){
    newItems?.forEach(newItem => {
      const group: SelectItemGroup = this.compensationOptions.find(g => g.value.id == newItem.idCategoria);
      if (group) {
        const existe = group.items.some(e => e.value.id === newItem.id);
        if (!existe) {
            group.items.push({value: newItem, label: newItem.nombre});
        }
      } else {
        this.compensationOptions.push({
            label: newItem.categoria.nombre,
            value: newItem.categoria,
            items: [{value: newItem, label: newItem.nombre}]
        });
      }
  });
  }
}