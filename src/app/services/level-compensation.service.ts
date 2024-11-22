import {Injectable} from '@angular/core';
import {WebRequestService} from "./web-request.service";
import {BehaviorSubject, Observable, of} from "rxjs";
import {Validity, LevelCompensation, Level, Compensation, Rule, Variable, ValueByRule} from "@models";
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Methods } from '@utils';

@Injectable({
  providedIn: 'root'
})
export class LevelCompensationService {
  private pathLevelCompensation = 'level-compensation';
  private pathValueByRule = 'value-by-rule';

  private levelCompensationFormGroup: FormGroup;

  private _valueByRuleFormGroup: BehaviorSubject<FormGroup> = new BehaviorSubject<FormGroup>(null); 
  private _indexOfValueByRule: BehaviorSubject<number> = new BehaviorSubject<number>(-1); 
  private _mustRechargeLevelCompensationFormGroup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true); 
  private _levelCompensation: BehaviorSubject<LevelCompensation> = new BehaviorSubject<LevelCompensation>(null); 

  public valueByRuleFormGroup$ = this._valueByRuleFormGroup.asObservable();
  public indexOfValueByRule$ = this._indexOfValueByRule.asObservable();
  public mustRechargeLevelCompensationFormGroup$ = this._mustRechargeLevelCompensationFormGroup.asObservable();
  public levelCompensation$ = this._levelCompensation.asObservable();

  constructor(
    private webRequestService: WebRequestService,
    private formBuilder : FormBuilder,
  ) { }

  getLevelCompensations(idLevel: number): Observable<LevelCompensation[]> {
    return this.webRequestService.getWithHeaders(`${this.pathLevelCompensation}`, {idNivel: idLevel});
  }

  getLevelCompensation(idLevelCompensation: string): Observable<any> {
    return this.webRequestService.getWithHeaders(`${this.pathLevelCompensation}/${idLevelCompensation}`);
  }

  createLevelCompensation(payload: any): Observable<any> {
    return this.webRequestService.postWithHeaders(this.pathLevelCompensation, payload);
  }

  updateLevelCompensation(id: number, payload: any): Observable<any> {
    return this.webRequestService.putWithHeaders(`${this.pathLevelCompensation}/${id}`, payload);
  }

  deleteLevelCompensation(idLevelCompensation: number): Observable<any> {
    return this.webRequestService.deleteWithHeaders(`${this.pathLevelCompensation}/${idLevelCompensation}`);
  }

  deleteSelectedLevelCompensations(payload: number[]): Observable<any[]> {
    return this.webRequestService.deleteWithHeaders(`${this.pathLevelCompensation}`, undefined, payload);
  }

  deleteValueByRule(idValueByRule: number): Observable<any> {
    return this.webRequestService.deleteWithHeaders(`${this.pathLevelCompensation}/${this.pathValueByRule}/${idValueByRule}`);
  }

  getValueInValidityOfValueByRule(valueByRuleId: number): Observable<any> {
    return this.webRequestService.getWithHeaders(`${this.pathLevelCompensation}/${this.pathValueByRule}/value-in-validity`, {valueByRuleId: valueByRuleId});
  }

  getValuesByRuleByLevelCompensationId(levelCompensationId: number): Observable<any> {
    return this.webRequestService.getWithHeaders(`${this.pathLevelCompensation}/${this.pathValueByRule}`, {levelCompensationId: levelCompensationId});
  }


  /*********************************************************************************************************************/
  /*************************************** SECTION OF FORMS TO LEVEL COMPENSATION **************************************/
  /*********************************************************************************************************************/

  setMustRechargeLevelCompensationFormGroup(mustRechargeLevelCompensationFormGroup: boolean){
    this._mustRechargeLevelCompensationFormGroup.next(mustRechargeLevelCompensationFormGroup);
  }

  getLevelCompensationFormGroup(){
    return this.levelCompensationFormGroup;
  }

  createLevelCompensationFormGroup(levelId: number){
    this.resetFormInformation();
    this.levelCompensationFormGroup = this.formBuilder.group({
      idVigencia: ['', Validators.required],
      idEscalaSalarial: '',
      idCompensacionLaboral: ['', Validators.required],
      idNivel: levelId,
      valoresCompensacionLabNivelVigencia: this.formBuilder.array([]),
      vigencia: null,
      compensacionLaboral: null,
      regla: null,
      variable: null,
    })
    return this.levelCompensationFormGroup;
  }

  initializeLevelCompensationFormGroup(levelCompensation: LevelCompensation): FormGroup {
    this._levelCompensation.next(levelCompensation);
    const formArray: FormArray = this.levelCompensationFormGroup.get('valoresCompensacionLabNivelVigencia') as FormArray;
    this.levelCompensationFormGroup.get('idVigencia').setValue(levelCompensation.idVigencia);
    this.levelCompensationFormGroup.get('idEscalaSalarial').setValue(levelCompensation.idEscalaSalarial);
    this.levelCompensationFormGroup.get('idCompensacionLaboral').setValue(levelCompensation.idCompensacionLaboral);
    this.levelCompensationFormGroup.get('idNivel').setValue(levelCompensation.idNivel);
    this.levelCompensationFormGroup.get('vigencia').setValue(levelCompensation.vigencia);
    this.levelCompensationFormGroup.get('compensacionLaboral').setValue(levelCompensation.compensacionLaboral);

    levelCompensation.valoresCompensacionLabNivelVigencia?.forEach(e => {
      formArray.push(this.createValueByRuleFormGroup(e));
    })
    return this.levelCompensationFormGroup;
  }

  setNewValueByRule(valueByRule: ValueByRule) {
    this._valueByRuleFormGroup.next(this.createValueByRuleFormGroup(valueByRule));
    this._indexOfValueByRule.next(-1);
  }

  removeValueByRule(index: number) {
    const formArray: FormArray = this.levelCompensationFormGroup.get('valoresCompensacionLabNivelVigencia') as FormArray;
    if (index == this._indexOfValueByRule.value){
      this.resetValueByRule();
    }else if(this._indexOfValueByRule.value > index){
      this._indexOfValueByRule.next(this._indexOfValueByRule.value - 1);
    }
    formArray.removeAt(index);
  }

  modifyValueByRule(index: number){
    const formArray: FormArray = this.levelCompensationFormGroup.get('valoresCompensacionLabNivelVigencia') as FormArray;
    const copy = Methods.cloneFormGroup(formArray.at(index) as FormGroup);
    this._indexOfValueByRule.next(index);
    this._valueByRuleFormGroup.next(copy);
  }

  cancelValueByRule(){
    this.resetValueByRule();
  }

  submitValueByRule(){
    const formArray: FormArray = this.levelCompensationFormGroup.get('valoresCompensacionLabNivelVigencia') as FormArray;
    const index = this._indexOfValueByRule.value;
    const formGroup = this._valueByRuleFormGroup.value;
    if(index < 0){
      formArray.push(formGroup);
    }else{
      formArray.removeAt(index); 
      formArray.insert(index, formGroup);
    }
    this.resetValueByRule();
  }

  resetValueByRule(){
    this._indexOfValueByRule.next(-1);
    this._valueByRuleFormGroup.next(null);
  }

  resetFormInformation(){
    this._mustRechargeLevelCompensationFormGroup.next(true);
    this._levelCompensation.next(null);
    this.levelCompensationFormGroup = null;
    this.resetValueByRule();
  }

  /************************ TO VALIDITY ***************************/
  setValidityToLevelCompensation(validity: Validity){
    const formGroup = this.levelCompensationFormGroup;
    formGroup?.get('idVigencia').markAsTouched();
    formGroup?.get('idVigencia').setValue(validity?.id);
    formGroup?.get('vigencia').setValue(validity);
    this.cleanValueInValidityOfValuesByRules();
  }

  updateValidityInLevelCompensation(validity: Validity){
    const formGroup = this.levelCompensationFormGroup;
    if(formGroup?.get('idVigencia').value == validity.id){
      formGroup.get('vigencia').setValue(validity);
      this.cleanValueInValidityOfValuesByRules();
    }
  }

  removeValidityInLevelCompensation(validityId: number){
    const formGroup = this.levelCompensationFormGroup;
    if(formGroup?.get('idVigencia').value == validityId){
      this.setValidityToLevelCompensation(null);
      this.cleanValueInValidityOfValuesByRules();
    }
  }

  /************************ TO COMPENSATION ***************************/
  setCompensationToLevelCompensation(compensation: Compensation){
    const formGroup = this.levelCompensationFormGroup;
    formGroup?.get('idCompensacionLaboral').markAsTouched();
    formGroup?.get('idCompensacionLaboral').setValue(compensation?.id);
    formGroup?.get('compensacionLaboral').setValue(compensation);
  }

  updateCompensationInLevelCompensation(compensation: Compensation){
    const formGroup = this.levelCompensationFormGroup;
    if(formGroup?.get('idCompensacionLaboral').value == compensation.id){
      formGroup.get('compensacionLaboral').setValue(compensation);
    }
  }

  removeCompensationInLevelCompensation(compensationId: number){
    const formGroup = this.levelCompensationFormGroup;
    if(formGroup?.get('idCompensacionLaboral').value == compensationId){
      this.setCompensationToLevelCompensation(null);
    }
  }

  /************************ TO RULE ***************************/
  setRuleToLevelCompensation(rule: Rule){
    const formGroup = this._valueByRuleFormGroup.value;
    formGroup?.get('idRegla').markAsTouched();
    formGroup?.get('idRegla').setValue(rule?.id);
    formGroup?.get('regla').setValue(rule);
  }

  updateRuleInLevelCompensation(rule: Rule){
    const formGroup = this._valueByRuleFormGroup.value;
    const formArray: FormArray = this.levelCompensationFormGroup.get('valoresCompensacionLabNivelVigencia') as FormArray;

    for (let i = formArray?.length - 1; i >= 0; i--) {
      const control = formArray.at(i);
      if (control.get('idRegla')?.value == rule.id) {
        control.get('regla').setValue(rule);
      }
    }
    //Si el elemento que se tiene modificando o creando es de la misma regla, entonces es actualizado también.
    if(formGroup?.get('idRegla').value == rule.id){
      formGroup.get('regla').setValue(rule);
    }
  }

  removeRuleInLevelCompensation(ruleId: number){
    const formGroup = this._valueByRuleFormGroup.value;
    const formArray: FormArray = this.levelCompensationFormGroup.get('valoresCompensacionLabNivelVigencia') as FormArray;
    let totalToMove = 0;
    let actualWasRemoved = false;
    const actualIndex = this._indexOfValueByRule.value;
    
    for (let i = formArray?.length - 1; i >= 0; i--) {
      const control = formArray.at(i);
      if (control.get('idRegla')?.value === ruleId) {
        formArray.removeAt(i);
        if (i < actualIndex){
          totalToMove += 1;
        }else if(i == actualIndex){
          actualWasRemoved = true;
        }
      }
    }
    //Actualizar el index del elemento que se encuentra editando a nueva posición, ya que pudo haberse desplazado
    this._indexOfValueByRule.next(actualIndex - totalToMove);

    /*Si el elemento que se tiene modificando o creando tiene en el momento la misma regla eliminada, o es un elemento 
    que parte de uno de esa regla, entonces es reestablecido a valores iniciales*/
    if(formGroup?.get('idRegla').value == ruleId){
      if(actualWasRemoved){
        this.resetValueByRule(); //El elemento es una modificación
      }else{
        this.setRuleToLevelCompensation(null); //El elemento es nuevo
      }
    }
  }


  /************************ TO VARIABLE ***************************/
  setVariableToLevelCompensation(variable: Variable){
    const formGroup = this._valueByRuleFormGroup.value;
    formGroup?.get('idVariable').markAsTouched();
    formGroup?.get('idVariable').setValue(variable?.id);
    formGroup?.get('variable').setValue(variable);
        
    //Removemos el valor de la variable en la vigencia si esta ha sido cambiado.
    formGroup?.get('valueInValidity').setValue(null);
  }

  updateVariableInLevelCompensation(variable: Variable){
    const formGroup = this._valueByRuleFormGroup.value;
    const formArray: FormArray = this.levelCompensationFormGroup.get('valoresCompensacionLabNivelVigencia') as FormArray;

    for (let i = formArray?.length - 1; i >= 0; i--) {
      const control = formArray.at(i);
      if (control.get('idVariable')?.value == variable.id) {
        control.get('variable').setValue(variable);
      }
    }
    //Si el elemento que se tiene modificando o creando es de la misma variable, entonces es actualizado también.
    if(formGroup?.get('idVariable').value == variable.id){
      formGroup.get('variable').setValue(variable);
    }
  }

  removeVariableInLevelCompensation(variableId: number){
    const formGroup = this._valueByRuleFormGroup.value;
    const formArray: FormArray = this.levelCompensationFormGroup.get('valoresCompensacionLabNivelVigencia') as FormArray;
    let totalToMove = 0;
    let actualWasRemoved = false;
    const actualIndex = this._indexOfValueByRule.value;
    
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
    this._indexOfValueByRule.next(actualIndex - totalToMove);

    /*Si el elemento que se tiene modificando o creando tiene en el momento la misma variable eliminada, o es un elemento 
    que parte de uno de esa variable, entonces es reestablecido a valores iniciales*/
    if(formGroup?.get('idVariable').value == variableId){
      if(actualWasRemoved){
        this.resetValueByRule(); //El elemento es una modificación
      }else{
        this.setVariableToLevelCompensation(null); //El elemento es nuevo
      }
    }
  }

  setValueInValidityOfValueByRule(variableId: number, valueInValidity: any) {
    const formGroup = this._valueByRuleFormGroup.value;
    const formArray: FormArray = this.levelCompensationFormGroup.get('valoresCompensacionLabNivelVigencia') as FormArray;
    for (let i = formArray?.length - 1; i >= 0; i--) {
      const control = formArray.at(i);
      if (control.get('idVariable')?.value === variableId) {
        control.get('valueInValidity').setValue(valueInValidity ?? 0);
      }
    }

    if (formGroup?.get('idVariable')?.value === variableId) {
      formGroup.get('valueInValidity').setValue(valueInValidity ?? 0);
    }
  }

  cleanValueInValidityOfValuesByRules(){
    const formGroup = this._valueByRuleFormGroup.value;
    const formArray: FormArray = this.levelCompensationFormGroup.get('valoresCompensacionLabNivelVigencia') as FormArray;
    for (let i = formArray?.length - 1; i >= 0; i--) {
      const control = formArray.at(i);
      control.get('valueInValidity').setValue(null);
    }
    formGroup?.get('valueInValidity').setValue(null);
  }

  private createValueByRuleFormGroup(valueByRule: ValueByRule){
    return this.formBuilder.group({
      id: valueByRule.id,
      idCompensacionLabNivelVigencia: [valueByRule.idCompensacionLabNivelVigencia],
      idRegla: [valueByRule.idRegla],
      idVariable: [valueByRule.idVariable, Validators.compose([Validators.required])],
      regla: valueByRule.regla,
      variable: valueByRule.variable,
      valueInValidity: null
    });
  }
}
