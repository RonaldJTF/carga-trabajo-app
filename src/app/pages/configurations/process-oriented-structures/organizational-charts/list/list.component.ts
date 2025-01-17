import {Component, OnInit} from '@angular/core';
import {IMAGE_SIZE, Methods} from "@utils";
import {MESSAGE} from "@labels/labels";
import {Store} from "@ngrx/store";
import {AppState} from "../../../../../app.reducers";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthenticationService, CryptojsService, OrganizationChartService} from "@services";
import {Observable} from "rxjs";
import {OrganizationChart} from "@models";
import {MenuItem, MenuItemCommandEvent, TreeNode} from "primeng/api";
import {an} from "@fullcalendar/core/internal-common";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  protected readonly IMAGE_SIZE = IMAGE_SIZE;
  protected readonly MESSAGE = MESSAGE;

  loading: boolean = false;

  isAdmin: boolean;

  oganizationalManagements$: any;

  organizationChart$: Observable<OrganizationChart>;

  organizationalCharts: OrganizationChart[];

  dataset: TreeNode[];

  menuItems: MenuItem[] = [];

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private organizationChartService: OrganizationChartService,
    private cryptoService: CryptojsService,
  ) {
  }

  ngOnInit() {
    this.getRol();
    this.getOrganizationChart();

    this.menuItems = [
      {label: 'Editar', icon: 'pi pi-pencil', visible: this.isAdmin, command: (e) => this.onGoUpdate(e.item.id, e.originalEvent)},
      {label: 'Eliminar', icon: 'pi pi-trash', visible: this.isAdmin, command: (e) => this.onDelete(e)},
      {label: 'Agregar dependencia', icon: 'pi pi-sitemap', visible: this.isAdmin, command: (e) => this.onGoCreateDependency(e)},
    ]
  }

  getRol() {
    const {isAdministrator} = this.authService.roles();
    this.isAdmin = isAdministrator;
  }

  getOrganizationChart() {
    this.organizationChartService.getOrganizationalCharts().subscribe({
      next: (resp) => {
        this.organizationalCharts = resp;
      }
    });
  }

  buildNodes(organizationCharts: OrganizationChart[]): TreeNode<OrganizationChart>[] {
    if (!organizationCharts) {
      return [];
    }
    return organizationCharts.map(structure => ({
      expanded: true,
      data: structure,
      type: 'person',
      styleClass: 'border-round bg-blue-100',
      children: []
    }));
  }

  toggleIcon(show: boolean, element: HTMLSpanElement) {
    element.style.display = show ? 'block' : 'none';
  }

  onDelete(event: any) {
    console.log("Eliminado")
  }

  onGoUpdate(id: any, event: Event) {
    this.router.navigate(['create/', this.cryptoService.encryptParam(id)], {
      relativeTo: this.route,
      skipLocationChange: true,
    }).then();
  }

  openNew() {
    this.router.navigate(['create'], {
      relativeTo: this.route,
      skipLocationChange: true
    }).then();
  }

  onGoCreateDependency(event: MenuItemCommandEvent) {
    this.router.navigate(['dependency'], {
      relativeTo: this.route,
      skipLocationChange: true,
    }).then();
  }


  viewOrganizationChart(organizationChart: OrganizationChart) {
    this.dataset = null;
    this.organizationChartService.getHierarchyByIdOrganizationChart(organizationChart.id).subscribe({
      next: (resp) => {
        console.log(resp)
        //this.dataset = this.buildNodes(resp);
      }
    })
  }

  listOrganizationChart(){
    this.dataset = null;
  }
}
