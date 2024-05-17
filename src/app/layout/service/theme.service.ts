import { Injectable } from '@angular/core';
import {StorageService} from "../../services/storage.service";
import {LayoutService} from "./app.layout.service";

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor( private storageService: StorageService, private layoutService: LayoutService ) { }

  getThemeLocalStorage() {
    const storedTheme = this.storageService.getLocalStorage('theme');
    const storedColorScheme = this.storageService.getLocalStorage('colorSchema');

    if (storedTheme && storedColorScheme) {
      const themeLink = <HTMLLinkElement>document.getElementById('theme-css');
      const newHref = themeLink.getAttribute('href')!.replace(
        this.layoutService.config.theme,
        storedTheme
      );

      if (this.layoutService.config.theme !== storedTheme) {
        this.replaceThemeLink(newHref, () => {
          this.layoutService.config.theme = storedTheme;
          this.layoutService.config.colorScheme = storedColorScheme;
          this.layoutService.onConfigUpdate();
        });
      }
    }
  }

  private replaceThemeLink(href: string, onComplete: Function) {
    const id = 'theme-css';
    const themeLink = <HTMLLinkElement>document.getElementById('theme-css');
    const cloneLinkElement = <HTMLLinkElement>themeLink.cloneNode(true);

    cloneLinkElement.setAttribute('href', href);
    cloneLinkElement.setAttribute('id', id + '-clone');

    themeLink.parentNode!.insertBefore(cloneLinkElement, themeLink.nextSibling);

    cloneLinkElement.addEventListener('load', () => {
      themeLink.remove();
      cloneLinkElement.setAttribute('id', id);
      onComplete();
    });
  }
}
