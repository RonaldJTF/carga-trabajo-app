import { Injectable } from '@angular/core';
import {WebRequestService} from "./web-request.service";
import {Observable} from "rxjs";
import {Workplan} from "@models";

@Injectable({
  providedIn: 'root'
})
export class CompensationService {

  private pathCompensation = 'compensation'

  constructor(
    private webRequestService: WebRequestService
  ) { }

  getCompesations(): Observable<string[]> {
    return this.webRequestService.getWithHeaders(this.pathCompensation);
  }

  getCompensation(idCompensation: string): Observable<any> {
    return this.webRequestService.getWithHeaders(`${this.pathCompensation}/${idCompensation}`);
  }

  createCompensation(compensation: any): Observable<any> {
    return this.webRequestService.postWithHeaders(this.pathCompensation, compensation);
  }

  updateCompensation(id: string, compensation: any): Observable<any> {
    return this.webRequestService.putWithHeaders(`${this.pathCompensation}/${id}`, compensation);
  }

  deleteCompensation(idCompensation: number): Observable<any> {
    return this.webRequestService.deleteWithHeaders(`${this.pathCompensation}/${idCompensation}`);
  }

  deleteSelectedCompensations(payload: string[]):  Observable<string[]> {
    return this.webRequestService.deleteWithHeaders(`${this.pathCompensation}`, undefined, payload);
  }
}
