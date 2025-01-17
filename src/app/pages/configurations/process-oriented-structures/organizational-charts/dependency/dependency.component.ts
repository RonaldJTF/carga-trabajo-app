import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ConventionService, CryptojsService, OrganizationChartService, UrlService} from "@services";
import {ActivatedRoute} from "@angular/router";
import {Convention, Dependency} from "@models";
import {finalize} from "rxjs";
import * as StructureActions from "@store/structure.actions";
import {MESSAGE} from "@labels/labels";

@Component({
  selector: 'app-dependency',
  templateUrl: './dependency.component.html',
  styleUrls: ['./dependency.component.scss']
})
export class DependencyComponent implements OnInit {

  formDependency: FormGroup;

  uploadedFiles: any[] = [];
  formData: FormData;
  dependency: Dependency;
  idPadre: number;
  updateMode: boolean;
  creatingOrUpdating: boolean = false;
  deleting: boolean = false;

  conventions: Convention[];

  constructor(
    private formBuilder: FormBuilder,
    private cryptoService: CryptojsService,
    private route: ActivatedRoute,
    private urlService: UrlService,
    private organizationChartService: OrganizationChartService,
    private conventionService: ConventionService,
  ) {
  }

  ngOnInit(): void {
    this.idPadre = this.cryptoService.decryptParamAsNumber(this.route.snapshot.queryParams['idParent']);
    this.getConvention();
    this.buildForm();
    this.loadDependency(this.cryptoService.decryptParamAsNumber(this.route.snapshot.params['id']));
  }

  buildForm() {
    this.formDependency = this.formBuilder.group({
      nombre: ['', Validators.required],
      descripcion: '',
      idConvencion: ''
    })
  }

  private isValido(nombreAtributo: string) {
    return (this.formDependency.get(nombreAtributo)?.invalid && (this.formDependency.get(nombreAtributo)?.dirty || this.formDependency.get(nombreAtributo)?.touched));
  }

  controls(field: string) {
    return this.formDependency.controls[field].errors?.['required'];
  }

  fieldNoValid(field: string) {
    return this.isValido(field);
  }

  getConvention(){
    this.conventionService.getConvention().subscribe({
      next: (resp) => {
        this.conventions = resp;
      }
    })
  }

  loadDependency(id: number) {
    if (id == undefined) {
      this.updateMode = false;
    } else {
      this.organizationChartService.getDependencyById(id).subscribe({
        next: (e) => {
          this.dependency = e;
          this.assignValuesToForm();
        },
      });
      this.updateMode = true;
    }
  }

  assignValuesToForm() {
    this.formDependency.get('nombre').setValue(this.dependency.nombre);
    this.formDependency.get('descripcion').setValue(this.dependency.descripcion);
    this.formDependency.get('idConvention').setValue(this.dependency.idConvencion);
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

  updateDependency(id: number): void {
    this.organizationChartService.updateDependency(id, this.formData).pipe(
      finalize(() => {
        this.creatingOrUpdating = false;
      })
    ).subscribe({
      next: (e) => {
        //this.store.dispatch(StructureActions.updateItemIntoList({structure: e as Structure}));
        this.urlService.goBack();
      }
    });
  }

  createDependency(): void {
    console.log("Creating dependency component");
    this.organizationChartService.createDependency(this.formData).pipe(
      finalize(() => {
        this.creatingOrUpdating = true;
      })
    ).subscribe({
      next: (e) => {
        //this.store.dispatch(StructureActions.addToList({structure: e as Structure}));
        this.urlService.goBack();
      }
    });
  }

  onSubmitDependency(event: Event): void {
    event.preventDefault();
    this.formData = new FormData();
    this.formData.append('file', this.uploadedFiles[0]);
    this.formData.append('dependency', JSON.stringify({...this.dependency, ...this.formDependency.value}));

    if (this.formDependency.invalid) {
      this.formDependency.markAllAsTouched();
    } else {
      this.creatingOrUpdating = true;
      this.updateMode ? this.updateDependency(this.dependency.id) : this.createDependency();
    }
  }

  onDeleteDependency(event: Event): void {
    event.preventDefault();
    this.deleting = true;
    this.organizationChartService.deleteDependency(this.dependency.id).pipe(
      finalize(() => {
        this.deleting = false;
      })
    ).subscribe({
      next: () => {
        //this.store.dispatch(StructureActions.removeFromList({id: this.structure.id}));
        this.urlService.goBack();
      }
    });
  }

  onCancelDependency(event: Event): void {
    event.preventDefault();
    this.urlService.goBack();
  }

  protected readonly MESSAGE = MESSAGE;
}
