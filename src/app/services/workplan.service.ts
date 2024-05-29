import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {WebRequestService} from "./web-request.service";
import {FollowUp, Stage, Task, Workplan} from "../models/workplan";

@Injectable({
  providedIn: 'root'
})
export class WorkplanService {

  private pathWorkplain = 'workplan';
  private pathStage = this.pathWorkplain.concat('/stage');
  private pathTask = this.pathWorkplain.concat('/task');
  private pathFollowUp = this.pathWorkplain.concat('/follow-up');

  constructor(private webRequestService: WebRequestService) {
  }

  // Servicios: PLAN DE TRABAJO
  getWorkplans(): Observable<Workplan[]> {
    return this.webRequestService.getWithHeaders(this.pathWorkplain);
  }

  getWorkplan(idWorkplan: number): Observable<Workplan> {
    return this.webRequestService.getWithHeaders(`${this.pathWorkplain}/${idWorkplan}`);
  }

  createWorkplan(workplan: any): Observable<any> {
    return this.webRequestService.postWithHeaders(this.pathWorkplain, workplan);
  }

  updateWorkplan(id: number, workplan: Workplan): Observable<any> {
    return this.webRequestService.putWithHeaders(`${this.pathWorkplain}/${id}`, workplan);
  }

  deleteWorkplan(idWorkplan: number): Observable<Workplan> {
    return this.webRequestService.deleteWithHeaders(`${this.pathWorkplain}/${idWorkplan}`);
  }

  deleteSelectedWorkplans(payload: number[]):  Observable<Workplan[]> {
    return this.webRequestService.deleteWithHeaders(`${this.pathWorkplain}`, undefined, payload);
  }

  // Servicios: ETAPA
  getStages(idWorkplan: number): Observable<Stage[]> {
    return this.webRequestService.getWithHeaders(`${this.pathStage}`, idWorkplan ? {idPlanTrabajo: idWorkplan} : {});
  }

  getStage(idStage: number): Observable<Stage> {
    return this.webRequestService.getWithHeaders(`${this.pathStage}/${idStage}`);
  }

  createStage(stage: Stage): Observable<any> {
    return this.webRequestService.postWithHeaders(`${this.pathStage}`, stage);
  }

  updateStage(id: number, stage: Stage): Observable<any> {
    return this.webRequestService.putWithHeaders(`${this.pathStage}/${id}`, stage);
  }

  deleteStage(idStage: number): Observable<Stage> {
    return this.webRequestService.deleteWithHeaders(`${this.pathStage}/${idStage}`);
  }

  deleteSelectedStages(payload: number[]):  Observable<Stage[]> {
    return this.webRequestService.deleteWithHeaders(`${this.pathStage}`, undefined, payload);
  }

  // Servicios: TAREA
  getTasks(): Observable<Task[]> {
    return this.webRequestService.getWithHeaders(`${this.pathTask}`);
  }

  getTask(idTask: number): Observable<Task> {
    return this.webRequestService.getWithHeaders(`${this.pathTask}/${idTask}`);
  }

  createTask(task: Task): Observable<any> {
    return this.webRequestService.postWithHeaders(`${this.pathTask}`, task);
  }

  updateTask(id: number, task: Task): Observable<any> {
    return this.webRequestService.putWithHeaders(`${this.pathTask}/${id}`, task);
  }

  deleteTask(idTask: number): Observable<Task> {
    return this.webRequestService.deleteWithHeaders(`${this.pathTask}/${idTask}`);
  }

  deleteSelectedTasks(payload: number[]):  Observable<Task[]> {
    return this.webRequestService.deleteWithHeaders(`${this.pathTask}`, undefined, payload);
  }

  // Servicios: SEGUIMIENTO
  getFollow(): Observable<FollowUp[]>{
    return this.webRequestService.getWithHeaders(`${this.pathFollowUp}`);
  }

  getFollowUp(idFollowUp: number): Observable<FollowUp>{
    return this.webRequestService.getWithHeaders(`${this.pathFollowUp}/${idFollowUp}`);
  }

  createFollowUp(followUp: FollowUp): Observable<any> {
    return this.webRequestService.postWithHeaders(`${this.pathFollowUp}`, followUp);
  }

  updateFollowUp(idFollowUp: number, followUp: FollowUp): Observable<any> {
    return this.webRequestService.putWithHeaders(`${this.pathFollowUp}/${idFollowUp}`, followUp);
  }

  deleteFollowUp(idFollowUp: number): Observable<FollowUp>{
    return this.webRequestService.deleteWithHeaders(`${this.pathFollowUp}/${idFollowUp}`);
  }

  deleteSelectedFollow(payload: number[]): Observable<FollowUp[]>{
    return this.webRequestService.deleteWithHeaders(`${this.pathFollowUp}/${payload}`, undefined, payload);
  }

}
