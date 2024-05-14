import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducers';
import { Activity } from 'src/app/models/activity';
import { Level } from 'src/app/models/level';
import * as StructureActions from "./../../../../../store/structure.actions";
import { MESSAGE } from 'src/labels/labels';
import { StructureService } from 'src/app/services/structure.service';
import { LevelService } from 'src/app/services/level.service';
import { ValidateRange } from 'src/app/validations/validateRange';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit, OnDestroy {

  MESSAGE = MESSAGE; 

  formActivity !: FormGroup;
  idEstructura: number;
  activity: Activity;

  updateMode: boolean;
  creatingOrUpdating: boolean = false;
  deleting: boolean = false;

  tiempoMaximoSubscription: Subscription;
  tiempoMinimoSubscription: Subscription;

  levels: Level[];
  updatingValueValidity = false;

  constructor(
    private store: Store<AppState>,
    private structureService: StructureService,
    private levelService: LevelService,
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ){}

  ngOnInit(): void {
    this.buildForm();
    this.idEstructura = this.route.snapshot.queryParams['idStructure'];
    this.loadActivity(this.route.snapshot.queryParams['idActivity']);
    this.loadNivels();

    this.tiempoMaximoSubscription = this.formActivity.get('tiempoMaximo').valueChanges.subscribe(_ => {
      if (!this.updatingValueValidity) {
        this.updatingValueValidity = true;
        this.tiempoPromedio.updateValueAndValidity();
        this.tiempoMinimo.updateValueAndValidity();
        this.updatingValueValidity = false;
      }
    });

    this.tiempoMinimoSubscription = this.formActivity.get('tiempoMinimo').valueChanges.subscribe(_ => {
      if (!this.updatingValueValidity) {
        this.updatingValueValidity = true;
        this.tiempoPromedio.updateValueAndValidity();
        this.tiempoMaximo.updateValueAndValidity();
        this.updatingValueValidity = false;
      }
    });
  }

  ngOnDestroy(){
    this.tiempoMaximoSubscription?.unsubscribe();
    this.tiempoMinimoSubscription?.unsubscribe();
  }

  get tiempoMaximo(): FormControl{
    return this.formActivity.get('tiempoMaximo') as FormControl;
  }
  get tiempoMinimo(): FormControl{
    return this.formActivity.get('tiempoMinimo') as FormControl;
  }
  get tiempoPromedio(): FormControl{
    return this.formActivity.get('tiempoPromedio') as FormControl;
  }

  get tiempoMaximoInHours(): number{
    return this.tiempoMaximo.value !==null ? parseFloat((this.tiempoMaximo.value/60).toFixed(2)) : null;
  }

  get tiempoMinimoInHours(): number{
    return this.tiempoMinimo.value !==null ? parseFloat((this.tiempoMinimo.value/60).toFixed(2)) : null;
  }
  get tiempoPromedioInHours(): number{
    return this.tiempoPromedio.value !==null ? parseFloat((this.tiempoPromedio.value/60).toFixed(2)) : null;
  }

  buildForm(){
    this.formActivity= this.formBuilder.group({
      frecuencia: [null, Validators.compose([Validators.required, Validators.min(0)])],
      tiempoMaximo: [null, Validators.compose([Validators.required, Validators.min(0), ValidateRange.validateUpper('tiempoMinimo')])],
      tiempoMinimo: [null, Validators.compose([Validators.required, Validators.min(0), ValidateRange.validateLower('tiempoMaximo')])],
      tiempoPromedio: [null, Validators.compose([
        Validators.required, Validators.min(0),
        ValidateRange.validateBetween('tiempoMinimo', 'tiempoMaximo')
      ])],
      nivel: [null, Validators.required],
    })
  }

  loadActivity(id: number){
    if (id == undefined){
      this.updateMode = false;
    }else{
      this.structureService.getActivityById(id).subscribe({
        next: (e) => {
          this.activity = e;
          this.assignValuesToForm();
        },
      });
      this.updateMode = true;
    }
  }

  loadNivels(){
    this.levelService.getLevels().subscribe({
      next: (e) => {
        this.levels = e;
      },
    });
  }

  assignValuesToForm(){
    this.formActivity.get('frecuencia').setValue(this.activity.frecuencia);
    this.formActivity.get('tiempoMaximo').setValue(this.activity.tiempoMaximo);
    this.formActivity.get('tiempoMinimo').setValue(this.activity.tiempoMinimo);
    this.formActivity.get('tiempoPromedio').setValue(this.activity.tiempoPromedio);
    this.formActivity.get('nivel').setValue({id: this.activity.idNivel});

  }

  updateActivity(id: number, payload: any): void {
    this.structureService.updateActivity(id, payload).subscribe({
      next: (e) => {
        this.store.dispatch(StructureActions.setActivityToStructure({activity: e as Activity}));
        this.goBack();
        this.creatingOrUpdating = false;
      },
      error: (error) => {
        this.creatingOrUpdating = false;
      },
    });
  }

  createActivity(payload: any): void {
    this.structureService.createActivity(payload).subscribe({
      next: (e) => {
        this.store.dispatch(StructureActions.setActivityToStructure({activity: e as Activity}));
        this.goBack();
        this.creatingOrUpdating = false;
      },
      error: (error) => {
        this.creatingOrUpdating = false;
      },
    });
  }
  
  onSubmitActivity(event : Event): void {
    let payload = {...this.activity, ...this.formActivity.value}
    payload.idNivel = payload.nivel?.id
    payload.idEstructura = this.idEstructura;
    event.preventDefault();
    if (this.formActivity.invalid) {
      this.formActivity.markAllAsTouched();
    } else {
      this.creatingOrUpdating = true;
      this.updateMode ? this.updateActivity(this.activity.id, payload) : this.createActivity(payload);
    }
  }

  onDeleteActivity(event : Event): void {
    event.preventDefault();
    this.deleting = true;
    this.structureService.deleteActivity(this.activity.id).subscribe({
      next: () => {
        this.store.dispatch(StructureActions.removeActivityFromStructure({idStructure: this.activity.idEstructura}));
        this.goBack();
        this.deleting = false;
      },
      error: (error) => {
        this.deleting = false;
      },
    });
  }

  onCancelActivity(event : Event): void {
    event.preventDefault();
    this.goBack();
  }

  goBack() {
    this.router.navigate(['configurations/structures'], {
      skipLocationChange: true,
    });
  }
}
