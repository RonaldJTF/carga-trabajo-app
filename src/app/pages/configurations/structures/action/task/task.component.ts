import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducers';
import { Activity } from 'src/app/models/activity';
import { Level } from 'src/app/models/level';
import { LevelService } from 'src/app/services/level.service';
import { StructureService } from 'src/app/services/structure.service';
import * as StructureActions from "./../../../../../store/structure.actions";
import { MESSAGE } from 'src/labels/labels';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {

  MESSAGE = MESSAGE; 

  formActivity !: FormGroup;
  idEstructura: number;
  activity: Activity;

  updateMode: boolean;
  creatingOrUpdating: boolean = false;
  deleting: boolean = false;

  levels: Level[];

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
  }

  buildForm(){
    this.formActivity= this.formBuilder.group({
      frecuencia: [null, Validators.compose([Validators.required, Validators.min(0)])],
      tiempoMaximo: [null, Validators.compose([Validators.required, Validators.min(0)])],
      tiempoMinimo: [null, Validators.compose([Validators.required, Validators.min(0)])],
      tiempoPromedio: [null, Validators.compose([Validators.required, Validators.min(0)])],
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
        this.location.back();
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
        this.location.back();
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
        this.location.back();
        this.deleting = false;
      },
      error: (error) => {
        this.deleting = false;
      },
    });
  }

  onCancelActivity(event : Event): void {
    event.preventDefault();
    this.location.back();
  }
}
