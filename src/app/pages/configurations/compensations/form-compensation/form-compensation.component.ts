import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {finalize} from "rxjs";
import {Category, Compensation, Functionality, Periodicity} from "@models";
import {
  CompensationService,
  ConfirmationDialogService,
  CryptojsService,
  MenuService,
  PeriodicityService
} from "@services";
import {MESSAGE} from "@labels/labels";
import {ActivatedRoute, Router} from "@angular/router";
import {IMAGE_SIZE, Methods} from "@utils";
import {SelectItem} from "primeng/api";
import {OverlayPanel} from "primeng/overlaypanel";
import {Store} from "@ngrx/store";
import {AppState} from "../../../../app.reducers";

import * as CompensationActions from "@store/compensation.actions";

@Component({
  selector: 'app-form-compensation',
  templateUrl: './form-compensation.component.html',
  styleUrls: ['./form-compensation.component.scss']
})
export class FormCompensationComponent implements OnInit {

  @ViewChild('categoryOptionsOverlayPanel') categoryOptionsOverlayPanel: OverlayPanel;

  protected readonly MESSAGE = MESSAGE;


  updateMode: boolean = false;

  creatingOrUpdating: boolean = false;

  deleting: boolean = false;

  idCompensation: string;

  idCategory: string;

  periodicity: Periodicity[] = [];

  categories: Category[] = [];

  categoryOptions: SelectItem[] = [];

  compensation: Compensation = new Compensation();

  formCompensation: FormGroup;

  functionality: Functionality = {
    label: 'Compensaciones laborales',
    icon: 'pi pi-money-bill',
    color: 'primary',
    description: 'Gestión de compensaciones laborales'
  };

  constructor(
    private formBuilder: FormBuilder,
    private compensationService: CompensationService,
    private route: ActivatedRoute,
    private router: Router,
    private periodicityService: PeriodicityService,
    private cryptoService: CryptojsService,
    private store: Store<AppState>,
    private confirmationDialogService: ConfirmationDialogService,
    private menuService: MenuService,
  ) {
  }

  ngOnInit() {
    this.menuService.onFunctionalityChange(this.functionality);
    this.buildForm();
    this.getInitialValue();
    this.getCategories();
    this.getPeriodicity();
  }

  buildForm() {
    this.formCompensation = this.formBuilder.group({
      nombre: ['', Validators.required],
      descripcion: [''],
      estado: [true],
      categoria: ['', Validators.required],
      idPeriodicidad: ['', Validators.required]
    });
  }

  getInitialValue() {
    this.route.params.subscribe(() => {
      this.idCompensation = this.route.snapshot.queryParams['idCompensation'];
      this.idCategory = this.route.snapshot.queryParams['idCategory'];
      if (this.idCompensation != null) {
        this.updateMode = true;
        this.getCompensation(this.idCompensation);
      }
    });
  }

  getCategories() {
    this.compensationService.getCategories().subscribe({
      next: (res) => {
        this.categories = this.cryptoService.decryptList<Category>(res);
        this.loadCategoriesOptions();
        if (this.idCategory !== null) {
          this.assignCategory(this.idCategory);
        }
      }
    })
  }

  assignCategory(idCategory: string) {
    let category: Category = this.categories.find(value => value.id == this.cryptoService.decryptParamAsNumber(idCategory));
    if (category) {
      this.formCompensation.get('categoria').setValue(category);
      this.loadCategoriesOptions();
    }
  }

  loadCategoriesOptions() {
    this.categoryOptions = this.categories?.map((objeto: Category) => {
      return {
        label: objeto.nombre,
        value: objeto
      };
    });
  }

  get categoriesFormControl(): FormControl {
    return this.formCompensation.get('categoria') as FormControl;
  }

  getPeriodicity() {
    this.periodicityService.getPeriodicity().subscribe({
      next: (res) => {
        this.periodicity = res;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  getCompensation(idCompensation: string) {
    this.compensationService.getCompensation(idCompensation).subscribe({
      next: (res) => {
        this.compensation = JSON.parse(this.cryptoService.decryptParamAsString(res));
        this.assignValuesToForm(this.compensation)
      }
    })
  }

  assignValuesToForm(payload: Compensation) {
    this.formCompensation.get('nombre').setValue(payload.nombre);
    this.formCompensation.get('descripcion').setValue(payload.descripcion);
    this.formCompensation.get('estado').setValue(Methods.parseStringToBoolean(payload.estado));
    this.formCompensation.get('categoria').setValue(payload.categoria)
    this.formCompensation.get('idPeriodicidad').setValue(payload.idPeriodicidad);
  }

  private isValid(field: string) {
    return (this.formCompensation.get(field)?.invalid && (this.formCompensation.get(field)?.dirty || this.formCompensation.get(field)?.touched));
  }

  controls(field: string): any {
    return this.formCompensation.controls[field].errors?.['required'];
  }

  invalidField(field: string) {
    return this.isValid(field);
  }

  onSubmitCompensation(event: Event): void {
    event.preventDefault();
    let payload = this.formatCompensation(this.formCompensation.value);
    if (this.formCompensation.valid) {
      this.creatingOrUpdating = true;
      this.updateMode ? this.updateCompensation(this.idCompensation, payload) : this.createCompensation(payload);
    } else {
      this.formCompensation.markAllAsTouched();
    }
  }

  createCompensation(compensation: any): void {
    this.compensationService.createCompensation(compensation).pipe(
      finalize(() => {
        this.creatingOrUpdating = false;
      })
    ).subscribe({
      next: (res) => {
        this.store.dispatch(CompensationActions.addToList({compensation: res}));
        this.goBack();
      }
    })
  }

  updateCompensation(idCompensation: string, payload: any) {
    this.compensationService.updateCompensation(idCompensation, payload).pipe(
      finalize(() => {
        this.creatingOrUpdating = false;
      })
    ).subscribe({
      next: (res) => {
        this.store.dispatch(CompensationActions.updateFromList({compensation: res}));
        this.goBack();
      }
    })
  }

  formatCompensation(payload: any) {
    const compensation: Compensation = {
      id: payload.id ?? null,
      nombre: payload.nombre,
      descripcion: payload.descripcion ?? null,
      estado: Methods.parseBooleanToString(payload.estado),
      idCategoria: payload.categoria?.id ?? null,
      idPeriodicidad: payload.idPeriodicidad
    };
    return compensation;
  }


  onDeleteCompensation(event: Event): void {
    event.preventDefault();
    this.deleting = true;
    this.compensationService.deleteCompensation(this.idCompensation).subscribe({
      next: () => {
        this.store.dispatch(CompensationActions.removeFromList({id: this.cryptoService.decryptParamAsNumber(this.idCompensation)}));
        this.goBack();
        this.deleting = false;
      },
      error: () => {
        this.deleting = false;
      },
    });
  }

  onCancelCompensation(event: Event): void {
    event.preventDefault();
    this.goBack();
  }

  removeCategory() {
    const categoriaControl = this.formCompensation.get('categoria');
    categoriaControl.reset();
    categoriaControl.markAsTouched();
    this.loadCategoriesOptions();
  }


  editCategory(idCategory: number) {
    const queryParams = {idCategory: this.cryptoService.encryptParam(idCategory)};
    if (this.compensation.id) {
      queryParams['idCompensation'] = this.cryptoService.encryptParam(this.compensation.id);
    }
    this.router.navigate(['configurations/compensations/category'],
      {
        queryParams: queryParams,
        skipLocationChange: true,
      }).then();
  }

  createCategory() {
    const queryParams: any = {};
    if (this.compensation.id) {
      queryParams['idCompensation'] = this.cryptoService.encryptParam(this.compensation.id);
    }

    this.router.navigate(['configurations/compensations/category'], {
      queryParams: queryParams,
      skipLocationChange: true,
    }).then();
  }

  addCategory(categoria: any) {
    this.formCompensation.get('categoria').setValue(categoria);
    this.categoryOptionsOverlayPanel.hide();
    this.loadCategoriesOptions();
  }

  deleteCategory(e: any, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.confirmationDialogService.showDeleteConfirmationDialog(
      () => {
        this.compensationService.deleteCategory(this.cryptoService.encryptParam(e.value.id)).subscribe({
          next: (res) => {
            console.log(res);
            this.goBack();
          },
        });
      },
      `
      ¿Está seguro de eliminar la categoría <strong>${e.value.nombre}</strong>?
      <div class="bg-yellow-50 text-yellow-500 border-round-xl p-4 text-justify mt-2">
        <span>
        <strong>Advertencia:</strong>
        Al eliminar la categoría, todas las compensaciones laborales relacionadas con ella también serán eliminadas.
        Por favor, asegúrese de comprender el impacto de esta acción antes de proceder.
        </span>
      </div>
      `
    )
  }

  goBack() {
    this.router.navigate(['configurations/compensations'], {
      skipLocationChange: true,
    }).then();
    this.formCompensation.reset();
  }

  protected readonly IMAGE_SIZE = IMAGE_SIZE;
}
