import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';
import { Observable } from 'rxjs';
import { Level } from '@models';

@Injectable({
  providedIn: 'root'
})
export class LevelService {
  private pathLevel: string = 'level'

  constructor(
    private webRequestService: WebRequestService
  ) { }


  getLevelById(id: number) {
    return this.webRequestService.getWithHeaders(`${this.pathLevel}/${id}`);
  }

  getLevels(): Observable<Level[]>{
    return this.webRequestService.getWithHeaders(this.pathLevel);
  }

}
