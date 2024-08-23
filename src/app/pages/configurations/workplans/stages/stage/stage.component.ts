import {Component, OnInit} from '@angular/core';
import * as StageActions from "@store/stage.actions";
import {ActivatedRoute, Router} from "@angular/router";
import {Stage} from "@models";
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducers';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {CryptojsService, UrlService, WorkplanService} from "@services";

@Component({
  selector: 'app-stage',
  templateUrl: './stage.component.html',
  styleUrls: ['./stage.component.scss']
})
export class StageComponent implements OnInit {
  formStage !: FormGroup;
  stage: Stage;
  updateMode: boolean;
  creatingOrUpdating: boolean = false;
  deleting: boolean = false;

  idWorkplan: number;
  idParent: number;

  constructor(
    private store: Store<AppState>,
    private workplanService: WorkplanService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private urlService: UrlService,
    private cryptoService: CryptojsService
  ){}

  ngOnInit(): void {
    this.idWorkplan = this.cryptoService.decryptParamAsNumber(this.route.snapshot.queryParams['idWorkplan']);
    this.idParent = this.cryptoService.decryptParamAsNumber(this.route.snapshot.queryParams['idParent']);
    this.buildForm();
    this.loadStage(this.cryptoService.decryptParamAsNumber(this.route.snapshot.params['id']));
  }

  buildForm(){
    this.formStage= this.formBuilder.group({
      nombre: ['', Validators.required],
      descripcion: ''
    })
  }

  loadStage(id: number){
    if (id == undefined){
      this.updateMode = false;
    }else{
      this.workplanService.getStage(id).subscribe({
        next: (e) => {
          this.stage = e;
          this.assignValuesToForm();
        },
      });
      this.updateMode = true;
    }
  }

  assignValuesToForm(){
    this.formStage.get('nombre').setValue(this.stage.nombre);
    this.formStage.get('descripcion').setValue(this.stage.descripcion);
  }

  updateStage(payload: Stage, id: number): void {
    delete payload.subEtapas;
    delete payload.tareas;
    this.workplanService.updateStage(id, payload).subscribe({
      next: (e) => {
        this.store.dispatch(StageActions.updateFromList({stage: e}));
        this.urlService.goBack();
        this.creatingOrUpdating = false;
      },
      error: (error) => {
        this.creatingOrUpdating = false;
      },
    });
  }

  createStage(payload: Stage): void {
    payload.idPlanTrabajo = this.idWorkplan;
    payload.idPadre = this.idParent;
    this.workplanService.createStage(payload).subscribe({
      next: (e) => {
        this.store.dispatch(StageActions.addToList({stage: e}));
        this.urlService.goBack();
        this.creatingOrUpdating = false;
      },
      error: (error) => {
        this.creatingOrUpdating = false;
      },
    });
  }

  onSubmitStage(event : Event): void {
    event.preventDefault();
    let payload = {...this.stage, ...this.formStage.value};
    if (this.formStage.invalid) {
      this.formStage.markAllAsTouched();
    } else {
      this.creatingOrUpdating = true;
      this.updateMode ? this.updateStage(payload, this.stage.id) : this.createStage(payload);
    }
  }

  onDeleteStage(event : Event): void {
    event.preventDefault();
    this.deleting = true;
    this.workplanService.deleteStage(this.stage.id).subscribe({
      next: () => {
        this.store.dispatch(StageActions.removeFromList({id: this.stage.id}));
        this.urlService.goBack();
        this.deleting = false;
      },
      error: (error) => {
        this.deleting = false;
      },
    });
  }

  onCancelStage(event : Event): void {
    event.preventDefault();
    this.urlService.goBack();
  }
}
