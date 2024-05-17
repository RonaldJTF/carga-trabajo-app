import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {LayoutService} from '../service/app.layout.service';
import {MenuService} from '../app.menu.service';
import {StorageService} from '../../services/storage.service';

@Component({
  selector: 'app-config',
  templateUrl: './app.config.component.html',
})
export class AppConfigComponent implements OnInit {

  @Input() minimal: boolean = false;

  scales: number[] = [12, 13, 14, 15, 16];

  typeConfigList: string[] = ['menuMode', 'scale', 'ripple', 'inputStyle'];

  constructor(public layoutService: LayoutService, private storageService: StorageService) {
  }

  ngOnInit() {
    this.getThemeLocalStorage();
    this.initConfig();
  }

  initConfig(): void {
    this.typeConfigList.forEach(item => {
      this.getConfigLocalStorage(item);
    })
  }

  get visible(): boolean {
    return this.layoutService.state.configSidebarVisible;
  }

  set visible(_val: boolean) {
    this.layoutService.state.configSidebarVisible = _val;
  }

  get inputStyle(): string {
    return this.layoutService.config.inputStyle;
  }

  set inputStyle(_val: string) {
    this.setConfigLocalStorage('inputStyle', _val);
  }

  get ripple(): boolean {
    return this.layoutService.config.ripple;
  }

  set ripple(_val: boolean) {
    this.setConfigLocalStorage('ripple', _val);
  }

  get scale(): number {
    return this.layoutService.config.scale;
  }

  set scale(_val: number) {
    this.setConfigLocalStorage('scale', _val);
  }

  get menuMode(): string {
    return this.layoutService.config.menuMode;
  }

  set menuMode(_val: string) {
    this.setConfigLocalStorage('menuMode', _val);
  }

  setConfigLocalStorage(key: string, value: any) {
    this.storageService.clearAndSetItemInLocalStorage(key, value);
    this.getConfigLocalStorage(key);
  }

  getConfigLocalStorage(config: string) {
    let configOption = this.storageService.getLocalStorage(config);
    if (configOption) {
      this.layoutService.config[config] = configOption;
    }
    if (config === 'scale') {
      this.applyScale();
    }
  }

  onConfigButtonClick() {
    this.layoutService.showConfigSidebar();
  }

  changeTheme(theme: string, colorScheme: string) {
    const storedTheme = this.storageService.getLocalStorage('theme');
    const storedColorScheme = this.storageService.getLocalStorage('colorSchema');

    if (storedTheme && storedColorScheme) {
      this.storageService.removeLocalStorageItem('theme');
      this.storageService.removeLocalStorageItem('colorSchema');
    }

    this.storageService.setLocalStorage('theme', theme);
    this.storageService.setLocalStorage('colorSchema', colorScheme);

    if (storedTheme !== theme) {
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

  decrementScale() {
    this.scale--;
    this.applyScale();
  }

  incrementScale() {
    this.scale++;
    this.applyScale();
  }

  applyScale() {
    document.documentElement.style.fontSize = this.scale + 'px';
  }
}
