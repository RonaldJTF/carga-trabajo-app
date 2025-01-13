import { Component, OnInit } from '@angular/core';
import * as OperationalManagementActions from "@store/operationalManagement.actions";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OperationalManagement } from '@models';
import { Store } from '@ngrx/store';
import { CryptojsService, OperationalManagementService, UrlService } from '@services';
import { AppState } from 'src/app/app.reducers';
import { Location } from '@angular/common';

@Component({
  selector: 'app-operational-management',
  templateUrl: './operational-management.component.html',
  styleUrls: ['./operational-management.component.scss']
})
export class OperationalManagementComponent implements OnInit {
  formOperationalManagement !: FormGroup;
  formData: FormData;

  operationalManagement: OperationalManagement;
  idPadre: number;
  idTipologia: number;
  defaultOrder: number;
  updateMode: boolean;
  creatingOrUpdating: boolean = false;
  deleting: boolean = false;

  constructor(
    private store: Store<AppState>,
    private operationalManagementService: OperationalManagementService,
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private urlService: UrlService,
    private cryptoService: CryptojsService,
  ){}

  ngOnInit(): void {
    this.idPadre = this.cryptoService.decryptParamAsNumber(this.route.snapshot.queryParams['idParent']);
    this.idTipologia = this.cryptoService.decryptParamAsNumber(this.route.snapshot.queryParams['idTipology']);
    this.defaultOrder = this.cryptoService.decryptParamAsNumber(this.route.snapshot.queryParams['defaultOrder']);
    this.buildForm();
    this.loadOperationalManagement(this.cryptoService.decryptParamAsNumber(this.route.snapshot.params['id']));
  }

  buildForm(){
    this.formOperationalManagement = this.formBuilder.group({
      id: null,
      idPadre: this.idPadre,
      idTipologia: this.idTipologia,
      nombre: ['', Validators.required],
      descripcion: '',
      orden: [this.defaultOrder, Validators.compose([Validators.min(1)])]
    })
  }

  loadOperationalManagement(id: number){
    if (id == undefined){
      this.updateMode = false;
    }else{
      this.operationalManagementService.getOperationalManagementById(id).subscribe({
        next: (e) => {
          this.operationalManagement = e;
          this.assignValuesToForm();
        },
      });
      this.updateMode = true;
    }
  }

  assignValuesToForm(){
    this.formOperationalManagement.get('nombre').setValue(this.operationalManagement.nombre);
    this.formOperationalManagement.get('descripcion').setValue(this.operationalManagement.descripcion);
    this.formOperationalManagement.get('orden').setValue(this.operationalManagement.orden);
  }

  updateOperationalManagement(id: number): void {
    this.operationalManagementService.updateOperationalManagement(id, this.formData).subscribe({
      next: (e) => {
        this.store.dispatch(OperationalManagementActions.updateItemIntoList({operationalManagement: e as OperationalManagement}));
        this.urlService.goBack();
        this.creatingOrUpdating = false;
      },
      error: (error) => {
        this.creatingOrUpdating = false;
      },
    });
  }

  createOperationalManagement(): void {
    this.operationalManagementService.createOperationalManagement(this.formData).subscribe({
      next: (e) => {
        this.store.dispatch(OperationalManagementActions.addToList({operationalManagement: e as OperationalManagement}));
        this.urlService.goBack();
        this.creatingOrUpdating = false;
      },
      error: (error) => {
        this.creatingOrUpdating = false;
      },
    });
  }

  onSubmitOperationalManagement(event : Event): void {
    event.preventDefault();
    this.formData = new FormData();
    this.formData.append('file', null);
    this.formData.append('structure', JSON.stringify({...this.operationalManagement, ...this.formOperationalManagement.value}));

    if (this.formOperationalManagement.invalid) {
      this.formOperationalManagement.markAllAsTouched();
    } else {
      this.creatingOrUpdating = true;
      this.updateMode ? this.updateOperationalManagement(this.operationalManagement.id) : this.createOperationalManagement();
    }
  }

  onDeleteOperationalManagement(event : Event): void {
    event.preventDefault();
    this.deleting = true;
    this.operationalManagementService.deleteOperationalManagement(this.operationalManagement.id).subscribe({
      next: () => {
        this.store.dispatch(OperationalManagementActions.removeFromList({id: this.operationalManagement.id}));
        this.urlService.goBack();
        this.deleting = false;
      },
      error: (error) => {
        this.deleting = false;
      },
    });
  }

  onCancelOperationalManagement(event : Event): void {
    event.preventDefault();
    this.urlService.goBack();
  }

}
