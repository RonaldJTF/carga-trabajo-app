import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Level, Normativity, SalaryScale } from '@models';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Methods } from '@utils';

@Injectable({
  providedIn: 'root'
})
export class LevelService {
  private pathLevel: string = 'level';
  private levelFormGroup: FormGroup;

  private _salaryScaleFormGroup: BehaviorSubject<FormGroup> = new BehaviorSubject<FormGroup>(null); 
  private _indexOfSalaryScale: BehaviorSubject<number> = new BehaviorSubject<number>(-1); 
  private _mustRechargeLevelFormGroup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true); 
  private _level: BehaviorSubject<Level> = new BehaviorSubject<Level>(null); 

  public salaryScaleFormGroup$ = this._salaryScaleFormGroup.asObservable();
  public indexOfSalaryScale$ = this._indexOfSalaryScale.asObservable();
  public mustRechargeLevelFormGroup$ = this._mustRechargeLevelFormGroup.asObservable();
  public level$ = this._level.asObservable();

  constructor(
    private webRequestService: WebRequestService,
    private formBuilder : FormBuilder,
  ) { }

  getLevelById(id: number) {
    return this.webRequestService.getWithHeaders(`${this.pathLevel}/${id}`);
  }

  getLevels(): Observable<Level[]>{
    return this.webRequestService.getWithHeaders(this.pathLevel);
  }

  createLevel(level: any): Observable<any> {
    return this.webRequestService.postWithHeaders(this.pathLevel, level);
  }

  updateLevel(id: number, level: Level): Observable<any> {
    return this.webRequestService.putWithHeaders(`${this.pathLevel}/${id}`, level);
  }

  deleteLevel(idLevel: number): Observable<Level> {
    return this.webRequestService.deleteWithHeaders(`${this.pathLevel}/${idLevel}`);
  }

  deleteSelectedLevel(payload: number[]): Observable<Level[]> {
    return this.webRequestService.deleteWithHeaders(this.pathLevel, undefined, payload);
  }

  getSalaryScalesByLevelId(levelId: number) {
    return this.webRequestService.getWithHeaders(`${this.pathLevel}/salary-scale`, {idNivel: levelId});
  }

  getSalaryScalesByLevelIdAndActive(levelId: number) {
    return this.webRequestService.getWithHeaders(`${this.pathLevel}/salary-scale`, {idNivel: levelId, estado: '1'});
  }

  deleteSalaryScale(idSalaryScale: number){
    return this.webRequestService.deleteWithHeaders(`${this.pathLevel}/salary-scale/${idSalaryScale}`);
  }

  /*********************************************************************************************************************/
  /********************************************* SECTION OF FORMS TO LEVEL *********************************************/
  /*********************************************************************************************************************/

  setMustRechargeLevelFormGroup(mustRechargeLevelFormGroup: boolean){
    this._mustRechargeLevelFormGroup.next(mustRechargeLevelFormGroup);
  }

  getLevelFormGroup(){
    return this.levelFormGroup;
  }

  createLevelFormGroup(){
    this.resetFormInformation();
    this.levelFormGroup = this.formBuilder.group({
      descripcion: ['', Validators.required],
      escalasSalariales: this.formBuilder.array([])
    })
    return this.levelFormGroup;
  }

  initializeLevelFormGroup(level: Level): FormGroup {
    this._level.next(level);
    const formArray: FormArray = this.levelFormGroup.get('escalasSalariales') as FormArray;
    this.levelFormGroup.get('descripcion').setValue(level.descripcion);
    level.escalasSalariales?.forEach(e => {
      formArray.push(this.createSalaryScaleFormGroup(e));
    })
    this.orderSalaryScalesFormArray(formArray);
    return this.levelFormGroup;
  }

  setNewSalaryScale(salaryScale: SalaryScale) {
    this._salaryScaleFormGroup.next(this.createSalaryScaleFormGroup(salaryScale));
    this._indexOfSalaryScale.next(-1);
  }

  removeSalaryScale(index: number) {
    const formArray: FormArray = this.levelFormGroup.get('escalasSalariales') as FormArray;
    if (index == this._indexOfSalaryScale.value){
      this._indexOfSalaryScale.next(-1);
      this._salaryScaleFormGroup.next(null);
    }else if(this._indexOfSalaryScale.value > index){
      this._indexOfSalaryScale.next(this._indexOfSalaryScale.value - 1);
    }
    formArray.removeAt(index);
  }

  modifySalaryScale(index: number){
    const formArray: FormArray = this.levelFormGroup.get('escalasSalariales') as FormArray;
    const copy = Methods.cloneFormGroup(formArray.at(index) as FormGroup);
    this._indexOfSalaryScale.next(index);
    this._salaryScaleFormGroup.next(copy);
  }

  cancelSalaryScale(){
    this.resetSalaryScale();
  }

  submitSalaryScale(){
    const formArray: FormArray = this.levelFormGroup.get('escalasSalariales') as FormArray;
    const index = this._indexOfSalaryScale.value;
    const formGroup = this._salaryScaleFormGroup.value;
    if(index < 0){
      formArray.push(formGroup);
    }else{
      formArray.removeAt(index); 
      formArray.insert(index, formGroup);
    }
    this.orderSalaryScalesFormArray(formArray);
    this.resetSalaryScale();
  }

  resetFormInformation(){
    this._mustRechargeLevelFormGroup.next(true);
    this._level.next(null);
    this.levelFormGroup = null;
    this.resetSalaryScale();
  }

  resetSalaryScale(){
    this._indexOfSalaryScale.next(-1);
    this._salaryScaleFormGroup.next(null);
  }

  setNormativityToSalaryScale(normativity: Normativity){
    const formGroup = this._salaryScaleFormGroup.value;
    formGroup?.get('idNormatividad').markAsTouched();
    formGroup?.get('idNormatividad').setValue(normativity?.id);
    formGroup?.get('normatividad').setValue(normativity);
  }

  removeSalaryScalesByNormativity(normativityId: number){
    const formGroup = this._salaryScaleFormGroup.value;
    const formArray: FormArray = this.levelFormGroup?.get('escalasSalariales') as FormArray;
    let totalToMove = 0;
    let actualWasRemoved = false;
    const actualIndex = this._indexOfSalaryScale.value;
    
    for (let i = formArray?.length - 1; i >= 0; i--) {
      const control = formArray.at(i);
      if (control.get('idNormatividad')?.value === normativityId) {
        formArray.removeAt(i);
        if (i < actualIndex){
          totalToMove += 1;
        }else if(i == actualIndex){
          actualWasRemoved = true;
        }
      }
    }
    //Actualizar el index del elemento que se encuentra editando a nueva posición, ya que pudo haberse desplazado
    this._indexOfSalaryScale.next(actualIndex - totalToMove);

    /*Si el elemento que se tiene modificando o creando tiene en el momento la misma normatividad eliminada, o es un elemento 
    que parte de uno de esa normatividad, entonces es reestablecido a valores iniciales*/
    if(formGroup?.get('idNormatividad').value == normativityId){
      if(actualWasRemoved){
        this.resetSalaryScale(); //El elemento es una modificación
      }else{
        this.setNormativityToSalaryScale(null); //El elemento es nuevo
      }
    }
  }

  updateNormativityInSalaryScales(normativity: Normativity){
    const formGroup = this._salaryScaleFormGroup.value;
    const formArray: FormArray = this.levelFormGroup?.get('escalasSalariales') as FormArray;

    for (let i = formArray?.length - 1; i >= 0; i--) {
      const control = formArray.at(i);
      if (control.get('idNormatividad')?.value == normativity.id) {
        control.get('normatividad').setValue(normativity);
        this.reassingState (control, normativity);
      }
    }
    //Si el elemento que se tiene modificando o creando es de la misma normatividad, entonces es actualizado también.
    if(formGroup?.get('idNormatividad').value == normativity.id){
      formGroup.get('normatividad').setValue(normativity);
      this.reassingState (formGroup, normativity);
    }
  }
  
  /**
   * Ajustamos el estado de la escala salarial en función del nuevo estado de la normatividad que lo rige.
   * Si el estado es inactivo, entonces cambia a inactivo el estado de las escalas salariales.
   * @param control 
   * @param state 
   */
  private reassingState(control: AbstractControl, normativity: Normativity){
    if (!Methods.parseStringToBoolean(normativity.estado)){
      control.get('estado').setValue(false);
    }
  }

  private createSalaryScaleFormGroup(salaryScale: SalaryScale){
    return this.formBuilder.group({
      id: salaryScale.id,
      idNivel: [salaryScale.idNivel],
      nombre: [salaryScale.nombre, Validators.required],
      codigo: [salaryScale.codigo, Validators.compose([Validators.required])],
      idNormatividad: [salaryScale.idNormatividad, Validators.compose([Validators.required])],
      incrementoPorcentual: salaryScale.incrementoPorcentual,
      estado: Methods.parseStringToBoolean(salaryScale.estado),
      normatividad: salaryScale.normatividad
    });
  }

  private orderSalaryScalesFormArray(formArray: FormArray){
    let orderControls = (a: FormGroup, b: FormGroup) => {
      const idNormatividadA = a.get('idNormatividad').value;
      const idNormatividadB = b.get('idNormatividad').value;

      if (idNormatividadA < idNormatividadB) return -1;
      if (idNormatividadA > idNormatividadB) return 1;
      return (a.get('nombre').value ?? '').localeCompare(b.get('nombre').value);
    }
    formArray.controls.sort(orderControls);
  }
}
