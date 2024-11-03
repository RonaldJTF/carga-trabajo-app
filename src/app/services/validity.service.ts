import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Validity, ValueInValidity, Variable } from '@models';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Methods } from '@utils';

@Injectable({
  providedIn: 'root'
})
export class ValidityService {
  private pathValidity: string = 'validity'
  private pathValueInValidity: string = 'value-in-validity'

  private validityFormGroup: FormGroup;

  private _valueInValidityFormGroup: BehaviorSubject<FormGroup> = new BehaviorSubject<FormGroup>(null); 
  private _indexOfValueInValidity: BehaviorSubject<number> = new BehaviorSubject<number>(-1); 
  private _mustRechargeValidityFormGroup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true); 
  private _validity: BehaviorSubject<Validity> = new BehaviorSubject<Validity>(null); 

  public valueInValidityFormGroup$ = this._valueInValidityFormGroup.asObservable();
  public indexOfValueInValidity$ = this._indexOfValueInValidity.asObservable();
  public mustRechargeValidityFormGroup$ = this._mustRechargeValidityFormGroup.asObservable();
  public validity$ = this._validity.asObservable();


  constructor(
    private webRequestService: WebRequestService,
    private formBuilder : FormBuilder,
  ) { }

  getValidity(id: number): Observable<Validity> {
    return this.webRequestService.getWithHeaders(`${this.pathValidity}/${id}`);
  }

  getValidities(): Observable<Validity[]>{
    return this.webRequestService.getWithHeaders(this.pathValidity);
  }

  getActiveValidities(): Observable<Validity[]>{
    return this.webRequestService.getWithHeaders(this.pathValidity, {estado: '1'});
  }

  createValidity(validity: any): Observable<any> {
    return this.webRequestService.postWithHeaders(this.pathValidity, validity);
  }

  updateValidity(id: number, validity: Validity): Observable<any> {
    return this.webRequestService.putWithHeaders(`${this.pathValidity}/${id}`, validity);
  }

  deleteValidity(idValidity: number): Observable<Validity> {
    return this.webRequestService.deleteWithHeaders(`${this.pathValidity}/${idValidity}`);
  }

  deleteSelectedValidities(payload: number[]): Observable<Validity[]> {
    return this.webRequestService.deleteWithHeaders(this.pathValidity, undefined, payload);
  }

  deleteValueInValidity(idValueInValidity: number): Observable<Validity> {
    return this.webRequestService.deleteWithHeaders(`${this.pathValidity}/${this.pathValueInValidity}/${idValueInValidity}`);
  }


  /*********************************************************************************************************************/
  /******************************************** SECTION OF FORMS TO VALIDITY *******************************************/
  /*********************************************************************************************************************/

  setMustRechargeValidityFormGroup(mustRechargeValidityFormGroup: boolean){
    this._mustRechargeValidityFormGroup.next(mustRechargeValidityFormGroup);
  }

  getValidityFormGroup(){
    return this.validityFormGroup;
  }

  createValidityFormGroup(){
    this.resetFormInformation();
    this.validityFormGroup = this.formBuilder.group({
      estado: [true, Validators.required],
      anio: ['', Validators.required],
      nombre: ['', Validators.compose([
        Validators.required, 
        Validators.maxLength(100)
      ])],
      valoresVigencia: this.formBuilder.array([])
    })
    return this.validityFormGroup;
  }

  initializeValidityFormGroup(validity: Validity): FormGroup {
    this._validity.next(validity);
    const formArray: FormArray = this.validityFormGroup.get('valoresVigencia') as FormArray;
    this.validityFormGroup.get('nombre').setValue(validity.nombre);
    this.validityFormGroup.get('anio').setValue(validity.anio);
    this.validityFormGroup.get('estado').setValue(Methods.parseStringToBoolean(validity.estado ?? "1" ));
    validity.valoresVigencia?.forEach( e => formArray.push(this.createValueInValidityFormGroup(e)))
    return this.validityFormGroup;
  }

  setNewValueInValidity(valueInValidity: ValueInValidity) {
    this._valueInValidityFormGroup.next(this.createValueInValidityFormGroup(valueInValidity));
    this._indexOfValueInValidity.next(-1);
  }

  removeValueInValidity(index: number) {
    const formArray: FormArray = this.validityFormGroup.get('valoresVigencia') as FormArray;
    if (index == this._indexOfValueInValidity.value){
      this.resetValueInValidity();
    }else if(this._indexOfValueInValidity.value > index){
      this._indexOfValueInValidity.next(this._indexOfValueInValidity.value - 1);
    }
    formArray.removeAt(index);
  }

  modifyValueInValidity(index: number){
    const formArray: FormArray = this.validityFormGroup.get('valoresVigencia') as FormArray;
    const copy = Methods.cloneFormGroup(formArray.at(index) as FormGroup);
    this._indexOfValueInValidity.next(index);
    this._valueInValidityFormGroup.next(copy);
  }

  cancelValueInValidity(){
    this.resetValueInValidity();
  }

  submitValueInValidity(){
    const formArray: FormArray = this.validityFormGroup.get('valoresVigencia') as FormArray;
    const index = this._indexOfValueInValidity.value;
    const formGroup = this._valueInValidityFormGroup.value;
    if(index < 0){
      formArray.push(formGroup);
    }else{
      formArray.removeAt(index); 
      formArray.insert(index, formGroup);
    }
    this.resetValueInValidity();
  }

  resetFormInformation(){
    this._mustRechargeValidityFormGroup.next(true);
    this._validity.next(null);
    this.validityFormGroup = null;
    this.resetValueInValidity();
  }

  resetValueInValidity(){
    this._indexOfValueInValidity.next(-1);
    this._valueInValidityFormGroup.next(null);
  }

  setVariableToValueInValidity(variable: Variable){
    const formGroup = this._valueInValidityFormGroup.value;
    formGroup?.get('idVariable').markAsTouched();
    formGroup?.get('idVariable').setValue(variable?.id);
    formGroup?.get('variable').setValue(variable);
  }

  removeValuesInValidityByVariable(variableId: number){
    const formGroup = this._valueInValidityFormGroup.value;
    const formArray: FormArray = this.validityFormGroup?.get('valoresVigencia') as FormArray;
    let totalToMove = 0;
    let actualWasRemoved = false;
    const actualIndex = this._indexOfValueInValidity.value;
    
    for (let i = formArray?.length - 1; i >= 0; i--) {
      const control = formArray.at(i);
      if (control.get('idVariable')?.value === variableId) {
        formArray.removeAt(i);
        if (i < actualIndex){
          totalToMove += 1;
        }else if(i == actualIndex){
          actualWasRemoved = true;
        }
      }
    }
    //Actualizar el index del elemento que se encuentra editando a nueva posición, ya que pudo haberse desplazado
    this._indexOfValueInValidity.next(actualIndex - totalToMove);

    /*Si el elemento que se tiene modificando o creando tiene en el momento la misma variable eliminada, o es un elemento 
    que parte de uno de esa variable, entonces es reestablecido a valores iniciales*/
    if(formGroup?.get('idVariable').value == variableId){
      if(actualWasRemoved){
        this.resetValueInValidity();
      }else{
        this.setVariableToValueInValidity(null);
      }
    }
  }

  updateVariableInValuesInValidity(variable: Variable){
    const formGroup = this._valueInValidityFormGroup.value;
    const formArray: FormArray = this.validityFormGroup?.get('valoresVigencia') as FormArray;

    for (let i = formArray?.length - 1; i >= 0; i--) {
      const control = formArray.at(i);
      if (control.get('idVariable')?.value == variable.id) {
        control.get('variable').setValue(variable);
      }
    }
    //Si el elemento que se tiene modificando o creando es de la misma variable, entonces es actualizado también.
    if(formGroup?.get('idVariable').value == variable.id){
      formGroup.get('normatividad').setValue(variable);
    }
  }
  

  private createValueInValidityFormGroup(valueInValidity: ValueInValidity){
    return this.formBuilder.group({
      id: valueInValidity.id,
      idVariable: [valueInValidity.idVariable, Validators.required],
      idVigencia: [valueInValidity.idVigencia],
      valor: [valueInValidity.valor, Validators.compose([Validators.required])],
      variable: valueInValidity.variable
    });
  }
}
