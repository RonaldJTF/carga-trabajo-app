import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {
  CompensationService,
  ConfirmationDialogService,
  CryptojsService,
  LevelService,
  ValidityService
} from "@services";
import {Compensation, LevelCompensation, Rule, SalaryScale, Variable} from "@models";
import {IMAGE_SIZE, Methods} from "@utils";
import {MESSAGE} from "@labels/labels";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {SelectItem} from "primeng/api";
import {OverlayPanel} from "primeng/overlaypanel";
import {finalize} from "rxjs";
import {VariableService} from "../../../../services/variable.service";

@Component({
  selector: 'app-form-level-compensation',
  templateUrl: './form-level-compensation.component.html',
  styleUrls: ['./form-level-compensation.component.scss']
})
export class FormLevelCompensationComponent implements OnInit {

  @ViewChild('compensationOptionsOverlayPanel') compensationOptionsOverlayPanel: OverlayPanel;

  protected readonly IMAGE_SIZE = IMAGE_SIZE;

  protected readonly MESSAGE = MESSAGE;

  idLevel: string;

  deleting: boolean = false;

  updateMode: boolean = false;

  creatingOrUpdating: boolean = false;

  formLevelCompensation: FormGroup;

  levelCompensation: LevelCompensation = new LevelCompensation();

  validityOptions: SelectItem[] = [];

  compensationOptions: SelectItem[] = [];

  compensation: Compensation[] = [];

  salaryScales: SalaryScale[] = [];

  rules: Rule[] = [];

  variables: Variable[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private compensationService: CompensationService,
    private variableService: VariableService,
    private formBuilder: FormBuilder,
    private cryptojsService: CryptojsService,
    private confirmationDialogService: ConfirmationDialogService,
    private levelService: LevelService,
    private validityService: ValidityService
  ) {
  }

  ngOnInit() {
    this.loadValidities();
    this.getVariable();
    this.getRole();
    this.getCompensations();
    this.getInitialValue();
    this.buildForm();
  }

  buildForm() {
    this.formLevelCompensation = this.formBuilder.group({
      compensacion: ['', Validators.required],
      idEscalaSalarial: ['', Validators.required],
      vigencia: ['', Validators.required],
      regla: ['', Validators.required],
      variable: ['', Validators.required]
    });
  }

  private isValid(field: string) {
    return (this.formLevelCompensation.get(field)?.invalid && (this.formLevelCompensation.get(field)?.dirty || this.formLevelCompensation.get(field)?.touched));
  }

  controls(field: string): any {
    return this.formLevelCompensation.controls[field].errors?.['required'];
  }

  invalidField(field: string) {
    return this.isValid(field);
  }

  get compensationFormControl(): FormControl {
    return this.formLevelCompensation.get('compensacion') as FormControl;
  }

  get validityFormControl(): FormControl {
    return this.formLevelCompensation.get('vigencia') as FormControl;
  }

  get ruleFromControl(): FormControl {
    return this.formLevelCompensation.get('regla') as FormControl;
  }

  get variableFormControl(): FormControl {
    return this.formLevelCompensation.get('variable') as FormControl;
  }

  getCompensations() {
    this.compensationService.getCompesations().subscribe({
      next: (res) => {
        this.compensation = res;
        this.loadCompensationsOptions();
      }
    })
  }

  getSalaryScales(idLevel: number) {
    this.levelService.getSalaryScalesByLevelId(idLevel).subscribe({
      next: (res) => {
        this.salaryScales = res;
      }
    })
  }

  getRole() {
    this.compensationService.getRules().subscribe({
      next: (resp) => {
        this.rules = resp;
      }
    })
  }

  getVariable() {
    this.variableService.getVariables().subscribe({
      next: (res) => {
        this.variables = res;
      }
    })
  }

  loadValidities(): void {
    this.validityService.getValidities().subscribe({
      next: (res) => {
        this.validityOptions = res?.map(o => ({value: o, label: o.nombre}));
        res?.find(o => {
          Methods.parseStringToBoolean(o.estado) && this.formLevelCompensation.get('vigencia').patchValue(o)
        });
      }
    });
  }

  removeValidity() {
    const validityControl = this.formLevelCompensation.get('vigencia');
    validityControl.reset();
    validityControl.markAsTouched();
  }

  onGoToUpdateValidity(id: any, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.validityService.setMustRechargeValidityFormGroup(true);

    const backRoute = this.levelCompensation ? `${'/configurations/level-compensation/create/' + this.cryptojsService.encryptParam(this.levelCompensation.id)}` : '/configurations/level-compensation/create';
    this.router.navigate(["/configurations/validities", this.cryptojsService.encryptParam(id.id)], {
      skipLocationChange: true,
      queryParams: {backRoute: backRoute, idLevel: this.idLevel}
    }).then()
  }

  createValidity() {
    this.validityService.setMustRechargeValidityFormGroup(true);
    const backRoute = this.levelCompensation ? `${'/configurations/level-compensation/create/' + this.cryptojsService.encryptParam(this.levelCompensation.id)}` : '/configurations/level-compensation/create';
    this.router.navigate(['/configurations/validities/create'], {
      skipLocationChange: true,
      queryParams: {backRoute: backRoute}
    }).then();
  }

  loadCompensationsOptions() {
    this.compensationOptions = this.compensation?.reduce((acc, objeto: Compensation) => {
      const categoria = objeto.categoria.nombre;
      const existingCategory = acc.find(item => item.label === categoria);
      if (existingCategory) {
        existingCategory.items.push({
          label: objeto.nombre,
          value: objeto
        });
      } else {
        acc.push({
          label: categoria,
          items: [{
            label: objeto.nombre,
            value: objeto
          }]
        });
      }
      return acc;
    }, []);
  }


  getInitialValue() {
    this.idLevel = this.route.snapshot.queryParams['idLevel'];
    if (this.idLevel != null) {
      this.getSalaryScales(this.cryptojsService.decryptParamAsNumber(this.idLevel));
    }
    this.route.params.subscribe((params) => {
      if (params['id'] != null) {
        this.getLevelCompensation(params['id']);
      }
    });
  }

  removeCompensation() {
    const compensationControl = this.formLevelCompensation.get('compensacion');
    compensationControl.reset();
    compensationControl.markAsTouched();
    this.loadCompensationsOptions();
  }

  getLevelCompensation(id: string) {
    this.compensationService.getLevelCompensation(id).subscribe({
      next: (res) => {
        this.levelCompensation = res;
      }
    })
  }

  editCompensation(compensation: any) {
    console.log(compensation)
    const queryParams = {idCategory: this.cryptojsService.encryptParam(compensation.idCategoria)};
    if (compensation.id) {
      queryParams['idCompensation'] = this.cryptojsService.encryptParam(compensation.id);
    }
    this.router.navigate(['/configurations/compensations/category'],
      {
        queryParams: queryParams,
        skipLocationChange: true,
      }).then();
  }

  createCompensation() {
    this.router.navigate(['/configurations/compensations/create'], {
      relativeTo: this.route,
      skipLocationChange: true
    }).then();
  }

  deleteCompensation(e: any, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.confirmationDialogService.showDeleteConfirmationDialog(
      () => {
        this.compensationService.deleteCompensation(this.cryptojsService.encryptParam(e.value.id)).subscribe({
          next: () => {
            this.goBack();
          },
        });
      },
      `
      ¿Está seguro de eliminar la compensación <strong>${e.value.nombre}</strong>?
      <div class="bg-yellow-50 text-yellow-500 border-round-xl p-4 text-justify mt-2">
        <span>
        <strong>Advertencia:</strong>
        Al eliminar la copensación, todas las compensaciones laborales relacionadas con ella también serán eliminadas.
        Por favor, asegúrese de comprender el impacto de esta acción antes de proceder.
        </span>
      </div>
      `
    )
  }

  deleteValidity(e: any, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.confirmationDialogService.showDeleteConfirmationDialog(
      () => {
        this.compensationService.deleteCompensation(this.cryptojsService.encryptParam(e.value.id)).subscribe({
          next: () => {
            this.goBack();
          },
        });
      },
      `
      ¿Está seguro de eliminar la compensación <strong>${e.value.nombre}</strong>?
      <div class="bg-yellow-50 text-yellow-500 border-round-xl p-4 text-justify mt-2">
        <span>
        <strong>Advertencia:</strong>
        Al eliminar la copensación, todas las compensaciones laborales relacionadas con ella también serán eliminadas.
        Por favor, asegúrese de comprender el impacto de esta acción antes de proceder.
        </span>
      </div>
      `
    )
  }

  changeCompensation(compensation: any) {
    this.formLevelCompensation.get('compensacion').setValue(compensation);
    this.compensationOptionsOverlayPanel.hide();
    this.loadCompensationsOptions();
  }

  changeValidity(validity: any) {
    this.formLevelCompensation.get('vigencia').setValue(validity);
    this.compensationOptionsOverlayPanel.hide();
  }

  parseStringToBoolean(str: string): boolean {
    return Methods.parseStringToBoolean(str);
  }

  onCancelLevelCompensation(event: Event): void {
    event.preventDefault();
    this.goBack();
  }

  onDeleteLevelCompensation(event: Event): void {
    event.preventDefault();
    this.deleting = true;
    const idLevelCompensation = this.cryptojsService.encryptParam(this.levelCompensation.id);
    this.compensationService.deleteLevelCompensation(idLevelCompensation).pipe(
      finalize(() => {
        this.deleting = false;
      })
    ).subscribe({
      next: () => {
        this.goBack();
      }
    });
  }

  onSubmitLevelCompensation(event: Event): void {
    event.preventDefault();
    let payload = this.formatLevelCompensation(this.formLevelCompensation.value);
    if (this.formLevelCompensation.valid) {
      this.creatingOrUpdating = true;
      this.updateMode ? this.updateLevelCompensation(this.levelCompensation, payload) : this.createLevelCompensation(payload);
    } else {
      this.formLevelCompensation.markAllAsTouched();
    }
  }

  formatLevelCompensation(payload: any): Partial<LevelCompensation> {
    console.log(payload.compensacion.id)
    return {
      id: payload.id ?? null,
      idNivel: this.cryptojsService.decryptParamAsNumber(this.idLevel),
      idCompensacionLaboral: payload.compensacion.id ?? null,
      idEscalaSalarial: payload.idEscalaSalarial ?? null,
      idRegla: payload.regla.id,
      idVariable: payload.variable.id,
      idVigencia: payload.vigencia.id
    };
  }

  createLevelCompensation(compensation: any): void {
    this.compensationService.createLevelCompensation(compensation).pipe(
      finalize(() => {
        this.creatingOrUpdating = false;
      })
    ).subscribe({
      next: () => {
        this.goBack();
      }
    })
  }

  updateLevelCompensation(levelCompensation: LevelCompensation, payload: any) {
    const idLevelCompensation = this.cryptojsService.encryptParam(levelCompensation.id);
    this.compensationService.updateLevelCompensation(idLevelCompensation, payload).pipe(
      finalize(() => {
        this.creatingOrUpdating = false;
      })
    ).subscribe({
      next: () => {
        this.goBack();
      }
    })
  }

  goBack() {
    this.router.navigate(['/configurations/level-compensation'], {
      skipLocationChange: true,
      queryParams: {idLevel: this.idLevel}
    }).then();
  }

}
