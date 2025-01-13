import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MenuService } from '@services';
import { MenuItem } from 'primeng/api';
import { filter, Observable, Subscription } from 'rxjs';
import { ProcessOrientedStructureService } from 'src/app/services/process-oriented-structure.service';

@Component({
  selector: 'app-process-oriented-structures',
  templateUrl: './process-oriented-structures.component.html',
  styleUrls: ['./process-oriented-structures.component.scss']
})
export class ProcessOrientedStructuresComponent implements OnInit, OnDestroy {
  items: any[] | undefined;
  activeItem: any | undefined;
  activeItem$: Observable<number>

  activeItemSubscription: Subscription;
  routeSubscription: Subscription;

 constructor(
    public menuService: MenuService,
    private router: Router,
    private route: ActivatedRoute,
    private processOrientedStructureService: ProcessOrientedStructureService
  ) {}

  ngOnInit() {
    this.items = [
      { label: 'Gestión operativa', icon: 'pi pi-list', path: 'operationals-managements' },
      { label: 'Organigrama', icon: 'pi pi-sitemap', path: 'organizational-charts' }
    ];
  
    this.activeItemSubscription = this.processOrientedStructureService.activeItem$.subscribe(e => {
      this.handleActiveItemChange(e);
    });
  
    this.routeSubscription = this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      if(event.urlAfterRedirects == '/configurations/process-oriented-structures'){
        this.handleActiveItemChange(this.activeItem);
      }
    });
  }
  
  private handleActiveItemChange(e: any) {
    this.activeItem = this.items.find(obj => obj.label == e?.label);
    if (this.activeItem) {
      this.router.navigate([this.activeItem.path], { relativeTo: this.route, skipLocationChange: true });
    } else {
      this.processOrientedStructureService.setActiveItem(this.items[0]);
    }
  }
  
  ngOnDestroy(): void {
    this.activeItemSubscription?.unsubscribe();
    this.routeSubscription?.unsubscribe();
  }

  onActiveItemChange(event: MenuItem) {
    this.processOrientedStructureService.setActiveItem(event);
  }
}
