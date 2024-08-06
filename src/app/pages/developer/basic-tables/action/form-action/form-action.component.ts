import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MenuItem} from "primeng/api";
import {MESSAGE} from "../../../../../../labels/labels";
import {Action} from "../../../../../models/action";
import {ActivatedRoute, Router} from "@angular/router";
import {BasicTablesService} from "../../../../../services/basic-tables.service";
import {CryptojsService} from "../../../../../services/cryptojs.service";
import {UrlService} from "../../../../../services/url.service";
import {ConfirmationDialogService} from "../../../../../services/confirmation-dialog.service";
import {DataService} from "../../../../../services/data.service";
import {finalize} from "rxjs";

@Component({
  selector: 'app-form-actions',
  templateUrl: './form-action.component.html',
  styleUrls: ['./form-action.component.scss']
})
export class FormActionComponent implements OnInit {

  protected readonly MESSAGE = MESSAGE;

  formAction: FormGroup;

  updateMode: boolean = false;

  creatingOrUpdating: boolean = false;

  deleting: boolean = false;

  idAction: number;

  param: string;

  icons: any[] = [];

  colors: any[] = [];

  filteredIcons: any[] = [];

  filteredColor: any[] = [];

  loading: boolean = false;

  items: MenuItem[] = [];

  actions: Action[] = [];

  action: Action = new Action();

  claseButtonSelected: any;

  iconSelected: any;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private basicTablesService: BasicTablesService,
    private route: ActivatedRoute,
    private cryptoService: CryptojsService,
    private urlService: UrlService,
    private confirmationDialogService: ConfirmationDialogService,
    private dataService: DataService
  ) {
  }

  ngOnInit() {
    this.getIcons();
    this.getColors();
    this.buildForm();
    this.getInitialValue();
  }

  getInitialValue() {
    this.route.params.subscribe((params) => {
      this.param = params['id'];
    });
    if (this.param != null) {
      this.idAction = this.cryptoService.decryptParamAsNumber(this.param);
      this.updateMode = true;
      this.getAction(this.idAction);
    }
  }

  getAction(idAction: number) {
    this.basicTablesService.getAction(idAction).subscribe({
      next: (result) => {
        this.getConfiguredIcon(result.claseEstado, result.claseIcono);
        this.assignValuesToForm(result);
      }
    })
  }

  buildForm() {
    this.formAction = this.formBuilder.group({
      nombre: ['', Validators.required],
      claseIcono: ['', Validators.required],
      claseEstado: ['', Validators.required],
      path: ['', Validators.required],
    });
  }

  assignValuesToForm(action: Action) {
    this.formAction.get('nombre').setValue(action.nombre);
    this.formAction.get('claseIcono').setValue(action.claseIcono);
    this.formAction.get('claseEstado').setValue(action.claseEstado);
    this.formAction.get('path').setValue(action.path);
  }

  private isValido(nombreAtributo: string) {
    return (
      this.formAction.get(nombreAtributo)?.invalid &&
      (this.formAction.get(nombreAtributo)?.dirty ||
        this.formAction.get(nombreAtributo)?.touched)
    );
  }

  get controls() {
    return this.formAction.controls;
  }

  get nombreNoValido() {
    return this.isValido('nombre');
  }

  get claseIconoNoValido() {
    return this.isValido('claseIcono');
  }

  get claseEstadoNoValido() {
    return this.isValido('claseEstado');
  }

  get pathNoValido() {
    return this.isValido('path');
  }

  onSubmitAction(event: Event): void {
    event.preventDefault();
    if (this.formAction.valid) {
      this.creatingOrUpdating = true;
      this.updateMode ? this.updateAction(this.idAction, this.formAction.value) : this.createAction(this.formAction.value);
    } else {
      this.formAction.markAllAsTouched();
    }
  }

  updateAction(idAction: number, action: Action): void {
    let message = '¿Está seguro de actualizar el registro?';
    this.confirmationDialogService.showEventConfirmationDialog(
      message,
      () => {
        this.basicTablesService.updateAction(idAction, action).pipe(
          finalize(() => {
            this.creatingOrUpdating = false;
          })
        ).subscribe({
          next: () => {
            this.urlService.goBack();
          }
        })
      },
      () => {
        this.creatingOrUpdating = false;
      }
    )
  }

  createAction(action: Action): void {
    this.basicTablesService.createAction(action).pipe(
      finalize(() => {
        this.creatingOrUpdating = false;
      })
    ).subscribe({
      next: () => {
        this.urlService.goBack();
      }
    })
  }

  onDeleteAction(event: Event): void {
    event.preventDefault()
    this.deleting = true;
    this.basicTablesService.deleteAction(this.idAction).pipe(
      finalize(() => {
        this.deleting = false;
      })
    ).subscribe({
      next: () => {
        this.urlService.goBack();
      }
    })
  }

  onCancelAction(event: Event) {
    event.preventDefault();
    this.urlService.goBack();
  }

  getIcons() {
    this.dataService.getIcons().subscribe(data => {
      data = data.filter(icons => {
        return icons.icon.tags.indexOf('deprecate') === -1;
      });

      let icons = data;
      icons.sort((icon1, icon2) => {
        if (icon1.properties.name < icon2.properties.name)
          return -1;
        else if (icon1.properties.name < icon2.properties.name)
          return 1;
        else
          return 0;
      });

      this.icons = icons;
      this.filteredIcons = data;
    });
  }

  getColors() {
    this.dataService.getClassButton().subscribe({
      next: (res) => {
        this.colors = res;
        this.filteredColor = res;
      }
    })
  }

  onFilterIcon(event: Event): void {
    const searchText = (event.target as HTMLInputElement).value;
    if (!searchText) {
      this.filteredIcons = this.icons;
    } else {
      this.filteredIcons = this.icons.filter(it => {
        return it.icon.tags[0].includes(searchText);
      });
    }
  }

  onFilterColor(event: Event): void {
    const searchText = (event.target as HTMLInputElement).value;
    if (!searchText) {
      this.filteredColor = this.colors;
    } else {
      this.filteredColor = this.colors.filter(it => {
        return it.value.includes(searchText);
      });
    }
  }

  claseIcon(event: any) {
    this.formAction.get('claseIcono').setValue('pi-' + event.properties.name);
    this.iconSelected = event;
    this.filteredIcons = this.icons;
  }

  claseEstado(event: any) {
    this.formAction.get('claseEstado').setValue(event.value);
    this.claseButtonSelected = event;
    this.filteredColor = this.colors;
  }

  get claseIconoFormControl(): FormControl {
    return this.formAction.get('claseIcono') as FormControl;
  }

  get claseEstadoFormControl(): FormControl {
    return this.formAction.get('claseEstado') as FormControl;
  }

  getConfiguredIcon(claseEstado: string, claseIcono: string) {
    this.claseButtonSelected = this.colors.find(item => item.value === claseEstado);
    this.iconSelected = this.icons.find(item => item.value === claseIcono);
  }

}
