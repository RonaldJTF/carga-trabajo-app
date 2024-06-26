import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducers';
import { Structure } from 'src/app/models/structure';
import * as StructureActions from "./../../../../store/structure.actions";
import { Subscription } from 'rxjs';
import { StructureService } from 'src/app/services/structure.service';
import { Methods } from 'src/app/utils/methods';

@Component({
  selector: 'app-structure',
  templateUrl: './structure.component.html',
  styleUrls: ['./structure.component.scss']
})
export class StructureComponent implements OnInit {
  formStructure !: FormGroup;
  uploadedFiles: any[] = [];
  formData: FormData;

  structure: Structure;
  idPadre: number;
  isDependency: string;
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
    private formBuilder: FormBuilder
  ){}

  ngOnInit(): void {
    this.idPadre = this.route.snapshot.queryParams['idParent'];
    this.idTipologia = this.route.snapshot.queryParams['idTipology'];
    this.isDependency = this.route.snapshot.queryParams['isDependency'];
    this.defaultOrder = this.route.snapshot.queryParams['defaultOrder'];    
    this.buildForm();
    this.loadStructure(this.route.snapshot.params['id']);
    this.store.dispatch(StructureActions.setMustRecharge({mustRecharge: false}));
  }

  get noDependency(): boolean{
    return  this.isDependency != null 
            ? !Methods.parseStringToBoolean(this.isDependency)
            : this.structure != null ? !Methods.parseStringToBoolean(this.structure.tipologia.esDependencia) : false;
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

  onSelectFile(event: any) {
    this.uploadedFiles = [];
    for (const file of event.files) {
        this.uploadedFiles.push(file);
    }
  }
  
  onRemoveFile(event: any) {
    this.uploadedFiles = this.uploadedFiles.filter(objeto => objeto.name !== event.file.name);
  }


  updateStructure(id: number): void {
    this.structureService.updateStructure(id, this.formData).subscribe({
      next: (e) => {
        this.store.dispatch(StructureActions.updateItemIntoList({structure: e as Structure}));
        this.store.dispatch(StructureActions.setMustRecharge({mustRecharge: false}));
        this.goBack();
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
        this.goBack();
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
    this.formData.append('file', this.uploadedFiles[0]);
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
        this.goBack();
        this.deleting = false;
      },
      error: (error) => {
        this.deleting = false;
      },
    });
  }

  onCancelStructure(event : Event): void {
    event.preventDefault();
    this.goBack();
  }

  goBack() {
    this.router.navigate(['configurations/structures'], {
      skipLocationChange: true,
    });
  }
}
