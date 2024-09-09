import {Component, OnInit} from '@angular/core';
import {PrimeNGConfig} from 'primeng/api';
import {LayoutService, SentryInitService} from "@services";
import {StorageService, ThemeService, UrlService} from "@services";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  typeConfigList: string[] = ['menuMode', 'scale', 'ripple', 'inputStyle'];

  constructor(
    private primengConfig: PrimeNGConfig,
    public layoutService: LayoutService,
    private storageService: StorageService,
    private themeService: ThemeService,
    private urlService: UrlService,
    private sentryInitService: SentryInitService) {
    this.themeService.getThemeLocalStorage();
  }

  ngOnInit() {
    //this.sentryInitService.initSentry();// Inicialización de Sentry
    this.primengConfig.ripple = true;
    this.initConfig();
    this.urlService.initialize();
  }

  get scale(): number {
    return this.layoutService.config.scale;
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
  }

  applyScale() {
    document.documentElement.style.fontSize = this.scale + 'px';
  }

}
