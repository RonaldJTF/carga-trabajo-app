import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {BasicTablesService, ConfirmationDialogService, CryptojsService, DataService} from "@services";
import {ActivatedRoute, Router} from "@angular/router";
import {MenuItem} from "primeng/api";
import {Action} from "@models";
import {finalize} from "rxjs";
import {MESSAGE} from "@labels/labels";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {

  protected readonly MESSAGE = MESSAGE;

  formAction: FormGroup;

  updateMode: boolean = false;

  creatingOrUpdating: boolean = false;

  deleting: boolean = false;

  idAction: number;

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

  idTypology: number;


  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private basicTablesService: BasicTablesService,
    private route: ActivatedRoute,
    private cryptoService: CryptojsService,
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
    this.idTypology = this.cryptoService.decryptParamAsNumber(this.route.snapshot.queryParams['idTypology']);
    this.idAction = this.cryptoService.decryptParamAsNumber(this.route.snapshot.queryParams['idAction']);
    if (this.idTypology)
    if (this.idTypology && this.idAction) {
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
      this.updateMode ? this.updateAction(this.idAction, this.formAction.value) : this.createTypologyAction(this.idTypology, this.formAction.value);
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
            this.goBack();
          }
        })
      },
      () => {
        this.creatingOrUpdating = false;
      }
    )
  }

  createTypologyAction(idTypology: number, action: Action): void {
    this.basicTablesService.createTypologyAction(idTypology, action).pipe(
      finalize(() => {
        this.creatingOrUpdating = false;
      })
    ).subscribe({
      next: () => {
        this.goBack();
      }
    })
  }

  onDeleteAction(event: Event): void {
    event.preventDefault()
    this.deleting = false;
    this.basicTablesService.deleteTypologyAction(this.idTypology, this.idAction).pipe(
      finalize(() => {
        this.deleting = false;
      })
    ).subscribe({
      next: () => {
        this.goBack();
      }
    });
  }

  onCancelAction(event: Event) {
    event.preventDefault();
    this.goBack();
  }

  getIcons() {
    this.dataService.getIcons().subscribe(data => {
      data = data.filter((icons: any) => {
        return icons.icon.tags.indexOf('deprecate') === -1;
      });

      let icons = data;
      icons.sort((icon1: any, icon2: any) => {
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

  goBack(): void {
    this.router.navigate(['/developer/basic-tables/typology-action/list'], {
      relativeTo: this.route,
      skipLocationChange: true,
      queryParams: {idTypology: this.cryptoService.encryptParam(this.idTypology)}
    }).then();
  }
}
