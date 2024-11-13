import {Injectable} from '@angular/core';
import {WebRequestService} from "./web-request.service";
import {BehaviorSubject, Observable, of} from "rxjs";
import {Validity, LevelCompensation, Level, Compensation, Category, SalaryScale, Normativity, Rule, Variable} from "@models";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class LevelCompensationService {
  private pathLevelCompensation = 'level-compensation';

  private levelCompensationFormGroup: FormGroup;

  private _mustRechargeLevelCompensationFormGroup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true); 
  private _levelCompensation: BehaviorSubject<LevelCompensation> = new BehaviorSubject<LevelCompensation>(null); 

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
      idVariable: ['', Validators.required],
      idRegla: ['', Validators.required],
      idNivel: levelId,
      vigencia: null,
      compensacionLaboral: null,
      regla: null,
      variable: null,
    })
    return this.levelCompensationFormGroup;
  }

  initializeLevelCompensationFormGroup(levelCompensation: LevelCompensation): FormGroup {
    this._levelCompensation.next(levelCompensation);
    this.levelCompensationFormGroup.get('idVigencia').setValue(levelCompensation.idVigencia);
    this.levelCompensationFormGroup.get('idEscalaSalarial').setValue(levelCompensation.idEscalaSalarial);
    this.levelCompensationFormGroup.get('idCompensacionLaboral').setValue(levelCompensation.idCompensacionLaboral);
    this.levelCompensationFormGroup.get('idVariable').setValue(levelCompensation.idVariable);
    this.levelCompensationFormGroup.get('idRegla').setValue(levelCompensation.idRegla);
    this.levelCompensationFormGroup.get('idNivel').setValue(levelCompensation.idNivel);
    this.levelCompensationFormGroup.get('vigencia').setValue(levelCompensation.vigencia);
    this.levelCompensationFormGroup.get('compensacionLaboral').setValue(levelCompensation.compensacionLaboral);
    this.levelCompensationFormGroup.get('regla').setValue(levelCompensation.regla);
    this.levelCompensationFormGroup.get('variable').setValue(levelCompensation.variable);
    return this.levelCompensationFormGroup;
  }

  resetFormInformation(){
    this._mustRechargeLevelCompensationFormGroup.next(true);
    this._levelCompensation.next(null);
    this.levelCompensationFormGroup = null;
  }

  /************************ TO VALIDITY ***************************/
  setValidityToLevelCompensation(validity: Validity){
    const formGroup = this.levelCompensationFormGroup;
    formGroup?.get('idVigencia').markAsTouched();
    formGroup?.get('idVigencia').setValue(validity?.id);
    formGroup?.get('vigencia').setValue(validity);
  }

  updateValidityInLevelCompensation(validity: Validity){
    const formGroup = this.levelCompensationFormGroup;
    if(formGroup?.get('idVigencia').value == validity.id){
      formGroup.get('vigencia').setValue(validity);
    }
  }

  removeValidityInLevelCompensation(validityId: number){
    const formGroup = this.levelCompensationFormGroup;
    if(formGroup?.get('idVigencia').value == validityId){
      this.setValidityToLevelCompensation(null);
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
    const formGroup = this.levelCompensationFormGroup;
    formGroup?.get('idRegla').markAsTouched();
    formGroup?.get('idRegla').setValue(rule?.id);
    formGroup?.get('regla').setValue(rule);
  }

  updateRuleInLevelCompensation(rule: Rule){
    const formGroup = this.levelCompensationFormGroup;
    if(formGroup?.get('idRegla').value == rule.id){
      formGroup.get('regla').setValue(rule);
    }
  }

  removeRuleInLevelCompensation(ruleId: number){
    const formGroup = this.levelCompensationFormGroup;
    if(formGroup?.get('idRegla').value == ruleId){
      this.setRuleToLevelCompensation(null);
    }
  }

  /************************ TO VARIABLE ***************************/
  setVariableToLevelCompensation(variable: Variable){
    const formGroup = this.levelCompensationFormGroup;
    formGroup?.get('idVariable').markAsTouched();
    formGroup?.get('idVariable').setValue(variable?.id);
    formGroup?.get('variable').setValue(variable);
  }

  updateVariableInLevelCompensation(variable: Variable){
    const formGroup = this.levelCompensationFormGroup;
    if(formGroup?.get('idVariable').value == variable.id){
      formGroup.get('variable').setValue(variable);
    }
  }

  removeVariableInLevelCompensation(variableId: number){
    const formGroup = this.levelCompensationFormGroup;
    if(formGroup?.get('idVariable').value == variableId){
      this.setVariableToLevelCompensation(null);
    }
  }

}
