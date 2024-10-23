import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {finalize} from "rxjs";
import {BasicTablesService, ConfirmationDialogService, CryptojsService, UrlService} from "@services";
import { Scope } from 'src/app/models/scope';
import { Category } from 'src/app/models/category';


@Component({
  selector: 'app-form-scope',
  templateUrl: './form-category.component.html',
  styleUrls: ['./form-category.component.scss']
})
export class FormCategoryComponent implements OnInit {

  formCategory: FormGroup;

  updateMode: boolean = false;

  creatingOrUpdating: boolean = false;

  deleting: boolean = false;

  idCategory: number;

  constructor(
    private formBuilder: FormBuilder,
    private basicTablesService: BasicTablesService,
    private route: ActivatedRoute,
    private cryptoService: CryptojsService,
    private urlService: UrlService,
    private confirmationDialogService: ConfirmationDialogService,
  ) {
  }


  ngOnInit() {
    this.buildForm();
    this.getInitialValue();
  }


  getInitialValue() {
    this.route.params.subscribe((params) => {
      if (params['id'] != null) {
        this.idCategory = this.cryptoService.decryptParamAsNumber(params['id']);
        this.updateMode = true;
        this.getCategory(this.idCategory);
      }
    });
  }


  getCategory(idCategory: number) {
    
    this.basicTablesService.getCategory(idCategory).subscribe({
      next: (result) => {
        this.assignValuesToForm(result);
      }
    })
  }

  buildForm() {
    this.formCategory = this.formBuilder.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required]
    });
  }

  assignValuesToForm(category: Category) {
    this.formCategory.get('nombre').setValue(category.nombre);
    this.formCategory.get('descripcion').setValue(category.descripcion);
  }

  private isValido(nombreAtributo: string) {
    return (
      this.formCategory.get(nombreAtributo)?.invalid &&
      (this.formCategory.get(nombreAtributo)?.dirty ||
        this.formCategory.get(nombreAtributo)?.touched)
    );
  }

  get controls() {
    return this.formCategory.controls;
  }

  get nombreNoValido() {
    return this.isValido('nombre');
  }

  get descripcionNoValido() {
    return this.isValido('descripcion');
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

  updateCategory(idCategory: number, category: Category): void {
    let message = '¿Está seguro de actualizar el registro?';
    this.confirmationDialogService.showEventConfirmationDialog(
      message,
      () => {
        this.basicTablesService.updateCategory(idCategory, category).pipe(
          finalize(() => {
            this.creatingOrUpdating = false;
          })
        ).subscribe({
          next: () => {
            this.goBack();
          }
        })
      },
      () => {
        this.creatingOrUpdating = false;
      }
    )
  }

  createCategory(category: Category): void {
    this.basicTablesService.createCategory(category).pipe(
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
    event.preventDefault()
    this.deleting = true;
    this.basicTablesService.deleteCategory(this.idCategory).pipe(
      finalize(() => {
        this.deleting = false;
      })
    ).subscribe({
      next: () => {
        this.goBack();
      }
    })
  }

  onCancelCategory(event: Event) {
    event.preventDefault();
    this.goBack();
  }

  goBack() {
    this.urlService.goBack();
    this.formCategory.reset();
  }

}
