import {Injectable} from '@angular/core';
import {map, Observable} from "rxjs";
import {WebRequestService} from "./web-request.service";
import {FollowUp, Stage, Task, Workplan} from "../models/workplan";
import { HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WorkplanService {

  private pathWorkplan = 'workplan';
  private pathStage = this.pathWorkplan.concat('/stage');
  private pathTask = this.pathWorkplan.concat('/task');
  private pathFollowUp = this.pathWorkplan.concat('/follow-up');

  constructor(private webRequestService: WebRequestService) {
  }

  // Servicios: PLAN DE TRABAJO
  getWorkplans(): Observable<Workplan[]> {
    return this.webRequestService.getWithHeaders(this.pathWorkplan);
  }

  getWorkplan(idWorkplan: number): Observable<Workplan> {
    return this.webRequestService.getWithHeaders(`${this.pathWorkplan}/${idWorkplan}`);
  }

  createWorkplan(workplan: any): Observable<any> {
    return this.webRequestService.postWithHeaders(this.pathWorkplan, workplan);
  }

  updateWorkplan(id: number, workplan: Workplan): Observable<any> {
    return this.webRequestService.putWithHeaders(`${this.pathWorkplan}/${id}`, workplan);
  }

  deleteWorkplan(idWorkplan: number): Observable<Workplan> {
    return this.webRequestService.deleteWithHeaders(`${this.pathWorkplan}/${idWorkplan}`);
  }

  deleteSelectedWorkplans(payload: number[]):  Observable<Workplan[]> {
    return this.webRequestService.deleteWithHeaders(`${this.pathWorkplan}`, undefined, payload);
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

  updateDates(id: number, task: any): Observable<Task> {
    return this.webRequestService.putWithHeaders(`${this.pathTask}/dates/${id}`, task);
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

  downloadReport(type: string, stageIds: number[], idWorkplan: number): Observable<HttpResponse<any>>{
    const options = {
      responseType: 'blob' as 'json',
      observe: 'response' as 'body'
    };

    let params: any = {type: type}
    if (idWorkplan){
      params['idWorkplan'] = idWorkplan;
    }
    if(stageIds){
      params['stageIds'] = JSON.stringify(stageIds);
    }

    return this.webRequestService.getWithHeaders(`${this.pathWorkplan}/report`, params, null, options).pipe(
      map(e => {
        this.handleFileDownload(e);
        return e;
      })
    )
  }

  getAdvanceConsolidated(idWorkplan: number, timeType: any): Observable<any>{
    return this.webRequestService.getWithHeaders(`${this.pathWorkplan}/consolidated/${idWorkplan}`, {timeType: timeType});
  }

  private handleFileDownload(response: HttpResponse<Blob>) {
    const filename = this.getFilenameFromHttpResponse(response);
    const blob = new Blob([response.body], { type: response.headers.get('content-type') });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  private getFilenameFromHttpResponse(response: HttpResponse<Blob>): string {
    const contentDisposition = response.headers.get('content-disposition');
    const matches = /filename="?([^"]+)"?/.exec(contentDisposition);
    return matches != null ? matches[1] : 'archivo_descargado';
  }
}
