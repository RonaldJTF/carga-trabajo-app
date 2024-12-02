import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {AppState} from 'src/app/app.reducers';
import * as StructureActions from "@store/structure.actions";
import {Location} from '@angular/common';
import {CryptojsService, StructureService, UrlService} from '@services';
import {Structure} from "@models";

@Component({
  selector: 'app-no-dependency',
  templateUrl: './no-dependency.component.html',
  styleUrls: ['./no-dependency.component.scss']
})
export class NoDependencyComponent implements OnInit {
  formStructure !: FormGroup;
  formData: FormData;

  structure: Structure;
  idPadre: number;
  idTipologia: number;
  defaultOrder: number;
  updateMode: boolean;
  creatingOrUpdating: boolean = false;
  deleting: boolean = false;

  constructor(
    private store: Store<AppState>,
    private structureService: StructureService,
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
    this.loadStructure(this.cryptoService.decryptParamAsNumber(this.route.snapshot.params['id']));
  }

  buildForm(){
    this.formStructure = this.formBuilder.group({
      id: null,
      idPadre: this.idPadre,
      idTipologia: this.idTipologia,
      nombre: ['', Validators.required],
      descripcion: '',
      orden: [this.defaultOrder, Validators.compose([Validators.min(1)])]
    })
  }

  loadStructure(id: number){
    if (id == undefined){
      this.updateMode = false;
    }else{
      this.structureService.getStructureById(id).subscribe({
        next: (e) => {
          this.structure = e;
          this.assignValuesToForm();
        },
      });
      this.updateMode = true;
    }
  }

  assignValuesToForm(){
    this.formStructure.get('nombre').setValue(this.structure.nombre);
    this.formStructure.get('descripcion').setValue(this.structure.descripcion);
    this.formStructure.get('orden').setValue(this.structure.orden);
  }

  updateStructure(id: number): void {
    this.structureService.updateStructure(id, this.formData).subscribe({
      next: (e) => {
        this.store.dispatch(StructureActions.updateItemIntoList({structure: e as Structure}));
        this.urlService.goBack();
        this.creatingOrUpdating = false;
      },
      error: (error) => {
        this.creatingOrUpdating = false;
      },
    });
  }

  createStructure(): void {
    this.structureService.createStructure(this.formData).subscribe({
      next: (e) => {
        this.store.dispatch(StructureActions.addToList({structure: e as Structure}));
        this.urlService.goBack();
        this.creatingOrUpdating = false;
      },
      error: (error) => {
        this.creatingOrUpdating = false;
      },
    });
  }

  onSubmitStructure(event : Event): void {
    event.preventDefault();
    this.formData = new FormData();
    this.formData.append('file', null);
    this.formData.append('structure', JSON.stringify({...this.structure, ...this.formStructure.value}));

    if (this.formStructure.invalid) {
      this.formStructure.markAllAsTouched();
    } else {
      this.creatingOrUpdating = true;
      this.updateMode ? this.updateStructure(this.structure.id) : this.createStructure();
    }
  }

  onDeleteStructure(event : Event): void {
    event.preventDefault();
    this.deleting = true;
    this.structureService.deleteStructure(this.structure.id).subscribe({
      next: () => {
        this.store.dispatch(StructureActions.removeFromList({id: this.structure.id}));
        this.urlService.goBack();
        this.deleting = false;
      },
      error: (error) => {
        this.deleting = false;
      },
    });
  }

  onCancelStructure(event : Event): void {
    event.preventDefault();
    this.urlService.goBack();
  }

}
