import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Appointment, Normativity, Scope, Structure, Validity } from '@models';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TreeNode } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private pathAppointment: string = 'appointment'

  private appointmentFormGroup: FormGroup;

  private _mustRechargeAppointmentFormGroup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true); 
  private _appointment: BehaviorSubject<Appointment> = new BehaviorSubject<Appointment>(null); 

  public mustRechargeAppointmentFormGroup$ = this._mustRechargeAppointmentFormGroup.asObservable();
  public appointment$ = this._appointment.asObservable();

  constructor(
    private webRequestService: WebRequestService,
    private formBuilder : FormBuilder,
  ) { }
  
  getAppointments(filterIds: any) {
    return this.webRequestService.getWithHeaders(this.pathAppointment, filterIds);
  }

  getAppointment(id: number) {
    return this.webRequestService.getWithHeaders(`${this.pathAppointment}/${id}`);
  }

  createAppointment(appointment: any): Observable<any> {
    return this.webRequestService.postWithHeaders(this.pathAppointment, appointment);
  }

  updateAppointment(id: number, appointment: Appointment): Observable<any> {
    return this.webRequestService.putWithHeaders(`${this.pathAppointment}/${id}`, appointment);
  }

  deleteAppointment(idAppointment: number): Observable<Appointment> {
    return this.webRequestService.deleteWithHeaders(`${this.pathAppointment}/${idAppointment}`);
  }

  deleteSelectedLevel(payload: number[]): Observable<Appointment[]> {
    return this.webRequestService.deleteWithHeaders(this.pathAppointment, undefined, payload);
  }

  /*********************************************************************************************************************/
  /******************************************* SECTION OF FORMS TO APPOINTMENT *****************************************/
  /*********************************************************************************************************************/

  setMustRechargeAppointmentFormGroup(mustRechargeAppointmentFormGroup: boolean){
    this._mustRechargeAppointmentFormGroup.next(mustRechargeAppointmentFormGroup);
  }

  getAppointmentFormGroup(){
    return this.appointmentFormGroup;
  }

  createAppointmentFormGroup(){
    this.resetFormInformation();
    this.appointmentFormGroup = this.formBuilder.group({
      idEstructura: ['', Validators.required],
      idVigencia: ['', Validators.required],
      idNivel: ['', Validators.required],
      idEscalaSalarial: '',
      idAlcance: '',
      idNormatividad: ['', Validators.required],
      totalCargos: ['', Validators.compose([Validators.required, Validators.min(0)])],
      asignacionBasica: ['', Validators.compose([Validators.required, Validators.min(0)])],
      vigencia: null,
      dependencyInTree: null,
      normatividad: null,
    })
    return this.appointmentFormGroup;
  }

  initializeAppointmentFormGroup(appointment: Appointment): FormGroup {
    this._appointment.next(appointment);
    
    const node: TreeNode<Structure> = {
      data: appointment.estructura,
      label: appointment.estructura.nombre,
      key: appointment.estructura.id.toString(),
      children: []
    };

    this.appointmentFormGroup.get('idEstructura').setValue(appointment.idEstructura);
    this.appointmentFormGroup.get('idVigencia').setValue(appointment.idVigencia);
    this.appointmentFormGroup.get('idNivel').setValue(appointment.idNivel);
    this.appointmentFormGroup.get('idEscalaSalarial').setValue(appointment.idEscalaSalarial);
    this.appointmentFormGroup.get('idNormatividad').setValue(appointment.idNormatividad);
    this.appointmentFormGroup.get('idAlcance').setValue(appointment.idAlcance);
    this.appointmentFormGroup.get('totalCargos').setValue(appointment.totalCargos);
    this.appointmentFormGroup.get('asignacionBasica').setValue(appointment.asignacionBasica);
    this.appointmentFormGroup.get('vigencia').setValue(appointment.vigencia);
    this.appointmentFormGroup.get('normatividad').setValue(appointment.normatividad);
    this.appointmentFormGroup.get('dependencyInTree').setValue(node);
    
    return this.appointmentFormGroup;
  }

  resetFormInformation(){
    this._mustRechargeAppointmentFormGroup.next(true);
    this._appointment.next(null);
    this.appointmentFormGroup = null;
  }

  setValidityToAppointment(validity: Validity){
    const formGroup = this.appointmentFormGroup;
    formGroup?.get('idVigencia').markAsTouched();
    formGroup?.get('idVigencia').setValue(validity?.id);
    formGroup?.get('vigencia').setValue(validity);
  }

  updateValidityInAppointment(validity: Validity){
    const formGroup = this.appointmentFormGroup;
    if(formGroup?.get('idVigencia').value == validity.id){
      formGroup.get('vigencia').setValue(validity);
    }
  }

  removeValidityInAppointment(validityId: number){
    const formGroup = this.appointmentFormGroup;
    if(formGroup?.get('idVigencia').value == validityId){
      this.setValidityToAppointment(null);
    }
  }

  setNormativityToAppointment(normativity: Normativity){
    const formGroup = this.appointmentFormGroup;
    formGroup?.get('idNormatividad').markAsTouched();
    formGroup?.get('idNormatividad').setValue(normativity?.id);
    formGroup?.get('normatividad').setValue(normativity);
    formGroup?.get('idAlcance').setValue(normativity?.idAlcance);
  }

  updateNormativityInAppointment(normativity: Normativity){
    const formGroup = this.appointmentFormGroup;
    if(formGroup?.get('idNormatividad').value == normativity.id){
      formGroup.get('normatividad').setValue(normativity);
    }
  }

  removeNormativityInAppointment(normativityId: number){
    const formGroup = this.appointmentFormGroup;
    if(formGroup?.get('idNormatividad').value == normativityId){
      this.setNormativityToAppointment(null);
    }
  }

  setDependencyToAppointment(node: TreeNode<Structure>){
    const formGroup = this.appointmentFormGroup;
    formGroup?.get('idEstructura').markAsTouched();
    formGroup?.get('idEstructura').setValue(node?.data?.id);
  }
}
