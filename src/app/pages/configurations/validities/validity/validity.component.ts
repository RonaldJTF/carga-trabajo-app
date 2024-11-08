import { Location } from '@angular/common';
import * as ValidityActions from "@store/validity.actions";
import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MESSAGE } from '@labels/labels';
import { Validity, ValueInValidity, Variable } from '@models';
import { Store } from '@ngrx/store';
import { AppointmentService, AuthenticationService, ConfirmationDialogService, CryptojsService, UrlService, ValidityService } from '@services';
import { IMAGE_SIZE, Methods } from '@utils';
import { MenuItem, SelectItem } from 'primeng/api';
import { OverlayPanel } from 'primeng/overlaypanel';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducers';
import { VariableService } from 'src/app/services/variable.service';

@Component({
  selector: 'app-validity',
  templateUrl: './validity.component.html',
  styleUrls: ['./validity.component.scss']
})
export class ValidityComponent implements OnInit {
  IMAGE_SIZE = IMAGE_SIZE;
  MESSAGE = MESSAGE;
  ROUTE_TO_BACK: string = '/configurations/validities';

  DELETE_MESSAGE = `
      ¿Está seguro de eliminar la vigencia?
      <div class="bg-yellow-50 text-yellow-500 border-round-xl p-4 text-justify mt-2">
        <span>
            <strong>Advertencia:</strong>
            Eliminar la vigencia implica eliminar todas las parametrizaciones de los valores de las variables y los cargos designados en esa vigencia.
            Por favor, asegúrese de que comprende el impacto de esta acción antes de proceder.
        </span>
      </div>
      `
  @ViewChild('variableOptionsOverlayPanel') variableOptionsOverlayPanel: OverlayPanel;

  isAdmin: boolean;
  formValidity !: FormGroup;
  valueInValidityFormGroup: FormGroup;
  indexOfValueInValidity: number;

  mustRechargeValidityFormGroup: boolean;
  indexOfValueInValiditySubscription: Subscription;
  valueInValidityFormGroupSubscription: Subscription;
  mustRechargeValueInValidityFormGroupSubscription: Subscription;
  validitySubscription: Subscription;

  validity: Validity;
  updateMode: boolean;
  creatingOrUpdating: boolean = false;
  deleting: boolean = false;
  loadingValidity: boolean = false;

  backRoute: string;

  variableOptions: SelectItem[] = [];
  menuItemsOfValueInValidity: MenuItem[] = [];

  idLevel: string;

  constructor(
    private store: Store<AppState>,
    private confirmationDialogService: ConfirmationDialogService,
    private validityService: ValidityService,
    private variableService: VariableService,
    private appointmentService: AppointmentService,
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

    this.idLevel = this.route.snapshot.queryParams['idLevel'];

    console.log("Quiero Editar:- ", this.idLevel);

    this.indexOfValueInValiditySubscription =  this.validityService.indexOfValueInValidity$.subscribe(e => this.indexOfValueInValidity = e);
    this.valueInValidityFormGroupSubscription = this.validityService.valueInValidityFormGroup$.subscribe(e => this.valueInValidityFormGroup = e);
    this.mustRechargeValueInValidityFormGroupSubscription = this.validityService.mustRechargeValidityFormGroup$.subscribe(e => this.mustRechargeValidityFormGroup = e);
    this.validitySubscription = this.validityService.validity$.subscribe(e => this.validity = e)

    if (this.mustRechargeValidityFormGroup){
      this.validityService.createValidityFormGroup();
    }
    this.loadValidityInformation(this.cryptoService.decryptParamAsNumber(this.route.snapshot.params['id']));
    this.initMenus();
    this.loadVariables();
  }

  get valuesInValidityFormArray(): FormArray{
    return this.formValidity.get('valoresVigencia') as FormArray;
  }

  initMenus(){
    this.menuItemsOfValueInValidity = [
      {label: 'Editar', icon: 'pi pi-pencil', visible: this.isAdmin, command: (e) => this.modifyValueInValidity(e.item['index'], e.originalEvent)},
      {label: 'remover', icon: 'pi pi-times', visible: this.isAdmin, command: (e) => this.removeValueInValidity(e.item['index'])},
    ];
  }

  loadValidityInformation(id: number){
    if (id == undefined){
      this.updateMode = false;
      this.formValidity = this.validityService.getValidityFormGroup();
      this.validityService.setMustRechargeValidityFormGroup(false);
    }else{
      this.updateMode = true;
      if (this.mustRechargeValidityFormGroup){
        this.loadingValidity = true;
        this.validityService.getValidity(id).subscribe({
          next: (e) => {
            this.formValidity = this.validityService.initializeValidityFormGroup(e);
            this.validityService.setMustRechargeValidityFormGroup(false);
            this.loadingValidity = false;
          },
        });
      }else{
        this.formValidity = this.validityService.getValidityFormGroup();
      }
    }
  }

  loadVariables(): void {
    this.variableService.getVariablesConfigureByValidityAndActive().subscribe({
      next: (e) => {
        this.variableOptions = e?.map( o => ({value: o, label: o.nombre}))
      }
    });
  }

  updateValidity(payload: Validity, id: number): void {
    this.validityService.updateValidity(id, payload).subscribe({
      next: (e) => {
        this.store.dispatch(ValidityActions.updateFromList({validity: e}));
        this.router.navigate([this.backRoute], {skipLocationChange: true, queryParams: this.idLevel ? {idLevel: this.idLevel} : null});
        this.creatingOrUpdating = false;
        this.validityService.resetFormInformation();

        //Actualizamos del formulario de asignación salarial la nueva información de la vigencia
        this.appointmentService.updateValidityInAppointment(e);
      },
      error: (error) => {
        this.creatingOrUpdating = false;
      },
    });
  }

  createValidity(payload: Validity): void {
    this.validityService.createValidity(payload).subscribe({
      next: (e) => {
        this.store.dispatch(ValidityActions.updateFromList({validity: e}));
        this.router.navigate([this.backRoute], {skipLocationChange: true});
        this.creatingOrUpdating = false;
        this.validityService.resetFormInformation();
      },
      error: (error) => {
        this.creatingOrUpdating = false;
      },
    });
  }

  onSubmitValidity(event : Event): void {
    event.preventDefault();
    let payload = {...this.validity, ...this.formValidity.value, anio: new Date(this.formValidity.value.anio).getUTCFullYear(),};
    payload.estado = Methods.parseBooleanToString(payload.estado);
    if (this.formValidity.invalid) {
      this.formValidity.markAllAsTouched();
    } else {
      this.creatingOrUpdating = true;
      this.updateMode ? this.updateValidity(payload, this.validity.id) : this.createValidity(payload);
    }
  }

  onDeleteValidity(event : Event): void {
    event.preventDefault();
    this.deleting = true;
    this.validityService.deleteValidity(this.validity.id).subscribe({
      next: () => {
        this.store.dispatch(ValidityActions.removeFromList({id: this.validity.id}));
        this.router.navigate([this.backRoute], {skipLocationChange: true});
        this.deleting = false;
        this.validityService.resetFormInformation();
        //Removemos del formulario de asignación de cargos la vigencia si es la que se tiene definida
        this.appointmentService.removeValidityInAppointment(this.validity.id);
      },
      error: (error) => {
        this.deleting = false;
      },
    });
  }

  onCancelValidity(event : Event): void {
    event.preventDefault();
    this.router.navigate([this.backRoute], {skipLocationChange: true});
    this.validityService.resetFormInformation();
  }

  openNewValueInValidity(){
    this.validityService.setNewValueInValidity({idVigencia: this.validity?.id} as ValueInValidity);
  }

  cancelValueInValidity(event: Event){
    this.validityService.resetValueInValidity();
  }

  submitValueInValidty(event:Event){
    if (this.valueInValidityFormGroup.invalid) {
      this.valueInValidityFormGroup.markAllAsTouched();
    } else {
      this.validityService.submitValueInValidity();
    }
  }

  modifyValueInValidity(index: any, event: Event){
    event.preventDefault();
    event.stopPropagation();
    this.validityService.modifyValueInValidity(index);
  }

  removeValueInValidity(index: number){
    this.validityService.removeValueInValidity(index);
  }

  changeVariable(data: any){
    this.validityService.setVariableToValueInValidity(data.value);
    this.variableOptionsOverlayPanel.hide();
  }

  removeVariable(){
    this.validityService.setVariableToValueInValidity(null);
  }

  openNewVariable() {
    const backRoute = this.validity ? `${'/configurations/validities/'+ this.cryptoService.encryptParam(this.validity.id)}` : '/configurations/validities/create';
    this.router.navigate(['/configurations/variables/create'], { skipLocationChange: true, queryParams: {backRoute: backRoute}});
  }

  onGoToUpdateVariable (id : any, event: Event): void{
    event.preventDefault();
    event.stopPropagation();
    const backRoute = this.validity ? `${'/configurations/validities/'+ this.cryptoService.encryptParam(this.validity.id)}` : '/configurations/validities/create';
    this.router.navigate(["/configurations/variables", this.cryptoService.encryptParam(id)], {skipLocationChange: true, queryParams: {backRoute: backRoute}})
  }

  onDeleteVariable(variable: Variable, event: Event): void{
    event.preventDefault();
    event.stopPropagation();
    this.confirmationDialogService.showDeleteConfirmationDialog(
      () => {
        this.variableService.deleteVariable(variable.id).subscribe({
          next: () => {
            this.validityService.removeValuesInValidityByVariable(variable.id);
            this.variableOptions = this.variableOptions.filter(e => e.value?.id != variable.id);
          },
        });
      },
      `
      ¿Está seguro de eliminar la variable <strong>${variable?.nombre}</strong>?
      <div class="bg-yellow-50 text-yellow-500 border-round-xl p-4 text-justify mt-2">
        <span>
            <strong>Advertencia:</strong>
            Eliminar la variable implica eliminar todas parametrizaciones de su valor en cada una de las vigencias donde se ha relacionado.
            Por favor, asegúrese de que comprende el impacto de esta acción antes de proceder.
        </span>
      </div>
      `
    )
  }

  hasErrors(control: AbstractControl): boolean{
    return Methods.hasErrors(control);
  }

  parseStringToBoolean(str: string): boolean{
    return Methods.parseStringToBoolean(str);
  }
}
