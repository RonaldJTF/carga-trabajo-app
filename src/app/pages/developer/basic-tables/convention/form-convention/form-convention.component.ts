import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MenuItem} from "primeng/api";
import {MESSAGE} from "@labels/labels";
import {Action, Convention} from "@models";
import {ActivatedRoute} from "@angular/router";
import {BasicTablesService, ConfirmationDialogService, CryptojsService, DataService, UrlService} from "@services";
import {finalize} from "rxjs";

@Component({
  selector: 'app-form-conventions',
  templateUrl: './form-convention.component.html',
  styleUrls: ['./form-convention.component.scss']
})
export class FormConventionComponent implements OnInit {

  protected readonly MESSAGE = MESSAGE;

  formConvention: FormGroup;

  updateMode: boolean = false;

  creatingOrUpdating: boolean = false;

  deleting: boolean = false;

  loading: boolean = false;

  idConvention: number;

  icons: any[] = [];

  colors: any[] = [];

  filteredIcons: any[] = [];

  filteredColor: any[] = [];

  items: MenuItem[] = [];

  conventions: Convention[] = [];

  convention: Convention = new Convention();

  claseButtonSelected: any;

  iconSelected: any;

  constructor(
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
    this.getConventions();
    this.getIcons();
    this.getColors();
    this.buildForm();
    this.getInitialValue();
  }

  getInitialValue() {
    this.route.params.subscribe((params) => {
      if (params['id'] != null) {
        this.idConvention = this.cryptoService.decryptParamAsNumber(params['id']);
        this.updateMode = true;
        this.getConvention(this.idConvention);
      }
    });
  }

  getConvention(idConvention: number) {
    this.basicTablesService.getConvention(idConvention).subscribe({
      next: (result) => {
        this.assignValuesToForm(result);
      }
    })
  }

  buildForm() {
    this.formConvention = this.formBuilder.group({
      nombre: ['', Validators.required],
      claseIcono: ['', Validators.required],
      nombreColor: ['', Validators.required],
      descripcion: ['', Validators.required],
    });
  }

  assignValuesToForm(convention: Convention) {
    this.formConvention.get('nombre').setValue(convention.nombre);
    this.formConvention.get('descripcion').setValue(convention.descripcion);
    this.formConvention.get('claseIcono').setValue(convention.claseIcono);
    this.formConvention.get('nombreColor').setValue(convention.nombreColor);
  }

  private isValido(nombreAtributo: string) {
    return (
      this.formConvention.get(nombreAtributo)?.invalid &&
      (this.formConvention.get(nombreAtributo)?.dirty ||
        this.formConvention.get(nombreAtributo)?.touched)
    );
  }

  get controls() {
    return this.formConvention.controls;
  }

  get nombreNoValido() {
    return this.isValido('nombre');
  }

  get claseIconoNoValido() {
    return this.isValido('claseIcono');
  }

  get nombreColorNoValido() {
    return this.isValido('nombreColor');
  }

  get descripcionNoValido() {
    return this.isValido('descripcion');
  }

  onSubmitConvention(event: Event): void {
    event.preventDefault();
    if (this.formConvention.valid) {
      this.creatingOrUpdating = true;
      this.updateMode ? this.updateConvention(this.idConvention, this.formConvention.value) : this.createConvention(this.formConvention.value);
    } else {
      this.formConvention.markAllAsTouched();
    }
  }

  updateConvention(idConvention: number, convention: Convention): void {
    this.confirmationDialogService.showEventConfirmationDialog(
      '¿Está seguro de actualizar el registro?',
      () => {
        this.basicTablesService.updateConvention(idConvention, convention).pipe(
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

  createConvention(convention: Convention): void {
    this.basicTablesService.createConvention(convention).pipe(
      finalize(() => {
        this.creatingOrUpdating = false;
      })
    ).subscribe({
      next: () => {
        this.goBack();
      }
    })
  }

  onDeleteConvention(event: Event): void {
    event.preventDefault()
    this.deleting = true;
    this.basicTablesService.deleteConvention(this.idConvention).pipe(
      finalize(() => {
        this.deleting = false;
      })
    ).subscribe({
      next: () => {
        this.goBack();
      }
    })
  }

  onCancelConvention(event: Event) {
    event.preventDefault();
    this.goBack();
  }

  getIcons() {
    this.dataService.getIcons().subscribe(data => {
      const filteredIcons = data.filter((value: any) => !value.icon.tags.includes('deprecate'));

      filteredIcons.sort((icon1: any, icon2: any) => {
        if (icon1.properties.name < icon2.properties.name) return -1;
        if (icon1.properties.name > icon2.properties.name) return 1;
        return 0;
      });

      this.icons = filteredIcons;
      this.filteredIcons = filteredIcons;
    });
  }

  getColors() {
    this.dataService.getColors().subscribe({
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

  claseIcono(event: any) {
    this.formConvention.get('claseIcono').setValue('pi-' + event.properties.name);
    this.filteredIcons = this.icons;
  }

  nombreColor(event: any) {
    this.formConvention.get('nombreColor').setValue(event.value);
    this.filteredColor = this.colors;
  }


  get claseIconoFormControl(): FormControl {
    return this.formConvention.get('claseIcono') as FormControl;
  }

  get nombreColorFormControl(): FormControl {
    return this.formConvention.get('nombreColor') as FormControl;
  }

  getConfiguredIcon(nombreColor: string, claseIcono: string) {
    this.claseButtonSelected = this.colors.find(item => item.value === nombreColor);
    this.iconSelected = this.icons.find(item => item.value === claseIcono);
  }

  getConventions() {
    this.loading = true;
    this.basicTablesService.getConventions().pipe(
      finalize(() => {
        this.loading = false;
      })
    ).subscribe({
      next: (res) => {
        this.conventions = res;
      }
    })
  }

  goBack(){
    this.urlService.goBack();
    this.formConvention.reset();
  }
}
