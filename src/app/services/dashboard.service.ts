import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';
import { Observable } from 'rxjs';
import { TypologyInventory } from '../models/typologyinventory';
import {Activity} from "../models/activity";
import {Structure} from "../models/structure";

@Injectable({
  providedIn: 'root',
})
export class DashboardService {

  private pathStructure: string = 'inventory';
  private pathStatistics: string = 'statistics';

  constructor(private webRequestService: WebRequestService) {}

  getInventory(): Observable<TypologyInventory[]>{
    return this.webRequestService.getWithHeaders(this.pathStructure);
  }

  getStatistics(idDependency): Observable<Activity[]>{
    return this.webRequestService.getWithHeaders(`${this.pathStatistics}/${idDependency}`);
  }

}
