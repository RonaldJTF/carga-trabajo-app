import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {BasicTablesService, ConfirmationDialogService, CryptojsService, DataService, UrlService} from "@services";
import {Typology} from "@models";
import {finalize} from "rxjs";
import {MESSAGE} from "@labels/labels";
import {MenuItem} from "primeng/api";

@Component({
  selector: 'app-form-typology',
  templateUrl: './form-typology.component.html',
  styleUrls: ['./form-typology.component.scss']
})
export class FormTypologyComponent implements OnInit {

  protected readonly MESSAGE = MESSAGE;

  formTipologia: FormGroup;

  updateMode: boolean = false;

  creatingOrUpdating: boolean = false;

  deleting: boolean = false;

  idTipologia: number;

  icons: any[] = [];

  colors: any[] = [];

  filteredIcons: any[] = [];

  filteredColor: any[] = [];

  loading: boolean = false;

  typologies: Typology[] = [];

  items: MenuItem[] = [];

  tipologia: Typology = new Typology();

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private basicTablesService: BasicTablesService,
    private route: ActivatedRoute,
    private cryptoService: CryptojsService,
    private urlService: UrlService,
    private confirmationDialogService: ConfirmationDialogService,
    private dataService: DataService,
    private basicTableService: BasicTablesService,
  ) {
  }

  ngOnInit() {
    this.getTypologies();
    this.buildForm();
    this.getInitialValue();
    this.getIcons();
    this.getColors();
  }

  getInitialValue() {
    this.route.params.subscribe((params) => {
      if (params['id'] != null) {
        this.idTipologia = this.cryptoService.decryptParamAsNumber(params['id']);
        this.updateMode = true;
        this.getTypology(this.idTipologia);
      }
    });
  }

  getTypology(idTipologia: number) {
    this.basicTablesService.getTypology(idTipologia).subscribe({
      next: (result) => {
        this.assignValuesToForm(result);
      }
    })
  }

  buildForm() {
    this.formTipologia = this.formBuilder.group({
      nombre: ['', Validators.required],
      claseIcono: ['', Validators.required],
      nombreColor: ['', Validators.required],
      esDependencia: false,
      idTipologiaSiguiente: undefined
    });
  }

  assignValuesToForm(tipologia: Typology) {
    this.formTipologia.get('nombre').setValue(tipologia.nombre);
    this.formTipologia.get('claseIcono').setValue(tipologia.claseIcono);
    this.formTipologia.get('nombreColor').setValue(tipologia.nombreColor);
    this.formTipologia.get('esDependencia').setValue(tipologia.esDependencia === '1');
    this.formTipologia.get('idTipologiaSiguiente').setValue(tipologia.idTipologiaSiguiente);
  }

  private isValido(nombreAtributo: string) {
    return (
      this.formTipologia.get(nombreAtributo)?.invalid &&
      (this.formTipologia.get(nombreAtributo)?.dirty ||
        this.formTipologia.get(nombreAtributo)?.touched)
    );
  }

  get controls() {
    return this.formTipologia.controls;
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

  get idTipologiaSiguienteNoValido() {
    return this.isValido('idTipologiaSiguiente');
  }

  onSubmitTypology(event: Event): void {
    event.preventDefault();
    if (this.formTipologia.valid) {
      this.creatingOrUpdating = true;
      const payload = this.buildRequest(this.formTipologia.value);
      this.updateMode ? this.updateTypology(this.idTipologia, payload) : this.createTypology(payload);
    } else {
      this.formTipologia.markAllAsTouched();
    }
  }

  buildRequest(form: any): Typology {
    this.tipologia = form;
    this.tipologia.esDependencia = form.esDependencia ? '1' : '0';
    return this.tipologia;
  }

  updateTypology(idTipologia: number, tipologia: Typology): void {
    let message = '¿Está seguro de actualizar el registro?';
    this.confirmationDialogService.showEventConfirmationDialog(
      message,
      () => {
        this.basicTablesService.updateTypology(idTipologia, tipologia).pipe(
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

  createTypology(tipologia: Typology): void {
    this.basicTablesService.createTypology(tipologia).pipe(
      finalize(() => {
        this.creatingOrUpdating = false;
      })
    ).subscribe({
      next: () => {
        this.urlService.goBack();
      }
    })
  }

  onDeleteTypoligy(event: Event): void {
    event.preventDefault()
    this.deleting = true;
    this.basicTablesService.deleteTypology(this.idTipologia).pipe(
      finalize(() => {
        this.deleting = false;
      })
    ).subscribe({
      next: () => {
        this.urlService.goBack();
      }
    })
  }

  onCancelTypology(event: Event) {
    event.preventDefault();
    this.router.navigate(['developer/basic-tables/typology'], {
      skipLocationChange: true,
    }).then();
  }

  getIcons() {
    this.dataService.getIcons().subscribe(data => {
      data = data.filter(value => {
        return value.icon.tags.indexOf('deprecate') === -1;
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

  claseIcon(event: any) {
    this.formTipologia.get('claseIcono').setValue('pi-' + event.properties.name);
    this.filteredIcons = this.icons;
  }

  nombreColor(event: any) {
    this.formTipologia.get('nombreColor').setValue(event.value);
    this.filteredColor = this.colors;
  }

  get claseIconoFormControl(): FormControl {
    return this.formTipologia.get('claseIcono') as FormControl;
  }

  get nombreColorFormControl(): FormControl {
    return this.formTipologia.get('nombreColor') as FormControl;
  }

  getTypologies() {
    this.loading = true;
    this.basicTableService.getTypoligies().pipe(
      finalize(() => {
        this.loading = false;
      })
    ).subscribe({
      next: (res) => {
        this.typologies = res;
      }
    })
  }

}
