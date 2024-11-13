import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MESSAGE } from '@labels/labels';
import { Category } from '@models';
import { Store } from '@ngrx/store';
import { CompensationCategoryService, CompensationService, CryptojsService, UrlService } from '@services';
import { IMAGE_SIZE } from '@utils';
import { AppState } from 'src/app/app.reducers';

@Component({
  selector: 'app-compensation-category',
  templateUrl: './compensation-category.component.html',
  styleUrls: ['./compensation-category.component.scss']
})
export class CompensationCategoryComponent implements OnInit {
  IMAGE_SIZE = IMAGE_SIZE;
  MESSAGE = MESSAGE;

  DELETE_MESSAGE = `¿Está seguro de eliminar la categoría?
    <div class="bg-yellow-50 text-yellow-500 border-round-xl p-4 text-justify mt-2">
      <span>
          <strong>Advertencia:</strong> 
          Eliminar la categoría implica eliminar todas las compensaciones laborales asociadas con ella.
          Por favor, asegúrese de que comprende el impacto de esta acción antes de proceder.
      </span>
    </div>
    `

  formCategory !: FormGroup;
  category: Category;
  updateMode: boolean;
  creatingOrUpdating: boolean = false;
  deleting: boolean = false;

  backRoute: string;

  constructor(
    private store: Store<AppState>,
    private compensationService: CompensationService,
    private compensationCategory: CompensationCategoryService,
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private urlService: UrlService,
    private cryptoService: CryptojsService
  ){}

  ngOnInit(): void {
    this.loadCategory(this.cryptoService.decryptParamAsNumber(this.route.snapshot.params['id']));
    this.backRoute = this.route.snapshot.queryParams['backRoute'];
    this.buildForm();
  }

  buildForm(){
    this.formCategory = this.formBuilder.group({
      nombre: ['', Validators.compose([
        Validators.required, 
        Validators.maxLength(100)
      ])],
      descripcion: ''
    })
  }

  loadCategory(id: number){
    if (id == undefined){
      this.updateMode = false;
    }else{
      this.compensationCategory.getCategory(id).subscribe({
        next: (e) => {
          this.category = e;
          this.assignValuesToForm();
        },
      });
      this.updateMode = true;
    }
  }
  
  assignValuesToForm(){
    this.formCategory.get('nombre').setValue(this.category.nombre);
    this.formCategory.get('descripcion').setValue(this.category.descripcion);
  }

  updateCategory(payload: Category, id: number): void {
    this.compensationCategory.updateCategory(id, payload).subscribe({
      next: (e) => {
        this.backRoute ? this.router.navigate([this.backRoute], {skipLocationChange: true}) : this.urlService.goBack();
        this.creatingOrUpdating = false;
        //Actualizamos del formulario de la compensación laboral la categoría
        this.compensationService.updateCategoryInCompensation(e);
      },
      error: (error) => {
        this.creatingOrUpdating = false;
      },
    });
  }

  createCategory(payload: Category): void {
    this.compensationCategory.createCategory(payload).subscribe({
      next: (e) => {
        this.creatingOrUpdating = false;
        this.backRoute ? this.router.navigate([this.backRoute], {skipLocationChange: true}) : this.urlService.goBack();
      },
      error: (error) => {
        this.creatingOrUpdating = false;
      },
    });
  }

  onSubmitCategory(event : Event): void {
    event.preventDefault();
    let payload = {...this.category, ...this.formCategory.value};
    if (this.formCategory.invalid) {
      this.formCategory.markAllAsTouched();
    } else {
      this.creatingOrUpdating = true;
      this.updateMode ? this.updateCategory(payload, this.category.id) : this.createCategory(payload);
    }
  }

  onDeleteCategory(event : Event): void {
    event.preventDefault();
    this.deleting = true;
    this.compensationCategory.deleteCategory(this.category.id).subscribe({
      next: () => {
        this.backRoute ? this.router.navigate([this.backRoute], {skipLocationChange: true}) : this.urlService.goBack();
        this.deleting = false;
        //Removemos del formulario de la compensación laboral la categoria eliminada.
        this.compensationService.removeCategoryInCompensation(this.category.id);
      },
      error: (error) => {
        this.deleting = false;
      },
    });
  }

  onCancelCategory(event : Event): void {
    event.preventDefault();
    this.backRoute ? this.router.navigate([this.backRoute], {skipLocationChange: true}) : this.urlService.goBack();
  }
}
