import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  icons!: any[];

  constructor(private http: HttpClient) {
  }

  getIcons(): Observable<any> {
    return this.http.get('assets/content/data/icons.json').pipe(map((response: any) => {
      return response.icons;
    }));
  }

  getColors(): Observable<any> {
    return this.http.get('assets/content/data/colors.json').pipe(map((response: any) => {
      return response.colors;
    }));
  }

  getClassButton(): Observable<any> {
    return this.http.get('assets/content/data/colors.json').pipe(map((response: any) => {
      return response.classButton;
    }));
  }
}
