import {Component, OnInit} from '@angular/core';
import * as StageActions from "./../../../../../store/stage.actions";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {WorkplanService} from "../../../../../services/workplan.service";
import {ActivatedRoute, Router} from "@angular/router";
import {PrimeNGConfig} from "primeng/api";
import {Methods} from "../../../../../utils/methods";
import {finalize} from "rxjs";
import { Task } from 'src/app/models/workplan';
import { AppState } from 'src/app/app.reducers';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-activity',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {

  idTask: number;

  idStage: number;

  updateMode: boolean;

  deleting: boolean = false;

  creatingOrUpdating: boolean = false;

  formTask: FormGroup;

  task: Task;

  es: any;

  constructor(
    private store: Store<AppState>,
    private formBuilder: FormBuilder, 
    private workplanService: WorkplanService, 
    private router: Router, 
    private readonly route: ActivatedRoute, 
    private primengConfig: PrimeNGConfig) {
  }

  ngOnInit(): void {
    this.idStage = this.route.snapshot.queryParams['idStage'];
    this.getParams();
    this.setTraslationCalendar();
    this.buildForm();
  }

  getParams() {
    this.route.params.subscribe((params) => {
      this.idTask = params['id'];
    });
    if (this.idTask != null) {
      this.updateMode = true;
      this.getTask(this.idTask);
    }
  }

  setTraslationCalendar() {
    this.primengConfig.setTranslation({
      dayNames: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
      dayNamesShort: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
      dayNamesMin: ["DO", "LU", "MA", "MI", "JU", "VI", "SA"],
      monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
      monthNamesShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
      today: 'Hoy',
      clear: 'Limpiar',
    });
  }

  buildForm() {
    this.formTask = this.formBuilder.group({
      id: null,
      nombre: ['', Validators.required],
      descripcion: '',
      rangeDates: [null, Validators.required],
      entregable: ['', Validators.required],
      responsable: ['', Validators.required],
      idEtapa: null
    })
  }

  private isValido(nombreAtributo: string) {
    return (
      this.formTask.get(nombreAtributo)?.invalid &&
      (this.formTask.get(nombreAtributo)?.dirty || this.formTask.get(nombreAtributo)?.touched)
    );
  }

  get controls() {
    return this.formTask.controls;
  }

  get nombreNoValido() {
    return this.isValido('nombre');
  }

  get descripcionNoValido() {
    return this.isValido('descripcion');
  }

  get entregableNoValido() {
    return this.isValido('entregable');
  }

  get fechaRangoNoValido() {
    return this.isValido('fechaRango');
  }

  get responsableNoValido() {
    return this.isValido('responsable');
  }

  getTask(id: number) {
    this.workplanService.getTask(id).subscribe({
      next: (data) => {
        this.task = data;
        if (this.task) {
          this.assignValuesToForm(this.task);
        }
      }
    })
  }

  assignValuesToForm(task: Task) {
    this.formTask.get('id').setValue(task.id);
    this.formTask.get('nombre').setValue(task.nombre);
    this.formTask.get('descripcion').setValue(task.descripcion);
    this.formTask.get('rangeDates').setValue([new Date(this.task.fechaInicio), new Date(this.task.fechaFin)]);
    this.formTask.get('entregable').setValue(task.entregable);
    this.formTask.get('responsable').setValue(task.responsable);
    this.formTask.get('idEtapa').setValue(task.idEtapa);
  }

  onSubmitTask(event: Event): void {
    const payload = {
      ...this.task,
      ...this.formTask.value,
      fechaInicio: Methods.formatDateWithTimezone(this.formTask.value.rangeDates[0]),
      fechaFin: Methods.formatDateWithTimezone(this.formTask.value.rangeDates[1])
    };

    event.preventDefault();
    if (this.formTask.invalid) {
      this.formTask.markAllAsTouched();
    } else {
      this.creatingOrUpdating = true;
      this.updateMode ? this.updateTask(this.idTask, payload) : this.createTask(payload);
    }
  }

  updateTask(id: number, payload: Task): void {
    this.workplanService.updateTask(id, payload).subscribe({
      next: (e) => {
        this.store.dispatch(StageActions.updateTaskFromStage({task: e}));
        this.goBack();
        this.creatingOrUpdating = false;
      },
      error: (error) => {
        this.creatingOrUpdating = false;
      },
    });
  }

  createTask(payload: Task): void {
    payload.idEtapa = this.idStage;
    this.workplanService.createTask(payload).subscribe({
      next: (e) => {
        this.store.dispatch(StageActions.addTaskToStage({task: e as Task}));
        this.goBack();
        this.creatingOrUpdating = false;
      },
      error: (error) => {
        this.creatingOrUpdating = false;
      },
    });
  }

  onDeleteTask(event: Event): void {
    event.preventDefault();
    this.deleting = true;
    this.workplanService.deleteTask(this.task.id).subscribe({
      next: () => {
        this.store.dispatch(StageActions.removeTasksFromStage({taskIds: [this.task.id]}));
        this.goBack();
        this.deleting = false;
      },
      error: (error) => {
        this.deleting = false;
      },
    });
  }

  onCancelTask(event: Event): void {
    event.preventDefault();
    this.goBack();
  }

  goBack() {
    this.router.navigate(['configurations/workplans/stages'], {
      skipLocationChange: true,
    });
  }

}
