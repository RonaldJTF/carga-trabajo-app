import {Injectable} from '@angular/core';
import {WebRequestService} from "./web-request.service";
import {BehaviorSubject, Observable} from "rxjs";
import {Category, Compensation, LevelCompensation} from "@models";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Methods } from '@utils';

@Injectable({
  providedIn: 'root'
})
export class CompensationService {

  private pathCompensation = 'compensation';

  private compensationFormGroup: FormGroup;

  private _mustRechargeCompensationFormGroup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true); 
  private _mustCloseForm: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false); 
  private _compensation: BehaviorSubject<Compensation> = new BehaviorSubject<Compensation>(null); 

  public mustRechargeCompensationFormGroup$ = this._mustRechargeCompensationFormGroup.asObservable();
  public mustCloseForm$ = this._mustCloseForm.asObservable();
  public compensation$ = this._compensation.asObservable();


  constructor(
    private webRequestService: WebRequestService,
    private formBuilder : FormBuilder,
  ) { }

  getCompesations(): Observable<Compensation[]> {
    return this.webRequestService.getWithHeaders(this.pathCompensation);
  }

  getCompensation(idCompensation: string): Observable<any> {
    return this.webRequestService.getWithHeaders(`${this.pathCompensation}/${idCompensation}`);
  }

  getActiveCompesations(): Observable<Compensation[]> {
    return this.webRequestService.getWithHeaders(this.pathCompensation, {estado: '1'});
  }

  createCompensation(compensation: any): Observable<any> {
    return this.webRequestService.postWithHeaders(this.pathCompensation, compensation);
  }

  updateCompensation(id: number, compensation: any): Observable<any> {
    return this.webRequestService.putWithHeaders(`${this.pathCompensation}/${id}`, compensation);
  }

  deleteCompensation(idCompensation: number): Observable<any> {
    return this.webRequestService.deleteWithHeaders(`${this.pathCompensation}/${idCompensation}`);
  }

  deleteSelectedCompensations(payload: number[]): Observable<string[]> {
    return this.webRequestService.deleteWithHeaders(`${this.pathCompensation}`, undefined, payload);
  }

  /*********************************************************************************************************************/
  /****************************************** SECTION OF FORMS TO COMPENSATION *****************************************/
  /*********************************************************************************************************************/

  setMustRechargeCompensationFormGroup(mustRechargeCompensationFormGroup: boolean){
    this._mustRechargeCompensationFormGroup.next(mustRechargeCompensationFormGroup);
  }

  getCompensationFormGroup(){
    return this.compensationFormGroup;
  }

  createCompensationFormGroup(){
    this.resetFormInformation();
    this.compensationFormGroup = this.formBuilder.group({
      nombre: ['', Validators.required],
      descripcion: '',
      estado: true,
      idCategoria: ['', Validators.required],
      idPeriodicidad: ['', Validators.required],
      categoria: null,
    })
    return this.compensationFormGroup;
  }

  initializeCompensationFormGroup(compensation: Compensation): FormGroup {
    this._compensation.next(compensation);
    this.compensationFormGroup.get('idCategoria').setValue(compensation.idCategoria);
    this.compensationFormGroup.get('idPeriodicidad').setValue(compensation.idPeriodicidad);
    this.compensationFormGroup.get('estado').setValue(Methods.parseStringToBoolean(compensation.estado));
    this.compensationFormGroup.get('nombre').setValue(compensation.nombre);
    this.compensationFormGroup.get('descripcion').setValue(compensation.descripcion);
    this.compensationFormGroup.get('categoria').setValue(compensation.categoria);
    return this.compensationFormGroup;
  }

  resetFormInformation(){
    this._mustRechargeCompensationFormGroup.next(true);
    this._compensation.next(null);
    this.compensationFormGroup = null;
    this.setMustCloseForm(false);
  }

  setCategoryToCompensation(category: Category){
    const formGroup = this.compensationFormGroup;
    formGroup?.get('idCategoria').markAsTouched();
    formGroup?.get('idCategoria').setValue(category?.id);
    formGroup?.get('categoria').setValue(category);
  }

  updateCategoryInCompensation(category: Category){
    const formGroup = this.compensationFormGroup;
    if(formGroup?.get('idCategoria').value == category.id){
      formGroup.get('categoria').setValue(category);
    }
  }

  removeCategoryInCompensation(categoryId: number){
    const formGroup = this.compensationFormGroup;
    if(formGroup?.get('idCategoria').value == categoryId){
      this.setCategoryToCompensation(null);
      if(this._compensation.value?.idCategoria == categoryId){//Estaba editando una compensacion laboral con esa categoría inicialmente, por lo que ya fué eliminada, asi que se limpia todo;
        this.setMustCloseForm(true);
      }
    }
  }

  setMustCloseForm(mustCloseForm: boolean){
    this._mustCloseForm.next(mustCloseForm);
  }
}
