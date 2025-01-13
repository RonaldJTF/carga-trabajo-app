import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProcessOrientedStructureService {
  private _activeItem: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public activeItem$: Observable<any> = this._activeItem.asObservable();

  constructor() { }

  public setActiveItem(menuItem: any){
    this._activeItem.next(menuItem);
  }  
}
