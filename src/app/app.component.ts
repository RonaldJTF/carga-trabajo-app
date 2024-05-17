import {Component, OnInit} from '@angular/core';
import {PrimeNGConfig} from 'primeng/api';
import {LayoutService} from "./layout/service/app.layout.service";
import {StorageService} from "./services/storage.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  typeConfigList: string[] = ['menuMode', 'scale', 'ripple', 'inputStyle'];

  constructor(private primengConfig: PrimeNGConfig, public layoutService: LayoutService, private storageService: StorageService) {
  }

  ngOnInit() {
    this.primengConfig.ripple = true;
    this.initConfig();
  }

  initConfig(): void {
    this.typeConfigList.forEach(item => {
      this.getConfigLocalStorage(item);
    })
  }

  getConfigLocalStorage(config: string) {
    let configOption = this.storageService.getLocalStorage(config);
    if (configOption) {
      this.layoutService.config[config] = configOption;
    }
    if (config === 'scale') {
      this.applyScale();
    }
    if (configOption !== 'theme') {
      this.getThemeLocalStorage();
    }
  }

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

  replaceThemeLink(href: string, onComplete: Function) {
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

  applyScale() {
    document.documentElement.style.fontSize = this.scale + 'px';
  }

  get scale(): number {
    return this.layoutService.config.scale;
  }
}
