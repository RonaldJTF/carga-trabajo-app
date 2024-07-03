import {Component, OnInit} from '@angular/core';
import * as WorkplanActions from "./../../../../store/workplan.actions";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {Workplan} from "../../../../models/workplan";
import {WorkplanService} from "../../../../services/workplan.service";
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducers';
import { ConfirmationDialogService } from 'src/app/services/confirmation-dialog.service';
import { Location } from '@angular/common';
import {UrlService} from "../../../../services/url.service";

@Component({
  selector: 'app-workplan',
  templateUrl: './workplan.component.html',
  styleUrls: ['./workplan.component.scss']
})
export class WorkplanComponent implements OnInit {
  formWorkplan !: FormGroup;
  workplan: Workplan;
  updateMode: boolean;
  creatingOrUpdating: boolean = false;
  deleting: boolean = false;

  constructor(
    private store: Store<AppState>,
    private workplanService: WorkplanService,
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private urlService: UrlService,
  ){}

  ngOnInit(): void {
    this.buildForm();
    this.loadWorkplan(this.route.snapshot.params['id']);
  }

  buildForm(){
    this.formWorkplan= this.formBuilder.group({
      nombre: ['', Validators.required],
      descripcion: ''
    })
  }

  loadWorkplan(id: number){
    if (id == undefined){
      this.updateMode = false;
    }else{
      this.workplanService.getWorkplan(id).subscribe({
        next: (e) => {
          this.workplan = e;
          this.assignValuesToForm();
        },
      });
      this.updateMode = true;
    }
  }

  assignValuesToForm(){
    this.formWorkplan.get('nombre').setValue(this.workplan.nombre);
    this.formWorkplan.get('descripcion').setValue(this.workplan.descripcion);
  }

  updateWorkplan(payload: Workplan, id: number): void {
    this.workplanService.updateWorkplan(id, payload).subscribe({
      next: (e) => {
        this.store.dispatch(WorkplanActions.updateFromList({workplan: e}));
        this.urlService.goBack();
        this.creatingOrUpdating = false;
      },
      error: (error) => {
        this.creatingOrUpdating = false;
      },
    });
  }

  createWorkplan(payload: Workplan): void {
    this.workplanService.createWorkplan(payload).subscribe({
      next: (e) => {
        this.store.dispatch(WorkplanActions.addToList({workplan: e}));
        this.urlService.goBack();
        this.creatingOrUpdating = false;
      },
      error: (error) => {
        this.creatingOrUpdating = false;
      },
    });
  }

  onSubmitWorkplan(event : Event): void {
    event.preventDefault();
    let payload = {...this.workplan, ...this.formWorkplan.value};
    if (this.formWorkplan.invalid) {
      this.formWorkplan.markAllAsTouched();
    } else {
      this.creatingOrUpdating = true;
      this.updateMode ? this.updateWorkplan(payload, this.workplan.id) : this.createWorkplan(payload);
    }
  }

  onDeleteWorkplan(event : Event): void {
    event.preventDefault();
    this.deleting = true;
    this.workplanService.deleteWorkplan(this.workplan.id).subscribe({
      next: () => {
        this.store.dispatch(WorkplanActions.removeFromList({id: this.workplan.id}));
        this.urlService.goBack();
        this.deleting = false;
      },
      error: (error) => {
        this.deleting = false;
      },
    });
  }

  onCancelWorkplan(event : Event): void {
    event.preventDefault();
    this.urlService.goBack();
  }
}
