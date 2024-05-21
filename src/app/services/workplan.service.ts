import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {WebRequestService} from "./web-request.service";
import {Stage, Workplan} from "../models/workplan";

@Injectable({
  providedIn: 'root'
})
export class WorkplanService {

  private pathWorkplain = 'workplan';
  private pathStage = 'stage';

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

  // Servicios: ETAPA
  getStages(): Observable<Stage[]> {
    return this.webRequestService.getWithHeaders(this.pathStage);
  }

  getStage(idStage: number): Observable<Stage> {
    return this.webRequestService.getWithHeaders(`${this.pathStage}/${idStage}`);
  }

  createStage(stage: Stage): Observable<any> {
    return this.webRequestService.postWithHeaders(this.pathStage, stage);
  }

  updateStage(id: number, stage: Stage): Observable<any> {
    return this.webRequestService.putWithHeaders(`${this.pathStage}/${id}`, stage);
  }

  deleteStage(idStage: number): Observable<Stage> {
    return this.webRequestService.deleteWithHeaders(`${this.pathStage}/${idStage}`);
  }
}
