import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducers';
import { Structure } from 'src/app/models/structure';
import { StructureService } from 'src/app/services/structure.service';
import * as StructureActions from "../../../../../store/structure.actions";
import {UrlService} from "../../../../../services/url.service";


@Component({
  selector: 'app-dependency',
  templateUrl: './dependency.component.html',
  styleUrls: ['./dependency.component.scss']
})
export class DependencyComponent implements OnInit {
  formStructure !: FormGroup;
  uploadedFiles: any[] = [];
  formData: FormData;

  structure: Structure;
  idPadre: number;
  idTipologia: number;
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
  ){}

  ngOnInit(): void {
    this.idPadre = this.route.snapshot.queryParams['idParent'];
    this.idTipologia = this.route.snapshot.queryParams['idTipology'];
    this.buildForm();
    this.loadStructure(this.route.snapshot.params['id']);
    this.store.dispatch(StructureActions.setMustRecharge({mustRecharge: false}));
  }

  buildForm(){
    this.formStructure = this.formBuilder.group({
      id: null,
      idPadre: this.idPadre,
      idTipologia: this.idTipologia,
      nombre: ['', Validators.required],
      descripcion: ''
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
