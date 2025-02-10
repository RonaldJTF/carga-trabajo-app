import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';
import { BehaviorSubject } from 'rxjs';
import { Appointment, Hierarchy, JobTitle, LevelGroupOfMultiAppointment, MultiAppointments, Normativity, OrganizationChart, SalaryScaleGroupOfMultiAppointment, Validity } from '@models';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Methods } from '@utils';
import { TreeNode } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class MultiAppointmentsService {
  private multiAppointmentsFormGroup: FormGroup;

  private _levelGroupFormGroup: BehaviorSubject<FormGroup> = new BehaviorSubject<FormGroup>(null);
  private _indexOfLevelGroup: BehaviorSubject<number> = new BehaviorSubject<number>(-1);
  private _mustRechargeMultiAppointmentsFormGroup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  private _multiAppointments: BehaviorSubject<MultiAppointments> = new BehaviorSubject<MultiAppointments>(null);

  public levelGroupFormGroup$ = this._levelGroupFormGroup.asObservable();
  public indexOfLevelGroup$ = this._indexOfLevelGroup.asObservable();
  public mustRechargeMultiAppointmentsFormGroup$ = this._mustRechargeMultiAppointmentsFormGroup.asObservable();
  public multiAppointments$ = this._multiAppointments.asObservable();

  constructor(
    private webRequestService: WebRequestService,
    private formBuilder : FormBuilder,
  ) { }

  /*********************************************************************************************************************/
  /*************************************** SECTION OF FORMS TO MULTIAPPOINTMENTS ***************************************/
  /*********************************************************************************************************************/

  setMustRechargeMultiAppointmentsFormGroup(mustRechargeMultiAppointmentsFormGroup: boolean){
    this._mustRechargeMultiAppointmentsFormGroup.next(mustRechargeMultiAppointmentsFormGroup);
  }

  getMultiAppointmentsFormGroup(){
    return this.multiAppointmentsFormGroup;
  }

  createMultiAppointmentsFormGroup(){
    this.resetFormInformation();
    this.multiAppointmentsFormGroup = this.formBuilder.group({
      idJerarquia: ['', Validators.required],
      idVigencia: ['', Validators.required],
      idAlcance: '',
      idNormatividad: ['', Validators.required],
      vigencia: null,
      hierarchyTreeNode: null,
      normatividad: null,
      idOrganigrama: '',
      organigrama: null,
      gruposNiveles: this.formBuilder.array([])
    })
    return this.multiAppointmentsFormGroup;
  }

  initializeMultiAppointmentsFormGroup(multiAppointments: MultiAppointments): FormGroup {
    this._multiAppointments.next(multiAppointments);
    const formArray: FormArray = this.multiAppointmentsFormGroup.get('gruposNiveles') as FormArray;
    const node: TreeNode<Hierarchy> = {
      data: multiAppointments.jerarquia,
      label: multiAppointments.jerarquia.dependencia.nombre,
      key: multiAppointments.idJerarquia.toString(),
      children: []
    };
    this.multiAppointmentsFormGroup.get('idJerarquia').setValue(multiAppointments.idJerarquia);
    this.multiAppointmentsFormGroup.get('idVigencia').setValue(multiAppointments.idVigencia);
    this.multiAppointmentsFormGroup.get('idNormatividad').setValue(multiAppointments.idNormatividad);
    this.multiAppointmentsFormGroup.get('idAlcance').setValue(multiAppointments.idAlcance);
    this.multiAppointmentsFormGroup.get('vigencia').setValue(multiAppointments.vigencia);
    this.multiAppointmentsFormGroup.get('normatividad').setValue(multiAppointments.normatividad);
    this.multiAppointmentsFormGroup.get('hierarchyTreeNode').setValue(node);
    this.multiAppointmentsFormGroup.get('idOrganigrama').setValue(multiAppointments.jerarquia.idOrganigrama);
    
    multiAppointments.gruposNiveles?.forEach(e => {
      formArray.push(this.createLevelGroupFormGroup(e));
    })
    return this.multiAppointmentsFormGroup;
  }

  setNewLevelGroup(levelGroup: LevelGroupOfMultiAppointment) {
    this._levelGroupFormGroup.next(this.createLevelGroupFormGroup(levelGroup));
    this._indexOfLevelGroup.next(-1);
  }

  removeLevelGroup(index: number) {
    const formArray: FormArray = this.multiAppointmentsFormGroup.get('gruposNiveles') as FormArray;
    if (index == this._indexOfLevelGroup.value){
      this._indexOfLevelGroup.next(-1);
      this._levelGroupFormGroup.next(null);
    }else if(this._indexOfLevelGroup.value > index){
      this._indexOfLevelGroup.next(this._indexOfLevelGroup.value - 1);
    }
    formArray.removeAt(index);
  }

  modifyLevelGroup(index: number){
    const formArray: FormArray = this.multiAppointmentsFormGroup.get('gruposNiveles') as FormArray;
    const copy = Methods.cloneFormGroup(formArray.at(index) as FormGroup);
    this._indexOfLevelGroup.next(index);
    this._levelGroupFormGroup.next(copy);
  }

  cancelLevelGroup(){
    this.resetLevelGroup();
  }

  submitLevelGroup(){
    const formArray: FormArray = this.multiAppointmentsFormGroup.get('gruposNiveles') as FormArray;
    const index = this._indexOfLevelGroup.value;
    const formGroup = this._levelGroupFormGroup.value;
    if(index < 0){
      formArray.push(formGroup);
    }else{
      formArray.removeAt(index);
      formArray.insert(index, formGroup);
    }
    this.resetLevelGroup();
  }

  resetFormInformation(){
    this._mustRechargeMultiAppointmentsFormGroup.next(true);
    this._multiAppointments.next(null);
    this.multiAppointmentsFormGroup = null;
    this.resetLevelGroup();
  }

  resetLevelGroup(){
    this._indexOfLevelGroup.next(-1);
    this._levelGroupFormGroup.next(null);
  }

  setValidityToMultiAppointments(validity: Validity){
    const formGroup = this.multiAppointmentsFormGroup;
    formGroup?.get('idVigencia').markAsTouched();
    formGroup?.get('idVigencia').setValue(validity?.id);
    formGroup?.get('vigencia').setValue(validity);
  }

  updateValidityInMultiAppointments(validity: Validity){
    const formGroup = this.multiAppointmentsFormGroup;
    if(formGroup?.get('idVigencia').value == validity.id){
      formGroup.get('vigencia').setValue(validity);
    }
  }

  removeValidityInMultiAppointments(validityId: number){
    const formGroup = this.multiAppointmentsFormGroup;
    if(formGroup?.get('idVigencia').value == validityId){
      this.setValidityToMultiAppointments(null);
    }
  }

  setNormativityToMultiAppointments(normativity: Normativity){
    const formGroup = this.multiAppointmentsFormGroup;
    formGroup?.get('idNormatividad').markAsTouched();
    formGroup?.get('idNormatividad').setValue(normativity?.id);
    formGroup?.get('normatividad').setValue(normativity);
    formGroup?.get('idAlcance').setValue(normativity?.idAlcance);
  }

  updateNormativityInMultiAppointments(normativity: Normativity){
    const formGroup = this.multiAppointmentsFormGroup;
    if(formGroup?.get('idNormatividad').value == normativity.id){
      formGroup.get('normatividad').setValue(normativity);
    }
  }

  removeNormativityInMultiAppointments(normativityId: number){
    const formGroup = this.multiAppointmentsFormGroup;
    if(formGroup?.get('idNormatividad').value == normativityId){
      this.setNormativityToMultiAppointments(null);
    }
  }

  setOrganizationChartToMultiAppointments(organizationChart: OrganizationChart){
    const formGroup = this.multiAppointmentsFormGroup;
    formGroup?.get('idOrganigrama').setValue(organizationChart?.id);
    formGroup?.get('organigrama').setValue(organizationChart);
  }

  setHierarchyToMultiAppointments(node: TreeNode<Hierarchy>){
    const formGroup = this.multiAppointmentsFormGroup;
    formGroup?.get('idJerarquia').markAsTouched();
    formGroup?.get('idJerarquia').setValue(node?.data?.id);
  }

  updateLevelGroup(levelGroup: LevelGroupOfMultiAppointment) {
    this._levelGroupFormGroup.next(this.createLevelGroupFormGroup(levelGroup));
  }

  setNewSalaryScaleGroup(salaryScaleGroup: SalaryScaleGroupOfMultiAppointment) {
    const levelGroupFormGroup = this._levelGroupFormGroup.value;
    const formArray: FormArray = levelGroupFormGroup.get('gruposEscalasSalariales') as FormArray;
    formArray.push(this.createSalaryScaleGroupFormGroup(salaryScaleGroup));
    this._levelGroupFormGroup.next(levelGroupFormGroup);
  }

  removeSalaryScaleGroup(indexOfSalaryScaleGroup: number) {
    const levelGroupFormGroup = this._levelGroupFormGroup.value;
    const formArray: FormArray = levelGroupFormGroup.get('gruposEscalasSalariales') as FormArray;
    formArray.removeAt(indexOfSalaryScaleGroup);
    this._levelGroupFormGroup.next(levelGroupFormGroup);
  }

  setNewJobTitle(jobTitle: JobTitle, indexOfSalaryScaleGroup: number) {
    const levelGroupFormGroup = this._levelGroupFormGroup.value;
    const formArray: FormArray = levelGroupFormGroup.get('gruposEscalasSalariales') as FormArray;
    const jobTitleFormArray: FormArray = (formArray.at(indexOfSalaryScaleGroup) as FormGroup).get('denominacionesEmpleos') as FormArray;
    jobTitleFormArray.push(this.createJobTitleFormGroup(jobTitle));
    this._levelGroupFormGroup.next(levelGroupFormGroup);
  }

  removeJobTitle(indexOfJobTitle: number, indexOfSalaryScaleGroup: number) {
    const levelGroupFormGroup = this._levelGroupFormGroup.value;
    const formArray: FormArray = levelGroupFormGroup.get('gruposEscalasSalariales') as FormArray;
    const jobTitleFormArray: FormArray = (formArray.at(indexOfSalaryScaleGroup) as FormGroup).get('denominacionesEmpleos') as FormArray;
    jobTitleFormArray.removeAt(indexOfJobTitle);
    this._levelGroupFormGroup.next(levelGroupFormGroup);
  }

  removeJobTitleToMultiAppointments(indexOfJobTitle: number, indexOfSalaryScaleGroup: number, indexOfLevelgroup: number) {
    const levelGroupFormGroup = (this.multiAppointmentsFormGroup.get('gruposNiveles') as FormArray).at(indexOfLevelgroup);
    const formArray: FormArray = levelGroupFormGroup.get('gruposEscalasSalariales') as FormArray;
    const jobTitleFormArray: FormArray = (formArray.at(indexOfSalaryScaleGroup) as FormGroup).get('denominacionesEmpleos') as FormArray;
    jobTitleFormArray.removeAt(indexOfJobTitle);
  }

  removeSalaryScaleGroupToMultiAppointments(indexOfSalaryScaleGroup: number, indexOfLevelgroup: number) {
    const levelGroupFormGroup = (this.multiAppointmentsFormGroup.get('gruposNiveles') as FormArray).at(indexOfLevelgroup);
    const formArray: FormArray = levelGroupFormGroup.get('gruposEscalasSalariales') as FormArray;
    formArray.removeAt(indexOfSalaryScaleGroup) ;
  }

  transformAppointmentsToMultiAppointments(appointments: Appointment[]): MultiAppointments{
    if (!appointments) return null;
    appointments.sort((a, b) => 
      a.idVigencia - b.idVigencia || 
      a.idAlcance - b.idAlcance || 
      a.idJerarquia - b.idJerarquia || 
      a.idNivel - b.idNivel || 
      ((a.idEscalaSalarial ?? Number.MAX_SAFE_INTEGER) - (b.idEscalaSalarial ?? Number.MAX_SAFE_INTEGER))
    );

    const firstAppointment = appointments[0];
    const sameGroup = appointments.every(item => 
        item.idJerarquia === firstAppointment.idJerarquia &&
        item.idVigencia === firstAppointment.idVigencia &&
        item.idAlcance === firstAppointment.idAlcance
    );
    if (!sameGroup) {
      throw new Error("Los elementos de la lista no tienen los mismos valores de Jerarquia, Vigencia y Alcance");
    }

    let multiAppointments: MultiAppointments = {
      idJerarquia: firstAppointment.idJerarquia,
      idNormatividad: firstAppointment.idNormatividad,
      idAlcance: firstAppointment.idAlcance,
      idVigencia: firstAppointment.idVigencia,
      jerarquia: firstAppointment.jerarquia,
      normatividad: firstAppointment.normatividad,
      alcance: firstAppointment.alcance,
      vigencia: firstAppointment.vigencia,
      gruposNiveles: []

    } as MultiAppointments;

    let levelId = -1;
    let levelGroupOfMultiAppointment: LevelGroupOfMultiAppointment;
    for (let appointment of appointments){
      if (levelId != appointment.idNivel){
        levelGroupOfMultiAppointment = {
          idNivel: appointment.idNivel,
          nivel: appointment.nivel,
          gruposEscalasSalariales: []
        } as LevelGroupOfMultiAppointment;
        levelId = appointment.idNivel;
      }
      levelGroupOfMultiAppointment.gruposEscalasSalariales.push(
        {
          idCargo: appointment.id,
          idEscalaSalarial: appointment.idEscalaSalarial,
          escalaSalarial: appointment.escalaSalarial,
          asignacionBasicaMensual: appointment.asignacionBasicaMensual,
          totalCargos: appointment.totalCargos,
          denominacionesEmpleos: appointment.denominacionesEmpleos
        } as SalaryScaleGroupOfMultiAppointment
      );
      multiAppointments.gruposNiveles.push(levelGroupOfMultiAppointment);
    }
    return multiAppointments;  
  }

  transformMultiAppointmentsToAppointments(multiAppointments: MultiAppointments): Appointment[] {
    if (!multiAppointments) return [];
    let appointments: Appointment[] = [];
    for (let levelGroup of multiAppointments.gruposNiveles) {
      for (let salaryScaleGroup of levelGroup.gruposEscalasSalariales) {
        let appointment: Appointment = {
          id: salaryScaleGroup.idCargo,
          idEscalaSalarial: salaryScaleGroup.idEscalaSalarial,
          escalaSalarial: salaryScaleGroup.escalaSalarial,
          asignacionBasicaMensual: salaryScaleGroup.asignacionBasicaMensual,
          totalCargos: salaryScaleGroup.denominacionesEmpleos.reduce((acc, e) => e.totalCargos + acc, 0) ?? 0,
          denominacionesEmpleos: salaryScaleGroup.denominacionesEmpleos,
          idNivel: levelGroup.idNivel,
          nivel: levelGroup.nivel,
          idJerarquia: multiAppointments.idJerarquia,
          idNormatividad: multiAppointments.idNormatividad,
          idAlcance: multiAppointments.idAlcance,
          idVigencia: multiAppointments.idVigencia,
          jerarquia: multiAppointments.jerarquia,
          normatividad: multiAppointments.normatividad,
          alcance: multiAppointments.alcance,
          vigencia: multiAppointments.vigencia
        } as Appointment;
        appointments.push(appointment);
      }
    }
    return appointments;
}


  private createLevelGroupFormGroup(levelGroup: LevelGroupOfMultiAppointment){
    let form = this.formBuilder.group({
      idNivel: [levelGroup.idNivel, Validators.required],
      nivel: levelGroup.nivel,
      gruposEscalasSalariales: this.formBuilder.array([], Validators.required)
    });
    const formArray: FormArray = form.get('gruposEscalasSalariales') as FormArray;
    levelGroup.gruposEscalasSalariales?.forEach(e => {
      formArray.push(this.createSalaryScaleGroupFormGroup(e));
    })
    return form;
  }

  private createSalaryScaleGroupFormGroup(salaryScaleGroupOfMultiAppointment: SalaryScaleGroupOfMultiAppointment){
    let form = this.formBuilder.group({
      idCargo: salaryScaleGroupOfMultiAppointment.idCargo,
      idEscalaSalarial: salaryScaleGroupOfMultiAppointment.idEscalaSalarial,
      escalaSalarial: salaryScaleGroupOfMultiAppointment.escalaSalarial,
      totalCargos: salaryScaleGroupOfMultiAppointment.totalCargos,
      asignacionBasicaMensual: [salaryScaleGroupOfMultiAppointment.asignacionBasicaMensual, Validators.compose([Validators.required, Validators.min(0)])],
      denominacionesEmpleos: this.formBuilder.array([], Validators.required)
    });

    const formArray: FormArray = form.get('denominacionesEmpleos') as FormArray;
    salaryScaleGroupOfMultiAppointment.denominacionesEmpleos?.forEach(e => {
      formArray.push(this.createJobTitleFormGroup(e));
    })
    return form;
  }

  private createJobTitleFormGroup(jobTitle: JobTitle){
    return this.formBuilder.group({
      id: [jobTitle.id, Validators.required],
      nombre: jobTitle.nombre,
      totalCargos: [jobTitle.totalCargos, Validators.compose([Validators.required, Validators.min(0)])],
    });
  }
}
