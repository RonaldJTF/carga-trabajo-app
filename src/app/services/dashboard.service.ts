import {Injectable} from '@angular/core';
import {WebRequestService} from './web-request.service';
import {Observable} from 'rxjs';
import {Activity, TypologyInventory} from '@models';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {

  private pathStructure: string = 'inventory';
  private pathStatistics: string = 'statistics';
  private pathAdvanceConsolidated: string = 'workplan/consolidated';

  constructor(private webRequestService: WebRequestService) {
  }

  getInventory(): Observable<TypologyInventory[]> {
    return this.webRequestService.getWithHeaders(this.pathStructure);
  }

  getStatistics(idDependency): Observable<Activity[]> {
    return this.webRequestService.getWithHeaders(`${this.pathStatistics}/${idDependency}`);
  }

  getAdvanceConsolidated(idWorkplan: number, timeType: any): Observable<any> {
    return this.webRequestService.getWithHeaders(`${this.pathAdvanceConsolidated}/${idWorkplan}`, {timeType: timeType});
  }

}
