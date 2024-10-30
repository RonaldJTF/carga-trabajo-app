import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CompensationService, CryptojsService, MenuService} from "@services";
import {Category, Functionality} from "@models";
import {finalize} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-form-category',
  templateUrl: './form-category.component.html',
  styleUrls: ['./form-category.component.scss']
})
export class FormCategoryComponent implements OnInit {

  updateMode: boolean = false;

  creatingOrUpdating: boolean = false;

  deleting: boolean = false;

  idCategory: string;

  idCompensation: string;

  formCategory: FormGroup;

  category: Category = new Category();

  functionality: Functionality = {
    label: 'Categorías',
    icon: 'pi pi-th-large',
    color: 'primary',
    description: 'Gestión de categorías para las compensaciones laborales'
  };

  constructor(
    private compensationService: CompensationService,
    private cryptojsService: CryptojsService,
    private route: ActivatedRoute,
    private cryptoService: CryptojsService,
    private formBuilder: FormBuilder,
    private router: Router,
    private menuService: MenuService
  ) {
  }

  ngOnInit() {
    this.menuService.onFunctionalityChange(this.functionality);
    this.buildForm();
    this.getInitialValue();
  }

  buildForm() {
    this.formCategory = this.formBuilder.group({
      nombre: ['', Validators.required],
      descripcion: ['']
    });
  }

  getInitialValue() {
    this.route.params.subscribe(() => {
      this.idCategory = this.route.snapshot.queryParams['idCategory'];
      this.idCompensation = this.route.snapshot.queryParams['idCompensation'];
      if (this.idCategory != null) {
        this.updateMode = true;
        this.getCategory(this.idCategory);
      }
    });
  }

  getCategory(idCategory: string) {
    this.compensationService.getCategory(idCategory).subscribe({
      next: (res) => {
        this.category = JSON.parse(this.cryptoService.decryptParamAsString(res));
        this.assignValuesToForm(this.category);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  assignValuesToForm(payload: Category) {
    this.formCategory.get('nombre').setValue(payload.nombre);
    this.formCategory.get('descripcion').setValue(payload.descripcion);
  }

  private isValid(field: string) {
    return (this.formCategory.get(field)?.invalid && (this.formCategory.get(field)?.dirty || this.formCategory.get(field)?.touched));
  }

  controls(field: string): any {
    return this.formCategory.controls[field].errors?.['required'];
  }

  invalidField(field: string) {
    return this.isValid(field);
  }

  onCancelCategory(event: Event): void {
    event.preventDefault();
    this.goBack();
  }

  onSubmitCategory(event: Event): void {
    event.preventDefault();
    if (this.formCategory.valid) {
      this.creatingOrUpdating = true;
      this.updateMode ? this.updateCategory(this.idCategory, this.formCategory.value) : this.createCategory(this.formCategory.value);
    } else {
      this.formCategory.markAllAsTouched();
    }
  }

  createCategory(payload: any): void {
    this.compensationService.createCategory(payload).pipe(
      finalize(() => {
        this.creatingOrUpdating = false;
      })
    ).subscribe({
      next: (res) => {
        this.idCategory = this.cryptojsService.encryptParam(res.id);
        this.goBack();
      }
    })
  }

  updateCategory(idCategory: string, payload: any) {
    this.compensationService.updateCategory(idCategory, payload).pipe(
      finalize(() => {
        this.creatingOrUpdating = false;
      })
    ).subscribe({
      next: () => {
        this.goBack();
      }
    })
  }

  onDeleteCategory(event: Event): void {
    event.preventDefault();
    this.deleting = true;
    this.compensationService.deleteCategory(this.cryptojsService.encryptParam(this.idCategory)).subscribe({
      next: () => {
        this.goBack();
        this.deleting = false;
      },
      error: () => {
        this.deleting = false;
      },
    });
  }

  goBack() {
    const queryParams: any = {};
    if (this.idCompensation) {
      queryParams['idCompensation'] = this.idCompensation;
    }
    if (this.idCategory) {
      queryParams['idCategory'] = this.idCategory
    }

    this.router.navigate(['configurations/compensations/create'], {
      queryParams: queryParams,
      skipLocationChange: true
    }).then(() => {
      this.formCategory.reset();
    });
  }
}
