import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MESSAGE } from '@labels/labels';
import { Convention, Hierarchy } from '@models';
import { Store } from '@ngrx/store';
import { BasicTablesService, CryptojsService, OrganizationChartService, UrlService } from '@services';
import * as HierarchyActions from "@store/hierarchy.actions";
import { AppState } from 'src/app/app.reducers';

@Component({
  selector: 'app-hierarchy',
  templateUrl: './hierarchy.component.html',
  styleUrls: ['./hierarchy.component.scss']
})
export class HierarchyComponent implements OnInit {
  MESSAGE = MESSAGE;
  formHierarchy !: FormGroup;
  uploadedFiles: any[] = [];
  formData: FormData;

  hierarchy: Hierarchy;
  idPadre: number;
  idOrganigrama: number;
  updateMode: boolean;
  creatingOrUpdating: boolean = false;
  deleting: boolean = false;

  conventions: Convention[] = [];

  constructor(
    private store: Store<AppState>,
    private organizationChartService: OrganizationChartService,
    private basicTableService: BasicTablesService,
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private urlService: UrlService,
    private cryptoService: CryptojsService
  ){}

  ngOnInit(): void {
    this.idPadre = this.cryptoService.decryptParamAsNumber(this.route.snapshot.queryParams['parentId']);
    this.idOrganigrama = this.cryptoService.decryptParamAsNumber(this.route.snapshot.queryParams['organizationChartId']);
    this.buildForm();
    this.loadHierarchy(this.cryptoService.decryptParamAsNumber(this.route.snapshot.params['id']));
    this.getConventions();
  }

  get dependenciaFormGroup(): FormGroup{
    return this.formHierarchy.get('dependencia') as FormGroup;
  }

  buildForm(){
    this.formHierarchy = this.formBuilder.group({
      idPadre: this.idPadre,
      idOrganigrama: this.idOrganigrama,
      idDependencia: null,
      dependencia: this.formBuilder.group({
        nombre: ['', Validators.required],
        descripcion: '',
        idConvencion: null,
      })
    })
  }

  loadHierarchy(id: number){
    if (id == undefined){
      this.updateMode = false;
    }else{
      this.organizationChartService.getHierarchy(id).subscribe({
        next: (e) => {
          this.hierarchy = e;
          this.assignValuesToForm();
        },
      });
      this.updateMode = true;
    }
  }

  assignValuesToForm(){
    this.dependenciaFormGroup.get('idConvencion').setValue(this.hierarchy.dependencia.idConvencion);
    this.dependenciaFormGroup.get('nombre').setValue(this.hierarchy.dependencia.nombre);
    this.dependenciaFormGroup.get('descripcion').setValue(this.hierarchy.dependencia.descripcion);
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

  getConventions(): void {
    this.basicTableService.getConventions().subscribe({
      next: (e) => {
        this.conventions=e;
      }
    });
  }

  updateHierarchy(id: number): void {
    this.organizationChartService.updateHierarchy(id, this.formData).subscribe({
      next: (e) => {
        this.store.dispatch(HierarchyActions.updateFromList({hierarchy: e as Hierarchy}));
        this.urlService.goBack();
        this.creatingOrUpdating = false;
      },
      error: (error) => {
        this.creatingOrUpdating = false;
      },
    });
  }

  createHierarchy(): void {
    this.organizationChartService.createHierarchy(this.formData).subscribe({
      next: (e) => {
        this.store.dispatch(HierarchyActions.addToList({hierarchy: e as Hierarchy}));
        this.urlService.goBack();
        this.creatingOrUpdating = false;
      },
      error: (error) => {
        this.creatingOrUpdating = false;
      },
    });
  }

  onSubmitHierarchy(event : Event): void {
    event.preventDefault();
    this.formData = new FormData();
    this.formData.append('file', this.uploadedFiles[0]);
    this.formData.append('hierarchy', JSON.stringify({...this.hierarchy, ...this.formHierarchy.value}));

    if (this.formHierarchy.invalid) {
      this.formHierarchy.markAllAsTouched();
    } else {
      this.creatingOrUpdating = true;
      this.updateMode ? this.updateHierarchy(this.hierarchy.id) : this.createHierarchy();
    }
  }

  onDeleteHierarchyAndDependency(event : Event): void {
    event.preventDefault();
    this.deleting = true;
    this.organizationChartService.deleteHierarchyAndDependency(this.hierarchy.id).subscribe({
      next: () => {
        this.store.dispatch(HierarchyActions.removeFromList({id: this.hierarchy.id}));
        this.urlService.goBack();
        this.deleting = false;
      },
      error: (error) => {
        this.deleting = false;
      },
    });
  }

  onCancelHierarchy(event : Event): void {
    event.preventDefault();
    this.urlService.goBack();
  }
}
