import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MESSAGE } from '@labels/labels';
import { Normativity, NormativityType, Scope } from '@models';
import { Store } from '@ngrx/store';
import { CryptojsService, LevelService, NormativityService, ScopeService, UrlService, AppointmentService } from '@services';
import { IMAGE_SIZE, Methods } from '@utils';
import { AppState } from 'src/app/app.reducers';

@Component({
  selector: 'app-normativity',
  templateUrl: './normativity.component.html',
  styleUrls: ['./normativity.component.scss']
})
export class NormativityComponent implements OnInit {
  IMAGE_SIZE = IMAGE_SIZE;
  MESSAGE = MESSAGE;

  DELETE_MESSAGE = `¿Está seguro de eliminar la normatividad?
      <div class="bg-yellow-50 text-yellow-500 border-round-xl p-4 text-justify mt-2">
        <span>
            <strong>Advertencia:</strong> 
            Eliminar la normatividad implica eliminar todas las escalas salariales configuradas, 
            incluidas aquellas que están asociadas a otros niveles ocupacionales que dependan de la misma normatividad. 
            Por favor, asegúrese de que comprende el impacto de esta acción antes de proceder.
        </span>
      </div>
    `

  formNormativity !: FormGroup;
  normativity: Normativity;
  updateMode: boolean;
  creatingOrUpdating: boolean = false;
  deleting: boolean = false;

  isSalaryScale: boolean;
  backRoute: string;

  normativityTypes: NormativityType[] = [];
  scopes: Scope[] = [];

  constructor(
    private store: Store<AppState>,
    private normativityService: NormativityService,
    private levelService: LevelService,
    private appointmentService: AppointmentService,
    private scopeService: ScopeService,
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private urlService: UrlService,
    private cryptoService: CryptojsService
  ){}

  ngOnInit(): void {
    this.loadNormativity(this.cryptoService.decryptParamAsNumber(this.route.snapshot.params['id']));
    this.isSalaryScale = Methods.parseStringToBoolean(this.route.snapshot.queryParams['isSalaryScale']);
    this.backRoute = this.route.snapshot.queryParams['backRoute'];
    this.buildForm();
    this.loadNormativityTypes();
    this.loadScopes();
  }

  buildForm(){
    this.formNormativity = this.formBuilder.group({
      estado: [true, Validators.required],
      nombre: ['', Validators.compose([
        Validators.required, 
        Validators.maxLength(100)
      ])],
      emisor: '',
      descripcion: ['', Validators.compose([
        Validators.required
      ])],
      idTipoNormatividad: ['', Validators.required],
      idAlcance: '',
      esEscalaSalarial: this.isSalaryScale,
      fechaInicioVigencia:  null,
      fechaFinVigencia: null
    })
  }
  

  loadNormativity(id: number){
    if (id == undefined){
      this.updateMode = false;
    }else{
      this.normativityService.getNormativity(id).subscribe({
        next: (e) => {
          this.normativity = e;
          this.assignValuesToForm();
        },
      });
      this.updateMode = true;
    }
  }

  loadScopes(): void {
    this.scopeService.getScopes().subscribe({
      next: (e) => {
        this.scopes = e;
      }
    });
  }

  loadNormativityTypes(): void {
    this.normativityService.getNormativityTypes().subscribe({
      next: (e) => {
        this.normativityTypes = e;
      }
    });
  }
  
  assignValuesToForm(){
    this.formNormativity.get('nombre').setValue(this.normativity.nombre);
    this.formNormativity.get('emisor').setValue(this.normativity.emisor);
    this.formNormativity.get('descripcion').setValue(this.normativity.descripcion);
    this.formNormativity.get('estado').setValue(Methods.parseStringToBoolean(this.normativity.estado ?? "1" ));
    this.formNormativity.get('esEscalaSalarial').setValue(Methods.parseStringToBoolean(this.normativity.esEscalaSalarial ?? "1" ));
    this.formNormativity.get('idTipoNormatividad').setValue(this.normativity.idTipoNormatividad);
    this.formNormativity.get('idAlcance').setValue(this.normativity.idAlcance);
    this.formNormativity.get('fechaInicioVigencia').setValue(this.normativity.fechaInicioVigencia ? new Date(this.normativity.fechaInicioVigencia) : null);
    this.formNormativity.get('fechaFinVigencia').setValue(this.normativity.fechaFinVigencia ? new Date(this.normativity.fechaFinVigencia) : null);
  }

  updateNormativity(payload: Normativity, id: number): void {
    this.normativityService.updateNormativity(id, payload).subscribe({
      next: (e) => {
        this.backRoute ? this.router.navigate([this.backRoute], {skipLocationChange: true}) : this.urlService.goBack();
        this.creatingOrUpdating = false;
        //Actualizamos de las escalas salariales la nueva información de la normatividad
        this.levelService.updateNormativityInSalaryScales(e);
        //Actualizamos de las asignaciones laborales la nueva información de la normatividad
        this.appointmentService.updateNormativityInAppointment(e);
      },
      error: (error) => {
        this.creatingOrUpdating = false;
      },
    });
  }

  createNormativity(payload: Normativity): void {
    this.normativityService.createNormativity(payload).subscribe({
      next: (e) => {
        this.creatingOrUpdating = false;
        this.backRoute ? this.router.navigate([this.backRoute], {skipLocationChange: true}) : this.urlService.goBack();
      },
      error: (error) => {
        this.creatingOrUpdating = false;
      },
    });
  }

  onSubmitNormativity(event : Event): void {
    event.preventDefault();
    let payload = {...this.normativity, ...this.formNormativity.value};
    payload.estado = Methods.parseBooleanToString(payload.estado);
    payload.esEscalaSalarial = Methods.parseBooleanToString(payload.esEscalaSalarial);
    if (this.formNormativity.invalid) {
      this.formNormativity.markAllAsTouched();
    } else {
      this.creatingOrUpdating = true;
      this.updateMode ? this.updateNormativity(payload, this.normativity.id) : this.createNormativity(payload);
    }
  }

  onDeleteNormativity(event : Event): void {
    event.preventDefault();
    const normativityId = this.normativity.id;
    this.deleting = true;
    this.normativityService.deleteNormativity(normativityId).subscribe({
      next: () => {
        this.backRoute ? this.router.navigate([this.backRoute], {skipLocationChange: true}) : this.urlService.goBack();
        this.deleting = false;
        //Removemos de la lista de scalas salariales que se están gestionando todas aquellas asociadas a esta normatividad
        this.levelService.removeSalaryScalesByNormativity(normativityId);
        //Removemos del formulario de asignación salarial la normatividad eliminada.
        this.appointmentService.removeNormativityInAppointment(normativityId);
      },
      error: (error) => {
        this.deleting = false;
      },
    });
  }

  onCancelNormativity(event : Event): void {
    event.preventDefault();
    this.backRoute ? this.router.navigate([this.backRoute], {skipLocationChange: true}) : this.urlService.goBack();
  }
}
