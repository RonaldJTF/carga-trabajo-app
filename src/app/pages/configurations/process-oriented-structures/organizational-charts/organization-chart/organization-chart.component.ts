import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AppointmentService, CryptojsService, NormativityService, OrganizationChartService, UrlService} from "@services";
import {OrganizationChart} from "@models";
import {IMAGE_SIZE} from "@utils";
import {MESSAGE} from "@labels/labels";
import {OverlayPanel} from "primeng/overlaypanel";
import {SelectItem} from "primeng/api";
import {ActivatedRoute, Router} from "@angular/router";
import {finalize} from "rxjs";

@Component({
  selector: 'app-organization-chart',
  templateUrl: './organization-chart.component.html',
  styleUrls: ['./organization-chart.component.scss']
})
export class OrganizationChartComponent implements OnInit {

  protected readonly IMAGE_SIZE = IMAGE_SIZE;
  protected readonly MESSAGE = MESSAGE;

  formOrganizationalChart: FormGroup;

  deleting: boolean = false;
  updateMode: boolean = false;
  creatingOrUpdating: boolean = false;

  organizationChart: OrganizationChart;
  normativityOptions: SelectItem[] = [];

  @ViewChild('normativityOptionsOverlayPanel') normativityOptionsOverlayPanel: OverlayPanel;

  constructor(
    private formBuilder: FormBuilder,
    private urlService: UrlService,
    private appointmentService: AppointmentService,
    private normativityService: NormativityService,
    private cryptoService: CryptojsService,
    private router: Router,
    private route: ActivatedRoute,
    private organizationChartService: OrganizationChartService,
  ) {
  }

  ngOnInit() {
    this.loadNormativities();
    this.buildForm();
    this.getInitialValue();
  }

  buildForm() {
    const savedData = this.organizationChartService.getFormData();
    this.formOrganizationalChart = this.formBuilder.group({
      nombre: [savedData.nombre || '', Validators.required],
      descripcion: [savedData.descripcion || ''],
      idNormatividad: [savedData.idNormatividad || ''],
      normatividad: [savedData.normatividad || '']
    })
  }

  private isValido(nombreAtributo: string) {
    return (this.formOrganizationalChart.get(nombreAtributo)?.invalid && (this.formOrganizationalChart.get(nombreAtributo)?.dirty || this.formOrganizationalChart.get(nombreAtributo)?.touched));
  }

  controls(field: string) {
    return this.formOrganizationalChart.controls[field].errors?.['required'];
  }

  fieldNoValid(field: string) {
    return this.isValido(field);
  }

  getInitialValue() {
    this.route.params.subscribe((params) => {
      if (params['id'] != null) {
        this.updateMode = true;
        this.getOrganizationChart(this.cryptoService.decryptParamAsNumber(params['id']));
      }
    });
  }

  getOrganizationChart(idOrganizationChart: number) {
    this.organizationChartService.getOrganizationChartById(idOrganizationChart).subscribe({
      next: (resp) => {
        this.organizationChart = resp;
        this.assignValuesToForm(resp);
      }
    })
  }

  assignValuesToForm(data: OrganizationChart) {
    this.formOrganizationalChart.get('nombre').setValue(data.nombre);
    this.formOrganizationalChart.get('descripcion').setValue(data.descripcion);
    this.formOrganizationalChart.get('idNormatividad').setValue(data.idNormatividad);
    this.formOrganizationalChart.get('normatividad').setValue(data.normatividad);
  }

  onSubmitOrganizationalChart(event: Event): void {
    const payload = {...this.formOrganizationalChart.value};
    delete payload.normatividad;

    event.preventDefault();
    if (this.formOrganizationalChart.invalid) {
      this.formOrganizationalChart.markAllAsTouched();
    } else {
      this.creatingOrUpdating = true;
      this.updateMode ? this.updateOrganizationalChart(this.organizationChart.id, payload) : this.createOrganizationalChart(payload);
    }
  }

  updateOrganizationalChart(id: number, payload: any) {
    this.organizationChartService.updateOrganizationChart(id, payload).pipe(
      finalize(() => {
        this.creatingOrUpdating = false;
      })
    ).subscribe({
      next: () => {
        this.urlService.goBack();
      }
    })
  }

  createOrganizationalChart(payload: any) {
    this.organizationChartService.createOrganizationChart(payload).pipe(
      finalize(() => {
        this.creatingOrUpdating = false;
      })
    ).subscribe({
      next: () => {
        this.urlService.goBack();
      }
    })
  }

  onCancelOrganizationalChart(event: Event): void {
    event.preventDefault();
    this.urlService.goBack();
  }

  onDeleteOrganizationalChart(event: Event): void {
    event.preventDefault();
    this.organizationChartService.deleteOrganizationChart(this.organizationChart.id).pipe(
      finalize(() => {
        this.creatingOrUpdating = false;
      })
    ).subscribe({
      next: () => {
        this.urlService.goBack();
      }
    })
  }

  changeNormativity(data: any) {
    this.formOrganizationalChart.get('idNormatividad').markAsTouched();
    this.formOrganizationalChart.get('idNormatividad').setValue(data.value.id);
    this.formOrganizationalChart.get('normatividad').setValue(data.value);
    this.normativityOptionsOverlayPanel.hide();
  }

  removeNormativity() {
    this.formOrganizationalChart.get('idNormatividad').reset();
    this.formOrganizationalChart.get('normatividad').reset();
  }

  loadNormativities(): void {
    this.normativityService.getFilteredNormativities({estado: '1', esEscalaSalarial: '0'}).subscribe({
      next: (e) => {
        this.normativityOptions = e?.map(o => ({value: o, label: o.nombre}));
      }
    });
  }

  onGoToUpdateNormativity(id: any, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.organizationChartService.setFormData(this.formOrganizationalChart.value);
    const backRoute = this.updateMode ? `${'/configurations/process-oriented-structures/organizational-charts/create/' + this.cryptoService.encryptParam(this.organizationChart.id)}` : '/configurations/process-oriented-structures/organizational-charts/create';
    this.router.navigate(["/configurations/normativities", this.cryptoService.encryptParam(id)], {
      skipLocationChange: true,
      queryParams: {backRoute: backRoute}
    })
  }

  openNewNormativity() {
    this.organizationChartService.setFormData(this.formOrganizationalChart.value);
    const backRoute = this.updateMode ? `${'/configurations/process-oriented-structures/organizational-charts/create/' + this.cryptoService.encryptParam(this.organizationChart.id)}` : '/configurations/process-oriented-structures/organizational-charts/create';
    this.router.navigate(['/configurations/normativities/create'], {
      skipLocationChange: true,
      queryParams: {backRoute: backRoute}
    });
  }

  showDetailOfNormativity(elementRef: HTMLDivElement, event: Event) {
    if (elementRef.style.display === 'none' || !elementRef.style.display) {
      elementRef.style.display = 'block';
    } else {
      elementRef.style.display = 'none';
    }
    const button = event.currentTarget as HTMLElement;
    const iconElement = button.querySelector('span');
    if (iconElement) {
      if (iconElement.classList.contains('pi-eye')) {
        iconElement.classList.remove('pi-eye');
        iconElement.classList.add('pi-eye-slash');
      } else {
        iconElement.classList.remove('pi-eye-slash');
        iconElement.classList.add('pi-eye');
      }
    }
  }
}
