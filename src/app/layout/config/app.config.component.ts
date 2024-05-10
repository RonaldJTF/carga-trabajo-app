import {Component, Input} from '@angular/core';
import {LayoutService} from '../service/app.layout.service';
import {MenuService} from '../app.menu.service';
import {StorageService} from '../../services/storage.service';

@Component({
  selector: 'app-config',
  templateUrl: './app.config.component.html',
})
export class AppConfigComponent {
  @Input() minimal: boolean = false;

  scales: number[] = [12, 13, 14, 15, 16];

  constructor(
    public layoutService: LayoutService,
    private storageService: StorageService
  ) {
  }

  ngOnInit() {
    this.getThemeLocalStorage();
  }

  get visible(): boolean {
    return this.layoutService.state.configSidebarVisible;
  }

  set visible(_val: boolean) {
    this.layoutService.state.configSidebarVisible = _val;
  }

  get scale(): number {
    return this.layoutService.config.scale;
  }

  set scale(_val: number) {
    this.layoutService.config.scale = _val;
  }

  get menuMode(): string {
    return this.layoutService.config.menuMode;
  }

  set menuMode(_val: string) {
    this.layoutService.config.menuMode = _val;
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
