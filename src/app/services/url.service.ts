import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import {raceInit} from "rxjs/internal/observable/race";

@Injectable({
  providedIn: 'root'
})
export class UrlService {

  private previousUrl: string;

  private currentUrl: string;

  constructor(private router: Router) {
    this.currentUrl = this.router.url;
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.previousUrl = this.currentUrl;
      this.currentUrl = event.urlAfterRedirects;
    });
  }

  public getPreviousUrl(): string {
    return this.previousUrl;
  }

  public getCurrentUrl(): string {
    return this.currentUrl;
  }

  public initialize(): void {
    this.currentUrl = '';
    this.previousUrl = '';
  }

  goBack() {
    throw this.router.navigate([this.previousUrl], {
      skipLocationChange: true
    }).catch(reason => {
      console.log("paso..", reason)
    });
  }

}
